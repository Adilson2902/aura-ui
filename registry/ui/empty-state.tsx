import * as React from "react";
import { cn } from "aura-ui-core";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Ícone / ilustração no topo. */
  icon?: React.ReactNode;
  /** Título curto. */
  title: React.ReactNode;
  /** Descrição opcional. */
  description?: React.ReactNode;
  /** Ação principal (botão). */
  action?: React.ReactNode;
  /** Ação secundária. */
  secondaryAction?: React.ReactNode;
}

/** Estado vazio amigável — listas, buscas e ferramentas sem resultado. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "aura-surface flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="aura-layer flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-muted text-aura-muted-foreground shadow-aura-2">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-aura-muted-foreground">{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
