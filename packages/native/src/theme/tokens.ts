import type { TextStyle, ViewStyle } from "react-native";

/** Escala de espaçamento: `p={4}` = 16px (passo de 4px, aceita meio passo: 0.5, 1.5…). */
export const SPACE_UNIT = 4;
export const space = (n: number) => n * SPACE_UNIT;

export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "full";

export const radiusScale = (base: number): Record<RadiusToken, number> => ({
  none: 0,
  sm: Math.round(base * 0.57),
  md: base,
  lg: Math.round(base * 1.43),
  xl: Math.round(base * 2),
  full: 9999
});

export type FontWeightToken = "regular" | "medium" | "semibold" | "bold";

export const fontWeights: Record<FontWeightToken, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
};

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "title"
  | "body"
  | "bodySm"
  | "label"
  | "caption";

export const textVariants: Record<
  TextVariant,
  { fontSize: number; lineHeight: number; weight: FontWeightToken; letterSpacing?: number }
> = {
  display: { fontSize: 36, lineHeight: 42, weight: "bold", letterSpacing: -0.8 },
  h1: { fontSize: 30, lineHeight: 36, weight: "bold", letterSpacing: -0.5 },
  h2: { fontSize: 24, lineHeight: 30, weight: "semibold", letterSpacing: -0.3 },
  h3: { fontSize: 20, lineHeight: 26, weight: "semibold" },
  title: { fontSize: 17, lineHeight: 22, weight: "semibold" },
  body: { fontSize: 16, lineHeight: 24, weight: "regular" },
  bodySm: { fontSize: 14, lineHeight: 20, weight: "regular" },
  label: { fontSize: 14, lineHeight: 18, weight: "medium" },
  caption: { fontSize: 12, lineHeight: 16, weight: "regular" }
};

export type ShadowLevel = 0 | 1 | 2 | 3 | 4 | 5;

/** Elevação física (iOS shadow* + Android elevation), espelha --aura-elevation-1..5. */
export function shadow(level: ShadowLevel, dark: boolean): ViewStyle {
  if (level === 0) return {};
  const spec = [
    null,
    { y: 1, r: 2, o: 0.06, e: 1 },
    { y: 4, r: 12, o: 0.08, e: 3 },
    { y: 12, r: 32, o: 0.12, e: 6 },
    { y: 20, r: 48, o: 0.16, e: 10 },
    { y: 32, r: 64, o: 0.2, e: 16 }
  ][level]!;
  return {
    shadowColor: "#0f1729",
    shadowOffset: { width: 0, height: spec.y },
    // no escuro a sombra precisa de mais densidade p/ aparecer
    shadowOpacity: dark ? Math.min(spec.o * 3, 0.6) : spec.o,
    shadowRadius: spec.r / 2,
    elevation: spec.e
  };
}

export const durations = { fast: 120, base: 240, slow: 400 } as const;
