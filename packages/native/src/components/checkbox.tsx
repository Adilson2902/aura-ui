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
  CheckMark,
  ControlText,
  labelLineHeight,
  plainText,
  touchSlop,
  useControllableState
} from "./form-utils";
import { NATIVE_DRIVER } from "./pressable";

/** `true`, `false` ou `"indeterminate"` (parte dos itens marcada). */
export type CheckboxChecked = boolean | "indeterminate";
export type CheckboxSize = "sm" | "md" | "lg";

const SIZES: Record<CheckboxSize, number> = { sm: 16, md: 20, lg: 24 };

export type CheckboxProps = Omit<PressableProps, "style" | "children" | "onPress"> & {
  /** Marcado (controlado). */
  checked?: CheckboxChecked;
  /** Estado inicial (não-controlado). Padrão false. */
  defaultChecked?: CheckboxChecked;
  /** Recebe o novo estado — tocar num indeterminado marca (`true`). */
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Lado da caixa: sm 16, md 20 (padrão), lg 24. */
  size?: CheckboxSize;
  /** Pinta a borda em `destructive`. */
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/**
 * Caixa de seleção: quadrado arredondado que enche na cor `primary` com
 * check desenhado (ou traço no estado indeterminado). Rótulo e descrição opcionais.
 */
export const Checkbox: RefComponent<CheckboxProps> = React.forwardRef<ViewRef, CheckboxProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      label,
      description,
      size = "md",
      invalid = false,
      disabled,
      style,
      boxStyle,
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
    const box = SIZES[size];
    const [checked, setChecked] = useControllableState<CheckboxChecked>(
      checkedProp,
      defaultChecked
    );
    const on = checked !== false;

    const anim = React.useRef(new Animated.Value(on ? 1 : 0)).current;
    React.useEffect(() => {
      Animated.spring(anim, {
        toValue: on ? 1 : 0,
        useNativeDriver: NATIVE_DRIVER,
        speed: 24,
        bounciness: 10
      }).start();
    }, [on, anim]);

    const toggle = () => {
      const next = checked !== true;
      setChecked(next);
      onCheckedChange?.(next);
    };

    const textSize = size === "sm" ? "sm" : "md";
    const line = labelLineHeight(textSize);
    const hasText = label != null || description != null;
    const radius = Math.min(t.radius.sm, Math.round(box * 0.3));
    const borderWidth = 1.5;
    const borderColor = invalid ? c.destructive : on ? c.primary : t.alpha(c.mutedForeground, 0.6);

    return (
      <Pressable
        ref={ref}
        role="checkbox"
        aria-checked={checked === "indeterminate" ? "mixed" : checked}
        aria-disabled={!!disabled}
        aria-label={ariaLabel ?? accessibilityLabel ?? plainText(label)}
        accessibilityHint={plainText(description)}
        disabled={disabled}
        hitSlop={touchSlop(hasText ? 44 : box, hasText ? line : box)}
        onPress={toggle}
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            gap: t.space(3),
            opacity: disabled ? 0.5 : 1
          },
          style
        ]}
        {...props}
      >
        {({ pressed }) => (
          <>
            <View
              style={[
                {
                  width: box,
                  height: box,
                  borderRadius: radius,
                  borderWidth,
                  borderColor,
                  alignItems: "center",
                  justifyContent: "center",
                  // centraliza a caixa na 1ª linha do rótulo
                  marginTop: hasText ? Math.max(0, (line - box) / 2) : 0,
                  backgroundColor: pressed && !on ? t.alpha(c.primary, 0.1) : "transparent"
                },
                boxStyle
              ]}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderRadius: Math.max(0, radius - borderWidth),
                    backgroundColor: c.primary,
                    opacity: anim
                  }
                ]}
              />
              <Animated.View
                pointerEvents="none"
                style={{
                  opacity: anim,
                  transform: [
                    { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }
                  ]
                }}
              >
                {checked === "indeterminate" ? (
                  <View
                    style={{
                      width: Math.round(box * 0.5),
                      height: 2,
                      borderRadius: 1,
                      backgroundColor: c.primaryForeground
                    }}
                  />
                ) : (
                  <CheckMark size={box} color={c.primaryForeground} stroke={box >= 20 ? 2 : 1.5} />
                )}
              </Animated.View>
            </View>
            {hasText ? (
              <ControlText
                label={label}
                description={description}
                size={textSize}
                labelStyle={labelStyle}
                descriptionStyle={descriptionStyle}
              />
            ) : null}
          </>
        )}
      </Pressable>
    );
  }
);
Checkbox.displayName = "Checkbox";
