---
name: aura-ui
description: Constrói e edita interfaces React com o design system Aura UI (pacotes aura-ui-components, aura-ui-effects, aura-ui-core, aura-ui-tailwind ou componentes copiados via aura-ui-cli). Use quando o projeto tiver dependências aura-ui-*, quando o usuário citar Aura UI, ou pedir telas, landing pages, dashboards, formulários, temas ou efeitos 3D com esses componentes.
---

# Aura UI

Design system React + Tailwind CSS v4: 73 componentes (Radix, acessíveis), 23 efeitos 3D/motion, 33 temas, tokens `--aura-*`.

## Antes de escrever código

1. **Descubra o modo do projeto** pelo `package.json`:
   - `aura-ui-components` nas dependências → **modo pacote**: importe de `"aura-ui-components"` (ou `"aura-ui-components/<nome>"`).
   - `aura.config.json` na raiz ou arquivos em `src/components/ui` → **modo CLI**: importe do arquivo local (`@/components/ui/button`) e edite-o se precisar.
   - Nenhum dos dois → chame a ferramenta MCP `get_setup` (com `framework` certo) e siga os passos.
2. **Não invente API.** Antes de usar um componente que você não viu nesta conversa, chame `get_component` (com `include_source: false` se só precisar de exports/uso). Para achar o componente certo: `list_components` com `query` (ex.: "select pesquisável", "upload", "modal confirmação").
3. Sem o servidor MCP disponível, leia o código em `node_modules/aura-ui-components/src/<nome>.tsx` (modo pacote) ou `src/components/ui/<nome>.tsx` (modo CLI).

## Regras do design system

- **Cores só por token**: `bg-aura-primary`, `text-aura-muted-foreground`, `border-aura-border`, `bg-aura-primary/10`… Nunca hex nem paleta do Tailwind (`slate-500`, `#7857FF`). Tokens e utilities: `get_design_tokens`.
- **Variantes antes de classes**: prefira `variant`/`size` dos componentes (`<Button variant="gradient" size="lg">`, `<Card variant="glass" padding="lg">`) a sobrescrever com `className`.
- **Classes CSS do core** (`aura-surface`, `aura-glass`, `aura-glass-dc`, `aura-gradient-primary`, `aura-bevel`, `aura-press`, `aura-tilt`…) **não aceitam** prefixos do Tailwind v4 (`hover:aura-glass` não gera nada). Para estados, use arbitrary values: `data-[state=on]:[background:var(--aura-gradient-primary)]`.
- **Superfícies dark-glass** (`glass-dc`, `glow`, `tilt`, variantes `glass` de vários componentes) têm texto branco — use sobre fundo escuro ou imagem.
- **Tailwind no modo pacote**: o CSS global precisa de `@import "aura-ui-tailwind";` **e** `@import "aura-ui-components/tailwind.css";` (+ `aura-ui-effects/tailwind.css` se usar efeitos). Sem isso os componentes ficam sem estilo.
- **Formulários**: envolva cada campo em `Field` + `FieldLabel` + `FieldControl` + `FieldError` (ids e ARIA automáticos). Erro de validação → `invalid` no `Field`.
- **Feedback**: `Button loading` para ações assíncronas; `toast.success()/toast.error()` (`ToastProvider` + `useToast`) para resultado; `AlertDialog` para confirmar ações destrutivas.
- **Acessibilidade**: botões só com ícone levam `aria-label`; não remova foco visível; animações já respeitam `prefers-reduced-motion`.
- **Next.js App Router**: componentes interativos já têm `"use client"`. `ThemeProvider` (`aura-ui-core/client`) vai num `providers.tsx` client.
- **Temas**: `data-theme="<nome>"` no `<html>` ou `ThemeProvider`; cor de marca própria = sobrescrever `--aura-primary` (canais HSL, ex.: `262 83% 58%`). Lista: `list_themes`.

## Escolhas rápidas

| Precisa de                 | Use                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| Modal / confirmação        | `Dialog` / `AlertDialog`                                                                                 |
| Painel lateral / mobile    | `Sheet` / `Drawer`                                                                                       |
| Select com busca, multi    | `Combobox` (`multiple`)                                                                                  |
| Paleta ⌘K                  | `CommandDialog`                                                                                          |
| Data / período             | `DatePicker` / `DateRangePicker`                                                                         |
| Upload                     | `FileUpload` + `FileUploadList`                                                                          |
| Tabela com busca/ordenação | `DataTable`                                                                                              |
| KPIs                       | `Stat` + `Sparkline` / `BarChart`                                                                        |
| Landing                    | `Navbar`, `Hero`, `FeatureGrid`, `PricingCard`, `TestimonialGrid`, `LogoCloud`, `CallToAction`, `Footer` |
| Dashboard                  | `AppShell` + `Sidebar` + `Stat` + charts                                                                 |
| Efeito 3D                  | `aura-ui-effects`: `Card3D`, `BentoGrid`, `Spotlight`, `Meteors`, `AuroraBackground`…                    |

Receitas completas (landing, dashboard, formulário com validação): [references/recipes.md](references/recipes.md).
