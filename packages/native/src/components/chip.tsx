import * as React from "react";
import {
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura, type AuraTheme } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { CheckMark, CrossMark, plainText, touchSlop, useControllableState } from "./form-utils";
import { Text } from "./text";

export type ChipVariant = "soft" | "outline" | "solid";
export type ChipSize = "sm" | "md";

const SIZES: Record<ChipSize, { h: number; px: number; font: number; icon: number; gap: number }> =
  {
    sm: { h: 28, px: 10, font: 13, icon: 14, gap: 4 },
    md: { h: 34, px: 12, font: 14, icon: 16, gap: 6 }
  };

/** Cores de fundo/texto/borda do chip por variante e estado. */
function chipColors(t: AuraTheme, variant: ChipVariant, selected: boolean, pressed: boolean) {
  const c = t.colors;
  switch (variant) {
    case "solid":
      return selected
        ? { bg: c.primary, fg: c.primaryForeground, border: c.primary, opacity: pressed ? 0.88 : 1 }
        : {
            bg: t.alpha(c.primary, pressed ? 0.2 : 0.12),
            fg: c.primary,
            border: "transparent",
            opacity: 1
          };
    case "outline":
      return selected
        ? {
            bg: t.alpha(c.primary, pressed ? 0.14 : 0.08),
            fg: c.primary,
            border: c.primary,
            opacity: 1
          }
        : {
            bg: pressed ? c.muted : "transparent",
            fg: c.surfaceForeground,
            border: c.border,
            opacity: 1
          };
    case "soft":
    default:
      return selected
        ? {
            bg: t.alpha(c.primary, pressed ? 0.22 : 0.15),
            fg: c.primary,
            border: t.alpha(c.primary, 0.35),
            opacity: 1
          }
        : {
            bg: c.muted,
            fg: c.surfaceForeground,
            border: "transparent",
            opacity: pressed ? 0.75 : 1
          };
  }
}

type ChipGroupContextValue = {
  multiple: boolean;
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
  variant?: ChipVariant;
  size?: ChipSize;
};

const ChipGroupContext = React.createContext<ChipGroupContextValue | null>(null);

