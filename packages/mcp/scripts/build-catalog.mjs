/**
 * Gera data/catalog.json — tudo que o servidor MCP serve, num arquivo só:
 * componentes do registry (código completo + descrição do JSDoc + exports +
 * dependências), temas do core, tokens CSS e utilities do preset Tailwind.
 *
 * Fonte da verdade: /registry (sincronizado do src de cada pacote por
 * scripts/sync-registry.cjs), packages/core e packages/tailwind-preset.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(pkgDir, "../..");
const read = (p) => readFileSync(path.join(root, p), "utf8").replace(/\r\n/g, "\n");

/** Categoria de cada componente de UI (o que não estiver aqui cai em "outros"). */
const CATEGORIES = {
  forms: [
    "button",
    "button-group",
    "input",
    "input-group",
    "input-otp",
    "number-input",
    "textarea",
    "field",
    "label",
    "checkbox",
    "radio-group",
    "switch",
    "select",
    "combobox",
    "slider",
    "toggle",
    "tags-input",
    "rating",
    "file-upload",
    "copy-button"
  ],
  dates: ["calendar", "date-picker"],
  overlays: [
    "dialog",
    "alert-dialog",
    "sheet",
    "drawer",
    "popover",
    "hover-card",
    "tooltip",
    "dropdown-menu",
    "context-menu",
    "command",
    "toast"
  ],
  layout: [
    "card",
    "tabs",
    "accordion",
    "collapsible",
    "carousel",
    "aspect-ratio",
    "scroll-area",
    "separator",
    "typography",
    "sidebar",
    "section"
  ],
  data: [
    "table",
    "data-table",
    "avatar",
    "badge",
    "kbd",
    "breadcrumb",
    "pagination",
    "progress",
    "meter",
    "spinner",
    "skeleton",
    "stat",
    "steps",
    "timeline",
    "empty-state",
    "alert",
    "code-block",
    "blockquote",
    "theme-switcher"
  ],
  charts: ["charts"],
  blocks: [
    "navbar",
    "hero",
    "feature-grid",
    "pricing",
    "cta",
    "testimonial",
    "logo-cloud",
    "banner",
    "footer"
  ]
};
const categoryOf = new Map(
  Object.entries(CATEGORIES).flatMap(([cat, names]) => names.map((n) => [n, cat]))
);

/**
 * Resumo de uma linha por componente — é o que a IA lê no catálogo.
 * Sem entrada aqui, cai na 1ª frase do JSDoc (bom p/ efeitos, aviso p/ UI).
 */
