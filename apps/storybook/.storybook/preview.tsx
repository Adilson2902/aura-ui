import * as React from "react";
import type { Preview, Decorator } from "@storybook/react";
import { ThemeProvider } from "@aura/core/client";
import "@aura/tailwind-preset";
import "./preview.css";

/** Sincroniza a classe `.dark` no <html> com o seletor de tema da toolbar. */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as "light" | "dark") ?? "light";
  const fullscreen = context.parameters.layout === "fullscreen";

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeProvider defaultTheme={theme}>
      <div
        data-aura-stage
        className="aura-stage text-aura-surface-foreground"
        data-fullscreen={fullscreen ? "" : undefined}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema Aura",
      defaultValue: "light",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" }
        ],
        dynamicTitle: true
      }
    }
  },
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    },
    options: {
      storySort: {
        order: ["Overview", ["Showcase"], "UI", "Effects"]
      }
    },
    backgrounds: { disable: true },
    a11y: { config: { rules: [{ id: "color-contrast", enabled: true }] } }
  },
  decorators: [withTheme]
};

export default preview;
