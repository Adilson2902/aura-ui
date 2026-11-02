import * as React from "react";
import type { ViewRef, RefComponent } from "../theme/types";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useAura } from "../theme/provider";
import { PressableScale } from "./pressable";
import { Glass, Gradient } from "./surfaces";
import { Text, type TextProps } from "./text";

export type CardVariant = "surface" | "soft" | "outline" | "elevated" | "gradient" | "glass";
export type CardPadding = "none" | "sm" | "md" | "lg";

const PADDING: Record<CardPadding, number> = { none: 0, sm: 3, md: 4, lg: 6 };

const CardContext = React.createContext<{ onBrand: boolean }>({ onBrand: false });

export type CardProps = ViewProps & {
  /** Superfície (padrão "surface"). `gradient` usa texto claro automaticamente. */
  variant?: CardVariant;
  padding?: CardPadding;
  /** Torna o card tocável (com feedback de pressão). */
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Card do Aura UI — 6 superfícies, padding por token e versão tocável.
 * Use com CardHeader/CardTitle/CardDescription/CardContent/CardFooter.
 */
export const Card: RefComponent<CardProps> = React.forwardRef<ViewRef, CardProps>(
  (
    { variant = "surface", padding = "md", onPress, onLongPress, style, children, ...props },
    ref
  ) => {
    const t = useAura();
    const c = t.colors;
    const radius = t.radius.lg;
    const base: ViewStyle = {
      borderRadius: radius,
      padding: t.space(PADDING[padding]),
      gap: t.space(3)
    };
    const looks: Record<CardVariant, ViewStyle> = {
      surface: {
        backgroundColor: c.surface,
        borderWidth: StyleSheet.hairlineWidth * 2,
        borderColor: c.border,
        ...t.shadow(1)
      },
      soft: { backgroundColor: c.muted },
      outline: { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: c.border },
      elevated: { backgroundColor: c.surface, ...t.shadow(3) },
      gradient: { overflow: "hidden", ...t.shadow(2) },
      glass: { overflow: "hidden" }
    };
    const content = (
      <>
        {variant === "gradient" && (
          <Gradient style={[StyleSheet.absoluteFill, { borderRadius: radius }]} />
        )}
        {variant === "glass" && (
          <Glass style={[StyleSheet.absoluteFill, { borderRadius: radius }]} />
        )}
        {children}
      </>
    );
    const ctx = { onBrand: variant === "gradient" };

    if (onPress || onLongPress) {
      return (
        <CardContext.Provider value={ctx}>
          <PressableScale
            ref={ref}
            role="button"
            onPress={onPress}
            onLongPress={onLongPress}
            pressScale={0.98}
            style={[base, looks[variant], style]}
            {...props}
          >
            {content}
          </PressableScale>
        </CardContext.Provider>
      );
    }
    return (
      <CardContext.Provider value={ctx}>
        <View ref={ref} style={[base, looks[variant], style]} {...props}>
          {content}
        </View>
      </CardContext.Provider>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({ style, ...props }: ViewProps) {
  const t = useAura();
  return <View style={[{ gap: t.space(1) }, style]} {...props} />;
}

export function CardTitle(props: TextProps) {
  const { onBrand } = React.useContext(CardContext);
  return <Text variant="title" role="heading" color={onBrand ? "#ffffff" : undefined} {...props} />;
}

export function CardDescription(props: TextProps) {
  const { onBrand } = React.useContext(CardContext);
  return (
    <Text
      variant="bodySm"
      tone="muted"
      color={onBrand ? "rgba(255,255,255,0.82)" : undefined}
      {...props}
    />
  );
}

export function CardContent({ style, ...props }: ViewProps) {
  const t = useAura();
  return <View style={[{ gap: t.space(2) }, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  const t = useAura();
  return (
    <View
      style={[
        { flexDirection: "row", alignItems: "center", gap: t.space(2), marginTop: t.space(1) },
        style
      ]}
      {...props}
    />
  );
}
