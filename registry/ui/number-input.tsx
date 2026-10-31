"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes do NumberInput — mesmas famílias do Input (foco via `focus-within`). */
const numberInputVariants = cva(
  [
    "group/number relative flex w-full items-stretch overflow-hidden rounded-[var(--aura-radius)] transition-all duration-150",
    "focus-within:ring-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
    "has-[[aria-invalid=true]]:border-aura-destructive has-[[aria-invalid=true]]:focus-within:ring-aura-destructive/40"
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 focus-within:ring-aura-ring",
        soft: "border border-transparent bg-aura-muted text-aura-surface-foreground focus-within:bg-aura-surface focus-within:ring-aura-ring/50",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground focus-within:border-aura-primary focus-within:ring-aura-primary/30",
        glass:
          "aura-glass-dc border border-white/15 text-white focus-within:border-aura-primary focus-within:ring-aura-primary/40 [&_input::placeholder]:text-white/40",
        glow: "border border-aura-primary/40 bg-aura-muted/50 text-aura-surface-foreground focus-within:border-aura-primary focus-within:shadow-[var(--aura-glow-primary)] focus-within:ring-aura-primary/40",
        "3d": "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel focus-within:ring-aura-ring"
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

const stepButton =
  "flex shrink-0 select-none items-center justify-center text-aura-muted-foreground transition-colors hover:bg-aura-muted hover:text-aura-surface-foreground active:bg-aura-muted/70 disabled:pointer-events-none disabled:opacity-40 group-[.aura-glass-dc]/number:text-white/70 group-[.aura-glass-dc]/number:hover:bg-white/10";

const Minus = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    className="size-3.5"
  >
    <path d="M5 12h14" />
  </svg>
);
const Plus = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    className="size-3.5"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const Chevron = ({ up }: { up?: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.25}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3"
  >
    <path d={up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
  </svg>
);

function decimalsOf(n: number) {
  const s = String(n);
  if (s.includes("e-")) return Number(s.split("e-")[1] ?? 0);
  return s.split(".")[1]?.length ?? 0;
}

function roundTo(n: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/** Aceita `,` ou `.` como decimal (o último separador vence) e ignora o resto. */
function parseNumber(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  const negative = /^[-−(]/.test(t);
  const cleaned = t.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
  const lastDot = cleaned.lastIndexOf(".");
  const normalized =
    lastDot === -1
      ? cleaned
      : cleaned.slice(0, lastDot).replace(/\./g, "") + "." + cleaned.slice(lastDot + 1);
  if (!normalized || normalized === ".") return null;
  const n = Number(normalized);
  if (Number.isNaN(n)) return null;
  return negative ? -n : n;
}

export interface NumberInputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "step"
    >,
    VariantProps<typeof numberInputVariants> {
  /** Valor controlado (`null` = vazio). */
  value?: number | null;
  /** Valor inicial (não-controlado). */
  defaultValue?: number | null;
  /** Chamado quando o número muda (`null` quando vazio). */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Incremento das setas/botões (padrão 1). PageUp/PageDown usam 10×. */
  step?: number;
  /** Casas decimais (padrão: as do `step`). */
  precision?: number;
  /** Opções de `Intl.NumberFormat` p/ exibir fora do foco (moeda, %, unidade…). */
  formatOptions?: Intl.NumberFormatOptions;
  /** Locale BCP47 da formatação (padrão `pt-BR`). */
  locale?: string;
  /** Layout dos botões: `sides` (− campo +) ou `stacked` (▲▼ à direita). `none` oculta. */
  controls?: "sides" | "stacked" | "none";
  /** Limita ao min/max ao sair do campo (padrão true). */
  clampOnBlur?: boolean;
  /** Marca o campo como inválido. */
  invalid?: boolean;
  incrementLabel?: string;
  decrementLabel?: string;
  /** Classes extras do `<input>` interno (o `className` vai no wrapper). */
  inputClassName?: string;
}

/**
 * NumberInput — campo numérico com −/+ (ou ▲▼), min/max/step, precisão,
 * segurar o botão repete, setas ↑/↓ e PageUp/PageDown, formatação Intl
 * fora do foco e `role="spinbutton"` com aria-valuenow/min/max.
 */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      formatOptions,
      locale = "pt-BR",
      controls = "sides",
      clampOnBlur = true,
      invalid,
      incrementLabel = "Aumentar",
      decrementLabel = "Diminuir",
      variant,
      size,
      className,
      inputClassName,
      disabled,
      readOnly,
      id,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const inputId = id ?? `number-${autoId}`;
    const decimals = precision ?? decimalsOf(step);

    const [internal, setInternal] = React.useState<number | null>(defaultValue);
    const value = valueProp !== undefined ? valueProp : internal;
    const valueRef = React.useRef(value);
    valueRef.current = value;

    /** Texto em edição (null = fora do foco, exibe formatado). */
    const [draft, setDraft] = React.useState<string | null>(null);

    const displayFormat = React.useMemo(
      () =>
        new Intl.NumberFormat(locale, {
          maximumFractionDigits: decimals,
          ...formatOptions
        }),
      [locale, decimals, formatOptions]
    );
    const editFormat = React.useMemo(
      () => new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }),
      [locale]
    );

    const clamp = React.useCallback(
      (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n)),
      [min, max]
    );

    const commit = React.useCallback(
      (next: number | null) => {
        if (next === valueRef.current) return;
        valueRef.current = next;
        if (valueProp === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [valueProp, onValueChange]
    );

    const stepBy = React.useCallback(
      (delta: number) => {
        const base = valueRef.current ?? (delta > 0 ? (min ?? 0) - delta : (max ?? 0) - delta);
        const next = clamp(roundTo(base + delta, decimals));
        commit(next);
        setDraft((d) => (d === null ? d : editFormat.format(next)));
      },
      [clamp, commit, decimals, editFormat, min, max]
    );

    // Segurar o botão: 1 passo imediato, repetição após 400ms.
    const repeatRef = React.useRef<{ timeout?: number; interval?: number }>({});
    const stopRepeat = React.useCallback(() => {
      window.clearTimeout(repeatRef.current.timeout);
      window.clearInterval(repeatRef.current.interval);
      repeatRef.current = {};
    }, []);
    React.useEffect(() => stopRepeat, [stopRepeat]);

    const startRepeat = (delta: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0 || disabled || readOnly) return;
      e.preventDefault();
      stepBy(delta);
      stopRepeat();
      repeatRef.current.timeout = window.setTimeout(() => {
        repeatRef.current.interval = window.setInterval(() => stepBy(delta), 60);
      }, 400);
    };

    const finalize = () => {
      const current = valueRef.current;
      if (current === null) {
        setDraft((d) => (d === null ? d : ""));
        return;
      }
      const next = roundTo(clampOnBlur ? clamp(current) : current, decimals);
      commit(next);
      setDraft((d) => (d === null ? d : editFormat.format(next)));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || readOnly) return;
      const big = step * 10;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          stepBy(e.shiftKey ? big : step);
          break;
        case "ArrowDown":
          e.preventDefault();
          stepBy(-(e.shiftKey ? big : step));
          break;
        case "PageUp":
          e.preventDefault();
          stepBy(big);
          break;
        case "PageDown":
          e.preventDefault();
          stepBy(-big);
          break;
        case "Home":
          if (min !== undefined) {
            e.preventDefault();
            commit(min);
            setDraft(editFormat.format(min));
          }
          break;
        case "End":
          if (max !== undefined) {
            e.preventDefault();
            commit(max);
            setDraft(editFormat.format(max));
          }
          break;
        case "Enter":
          finalize();
          break;
      }
    };

    const text =
      draft ?? (value === null || value === undefined ? "" : displayFormat.format(value));
    const atMin = value !== null && min !== undefined && value <= min;
    const atMax = value !== null && max !== undefined && value >= max;
    const buttonsDisabled = disabled || readOnly;

    const decButton = (
      <button
        type="button"
        tabIndex={-1}
        aria-label={decrementLabel}
        aria-controls={inputId}
        disabled={buttonsDisabled || atMin}
        onPointerDown={startRepeat(-step)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        className={cn(
          stepButton,
          controls === "sides"
            ? "aspect-square h-full border-r border-aura-border/70 group-[.aura-glass-dc]/number:border-white/10"
            : "flex-1 px-2"
        )}
      >
        {controls === "sides" ? <Minus /> : <Chevron />}
      </button>
    );
    const incButton = (
      <button
        type="button"
        tabIndex={-1}
        aria-label={incrementLabel}
        aria-controls={inputId}
        disabled={buttonsDisabled || atMax}
        onPointerDown={startRepeat(step)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        className={cn(
          stepButton,
          controls === "sides"
            ? "aspect-square h-full border-l border-aura-border/70 group-[.aura-glass-dc]/number:border-white/10"
            : "flex-1 border-b border-aura-border/70 px-2 group-[.aura-glass-dc]/number:border-white/10"
        )}
      >
        {controls === "sides" ? <Plus /> : <Chevron up />}
      </button>
    );

    return (
      <div
        data-slot="number-input"
        className={cn(numberInputVariants({ variant, size }), className)}
      >
        {controls === "sides" && decButton}
        <input
          ref={ref}
          id={inputId}
          type="text"
          role="spinbutton"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={value === null ? undefined : displayFormat.format(value)}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={text}
          onFocus={(e) => {
            setDraft(value === null ? "" : editFormat.format(value));
            onFocus?.(e);
          }}
          onBlur={(e) => {
            finalize();
            setDraft(null);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            commit(parseNumber(e.target.value));
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-3 tabular-nums outline-none placeholder:text-aura-muted-foreground disabled:cursor-not-allowed",
            controls === "sides" && "text-center",
            inputClassName
          )}
          {...props}
        />
        {controls === "sides" && incButton}
        {controls === "stacked" && (
          <div className="flex w-8 shrink-0 flex-col border-l border-aura-border/70 group-[.aura-glass-dc]/number:border-white/10">
            {incButton}
            {decButton}
          </div>
        )}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput, numberInputVariants };
