"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type HeroParallaxProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Cards/grid de produtos que farão parallax. */
  children: React.ReactNode;
  /** Deslocamento máximo em px no scroll (padrão 80). */
  range?: number;
  /** Velocidade por linha (0 = parado, 1 = acompanha o scroll). */
  speed?: number;
};

/**
 * Hero com parallax 3D no scroll (estilo Aceternity `HeroParallax`).
 *
 * O contêiner escuta `scroll` e aplica `translate3d` + leve `rotateX` em cada
 * linha `[data-parallax-row]`, criando profundidade de diorama. Sem filhos
 * anotados, aplica o efeito no primeiro nível de filhos.
 *
 * SSR-safe: o primeiro paint é estático; o parallax só liga no client.
 * Com reduced-motion, não transforma nada.
 */
export function HeroParallax({
  className,
  children,
  style,
  range = 80,
  speed = 0.35,
  ...props
}: HeroParallaxProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  React.useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // -1 (abaixo) .. 0 (centro) .. 1 (acima)
      const progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
      const rows = el.querySelectorAll<HTMLElement>("[data-parallax-row]");
      const targets =
        rows.length > 0 ? rows : (Array.from(el.children) as HTMLElement[]);

      targets.forEach((node, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const depth = Number(node.dataset.parallaxSpeed ?? speed);
        const y = -progress * range * depth * dir;
        const rot = progress * 6 * depth;
        node.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotateX(${rot.toFixed(2)}deg)`;
      });
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, range, speed]);

  return (
    <div
      ref={ref}
      className={cn("aura-scene relative", className)}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
