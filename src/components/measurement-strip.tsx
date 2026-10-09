"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n";
import { BASE_PATH } from "@/lib/base-path";
import { formatSize } from "@/lib/format";

/**
 * 首屏下方那条真实读数。
 *
 * 每一个数字都来自一次真实压缩：把 public/samples/photo-clouds.webp 的
 * 原始 2000×1500 PNG 交给产品自己的压缩流程走一遍，取 worker 回传的
 * blob 字节数与耗时。测量条件（参数、环境、日期）一并列出——
 * 不披露条件的数字只是装饰。
 *
 * 条件本身摊成规格格：参数与环境各自成格，不拼成一句话。
 */
const MEASURED = {
  sourceWidth: 2000,
  sourceHeight: 1500,
  sourceBytes: 3_649_429,
  outputWidth: 1920,
  outputHeight: 1440,
  outputBytes: 172_382,
  format: "WebP",
  quality: 80,
  maxWidth: 1920,
  targetBytes: 512_000,
  elapsedMs: 237,
  browser: "Chrome 154",
  os: "macOS",
  date: "2026-09-24",
};

export function MeasurementStrip() {
  const { t } = useI18n();

  return (
    <section className="bg-[#f5f5f7] py-14 dark:bg-[#101010] sm:py-20" aria-labelledby="measure-title">
      <div className="mx-auto w-full max-w-[61rem] px-5 sm:px-6">
        <h2 id="measure-title" className="text-center text-[2rem] font-semibold tracking-[-0.03em] sm:text-[3rem]">
          {t.measure.title}
        </h2>

        <div className="relative mt-10 overflow-hidden rounded-[1.75rem] bg-black sm:mt-14">
          <img
            src={`${BASE_PATH}/samples/photo-clouds.webp`}
            alt=""
            width={MEASURED.sourceWidth}
            height={MEASURED.sourceHeight}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/72 px-5 py-5 text-white backdrop-blur-md sm:flex sm:items-end sm:justify-between sm:px-8 sm:py-7">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm text-white/70">{t.measure.sample}</span>
              <span data-numeric className="text-readout font-semibold tracking-[-0.03em]">
                {formatSize(MEASURED.sourceBytes)}
              </span>
              <span aria-hidden="true" className="text-white/50">→</span>
              <span data-numeric className="text-readout font-semibold tracking-[-0.03em]">
                {formatSize(MEASURED.outputBytes)}
              </span>
            </p>
            <span data-numeric className="text-readout mt-2 block font-semibold text-[#30d158] sm:mt-0">-95%</span>
          </div>
        </div>

        <details className="group mx-auto mt-5 max-w-3xl border-t border-black/10 dark:border-white/15">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/30">
            {t.measure.params}
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
        <dl className="grid gap-x-10 gap-y-6 border-t border-black/10 py-6 dark:border-white/15 sm:grid-cols-2 lg:grid-cols-3">
          <Condition
            label={t.measure.params}
            className="sm:col-span-2 lg:col-span-3"
          >
            <SpecGroup>
              <Spec label={t.measure.preset} value={t.presets.presetWeb} />
              <Spec label={t.measure.format} value={MEASURED.format} />
              <Spec label={t.measure.quality} value={String(MEASURED.quality)} />
              <Spec label={t.measure.maxEdge} value={`${MEASURED.maxWidth}px`} />
              <Spec label={t.measure.target} value={formatSize(MEASURED.targetBytes)} />
            </SpecGroup>
          </Condition>

          <Condition
            label={t.measure.original}
            value={`${MEASURED.sourceWidth} × ${MEASURED.sourceHeight} PNG`}
          />
          <Condition
            label={t.measure.output}
            value={`${MEASURED.outputWidth} × ${MEASURED.outputHeight} ${MEASURED.format}`}
          />
          <Condition label={t.measure.elapsed} value={`${MEASURED.elapsedMs} ms`} />
          <Condition label={t.measure.date} value={MEASURED.date} />
          <Condition label={t.measure.environment} className="sm:col-span-2 lg:col-span-1">
            <SpecGroup>
              <Spec label={t.measure.browser} value={MEASURED.browser} />
              <Spec label={t.measure.os} value={MEASURED.os} />
            </SpecGroup>
          </Condition>
        </dl>
        </details>
      </div>
    </section>
  );
}

/** 一格测量条件：标签 13px，值 15px——数字比同级文字大一号。 */
function Condition({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd data-numeric className="mt-1 text-sm leading-[1.4]">
        {value ?? children}
      </dd>
    </div>
  );
}

/** 一组规格格：每个参数占一格，横向排开，窄屏自动折行。 */
function SpecGroup({ children }: { children: ReactNode }) {
  return <span className="flex flex-wrap gap-x-10 gap-y-4">{children}</span>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span data-numeric className="text-sm leading-[1.4]">
        {value}
      </span>
    </span>
  );
}
