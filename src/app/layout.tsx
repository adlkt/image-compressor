import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n";

export const metadata: Metadata = {
  title: {
    default: "图片压缩 — 浏览器端批量压缩，零上传 | Image Compressor",
    template: "%s | Image Compressor",
  },
  description:
    "纯浏览器端图片压缩工具，支持批量拖拽、WebP/JPEG 转换、1080p/2K/4K 尺寸调整。零上传，保护隐私。Client-side image compression. ブラウザ内で画像圧縮。",
  keywords: [
    "图片压缩",
    "image compressor",
    "画像圧縮",
    "WebP",
    "JPEG",
    "批量压缩",
    "batch compression",
    "online image compressor",
    "free image compressor",
    "privacy",
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
      "纯浏览器端批量图片压缩。WebP/JPEG，1080p/2K/4K，拖拽即用，零上传。",
    siteName: "Image Compressor",
  },
  twitter: {
    card: "summary_large_image",
    title: "图片压缩 — 浏览器端批量压缩",
    description:
      "纯浏览器端批量图片压缩。WebP/JPEG，拖拽即用，零上传，保护隐私。",
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
    <html lang="zh" suppressHydrationWarning>
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
                "纯浏览器端图片压缩工具，支持批量拖拽、WebP/JPEG 转换。Client-side image compression tool. ブラウザ内で画像圧縮。",
              url: "https://image-compressor.314925.xyz",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
