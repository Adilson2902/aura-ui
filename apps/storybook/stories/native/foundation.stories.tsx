import type { Meta, StoryObj } from "@storybook/react";
import {
  AURA_THEMES,
  AURA_THEME_LABELS,
  AuraProvider,
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  HStack,
  Heading,
  IconButton,
  PALETTES,
  Screen,
  Text,
  VStack,
  type AuraThemeName
} from "aura-ui-native";
import { themeArgTypes, withPhone } from "./phone";

const meta: Meta<{ auraTheme: AuraThemeName }> = {
  title: "Native/Base",
  decorators: [withPhone],
  argTypes: themeArgTypes,
  args: { auraTheme: "aura" },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "aura-ui-native — componentes React Native (aqui renderizados via react-native-web). Troque o tema no controle `auraTheme` e o modo claro/escuro na toolbar."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const Star = () => <Text style={{ fontSize: 16 }}>★</Text>;

export const Visao: Story = {
  name: "Visão geral",
  render: () => (
    <Screen>
      <VStack space={1}>
        <Text variant="caption" tone="primary" weight="semibold">
          AURA UI NATIVE
        </Text>
        <Heading level={1}>Olá, Ana 👋</Heading>
        <Text tone="muted">Seu resumo de hoje</Text>
      </VStack>

      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Plano Pro</CardTitle>
          <CardDescription>Projetos ilimitados e temas premium.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="glass" size="sm">
            Ver detalhes
          </Button>
        </CardFooter>
      </Card>

      <HStack space={3}>
        <Card variant="surface" style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">
            Receita
          </Text>
          <Text variant="h3">R$ 12,4k</Text>
          <Text variant="caption" tone="success">
            +12%
          </Text>
        </Card>
        <Card variant="soft" style={{ flex: 1 }}>
          <Text variant="caption" tone="muted">
            Pedidos
          </Text>
          <Text variant="h3">328</Text>
          <Text variant="caption" tone="destructive">
            -3%
          </Text>
        </Card>
      </HStack>

      <Card onPress={() => {}}>
        <CardHeader>
          <CardTitle>Card tocável</CardTitle>
          <CardDescription>Encolhe levemente ao pressionar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Divider />
          <HStack justify="space-between">
            <Text variant="label">Notificações</Text>
            <Text tone="primary" weight="semibold">
              3 novas ›
            </Text>
          </HStack>
        </CardContent>
      </Card>

      <Button fullWidth size="lg">
        Continuar
      </Button>
    </Screen>
  )
};

export const Botoes: Story = {
  name: "Botões",
  render: () => (
    <Screen>
      <Heading level={3}>Variantes</Heading>
      {(
        [
          "solid",
          "soft",
          "outline",
          "ghost",
          "accent",
          "destructive",
          "gradient",
          "glass",
          "link"
        ] as const
      ).map((v) => (
        <Button key={v} variant={v} fullWidth>
          {v}
        </Button>
      ))}
      <Heading level={3}>Tamanhos e estados</Heading>
      <HStack wrap space={2}>
        <Button size="sm">Pequeno</Button>
        <Button size="md">Médio</Button>
        <Button size="lg">Grande</Button>
      </HStack>
      <HStack wrap space={2}>
        <Button loading>Salvando</Button>
        <Button loading loadingText="Enviando…" variant="soft">
          Enviar
        </Button>
        <Button disabled variant="outline">
          Desabilitado
        </Button>
      </HStack>
      <HStack space={2}>
        <Button leftIcon={<Star />} variant="soft">
          Favoritar
        </Button>
        <Button radius="full" variant="accent">
          Pílula
        </Button>
        <IconButton accessibilityLabel="Favoritar" variant="solid">
          <Star />
        </IconButton>
      </HStack>
    </Screen>
  )
};

export const Layout: Story = {
  render: () => (
    <Screen>
      <Heading level={3}>Box com tokens</Heading>
      <Box p={4} bg="muted" radius="lg" gap={2}>
        <Text>{`<Box p={4} bg="muted" radius="lg">`}</Text>
      </Box>
      <Box p={4} bg="primary" radius="xl" shadow={3}>
        <Text color="primaryForeground" weight="semibold">
          bg="primary" shadow={3}
        </Text>
      </Box>
      <HStack space={2}>
        {[1, 2, 3].map((i) => (
          <Box key={i} flex={1} h={64} radius="md" border align="center" justify="center">
            <Text variant="label">{i}</Text>
          </Box>
        ))}
      </HStack>
      <Box p={4} radius="lg" border borderColor="primary">
        <Text tone="primary">border borderColor="primary"</Text>
      </Box>
    </Screen>
  )
};

/** As 33 paletas lado a lado — mesmas cores do web, geradas do aura-ui-core. */
export const Temas: Story = {
  render: () => <ThemeGrid />
};

function ThemeGrid() {
  return (
    <Screen padding={3}>
      <Heading level={3}>33 temas</Heading>
      <Box direction="row" wrap gap={2}>
        {AURA_THEMES.map((name) => (
          <AuraProvider key={name} theme={name} mode="light">
            <ThemeChip name={name} />
          </AuraProvider>
        ))}
      </Box>
    </Screen>
  );
}

function ThemeChip({ name }: { name: AuraThemeName }) {
  const p = PALETTES[name]!.light.colors;
  return (
    <Box w="31%" radius={12} overflow="hidden" border borderColor={p.border}>
      <Box h={34} bg={p.primary} />
      <Box direction="row" h={10}>
        <Box flex={1} bg={p.accent} />
        <Box flex={1} bg={p.success} />
        <Box flex={1} bg={p.warning} />
      </Box>
      <Box p={1.5} bg={p.surface}>
        <Text variant="caption" weight="semibold" style={{ color: p.surfaceForeground }}>
          {AURA_THEME_LABELS[name]}
        </Text>
      </Box>
    </Box>
  );
}
