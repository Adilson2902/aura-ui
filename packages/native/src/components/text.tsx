import * as React from "react";
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { resolveColor } from "../theme/color";
import { useAura, type AuraTheme } from "../theme/provider";
import { textVariants, type FontWeightToken, type TextVariant } from "../theme/tokens";
import type { ColorToken, TextRef, RefComponent } from "../theme/types";

export type TextTone =
  | "default"
  | "muted"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "destructive"
  | "inverse";

const TONES: Record<TextTone, ColorToken> = {
  default: "surfaceForeground",
  muted: "mutedForeground",
  primary: "primary",
  accent: "accent",
  success: "success",
  warning: "warning",
  destructive: "destructive",
  inverse: "surface"
};

export type TextProps = RNTextProps & {
  /** Escala tipográfica (padrão "body"). */
  variant?: TextVariant;
  /** Tom semântico (padrão "default"). */
  tone?: TextTone;
  /** Cor livre: token (`"primary"`) ou cor crua — vence `tone`. */
  color?: ColorToken | (string & {});
  weight?: FontWeightToken;
  align?: TextStyle["textAlign"];
  italic?: boolean;
  /** Atalho p/ `numberOfLines` com reticências. */
  lines?: number;
};

/** Estilo de texto do tema — útil em componentes próprios. */
export function textStyle(
  t: AuraTheme,
  {
    variant = "body",
    tone = "default",
    color,
    weight,
    align,
    italic
  }: Pick<TextProps, "variant" | "tone" | "color" | "weight" | "align" | "italic">
): TextStyle {
  const v = textVariants[variant];
  return {
    fontSize: v.fontSize,
    lineHeight: v.lineHeight,
    letterSpacing: v.letterSpacing,
    color: color ? resolveColor(t.colors, color) : t.colors[TONES[tone]],
    ...t.font(weight ?? v.weight),
    ...(align ? { textAlign: align } : null),
    ...(italic ? { fontStyle: "italic" as const } : null)
  };
}

/** Texto do Aura UI: `<Text variant="h2" tone="muted">`. */
export const Text: RefComponent<TextProps> = React.forwardRef<TextRef, TextProps>(
  ({ variant, tone, color, weight, align, italic, lines, numberOfLines, style, ...props }, ref) => {
    const t = useAura();
    return (
      <RNText
        ref={ref}
        numberOfLines={lines ?? numberOfLines}
        style={[textStyle(t, { variant, tone, color, weight, align, italic }), style]}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export type HeadingProps = Omit<TextProps, "variant"> & {
  /** Nível visual (padrão 2). */
  level?: 1 | 2 | 3;
};

/** Título com papel de cabeçalho p/ leitores de tela. */
export const Heading: RefComponent<HeadingProps> = React.forwardRef<TextRef, HeadingProps>(
  ({ level = 2, ...props }, ref) => (
    <Text ref={ref} role="heading" variant={`h${level}` as TextVariant} {...props} />
  )
);
Heading.displayName = "Heading";
