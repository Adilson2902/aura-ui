import * as React from "react";
import {
  Animated,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewProps,
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
import { NATIVE_DRIVER, PressableScale } from "./pressable";

export type RadioSize = "sm" | "md" | "lg";
/** "default" = bolinha + rótulo; "card" = caixa inteira tocável, borda primary quando selecionada. */
export type RadioVariant = "default" | "card";

const SIZES: Record<RadioSize, number> = { sm: 16, md: 20, lg: 24 };

type RadioContextValue = {
  value: string | null;
  select: (value: string) => void;
  disabled: boolean;
  size: RadioSize;
  variant: RadioVariant;
};

const RadioContext = React.createContext<RadioContextValue | null>(null);

export type RadioGroupProps = Omit<ViewProps, "style" | "children"> & {
  /** Valor selecionado (controlado). `null` = nenhum. */
  value?: string | null;
  /** Valor inicial (não-controlado). */
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** Direção dos itens (padrão "vertical"). */
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  /** Tamanho padrão dos itens. */
  size?: RadioSize;
  /** Variante padrão dos itens. */
  variant?: RadioVariant;
  /** Espaço entre itens (escala de 4px). Padrão 3 (2 nos cards). */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Grupo de opções exclusivas. Use com `RadioGroupItem`. */
export const RadioGroup: RefComponent<RadioGroupProps> = React.forwardRef<ViewRef, RadioGroupProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      orientation = "vertical",
      disabled = false,
      size = "md",
      variant = "default",
      gap,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue);
    const onChangeRef = React.useRef(onValueChange);
    onChangeRef.current = onValueChange;

    const select = React.useCallback(
      (next: string) => {
        if (next === value) return;
        setValue(next);
        onChangeRef.current?.(next);
      },
      [value, setValue]
    );

    const ctx = React.useMemo<RadioContextValue>(
      () => ({ value, select, disabled, size, variant }),
      [value, select, disabled, size, variant]
    );
    const horizontal = orientation === "horizontal";

    return (
      <RadioContext.Provider value={ctx}>
        <View
          ref={ref}
          role="radiogroup"
          aria-disabled={disabled || undefined}
          aria-orientation={orientation}
          style={[
            {
              flexDirection: horizontal ? "row" : "column",
              flexWrap: horizontal ? "wrap" : "nowrap",
              gap: t.space(gap ?? (variant === "card" ? 2 : 3))
            },
            style
          ]}
          {...props}
        >
          {children}
        </View>
      </RadioContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = Omit<PressableProps, "style" | "children" | "onPress"> & {
  /** Valor desta opção. */
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Padrão: o do grupo. */
  variant?: RadioVariant;
  /** Padrão: o do grupo. */
  size?: RadioSize;
  /** Conteúdo extra abaixo da descrição (útil no "card"). */
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/** Opção de um `RadioGroup`. */
export const RadioGroupItem: RefComponent<RadioGroupItemProps> = React.forwardRef<
  ViewRef,
  RadioGroupItemProps
>(
  (
    {
      value,
      label,
      description,
      variant: variantProp,
      size: sizeProp,
      disabled: disabledProp,
      children,
      style,
      indicatorStyle,
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
    const group = React.useContext(RadioContext);
    const variant = variantProp ?? group?.variant ?? "default";
    const size = sizeProp ?? group?.size ?? "md";
    const disabled = !!disabledProp || !!group?.disabled;
    const selected = group?.value === value;
    const card = variant === "card";
    const d = SIZES[size];

    const anim = React.useRef(new Animated.Value(selected ? 1 : 0)).current;
    React.useEffect(() => {
      Animated.spring(anim, {
        toValue: selected ? 1 : 0,
        useNativeDriver: NATIVE_DRIVER,
        speed: 24,
        bounciness: 10
      }).start();
    }, [selected, anim]);

    const textSize = size === "sm" ? "sm" : "md";
    const line = labelLineHeight(textSize);
    const hasText = label != null || description != null;

    return (
      <PressableScale
        ref={ref}
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled}
        aria-label={ariaLabel ?? accessibilityLabel ?? plainText(label)}
        accessibilityHint={plainText(description)}
        disabled={disabled}
        pressScale={card ? 0.98 : 1}
        hitSlop={card ? undefined : touchSlop(hasText ? 44 : d, hasText ? line : d)}
        onPress={() => group?.select(value)}
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: t.space(3),
            opacity: disabled ? 0.5 : 1
          },
          card
            ? {
                padding: t.space(4),
                borderRadius: t.radius.lg,
                borderWidth: 1.5,
                borderColor: selected ? c.primary : c.border,
                backgroundColor: selected ? t.alpha(c.primary, 0.06) : c.surface
              }
            : { alignSelf: "flex-start" },
          style
        ]}
        {...props}
      >
        {({ pressed }) => (
          <>
            <View
              style={[
                {
                  width: d,
                  height: d,
                  borderRadius: d / 2,
                  borderWidth: 1.5,
                  borderColor: selected ? c.primary : t.alpha(c.mutedForeground, 0.6),
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: hasText ? Math.max(0, (line - d) / 2) : 0,
                  backgroundColor: pressed && !selected ? t.alpha(c.primary, 0.1) : "transparent"
                },
                indicatorStyle
              ]}
            >
              <Animated.View
                style={{
                  width: Math.round(d * 0.5),
                  height: Math.round(d * 0.5),
                  borderRadius: d,
                  backgroundColor: c.primary,
                  opacity: anim,
                  transform: [{ scale: anim }]
                }}
              />
            </View>
            {hasText || children != null ? (
              <View style={{ flex: card ? 1 : undefined, flexShrink: 1, gap: t.space(2) }}>
                <ControlText
                  label={label}
                  description={description}
                  size={textSize}
                  labelStyle={labelStyle}
                  descriptionStyle={descriptionStyle}
                />
                {children}
              </View>
            ) : null}
          </>
        )}
      </PressableScale>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";
