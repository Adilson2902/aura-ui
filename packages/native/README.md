# aura-ui-native

O **Aura UI para React Native**: os mesmos 33 temas e cores do web, modo escuro automático e componentes prontos para mobile — **sem dependências nativas** (funciona no Expo Go e em apps bare, React Native ≥ 0.79).

```bash
npx expo install aura-ui-native
```

```tsx
import {
  AuraProvider,
  Screen,
  Text,
  Button,
  Card,
  CardTitle,
  CardDescription
} from "aura-ui-native";

export default function App() {
  return (
    <AuraProvider theme="ocean">
      <Screen>
        <Text variant="h1">Olá 👋</Text>
        <Card variant="elevated">
          <CardTitle>Seu plano</CardTitle>
          <CardDescription>Pro · renova em 12 dias</CardDescription>
        </Card>
        <Button fullWidth onPress={() => {}}>
          Continuar
        </Button>
      </Screen>
    </AuraProvider>
  );
}
```

Pronto. Sem plugin de Babel, sem config do Metro, sem `pod install`.

## Componentes

| Grupo       | Componentes                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Layout      | `Screen` · `Box` · `VStack` / `HStack` / `Stack` · `Spacer` · `Divider`                                                                 |
| Texto       | `Text` (display, h1–h3, title, body, label, caption) · `Heading`                                                                        |
| Ações       | `Button` (9 variantes, 5 tamanhos, loading, ícones) · `IconButton` · `PressableScale`                                                   |
| Formulários | `Input` / `TextArea` · `Switch` · `Checkbox` · `RadioGroup` · `SegmentedControl` · `Chip` / `ChipGroup` · `OTPInput` · `Select`         |
| Exibição    | `Card` · `Badge` · `Avatar` / `AvatarGroup` · `Alert` · `Progress` · `Spinner` · `Skeleton` · `ListItem` / `ListSection` · `EmptyState` |
| Overlays    | `Dialog` / `AlertDialog` · `BottomSheet` · `ActionSheet` · `Toast` (`ToastProvider` + `useToast`)                                       |
| Superfícies | `Gradient` · `Glass`                                                                                                                    |

## Fácil de personalizar

**Tema e modo** — 33 temas (`aura`, `ocean`, `forest`, `midnight`, `cyber`…) e `light` / `dark` / `system`:

```tsx
<AuraProvider theme="forest" defaultMode="system">
  …
</AuraProvider>;

const t = useAura();
t.setTheme("sunset");
t.toggleMode();
```

**Sua marca** — troque qualquer cor, o raio e as fontes:

```tsx
<AuraProvider
  overrides={{
    colors: { primary: "#0ea5e9" },
    dark: { surface: "#0b1220" },
    radius: 16,
    fonts: { regular: "Inter_400Regular", semibold: "Inter_600SemiBold", bold: "Inter_700Bold" }
  }}
>
```

**Layout por tokens** — escala de 4px, cores e raios do tema:

```tsx
<Box p={4} bg="muted" radius="lg" shadow={2}>
  <HStack space={2} justify="space-between">
    <Text variant="label">Saldo</Text>
    <Text tone="success" weight="bold">
      R$ 1.240
    </Text>
  </HStack>
</Box>
```

**Estilos próprios que seguem o tema**:

```tsx
const useStyles = makeStyles((t) => ({
  banner: {
    backgroundColor: t.alpha(t.colors.primary, 0.12),
    borderRadius: t.radius.lg,
    padding: t.space(4)
  }
}));
```

Todo componente aceita `style` (e estilos de partes, como `textStyle`), então nada fica preso.

## Gradiente e vidro (opcional)

As variantes `gradient` e `glass` usam o que você plugar; sem nada, caem em cor sólida e superfície translúcida:

```tsx
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

<AuraProvider components={{ LinearGradient, BlurView }}>…</AuraProvider>;
```

(`react-native-linear-gradient` também serve — a API é a mesma.)

## Acessibilidade

`role`/`aria-*` nativos do React Native em todos os componentes, alvo de toque ≥ 44px, textos acessíveis em português e personalizáveis, e o feedback de toque respeita o tema claro/escuro.

## Com IA

O servidor [`aura-ui-mcp`](https://www.npmjs.com/package/aura-ui-mcp) conhece estes componentes: `get_setup` com `mode: "native"` e `get_component` com `platform: "native"`.

## Mesmas cores do web

As paletas são geradas do CSS do [`aura-ui-core`](https://www.npmjs.com/package/aura-ui-core) no build (`scripts/build-themes.mjs`), então um app mobile e um site com o mesmo tema ficam idênticos.

[Repositório e documentação](https://github.com/Adilson2902/aura-ui)

**MIT**
