const HEIC_EXTENSION = /\.(?:heic|heif)$/i;

export function isHeicInput(file: Pick<File, "name" | "type">): boolean {
  return file.type === "image/heic" || file.type === "image/heif" || HEIC_EXTENSION.test(file.name);
}

export function isSupportedImageInput(file: Pick<File, "name" | "type">): boolean {
  return file.type.startsWith("image/") || isHeicInput(file);
}
