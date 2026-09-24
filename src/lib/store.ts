import { create } from "zustand";
import type { CompressResponse } from "./compress-protocol";

export type Format = "webp" | "jpeg" | "png";
export type RecipeId = "web" | "social" | "ecommerce" | "quality" | "custom";

type PresetId = Exclude<RecipeId, "custom">;

export const DELIVERY_RECIPES: Record<PresetId, {
  format: Format;
  quality: number;
  maxWidth: number;
  targetBytes: number | null;
}> = {
  web: { format: "webp", quality: 80, maxWidth: 1920, targetBytes: 500 * 1024 },
  social: { format: "jpeg", quality: 85, maxWidth: 1200, targetBytes: 1024 * 1024 },
  ecommerce: { format: "webp", quality: 85, maxWidth: 2048, targetBytes: 800 * 1024 },
  quality: { format: "webp", quality: 95, maxWidth: 0, targetBytes: null },
};

/**
 * 参数与某一档完全一致时返回那一档。
 * 没有它，刷新后档位灯会全灭，而参数其实还是那一档的。
 */
export function matchRecipe(
  format: Format,
  quality: number,
  maxWidth: number,
  targetBytes: number | null,
): RecipeId {
  const found = (Object.keys(DELIVERY_RECIPES) as PresetId[]).find((id) => {
    const recipe = DELIVERY_RECIPES[id];
    return (
      recipe.format === format &&
      recipe.quality === quality &&
      recipe.maxWidth === maxWidth &&
      recipe.targetBytes === targetBytes
    );
  });
  return found ?? "custom";
}

export type ImageFile = {
  id: string;
  file: File;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  compressedSize: number | null;
  format: Format;
  quality: number;
  maxWidth: number;
  targetBytes: number | null;
  outputQuality: number | null;
  targetMet: boolean | null;
  compressing: boolean;
  error: string | null;
};

let idCounter = 0;
function nextId() {
  return `img-${++idCounter}-${Date.now()}`;
}

type State = {
  files: ImageFile[];
  selectedId: string | null;
  defaultFormat: Format;
  defaultQuality: number;
  defaultMaxWidth: number;
  defaultTargetBytes: number | null;
  activeRecipeId: RecipeId;
  selectedFile: ImageFile | null;

  addFiles: (files: File[]) => void;
  hydrateDefaults: () => void;
  removeFile: (id: string) => void;
  selectFile: (id: string) => void;
  setImageFormat: (id: string, format: Format) => void;
  setImageQuality: (id: string, quality: number) => void;
  setImageMaxWidth: (id: string, maxWidth: number) => void;
  setImageTargetBytes: (id: string, targetBytes: number | null) => void;
  applyRecipe: (recipeId: Exclude<RecipeId, "custom">) => void;
  compressImageFile: (id: string) => void;
  compressAll: () => void;
};

const DEFAULTS_KEY = "image-compressor:defaults";

/**
 * 首屏默认档位落在「Web 优化」上。
 * 一打开就是一台已经调好的机器：尺子上有目标线可看，拖进来的图直接按这一档压。
 */
const WEB_PRESET = DELIVERY_RECIPES.web;

type StoredDefaults = Partial<
  Pick<State, "defaultFormat" | "defaultQuality" | "defaultMaxWidth" | "defaultTargetBytes">
>;

function loadDefaults(): StoredDefaults {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DEFAULTS_KEY);
    const value = raw ? (JSON.parse(raw) as StoredDefaults) : {};
    if (value.defaultFormat === ("avif" as Format)) value.defaultFormat = "webp";
    return value;
  } catch {
    return {};
  }
}

function saveDefaults(values: StoredDefaults) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEFAULTS_KEY, JSON.stringify(values));
  } catch {
    // ignore quota / private-mode errors
  }
}

let worker: Worker | null = null;
let requestCounter = 0;
const latestRequests = new Map<string, number>();
const qualityTimers = new Map<string, ReturnType<typeof setTimeout>>();

function clearQualityTimer(id: string) {
  const timer = qualityTimers.get(id);
  if (timer) clearTimeout(timer);
  qualityTimers.delete(id);
}

