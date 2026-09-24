/**
 * 量程尺的刻度数学。
 *
 * 体积的跨度极大（380 KB 的截图和 12 MB 的照片要在同一把尺上看清），
 * 线性刻度在这种比例下必然把小的那头压成一条线，所以这里一律用对数刻度。
 *
 * 刻度值取 2 的整数次幂：它在对数轴上等距，且经 `formatSize` 渲染出来
 * 正好是 512 KB / 1 MB / 2 MB / 4 MB 这类整数——量具上不该出现 977 KB。
 */

import { formatSize } from "./format.ts";

export type Tick = {
  bytes: number;
  /** 0–1 的归一化位置 */
  position: number;
  /** 次要刻度不给标签，避免尺子糊成一片 */
  label: string | null;
};

export type Domain = { lo: number; hi: number };

/** 至少跨 6 个二进档（64×），否则刻度会挤成一根柱子 */
const MIN_SPAN_STEPS = 6;
/** 默认最多标多少个刻度值；容器窄时调用方要压低它 */
const DEFAULT_MAX_LABELS = 8;

const FALLBACK_MIN = 64 * 1024;
const FALLBACK_MAX = 8 * 1024 * 1024;

/**
 * 从一组读数推出量程范围。0 与非法值不参与——对数轴上没有 0。
 * 最小值向下留一档、最大值向上留 5%，避免读数正好贴在尺子的两端。
 */
export function scaleDomain(values: number[]): Domain {
  const positive = values.filter((value) => Number.isFinite(value) && value > 0);
  const min = positive.length > 0 ? Math.min(...positive) : FALLBACK_MIN;
  const max = positive.length > 0 ? Math.max(...positive) : FALLBACK_MAX;

  let lo = 2 ** Math.floor(Math.log2(Math.max(1, min / 2)));
  const hi = 2 ** Math.ceil(Math.log2(max * 1.05));

  // 量程太窄时向下拓宽：跨度不够，刻度就会挤成一根柱子
  while (hi / lo < 2 ** MIN_SPAN_STEPS && lo > 1) lo = Math.max(1, lo / 2);

  return { lo, hi };
}

/**
 * 整批共用的量程 —— 一台仪器只有一把尺。
 *
 * 队列里每一行的读数与目标线必须落在同一个刻度上。若每行各自配域，
 * 同一根 500 KB 目标线会在每行跑到不同位置（实测 59.6% vs 87.1%），
 * 于是「对齐的一列尺子」反而会误导横向比较：看起来余量更大的那一行，
 * 其实只是它的尺子被拉长了。
 */
export function batchDomain(
  readings: Iterable<{
    original: number | null;
    compressed: number | null;
    target: number | null;
  }>,
): Domain {
  const values: number[] = [];
  for (const reading of readings) {
    for (const value of [reading.original, reading.compressed, reading.target]) {
      if (value !== null && Number.isFinite(value) && value > 0) values.push(value);
    }
  }
  return scaleDomain(values);
}

/** 把一个字节数映射到 0–1；超出量程的读数贴边而不是溢出 */
export function scalePosition(bytes: number, domain: Domain): number {
  if (!Number.isFinite(bytes) || bytes <= 0) return 0;
  const span = Math.log2(domain.hi) - Math.log2(domain.lo);
  const ratio = (Math.log2(bytes) - Math.log2(domain.lo)) / span;
  return ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
}

/**
 * 量程内的全部刻度，含位置与可选标签。
 * `maxLabels` 决定标签密度：尺子窄的时候必须压低，否则标签会互相压住。
 */
export function scaleTicks(domain: Domain, maxLabels = DEFAULT_MAX_LABELS): Tick[] {
  const start = Math.round(Math.log2(domain.lo));
  const end = Math.round(Math.log2(domain.hi));
  const count = end - start + 1;
  const stride = Math.max(1, Math.ceil(count / Math.max(1, maxLabels)));

  const ticks: Tick[] = [];
  for (let step = start; step <= end; step++) {
    const bytes = 2 ** step;
    // 右端留不出空位就不标，宁可少一个标签也不要两个压在一起
    const tailFits = step === end && (end - start) % stride >= 2;
    ticks.push({
      bytes,
      position: scalePosition(bytes, domain),
      label: (step - start) % stride === 0 || tailFits ? formatTick(bytes) : null,
    });
  }
  return ticks;
}

/** 刻度标签：去掉 "1.0 MB" 里那个没意义的 `.0` */
export function formatTick(bytes: number): string {
  return formatSize(bytes).replace(/\.0(?=\s)/, "");
}
