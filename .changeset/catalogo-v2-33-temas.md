---
"aura-ui-core": minor
"aura-ui-components": minor
"aura-ui-tailwind": patch
---

Catálogo v2 — 33 temas, 51 componentes e blocos de página

- **33 temas** `data-theme` (23 novos: amber, emerald, cherry, lavender, matrix, arctic, desert, volcano, grape, mint, steel, peach, indigo, lime, sakura, obsidian, solar, aqua, candy, mono, terminal, bubblegum, caramel) + `AURA_DARK_THEMES`, `AURA_THEME_LABELS` e `isDarkTheme()` no core
- **15 novos componentes de página**: Hero, Section/Container/SectionHeading, FeatureGrid/FeatureCard, PricingCard/PricingGrid, CallToAction, Footer, Sidebar/SidebarItem/AppShell, Steps, Timeline, Rating, TagsInput, Meter, CodeBlock, Blockquote, Toggle/ToggleGroup
- **Variantes ≥5 em tudo** (limpas, 3D, animadas): Input/Textarea 7 (incl. `3d` com bevel), Card 9, Table 6 (`clean`, `striped`, `bordered`, `glass`, `3d`), Spinner 5 (`dots`, `bars`, `pulse`, `gradient`), Kbd 5, Separator 5, Avatar 5 anéis
- **Fix**: `themes.css` agora é importado pelo preset (`data-theme` antes não tinha efeito); ThemeProvider usa conjunto dinâmico de temas escuros; ThemeSwitcher usa labels do core
- Registry: 76 itens (61 → 76); Storybook: stories "Page Blocks" + "Theme Gallery"; testes de contrato (≥5 variantes, temas com bloco CSS completo)
