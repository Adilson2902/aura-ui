"use client";

import * as React from "react";
import { cn } from "@aura/core";
import { useReducedMotion } from "@aura/core/client";

export type AuroraBackgroundProps = React.HTMLAttributes<HTMLDivElement>;

export function AuroraBackground({ className, children, ...props }: AuroraBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative isolate min-h-[40vh] overflow-hidden", className)} {...props}>
      {!reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70">
          <div
            className="absolute -left-1/4 top-0 h-[60%] w-[70%] rounded-full blur-3xl"
            style={{ background: "hsl(var(--aura-primary) / 0.35)" }}
          />
          <div
            className="absolute -right-1/4 bottom-0 h-[50%] w-[60%] rounded-full blur-3xl"
            style={{ background: "hsl(var(--aura-accent) / 0.3)" }}
          />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
