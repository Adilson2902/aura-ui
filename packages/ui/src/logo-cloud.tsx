import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * LogoCloud — faixa de logos de clientes/parceiros.
 * `layout="grid"` (estático, responsivo) ou `"marquee"` (rolagem infinita
 * em CSS puro, pausa no hover, máscara nas bordas e parada em reduced-motion).
 * Logos ficam em tons de cinza e ganham cor no hover (`grayscale`).
 */
const logoCloudVariants = cva("w-full", {
  variants: {
    variant: {
      plain: "",
      surface: "aura-surface px-6 py-8",
      muted: "rounded-[var(--aura-radius)] bg-aura-muted px-6 py-8",
      glass: "aura-glass-dc border border-white/10 px-6 py-8",
      outline: "rounded-[var(--aura-radius)] border border-dashed border-aura-border px-6 py-8"
    }
  },
  defaultVariants: { variant: "plain" }
});

export interface LogoCloudProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof logoCloudVariants> {
  /** Título acima dos logos (ex.: "Usado por times em"). */
  title?: React.ReactNode;
  /** Disposição (padrão "grid"). */
  layout?: "grid" | "marquee";
  /** Duração de um ciclo do marquee em segundos (padrão 30). */
  speed?: number;
  /** Desliga o filtro cinza. */
  colored?: boolean;
}

const LogoCloud = React.forwardRef<HTMLDivElement, LogoCloudProps>(
  (
    { className, variant, title, layout = "grid", speed = 30, colored = false, children, ...props },
    ref
  ) => {
    const items = React.Children.toArray(children);
    const itemClass = cn(
      "flex h-10 shrink-0 items-center justify-center text-aura-muted-foreground transition-[filter,opacity,color] duration-300 [&_img]:max-h-full [&_img]:w-auto [&_svg]:max-h-full",
      !colored &&
        "opacity-70 grayscale hover:opacity-100 hover:grayscale-0 hover:text-aura-surface-foreground"
    );

    return (
      <div ref={ref} className={cn(logoCloudVariants({ variant }), className)} {...props}>
        {title != null && (
          <p className="mb-6 text-center text-sm font-medium text-aura-muted-foreground">{title}</p>
        )}
        {layout === "grid" ? (
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {items.map((child, i) => (
              <li key={i} className={itemClass}>
                {child}
              </li>
            ))}
          </ul>
        ) : (
          <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <ul
              className="flex w-max shrink-0 items-center gap-12 pr-12 group-hover:[animation-play-state:paused]"
              style={{ animation: `aura-marquee ${speed}s linear infinite` }}
            >
              {[...items, ...items].map((child, i) => (
                <li key={i} aria-hidden={i >= items.length || undefined} className={itemClass}>
                  {child}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
LogoCloud.displayName = "LogoCloud";

export { LogoCloud, logoCloudVariants };
