export function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 压缩率：正数表示变小，负数表示变大。
 * 刻意不取整——取整后 99.5% 会变成 100%，读起来像文件被压没了。
 */
export function compressionRatio(originalSize: number, compressedSize: number | null) {
  if (!compressedSize) return null;
  return (1 - compressedSize / originalSize) * 100;
}

/** 接近全损时保留一位小数，其余取整 */
export function formatDelta(ratio: number) {
  const precise =
    Math.abs(ratio) >= 99.5 ? Math.round(ratio * 10) / 10 : Math.round(ratio);
  const sign = precise > 0 ? "-" : precise < 0 ? "+" : "";
  return `${sign}${Math.abs(precise)}%`;
}
