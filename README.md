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
| `aura-ui-cli` | CLI (`init`, `add`, `diff`, `theme`) — bin `aura` / `aura-ui` |

```bash
pnpm add aura-ui-core aura-ui-components aura-ui-effects
# opcional, só se quiser WebGL:
pnpm add aura-ui-three three @react-three/fiber
```

### Suíte 3D (effects)

- **Profundidade / interação:** `Card3D`, `LayeredCard`, `GlassCard`, `BentoGrid`/`BentoItem`, `Float`
- **Bordas / luz:** `MovingBorder`, `ShineBorder`, `BorderBeam`, `Spotlight`, `GlowOrb`
- **Background / scene:** `AuroraBackground`, `PerspectiveGrid`, `Meteors`, `Ripple`
- **Motion / listas:** `Marquee`, `OrbitingCircles`, `AnimatedBeam`, `BlurFade`, `NumberTicker`, `AnimatedShinyText`, `ShimmerButton`
- **Scroll / hero:** `HeroParallax`, `StickyScroll`

Todos: tipados, SSR-safe, `prefers-reduced-motion`, cores só via tokens `--aura-*`.

### CSS 3D (core)

`.aura-scene` · `.aura-layer` · `.aura-depth-1..5` · `.aura-glass` · `.aura-glass-specular` · `.aura-elevated` · `.aura-tilt` · `.aura-press`

### UI Kit (paridade Toolspace + extras — 51 componentes)

`Accordion` · `Alert` · `Avatar` · `Badge` · `Blockquote` · `Breadcrumb` · `Button` · `Card` · `Checkbox` · `CodeBlock` · `DataTable` · `Dialog` · `DropdownMenu` · `EmptyState` · `Input` · `Kbd` · `Label` · `Meter` · `Navbar` · `Pagination` · `Popover` · `Progress` · `RadioGroup` · `Rating` · `ScrollArea` · `Select` · `Separator` · `Sheet` · `Sidebar`/`AppShell` · `Skeleton` · `Slider` · `Spinner` · `Stat` · `Steps` · `Switch` · `Table` · `Tabs` · `TagsInput` · `Textarea` · `Timeline` · `Toast` · `Toggle`/`ToggleGroup` · `Tooltip` — todos com tokens `--aura-*` e elevação 3D opcional.

**Cada componente tem ≥5 variantes** misturando estilos limpos, 3D e animados. Exemplos: Button (9), Card (9), Input/Textarea (7 incl. `3d` com bevel físico), Table (6 incl. `glass` e `3d`), Spinner (5), Separator (5), Kbd (5), Avatar (5 anéis).

### Blocos de página (criação rápida de sites)

Monte uma landing/dashboard em minutos compondo:

`Hero` · `Section`/`Container`/`SectionHeading` · `FeatureGrid`/`FeatureCard` · `PricingCard`/`PricingGrid` · `CallToAction` · `Footer` (+ colunas/links) · `Steps` · `Timeline` · `Sidebar`/`AppShell` — todos com ≥5 variantes (clean, gradient, glass, aurora, glow, 3D…).

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
pnpm --filter aura build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js add button card card-3d
```

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
