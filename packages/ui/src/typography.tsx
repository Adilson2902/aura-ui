import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Tipografia Aura — escala fluida (`clamp`) nos títulos grandes, tons
 * tokenizados e gradientes da marca. Tamanho visual (`size`) é
 * independente da tag semântica (`as`), p/ manter a hierarquia correta.
 */
const headingVariants = cva("font-semibold tracking-tight text-balance", {
  variants: {
    size: {
      display: "text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.03em]",
      "2xl": "text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.1] font-bold",
      xl: "text-[clamp(1.875rem,3.5vw,2.5rem)] leading-tight",
      lg: "text-2xl leading-tight",
      md: "text-xl leading-snug",
      sm: "text-lg leading-snug",
      xs: "text-base leading-snug"
    },
    tone: {
      default: "text-aura-surface-foreground",
      muted: "text-aura-muted-foreground",
      primary: "text-aura-primary",
      inherit: "text-inherit",
      gradient: "aura-text-gradient-primary",
      aurora: "aura-text-gradient-aurora",
      accent: "aura-text-gradient-accent",
      cyber: "aura-text-gradient-cyber"
    }
  },
  defaultVariants: { size: "lg", tone: "default" }
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Tag semântica (padrão `h2`). */
  as?: HeadingTag;
  /** Renderiza como filho via Radix Slot (ex.: `<Link>`). */
  asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", asChild = false, size, tone, className, ...props }, ref) => {
    const Comp = asChild ? Slot : Tag;
    return <Comp ref={ref} className={cn(headingVariants({ size, tone }), className)} {...props} />;
  }
);
Heading.displayName = "Heading";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      lead: "text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed"
    },
    tone: {
      default: "text-aura-surface-foreground",
      muted: "text-aura-muted-foreground",
      primary: "text-aura-primary",
      success: "text-aura-success",
      warning: "text-aura-warning",
      destructive: "text-aura-destructive",
      inherit: "text-inherit"
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    truncate: {
      true: "truncate",
      false: ""
    }
  },
  defaultVariants: { size: "md", tone: "default", weight: "regular", truncate: false }
});

type TextTag = "p" | "span" | "div" | "label" | "small" | "strong" | "em";

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  /** Tag (padrão `p`). */
  as?: TextTag;
  asChild?: boolean;
  /** Limita a N linhas com reticências (`line-clamp`). */
  lines?: number;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Tag = "p",
      asChild = false,
      size,
      tone,
      weight,
      truncate,
      lines,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = (asChild ? Slot : Tag) as React.ElementType;
    return (
      <Comp
        ref={ref}
        style={
          lines
            ? {
                display: "-webkit-box",
                WebkitLineClamp: lines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                ...style
              }
            : style
        }
        className={cn(textVariants({ size, tone, weight, truncate }), className)}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

/** Código inline (`<code>`) com fundo muted e fonte mono. */
const InlineCode = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "rounded-md border border-aura-border/60 bg-aura-muted px-1.5 py-0.5 font-mono text-[0.875em] text-aura-surface-foreground",
        className
      )}
      {...props}
    />
  )
);
InlineCode.displayName = "InlineCode";

/**
 * Prose — estiliza HTML "cru" (markdown/CMS) com a escala Aura:
 * títulos, parágrafos, listas, links, citações, código e tabelas.
 */
const Prose = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "max-w-[70ch] text-base leading-7 text-aura-surface-foreground",
        "[&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight",
        "[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_p]:my-4 [&_p]:text-aura-surface-foreground/90",
        "[&_a]:font-medium [&_a]:text-aura-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:opacity-80",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1.5 [&_li::marker]:text-aura-muted-foreground",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-aura-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-aura-muted-foreground",
        "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-aura-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.875em]",
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--aura-radius)] [&_pre]:bg-aura-contrast [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white",
        "[&_hr]:my-8 [&_hr]:border-aura-border [&_img]:my-6 [&_img]:rounded-[var(--aura-radius)]",
        "[&_table]:my-6 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-aura-border [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:border-aura-border/60 [&_td]:py-2",
        "[&>*:first-child]:mt-0",
        className
      )}
      {...props}
    />
  )
);
Prose.displayName = "Prose";

export { Heading, Text, InlineCode, Prose, headingVariants, textVariants };
