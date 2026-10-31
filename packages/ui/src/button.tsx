import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais do botão Aura.
 *
 * Todas as cores vêm dos tokens `--aura-*`; `aura-press` dá o feedback físico
 * (depressão Z no `:active`) e respeita `prefers-reduced-motion`.
 * SVGs filhos sem `size-*` explícito ganham tamanho automático por `size`.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--aura-radius)] text-sm font-medium transition-[transform,box-shadow,background,filter,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 focus-visible:ring-offset-aura-surface disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        solid:
          "bg-aura-primary text-aura-primary-foreground shadow-aura-2 hover:brightness-110 aura-press",
        soft: "bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/80 aura-press",
        outline: "border border-aura-border bg-transparent hover:bg-aura-muted/50 aura-press",
        ghost: "hover:bg-aura-muted/60 aura-press",
        glass: "aura-glass-dc text-white hover:bg-white/10 aura-press aura-bevel",
        gradient:
          "aura-gradient-primary text-aura-primary-foreground font-semibold aura-bevel shadow-aura-glow-primary hover:brightness-110 aura-press",
        glow: "aura-gradient-aurora text-aura-primary-foreground font-semibold aura-bevel shadow-aura-glow-primary hover:shadow-aura-3 hover:brightness-110 aura-press",
        cyber:
          "aura-gradient-cyber text-aura-contrast font-semibold aura-bevel shadow-aura-glow-cyber hover:brightness-110 aura-press",
        "3d": "bg-aura-primary text-aura-primary-foreground shadow-aura-3 translate-y-0 hover:-translate-y-0.5 aura-press border border-white/10",
        accent:
          "bg-aura-accent text-aura-accent-foreground shadow-aura-2 hover:brightness-110 aura-press",
        destructive:
          "bg-aura-destructive text-aura-destructive-foreground shadow-aura-2 hover:brightness-110 focus-visible:ring-aura-destructive/60 aura-press",
        link: "text-aura-primary underline-offset-4 hover:underline"
      },
      size: {
        xs: "h-7 gap-1.5 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 gap-2.5 px-8 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12 [&_svg:not([class*='size-'])]:size-5"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      fullWidth: false
    }
  }
);

const LoadingIcon = () => (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" className="animate-spin">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Renderiza como filho via Radix Slot (ex.: link estilizado como botão). */
  asChild?: boolean;
  /** Mostra spinner, bloqueia cliques e marca `aria-busy`. */
  loading?: boolean;
  /** Texto exibido durante o `loading` (padrão: mantém `children`). */
  loadingText?: React.ReactNode;
  /** Ícone antes do conteúdo (trocado pelo spinner durante o `loading`). */
  leftIcon?: React.ReactNode;
  /** Ícone depois do conteúdo. */
  rightIcon?: React.ReactNode;
}

/**
 * Botão Aura — 12 variantes (incl. DesignCode `gradient`, `glow`, `cyber`,
 * `glass`, `3d`, `destructive` e `link`), 8 tamanhos, `fullWidth`,
 * `loading`, ícones e `asChild` (ícones também funcionam com `asChild`).
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const blocked = disabled || loading;
    const content = !asChild && loading && loadingText != null ? loadingText : children;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={asChild ? undefined : blocked}
        aria-disabled={asChild && blocked ? true : undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? "" : undefined}
        {...props}
      >
        {loading ? <LoadingIcon /> : leftIcon}
        <Slottable>{content}</Slottable>
        {rightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
