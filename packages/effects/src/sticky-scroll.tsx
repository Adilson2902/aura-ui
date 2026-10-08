"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type StickyScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Conteúdo da coluna sticky (título, copy, CTA). */
  stickyContent?: React.ReactNode;
  /** Blocos roláveis que trocam o destaque (data-index). */
  children?: React.ReactNode;
  /** Altura da seção sticky (padrão "60vh"). */
  stickyHeight?: string;
  /** Callback quando o bloco ativo muda. */
  onActiveChange?: (index: number) => void;
};

/**
 * Seção sticky com troca de destaque por scroll (Aceternity `StickyScroll`).
 *
 * A coluna esquerda fica `position: sticky`; os blocos à direita disparam
 * `IntersectionObserver` e elevam o bloco ativo em `translateZ`, rebaixando
 * os demais. Com reduced-motion, só muda opacidade/borda, sem Z.
 */
export function StickyScroll({
  className,
  stickyContent,
  children,
  stickyHeight = "60vh",
  onActiveChange,
  ...props
}: StickyScrollProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const blockRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const nodes = blockRefs.current.filter(Boolean) as HTMLElement[];
    if (nodes.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setActive(idx);
          onActiveChange?.(idx);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [onActiveChange, children]);

  const items = React.Children.toArray(children);

  return (
    <div
      className={cn("grid gap-10 lg:grid-cols-2", className)}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      <div
        className="aura-layer flex items-start"
        style={{ position: "sticky", top: "15vh", height: stickyHeight }}
      >
        {stickyContent}
      </div>

      <div className="flex flex-col gap-16 py-20">
        {items.map((child, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="aura-surface transition-all duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: reduced
                ? undefined
                : `translateZ(${active === i ? 24 : 0}px)`,
              opacity: active === i || reduced ? 1 : 0.55,
              boxShadow:
                active === i ? "var(--aura-elevation-3)" : "var(--aura-elevation-1)"
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
