# aura-ui-mcp

## 0.3.0

### Minor Changes

- 0cc6fce: Aura UI para React Native (`aura-ui-native`)

  - Novo pacote **aura-ui-native**: design system React Native sem dependências nativas (Expo Go e bare, RN ≥ 0.79). `AuraProvider` com os 33 temas do web (paletas geradas do CSS do core), modo claro/escuro/sistema, `overrides` de cores/raio/fontes e `LinearGradient`/`BlurView` plugáveis.
  - Layout por tokens (`Box`, `VStack`/`HStack`, `Screen`, `Divider`), `Text`/`Heading`, `Button` (9 variantes), `Card`, formulários (`Input`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`, `Chip`, `OTPInput`, `Select`), exibição (`Badge`, `Avatar`, `Alert`, `Progress`, `Skeleton`, `ListItem`, `EmptyState`) e overlays (`Dialog`, `BottomSheet`, `ActionSheet`, `Toast`).
  - `makeStyles`/`useStyles`/`useAura` para estilos próprios que seguem o tema.
  - **aura-ui-mcp**: catálogo inclui os componentes nativos (`category: "native"`, `platform: "native"`) e `get_setup` ganha `mode: "native"`.
  - Storybook: galeria "Native/\*" renderizada via react-native-web numa moldura de celular.
