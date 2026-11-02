import * as React from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type ImageURISource,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { Text } from "./text";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

const SIZES: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

const STATUS_LABELS: Record<AvatarStatus, string> = {
  online: "online",
  offline: "offline",
  busy: "ocupado",
  away: "ausente"
};

const toPx = (size: AvatarSize | number) => (typeof size === "number" ? size : SIZES[size]);
const radiusFor = (px: number, shape: AvatarShape) =>
  shape === "circle" ? px / 2 : Math.max(4, Math.round(px * 0.22));
const ringFor = (px: number) => Math.max(2, Math.round(px / 20));

/** Chave estável da imagem (reinicia o fallback só quando a imagem muda de verdade). */
function sourceKey(source: ImageSourcePropType | string | undefined): string | number | undefined {
  if (source == null || typeof source === "string" || typeof source === "number")
    return source ?? undefined;
  if (Array.isArray(source))
    return (source as readonly ImageURISource[]).map((s) => s.uri ?? "").join("|");
  return (source as ImageURISource).uri;
}

/** Iniciais do nome: "Ana Maria Souza" → "AS"; "ana" → "A". */
export function getInitials(name?: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = Array.from(parts[0]!)[0] ?? "";
  const last = parts.length > 1 ? (Array.from(parts[parts.length - 1]!)[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export type AvatarProps = ViewProps & {
  /** Imagem (`require(...)`, `{ uri }` ou a URL direto). Se falhar, cai nas iniciais. */
  source?: ImageSourcePropType | string;
  /** Nome — gera as iniciais do fallback e o rótulo acessível. */
  name?: string;
  /** Tamanho: xs 24 · sm 32 · md 40 · lg 48 · xl 64 (ou px). */
  size?: AvatarSize | number;
  shape?: AvatarShape;
  /** Bolinha de status no canto. */
  status?: AvatarStatus;
  /** Anel na cor `surface` (o AvatarGroup liga sozinho p/ separar a sobreposição). */
  ring?: boolean;
  /** Conteúdo do fallback no lugar das iniciais (ex.: ícone). */
  fallback?: React.ReactNode;
  /** Textos do status p/ leitores de tela (padrão em português). */
  statusLabels?: Partial<Record<AvatarStatus, string>>;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Avatar com imagem, fallback de iniciais, formato e status. */
export const Avatar: RefComponent<AvatarProps> = React.forwardRef<ViewRef, AvatarProps>(
  (
    {
      source,
      name,
      size = "md",
      shape = "circle",
      status,
      ring = false,
      fallback,
      statusLabels,
      style,
      imageStyle,
      textStyle,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const px = toPx(size);
    const src = typeof source === "string" ? { uri: source } : source;
    const srcKey = sourceKey(source);
    const [state, setState] = React.useState<"loading" | "loaded" | "error">("loading");
    React.useEffect(() => setState("loading"), [srcKey]);

    const showImage = !!src && state !== "error";
    const showFallback = !src || state !== "loaded";
    const initials = getInitials(name);
    const font = Math.max(10, Math.round(px * 0.38));
    const dot = Math.max(8, Math.round(px * 0.28));
    const statusColor: Record<AvatarStatus, string> = {
      online: t.colors.success,
      offline: t.colors.mutedForeground,
      busy: t.colors.destructive,
      away: t.colors.warning
    };
    const statusText = status ? (statusLabels?.[status] ?? STATUS_LABELS[status]) : undefined;
    const label = ariaLabel ?? ([name, statusText].filter(Boolean).join(", ") || undefined);

    return (
      <View
        ref={ref}
        role="img"
        accessible
        aria-label={label}
        style={[{ width: px, height: px }, style]}
        {...props}
      >
        <View
          style={{
            width: px,
            height: px,
            borderRadius: radiusFor(px, shape),
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: t.alpha(t.colors.primary, 0.14),
            ...(ring ? { borderWidth: ringFor(px), borderColor: t.colors.surface } : null)
          }}
        >
          {showFallback
            ? (fallback ??
              (initials ? (
                <Text
                  weight="semibold"
                  color="primary"
                  style={[
                    {
                      fontSize: font,
                      lineHeight: Math.round(font * 1.2),
                      includeFontPadding: false
                    },
                    textStyle
                  ]}
                >
                  {initials}
                </Text>
              ) : null))
            : null}
          {showImage ? (
            <Image
              source={src}
              accessible={false}
              resizeMode="cover"
              onLoad={() => setState("loaded")}
              onError={() => setState("error")}
              style={[StyleSheet.absoluteFill, imageStyle]}
            />
          ) : null}
        </View>
        {status ? (
          <View
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: statusColor[status],
              borderWidth: 2,
              borderColor: t.colors.surface
            }}
          />
        ) : null}
      </View>
    );
  }
);
Avatar.displayName = "Avatar";

export type AvatarGroupProps = ViewProps & {
  /** Avatares (`<Avatar />`). */
  children?: React.ReactNode;
  /** Máximo visível; o resto vira um contador "+N". */
  max?: number;
  /** Tamanho aplicado a todos (cada Avatar pode sobrescrever). */
  size?: AvatarSize | number;
  shape?: AvatarShape;
  /** Sobreposição em px (padrão ~28% do tamanho). */
  overlap?: number;
  /** Rótulo acessível do contador (padrão "mais N"). */
  moreLabel?: (count: number) => string;
  style?: StyleProp<ViewStyle>;
};

/** Avatares sobrepostos com anel na cor `surface` e contador +N. */
export const AvatarGroup: RefComponent<AvatarGroupProps> = React.forwardRef<
  ViewRef,
  AvatarGroupProps
>(
  (
    {
      children,
      max,
      size = "md",
      shape = "circle",
      overlap,
      moreLabel = (n) => `mais ${n}`,
      style,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const px = toPx(size);
    const all = React.Children.toArray(children).filter(
      React.isValidElement
    ) as React.ReactElement<AvatarProps>[];
    const limit = max !== undefined && max >= 0 && max < all.length ? max : all.length;
    const visible = all.slice(0, limit);
    const extra = all.length - visible.length;
    const shift = overlap ?? Math.round(px * 0.28);

    return (
      <View
        ref={ref}
        role="group"
        style={[{ flexDirection: "row", alignItems: "center" }, style]}
        {...props}
      >
        {visible.map((child, i) =>
          React.cloneElement(child, {
            size: child.props.size ?? size,
            shape: child.props.shape ?? shape,
            ring: true,
            style: [child.props.style, i > 0 ? { marginLeft: -shift } : null]
          })
        )}
        {extra > 0 ? (
          <View
            role="img"
            accessible
            aria-label={moreLabel(extra)}
            style={{
              width: px,
              height: px,
              marginLeft: visible.length > 0 ? -shift : 0,
              borderRadius: radiusFor(px, shape),
              borderWidth: ringFor(px),
              borderColor: t.colors.surface,
              backgroundColor: t.colors.muted,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              weight="semibold"
              tone="muted"
              style={{
                fontSize: Math.max(10, Math.round(px * 0.34)),
                lineHeight: Math.round(px * 0.42),
                includeFontPadding: false
              }}
            >
              {`+${extra}`}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";
