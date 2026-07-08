import { create } from "zustand";
import { compressImage } from "./compression";

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
  compressImageFile: (id: string) => Promise<void>;
  compressAll: () => Promise<void>;
};

export const useCompressor = create<State>((set, get) => ({
  files: [],
  selectedId: null,
  defaultFormat: "webp",
  defaultQuality: 80,
  defaultMaxWidth: 1920,
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

    setTimeout(() => {
      get().compressAll();
    }, 100);
  },

  removeFile: (id: string) => {
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
    set((s) => {
      const files = s.files.map((f) =>
        f.id === id ? { ...f, format } : f,
      );
      return {
        files,
        defaultFormat: format,
        selectedFile: files.find((f) => f.id === s.selectedId) ?? null,
      };
    });
    get().compressImageFile(id);
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
    get().compressImageFile(id);
  },

  setImageMaxWidth: (id: string, maxWidth: number) => {
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
    get().compressImageFile(id);
  },

  compressImageFile: async (id: string) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;

    set((s) => ({
      files: s.files.map((f) =>
        f.id === id ? { ...f, compressing: true } : f,
      ),
    }));

    try {
      const blob = await compressImage(
        file.file,
        file.format,
        file.quality,
        file.maxWidth,
      );
      const url = URL.createObjectURL(blob);

      set((s) => {
        const selectedFile = s.files.find((f) => f.id === s.selectedId) ?? null;
        return {
          files: s.files.map((f) =>
            f.id === id
              ? {
                  ...f,
                  compressedBlob: blob,
                  compressedUrl: url,
                  compressedSize: blob.size,
                  compressing: false,
                }
              : f,
          ),
          selectedFile: selectedFile?.id === id
            ? { ...selectedFile, compressedBlob: blob, compressedUrl: url, compressedSize: blob.size, compressing: false }
            : selectedFile,
        };
      });
    } catch {
      set((s) => ({
        files: s.files.map((f) =>
          f.id === id ? { ...f, compressing: false } : f,
        ),
      }));
    }
  },

  compressAll: async () => {
    const { files } = get();

    set((s) => ({
      files: s.files.map((f) => ({ ...f, compressing: true })),
    }));

    const results = await Promise.allSettled(
      files.map(async (f) => {
        const blob = await compressImage(f.file, f.format, f.quality, f.maxWidth);
        const url = URL.createObjectURL(blob);
        return { id: f.id, blob, url, size: blob.size };
      }),
    );

    set((s) => ({
      files: s.files.map((f) => {
        const result = results.find(
          (r) => r.status === "fulfilled" && r.value.id === f.id,
        );
        if (result && result.status === "fulfilled") {
          if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
          return {
            ...f,
            compressedBlob: result.value.blob,
            compressedUrl: result.value.url,
            compressedSize: result.value.size,
            compressing: false,
          };
        }
        return { ...f, compressing: false };
      }),
    }));
  },
}));
