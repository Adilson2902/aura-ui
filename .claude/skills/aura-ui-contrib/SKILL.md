---
name: aura-ui-contrib
description: Convenções para contribuir com o monorepo Aura UI — criar ou alterar componentes em packages/ui ou packages/effects, tokens/temas no core, registry do CLI, catálogo do MCP, stories, testes e release no npm. Use ao editar qualquer coisa em packages/, registry/, scripts/ ou plugins/ deste repositório.
---

# Contribuindo com o Aura UI

Monorepo pnpm (Node ≥ 20). Pacotes publicados (versão única, grupo `fixed` do changesets):
`aura-ui-core` · `aura-ui-components` (packages/ui) · `aura-ui-effects` · `aura-ui-three` · `aura-ui-tailwind` (packages/tailwind-preset) · `aura-ui-cli` · `aura-ui-mcp`.

## Novo componente em packages/ui

1. `packages/ui/src/<nome-kebab>.tsx`, seguindo o estilo dos vizinhos:
   - `"use client"` se usar hooks/Radix; `import { cn } from "aura-ui-core"`.
   - Variantes com `cva` e export `xxxVariants`; `React.forwardRef` + `displayName`; JSDoc curto em português acima do componente principal (vira a descrição no MCP).
   - **Só tokens**: `bg-aura-*`, `text-aura-*`, `border-aura-*`, `shadow-aura-*`. Nada de hex nem paleta Tailwind — `src/variants.test.ts` e `src/v3.test.ts` reprovam.
   - Classes do core (`aura-glass`, `aura-gradient-primary`, `aura-bevel`…) são CSS puro: **nunca** com prefixo (`hover:aura-glass` é ignorado pelo Tailwind v4). Use `data-[x]:[background:var(--aura-gradient-primary)]`.
   - Overlays animam com as classes do core por `data-state`: `aura-pop` (conteúdo/popper, + `origin-(--radix-…-transform-origin)`), `aura-overlay` (backdrop), `aura-sheet` + `data-side` (painéis), `aura-expandable` (accordion/collapsible). Não use `animate-in`/`slide-in-*` (plugin não instalado).
   - Componentes visuais: ≥ 5 variantes (contrato do catálogo). Textos acessíveis customizáveis por prop, padrão em português.
2. Exporte em `packages/ui/src/index.ts` (componentes, variants e tipos).
3. Entrada em `exports` do `packages/ui/package.json` (`"./<nome>": { types, import }`). O `tsup` já pega todo `src/*.tsx`.
4. Nova dependência Radix/npm → `pnpm --filter aura-ui-components add <pkg>` **e** adicione em `external` do `packages/ui/tsup.config.ts`.
5. Story em `apps/storybook/stories/<nome>.stories.tsx` (`title: "UI/<Nome>"`, import via alias `@aura/ui/<nome>`).
6. Catálogo do MCP: categoria em `CATEGORIES` e resumo de uma linha em `SUMMARIES` (`packages/mcp/scripts/build-catalog.mjs`) — os testes do MCP falham sem isso.
7. `pnpm registry:sync` (copia p/ `registry/` e recalcula dependências do `aura add`).

Efeitos seguem o mesmo fluxo em `packages/effects/src` (exports por arquivo no `package.json` do effects).

## Verificar

```bash
pnpm --filter aura-ui-components lint      # tsc
pnpm test                                  # core, ui, effects, mcp
pnpm registry:check
pnpm --filter aura-ui-mcp build            # regenera o catálogo do MCP
pnpm storybook                             # conferência visual (porta 6006)
```

O Tailwind de apps (docs/storybook) e de consumidores só gera classes registradas por `@import "aura-ui-components/tailwind.css"` — se um estilo novo não aparece, confira se o arquivo está em `src/`.

## Release

1. `pnpm changeset` (patch/minor) → descreva em português.
2. `pnpm version-packages` → bump do grupo + CHANGELOGs. Revise e commite.
3. `pnpm build:all` e `node scripts/publish-all.cjs` (usa `pnpm publish`, que troca `workspace:*` pela versão real; pula versões já publicadas).
4. Tags `<pacote>@<versão>` e `v<versão>` no commit publicado; atualize `version` em `.claude-plugin/marketplace.json` e `plugins/aura-ui/.claude-plugin/plugin.json`.

A `master` é protegida (ruleset): só o mantenedor envia direto; contribuições externas entram por PR de fork com revisão do code owner.
