"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type FloatingMeshProps = {
  /** Geometria: "box" | "sphere" | "torus" | "icosahedron". */
  shape?: "box" | "sphere" | "torus" | "icosahedron";
  /** Cor base (CSS color). */
  color?: string;
  /** Cor do wireframe / emissivo. */
  emissive?: string;
  /** Escala uniforme (padrão 1). */
  scale?: number;
  /** Velocidade de rotação em rad/s (padrão 0.25). */
  spin?: number;
  /** Amplitude da flutuação em unidades de mundo (padrão 0.15). */
  float?: number;
  /** Posição inicial [x,y,z]. */
  position?: [number, number, number];
  /** Desliga animação (reduced-motion). */
  disabled?: boolean;
  children?: React.ReactNode;
};

/**
 * Mesh flutuante com rotação suave — bloco de construção de heros 3D.
 * Anima só `rotation` e `position` (sem alocar por frame).
 */
export function FloatingMesh({
  shape = "icosahedron",
  color = "#7857FF",
  emissive = "#2B85FF",
  scale = 1,
  spin = 0.25,
  float = 0.15,
  position = [0, 0, 0],
  disabled = false,
  children
}: FloatingMeshProps) {
  const ref = React.useRef<THREE.Mesh>(null);
  const t0 = React.useRef(0);

  useFrame((_, delta) => {
    if (disabled || !ref.current) return;
    t0.current += delta;
    ref.current.rotation.x += delta * spin * 0.6;
    ref.current.rotation.y += delta * spin;
    ref.current.position.y = position[1] + Math.sin(t0.current * 1.2) * float;
  });

  const geometry =
    shape === "box" ? (
      <boxGeometry args={[1, 1, 1]} />
    ) : shape === "sphere" ? (
      <sphereGeometry args={[0.7, 32, 32]} />
    ) : shape === "torus" ? (
      <torusGeometry args={[0.7, 0.28, 24, 64]} />
    ) : (
      <icosahedronGeometry args={[0.85, 1]} />
    );

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.35}
        metalness={0.45}
        roughness={0.35}
      />
      {children}
    </mesh>
  );
}
