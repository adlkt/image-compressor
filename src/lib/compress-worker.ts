import type { CompressRequest, CompressResponse } from "./compress-protocol";
import type { Format } from "./store";

async function compress(
  file: File,
  format: Format,
  quality: number,
  maxWidth: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let w = bitmap.width;
  let h = bitmap.height;

  if (maxWidth && w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const mimeType =
    format === "webp"
      ? "image/webp"
      : format === "avif"
        ? "image/avif"
        : format === "jpeg"
          ? "image/jpeg"
          : "image/png";

  const blob = await canvas.convertToBlob({
    type: mimeType,
    quality: format === "png" ? undefined : quality / 100,
  });

  if (format === "avif" && blob.type !== "image/avif") {
    throw new Error("AVIF encoding not supported in this browser");
  }

  return blob;
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
    const { requestId, file, format, quality, maxWidth } = request;

    try {
      const blob = await compress(file, format, quality, maxWidth);
      const response: CompressResponse = { type: "done", id, requestId, blob };
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
