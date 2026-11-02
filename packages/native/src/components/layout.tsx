import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type DimensionValue,
  type ScrollViewProps,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { resolveColor } from "../theme/color";
import { useAura, type AuraTheme } from "../theme/provider";
import type { RadiusToken, ShadowLevel } from "../theme/tokens";
import type { ColorToken, ViewRef, RefComponent } from "../theme/types";

type Space = number;
type Color = ColorToken | (string & {});

/** Props de estilo por token — `p={4}` = 16px, `bg="muted"`, `radius="lg"`, `shadow={2}`. */
export type BoxStyleProps = {
  p?: Space;
  px?: Space;
  py?: Space;
  pt?: Space;
  pr?: Space;
  pb?: Space;
  pl?: Space;
  m?: Space;
  mx?: Space;
  my?: Space;
  mt?: Space;
  mr?: Space;
  mb?: Space;
  ml?: Space;
  gap?: Space;
  rowGap?: Space;
  columnGap?: Space;
  bg?: Color;
  radius?: RadiusToken | number;
  /** `true` = 1px na cor `border`; número = largura. */
  border?: boolean | number;
  borderColor?: Color;
  shadow?: ShadowLevel;
  flex?: number;
  direction?: ViewStyle["flexDirection"];
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  self?: ViewStyle["alignSelf"];
  wrap?: boolean;
  w?: DimensionValue;
  h?: DimensionValue;
  minH?: DimensionValue;
  maxW?: DimensionValue;
  opacity?: number;
  overflow?: ViewStyle["overflow"];
};

const SPACE_KEYS: Record<string, keyof ViewStyle> = {
  p: "padding",
  px: "paddingHorizontal",
  py: "paddingVertical",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  pl: "paddingLeft",
  m: "margin",
  mx: "marginHorizontal",
  my: "marginVertical",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  ml: "marginLeft",
  gap: "gap",
  rowGap: "rowGap",
  columnGap: "columnGap"
};

/** Converte as props de token em ViewStyle. Use em componentes próprios. */
export function boxStyle(t: AuraTheme, props: BoxStyleProps): ViewStyle {
  const s: Record<string, unknown> = {};
  for (const [prop, styleKey] of Object.entries(SPACE_KEYS)) {
    const v = props[prop as keyof BoxStyleProps];
    if (typeof v === "number") s[styleKey] = t.space(v);
  }
  if (props.bg) s.backgroundColor = resolveColor(t.colors, props.bg);
  if (props.radius !== undefined)
    s.borderRadius = typeof props.radius === "number" ? props.radius : t.radius[props.radius];
  if (props.border) {
    s.borderWidth = props.border === true ? StyleSheet.hairlineWidth * 2 : props.border;
    s.borderColor = resolveColor(t.colors, props.borderColor ?? "border");
  } else if (props.borderColor) {
    s.borderColor = resolveColor(t.colors, props.borderColor);
  }
  if (props.shadow) Object.assign(s, t.shadow(props.shadow));
  if (props.flex !== undefined) s.flex = props.flex;
  if (props.direction) s.flexDirection = props.direction;
  if (props.align) s.alignItems = props.align;
  if (props.justify) s.justifyContent = props.justify;
  if (props.self) s.alignSelf = props.self;
  if (props.wrap) s.flexWrap = "wrap";
  if (props.w !== undefined) s.width = props.w;
  if (props.h !== undefined) s.height = props.h;
  if (props.minH !== undefined) s.minHeight = props.minH;
  if (props.maxW !== undefined) s.maxWidth = props.maxW;
  if (props.opacity !== undefined) s.opacity = props.opacity;
  if (props.overflow) s.overflow = props.overflow;
  return s as ViewStyle;
}

const BOX_PROP_NAMES = new Set([
  ...Object.keys(SPACE_KEYS),
  "bg",
  "radius",
  "border",
  "borderColor",
  "shadow",
  "flex",
  "direction",
  "align",
  "justify",
  "self",
  "wrap",
  "w",
  "h",
  "minH",
  "maxW",
  "opacity",
  "overflow"
]);