const SUMMARIES = {
  // formulários
  button:
    "Botão com 12 variantes (solid, gradient, glow, glass, 3d, destructive, link…), 8 tamanhos, loading, ícones e asChild.",
  "button-group":
    "Agrupa botões/inputs colados (horizontal ou vertical), com separador e texto de prefixo.",
  input:
    "Campo de texto com 7 variantes (default, soft, outline, underline, glass, glow, 3d), 3 tamanhos e estado aria-invalid.",
  "input-group": "Input com addons na mesma borda: ícones, prefixos (https://), Kbd e botões.",
  "input-otp":
    "Código de verificação (OTP) em casas separadas, com colar, setas e autocomplete one-time-code.",
  "number-input": "Campo numérico com botões −/+, min/max/step, precisão e formatação Intl.",
  textarea: "Área de texto com as mesmas variantes do Input.",
  field: "Agrupa label, controle, descrição e erro com ids/ARIA automáticos (react-hook-form/zod).",
  label: "Label acessível (Radix) ligado ao controle por htmlFor.",
  checkbox: "Checkbox (Radix) com 3 tamanhos, quadrado/círculo e estado indeterminado.",
  "radio-group": "Grupo de rádio (Radix) com tamanhos e RadioGroupCard (opção em cartão).",
  switch: "Switch (Radix) com 5 variantes (default, success, gradient, glow, 3d) e 3 tamanhos.",
  select: "Select (Radix) com gatilho em 6 superfícies, 3 tamanhos, separador e rolagem.",
  combobox: "Select pesquisável (Popover + Command), seleção única ou múltipla com chips.",
  slider: "Slider de valor ou faixa (Radix).",
  toggle: "Botão de estado (aria-pressed) e ToggleGroup single/multiple com navegação por setas.",
  "tags-input": "Campo de tags: digite + Enter para adicionar, Backspace para remover.",
  rating: "Estrelas de avaliação: exibição fracionada ou interativa por teclado.",
  "file-upload":
    "Dropzone acessível com validação de tipo/tamanho, preview de imagem e lista de arquivos.",
  "copy-button": "Copia texto p/ a área de transferência e mostra ✓ com anúncio acessível.",
  // datas
  calendar:
    "Calendário sem dependências: single ou range, 1–2 meses, min/max, locale via Intl e teclado completo.",
  "date-picker": "DatePicker e DateRangePicker: gatilho estilo input + Calendar num Popover.",
  // overlays
  dialog:
    "Modal (Radix) com 5 tamanhos, 5 superfícies, animação de entrada/saída e botão fechar opcional.",
  "alert-dialog":
    "Diálogo de confirmação (Radix) com ações Confirmar/Cancelar no estilo do Button.",
  sheet: "Painel lateral (top/right/bottom/left) com tamanhos e animação de deslizar.",
  drawer: "Gaveta (inferior por padrão) com alça e arrastar para fechar.",
  popover: "Popover (Radix) com 5 superfícies, seta opcional e animação pelo lado de abertura.",
  "hover-card": "Prévia rica ao passar o mouse ou focar (Radix), com seta opcional.",
  tooltip: "Tooltip (Radix) com 5 superfícies e o atalho SimpleTooltip.",
  "dropdown-menu":
    "Menu suspenso (Radix): itens, checkbox/radio, submenus, atalhos e item destructive.",
  "context-menu": "Menu de clique direito (Radix) com a mesma API do DropdownMenu.",
  command: "Paleta de comandos (cmdk) com busca fuzzy, grupos, atalhos e CommandDialog.",
  toast:
    "Notificações estilo Sonner: 6 posições, toast.success/error/warning/info, ações e pausa no hover.",
  // layout
  card: "Card com 9 superfícies, padding independente, interactive, asChild e CardAction no cabeçalho.",
  tabs: "Abas (Radix) com 5 estilos (pill, underline, outline, glass, 3d), fullWidth e orientação vertical.",
  accordion:
    "Acordeão (Radix) com 4 estilos (separated, contained, line, glass) e animação de altura.",
  collapsible: "Mostra/esconde uma região (Radix) com animação de altura.",
  carousel: "Carrossel sem dependências (scroll-snap) com setas, indicadores, loop e autoplay.",
  "aspect-ratio": "Mantém a proporção (16/9, 1, 4/3…) via CSS aspect-ratio.",
  "scroll-area": "Área de rolagem com scrollbar estilizada (Radix).",
  separator:
    "Separador horizontal/vertical com 5 variantes (solid, gradient, glow, dashed, glass).",
  typography: "Heading/Text com escala fluida e tons, InlineCode e Prose (HTML de markdown/CMS).",
  sidebar: "Sidebar com itens e labels + AppShell para layout de dashboard.",
  section: "Section, Container e SectionHeading para montar páginas com ritmo consistente.",
  // dados / exibição
  table: "Tabela com 6 variantes (default, clean, striped, bordered, glass, 3d).",
  "data-table": "Tabela de dados com busca, ordenação, seleção e colunas configuráveis.",
  avatar: "Avatar (Radix) com tamanhos, formato, anéis e AvatarGroup com contador +N.",
  badge: "Badge/chip com 11 variantes, 3 tamanhos e ponto de status.",
  kbd: "Tecla/atalho de teclado com 5 variantes.",
  breadcrumb: "Trilha de navegação acessível (aria-current no último item).",
  pagination: "Paginação acessível com elevação.",
  progress: "Barra de progresso (Radix) com glow e gradiente.",
  meter: "Barra semântica de medida (uso de disco, quota) com tons.",
  spinner: "Indicador de carregamento com 5 variantes (ring, dots, bars, pulse, gradient).",
  skeleton: "Placeholder de carregamento com shimmer.",
  stat: "Card de KPI com número grande, variação e elevação/tilt.",
  steps: "Stepper com 5 estilos e conectores.",
  timeline: "Linha do tempo com 5 estilos.",
  "empty-state": "Estado vazio para listas e buscas sem resultado.",
  alert: "Callout de status (info, success, warning, destructive, glass).",
  "code-block": "Bloco de código com cabeçalho, botão copiar e 5 variantes.",
  blockquote: "Citação com autor/cargo e 5 variantes.",
  "theme-switcher": "Seletor dos 33 temas (data-theme) + light/dark.",
  charts: "Gráficos SVG sem dependências: Bar, Line, MultiLine, Donut, Sparkline e RadialProgress.",
  // blocos de página
  navbar: "Barra de navegação com marca, links e ações.",
  hero: "Hero de landing: eyebrow, título com gradiente, subtítulo, ações e 6 fundos.",
  "feature-grid": "Grade de features com cards de ícone (5 variantes).",
  pricing: "Cards de plano/preço e grade de pricing (5 variantes).",
  cta: "Faixa de chamada para ação (5 variantes).",
  testimonial: "Cards de depoimento com nota e avatar + grade masonry.",
  "logo-cloud": "Faixa de logos de clientes em grade ou marquee infinito.",
  banner: "Faixa de anúncio no topo, fixa e dispensável (lembra no localStorage).",
  footer: "Rodapé com marca, colunas de links e linha inferior.",
  // lib
  utils: "Função cn() (clsx + tailwind-merge) usada por todos os componentes.",
  "themes-css": "CSS dos 33 temas (data-theme)."
};

