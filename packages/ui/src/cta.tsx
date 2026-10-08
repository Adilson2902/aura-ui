import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * CallToAction — faixa de conversão com 5 variantes (surface, gradient,
 * glass, aurora, glow). Título + descrição + ações em cima do fundo.
 */
const ctaVariants = cva(
  "relative isolate overflow-hidden rounded-[var(--aura-radius)] px-6 py-12 text-center sm:px-12 sm:py-16",
  {
    variants: {
      variant: {
        surface: "aura-surface aura-elevated",
        gradient: "aura-gradient-primary aura-bevel text-aura-primary-foreground shadow-aura-2",
        glass: "aura-glass-dc",
        aurora: "aura-gradient-aurora text-white shadow-aura-2",
        glow: "aura-glass-dc shadow-aura-glow-primary border border-white/15"
      }
    },
    defaultVariants: { variant: "surface" }
  }
);

export interface CallToActionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof ctaVariants> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Slot de ações (Buttons) renderizado abaixo do texto. */
  actions?: React.ReactNode;
}

/** Faixa CTA pronta — componha com Button variant="glass" em fundos escuros. */
function CallToAction({
  title,
  description,
  actions,
  variant,
  className,
  ...props
}: CallToActionProps) {
  const onDark = variant === "gradient" || variant === "aurora" || variant === "glass" || variant === "glow";
  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <div
        className={cn(
          ctaVariants({ variant }),
          "flex w-full max-w-3xl flex-col items-center gap-5"
        )}
      >
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {description != null && (
          <p
            className={cn(
              "max-w-xl text-balance",
              onDark ? "text-white/70" : "text-aura-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
        {actions != null && (
          <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
        )}
      </div>
    </div>
  );
}

export { CallToAction, ctaVariants };
