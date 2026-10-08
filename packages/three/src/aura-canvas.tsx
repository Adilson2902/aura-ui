"use client";

import * as React from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

export type AuraCanvasProps = Omit<CanvasProps, "children"> & {
  children?: React.ReactNode;
  /** Desativa o canvas (ex.: prefers-reduced-motion) e renderiza fallback. */
  disabled?: boolean;
  /** Nós renderizados quando `disabled` (layout estático). */
  fallback?: React.ReactNode;
  /** dpr máximo (padrão 1.5 — segura GPUs fracas). */
  maxDpr?: number;
};

/**
 * Canvas R3F com defaults Aura: dpr limitado, antialias, tom de fundo
 * transparente e fallback estático para reduced-motion / dispositivos
 * sem WebGL.
 *
 * SSR-safe: o `Canvas` do R3F só monta no client. Se `disabled`, mostra
 * `fallback` (ou null) sem criar contexto WebGL.
 */
export function AuraCanvas({
  children,
  disabled = false,
  fallback = null,
  maxDpr = 1.5,
  dpr,
  gl,
  ...props
}: AuraCanvasProps) {
  const [supported, setSupported] = React.useState(true);

  React.useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      setSupported(ok);
    } catch {
      setSupported(false);
    }
  }, []);

  if (disabled || !supported) return <>{fallback}</>;

  return (
    <Canvas
      dpr={dpr ?? [1, maxDpr]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", ...gl }}
      {...props}
    >
      {children}
    </Canvas>
  );
}
