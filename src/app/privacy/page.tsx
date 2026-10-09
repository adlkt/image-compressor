"use client";

import { useI18n } from "@/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const { t } = useI18n();
  const { privacyPage } = t;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Navbar contained />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h1 className="max-w-[34rem] text-display leading-[1.15] font-semibold tracking-[-0.02em] sm:text-hero">
            {privacyPage.title}
          </h1>
          <p className="mt-6 max-w-[34rem] text-sm text-muted-foreground">
            {privacyPage.intro}
          </p>

          <div className="mt-16 border-t border-border">
            {privacyPage.sections.map((section) => (
              <section
                key={section.title}
                className="border-b border-border py-10 lg:grid lg:grid-cols-[0.6fr_1.4fr] lg:gap-10"
              >
                <h2 className="text-sm leading-[1.4] font-semibold">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-[34rem] text-sm text-muted-foreground lg:mt-0">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
