"use client";

import * as React from "react";
import { cn } from "@aura/core";
import { useReducedMotion } from "@aura/core/client";

export type SpotlightProps = React.HTMLAttributes<HTMLDivElement>;

/** Gradiente seguindo o cursor — SSR-safe (estático até interação). */
export function Spotlight({ className, children, ...props }: SpotlightProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--aura-light-x", `${x}%`);
    ref.current.style.setProperty("--aura-light-y", `${y}%`);
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-[var(--aura-radius)]", className)}
      onPointerMove={onMove}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at var(--aura-light-x) var(--aura-light-y), hsl(var(--aura-primary) / 0.15), transparent 40%)"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
