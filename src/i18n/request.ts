import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LANG,
  LOCALE_COOKIE,
  isLang,
  normalizeLang,
} from "@/i18n/locales";
import { translations } from "@/i18n/translations";

async function detectRequestLang() {
  const cookieLang = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLang(cookieLang)) return cookieLang;

  const acceptLanguage = (await headers()).get("accept-language");
  return normalizeLang(acceptLanguage?.split(",")[0]?.trim()) ?? DEFAULT_LANG;
}

export default getRequestConfig(async () => {
  const locale = await detectRequestLang();

  return {
    locale,
    messages: translations[locale],
  };
});
