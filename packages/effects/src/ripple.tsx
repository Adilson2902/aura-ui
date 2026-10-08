"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type RippleColor = "primary" | "accent" | "cyber";

export type RippleProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Quantidade de anéis simultâneos (padrão 5; <= 0 renderiza nada). */
  count?: number;
  /** Duração de cada onda, em segundos (padrão 4). */
  duration?: number;
  /** Diâmetro do maior anel, em px (padrão 320). */
  size?: number;
  /** Cor tokenizada dos anéis (padrão "primary"). */
  color?: RippleColor;
};

/**
 * Ondas concêntricas emanando do centro (fundo de CTA, hero, avatar "ao vivo").
 *
 * Cada anel é uma borda `currentColor` (cor tokenizada via `color` no wrapper)
 * animada pelo keyframe `aura-ripple-ring` — que já embute o
 * `translate(-50%, -50%)` de centralização — com delays escalonados de
 * `duration / count`, formando uma emissão contínua. O wrapper é absoluto e
 * corta o excesso (`overflow-hidden`): o pai precisa de `relative` e tamanho.
 *
 * Puramente decorativo (`aria-hidden` + `pointer-events-none`) e não renderiza
 * nada com `prefers-reduced-motion`.
 */
export function Ripple({
  className,
  style,
  count = 5,
  duration = 4,
  size = 320,
  color = "primary",
  ...props
}: RippleProps) {
  const reduced = useReducedMotion();

  if (reduced || count <= 0) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ color: `hsl(var(--aura-${color}))`, ...style }}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border border-current"
          style={{
            width: size,
            height: size,
            animation: `aura-ripple-ring ${duration}s var(--aura-ease-spring) infinite`,
            animationDelay: `${(i * duration) / count}s`
          }}
        />
      ))}
    </div>
  );
}
