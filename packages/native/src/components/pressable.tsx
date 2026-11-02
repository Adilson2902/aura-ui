import * as React from "react";
import type { ViewRef, RefComponent } from "../theme/types";
import {
  Animated,
  Platform,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";

/** O driver nativo não existe na web (react-native-web) — lá a animação roda em JS. */
export const NATIVE_DRIVER = Platform.OS !== "web";

export type PressableScaleProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Escala ao pressionar (padrão 0.97; 1 desliga). */
  pressScale?: number;
};

/** Pressable com feedback físico (encolhe ao tocar), igual ao `aura-press` do web. */
export const PressableScale: RefComponent<PressableScaleProps> = React.forwardRef<
  ViewRef,
  PressableScaleProps
>(({ pressScale = 0.97, onPressIn, onPressOut, style, children, disabled, ...props }, ref) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: NATIVE_DRIVER,
      speed: 40,
      bounciness: 6
    }).start();

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPressIn={(e: GestureResponderEvent) => {
        if (pressScale !== 1) animate(pressScale);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        if (pressScale !== 1) animate(1);
        onPressOut?.(e);
      }}
      {...props}
    >
      {(state) => (
        <Animated.View style={[style, { transform: [{ scale }] }]}>
          {typeof children === "function" ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
});
PressableScale.displayName = "PressableScale";
