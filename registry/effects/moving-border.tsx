"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type MovingBorderProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Conteúdo interno do botão/borda. */
  children?: React.ReactNode;
  /** Raio da borda (padrão `var(--aura-radius)`). */
  borderRadius?: string;
  /** Duração da rotação em segundos (padrão 4). */
  duration?: number;
  /** Gradiente da borda em conic (padrão brand aurora). */
  gradient?: string;
  /** Espessura da borda em px (padrão 2). */
  borderSize?: number;
  /** Desativa a animação (padrão false). */
  disabled?: boolean;
};

/**
 * Borda rotativa estilo Aceternity (conic-gradient animado via `@property`).
 *
 * Implementação: anel externo com `background: conic-gradient(from var(--aura-border-angle), ...)`
 * e máscara em anel (`mask` radial) para deixar só a borda. O ângulo anima com
 * `aura-border-rotate`. Com `prefers-reduced-motion`, a borda fica estática.
 */
export function MovingBorder({
  className,
  children,
  style,
  borderRadius = "var(--aura-radius)",
  duration = 4,
  gradient = "from-transparent via-aura-primary to-transparent",
  borderSize = 2,
  disabled = false,
  ...props
}: MovingBorderProps) {
  const reduced = useReducedMotion();
  const animate = !reduced && !disabled;

  const conic =
    typeof gradient === "string" && gradient.includes("via-")
      ? `conic-gradient(from var(--aura-border-angle), transparent 0%, hsl(var(--aura-primary)) 25%, transparent 50%, hsl(var(--aura-accent)) 75%, transparent 100%)`
      : gradient;

  return (
    <div
      className={cn("relative isolate inline-block", className)}
      style={{ borderRadius, ...style }}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px"
        style={{
          borderRadius,
          background: conic,
          animation: animate ? `aura-border-rotate ${duration}s linear infinite` : undefined,
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${borderSize}px), black calc(100% - ${borderSize}px))`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${borderSize}px), black calc(100% - ${borderSize}px))`
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
