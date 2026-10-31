import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Depoimentos — `TestimonialCard` (citação + autor + nota opcional) e
 * `TestimonialGrid` (masonry por colunas CSS, sem JS). 5 variantes.
 */
const testimonialVariants = cva(
  "group relative flex break-inside-avoid flex-col gap-4 rounded-[var(--aura-radius)] p-6 transition-[transform,box-shadow] duration-200",
  {
    variants: {
      variant: {
        surface: "aura-surface hover:shadow-aura-3",
        outline: "border border-aura-border hover:border-aura-primary/40",
        glass: "aura-glass-dc border border-white/10",
        glow: "aura-glass-dc border border-white/15 shadow-aura-glow-primary",
        "3d": "aura-surface aura-elevated hover:-translate-y-1 hover:shadow-aura-3 border border-aura-border/60"
      }
    },
    defaultVariants: { variant: "surface" }
  }
);

export interface TestimonialCardProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "role">,
    VariantProps<typeof testimonialVariants> {
  /** Texto do depoimento. */
  quote: React.ReactNode;
  /** Nome do autor. */
  author: React.ReactNode;
  /** Cargo/empresa. */
  role?: React.ReactNode;
  /** URL da foto (fallback: iniciais do nome). */
  avatarSrc?: string;
  /** Nota 0–5 em estrelas (opcional). */
  rating?: number;
  /** Logo/marca da empresa no rodapé. */
  logo?: React.ReactNode;
}

function initials(name: React.ReactNode) {
  if (typeof name !== "string") return "";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const TestimonialCard = React.forwardRef<HTMLElement, TestimonialCardProps>(
  ({ quote, author, role, avatarSrc, rating, logo, variant, className, ...props }, ref) => {
    const onDark = variant === "glass" || variant === "glow";
    return (
      <figure ref={ref} className={cn(testimonialVariants({ variant }), className)} {...props}>
        {rating != null && (
          <div
            role="img"
            aria-label={`${rating} de 5 estrelas`}
            className="flex gap-0.5 text-aura-warning"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                aria-hidden
                viewBox="0 0 16 16"
                className={cn(
                  "h-4 w-4",
                  i < Math.round(rating) ? "fill-current" : "fill-current opacity-25"
                )}
              >
                <path d="M8 1.5l2.02 4.1 4.53.66-3.27 3.19.77 4.51L8 11.83l-4.05 2.13.77-4.51L1.45 6.26l4.53-.66L8 1.5z" />
              </svg>
            ))}
          </div>
        )}
        <blockquote
          className={cn(
            "text-[0.9375rem] leading-relaxed",
            onDark ? "text-white/85" : "text-aura-surface-foreground"
          )}
        >
          {quote}
        </blockquote>
        <figcaption className="mt-auto flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-aura-primary/10 text-sm font-semibold text-aura-primary">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              initials(author)
            )}
          </span>
          <span className="flex min-w-0 flex-col">
            <span
              className={cn(
                "truncate text-sm font-semibold",
                onDark ? "text-white" : "text-aura-surface-foreground"
              )}
            >
              {author}
            </span>
            {role != null && (
              <span
                className={cn(
                  "truncate text-xs",
                  onDark ? "text-white/60" : "text-aura-muted-foreground"
                )}
              >
                {role}
              </span>
            )}
          </span>
          {logo != null && <span className="ml-auto shrink-0 opacity-70">{logo}</span>}
        </figcaption>
      </figure>
    );
  }
);
TestimonialCard.displayName = "TestimonialCard";

const testimonialGridVariants = cva("gap-5 [&>*]:mb-5", {
  variants: {
    columns: {
      1: "columns-1",
      2: "columns-1 sm:columns-2",
      3: "columns-1 sm:columns-2 lg:columns-3",
      4: "columns-1 sm:columns-2 lg:columns-4"
    }
  },
  defaultVariants: { columns: 3 }
});

export interface TestimonialGridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof testimonialGridVariants> {}

/** Grade masonry (colunas CSS): cards de alturas diferentes se encaixam. */
const TestimonialGrid = React.forwardRef<HTMLDivElement, TestimonialGridProps>(
  ({ className, columns, ...props }, ref) => (
    <div ref={ref} className={cn(testimonialGridVariants({ columns }), className)} {...props} />
  )
);
TestimonialGrid.displayName = "TestimonialGrid";

export { TestimonialCard, TestimonialGrid, testimonialVariants, testimonialGridVariants };
