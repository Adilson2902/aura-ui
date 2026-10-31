"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes de cada casa do OTP — mesmas famílias do Input. */
const inputOTPSlotVariants = cva(
  "text-center font-semibold tabular-nums caret-aura-primary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-aura-destructive aria-[invalid=true]:focus-visible:ring-aura-destructive/40",
  {
    variants: {
      variant: {
        default:
          "rounded-[calc(var(--aura-radius)-2px)] border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 focus-visible:border-aura-primary focus-visible:ring-aura-ring/40 data-[filled=true]:border-aura-primary/50",
        soft: "rounded-[calc(var(--aura-radius)-2px)] border border-transparent bg-aura-muted text-aura-surface-foreground focus-visible:bg-aura-surface focus-visible:ring-aura-ring/50",
        glass:
          "aura-glass-dc rounded-[calc(var(--aura-radius)-2px)] border border-white/15 text-white focus-visible:border-aura-primary focus-visible:ring-aura-primary/40 data-[filled=true]:border-white/35",
        "3d": "rounded-[calc(var(--aura-radius)-2px)] border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel focus-visible:translate-y-[2px] focus-visible:shadow-[0_1px_0_0_hsl(var(--aura-border))] focus-visible:ring-aura-ring"
      },
      size: {
        sm: "h-9 w-8 text-sm",
        md: "h-11 w-10 text-lg",
        lg: "h-14 w-12 text-2xl"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

type OTPPattern = "numeric" | "alphanumeric" | RegExp;

const PATTERNS: Record<"numeric" | "alphanumeric", RegExp> = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/
};

export interface InputOTPProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof inputOTPSlotVariants> {
  /** Quantidade de casas (padrão 6). */
  length?: number;
  /** Valor controlado. */
  value?: string;
  /** Valor inicial (não-controlado). */
  defaultValue?: string;
  /** Chamado a cada alteração. */
  onChange?: (value: string) => void;
  /** Chamado quando todas as casas são preenchidas. */
  onComplete?: (value: string) => void;
  /** Caracteres aceitos: `numeric` (padrão), `alphanumeric` ou regex de 1 caractere. */
  pattern?: OTPPattern;
  /** Oculta os caracteres (como senha). */
  mask?: boolean;
  /** Insere um separador a cada N casas (ex.: 3 => `123-456`). */
  groupSize?: number;
  /** Separador customizado (padrão: traço). */
  separator?: React.ReactNode;
  /** Nome do campo — envia o código num `<input type="hidden">`. */
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Marca todas as casas como inválidas. */
  invalid?: boolean;
  /** Rótulo acessível de cada casa. */
  getSlotLabel?: (index: number, length: number) => string;
  /** Classes extras de cada casa. */
  slotClassName?: string;
}

/**
 * InputOTP — código de verificação em casas separadas. Colar distribui o código,
 * Backspace volta, setas navegam e o 1º campo usa `autocomplete="one-time-code"`.
 */
const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      length = 6,
      value: valueProp,
      defaultValue = "",
      onChange,
      onComplete,
      pattern = "numeric",
      mask = false,
      groupSize,
      separator,
      name,
      disabled,
      autoFocus,
      invalid,
      getSlotLabel = (i, n) => `Dígito ${i + 1} de ${n}`,
      slotClassName,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const regex = typeof pattern === "string" ? PATTERNS[pattern] : pattern;
    const sanitize = React.useCallback(
      (raw: string) =>
        raw
          .split("")
          .filter((c) => regex.test(c))
          .join(""),
      [regex]
    );

    const [internal, setInternal] = React.useState(() => sanitize(defaultValue).slice(0, length));
    const value = (valueProp !== undefined ? sanitize(valueProp) : internal).slice(0, length);
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);
    // Valor mais recente: o foco muda dentro do mesmo evento, antes do re-render.
    const valueRef = React.useRef(value);
    valueRef.current = value;

    const focusAt = (index: number) => {
      const i = Math.max(0, Math.min(index, length - 1));
      const el = inputsRef.current[i];
      if (el) {
        el.focus();
        el.select();
      }
    };

    const commit = (next: string) => {
      const clean = next.slice(0, length);
      if (clean === valueRef.current) return;
      valueRef.current = clean;
      if (valueProp === undefined) setInternal(clean);
      onChange?.(clean);
      if (clean.length === length) onComplete?.(clean);
    };

    /** Escreve `chars` a partir da casa `index` (sem deixar buracos). */
    const writeAt = (index: number, chars: string) => {
      if (!chars) return;
      const current = valueRef.current;
      const start = Math.min(index, current.length);
      const next = (current.slice(0, start) + chars + current.slice(start + chars.length)).slice(
        0,
        length
      );
      commit(next);
      focusAt(start + chars.length);
    };

    const removeAt = (index: number) => {
      const current = valueRef.current;
      commit(current.slice(0, index) + current.slice(index + 1));
    };

    const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (key.length === 1) {
        e.preventDefault();
        if (regex.test(key)) writeAt(index, key);
        return;
      }

      switch (key) {
        case "Backspace":
          e.preventDefault();
          if (index < value.length) {
            removeAt(index);
          } else if (index > 0) {
            removeAt(index - 1);
            focusAt(index - 1);
          }
          break;
        case "Delete":
          e.preventDefault();
          if (index < value.length) removeAt(index);
          break;
        case "ArrowLeft":
          e.preventDefault();
          focusAt(index - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          focusAt(Math.min(index + 1, value.length));
          break;
        case "Home":
          e.preventDefault();
          focusAt(0);
          break;
        case "End":
          e.preventDefault();
          focusAt(value.length);
          break;
      }
    };

    /** Fallback p/ autofill do SO e teclados móveis (keydown com key "Unidentified"). */
    const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const chars = sanitize(e.target.value);
      if (chars.length >= length) {
        commit(chars.slice(0, length));
        focusAt(length - 1);
        return;
      }
      const current = value[index] ?? "";
      const typed =
        current && chars.length > 1 && chars.startsWith(current) ? chars.slice(1) : chars;
      if (typed) writeAt(index, typed);
    };

    const handlePaste = (index: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const chars = sanitize(e.clipboardData.getData("text"));
      if (!chars) return;
      // Código completo colado em qualquer casa => substitui tudo.
      if (chars.length >= length) {
        commit(chars.slice(0, length));
        focusAt(length - 1);
      } else {
        writeAt(index, chars);
      }
    };

    const handleFocus = (index: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      // Não deixa pular casas vazias: redireciona p/ a primeira livre.
      const filled = valueRef.current.length;
      if (index > filled) {
        focusAt(filled);
        return;
      }
      e.target.select();
    };

    const slots: React.ReactNode[] = [];
    for (let i = 0; i < length; i++) {
      if (groupSize && i > 0 && i % groupSize === 0) {
        slots.push(
          <div key={`sep-${i}`} role="separator" aria-hidden className="flex items-center">
            {separator ?? <span className="h-0.5 w-3 rounded-full bg-aura-border" />}
          </div>
        );
      }
      const char = value[i] ?? "";
      slots.push(
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type={mask ? "password" : "text"}
          inputMode={pattern === "numeric" ? "numeric" : "text"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          value={char}
          aria-label={getSlotLabel(i, length)}
          aria-invalid={invalid || undefined}
          data-filled={char ? true : undefined}
          data-slot="input-otp-slot"
          className={cn(inputOTPSlotVariants({ variant, size }), slotClassName)}
          onKeyDown={handleKeyDown(i)}
          onChange={handleChange(i)}
          onPaste={handlePaste(i)}
          onFocus={handleFocus(i)}
        />
      );
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Código de verificação"
        data-slot="input-otp"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {slots}
        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  }
);
InputOTP.displayName = "InputOTP";

export { InputOTP, inputOTPSlotVariants };
