import { readFileSync } from "node:fs";

export type CatalogFile = { path: string; content: string };

export type CatalogComponent = {
  name: string;
  kind: "ui" | "effect" | "lib" | "native";
  category: string;
  summary: string;
  description: string;
  exports: string[];
  types: string[];
  dependencies: string[];
  registryDependencies: string[];
  importPath: string | null;
  files: CatalogFile[];
};

export type Catalog = {
  version: string;
  components: CatalogComponent[];
  themes: { name: string; label: string; dark: boolean }[];
  tokens: { name: string; group: string; light: string; dark?: string }[];
  utilities: { namespace: string; name: string; value: string }[];
  classes: string[];
};

export const CATEGORY_LABELS: Record<string, string> = {
  forms: "Formulários",
  dates: "Datas",
  overlays: "Overlays",
  layout: "Layout",
  data: "Dados e exibição",
  charts: "Charts",
  blocks: "Blocos de página",
  effects: "Efeitos 3D/motion",
  lib: "Utilitários",
  native: "React Native (aura-ui-native)",
  outros: "Outros"
};

/** data/catalog.json fica ao lado de dist/ (gerado por scripts/build-catalog.mjs). */
export function loadCatalog(url = new URL("../data/catalog.json", import.meta.url)): Catalog {
  return JSON.parse(readFileSync(url, "utf8")) as Catalog;
}

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Busca por nome, resumo, exports, categoria e descrição (com pesos). */
export function searchComponents(catalog: Catalog, query: string, category?: string) {
  const pool = catalog.components.filter((c) => !category || c.category === category);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return pool;
  return pool
    .map((c) => {
      const fields: [string, number][] = [
        [c.name, 6],
        [c.exports.join(" "), 4],
        [c.summary, 3],
        [`${c.category} ${CATEGORY_LABELS[c.category] ?? ""}`, 2],
        [c.description, 1]
      ];
      let score = 0;
      for (const term of terms) {
        for (const [text, weight] of fields) {
          if (normalize(text).includes(term)) score += weight;
        }
      }
      return { c, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.c);
}

function editDistance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array<number>(b.length).fill(0)
  ]);
  for (let j = 1; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length]![b.length]!;
}

export type Platform = "web" | "native";

const onPlatform = (c: CatalogComponent, platform: Platform) =>
  (c.kind === "native") === (platform === "native");

/**
 * Acha o componente pelo nome do registry ou por um export (ex.: "DatePicker").
 * Sem `platform`, procura no web primeiro e depois no React Native.
 */
export function findComponent(
  catalog: Catalog,
  name: string,
  platform?: Platform
): CatalogComponent | undefined {
  if (!platform)
    return findComponent(catalog, name, "web") ?? findComponent(catalog, name, "native");
  const pool = catalog.components.filter((c) => onPlatform(c, platform));
  const raw = name.trim();
  const n = normalize(raw);
  // "DatePicker" -> "date-picker" (antes de normalizar, que perde as maiúsculas)
  const kebab = normalize(raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2"));
  return (
    pool.find((c) => c.name === n || c.name === kebab) ??
    pool.find((c) => c.exports.some((e) => normalize(e) === n))
  );
}

export function suggestNames(catalog: Catalog, name: string, limit = 5) {
  const n = normalize(name);
  return catalog.components
    .map((c) => ({
      name: c.name,
      d: c.name.includes(n) || n.includes(c.name) ? 0 : editDistance(n, c.name)
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((s) => s.name);
}

/** Componente + dependências do registry, em ordem (dependências primeiro). */
export function resolveWithDependencies(catalog: Catalog, root: CatalogComponent) {
  const seen = new Set<string>();
  const out: CatalogComponent[] = [];
  const visit = (c: CatalogComponent) => {
    if (seen.has(c.name)) return;
    seen.add(c.name);
    for (const dep of c.registryDependencies) {
      // dependência na mesma plataforma (web e native têm nomes iguais, ex.: button)
      const d = catalog.components.find(
        (x) => x.name === dep && (x.kind === "native") === (c.kind === "native")
      );
      if (d) visit(d);
    }
    out.push(c);
  };
  visit(root);
  return out;
}
