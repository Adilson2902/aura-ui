import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const primitives = readFileSync(join(here, "../../core/styles/primitives.css"), "utf8");
const tokens = readFileSync(join(here, "../../core/styles/tokens.css"), "utf8");
const preset = readFileSync(join(here, "../../tailwind-preset/src/preset.css"), "utf8");
const index = readFileSync(join(here, "index.ts"), "utf8");
const sources = Object.fromEntries(
  readdirSync(here)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [f, readFileSync(join(here, f), "utf8")])
);

const HEX = /#[0-9a-fA-F]{3,8}/;
const TAILWIND_PALETTE =
  /\b(?:slate|emerald|amber|red|blue|green|zinc|neutral|stone)-\d{2,3}\b/;

/** Keyframes que cada componente referencia — precisam existir no core. */
const KEYFRAMES: Record<string, string[]> = {
  "animated-beam.tsx": ["aura-shimmer-slide"],
  "animated-shiny-text.tsx": ["aura-shimmer"],
  "aurora-background.tsx": ["aura-aurora-drift"],
  "bento-grid.tsx": [],
  "blur-fade.tsx": [],
  "border-beam.tsx": ["aura-beam-spin"],
  "card-3d.tsx": [],
  "float.tsx": ["aura-float-y"],
  "glass-card.tsx": [],
  "glow-orb.tsx": ["aura-pulse-glow"],
  "hero-parallax.tsx": [],
  "layered-card.tsx": [],
  "marquee.tsx": ["aura-marquee"],
  "meteors.tsx": ["aura-meteor"],
  "moving-border.tsx": ["aura-border-rotate"],
  "number-ticker.tsx": [],
  "orbiting-circles.tsx": ["aura-orbit"],
  "perspective-grid.tsx": ["aura-grid-scroll"],
  "ripple.tsx": ["aura-ripple-ring"],
  "shine-border.tsx": ["aura-shimmer"],
  "shimmer-button.tsx": ["aura-shimmer-slide"],
  "spotlight.tsx": [],
  "sticky-scroll.tsx": []
};

describe("effects (contrato de animação)", () => {
  it("exporta a suíte 3D + efeitos base no index", () => {
    for (const name of [
      "Card3D",
      "Spotlight",
      "ShineBorder",
      "AnimatedShinyText",
      "AuroraBackground",
      "GlowOrb",
      "Marquee",
      "BorderBeam",
      "ShimmerButton",
      "BlurFade",
      "NumberTicker",
      "Ripple",
      "LayeredCard",
      "GlassCard",
      "MovingBorder",
      "OrbitingCircles",
      "Meteors",
      "PerspectiveGrid",
      "BentoGrid",
      "BentoItem",
      "AnimatedBeam",
      "HeroParallax",
      "StickyScroll",
      "Float"
    ]) {
      expect(index).toContain(name);
    }
  });

  it("keyframes referenciados existem em primitives.css (sem CSS fantasma)", () => {
    expect(Object.keys(sources).sort()).toEqual(Object.keys(KEYFRAMES).sort());
    for (const [file, frames] of Object.entries(KEYFRAMES)) {
      for (const frame of frames) {
        expect(sources[file], `${file} referencia ${frame}`).toContain(frame);
        expect(primitives, `@keyframes ${frame} existe`).toContain(`@keyframes ${frame}`);
      }
    }
  });

  it("aura-shimmer usa range 0% -> 100% (200% -> -200% apaga o fundo no ciclo)", () => {
    expect(primitives).toContain("background-position: 0% 0;");
    expect(primitives).toContain("background-position: 100% 0;");
    expect(primitives).not.toContain("background-position: 200%");
    expect(primitives).not.toContain("background-position: -200%");
  });

  it("preset não duplica keyframes, só referencia via utilities", () => {
    expect(preset).not.toContain("@keyframes aura-shimmer");
    expect(preset).toContain("--animate-aura-shimmer");
  });

  it("border-beam registra @property do ângulo", () => {
    expect(primitives).toContain("@property --aura-beam-angle");
  });

  it("nenhum efeito usa cor hardcoded ou paleta tailwind", () => {
    for (const [file, src] of Object.entries(sources)) {
      expect(src, file).not.toMatch(HEX);
      expect(src, file).not.toMatch(TAILWIND_PALETTE);
    }
  });

  it("todos respeitam prefers-reduced-motion via useReducedMotion", () => {
    for (const [file, src] of Object.entries(sources)) {
      expect(src, file).toContain("useReducedMotion");
    }
  });

  it("todos são client components (estado/handlers/rAF)", () => {
    for (const [file, src] of Object.entries(sources)) {
      expect(src.startsWith('"use client";'), file).toBe(true);
    }
  });

  it("vars de motion referenciadas existem em tokens.css", () => {
    for (const token of [
      "--aura-perspective",
      "--aura-dur",
      "--aura-ease-spring",
      "--aura-light-x",
      "--aura-light-y",
      "--aura-depth"
    ]) {
      const used = Object.values(sources).some((src) => src.includes(token));
      if (used) expect(tokens, token).toContain(token);
    }
  });

  it("não importa motion (contrato CSS-first; decidir antes de mudar)", () => {
    for (const [file, src] of Object.entries(sources)) {
      expect(src, file).not.toMatch(/from ["']motion/);
    }
  });
});
