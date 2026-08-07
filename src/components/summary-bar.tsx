"use client";

import { Download, Loader2, Trash2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function SummaryBar() {
  const { files } = useCompressor();
  const { t } = useI18n();
  if (files.length === 0) return null;

  const totalOriginal = files.reduce((sum, file) => sum + file.file.size, 0);
  const totalCompressed = files.reduce(
    (sum, file) => sum + (file.compressedSize ?? file.file.size),
    0,
  );
  const ratio =
    totalOriginal > 0
      ? Math.round((1 - totalCompressed / totalOriginal) * 100)
      : 0;
  const allDone = files.every(
    (file) => file.compressedBlob !== null || file.error !== null,
  );
  const compressing = files.some((file) => file.compressing);

  const total = files.length;
  const done = files.filter((f) => f.compressedBlob || f.error).length;
  const failed = files.filter((f) => f.error).length;
  const progress = total > 0 ? done / total : 0;

  let statusText = "";
  let statusClass = "";
  if (compressing) {
    statusText = `${done} / ${total} · ${t.controls.processing}`;
    statusClass = "text-muted-foreground";
  } else if (failed > 0) {
    statusText = t.controls.failedItems.replace("{count}", String(failed));
    statusClass = "text-amber-600 dark:text-amber-400";
  } else if (allDone) {
    statusText = t.controls.allDone;
    statusClass = "text-emerald-600 dark:text-emerald-400";
  }

  const downloadAll = () => {
    for (const file of files.filter((item) => item.compressedBlob)) {
      const extension = file.format === "jpeg" ? ".jpg" : `.${file.format}`;
      const baseName = file.file.name.replace(/\.[^.]+$/, "");
      const url = URL.createObjectURL(file.compressedBlob!);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${baseName}${extension}`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const clearAll = () => {
    const { removeFile } = useCompressor.getState();
    [...files].forEach((file) => removeFile(file.id));
  };

  const showProgress = compressing || (allDone && failed > 0);
  const successAll = allDone && failed === 0;

  return (
    <section
      className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:gap-5"
      aria-label={t.summary.totalCompressed}
    >
      <div className="space-y-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full bg-emerald-500 transition-all duration-300 dark:bg-emerald-400 ${successAll ? "opacity-0" : "opacity-100"}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {showProgress && statusText && (
          <p className={`text-right font-mono text-[11px] ${statusClass}`}>
            {statusText}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:flex sm:gap-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.summary.totalOriginal}
            </p>
            <p className="mt-1 font-mono text-base font-semibold">
              {formatSize(totalOriginal)}
            </p>
          </div>
          <span className="text-muted-foreground">→</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t.summary.totalCompressed}
            </p>
            <p className="mt-1 font-mono text-base font-semibold">
              {formatSize(totalCompressed)}
            </p>
          </div>
          {allDone && (
            <span
              className={`hidden rounded-full px-2.5 py-1 font-mono text-xs font-semibold sm:inline ${ratio >= 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}
            >
              {ratio >= 0 ? `-${ratio}%` : `+${Math.abs(ratio)}%`}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={clearAll}
            className="min-h-11 flex-1 sm:flex-none"
          >
            <Trash2 className="size-4" />
            {t.controls.clearAll}
          </Button>
          <Button
            type="button"
            onClick={downloadAll}
            disabled={!allDone || compressing}
            className="min-h-11 flex-[1.4] bg-emerald-600 text-white hover:bg-emerald-700 sm:flex-none dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
          >
            {compressing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {files.length > 1 ? t.downloadAll : t.download}
          </Button>
        </div>
      </div>
    </section>
  );
}
