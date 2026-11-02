import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { ColorToken, RefComponent, ViewRef } from "../theme/types";
import { Text } from "./text";

export type StatusTone = "info" | "success" | "warning" | "destructive";

const STATUS: Record<StatusTone, { bg: ColorToken; fg: ColorToken; glyph: string }> = {
  info: { bg: "primary", fg: "primaryForeground", glyph: "i" },
  success: { bg: "success", fg: "successForeground", glyph: "✓" },
  warning: { bg: "warning", fg: "warningForeground", glyph: "!" },
  destructive: { bg: "destructive", fg: "destructiveForeground", glyph: "!" }
};

export type StatusIconProps = {
  tone?: StatusTone;
  /** Diâmetro em px (padrão 20). */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** Ícone de status padrão (círculo com glifo) — usado por Alert e Toast. Decorativo. */
export function StatusIcon({ tone = "info", size = 20, style }: StatusIconProps) {
  const t = useAura();
  const s = STATUS[tone];
  return (
    <View
      aria-hidden
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.colors[s.bg],
          alignItems: "center",
          justifyContent: "center"
        },
        style
      ]}
    >
      <Text
        weight="bold"
        style={{
          color: t.colors[s.fg],
          fontSize: Math.round(size * 0.62),
          lineHeight: Math.round(size * 0.8),
          textAlign: "center",
          includeFontPadding: false
        }}
      >
        {s.glyph}
      </Text>
    </View>
  );
}

export type AlertVariant = StatusTone;

const COLOR: Record<AlertVariant, ColorToken> = {
  info: "primary",
  success: "success",
  warning: "warning",
  destructive: "destructive"
};

const isText = (node: React.ReactNode) => typeof node === "string" || typeof node === "number";

export type AlertProps = ViewProps & {
  /** Tom (padrão "info"). */
  variant?: AlertVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Conteúdo extra (texto simples vira descrição). */
  children?: React.ReactNode;
  /** Ícone próprio; `null` esconde o ícone padrão. */
  icon?: React.ReactNode;
  /** Mostra o botão × de fechar. */
  onClose?: () => void;
  /** Rótulo acessível do botão fechar (padrão "Fechar"). */
  closeLabel?: string;
  /** Ações abaixo do texto (ex.: um Button pequeno). */
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/** Callout de status (info, success, warning, destructive) com ícone, título e fechar. */
export const Alert: RefComponent<AlertProps> = React.forwardRef<ViewRef, AlertProps>(
  (
    {
      variant = "info",
      title,
      description,
      children,
      icon,
      onClose,
      closeLabel = "Fechar",
      action,
      style,
      titleStyle,
      descriptionStyle,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const color = t.colors[COLOR[variant]];
    const body = (node: React.ReactNode) =>
      isText(node) ? (
        <Text variant="bodySm" style={descriptionStyle}>
          {node}
        </Text>
      ) : (
        node
      );

    return (
      <View
        ref={ref}
        role="alert"
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: t.space(3),
            padding: t.space(4),
            borderRadius: t.radius.md,
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: t.alpha(color, 0.4),
            backgroundColor: t.alpha(color, 0.1)
          },
          style
        ]}
        {...props}
      >
        {icon === undefined ? <StatusIcon tone={variant} /> : icon}
        <View style={{ flex: 1, gap: t.space(1) }}>
          {title ? (
            isText(title) ? (
              <Text variant="label" weight="semibold" style={titleStyle}>
                {title}
              </Text>
            ) : (
              title
            )
          ) : null}
          {description ? body(description) : null}
          {children ? body(children) : null}
          {action ? (
            <View style={{ flexDirection: "row", gap: t.space(2), marginTop: t.space(2) }}>
              {action}
            </View>
          ) : null}
        </View>
        {onClose ? (
          <Pressable
            role="button"
            aria-label={closeLabel}
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [
              {
                width: 28,
                height: 28,
                marginTop: -4,
                marginRight: -4,
                borderRadius: t.radius.full,
                alignItems: "center",
                justifyContent: "center"
              },
              pressed ? { backgroundColor: t.alpha(color, 0.16) } : null
            ]}
          >
            <Text tone="muted" style={{ fontSize: 22, lineHeight: 24 }}>
              ×
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }
);
Alert.displayName = "Alert";
