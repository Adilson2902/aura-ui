"use client";

import * as React from "react";
import { AuraCanvas } from "./aura-canvas";
import { FloatingMesh, type FloatingMeshProps } from "./floating-mesh";
import { ParticleField, type ParticleFieldProps } from "./particle-field";
import { useAuraPointer } from "./use-aura-pointer";
import { useReducedMotion } from "aura-ui-core/client";

export type HeroSceneProps = {
  /** Elementos 3D flutuantes (configs) — até 3 por padrão. */
  meshes?: FloatingMeshProps[];
  /** Config do campo de partículas (false desliga). */
  particles?: ParticleFieldProps | false;
  /** Altura do canvas (padrão "420px"). */
  height?: string;
  /** Classe do wrapper. */
  className?: string;
  /** Desativa a cena (reduced-motion / perf). */
  disabled?: boolean;
  /** Conteúdo DOM sobreposto ao canvas (CTA, título). */
  children?: React.ReactNode;
};

/**
 * Cena hero pronta: 3 meshes flutuantes + partículas + luzes brand,
 * com a câmera reagindo suavemente ao ponteiro.
 *
 * É o "wow" do Aceternity empacotado — se você só quer um hero 3D,
 * não precisa montar R3F na mão. Com `prefers-reduced-motion`, renderiza
 * o `children` sobre um fundo com gradiente e não cria WebGL.
 */
export function HeroScene({
  meshes = [
    { shape: "icosahedron", position: [-1.6, 0.2, 0], color: "#7857FF", emissive: "#2B85FF" },
    { shape: "torus", position: [1.4, -0.3, -0.8], color: "#FF5B79", emissive: "#FF9900", spin: 0.35 },
    { shape: "sphere", position: [0.2, 1.1, -1.2], color: "#00F2FE", emissive: "#4FACFE", scale: 0.7 }
  ],
  particles = { count: 320, radius: 5, color: "#4FACFE" },
  height = "420px",
  className,
  disabled = false,
  children
}: HeroSceneProps) {
  const reduced = useReducedMotion();
  const off = disabled || reduced;
  const pointer = useAuraPointer();

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: "var(--aura-radius)"
      }}
    >
      {off ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--aura-gradient-aurora)",
            opacity: 0.35
          }}
        />
      ) : (
        <AuraCanvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 8]} intensity={1.1} color="#ffffff" />
          <pointLight position={[-6, -2, 4]} intensity={0.6} color="#7857FF" />
          <pointLight position={[5, -3, 2]} intensity={0.45} color="#00F2FE" />

          <group
            rotation={[
              (pointer.y ?? 0) * 0.12,
              (pointer.x ?? 0) * 0.18,
              0
            ]}
          >
            {meshes.map((m, i) => (
              <FloatingMesh key={i} {...m} />
            ))}
            {particles !== false && <ParticleField {...(particles as ParticleFieldProps)} />}
          </group>
        </AuraCanvas>
      )}

      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}
