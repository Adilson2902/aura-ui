# Aura UI

Design system **3D standalone** — modelo shadcn (código no seu repo) + DaisyUI (temas por CSS vars) + efeitos Magic UI / Aceternity tokenizados.

> Projeto separado do Toolspace. Plano completo em [`PLANO-DESIGN-SYSTEM-3D.md`](./PLANO-DESIGN-SYSTEM-3D.md).

## Pacotes npm

| Pacote | O que é |
| --- | --- |
| `aura-ui-core` | tokens 3D, temas, `cn`, ThemeProvider, `useReducedMotion` |
| `aura-ui-components` | primitivos + charts (Button, Stat, DonutChart, Toast, …) |
| `aura-ui-effects` | suíte de efeitos 3D/motion (CSS-first) |
| `aura-ui-three` | cenas WebGL opcionais (React Three Fiber) |
| `aura-ui-tailwind` | preset Tailwind v4 + utilities 3D |
| `aura-ui-cli` | CLI (`init`, `add`, `diff`, `theme`) — bin `aura-ui-cli` / `aura` / `aura-ui` |
| `aura-ui-mcp` | servidor MCP p/ assistentes de IA (catálogo, código, temas, setup) |

```bash
pnpm add aura-ui-core aura-ui-components aura-ui-effects aura-ui-tailwind tailwindcss
# opcional, só se quiser WebGL:
pnpm add aura-ui-three three @react-three/fiber
```

No CSS do app (substitui o `@import "tailwindcss"`):

```css
@import "aura-ui-tailwind"; /* Tailwind + tokens + primitivas 3D + temas */
@import "aura-ui-components/tailwind.css"; /* registra as classes dos componentes */
@import "aura-ui-effects/tailwind.css";
```

O Tailwind v4 não escaneia `node_modules`, por isso cada pacote traz um `tailwind.css` com `@source` relativo a ele mesmo (funciona com npm, pnpm e yarn).

### Suíte 3D (effects)

- **Profundidade / interação:** `Card3D`, `LayeredCard`, `GlassCard`, `BentoGrid`/`BentoItem`, `Float`
- **Bordas / luz:** `MovingBorder`, `ShineBorder`, `BorderBeam`, `Spotlight`, `GlowOrb`
- **Background / scene:** `AuroraBackground`, `PerspectiveGrid`, `Meteors`, `Ripple`
- **Motion / listas:** `Marquee`, `OrbitingCircles`, `AnimatedBeam`, `BlurFade`, `NumberTicker`, `AnimatedShinyText`, `ShimmerButton`
- **Scroll / hero:** `HeroParallax`, `StickyScroll`

Todos: tipados, SSR-safe, `prefers-reduced-motion`, cores só via tokens `--aura-*`.

### CSS 3D (core)

`.aura-scene` · `.aura-layer` · `.aura-depth-1..5` · `.aura-glass` · `.aura-glass-specular` · `.aura-elevated` · `.aura-tilt` · `.aura-press`

### UI Kit (paridade shadcn/Toolspace + extras — 73 componentes)

`Accordion` · `Alert` · `AlertDialog` · `AspectRatio` · `Avatar`/`AvatarGroup` · `Badge` · `Banner` · `Blockquote` · `Breadcrumb` · `Button` · `ButtonGroup` · `Calendar` · `Card` · `Carousel` · `Checkbox` · `CodeBlock` · `Collapsible` · `Combobox` · `Command` · `ContextMenu` · `CopyButton` · `DataTable` · `DatePicker`/`DateRangePicker` · `Dialog` · `Drawer` · `DropdownMenu` · `EmptyState` · `Field` · `FileUpload` · `HoverCard` · `Input` · `InputGroup` · `InputOTP` · `Kbd` · `Label` · `Meter` · `Navbar` · `NumberInput` · `Pagination` · `Popover` · `Progress` · `RadioGroup`/`RadioGroupCard` · `Rating` · `ScrollArea` · `Select` · `Separator` · `Sheet` · `Sidebar`/`AppShell` · `Skeleton` · `Slider` · `Spinner` · `Stat` · `Steps` · `Switch` · `Table` · `Tabs` · `TagsInput` · `Textarea` · `Timeline` · `Toast` · `Toggle`/`ToggleGroup` · `Tooltip` · `Typography` (`Heading`/`Text`/`Prose`) — todos com tokens `--aura-*` e elevação 3D opcional.

**Novidades da v3**

