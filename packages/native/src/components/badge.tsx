import * as React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura, type AuraTheme } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { Text } from "./text";

export type BadgeVariant = "solid" | "soft" | "outline" | "success" | "warning" | "destructive";
export type BadgeSize = "sm" | "md";

const SIZES: Record<BadgeSize, { h: number; px: number; font: number; line: number; dot: number }> =
  {
    sm: { h: 20, px: 2, font: 11, line: 14, dot: 6 },
    md: { h: 24, px: 2.5, font: 12, line: 16, dot: 6 }
  };

/** Cores do badge por variante: fundo, texto, borda e cor "forte" (usada no dot solo). */
export function badgeColors(t: AuraTheme, variant: BadgeVariant) {
  const c = t.colors;
  switch (variant) {
    case "solid":
      return { bg: c.primary, fg: c.primaryForeground, strong: c.primary };
    case "soft":
      return { bg: t.alpha(c.primary, 0.12), fg: c.primary, strong: c.primary };
    case "outline":
      return {
        bg: "transparent",
        fg: c.surfaceForeground,
        border: c.border,
        strong: c.mutedForeground
      };
    case "success":
      return { bg: t.alpha(c.success, 0.14), fg: c.success, strong: c.success };
    case "warning":
      return { bg: t.alpha(c.warning, 0.16), fg: c.warning, strong: c.warning };
    case "destructive":
      return { bg: t.alpha(c.destructive, 0.12), fg: c.destructive, strong: c.destructive };
  }
}

export type BadgeProps = ViewProps & {
  children?: React.ReactNode;
  /** Visual (padrão "soft", igual ao web). */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Ponto de status antes do texto. Sem `children`, vira só o ponto (indicador). */
  dot?: boolean;
  /** Ícone antes do texto. */
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Badge/etiqueta — 6 variantes, 2 tamanhos e `dot` de status. */
export const Badge: RefComponent<BadgeProps> = React.forwardRef<ViewRef, BadgeProps>(
  (
    { children, variant = "soft", size = "md", dot = false, icon, style, textStyle, ...props },
    ref
  ) => {
    const t = useAura();
    const s = SIZES[size];
    const v = badgeColors(t, variant);
    const empty =
      children === undefined || children === null || children === false || children === "";

    if (dot && empty) {
      const d = size === "sm" ? 8 : 10;
      return (
        <View
          ref={ref}
          style={[
            { width: d, height: d, borderRadius: t.radius.full, backgroundColor: v.strong },
            style
          ]}
          {...props}
        />
      );
    }

    return (
      <View
        ref={ref}
        style={[
          {
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: size === "sm" ? 4 : 6,
            minHeight: s.h,
            paddingHorizontal: t.space(s.px),
            borderRadius: t.radius.full,
            backgroundColor: v.bg,
            ...(v.border
              ? { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: v.border }
              : null)
          },
          style
        ]}
        {...props}
      >
        {dot ? (
          <View
            style={{ width: s.dot, height: s.dot, borderRadius: s.dot / 2, backgroundColor: v.fg }}
          />
        ) : null}
        {icon}
        {typeof children === "string" || typeof children === "number" ? (
          <Text
            weight="semibold"
            lines={1}
            style={[{ color: v.fg, fontSize: s.font, lineHeight: s.line }, textStyle]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    );
  }
);
Badge.displayName = "Badge";
