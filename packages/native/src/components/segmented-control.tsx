import * as React from "react";
import {
  Animated,
  Pressable,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { touchSlop, useControllableState } from "./form-utils";
import { NATIVE_DRIVER } from "./pressable";
import { Text } from "./text";

export type SegmentedControlOption = {
  value: string;
  label?: string;
  /** Ícone (qualquer nó) antes do rótulo. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Rótulo p/ leitores de tela (obrigatório em opções só com ícone). */
  accessibilityLabel?: string;
};

export type SegmentedControlSize = "sm" | "md" | "lg";

const SIZES: Record<SegmentedControlSize, { h: number; px: number; font: number; gap: number }> = {
  sm: { h: 36, px: 10, font: 13, gap: 4 },
  md: { h: 44, px: 14, font: 14, gap: 6 },
  lg: { h: 52, px: 18, font: 16, gap: 8 }
};

/** Respiro entre o trilho e o indicador. */
const PAD = 3;

export type SegmentedControlProps = Omit<ViewProps, "style" | "children"> & {
  options: readonly SegmentedControlOption[];
  /** Valor selecionado (controlado). */
  value?: string;
  /** Valor inicial (não-controlado). Padrão: a 1ª opção. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Altura: sm 36, md 44 (padrão), lg 52. */
  size?: SegmentedControlSize;
  /** Ocupa a largura toda (segmentos iguais dividindo o espaço). */
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  segmentStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

type Slot = { x: number; width: number };

/**
 * Controle segmentado com indicador deslizante (mola). Segmentos de largura
 * igual, papel de abas (`tablist`/`tab`) — serve de barra de abas também.
 */
export const SegmentedControl: RefComponent<SegmentedControlProps> = React.forwardRef<
  ViewRef,
  SegmentedControlProps
>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "md",
      fullWidth = false,
      disabled = false,
      style,
      segmentStyle,
      indicatorStyle,
      textStyle,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const c = t.colors;
    const s = SIZES[size];
    const [value, setValue] = useControllableState<string | undefined>(
      valueProp,
      defaultValue ?? options[0]?.value
    );

    // posição/largura medidas de cada segmento
    const [slots, setSlots] = React.useState<Slot[]>([]);
    const measure = (i: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      setSlots((prev) => {
        const p = prev[i];
        if (p && p.x === x && p.width === width) return prev;
        const next = prev.slice(0, options.length);
        next[i] = { x, width };
        return next;
      });
    };

    const index = options.findIndex((o) => o.value === value);
    const active = index >= 0 ? slots[index] : undefined;
    // sem fullWidth, todos ganham a largura do maior (indicador desliza sem mudar de tamanho)
    const widest = fullWidth
      ? 0
      : slots.slice(0, options.length).reduce((m, sl) => Math.max(m, sl?.width ?? 0), 0);

    const translate = React.useRef(new Animated.Value(0)).current;
    const lastValue = React.useRef(value);
    const activeX = active?.x;
    React.useEffect(() => {
      if (activeX === undefined) {
        lastValue.current = value;
        return;
      }
      if (lastValue.current === value) {
        // só mudou o layout: posiciona sem animar
        translate.setValue(activeX);
      } else {
        Animated.spring(translate, {
          toValue: activeX,
          useNativeDriver: NATIVE_DRIVER,
          speed: 18,
          bounciness: 5
        }).start();
      }
      lastValue.current = value;
    }, [value, activeX, translate]);

    const select = (next: string) => {
      if (next === value) return;
      setValue(next);
      onValueChange?.(next);
    };

    const radius = t.radius.md;

    return (
      <View
        ref={ref}
        role="tablist"
        aria-disabled={disabled || undefined}
        style={[
          {
            flexDirection: "row",
            alignSelf: fullWidth ? "stretch" : "flex-start",
            minHeight: s.h,
            padding: PAD,
            borderRadius: radius,
            backgroundColor: c.muted,
            opacity: disabled ? 0.5 : 1
          },
          style
        ]}
        {...props}
      >
        {active ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                top: PAD,
                bottom: PAD,
                left: 0,
                width: active.width,
                borderRadius: Math.max(0, radius - PAD),
                backgroundColor: t.isDark ? t.alpha(c.surfaceForeground, 0.14) : c.surface,
                ...t.shadow(1),
                transform: [{ translateX: translate }]
              },
              indicatorStyle
            ]}
          />
        ) : null}
        {options.map((o, i) => {
          const selected = o.value === value;
          const blocked = disabled || !!o.disabled;
          return (
            <Pressable
              key={o.value}
              role="tab"
              aria-selected={selected}
              aria-disabled={blocked}
              aria-label={o.accessibilityLabel ?? o.label}
              disabled={blocked}
              hitSlop={touchSlop(44, s.h - PAD * 2)}
              onLayout={measure(i)}
              onPress={() => select(o.value)}
              style={({ pressed }) => [
                {
                  flex: fullWidth ? 1 : undefined,
                  minWidth: widest || undefined,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: s.gap,
                  paddingHorizontal: s.px,
                  borderRadius: Math.max(0, radius - PAD),
                  opacity: o.disabled && !disabled ? 0.5 : pressed && !selected ? 0.7 : 1
                },
                segmentStyle
              ]}
            >
              {o.icon}
              {o.label ? (
                <Text
                  weight="semibold"
                  lines={1}
                  style={[
                    {
                      fontSize: s.font,
                      lineHeight: Math.round(s.font * 1.3),
                      color: selected ? c.surfaceForeground : c.mutedForeground
                    },
                    textStyle
                  ]}
                >
                  {o.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  }
);
SegmentedControl.displayName = "SegmentedControl";
