import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais do card — superfícies tokenizadas (`aura-*`), 9 no total.
 * `padding` é independente da variante (use `none` p/ mídia de ponta a ponta)
 * e `interactive` adiciona hover/press/foco p/ cards clicáveis.
 */
const cardVariants = cva(
  "rounded-[var(--aura-radius)] transition-[transform,box-shadow,border-color] duration-200",
  {
    variants: {
      variant: {
        surface: "aura-surface",
        soft: "bg-aura-muted",
        outline: "border border-aura-border bg-transparent",
        gradient: "aura-gradient-primary text-aura-primary-foreground aura-bevel shadow-aura-2",
        glass: "aura-glass",
        "glass-dc": "aura-glass-dc",
        glow: "aura-glass-dc shadow-aura-glow-primary border border-white/20",
        tilt: "aura-glass-dc aura-tilt border border-white/10",
        "3d": "aura-surface aura-elevated hover:-translate-y-1 hover:shadow-aura-3 aura-press border border-aura-border/60"
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      },
      interactive: {
        true: "cursor-pointer hover:-translate-y-0.5 hover:shadow-aura-3 aura-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
        false: ""
      }
    },
    defaultVariants: {
      variant: "surface",
      padding: "md",
      interactive: false
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Renderiza como filho via Radix Slot (ex.: `<a>`, `<article>`, `<Link>`). */
  asChild?: boolean;
}

/**
 * Card Aura + subcomponentes (Header/Title/Description/Action/Content/Footer).
 * Variantes `glass-dc`/`glow`/`tilt` são dark-glass por design (funcionam nos dois temas).
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        data-slot="card"
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

/** Cabeçalho em grid: com `CardAction` dentro, a ação vai p/ o canto superior direito. */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1.5 pb-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-aura-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/** Ação do cabeçalho (botão, menu, badge) — alinhada à direita do título. */
const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
);
CardAction.displayName = "CardAction";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center gap-2 pt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  cardVariants
};
