"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

/** Superfícies do popover — `glass` (padrão) mantém o visual original. */
const popoverVariants = cva(
  "aura-pop z-50 w-72 rounded-[var(--aura-radius)] p-4 outline-none origin-(--radix-popover-content-transform-origin)",
  {
    variants: {
      variant: {
        glass: "aura-glass aura-elevated",
        surface: "aura-surface shadow-aura-3",
        "glass-dc": "aura-glass-dc",
        glow: "aura-glass-dc shadow-aura-glow-primary border border-white/20",
        "3d": "aura-surface aura-elevated-strong border border-aura-border/60"
      }
    },
    defaultVariants: { variant: "glass" }
  }
);

export interface PopoverContentProps
  extends
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverVariants> {
  /** Renderiza a seta apontando p/ o gatilho. */
  arrow?: boolean;
}

/** Conteúdo do popover (Radix) — anima a partir do lado em que abriu. */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    { className, variant, arrow = false, align = "center", sideOffset = 8, children, ...props },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverVariants({ variant }), className)}
        {...props}
      >
        {children}
        {arrow && <PopoverPrimitive.Arrow className="fill-aura-surface" width={12} height={6} />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose, popoverVariants };
