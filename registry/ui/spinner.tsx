import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes do spinner: `ring` (clássico), `dots`/`bars` (ritmo com delays),
 * `pulse` (orbe com glow) e `gradient` (anel cônico com a marca).
 * Todas animam só transform/opacity e param com `prefers-reduced-motion`
 * (via `motion-safe:` — estático fora dele).
 */
const spinnerVariants = cva("inline-block", {
  variants: {
    variant: {
      ring: "animate-spin rounded-full border-2 border-current border-t-transparent",
      dots: "flex items-end gap-1",
      bars: "flex items-end gap-1",
      pulse:
        "rounded-full bg-current motion-safe:animate-[aura-pulse-glow_1.6s_ease-in-out_infinite]",
      gradient:
        "animate-spin rounded-full bg-[conic-gradient(from_0deg,transparent_0%,hsl(var(--aura-primary))_100%)] [&::after]:content-[''] [&::after]:block [&::after]:m-[15%] [&::after]:aspect-square [&::after]:rounded-full [&::after]:bg-transparent"
    },
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-5 w-5",
      lg: "h-8 w-8"
    }
  },
  defaultVariants: { size: "md", variant: "ring" }
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Rótulo acessível (padrão "Carregando"). */
  label?: string;
}

const DOT = "rounded-full bg-current motion-safe:animate-bounce";
const BAR = "w-[22%] rounded-sm bg-current motion-safe:animate-[aura-pulse-glow_1s_ease-in-out_infinite]";

/** Indicador de carregamento leve, sem JS. */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = "md", variant = "ring", label = "Carregando", ...props }, ref) => {
    const dims = size === "sm" ? "h-1 w-1" : size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5";
    const barH = size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3";
    const delay = (i: number) => ({ animationDelay: `${i * 0.15}s` });

    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("text-aura-primary", spinnerVariants({ size, variant }), className)}
        {...props}
      >
        {variant === "dots" && (
          <>
            <span className={cn(DOT, dims)} style={delay(0)} />
            <span className={cn(DOT, dims)} style={delay(1)} />
            <span className={cn(DOT, dims)} style={delay(2)} />
          </>
        )}
        {variant === "bars" && (
          <>
            <span className={cn(BAR, barH)} style={delay(0)} />
            <span className={cn(BAR, barH)} style={delay(1)} />
            <span className={cn(BAR, barH)} style={delay(2)} />
          </>
        )}
      </span>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
