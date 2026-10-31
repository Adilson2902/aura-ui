"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  Calendar,
  type CalendarSingleProps,
  type CalendarRangeProps,
  type DateRange
} from "./calendar";

/** Gatilho com visual de input (mesmas famílias de variante). */
const datePickerTriggerVariants = cva(
  [
    "inline-flex w-full items-center gap-2 rounded-[var(--aura-radius)] text-left font-normal transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
    "data-[placeholder=true]:text-aura-muted-foreground",
    "aria-[invalid=true]:border-aura-destructive aria-[invalid=true]:focus-visible:ring-aura-destructive/40"
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 hover:border-aura-primary/40 focus-visible:ring-aura-ring data-[state=open]:ring-2 data-[state=open]:ring-aura-ring",
        soft: "border border-transparent bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/70 focus-visible:ring-aura-ring/50",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground hover:bg-aura-muted/40 focus-visible:border-aura-primary focus-visible:ring-aura-primary/30",
        glass:
          "aura-glass-dc border border-white/15 text-white data-[placeholder=true]:text-white/50 focus-visible:border-aura-primary focus-visible:ring-aura-primary/40",
        "3d": "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel active:translate-y-[2px] active:shadow-[0_1px_0_0_hsl(var(--aura-border))] focus-visible:ring-aura-ring"
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

const CalendarIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4 shrink-0 opacity-70"
  >
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18M8 3v3M16 3v3" />
  </svg>
);

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** true quando a viewport é ≥ `query` (SSR: false). */
function useMediaQuery(query: string) {
  return React.useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false
  );
}

type PassThroughCalendarProps = Pick<
  CalendarSingleProps,
  "minDate" | "maxDate" | "disabled" | "weekStartsOn" | "showOutsideDays" | "labels"
>;

type DatePickerBaseProps = VariantProps<typeof datePickerTriggerVariants> & {
  /** Texto quando vazio. */
  placeholder?: string;
  /** Locale BCP47 (padrão `pt-BR`). */
  locale?: string;
  /** Formato exibido no gatilho (padrão `{ dateStyle: "medium" }`). */
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Mostra botão de limpar quando há valor. */
  clearable?: boolean;
  clearLabel?: string;
  /** Desabilita o gatilho. */
  disabled?: boolean;
  /** Marca como inválido (`aria-invalid`). */
  invalid?: boolean;
  /** Fecha ao concluir a seleção (padrão true). */
  closeOnSelect?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Alinhamento do popover em relação ao gatilho. */
  align?: "start" | "center" | "end";
  /** Repasse ao Calendar (min/max, dias desabilitados, início da semana…). */
  calendarProps?: PassThroughCalendarProps;
  id?: string;
  className?: string;
  /** Classes do conteúdo do popover. */
  contentClassName?: string;
};

function useOpenState(open?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internal, setInternal] = React.useState(false);
  const value = open ?? internal;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return [value, setOpen] as const;
}

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof datePickerTriggerVariants> & {
    label: string | null;
    placeholder: string;
    invalid?: boolean;
    showClear: boolean;
  };

const Trigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ label, placeholder, invalid, showClear, variant, size, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-invalid={invalid || undefined}
      data-placeholder={!label || undefined}
      className={cn(datePickerTriggerVariants({ variant, size }), showClear && "pr-9", className)}
      {...props}
    >
      <CalendarIcon />
      <span className="flex-1 truncate">{label ?? placeholder}</span>
    </button>
  )
);
Trigger.displayName = "DatePickerTrigger";

const ClearButton = ({ label, onClear }: { label: string; onClear: () => void }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClear}
    className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-aura-muted-foreground transition-colors hover:bg-aura-muted hover:text-aura-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
  >
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className="size-3.5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  </button>
);

export type DatePickerProps = DatePickerBaseProps & {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Nome do campo — envia `AAAA-MM-DD` num `<input type="hidden">`. */
  name?: string;
};