- **Overlays animados de verdade** — Dialog, Sheet, Drawer, Popover, Tooltip, Select, menus e HoverCard animam entrada **e saída** via classes do core (`aura-pop`, `aura-overlay`, `aura-sheet`), sem plugin extra e respeitando `prefers-reduced-motion`.
- **Formulários** — `Field` liga label/descrição/erro com ARIA automático (pronto p/ react-hook-form + zod); `InputGroup`, `InputOTP`, `NumberInput`, `FileUpload`, `Combobox` (simples/múltiplo) e `DatePicker` sem dependências de data.
- **APIs mais maleáveis** — `Button` com `loading`, `leftIcon`/`rightIcon`, `fullWidth`, 8 tamanhos e variantes `destructive`/`accent`/`link`; `Card` com `padding`, `interactive`, `asChild` e `CardAction`; `size` em Input/Select/Badge/Switch/Checkbox/Radio; `Tabs` com 5 estilos e orientação vertical; `Accordion` com 4 estilos; `Toast` com 6 posições, ações e `toast.success()`.

```tsx
<Field invalid={!!errors.email} required>
  <FieldLabel>E-mail</FieldLabel>
  <FieldControl>
    <Input {...register("email")} />
  </FieldControl>
  <FieldError>{errors.email?.message}</FieldError>
</Field>

<Button loading={isSubmitting} loadingText="Salvando…" leftIcon={<SaveIcon />}>Salvar</Button>
```

**Cada componente tem ≥5 variantes** misturando estilos limpos, 3D e animados. Exemplos: Button (9), Card (9), Input/Textarea (7 incl. `3d` com bevel físico), Table (6 incl. `glass` e `3d`), Spinner (5), Separator (5), Kbd (5), Avatar (5 anéis).

### Blocos de página (criação rápida de sites)

Monte uma landing/dashboard em minutos compondo:

`Hero` · `Section`/`Container`/`SectionHeading` · `FeatureGrid`/`FeatureCard` · `PricingCard`/`PricingGrid` · `CallToAction` · `TestimonialCard`/`TestimonialGrid` · `LogoCloud` (grid ou marquee) · `Banner` · `Footer` (+ colunas/links) · `Steps` · `Timeline` · `Sidebar`/`AppShell` — todos com ≥5 variantes (clean, gradient, glass, aurora, glow, 3D…).

```tsx
import { Hero, HeroContent, HeroTitle, HeroActions, Button, FeatureGrid, FeatureCard, CallToAction } from "aura-ui-components";

<Hero variant="aurora">
  <HeroContent>
    <HeroTitle gradient>Sites em minutos</HeroTitle>
    <HeroActions><Button variant="3d">Começar</Button></HeroActions>
  </HeroContent>
</Hero>
```

### Charts (SVG zero-dep)

`BarChart` · `LineChart` · `MultiLineChart` · `DonutChart` · `Sparkline` · `RadialProgress` · `ChartFrame`

```tsx
import { DonutChart, ThemeSwitcher } from "aura-ui-components";

<DonutChart title="Mix" data={[{ label: "Pro", value: 48 }, { label: "Team", value: 32 }]} />;
```

### Temas (33 + light/dark)

Claros: `aura` · `ocean` · `forest` · `sunset` · `rose` · `nord` · `mocha` · `amber` · `emerald` · `cherry` · `lavender` · `arctic` · `desert` · `mint` · `steel` · `peach` · `indigo` · `lime` · `sakura` · `aqua` · `candy` · `mono` · `bubblegum` · `caramel`
Escuros: `midnight` · `cyber` · `synthwave` · `matrix` · `volcano` · `grape` · `obsidian` · `solar` · `terminal`

```tsx
import { ThemeProvider, useTheme } from "aura-ui-core/client";

<html data-theme="ocean">  // ou use <ThemeSwitcher />
```

## Requisitos

