"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type PerspectiveGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Cor das linhas (padrão primary a 20%). */
  lineColor?: string;
  /** Espaçamento das células em px (padrão 48). */
  cell?: number;
  /** Velocidade do scroll em segundos por ciclo (padrão 12). */
  duration?: number;
  /** Ângulo de inclinação do chão em graus (padrão 60). */
  tilt?: number;
  /** Fade nas bordas (padrão true). */
  fade?: boolean;
};

/**
 * Chão 3D em perspectiva infinita (grid que rola para o usuário).
 *
 * Duas camadas de grid empilhadas com `translateY` loop criam a ilusão de
 * movimento contínuo. Tudo em CSS (`transform` + `@keyframes`), sem canvas.
 * Com reduced-motion, mostra o grid estático.
 */
export function PerspectiveGrid({
  className,
  style,
  lineColor = "hsl(var(--aura-primary) / 0.22)",
  cell = 48,
  duration = 12,
  tilt = 60,
  fade = true,
  ...props
}: PerspectiveGridProps) {
  const reduced = useReducedMotion();

  const gridStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
    backgroundSize: `${cell}px ${cell}px`,
    transform: `perspective(400px) rotateX(${tilt}deg)`,
    transformOrigin: "center top",
    width: "200%",
    height: "200%",
    position: "absolute",
    left: "-50%"
  };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]",
        className
      )}
      style={style}
      {...props}
    >
      <div
        style={{
          ...gridStyle,
          top: "0",
          animation: reduced
            ? undefined
            : `aura-grid-scroll ${duration}s linear infinite`
        }}
      />
      <div
        style={{
          ...gridStyle,
          top: "50%",
          animation: reduced
            ? undefined
            : `aura-grid-scroll ${duration}s linear infinite`
        }}
      />
    </div>
  );
}
