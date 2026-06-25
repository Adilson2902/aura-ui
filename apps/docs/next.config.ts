import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aura/core", "@aura/ui", "@aura/effects", "@aura/tailwind-preset"]
};

export default nextConfig;
