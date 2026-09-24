"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { compressionRatio, formatDelta, formatSize } from "@/lib/format";
import { useI18n } from "@/i18n";

/**
 * 画面对照。
 *
 * 原图与结果并排，中间只有一条刻线。两边各自报自己的尺寸，
 * 差值只出现在结果的表头里——不在图上叠任何东西。
 */
export function PreviewPanel() {
  const { files, selectedId } = useCompressor();
  const { t } = useI18n();
  const [mobileView, setMobileView] = useState<"original" | "compressed">(
    "compressed",
  );
  const selected = files.find((file) => file.id === selectedId) ?? files[0];
  if (!selected) return null;

  const ratio = compressionRatio(selected.file.size, selected.compressedSize);
  const outputWidth =
    selected.maxWidth > 0
      ? Math.min(selected.originalWidth, selected.maxWidth)
      : selected.originalWidth;
  const outputHeight =
    selected.originalWidth > 0
      ? Math.round((selected.originalHeight * outputWidth) / selected.originalWidth)
      : selected.originalHeight;

  const panel = (kind: "original" | "compressed") => {
    const isOriginal = kind === "original";
    const url = isOriginal ? selected.originalUrl : selected.compressedUrl;
    const size = isOriginal ? selected.file.size : selected.compressedSize;
    const width = isOriginal ? selected.originalWidth : outputWidth;
    const height = isOriginal ? selected.originalHeight : outputHeight;

    return (
      <article
        className={`${mobileView === kind ? "flex" : "hidden"} min-h-0 flex-col lg:flex`}
      >
        <header className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
          <span className="flex items-baseline gap-2">
            <span data-silk className="text-xs font-medium">
              {isOriginal ? t.controls.original : t.controls.compressed}
            </span>
            {width > 0 && (
              <span data-numeric className="text-[11px] text-muted-foreground">
                {width} × {height}
              </span>
            )}
          </span>
          <span className="flex items-baseline gap-2">
            <span data-numeric className="text-xs text-muted-foreground">
              {size ? formatSize(size) : "—"}
            </span>
            {!isOriginal && ratio !== null && (
              <span
                data-numeric
                className={`text-[11px] font-medium ${
                  ratio >= 0 ? "text-signal" : "text-destructive"
                }`}
              >
                {formatDelta(ratio)}
              </span>
            )}
          </span>
        </header>

        <div className="canvas-grid flex h-72 items-center justify-center p-4 lg:h-auto lg:min-h-0 lg:flex-1">
          {url ? (
            <img
              src={url}
              alt={
                isOriginal
                  ? selected.file.name
                  : `${selected.file.name} ${t.controls.compressed}`
              }
              className="max-h-full max-w-full rounded-[2px] object-contain"
            />
          ) : selected.compressing && !isOriginal ? (
            <div className="flex flex-col items-center gap-2" aria-live="polite">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">
                {t.controls.compressing}
              </span>
            </div>
          ) : (
            <ImageIcon className="size-7 text-muted-foreground/50" aria-hidden="true" />
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="flex min-h-0 flex-col" aria-label={selected.file.name}>
      <div className="flex h-10 shrink-0 items-center border-b border-border px-3 lg:hidden">
        <div className="flex divide-x divide-border border border-border">
          {(["original", "compressed"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              aria-pressed={mobileView === kind}
              onClick={() => setMobileView(kind)}
              className={`min-h-8 px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 ${
                mobileView === kind
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {kind === "original" ? t.controls.original : t.controls.compressed}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-px bg-border lg:grid-cols-2">
        {panel("original")}
        {panel("compressed")}
      </div>
    </section>
  );
}
