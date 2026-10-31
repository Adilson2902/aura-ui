"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/* ===== helpers de data (internos, sem deps) ===== */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Soma meses mantendo o dia (limitado ao último dia do mês destino). */
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = endOfMonth(target).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
/** Chave ordenável AAAAMMDD — compara dias ignorando horário. */
const dayKey = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
const isSameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && dayKey(a) === dayKey(b);
const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** 6 semanas fixas (altura estável) começando em `weekStartsOn`. */
function monthGrid(month: Date, weekStartsOn: number) {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
  );
}

export type DateRange = { from: Date | undefined; to?: Date | undefined };

const calendarVariants = cva("group/calendar inline-block p-3 text-sm", {
  variants: {
    variant: {
      surface: "aura-surface",
      glass: "aura-glass-dc",
      ghost: "bg-transparent text-aura-surface-foreground"
    }
  },
  defaultVariants: { variant: "surface" }
});

type CalendarLabels = {
  previousMonth?: string;
  nextMonth?: string;
  today?: string;
};

type CalendarBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue" | "onChange"
> &
  VariantProps<typeof calendarVariants> & {
    /** Mês exibido (controlado). */
    month?: Date;
    /** Mês inicial (não-controlado; padrão: seleção ou hoje). */
    defaultMonth?: Date;
    onMonthChange?: (month: Date) => void;
    /** 0 = domingo (padrão) … 6 = sábado. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** Locale BCP47 dos nomes de mês/dia (padrão `pt-BR`). */
    locale?: string;
    minDate?: Date;
    maxDate?: Date;
    /** Desabilita dias específicos (ex.: fins de semana). */
    disabled?: (date: Date) => boolean;
    /** 1 ou 2 meses lado a lado. */
    numberOfMonths?: 1 | 2;
    /** Mostra dias dos meses vizinhos (só com 1 mês; padrão true). */
    showOutsideDays?: boolean;
    /** Textos acessíveis. */
    labels?: CalendarLabels;
  };

export type CalendarSingleProps = CalendarBaseProps & {
  mode?: "single";
  selected?: Date | null;
  defaultSelected?: Date | null;
  onSelect?: (date: Date | null) => void;
  /** Impede desmarcar o dia selecionado ao clicar nele de novo. */
  required?: boolean;
};

export type CalendarRangeProps = CalendarBaseProps & {
  mode: "range";
  selected?: DateRange | null;
  defaultSelected?: DateRange | null;
  onSelect?: (range: DateRange | null) => void;
  required?: boolean;
};

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

const navButton =
  "inline-flex size-8 items-center justify-center rounded-[calc(var(--aura-radius)-4px)] text-aura-muted-foreground transition-colors hover:bg-aura-muted hover:text-aura-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:pointer-events-none disabled:opacity-30 group-data-[variant=glass]/calendar:text-white/70 group-data-[variant=glass]/calendar:hover:bg-white/10";

