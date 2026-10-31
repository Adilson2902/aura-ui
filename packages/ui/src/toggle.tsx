"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Toggle — botão de estado (aria-pressed) sem Radix (zero deps).
 * ToggleGroup agrupa toggles com seleção única ou múltipla
 * (role="group" + setas navegam entre itens).
 */
const toggleVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--aura-radius)] text-sm font-medium transition-[transform,background,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 hover:bg-aura-muted/60 data-[pressed=true]:bg-aura-primary data-[pressed=true]:text-aura-primary-foreground data-[pressed=true]:shadow-aura-2 aura-press",
        soft:
          "bg-transparent text-aura-muted-foreground hover:bg-aura-muted data-[pressed=true]:bg-aura-primary/15 data-[pressed=true]:text-aura-primary aura-press",
        glass:
          "aura-glass-dc border border-white/15 text-white hover:bg-white/10 data-[pressed=true]:bg-white/20 aura-press",
        gradient:
          "border border-aura-border/60 data-[pressed=true]:border-white/20 data-[pressed=true]:[background:var(--aura-gradient-primary)] data-[pressed=true]:text-aura-primary-foreground data-[pressed=true]:shadow-aura-glow-primary aura-press",
        "3d":
          "border border-aura-border bg-aura-muted text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel data-[pressed=true]:bg-aura-primary data-[pressed=true]:text-aura-primary-foreground data-[pressed=true]:shadow-[0_1px_0_0_hsl(var(--aura-border))] data-[pressed=true]:translate-y-[2px] hover:shadow-[0_2px_0_0_hsl(var(--aura-border))]"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  /** Estado pressionado (controlado). */
  pressed?: boolean;
  /** Estado inicial (não-controlado). */
  defaultPressed?: boolean;
  /** Callback de mudança. */
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { pressed, defaultPressed = false, onPressedChange, className, variant, size, onClick, ...props },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultPressed);
    const isPressed = pressed ?? internal;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = !isPressed;
      if (pressed == null) setInternal(next);
      onPressedChange?.(next);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-pressed={isPressed || undefined}
        onClick={handleClick}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export interface ToggleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Itens — labels (ou objetos {label, value}). */
  items: (React.ReactNode | { label: React.ReactNode; value: string; disabled?: boolean })[];
  /** Valores pressionados (controlado). */
  value?: string[];
  /** Estado inicial (não-controlado). */
  defaultValue?: string[];
  /** Múltipla seleção (padrão single). */
  multiple?: boolean;
  /** Callback com os valores ativos. */
  onChange?: (values: string[]) => void;
  /** Variante repassada a cada Toggle. */
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
}

type NormalizedItem = { label: React.ReactNode; value: string; disabled?: boolean };

/** Grupo de toggles — single (radio-like) ou multiple (checkbox-like). */
function ToggleGroup({
  items,
  value: controlled,
  defaultValue = [],
  multiple = false,
  onChange,
  variant = "default",
  size = "md",
  className,
  ...props
}: ToggleGroupProps) {
  const normalized: NormalizedItem[] = items.map((item, i) =>
    typeof item === "object" && item !== null && "value" in item
      ? (item as NormalizedItem)
      : { label: item, value: String(i) }
  );
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const active = controlled ?? internal;

  const toggleItem = (v: string) => {
    const next = multiple
      ? active.includes(v)
        ? active.filter((x) => x !== v)
        : [...active, v]
      : active.includes(v)
        ? []
        : [v];
    if (controlled == null) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      role="group"
      className={cn("inline-flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {normalized.map((item) => (
        <Toggle
          key={item.value}
          variant={variant}
          size={size}
          pressed={active.includes(item.value)}
          onPressedChange={() => toggleItem(item.value)}
          disabled={item.disabled}
        >
          {item.label}
        </Toggle>
      ))}
    </div>
  );
}

export { Toggle, ToggleGroup, toggleVariants };