- Node 20+
- [pnpm](https://pnpm.io) 9+

## Início rápido

```bash
cd ~/Documents/aura-ui
pnpm install
pnpm build
pnpm dev
```

Docs: [http://localhost:3000](http://localhost:3000)

Storybook: [http://localhost:6006](http://localhost:6006)

```bash
pnpm storybook          # dev
pnpm build:storybook      # estático em apps/storybook/storybook-static
```

## Estrutura

```
aura-ui/
├── apps/docs          # documentação + dogfooding
├── packages/
│   ├── core           # cn, tokens, ThemeProvider, useReducedMotion
│   ├── ui             # Button, Card, Input
│   ├── effects        # Card3D, Spotlight, ShineBorder, ...
│   ├── tailwind-preset
│   ├── cli            # binário `aura`
│   └── three          # (opcional) R3F — Fase 3
├── registry/          # JSON + fontes para a CLI
└── examples/
```

## CLI

```bash
npx aura-ui-cli init
npx aura-ui-cli add button card card-3d
```

No monorepo: `pnpm --filter aura-ui-cli build` e `node packages/cli/dist/index.js add button`. O build copia o `registry/` para dentro do pacote do CLI, que é o que vai para o npm.

O `add` resolve as dependências entre componentes (ex.: `combobox` → `popover` + `command`) e mostra o `pnpm add` com os pacotes npm necessários.

O registry (`registry/`) é gerado a partir de `packages/*/src` — depois de mexer em componentes rode `pnpm registry:sync` (o `release` falha via `pnpm registry:check` se estiver desatualizado).

## IA: MCP, plugin e skills

Para o seu assistente de IA gerar telas com o Aura UI usando a API real (sem inventar props):

**Claude Code** — plugin com o servidor MCP + skill com as regras do design system:

```text
/plugin marketplace add Adilson2902/aura-ui
/plugin install aura-ui@aura-ui
```

**Qualquer cliente MCP** (Claude Desktop, Cursor, VS Code…):

```json
{ "mcpServers": { "aura-ui": { "command": "npx", "args": ["-y", "aura-ui-mcp@latest"] } } }
```

O servidor expõe `list_components`, `get_component`, `get_setup`, `list_themes` e `get_design_tokens` — detalhes em [`packages/mcp`](packages/mcp/README.md).

| Onde | O que é |
| --- | --- |
| `packages/mcp` | servidor MCP `aura-ui-mcp` (npm) — catálogo gerado do `registry/` no build |
| `.claude-plugin/marketplace.json` + `plugins/aura-ui` | marketplace e plugin do Claude Code (MCP + skill `aura-ui`) |
| `.claude/skills/aura-ui-contrib` | skill de projeto p/ quem contribui com este repositório |

## Roadmap

| Fase                                    | Status |
| --------------------------------------- | ------ |
| 0 — Fundação monorepo + tokens          | ✅     |
| 1 — Primitivos + 5 efeitos + CLI mínima | ✅     |
| 2 — Cobertura shadcn completa           | ✅     |
| 3 — Efeitos avançados + aura-ui-three     | ✅     |
| 4 — Docs MDX + playground + diff        | 🔲     |
| 5 — CI visual + npm publish             | 🧪     |

> **Fase 3** entregou a suíte 3D (`LayeredCard`, `GlassCard`, `MovingBorder`, `BentoGrid`, `OrbitingCircles`, `AnimatedBeam`, `HeroParallax`, `StickyScroll`, `Meteors`, `PerspectiveGrid`, `Float`) + `aura-ui-three` (`AuraCanvas`, `FloatingMesh`, `ParticleField`, `HeroScene`).
> **Fase 5** está em preparação: metadata npm, Changesets, multi-entry exports e `npm pack` validado. Publish real depende de `npm login` + escopo no registry.

## Licença

MIT

## Catálogo interativo

A página de documentação reúne nove demonstrações nas categorias Efeitos, Interface,
Formulários e Dados, com busca, temas claro/escuro e exemplos de composição copiáveis.
O formulário usa dados locais de demonstração, sem envio para um servidor.

### Data Table

Disponível em `aura-ui-components/data-table` e no Storybook em **UI / Data Table**.
A tabela oferece busca em todos os campos, ordenação numérica/textual, seleção entre
páginas, controle de colunas, paginação e CSV. A exportação usa todos os registros
selecionados; sem seleção, usa os resultados da busca e a ordenação atual. Apenas
colunas visíveis são exportadas. O catálogo também demonstra filtro por status.

```tsx
import { DataTable, type DataTableColumn } from "aura-ui-components/data-table";

type Cliente = { id: string; nome: string; total: number };
const columns: DataTableColumn<Cliente>[] = [
  { id: "nome", header: "Nome", accessor: (row) => row.nome },
  { id: "total", header: "Total", accessor: (row) => row.total }
];

<DataTable
  data={[{ id: "1", nome: "Ana", total: 249 }]}
  columns={columns}
  getRowId={(row) => row.id}
  caption="Clientes"
  pageSize={5}
/>;
```

Use identificadores de linha únicos e estáveis. Busca, ordenação e paginação são
locais; para grandes volumes ou dados remotos, a integração com servidor deve ser
implementada pelo aplicativo consumidor.
