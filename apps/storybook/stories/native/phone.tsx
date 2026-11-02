import * as React from "react";
import type { Decorator } from "@storybook/react";
import { AuraProvider, AURA_THEMES, useAura, type AuraThemeName } from "aura-ui-native";

/** Moldura de celular (390×780) com o fundo do tema — o conteúdo é React Native via react-native-web. */
function Phone({ children }: { children: React.ReactNode }) {
  const t = useAura();
  return (
    <div
      style={{
        width: 390,
        height: 780,
        borderRadius: 44,
        padding: 10,
        background: t.isDark ? "#05060a" : "#111318",
        boxShadow: "0 30px 80px rgba(0,0,0,.35)"
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          overflow: "hidden",
          background: t.colors.surface,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Decorator: AuraProvider (tema do controle `auraTheme` + modo da toolbar) + moldura. */
export const withPhone: Decorator = (Story, context) => {
  const mode = (context.globals.theme as "light" | "dark") ?? "light";
  const theme = ((context.args as { auraTheme?: AuraThemeName }).auraTheme ??
    "aura") as AuraThemeName;
  return (
    <AuraProvider theme={theme} mode={mode}>
      <Phone>
        <Story />
      </Phone>
    </AuraProvider>
  );
};

/** argTypes p/ escolher o tema nas stories nativas. */
export const themeArgTypes = {
  auraTheme: {
    control: "select" as const,
    options: [...AURA_THEMES],
    description: "Tema Aura (33)"
  }
};
