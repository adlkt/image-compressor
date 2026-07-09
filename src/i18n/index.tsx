"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useMessages } from "next-intl";
import { LOCALE_COOKIE, isLang, type Lang } from "./locales";
import type { Translations } from "./translations";

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

export function useI18n(): I18nValue {
  const router = useRouter();
  const locale = useLocale();
  const messages = useMessages();
  const [isPending, startTransition] = useTransition();
  const lang = isLang(locale) ? locale : "zh";

  const setLang = useCallback(
    (nextLang: Lang) => {
      persistLang(nextLang);
      startTransition(() => router.refresh());
    },
    [router],
  );

  return { lang, setLang, isPending, t: messages as Translations };
}
