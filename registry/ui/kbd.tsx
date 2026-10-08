import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded-md border border-aura-border bg-aura-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-aura-muted-foreground shadow-aura-1",
  {
    variants: {
      size: {
        sm: "h-5 min-w-[1.25rem] text-[10px]",
        md: "h-6 min-w-[1.5rem] text-[11px]",
        lg: "h-7 min-w-[1.75rem] text-xs"
      }
    },
    defaultVariants: { size: "md" }
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

/** Tecla / atalho de teclado (estilo Toolspace, elevação Aura). */
const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, size, ...props }, ref) => (
  <kbd ref={ref} className={cn(kbdVariants({ size }), className)} {...props} />
));
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
