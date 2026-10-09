export type TargetEncoding = {
  blob: Blob;
  quality: number;
  targetMet: boolean;
};

/**
 * 压缩开始之前，原图就已经满足目标了吗。
 *
 * 「达标」在那种情况下是原图的事实，不是这次压缩的成果——界面据此把
 * 状态降级成陈述句（不配绿勾），否则一次什么都没证明的压缩会被读成成果。
 */
export function sourceAlreadyMetTarget(
  sourceBytes: number,
  targetBytes: number | null,
) {
  return targetBytes !== null && sourceBytes <= targetBytes;
}

type FindTargetEncodingOptions = {
  maxQuality: number;
  targetBytes: number | null;
  encode: (quality: number) => Promise<Blob>;
  minQuality?: number;
  maxAttempts?: number;
};

export async function findTargetEncoding({
  maxQuality,
  targetBytes,
  encode,
  minQuality = 20,
  maxAttempts = 7,
}: FindTargetEncodingOptions): Promise<TargetEncoding> {
  const upperQuality = Math.max(minQuality, Math.min(100, Math.round(maxQuality)));
  const first = await encode(upperQuality);
  if (!targetBytes || first.size <= targetBytes) {
    return { blob: first, quality: upperQuality, targetMet: true };
  }

  let low = minQuality;
  let high = upperQuality - 1;
  let smallest = first;
  let smallestQuality = upperQuality;
  let best: TargetEncoding | null = null;

  for (let attempt = 0; attempt < maxAttempts && low <= high; attempt += 1) {
    const quality = Math.floor((low + high) / 2);
    const blob = await encode(quality);
    if (blob.size < smallest.size) {
      smallest = blob;
      smallestQuality = quality;
    }

    if (blob.size <= targetBytes) {
      best = { blob, quality, targetMet: true };
      low = quality + 1;
    } else {
      high = quality - 1;
    }
  }

  return best ?? { blob: smallest, quality: smallestQuality, targetMet: false };
}
