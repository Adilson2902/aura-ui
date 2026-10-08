"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type BentoGridProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Número de colunas no desktop (padrão 3). */
  cols?: 2 | 3 | 4;
};

export type BentoItemProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Faz o item ocupar 2 colunas. */
  colSpan?: boolean;
  /** Faz o item ocupar 2 linhas. */
  rowSpan?: boolean;
  /** Inclinação 3D no hover (padrão true). */
  tilt?: boolean;
};

/**
 * Grid bento com elevação 3D e tilt por célula (estilo Aceternity).
 *
 * Cada `BentoItem` reage ao ponteiro com um leve `rotateX/Y` (token
 * `--aura-tilt-max`) e sobe em Z. Com reduced-motion, mantém só a elevação
 * estática. Use com `GlassCard` ou `LayeredCard` dentro para maximizar o 3D.
 */
export function BentoGrid({ className, cols = 3, children, ...props }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "md:grid-cols-2",
        cols === 3 && "md:grid-cols-3",
        cols === 4 && "md:grid-cols-2 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoItem({
  className,
  children,
  colSpan = false,
  rowSpan = false,
  tilt = true,
  ...props
}: BentoItemProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const interactive = tilt && !reduced;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transition = "transform 60ms linear";
      el.style.transform = `perspective(var(--aura-perspective)) rotateX(${((0.5 - py) * 6).toFixed(2)}deg) rotateY(${((px - 0.5) * 6).toFixed(2)}deg) translateZ(8px)`;
      el.style.setProperty("--aura-light-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--aura-light-y", `${(py * 100).toFixed(1)}%`);
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transition = "transform var(--aura-dur) var(--aura-ease-spring)";
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "aura-surface aura-glass-specular group relative overflow-hidden p-6",
        "transition-shadow hover:shadow-aura-3",
        colSpan && "md:col-span-2",
        rowSpan && "md:row-span-2",
        className
      )}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      {...props}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
