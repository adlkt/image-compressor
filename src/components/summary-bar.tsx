"use client";

import { useState } from "react";
import { Archive, ChevronRight, Download, Loader2, Trash2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { createOutputNames, createZip } from "@/lib/export-package";
import { compressionRatio, formatDelta, formatSize } from "@/lib/format";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

/**
 * 动作栏：整批的合计与下载。
 */
export function SummaryBar() {
  const { files } = useCompressor();
  const { t } = useI18n();
  const [namingTemplate, setNamingTemplate] = useState("{name}-{n}");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  if (files.length === 0) return null;

  const completed = files.filter((file) => file.compressedBlob);
  const outputNames = createOutputNames(
    completed.map((file) => ({
      originalName: file.file.name,
      width:
        file.maxWidth > 0
          ? Math.min(file.originalWidth, file.maxWidth)
          : file.originalWidth,
      height:
        file.maxWidth > 0 && file.originalWidth > file.maxWidth
          ? Math.round((file.originalHeight * file.maxWidth) / file.originalWidth)
          : file.originalHeight,
      extension: file.format === "jpeg" ? "jpg" : file.format,
    })),
    namingTemplate,
  );

  const totalOriginal = files.reduce((sum, file) => sum + file.file.size, 0);
  const totalCompressed = files.reduce(
    (sum, file) => sum + (file.compressedSize ?? file.file.size),
    0,
  );
  const ratio = compressionRatio(totalOriginal, totalCompressed);
  const allDone = files.every(
    (file) => file.compressedBlob !== null || file.error !== null,
  );
  const compressing = files.some((file) => file.compressing);

  const total = files.length;
  const done = files.filter((file) => file.compressedBlob || file.error).length;
  const failed = files.filter((file) => file.error).length;
  const progress = total > 0 ? done / total : 0;

  let statusLabel: string | null = null;
  if (compressing) {
    statusLabel = t.controls.processing;
  } else if (failed > 0) {
    statusLabel = t.controls.failedItems.replace("{count}", String(failed));
  } else if (allDone) {
    statusLabel = t.controls.allDone;
  }

  const downloadAll = () => {
    completed.forEach((file, index) => {
      const url = URL.createObjectURL(file.compressedBlob!);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = outputNames[index];
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  };

  const downloadZip = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      const exceptions = files.filter(
        (file) => file.error || file.targetMet === false,
      );
      const manifest = {
        version: 1,
        files: completed.map((file, index) => ({
          source: file.file.name,
          output: outputNames[index],
          bytes: file.compressedSize,
          targetBytes: file.targetBytes,
          targetMet: file.targetMet,
          quality: file.outputQuality,
        })),
      };
      const entries = completed.map((file, index) => ({
        name: outputNames[index],
        data: file.compressedBlob!,
      }));
      entries.push({
        name: "manifest.json",
        data: new Blob([JSON.stringify(manifest, null, 2)], {
          type: "application/json",
        }),
      });
      if (exceptions.length > 0) {
        entries.push({
          name: "exceptions.txt",
          data: new Blob(
            [
              exceptions
                .map(
                  (file) =>
                    `${file.file.name}\t${file.error ?? t.controls.targetMissed}`,
                )
                .join("\n"),
            ],
            { type: "text/plain;charset=utf-8" },
          ),
        });
      }
      const zip = await createZip(entries);
      const url = URL.createObjectURL(zip);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "image-delivery.zip";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : t.controls.exportError,
      );
    } finally {
      setExporting(false);
    }
  };

  const clearAll = () => {
    if (!window.confirm(t.controls.clearAllConfirm)) return;
    const { removeFile } = useCompressor.getState();
    [...files].forEach((file) => removeFile(file.id));
  };

  const multiple = files.length > 1;
  const saved = Math.max(0, totalOriginal - totalCompressed);

  // 动作栏落在 --card 面上，与上方画布之间用一条发丝线定界
  return (
    <section className="fixed inset-x-0 bottom-0 z-30 shrink-0 border-t border-border bg-card sm:static">
      {compressing && (
        <div className="h-px w-full bg-border" aria-hidden="true">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {multiple && (
        <details className="group hidden border-t border-border sm:block">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 text-xs text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            <ChevronRight
              className="size-4 transition-transform group-open:rotate-90"
              aria-hidden="true"
            />
            {t.controls.batchNaming}
          </summary>
          <div className="grid gap-3 border-t border-border px-3 py-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="naming-template" className="panel-label">
                {t.controls.namingTemplate}
              </label>
              <input
                id="naming-template"
                name="naming-template"
                value={namingTemplate}
                maxLength={100}
                onChange={(event) => setNamingTemplate(event.target.value)}
                aria-describedby="naming-template-hint"
                className="h-11 w-full rounded-sm border border-input bg-transparent px-3 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:text-sm"
              />
              <p id="naming-template-hint" data-numeric className="text-xs text-muted-foreground">
                {t.controls.namingHint}
              </p>
            </div>
            <div className="border border-border px-3 py-2">
              <p className="panel-label">{t.controls.filenameExample}</p>
              <p data-numeric className="mt-1 truncate text-xs">
                {outputNames[0] ?? "—"}
              </p>
            </div>
          </div>
        </details>
      )}

      <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 批量数字 */}
        <div className="hidden flex-wrap items-baseline gap-x-4 gap-y-1 sm:flex">
          <Readout label={t.summary.totalOriginal} value={formatSize(totalOriginal)} />
          <Readout
            label={t.summary.totalCompressed}
            value={allDone ? formatSize(totalCompressed) : "—"}
          />
          <Readout
            label={t.summary.totalChange}
            value={allDone && ratio !== null ? formatDelta(ratio) : "—"}
            sub={allDone && saved > 0 ? formatSize(saved) : undefined}
            emphasis={allDone && ratio !== null && ratio > 0}
          />
          {statusLabel && (
            // 进度计数与状态标签各占一格，不拼成一条中圆点串
            <span
              data-numeric
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="flex items-center gap-2 text-xs leading-[1.5] text-muted-foreground"
            >
              {compressing && (
                <>
                  <span>
                    {done} / {total}
                  </span>
                  <span aria-hidden="true" className="h-3 w-px bg-border" />
                </>
              )}
              <span>{statusLabel}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:hidden">
          <Readout
            label={t.summary.totalCompressed}
            value={allDone ? formatSize(totalCompressed) : "—"}
          />
          <Readout
            label={t.summary.totalChange}
            value={allDone && ratio !== null ? formatDelta(ratio) : "—"}
            emphasis={allDone && ratio !== null && ratio > 0}
          />
          {statusLabel && (
            <span role="status" aria-live="polite" className="text-xs text-muted-foreground">
              {statusLabel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:flex">
          <span className="border-r border-border pr-2 sm:mr-1">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
              aria-label={t.controls.clearAll}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              <span className="max-sm:hidden">{t.controls.clearAll}</span>
            </Button>
          </span>
          <Button
            type="button"
            variant={multiple ? "outline" : "default"}
            size="lg"
            onClick={downloadAll}
            disabled={!allDone || compressing}
            className={multiple ? "order-3 col-span-2 w-full sm:order-none sm:w-auto" : "w-full sm:w-auto"}
          >
            {compressing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            {multiple ? t.downloadIndividual : t.download}
          </Button>
          {multiple && (
            <Button
              type="button"
              size="lg"
              onClick={() => void downloadZip()}
              disabled={!allDone || compressing || exporting}
              className="order-2 w-full sm:order-none sm:w-auto"
            >
              {exporting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Archive className="size-4" aria-hidden="true" />
              )}
              {exporting ? t.controls.exportPreparing : t.downloadZip}
            </Button>
          )}
        </div>
      </div>

      {exportError && (
        <p className="px-3 pb-2 text-right text-xs text-destructive" role="alert">
          {exportError}
        </p>
      )}
    </section>
  );
}

function Readout({
  label,
  value,
  sub,
  emphasis = false,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="panel-label">{label}</span>
      <span
        data-numeric
        className={`text-sm font-medium ${emphasis ? "text-success" : ""}`}
      >
        {value}
      </span>
      {sub && (
        <span data-numeric className="text-xs text-muted-foreground">
          {sub}
        </span>
      )}
    </span>
  );
}
