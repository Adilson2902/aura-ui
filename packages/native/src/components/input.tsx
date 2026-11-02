import * as React from "react";
import {
  Platform,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import { assignRef, plainText, touchSlop } from "./form-utils";
import { Text } from "./text";

/** Ref do Input/TextArea/OTPInput: a instância do TextInput (focus, blur, clear…). Compatível com `HostInstance`. */
export type InputRef = TextInputInstance;

/** Componente com ref p/ o TextInput — tipo explícito p/ os .d.ts publicados. */
export type InputRefComponent<P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<InputRef>
>;

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "soft" | "outline" | "underline";

/** Medidas por tamanho (altura 36/44/52). */
export const INPUT_SIZES: Record<
  InputSize,
  { h: number; px: number; py: number; font: number; line: number; gap: number }
> = {
  sm: { h: 36, px: 10, py: 8, font: 14, line: 20, gap: 6 },
  md: { h: 44, px: 12, py: 10, font: 16, line: 22, gap: 8 },
  lg: { h: 52, px: 14, py: 12, font: 17, line: 24, gap: 10 }
};

export type InputProps = Omit<TextInputProps, "style"> & {
  /** Rótulo acima do campo (também vira o `aria-label` quando é texto). */
  label?: React.ReactNode;
  /** Texto de apoio abaixo do campo (some quando há erro). */
  description?: React.ReactNode;
  /** Erro: string mostra a mensagem; `true` só pinta a borda. */
  error?: string | boolean;
  /** Adorno à esquerda (ícone, prefixo…). */
  left?: React.ReactNode;
  /** Adorno à direita (ícone, sufixo, botão…). */
  right?: React.ReactNode;
  /** Altura: sm 36, md 44 (padrão), lg 52. */
  size?: InputSize;
  /** Aparência (padrão "default"). */
  variant?: InputVariant;
  /** Desabilita (não editável e esmaecido). */
  disabled?: boolean;
  /** Com `secureTextEntry`, mostra o botão Mostrar/Ocultar (padrão true). */
  passwordToggle?: boolean;
  /** Texto do botão que revela a senha (padrão "Mostrar"). */
  showPasswordLabel?: string;
  /** Texto do botão que esconde a senha (padrão "Ocultar"). */
  hidePasswordLabel?: string;
  /** Estilo do bloco todo (rótulo + campo + mensagem). */
  style?: StyleProp<ViewStyle>;
  /** Estilo da caixa do campo (borda/fundo). */
  fieldStyle?: StyleProp<ViewStyle>;
  /** Estilo do TextInput em si. */
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
};

/**
 * Campo de texto do Aura UI — rótulo, descrição, erro, adornos, 4 variantes,
 * 3 tamanhos, anel de foco na cor `ring` e Mostrar/Ocultar automático em senhas.
 * O ref aponta p/ o TextInput (`ref.current?.focus()`).
 */
export const Input: InputRefComponent<InputProps> = React.forwardRef<InputRef, InputProps>(
  (
    {
      label,
      description,
      error,
      left,
      right,
      size = "md",
      variant = "default",
      disabled = false,
      editable,
      secureTextEntry,
      passwordToggle = true,
      showPasswordLabel = "Mostrar",
      hidePasswordLabel = "Ocultar",
      multiline,
      style,
      fieldStyle,
      inputStyle,
      labelStyle,
      messageStyle,
      onFocus,
      onBlur,
      accessibilityLabel,
      accessibilityHint,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const c = t.colors;
    const s = INPUT_SIZES[size];
    const [focused, setFocused] = React.useState(false);
    const [revealed, setRevealed] = React.useState(false);

    const innerRef = React.useRef<InputRef | null>(null);
    const setRefs = React.useCallback(
      (node: InputRef | null) => {
        innerRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );
    const focus = () => innerRef.current?.focus();

    const invalid = !!error;
    const errorText = typeof error === "string" && error ? error : undefined;
    const underline = variant === "underline";
    const radius = underline ? 0 : t.radius.md;
    const accent = invalid ? c.destructive : c.ring;
    const showToggle = !!secureTextEntry && passwordToggle;

    // borda em repouso / foco / erro por variante
    const borderColor = invalid
      ? c.destructive
      : focused
        ? c.ring
        : variant === "soft"
          ? "transparent"
          : c.border;
    const looks: Record<InputVariant, ViewStyle> = {
      default: { backgroundColor: c.surface, borderWidth: 1, borderColor },
      soft: { backgroundColor: c.muted, borderWidth: 1, borderColor },
      outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor },
      underline: { backgroundColor: "transparent", borderBottomWidth: 1, borderColor }
    };

    const message = errorText ? (
      <Text
        variant="caption"
        tone="destructive"
        role="alert"
        accessibilityLiveRegion="polite"
        style={messageStyle}
      >
        {errorText}
      </Text>
    ) : description == null ? null : typeof description === "string" ||
      typeof description === "number" ? (
      <Text variant="caption" tone="muted" style={messageStyle}>
        {description}
      </Text>
    ) : (
      description
    );

    return (
      <View style={[{ gap: t.space(1.5), opacity: disabled ? 0.5 : 1 }, style]}>
        {label == null ? null : typeof label === "string" || typeof label === "number" ? (
          <Text variant="label" onPress={disabled ? undefined : focus} style={labelStyle}>
            {label}
          </Text>
        ) : (
          label
        )}

        <Pressable
          onPress={focus}
          disabled={disabled}
          accessible={false}
          focusable={false}
          style={[
            {
              flexDirection: "row",
              alignItems: multiline ? "flex-start" : "center",
              minHeight: s.h,
              paddingHorizontal: underline ? 0 : s.px,
              gap: s.gap,
              borderRadius: radius
            },
            looks[variant],
            fieldStyle
          ]}
        >
          {/* anel de foco (halo) — absoluto p/ não mexer no layout */}
          {focused && !underline ? (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                borderRadius: radius + 4,
                borderWidth: 3,
                borderColor: t.alpha(accent, 0.25)
              }}
            />
          ) : null}
          {focused && underline ? (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                backgroundColor: accent
              }}
            />
          ) : null}

          {left != null ? (
            <View style={multiline ? { paddingTop: s.py } : null}>{left}</View>
          ) : null}

          <TextInput
            ref={setRefs}
            editable={!disabled && editable !== false}
            multiline={multiline}
            secureTextEntry={!!secureTextEntry && !revealed}
            placeholderTextColor={c.mutedForeground}
            selectionColor={c.primary}
            cursorColor={c.primary}
            aria-label={ariaLabel ?? accessibilityLabel ?? plainText(label)}
            aria-disabled={disabled || undefined}
            aria-invalid={invalid || undefined}
            accessibilityHint={accessibilityHint ?? errorText ?? plainText(description)}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[
              {
                flex: 1,
                alignSelf: "stretch",
                minHeight: multiline ? undefined : s.h - 2,
                paddingVertical: multiline ? s.py : 0,
                paddingHorizontal: 0,
                fontSize: s.font,
                lineHeight: multiline ? s.line : undefined,
                color: c.surfaceForeground,
                textAlignVertical: multiline ? "top" : "center",
                ...t.font("regular")
              },
              // a web desenha o próprio outline no foco; o anel já é nosso
              Platform.OS === "web" ? { outlineWidth: 0 } : null,
              inputStyle
            ]}
            {...props}
          />

          {right != null ? (
            <View style={multiline ? { paddingTop: s.py } : null}>{right}</View>
          ) : null}

          {showToggle ? (
            <Pressable
              role="button"
              aria-label={revealed ? hidePasswordLabel : showPasswordLabel}
              disabled={disabled}
              hitSlop={touchSlop(40, 24)}
              onPress={() => setRevealed((r) => !r)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, paddingVertical: t.space(1) })}
            >
              <Text variant="label" tone="primary" style={{ fontSize: s.font - 2 }}>
                {revealed ? hidePasswordLabel : showPasswordLabel}
              </Text>
            </Pressable>
          ) : null}
        </Pressable>

        {message}
      </View>
    );
  }
);
Input.displayName = "Input";

export type TextAreaProps = Omit<
  InputProps,
  "multiline" | "secureTextEntry" | "passwordToggle" | "showPasswordLabel" | "hidePasswordLabel"
> & {
  /** Altura mínima em linhas de texto (padrão 3). */
  minRows?: number;
};

/** Campo de várias linhas — mesmo visual do Input, altura mínima por `minRows`. */
export const TextArea: InputRefComponent<TextAreaProps> = React.forwardRef<InputRef, TextAreaProps>(
  ({ minRows = 3, size = "md", inputStyle, ...props }, ref) => {
    const s = INPUT_SIZES[size];
    return (
      <Input
        ref={ref}
        multiline
        size={size}
        inputStyle={[{ minHeight: minRows * s.line + s.py * 2 }, inputStyle]}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";
