import { defineConfig } from "tsup";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const entry = readdirSync("src")
  .filter((f) => f.endsWith(".tsx") || f === "index.ts")
  .map((f) => `src/${f}`);

export default defineConfig({
  entry,
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  banner: { js: '"use client";' },
  external: ["react", "react-dom", "aura-ui-core", "aura-ui-core/client", "motion"]
});
