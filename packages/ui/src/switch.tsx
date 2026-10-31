"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Trilho do switch — cor do estado ligado por `variant`, dimensões por `size`. */
const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-aura-1 transition-[background,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 focus-visible:ring-offset-aura-surface disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-aura-muted aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-aura-destructive/50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-aura-primary",
        success: "data-[state=checked]:bg-aura-success",
        gradient: "data-[state=checked]:[background:var(--aura-gradient-primary)]",
        glow: "data-[state=checked]:bg-aura-primary data-[state=checked]:shadow-aura-glow-primary",
        "3d": "border-aura-border shadow-[inset_0_2px_4px_hsl(0_0%_0%/0.15)] data-[state=checked]:bg-aura-primary"
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-[3.25rem]"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-aura-2 ring-0 transition-transform duration-200 ease-[var(--aura-ease-spring)] data-[state=unchecked]:translate-x-0.5",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        md: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 data-[state=checked]:translate-x-6"
      }
    },
    defaultVariants: { size: "md" }
  }
);

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  /** Classes extras do thumb (bolinha). */
  thumbClassName?: string;
}

/** Switch Aura (Radix) — `role="switch"` nativo, 5 variantes, 3 tamanhos, thumb com mola. */
const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, thumbClassName, variant, size, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={cn(thumbVariants({ size }), thumbClassName)} />
    </SwitchPrimitive.Root>
  )
);
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch, switchVariants };
