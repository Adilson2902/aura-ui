import * as React from "react";
import { View, type Insets, type StyleProp, type TextStyle } from "react-native";
import { useAura } from "../theme/provider";
import { Text } from "./text";

/** Alvo de toque mínimo recomendado (Apple HIG / Material). */
export const MIN_TOUCH = 44;

/** `hitSlop` que completa um visual de `w`×`h` até 44×44. */
export function touchSlop(w: number, h: number): Insets {
  const x = Math.max(0, Math.ceil((MIN_TOUCH - w) / 2));
  const y = Math.max(0, Math.ceil((MIN_TOUCH - h) / 2));
  return { top: y, bottom: y, left: x, right: x };
}

/**
 * Estado controlado/não-controlado: usa `value` quando definido (≠ undefined),
 * senão guarda o estado internamente a partir de `defaultValue`.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void
): [T, (next: T) => void] {
  const [inner, setInner] = React.useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  // guarda o callback mais recente sem recriar o setter
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled]
  );
  return [current, set];
}

/** Repassa a instância a um ref encaminhado (função ou objeto). */
export function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/** Rótulo acessível em texto puro (p/ `aria-label`) quando o nó é string/número. */
export function plainText(node: React.ReactNode): string | undefined {
  return typeof node === "string" || typeof node === "number" ? String(node) : undefined;
}

export type ControlTextProps = {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Tamanho do texto: "sm" usa bodySm, demais usam body. */
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/** Rótulo + descrição ao lado de controles (Checkbox, Radio, Switch). */
export function ControlText({
  label,
  description,
  size = "md",
  labelStyle,
  descriptionStyle
}: ControlTextProps) {
  const t = useAura();
  if (label == null && description == null) return null;
  return (
    <View style={{ flexShrink: 1, gap: t.space(0.5) }}>
      {label == null ? null : typeof label === "string" || typeof label === "number" ? (
        <Text variant={size === "sm" ? "bodySm" : "body"} weight="medium" style={labelStyle}>
          {label}
        </Text>
      ) : (
        label
      )}
      {description == null ? null : typeof description === "string" ||
        typeof description === "number" ? (
        <Text variant={size === "sm" ? "caption" : "bodySm"} tone="muted" style={descriptionStyle}>
          {description}
        </Text>
      ) : (
        description
      )}
    </View>
  );
}

/** Altura da 1ª linha do rótulo (p/ centralizar o indicador nela). */
export function labelLineHeight(size: "sm" | "md" | "lg" = "md") {
  return size === "sm" ? 20 : 24;
}

/**
 * Check (✓) desenhado com Views: um "L" com bordas esquerda/inferior girado -45°.
 * `size` = lado da caixa onde ele fica.
 */
export function CheckMark({
  size,
  color,
  stroke = 2
}: {
  size: number;
  color: string;
  stroke?: number;
}) {
  return (
    <View
      style={{
        width: Math.round(size * 0.55),
        height: Math.round(size * 0.3),
        borderLeftWidth: stroke,
        borderBottomWidth: stroke,
        borderColor: color,
        transform: [{ translateY: -Math.max(1, Math.round(size * 0.06)) }, { rotate: "-45deg" }]
      }}
    />
  );
}

/** "×" desenhado com duas barras cruzadas. */
export function CrossMark({
  size,
  color,
  stroke = 1.75
}: {
  size: number;
  color: string;
  stroke?: number;
}) {
  const bar = {
    position: "absolute" as const,
    width: size,
    height: stroke,
    borderRadius: stroke,
    backgroundColor: color
  };
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={[bar, { transform: [{ rotate: "45deg" }] }]} />
      <View style={[bar, { transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
}
