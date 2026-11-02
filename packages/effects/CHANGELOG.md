# aura-ui-effects

## 0.3.0

### Minor Changes

- 0cc6fce: Aura UI para React Native (`aura-ui-native`)

  - Novo pacote **aura-ui-native**: design system React Native sem dependências nativas (Expo Go e bare, RN ≥ 0.79). `AuraProvider` com os 33 temas do web (paletas geradas do CSS do core), modo claro/escuro/sistema, `overrides` de cores/raio/fontes e `LinearGradient`/`BlurView` plugáveis.
  - Layout por tokens (`Box`, `VStack`/`HStack`, `Screen`, `Divider`), `Text`/`Heading`, `Button` (9 variantes), `Card`, formulários (`Input`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`, `Chip`, `OTPInput`, `Select`), exibição (`Badge`, `Avatar`, `Alert`, `Progress`, `Skeleton`, `ListItem`, `EmptyState`) e overlays (`Dialog`, `BottomSheet`, `ActionSheet`, `Toast`).
  - `makeStyles`/`useStyles`/`useAura` para estilos próprios que seguem o tema.
  - **aura-ui-mcp**: catálogo inclui os componentes nativos (`category: "native"`, `platform: "native"`) e `get_setup` ganha `mode: "native"`.
  - Storybook: galeria "Native/\*" renderizada via react-native-web numa moldura de celular.

### Patch Changes

- Updated dependencies [0cc6fce]
- Updated dependencies [9958ed8]
  - aura-ui-core@0.3.0

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
