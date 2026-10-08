import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais do botão Aura.
 *
 * Todas as cores vêm dos tokens `--aura-*`; `aura-press` dá o feedback físico
 * (depressão Z no `:active`) e respeita `prefers-reduced-motion`.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--aura-radius)] text-sm font-medium transition-[transform,box-shadow,background,filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-aura-primary text-aura-primary-foreground shadow-aura-2 hover:brightness-110 aura-press",
        soft: "bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/80 aura-press",
        outline: "border border-aura-border bg-transparent hover:bg-aura-muted/50 aura-press",
        ghost: "hover:bg-aura-muted/60 aura-press",
        glass:
          "aura-glass-dc text-white hover:bg-white/10 aura-press aura-bevel",
        gradient:
          "aura-gradient-primary text-aura-primary-foreground font-semibold aura-bevel shadow-aura-glow-primary hover:brightness-110 aura-press",
        glow:
          "aura-gradient-aurora text-aura-primary-foreground font-semibold aura-bevel shadow-aura-glow-primary hover:shadow-aura-3 hover:brightness-110 aura-press",
        cyber:
          "aura-gradient-cyber text-aura-contrast font-semibold aura-bevel shadow-aura-glow-cyber hover:brightness-110 aura-press",
        "3d":
          "bg-aura-primary text-aura-primary-foreground shadow-aura-3 translate-y-0 hover:-translate-y-0.5 aura-press border border-white/10"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Renderiza como filho via Radix Slot (ex.: link estilizado como botão). */
  asChild?: boolean;
}

/**
 * Botão Aura — 9 variantes (incl. DesignCode `gradient`, `glow`, `cyber`,
 * `glass` e `3d`), 4 tamanhos, foco visível, `disabled` e `asChild`.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
