import type { NextConfig } from "next";

/**
 * 站点挂在 apex 下的路径上（314925.xyz/image-compressor），所以构建时必须走 basePath：
 * next/link 的 href 与 metadata 里的相对资源会自动带上前缀，但 raw fetch 和
 * service worker 拿不到这层前缀，靠 env 注入（见 src/lib/base-path.ts）。
 *
 * 本地 dev 不带前缀（localhost:3000 直出首页），只有 build/export 时注入。
 * `next build` 强制 NODE_ENV=production，判断可靠。
 *
 * 原先这里的 headers() 起两个作用：给 HTML 定 Cache-Control 与
 * Cloudflare-CDN-Cache-Control。静态导出不支持 headers()，这两条搬到
 * Worker 里下发（见 worker/index.js 的 withHtmlCache）。
 */
const basePath =
  process.env.NODE_ENV === "development" ? "" : "/image-compressor";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  basePath,
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
