import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes do separador — 5 estilos (solid, gradient, glow, dashed, glass). */
const separatorVariants = cva("shrink-0", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px"
    },
    variant: {
      solid: "bg-aura-border",
      gradient: "bg-[linear-gradient(90deg,transparent_0%,hsl(var(--aura-primary))_50%,transparent_100%)]",
      glow:
        "bg-aura-primary/60 shadow-[0_0_8px_1px_hsl(var(--aura-primary)/0.5)]",
      dashed:
        "border-dashed border-aura-border border-t bg-transparent [border-right-style:dashed] [border-bottom-style:dashed] [border-left-style:dashed]",
      glass: "bg-white/10 backdrop-blur-sm"
    }
  },
  defaultVariants: {
    orientation: "horizontal",
    variant: "solid"
  }
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  /** @default false — separadores decorativos são ocultos de leitores de tela. */
  decorative?: boolean;
}

/**
 * Separador Aura — `role="separator"` (ou `aria-hidden` quando decorativo),
 * sem dependências, SSR-safe.
 */
const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, variant, decorative = false, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : (orientation ?? "horizontal")}
      aria-hidden={decorative || undefined}
      className={cn(separatorVariants({ orientation, variant, className }))}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator, separatorVariants };
