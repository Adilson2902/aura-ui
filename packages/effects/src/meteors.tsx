"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

export type MeteorsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Quantidade de meteoros (padrão 20). */
  count?: number;
  /** Duração base de cada meteor em segundos (padrão 3). */
  duration?: number;
};

type MeteorSeed = {
  left: string;
  delay: string;
  duration: string;
  width: string;
  opacity: number;
};

/**
 * Chuva de meteoros em background (Magic UI / Aceternity).
 *
 * Posições são calculadas uma vez no mount a partir de um PRNG determinístico
 * (sem Math.random no render) para evitar mismatch de hidratação — os seeds
 * são estáveis entre server e client. Com reduced-motion, não renderiza nada
 * (o fundo continua legível). `aria-hidden` sempre.
 */
export function Meteors({
  className,
  count = 20,
  duration = 3,
  ...props
}: MeteorsProps) {
  const reduced = useReducedMotion();

  const seeds = React.useMemo<MeteorSeed[]>(() => {
    // LCG simples e determinístico — mesmo resultado no server e no client.
    let s = 0x2f6e2b1;
    const next = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
    return Array.from({ length: count }, () => ({
      left: `${(next() * 100).toFixed(2)}%`,
      delay: `${(next() * duration * 2).toFixed(2)}s`,
      duration: `${(duration * (0.7 + next() * 0.8)).toFixed(2)}s`,
      width: `${(30 + next() * 80).toFixed(0)}px`,
      opacity: 0.4 + next() * 0.5
    }));
  }, [count, duration]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      {seeds.map((seed, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: seed.left,
            width: seed.width,
            height: "1.5px",
            opacity: seed.opacity,
            background:
              "linear-gradient(to right, hsl(var(--aura-primary)), transparent)",
            transform: "rotate(215deg)",
            animation: `aura-meteor ${seed.duration} linear ${seed.delay} infinite`
          }}
        />
      ))}
    </div>
  );
}