const firstSentence = (text) => (text.split(/(?<=[.!?])\s/)[0] ?? "").trim();

/**
 * Descrição = JSDoc mais representativo do arquivo. Prioridade pelo que vem
 * logo depois do comentário: componente (`const Button =`) > variantes cva >
 * outra declaração. JSDoc de props (`label?: string`) é ignorado.
 */
function description(code) {
  const rank = (next) =>
    /^(export\s+)?(const|function|class)\s+[A-Z][a-z]\w*(?<!Variants)\b/.test(next)
      ? 0
      : /^(export\s+)?const\s+\w+Variants\s*=/.test(next)
        ? 1
        : /^(export\s+)?(const|function|type|interface|class)\s/.test(next)
          ? 2
          : 9;
  const blocks = [...code.matchAll(/\/\*\*([\s\S]*?)\*\/[ \t]*\n?[ \t]*([^\n]*)/g)]
    .map((m) => ({
      text: m[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\*\s?/, ""))
        .join("\n")
        .trim(),
      rank: rank(m[2])
    }))
    .filter((b) => b.rank < 9 && b.text.length >= 15 && !b.text.startsWith("@"));
  const best = blocks.sort((a, b) => a.rank - b.rank)[0]?.text ?? "";
  return best
    .replace(/\n{2,}/g, "\n\n")
    .replace(/(?<!\n)\n(?!\n)/g, " ")
    .trim();
}

function exportsOf(code) {
  const values = new Set();
  const types = new Set();
  for (const m of code.matchAll(/export\s*(type\s*)?\{([^}]+)\}/g)) {
    const allTypes = Boolean(m[1]);
    for (const raw of m[2].split(",")) {
      const part = raw.trim();
      if (!part) continue;
      const isType = allTypes || part.startsWith("type ");
      const name = part
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)
        .pop()
        .trim();
      (isType ? types : values).add(name);
    }
  }
  for (const m of code.matchAll(/export\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/g))
    values.add(m[1]);
  for (const m of code.matchAll(/export\s+(?:interface|type)\s+(\w+)/g)) types.add(m[1]);
  return { values: [...values], types: [...types] };
}

// ---------- componentes (registry) ----------
const registry = JSON.parse(read("registry/index.json"));
const effectsExports = Object.keys(JSON.parse(read("packages/effects/package.json")).exports);

