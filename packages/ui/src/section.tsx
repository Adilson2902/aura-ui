import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Primitivas de layout p/ montar páginas rápido — sem estilo de cor, só
 * ritmo vertical, largura e alinhamento. Componha com Card/Hero/Footer.
 */
const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    width: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-7xl",
      full: "max-w-none"
    }
  },
  defaultVariants: { width: "lg" }
});

const sectionVariants = cva("relative", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-8",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-24",
      xl: "py-24 sm:py-32"
    },
    background: {
      none: "",
      muted: "bg-aura-muted/50",
      surface: "bg-aura-surface",
      gradient:
        "bg-[linear-gradient(180deg,transparent_0%,hsl(var(--aura-primary)/0.06)_50%,transparent_100%)]",
      glass: "aura-glass",
      grid:
        "bg-[linear-gradient(hsl(var(--aura-border)/0.4)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--aura-border)/0.4)_1px,transparent_1px)] bg-[size:32px_32px]"
    }
  },
  defaultVariants: { spacing: "md", background: "none" }
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

/** Container centralizado com largura máxima tokenizada (sm/md/lg/full). */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, width, ...props }, ref) => (
    <div ref={ref} className={cn(containerVariants({ width, className }))} {...props} />
  )
);
Container.displayName = "Container";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

/** Section com ritmo vertical e fundos prontos (muted, gradient, glass, grid). */
const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background, className }))}
      {...props}
    />
  )
);
Section.displayName = "Section";

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Eyebrow/kicker acima do título (ex.: badge "Novo"). */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Alinhamento do bloco de texto. */
  align?: "left" | "center";
}

/** Título de seção composto (eyebrow + título + descrição) — pronto p/ SEO. */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-10",
        align === "center" && "items-center text-center",
        className
      )}
      {...props}
    >
      {eyebrow != null && (
        <span className="inline-flex items-center rounded-full border border-aura-primary/30 bg-aura-primary/10 px-3 py-1 text-xs font-semibold text-aura-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-aura-surface-foreground sm:text-4xl">
        {title}
      </h2>
      {description != null && (
        <p className="max-w-xl text-base text-aura-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export { Container, Section, SectionHeading, containerVariants, sectionVariants };
