"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type LayeredCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Inclinação máxima em graus (padrão 10). */
  maxTilt?: number;
  /** Profundidade base em px para o conteúdo (padrão 24). */
  depth?: number;
  /** Mostra o overlay de especular (padrão true). */
  glare?: boolean;
  /** Desativa a interação 3D (padrão false). */
  disabled?: boolean;
};

/**
 * Card em camadas com parallax 3D real (`translateZ` por camada).
 *
 * Diferente do `Card3D` (que gira o card inteiro), o `LayeredCard` mantém o
 * card relativamente estável e empurra os filhos `[data-depth]` em Z conforme
 * o cursor, criando a sensação de conteúdo flutuando dentro de um volume.
 *
 * Uso:
 * ```tsx
 * <LayeredCard>
 *   <div data-depth="1">fundo</div>
 *   <div data-depth="3">meio</div>
 *   <div data-depth="6">topo</div>
 * </LayeredCard>
 * ```
 *
 * Sem filhos `[data-depth]`, o conteúdo interno recebe `depth` padrão.
 * Degrada para estático com `prefers-reduced-motion` ou `disabled`.
 */
export function LayeredCard({
  className,
  children,
  style,
  maxTilt = 10,
  depth = 24,
  glare = true,
  disabled = false,
  onPointerMove,
  onPointerLeave,
  ...props
}: LayeredCardProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);
  const interactive = !reduced && !disabled;

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const applyDepth = (el: HTMLElement, px: number, py: number, active: boolean) => {
    const nodes = el.querySelectorAll<HTMLElement>("[data-depth]");
    const targets = nodes.length > 0 ? nodes : [el.querySelector<HTMLElement>("[data-layer-root]")].filter(Boolean) as HTMLElement[];
    if (targets.length === 0) {
      const root = el.firstElementChild as HTMLElement | null;
      if (root) {
        root.style.transform = active
          ? `translateZ(${(depth * 0.4).toFixed(1)}px) translate3d(${((px - 0.5) * 6).toFixed(2)}px, ${((py - 0.5) * 6).toFixed(2)}px, 0)`
          : "";
      }
      return;
    }
    for (const node of targets) {
      const factor = Number(node.dataset.depth ?? 1);
      const z = depth * factor * 0.25;
      const x = (px - 0.5) * 8 * factor;
      const y = (py - 0.5) * 8 * factor;
      node.style.transform = active
        ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(1)}px)`
        : "";
      node.style.transition = active
        ? "transform 60ms linear"
        : "transform var(--aura-dur) var(--aura-ease-spring)";
    }
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const el = ref.current;
    if (!interactive || !el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transition = "transform 60ms linear";
      el.style.transform = `perspective(var(--aura-perspective)) rotateX(${((0.5 - py) * maxTilt).toFixed(2)}deg) rotateY(${((px - 0.5) * maxTilt).toFixed(2)}deg)`;
      if (glare) {
        el.style.setProperty("--aura-light-x", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--aura-light-y", `${(py * 100).toFixed(1)}%`);
      }
      applyDepth(el, px, py, true);
    });
  };

  const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transition = "transform var(--aura-dur) var(--aura-ease-spring)";
    el.style.transform = "";
    applyDepth(el, 0.5, 0.5, false);
  };

  return (
    <div
      ref={ref}
      className={cn("aura-surface aura-scene relative overflow-hidden p-6", className)}
      style={{ transformStyle: "preserve-3d", ...style }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {glare && (
        <div
          aria-hidden
          className="aura-glass-specular pointer-events-none absolute inset-0"
        />
      )}
      <div data-layer-root className="relative z-10">
        {children}
      </div>
    </div>
  );
}
