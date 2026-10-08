# Plano — Design System 3D (projeto separado)

> **Objetivo:** criar uma biblioteca de UI standalone, instalável (`npm` + CLI estilo shadcn),
> com estética **3D moderna** (profundidade real, luz, vidro, parallax) que une e supera o melhor de
> **shadcn/ui** (acessibilidade + ownership do código), **Magic UI** (micro-animações/efeitos) e
> **Aceternity UI** (efeitos "wow" 3D/scroll). Nome de trabalho: **`Aura UI`** (ajustável).

---

## 1. Visão e princípios

| Referência        | O que herdamos                                                       | O que melhoramos                                                  |
| ----------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **shadcn/ui**     | Código copiado pro projeto (não black-box), Radix, a11y, `cn()`, CLI | Adicionamos camada 3D + tokens de profundidade e motion nativos   |
| **Magic UI**      | Catálogo de efeitos (shimmer, beams, marquee, spotlight)             | Tokenizados, com `prefers-reduced-motion` e SSR-safe por padrão   |
| **Aceternity UI** | Efeitos 3D, card tilt, background gradients, scroll reveal           | Performance (GPU/`will-change`), tipados, sem copiar-colar frágil |

**Princípios inegociáveis**

1. **Ownership** — `npx aura add button` copia o componente pro repo do usuário (como shadcn), não esconde em `node_modules`.
2. **3D real, não decorativo** — profundidade vem de tokens (`--elevation`, `--depth`, luz direcional), não de sombras aleatórias.
3. **Acessível por padrão** — Radix primitives, foco visível, `aria-*`, e **todo efeito respeita `prefers-reduced-motion`**.
4. **SSR-safe** — zero "flash", nada que dependa de `window` no primeiro paint; hidratação limpa.
5. **Performance first** — animações só em `transform`/`opacity`, `content-visibility`, lazy de efeitos pesados.
6. **Headless → Styled** — lógica separada do estilo; temas trocáveis por CSS vars.

---

## 2. Stack técnica

- **Monorepo:** pnpm workspaces + Turborepo
- **Build da lib:** `tsup` (ESM + CJS + types) / ou `unbuild`
- **Estilo:** Tailwind CSS v4 (engine CSS-first, `@theme`) + CSS variables como contrato de tema
- **Primitivos:** Radix UI (dialog, popover, select, tabs, tooltip, etc.)
- **Variantes:** `class-variance-authority` (cva) + `tailwind-merge` (`cn`)
- **Animação:** `motion` (framer-motion) para gestos/spring; CSS `@keyframes` para loops leves
- **3D:** CSS 3D transforms (perspective/tilt) como padrão; **opcional** `@react-three/fiber` num subpacote `@aura/three` para hero scenes
- **Docs:** Next.js (App Router) + MDX + preview ao vivo + bloco "copy code"
- **Qualidade:** TypeScript strict, ESLint, Vitest + Testing Library, **Storybook**, Chromatic (regressão visual), axe (a11y), Playwright (e2e dos exemplos)
- **CLI:** `aura` (Commander/clack) — `init`, `add`, `diff`, `theme`
- **Release:** Changesets + publish no npm + GitHub Releases

---

## 3. Estrutura do monorepo

```
aura-ui/
├── apps/
│   └── docs/                  # site de documentação (Next.js + MDX + playground)
├── packages/
│   ├── core/                  # tokens, css base, utils (cn), hooks, providers
│   ├── ui/                    # componentes (o que a CLI copia)
│   ├── effects/               # efeitos 3D/motion (Magic+Aceternity reimaginados)
│   ├── three/                 # (opcional) cenas r3f para heros
│   ├── cli/                   # binário `aura` (init/add/diff/theme)
│   └── tailwind-preset/       # preset Tailwind + plugin de tokens 3D
├── registry/                  # JSON da CLI (componentes, deps, arquivos) — modelo shadcn
├── examples/                  # apps de exemplo (landing, dashboard, saas)
├── turbo.json
└── pnpm-workspace.yaml
```

---

## 4. Camada de tokens 3D (o diferencial)

Contrato em CSS variables (`packages/core/styles/tokens.css`), tema trocável:

