"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type NumberTickerProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Valor final exibido. */
  value: number;
  /** Valor inicial da contagem (padrão 0). */
  from?: number;
  /** Duração da contagem, em ms (padrão 1200; <= 0 exibe o final direto). */
  duration?: number;
  /** Casas decimais (padrão 0). */
  decimals?: number;
  /** Locale do `Intl.NumberFormat` (padrão "pt-BR"). */
  locale?: string;
  /** Prefixo (ex.: "R$ "). */
  prefix?: string;
  /** Sufixo (ex.: "%", "+"). */
  suffix?: string;
};

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Contagem animada de `from` até `value` com easing exponencial.
 *
 * A contagem dispara ao entrar na viewport (threshold 40%, uma vez) e
 * re-anima quando `value` muda. Formatação via `Intl.NumberFormat` com
 * `tabular-nums` para a largura dos dígitos não dançar. Com
 * `prefers-reduced-motion`, sem `IntersectionObserver` ou `duration <= 0`,
 * exibe o valor final direto. Todo timer/observer tem cleanup no unmount.
 */
export function NumberTicker({
  className,
  value,
  from = 0,
  duration = 1200,
  decimals = 0,
  locale = "pt-BR",
  prefix = "",
  suffix = "",
  ...props
}: NumberTickerProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(from);

  const format = React.useCallback(
    (n: number) =>
      `${prefix}${new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(n)}${suffix}`,
    [locale, decimals, prefix, suffix]
  );

  React.useEffect(() => {
    if (reduced || duration <= 0 || typeof window === "undefined") {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const p = Math.min((now - start) / duration, 1);
      setDisplay(from + (value - from) * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const el = ref.current;
    if (typeof IntersectionObserver === "undefined" || !el) {
      setDisplay(from);
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        io.disconnect();
        setDisplay(from);
        start = null;
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, from, duration, reduced]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} {...props}>
      {format(display)}
    </span>
  );
}
