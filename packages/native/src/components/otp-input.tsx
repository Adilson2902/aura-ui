import * as React from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import { assignRef, useControllableState } from "./form-utils";
import type { InputRef, InputRefComponent } from "./input";
import { NATIVE_DRIVER } from "./pressable";
import { Text } from "./text";

export type OTPInputSize = "sm" | "md" | "lg";

const SIZES: Record<OTPInputSize, { w: number; h: number; font: number }> = {
  sm: { w: 40, h: 44, font: 18 },
  md: { w: 48, h: 56, font: 22 },
  lg: { w: 56, h: 64, font: 26 }
};

export type OTPInputProps = Omit<
  TextInputProps,
  | "style"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onChangeText"
  | "maxLength"
  | "multiline"
  | "secureTextEntry"
  | "keyboardType"
> & {
  /** Número de casas (padrão 6). */
  length?: number;
  /** Código (controlado). */
  value?: string;
  /** Código inicial (não-controlado). */
  defaultValue?: string;
  /** A cada mudança, com o código já filtrado. */
  onChange?: (value: string) => void;
  /** Quando todas as casas são preenchidas. */
  onComplete?: (value: string) => void;
  /** "numeric" (padrão, só dígitos) ou "alphanumeric" (letras e dígitos). */
  type?: "numeric" | "alphanumeric";
  /** Mostra • no lugar dos caracteres. */
  mask?: boolean;
  /** Erro: string mostra a mensagem; `true` só pinta as bordas. */
  error?: string | boolean;
  disabled?: boolean;
  /** Tamanho das casas: sm 40×44, md 48×56 (padrão), lg 56×64. */
  size?: OTPInputSize;
  style?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Campo de código (OTP) com casas separadas. Um único TextInput invisível
 * fica por cima das casas, então colar e o preenchimento automático por SMS
 * (`oneTimeCode` no iOS, `sms-otp` no Android) funcionam de uma vez.
 * O ref aponta p/ esse TextInput (`ref.current?.focus()`).
 */
export const OTPInput: InputRefComponent<OTPInputProps> = React.forwardRef<InputRef, OTPInputProps>(
  (
    {
      length = 6,
      value: valueProp,
      defaultValue = "",
      onChange,
      onComplete,
      type = "numeric",
      mask = false,
      error,
      disabled = false,
      size = "md",
      style,
      cellStyle,
      textStyle,
      onFocus,
      onBlur,
      accessibilityLabel,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const c = t.colors;
    const s = SIZES[size];
    const [raw, setValue] = useControllableState(valueProp, defaultValue, onChange);
    const value = raw.slice(0, length);
    const [focused, setFocused] = React.useState(false);

    const innerRef = React.useRef<InputRef | null>(null);
    const setRefs = React.useCallback(
      (node: InputRef | null) => {
        innerRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    const sanitize = (text: string) =>
      (type === "numeric" ? text.replace(/\D/g, "") : text.replace(/[^0-9a-zA-Z]/g, "")).slice(
        0,
        length
      );

    const handleChange = (text: string) => {
      const next = sanitize(text);
      if (next === value) return;
      setValue(next);
      if (next.length === length) onComplete?.(next);
    };

    // cursor piscando na casa ativa vazia
    const blink = React.useRef(new Animated.Value(1)).current;
    const showCaret = focused && value.length < length;
    React.useEffect(() => {
      if (!showCaret) return;
      blink.setValue(1);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(blink, {
            toValue: 0,
            duration: 450,
            delay: 350,
            useNativeDriver: NATIVE_DRIVER
          }),
          Animated.timing(blink, { toValue: 1, duration: 450, useNativeDriver: NATIVE_DRIVER })
        ])
      );
      loop.start();
      return () => loop.stop();
    }, [showCaret, value.length, blink]);

    const invalid = !!error;
    const errorText = typeof error === "string" && error ? error : undefined;
    const activeIndex = Math.min(value.length, length - 1);
    const radius = t.radius.md;

    const cells = Array.from({ length }, (_, i) => {
      const char = value[i];
      const active = focused && i === activeIndex;
      const borderColor = invalid
        ? c.destructive
        : active
          ? c.ring
          : char
            ? t.alpha(c.mutedForeground, 0.6)
            : c.border;
      return (
        <View
          key={i}
          style={[
            {
              width: s.w,
              height: s.h,
              borderRadius: radius,
              borderWidth: active ? 2 : 1,
              borderColor,
              backgroundColor: c.surface,
              alignItems: "center",
              justifyContent: "center"
            },
            cellStyle
          ]}
        >
          {active ? (
            <View
              style={{
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: radius + 4,
                borderWidth: 3,
                borderColor: t.alpha(invalid ? c.destructive : c.ring, 0.25)
              }}
            />
          ) : null}
          {char ? (
            <Text
              weight="semibold"
              style={[
                {
                  fontSize: s.font,
                  lineHeight: Math.round(s.font * 1.25),
                  color: c.surfaceForeground
                },
                textStyle
              ]}
            >
              {mask ? "•" : char}
            </Text>
          ) : active && showCaret ? (
            <Animated.View
              style={{
                width: 2,
                height: Math.round(s.font * 1.1),
                borderRadius: 1,
                backgroundColor: c.primary,
                opacity: blink
              }}
            />
          ) : null}
        </View>
      );
    });

    return (
      <View style={[{ gap: t.space(2), opacity: disabled ? 0.5 : 1 }, style]}>
        <View style={{ alignSelf: "flex-start" }}>
          {/* casas: só visuais — o leitor de tela lê o TextInput */}
          <View
            pointerEvents="none"
            aria-hidden
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ flexDirection: "row", gap: t.space(2) }}
          >
            {cells}
          </View>
          <TextInput
            ref={setRefs}
            value={value}
            onChangeText={handleChange}
            maxLength={length}
            editable={!disabled}
            keyboardType={type === "numeric" ? "number-pad" : "default"}
            inputMode={type === "numeric" ? "numeric" : "text"}
            autoCapitalize={type === "numeric" ? "none" : "characters"}
            autoCorrect={false}
            spellCheck={false}
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
            caretHidden
            contextMenuHidden={false}
            selectionColor="transparent"
            aria-label={ariaLabel ?? accessibilityLabel ?? "Código de verificação"}
            aria-disabled={disabled || undefined}
            aria-invalid={invalid || undefined}
            accessibilityHint={
              errorText ?? `${length} ${type === "numeric" ? "dígitos" : "caracteres"}`
            }
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[
              StyleSheet.absoluteFill,
              {
                // quase invisível (iOS ignora toques em opacidade < 0.01)
                opacity: 0.015,
                color: "transparent",
                fontSize: s.font,
                paddingHorizontal: 0,
                paddingVertical: 0
              },
              Platform.OS === "web" ? { outlineWidth: 0 } : null
            ]}
            {...props}
          />
        </View>
        {errorText ? (
          <Text variant="caption" tone="destructive" role="alert" accessibilityLiveRegion="polite">
            {errorText}
          </Text>
        ) : null}
      </View>
    );
  }
);
OTPInput.displayName = "OTPInput";
