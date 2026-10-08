import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

/** Aliases @aura/ui/<component> gerados dinamicamente p/ todos os componentes. */
const uiDir = path.join(root, "packages/ui/src");
const uiAliases = Object.fromEntries(
  fs
    .readdirSync(uiDir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [`@aura/ui/${f.replace(/\.tsx$/, "")}`, path.join(uiDir, f)])
);

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          ...uiAliases,
          "@aura/effects": path.join(root, "packages/effects/src"),
          "@aura/core": path.join(root, "packages/core/src"),
          "@aura/core/client": path.join(root, "packages/core/src/client.ts"),
          "@aura/tailwind-preset": path.join(root, "packages/tailwind-preset/src/preset.css"),
          "@aura/core/styles/tokens.css": path.join(root, "packages/core/styles/tokens.css"),
          "@aura/core/styles/primitives.css": path.join(root, "packages/core/styles/primitives.css"),
          "@aura/core/styles/themes.css": path.join(root, "packages/core/styles/themes.css")
        }
      }
    });
  }
};

export default config;
