"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type OrbitingCirclesProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Itens que orbitam (qualquer nó React). */
  children?: React.ReactNode;
  /** Raio da órbita (padrão `var(--aura-orbit-radius)`). */
  radius?: string;
  /** Duração de uma volta em segundos (padrão 20). */
  duration?: number;
  /** Inverte o sentido (padrão false). */
  reverse?: boolean;
  /** Delay de fase por item, em segundos (padrão 0.3). */
  stagger?: number;
  /** Ícone central opcional. */
  center?: React.ReactNode;
};

/**
 * Círculos em órbita 3D em torno de um centro (Aceternity-class).
 *
 * Cada item fica num wrapper que rotaciona (`aura-orbit`) e um filho
 * counter-rotaciona para manter o ícone ereto. O raio usa `translateX`
 * no wrapper. Com reduced-motion, vira um cluster estático em anel.
 */
export function OrbitingCircles({
  className,
  children,
  radius = "var(--aura-orbit-radius)",
  duration = 20,
  reverse = false,
  stagger = 0.3,
  center,
  ...props
}: OrbitingCirclesProps) {
  const reduced = useReducedMotion();
  const items = React.useMemo(() => React.Children.toArray(children), [children]);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ minHeight: `calc(${radius} * 2.4)` }}
      {...props}
    >
      {center && (
        <div className="aura-layer absolute z-10 flex items-center justify-center">
          {center}
        </div>
      )}

      {items.map((child, i) => {
        const angleOffset = (360 / Math.max(items.length, 1)) * i;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angleOffset}deg) translateX(${radius}) rotate(${-angleOffset}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                transform: "translate(-50%, -50%)",
                animation: reduced
                  ? undefined
                  : `aura-orbit ${duration}s linear infinite${reverse ? " reverse" : ""}`,
                animationDelay: `${i * stagger}s`
              }}
            >
              {/* counter-rotation applied on a nested wrapper via animation */}
              <div
                style={{
                  animation: reduced
                    ? undefined
                    : `aura-orbit-counter ${duration}s linear infinite${reverse ? " reverse" : ""}`,
                  animationDelay: `${i * stagger}s`
                }}
              >
                {child}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
