import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Meter — barra semântica (não é progresso de tarefa): uso de disco,
 * bateria, quota. Tons semânticos + variantes visuais (5 estilos).
 * Estados `high`/`optimum` seguem a semântica do <meter> nativo.
 */
const meterTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-aura-muted",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4"
      },
      variant: {
        default: "ring-1 ring-inset ring-aura-border/60",
        glass: "aura-glass-dc ring-1 ring-inset ring-white/15",
        "3d": "shadow-[inset_0_2px_4px_hsl(var(--aura-surface-foreground)/0.15)]",
        outline: "ring-1 ring-inset ring-aura-border",
        gradient: "ring-1 ring-inset ring-aura-primary/25 bg-aura-primary/5"
      }
    },
    defaultVariants: { size: "md", variant: "default" }
  }
);

const meterFillVariants = cva("h-full rounded-full transition-[width] duration-500", {
  variants: {
    tone: {
      primary: "bg-aura-primary",
      accent: "bg-aura-accent",
      success: "bg-aura-success",
      warning: "bg-aura-warning",
      destructive: "bg-aura-destructive",
      gradient: "aura-gradient-primary",
      glow: "bg-aura-primary shadow-aura-glow-primary"
    }
  },
  defaultVariants: { tone: "primary" }
});

export interface MeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof meterTrackVariants>,
    VariantProps<typeof meterFillVariants> {
  /** Valor atual. */
  value: number;
  /** Mínimo (padrão 0). */
  min?: number;
  /** Máximo (padrão 100). */
  max?: number;
  /** Label acessível (ex.: "Uso de disco"). */
  label?: string;
  /** Mostra o percentual à direita (padrão false). */
  showValue?: boolean;
}

function Meter({
  value,
  min = 0,
  max = 100,
  label = "Medidor",
  showValue = false,
  size,
  variant,
  tone,
  className,
  ...props
}: MeterProps) {
  const pct = Math.round(((value - min) / (max - min)) * 100);
  // semântica: acima de 80% warning, acima de 95% destructive (se tom não veio explícito)
  const autoTone =
    tone ?? (pct >= 95 ? "destructive" : pct >= 80 ? "warning" : "primary");

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={cn("flex w-full items-center gap-3", className)}
      {...props}
    >
      <div className={cn(meterTrackVariants({ size, variant }), "flex-1")}>
        <div
          className={cn(meterFillVariants({ tone: autoTone }))}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
      {showValue && (
        <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-aura-surface-foreground">
          {pct}%
        </span>
      )}
    </div>
  );
}

export { Meter, meterTrackVariants, meterFillVariants };
