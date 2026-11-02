import type * as React from "react";
import type { HostInstance } from "react-native";

export type ColorTokens = {
  surface: string;
  surfaceForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  contrast: string;
  cyber: string;
};

export type ColorToken = keyof ColorTokens;

/** Gradiente pronto p/ expo-linear-gradient / react-native-linear-gradient. */
export type GradientSpec = { angle: number; colors: string[]; locations: number[] };
export type GradientName = "primary" | "accent" | "cyber" | "aurora";

export type Palette = {
  dark: boolean;
  colors: ColorTokens;
  gradients: Record<GradientName, GradientSpec>;
};

export type ThemePalettes = Record<string, { light: Palette; dark: Palette }>;

/** Tipo do ref dos componentes (instância nativa — `HostInstance` do RN ≥ 0.79). */
export type ViewRef = HostInstance;
export type TextRef = HostInstance;

/** Componente com ref p/ a instância nativa — tipo explícito p/ os .d.ts publicados. */
export type RefComponent<P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<HostInstance>
>;
