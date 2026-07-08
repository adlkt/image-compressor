"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function PreviewPanel() {
  const { files, selectedId } = useCompressor();
  const { t } = useI18n();
  const [mobileView, setMobileView] = useState<"original" | "compressed">(
    "compressed",
  );
  const selected = files.find((file) => file.id === selectedId) ?? files[0];
  if (!selected) return null;

  const ratio = selected.compressedSize
    ? Math.round((1 - selected.compressedSize / selected.file.size) * 100)
    : null;

  const panel = (kind: "original" | "compressed") => {
    const isOriginal = kind === "original";
    const url = isOriginal ? selected.originalUrl : selected.compressedUrl;
    const size = isOriginal ? selected.file.size : selected.compressedSize;

    return (
      <article
        className={`${mobileView === kind ? "block" : "hidden"} overflow-hidden rounded-2xl border bg-card shadow-sm md:block`}
      >
        <header className="flex min-h-14 items-center justify-between gap-3 border-b px-4 py-2">
          <div>
            <p className="text-xs font-semibold">
              {isOriginal ? t.controls.original : t.controls.compressed}
            </p>
            {isOriginal && selected.originalWidth > 0 && (
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {selected.originalWidth} × {selected.originalHeight}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span>{size ? formatSize(size) : "—"}</span>
            {!isOriginal && ratio !== null && (
              <span
                className={`rounded-full px-2 py-1 font-semibold ${ratio >= 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}
              >
                {ratio >= 0 ? `-${ratio}%` : `+${Math.abs(ratio)}%`}
              </span>
            )}
          </div>
        </header>

        <div className="workspace-canvas flex min-h-[340px] items-center justify-center p-5 sm:min-h-[460px] sm:p-8">
          {url ? (
            <img
              src={url}
              alt={
                isOriginal
                  ? selected.file.name
                  : `${selected.file.name} ${t.controls.compressed}`
              }
              className="max-h-[560px] max-w-full rounded object-contain shadow-[0_16px_45px_-25px_rgba(0,0,0,0.5)]"
            />
          ) : selected.compressing && !isOriginal ? (
            <div
              className="flex flex-col items-center gap-3 text-muted-foreground"
              aria-live="polite"
            >
              <Loader2 className="size-6 animate-spin" />
              <span className="text-xs">{t.controls.compressing}…</span>
            </div>
          ) : (
            <ImageIcon className="size-8 text-muted-foreground/40" />
          )}
        </div>
      </article>
    );
  };

  return (
    <section aria-label={selected.file.name}>
      <div className="mb-3 flex rounded-xl bg-muted p-1 md:hidden">
        {(["original", "compressed"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setMobileView(kind)}
            className={`min-h-10 flex-1 rounded-lg px-3 text-xs font-medium transition-colors ${mobileView === kind ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            {kind === "original" ? t.controls.original : t.controls.compressed}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {panel("original")}
        {panel("compressed")}
      </div>
    </section>
  );
}
