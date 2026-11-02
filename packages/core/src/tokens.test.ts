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

/** Especificidade de um seletor simples (`:root`, `.dark`, `[data-theme]`) se ele casa com o <html>; senão -1. */
function specificityOn(selector: string, theme: string, dark: boolean) {
  const parts = selector.match(/:root|\.[\w-]+|\[[^\]]+\]/g) ?? [];
  if (parts.join("") !== selector) return -1;
  const matches = parts.every(
    (p) => p === ":root" || (p === ".dark" && dark) || p === `[data-theme="${theme}"]`
  );
  return matches ? parts.length : -1;
}

/** Cascata mínima (especificidade, depois ordem) p/ `<html data-theme={theme} class={dark ? "dark" : ""}>`. */
function resolveVars(css: string, theme: string, dark: boolean) {
  const winners = new Map<string, { specificity: number; value: string }>();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const specificity = Math.max(
      -1,
      ...m[1].split(",").map((s) => specificityOn(s.trim(), theme, dark))
    );
    if (specificity < 0) continue;
    for (const v of m[2].matchAll(/(--aura-[\w-]+):\s*([^;]+);/g)) {
      const prev = winners.get(v[1]);
      if (!prev || specificity >= prev.specificity) {
        winners.set(v[1], { specificity, value: v[2].trim() });
      }
    }
  }
  return Object.fromEntries([...winners].map(([name, w]) => [name, w.value]));
}

describe("modo escuro com data-theme e .dark no mesmo <html> (ThemeProvider)", () => {
  const css = tokens + themesCss; // ordem de primitives.css
  const surfaceTokens = [
    "--aura-surface",
    "--aura-surface-foreground",
    "--aura-muted",
    "--aura-muted-foreground",
    "--aura-border"
  ];

  it("temas escuros mantêm a própria superfície com .dark", () => {
    for (const theme of AURA_DARK_THEMES) {
      const own = resolveVars(css, theme, false);
      const withDark = resolveVars(css, theme, true);
      for (const token of surfaceTokens) {
        expect(withDark[token], `${theme} + .dark: ${token}`).toBe(own[token]);
      }
    }
  });

  it("temas claros com .dark recebem as superfícies escuras genéricas", () => {
    const genericBlock = themesCss.match(/(?:^|\n)\.dark\s*{([^}]*)}/)![1];
    const generic = Object.fromEntries(
      [...genericBlock.matchAll(/(--aura-[\w-]+):\s*([^;]+);/g)].map((v) => [v[1], v[2].trim()])
    );
    for (const theme of AURA_THEMES.filter((t) => !isDarkTheme(t))) {
      const withDark = resolveVars(css, theme, true);
      for (const token of surfaceTokens) {
        expect(withDark[token], `${theme} + .dark: ${token}`).toBe(generic[token]);
      }
    }
  });
});
