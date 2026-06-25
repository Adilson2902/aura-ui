"use client";

import * as React from "react";
import { cn } from "@aura/core";
import { useReducedMotion } from "@aura/core/client";

export type Card3DProps = React.HTMLAttributes<HTMLDivElement> & {
  maxTilt?: number;
};

/** Tilt 3D com glare — degrada para estático com prefers-reduced-motion. */
export function Card3D({ className, children, maxTilt = 12, style, ...props }: Card3DProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(var(--aura-perspective)) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={cn("aura-surface aura-tilt relative overflow-hidden p-6", className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at var(--aura-light-x) var(--aura-light-y), hsl(var(--aura-primary) / 0.25), transparent 55%)"
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
