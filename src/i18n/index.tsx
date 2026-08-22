"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  useTransition,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  LOCALE_COOKIE,
  isLang,
  normalizeLang,
  type Lang,
} from "./locales";
import { translations, type Translations } from "./translations";

export type { Lang };

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  isPending: boolean;
  t: Translations;
};

function persistLang(lang: Lang) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = lang;
}

function detectBrowserLang(): Lang {
  const cookieLang = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];
  if (isLang(cookieLang)) return cookieLang;

  return normalizeLang(navigator.language) ?? DEFAULT_LANG;
}

const I18nContext = createContext<I18nValue | null>(null);
const langListeners = new Set<() => void>();
let browserLang: Lang | null = null;

function subscribeToLang(listener: () => void) {
  langListeners.add(listener);
  return () => {
    langListeners.delete(listener);
  };
}

function getBrowserLang(): Lang {
  browserLang ??= detectBrowserLang();
  return browserLang;
}

function getServerLang(): Lang {
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeToLang,
    getBrowserLang,
    getServerLang,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (nextLang: Lang) => {
      persistLang(nextLang);
      startTransition(() => {
        browserLang = nextLang;
        langListeners.forEach((listener) => listener());
      });
    },
    [],
  );

  return (
    <I18nContext.Provider
      value={{ lang, setLang, isPending, t: translations[lang] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
