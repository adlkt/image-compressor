"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import { useCompressor, type Format } from "@/lib/store";
import { batchDomain } from "@/lib/scale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PresetSelector } from "./preset-selector";
import { RangeGauge } from "./range-gauge";

const maxWidthOptions = [
  { value: 0, label: "Original" },
  { value: 3840, label: "3840 px · 4K" },
  { value: 2560, label: "2560 px · 2K" },
  { value: 1920, label: "1920 px · 1080p" },
];

const formats: Format[] = ["webp", "jpeg", "png"];
const qualityTicks = [0, 20, 40, 60, 80, 100];

/**
 * 参数台。
 *
 * 顺序就是使用顺序：先挑档位（粗调），再看这一项量到的结果，
 * 最后才逐项细调。读在控制之上——这是仪表盘的先后关系。
 */
export function SettingsBar() {
  const { t } = useI18n();
  const {
    files,
    selectedId,
    selectedFile,
    setImageFormat,
    setImageQuality,
    setImageMaxWidth,
    setImageTargetBytes,
  } = useCompressor();

  if (!selectedId || !selectedFile) return null;

  const isPng = selectedFile.format === "png";

  // 与左侧队列同一把尺：点某一帧时，右栏的刻度不会跟着跳
  const domain = batchDomain(
    files.map((file) => ({
      original: file.file.size,
      compressed: file.compressedSize,
      target: file.targetBytes,
    })),
  );

  return (
    <aside
      className="flex min-h-0 flex-col border-t border-border lg:overflow-y-auto lg:border-t-0 lg:border-l"
      aria-label={t.controls.presets}
    >
      <div className="flex flex-col gap-7 p-3">
        {/* 档位：整批共用 */}
        <PresetSelector orientation="column" />

        {/* 选中项的读数 */}
        <RangeGauge
          original={selectedFile.file.size}
          compressed={selectedFile.compressedSize}
          target={selectedFile.targetBytes}
          targetMet={selectedFile.targetMet}
          domain={domain}
          maxLabels={4}
        />

        {/* 逐项细调 */}
        <div className="flex flex-col gap-2">
          <span data-silk className="panel-label">
            {t.controls.format}
          </span>
          <div
            className="flex divide-x divide-border border border-border"
            role="group"
            aria-label={t.controls.format}
          >
            {formats.map((format) => {
              const active = selectedFile.format === format;
              return (
                <button
                  key={format}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setImageFormat(selectedFile.id, format)}
                  className={`min-h-8 flex-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {format}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor="quality" data-silk className="panel-label">
              {t.controls.quality}
            </label>
            <span data-numeric data-readout className="text-sm font-medium">
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
            className="fader mt-1"
          />
          {/* 推子下方的刻度：没有它，手柄落在哪一段全靠猜 */}
          <div className="flex justify-between" aria-hidden="true">
            {qualityTicks.map((tick) => (
              <span key={tick} className="h-1 w-px bg-border" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="max-width" data-silk className="panel-label">
            {t.controls.maxWidth}
          </label>
          <Select
            value={String(selectedFile.maxWidth)}
            onValueChange={(value) => setImageMaxWidth(selectedFile.id, Number(value))}
          >
            <SelectTrigger id="max-width" className="h-9 w-full">
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

        <TargetSizeInput
          key={`${selectedFile.id}-${selectedFile.targetBytes}-${selectedFile.format}`}
          id={selectedFile.id}
          targetBytes={selectedFile.targetBytes}
          disabled={isPng}
          label={t.controls.targetSize}
          hint={t.controls.targetSizeHint}
          pngHint={t.controls.targetSizePng}
          onCommit={setImageTargetBytes}
        />
      </div>
    </aside>
  );
}

function TargetSizeInput({
  id,
  targetBytes,
  disabled,
  label,
  hint,
  pngHint,
  onCommit,
}: {
  id: string;
  targetBytes: number | null;
  disabled: boolean;
  label: string;
  hint: string;
  pngHint: string;
  onCommit: (id: string, targetBytes: number | null) => void;
}) {
  const [value, setValue] = useState(targetBytes ? String(targetBytes / 1024) : "");
  const [invalid, setInvalid] = useState(false);

  const commit = () => {
    if (value.trim() === "") {
      setInvalid(false);
      onCommit(id, null);
      return;
    }
    const kilobytes = Number(value);
    if (!Number.isFinite(kilobytes) || kilobytes < 20 || kilobytes > 10240) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onCommit(id, Math.round(kilobytes * 1024));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="target-size" data-silk className="panel-label">
        {label}
      </label>
      <div className="relative">
        <input
          id="target-size"
          name="target-size"
          type="number"
          inputMode="numeric"
          min={20}
          max={10240}
          step={10}
          value={value}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby="target-size-hint"
          onChange={(event) => {
            setValue(event.target.value);
            setInvalid(false);
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.currentTarget.blur();
            }
          }}
          placeholder="500"
          className="h-9 w-full rounded-[3px] border border-input bg-transparent px-2.5 pr-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-40 aria-[invalid=true]:border-destructive"
        />
        <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] text-muted-foreground">
          KB
        </span>
      </div>
      <p
        id="target-size-hint"
        className={`text-[11px] leading-4 ${invalid ? "text-destructive" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {disabled ? pngHint : hint}
      </p>
    </div>
  );
}
