"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type AnimatedBeamProps = React.SVGAttributes<SVGElement> & {
  /** Ref do nó de origem. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Ref do nó de destino. */
  fromRef: React.RefObject<HTMLElement | null>;
  /** Ref do nó de destino (alternativa a fromRef/toRef via path). */
  toRef?: React.RefObject<HTMLElement | null>;
  /** Curvatura da bezier (padrão 0.25). */
  curvature?: number;
  /** Duração do feixe em segundos (padrão 4). */
  duration?: number;
  /** Delay inicial em segundos (padrão 0). */
  delay?: number;
  /** Cor do gradiente (padrão primary). */
  gradientFrom?: string;
  /** Cor final do gradiente (padrão accent). */
  gradientTo?: string;
  /** Raio do ponto (padrão 5). */
  pathRadius?: number;
  /** Desenha o caminho base (padrão true). */
  showBase?: boolean;
};

function getRect(
  container: HTMLElement,
  el: HTMLElement
): { x: number; y: number; width: number; height: number } {
  const c = container.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  return {
    x: e.left - c.left + e.width / 2,
    y: e.top - c.top + e.height / 2,
    width: e.width,
    height: e.height
  };
}

/**
 * Feixe animado entre dois nós (Magic UI `AnimatedBeam`).
 *
 * Calcula uma cubic bezier entre os centros dos elementos e anima um
 * `stroke-dashoffset` no SVG absoluto. Redimensiona com `ResizeObserver`.
 * Com reduced-motion, desenha o traço estático completo.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0.25,
  duration = 4,
  delay = 0,
  gradientFrom = "hsl(var(--aura-primary))",
  gradientTo = "hsl(var(--aura-accent))",
  pathRadius = 5,
  showBase = true,
  className,
  ...props
}: AnimatedBeamProps) {
  const reduced = useReducedMotion();
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathD, setPathD] = React.useState("");

  const id = React.useId().replace(/:/g, "");
  const gradientId = `g-${id}`;

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef?.current;
    if (!container || !from || !to) return;

    const update = () => {
      const a = getRect(container, from);
      const b = getRect(container, to);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const cx1 = a.x + dx * curvature;
      const cy1 = a.y + dy * (1 - curvature);
      const cx2 = a.x + dx * (1 - curvature);
      const cy2 = a.y + dy * curvature;
      setPathD(
        `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      aria-hidden
      fill="none"
      width="100%"
      height="100%"
      className={cn("pointer-events-none absolute inset-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gradientFrom} />
          <stop offset="100%" stopColor={gradientTo} />
        </linearGradient>
      </defs>
      {showBase && pathD && (
        <path d={pathD} stroke="hsl(var(--aura-border))" strokeWidth={1.5} opacity={0.4} />
      )}
      {pathD && (
        <path
          ref={pathRef}
          d={pathD}
          stroke={`url(#${gradientId})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={reduced ? "none" : "40 400"}
          style={
            reduced
              ? undefined
              : {
                  animation: `aura-shimmer-slide ${duration}s linear ${delay}s infinite`,
                  strokeDashoffset: 0
                }
          }
        />
      )}
      {/* ponta luminosa */}
      {pathD && !reduced && (
        <circle r={pathRadius} fill={gradientFrom}>
          <animateMotion dur={`${duration}s`} repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </svg>
  );
}
