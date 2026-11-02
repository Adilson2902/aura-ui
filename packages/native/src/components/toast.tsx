import * as React from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import { StatusIcon, type StatusTone } from "./alert";
import { Button } from "./button";
import { useReducedMotion } from "./overlay";
import { NATIVE_DRIVER } from "./pressable";
import { Text } from "./text";

declare const __DEV__: boolean | undefined;

/** Duração da animação de saída — o toast sai da árvore depois disso. */
const EXIT_MS = 200;

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "bottom";
export type ToastAction = { label: string; onPress: () => void };

export type ToastOptions = {
  /** Id próprio: chamar de novo com o mesmo id atualiza o toast. */
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Em ms (padrão do provider: 4000). `0` ou `Infinity` = só fecha no toque. */
  duration?: number;
  /** Botão de ação (ex.: "Desfazer"). Fecha o toast depois de rodar. */
  action?: ToastAction;
  /** Ícone próprio; `null` esconde o ícone da variante. */
  icon?: React.ReactNode;
  /** Chamado quando o toast começa a sair. */
  onDismiss?: () => void;
};

export type ToastShortcutOptions = Omit<ToastOptions, "title" | "variant">;

export type ToastFn = {
  (options: ToastOptions): string;
  success: (title: string, options?: ToastShortcutOptions) => string;
  error: (title: string, options?: ToastShortcutOptions) => string;
  warning: (title: string, options?: ToastShortcutOptions) => string;
  info: (title: string, options?: ToastShortcutOptions) => string;
};

export type ToastApi = {
  /** Mostra um toast; retorna o id. Atalhos: `toast.success/error/warning/info(title, opts?)`. */
  toast: ToastFn;
  /** Fecha um toast pelo id (ou todos, sem argumento). */
  dismiss: (id?: string) => void;
};

type ToastItem = ToastOptions & { id: string; variant: ToastVariant; open: boolean };

const TONE: Record<Exclude<ToastVariant, "default">, StatusTone> = {
  success: "success",
  error: "destructive",
  warning: "warning",
  info: "info"
};

const warnNoProvider = () => {
  if (typeof __DEV__ === "undefined" || __DEV__) {
    console.warn("aura-ui-native: useToast() precisa de <ToastProvider> acima.");
  }
  return "";
};

const FALLBACK: ToastApi = {
  toast: Object.assign((_options: ToastOptions) => warnNoProvider(), {
    success: warnNoProvider,
    error: warnNoProvider,
    warning: warnNoProvider,
    info: warnNoProvider
  }),
  dismiss: () => {
    warnNoProvider();
  }
};

const ToastContext = React.createContext<ToastApi>(FALLBACK);

/** API de toasts: `const { toast, dismiss } = useToast(); toast.success("Salvo!")`. */
export function useToast(): ToastApi {
  return React.useContext(ToastContext);
}

export type ToastProviderProps = {
  children?: React.ReactNode;
  /** Borda onde os toasts aparecem (padrão "top"). */
  position?: ToastPosition;
  /** Máximo empilhado; os mais antigos saem (padrão 3). */
  max?: number;
  /** Duração padrão em ms (padrão 4000). */
  duration?: number;
  /** Distância da borda em px (padrão 48 no topo, 32 embaixo). */
  offset?: number;
  /** Dica acessível do toque-para-fechar (padrão "Toque para fechar"). */
  closeHint?: string;
  /** Estilo da camada dos toasts. */
  style?: StyleProp<ViewStyle>;
};

let toastCounter = 0;

/**
 * Provider de toasts — envolva o app (fica num `View` com `flex: 1`).
 * Os toasts aparecem por cima do conteúdo, empilham até `max` e somem sozinhos.
 */
