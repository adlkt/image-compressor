"use client";

import { useCallback, useEffect, type DragEvent, type ChangeEvent } from "react";
import { Shield, Zap, FileImage, Download } from "lucide-react";
import { useI18n } from "@/i18n";
import { useCompressor } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { FileQueue } from "@/components/file-queue";
import { SettingsBar } from "@/components/settings-bar";
import { PreviewPanel } from "@/components/preview-panel";
import { SummaryBar } from "@/components/summary-bar";

export default function Home() {
  const { t } = useI18n();
  const { files, addFiles } = useCompressor();

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const images = newFiles.filter((f) => f.type.startsWith("image/"));
      if (images.length > 0) addFiles(images);
    },
    [addFiles],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files);
      handleFiles(dropped);
    },
    [handleFiles],
  );
  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      handleFiles(selected);
      e.target.value = "";
    },
    [handleFiles],
  );

  // Paste
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) handleFiles(imageFiles);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const hasFiles = files.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {!hasFiles ? (
          /* Landing */
          <>
            <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t.hero}</h1>
            </section>

            <section className="max-w-2xl mx-auto px-6 mb-20">
              <Card
                className="p-16 text-center cursor-pointer transition-all duration-200 hover:bg-accent/50 bg-card/50"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input id="file-input" type="file" accept="image/*" multiple onChange={onFileChange} className="hidden" />
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                  <Download className="w-6 h-6 text-muted-foreground rotate-180" />
                </div>
                <p className="font-medium text-lg mb-1.5">{t.dropzone.title}</p>
                <p className="text-sm text-muted-foreground">{t.dropzone.subtitle}</p>
              </Card>
            </section>

            <section className="max-w-4xl mx-auto px-6 pb-24">
              <div className="grid sm:grid-cols-3 gap-6">
                <Card>
                  <CardContent>
                    <Shield className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-semibold mb-2">{t.features.privacy.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.features.privacy.desc}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <FileImage className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-semibold mb-2">{t.features.format.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.features.format.desc}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Zap className="w-8 h-8 text-amber-500 mb-4" />
                    <h3 className="font-semibold mb-2">{t.features.realtime.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.features.realtime.desc}</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        ) : (
          /* Editor */
          <section
            className="max-w-6xl mx-auto px-6 py-10 space-y-6"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {/* Thumbnail queue */}
            <FileQueue />

            {/* Settings */}
            <SettingsBar />

            {/* Preview */}
            <PreviewPanel />

            {/* Summary + Actions */}
            <SummaryBar />
          </section>
        )}
      </main>
    </div>
  );
}
