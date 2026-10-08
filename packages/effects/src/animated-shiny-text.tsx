"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type AnimatedShinyTextShine = "primary" | "accent" | "cyber";

export type AnimatedShinyTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Duração de um ciclo do brilho, em segundos (padrão 2.5). */
  duration?: number;
  /** Cor tokenizada do brilho (padrão "primary"). */
  shine?: AnimatedShinyTextShine;
};

/**
 * Texto com brilho varrendo o glifo em loop perfeito.
 *
 * O gradiente é periódico (brilho em 0%/50%/100%) sobre `background-size 200%`,
 * então a posição 0% -> 100% do keyframe `aura-shimmer` (que vive no core, sem
 * depender do preset Tailwind) fecha o ciclo sem snap e sem apagar o texto.
 * Com `prefers-reduced-motion`, degrada para texto sólido tokenizado.
 */
export function AnimatedShinyText({
  className,
  children,
  style,
  duration = 2.5,
  shine = "primary",
  ...props
}: AnimatedShinyTextProps) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn(
        "inline-block",
        reduced ? "text-aura-surface-foreground" : "bg-clip-text text-transparent",
        className
      )}
      style={
        reduced
          ? style
          : {
              backgroundImage: `linear-gradient(110deg, hsl(var(--aura-${shine})) 0%, hsl(var(--aura-surface-foreground)) 30%, hsl(var(--aura-surface-foreground)) 45%, hsl(var(--aura-${shine})) 50%, hsl(var(--aura-surface-foreground)) 55%, hsl(var(--aura-surface-foreground)) 70%, hsl(var(--aura-${shine})) 100%)`,
              backgroundSize: "200% 100%",
              animation: `aura-shimmer ${duration}s linear infinite`,
              ...style
            }
      }
      {...props}
    >
      {children}
    </span>
  );
}
