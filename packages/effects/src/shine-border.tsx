"use client";

import * as React from "react";
import { cn } from "@aura/core";
import { useReducedMotion } from "@aura/core/client";

export type ShineBorderProps = React.HTMLAttributes<HTMLDivElement> & {
  borderWidth?: number;
};

export function ShineBorder({
  className,
  children,
  borderWidth = 1,
  ...props
}: ShineBorderProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn("relative rounded-[var(--aura-radius)] p-[1px]", className)}
      style={{
        background: reduced
          ? "hsl(var(--aura-border))"
          : "linear-gradient(90deg, hsl(var(--aura-primary)), hsl(var(--aura-accent)), hsl(var(--aura-primary)))",
        backgroundSize: reduced ? undefined : "200% auto",
        animation: reduced ? undefined : "aura-shimmer 3s linear infinite"
      }}
      {...props}
    >
      <div
        className="aura-surface h-full w-full rounded-[calc(var(--aura-radius)-1px)]"
        style={{ padding: borderWidth }}
      >
        {children}
      </div>
    </div>
  );
}
