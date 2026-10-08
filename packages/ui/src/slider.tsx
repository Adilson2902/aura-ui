"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "aura-ui-core";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    /** Visual do trilho. */
    tone?: "primary" | "accent" | "cyber";
  }
>(({ className, tone = "primary", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2",
      "data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-aura-muted shadow-inner">
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full rounded-full",
          tone === "primary" && "bg-aura-primary",
          tone === "accent" && "bg-aura-accent",
          tone === "cyber" && "bg-aura-cyber"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border border-aura-border bg-aura-surface shadow-aura-2 transition-transform",
        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
        "data-[disabled]:cursor-not-allowed"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };
