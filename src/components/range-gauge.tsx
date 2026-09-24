"use client";

import { useI18n } from "@/i18n";
import { compressionRatio, formatDelta, formatSize } from "@/lib/format";
import { scaleDomain, scalePosition, scaleTicks, type Domain, type Tick } from "@/lib/scale";

type Props = {
  /** 原始字节数，null 表示还没量到 */
  original: number | null;
  compressed: number | null;
  /** 目标字节数，null 表示这一档不设上限 */
  target: number | null;
  /** 目标是否达成，null 表示还没结果 */
  targetMet?: boolean | null;
  /** 这一档目标的显示名，例如「Web 优化」 */
  targetLabel?: string;
  /** panel = 带刻度标签与数字读数的完整量具；row = 列表里的微型尺 */
  variant?: "panel" | "row";
  /** 最多标几个刻度值；容器窄时必须压低 */
  maxLabels?: number;
  /**
   * 省下的那一段怎么画。
   * signal = 实色信号带，用在一眼要看清结果的读数上；
   * hollow = 画成刻线（缺席本身也是读数），用在宽度铺满的汇总尺上——
   * 那里一条实色带会和正上方的压缩进度线撞成同一个样子。
   */
  fill?: "signal" | "hollow";
  /**
   * 外部指定的量程。批量场景必须传——整批共用一个刻度，
   * 每一行的目标线才会落在同一个位置，那一列尺子才真的能横向比较。
   * 不传时按本组读数自动配域（单张图的情形）。
   */
  domain?: Domain;
  className?: string;
};

const EMPTY = "——";

/**
 * 量程尺 —— 这台仪器的核心读数。
 *
 * 原图在一端、压缩结果在另一端，中间那段信号色就是省下来的体积；
 * 目标是贯穿整把尺的虚线，跨过去了才算达成。
 *
 * 刻度是对数的（见 lib/scale.ts）：380 KB 与 12 MB 必须出现在同一把尺上，
 * 线性刻度会把小的那头压成一根线。
 */
export function RangeGauge({
  original,
  compressed,
  target,
  targetMet,
  targetLabel,
  variant = "panel",
  maxLabels,
  fill = "signal",
  domain: explicitDomain,
  className = "",
}: Props) {
  const { t } = useI18n();

  // 量程要同时装得下原图、压缩结果与目标，否则目标线会落到尺子外面。
  // 批量场景由调用方传入整批共用的那把尺。
  const domain =
    explicitDomain ??
    scaleDomain(
      [original, compressed, target].filter(
        (value): value is number => value !== null && value > 0,
      ),
    );
  const position = (bytes: number | null) =>
    bytes ? scalePosition(bytes, domain) : null;

  const originalPos = position(original);
  const compressedPos = position(compressed);
  const targetPos = position(target);

  if (variant === "row") {
    return (
      <div className={`relative h-5 ${className}`} aria-hidden="true">
        <Scale
          domain={domain}
          originalPos={originalPos}
          compressedPos={compressedPos}
          targetPos={targetPos}
          targetMet={targetMet}
          maxLabels={maxLabels}
          fill={fill}
          compact
        />
      </div>
    );
  }

  const ratio =
    original !== null && compressed !== null
      ? compressionRatio(original, compressed)
      : null;

  // 还没有任何读数时，不摆一排「——」占地方：尺子和目标线本身已经说明了一切
  const hasReading = original !== null || compressed !== null;

  // 目标贴着尺子两端时，标签要改变对齐方向，否则会溢出容器
  const targetAlignment =
    targetPos === null || targetPos < 0.08
      ? ""
      : targetPos > 0.9
        ? "-translate-x-full"
        : "-translate-x-1/2";

  return (
    <section
      className={`@container flex flex-col gap-4 ${className}`}
      aria-label={t.gauge.range}
    >
      {/* 数字读数：仪器面板下方的数字显示条 */}
      {hasReading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 @[22rem]:grid-cols-3">
          <Reading label={t.controls.original} value={original ? formatSize(original) : EMPTY} />
          <Reading
            label={t.controls.compressed}
            value={compressed ? formatSize(compressed) : EMPTY}
            pending={compressed === null}
          />
          <Reading
            label={t.summary.totalSaved}
            value={ratio === null ? EMPTY : formatDelta(ratio)}
            emphasis={ratio !== null && ratio > 0}
            sub={
              original !== null && compressed !== null
                ? formatSize(Math.max(0, original - compressed))
                : undefined
            }
          />
        </div>
      ) : (
        // 空量程不是留白，是一句邀请：这里将来会显示什么
        <p className="text-sm text-muted-foreground">{t.gauge.idle}</p>
      )}

      {/* 尺子本体。读数已经是可读文本，尺子对读屏器隐藏。 */}
      <div className="relative h-16 select-none" aria-hidden="true">
        <Scale
          domain={domain}
          originalPos={originalPos}
          compressedPos={compressedPos}
          targetPos={targetPos}
          targetMet={targetMet}
          maxLabels={maxLabels}
          fill={fill}
          labelled
        />

        {/* 目标线上的标签：说明这条判据是谁设的、设成了多少 */}
        {targetPos !== null && (
          <span
            data-silk
            className={`absolute bottom-[2.5rem] whitespace-nowrap rounded-[2px] px-1 py-px text-[10px] leading-none ${targetAlignment} ${
              targetMet === true
                ? "bg-primary text-primary-foreground"
                : targetMet === false
                  ? "bg-destructive text-background"
                  : "bg-foreground/85 text-background"
            }`}
            style={{ left: `${targetPos * 100}%` }}
          >
            {targetLabel ? `${targetLabel} ` : ""}
            {formatSize(target ?? 0)}
          </span>
        )}
      </div>
    </section>
  );
}

