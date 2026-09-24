"use client";

import { Code2, ImageDown } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

/**
 * 铭牌。
 *
 * 首页上它就是页面的 h1——机器叫什么、干什么用，一行说完，
 * 不在下面再摆一个更大的同名标题。进入工作台后退回普通铭牌。
 */
export function Navbar({ heading = false }: { heading?: boolean }) {
  const { t } = useI18n();

  const returnHome = () => {
    const { files, removeFile } = useCompressor.getState();
    [...files].forEach((file) => removeFile(file.id));
  };

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-background/85 backdrop-blur">
      <nav
        className={`flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6 ${
          heading ? "mx-auto max-w-5xl" : ""
        }`}
        aria-label="Primary"
      >
        <div className="flex min-w-0 items-baseline gap-3">
          <Link
            href="/"
            onClick={returnHome}
            className="flex min-h-9 shrink-0 items-center gap-2 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <span className="flex size-6 items-center justify-center rounded-[3px] bg-foreground text-background">
              <ImageDown className="size-3.5" aria-hidden="true" />
            </span>
            {heading ? (
              <h1
                data-readout
                className="text-[0.9375rem] leading-none font-semibold tracking-[-0.01em]"
              >
                {t.title}
              </h1>
            ) : (
              <span className="text-sm leading-none font-semibold tracking-[-0.01em]">
                {t.title}
              </span>
            )}
          </Link>

          {heading && (
            <span
              data-silk
              className="hidden truncate text-xs text-muted-foreground lg:inline"
            >
              {t.tagline}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {heading && (
            <a
              href="#faq"
              className="hidden min-h-9 items-center rounded-[3px] px-2.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 sm:flex"
            >
              {t.faq.title}
            </a>
          )}
          <a
            href="https://github.com/adlkt/image-compressor"
            target="_blank"
            rel="noreferrer"
            className="flex size-9 items-center justify-center rounded-[3px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label="GitHub"
          >
            <Code2 className="size-[18px]" aria-hidden="true" />
          </a>
          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
