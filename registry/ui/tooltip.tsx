"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

/** Superfícies do tooltip; cada uma pinta a seta com a mesma cor (`fill-*`). */
const tooltipVariants = cva(
  "aura-pop z-50 max-w-xs rounded-[calc(var(--aura-radius)-2px)] px-3 py-1.5 text-xs font-medium shadow-aura-3 origin-(--radix-tooltip-content-transform-origin)",
  {
    variants: {
      variant: {
        default:
          "bg-aura-surface-foreground text-aura-surface [&_.aura-tooltip-arrow]:fill-aura-surface-foreground",
        surface:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground [&_.aura-tooltip-arrow]:fill-aura-surface",
        primary:
          "bg-aura-primary text-aura-primary-foreground [&_.aura-tooltip-arrow]:fill-aura-primary",
        glass: "aura-glass-dc [&_.aura-tooltip-arrow]:hidden",
        destructive:
          "bg-aura-destructive text-aura-destructive-foreground [&_.aura-tooltip-arrow]:fill-aura-destructive"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface TooltipContentProps
  extends
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  /** Exibe a seta (padrão `true`). */
  arrow?: boolean;
}

/** Conteúdo do tooltip (Radix) — Portal SSR-safe, seta tokenizada, 5 superfícies. */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, arrow = true, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ variant }), className)}
      {...props}
    >
      {children}
      {arrow && <TooltipPrimitive.Arrow className="aura-tooltip-arrow" />}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Atalho: `<SimpleTooltip content="Salvar">…</SimpleTooltip>` — Provider + Root
 * + Trigger(asChild) + Content num só componente.
 */
function SimpleTooltip({
  content,
  children,
  side,
  align,
  variant,
  delayDuration = 300,
  ...rootProps
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> &
  Pick<TooltipContentProps, "side" | "align" | "variant"> & {
    content: React.ReactNode;
    children: React.ReactElement;
  }) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip {...rootProps}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} variant={variant}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, SimpleTooltip, tooltipVariants };
