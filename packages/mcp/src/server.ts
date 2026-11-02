import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  CATEGORY_LABELS,
  findComponent,
  resolveWithDependencies,
  searchComponents,
  suggestNames,
  type Catalog,
  type CatalogComponent
} from "./catalog.js";
import { setupGuide } from "./setup.js";

const INSTRUCTIONS = `Aura UI é um design system React + Tailwind CSS v4 (Radix, 73 componentes, 23 efeitos 3D, 33 temas) com versão React Native (aura-ui-native: mesmos temas, sem dependências nativas).
Fluxo recomendado:
1. get_setup antes de instalar (modo "package" = importar do npm; "cli" = copiar o código p/ o repo; "native" = React Native/Expo).
   Em apps React Native use list_components com category "native" e get_component com platform "native".
2. list_components (com query/categoria) para achar o componente certo.
3. get_component para ver a API real (exports, variantes, props) e o código antes de usar — não invente props.
4. list_themes / get_design_tokens para tema, cores e classes (bg-aura-primary, aura-glass…).
Use tokens --aura-* e utilities aura-* em vez de cores fixas (hex/slate-500).`;

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

function usage(c: CatalogComponent) {
  const lines: string[] = [];
  const named = c.exports.filter((e) => /^[A-Z]/.test(e)).slice(0, 6);
  if (c.kind === "native") {
    lines.push(`**Importar:** \`import { ${named.join(", ")} } from "aura-ui-native";\``);
    lines.push(
      '**Requer:** `<AuraProvider>` na raiz do app (veja `get_setup` com `mode: "native"`).'
    );
    return lines.join("\n");
  }
  if (c.kind === "lib") {
    if (c.importPath) lines.push(`**Pacote:** \`${c.importPath}\``);
  } else if (c.importPath) {
    lines.push(
      `**Importar do pacote:** \`import { ${named.join(", ")} } from "${c.importPath}";\``
    );
  }
  if (c.kind !== "lib") lines.push(`**Ou copiar p/ o projeto:** \`npx aura-ui-cli add ${c.name}\``);
  if (c.dependencies.length) {
    lines.push(`**npm (só no modo CLI):** \`pnpm add ${c.dependencies.join(" ")}\``);
  }
  const regDeps = c.registryDependencies.filter((d) => d !== "utils");
  if (regDeps.length) lines.push(`**Usa também:** ${regDeps.join(", ")}`);
  return lines.join("\n");
}

function lang(path: string) {
  return path.endsWith(".css") ? "css" : path.endsWith(".ts") ? "ts" : "tsx";
}

function renderComponent(c: CatalogComponent, withSource: boolean) {
  const parts = [
    `# ${c.name} — ${CATEGORY_LABELS[c.category] ?? c.category}`,
    c.summary,
    usage(c),
    c.exports.length ? `**Exports:** ${c.exports.join(", ")}` : "",
    c.types.length ? `**Tipos:** ${c.types.join(", ")}` : "",
    c.description && c.description !== c.summary ? `## Detalhes\n\n${c.description}` : ""
  ];
  if (withSource) {
    for (const f of c.files)
      parts.push(
        `## Código — \`${f.path}\`\n\n\`\`\`${lang(f.path)}\n${f.content.trimEnd()}\n\`\`\``
      );
  }
  return parts.filter(Boolean).join("\n\n");
}

