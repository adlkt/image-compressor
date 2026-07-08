"use client";

import { ImageDown } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar() {
  const { t } = useI18n();

  const returnHome = () => {
    const { files, removeFile } = useCompressor.getState();
    [...files].forEach((file) => removeFile(file.id));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          onClick={returnHome}
          className="flex items-center gap-2.5 rounded-lg text-sm font-semibold tracking-tight outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${t.title} · Home`}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <ImageDown className="size-4" />
          </span>
          <span>{t.title}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
