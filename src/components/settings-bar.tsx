"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCompressor, type Format } from "@/lib/store";
import { PresetSelector } from "./preset-selector";

/**
 * 控制栏。
 *
 * 顺序就是使用顺序：先挑预设（粗调），再看这一张的结果（数值），
 * 然后给目标大小，最后才逐项细调。细调默认折叠——预设已经覆盖了
 * 常见用途，把 格式 / 质量 / 最大宽度 一直摊在上面会把「目标大小」
 * 挤出第一屏，而按目标体积反解参数正是本产品的差异点。
 */

const maxWidthOptions = [0, 3840, 2560, 1920];
const formats: Format[] = ["webp", "jpeg", "png"];
const qualityTicks = [0, 20, 40, 60, 80, 100];

export function SettingsBar() {
  const { t } = useI18n();
  const {
    selectedId,
    selectedFile,
    setImageFormat,
    setImageQuality,
    setImageMaxWidth,
    setImageTargetBytes,
  } = useCompressor();

  if (!selectedId || !selectedFile) return null;

  const isPng = selectedFile.format === "png";

  return (
    <aside
      className="order-3 flex min-h-0 flex-col border-b border-border bg-card xl:overflow-y-auto xl:border-b-0 xl:border-l"
      aria-label={t.controls.presets}
    >
      <div className="flex flex-col gap-6 p-4 xl:p-5">
        {/* 目标大小是产品差异点：所有屏宽都先给目标，再给作为快捷入口的预设。 */}
        <PresetSelector orientation="column" className="order-2" />

        <div className="order-1">
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

        {/* 细调：低频项收进来，需要时才展开 */}
        <details className="group order-3 border-t border-border pt-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm leading-[1.4] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
            {t.controls.fineTune}
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <span className="panel-label">{t.controls.format}</span>
              <div
                className="flex gap-1 rounded-sm bg-secondary p-1"
                role="group"
                aria-label={t.controls.format}
              >
                {formats.map((format) => (
                  <SegmentButton
                    key={format}
                    active={selectedFile.format === format}
                    onClick={() => setImageFormat(selectedFile.id, format)}
                    label={format}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor="quality" className="panel-label">
                  {t.controls.quality}
                </label>
                <span data-numeric className="text-sm font-medium">
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
                className="fader"
              />
              {/* 滑块下方的刻度：没有它，手柄落在哪一段全靠猜 */}
              <div className="flex justify-between" aria-hidden="true">
                {qualityTicks.map((tick) => (
                  <span key={tick} className="h-1 w-px bg-border" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="panel-label">{t.controls.maxWidth}</span>
              <div
                className="flex gap-1 rounded-sm bg-secondary p-1"
                role="group"
                aria-label={t.controls.maxWidth}
              >
                {maxWidthOptions.map((option) => (
                  <SegmentButton
                    key={option}
                    active={selectedFile.maxWidth === option}
                    onClick={() => setImageMaxWidth(selectedFile.id, option)}
                    label={option === 0 ? t.controls.noLimit : `${option}px`}
                    numeric={option !== 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </aside>
  );
}

/** 分段控件的一段。控件圆角 6px，由外层容器的方角承担分组。 */
function SegmentButton({
  active,
  onClick,
  label,
  numeric = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  numeric?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 flex-1 rounded-[7px] text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40 ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <span data-numeric={numeric || undefined}>{label}</span>
    </button>
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
    <div className="flex flex-col gap-2">
      {/* 目标是否达成由预览表头统一报一次；同一屏说两遍，两遍就都不像结论 */}
      <label htmlFor="target-size" className="panel-label">
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
          className="h-11 w-full rounded-sm border-0 bg-secondary pr-10 pl-3 text-base outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-40 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-destructive sm:text-sm"
        />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
          KB
        </span>
      </div>
      <p
        id="target-size-hint"
        data-numeric
        className={`text-xs leading-[1.5] ${invalid ? "text-destructive" : "text-muted-foreground"}`}
        aria-live="polite"
      >
        {disabled ? pngHint : hint}
      </p>
    </div>
  );
}
