"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const SUPPORT_EMAIL = "a17637040895@gmail.com";
const GITHUB_ISSUES_URL = "https://github.com/adlkt/image-compressor/issues";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/50 py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        <p className="text-xs text-muted-foreground">{t.footer}</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.footerTerms}
          </Link>
          <span className="text-xs text-muted-foreground/40">·</span>
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.footerPrivacy}
          </Link>
          <span className="text-xs text-muted-foreground/40">·</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.footerContact}
          </a>
          <span className="text-xs text-muted-foreground/40">·</span>
          <a
            href={GITHUB_ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub Issues
          </a>
        </nav>
      </div>
    </footer>
  );
}
