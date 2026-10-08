"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-[var(--aura-radius)] border p-4 shadow-aura-3",
  {
    variants: {
      variant: {
        default: "aura-surface",
        glass: "aura-glass",
        success: "border-aura-success/40 bg-aura-success/10",
        warning: "border-aura-warning/40 bg-aura-warning/10",
        destructive: "border-aura-destructive/40 bg-aura-destructive/10",
        glow: "aura-glass-dc shadow-aura-glow-primary border-white/15"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export type ToastItem = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: VariantProps<typeof toastVariants>["variant"];
  duration?: number;
};

export type ToastContextValue = {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Duração padrão em ms (padrão 4000). */
  defaultDuration?: number;
  /** Máximo de toasts visíveis (padrão 4). */
  max?: number;
}

/**
 * Toaster estilo Toolspace/Sonner, com elevação 3D do Aura.
 * SSR-safe: toasts só existem após interação no client.
 */
export function ToastProvider({
  children,
  defaultDuration = 4000,
  max = 4
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (item: Omit<ToastItem, "id"> & { id?: string }) => {
      const id = item.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((list) => {
        const next = [...list.filter((t) => t.id !== id), { ...item, id }];
        return next.slice(-max);
      });
      const ms = item.duration ?? defaultDuration;
      if (ms > 0) window.setTimeout(() => dismiss(id), ms);
      return id;
    },
    [defaultDuration, dismiss, max]
  );

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((t) => (
          <div key={t.id} className={cn(toastVariants({ variant: t.variant }))}>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold leading-none">{t.title}</p>
              {t.description && (
                <p className="text-sm text-aura-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-aura-muted-foreground hover:bg-aura-muted hover:text-aura-surface-foreground"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export type ToastProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toastVariants> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    onClose?: () => void;
  };

/** Toast estático (fora do provider) — composição manual. */
export function Toast({
  title,
  description,
  variant,
  onClose,
  className,
  ...props
}: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold leading-none">{title}</p>
        {description && <p className="text-sm text-aura-muted-foreground">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="rounded-md p-1 text-aura-muted-foreground hover:bg-aura-muted"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export { toastVariants };
