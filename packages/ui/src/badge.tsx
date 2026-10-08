import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais do badge — cores 100% dos tokens `--aura-*`
 * (semânticas `success`/`warning` incluídas).
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
  {
    variants: {
      variant: {
        solid: "border-transparent bg-aura-primary text-aura-primary-foreground shadow-aura-1",
        soft: "border-transparent bg-aura-primary/10 text-aura-primary",
        outline: "border-aura-border text-aura-surface-foreground",
        muted: "border-transparent bg-aura-muted text-aura-muted-foreground",
        success: "border-transparent bg-aura-success/10 text-aura-success",
        warning: "border-transparent bg-aura-warning/10 text-aura-warning",
        destructive: "border-transparent bg-aura-destructive/10 text-aura-destructive",
        gradient:
          "border-white/20 aura-gradient-primary text-aura-primary-foreground font-semibold aura-bevel",
        glow: "border-white/20 aura-glass-dc text-aura-primary-foreground font-semibold shadow-aura-glow-primary",
        cyber: "border-white/20 aura-gradient-cyber text-aura-contrast font-semibold"
      }
    },
    defaultVariants: { variant: "soft" }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renderiza como filho via Radix Slot. */
  asChild?: boolean;
}

/** Badge/chip Aura — 10 variantes, foco visível e `asChild`. */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return <Comp ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />;
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
