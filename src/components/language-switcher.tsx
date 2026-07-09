"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type Lang } from "@/i18n";

const langOptions: { value: Lang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
];

export function LanguageSwitcher() {
  const { lang, setLang, isPending, t } = useI18n();

  return (
    <div className="relative group">
      <Button variant="ghost" size="icon" title={t.lang} aria-label={t.lang}>
        <Languages className="w-4 h-4" />
      </Button>
      <div
        className="invisible absolute right-0 top-full z-50 mt-1 min-w-[112px] rounded-lg bg-popover py-1 opacity-0 shadow-md ring-1 ring-foreground/10 transition-all duration-150 group-hover:visible group-hover:opacity-100"
        suppressHydrationWarning
      >
        {langOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={isPending}
            onClick={() => setLang(opt.value)}
            aria-current={lang === opt.value ? "true" : undefined}
            className={`w-full px-3 py-1.5 text-left text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${lang === opt.value ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
