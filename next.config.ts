import type { NextConfig } from "next";

// Cloudflare Pages serves the static export at the domain root.
const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
