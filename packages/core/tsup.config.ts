import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    external: ["react", "react-dom"]
  },
  {
    entry: ["src/client.ts"],
    format: ["esm", "cjs"],
    dts: true,
    external: ["react", "react-dom"],
    banner: { js: '"use client";' }
  }
]);
