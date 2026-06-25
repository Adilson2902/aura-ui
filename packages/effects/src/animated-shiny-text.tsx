"use client";

import * as React from "react";
import { cn } from "@aura/core";
import { useReducedMotion } from "@aura/core/client";

export type AnimatedShinyTextProps = React.HTMLAttributes<HTMLSpanElement>;

export function AnimatedShinyText({ className, children, ...props }: AnimatedShinyTextProps) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent",
        !reduced &&
          "bg-[linear-gradient(110deg,hsl(var(--aura-surface-foreground))_40%,hsl(var(--aura-primary))_50%,hsl(var(--aura-surface-foreground))_60%)] bg-[length:200%_100%] animate-aura-shimmer",
        reduced && "text-aura-surface-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
