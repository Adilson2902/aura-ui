"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

/**
 * Variantes do skeleton — shimmer via keyframe `aura-shimmer` do core.
 * O gradiente é periódico (muted em 0%/50%/100%) conf. o contrato do keyframe,
 * então o loop 0% -> 100% não tem snap.
 */
const skeletonVariants = cva("rounded-[calc(var(--aura-radius)-4px)] bg-aura-muted", {
  variants: {
    variant: {
      pulse: "",
      shimmer:
        "bg-[linear-gradient(100deg,hsl(var(--aura-muted))_0%,hsl(var(--aura-border))_25%,hsl(var(--aura-muted))_50%,hsl(var(--aura-border))_75%,hsl(var(--aura-muted))_100%)] bg-[length:200%_100%]",
      "pulse-soft": "bg-aura-muted/70",
      glass: "aura-glass-dc opacity-70"
    }
  },
  defaultVariants: {
    variant: "shimmer"
  }
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

/**
 * Skeleton Aura p/ estados de carregamento — `aria-busy`/`aria-label` por conta
 * do consumidor; animação (shimmer ou pulso) desligada com
 * `prefers-reduced-motion`. SSR-safe (estático até o mount).
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, style, ...props }, ref) => {
    const reduced = useReducedMotion();
    const animate = !reduced;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        style={{
          animation:
            animate && variant === "shimmer"
              ? "aura-shimmer 2.2s linear infinite"
              : animate
                ? "aura-pulse-glow 2.2s ease-in-out infinite"
                : undefined,
          ...style
        }}
        className={cn(skeletonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
