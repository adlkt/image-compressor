import type { CompressRequest, CompressResponse } from "./compress-protocol";
import type { Format } from "./store";
import { isHeicInput } from "./image-input";
import { findTargetEncoding, type TargetEncoding } from "./target-size";

type CompressionResult = TargetEncoding & {
  previewBlob: Blob | null;
  sourceWidth: number;
  sourceHeight: number;
};

async function decodeBitmap(file: File): Promise<{ bitmap: ImageBitmap; isHeic: boolean }> {
  if (!isHeicInput(file)) {
    return { bitmap: await createImageBitmap(file), isHeic: false };
  }

  const { heicTo } = await import("heic-to/next");
  return { bitmap: await heicTo({ blob: file, type: "bitmap" }), isHeic: true };
}

async function compress(
  file: File,
  format: Format,
  quality: number,
  maxWidth: number,
  targetBytes: number | null,
): Promise<CompressionResult> {
  const { bitmap, isHeic } = await decodeBitmap(file);
  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  let w = bitmap.width;
  let h = bitmap.height;

  let previewBlob: Blob | null = null;
  if (isHeic) {
    const previewScale = Math.min(1, 1600 / Math.max(sourceWidth, sourceHeight));
    const previewCanvas = new OffscreenCanvas(
      Math.max(1, Math.round(sourceWidth * previewScale)),
      Math.max(1, Math.round(sourceHeight * previewScale)),
    );
    const previewContext = previewCanvas.getContext("2d");
    if (!previewContext) throw new Error("Unable to create HEIC preview");
    previewContext.drawImage(bitmap, 0, 0, previewCanvas.width, previewCanvas.height);
    previewBlob = await previewCanvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });
  }

  if (maxWidth && w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create image canvas");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const mimeType =
    format === "webp"
      ? "image/webp"
      : format === "jpeg"
        ? "image/jpeg"
        : "image/png";

  const encode = async (outputQuality: number) => {
    const blob = await canvas.convertToBlob({
      type: mimeType,
      quality: format === "png" ? undefined : outputQuality / 100,
    });
    if (blob.type !== mimeType) {
      throw new Error(`Encoding ${mimeType} is not supported in this browser`);
    }
    return blob;
  };

  if (format === "png") {
    const blob = await encode(quality);
    return { blob, quality, targetMet: true, previewBlob, sourceWidth, sourceHeight };
  }
  const result = await findTargetEncoding({ maxQuality: quality, targetBytes, encode });
  return { ...result, previewBlob, sourceWidth, sourceHeight };
}

declare const self: {
  postMessage(message: unknown, options?: { transfer?: Transferable[] }): void;
  onmessage: ((event: MessageEvent) => void) | null;
};

const pending = new Map<string, CompressRequest>();
let processing = false;

async function processQueue() {
  if (processing) return;
  processing = true;

  while (pending.size > 0) {
    const next = pending.entries().next().value as
      | [string, CompressRequest]
      | undefined;
    if (!next) break;

    const [id, request] = next;
    pending.delete(id);
    const { requestId, file, format, quality, maxWidth, targetBytes } = request;

    try {
      const result = await compress(file, format, quality, maxWidth, targetBytes);
      const response: CompressResponse = {
        type: "done",
        id,
        requestId,
        blob: result.blob,
        previewBlob: result.previewBlob,
        sourceWidth: result.sourceWidth,
        sourceHeight: result.sourceHeight,
        outputQuality: format === "png" ? null : result.quality,
        targetMet: targetBytes && format !== "png" ? result.targetMet : null,
      };
      self.postMessage(response);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Compression failed";
      const response: CompressResponse = {
        type: "error",
        id,
        requestId,
        reason,
      };
      self.postMessage(response);
    }
  }

  processing = false;
}

self.onmessage = (event: MessageEvent<CompressRequest>) => {
  pending.set(event.data.id, event.data);
  void processQueue();
};
