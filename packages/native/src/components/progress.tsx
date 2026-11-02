import * as React from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  View,
  type DimensionValue,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { resolveColor } from "../theme/color";
import { useAura } from "../theme/provider";
import type { RadiusToken } from "../theme/tokens";
import type { ColorToken, RefComponent, ViewRef } from "../theme/types";
import { useReducedMotion } from "./overlay";
import { NATIVE_DRIVER } from "./pressable";
import { Text } from "./text";

export type ProgressTone = "primary" | "accent" | "success" | "warning" | "destructive";
export type ProgressSize = "sm" | "md" | "lg";

const TONES: Record<ProgressTone, ColorToken> = {
  primary: "primary",
  accent: "accent",
  success: "success",
  warning: "warning",
  destructive: "destructive"
};

const HEIGHTS: Record<ProgressSize, number> = { sm: 4, md: 8, lg: 12 };

export type ProgressProps = ViewProps & {
  /** 0–100 (com clamp). */
  value?: number;
  /** Progresso desconhecido: barra correndo em loop. */
  indeterminate?: boolean;
  tone?: ProgressTone;
  size?: ProgressSize;
  /** Rótulo p/ leitores de tela (padrão "Progresso"). */
  label?: string;
  style?: StyleProp<ViewStyle>;
  barStyle?: StyleProp<ViewStyle>;
};

/** Barra de progresso animada (determinada ou indeterminada). */
export const Progress: RefComponent<ProgressProps> = React.forwardRef<ViewRef, ProgressProps>(
  (
    {
      value = 0,
      indeterminate = false,
      tone = "primary",
      size = "md",
      label = "Progresso",
      style,
      barStyle,
      onLayout,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const reduced = useReducedMotion();
    const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
    const [width, setWidth] = React.useState(0);
    const anim = React.useRef(new Animated.Value(clamped)).current;
    const loop = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (indeterminate) return;
      if (reduced) {
        anim.setValue(clamped);
        return;
      }
      const a = Animated.timing(anim, {
        toValue: clamped,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: NATIVE_DRIVER
      });
      a.start();
      return () => a.stop();
    }, [anim, clamped, indeterminate, reduced]);

    React.useEffect(() => {
      if (!indeterminate || reduced) return;
      loop.setValue(0);
      const a = Animated.loop(
        Animated.timing(loop, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER
        })
      );
      a.start();
      return () => a.stop();
    }, [loop, indeterminate, reduced]);

    // translateX (compatível com o driver nativo) quando a largura já é conhecida;
    // antes do layout, cai numa largura em % estática.
    const bar = React.useMemo(() => {
      if (indeterminate) {
        if (!width || reduced)
          return { width: "40%" as const, left: reduced ? ("30%" as const) : undefined };
        const seg = width * 0.4;
        return {
          width: seg,
          transform: [
            { translateX: loop.interpolate({ inputRange: [0, 1], outputRange: [-seg, width] }) }
          ]
        };
      }
      if (!width) return { width: `${clamped}%` as `${number}%` };
      return {
        width,
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 100], outputRange: [-width, 0] }) }
        ]
      };
    }, [indeterminate, width, reduced, clamped, loop, anim]);

    return (
      <View
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        aria-busy={indeterminate}
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
          onLayout?.(e);
        }}
        style={[
          {
            width: "100%",
            height: HEIGHTS[size],
            borderRadius: t.radius.full,
            backgroundColor: t.colors.muted,
            overflow: "hidden"
          },
          style
        ]}
        {...props}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              borderRadius: t.radius.full,
              backgroundColor: t.colors[TONES[tone]]
            },
            bar,
            barStyle
          ]}
        />
      </View>
    );
  }
);
Progress.displayName = "Progress";

export type SpinnerTone = ProgressTone | "muted" | "foreground";

const SPINNER_TONES: Record<SpinnerTone, ColorToken> = {
  ...TONES,
  muted: "mutedForeground",
  foreground: "surfaceForeground"
};

export type SpinnerProps = ViewProps & {
  size?: "small" | "large" | number;
  tone?: SpinnerTone;
  /** Cor livre (token ou crua) — vence `tone`. */
  color?: ColorToken | (string & {});
  /** Rótulo acessível (padrão "Carregando"). */
  label?: string;
  /** Mostra o rótulo ao lado do spinner. */
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

/** Indicador de carregamento na cor do tema, com rótulo acessível. */
export const Spinner: RefComponent<SpinnerProps> = React.forwardRef<ViewRef, SpinnerProps>(
  (
    {
      size = "small",
      tone = "primary",
      color,
      label = "Carregando",
      showLabel = false,
      style,
      labelStyle,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const c = color ? resolveColor(t.colors, color) : t.colors[SPINNER_TONES[tone]];
    return (
      <View
        ref={ref}
        role="progressbar"
        accessible
        aria-label={label}
        aria-busy
        style={[
          { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: t.space(2) },
          style
        ]}
        {...props}
      >
        <ActivityIndicator size={size} color={c} />
        {showLabel ? (
          <Text variant="bodySm" tone="muted" style={labelStyle}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }
);
Spinner.displayName = "Spinner";

export type SkeletonProps = ViewProps & {
  /** Largura (padrão 100%; no `circle`, o diâmetro). */
  width?: DimensionValue;
  /** Altura (padrão 16). */
  height?: DimensionValue;
  /** Raio (padrão "sm"). */
  radius?: RadiusToken | number;
  /** Círculo (avatar). */
  circle?: boolean;
  /** Pulso animado (padrão true; desliga sozinho com "reduzir movimento"). */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Placeholder de carregamento com pulso suave. Escondido de leitores de tela. */
export const Skeleton: RefComponent<SkeletonProps> = React.forwardRef<ViewRef, SkeletonProps>(
  ({ width, height, radius = "sm", circle = false, animated = true, style, ...props }, ref) => {
    const t = useAura();
    const reduced = useReducedMotion();
    const pulse = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      if (!animated || reduced) {
        pulse.setValue(1);
        return;
      }
      const step = (toValue: number) =>
        Animated.timing(pulse, {
          toValue,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: NATIVE_DRIVER
        });
      const a = Animated.loop(Animated.sequence([step(0.45), step(1)]));
      a.start();
      return () => a.stop();
    }, [pulse, animated, reduced]);

    const diameter = circle ? (width ?? height ?? 40) : undefined;
    return (
      <Animated.View
        ref={ref}
        aria-hidden
        style={[
          {
            width: circle ? diameter : (width ?? "100%"),
            height: circle ? diameter : (height ?? 16),
            borderRadius: circle
              ? t.radius.full
              : typeof radius === "number"
                ? radius
                : t.radius[radius],
            backgroundColor: t.colors.muted
          },
          { opacity: pulse },
          style
        ]}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";
