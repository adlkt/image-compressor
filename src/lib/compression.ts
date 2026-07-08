import type { Format } from "./store";

export async function compressImage(
  file: File,
  format: Format,
  quality: number,
  maxWidth: number | null,
): Promise<Blob> {
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  let w = img.naturalWidth;
  let h = img.naturalHeight;

  if (maxWidth && w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  const mimeType =
    format === "webp" ? "image/webp" : format === "avif" ? "image/avif" : format === "jpeg" ? "image/jpeg" : "image/png";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else if (format === "avif") reject(new Error("AVIF encoding not supported in this browser"));
        else reject(new Error("Compression failed"));
      },
      mimeType,
      // PNG is lossless, quality param has no effect — omit for clarity
      format === "png" ? undefined : quality / 100,
    );
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}
