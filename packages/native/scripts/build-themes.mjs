/**
 * Gera src/theme/palettes.generated.ts a partir do CSS do aura-ui-core,
 * para o mobile ter exatamente as mesmas cores do web.
 *
 * Cascata (igual ao navegador):
 *   claro  = tokens :root  → bloco aura (:root) → [data-theme=X]
 *   escuro = tokens :root → tokens .dark → bloco aura → [data-theme=X] → themes .dark
 * Temas escuros por natureza (AURA_DARK_THEMES) usam sempre a própria paleta
 * (sem o .dark genérico, que apagaria a superfície do tema).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const core = path.resolve(pkgDir, "../core");
const read = (p) => readFileSync(path.join(core, p), "utf8").replace(/\r\n/g, "\n");

/** Blocos `seletor { --aura-x: v; }` de um arquivo CSS, na ordem em que aparecem. */
function blocks(css) {
  const out = [];
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].replace(/\/\*[\s\S]*?\*\//g, "").trim();
    const vars = Object.fromEntries(
      [...m[2].matchAll(/--aura-([\w-]+):\s*([^;]+);/g)].map((v) => [v[1], v[2].trim()])
    );
    if (Object.keys(vars).length) out.push({ selector, vars });
  }
  return out;
}

const tokens = blocks(read("styles/tokens.css"));
const themesCss = blocks(read("styles/themes.css"));
const pick = (list, test) =>
  Object.assign({}, ...list.filter((b) => test(b.selector)).map((b) => b.vars));

const tokensRoot = pick(tokens, (s) => s === ":root");
const tokensDark = pick(tokens, (s) => s === ".dark");
const themesDark = pick(themesCss, (s) => s === ".dark");
const themeVars = (name) => pick(themesCss, (s) => s.includes(`[data-theme="${name}"]`));
const auraBlock = themeVars("aura");

// ---------- lista/labels de temas (fonte: packages/core/src/themes.ts) ----------
const themesTs = read("src/themes.ts");
const listOf = (constName) => {
  const m = themesTs.match(new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\]`));
  return m ? [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]) : [];
};
const THEMES = listOf("AURA_THEMES");
const DARK = new Set(listOf("AURA_DARK_THEMES"));
const LABELS = Object.fromEntries(
  [
    ...(themesTs.match(/AURA_THEME_LABELS[^=]*=\s*\{([\s\S]*?)\};/)?.[1] ?? "").matchAll(
      /([\w-]+):\s*"([^"]+)"/g
    )
  ].map((m) => [m[1], m[2]])
);

// ---------- conversões ----------
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `#${[f(0), f(8), f(4)]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

/** "252 100% 67%" → "#7857ff"; hex/rgb passam direto. */
function color(value, name) {
  const hsl = value.match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (hsl) return hslToHex(+hsl[1], +hsl[2], +hsl[3]);
  if (/^(#|rgb|hsl)/.test(value)) return value;
  throw new Error(`cor não reconhecida em --aura-${name}: "${value}"`);
}

/** linear-gradient(135deg, #a 0%, #b 100%) → { angle, colors, locations } */
function gradient(value) {
  const m = value.match(/linear-gradient\(\s*([\d.]+)deg\s*,(.*)\)$/);
  if (!m) return null;
  const stops = [...m[2].matchAll(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\))\s+([\d.]+)%/g)];
  return {
    angle: +m[1],
    colors: stops.map((s) => s[1].toLowerCase()),
    locations: stops.map((s) => +(+s[2] / 100).toFixed(4))
  };
}

const COLOR_KEYS = {
  surface: "surface",
  surfaceForeground: "surface-foreground",
  muted: "muted",
  mutedForeground: "muted-foreground",
  border: "border",
  primary: "primary",
  primaryForeground: "primary-foreground",
  accent: "accent",
  accentForeground: "accent-foreground",
  ring: "ring",
  destructive: "destructive",
  destructiveForeground: "destructive-foreground",
  success: "success",
  successForeground: "success-foreground",
  warning: "warning",
  warningForeground: "warning-foreground",
  contrast: "contrast",
  cyber: "cyber"
};
const GRADIENT_KEYS = ["primary", "accent", "cyber", "aurora"];

function palette(vars, dark) {
  const colors = Object.fromEntries(
    Object.entries(COLOR_KEYS).map(([key, css]) => {
      if (!vars[css]) throw new Error(`token --aura-${css} ausente`);
      return [key, color(vars[css], css)];
    })
  );
  const gradients = Object.fromEntries(
    GRADIENT_KEYS.map((g) => [
      g,
      gradient(vars[`gradient-${g}`] ?? "") ?? {
        angle: 135,
        colors: [colors.primary, colors.primary],
        locations: [0, 1]
      }
    ])
  );
  return { dark, colors, gradients };
}

const palettes = {};
for (const name of THEMES) {
  const own = themeVars(name);
  if (DARK.has(name)) {
    const p = palette({ ...tokensRoot, ...tokensDark, ...auraBlock, ...own }, true);
    palettes[name] = { light: p, dark: p };
  } else {
    palettes[name] = {
      light: palette({ ...tokensRoot, ...auraBlock, ...own }, false),
      dark: palette({ ...tokensRoot, ...tokensDark, ...auraBlock, ...own, ...themesDark }, true)
    };
  }
}

const radiusRem = parseFloat(tokensRoot.radius ?? "0.875");

const lines = [
  "// Gerado por scripts/build-themes.mjs a partir de aura-ui-core (tokens.css, themes.css, themes.ts).",
  "// Não edite à mão: rode `pnpm --filter aura-ui-native themes`.",
  'import type { ThemePalettes } from "./types";',
  "",
  `export const AURA_THEMES = ${JSON.stringify(THEMES)} as const;`,
  `export const AURA_DARK_THEMES = ${JSON.stringify([...DARK])} as const;`,
  `export const AURA_THEME_LABELS: Record<(typeof AURA_THEMES)[number], string> = ${JSON.stringify(
    Object.fromEntries(THEMES.map((t) => [t, LABELS[t] ?? t]))
  )};`,
  `/** Raio base (px) — espelha --aura-radius do web. */`,
  `export const BASE_RADIUS = ${Math.round(radiusRem * 16)};`,
  "",
  "export const PALETTES: ThemePalettes = {",
  ...THEMES.map((t) => `  ${JSON.stringify(t)}: ${JSON.stringify(palettes[t])},`),
  "};",
  ""
];
writeFileSync(path.join(pkgDir, "src/theme/palettes.generated.ts"), lines.join("\n"));
console.log(
  `palettes.generated.ts: ${THEMES.length} temas (${DARK.size} escuros), raio ${Math.round(radiusRem * 16)}px`
);