/** DatePicker — gatilho estilo input + Calendar num Popover (seleção única). */
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      name,
      placeholder = "Selecione uma data",
      locale = "pt-BR",
      formatOptions,
      clearable = false,
      clearLabel = "Limpar data",
      disabled,
      invalid,
      closeOnSelect = true,
      open: openProp,
      onOpenChange,
      align = "start",
      calendarProps,
      variant,
      size,
      id,
      className,
      contentClassName
    },
    ref
  ) => {
    const [open, setOpen] = useOpenState(openProp, onOpenChange);
    const [internal, setInternal] = React.useState<Date | null>(defaultValue);
    const value = valueProp !== undefined ? valueProp : internal;

    const format = React.useMemo(
      () => new Intl.DateTimeFormat(locale, formatOptions ?? { dateStyle: "medium" }),
      [locale, formatOptions]
    );

    const setValue = (next: Date | null) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const showClear = clearable && !!value && !disabled;

    return (
      <div className={cn("relative w-full", className)} data-slot="date-picker">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Trigger
              ref={ref}
              id={id}
              disabled={disabled}
              invalid={invalid}
              variant={variant}
              size={size}
              label={value ? format.format(value) : null}
              placeholder={placeholder}
              showClear={showClear}
            />
          </PopoverTrigger>
          <PopoverContent align={align} className={cn("w-auto p-0", contentClassName)}>
            <Calendar
              {...calendarProps}
              mode="single"
              variant="ghost"
              locale={locale}
              selected={value}
              defaultMonth={value ?? undefined}
              onSelect={(d) => {
                setValue(d);
                if (d && closeOnSelect) setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {showClear && <ClearButton label={clearLabel} onClear={() => setValue(null)} />}
        {name && <input type="hidden" name={name} value={value ? toISODate(value) : ""} />}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export type DateRangePickerProps = DatePickerBaseProps & {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  /** Meses lado a lado (padrão: 2 em telas ≥ 640px, 1 no mobile). */
  numberOfMonths?: 1 | 2;
  /** Nome base — envia `<name>.from` e `<name>.to` em inputs hidden. */
  name?: string;
};

/** DateRangePicker — intervalo de datas (início → fim) com prévia ao passar o mouse. */
const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      numberOfMonths,
      name,
      placeholder = "Selecione um período",
      locale = "pt-BR",
      formatOptions,
      clearable = false,
      clearLabel = "Limpar período",
      disabled,
      invalid,
      closeOnSelect = true,
      open: openProp,
      onOpenChange,
      align = "start",
      calendarProps,
      variant,
      size,
      id,
      className,
      contentClassName
    },
    ref
  ) => {
    const [open, setOpen] = useOpenState(openProp, onOpenChange);
    const [internal, setInternal] = React.useState<DateRange | null>(defaultValue);
    const value = valueProp !== undefined ? valueProp : internal;
    const wide = useMediaQuery("(min-width: 640px)");
    const months = numberOfMonths ?? (wide ? 2 : 1);

    const format = React.useMemo(
      () => new Intl.DateTimeFormat(locale, formatOptions ?? { dateStyle: "medium" }),
      [locale, formatOptions]
    );

    const label = (() => {
      if (!value?.from) return null;
      if (!value.to) return `${format.format(value.from)} – …`;
      return typeof format.formatRange === "function"
        ? format.formatRange(value.from, value.to)
        : `${format.format(value.from)} – ${format.format(value.to)}`;
    })();

    const setValue = (next: DateRange | null) => {
      if (valueProp === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const showClear = clearable && !!value?.from && !disabled;

    return (
      <div className={cn("relative w-full", className)} data-slot="date-range-picker">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Trigger
              ref={ref}
              id={id}
              disabled={disabled}
              invalid={invalid}
              variant={variant}
              size={size}
              label={label}
              placeholder={placeholder}
              showClear={showClear}
            />
          </PopoverTrigger>
          <PopoverContent align={align} className={cn("w-auto p-0", contentClassName)}>
            <Calendar
              {...(calendarProps as Omit<CalendarRangeProps, "mode">)}
              mode="range"
              variant="ghost"
              locale={locale}
              numberOfMonths={months}
              selected={value}
              defaultMonth={value?.from}
              onSelect={(range) => {
                setValue(range);
                if (range?.from && range.to && closeOnSelect) setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {showClear && <ClearButton label={clearLabel} onClear={() => setValue(null)} />}
        {name && (
          <>
            <input
              type="hidden"
              name={`${name}.from`}
              value={value?.from ? toISODate(value.from) : ""}
            />
            <input type="hidden" name={`${name}.to`} value={value?.to ? toISODate(value.to) : ""} />
          </>
        )}
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker, datePickerTriggerVariants };
export type { DateRange };
