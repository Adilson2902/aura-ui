import { defineConfig } from "tsup";
import { readdirSync } from "node:fs";

const entry = [
  "src/index.ts",
  ...readdirSync("src")
    .filter((f) => f.endsWith(".tsx") && f !== "index.ts")
    .map((f) => `src/${f}`)
];

export default defineConfig({
  entry,
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  external: [
    "react",
    "react-dom",
    "aura-ui-core",
    "aura-ui-core/client",
    "class-variance-authority",
    "@radix-ui/react-slot",
    "@radix-ui/react-label",
    "@radix-ui/react-switch",
    "@radix-ui/react-tabs",
    "@radix-ui/react-dialog",
    "@radix-ui/react-tooltip",
    "@radix-ui/react-select",
    "@radix-ui/react-accordion",
    "@radix-ui/react-avatar",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-progress",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-slider"
  ]
});
