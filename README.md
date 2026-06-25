# Aura UI

Design system **3D standalone** — modelo shadcn (código no seu repo) + efeitos Magic/Aceternity tokenizados.

> Projeto separado do Toolspace. Plano completo em [`PLANO-DESIGN-SYSTEM-3D.md`](./PLANO-DESIGN-SYSTEM-3D.md).

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

| Fase | Status |
|------|--------|
| 0 — Fundação monorepo + tokens | ✅ |
| 1 — Primitivos + 5 efeitos + CLI mínima | ✅ |
| 2 — Cobertura shadcn completa | 🔲 |
| 3 — Efeitos avançados + @aura/three | 🔲 |
| 4 — Docs MDX + playground + diff | 🔲 |
| 5 — CI visual + npm publish | 🔲 |

## Licença

MIT