function getWorker(
  set: (partial: Partial<State> | ((state: State) => Partial<State>)) => void,
) {
  if (worker) return worker;

  worker = new Worker(new URL("./compress-worker.ts", import.meta.url));

  worker.onmessage = (event: MessageEvent<CompressResponse>) => {
    const { id, requestId } = event.data;

    if (latestRequests.get(id) !== requestId) return;
    latestRequests.delete(id);

    set((s) => {
      const files = s.files.map((f) => {
        if (f.id !== id) return f;

        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);

        if (event.data.type === "done") {
          const url = URL.createObjectURL(event.data.blob);
          if (event.data.previewBlob) URL.revokeObjectURL(f.originalUrl);
          return {
            ...f,
            originalUrl: event.data.previewBlob
              ? URL.createObjectURL(event.data.previewBlob)
              : f.originalUrl,
            originalWidth: event.data.sourceWidth,
            originalHeight: event.data.sourceHeight,
            compressedBlob: event.data.blob,
            compressedUrl: url,
            compressedSize: event.data.blob.size,
            outputQuality: event.data.outputQuality,
            targetMet: event.data.targetMet,
            compressing: false,
            error: null,
          };
        }

        return {
          ...f,
          compressing: false,
          error: event.data.reason,
          compressedBlob: null,
          compressedUrl: null,
          compressedSize: null,
        };
      });

      const selectedFile =
        s.selectedId === id ? files.find((f) => f.id === id) ?? null : s.selectedFile;

      return { files, selectedFile };
    });
  };

  return worker;
}

