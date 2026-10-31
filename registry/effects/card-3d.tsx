"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type Card3DProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Inclinação máxima em graus (padrão 12, espelha `--aura-tilt-max`). */
  maxTilt?: number;
  /** Escala aplicada durante o hover (padrão 1.02; 1 desliga o zoom). */
  scale?: number;
  /** Perspectiva CSS (padrão `var(--aura-perspective)`). */
  perspective?: string;
  /** Brilho especular que segue o cursor (padrão true). */
  glare?: boolean;
  /** Desliga o tilt mantendo o layout (padrão false). */
  disabled?: boolean;
};

/**
 * Tilt 3D com glare que segue o cursor.
 *
 * Detalhes de implementação:
 * - O movimento escreve `transform` inline via rAF (resposta 1:1, sem arrasto
 *   elástico) e publica a posição do cursor em `--aura-light-x/y`, que é o que
 *   move o glare. Não usa a classe `aura-tilt`: o `:hover` dela brigava com o
 *   transform inline e causava um salto ao sair do card.
 * - Ao sair, o retorno usa `var(--aura-dur)` + `var(--aura-ease-spring)`.
 * - Handlers `onPointerMove`/`onPointerLeave` do usuário são preservados (antes
 *   eram sobrescritos ou sobrescreviam o tilt, dependendo da ordem).
 * - `style.transition` do usuário é assumido pelo tilt durante a interação.
 * - Degrada para estático com `prefers-reduced-motion` ou `disabled`.
 */
export function Card3D({
  className,
  children,
  style,
  maxTilt = 12,
  scale = 1.02,
  perspective = "var(--aura-perspective)",
  glare = true,
  disabled = false,
  onPointerMove,
  onPointerLeave,
  ...props
}: Card3DProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<number>(0);
  const interactive = !reduced && !disabled;

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

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
      el.style.transform = `perspective(${perspective}) rotateX(${((0.5 - py) * maxTilt).toFixed(2)}deg) rotateY(${((px - 0.5) * maxTilt).toFixed(2)}deg) scale(${scale})`;
      if (glare) {
        el.style.setProperty("--aura-light-x", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--aura-light-y", `${(py * 100).toFixed(1)}%`);
      }
    });
  };

  const handleLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transition = "transform var(--aura-dur) var(--aura-ease-spring)";
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={cn("aura-surface relative overflow-hidden p-6 will-change-transform", className)}
      style={{ transformStyle: "preserve-3d", ...style }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at var(--aura-light-x) var(--aura-light-y), hsl(var(--aura-primary) / 0.25), transparent 55%)"
          }}
        />
      )}
      <div className="relative z-10" style={{ transform: "translateZ(calc(var(--aura-depth) * 6))" }}>
        {children}
      </div>
    </div>
  );
}
