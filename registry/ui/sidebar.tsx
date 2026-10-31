"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Sidebar + AppShell — casca de dashboard/app. Sidebar fixa com colapso
 * (ícones só), itens ativos com indicador da marca, header sticky e main
 * com largura compensando. Zero deps; mobile via Sheet do projeto.
 */
const sidebarVariants = cva(
  "sticky top-0 flex h-svh shrink-0 flex-col border-r transition-[width] duration-200",
  {
    variants: {
      variant: {
        surface: "border-aura-border bg-aura-surface",
        muted: "border-aura-border/60 bg-aura-muted/50",
        glass: "border-white/10 aura-glass-dc",
        dark: "border-white/10 bg-[hsl(232_31%_8%)] text-[hsl(210_40%_96%)]",
        gradient:
          "border-transparent bg-[linear-gradient(180deg,hsl(var(--aura-primary)/0.1),hsl(var(--aura-accent)/0.06))] backdrop-blur-sm"
      },
      collapsed: {
        true: "w-16",
        false: "w-60"
      }
    },
    defaultVariants: { variant: "surface", collapsed: false }
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {
  /** Logo/marca no topo (renderizado no fluxo). */
  brand?: React.ReactNode;
  /** Itens de navegação (SidebarItem). */
  children?: React.ReactNode;
  /** Rodapé da sidebar (usuário, logout…). */
  footer?: React.ReactNode;
  /** Controla colapso externamente; sem ele, usa estado interno + botão. */
  collapsed?: boolean;
  /** Callback quando colapso muda (modo controlado). */
  onCollapsedChange?: (collapsed: boolean) => void;
}

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
    <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Sidebar({
  brand,
  footer,
  collapsed: controlled,
  onCollapsedChange,
  variant,
  className,
  children,
  ...props
}: SidebarProps) {
  const [internal, setInternal] = React.useState(false);
  const collapsed = controlled ?? internal;
  const isDark = variant === "glass" || variant === "dark";

  const toggle = () => {
    const next = !collapsed;
    setInternal(next);
    onCollapsedChange?.(next);
  };

  return (
    <aside
      className={cn(sidebarVariants({ variant, collapsed }), className)}
      {...props}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2 border-b px-4",
          isDark ? "border-white/10" : "border-aura-border/60"
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 font-bold">
          {brand}
          {collapsed && <span className="sr-only"> (sidebar recolhida)</span>}
        </span>
      </div>

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3">
        {children}
      </nav>

      {(footer != null || onCollapsedChange != null || controlled != null) && (
        <div
          className={cn(
            "border-t p-3",
            isDark ? "border-white/10" : "border-aura-border/60"
          )}
        >
          {footer}
          {(controlled != null || onCollapsedChange != null) && (
            <button
              type="button"
              onClick={toggle}
              aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
              className={cn(
                "mt-2 flex h-8 w-full items-center justify-center rounded-[calc(var(--aura-radius)-4px)] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
                isDark ? "text-white/70 hover:bg-white/10" : "text-aura-muted-foreground hover:bg-aura-muted"
              )}
            >
              <span className={cn("transition-transform duration-200", collapsed ? "-rotate-180" : "")}>
                <ChevronIcon />
              </span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Ativo? (destaque da marca). */
  active?: boolean;
  /** Ícone (18-20px recomendado). */
  icon?: React.ReactNode;
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ active = false, icon, className, children, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-[calc(var(--aura-radius)-4px)] px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
        active
          ? "bg-aura-primary/12 text-aura-primary"
          : "text-aura-muted-foreground hover:bg-aura-muted hover:text-aura-surface-foreground",
        "before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-aura-primary before:transition-[opacity,scale]",
        active ? "before:scale-100 before:opacity-100" : "before:scale-0 before:opacity-0"
      )}
      {...props}
    >
      {icon != null && <span className="shrink-0 [&>svg]:h-[1.15em] [&>svg]:w-[1.15em]">{icon}</span>}
      <span className="truncate">{children}</span>
    </a>
  )
);
SidebarItem.displayName = "SidebarItem";

/** Label de seção na sidebar (ex.: "Geral"). */
export function SidebarLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-aura-muted-foreground/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header sticky no topo (Navbar funciona aqui). */
  header?: React.ReactNode;
  /** Sidebar à esquerda. */
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}

/** Casca de aplicação — header + sidebar + conteúdo com scroll próprio. */
export function AppShell({ header, sidebar, children, className, ...props }: AppShellProps) {
  return (
    <div className={cn("flex min-h-svh w-full", className)} {...props}>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header != null && (
          <header className="sticky top-0 z-20 border-b border-aura-border/60 bg-aura-surface/80 backdrop-blur-md">
            {header}
          </header>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export { SidebarItem, sidebarVariants };
