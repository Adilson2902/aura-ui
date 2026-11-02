import * as React from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle
} from "react-native";
import { useAura } from "../theme/provider";
import type { RefComponent, ViewRef } from "../theme/types";
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

/** Fração da altura arrastada (ou velocidade) que fecha o sheet ao soltar. */
const CLOSE_RATIO = 0.3;
const CLOSE_VELOCITY = 1.2;

export type BottomSheetProps = OverlayStateProps & {
  /** Elemento que abre o sheet ao ser tocado. */
  trigger?: TriggerElement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Altura: "auto" (padrão — acompanha o conteúdo até 90% da tela),
   * px (> 1) ou fração da tela (0–1, ex.: 0.5).
   */
  snapHeight?: number | "auto";
  /** Fecha ao tocar fora, arrastar p/ baixo e no voltar do Android (padrão true). */
  dismissible?: boolean;
  /** Conteúdo dentro de um ScrollView (padrão true). Use false p/ listas virtualizadas próprias. */
  scrollable?: boolean;
  /** Alça de arraste no topo (padrão true). */
  showHandle?: boolean;
  /** Rótulo acessível do toque-fora (padrão "Fechar"). */
  closeLabel?: string;
  "aria-label"?: string;
  /** Espaço inferior (indicador de home do iOS). Padrão 34 no iOS, 16 no resto. */
  bottomInset?: number;
  /** Chamado quando a animação de saída termina e o sheet desmonta. */
  onClosed?: () => void;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
};

/**
 * Painel que sobe da borda inferior: alça, arrastar p/ baixo fecha,
 * altura automática ou fixa e conteúdo rolável.
 */
export const BottomSheet: RefComponent<BottomSheetProps> = React.forwardRef<
  ViewRef,
  BottomSheetProps
>(
  (
    {
      open: openProp,
      defaultOpen,
      onOpenChange,
      trigger,
      title,
      description,
      children,
      snapHeight = "auto",
      dismissible = true,
      scrollable = true,
      showHandle = true,
      closeLabel = "Fechar",
      "aria-label": ariaLabel,
      bottomInset = Platform.OS === "ios" ? 34 : 16,
      onClosed,
      style,
      headerStyle,
      contentStyle,
      handleStyle,
      backdropStyle
    },
    ref
  ) => {
    const t = useAura();
    const reduced = useReducedMotion();
    const { height: winH } = useWindowDimensions();
    const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange });
    const translateY = React.useRef(new Animated.Value(winH)).current;
    const [sheetH, setSheetH] = React.useState(0);
    const travel = sheetH || winH;
    const close = React.useCallback(() => setOpen(false), [setOpen]);

    // valores atuais p/ o PanResponder (criado uma vez só)
    const live = React.useRef({ travel, dismissible, close });
    live.current = { travel, dismissible, close };

    const mounted = usePresence(
      open,
      () => {
        if (reduced) return translateY.setValue(0);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER
        }).start();
      },
      (done) => {
        if (reduced) {
          translateY.setValue(live.current.travel);
          return done();
        }
        Animated.timing(translateY, {
          toValue: live.current.travel,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: NATIVE_DRIVER
        }).start(({ finished }) => {
          if (finished) done();
        });
      },
      onClosed
    );

    const pan = React.useMemo(() => {
      let startY = 0;
      const settle = () =>
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: NATIVE_DRIVER,
          bounciness: 4,
          speed: 16
        }).start();
      return PanResponder.create({
        onMoveShouldSetPanResponder: (_e, g) =>
          live.current.dismissible && g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderGrant: () => {
          translateY.stopAnimation((value) => {
            startY = value;
          });
        },
        onPanResponderMove: (_e, g) => translateY.setValue(Math.max(0, startY + g.dy)),
        onPanResponderRelease: (_e, g) => {
          if (startY + g.dy > live.current.travel * CLOSE_RATIO || g.vy > CLOSE_VELOCITY)
            live.current.close();
          else settle();
        },
        onPanResponderTerminate: settle
      });
    }, [translateY]);

    const backdropOpacity = React.useMemo(
      () =>
        translateY.interpolate({
          inputRange: [0, travel],
          outputRange: [1, 0],
          extrapolate: "clamp"
        }),
      [translateY, travel]
    );

    const maxH = winH * 0.9;
    const fixedH =
      typeof snapHeight === "number"
        ? Math.min(snapHeight <= 1 ? winH * snapHeight : snapHeight, maxH)
        : undefined;
    const hasHeader = !!(title || description);
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
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <Backdrop
                opacity={backdropOpacity}
                onPress={dismissible ? close : undefined}
                label={closeLabel}
                style={backdropStyle}
              />
              <Animated.View
                ref={ref}
                role="dialog"
                aria-modal
                aria-label={label}
                onAccessibilityEscape={dismissible ? close : undefined}
                onLayout={(e) => {
                  const h = e.nativeEvent.layout.height;
                  if (Math.abs(h - sheetH) > 1) setSheetH(h);
                }}
                style={[
                  {
                    width: "100%",
                    maxWidth: 640,
                    alignSelf: "center",
                    maxHeight: maxH,
                    height: fixedH,
                    backgroundColor: t.colors.surface,
                    borderTopLeftRadius: t.radius.xl,
                    borderTopRightRadius: t.radius.xl,
                    ...t.shadow(5),
                    ...(t.isDark
                      ? { borderWidth: StyleSheet.hairlineWidth * 2, borderColor: t.colors.border }
                      : null)
                  },
                  { transform: [{ translateY }] },
                  style
                ]}
              >
                <View
                  {...pan.panHandlers}
                  style={[
                    { paddingTop: t.space(2), paddingBottom: hasHeader ? t.space(3) : t.space(2) },
                    headerStyle
                  ]}
                >
                  {showHandle ? (
                    <View
                      aria-hidden
                      style={[
                        {
                          alignSelf: "center",
                          width: 40,
                          height: 5,
                          borderRadius: t.radius.full,
                          backgroundColor: t.alpha(t.colors.mutedForeground, 0.35),
                          marginBottom: t.space(2)
                        },
                        handleStyle
                      ]}
                    />
                  ) : null}
                  {hasHeader ? (
                    <View style={{ paddingHorizontal: t.space(5), gap: t.space(1) }}>
                      {typeof title === "string" ? (
                        <Text role="heading" variant="title">
                          {title}
                        </Text>
                      ) : (
                        title
                      )}
                      {typeof description === "string" ? (
                        <Text variant="bodySm" tone="muted">
                          {description}
                        </Text>
                      ) : (
                        description
                      )}
                    </View>
                  ) : null}
                </View>
                {scrollable ? (
                  <ScrollView
                    style={fixedH ? { flex: 1 } : { flexGrow: 0, flexShrink: 1 }}
                    contentContainerStyle={[
                      {
                        paddingHorizontal: t.space(5),
                        paddingBottom: bottomInset,
                        gap: t.space(3)
                      },
                      contentStyle
                    ]}
                    keyboardShouldPersistTaps="handled"
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View
                    style={[
                      { flexShrink: 1, paddingBottom: bottomInset },
                      fixedH ? { flex: 1 } : null,
                      contentStyle
                    ]}
                  >
                    {children}
                  </View>
                )}
              </Animated.View>
            </KeyboardAvoidingView>
          </Modal>
        ) : null}
      </>
    );
  }
);
BottomSheet.displayName = "BottomSheet";
