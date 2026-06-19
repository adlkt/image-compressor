"use client";

import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const maxWidthOptions = [
  { value: 3840, label: "4K" },
  { value: 2560, label: "2K" },
  { value: 1920, label: "1080p" },
];

export function SettingsBar() {
  const { t } = useI18n();
  const { selectedId, selectedFile, setImageFormat, setImageMaxWidth } = useCompressor();

  if (!selectedId || !selectedFile) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 bg-card rounded-xl ring-1 ring-foreground/10 p-4">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{t.controls.format}</span>
        <Select value={selectedFile.format} onValueChange={(v) => setImageFormat(selectedFile.id, v as "webp" | "jpeg")}>
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webp">WebP</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-px h-6 bg-border" />

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{t.controls.maxWidth}</span>
        <Select
          value={String(selectedFile.maxWidth)}
          onValueChange={(v) => setImageMaxWidth(selectedFile.id, Number(v))}
        >
          <SelectTrigger size="sm" className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {maxWidthOptions.map((opt) => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
