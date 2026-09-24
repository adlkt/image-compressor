"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { LockKeyhole } from "lucide-react";
import { useI18n } from "@/i18n";
import { isSupportedImageInput } from "@/lib/image-input";
import { useCompressor, type RecipeId } from "@/lib/store";
import { FileQueue } from "@/components/file-queue";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PresetSelector } from "@/components/preset-selector";
import { PreviewPanel } from "@/components/preview-panel";
import { RangeGauge } from "@/components/range-gauge";
import { SettingsBar } from "@/components/settings-bar";
import { SummaryBar } from "@/components/summary-bar";

export default function Home() {
  const { t } = useI18n();
  const { files, addFiles, hydrateDefaults, defaultTargetBytes, activeRecipeId } =
    useCompressor();
  const [dragOver, setDragOver] = useState(false);

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

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      handleFiles(Array.from(event.dataTransfer.files));
    },
    [handleFiles],
  );

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      handleFiles(Array.from(event.target.files ?? []));
      event.target.value = "";
    },
    [handleFiles],
  );

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

  const presetName: Record<RecipeId, string> = {
    web: t.presets.presetWeb,
    social: t.presets.presetSocial,
    ecommerce: t.presets.presetEcommerce,
    quality: t.presets.presetMax,
    custom: t.controls.custom,
  };

  return (
    <div
      className={`flex flex-col bg-background text-foreground ${
        hasFiles ? "min-h-dvh lg:h-dvh lg:overflow-hidden" : "min-h-dvh"
      }`}
    >
      <Navbar heading={!hasFiles} />

      {hasFiles ? (
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_19rem]">
            <FileQueue />
            <PreviewPanel />
            <SettingsBar />
          </div>
          <SummaryBar />
        </main>
      ) : (
        <main className="flex-1">
          {/* 仪器正面：显示在上，控制在显示之下 */}
          <section className="border-b border-border">
            <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-9">
              <RangeGauge
                original={null}
                compressed={null}
                target={defaultTargetBytes}
                targetLabel={presetName[activeRecipeId]}
              />
              <PresetSelector className="mt-9" />
            </div>
          </section>

          {/* 进料口：整条带都是投放区，四角是机器的对位标记 */}
          <section className="border-b border-border">
            <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6">
              <label
                htmlFor="file-input"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative flex cursor-pointer flex-col items-center justify-center border px-6 py-10 text-center outline-none transition-colors focus-within:ring-2 focus-within:ring-ring/40 ${
                  dragOver
                    ? "border-primary bg-primary/[0.06]"
                    : "border-border hover:border-foreground/30 hover:bg-accent/40"
                }`}
              >
                <Corner className="left-0 top-0 border-l border-t" active={dragOver} />
                <Corner className="right-0 top-0 border-r border-t" active={dragOver} />
                <Corner className="bottom-0 left-0 border-b border-l" active={dragOver} />
                <Corner className="bottom-0 right-0 border-b border-r" active={dragOver} />

                <span className="inline-flex h-10 items-center rounded-[3px] bg-primary px-5 text-sm font-medium text-primary-foreground">
                  {t.controls.add}
                </span>
                <span className="mt-4 text-sm text-muted-foreground">
                  {t.dropzone.paste}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <LockKeyhole className="size-3" aria-hidden="true" />
                  {t.features.privacy.desc}
                </span>

                <input
                  id="file-input"
                  type="file"
                  accept="image/*,.heic,.heif"
                  multiple
                  onChange={onFileChange}
                  className="sr-only"
                />
              </label>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span data-numeric className="text-[11px] leading-5 text-muted-foreground">
                  {t.description}
                </span>
                <span data-silk className="text-[11px] leading-5 text-muted-foreground">
                  {t.downloadZip} / {t.downloadIndividual}
                </span>
              </div>
            </div>
          </section>

          {/* 说明与常见问题：给爬虫和真人共用的一段正文 */}
          <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="max-w-2xl text-pretty text-[0.9375rem] leading-7 text-muted-foreground">
              {t.about}
            </p>

            <dl className="mt-10 grid gap-x-12 gap-y-0 border-t border-border sm:grid-cols-3">
              {(
                [
                  t.features.privacy,
                  t.features.format,
                  t.features.realtime,
                ] as const
              ).map((feature) => (
                <div key={feature.title} className="border-b border-border py-4 sm:py-5">
                  <dt className="text-xs font-medium">{feature.title}</dt>
                  <dd className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {feature.desc}
                  </dd>
                </div>
              ))}
            </dl>

            <div
              id="faq"
              className="mt-12 scroll-mt-20 border-t border-border pt-8 sm:grid sm:grid-cols-[0.6fr_1.4fr] sm:gap-12"
            >
              <h2 data-silk className="panel-label">
                {t.faq.title}
              </h2>
              <div className="mt-3 divide-y divide-border sm:mt-0">
                {t.faq.items.map((item) => (
                  <details key={item.q} className="group py-3 first:pt-0">
                    <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                      <span>{item.q}</span>
                      <span
                        className="text-base font-light text-muted-foreground transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-1 pt-2 text-sm leading-6 text-muted-foreground">
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

/** 进料口四角的对位标记：机器上的记号，不是装饰 */
function Corner({ className, active }: { className: string; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute size-3 transition-colors ${
        active ? "border-primary" : "border-foreground/35"
      } ${className}`}
    />
  );
}