/** 尺子本体：基线、填充、刻度、两个游标、一条目标线 */
function Scale({
  domain,
  originalPos,
  compressedPos,
  targetPos,
  targetMet,
  maxLabels,
  fill,
  compact = false,
  labelled = false,
}: {
  domain: Domain;
  originalPos: number | null;
  compressedPos: number | null;
  targetPos: number | null;
  targetMet?: boolean | null;
  maxLabels?: number;
  fill: "signal" | "hollow";
  compact?: boolean;
  labelled?: boolean;
}) {
  const ticks: Tick[] = scaleTicks(domain, maxLabels);

  // 填充贴着基线，刻度从基线往上立——刻度画在填充之后，
  // 否则一段长填充会把整把尺子的刻度全盖住，看起来就成了进度条。
  const base = compact ? "bottom-1" : "bottom-6";
  const barHeight = compact ? "h-[3px]" : "h-1.5";
  const minorHeight = "h-2";
  const majorHeight = compact ? "h-[0.625rem]" : "h-3";
  const cursorHeight = compact ? "h-3" : "h-5";

  /*
    对比阶梯。刻度必须比它所在的底更强一档才算「刻出来」，
    而底色在两套主题下亮度相差极大（近黑 vs 近白），所以用透明度分档：
    基线 /55、主刻度 /75、次刻度 /38（暗色 ≈6.2 / 10.9 / 3.5，亮色 ≈3.6 / 6.9 / 2.3）。
    次刻度低于 3:1 是有意的——它是细分，不该和主刻度抢。
  */
  const baseline = "bg-foreground/55";
  const majorTick = "bg-foreground/75";
  const minorTick = "bg-foreground/38";

  /*
    实色信号带上再画一遍刻度，用反相色。
    亮带会把白刻度吃掉——实测 233,226,136 压在同一条带上只有 1.13:1，
    等于读数所在的那一段完全没有刻度。反相后 7.0 : 1，
    和「亮起的面板上刻着黑字」是同一个道理。
  */
  const span =
    originalPos !== null && compressedPos !== null && originalPos > compressedPos
      ? { left: compressedPos, width: originalPos - compressedPos }
      : null;

  return (
    <>
      <span className={`absolute left-0 h-px w-full ${baseline} ${base}`} />

      {/* 省下来的那一段：从压缩后一直拉到原图 */}
      {originalPos !== null && compressedPos !== null ? (
        <span
          className={`absolute ${barHeight} ${base} ${
            fill === "hollow" ? "gauge-ghost" : "bg-primary"
          }`}
          style={{
            left: `${compressedPos * 100}%`,
            width: `${Math.max(0, originalPos - compressedPos) * 100}%`,
          }}
        />
      ) : (
        // 还没读数：把「将来会有值」的那一段也用刻度画出来
        <span
          className={`gauge-ghost absolute left-0 w-full opacity-45 ${barHeight} ${base}`}
        />
      )}

      {ticks.map((tick) => (
        <span
          key={tick.bytes}
          className={`absolute w-px ${base} ${
            tick.label ? `${majorHeight} ${majorTick}` : `${minorHeight} ${minorTick}`
          }`}
          style={{ left: `${tick.position * 100}%` }}
        />
      ))}

      {/* 带内的刻度：只在填充覆盖住的那一段重画，且裁到带的高度 */}
      {span && fill === "signal" && (
        <span
          className={`absolute overflow-hidden ${barHeight} ${base}`}
          style={{ left: `${span.left * 100}%`, width: `${span.width * 100}%` }}
        >
          {ticks.map((tick) => {
            const offset = (tick.position - span.left) / span.width;
            if (offset <= 0 || offset >= 1) return null;
            return (
              <span
                key={`in-band-${tick.bytes}`}
                className={`absolute inset-y-0 w-px ${
                  tick.label
                    ? "bg-primary-foreground/70"
                    : "bg-primary-foreground/48"
                }`}
                style={{ left: `${offset * 100}%` }}
              />
            );
          })}
        </span>
      )}

      {labelled &&
        ticks.map((tick) =>
          tick.label ? (
            <span
              key={`label-${tick.bytes}`}
              data-numeric
              // 首尾刻度不能按中心对齐：那样一半标签会挂在尺子外面。
              // nowrap 不能省——末尾刻度的 left 是 100%，绝对定位盒的可用宽度
              // 因此为 0，shrink-to-fit 会塌到 min-content，把「8 MB」折成两行。
              className={`absolute bottom-0 text-[10px] leading-none whitespace-nowrap text-muted-foreground ${
                tick.position <= 0.001
                  ? ""
                  : tick.position >= 0.999
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              }`}
              style={{ left: `${tick.position * 100}%` }}
            >
              {tick.label}
            </span>
          ) : null,
        )}

      {originalPos !== null && (
        <span
          className={`absolute w-[2px] bg-foreground ${cursorHeight} ${base}`}
          style={{ left: `${originalPos * 100}%` }}
        />
      )}

      {compressedPos !== null && (
        <span
          className={`absolute w-[2px] bg-primary ${cursorHeight} ${base}`}
          style={{ left: `${compressedPos * 100}%` }}
        />
      )}

      {/* 目标线：贯穿整把尺的虚线，是「有没有达标」的那条判据 */}
      {targetPos !== null && (
        <span
          className={`absolute top-0 border-l border-dashed ${base} ${
            targetMet === true
              ? "border-primary"
              : targetMet === false
                ? "border-destructive"
                : "border-foreground/45"
          }`}
          style={{ left: `${targetPos * 100}%` }}
        />
      )}
    </>
  );
}

function Reading({
  label,
  value,
  sub,
  emphasis = false,
  pending = false,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span data-silk className="panel-label">
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        <span
          data-numeric
          data-readout
          className={`text-xl leading-none font-semibold tracking-[-0.01em] ${
            emphasis ? "text-signal" : pending ? "text-muted-foreground" : ""
          }`}
        >
          {value}
        </span>
        {sub && (
          <span data-numeric className="text-xs leading-none text-muted-foreground">
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}
