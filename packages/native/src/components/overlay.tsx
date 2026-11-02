import * as React from "react";
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import { useControllableState } from "./form-utils";

/** Orientações aceitas pelos overlays (sem isso o Modal do iOS fica preso em retrato). */
export const MODAL_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
] as const;

/** `true` quando o usuário ativou "reduzir movimento" no sistema. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    // defensivo: mocks de teste podem não devolver Promise
    const query = AccessibilityInfo.isReduceMotionEnabled?.();
    query
      ?.then((value) => {
        if (alive && value) setReduced(true);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (value: boolean) => {
      if (alive) setReduced(!!value);
    });
    return () => {
      alive = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

// Estado controlado/não-controlado: mesmo hook dos formulários.
export { useControllableState };

/** Props comuns de abrir/fechar dos overlays. */
export type OverlayStateProps = {
  /** Aberto (controlado). */
  open?: boolean;
  /** Aberto inicialmente (não-controlado). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function useOpenState({ open, defaultOpen = false, onOpenChange }: OverlayStateProps) {
  return useControllableState(open, defaultOpen, onOpenChange);
}

/** Elemento que abre o overlay ao ser tocado (ex.: `<Button>Abrir</Button>`). */
export type TriggerElement = React.ReactElement<{
  onPress?: ((event: GestureResponderEvent) => void) | null;
  "aria-expanded"?: boolean;
}>;

/** Clona o gatilho encadeando o `onPress` original com a abertura. */
export function renderTrigger(
  trigger: TriggerElement | undefined,
  open: boolean,
  onOpen: () => void
): React.ReactNode {
  if (!trigger || !React.isValidElement(trigger)) return null;
  const original = trigger.props.onPress;
  return React.cloneElement(trigger, {
    "aria-expanded": open,
    onPress: (event: GestureResponderEvent) => {
      original?.(event);
      onOpen();
    }
  });
}

/**
 * Mantém o overlay montado enquanto a animação de saída roda.
 * `enter` roda depois que o conteúdo foi montado; `exit` recebe `done`
 * (chame ao terminar) e só então o overlay desmonta e `onExited` dispara.
 */
export function usePresence(
  open: boolean,
  enter: () => void,
  exit: (done: () => void) => void,
  onExited?: () => void
): boolean {
  const [mounted, setMounted] = React.useState(open);
  const mountedRef = React.useRef(open);
  const fns = React.useRef({ enter, exit, onExited });
  fns.current = { enter, exit, onExited };

  React.useEffect(() => {
    if (open) {
      if (!mountedRef.current) {
        mountedRef.current = true;
        setMounted(true);
      }
      return;
    }
    if (!mountedRef.current) return;
    let cancelled = false;
    fns.current.exit(() => {
      if (cancelled) return;
      mountedRef.current = false;
      setMounted(false);
      fns.current.onExited?.();
    });
    // reabriu no meio da saída: ignora o `done` atrasado
    return () => {
      cancelled = true;
    };
  }, [open]);

  React.useEffect(() => {
    if (open && mounted) fns.current.enter();
  }, [open, mounted]);

  return mounted;
}

export type BackdropProps = {
  opacity: Animated.Value | Animated.AnimatedInterpolation<number>;
  /** Sem `onPress` o fundo não é tocável (overlay não-dispensável). */
  onPress?: () => void;
  /** Rótulo acessível do toque-para-fechar. */
  label: string;
  style?: StyleProp<ViewStyle>;
};

/** Fundo escurecido dos overlays (preto translúcido, mais denso no escuro). */
export function Backdrop({ opacity, onPress, label, style }: BackdropProps) {
  const t = useAura();
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: t.isDark ? "rgba(0, 0, 0, 0.62)" : "rgba(0, 0, 0, 0.45)", opacity },
        style
      ]}
    >
      {onPress ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onPress}
          role="button"
          aria-label={label}
        />
      ) : null}
    </Animated.View>
  );
}
