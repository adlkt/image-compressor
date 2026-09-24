"use client";

import { AlertTriangle, Check, Loader2, Plus, X } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { isSupportedImageInput } from "@/lib/image-input";
import { compressionRatio, formatDelta, formatSize } from "@/lib/format";
import { batchDomain } from "@/lib/scale";
import { useI18n } from "@/i18n";
import { RangeGauge } from "./range-gauge";

/**
 * 批处理清单。
 *
 * 每一行都是一帧：帧号、缩略图、名称，以及这一帧自己的读数。
 * 整批共用一把尺（`batchDomain`）——一列尺子对齐之后，压缩情况可以被扫视比较，
 * 而不是变成一堆各自量程、各自为政的卡片。
 */
export function FileQueue() {
  const { files, selectedId, selectFile, removeFile, addFiles, compressImageFile } =
    useCompressor();
  const { t } = useI18n();

  const domain = batchDomain(
    files.map((file) => ({
      original: file.file.size,
      compressed: file.compressedSize,
      target: file.targetBytes,
    })),
  );

  return (
    <section
      className="flex max-h-56 min-h-0 flex-col border-b border-border lg:max-h-none lg:border-b-0 lg:border-r"
      aria-label={t.controls.files}
    >
      <header className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <span data-silk className="panel-label">
          {files.length} {t.controls.files}
        </span>
        <label
          htmlFor="file-input-queue"
          className="flex min-h-8 cursor-pointer items-center gap-1 rounded-[3px] px-2 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-within:ring-2 focus-within:ring-ring/40"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          {t.controls.add}
        </label>
        <input
          id="file-input-queue"
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          className="sr-only"
          onChange={(event) => {
            addFiles(
              Array.from(event.target.files ?? []).filter(isSupportedImageInput),
            );
            event.target.value = "";
          }}
        />
      </header>

      <ol className="min-h-0 flex-1 overflow-y-auto">
        {files.map((file, index) => {
          const isSelected = file.id === selectedId;
          const hasError = !!file.error;
          const ratio = compressionRatio(file.file.size, file.compressedSize);

          return (
            <li key={file.id} className="group relative border-b border-border">
              <button
                type="button"
                onClick={() =>
                  hasError ? compressImageFile(file.id) : selectFile(file.id)
                }
                aria-pressed={isSelected}
                aria-label={
                  hasError ? `${t.controls.retry} ${file.file.name}` : file.file.name
                }
                className={`flex w-full items-start gap-2.5 py-2 pr-7 pl-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${
                  // 选中不由底色承担：底色留给 hover，选中靠左边线与帧号。
                  // 填色会把「当前项」和「可点区域」搅在一起。
                  isSelected ? "" : "hover:bg-accent/40"
                }`}
              >
                {/* 活动项：1px 信号色边线 + 帧号跟着变色，不是一条彩色侧条 */}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 left-0 w-px bg-primary transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                />

                <span
                  data-numeric
                  className={`w-4 shrink-0 pt-0.5 text-[10px] leading-4 transition-colors ${
                    isSelected ? "text-signal" : "text-muted-foreground"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="relative size-8 shrink-0 overflow-hidden rounded-[2px] border border-border bg-muted">
                  <img src={file.originalUrl} alt="" className="size-full object-cover" />
                  {file.compressing && (
                    <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                      <span className="sr-only">{t.controls.compressing}</span>
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {file.file.name}
                    </span>
                    <span
                      data-numeric
                      className="shrink-0 text-[11px] leading-4 text-muted-foreground"
                    >
                      {formatSize(file.file.size)}
                    </span>
                  </span>

                  {hasError ? (
                    <span className="mt-1 block truncate text-[11px] text-destructive">
                      {t.controls.retry}
                    </span>
                  ) : (
                    <span className="mt-1.5 flex items-center gap-2">
                      <RangeGauge
                        variant="row"
                        original={file.file.size}
                        compressed={file.compressedSize}
                        target={file.targetBytes}
                        targetMet={file.targetMet}
                        domain={domain}
                        className="min-w-0 flex-1"
                      />
                      {ratio !== null && (
                        <span
                          data-numeric
                          className={`shrink-0 text-[11px] leading-4 ${
                            ratio >= 0 ? "text-signal" : "text-destructive"
                          }`}
                        >
                          {formatDelta(ratio)}
                        </span>
                      )}
                      {!file.compressing && file.compressedBlob && (
                        <span className="shrink-0" aria-hidden="true">
                          {file.targetMet === false ? (
                            <AlertTriangle className="size-3 text-destructive" />
                          ) : (
                            <Check className="size-3 text-signal" />
                          )}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded-[3px] text-muted-foreground opacity-0 outline-none transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-60"
                aria-label={`${t.controls.remove} ${file.file.name}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
