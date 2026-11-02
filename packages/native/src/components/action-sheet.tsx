import * as React from "react";
import { Pressable, View } from "react-native";
import { useAura } from "../theme/provider";
import { BottomSheet, type BottomSheetProps } from "./bottom-sheet";
import { Button } from "./button";
import { useOpenState } from "./overlay";
import { Text } from "./text";

export type ActionSheetAction = {
  label: string;
  /** Roda depois que o sheet termina de fechar (seguro p/ abrir outro modal). */
  onPress?: () => void;
  icon?: React.ReactNode;
  /** Texto curto abaixo do rótulo. */
  description?: string;
  /** Rótulo na cor `destructive`. */
  destructive?: boolean;
  disabled?: boolean;
};

export type ActionSheetProps = Omit<BottomSheetProps, "children" | "scrollable" | "snapHeight"> & {
  actions: readonly ActionSheetAction[];
  /** Texto do botão cancelar (padrão "Cancelar"). */
  cancelLabel?: string;
  /** Mostra o botão cancelar (padrão true). */
  showCancel?: boolean;
  /** Ao cancelar (botão, toque fora, arrasto ou voltar do Android). */
  onCancel?: () => void;
};

/** Menu de ações em BottomSheet (estilo iOS): lista de ações + Cancelar. */
export function ActionSheet({
  actions,
  cancelLabel = "Cancelar",
  showCancel = true,
  onCancel,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onClosed,
  contentStyle,
  ...sheetProps
}: ActionSheetProps) {
  const t = useAura();
  const [open, setOpen] = useOpenState({ open: openProp, defaultOpen, onOpenChange });
  const pending = React.useRef<(() => void) | null>(null);

  const run = (action: ActionSheetAction) => {
    if (action.disabled) return;
    pending.current = action.onPress ?? null;
    setOpen(false);
  };

  const cancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <BottomSheet
      {...sheetProps}
      open={open}
      onOpenChange={(next) => {
        if (next) setOpen(true);
        else cancel();
      }}
      onClosed={() => {
        const fn = pending.current;
        pending.current = null;
        fn?.();
        onClosed?.();
      }}
      contentStyle={[{ paddingHorizontal: t.space(3), gap: t.space(1) }, contentStyle]}
    >
      <View>
        {actions.map((action, i) => (
          <Pressable
            key={`${action.label}-${i}`}
            role="button"
            aria-label={action.label}
            aria-disabled={!!action.disabled}
            disabled={action.disabled}
            onPress={() => run(action)}
            style={({ pressed }) => [
              {
                minHeight: 52,
                flexDirection: "row",
                alignItems: "center",
                gap: t.space(3),
                paddingHorizontal: t.space(3),
                paddingVertical: t.space(2),
                borderRadius: t.radius.md,
                opacity: action.disabled ? 0.45 : 1
              },
              pressed ? { backgroundColor: t.colors.muted } : null
            ]}
          >
            {action.icon}
            <View style={{ flex: 1, gap: 2 }}>
              <Text weight="medium" color={action.destructive ? "destructive" : undefined}>
                {action.label}
              </Text>
              {action.description ? (
                <Text variant="caption" tone="muted">
                  {action.description}
                </Text>
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
      {showCancel ? (
        <Button variant="outline" fullWidth onPress={cancel} style={{ marginTop: t.space(1) }}>
          {cancelLabel}
        </Button>
      ) : null}
    </BottomSheet>
  );
}
