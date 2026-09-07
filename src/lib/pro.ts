"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** 免费版单批上限 */
export const FREE_BATCH_LIMIT = 10;

/** 结账链接（Creem 生成，公开地址；可用 NEXT_PUBLIC_BUY_URL 覆盖） */
export const BUY_URL =
  process.env.NEXT_PUBLIC_BUY_URL ??
  "https://www.creem.io/payment/prod_3M7VsuFF0l5wOvV6GmslFx";

// 收款平台说明（2026-09 核验）：
// - Lemon Squeezy：2026 起不接受中国大陆新主体，排除
// - Creem（首选）：3.9% + $0.40，大陆个人身份证可注册，支付宝提现，内置 License 分发
// - 备选：Dodo Payments（4% + $0.40，大陆个人可申请）
// 激活验证接口在注册平台后接入（Creem 的 license validate 需服务端 API key，
// 届时加一个 Next.js route handler 代理，不在前端暴露 key）。

export type PaywallReason = "batch" | "avif";

type LicenseState = {
  isPro: boolean;
  licenseKey: string | null;
  pricingOpen: boolean;
  paywallReason: PaywallReason;

  openPricing: (reason?: PaywallReason) => void;
  closePricing: () => void;
  activate: (key: string) => Promise<boolean>;
  deactivate: () => void;
};

export const useLicense = create<LicenseState>()(
  persist(
    (set) => ({
      isPro: false,
      licenseKey: null,
      pricingOpen: false,
      paywallReason: "batch",

      openPricing: (reason = "batch") =>
        set({ pricingOpen: true, paywallReason: reason }),
      closePricing: () => set({ pricingOpen: false }),

      activate: async (key: string) => {
        const trimmed = key.trim();
        if (!trimmed) return false;

        // 开发环境：任意 ≥8 位 key 即可解锁，方便本地调试付费墙
        if (process.env.NODE_ENV === "development") {
          if (trimmed.length < 8) return false;
          set({ isPro: true, licenseKey: trimmed, pricingOpen: false });
          return true;
        }

        try {
          // 服务端持 Creem API key 做 license 激活验证，前端不暴露密钥
          const res = await fetch("/api/license/activate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ license_key: trimmed }),
          });
          const data = await res.json();
          if (data?.valid) {
            set({ isPro: true, licenseKey: trimmed, pricingOpen: false });
            return true;
          }
        } catch {
          // 网络异常按未激活处理
        }
        return false;
      },

      deactivate: () => set({ isPro: false, licenseKey: null }),
    }),
    {
      name: "image-compressor:license",
      partialize: (state) => ({ isPro: state.isPro, licenseKey: state.licenseKey }),
    },
  ),
);
