"use client";

/**
 * aura-ui-three — cenas 3D opcionais com React Three Fiber.
 *
 * Peer deps: `three`, `@react-three/fiber`, `react`.
 * Import só quando precisar de WebGL de verdade; o resto do Aura UI roda em CSS 3D.
 */
export { AuraCanvas, type AuraCanvasProps } from "./aura-canvas";
export { FloatingMesh, type FloatingMeshProps } from "./floating-mesh";
export { ParticleField, type ParticleFieldProps } from "./particle-field";
export { HeroScene, type HeroSceneProps } from "./hero-scene";
export { useAuraPointer, type AuraPointer } from "./use-aura-pointer";