export const useCompressor = create<State>((set, get) => ({
  files: [],
  selectedId: null,
  defaultFormat: WEB_PRESET.format,
  defaultQuality: WEB_PRESET.quality,
  defaultMaxWidth: WEB_PRESET.maxWidth,
  defaultTargetBytes: WEB_PRESET.targetBytes,
  activeRecipeId: "web",
  selectedFile: null,

  hydrateDefaults: () => {
    const defaults = loadDefaults();
    const defaultFormat = defaults.defaultFormat ?? WEB_PRESET.format;
    const defaultQuality = defaults.defaultQuality ?? WEB_PRESET.quality;
    const defaultMaxWidth = defaults.defaultMaxWidth ?? WEB_PRESET.maxWidth;
    const defaultTargetBytes =
      defaults.defaultTargetBytes === undefined
        ? WEB_PRESET.targetBytes
        : defaults.defaultTargetBytes;
    set({
      defaultFormat,
      defaultQuality,
      defaultMaxWidth,
      defaultTargetBytes,
      activeRecipeId: matchRecipe(
        defaultFormat,
        defaultQuality,
        defaultMaxWidth,
        defaultTargetBytes,
      ),
    });
  },

  addFiles: (newFiles: File[]) => {
    const { defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes, files: existing } = get();

    const seen = new Set(existing.map((f) => `${f.file.name}-${f.file.size}`));
    const unique = newFiles.filter((f) => {
      const key = `${f.name}-${f.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (unique.length === 0) return;

    const entries: ImageFile[] = unique.map((file) => ({
      id: nextId(),
      file,
      originalUrl: URL.createObjectURL(file),
      originalWidth: 0,
      originalHeight: 0,
      compressedBlob: null,
      compressedUrl: null,
      compressedSize: null,
      format: defaultFormat,
      quality: defaultQuality,
      maxWidth: defaultMaxWidth,
      targetBytes: defaultTargetBytes,
      outputQuality: null,
      targetMet: null,
      compressing: false,
      error: null,
    }));

    const firstId = entries[0]?.id ?? null;

    set((s) => {
      const files = [...s.files, ...entries];
      const selectedId = s.selectedId ?? firstId;
      const selectedFile = files.find((f) => f.id === selectedId) ?? null;
      return { files, selectedId, selectedFile };
    });

    entries.forEach((entry) => {
      const img = new Image();
      img.onload = () => {
        set((s) => ({
          files: s.files.map((f) =>
            f.id === entry.id
              ? { ...f, originalWidth: img.naturalWidth, originalHeight: img.naturalHeight }
              : f,
          ),
        }));
      };
      img.src = entry.originalUrl;
    });

    get().compressAll();
  },

  removeFile: (id: string) => {
    clearQualityTimer(id);
    latestRequests.delete(id);
    set((s) => {
      const file = s.files.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalUrl);
        if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
      }
      const files = s.files.filter((f) => f.id !== id);
      const selectedId = s.selectedId === id ? files[0]?.id ?? null : s.selectedId;
      const selectedFile = files.find((f) => f.id === selectedId) ?? null;
      return { files, selectedId, selectedFile };
    });
  },

  selectFile: (id: string) => {
    set((s) => {
      const selectedFile = s.files.find((f) => f.id === id) ?? null;
      return { selectedId: id, selectedFile };
    });
  },

  setImageFormat: (id: string, format: Format) => {
    get().files.forEach((file) => clearQualityTimer(file.id));
    set((s) => {
      const files = s.files.map((f) => ({ ...f, format }));
      return {
        files,
        defaultFormat: format,
        activeRecipeId: "custom",
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes });
    // 格式是全局固定项：所有文件统一按新格式重新压缩
    get().files.forEach((f) => get().compressImageFile(f.id));
  },

  setImageQuality: (id: string, quality: number) => {
    set((s) => {
      const files = s.files.map((f) =>
        f.id === id ? { ...f, quality } : f,
      );
      return {
        files,
        defaultQuality: quality,
        activeRecipeId: "custom",
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes });
    clearQualityTimer(id);
    qualityTimers.set(
      id,
      setTimeout(() => {
        qualityTimers.delete(id);
        get().compressImageFile(id);
      }, 180),
    );
  },

  setImageMaxWidth: (id: string, maxWidth: number) => {
    clearQualityTimer(id);
    set((s) => {
      const files = s.files.map((f) =>
        f.id === id ? { ...f, maxWidth } : f,
      );
      return {
        files,
        defaultMaxWidth: maxWidth,
        activeRecipeId: "custom",
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes });
    get().compressImageFile(id);
  },

  setImageTargetBytes: (id, targetBytes) => {
    clearQualityTimer(id);
    set((s) => {
      const files = s.files.map((f) => f.id === id ? { ...f, targetBytes } : f);
      return {
        files,
        defaultTargetBytes: targetBytes,
        activeRecipeId: "custom",
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth, defaultTargetBytes });
    get().compressImageFile(id);
  },

  applyRecipe: (recipeId) => {
    const recipe = DELIVERY_RECIPES[recipeId];
    get().files.forEach((file) => clearQualityTimer(file.id));
    set((s) => {
      const files = s.files.map((file) => ({ ...file, ...recipe }));
      return {
        files,
        defaultFormat: recipe.format,
        defaultQuality: recipe.quality,
        defaultMaxWidth: recipe.maxWidth,
        defaultTargetBytes: recipe.targetBytes,
        activeRecipeId: recipeId,
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    saveDefaults({
      defaultFormat: recipe.format,
      defaultQuality: recipe.quality,
      defaultMaxWidth: recipe.maxWidth,
      defaultTargetBytes: recipe.targetBytes,
    });
    get().files.forEach((file) => get().compressImageFile(file.id));
  },

  compressImageFile: (id: string) => {
    clearQualityTimer(id);
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    const requestId = ++requestCounter;
    latestRequests.set(id, requestId);

    set((s) => ({
      files: s.files.map((f) =>
        f.id === id ? { ...f, compressing: true, error: null } : f,
      ),
    }));

    const w = getWorker(set);
    w.postMessage({
      type: "compress",
      id,
      requestId,
      file: file.file,
      format: file.format,
      quality: file.quality,
      maxWidth: file.maxWidth,
      targetBytes: file.targetBytes,
    });
  },

  compressAll: () => {
    const { files } = get();
    const pending = files.filter(
      (f) => !f.compressedBlob && !f.compressing && !f.error,
    );
    pending.forEach((f) => get().compressImageFile(f.id));
  },
}));
