"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type SpotlightColor = "primary" | "accent" | "cyber";

export type SpotlightProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Diâmetro do halo em px (padrão 600). */
  size?: number;
  /** Cor tokenizada do halo (padrão "primary"). */
  color?: SpotlightColor;
  /** Opacidade do núcleo do halo, 0–1 (padrão 0.15). */
  intensity?: number;
  /** Desliga o rastreio do cursor (padrão false). */
  disabled?: boolean;
};

/**
 * Gradiente que segue o cursor.
 *
 * Publica a posição em `--aura-light-x/y` (padrão 50%/0% vindo dos tokens,
 * então há um estado válido antes da primeira interação). SSR-safe: sem
 * estado, tudo em handlers. Handlers `onPointerMove` do usuário são
 * preservados. Congela com `prefers-reduced-motion` ou `disabled`.
 */
export function Spotlight({
  className,
  children,
  size = 600,
  color = "primary",
  intensity = 0.15,
  disabled = false,
  onPointerMove,
  ...props
}: SpotlightProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const interactive = !reduced && !disabled;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const el = ref.current;
    if (!interactive || !el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--aura-light-x", `${x.toFixed(1)}%`);
    el.style.setProperty("--aura-light-y", `${y.toFixed(1)}%`);
  };

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-[var(--aura-radius)]", className)}
      onPointerMove={handleMove}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(${size}px circle at var(--aura-light-x) var(--aura-light-y), hsl(var(--aura-${color}) / ${intensity}), transparent 40%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
