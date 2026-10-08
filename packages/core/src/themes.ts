/**
 * Catálogo de temas Aura (`data-theme` no <html>).
 * 32 temas: claros, escuros e neon — todos definidos em `styles/themes.css`.
 */
export const AURA_THEMES = [
  // originais
  "aura",
  "midnight",
  "ocean",
  "forest",
  "sunset",
  "cyber",
  "rose",
  "nord",
  "mocha",
  "synthwave",
  // v2 — expansão para 33 temas
  "amber",
  "emerald",
  "cherry",
  "lavender",
  "matrix",
  "arctic",
  "desert",
  "volcano",
  "grape",
  "mint",
  "steel",
  "peach",
  "indigo",
  "lime",
  "sakura",
  "obsidian",
  "solar",
  "aqua",
  "candy",
  "mono",
  "terminal",
  "bubblegum",
  "caramel"
] as const;

export type AuraThemeName = (typeof AURA_THEMES)[number];

/** Temas cuja superfície padrão já é escura (sem necessidade de `.dark`). */
export const AURA_DARK_THEMES = [
  "midnight",
  "cyber",
  "synthwave",
  "matrix",
  "volcano",
  "grape",
  "obsidian",
  "terminal"
] as const satisfies readonly AuraThemeName[];

export type AuraDarkThemeName = (typeof AURA_DARK_THEMES)[number];

/** Labels amigáveis p/ UI (ThemeSwitcher, docs, storybook). */
export const AURA_THEME_LABELS: Record<AuraThemeName, string> = {
  aura: "Aura",
  midnight: "Midnight",
  ocean: "Ocean",
  forest: "Forest",
  sunset: "Sunset",
  cyber: "Cyber",
  rose: "Rose",
  nord: "Nord",
  mocha: "Mocha",
  synthwave: "Synthwave",
  amber: "Amber",
  emerald: "Emerald",
  cherry: "Cherry",
  lavender: "Lavender",
  matrix: "Matrix",
  arctic: "Arctic",
  desert: "Desert",
  volcano: "Volcano",
  grape: "Grape",
  mint: "Mint",
  steel: "Steel",
  peach: "Peach",
  indigo: "Indigo",
  lime: "Lime",
  sakura: "Sakura",
  obsidian: "Obsidian",
  solar: "Solar",
  aqua: "Aqua",
  candy: "Candy",
  mono: "Mono",
  terminal: "Terminal",
  bubblegum: "Bubblegum",
  caramel: "Caramel"
};

/** util p/ provider: tema nomeado é escuro por padrão? */
export function isDarkTheme(name: AuraThemeName): boolean {
  return (AURA_DARK_THEMES as readonly string[]).includes(name);
}
