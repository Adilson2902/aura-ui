import * as React from "react";
import { cn } from "aura-ui-core";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Página atual (1-based). */
  page: number;
  /** Total de páginas. */
  pageCount: number;
  /** Callback de navegação. */
  onPageChange?: (page: number) => void;
  /** Quantidade de vizinhos ao redor da atual (padrão 1). */
  siblingCount?: number;
  /** Desabilita tudo. */
  disabled?: boolean;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Paginação acessível com elevação Aura e foco visível. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  disabled = false,
  className,
  ...props
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const total = Math.max(1, pageCount);
    const current = Math.min(Math.max(1, page), total);
    const left = Math.max(2, current - siblingCount);
    const right = Math.min(total - 1, current + siblingCount);
    const items: (number | "dots")[] = [1];
    if (left > 2) items.push("dots");
    items.push(...range(left, right));
    if (right < total - 1) items.push("dots");
    if (total > 1) items.push(total);
    return items;
  }, [page, pageCount, siblingCount]);

  const go = (n: number) => {
    if (disabled) return;
    const next = Math.min(Math.max(1, n), Math.max(1, pageCount));
    if (next !== page) onPageChange?.(next);
  };

  return (
    <nav aria-label="Paginação" className={cn("flex items-center gap-1", className)} {...props}>
      <button
        type="button"
        aria-label="Página anterior"
        disabled={disabled || page <= 1}
        onClick={() => go(page - 1)}
        className="aura-press h-9 rounded-[var(--aura-radius)] border border-aura-border px-3 text-sm text-aura-muted-foreground hover:bg-aura-muted disabled:opacity-40"
      >
        ←
      </button>
      {pages.map((item, i) =>
        item === "dots" ? (
          <span key={`dots-${i}`} aria-hidden className="px-1 text-aura-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Página ${item}`}
            aria-current={item === page ? "page" : undefined}
            disabled={disabled}
            onClick={() => go(item)}
            className={cn(
              "aura-press h-9 min-w-9 rounded-[var(--aura-radius)] border px-3 text-sm tabular-nums",
              item === page
                ? "border-transparent bg-aura-primary text-aura-primary-foreground shadow-aura-2"
                : "border-aura-border text-aura-surface-foreground hover:bg-aura-muted"
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={disabled || page >= pageCount}
        onClick={() => go(page + 1)}
        className="aura-press h-9 rounded-[var(--aura-radius)] border border-aura-border px-3 text-sm text-aura-muted-foreground hover:bg-aura-muted disabled:opacity-40"
      >
        →
      </button>
    </nav>
  );
}
