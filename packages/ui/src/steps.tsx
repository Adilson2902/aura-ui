import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Steps — stepper horizontal/vertical com 5 variantes (line, dots, gradient,
 * glass, cards). Controle o passo ativo via `active` (0-based) e `completed`.
 */
const stepsVariants = cva("flex w-full", {
  variants: {
    variant: {
      line: "gap-4",
      dots: "gap-2",
      gradient: "gap-5",
      glass: "gap-4 aura-glass-dc rounded-[var(--aura-radius)] p-4",
      cards: "gap-3"
    },
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col gap-1"
    }
  },
  compoundVariants: [{ variant: "dots", orientation: "horizontal", class: "items-center" }],
  defaultVariants: { variant: "line", orientation: "horizontal" }
});

export interface StepItem {
  /** Título curto do passo. */
  title: React.ReactNode;
  /** Descrição opcional abaixo do título. */
  description?: React.ReactNode;
  /** Ícone custom (substitui o número). */
  icon?: React.ReactNode;
}

export interface StepsProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof stepsVariants> {
  steps: StepItem[];
  /** Índice do passo atual (0-based). */
  active?: number;
  /** Renderiza passo como concluído (✓) quando índice < active. */
  completed?: boolean;
}

/** Stepper pronto — conectores com a cor da marca quando concluídos. */
function Steps({
  steps,
  active = 0,
  completed = true,
  variant,
  orientation = "horizontal",
  className,
  ...props
}: StepsProps) {
  const isCards = variant === "cards";
  return (
    <ol className={cn(stepsVariants({ variant, orientation }), className)} {...props}>
      {steps.map((step, i) => {
        const state = i < active ? "done" : i === active ? "current" : "todo";
        const markerBase =
          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200";
        const marker =
          state === "done"
            ? variant === "gradient"
              ? "aura-gradient-primary aura-bevel text-aura-primary-foreground"
              : "bg-aura-primary text-aura-primary-foreground shadow-aura-1"
            : state === "current"
              ? variant === "gradient" || variant === "glass"
                ? "aura-gradient-primary aura-bevel text-aura-primary-foreground shadow-aura-glow-primary scale-110"
                : "bg-aura-primary/15 text-aura-primary ring-2 ring-aura-primary"
              : variant === "glass"
                ? "aura-glass-dc border border-white/15 text-white/60"
                : "bg-aura-muted text-aura-muted-foreground ring-1 ring-aura-border";

        return (
          <li
            key={i}
            className={cn(
              "flex gap-3",
              orientation === "horizontal"
                ? "flex-1 flex-col items-center text-center"
                : "flex-row items-start pb-6 last:pb-0",
              isCards &&
                orientation === "horizontal" &&
                "rounded-[var(--aura-radius)] border border-aura-border bg-aura-muted/30 p-4",
              variant === "glass" &&
                orientation === "horizontal" &&
                "rounded-[var(--aura-radius)] aura-glass-dc p-4",
              isCards && state === "current" && "border-aura-primary/50 shadow-aura-1"
            )}
          >
            <span className="relative flex items-center" aria-current={state === "current" ? "step" : undefined}>
              {/* conector horizontal atrás do marcador */}
              {orientation === "horizontal" && i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-full top-1/2 h-0.5 w-[calc(50%+1.5rem)] -translate-y-1/2 translate-x-1/2",
                    state === "todo" || variant === "dots"
                      ? "bg-aura-border"
                      : variant === "gradient"
                        ? "bg-[linear-gradient(90deg,hsl(var(--aura-primary)),hsl(var(--aura-accent)))]"
                        : "bg-aura-primary"
                  )}
                />
              )}
              {/* conector vertical */}
              {orientation === "vertical" && i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 top-full h-[calc(100%-1rem)] w-0.5 -translate-x-1/2",
                    i < active ? "bg-aura-primary" : "bg-aura-border"
                  )}
                />
              )}
              <span className={cn(markerBase, marker)}>
                {step.icon ?? (state === "done" && completed ? <CheckIcon /> : i + 1)}
              </span>
            </span>
            {(step.title != null || step.description != null) && (
              <span
                className={cn(
                  "flex flex-col gap-0.5",
                  orientation === "horizontal" && "items-center"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    state === "todo" ? "text-aura-muted-foreground" : "text-aura-surface-foreground"
                  )}
                >
                  {step.title}
                </span>
                {step.description != null && (
                  <span className="max-w-[16rem] text-xs text-aura-muted-foreground">
                    {step.description}
                  </span>
                )}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M13.25 4.75l-6.5 6.5-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { Steps, stepsVariants };
