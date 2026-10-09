"use client";

import { useCallback, useEffect } from "react";
import { useI18n } from "@/i18n";
import { isSupportedImageInput } from "@/lib/image-input";
import { useCompressor } from "@/lib/store";
import { DropZone } from "@/components/drop-zone";
import { FileQueue } from "@/components/file-queue";
import { Footer } from "@/components/footer";
import { MeasurementStrip } from "@/components/measurement-strip";
import { Navbar } from "@/components/navbar";
import { PreviewPanel } from "@/components/preview-panel";
import { SamplePicker } from "@/components/sample-picker";
import { SettingsBar } from "@/components/settings-bar";
import { SummaryBar } from "@/components/summary-bar";

export default function Home() {
  const { t } = useI18n();
  const { files, addFiles, hydrateDefaults } = useCompressor();

  useEffect(() => {
    hydrateDefaults();
  }, [hydrateDefaults]);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const images = newFiles.filter(isSupportedImageInput);
      if (images.length > 0) addFiles(images);
    },
    [addFiles],
  );

  // 粘贴挂在 window 上，所以工作台里同样有效。
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const imageFiles = Array.from(event.clipboardData?.items ?? [])
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)
        .filter(isSupportedImageInput);
      if (imageFiles.length > 0) handleFiles(imageFiles);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const hasFiles = files.length > 0;

  return (
    <div
      className={`flex flex-col text-foreground ${
        hasFiles ? "min-h-dvh lg:h-dvh lg:overflow-hidden" : "min-h-dvh"
      }`}
    >
      <Navbar contained={!hasFiles} />

      {hasFiles ? (
        <main className="flex min-h-0 flex-1 flex-col pb-32 sm:pb-0">
          <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[19rem_minmax(0,1fr)_24rem]">
            <FileQueue />
            <PreviewPanel />
            <SettingsBar />
          </div>
          <SummaryBar />
        </main>
      ) : (
        <main className="flex-1">
          {/* 首屏：先把可验证的承诺说清楚，再给唯一的导入入口。 */}
          <section className="bg-white dark:bg-black" aria-labelledby="hero-title">
            <div className="mx-auto w-full max-w-[61rem] px-5 pt-16 pb-14 sm:px-6 sm:pt-20 lg:pt-24 lg:pb-20">
              <div className="mx-auto max-w-3xl text-center">
                  <h1
                    id="hero-title"
                    className="text-[clamp(2.75rem,8vw,5rem)] leading-[1.04] font-semibold tracking-[-0.04em]"
                  >
                    {t.title}
                  </h1>
                  <p className="text-title mx-auto mt-5 max-w-2xl font-medium text-muted-foreground">{t.hero.claim}</p>
              </div>

              <div className="mx-auto mt-8 text-center">
                  <DropZone onFiles={handleFiles} />
                  <SamplePicker onFiles={handleFiles} />
              </div>
            </div>
          </section>

          <MeasurementStrip />

          <section className="mx-auto w-full max-w-[61rem] px-5 py-20 sm:px-6 lg:py-28">
            <div className="mx-auto max-w-3xl lg:grid lg:grid-cols-[0.65fr_1.35fr] lg:gap-12">
              <h2 className="text-h2 font-semibold">
                {t.howto.title}
              </h2>
              <ul className="mt-4 max-w-[34rem] list-disc space-y-2 pl-6 text-sm text-muted-foreground lg:mt-0">
                {t.howto.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div
              id="faq"
              className="mx-auto mt-20 max-w-3xl scroll-mt-20 border-t border-border pt-20 lg:grid lg:grid-cols-[0.65fr_1.35fr] lg:gap-12"
            >
              <h2 className="text-h2 font-semibold">
                {t.faq.title}
              </h2>
              <div className="mt-4 max-w-[34rem] divide-y divide-border lg:mt-0">
                {t.faq.items.map((item) => (
                  <details key={item.q} className="group py-3 first:pt-0">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                      <span>{item.q}</span>
                      <span
                        className="text-base font-light text-muted-foreground transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pt-2 pb-1 text-sm text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {!hasFiles && <Footer />}
    </div>
  );
}
