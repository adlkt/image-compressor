"use client";

import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { compressionRatio, formatDelta, formatSize } from "@/lib/format";
import { sourceAlreadyMetTarget } from "@/lib/target-size";
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

  /*
    目标状态全屏只在这里报一次，而且分三态。
    原图本来就低于目标时（「先压一下试试」是最常见的用法），
    达标是原图的事实、不是这次压缩的成果——把它说成「已达到大小目标」
    再配一个绿勾，等于把功劳记在没做事的操作上。
  */
  const targetStatus =
    selected.targetMet === null
      ? null
      : sourceAlreadyMetTarget(selected.file.size, selected.targetBytes)
        ? { text: t.controls.targetAlreadyMet, tone: "text-muted-foreground" }
        : selected.targetMet
          ? { text: t.controls.targetMet, tone: "text-success" }
          : { text: t.controls.targetMissed, tone: "text-destructive" };

  const panel = (kind: "original" | "compressed") => {
    const isOriginal = kind === "original";
    const url = isOriginal ? selected.originalUrl : selected.compressedUrl;
    const width = isOriginal ? selected.originalWidth : outputWidth;
    const height = isOriginal ? selected.originalHeight : outputHeight;

    return (
      <article
        className={`${mobileView === kind ? "flex" : "hidden"} min-h-0 flex-col lg:flex`}
      >
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
          <span className="flex items-baseline gap-2">
            <span className="text-sm leading-[1.4] font-semibold">
              {isOriginal ? t.controls.original : t.controls.compressed}
            </span>
            {width > 0 && (
              <span data-numeric className="text-xs text-muted-foreground">
                {width} × {height}
              </span>
            )}
          </span>
        </header>

        <div className="canvas-stage flex h-60 items-center justify-center p-4 lg:h-auto lg:min-h-0 lg:flex-1">
          {url ? (
            <img
              src={url}
              alt={
                isOriginal
                  ? selected.file.name
                  : `${selected.file.name} ${t.controls.compressed}`
              }
              className="canvas-plate max-h-full max-w-full rounded-sm object-contain p-4"
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
    <section className="order-2 flex min-h-0 flex-col" aria-label={selected.file.name}>
      <div className="flex min-h-14 flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-card px-3 py-2">
        <span className="flex items-baseline gap-2">
          <span className="panel-label">{t.controls.original}</span>
          <strong data-numeric className="text-sm font-semibold">
            {formatSize(selected.file.size)}
          </strong>
        </span>
        <span aria-hidden="true" className="text-muted-foreground">→</span>
        <span className="flex items-baseline gap-2">
          <span className="panel-label">{t.controls.compressed}</span>
          <strong data-numeric className="text-sm font-semibold">
            {selected.compressedSize ? formatSize(selected.compressedSize) : "—"}
          </strong>
        </span>
        {ratio !== null && (
          <strong
            data-numeric
            className={`text-sm font-semibold ${ratio >= 0 ? "text-success" : "text-destructive"}`}
          >
            {formatDelta(ratio)}
          </strong>
        )}
        {targetStatus && (
          <span
            role="status"
            aria-live="polite"
            className={`ml-auto text-xs font-medium ${targetStatus.tone}`}
          >
            {targetStatus.text}
          </span>
        )}
      </div>

      <div className="flex h-12 shrink-0 items-center border-b border-border px-3 lg:hidden">
        <div className="flex gap-1 rounded-sm bg-secondary p-1">
          {(["original", "compressed"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              aria-pressed={mobileView === kind}
              onClick={() => setMobileView(kind)}
              className={`min-h-11 px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 ${
                mobileView === kind
                  ? "rounded-[7px] bg-card text-primary shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {kind === "original" ? t.controls.original : t.controls.compressed}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-2 lg:divide-x lg:divide-border">
        {panel("original")}
        {panel("compressed")}
      </div>
    </section>
  );
}
