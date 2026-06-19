"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type Lang } from "@/i18n";

const langOptions: { value: Lang; label: string }[] = [
  { value: "zh", label: "中文" },
  { value: "en", label: "英语" },
  { value: "ja", label: "日语" },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="relative group">
      <Button variant="ghost" size="icon" title={t.lang}>
        <Languages className="w-4 h-4" />
      </Button>
      <div className="absolute right-0 top-full mt-1 bg-popover ring-1 ring-foreground/10 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1 min-w-[100px]" suppressHydrationWarning>
        {langOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setLang(opt.value)}
            className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${lang === opt.value ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
