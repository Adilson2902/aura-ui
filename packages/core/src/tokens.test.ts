import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { AURA_THEMES, AURA_DARK_THEMES, AURA_THEME_LABELS, isDarkTheme } from "./themes";

const here = dirname(fileURLToPath(import.meta.url));
const tokens = readFileSync(join(here, "../styles/tokens.css"), "utf8");
const themesCss = readFileSync(join(here, "../styles/themes.css"), "utf8");

describe("tokens.css (contrato de tema)", () => {
  it("declara superfícies, brand e semânticas", () => {
    for (const token of [
      "--aura-surface",
      "--aura-surface-foreground",
      "--aura-muted",
      "--aura-muted-foreground",
      "--aura-primary",
      "--aura-primary-foreground",
      "--aura-accent",
      "--aura-border",
      "--aura-ring",
      "--aura-destructive",
      "--aura-success",
      "--aura-warning",
      "--aura-contrast",
      "--aura-cyber"
    ]) {
      expect(tokens).toContain(token);
    }
  });

  it("declara profundidade, motion, raio e fonte da marca", () => {
    for (const token of [
      "--aura-elevation-1",
      "--aura-elevation-5",
      "--aura-depth",
      "--aura-light-x",
      "--aura-glass-blur",
      "--aura-ease-spring",
      "--aura-dur-fast",
      "--aura-dur",
      "--aura-perspective",
      "--aura-tilt-max",
      "--aura-radius",
      "--aura-font-sans"
    ]) {
      expect(tokens).toContain(token);
    }
  });

  it("tem bloco .dark com overrides", () => {
    expect(tokens).toContain(".dark");
    expect(tokens).toMatch(/\.dark\s*{[^}]*--aura-surface:/s);
  });
});

describe("themes.css + themes.ts (catálogo de 33 temas)", () => {
  it("tem no mínimo 30 temas", () => {
    expect(AURA_THEMES.length).toBeGreaterThanOrEqual(30);
  });

  it("cada tema do catálogo tem bloco CSS com brand completo", () => {
    for (const theme of AURA_THEMES) {
      expect(themesCss).toMatch(new RegExp(`\\[data-theme="${theme}"\\]`));
      const block = themesCss.match(
        new RegExp(`\\[data-theme="${theme}"\\]\\s*{([\\s\\S]*?)}`, "m")
      );
      expect(block, `bloco do tema ${theme}`).toBeDefined();
      const css = block![1];
      for (const token of [
        "--aura-primary",
        "--aura-primary-foreground",
        "--aura-accent",
        "--aura-ring",
        "--aura-gradient-primary",
        "--aura-gradient-aurora",
        "--aura-glow-primary"
      ]) {
        expect(css, `${theme} deve declarar ${token}`).toContain(token);
      }
    }
  });

  it("temas escuros declaram superfície própria; claros não", () => {
    for (const theme of AURA_THEMES) {
      const block = themesCss.match(
        new RegExp(`\\[data-theme="${theme}"\\]\\s*{([\\s\\S]*?)}`, "m")
      );
      const css = block![1];
      if (isDarkTheme(theme)) {
        expect(css, `${theme} é escuro: precisa de --aura-surface`).toContain("--aura-surface:");
      }
      expect(isDarkTheme(theme)).toBe((AURA_DARK_THEMES as readonly string[]).includes(theme));
    }
  });

  it("todo tema tem label amigável", () => {
    for (const theme of AURA_THEMES) {
      expect(AURA_THEME_LABELS[theme], `label de ${theme}`).toBeTruthy();
    }
  });
});
