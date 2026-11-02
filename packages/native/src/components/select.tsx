import * as React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import { BottomSheet } from "./bottom-sheet";
import { useControllableState } from "./overlay";
import { Text } from "./text";

export type SelectValue = string | number;

export type SelectOption<V extends SelectValue = string> = {
  value: V;
  label: string;
  /** Texto curto abaixo do rótulo (também entra na busca). */
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type SelectProps<V extends SelectValue = string> = {
  options: readonly SelectOption<V>[];
  /** Valor selecionado (controlado). `null` = nada selecionado. */
  value?: V | null;
  /** Valor inicial (não-controlado). */
  defaultValue?: V | null;
  onValueChange?: (value: V, option: SelectOption<V>) => void;
  /** Texto quando nada está selecionado (padrão "Selecione…"). */
  placeholder?: string;
  /** Rótulo acima do campo. */
  label?: string;
  /** Texto de ajuda abaixo do campo. */
  helperText?: string;
  /** Erro: string mostra a mensagem; `true` só pinta a borda. */
  error?: string | boolean;
  disabled?: boolean;
  /** Campo de busca no topo da lista. */
  searchable?: boolean;
  /** Placeholder da busca (padrão "Buscar…"). */
  searchPlaceholder?: string;
  /** Texto quando a busca não acha nada (padrão "Nenhuma opção encontrada"). */
  emptyText?: string;
  /** Título do sheet (padrão: `label`). */
  sheetTitle?: string;
  /** Rótulo acessível do toque-fora do sheet (padrão "Fechar"). */
  closeLabel?: string;
  "aria-label"?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const normalize = (s: string) =>
  (typeof s.normalize === "function" ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s).toLowerCase();

/**
 * Seleção com visual de input: abre um BottomSheet com as opções,
 * ✓ no item escolhido e busca opcional (ignora acentos).
 */
export function Select<V extends SelectValue = string>({
  options,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = "Selecione…",
  label,
  helperText,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Buscar…",
  emptyText = "Nenhuma opção encontrada",
  sheetTitle,
  closeLabel,
  "aria-label": ariaLabel,
  testID,
  style,
  triggerStyle,
  textStyle
}: SelectProps<V>) {
  const t = useAura();
  const [value, setValue] = useControllableState<V | null>(valueProp, defaultValue);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = options.find((o) => o.value === value) ?? null;
  const errorText = typeof error === "string" && error ? error : undefined;
  const invalid = !!error;

  const filtered = React.useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return options;
    return options.filter(
      (o) =>
        normalize(o.label).includes(q) ||
        (o.description ? normalize(o.description).includes(q) : false)
    );
  }, [options, query]);

  const choose = (option: SelectOption<V>) => {
    if (option.disabled) return;
    setValue(option.value);
    onValueChange?.(option.value, option);
    setOpen(false);
  };

  const name = ariaLabel ?? label ?? sheetTitle ?? placeholder;
  const a11yLabel = selected ? `${name}: ${selected.label}` : name;

  return (
    <View style={[{ gap: t.space(1.5) }, style]}>
      {label ? <Text variant="label">{label}</Text> : null}
      <Pressable
        testID={testID}
        role="button"
        aria-label={a11yLabel}
        aria-expanded={open}
        aria-disabled={disabled}
        accessibilityHint={errorText}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          {
            minHeight: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: t.space(2),
            paddingHorizontal: t.space(3.5),
            borderRadius: t.radius.md,
            borderWidth: StyleSheet.hairlineWidth * 3,
            borderColor: invalid ? t.colors.destructive : open ? t.colors.ring : t.colors.border,
            backgroundColor: pressed ? t.colors.muted : t.colors.surface,
            opacity: disabled ? 0.5 : 1
          },
          triggerStyle
        ]}
      >
        {selected?.icon}
        <Text lines={1} tone={selected ? "default" : "muted"} style={[{ flex: 1 }, textStyle]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text aria-hidden tone="muted" style={{ fontSize: 14 }}>
          ▾
        </Text>
      </Pressable>
      {errorText || helperText ? (
        <Text variant="caption" tone={errorText ? "destructive" : "muted"}>
          {errorText ?? helperText}
        </Text>
      ) : null}

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={sheetTitle ?? label}
        aria-label={sheetTitle ?? label ?? name}
        closeLabel={closeLabel}
        snapHeight={searchable ? 0.7 : "auto"}
        scrollable={false}
        onClosed={() => setQuery("")}
      >
        {searchable ? (
          <View style={{ paddingHorizontal: t.space(4), paddingBottom: t.space(2) }}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor={t.colors.mutedForeground}
              aria-label={searchPlaceholder}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              style={{
                minHeight: 44,
                paddingHorizontal: t.space(3),
                borderRadius: t.radius.md,
                backgroundColor: t.colors.muted,
                color: t.colors.surfaceForeground,
                fontSize: 16
              }}
            />
          </View>
        ) : null}
        <FlatList
          data={filtered}
          extraData={value}
          keyExtractor={(o) => String(o.value)}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          role="radiogroup"
          aria-label={name}
          style={{ flexGrow: 0, flexShrink: 1 }}
          ListEmptyComponent={
            <Text tone="muted" align="center" style={{ padding: t.space(6) }}>
              {emptyText}
            </Text>
          }
          renderItem={({ item }) => {
            const isSelected = item.value === value;
            return (
              <Pressable
                role="radio"
                aria-checked={isSelected}
                aria-disabled={!!item.disabled}
                disabled={item.disabled}
                onPress={() => choose(item)}
                style={({ pressed }) => [
                  {
                    minHeight: 52,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: t.space(3),
                    paddingHorizontal: t.space(5),
                    paddingVertical: t.space(2.5),
                    opacity: item.disabled ? 0.45 : 1
                  },
                  isSelected ? { backgroundColor: t.alpha(t.colors.primary, 0.08) } : null,
                  pressed ? { backgroundColor: t.colors.muted } : null
                ]}
              >
                {item.icon}
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    weight={isSelected ? "semibold" : "regular"}
                    color={isSelected ? "primary" : undefined}
                  >
                    {item.label}
                  </Text>
                  {item.description ? (
                    <Text variant="caption" tone="muted">
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                {isSelected ? (
                  <Text aria-hidden color="primary" weight="bold" style={{ fontSize: 18 }}>
                    ✓
                  </Text>
                ) : null}
              </Pressable>
            );
          }}
        />
      </BottomSheet>
    </View>
  );
}
