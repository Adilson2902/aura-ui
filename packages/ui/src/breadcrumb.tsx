import * as React from "react";
import { cn } from "aura-ui-core";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
};

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Separador entre itens (padrão "/"). */
  separator?: React.ReactNode;
  /** Classe do link (útil para integrar com roteadores). */
  linkClassName?: string;
}

/**
 * Breadcrumb acessível: último item é `aria-current="page"`.
 * Passe `asChild` no futuro / use `linkClassName` para Next Link.
 */
export function Breadcrumb({
  items,
  separator = "/",
  className,
  linkClassName,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-aura-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="opacity-50">
                  {separator}
                </span>
              )}
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn("font-medium text-aura-surface-foreground", last && "text-aura-primary")}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className={cn(
                    "rounded-sm transition-colors hover:text-aura-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
                    linkClassName
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
