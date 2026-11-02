---
name: aura-ui-contrib
description: Convenções para contribuir com o monorepo Aura UI — criar ou alterar componentes em packages/ui, packages/effects ou packages/native (React Native), tokens/temas no core, registry do CLI, catálogo do MCP, stories, testes e release no npm. Use ao editar qualquer coisa em packages/, registry/, scripts/ ou plugins/ deste repositório.
---

# Contribuindo com o Aura UI

Monorepo pnpm (Node ≥ 20). Pacotes publicados (versão única, grupo `fixed` do changesets):
`aura-ui-core` · `aura-ui-components` (packages/ui) · `aura-ui-effects` · `aura-ui-three` · `aura-ui-tailwind` (packages/tailwind-preset) · `aura-ui-cli` · `aura-ui-mcp` · `aura-ui-native` (React Native).

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

## Componente React Native (packages/native)

- `packages/native/src/components/<nome>.tsx`; só `react` + `react-native` (zero deps nativas — Expo Go). Exporte em `src/index.ts`.
- Tema via `useAura()` (`t.colors`, `t.space(n)` = n×4px, `t.radius`, `t.shadow(0–5)`, `t.alpha`); nada de hex.
- Com ref: `export const X: RefComponent<XProps> = React.forwardRef<ViewRef, XProps>(…)` + `displayName` — sem a anotação, o .d.ts vaza tipos internos do RN (`grep -c ReactNativeElement dist/index.d.ts` tem que dar 0).
- Acessibilidade com `role`/`aria-*`, alvo de toque ≥ 44px, `NATIVE_DRIVER` em todo `Animated`, estado controlado/não-controlado com `useControllableState` (`form-utils`).
- As paletas vêm do CSS do core (`pnpm --filter aura-ui-native themes` regenera `palettes.generated.ts`) — mudou tema no core, rode isso.
- Testes: `src/**/*.test.tsx` (react-native-web + jsdom); story em `apps/storybook/stories/native/` com o decorator `withPhone`.
- Novo arquivo → resumo em `NATIVE_SUMMARIES` do `packages/mcp/scripts/build-catalog.mjs` (helpers internos ficam fora do catálogo).

## Verificar

```bash
pnpm --filter aura-ui-components lint      # tsc
pnpm test                                  # core, ui, effects, mcp, native
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