export function createServer(catalog: Catalog) {
  const server = new McpServer(
    { name: "aura-ui", title: "Aura UI", version: catalog.version },
    { instructions: INSTRUCTIONS }
  );
  const categories = Object.keys(CATEGORY_LABELS) as [string, ...string[]];

  server.registerTool(
    "list_components",
    {
      title: "Listar/buscar componentes",
      description:
        "Lista os componentes e efeitos do Aura UI com resumo de uma linha, agrupados por categoria. Use `query` para buscar (nome, função, exports — ex.: 'data', 'modal', 'upload', 'DatePicker') e `category` para filtrar.",
      inputSchema: {
        query: z
          .string()
          .optional()
          .describe("Termos de busca, ex.: 'modal confirmação' ou 'select pesquisável'"),
        category: z.enum(categories).optional().describe("Filtra por categoria")
      },
      annotations: READ_ONLY
    },
    async ({ query, category }) => {
      const found = searchComponents(catalog, query ?? "", category);
      if (!found.length) {
        return text(
          `Nada encontrado para "${query ?? ""}"${category ? ` em ${category}` : ""}. Categorias: ${categories.join(", ")}.`
        );
      }
      const lines: string[] = [];
      if (query) {
        lines.push(`${found.length} resultado(s) para "${query}" (mais relevantes primeiro):\n`);
        for (const c of found) lines.push(`- **${c.name}** (${c.category}) — ${c.summary}`);
      } else {
        const groups = new Map<string, CatalogComponent[]>();
        for (const c of found) groups.set(c.category, [...(groups.get(c.category) ?? []), c]);
        for (const [cat, items] of groups) {
          lines.push(`\n## ${CATEGORY_LABELS[cat] ?? cat} (\`${cat}\`)`);
          for (const c of items) lines.push(`- **${c.name}** — ${c.summary}`);
        }
      }
      lines.push("\nUse `get_component` com o nome para ver API, uso e código.");
      return text(lines.join("\n").trim());
    }
  );

  server.registerTool(
    "get_component",
    {
      title: "Detalhes e código de um componente",
      description:
        "Retorna resumo, como importar (pacote npm ou CLI), exports, tipos, dependências e o código-fonte completo de um componente/efeito do Aura UI. Aceita o nome do registry ('date-picker') ou um export ('DatePicker').",
      inputSchema: {
        name: z
          .string()
          .describe("Nome do componente, ex.: 'button', 'combobox', 'card-3d' ou 'DatePicker'"),
        platform: z
          .enum(["web", "native"])
          .optional()
          .describe(
            "web (React + Tailwind) ou native (React Native, aura-ui-native). Sem isso, procura no web primeiro"
          ),
        include_source: z.boolean().optional().describe("Incluir o código-fonte (padrão true)"),
        include_dependencies: z
          .boolean()
          .optional()
          .describe(
            "Incluir também o código dos componentes de que ele depende (ex.: combobox → popover, command, dialog)"
          )
      },
      annotations: READ_ONLY
    },
    async ({ name, platform, include_source = true, include_dependencies = false }) => {
      const c = findComponent(catalog, name, platform);
      if (!c) {
        return {
          isError: true,
          ...text(
            `Componente "${name}" não existe. Talvez: ${suggestNames(catalog, name).join(", ")}. Use list_components.`
          )
        };
      }
      const chain = include_dependencies ? resolveWithDependencies(catalog, c) : [c];
      const body = chain
        .slice()
        .reverse() // o pedido primeiro, dependências depois
        .map((x) => renderComponent(x, include_source))
        .join("\n\n---\n\n");
      return text(body);
    }
  );

  server.registerTool(
    "get_setup",
    {
      title: "Instalação e configuração",
      description:
        "Passo a passo para instalar o Aura UI num projeto: dependências, Tailwind CSS v4, CSS global (preset + tailwind.css dos pacotes), ThemeProvider e uso. `mode`: 'package' (importar do npm, padrão), 'cli' (copiar o código, estilo shadcn) ou 'native' (React Native/Expo com aura-ui-native).",
      inputSchema: {
        mode: z
          .enum(["package", "cli", "native"])
          .optional()
          .describe("package (padrão), cli ou native (React Native/Expo)"),
        framework: z
          .enum(["next", "vite", "other"])
          .optional()
          .describe("Framework do projeto (padrão next)")
      },
      annotations: READ_ONLY
    },
    async ({ mode = "package", framework = "next" }) => text(setupGuide(mode, framework))
  );

  server.registerTool(
    "list_themes",
    {
      title: "Temas",
      description:
        "Lista os 33 temas (claros e escuros) e como aplicar: data-theme, classe .dark, ThemeProvider/useTheme e ThemeSwitcher.",
      annotations: READ_ONLY
    },
    async () => {
      const light = catalog.themes.filter((t) => !t.dark);
      const dark = catalog.themes.filter((t) => t.dark);
      const fmt = (ts: typeof light) => ts.map((t) => `\`${t.name}\``).join(" · ");
      return text(`# Temas Aura (${catalog.themes.length})

**Claros (${light.length}):** ${fmt(light)}

**Escuros (${dark.length}):** ${fmt(dark)}

## Aplicar
- Fixo: \`<html data-theme="ocean">\`; modo escuro de um tema claro: classe \`dark\` no \`<html>\`.
- Dinâmico: \`ThemeProvider\` (\`aura-ui-core/client\`) com \`defaultTheme\` ("system" | "light" | "dark" | nome do tema) e \`defaultColorScheme\` (nome do tema). Persiste no localStorage.
- \`useTheme()\` → \`{ theme, colorScheme, resolvedTheme, setTheme, setColorScheme, toggleMode }\`.
- UI pronta: \`<ThemeSwitcher />\` de \`aura-ui-components\`.
- Constantes: \`AURA_THEMES\`, \`AURA_DARK_THEMES\`, \`AURA_THEME_LABELS\`, \`isDarkTheme()\` de \`aura-ui-core\`.

## Cor da marca própria
Sobrescreva os tokens (canais HSL, sem \`hsl()\`):

\`\`\`css
:root { --aura-primary: 262 83% 58%; --aura-ring: 262 83% 58%; }
.dark { --aura-primary: 263 90% 70%; }
\`\`\`

Veja \`get_design_tokens\` para a lista completa.`);
    }
  );

  server.registerTool(
    "get_design_tokens",
    {
      title: "Tokens de design",
      description:
        "Tokens CSS --aura-* (valor claro/escuro), as utilities Tailwind geradas pelo preset (bg-aura-primary, shadow-aura-2…) e as classes do core (aura-glass, aura-surface…).",
      inputSchema: {
        group: z
          .enum(["color", "elevation", "gradient", "glass", "motion", "shape", "all"])
          .optional()
          .describe("Filtra os tokens (padrão all)")
      },
      annotations: READ_ONLY
    },
    async ({ group = "all" }) => {
      const tokens = catalog.tokens.filter((t) => group === "all" || t.group === group);
      const prefix: Record<string, string> = {
        color: "bg-/text-/border-/ring-",
        shadow: "shadow-",
        radius: "rounded-",
        font: "font-",
        ease: "ease-",
        animate: "animate-"
      };
      const utils = catalog.utilities
        .map((u) => `\`${prefix[u.namespace] ?? ""}${u.name}\``)
        .join(" · ");
      const rows = tokens.map(
        (t) => `| \`${t.name}\` | ${t.group} | \`${t.light}\` | ${t.dark ? `\`${t.dark}\`` : "—"} |`
      );
      return text(`# Tokens Aura${group === "all" ? "" : ` — ${group}`}

Cores são canais HSL (\`H S% L%\`): use \`hsl(var(--aura-primary))\` ou \`hsl(var(--aura-primary) / 0.5)\`.

| Token | Grupo | Claro | Escuro (\`.dark\`) |
| --- | --- | --- | --- |
${rows.join("\n")}

## Utilities Tailwind (preset aura-ui-tailwind)
${utils}

Aceitam opacidade: \`bg-aura-primary/10\`, \`border-aura-border/60\`.

## Classes do core (CSS puro — não aceitam prefixos \`hover:\`/\`data-[x]:\` do Tailwind v4)
${catalog.classes.map((c) => `\`${c}\``).join(" · ")}`);
    }
  );

  return server;
}
