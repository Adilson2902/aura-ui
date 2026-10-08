"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type ShineBorderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Espessura real da borda em px (padrão 1). */
  borderWidth?: number;
  /** Duração de um ciclo do brilho, em segundos (padrão 3). */
  duration?: number;
  /** [base, brilho] do sweep — passe cores tokenizadas (padrão primary/accent). */
  colors?: [string, string];
  /**
   * Fundo interno `aura-surface` (padrão true). Desligue para sobrepor o
   * ShineBorder a imagens ou gradientes sem cobri-los com a superfície sólida.
   */
  surface?: boolean;
};

const DEFAULT_COLORS: [string, string] = [
  "hsl(var(--aura-primary))",
  "hsl(var(--aura-accent))"
];

/**
 * Borda com brilho varrendo em loop perfeito.
 *
 * O gradiente é periódico (base 0%/50%/100%) sobre `background-size 200%`,
 * então a posição 0% -> 100% do keyframe `aura-shimmer` fecha o ciclo sem
 * snap e sem faixas vazias. Com `prefers-reduced-motion`, vira borda sólida
 * tokenizada. O raio interno compensa `borderWidth` para manter o arco
 * concêntrico ao externo.
 */
export function ShineBorder({
  className,
  children,
  style,
  borderWidth = 1,
  duration = 3,
  colors = DEFAULT_COLORS,
  surface = true,
  ...props
}: ShineBorderProps) {
  const reduced = useReducedMotion();
  const [base, shine] = colors;

  return (
    <div
      className={cn("relative rounded-[var(--aura-radius)]", className)}
      style={{
        padding: borderWidth,
        background: reduced
          ? "hsl(var(--aura-border))"
          : `linear-gradient(110deg, ${base} 0%, ${shine} 25%, ${base} 50%, ${shine} 75%, ${base} 100%)`,
        backgroundSize: reduced ? undefined : "200% 100%",
        animation: reduced ? undefined : `aura-shimmer ${duration}s linear infinite`,
        ...style
      }}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full overflow-hidden",
          surface ? "aura-surface" : "bg-transparent"
        )}
        style={{ borderRadius: `calc(var(--aura-radius) - ${borderWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
