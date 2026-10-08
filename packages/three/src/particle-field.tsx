"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export type ParticleFieldProps = {
  /** Quantidade de partículas (padrão 400). */
  count?: number;
  /** Raio da nuvem (padrão 4). */
  radius?: number;
  /** Cor das partículas. */
  color?: string;
  /** Tamanho do ponto (padrão 0.03). */
  size?: number;
  /** Velocidade de deriva (padrão 0.05). */
  drift?: number;
  disabled?: boolean;
};

/**
 * Campo de partículas (Points) com deriva lenta — background de heros.
 * BufferGeometry alocado uma vez; `useFrame` só mexe na rotação do objeto.
 */
export function ParticleField({
  count = 400,
  radius = 4,
  color = "#00F2FE",
  size = 0.03,
  drift = 0.05,
  disabled = false
}: ParticleFieldProps) {
  const ref = React.useRef<THREE.Points>(null);

  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    // determinístico (sem Math.random) para SSR/hydration estáveis
    let s = 0x9e3779b9;
    const next = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
    for (let i = 0; i < count; i++) {
      const u = next();
      const v = next();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.55 + next() * 0.45);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (disabled || !ref.current) return;
    ref.current.rotation.y += delta * drift;
    ref.current.rotation.x += delta * drift * 0.35;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
