"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Lang, type Translations } from "./translations";

export type { Lang };

const STORAGE_KEY = "image-compressor-lang";
const DEFAULT_LANG: Lang = "zh";

function detectLang(serverLang?: Lang): Lang {
  // Server-provided lang takes priority for initial render (SEO)
  if (serverLang) return serverLang;
  if (typeof window === "undefined") return DEFAULT_LANG;
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored && ["zh", "en", "ja"].includes(stored)) return stored;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ja")) return "ja";
  return "en";
}

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(() => detectLang(initialLang));

  useEffect(() => {
    // If server already set the right language, skip client re-detect
    if (initialLang) return;
    const detected = detectLang();
    if (detected !== lang) {
      setLangState(detected);
      document.documentElement.lang = detected;
    }
  }, [initialLang, lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const value: I18nContextValue = {
    lang,
    setLang,
    t: translations[lang],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
