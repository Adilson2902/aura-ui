import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

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
          "@aura/ui/button": path.join(root, "packages/ui/src/button.tsx"),
          "@aura/ui/card": path.join(root, "packages/ui/src/card.tsx"),
          "@aura/ui/input": path.join(root, "packages/ui/src/input.tsx"),
          "@aura/effects": path.join(root, "packages/effects/src"),
          "@aura/core": path.join(root, "packages/core/src"),
          "@aura/core/client": path.join(root, "packages/core/src/client.ts"),
          "@aura/tailwind-preset": path.join(root, "packages/tailwind-preset/src/preset.css"),
          "@aura/core/styles/tokens.css": path.join(root, "packages/core/styles/tokens.css"),
          "@aura/core/styles/primitives.css": path.join(root, "packages/core/styles/primitives.css")
        }
      }
    });
  }
};

export default config;
