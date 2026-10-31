"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type BorderBeamColor = "primary" | "accent" | "cyber";

export type BorderBeamProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Duração de uma volta do feixe, em segundos (padrão 6). */
  duration?: number;
  /** Cor tokenizada do feixe (padrão "primary"). */
  color?: BorderBeamColor;
  /** Espessura do anel em px (padrão 1.5). */
  borderWidth?: number;
  /** Sentido anti-horário (padrão false). */
  reverse?: boolean;
};

/**
 * Feixe de luz percorrendo a borda em loop.
 *
 * Técnica: `conic-gradient(from var(--aura-beam-angle))` animado via
 * `@property` (interpolação GPU do ângulo) + máscara `content-box` que exibe
 * só o anel da espessura `borderWidth`. Degradação em camadas:
 * 1. sem `@property`: arco parado + borda base `border-aura-border`;
 * 2. com `prefers-reduced-motion`: camada do feixe nem renderiza, só a borda.
 *
 * O conteúdo vai por cima (ordem DOM) e o anel herda o raio do container
 * (`rounded-[inherit]`), então funciona com qualquer `--aura-radius`.
 */
export function BorderBeam({
  className,
  children,
  style,
  duration = 6,
  color = "primary",
  borderWidth = 1.5,
  reverse = false,
  ...props
}: BorderBeamProps) {
  const reduced = useReducedMotion();
  const beam = `hsl(var(--aura-${color}))`;

  return (
    <div
      className={cn("relative rounded-[var(--aura-radius)] border border-aura-border", className)}
      style={style}
      {...props}
    >
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            padding: borderWidth,
            background: `conic-gradient(from var(--aura-beam-angle, 0deg), transparent 0%, transparent 70%, ${beam} 85%, transparent 100%)`,
            WebkitMask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
            maskComposite: "exclude",
            animation: `aura-beam-spin ${duration}s linear infinite${reverse ? " reverse" : ""}`
          }}
        />
      )}
      <div className="relative rounded-[inherit]">{children}</div>
    </div>
  );
}
