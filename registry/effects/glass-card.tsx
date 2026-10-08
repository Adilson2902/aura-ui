"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Nível de elevação 0–5 (padrão 3). */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Especular que segue `--aura-light-x/y` (padrão true). */
  specular?: boolean;
  /** Borda highlight superior (padrão true). */
  bevel?: boolean;
  /** Conteúdo flutuante em `translateZ` (padrão true). */
  liftContent?: boolean;
};

/**
 * Card glass com profundidade real: blur, borda interna luminosa, sombra
 * em escala física e conteúdo elevado em Z.
 *
 * Tokens envolvidos: `--aura-glass-*`, `--aura-elevation-*`, `--aura-depth-*`,
 * `--aura-specular`. Trocar o tema (`.dark` / overrides) reestiliza sem tocar no JSX.
 */
export function GlassCard({
  className,
  children,
  elevation = 3,
  specular = true,
  bevel = true,
  liftContent = true,
  ...props
}: GlassCardProps) {
  const reduced = useReducedMotion();
  const lift = liftContent && !reduced;

  return (
    <div
      className={cn(
        "aura-glass relative overflow-hidden",
        bevel && "aura-bevel",
        specular && "aura-glass-specular",
        elevation === 0 && "shadow-none",
        elevation === 1 && "shadow-aura-1",
        elevation === 2 && "shadow-aura-2",
        elevation === 3 && "shadow-aura-3",
        elevation === 4 && "aura-elevated-strong",
        elevation === 5 && "aura-elevated-strong shadow-aura-glow-primary",
        className
      )}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      <div
        className="relative z-10"
        style={lift ? { transform: `translateZ(var(--aura-depth-2))` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
