"use client";

import { Loader2, ImageIcon } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function formatSize(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

export function PreviewPanel() {
  const { files, selectedId } = useCompressor();
  const { t } = useI18n();

  const selected = files.find((f) => f.id === selectedId) ?? files[0];

  if (!selected) {
    return (
      <Card className="flex items-center justify-center h-64 text-muted-foreground/40">
        <div className="text-center">
          <ImageIcon className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">{t.controls.wait}</p>
        </div>
      </Card>
    );
  }

  const ratio = selected.compressedSize
    ? Math.round((1 - selected.compressedSize / selected.file.size) * 100)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t.controls.original}</span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              {selected.originalWidth > 0 && (
                <span>{selected.originalWidth}x{selected.originalHeight}</span>
              )}
              <span className="font-mono text-foreground">{formatSize(selected.file.size)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-lg -mx-2">
            <img
              src={selected.originalUrl}
              alt={selected.file.name}
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        </CardContent>
      </Card>

      {/* Compressed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{t.controls.compressed}</span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              {selected.compressedSize ? (
                <>
                  <span className="font-mono text-foreground">{formatSize(selected.compressedSize)}</span>
                  {ratio !== null && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                      -{ratio}%
                    </span>
                  )}
                </>
              ) : selected.compressing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-lg -mx-2">
            {selected.compressedUrl ? (
              <img
                src={selected.compressedUrl}
                alt="Compressed"
                className="max-w-full max-h-[500px] object-contain"
              />
            ) : selected.compressing ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">{t.controls.compressing}...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">{t.controls.wait}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
