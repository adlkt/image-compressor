import { compressionRatio, formatDelta } from "@/lib/format";
import { scalePosition, type Domain } from "@/lib/scale";

type Props = {
  /** 原图字节数。null 表示还没有真实数据——那时整条不渲染。 */
  original: number | null;
  /** 结果字节数。null 表示还没有真实数据——那时整条不渲染。 */
  compressed: number | null;
  /** 目标是否达成。false 表示未达目标，用 --destructive。 */
  targetMet?: boolean | null;
  /**
   * 整批共用的尺度，由 `batchDomain()` 算出。
   *
   * 必须传，不能内部自配：逐行各自配域会让同一根 500 KB 目标线
   * 在不同行落到不同位置（实测 59.6% vs 87.1%），
   * 看起来余量更大的那一行其实只是尺子被拉长了。
   */
  domain: Domain;
  className?: string;
};

/**
 * 体积对比条。
 *
 * 文件行内用一条紧凑比例尺对比原图与结果。没有真实数据时什么都不画。
 */
export function SizeBar({
  original,
  compressed,
  targetMet,
  domain,
  className = "",
}: Props) {
  // 没有真实数据就不摆空条——空条比没有条更容易被误读
  if (original === null || compressed === null || original <= 0) return null;
  const ratio = compressionRatio(original, compressed);
  if (ratio === null) return null;

  const originalPos = scalePosition(original, domain) * 100;
  const compressedPos = scalePosition(compressed, domain) * 100;

  const overTarget = targetMet === false;
  // 变小了 = --success，未达目标 = --destructive，其余中性
  const fill = overTarget
    ? "bg-destructive"
    : ratio > 0
      ? "bg-success"
      : "bg-foreground/45";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 刻度对读屏器隐藏：右边的百分比与旁边的体积数字已经是可读文本 */}
      <span
        aria-hidden="true"
        className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-sm bg-foreground/10"
      >
        <span
          className="absolute inset-y-0 left-0 bg-foreground/25"
          style={{ width: `${originalPos}%` }}
        />
        <span
          className={`absolute inset-y-0 left-0 ${fill}`}
          style={{ width: `${compressedPos}%` }}
        />
      </span>

      <span
        data-numeric
        className={`min-w-[5ch] shrink-0 text-right text-sm font-medium ${
          overTarget ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {formatDelta(ratio)}
      </span>
    </div>
  );
}
