"use client";

import { AlertTriangle, Check, Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCompressor, type ImageFile } from "@/lib/store";
import { isSupportedImageInput } from "@/lib/image-input";
import { formatSize } from "@/lib/format";
import { batchDomain } from "@/lib/scale";
import { sourceAlreadyMetTarget } from "@/lib/target-size";
import { useI18n } from "@/i18n";
import { SizeBar } from "./size-bar";

const REJECT_CLEAR_MS = 4000;

/**
 * 批处理清单。
 *
 * 整批共用一个尺度（`batchDomain`）：只有共用一个域，行与行之间的体积
 * 对比条才能横向比较，而不是各行一套、看起来都对。
 *
 * 行首是缩略图，不是序号——文件行不是步骤序列，编号不承载任何信息。
 */
export function FileQueue() {
  const { files, selectedId, selectFile, removeFile, addFiles, compressImageFile } =
    useCompressor();
  const { t } = useI18n();
  const [rejected, setRejected] = useState(0);
  const rejectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rejectTimer.current !== null) window.clearTimeout(rejectTimer.current);
    };
  }, []);

  const accept = (list: FileList | null) => {
    const incoming = Array.from(list ?? []);
    const images = incoming.filter(isSupportedImageInput);
    const skipped = incoming.length - images.length;

    if (skipped > 0) {
      setRejected(skipped);
      if (rejectTimer.current !== null) window.clearTimeout(rejectTimer.current);
      rejectTimer.current = window.setTimeout(() => setRejected(0), REJECT_CLEAR_MS);
    } else {
      setRejected(0);
    }

    addFiles(images);
  };

  const domain = batchDomain(
    files.map((file) => ({
      original: file.file.size,
      compressed: file.compressedSize,
      target: file.targetBytes,
    })),
  );

  return (
    <section
      className="order-1 flex max-h-64 min-h-0 flex-col border-b border-border bg-card xl:max-h-none xl:border-b-0 xl:border-r"
      aria-label={t.controls.files}
    >
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <span className="text-sm leading-[1.4] font-semibold">
          <span data-numeric>{files.length}</span> {t.controls.files}
        </span>
        <span
          className="relative flex min-h-11 items-center gap-2 overflow-hidden rounded-sm px-2 text-xs font-medium text-primary transition-colors hover:bg-secondary focus-within:ring-2 focus-within:ring-ring/40"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t.controls.add}
          <input
            id="file-input-queue"
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            aria-label={t.controls.add}
            className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
            onChange={(event) => {
              accept(event.target.files);
              event.target.value = "";
            }}
          />
        </span>
      </header>

      {rejected > 0 && (
        <p role="status" className="border-b border-border px-3 py-2 text-xs text-destructive">
          {t.dropzone.rejected.replace("{n}", String(rejected))}
        </p>
      )}

      <ol className="min-h-0 flex-1 overflow-y-auto">
        {files.map((file) => {
          const isSelected = file.id === selectedId;
          const hasError = !!file.error;

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
                className={`flex w-full items-start gap-3 py-3 pr-14 pl-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${
                  isSelected
                    ? "bg-muted shadow-[inset_0_0_0_1px_var(--border)]"
                    : "hover:bg-muted/60"
                }`}
              >
                {/* 行首是缩略图：文件行不是步骤序列，序号不承载信息 */}
                <span className="relative size-8 shrink-0 overflow-hidden rounded-sm border border-border bg-muted">
                  <img src={file.originalUrl} alt="" className="size-full object-cover" />
                  {file.compressing && (
                    <span className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      <span className="sr-only">{t.controls.compressing}</span>
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    {/* 超长文件名折两行，不截断——左栏 19rem 下截断会把中文名只留前十来个字 */}
                    <span className="line-clamp-2 min-w-0 flex-1 break-words text-xs font-medium">
                      {file.file.name}
                    </span>
                    <span
                      data-numeric
                      className="shrink-0 text-xs leading-[1.5] text-muted-foreground"
                    >
                      {formatSize(file.file.size)}
                    </span>
                  </span>

                  {hasError ? (
                    <span className="mt-2 block truncate text-xs text-destructive">
                      {t.controls.retry}
                    </span>
                  ) : (
                    <span className="mt-2 flex items-center gap-3">
                      <SizeBar
                        original={file.file.size}
                        compressed={file.compressedSize}
                        targetMet={file.targetMet}
                        domain={domain}
                        className="min-w-0 flex-1"
                      />
                      {!file.compressing &&
                        file.compressedBlob &&
                        file.targetMet !== null && (
                          <span className="shrink-0" aria-hidden="true">
                            <RowStatusGlyph file={file} />
                          </span>
                        )}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground opacity-0 outline-none transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-60"
                aria-label={`${t.controls.remove} ${file.file.name}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * 行状态字形（调用方保证 targetMet 不为 null）。
 *
 * 绿勾报告的是「这次压缩达成了目标」：原图本来就低于目标时没有目标可达成，
 * 勾退成中性；压根没设目标的行连字形都不画——没有目标就没有目标的结果。
 */
function RowStatusGlyph({ file }: { file: ImageFile }) {
  if (file.targetMet === false) {
    return <AlertTriangle className="size-4 text-destructive" />;
  }
  if (sourceAlreadyMetTarget(file.file.size, file.targetBytes)) {
    return <Check className="size-4 text-muted-foreground" />;
  }
  return <Check className="size-4 text-success" />;
}
