import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { I18nProvider } from "@/i18n";

/**
 * 一款可变字承担全部字数：宽度轴用来区分「丝印标签」与「仪器读数」，
 * 重量轴用来区分层级。CJK 落到系统字体（见 globals.css 的 --font-sans）。
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://image-compressor.314925.xyz"),
  title: {
    default: "图片压缩 — 浏览器端批量压缩，零上传 | Image Compressor",
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
    "画像圧縮",
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
    alternateLocale: ["en_US", "ja_JP"],
    title: "图片压缩 — 浏览器端批量压缩，零上传",
    description:
      "支持 iPhone HEIC/HEIF 的浏览器端批量图片压缩与格式转换，拖拽即用，零上传。",
    siteName: "Image Compressor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "图片压缩 — 浏览器端批量压缩",
    description:
      "支持 iPhone HEIC/HEIF 的浏览器端批量图片压缩与格式转换，零上传，保护隐私。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      zh: "/",
      en: "/",
      ja: "/",
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Image Compressor",
              alternateName: ["图片压缩工具", "画像圧縮ツール"],
              description:
                "纯浏览器端图片压缩与格式转换工具，支持 iPhone HEIC/HEIF、WebP、PNG、JPEG。",
              url: "https://image-compressor.314925.xyz",
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
                    text: "输入支持 iPhone HEIC/HEIF 和浏览器能够解码的静态图片格式。输出可选择 WebP、PNG 或 JPEG。",
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
