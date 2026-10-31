"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

/** Superfícies do hover card — `surface` limpa, `glass` translúcida, `glow` dark-glass com halo. */
const hoverCardVariants = cva(
  "aura-pop z-50 w-72 rounded-[var(--aura-radius)] p-4 outline-none origin-(--radix-hover-card-content-transform-origin)",
  {
    variants: {
      variant: {
        surface: "aura-surface shadow-aura-3",
        glass: "aura-glass aura-elevated text-aura-surface-foreground",
        glow: "aura-glass-dc shadow-aura-glow-primary border border-white/15"
      }
    },
    defaultVariants: { variant: "surface" }
  }
);

export interface HoverCardContentProps
  extends
    React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
    VariantProps<typeof hoverCardVariants> {
  /** Exibe a seta apontando para o gatilho. */
  arrow?: boolean;
}

/**
 * Conteúdo do hover card (Radix) — prévia rica ao passar o mouse/focar,
 * animado pelo lado de abertura (`aura-pop`). SSR-safe via Portal.
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    { className, variant, align = "center", sideOffset = 8, arrow = false, children, ...props },
    ref
  ) => (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(hoverCardVariants({ variant }), className)}
        {...props}
      >
        {children}
        {arrow && (
          <HoverCardPrimitive.Arrow
            className={cn(
              variant === "glow"
                ? "fill-black/60"
                : variant === "glass"
                  ? "fill-aura-surface/80"
                  : "fill-aura-surface"
            )}
          />
        )}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent, hoverCardVariants };
