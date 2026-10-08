"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Rating — estrelas de avaliação. Somente leitura (display) ou interativa
 * (`onChange` + navegação por setas, `role="radiogroup"`). 5 variantes.
 */
const ratingVariants = cva("inline-flex items-center gap-0.5", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-xl",
      lg: "text-3xl"
    },
    variant: {
      solid: "[&_svg]:text-aura-primary",
      gradient: "[&_svg]:aura-text-gradient-primary",
      glow: "[&_svg]:text-aura-primary [&_svg]:drop-shadow-[0_0_6px_hsl(var(--aura-primary)/0.6)]",
      muted: "[&_svg]:text-aura-muted-foreground",
      pulse:
        "[&_svg]:text-aura-primary [&_svg]:motion-safe:transition-transform [&_svg]:motion-safe:duration-200 [&_button:hover_svg]:scale-125"
    }
  },
  defaultVariants: { size: "md", variant: "solid" }
});

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange">,
    VariantProps<typeof ratingVariants> {
  /** Valor 0..max (frações ok p/ display: 3.5). */
  value?: number;
  /** Máximo de estrelas (padrão 5). */
  max?: number;
  /** Intativo? vira display puro (sem foco/teclado). */
  onChange?: (value: number) => void;
  /** Rótulo acessível (padrão "Avaliação"). */
  label?: string;
}

const starPath =
  "M8 1.5l2.02 4.1 4.53.66-3.27 3.19.77 4.51L8 11.83l-4.05 2.13.77-4.51L1.45 6.26l4.53-.66L8 1.5z";

function Star({ fill, className }: { fill: number; className?: string }) {
  // fill 0..1 — parcial via gradient stop no próprio SVG
  const id = React.useId();
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("h-[1em] w-[1em]", className)}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={starPath} fill={`url(#${id})`} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

const Rating = React.forwardRef<HTMLSpanElement, RatingProps>(
  ({ value = 0, max = 5, onChange, size, variant, label = "Avaliação", className, ...props }, ref) => {
    const interactive = onChange != null;
    const [hover, setHover] = React.useState<number | null>(null);
    const shown = hover ?? value;

    return (
      <span
        ref={ref}
        role={interactive ? "radiogroup" : "img"}
        aria-label={`${label}: ${value} de ${max}`}
        className={cn(ratingVariants({ size, variant }), className)}
        onMouseLeave={() => setHover(null)}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const fill = Math.max(0, Math.min(1, shown - i));
          if (!interactive) return <Star key={i} fill={fill} />;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
              onClick={() => onChange(n)}
              onMouseEnter={() => setHover(n)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                  e.preventDefault();
                  onChange(Math.min(max, Math.round(value) + 1));
                } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                  e.preventDefault();
                  onChange(Math.max(1, Math.round(value) - 1));
                }
              }}
              className={cn(
                "cursor-pointer rounded-sm p-0.5 transition-transform duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring hover:scale-110"
              )}
            >
              <Star fill={fill} />
            </button>
          );
        })}
      </span>
    );
  }
);
Rating.displayName = "Rating";

export { Rating, ratingVariants };
