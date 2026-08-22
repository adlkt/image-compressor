import { create } from "zustand";
import type { CompressResponse } from "./compress-protocol";

export type Format = "webp" | "jpeg" | "avif" | "png";

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
  selectedFile: ImageFile | null;

  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  selectFile: (id: string) => void;
  setImageFormat: (id: string, format: Format) => void;
  setImageQuality: (id: string, quality: number) => void;
  setImageMaxWidth: (id: string, maxWidth: number) => void;
  compressImageFile: (id: string) => void;
  compressAll: () => void;
};

const DEFAULTS_KEY = "image-compressor:defaults";

type StoredDefaults = Partial<
  Pick<State, "defaultFormat" | "defaultQuality" | "defaultMaxWidth">
>;

function loadDefaults(): StoredDefaults {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DEFAULTS_KEY);
    return raw ? (JSON.parse(raw) as StoredDefaults) : {};
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

const storedDefaults = loadDefaults();

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
          return {
            ...f,
            compressedBlob: event.data.blob,
            compressedUrl: url,
            compressedSize: event.data.blob.size,
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
  defaultFormat: storedDefaults.defaultFormat ?? "jpeg",
  defaultQuality: storedDefaults.defaultQuality ?? 80,
  defaultMaxWidth: storedDefaults.defaultMaxWidth ?? 1920,
  selectedFile: null,

  addFiles: (newFiles: File[]) => {
    const { defaultFormat, defaultQuality, defaultMaxWidth, files: existing } = get();

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
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth });
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
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth });
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
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    const { defaultFormat, defaultQuality, defaultMaxWidth } = get();
    saveDefaults({ defaultFormat, defaultQuality, defaultMaxWidth });
    get().compressImageFile(id);
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
