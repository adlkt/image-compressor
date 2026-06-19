"use client";

import { ImageDown } from "lucide-react";
import { useI18n } from "@/i18n";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <ImageDown className="w-5 h-5" />
          {t.title}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