/**
 * Calendar — calendário sem dependências: seleção `single` ou `range`,
 * 1–2 meses, min/max/dias desabilitados, nomes via `Intl` e navegação
 * completa por teclado (setas, Home/End, PageUp/PageDown, Shift = ano).
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode = "single",
    selected: selectedProp,
    defaultSelected,
    onSelect,
    required,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    weekStartsOn = 0,
    locale = "pt-BR",
    minDate,
    maxDate,
    disabled,
    numberOfMonths = 1,
    showOutsideDays = true,
    labels,
    variant,
    className,
    ...rest
  } = props as CalendarBaseProps & {
    mode?: "single" | "range";
    selected?: Date | DateRange | null;
    defaultSelected?: Date | DateRange | null;
    onSelect?: (value: Date | DateRange | null) => void;
    required?: boolean;
  };
  const isRange = mode === "range";

  const [internalSelected, setInternalSelected] = React.useState<Date | DateRange | null>(
    defaultSelected ?? null
  );
  const selected = selectedProp !== undefined ? selectedProp : internalSelected;
  const single = !isRange && selected instanceof Date ? selected : null;
  const range = isRange && selected && !(selected instanceof Date) ? selected : null;

  const today = startOfDay(new Date());
  const anchor = single ?? range?.from ?? today;
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? anchor)
  );
  const displayMonth = startOfMonth(monthProp ?? internalMonth);
  const lastMonth = addMonths(displayMonth, numberOfMonths - 1);

  const setMonth = (m: Date) => {
    const next = startOfMonth(m);
    if (monthProp === undefined) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const inView = (d: Date) =>
    dayKey(d) >= dayKey(displayMonth) && dayKey(d) <= dayKey(endOfMonth(lastMonth));

  const isDisabled = (d: Date) =>
    (minDate !== undefined && dayKey(d) < dayKey(minDate)) ||
    (maxDate !== undefined && dayKey(d) > dayKey(maxDate)) ||
    (disabled?.(d) ?? false);

  /* ----- roving tabindex ----- */
  const [focused, setFocused] = React.useState<Date | null>(null);
  const [hovered, setHovered] = React.useState<Date | null>(null);
  const focusTarget =
    (focused && inView(focused) && focused) ||
    (single && inView(single) && single) ||
    (range?.from && inView(range.from) && range.from) ||
    (inView(today) && today) ||
    displayMonth;

  const gridRef = React.useRef<HTMLDivElement>(null);
  const shouldFocus = React.useRef(false);
  React.useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`button[data-day="${dayKey(focusTarget)}"]`)
      ?.focus();
  });

  const moveFocus = (next: Date) => {
    shouldFocus.current = true;
    setFocused(next);
    if (dayKey(next) < dayKey(displayMonth)) setMonth(next);
    else if (dayKey(next) > dayKey(endOfMonth(lastMonth)))
      setMonth(addMonths(startOfMonth(next), -(numberOfMonths - 1)));
  };

  /* ----- seleção ----- */
  const commit = (value: Date | DateRange | null) => {
    if (selectedProp === undefined) setInternalSelected(value);
    onSelect?.(value);
  };

  const selectDay = (day: Date) => {
    if (isDisabled(day)) return;
    setFocused(day);
    if (!isRange) {
      if (isSameDay(single, day)) {
        if (!required) commit(null);
        return;
      }
      commit(day);
      if (!inView(day)) setMonth(day);
      return;
    }
    const from = range?.from;
    const to = range?.to;
    if (!from || to) {
      commit({ from: day, to: undefined });
    } else if (dayKey(day) < dayKey(from)) {
      commit({ from: day, to: from });
    } else {
      commit({ from, to: day });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, day: Date) => {
    const dow = (day.getDay() - weekStartsOn + 7) % 7;
    let next: Date | null = null;
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(day, -1);
        break;
      case "ArrowRight":
        next = addDays(day, 1);
        break;
      case "ArrowUp":
        next = addDays(day, -7);
        break;
      case "ArrowDown":
        next = addDays(day, 7);
        break;
      case "Home":
        next = addDays(day, -dow);
        break;
      case "End":
        next = addDays(day, 6 - dow);
        break;
      case "PageUp":
        next = addMonths(day, e.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(day, e.shiftKey ? 12 : 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectDay(day);
        return;
      default:
        return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  /* ----- textos via Intl ----- */
  const captionFormat = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  );
  const dayLabelFormat = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
    [locale]
  );
  const weekdays = React.useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" });
    // 7 jan 2024 foi domingo.
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, 7 + ((i + weekStartsOn) % 7));
      return { short: short.format(d).replace(".", "").slice(0, 3), long: long.format(d) };
    });
  }, [locale, weekStartsOn]);

  const prevDisabled =
    minDate !== undefined && dayKey(endOfMonth(addMonths(displayMonth, -1))) < dayKey(minDate);
  const nextDisabled = maxDate !== undefined && dayKey(addMonths(lastMonth, 1)) > dayKey(maxDate);

  // Pré-visualização do intervalo ao passar o mouse (início escolhido, fim não).
  const previewEnd = isRange && range?.from && !range.to ? hovered : null;
  const rangeBounds = (() => {
    if (!range?.from) return null;
    const end = range.to ?? previewEnd;
    if (!end) return { start: range.from, end: range.from };
    return dayKey(end) < dayKey(range.from)
      ? { start: end, end: range.from }
      : { start: range.from, end };
  })();

  const showOutside = showOutsideDays && numberOfMonths === 1;
  const baseId = React.useId();

  return (
    <div
      ref={ref}
      data-slot="calendar"
      data-variant={variant ?? "surface"}
      className={cn(calendarVariants({ variant }), className)}
      {...rest}
    >
      <div ref={gridRef} className="flex flex-col gap-4 sm:flex-row">
        {Array.from({ length: numberOfMonths }, (_, mi) => {
          const month = addMonths(displayMonth, mi);
          const captionId = `${baseId}-caption-${mi}`;
          return (
            <div key={mi} className="flex flex-col gap-2">
              <div className="flex h-8 items-center justify-between gap-1">
                {mi === 0 ? (
                  <button
                    type="button"
                    className={navButton}
                    aria-label={labels?.previousMonth ?? "Mês anterior"}
                    disabled={prevDisabled}
                    onClick={() => setMonth(addMonths(displayMonth, -1))}
                  >
                    <Chevron dir="left" />
                  </button>
                ) : (
                  <span className="size-8" aria-hidden />
                )}
                <div
                  id={captionId}
                  aria-live="polite"
                  className="text-sm font-semibold first-letter:uppercase"
                >
                  {captionFormat.format(month)}
                </div>
                {mi === numberOfMonths - 1 ? (
                  <button
                    type="button"
                    className={navButton}
                    aria-label={labels?.nextMonth ?? "Próximo mês"}
                    disabled={nextDisabled}
                    onClick={() => setMonth(addMonths(displayMonth, 1))}
                  >
                    <Chevron dir="right" />
                  </button>
                ) : (
                  <span className="size-8" aria-hidden />
                )}
              </div>

              <table role="grid" aria-labelledby={captionId} className="border-collapse">
                <thead>
                  <tr>
                    {weekdays.map((w) => (
                      <th
                        key={w.long}
                        scope="col"
                        abbr={w.long}
                        className="size-9 p-0 text-[11px] font-medium capitalize text-aura-muted-foreground group-data-[variant=glass]/calendar:text-white/50"
                      >
                        {w.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthGrid(month, weekStartsOn).map((week, wi) => (
                    <tr key={wi}>
                      {week.map((day) => {
                        const outside = !isSameMonth(day, month);
                        if (outside && !showOutside) {
                          return <td key={dayKey(day)} className="size-9 p-0" />;
                        }
                        const key = dayKey(day);
                        const dayDisabled = isDisabled(day);
                        const isToday = isSameDay(day, today);
                        const isStart = !!rangeBounds && isSameDay(day, rangeBounds.start);
                        const isEnd = !!rangeBounds && isSameDay(day, rangeBounds.end);
                        const inRange =
                          !!rangeBounds &&
                          key > dayKey(rangeBounds.start) &&
                          key < dayKey(rangeBounds.end);
                        const isSelected = isRange ? isStart || isEnd : isSameDay(day, single);
                        const preview = !!previewEnd && (inRange || isEnd) && !range?.to;
                        const tabbable = !outside && isSameDay(day, focusTarget);

                        return (
                          <td
                            key={key}
                            role="gridcell"
                            aria-selected={isSelected || inRange || undefined}
                            className={cn(
                              "relative size-9 p-0 text-center",
                              inRange && "bg-aura-primary/10 first:rounded-l-md last:rounded-r-md",
                              isStart &&
                                !isEnd &&
                                "rounded-l-[calc(var(--aura-radius)-4px)] bg-aura-primary/10",
                              isEnd &&
                                !isStart &&
                                "rounded-r-[calc(var(--aura-radius)-4px)] bg-aura-primary/10",
                              preview && "bg-aura-primary/5",
                              "group-data-[variant=glass]/calendar:[&[aria-selected]]:bg-white/10"
                            )}
                          >
                            <button
                              type="button"
                              data-day={key}
                              data-today={isToday || undefined}
                              data-selected={isSelected || undefined}
                              data-outside={outside || undefined}
                              tabIndex={tabbable ? 0 : -1}
                              aria-disabled={dayDisabled || undefined}
                              aria-current={isToday ? "date" : undefined}
                              aria-label={`${dayLabelFormat.format(day)}${
                                isToday ? `, ${labels?.today ?? "hoje"}` : ""
                              }`}
                              onClick={() => selectDay(day)}
                              onKeyDown={(e) => handleKeyDown(e, day)}
                              onFocus={() => setFocused(day)}
                              onMouseEnter={() => isRange && setHovered(day)}
                              onMouseLeave={() => isRange && setHovered(null)}
                              className={cn(
                                "relative inline-flex size-9 items-center justify-center rounded-[calc(var(--aura-radius)-4px)] text-sm tabular-nums transition-[background,color,transform,box-shadow] duration-150",
                                "hover:bg-aura-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
                                "group-data-[variant=glass]/calendar:hover:bg-white/10",
                                "data-[outside=true]:text-aura-muted-foreground/60",
                                "data-[today=true]:font-semibold data-[today=true]:text-aura-primary",
                                "data-[today=true]:after:absolute data-[today=true]:after:bottom-1 data-[today=true]:after:size-1 data-[today=true]:after:rounded-full data-[today=true]:after:bg-current",
                                "data-[selected=true]:bg-aura-primary data-[selected=true]:text-aura-primary-foreground data-[selected=true]:shadow-aura-2 data-[selected=true]:hover:bg-aura-primary data-[selected=true]:hover:brightness-110",
                                "aria-disabled:pointer-events-none aria-disabled:text-aura-muted-foreground/40 aria-disabled:line-through"
                              )}
                            >
                              {day.getDate()}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar, calendarVariants };
