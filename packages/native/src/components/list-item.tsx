import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { Text } from "./text";

const isText = (node: React.ReactNode): node is string | number =>
  typeof node === "string" || typeof node === "number";

export type ListItemProps = Omit<PressableProps, "style" | "children"> & {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Elemento à esquerda (ícone, Avatar…). */
  left?: React.ReactNode;
  /** Elemento à direita (texto simples vira valor em cinza; ou Switch, Badge…). */
  right?: React.ReactNode;
  /** Seta "›" de navegação. */
  chevron?: boolean;
  /** Título na cor `destructive` (ex.: "Sair", "Excluir conta"). */
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
};

/** Linha de lista estilo iOS/Android: título, subtítulo, slots e seta. Tocável com `onPress`. */
export const ListItem: RefComponent<ListItemProps> = React.forwardRef<ViewRef, ListItemProps>(
  (
    {
      title,
      subtitle,
      left,
      right,
      chevron = false,
      destructive = false,
      onPress,
      onLongPress,
      disabled,
      style,
      titleStyle,
      subtitleStyle,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const interactive = !!(onPress || onLongPress);
    const base: ViewStyle = {
      minHeight: subtitle ? 60 : 52,
      flexDirection: "row",
      alignItems: "center",
      gap: t.space(3),
      paddingHorizontal: t.space(4),
      paddingVertical: t.space(2.5),
      opacity: disabled ? 0.5 : 1
    };
    const label =
      ariaLabel ??
      (isText(title)
        ? [title, isText(subtitle) ? subtitle : undefined].filter((x) => x !== undefined).join(", ")
        : undefined);

    const content = (
      <>
        {left}
        <View style={{ flex: 1, gap: 2 }}>
          {isText(title) ? (
            <Text color={destructive ? "destructive" : undefined} style={titleStyle}>
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle ? (
            isText(subtitle) ? (
              <Text variant="bodySm" tone="muted" style={subtitleStyle}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            )
          ) : null}
        </View>
        {isText(right) ? (
          <Text variant="bodySm" tone="muted">
            {right}
          </Text>
        ) : (
          right
        )}
        {chevron ? (
          <Text
            aria-hidden
            tone="muted"
            style={{ fontSize: 24, lineHeight: 26, marginLeft: -t.space(1) }}
          >
            ›
          </Text>
        ) : null}
      </>
    );

    if (!interactive) {
      return (
        <View ref={ref} aria-label={ariaLabel} style={[base, style]} {...(props as ViewProps)}>
          {content}
        </View>
      );
    }
    return (
      <Pressable
        ref={ref}
        role="button"
        aria-label={label}
        aria-disabled={!!disabled}
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [base, pressed ? { backgroundColor: t.colors.muted } : null, style]}
        {...props}
      >
        {content}
      </Pressable>
    );
  }
);
ListItem.displayName = "ListItem";

export type ListSectionProps = ViewProps & {
  /** Título da seção (caixa alta pequena). */
  title?: React.ReactNode;
  /** Nota abaixo do grupo. */
  footer?: React.ReactNode;
  /** Grupo com cantos arredondados e borda (padrão true); false = largura total. */
  inset?: boolean;
  /** Recuo esquerdo das divisórias em px (padrão 16). */
  dividerInset?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

/** Grupo de ListItems estilo "Ajustes" do iOS, com título e divisórias. */
export const ListSection: RefComponent<ListSectionProps> = React.forwardRef<
  ViewRef,
  ListSectionProps
>(
  (
    {
      title,
      footer,
      inset = true,
      dividerInset,
      children,
      style,
      contentStyle,
      titleStyle,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const hairline = StyleSheet.hairlineWidth * 2;
    const items = React.Children.toArray(children);
    const indent = dividerInset ?? t.space(4);

    return (
      <View ref={ref} style={[{ gap: t.space(1.5) }, style]} {...props}>
        {title ? (
          isText(title) ? (
            <Text
              role="heading"
              variant="caption"
              tone="muted"
              weight="semibold"
              style={[
                { textTransform: "uppercase", letterSpacing: 0.6, paddingHorizontal: t.space(4) },
                titleStyle
              ]}
            >
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}
        <View
          role="list"
          style={[
            { backgroundColor: t.colors.surface, borderColor: t.colors.border },
            inset
              ? { borderRadius: t.radius.lg, borderWidth: hairline, overflow: "hidden" }
              : { borderTopWidth: hairline, borderBottomWidth: hairline },
            contentStyle
          ]}
        >
          {items.map((child, i) => (
            <React.Fragment key={React.isValidElement(child) && child.key != null ? child.key : i}>
              {i > 0 ? (
                <View
                  aria-hidden
                  style={{ height: hairline, marginLeft: indent, backgroundColor: t.colors.border }}
                />
              ) : null}
              <View role="listitem">{child}</View>
            </React.Fragment>
          ))}
        </View>
        {footer ? (
          isText(footer) ? (
            <Text variant="caption" tone="muted" style={{ paddingHorizontal: t.space(4) }}>
              {footer}
            </Text>
          ) : (
            footer
          )
        ) : null}
      </View>
    );
  }
);
ListSection.displayName = "ListSection";
