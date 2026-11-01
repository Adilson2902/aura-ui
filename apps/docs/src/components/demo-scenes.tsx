"use client";

import { useEffect, useState } from "react";
import { AuraCanvas, FloatingMesh, HeroScene, ParticleField } from "aura-ui-three";
import "@react-three/fiber";
import styles from "./demo-showcase.module.css";

export function DemoHeroScene() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className={styles.heroVisual} data-demo-ready={ready ? "true" : "false"}>
      <div className={styles.heroCanvas} aria-hidden="true">
        <HeroScene height="100%" />
      </div>
      <div className={styles.heroCaption}>
        <p>HeroScene</p>
        <p>Meshes, luzes e partículas que reagem ao ponteiro.</p>
      </div>
    </div>
  );
}

export function DemoParticleScene() {
  return (
    <div className={styles.particleFrame}>
      <div className={styles.particleCanvas} aria-hidden="true">
        <AuraCanvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 8]} intensity={1.15} />
          <pointLight position={[-4, -1, 3]} intensity={0.45} color="#137353" />
          <FloatingMesh
            shape="torus"
            color="#137353"
            emissive="#0b3d2e"
            position={[-1.25, 0.15, 0]}
          />
          <FloatingMesh
            shape="icosahedron"
            color="#8fd7b8"
            emissive="#137353"
            position={[1.35, -0.15, -0.4]}
            scale={0.85}
          />
          <ParticleField count={260} radius={4.2} color="#137353" />
        </AuraCanvas>
      </div>
      <p className={styles.particleCaption}>
        AuraCanvas com FloatingMesh e ParticleField — WebGL opcional, separado dos efeitos CSS.
      </p>
    </div>
  );
}
