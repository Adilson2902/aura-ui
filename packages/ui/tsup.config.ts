import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/button.tsx", "src/card.tsx", "src/input.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@aura/core", "@radix-ui/react-slot"]
});
