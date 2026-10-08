"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type BlurFadeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Atraso antes de revelar, em ms — use para stagger (padrão 0). */
  delay?: number;
  /** Duração da transição, em ms (padrão 600). */
  duration?: number;
  /** Deslocamento vertical inicial, em px (padrão 12). */
  offset?: number;
  /** Blur inicial, em px (padrão 6). */
  blur?: number;
  /** Revela uma vez e para de observar (padrão true). */
  once?: boolean;
};

/**
 * Revela o conteúdo ao entrar na viewport (opacity + translateY + blur).
 *
 * Usa `IntersectionObserver` (threshold 15%) com transição em
 * `var(--aura-ease-spring)`. `delay` permite cascata (stagger) sem JS extra.
 * Revela imediatamente com `prefers-reduced-motion` ou sem suporte a
 * IntersectionObserver. Client-only por natureza: o primeiro render é oculto,
 * então não use para conteúdo acima da dobra que precisa aparecer sem JS.
 */
export function BlurFade({
  className,
  children,
  style,
  delay = 0,
  duration = 600,
  offset = 12,
  blur = 6,
  once = true,
  ...props
}: BlurFadeProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    setVisible(false);
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, once]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${offset}px)`,
        filter: visible ? "blur(0)" : `blur(${blur}px)`,
        willChange: visible ? undefined : "opacity, transform, filter",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "var(--aura-ease-spring)",
        transitionDelay: `${delay}ms`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
