import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Blockquote — citação com 5 variantes (line, surface, glass, gradient,
 * quote-mark). Autor/posição via `cite`/`author`.
 */
const blockquoteVariants = cva("relative rounded-[var(--aura-radius)] p-6", {
  variants: {
    variant: {
      line: "border-l-4 border-aura-primary bg-aura-muted/30",
      surface: "aura-surface shadow-aura-1",
      glass: "aura-glass-dc border border-white/10",
      gradient:
        "aura-gradient-primary aura-bevel text-aura-primary-foreground shadow-aura-2",
      "quote-mark": "bg-aura-muted/30 before:absolute before:top-2 before:left-3 before:content-['\u201C'] before:text-6xl before:leading-none before:font-serif before:text-aura-primary/30"
    }
  },
  defaultVariants: { variant: "line" }
});

export interface BlockquoteProps
  extends Omit<React.HTMLAttributes<HTMLQuoteElement>, "role">,
    VariantProps<typeof blockquoteVariants> {
  /** Fonte da citação (URL) — vira atributo cite. */
  cite?: string;
  /** Autor (ex.: "Ada Lovelace"). */
  author?: React.ReactNode;
  /** Posição/empresa do autor (ex.: "CEO, Aura"). */
  role?: React.ReactNode;
}

const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ cite, author, role, variant, className, children, ...props }, ref) => {
    const onDark = variant === "gradient" || variant === "glass";
    return (
      <figure className="flex flex-col gap-3">
        <blockquote
          ref={ref}
          cite={cite}
          className={cn(blockquoteVariants({ variant }), "text-pretty")}
          {...props}
        >
          <p className={cn("text-base italic leading-relaxed", onDark ? "text-white/90" : "text-aura-surface-foreground")}>
            {children}
          </p>
        </blockquote>
        {(author != null || role != null) && (
          <figcaption
            className={cn(
              "flex items-center gap-2 text-sm",
              onDark ? "text-white/60" : "text-aura-muted-foreground"
            )}
          >
            {author != null && <span className="font-semibold text-aura-primary">{author}</span>}
            {author != null && role != null && <span aria-hidden="true">·</span>}
            {role}
          </figcaption>
        )}
      </figure>
    );
  }
);
Blockquote.displayName = "Blockquote";

export { Blockquote, blockquoteVariants };
