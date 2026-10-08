"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type ShimmerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Duração de um sweep do brilho, em segundos (padrão 2.75). */
  duration?: number;
};

/**
 * CTA com faixa de brilho atravessando em loop.
 *
 * Base na identidade DesignCode (`aura-gradient-primary` + `aura-bevel` +
 * `shadow-aura-glow-primary`) com feedback físico `aura-press`, foco visível e
 * `disabled` no contrato do `buttonVariants`. A faixa tem 30% da largura e o
 * keyframe `aura-shimmer-slide` a move de fora-esquerda a fora-direita, então
 * o loop não tem snap. O brilho usa `primary-foreground` (branco tokenizado
 * nos dois temas), nunca cor hardcoded.
 *
 * A camada some com `prefers-reduced-motion` ou quando `disabled`.
 */
export function ShimmerButton({
  className,
  children,
  type = "button",
  duration = 2.75,
  disabled,
  ...props
}: ShimmerButtonProps) {
  const reduced = useReducedMotion();

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "aura-gradient-primary aura-bevel aura-press relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[var(--aura-radius)] px-6 py-3 text-sm font-semibold text-aura-primary-foreground shadow-aura-glow-primary transition-[filter,box-shadow] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {!reduced && !disabled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-[-20%] left-0 w-[30%] bg-gradient-to-r from-transparent via-[hsl(var(--aura-primary-foreground)/0.45)] to-transparent"
          style={{ animation: `aura-shimmer-slide ${duration}s ease-in-out infinite` }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
