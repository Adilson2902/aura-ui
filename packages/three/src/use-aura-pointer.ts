"use client";

import * as React from "react";

export type AuraPointer = {
  /** -1 .. 1 no eixo X (0 = centro). */
  x: number;
  /** -1 .. 1 no eixo Y (0 = centro). */
  y: number;
};

/**
 * Posição normalizada do ponteiro na janela, atualizada via rAF.
 * SSR-safe: começa em {0,0} e só liga listeners no client.
 */
export function useAuraPointer(): AuraPointer {
  const [pt, setPt] = React.useState<AuraPointer>({ x: 0, y: 0 });
  const frame = React.useRef(0);

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        setPt({ x, y });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return pt;
}
