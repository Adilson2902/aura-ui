# aura-ui-effects

## 0.2.1

### Patch Changes

- Links do npm e READMEs corrigidos

  - `repository`, `homepage` e `bugs` apontavam para `github.com/aura-ui/aura-ui`, que redireciona para outro projeto (ora-ui). Agora apontam para `github.com/Adilson2902/aura-ui` (homepage = pasta do pacote).
  - READMEs atualizados: `aura-ui-components` com o catálogo completo (73 componentes) e a instalação com `tailwind.css`; 33 temas no core/preset; bin `aura-ui-cli`; links para o repositório.
  - CLI: `aura init` não grava mais `$schema: https://aura-ui.dev/schema.json` (domínio inexistente); `homepage` do registry aponta para o GitHub.

- Updated dependencies
  - aura-ui-core@0.2.1

## 0.2.0

### Correções de empacotamento (npm)

- Novo `aura-ui-effects/tailwind.css` com `@source` dos efeitos, para o Tailwind v4 gerar as classes quando instalado como pacote.

### Patch Changes

- Updated dependencies [0c74e60]
- Updated dependencies [364dc9c]
  - aura-ui-core@0.2.0
