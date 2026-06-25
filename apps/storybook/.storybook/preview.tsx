import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@aura/core/client";
import "@aura/tailwind-preset";
import "./preview.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "aura",
      values: [
        { name: "aura", value: "hsl(0 0% 100%)" },
        { name: "dark", value: "hsl(222 47% 7%)" }
      ]
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-w-[320px] p-4 text-aura-surface-foreground">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

export default preview;
