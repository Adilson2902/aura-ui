"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export interface GlowOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Paleta do orbe — sempre via tokens `--aura-*`. */
  color?: "primary" | "accent" | "cyber" | "aurora";
  size?: "sm" | "md" | "lg" | "xl";
  /** Pulso suave; desligado automaticamente com `prefers-reduced-motion`. */
  pulse?: boolean;
}

const backgroundMap = {
  primary: "hsl(var(--aura-primary))",
  accent: "hsl(var(--aura-accent))",
  cyber: "hsl(var(--aura-cyber))",
  aurora: "var(--aura-gradient-aurora)"
} as const;

const sizeMap = {
  sm: "h-48 w-48",
  md: "h-72 w-72",
  lg: "h-96 w-96",
  xl: "h-[32rem] w-[32rem]"
} as const;

/**
 * Orbe de brilho decorativo p/ backgrounds — cores tokenizadas, blur GPU
 * (`transform`/`opacity` apenas) e pulso que respeita `prefers-reduced-motion`.
 * SSR-safe: renderiza estático até o mount.
 */
export const GlowOrb = ({
  className,
  color = "primary",
  size = "lg",
  pulse = true,
  style,
  ...props
}: GlowOrbProps) => {
  const reduced = useReducedMotion();
  const animate = pulse && !reduced;

  return (
    <div
      className={cn(
        "pointer-events-none absolute -z-10 rounded-full blur-[100px] opacity-50 will-change-transform",
        sizeMap[size],
        className
      )}
      style={{
        background: backgroundMap[color],
        animation: animate ? "aura-pulse-glow 4s ease-in-out infinite" : undefined,
        ...style
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
