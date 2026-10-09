"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import { BASE_PATH } from "@/lib/base-path";

/**
 * 示例图。
 *
 * 每一张都是本工具自己的压缩输出，点一下 fetch 回一个 File 直接送进流程：
 * 还在犹豫的人不必先去找一张图，就能看到完整的一次压缩。
 *
 * 走 raw fetch，Next 不会自动补 basePath，得自己加。
 */
const SAMPLES = [
  {
    src: `${BASE_PATH}/samples/photo-clouds.webp`,
    name: "example-clouds.webp",
    width: 1920,
    height: 1440,
  },
  {
    src: `${BASE_PATH}/samples/photo-desert.webp`,
    name: "example-desert.webp",
    width: 1920,
    height: 1078,
  },
];

export function SamplePicker({ onFiles }: { onFiles: (files: File[]) => void }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const pick = async (sample: (typeof SAMPLES)[number]) => {
    setBusy(sample.src);
    setError(false);
    try {
      const response = await fetch(sample.src);
      if (!response.ok) throw new Error(`Sample request failed: ${response.status}`);
      const blob = await response.blob();
      onFiles([new File([blob], sample.name, { type: blob.type })]);
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center text-center sm:flex-row sm:justify-center sm:gap-3">
      <p className="text-xs text-muted-foreground">{t.hero.samples}</p>

      <ul className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:mt-0">
        {SAMPLES.map((sample, index) => (
          <li key={sample.src}>
            <button
              type="button"
              onClick={() => void pick(sample)}
              disabled={busy !== null}
              aria-label={t.hero.sampleLabels[index]}
              className="block size-11 overflow-hidden rounded-full border-2 border-white outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-ring/20 disabled:opacity-60 dark:border-black"
            >
              <img
                src={sample.src}
                alt=""
                width={sample.width}
                height={sample.height}
                className="size-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <p className="sr-only">{t.hero.samplesNote}</p>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive sm:mt-0 sm:ml-2">
          {t.hero.sampleError}
        </p>
      )}
    </div>
  );
}