function splitProps<P extends object>(props: P) {
  const box: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) (BOX_PROP_NAMES.has(k) ? box : rest)[k] = v;
  return [box as BoxStyleProps, rest] as const;
}

export type BoxProps = ViewProps & BoxStyleProps;

/** View com props de token: `<Box p={4} bg="muted" radius="lg" shadow={2}>`. */
export const Box: RefComponent<BoxProps> = React.forwardRef<ViewRef, BoxProps>(
  ({ style, ...props }, ref) => {
    const t = useAura();
    const [box, rest] = splitProps(props);
    return <View ref={ref} style={[boxStyle(t, box), style]} {...(rest as ViewProps)} />;
  }
);
Box.displayName = "Box";

export type StackProps = BoxProps & {
  /** Espaço entre filhos (escala de 4px). Padrão 3 (12px). */
  space?: Space;
};

/** Pilha vertical (`VStack`) — `space` = gap entre filhos. */
export const VStack: RefComponent<StackProps> = React.forwardRef<ViewRef, StackProps>(
  ({ space = 3, ...props }, ref) => <Box ref={ref} direction="column" gap={space} {...props} />
);
VStack.displayName = "VStack";

/** Pilha horizontal (`HStack`) — alinha ao centro por padrão. */
export const HStack: RefComponent<StackProps> = React.forwardRef<ViewRef, StackProps>(
  ({ space = 3, align = "center", ...props }, ref) => (
    <Box ref={ref} direction="row" gap={space} align={align} {...props} />
  )
);
HStack.displayName = "HStack";

/** Alias de VStack (com `direction` p/ trocar). */
export const Stack = VStack;

/** Ocupa o espaço livre numa Stack (empurra o resto p/ a ponta). */
export function Spacer({ size }: { size?: Space }) {
  const t = useAura();
  return (
    <View
      style={size !== undefined ? { width: t.space(size), height: t.space(size) } : { flex: 1 }}
    />
  );
}

export type DividerProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
  /** Espaço antes/depois (escala de 4px). */
  spacing?: Space;
  color?: Color;
};

/** Linha divisória fina na cor `border`. */
export function Divider({
  orientation = "horizontal",
  spacing = 0,
  color = "border",
  style,
  ...props
}: DividerProps) {
  const t = useAura();
  const vertical = orientation === "vertical";
  return (
    <View
      role="none"
      style={[
        {
          backgroundColor: resolveColor(t.colors, color),
          ...(vertical
            ? {
                width: StyleSheet.hairlineWidth * 2,
                alignSelf: "stretch",
                marginHorizontal: t.space(spacing)
              }
            : {
                height: StyleSheet.hairlineWidth * 2,
                alignSelf: "stretch",
                marginVertical: t.space(spacing)
              })
        },
        style
      ]}
      {...props}
    />
  );
}

export type ScreenProps = ScrollViewProps & {
  /** Rolável (padrão true). */
  scroll?: boolean;
  /** Padding interno (escala de 4px). Padrão 4 (16px). */
  padding?: Space;
  /** Fundo: token ou cor (padrão `surface`). */
  bg?: Color;
  /** Sobe o conteúdo quando o teclado abre (padrão true). */
  keyboardAvoiding?: boolean;
};

/**
 * Tela: fundo do tema + padding + rolagem + teclado. Para áreas seguras
 * (notch), envolva com `SafeAreaView` de react-native-safe-area-context.
 */
export function Screen({
  scroll = true,
  padding = 4,
  bg = "surface",
  keyboardAvoiding = true,
  style,
  contentContainerStyle,
  children,
  ...props
}: ScreenProps) {
  const t = useAura();
  const background = { flex: 1, backgroundColor: resolveColor(t.colors, bg) };
  const inner = scroll ? (
    <ScrollView
      style={[background, style]}
      contentContainerStyle={[
        { padding: t.space(padding), gap: t.space(4) },
        contentContainerStyle
      ]}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[background, { padding: t.space(padding), gap: t.space(4) }, style]}>
      {children}
    </View>
  );
  if (!keyboardAvoiding || Platform.OS === "web") return inner;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {inner}
    </KeyboardAvoidingView>
  );
}