```css
:root {
  /* superfície / profundidade */
  --aura-surface: 0 0% 100%;
  --aura-elevation-0 ... --aura-elevation-5;   /* sombras em escala física */
  --aura-depth: 1px;                            /* unidade de translateZ */
  --aura-light-x: 50%; --aura-light-y: 0%;      /* direção da luz (highlight) */
  --aura-glass-blur: 12px; --aura-glass-alpha: .6;

  /* cor / brand */
  --aura-primary ... --aura-accent ... --aura-ring;

  /* motion */
  --aura-ease-spring: cubic-bezier(.22,1,.36,1);
  --aura-dur-fast: 120ms; --aura-dur: 240ms;
  --aura-perspective: 1000px; --aura-tilt-max: 12deg;

  /* raio */
  --aura-radius: .75rem;
}
.dark { /* overrides */ }
```

**Primitivas 3D reutilizáveis** (classes utilitárias do preset):

- `.aura-surface` — superfície com luz direcional + borda highlight (top) + sombra ambiente (bottom).
- `.aura-glass` — glassmorphism (backdrop-blur + borda interna luminosa).
- `.aura-tilt` — perspective + tilt no hover/pointer (com fallback reduced-motion).
- `.aura-press` — depressão Z no `:active` (feedback físico de botão).

Temas de marca = só sobrescrever as vars (igual ao padrão `--ts-*` que o Toolspace já usa, o que facilita um futuro consumo).

---

## 5. Catálogo de componentes (todos os "bases")

### 5.1 Primitivos / Form

- [ ] Button (variants: solid, soft, outline, ghost, glass, **3d** com `aura-press`)
- [ ] Input, Textarea, NumberField, OTP/PinInput
- [ ] Select, Combobox/Autocomplete, MultiSelect, Command (⌘K)
- [ ] Checkbox, Radio, Switch, Slider, Toggle / ToggleGroup
- [ ] Label, FormField (RHF + Zod), FieldError, Fieldset
- [ ] DatePicker, DateRange, TimePicker
- [ ] FileUpload / Dropzone, ColorPicker, TagsInput

### 5.2 Layout / Estrutura

- [ ] Box/Stack/Row/Grid/Container/Section
- [ ] Card (+ variantes glass/3d/spotlight), Surface, Panel
- [ ] Separator, AspectRatio, ScrollArea, Resizable, Splitter
- [ ] Sidebar/AppShell, Navbar, Breadcrumb, Pagination

### 5.3 Overlays

- [ ] Dialog/Modal, Drawer/Sheet, Popover, Tooltip, HoverCard
- [ ] DropdownMenu, ContextMenu, Menubar
- [ ] Toast/Sonner, AlertDialog, CommandPalette

### 5.4 Data display

- [ ] Table + DataTable (sort/filter/paginação/seleção — TanStack Table)
- [ ] Tabs, Accordion, Collapsible, Disclosure
- [ ] Avatar/AvatarGroup, Badge, Chip, Tag, Kbd
- [ ] Progress, Spinner, Skeleton, Meter, Stat/KPI
- [ ] Timeline, Tree, Calendar, EmptyState
- [ ] Carousel (Embla), Charts (wrapper sobre Recharts/visx)

### 5.5 Feedback / Status

- [ ] Alert/Callout, Banner, Toast, Loading states, ErrorState

> Meta de cobertura: **paridade com shadcn/ui** + extras (Combobox, DataTable, Command, AppShell prontos).

---

## 6. Catálogo de efeitos 3D (supera Magic + Aceternity)

`packages/effects` — cada um: tipado, SSR-safe, `prefers-reduced-motion`, lazy quando pesado.

**3D / pointer**

- [ ] `Card3D` / `TiltCard` — tilt com glare/holographic (Aceternity-class, mas tokenizado)
- [ ] `Spotlight` / `MagicCard` — gradiente seguindo o cursor + borda luminosa
- [ ] `MovingBorder` / `ShineBorder` / `BorderBeam`
- [ ] `GlowCard`, `GlassCard`, `LayeredCard` (parallax de camadas internas)

**Texto**

- [ ] `AnimatedShinyText`, `TextShimmer`, `GradientText`
- [ ] `TextReveal` (scroll), `Typewriter`, `SplitText` / `WordRotate`, `NumberTicker`

**Background**

- [ ] `AuroraBackground`, `BackgroundBeams`, `GridPattern` / `DotPattern`
- [ ] `Meteors`, `Particles`, `Ripple`, `WarpGrid`, `Spotlight` global

**Movimento / listas**

- [ ] `Marquee` (logos), `AnimatedList`, `OrbitingCircles`, `AnimatedBeam` (conectar nós)
- [ ] `Dock` (macOS-like), `BentoGrid`, `Lamp` header, `HeroParallax`

