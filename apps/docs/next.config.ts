import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: [
    "aura-ui-core",
    "aura-ui-components",
    "aura-ui-effects",
    "aura-ui-tailwind",
    "aura-ui-three"
  ],
  eslint: { ignoreDuringBuilds: true }
};

export default nextConfig;
