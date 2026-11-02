import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useAura } from "../theme/provider";
import type { GradientName, GradientSpec } from "../theme/types";

/** Ângulo CSS (135deg) → pontos start/end do LinearGradient (0–1). */
export function angleToPoints(angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = Math.cos(rad) / 2;
  const y = Math.sin(rad) / 2;
  return { start: { x: 0.5 - x, y: 0.5 - y }, end: { x: 0.5 + x, y: 0.5 + y } };
}

export type GradientProps = {
  /** Gradiente do tema ("primary", "accent", "cyber", "aurora") ou um spec próprio. */
  gradient?: GradientName | GradientSpec;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Fundo em gradiente do tema. Usa o `LinearGradient` passado ao AuraProvider
 * (expo-linear-gradient / react-native-linear-gradient); sem ele, cai na
 * primeira cor do gradiente (cor sólida da marca).
 */
export function Gradient({ gradient = "primary", style, children }: GradientProps) {
  const t = useAura();
  const spec = typeof gradient === "string" ? t.gradients[gradient] : gradient;
  const LinearGradient = t.components.LinearGradient;
  if (!LinearGradient) {
    return <View style={[{ backgroundColor: spec.colors[0] }, style]}>{children}</View>;
  }
  const { start, end } = angleToPoints(spec.angle);
  return (
    <LinearGradient
      colors={spec.colors}
      locations={spec.locations}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

export type GlassProps = {
  /** Intensidade do blur (0–100, padrão 40). */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Superfície de vidro. Usa o `BlurView` passado ao AuraProvider (expo-blur);
 * sem ele, vira uma superfície translúcida com borda clara.
 */
export function Glass({ intensity = 40, style, children }: GlassProps) {
  const t = useAura();
  const BlurView = t.components.BlurView;
  const base: ViewStyle = {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: t.alpha("#ffffff", t.isDark ? 0.15 : 0.5),
    backgroundColor: t.alpha(t.colors.surface, BlurView ? 0.35 : t.isDark ? 0.82 : 0.78)
  };
  if (!BlurView) return <View style={[base, style]}>{children}</View>;
  return (
    <BlurView intensity={intensity} tint={t.isDark ? "dark" : "light"} style={[base, style]}>
      {children}
    </BlurView>
  );
}
