import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Timeline — linha do tempo vertical com 5 variantes (line, gradient, glass,
 * dots, cards). Cada item tem marcador (dot ou ícone) + conteúdo livre.
 */
const timelineVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      line: "before:absolute before:left-[0.6875rem] before:top-2 before:bottom-2 before:w-px before:bg-aura-border",
      gradient:
        "before:absolute before:left-[0.6875rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-[linear-gradient(180deg,hsl(var(--aura-primary)),hsl(var(--aura-accent)))]",
      glass: "before:absolute before:left-[0.6875rem] before:top-2 before:bottom-2 before:w-px before:bg-white/15",
      dots: "",
      cards: "gap-3"
    }
  },
  defaultVariants: { variant: "line" }
});

export interface TimelineProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof timelineVariants> {}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, variant, ...props }, ref) => (
    <ol ref={ref} className={cn(timelineVariants({ variant, className }))} {...props} />
  )
);
Timeline.displayName = "Timeline";

export interface TimelineItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title">,
    Pick<VariantProps<typeof timelineVariants>, "variant"> {
  /** Título do evento (ex.: "v2.0 lançada"). */
  title?: React.ReactNode;
  /** Timestamp/eta (ex.: "Mar 2026"). */
  time?: React.ReactNode;
  /** Ícone custom (substitui o dot). */
  icon?: React.ReactNode;
  /** Último item? (padrão: controlado pelo Timeline via contexto implícito — passe manualmente no último) */
}

const dotBase =
  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full";

/** Item de timeline — marcador alinhado à trilha lateral. */
function TimelineItem({ title, time, icon, variant = "line", className, children, ...props }: TimelineItemProps) {
  const isCards = variant === "cards";
  return (
    <li
      className={cn(
        "relative flex gap-4 pb-8 last:pb-0",
        variant === "dots" && "before:absolute before:left-[0.6875rem] before:top-4 before:h-2 before:w-2 before:rounded-full before:bg-aura-border",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          dotBase,
          isCards && "sr-only",
          !isCards &&
            (icon != null
              ? "bg-aura-primary/15 text-aura-primary ring-2 ring-aura-primary/30"
              : variant === "gradient" || variant === "glass"
                ? "bg-aura-primary text-aura-primary-foreground shadow-aura-glow-primary"
                : "bg-aura-muted text-aura-primary ring-1 ring-aura-border")
        )}
      >
        {icon ?? <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1 pt-0.5",
          isCards && "rounded-[var(--aura-radius)] border border-aura-border bg-aura-muted/30 p-4"
        )}
      >
        {(title != null || time != null) && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            {title != null && (
              <h3 className="text-sm font-semibold text-aura-surface-foreground">{title}</h3>
            )}
            {time != null && (
              <time className="text-xs font-medium text-aura-muted-foreground">{time}</time>
            )}
          </div>
        )}
        {children != null && (
          <div className="text-sm leading-relaxed text-aura-muted-foreground">{children}</div>
        )}
      </div>
    </li>
  );
}

export { Timeline, TimelineItem, timelineVariants };
