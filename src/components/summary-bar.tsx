"use client";

import { Download, Package, Trash2 } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

function formatSize(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

export function SummaryBar() {
  const { files } = useCompressor();
  const { t } = useI18n();

  if (files.length === 0) return null;

  const totalOriginal = files.reduce((sum, f) => sum + f.file.size, 0);
  const totalCompressed = files.reduce((sum, f) => sum + (f.compressedSize ?? f.file.size), 0);
  const totalSaved = totalOriginal - totalCompressed;
  const ratio = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;
  const allDone = files.every((f) => f.compressedBlob !== null);
  const compressing = files.some((f) => f.compressing);

  const downloadAll = useCallback(() => {
    const doneFiles = files.filter((f) => f.compressedBlob !== null);
    for (const f of doneFiles) {
      const ext = f.format === "webp" ? ".webp" : ".jpg";
      const baseName = f.file.name.replace(/\.[^.]+$/, "");
      const url = URL.createObjectURL(f.compressedBlob!);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [files]);

  const clearAll = useCallback(() => {
    const { removeFile } = useCompressor.getState();
    [...files].forEach((f) => removeFile(f.id));
  }, [files]);

  return (
    <Card>
      <CardContent>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-[11px] text-muted-foreground">{t.summary.totalFiles}</p>
            <p className="text-lg font-semibold tabular-nums">{files.length}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{t.summary.totalOriginal}</p>
            <p className="text-lg font-semibold tabular-nums">{formatSize(totalOriginal)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{t.summary.totalCompressed}</p>
            <p className="text-lg font-semibold tabular-nums">{formatSize(totalCompressed)}</p>
          </div>
          {totalSaved > 0 && (
            <div>
              <p className="text-[11px] text-muted-foreground">{t.summary.totalSaved}</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400 tabular-nums">
                {formatSize(totalSaved)} (-{ratio}%)
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="w-3.5 h-3.5" />
            {t.controls.clearAll}
          </Button>
          <Button size="sm" onClick={downloadAll} disabled={!allDone || compressing}>
            {files.length > 1 ? <Package className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            {files.length > 1 ? t.downloadAll : t.download}
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
