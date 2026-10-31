# aura-ui-core

## 0.2.1

### Patch Changes

- Links do npm e READMEs corrigidos

  - `repository`, `homepage` e `bugs` apontavam para `github.com/aura-ui/aura-ui`, que redireciona para outro projeto (ora-ui). Agora apontam para `github.com/Adilson2902/aura-ui` (homepage = pasta do pacote).
  - READMEs atualizados: `aura-ui-components` com o catálogo completo (73 componentes) e a instalação com `tailwind.css`; 33 temas no core/preset; bin `aura-ui-cli`; links para o repositório.
  - CLI: `aura init` não grava mais `$schema: https://aura-ui.dev/schema.json` (domínio inexistente); `homepage` do registry aponta para o GitHub.

## 0.2.0

### Minor Changes

- 0c74e60: Catálogo v2 — 33 temas, 51 componentes e blocos de página

  - **33 temas** `data-theme` (23 novos: amber, emerald, cherry, lavender, matrix, arctic, desert, volcano, grape, mint, steel, peach, indigo, lime, sakura, obsidian, solar, aqua, candy, mono, terminal, bubblegum, caramel) + `AURA_DARK_THEMES`, `AURA_THEME_LABELS` e `isDarkTheme()` no core
  - **15 novos componentes de página**: Hero, Section/Container/SectionHeading, FeatureGrid/FeatureCard, PricingCard/PricingGrid, CallToAction, Footer, Sidebar/SidebarItem/AppShell, Steps, Timeline, Rating, TagsInput, Meter, CodeBlock, Blockquote, Toggle/ToggleGroup
  - **Variantes ≥5 em tudo** (limpas, 3D, animadas): Input/Textarea 7 (incl. `3d` com bevel), Card 9, Table 6 (`clean`, `striped`, `bordered`, `glass`, `3d`), Spinner 5 (`dots`, `bars`, `pulse`, `gradient`), Kbd 5, Separator 5, Avatar 5 anéis
  - **Fix**: `themes.css` agora é importado pelo preset (`data-theme` antes não tinha efeito); ThemeProvider usa conjunto dinâmico de temas escuros; ThemeSwitcher usa labels do core
  - Registry: 76 itens (61 → 76); Storybook: stories "Page Blocks" + "Theme Gallery"; testes de contrato (≥5 variantes, temas com bloco CSS completo)

- 364dc9c: Catálogo v3 — 22 componentes novos, overlays animados e APIs mais flexíveis

  - **22 novos componentes**: AlertDialog, HoverCard, ContextMenu, Collapsible, Command/CommandDialog (cmdk), Combobox (simples/múltiplo), Drawer (arrastar p/ fechar), Field (label/descrição/erro com ARIA automático), InputGroup, InputOTP, NumberInput, FileUpload, Calendar (single/range, sem deps), DatePicker/DateRangePicker, ButtonGroup, AspectRatio, CopyButton, Typography (Heading/Text/InlineCode/Prose), Banner, Carousel (scroll-snap, sem deps), TestimonialCard/TestimonialGrid, LogoCloud (grid/marquee)
  - **Core**: animações de overlay por `data-state` (`aura-overlay`, `aura-pop`, `aura-sheet`, `aura-expandable`, `aura-toast`) com saída animada e `prefers-reduced-motion`
  - **Fix**: Dialog/Sheet/Popover/Menu/Select/Tooltip não animavam (classes `animate-in` de um plugin não instalado / transições que o Radix não espera); Accordion, Toggle `gradient` e Rating `gradient` usavam variantes Tailwind em classes CSS puras (ignoradas pelo Tailwind v4); seta do Tooltip era cortada; Toast semântico era transparente sobre a página
  - **APIs**: Button (`loading`, `loadingText`, `leftIcon`/`rightIcon`, `fullWidth`, tamanhos `xs`/`xl`/`icon-sm`/`icon-lg`, variantes `accent`/`destructive`/`link`); Card (`padding`, `interactive`, `asChild`, `CardAction`); `size` em Input/Select/Badge/Switch/Checkbox/Radio; Dialog/Sheet (`size`, `showClose`, `closeLabel`); Tabs (5 estilos + vertical); Accordion (4 estilos); Toast (6 posições, ações, `toast.success/error/warning/info`, pausa no hover); Avatar (`shape`, `AvatarGroup`); Checkbox indeterminado; `RadioGroupCard`; `SimpleTooltip`; `SelectSeparator`
  - **Tailwind preset**: `aura-destructive-foreground`, `shadow-aura-4`/`shadow-aura-5`
  - **Registry/CLI**: 40 arquivos do registry eram `export *` relativos ao monorepo (quebravam no `aura add`) — agora `pnpm registry:sync` gera cópias completas e deps reais (98 itens); arquivos `lib` vão p/ `aliases.lib`; `aura add` lista o `pnpm add` necessário
