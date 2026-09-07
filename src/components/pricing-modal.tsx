"use client";

import { useEffect, useState } from "react";
import { Check, Crown, KeyRound, Loader2, Lock, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { useLicense, BUY_URL, FREE_BATCH_LIMIT } from "@/lib/pro";
import { Button } from "@/components/ui/button";

export function PricingModal() {
  const { t } = useI18n();
  const { pricingOpen, paywallReason, closePricing, activate, isPro } =
    useLicense();
  const [key, setKey] = useState("");
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pricingOpen) {
      setKey("");
      setError(false);
      setActivating(false);
    }
  }, [pricingOpen]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePricing();
    };
    if (pricingOpen) window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [pricingOpen, closePricing]);

  if (!pricingOpen || isPro) return null;

  const reason = t.pro[paywallReason];

  const handleActivate = async () => {
    setActivating(true);
    setError(false);
    const ok = await activate(key);
    setActivating(false);
    if (!ok) setError(true);
  };

  const handleBuy = () => {
    if (BUY_URL) window.open(BUY_URL, "_blank", "noopener");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={closePricing}
      role="dialog"
      aria-modal="true"
      aria-label={t.pro.title}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePricing}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          <Lock className="size-3" />
          PRO
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{t.pro.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{reason.desc}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {/* 免费版 */}
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">{t.pro.freeTitle}</p>
            <p className="mt-1 font-mono text-2xl font-semibold">$0</p>
            <ul className="mt-3 space-y-2">
              {t.pro.freeFeatures.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative rounded-xl border border-emerald-500/40 bg-emerald-500/[0.04] p-4">
            <div className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white dark:bg-emerald-500 dark:text-neutral-950">
              <Crown className="size-3" />
              PRO
            </div>
            <p className="text-sm font-medium">{t.pro.proTitle}</p>
            <p className="mt-1 font-mono text-2xl font-semibold">
              {t.pro.price}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {t.pro.priceNote}
              </span>
            </p>
            <ul className="mt-3 space-y-2">
              {t.pro.proFeatures.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-xs">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleBuy}
          className="mt-5 min-h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
        >
          <Crown className="size-4" />
          {t.pro.cta}
        </Button>

        <div className="mt-5 border-t pt-4">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <KeyRound className="size-3.5" />
            {t.pro.licenseLabel}
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleActivate();
              }}
              placeholder={t.pro.licensePlaceholder}
              className="h-9 flex-1 rounded-md border bg-background px-3 font-mono text-xs outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleActivate}
              disabled={activating || key.trim().length === 0}
              className="min-h-9"
            >
              {activating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t.pro.activate
              )}
            </Button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              {t.pro.invalid}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
