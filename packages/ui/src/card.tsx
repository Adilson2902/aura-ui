import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes visuais do card — superfícies tokenizadas (`aura-*`), 9 no total. */
const cardVariants = cva(
  "rounded-[var(--aura-radius)] transition-[transform,box-shadow,border-color] duration-200",
  {
    variants: {
      variant: {
        surface: "aura-surface p-6",
        soft: "bg-aura-muted p-6",
        outline: "border border-aura-border bg-transparent p-6",
        gradient:
          "aura-gradient-primary text-aura-primary-foreground p-6 aura-bevel shadow-aura-2",
        glass: "aura-glass p-6",
        "glass-dc": "aura-glass-dc p-6",
        glow: "aura-glass-dc shadow-aura-glow-primary p-6 border border-white/20",
        tilt: "aura-glass-dc aura-tilt p-6 border border-white/10",
        "3d":
          "aura-surface aura-elevated p-6 hover:-translate-y-1 hover:shadow-aura-3 aura-press border border-aura-border/60"
      }
    },
    defaultVariants: {
      variant: "surface"
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Card Aura + subcomponentes (Header/Title/Description/Content/Footer).
 * Variantes `glass-dc`/`glow`/`tilt` são dark-glass por design (funcionam nos dois temas).
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 pb-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-aura-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center pt-4", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
