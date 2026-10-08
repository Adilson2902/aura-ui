# Publicar no npm

Pacotes **públicos no npm são gratuitos**. Conta em https://www.npmjs.com/signup.

## Status

| Item | Estado |
| --- | --- |
| Escopo `@aura` | ❌ ocupado (org de terceiros) |
| Pacote `aura` / `aura-ui` (sem escopo) | ❌ ocupados |
| Escopo `@adilsonmatos/*` | ✅ livre (renomeado aqui) |
| Build + testes + npm pack | ✅ ok |
| Login npm | ⏳ `npm login` |

## Passos (só você)

```bash
# 1) Conta + login (navegador abre)
npm login

# 2) Criar a org gratuita "aura-ui" (uma vez)
#    https://www.npmjs.com/org/create  → nome: aura-ui → plan: Free
#    (se preferir @seuusuario/aura-*, me avisa que eu renomeio)

# 3) Publicar
pnpm publish:all
```

O script `scripts/publish-all.cjs` publica na ordem:
`core` → `tailwind-preset` → `ui` → `effects` → `three` → `cli`.

## Consumo

```bash
pnpm add aura-ui-core aura-ui-components aura-ui-effects
```
