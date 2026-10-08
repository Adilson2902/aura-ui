import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * FeatureGrid — grade responsiva de recursos (1/2/3 colunas por breakpoint).
 * FeatureCard tem 5 variantes (surface, outline, glass, glow, tilt).
 */
const featureGridVariants = cva("grid gap-5", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    }
  },
  defaultVariants: { columns: 3 }
});

const featureCardVariants = cva(
  "group rounded-[var(--aura-radius)] p-6 transition-[transform,box-shadow,border-color] duration-200",
  {
    variants: {
      variant: {
        surface: "aura-surface hover:shadow-aura-2",
        outline: "border border-aura-border hover:border-aura-primary/40",
        glass: "aura-glass-dc border border-white/10",
        glow: "aura-glass-dc border border-white/15 shadow-aura-glow-primary",
        tilt: "aura-glass-dc aura-tilt border border-white/10"
      }
    },
    defaultVariants: { variant: "surface" }
  }
);

export interface FeatureGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureGridVariants> {}

/** Grade de features — colunas responsivas tokenizadas. */
const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ className, columns, ...props }, ref) => (
    <div ref={ref} className={cn(featureGridVariants({ columns, className }))} {...props} />
  )
);
FeatureGrid.displayName = "FeatureGrid";

export interface FeatureCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof featureCardVariants> {
  /** Ícone (SVG/lucide) — recebe accent da variante via currentColor. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/** Card de feature com ícone em chip da marca + título + descrição. */
function FeatureCard({
  icon,
  title,
  description,
  variant,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div className={cn(featureCardVariants({ variant, className }))} {...props}>
      {icon != null && (
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[calc(var(--aura-radius)-4px)] bg-aura-primary/10 text-aura-primary transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-aura-surface-foreground">{title}</h3>
      {description != null && (
        <p className="mt-2 text-sm leading-relaxed text-aura-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export { FeatureGrid, FeatureCard, featureGridVariants, featureCardVariants };
