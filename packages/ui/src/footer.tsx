import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Footer — rodapé de site com 4 variantes (none, muted, surface, glass).
 * Estrutura: marca + colunas de links (FooterColumn/FooterLink) + linha
 * legal (FooterBottom). Tudo tokenizado, escuro/claro automático.
 */
const footerVariants = cva("relative px-4 py-12 sm:px-6 lg:px-8", {
  variants: {
    variant: {
      none: "",
      muted: "bg-aura-muted/50",
      surface: "bg-aura-surface border-t border-aura-border",
      gradient:
        "border-t border-transparent bg-[linear-gradient(180deg,transparent_0%,hsl(var(--aura-primary)/0.08)_100%)]",
      glass: "aura-glass-dc border-t border-white/10"
    }
  },
  defaultVariants: { variant: "muted" }
});

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, variant, ...props }, ref) => (
    <footer ref={ref} className={cn(footerVariants({ variant, className }))} {...props} />
  )
);
Footer.displayName = "Footer";

export interface FooterBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo (SVG/img) ou texto. */
  logo?: React.ReactNode;
  name?: React.ReactNode;
  tagline?: React.ReactNode;
}

/** Bloco de marca do rodapé — logo, nome e tagline. */
function FooterBrand({ logo, name, tagline, className, ...props }: FooterBrandProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {(logo != null || name != null) && (
        <span className="flex items-center gap-2 text-lg font-bold text-aura-surface-foreground">
          {logo}
          {name}
        </span>
      )}
      {tagline != null && (
        <p className="max-w-xs text-sm text-aura-muted-foreground">{tagline}</p>
      )}
    </div>
  );
}

export interface FooterColumnProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
}

/** Coluna de links com título (ex.: "Produto", "Empresa"). */
function FooterColumn({ title, className, children, ...props }: FooterColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-aura-surface-foreground">
        {title}
      </h3>
      <div className="flex flex-col items-start gap-2.5">{children}</div>
    </div>
  );
}

export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/** Link de rodapé — hover com a cor da marca. */
const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-sm text-aura-muted-foreground transition-colors hover:text-aura-primary",
        className
      )}
      {...props}
    />
  )
);
FooterLink.displayName = "FooterLink";

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Linha legal na base — copyright, redes sociais, links secundários. */
const FooterBottom = React.forwardRef<HTMLDivElement, FooterBottomProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-10 flex flex-col items-center justify-between gap-3 border-t border-aura-border/60 pt-6 text-sm text-aura-muted-foreground sm:flex-row",
        className
      )}
      {...props}
    />
  )
);
FooterBottom.displayName = "FooterBottom";

/** Grid interno do Footer — marca à esquerda, colunas à direita. */
const FooterGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]",
        className
      )}
      {...props}
    />
  )
);
FooterGrid.displayName = "FooterGrid";

export {
  Footer,
  FooterGrid,
  FooterBrand,
  FooterColumn,
  FooterLink,
  FooterBottom,
  footerVariants
};
