"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Banner — faixa de anúncio no topo da página (lançamento, promo, aviso).
 * 6 variantes, pode ser fixa (`sticky`) e dispensável com memória opcional
 * em `localStorage` (`storageKey`), sem flash no SSR.
 */
const bannerVariants = cva(
  "relative flex w-full items-center justify-center gap-3 px-10 py-2.5 text-center text-sm",
  {
    variants: {
      variant: {
        primary: "bg-aura-primary text-aura-primary-foreground",
        gradient: "aura-gradient-primary text-white",
        aurora: "aura-gradient-aurora text-white",
        muted: "border-b border-aura-border bg-aura-muted text-aura-surface-foreground",
        glass: "aura-glass-dc rounded-none border-x-0 border-t-0",
        warning: "bg-aura-warning text-aura-warning-foreground"
      },
      sticky: {
        true: "sticky top-0 z-40",
        false: ""
      }
    },
    defaultVariants: { variant: "gradient", sticky: false }
  }
);

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof bannerVariants> {
  /** Ícone/emoji antes do texto. */
  icon?: React.ReactNode;
  /** Ação à direita do texto (link/botão). */
  action?: React.ReactNode;
  /** Mostra botão fechar. */
  dismissible?: boolean;
  /** Lembra o fechamento em `localStorage` sob esta chave. */
  storageKey?: string;
  /** Callback ao fechar. */
  onDismiss?: () => void;
  /** Rótulo do botão fechar (padrão "Fechar anúncio"). */
  closeLabel?: string;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      sticky,
      icon,
      action,
      dismissible = false,
      storageKey,
      onDismiss,
      closeLabel = "Fechar anúncio",
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(true);

    React.useEffect(() => {
      if (!storageKey) return;
      try {
        if (window.localStorage.getItem(storageKey) === "dismissed") setVisible(false);
      } catch {
        /* storage bloqueado: mantém visível */
      }
    }, [storageKey]);

    if (!visible) return null;

    const dismiss = () => {
      setVisible(false);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, "dismissed");
        } catch {
          /* ignora */
        }
      }
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label={props["aria-label"] ?? "Anúncio"}
        className={cn(bannerVariants({ variant, sticky }), className)}
        {...props}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {icon != null && (
            <span aria-hidden className="shrink-0">
              {icon}
            </span>
          )}
          <span className="font-medium">{children}</span>
          {action}
        </div>
        {dismissible && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={dismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
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
          </button>
        )}
      </div>
    );
  }
);
Banner.displayName = "Banner";

export { Banner, bannerVariants };