export function ToastProvider({
  children,
  position = "top",
  max = 3,
  duration = 4000,
  offset,
  closeHint = "Toque para fechar",
  style
}: ToastProviderProps) {
  const t = useAura();
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const itemsRef = React.useRef<ToastItem[]>([]);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const config = React.useRef({ max, duration });
  config.current = { max, duration };

  React.useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((handle) => clearTimeout(handle));
      map.clear();
    };
  }, []);

  const api = React.useMemo<ToastApi>(() => {
    const commit = (next: ToastItem[]) => {
      itemsRef.current = next;
      setItems(next);
    };
    const clearTimer = (id: string) => {
      const handle = timers.current.get(id);
      if (handle !== undefined) clearTimeout(handle);
      timers.current.delete(id);
    };
    const later = (id: string, ms: number, fn: () => void) => {
      clearTimer(id);
      timers.current.set(
        id,
        setTimeout(() => {
          timers.current.delete(id);
          fn();
        }, ms)
      );
    };

    const dismiss = (id?: string) => {
      const targets = itemsRef.current.filter((i) => i.open && (id === undefined || i.id === id));
      if (targets.length === 0) return;
      const ids = new Set(targets.map((i) => i.id));
      commit(itemsRef.current.map((i) => (ids.has(i.id) ? { ...i, open: false } : i)));
      for (const item of targets) {
        // sai da árvore depois da animação (se foi reaberto com o mesmo id, fica)
        later(item.id, EXIT_MS, () =>
          commit(itemsRef.current.filter((i) => i.id !== item.id || i.open))
        );
        item.onDismiss?.();
      }
    };

    const show = (options: ToastOptions) => {
      const id = options.id ?? `aura-toast-${++toastCounter}`;
      const item: ToastItem = { ...options, id, variant: options.variant ?? "default", open: true };
      const exists = itemsRef.current.some((i) => i.id === id);
      commit(
        exists ? itemsRef.current.map((i) => (i.id === id ? item : i)) : [...itemsRef.current, item]
      );

      const open = itemsRef.current.filter((i) => i.open);
      const overflow = open.length - Math.max(1, config.current.max);
      for (let k = 0; k < overflow; k++) dismiss(open[k]!.id);

      const ms = options.duration ?? config.current.duration;
      if (ms > 0 && Number.isFinite(ms)) later(id, ms, () => dismiss(id));
      else clearTimer(id);
      return id;
    };

    const shortcut = (variant: ToastVariant) => (title: string, options?: ToastShortcutOptions) =>
      show({ ...options, title, variant });

    const toast: ToastFn = Object.assign(show, {
      success: shortcut("success"),
      error: shortcut("error"),
      warning: shortcut("warning"),
      info: shortcut("info")
    });
    return { toast, dismiss };
  }, []);

  const edge = offset ?? (position === "top" ? t.space(12) : t.space(8));
  // o mais novo fica mais perto da borda
  const ordered = position === "top" ? [...items].reverse() : items;

  return (
    <ToastContext.Provider value={api}>
      <View style={{ flex: 1 }}>
        {children}
        <View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
              gap: t.space(2),
              paddingHorizontal: t.space(4),
              zIndex: 9999,
              elevation: 24,
              pointerEvents: "box-none"
            },
            position === "top" ? { top: edge } : { bottom: edge },
            style
          ]}
        >
          {ordered.map((item) => (
            <ToastView
              key={item.id}
              item={item}
              position={position}
              closeHint={closeHint}
              onDismiss={api.dismiss}
            />
          ))}
        </View>
      </View>
    </ToastContext.Provider>
  );
}

type ToastViewProps = {
  item: ToastItem;
  position: ToastPosition;
  closeHint: string;
  onDismiss: (id: string) => void;
};

function ToastView({ item, position, closeHint, onDismiss }: ToastViewProps) {
  const t = useAura();
  const reduced = useReducedMotion();
  const anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduced) {
      anim.setValue(item.open ? 1 : 0);
      return;
    }
    Animated.timing(anim, {
      toValue: item.open ? 1 : 0,
      duration: item.open ? 260 : EXIT_MS,
      easing: item.open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: NATIVE_DRIVER
    }).start();
  }, [anim, item.open, reduced]);

  // iOS não tem live region: anuncia direto p/ o VoiceOver
  React.useEffect(() => {
    if (Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(
        [item.title, item.description].filter(Boolean).join(". ")
      );
    }
  }, [item.title, item.description]);

  const translateY = React.useMemo(
    () => anim.interpolate({ inputRange: [0, 1], outputRange: [position === "top" ? -16 : 16, 0] }),
    [anim, position]
  );
  const scale = React.useMemo(
    () => anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }),
    [anim]
  );
  const icon =
    item.icon !== undefined ? (
      item.icon
    ) : item.variant === "default" ? null : (
      <StatusIcon tone={TONE[item.variant]} />
    );
  const action = item.action;

  return (
    <Animated.View
      aria-live="polite"
      style={[
        {
          width: "100%",
          maxWidth: 480,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.lg,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.border,
          pointerEvents: item.open ? "auto" : "none",
          ...t.shadow(3)
        },
        { opacity: anim, transform: [{ translateY }, { scale }] }
      ]}
    >
      <Pressable
        role="button"
        accessibilityHint={closeHint}
        onPress={() => onDismiss(item.id)}
        style={{
          flex: 1,
          minHeight: 52,
          flexDirection: "row",
          alignItems: "center",
          gap: t.space(3),
          paddingVertical: t.space(3),
          paddingLeft: t.space(3.5),
          paddingRight: action ? t.space(2) : t.space(3.5)
        }}
      >
        {icon}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" weight="semibold">
            {item.title}
          </Text>
          {item.description ? (
            <Text variant="bodySm" tone="muted">
              {item.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
      {action ? (
        <Button
          size="sm"
          variant="soft"
          hitSlop={4}
          onPress={() => {
            action.onPress();
            onDismiss(item.id);
          }}
          style={{ marginRight: t.space(2.5) }}
        >
          {action.label}
        </Button>
      ) : null}
    </Animated.View>
  );
}
