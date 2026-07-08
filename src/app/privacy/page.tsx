"use client";

import { useI18n } from "@/i18n";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  const { t } = useI18n();
  const { privacyPage } = t;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        <h1 className="text-2xl font-bold mb-2">{privacyPage.title}</h1>
        <p className="text-sm text-muted-foreground mb-10">{privacyPage.intro}</p>

        <div className="space-y-8">
          {privacyPage.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-base font-semibold mb-2">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
