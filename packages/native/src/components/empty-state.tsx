import * as React from "react";
import { View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { Button } from "./button";
import { Text } from "./text";

/** Ação simples: vira um `<Button>` do tema. */
export type EmptyStateAction = { label: string; onPress: () => void };

const isAction = (value: unknown): value is EmptyStateAction =>
  typeof value === "object" &&
  value !== null &&
  !React.isValidElement(value) &&
  "label" in value &&
  "onPress" in value;

export type EmptyStateProps = ViewProps & {
  /** Ícone (fica num círculo suave da cor primária). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Botão `{ label, onPress }` ou qualquer elemento. */
  action?: React.ReactNode | EmptyStateAction;
  /** Menos respiro (p/ listas e cards). */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

/** Estado vazio: ícone, título, descrição e ação centralizados. */
export const EmptyState: RefComponent<EmptyStateProps> = React.forwardRef<ViewRef, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      compact = false,
      style,
      titleStyle,
      descriptionStyle,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const circle = compact ? 48 : 64;
    return (
      <View
        ref={ref}
        style={[
          {
            alignItems: "center",
            justifyContent: "center",
            padding: t.space(compact ? 4 : 8),
            gap: t.space(compact ? 2 : 3)
          },
          style
        ]}
        {...props}
      >
        {icon ? (
          <View
            style={{
              width: circle,
              height: circle,
              borderRadius: circle / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: t.alpha(t.colors.primary, 0.1),
              marginBottom: t.space(1)
            }}
          >
            {icon}
          </View>
        ) : null}
        {typeof title === "string" ? (
          <Text role="heading" variant="title" align="center" style={titleStyle}>
            {title}
          </Text>
        ) : (
          title
        )}
        {description ? (
          typeof description === "string" ? (
            <Text
              variant="bodySm"
              tone="muted"
              align="center"
              style={[{ maxWidth: 320 }, descriptionStyle]}
            >
              {description}
            </Text>
          ) : (
            description
          )
        ) : null}
        {action ? (
          <View style={{ marginTop: t.space(2) }}>
            {isAction(action) ? <Button onPress={action.onPress}>{action.label}</Button> : action}
          </View>
        ) : null}
      </View>
    );
  }
);
EmptyState.displayName = "EmptyState";
