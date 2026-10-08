# aura-ui-cli

CLI do **Aura UI** (modelo shadcn): `init`, `add`, `diff`, `theme`.

## Instalação / uso

```bash
npx aura-ui-cli init
npx aura-ui-cli add button card card-3d
npx aura-ui-cli add --all
npx aura-ui-cli diff button
npx aura-ui-cli theme
```

Binários: `aura` e `aura-ui` (mesmo CLI).

## Comandos

| Comando | O que faz |
| --- | --- |
| `init` | Cria `aura.config.json`, injeta tokens + preset |
| `add [componentes...]` | Copia componentes do registry para o seu repo |
| `add --all` | Tudo |
| `diff <componente>` | Mostra diferenças vs. registry |
| `theme` | Gera overrides de tokens de marca |

## Exemplo

```bash
npx aura-ui-cli init
npx aura-ui-cli add button glass-card stat
```

Os arquivos caem no seu projeto (ownership do código — você edita).

## Registro

Category: `registry:ui` · `registry:effect` · `registry:lib`

**MIT**