export type ChipProps = Omit<PressableProps, "style" | "children"> & {
  /** Rótulo (texto ou nó). */
  children?: React.ReactNode;
  /** Valor do chip dentro de um `ChipGroup`. */
  value?: string;
  /** Selecionado (controlado) — torna o chip um filtro alternável. */
  selected?: boolean;
  /** Estado inicial (não-controlado). */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Mostra o botão × e chama isto ao tocar nele. */
  onRemove?: () => void;
  /** Rótulo acessível do botão × (padrão "Remover"). */
  removeLabel?: string;
  /** Aparência (padrão "soft"). */
  variant?: ChipVariant;
  /** Altura: sm 28, md 34 (padrão) — alvo de toque completado até 44. */
  size?: ChipSize;
  /** Ícone à esquerda (no lugar do check de selecionado). */
  left?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Chip/etiqueta: filtro alternável (`selected`), ação (`onPress`) ou entrada
 * removível (`onRemove` → botão ×). Dentro de `ChipGroup`, a seleção é do grupo.
 */
export const Chip: RefComponent<ChipProps> = React.forwardRef<ViewRef, ChipProps>(
  (
    {
      children,
      value,
      selected: selectedProp,
      defaultSelected,
      onSelectedChange,
      onRemove,
      removeLabel = "Remover",
      variant: variantProp,
      size: sizeProp,
      left,
      disabled: disabledProp,
      onPress,
      onPressIn,
      onPressOut,
      style,
      textStyle,
      accessibilityLabel,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const group = React.useContext(ChipGroupContext);
    const inGroup = !!group && value !== undefined;
    const selectable =
      inGroup || selectedProp !== undefined || defaultSelected !== undefined || !!onSelectedChange;
    const [ownSelected, setOwnSelected] = useControllableState(
      selectedProp,
      defaultSelected ?? false,
      onSelectedChange
    );
    const selected = inGroup ? group.isSelected(value) : ownSelected;

    const variant = variantProp ?? group?.variant ?? "soft";
    const size = sizeProp ?? group?.size ?? "md";
    const disabled = !!disabledProp || !!group?.disabled;
    const s = SIZES[size];
    const [pressed, setPressed] = React.useState(false);
    const v = chipColors(t, variant, selected, pressed);
    const interactive = selectable || !!onPress;
    const text = plainText(children);

    const handlePress = (e: GestureResponderEvent) => {
      if (inGroup) group.toggle(value);
      else if (selectable) setOwnSelected(!ownSelected);
      onPress?.(e);
    };

    const icon =
      left ??
      (selectable && selected ? (
        <View
          style={{ width: s.icon, height: s.icon, alignItems: "center", justifyContent: "center" }}
        >
          <CheckMark size={s.icon} color={v.fg} stroke={1.75} />
        </View>
      ) : null);

    const content = (
      <>
        {icon}
        {typeof children === "string" || typeof children === "number" ? (
          <Text
            weight="medium"
            lines={1}
            style={[
              { color: v.fg, fontSize: s.font, lineHeight: Math.round(s.font * 1.3) },
              textStyle
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </>
    );

    const bodyStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      gap: s.gap,
      paddingLeft: s.px,
      paddingRight: onRemove ? s.gap : s.px
    };
    const slopY = touchSlop(0, s.h).top;

    return (
      <View
        ref={ref}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            height: s.h,
            borderRadius: t.radius.full,
            borderWidth: 1,
            borderColor: v.border,
            backgroundColor: v.bg,
            opacity: (disabled ? 0.5 : 1) * v.opacity
          },
          style
        ]}
      >
        {interactive ? (
          <Pressable
            role={
              inGroup ? (group.multiple ? "checkbox" : "radio") : selectable ? "checkbox" : "button"
            }
            aria-checked={selectable ? selected : undefined}
            aria-disabled={disabled}
            aria-label={ariaLabel ?? accessibilityLabel ?? text}
            disabled={disabled}
            hitSlop={{ top: slopY, bottom: slopY }}
            onPress={handlePress}
            onPressIn={(e) => {
              setPressed(true);
              onPressIn?.(e);
            }}
            onPressOut={(e) => {
              setPressed(false);
              onPressOut?.(e);
            }}
            style={bodyStyle}
            {...props}
          >
            {content}
          </Pressable>
        ) : (
          <View style={bodyStyle} aria-label={ariaLabel ?? accessibilityLabel}>
            {content}
          </View>
        )}
        {onRemove ? (
          <Pressable
            role="button"
            aria-label={text ? `${removeLabel} ${text}` : removeLabel}
            disabled={disabled}
            hitSlop={{ top: slopY, bottom: slopY, left: 4, right: 8 }}
            onPress={onRemove}
            style={({ pressed: p }) => ({
              alignSelf: "stretch",
              justifyContent: "center",
              paddingRight: s.px - 4,
              opacity: p ? 0.6 : 1
            })}
          >
            <View
              style={{
                width: s.icon + 2,
                height: s.icon + 2,
                borderRadius: t.radius.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: t.alpha(v.fg, 0.12)
              }}
            >
              <CrossMark size={Math.round(s.icon * 0.55)} color={v.fg} stroke={1.5} />
            </View>
          </Pressable>
        ) : null}
      </View>
    );
  }
);
Chip.displayName = "Chip";

type ChipGroupBaseProps = Omit<ViewProps, "style" | "children"> & {
  disabled?: boolean;
  /** Variante padrão dos chips. */
  variant?: ChipVariant;
  /** Tamanho padrão dos chips. */
  size?: ChipSize;
  /** Quebra linha quando não cabe (padrão true). false = uma linha só. */
  wrap?: boolean;
  /** Espaço entre chips (escala de 4px). Padrão 2. */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export type ChipGroupSingleProps = ChipGroupBaseProps & {
  /** Seleção única (padrão). */
  multiple?: false;
  /** Valor selecionado (controlado). `null` = nenhum. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Tocar no selecionado desmarca (padrão true). */
  allowDeselect?: boolean;
};

export type ChipGroupMultipleProps = ChipGroupBaseProps & {
  /** Seleção múltipla. */
  multiple: true;
  /** Valores selecionados (controlado). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Máximo de selecionados. */
  max?: number;
};

export type ChipGroupProps = ChipGroupSingleProps | ChipGroupMultipleProps;

const GROUP_KEYS = ["multiple", "value", "defaultValue", "onValueChange", "allowDeselect", "max"];
const toList = (v: string | string[] | null | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

/** Grupo de chips com seleção única ou múltipla (`multiple`). Chips precisam de `value`. */
export const ChipGroup: RefComponent<ChipGroupProps> = React.forwardRef<ViewRef, ChipGroupProps>(
  (props, ref) => {
    const t = useAura();
    const { disabled = false, variant, size, wrap = true, gap = 2, style, children } = props;
    const multiple = props.multiple === true;
    const allowDeselect = props.multiple ? true : (props.allowDeselect ?? true);
    const max = props.multiple ? props.max : undefined;

    const [inner, setInner] = React.useState<string[]>(() => toList(props.defaultValue));
    const controlled = props.value !== undefined;
    const selected = controlled ? toList(props.value) : inner;

    // callback/props mais recentes p/ o toggle estável
    const latest = React.useRef(props);
    latest.current = props;

    const toggle = (v: string) => {
      const has = selected.includes(v);
      let next: string[];
      if (multiple) {
        if (has) next = selected.filter((x) => x !== v);
        else if (max !== undefined && selected.length >= max) return;
        else next = [...selected, v];
      } else {
        if (has && !allowDeselect) return;
        next = has ? [] : [v];
      }
      if (!controlled) setInner(next);
      const p = latest.current;
      if (p.multiple) p.onValueChange?.(next);
      else p.onValueChange?.(next[0] ?? null);
    };

    const ctx: ChipGroupContextValue = {
      multiple,
      isSelected: (v) => selected.includes(v),
      toggle,
      disabled,
      variant,
      size
    };

    // tira as props do grupo antes de repassar o resto à View
    const viewProps: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      if (
        !GROUP_KEYS.includes(k) &&
        !["disabled", "variant", "size", "wrap", "gap", "style", "children"].includes(k)
      )
        viewProps[k] = v;
    }

    return (
      <ChipGroupContext.Provider value={ctx}>
        <View
          ref={ref}
          role={multiple ? "group" : "radiogroup"}
          aria-disabled={disabled || undefined}
          style={[
            { flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap", gap: t.space(gap) },
            style
          ]}
          {...(viewProps as ViewProps)}
        >
          {children}
        </View>
      </ChipGroupContext.Provider>
    );
  }
);
ChipGroup.displayName = "ChipGroup";
