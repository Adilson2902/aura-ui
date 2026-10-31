import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Hero de página inicial — 6 variantes (clean, muted, gradient, aurora,
 * glass, grid). Aceita eyebrow/título/subtítulo/ações como children
 * composables; a altura e o fundo vêm da variante (tokens, zero cor fixa).
 */
const heroVariants = cva(
  "relative isolate flex flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28",
  {
    variants: {
      variant: {
        clean: "bg-transparent",
        muted: "bg-aura-muted/40",
        gradient:
          "bg-[linear-gradient(180deg,hsl(var(--aura-primary)/0.12)_0%,transparent_100%)]",
        aurora:
          "min-h-[70vh] bg-[radial-gradient(ellipse_at_top,hsl(var(--aura-primary)/0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,hsl(var(--aura-accent)/0.18),transparent_55%)]",
        glass: "aura-glass",
        grid:
          "bg-[linear-gradient(hsl(var(--aura-border)/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--aura-border)/0.5)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
      }
    },
    defaultVariants: { variant: "clean" }
  }
);

export interface HeroProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof heroVariants> {}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ className, variant, ...props }, ref) => (
    <section ref={ref} className={cn(heroVariants({ variant, className }))} {...props} />
  )
);
Hero.displayName = "Hero";

export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Coluna central do Hero — limita largura e empilha com ritmo. */
const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-5", className)}
      {...props}
    />
  )
);
HeroContent.displayName = "HeroContent";

export interface HeroEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "soft" | "gradient" | "glass";
}

/** Badge/kicker do topo do Hero (ex.: "v2.0 — agora com 3D"). */
function HeroEyebrow({ variant = "soft", className, ...props }: HeroEyebrowProps) {
  const styles: Record<string, string> = {
    soft: "border-aura-primary/30 bg-aura-primary/10 text-aura-primary",
    gradient: "aura-gradient-primary aura-bevel border border-white/20 font-semibold text-aura-primary-foreground",
    glass: "aura-glass-dc border border-white/15 text-white"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Gradiente de marca no título (padrão false p/ contraste AA). */
  gradient?: boolean;
}

/** H1 gigante do Hero — `gradient` aplica o gradiente primário tokenizado. */
const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ className, gradient = false, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "text-balance text-4xl font-extrabold leading-tight tracking-tight text-aura-surface-foreground sm:text-5xl md:text-6xl",
        gradient && "aura-text-gradient-primary",
        className
      )}
      {...props}
    />
  )
);
HeroTitle.displayName = "HeroTitle";

export interface HeroSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const HeroSubtitle = React.forwardRef<HTMLParagraphElement, HeroSubtitleProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("max-w-xl text-balance text-base text-aura-muted-foreground sm:text-lg", className)}
      {...props}
    />
  )
);
HeroSubtitle.displayName = "HeroSubtitle";

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Linha de CTAs do Hero — empilha no mobile, lado a lado a partir de sm. */
const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3 sm:flex-row", className)} {...props} />
  )
);
HeroActions.displayName = "HeroActions";

export { Hero, HeroContent, HeroEyebrow, HeroTitle, HeroSubtitle, HeroActions, heroVariants };
