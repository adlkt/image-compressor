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

  const mimeType = format === "webp" ? "image/webp" : "image/jpeg";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Compression failed"));
      },
      mimeType,
      quality / 100,
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
