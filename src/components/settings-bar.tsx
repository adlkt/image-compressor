"use client";

import { Lock } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCompressor, type Format } from "@/lib/store";
import { useLicense } from "@/lib/pro";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const maxWidthOptions = [
  { value: 0, label: "Original" },
  { value: 3840, label: "3840 px · 4K" },
  { value: 2560, label: "2560 px · 2K" },
  { value: 1920, label: "1920 px · 1080p" },
];

export function SettingsBar() {
  const { t } = useI18n();
  const {
    selectedId,
    selectedFile,
    setImageFormat,
    setImageQuality,
    setImageMaxWidth,
  } = useCompressor();
  const { isPro, openPricing } = useLicense();

  const handleFormatChange = (value: string | null) => {
    if (!value || !selectedFile) return;
    if (value === "avif" && !isPro) {
      openPricing("avif");
      return;
    }
    setImageFormat(selectedFile.id, value as Format);
  };

  if (!selectedId || !selectedFile) return null;
  const isPng = selectedFile.format === "png";

  return (
    <section
      className="rounded-2xl border bg-card px-4 py-4 shadow-sm"
      aria-label={t.controls.custom}
    >
      <div className="grid gap-5 md:grid-cols-[minmax(150px,0.7fr)_minmax(240px,1.4fr)_minmax(180px,0.9fr)] md:items-end">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            {t.controls.format}
          </label>
          <Select
            value={selectedFile.format}
            onValueChange={handleFormatChange}
          >
            <SelectTrigger className="min-h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="avif">
                <span className="flex items-center gap-1.5">
                  AVIF
                  {!isPro && <Lock className="size-3 text-muted-foreground" />}
                </span>
              </SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="quality"
              className="text-xs font-medium text-muted-foreground"
            >
              {t.controls.quality}
            </label>
            <span className="font-mono text-xs">
              {isPng ? "—" : `${selectedFile.quality}%`}
            </span>
          </div>
          <input
            id="quality"
            type="range"
            min={1}
            max={100}
            value={selectedFile.quality}
            disabled={isPng}
            onChange={(event) =>
              setImageQuality(selectedFile.id, Number(event.target.value))
            }
            className="range-control w-full disabled:cursor-not-allowed disabled:opacity-30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            {t.controls.maxWidth}
          </label>
          <Select
            value={String(selectedFile.maxWidth)}
            onValueChange={(value) =>
              setImageMaxWidth(selectedFile.id, Number(value))
            }
          >
            <SelectTrigger className="min-h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {maxWidthOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.value === 0 ? t.controls.noLimit : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
