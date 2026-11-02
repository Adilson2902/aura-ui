import * as React from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
import { Button } from "./button";
import {
  Backdrop,
  MODAL_ORIENTATIONS,
  renderTrigger,
  useOpenState,
  usePresence,
  useReducedMotion,
  type OverlayStateProps,
  type TriggerElement
} from "./overlay";
import { NATIVE_DRIVER } from "./pressable";
import { Text } from "./text";

export type DialogProps = OverlayStateProps & {
  /** Elemento que abre o diálogo ao ser tocado (ex.: `<Button>Abrir</Button>`). */
  trigger?: TriggerElement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Botões no rodapé (alinhados à direita). */
  actions?: React.ReactNode;
  /** Fecha ao tocar fora, no voltar do Android e no gesto de escape do iOS (padrão true). */
  dismissible?: boolean;
  /** Rótulo acessível do toque-fora (padrão "Fechar"). */
  closeLabel?: string;
  /** Papel acessível (padrão "dialog"; o AlertDialog usa "alertdialog"). */
  role?: "dialog" | "alertdialog";
  "aria-label"?: string;
  /** Chamado quando a animação de saída termina e o diálogo desmonta. */
  onClosed?: () => void;
  /** Largura máxima do card (padrão 420). */
  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  actionsStyle?: StyleProp<ViewStyle>;
};

/**
 * Diálogo modal: fundo escurecido + card central com fade e escala.
 * Controlado (`open`/`onOpenChange`) ou com `trigger`.
 */
export const Dialog: RefComponent<DialogProps> = React.forwardRef<ViewRef, DialogProps>(
  (
    {
      open: openProp,
      defaultOpen,
      onOpenChange,
      trigger,
      title,
      description,
      children,
      actions,
      dismissible = true,
      closeLabel = "Fechar",
      role = "dialog",
      "aria-label": ariaLabel,
      onClosed,
      maxWidth = 420,
      style,
      backdropStyle,
      titleStyle,
      descriptionStyle,
      actionsStyle
    },
    ref
  ) => {
    const t = useAura();
    const reduced = useReducedMotion();
    const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange });
    const progress = React.useRef(new Animated.Value(0)).current;
    const close = () => setOpen(false);

    const mounted = usePresence(
      open,
      () => {
        if (reduced) return progress.setValue(1);
        Animated.timing(progress, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER
        }).start();
      },
      (done) => {
        if (reduced) {
          progress.setValue(0);
          return done();
        }
        Animated.timing(progress, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER
        }).start(({ finished }) => {
          if (finished) done();
        });
      },
      onClosed
    );

    const scale = React.useMemo(
      () => progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }),
      [progress]
    );
    const label = ariaLabel ?? (typeof title === "string" ? title : undefined);

    return (
      <>
        {renderTrigger(trigger, open, () => setOpen(true))}
        {mounted ? (
          <Modal
            visible
            transparent
            animationType="none"
            statusBarTranslucent
            supportedOrientations={MODAL_ORIENTATIONS}
            onRequestClose={() => {
              if (dismissible) close();
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <Backdrop
                opacity={progress}
                onPress={dismissible ? close : undefined}
                label={closeLabel}
                style={backdropStyle}
              />
              {/* box-none: toques fora do card chegam ao backdrop */}
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: t.space(6),
                  pointerEvents: "box-none"
                }}
              >
                <Animated.View
                  ref={ref}
                  role={role}
                  aria-modal
                  aria-label={label}
                  onAccessibilityEscape={dismissible ? close : undefined}
                  style={[
                    {
                      width: "100%",
                      maxWidth,
                      gap: t.space(3),
                      padding: t.space(5),
                      borderRadius: t.radius.xl,
                      backgroundColor: t.colors.surface,
                      ...t.shadow(5),
                      ...(t.isDark
                        ? {
                            borderWidth: StyleSheet.hairlineWidth * 2,
                            borderColor: t.colors.border
                          }
                        : null)
                    },
                    { opacity: progress, transform: [{ scale }] },
                    style
                  ]}
                >
                  {title || description ? (
                    <View style={{ gap: t.space(1.5) }}>
                      {typeof title === "string" ? (
                        <Text role="heading" variant="title" style={titleStyle}>
                          {title}
                        </Text>
                      ) : (
                        title
                      )}
                      {typeof description === "string" ? (
                        <Text variant="bodySm" tone="muted" style={descriptionStyle}>
                          {description}
                        </Text>
                      ) : (
                        description
                      )}
                    </View>
                  ) : null}
                  {children}
                  {actions ? (
                    <View
                      style={[
                        {
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          gap: t.space(2),
                          marginTop: t.space(1)
                        },
                        actionsStyle
                      ]}
                    >
                      {actions}
                    </View>
                  ) : null}
                </Animated.View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        ) : null}
      </>
    );
  }
);
Dialog.displayName = "Dialog";

export type AlertDialogProps = Omit<DialogProps, "actions" | "role"> & {
  /** Texto do botão de confirmar (padrão "Confirmar"). */
  confirmLabel?: string;
  /** Texto do botão de cancelar (padrão "Cancelar"). */
  cancelLabel?: string;
  /**
   * Ao confirmar. Se retornar uma Promise, mostra loading e fecha quando
   * resolver (se rejeitar, continua aberto p/ o usuário tentar de novo).
   */
  onConfirm?: () => unknown;
  /** Ao cancelar (botão, toque fora ou voltar do Android). */
  onCancel?: () => void;
  /** Botão de confirmar vermelho (ações destrutivas). */
  destructive?: boolean;
  /** Loading controlado no botão de confirmar (bloqueia fechar). */
  loading?: boolean;
  /** Esconde o botão cancelar. */
  hideCancel?: boolean;
};

/** Atalho de confirmação: título, descrição, Cancelar/Confirmar, destrutivo e loading. */
export const AlertDialog: RefComponent<AlertDialogProps> = React.forwardRef<
  ViewRef,
  AlertDialogProps
>(
  (
    {
      open: openProp,
      defaultOpen,
      onOpenChange,
      confirmLabel = "Confirmar",
      cancelLabel = "Cancelar",
      onConfirm,
      onCancel,
      destructive = false,
      loading = false,
      hideCancel = false,
      dismissible = true,
      ...props
    },
    ref
  ) => {
    const t = useAura();
    const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange });
    const [pending, setPending] = React.useState(false);
    const busy = loading || pending;

    const cancel = () => {
      if (busy) return;
      onCancel?.();
      setOpen(false);
    };

    const confirm = () => {
      if (busy) return;
      const result = onConfirm?.();
      if (result && typeof (result as Promise<unknown>).then === "function") {
        setPending(true);
        (result as Promise<unknown>).then(
          () => {
            setPending(false);
            setOpen(false);
          },
          () => setPending(false)
        );
        return;
      }
      setOpen(false);
    };

    return (
      <Dialog
        ref={ref}
        role="alertdialog"
        {...props}
        open={open}
        dismissible={dismissible && !busy}
        onOpenChange={(next) => (next ? setOpen(true) : cancel())}
        actions={
          <View style={{ flex: 1, flexDirection: "row", gap: t.space(2) }}>
            {hideCancel ? null : (
              <View style={{ flex: 1 }}>
                <Button variant="outline" fullWidth disabled={busy} onPress={cancel}>
                  {cancelLabel}
                </Button>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Button
                variant={destructive ? "destructive" : "solid"}
                fullWidth
                loading={busy}
                onPress={confirm}
              >
                {confirmLabel}
              </Button>
            </View>
          </View>
        }
      />
    );
  }
);
AlertDialog.displayName = "AlertDialog";
