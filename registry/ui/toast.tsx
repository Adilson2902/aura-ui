"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes do toast. As semânticas pintam uma camada tingida SOBRE a
 * superfície (nunca transparente sobre o conteúdo da página).
 */
const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-[var(--aura-radius)] border p-4 shadow-aura-3",
  {
    variants: {
      variant: {
        default: "aura-surface",
        glass: "aura-glass",
        info: "border-aura-primary/40 bg-aura-surface bg-[linear-gradient(hsl(var(--aura-primary)/0.1),hsl(var(--aura-primary)/0.1))] text-aura-surface-foreground [&_.aura-toast-icon]:text-aura-primary",
        success:
          "border-aura-success/40 bg-aura-surface bg-[linear-gradient(hsl(var(--aura-success)/0.1),hsl(var(--aura-success)/0.1))] text-aura-surface-foreground [&_.aura-toast-icon]:text-aura-success",
        warning:
          "border-aura-warning/40 bg-aura-surface bg-[linear-gradient(hsl(var(--aura-warning)/0.1),hsl(var(--aura-warning)/0.1))] text-aura-surface-foreground [&_.aura-toast-icon]:text-aura-warning",
        destructive:
          "border-aura-destructive/40 bg-aura-surface bg-[linear-gradient(hsl(var(--aura-destructive)/0.1),hsl(var(--aura-destructive)/0.1))] text-aura-surface-foreground [&_.aura-toast-icon]:text-aura-destructive",
        glow: "aura-glass-dc shadow-aura-glow-primary border-white/15"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

type ToastVariant = VariantProps<typeof toastVariants>["variant"];

const ICON_PATHS: Partial<Record<NonNullable<ToastVariant>, string>> = {
  info: "M12 16v-4M12 8h.01",
  success: "m8 12 3 3 5-6",
  warning: "M12 9v4M12 17h.01",
  destructive: "m15 9-6 6M9 9l6 6"
};

function VariantIcon({ variant }: { variant: ToastVariant }) {
  const d = variant ? ICON_PATHS[variant] : undefined;
  if (!d) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="aura-toast-icon mt-px h-5 w-5 shrink-0"
    >
      {variant === "warning" ? (
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      ) : (
        <circle cx="12" cy="12" r="10" />
      )}
      <path d={d} />
    </svg>
  );
}

const CloseIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className="h-4 w-4"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export type ToastAction = {
  label: React.ReactNode;
  onClick: () => void;
};

export type ToastItem = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  /** ms até fechar sozinho; `0` = fica até ser fechado. */
  duration?: number;
  /** Ícone à esquerda (padrão: ícone da variante semântica). `null` remove. */
  icon?: React.ReactNode;
  /** Botão de ação (ex.: "Desfazer"). Fecha o toast após o clique. */
  action?: ToastAction;
  /** Mostra o botão fechar (padrão `true`). */
  dismissible?: boolean;
};

type ToastInput = Omit<ToastItem, "id"> & { id?: string };
type ToastShortcut = (
  title: React.ReactNode,
  options?: Omit<ToastInput, "title" | "variant">
) => string;

/** `toast({...})` + atalhos `toast.success("Salvo")`, `.error`, `.warning`, `.info`. */
export type ToastFn = ((item: ToastInput) => string) & {
  success: ToastShortcut;
  error: ToastShortcut;
  warning: ToastShortcut;
  info: ToastShortcut;
};

export type ToastContextValue = {
  toasts: ToastItem[];
  toast: ToastFn;
  /** Fecha um toast pelo id — ou todos, sem argumento. */
  dismiss: (id?: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4 flex-col-reverse [--aura-toast-y:-12px] [--aura-toast-x:-24px]",
  "top-center":
    "top-4 left-1/2 -translate-x-1/2 flex-col-reverse [--aura-toast-y:-12px] [--aura-toast-x:0px]",
  "top-right": "top-4 right-4 flex-col-reverse [--aura-toast-y:-12px]",
  "bottom-left": "bottom-4 left-4 flex-col [--aura-toast-x:-24px]",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col [--aura-toast-x:0px]",
  "bottom-right": "bottom-4 right-4 flex-col"
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Duração padrão em ms (padrão 4000). */
  defaultDuration?: number;
  /** Máximo de toasts visíveis (padrão 4). */
  max?: number;
  /** Canto da tela (padrão "bottom-right"). */
  position?: ToastPosition;
  /** Rótulo da região de notificações (padrão "Notificações"). */
  label?: string;
  /** Rótulo do botão fechar (padrão "Fechar aviso"). */
  closeLabel?: string;
}

/** Duração da animação de saída antes de remover do DOM. */
const EXIT_MS = 180;

type ToastRecord = ToastItem & { state: "open" | "closed" };

/**
 * Toaster estilo Sonner, com elevação 3D do Aura: 6 posições, ações,
 * ícones semânticos, pausa no hover/foco e animação de entrada/saída.
 * SSR-safe: toasts só existem após interação no client.
 */
export function ToastProvider({
  children,
  defaultDuration = 4000,
  max = 4,
  position = "bottom-right",
  label = "Notificações",
  closeLabel = "Fechar aviso"
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const [paused, setPaused] = React.useState(false);
  const removeTimers = React.useRef(new Map<string, number>());

  React.useEffect(() => {
    const timers = removeTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const dismiss = React.useCallback((id?: string) => {
    setToasts((list) =>
      list.map((t) => (id == null || t.id === id ? { ...t, state: "closed" } : t))
    );
    const ids = id == null ? null : [id];
    const timer = window.setTimeout(() => {
      setToasts((list) => list.filter((t) => (ids ? !ids.includes(t.id) : t.state === "open")));
      if (id) removeTimers.current.delete(id);
    }, EXIT_MS);
    if (id) removeTimers.current.set(id, timer);
  }, []);

  const toast = React.useMemo<ToastFn>(() => {
    const base = (item: ToastInput) => {
      const id = item.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((list) => {
        const next = [...list.filter((t) => t.id !== id), { ...item, id, state: "open" as const }];
        return next.slice(-max);
      });
      return id;
    };
    const shortcut =
      (variant: ToastVariant): ToastShortcut =>
      (title, options) =>
        base({ ...options, title, variant });
    return Object.assign(base, {
      success: shortcut("success"),
      error: shortcut("destructive"),
      warning: shortcut("warning"),
      info: shortcut("info")
    });
  }, [max]);

  const value = React.useMemo<ToastContextValue>(
    () => ({ toasts: toasts.map(({ state: _state, ...t }) => t), toast, dismiss }),
    [toasts, toast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label={label}
        className={cn(
          "pointer-events-none fixed z-[100] flex w-[calc(100%-2rem)] max-w-sm gap-2",
          POSITION_CLASSES[position]
        )}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {toasts.map((t) => (
          <ToastRow
            key={t.id}
            item={t}
            paused={paused}
            duration={t.duration ?? defaultDuration}
            onDismiss={dismiss}
            closeLabel={closeLabel}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
}

function ToastRow({
  item,
  paused,
  duration,
  onDismiss,
  closeLabel
}: {
  item: ToastRecord;
  paused: boolean;
  duration: number;
  onDismiss: (id: string) => void;
  closeLabel: string;
}) {
  const remaining = React.useRef(duration);

  // Timer que pausa no hover/foco e retoma com o tempo restante.
  React.useEffect(() => {
    if (paused || duration <= 0 || item.state === "closed") return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, duration, item.id, item.state, onDismiss]);

  return (
    <ToastView
      data-state={item.state}
      role={item.variant === "destructive" ? "alert" : "status"}
      aria-live={item.variant === "destructive" ? "assertive" : "polite"}
      aria-atomic="true"
      className="aura-toast"
      title={item.title}
      description={item.description}
      variant={item.variant}
      icon={item.icon}
      action={item.action}
      closeLabel={closeLabel}
      onAction={() => onDismiss(item.id)}
      onClose={item.dismissible === false ? undefined : () => onDismiss(item.id)}
    />
  );
}

export type ToastProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof toastVariants> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Ícone à esquerda (padrão: ícone da variante). `null` remove. */
    icon?: React.ReactNode;
    action?: ToastAction;
    onClose?: () => void;
    /** Rótulo do botão fechar (padrão "Fechar"). */
    closeLabel?: string;
  };

function ToastView({
  title,
  description,
  variant,
  icon,
  action,
  onClose,
  onAction,
  closeLabel = "Fechar",
  className,
  ...props
}: ToastProps & { onAction?: () => void }) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      {icon === undefined ? <VariantIcon variant={variant} /> : icon}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold leading-snug">{title}</p>
        {description && <p className="text-sm opacity-75">{description}</p>}
        {action && (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              onAction?.();
            }}
            className="mt-2 inline-flex h-7 items-center rounded-md border border-current/20 px-2.5 text-xs font-semibold transition-colors hover:bg-aura-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="-m-1 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

/** Toast estático (fora do provider) — composição manual. */
export function Toast(props: ToastProps) {
  return <ToastView {...props} />;
}

export { toastVariants };
