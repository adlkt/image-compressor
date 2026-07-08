"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { ArrowDown, Check, ImagePlus, LockKeyhole } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FileQueue } from "@/components/file-queue";
import { SettingsBar } from "@/components/settings-bar";
import { PreviewPanel } from "@/components/preview-panel";
import { SummaryBar } from "@/components/summary-bar";

export default function Home() {
  const { t } = useI18n();
  const { files, addFiles } = useCompressor();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const images = newFiles.filter((file) => file.type.startsWith("image/"));
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
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);
      if (imageFiles.length > 0) handleFiles(imageFiles);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const hasFiles = files.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {!hasFiles ? (
        <main>
          <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              <LockKeyhole className="size-3.5" />
              {t.features.privacy.desc}
            </div>

            <div className="max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
                {t.hero}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {t.heroSub}
              </p>
            </div>

            <label
              htmlFor="file-input"
              className={`group relative mt-10 flex w-full max-w-3xl cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] transition-all sm:py-20 ${
                dragOver
                  ? "border-foreground bg-accent/70 ring-4 ring-foreground/5"
                  : "border-border/90 hover:border-foreground/30 hover:bg-accent/30"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="pointer-events-none absolute inset-0 workspace-grid opacity-40" />
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg transition-transform group-hover:-translate-y-1">
                <ImagePlus className="size-6" />
              </div>
              <p className="relative mt-5 text-lg font-semibold">
                {t.dropzone.title}
              </p>
              <p className="relative mt-2 text-sm text-muted-foreground">
                {t.dropzone.subtitle}
              </p>
              <div className="relative mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border bg-background/80 px-2.5 py-1.5">
                  WebP
                </span>
                <span className="rounded-md border bg-background/80 px-2.5 py-1.5">
                  80%
                </span>
                <span className="rounded-md border bg-background/80 px-2.5 py-1.5">
                  1920 px
                </span>
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={onFileChange}
                className="sr-only"
              />
            </label>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              {[
                t.features.privacy.title,
                t.features.format.title,
                t.features.realtime.title,
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-16 grid w-full max-w-3xl gap-4 border-t pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {t.summary.totalOriginal}
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold">4.8 MB</p>
              </div>
              <ArrowDown className="size-5 rotate-0 text-muted-foreground sm:-rotate-90" />
              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {t.summary.totalCompressed}
                </p>
                <p className="mt-1 font-mono text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  620 KB <span className="text-sm">-87%</span>
                </p>
              </div>
            </div>
          </section>

          <section className="border-t bg-muted/20 px-5 py-16 sm:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="mb-8 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t.faq.title}
              </p>
              <div className="divide-y border-y">
                {t.faq.items.slice(0, 3).map((item) => (
                  <details key={item.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                      {item.q}
                      <span className="text-lg font-light text-muted-foreground transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pt-3 text-sm leading-6 text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main
          className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-7"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
        >
          <div className="space-y-4">
            <FileQueue />
            <SettingsBar />
            <PreviewPanel />
            <SummaryBar />
          </div>
        </main>
      )}

      {!hasFiles && <Footer />}
    </div>
  );
}
