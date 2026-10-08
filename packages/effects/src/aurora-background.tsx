"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type AuroraColor = "primary" | "accent" | "cyber";

export type AuroraBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  /** [cor do blob superior, cor do blob inferior] — tokens (padrão primary/accent). */
  colors?: [AuroraColor, AuroraColor];
  /** Duração dos ciclos em segundos [superior, inferior] (padrão [12, 15]). */
  durations?: [number, number];
  /** Opacidade da camada de luz, 0–1 (padrão 0.7). */
  intensity?: number;
};

/**
 * Fundo aurora: dois blobs de luz desfocados derivando em sentidos opostos.
 *
 * Camada de luz é `aria-hidden` + `pointer-events-none`, então nunca rouba
 * clique nem polui leitores de tela. Geometria em % + `overflow-hidden`, sem
 * scroll horizontal. Congela com `prefers-reduced-motion` (blobs estáticos).
 */
export function AuroraBackground({
  className,
  children,
  style,
  colors = ["primary", "accent"],
  durations = [12, 15],
  intensity = 0.7,
  ...props
}: AuroraBackgroundProps) {
  const reduced = useReducedMotion();
  const [top, bottom] = colors;
  const [topDuration, bottomDuration] = durations;

  return (
    <div
      className={cn("relative isolate min-h-[40vh] overflow-hidden", className)}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ opacity: intensity }}
      >
        <div
          className="absolute -left-1/4 top-0 h-[60%] w-[70%] rounded-full blur-3xl"
          style={{
            background: `hsl(var(--aura-${top}) / 0.35)`,
            animation: reduced
              ? undefined
              : `aura-aurora-drift ${topDuration}s ease-in-out infinite alternate`
          }}
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[50%] w-[60%] rounded-full blur-3xl"
          style={{
            background: `hsl(var(--aura-${bottom}) / 0.3)`,
            animation: reduced
              ? undefined
              : `aura-aurora-drift ${bottomDuration}s ease-in-out infinite alternate-reverse`
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
