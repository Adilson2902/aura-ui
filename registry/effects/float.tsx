"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type FloatProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Amplitude do flutuar em px (padrão 12). */
  amplitude?: number;
  /** Duração do ciclo em segundos (padrão 4). */
  duration?: number;
  /** Delay em segundos (padrão 0). */
  delay?: number;
  /** Eixo: "y" vertical (padrão) ou "xy" leve deriva. */
  axis?: "y" | "xy";
};

/**
 * Wrapper que flutua em Z/Y (loop CSS leve) — use em ícones, badges 3D,
 * mockups. Conteúdo fica em `preserve-3d` para compor com `LayeredCard`.
 * Com reduced-motion, fica estático.
 */
export function Float({
  className,
  children,
  style,
  amplitude = 12,
  duration = 4,
  delay = 0,
  axis = "y",
  ...props
}: FloatProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn("aura-layer inline-block", className)}
      style={{
        transformStyle: "preserve-3d",
        animation: reduced
          ? undefined
          : `aura-float-y ${duration}s ease-in-out ${delay}s infinite`,
        // amplitude via CSS var não existe no keyframe; ajustamos com scale do translate
        ...(amplitude !== 12 && !reduced
          ? { "--aura-float-amp": `${amplitude}px` }
          : null),
        ...style
      }}
      {...props}
    >
      {axis === "xy" && !reduced ? (
        <div
          style={{
            animation: `aura-float-y ${duration * 1.4}s ease-in-out ${delay + 0.3}s infinite reverse`
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