**Scroll**

- [ ] `ScrollReveal`, `StickyScroll`, `ContainerScroll` (laptop/phone mock), `Parallax`

> Cada efeito tem prop `as`/`asChild` e degradação graciosa: sem JS = layout estático válido.

---

## 7. CLI `aura` (modelo shadcn, melhorado)

```bash
npx aura init           # cria aura.config.json, instala deps, injeta tokens.css + preset
npx aura add button card tilt-card     # copia componentes + resolve deps do registry
npx aura add --all                      # tudo
npx aura diff button     # mostra updates upstream vs. sua cópia (feature que falta no shadcn clássico)
npx aura theme           # gerador de tema (escolhe brand/raio/elevação) -> escreve tokens
```

- `aura.config.json`: aliases (`@/components/ui`), estilo, base color, RSC, ícones.
- `registry/`: JSON por componente (`files`, `dependencies`, `registryDependencies`).
- **`diff`** resolve a maior dor do shadcn (componentes copiados ficam órfãos de updates).

---

## 8. Documentação (apps/docs)

- Landing usando os **próprios** efeitos (dogfooding = melhor demo).
- Página por componente: preview ao vivo, tabs **Preview / Code**, copy, props table (gerada dos types), exemplos de variantes, nota de a11y, toggle reduced-motion, theme switcher.
- Playground interativo (editar props e ver em tempo real).
- Guia: instalação, tokens, temas, dark mode, migração de shadcn → aura.

---

## 9. Qualidade, a11y e performance

- **A11y:** Radix + testes axe automatizados; foco, navegação por teclado, `aria` em cada componente.
- **Motion:** hook `useReducedMotion`; nenhum efeito essencial depende de animação.
- **SSR/Hydration:** sem leitura de `window` no primeiro render; `suppressHydrationWarning` só onde necessário.
- **Perf:** animar só `transform`/`opacity`; `content-visibility`; efeitos pesados via `dynamic import`; budget de bundle por componente.
- **Testes:** unit (Vitest), visual (Storybook + Chromatic), e2e (Playwright nos examples).
- **Tipos:** strict, sem `any` público; props documentadas via JSDoc.

---

## 10. Roadmap por fases

**Fase 0 — Fundação (semana 1)**

- Monorepo (pnpm + turbo), `core` (cn, tokens.css, ThemeProvider), `tailwind-preset` com utilitários 3D, Storybook.

**Fase 1 — Primitivos + 5 efeitos âncora (sem 2–3)**

- Button/Input/Card/Dialog/Tabs/Select/Tooltip + `Card3D`, `Spotlight`, `ShineBorder`, `AnimatedShinyText`, `AuroraBackground`.
- CLI mínima (`init`, `add`) + registry.

**Fase 2 — Cobertura completa de componentes (sem 4–6)**

- Form completo, DataTable, Command, AppShell, overlays, data display.

**Fase 3 — Efeitos avançados + 3D real (sem 7–8)**

- Aceternity-class (HeroParallax, StickyScroll, BentoGrid, AnimatedBeam) + subpacote `@aura/three`.

**Fase 4 — Docs + DX (sem 9–10)**

- Site de docs, props auto, playground, `aura diff`, `aura theme`, guia de migração.

**Fase 5 — Polimento + release (sem 11–12)**

- Chromatic/axe/Playwright em CI, Changesets, `v0.1.0` no npm, landing pública.

---

## 11. Decisões em aberto (precisam de input)

1. **Nome/escopo npm** — `@aura/ui`? (verificar disponibilidade)
2. **3D via CSS only** por padrão e r3f opcional — confirmar (recomendado: sim, perf).
3. **Tailwind v4** (CSS-first) vs v3 — recomendado v4.
4. **Compat com Toolspace** — alinhar tokens `--aura-*` ao `--ts-*` para reuso futuro? (recomendado: sim, mapeamento direto).

---

## 12. Critérios de "pronto" (Definition of Done por componente)

- [ ] Variantes via cva + tokens (zero cor hardcoded)
- [ ] Dark mode + tema trocável funcionando
- [ ] A11y validada (axe + teclado)
- [ ] `prefers-reduced-motion` respeitado
- [ ] SSR sem flash/hydration warning
- [ ] Story + exemplo na doc + entrada no registry da CLI
- [ ] Testes unit + (visual se houver animação)

```

```