const components = registry.items.map((item) => {
  const kind =
    item.type === "registry:lib"
      ? "lib"
      : item.files[0].path.includes("/effects/")
        ? "effect"
        : "ui";
  const files = item.files.map((f) => {
    const base = path.basename(f.path);
    const target =
      kind === "lib"
        ? `src/lib/${base}`
        : kind === "effect"
          ? `src/components/effects/${base}`
          : `src/components/ui/${base}`;
    return { path: target, content: read(f.path) };
  });
  const main = files[0].content;
  const { values, types } = exportsOf(main);
  let importPath = null;
  if (kind === "ui") importPath = `aura-ui-components/${item.name}`;
  else if (kind === "effect")
    importPath = effectsExports.includes(`./${item.name}`)
      ? `aura-ui-effects/${item.name}`
      : "aura-ui-effects";
  else if (item.name === "utils") importPath = "aura-ui-core";
  else if (item.name === "themes-css") importPath = "aura-ui-core/styles/themes.css";

  const category =
    kind === "effect"
      ? "effects"
      : kind === "lib"
        ? "lib"
        : (categoryOf.get(item.name) ?? "outros");
  if (category === "outros") console.warn(`aviso: "${item.name}" sem categoria em CATEGORIES`);
  const details = path.extname(item.files[0].path) === ".tsx" ? description(main) : "";
  const summary = SUMMARIES[item.name] ?? firstSentence(details);
  if (kind === "ui" && !SUMMARIES[item.name])
    console.warn(`aviso: "${item.name}" sem resumo em SUMMARIES`);

  return {
    name: item.name,
    kind,
    category,
    summary,
    description: details,
    exports: values,
    types,
    dependencies: item.dependencies ?? [],
    registryDependencies: (item.registryDependencies ?? []).filter((d) => d !== item.name),
    importPath,
    files
  };
});

// ---------- temas ----------
const themesSrc = read("packages/core/src/themes.ts");
const listOf = (constName) => {
  const m = themesSrc.match(new RegExp(`export const ${constName} = \\[([\\s\\S]*?)\\]`));
  return m ? [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]) : [];
};
const labels = Object.fromEntries(
  [
    ...(themesSrc.match(/AURA_THEME_LABELS[^=]*=\s*\{([\s\S]*?)\};/)?.[1] ?? "").matchAll(
      /([\w-]+):\s*"([^"]+)"/g
    )
  ].map((m) => [m[1], m[2]])
);
const dark = new Set(listOf("AURA_DARK_THEMES"));
const themes = listOf("AURA_THEMES").map((name) => ({
  name,
  label: labels[name] ?? name,
  dark: dark.has(name)
}));

// ---------- tokens ----------
const tokensCss = read("packages/core/styles/tokens.css");
const block = (selector) =>
  tokensCss.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
const vars = (css) =>
  Object.fromEntries(
    [...css.matchAll(/(--aura-[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()])
  );
const light = vars(block(":root"));
const darkVars = vars(block("\\.dark"));
const groupOf = (name) =>
  /elevation|depth/.test(name)
    ? "elevation"
    : /gradient|glow|bevel/.test(name)
      ? "gradient"
      : /glass|specular/.test(name)
        ? "glass"
        : /ease|dur|perspective|tilt|orbit|light-[xy]/.test(name)
          ? "motion"
          : /radius|font/.test(name)
            ? "shape"
            : "color";
const tokens = Object.entries(light).map(([name, value]) => ({
  name,
  group: groupOf(name),
  light: value,
  ...(darkVars[name] ? { dark: darkVars[name] } : {})
}));

// utilities do preset: --color-aura-primary => bg-aura-primary, text-..., etc.
const preset = read("packages/tailwind-preset/src/preset.css");
const utilities = [
  ...preset.matchAll(/--(color|shadow|radius|font|ease|animate)-(aura[\w-]*):\s*([^;]+);/g)
].map((m) => ({
  namespace: m[1],
  name: m[2],
  value: m[3].trim()
}));

// classes CSS do core (.aura-surface, .aura-glass, .aura-pop…), sem pseudo/estado
const primitives = read("packages/core/styles/primitives.css");
const classes = [
  ...new Set([...primitives.matchAll(/^\.(aura-[\w-]+)/gm)].map((m) => m[1]))
].sort();

const pkg = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"));
const catalog = { version: pkg.version, components, themes, tokens, utilities, classes };

mkdirSync(path.join(pkgDir, "data"), { recursive: true });
writeFileSync(path.join(pkgDir, "data/catalog.json"), JSON.stringify(catalog));
const kb = (Buffer.byteLength(JSON.stringify(catalog)) / 1024).toFixed(0);
console.log(
  `catalog.json: ${components.length} itens, ${themes.length} temas, ${tokens.length} tokens, ${utilities.length} utilities (${kb} KB)`
);
