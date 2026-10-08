"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "aura-ui-core";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

/** Conteúdo do tooltip (Radix) — Portal SSR-safe, seta tokenizada, fade por opacidade. */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-[calc(var(--aura-radius)-2px)] px-3 py-1.5 text-xs font-medium shadow-aura-3",
        "bg-aura-surface-foreground text-aura-surface",
        "transition-opacity data-[state=closed]:opacity-0 data-[state=delayed-open]:opacity-100",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-aura-surface-foreground" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
