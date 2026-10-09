"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";

const GITHUB_ISSUES_URL = "https://github.com/adlkt/image-compressor/issues";

export function Footer() {
  const { t } = useI18n();

  const links = [
    { href: "/terms", label: t.footerTerms, external: false },
    { href: "/privacy", label: t.footerPrivacy, external: false },
    { href: GITHUB_ISSUES_URL, label: "GitHub Issues", external: true },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* 三句主张逐句列出，不拼成一条中圆点串 */}
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {t.footerClaims.map((claim) => (
            <li key={claim} className="text-xs leading-[1.5] text-muted-foreground">
              {claim}
            </li>
          ))}
        </ul>

        <nav className="flex flex-wrap items-center divide-x divide-border">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 text-xs leading-[1.5] text-muted-foreground transition-colors outline-none last:pr-0 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 text-xs leading-[1.5] text-muted-foreground transition-colors outline-none last:pr-0 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
