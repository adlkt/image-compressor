import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    const htmlCacheHeaders = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
      {
        key: "Cloudflare-CDN-Cache-Control",
        value: "public, max-age=3600, stale-while-revalidate=86400",
      },
    ];

    return [
      { source: "/", headers: htmlCacheHeaders },
      { source: "/privacy", headers: htmlCacheHeaders },
    ];
  },
};

export default nextConfig;
