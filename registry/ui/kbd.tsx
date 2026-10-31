import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-mono font-medium",
  {
    variants: {
      variant: {
        raised:
          "border border-aura-border bg-aura-muted text-aura-muted-foreground shadow-aura-1",
        flat:
          "border border-transparent bg-aura-muted text-aura-muted-foreground",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground",
        glass:
          "aura-glass-dc border border-white/15 font-semibold text-white",
        "3d":
          "border border-aura-border bg-aura-muted text-aura-surface-foreground shadow-[0_2px_0_0_hsl(var(--aura-border))] active:translate-y-[2px] active:shadow-none aura-bevel"
      },
      size: {
        sm: "h-5 min-w-[1.25rem] text-[10px]",
        md: "h-6 min-w-[1.5rem] text-[11px]",
        lg: "h-7 min-w-[1.75rem] text-xs"
      }
    },
    defaultVariants: { size: "md", variant: "raised" }
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

/** Tecla / atalho de teclado — 5 variantes (incl. glass e 3D com bevel). */
const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size, variant, ...props }, ref) => (
    <kbd ref={ref} className={cn(kbdVariants({ size, variant }), className)} {...props} />
  )
);
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
