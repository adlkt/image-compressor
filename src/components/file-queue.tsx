"use client";

import { AlertTriangle, Check, Loader2, Plus, X } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileQueue() {
  const { files, selectedId, selectFile, removeFile, addFiles, compressImageFile } =
    useCompressor();
  const { t } = useI18n();

  const handleThumbClick = (id: string, hasError: boolean) => {
    if (hasError) {
      compressImageFile(id);
    } else {
      selectFile(id);
    }
  };

  return (
    <section
      className="rounded-2xl border bg-card p-3 shadow-sm"
      aria-label={t.controls.files}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-medium text-muted-foreground">
          {files.length} {t.controls.files}
        </p>
        <label
          htmlFor="file-input-queue"
          className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" />
          {t.controls.add}
        </label>
        <input
          id="file-input-queue"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(
              Array.from(event.target.files ?? []).filter((file) =>
                file.type.startsWith("image/"),
              ),
            );
            event.target.value = "";
          }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {files.map((file) => {
          const isSelected = file.id === selectedId;
          const hasError = !!file.error;
          const ratio = file.compressedSize
            ? Math.round((1 - file.compressedSize / file.file.size) * 100)
            : null;

          return (
            <div
              key={file.id}
              className={`group relative w-36 shrink-0 overflow-hidden rounded-xl border transition-colors ${
                isSelected
                  ? "border-foreground bg-accent/70"
                  : hasError
                    ? "border-red-500/50 hover:bg-accent/40"
                    : "border-border hover:bg-accent/40"
              }`}
            >
              <button
                type="button"
                onClick={() => handleThumbClick(file.id, hasError)}
                className="block w-full p-2 text-left"
                aria-pressed={isSelected}
                aria-label={
                  hasError ? `${t.controls.retry} ${file.file.name}` : file.file.name
                }
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  <img
                    src={file.originalUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                  {file.compressing && (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-background/70"
                      aria-live="polite"
                    >
                      <Loader2 className="size-4 animate-spin" />
                      <span className="sr-only">{t.controls.compressing}</span>
                    </span>
                  )}
                  {hasError && (
                    <span className="absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-white">
                      <AlertTriangle className="size-3" />
                    </span>
                  )}
                  {file.compressedBlob && !file.compressing && !hasError && (
                    <span className="absolute bottom-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                </span>
                {hasError && (
                  <span className="mt-2 block line-clamp-2 text-[10px] leading-tight text-red-600 dark:text-red-400">
                    {file.error}
                  </span>
                )}
                <span className="mt-2 block truncate text-xs font-medium">
                  {file.file.name}
                </span>
                <span className="mt-1 flex gap-1.5 font-mono text-[10px] text-muted-foreground">
                  {formatSize(file.file.size)}
                  {ratio !== null && !hasError && (
                    <span
                      className={
                        ratio >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {ratio >= 0 ? `-${ratio}%` : `+${Math.abs(ratio)}%`}
                    </span>
                  )}
                  {hasError && (
                    <span className="text-red-600 dark:text-red-400">
                      {t.controls.retry}
                    </span>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-100 shadow-sm transition hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`${t.controls.remove} ${file.file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
