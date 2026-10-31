"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Duração de um ciclo em segundos (padrão 30). */
  duration?: number;
  /** Inverte o sentido — direita em vez de esquerda (padrão false). */
  reverse?: boolean;
  /** Pausa no hover/focus (padrão true). */
  pauseOnHover?: boolean;
  /** Espaço entre itens, qualquer CSS length (padrão "2rem"). */
  gap?: string;
  /** Fade nas bordas via mask-image (padrão true). */
  fadeEdges?: boolean;
};

/**
 * Letreiro infinito (logos, depoimentos, cards).
 *
 * O trilho renderiza os filhos 2x (a segunda metade é `aria-hidden` para não
 * duplicar a leitura em leitores de tela) e o keyframe `aura-marquee`
 * desloca -50%, fechando o loop sem snap. O espaçamento usa `margin-right`
 * por item em vez de `flex gap`: com gap, a junção das metades quebra a
 * simetria e o loop dá um salto a cada ciclo.
 *
 * Com `prefers-reduced-motion`, vira uma faixa estática com scroll horizontal
 * manual. `pauseOnHover` também pausa com foco via teclado (`focus-within`).
 */
export function Marquee({
  className,
  children,
  style,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
  gap = "2rem",
  fadeEdges = true,
  ...props
}: MarqueeProps) {
  const reduced = useReducedMotion();

  const items = React.useMemo(() => React.Children.toArray(children), [children]);

  const renderRow = (hidden: boolean) =>
    items.map((child, i) => (
      <div
        key={hidden ? `marquee-clone-${i}` : `marquee-item-${i}`}
        aria-hidden={hidden || undefined}
        className="shrink-0"
        style={{ marginRight: gap }}
      >
        {child}
      </div>
    ));

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)} style={style} {...props}>
        <div className="flex w-max">{renderRow(false)}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden",
        fadeEdges &&
          "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
      style={style}
      {...props}
    >
      <div
        className={cn(
          "flex w-max",
          pauseOnHover &&
            "hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        )}
        style={{
          animation: `aura-marquee ${duration}s linear infinite${reverse ? " reverse" : ""}`
        }}
      >
        {renderRow(false)}
        {renderRow(true)}
      </div>
    </div>
  );
}
