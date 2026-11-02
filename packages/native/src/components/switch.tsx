import * as React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import {
  ControlText,
  labelLineHeight,
  plainText,
  touchSlop,
  useControllableState
} from "./form-utils";
import { NATIVE_DRIVER } from "./pressable";

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchVariant = "default" | "success";

const SIZES: Record<SwitchSize, { w: number; h: number; thumb: number }> = {
  sm: { w: 32, h: 18, thumb: 14 },
  md: { w: 44, h: 24, thumb: 20 },
  lg: { w: 52, h: 30, thumb: 26 }
};

export type SwitchProps = Omit<PressableProps, "style" | "children" | "onPress"> & {
  /** Ligado (controlado). */
  checked?: boolean;
  /** Estado inicial (não-controlado). Padrão false. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Tamanho do trilho: sm 32×18, md 44×24 (padrão), lg 52×30. */
  size?: SwitchSize;
  /** Cor quando ligado: "default" (primary) ou "success". */
  variant?: SwitchVariant;
  /** Rótulo (tocar nele também alterna). */
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Lado do rótulo (padrão "right"). */
  labelPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/**
 * Interruptor animado (trilho + thumb com mola), sem depender do Switch nativo —
 * visual idêntico em iOS, Android e web. Controlado ou não-controlado.
 */
export const Switch: RefComponent<SwitchProps> = React.forwardRef<ViewRef, SwitchProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      size = "md",
      variant = "default",
      label,
      description,
      labelPosition = "right",
      disabled,
      style,
      trackStyle,
      thumbStyle,
      labelStyle,
      descriptionStyle,
      accessibilityLabel,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const c = t.colors;
    const s = SIZES[size];
    const [checked, setChecked] = useControllableState(
      checkedProp,
      defaultChecked,
      onCheckedChange
    );

    const anim = React.useRef(new Animated.Value(checked ? 1 : 0)).current;
    React.useEffect(() => {
      Animated.spring(anim, {
        toValue: checked ? 1 : 0,
        useNativeDriver: NATIVE_DRIVER,
        speed: 20,
        bounciness: 8
      }).start();
    }, [checked, anim]);

    const pad = (s.h - s.thumb) / 2;
    const travel = s.w - s.thumb - pad * 2;
    const onColor = variant === "success" ? c.success : c.primary;
    const offColor = t.alpha(c.mutedForeground, t.isDark ? 0.45 : 0.3);
    // thumb sempre claro (como no iOS): superfície no claro, texto no escuro
    const thumbColor = t.isDark ? c.surfaceForeground : c.surface;
    const textSize = size === "sm" ? "sm" : "md";
    const line = labelLineHeight(textSize);
    const hasText = label != null || description != null;

    const text = hasText ? (
      <ControlText
        label={label}
        description={description}
        size={textSize}
        labelStyle={labelStyle}
        descriptionStyle={descriptionStyle}
      />
    ) : null;

    return (
      <Pressable
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-disabled={!!disabled}
        aria-label={ariaLabel ?? accessibilityLabel ?? plainText(label)}
        accessibilityHint={plainText(description)}
        disabled={disabled}
        hitSlop={touchSlop(hasText ? 44 : s.w, hasText ? Math.max(s.h, line) : s.h)}
        onPress={() => setChecked(!checked)}
        style={[
          {
            flexDirection: "row",
            alignItems: description != null ? "flex-start" : "center",
            alignSelf: "flex-start",
            gap: t.space(3),
            opacity: disabled ? 0.5 : 1
          },
          style
        ]}
        {...props}
      >
        {labelPosition === "left" ? text : null}
        <View
          style={[
            {
              width: s.w,
              height: s.h,
              borderRadius: s.h / 2,
              padding: pad,
              justifyContent: "center",
              backgroundColor: offColor,
              marginTop: description != null ? Math.max(0, (line - s.h) / 2) : 0
            },
            trackStyle
          ]}
        >
          {/* cor "ligado" entra por opacidade (suportada pelo driver nativo) */}
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: s.h / 2, backgroundColor: onColor, opacity: anim }
            ]}
          />
          <Animated.View
            style={[
              {
                width: s.thumb,
                height: s.thumb,
                borderRadius: s.thumb / 2,
                backgroundColor: thumbColor,
                ...t.shadow(1),
                transform: [
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, travel],
                      extrapolate: "clamp"
                    })
                  }
                ]
              },
              thumbStyle
            ]}
          />
        </View>
        {labelPosition === "right" ? text : null}
      </Pressable>
    );
  }
);
Switch.displayName = "Switch";
