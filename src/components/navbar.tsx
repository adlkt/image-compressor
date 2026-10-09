"use client";

import { ImageIcon } from "lucide-react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { GithubIcon } from "./github-icon";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

/**
 * 顶部导航。
 *
 * 它不再承担页面标题：首页的 h1 在首屏左栏里（见 page.tsx），
 * 这里只留一个回首页的品牌链接，避免同一页面出现两个 h1。
 *
 * `contained` 决定导航是否跟内容用同一个容器宽度：说服性版面（首页、
 * 隐私、条款）跟内容对齐，工作台则不收边——那里整个视口都是画布。
 */
export function Navbar({
  contained = false,
}: {
  contained?: boolean;
}) {
  const { t } = useI18n();

  const returnHome = (event: MouseEvent<HTMLAnchorElement>) => {
    const { files, removeFile } = useCompressor.getState();
    if (files.length > 0 && !window.confirm(t.controls.discardBatchConfirm)) {
      event.preventDefault();
      return;
    }
    [...files].forEach((file) => removeFile(file.id));
  };

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-black/[0.08] bg-white/88 backdrop-blur-xl dark:border-white/[0.12] dark:bg-black/80">
      <nav
        className={`flex h-13 w-full items-center justify-between gap-4 px-4 sm:px-6 ${
          contained ? "mx-auto max-w-[61rem]" : ""
        }`}
        aria-label={t.title}
      >
        <div className="flex min-w-0 items-baseline">
          <Link
            href="/"
            onClick={returnHome}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {/* 品牌标记：与 favicon（src/app/icon.svg）同一个字形，都是圆角方块里的图片图标。 */}
            <span className="flex size-7 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
              <ImageIcon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="text-xs leading-none font-semibold tracking-[-0.01em]">
              {t.title}
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <a
            href="https://github.com/adlkt/image-compressor"
            target="_blank"
            rel="noreferrer"
            className="flex size-11 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            aria-label="GitHub"
          >
            <GithubIcon className="size-[18px]" />
          </a>
          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
