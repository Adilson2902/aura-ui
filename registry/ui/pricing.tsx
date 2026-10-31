import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * PricingCard — plano de tabela de preços com 5 variantes
 * (surface, outline, gradient, glass, glow). O plano em destaque usa
 * `featured` (anel da marca + leve elevação + badge opcional).
 */
const pricingVariants = cva(
  "relative flex h-full flex-col rounded-[var(--aura-radius)] p-6 sm:p-8 transition-[transform,box-shadow] duration-200",
  {
    variants: {
      variant: {
        surface: "aura-surface",
        outline: "border border-aura-border bg-transparent",
        gradient: "aura-gradient-primary aura-bevel text-aura-primary-foreground shadow-aura-2",
        glass: "aura-glass-dc border border-white/10",
        glow: "aura-glass-dc border border-white/15 shadow-aura-glow-primary"
      },
      featured: {
        true: "shadow-aura-3 ring-2 ring-aura-primary/60 md:-translate-y-3",
        false: ""
      }
    },
    compoundVariants: [{ variant: "gradient", featured: true, class: "ring-transparent" }],
    defaultVariants: { variant: "surface", featured: false }
  }
);

export interface PricingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingVariants> {
  /** Nome do plano (ex.: "Pro"). */
  name: React.ReactNode;
  /** Preço formatado (ex.: "R$ 49"). */
  price: React.ReactNode;
  /** Sufixo do preço (ex.: "/mês"). */
  priceSuffix?: React.ReactNode;
  /** Descrição curta do plano. */
  description?: React.ReactNode;
  /** Lista de benefícios — prefixo ✓ automático. */
  features?: React.ReactNode[];
  /** Badge de destaque (ex.: "Mais popular"). */
  badge?: React.ReactNode;
  /** Ações (Buttons) — renderizado ao fim do card. */
  actions?: React.ReactNode;
}

function Check({ onDark }: { onDark: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("mt-0.5 h-4 w-4 shrink-0", onDark ? "text-white/80" : "text-aura-primary")}
    >
      <path
        d="M13.25 4.75l-6.5 6.5-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Card de plano — monte a grade com Grid/FeatureGrid ou flex. */
function PricingCard({
  name,
  price,
  priceSuffix,
  description,
  features = [],
  badge,
  actions,
  variant,
  featured,
  className,
  ...props
}: PricingCardProps) {
  const onDark = variant === "gradient" || variant === "glass" || variant === "glow";
  return (
    <div className={cn(pricingVariants({ variant, featured }), className)} {...props}>
      {badge != null && (
        <span className="aura-gradient-primary aura-bevel absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-aura-primary-foreground">
          {badge}
        </span>
      )}
      <h3 className={cn("text-sm font-semibold uppercase tracking-wide", onDark ? "text-white/80" : "text-aura-muted-foreground")}>
        {name}
      </h3>
      <p className="mt-3 flex items-baseline gap-1">
        <span className={cn("text-4xl font-extrabold tracking-tight", onDark ? "text-white" : "text-aura-surface-foreground")}>
          {price}
        </span>
        {priceSuffix != null && (
          <span className={cn("text-sm", onDark ? "text-white/60" : "text-aura-muted-foreground")}>
            {priceSuffix}
          </span>
        )}
      </p>
      {description != null && (
        <p className={cn("mt-2 text-sm", onDark ? "text-white/70" : "text-aura-muted-foreground")}>
          {description}
        </p>
      )}
      {features.length > 0 && (
        <ul className="mt-6 flex flex-1 flex-col gap-3 text-left">
          {features.map((feature, i) => (
            <li key={i} className={cn("flex items-start gap-2.5 text-sm", onDark ? "text-white/85" : "text-aura-surface-foreground")}>
              <Check onDark={onDark} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      {actions != null && <div className="mt-8 flex flex-col gap-2">{actions}</div>}
    </div>
  );
}

/** Grade de planos — mesma sintaxe responsiva do FeatureGrid. */
const PricingGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 }
>(({ className, columns = 3, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid items-stretch gap-6 md:gap-5",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}
    {...props}
  />
));
PricingGrid.displayName = "PricingGrid";

export { PricingCard, PricingGrid, pricingVariants };
