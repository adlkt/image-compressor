export const LOCALE_COOKIE = "image-compressor-locale";
export const DEFAULT_LANG = "zh";
export const LANGS = ["zh", "en"] as const;

export type Lang = (typeof LANGS)[number];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && LANGS.includes(value as Lang);
}

export function normalizeLang(value: string | null | undefined): Lang | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";
  return null;
}
