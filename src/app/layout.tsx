import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://image-compressor.314925.xyz"),
  title: {
    default: "图片压缩 — 浏览器端批量压缩，零上传 | Image Compressor",
    template: "%s | Image Compressor",
  },
  description:
    "免费在线图片压缩工具，纯浏览器端处理，无需上传。支持 WebP/AVIF/PNG/JPEG 格式转换，批量拖拽压缩，1080p/2K/4K 尺寸调整，保留透明通道。保护隐私，图片不离开你的设备。",
  keywords: [
    "图片压缩",
    "免费图片压缩",
    "在线图片压缩",
    "image compressor",
    "compress images online",
    "free image compressor",
    "画像圧縮",
    "WebP",
    "AVIF",
    "PNG",
    "JPEG",
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
      "纯浏览器端批量图片压缩。WebP/JPEG，1080p/2K/4K，拖拽即用，零上传。",
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
      "纯浏览器端批量图片压缩。WebP/JPEG，拖拽即用，零上传，保护隐私。",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
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
                    text: "输入支持所有浏览器能打开的图片格式。输出可选择 WebP、AVIF、PNG 或 JPEG。",
                  },
                },
                {
                  "@type": "Question",
                  name: "WebP 和 AVIF 有什么区别？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "AVIF 压缩率更高，同质量下体积比 WebP 小 20-30%，但编码速度较慢。WebP 兼容性更好，编码更快。",
                  },
                },
                {
                  "@type": "Question",
                  name: "PNG 会保留透明背景吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "会。PNG 格式完整保留 alpha 透明通道。WebP 和 AVIF 也支持透明。",
                  },
                },
                {
                  "@type": "Question",
                  name: "压缩会损失画质吗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "可调节质量滑块控制。WebP/JPEG/AVIF 是有损压缩（但高画质下肉眼难以分辨），PNG 是无损压缩。",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
