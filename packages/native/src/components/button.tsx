import * as React from "react";
import type { ViewRef, RefComponent } from "../theme/types";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura, type AuraTheme } from "../theme/provider";
import type { RadiusToken } from "../theme/tokens";
import { PressableScale, type PressableScaleProps } from "./pressable";
import { Glass, Gradient } from "./surfaces";
import { Text } from "./text";

export type ButtonVariant =
  | "solid"
  | "soft"
  | "outline"
  | "ghost"
  | "accent"
  | "destructive"
  | "link"
  | "gradient"
  | "glass";

export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const SIZES: Record<ButtonSize, { h: number; px: number; font: number; gap: number }> = {
  sm: { h: 36, px: 12, font: 14, gap: 6 },
  md: { h: 44, px: 16, font: 15, gap: 8 },
  lg: { h: 52, px: 20, font: 17, gap: 10 },
  icon: { h: 44, px: 0, font: 15, gap: 0 },
  "icon-sm": { h: 36, px: 0, font: 14, gap: 0 }
};

export type ButtonColors = {
  bg: string;
  fg: string;
  border?: string;
  opacity?: number;
  shadow?: 2 | 3;
};

/** Cores de fundo/texto/borda por variante (também usado por IconButton e Chips). */
export function buttonColors(t: AuraTheme, variant: ButtonVariant, pressed: boolean): ButtonColors {
  const c = t.colors;
  const onBrand = { opacity: pressed ? 0.88 : 1 };
  switch (variant) {
    case "solid":
      return { bg: c.primary, fg: c.primaryForeground, ...onBrand, shadow: 2 as const };
    case "accent":
      return { bg: c.accent, fg: c.accentForeground, ...onBrand, shadow: 2 as const };
    case "destructive":
      return { bg: c.destructive, fg: c.destructiveForeground, ...onBrand, shadow: 2 as const };
    case "soft":
      return { bg: t.alpha(c.primary, pressed ? 0.2 : 0.12), fg: c.primary };
    case "outline":
      return { bg: pressed ? c.muted : "transparent", fg: c.surfaceForeground, border: c.border };
    case "ghost":
      return { bg: pressed ? c.muted : "transparent", fg: c.surfaceForeground };
    case "link":
      return { bg: "transparent", fg: c.primary, opacity: pressed ? 0.6 : 1 };
    case "gradient":
      return { bg: "transparent", fg: "#ffffff", ...onBrand, shadow: 3 as const };
    case "glass":
      return { bg: "transparent", fg: c.surfaceForeground, opacity: pressed ? 0.8 : 1 };
  }
}

export type ButtonProps = Omit<PressableScaleProps, "children" | "style"> & {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ocupa a largura toda. */
  fullWidth?: boolean;
  /** Mostra spinner e bloqueia toques. */
  loading?: boolean;
  /** Texto durante o loading (padrão: mantém o texto). */
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Raio (padrão "md"; "full" = pílula). */
  radius?: RadiusToken;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Botão do Aura UI — 9 variantes (solid, soft, outline, ghost, accent,
 * destructive, link, gradient, glass), 5 tamanhos, loading, ícones,
 * feedback de pressão e alvo de toque ≥ 44px no tamanho padrão.
 */
export const Button: RefComponent<ButtonProps> = React.forwardRef<ViewRef, ButtonProps>(
  (
    {
      children,
      variant = "solid",
      size = "md",
      fullWidth = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      radius = "md",
      disabled,
      style,
      textStyle,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const s = SIZES[size];
    const blocked = disabled || loading;
    const isIcon = size === "icon" || size === "icon-sm";
    const label = loading && loadingText ? loadingText : children;

    return (
      <PressableScale
        ref={ref}
        role="button"
        aria-disabled={!!blocked}
        aria-busy={loading}
        aria-label={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
        disabled={blocked}
        pressScale={variant === "link" ? 1 : 0.97}
        style={[
          { alignSelf: fullWidth ? "stretch" : "flex-start", opacity: disabled ? 0.5 : 1 },
          style
        ]}
        {...props}
      >
        {({ pressed }) => {
          const v = buttonColors(t, variant, pressed);
          return (
            <View
              style={[
                {
                  minHeight: variant === "link" ? undefined : s.h,
                  width: isIcon ? s.h : undefined,
                  paddingHorizontal: variant === "link" ? 0 : s.px,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: s.gap,
                  borderRadius: t.radius[radius],
                  backgroundColor: v.bg,
                  opacity: v.opacity ?? 1,
                  overflow: variant === "gradient" || variant === "glass" ? "hidden" : "visible",
                  ...(v.border
                    ? { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: v.border }
                    : null),
                  ...(v.shadow ? t.shadow(v.shadow) : null)
                }
              ]}
            >
              {variant === "gradient" && <Gradient style={StyleSheet.absoluteFill} />}
              {variant === "glass" && (
                <Glass style={[StyleSheet.absoluteFill, { borderRadius: t.radius[radius] }]} />
              )}
              {loading ? <ActivityIndicator size="small" color={v.fg} /> : leftIcon}
              {isIcon && !loading ? (
                children
              ) : typeof label === "string" || typeof label === "number" ? (
                <Text
                  weight="semibold"
                  style={[
                    { color: v.fg, fontSize: s.font, lineHeight: Math.round(s.font * 1.25) },
                    variant === "link" && pressed ? { textDecorationLine: "underline" } : null,
                    textStyle
                  ]}
                >
                  {label}
                </Text>
              ) : (
                label
              )}
              {!isIcon && rightIcon}
            </View>
          );
        }}
      </PressableScale>
    );
  }
);
Button.displayName = "Button";

export type IconButtonProps = Omit<ButtonProps, "size" | "leftIcon" | "rightIcon" | "fullWidth"> & {
  size?: "sm" | "md";
  /** Obrigatório: botões só com ícone precisam de rótulo p/ leitores de tela. */
  accessibilityLabel: string;
};

/** Botão quadrado só com ícone (44px — alvo de toque recomendado). */
export const IconButton: RefComponent<IconButtonProps> = React.forwardRef<ViewRef, IconButtonProps>(
  ({ size = "md", variant = "ghost", ...props }, ref) => (
    <Button ref={ref} size={size === "sm" ? "icon-sm" : "icon"} variant={variant} {...props} />
  )
);
IconButton.displayName = "IconButton";
