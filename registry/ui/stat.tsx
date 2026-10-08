import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const statVariants = cva(
  "relative flex flex-col gap-1 rounded-[var(--aura-radius)] p-5 transition-transform",
  {
    variants: {
      variant: {
        surface: "aura-surface",
        glass: "aura-glass",
        elevated: "aura-surface aura-elevated-strong",
        glow: "aura-glass-dc shadow-aura-glow-primary border border-white/15"
      },
      interactive: {
        true: "aura-tilt cursor-default hover:-translate-y-0.5",
        false: ""
      }
    },
    defaultVariants: {
      variant: "surface",
      interactive: true
    }
  }
);

export interface StatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {
  /** Rótulo do KPI. */
  label: React.ReactNode;
  /** Valor principal (string ou número). */
  value: React.ReactNode;
  /** Variação / delta (ex.: "+12%"). */
  delta?: React.ReactNode;
  /** Direção do delta: sobe (verde) ou desce (vermelho). */
  deltaDirection?: "up" | "down" | "neutral";
  /** Ícone / auxiliar à direita. */
  icon?: React.ReactNode;
  /** Nota de rodapé. */
  hint?: React.ReactNode;
}

/**
 * Card KPI 3D — o padrão de "número grande" dos calculadores Toolspace,
 * com elevação e tilt opcionais do Aura.
 */
export function Stat({
  label,
  value,
  delta,
  deltaDirection = "neutral",
  icon,
  hint,
  variant,
  interactive,
  className,
  ...props
}: StatProps) {
  const deltaColor =
    deltaDirection === "up"
      ? "text-aura-success"
      : deltaDirection === "down"
        ? "text-aura-destructive"
        : "text-aura-muted-foreground";

  return (
    <div className={cn(statVariants({ variant, interactive, className }))} {...props}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-aura-muted-foreground">
          {label}
        </p>
        {icon && <div className="text-aura-muted-foreground">{icon}</div>}
      </div>
      <p className="text-3xl font-bold tracking-tight text-aura-surface-foreground tabular-nums">
        {value}
      </p>
      {(delta || hint) && (
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {delta && <span className={cn("font-semibold tabular-nums", deltaColor)}>{delta}</span>}
          {hint && <span className="text-aura-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}
