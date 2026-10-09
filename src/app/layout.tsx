import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { I18nProvider } from "@/i18n";
import { BASE_PATH } from "@/lib/base-path";

/**
 * 站点挂在 apex 下的路径上（314925.xyz/image-compressor）。
 *
 * 坑：Next **不会**给 metadata 里的资源自动补 basePath —— 实测 og:image、icon、
 * alternates 都原样输出 /og-image.png、/icon.svg，落到线上就是 404。所以下面
 * 一律写含路径的绝对 URL，这样也不会被未来版本的自动补前缀逻辑二次拼接。
 */
const SITE_ORIGIN = "https://314925.xyz";
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "图片压缩 — 浏览器端批量压缩",
    template: "%s | Image Compressor",
  },
  description:
    "免费在线图片压缩与格式转换工具，支持 iPhone HEIC/HEIF、WebP、PNG、JPEG，纯浏览器端批量处理，图片无需上传。",
  keywords: [
    "图片压缩",
    "免费图片压缩",
    "在线图片压缩",
    "image compressor",
    "compress images online",
    "free image compressor",
    "WebP",
    "PNG",
    "JPEG",
    "HEIC",
    "HEIF",
    "iPhone 照片转换",
    "批量压缩",
    "batch compression",
    "隐私安全",
    "本地压缩",
    "图片格式转换",
    "压缩工具",
    "图片尺寸调整",
  ],
  authors: [{ name: "Image Compressor" }],
  creator: "Image Compressor",
  publisher: "Image Compressor",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    title: "图片压缩 — 浏览器端批量压缩，零上传",
    description:
      "支持 iPhone HEIC/HEIF 的浏览器端批量图片压缩与格式转换，拖拽即用，零上传。",
    siteName: "Image Compressor",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "图片压缩：压缩图片不用上传。真实压缩结果从 3.48 MB 降至 168 KB。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "图片压缩 — 浏览器端批量压缩",
    description:
      "支持 iPhone HEIC/HEIF 的浏览器端批量图片压缩与格式转换，零上传，保护隐私。",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      zh: SITE_URL,
      en: SITE_URL,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Image Compressor",
              alternateName: ["图片压缩工具"],
              description:
                "纯浏览器端图片压缩与格式转换工具，支持 iPhone HEIC/HEIF、WebP、PNG、JPEG。",
              url: SITE_URL,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "All",
              isAccessibleForFree: true,
            }),
          }}
        />
        {/* FAQ structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "图片会上传到服务器吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "不会。所有压缩处理完全在你的浏览器本地完成。图片不会离开你的设备。",
                  },
                },
                {
                  "@type": "Question",
                  name: "支持哪些图片格式？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "输入支持 iPhone HEIC/HEIF，以及 JPEG、PNG、WebP 等常见格式。输出可选 WebP、PNG 或 JPEG。",
                  },
                },
                {
                  "@type": "Question",
                  name: "PNG 会保留透明背景吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "会。PNG 格式完整保留 alpha 透明通道，WebP 也支持透明。",
                  },
                },
                {
                  "@type": "Question",
                  name: "压缩会损失画质吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "可调节质量滑块控制。WebP/JPEG 是有损压缩，PNG 输出不使用质量滑块。",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ServiceWorkerRegistration />
        <I18nProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
