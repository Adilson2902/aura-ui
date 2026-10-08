import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-aura-muted",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3"
      },
      tone: {
        primary: "bg-aura-muted",
        glass: "aura-glass bg-transparent"
      }
    },
    defaultVariants: { size: "md", tone: "primary" }
  }
);

const barVariants = cva(
  "h-full rounded-full transition-[width] duration-500 ease-out",
  {
    variants: {
      variant: {
        solid: "bg-aura-primary",
        gradient: "bg-[image:var(--aura-gradient-primary)]",
        glow: "bg-aura-primary shadow-aura-glow-primary",
        accent: "bg-aura-accent"
      }
    },
    defaultVariants: { variant: "gradient" }
  }
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof barVariants> {
  /** 0–100 (clamp automático). */
  value?: number;
  /** Texto de status para leitores de tela. */
  label?: string;
}

/** Barra de progresso com glow/gradient tokenizados. */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, tone, variant, value = 0, label, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={label}
        className={cn(progressVariants({ size, tone }), className)}
        {...props}
      >
        <div className={cn(barVariants({ variant }))} style={{ width: `${clamped}%` }} />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress, progressVariants };
