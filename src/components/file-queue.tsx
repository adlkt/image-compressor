"use client";

import { X, Loader2, Plus } from "lucide-react";
import { useCompressor } from "@/lib/store";
import { useI18n } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";

function formatSize(size: number) {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileQueue() {
  const { files, selectedId, selectFile, removeFile } = useCompressor();
  const { t } = useI18n();

  if (files.length === 0) return null;

  return (
    <Card className="!overflow-visible">
      <CardContent>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {files.length} {t.controls.files}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {files.map((f) => {
          const ratio = f.compressedSize
            ? Math.round((1 - f.compressedSize / f.file.size) * 100)
            : null;
          const isSelected = f.id === selectedId;

          return (
            <button
              key={f.id}
              onClick={() => selectFile(f.id)}
              className={`relative flex-shrink-0 w-28 rounded-xl border overflow-hidden transition-all group ${
                isSelected
                  ? "border-foreground ring-1 ring-foreground/20"
                  : "border-transparent hover:border-border"
              }`}
            >
              <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
                <img
                  src={f.originalUrl}
                  alt={f.file.name}
                  className="w-full h-full object-cover"
                />
                {f.compressing && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                  </div>
                )}
              </div>
              <div className="p-1.5 text-left">
                <p className="text-[11px] text-foreground truncate leading-tight">{f.file.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatSize(f.file.size)}
                  {ratio !== null && (
                    <span className="text-green-600 dark:text-green-400 ml-1">-{ratio}%</span>
                  )}
                </p>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                role="button"
                tabIndex={0}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-background/90 ring-1 ring-foreground/10
                  opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-destructive/10 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </span>
            </button>
          );
        })}
        {/* Add more button */}
        <button
          onClick={() => document.getElementById("file-input-queue")?.click()}
          className="flex-shrink-0 w-28 aspect-square rounded-xl border border-border hover:border-foreground/30
            flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px]">{t.controls.add}</span>
        </button>
        <input id="file-input-queue" type="file" accept="image/*" multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            const images = selected.filter((f) => f.type.startsWith("image/"));
            if (images.length > 0) useCompressor.getState().addFiles(images);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>
      </CardContent>
    </Card>
  );
}
