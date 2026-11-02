import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Checkbox,
  Chip,
  ChipGroup,
  Divider,
  Heading,
  Input,
  OTPInput,
  RadioGroup,
  RadioGroupItem,
  Screen,
  SegmentedControl,
  Switch,
  Text,
  TextArea,
  VStack,
  type AuraThemeName
} from "aura-ui-native";
import { themeArgTypes, withPhone } from "./phone";

const meta: Meta<{ auraTheme: AuraThemeName }> = {
  title: "Native/Formulários",
  decorators: [withPhone],
  argTypes: themeArgTypes,
  args: { auraTheme: "aura" },
  parameters: { layout: "centered" }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Cadastro: Story = {
  render: () => <CadastroDemo />
};

function CadastroDemo() {
  const [plano, setPlano] = React.useState("mensal");
  return (
    <Screen>
      <Heading level={2}>Criar conta</Heading>
      <SegmentedControl
        fullWidth
        value={plano}
        onValueChange={setPlano}
        options={[
          { value: "mensal", label: "Mensal" },
          { value: "anual", label: "Anual" }
        ]}
      />
      <Input label="Nome" placeholder="Ana Souza" />
      <Input
        label="E-mail"
        placeholder="ana@email.com"
        keyboardType="email-address"
        description="Usamos só para login."
      />
      <Input
        label="Senha"
        secureTextEntry
        defaultValue="segredo123"
        error="Mínimo de 12 caracteres"
      />
      <TextArea label="Sobre você" placeholder="Conte um pouco…" minRows={3} />
      <Checkbox
        defaultChecked
        label="Aceito os termos"
        description="Você pode cancelar quando quiser."
      />
      <Switch defaultChecked label="Receber novidades por e-mail" />
      <Button fullWidth size="lg">
        Criar conta
      </Button>
    </Screen>
  );
}

export const Controles: Story = {
  render: () => (
    <Screen>
      <Heading level={3}>Switch</Heading>
      <VStack space={2}>
        <Switch size="sm" defaultChecked label="Pequeno" />
        <Switch defaultChecked label="Médio" />
        <Switch size="lg" variant="success" defaultChecked label="Grande · success" />
      </VStack>
      <Divider />
      <Heading level={3}>Checkbox</Heading>
      <Checkbox checked="indeterminate" label="Selecionar todos (parcial)" />
      <Checkbox invalid label="Obrigatório" />
      <Divider />
      <Heading level={3}>Rádio em cartão</Heading>
      <RadioGroup defaultValue="pro" variant="card">
        <RadioGroupItem value="starter" label="Starter" description="Para projetos pessoais" />
        <RadioGroupItem value="pro" label="Pro" description="Times de até 20 pessoas" />
      </RadioGroup>
      <Divider />
      <Heading level={3}>Chips</Heading>
      <ChipGroup multiple defaultValue={["react", "expo"]}>
        <Chip value="react">React</Chip>
        <Chip value="expo">Expo</Chip>
        <Chip value="ts">TypeScript</Chip>
        <Chip value="web">Web</Chip>
      </ChipGroup>
      <Chip variant="outline" onRemove={() => {}}>
        Filtro: Ativos
      </Chip>
    </Screen>
  )
};

export const Codigo: Story = {
  name: "Código OTP",
  render: () => (
    <Screen>
      <Heading level={2}>Confirme seu número</Heading>
      <Text tone="muted">Enviamos um código de 6 dígitos por SMS.</Text>
      <OTPInput defaultValue="4821" />
      <OTPInput length={4} error="Código inválido" defaultValue="1234" />
      <Button variant="link">Reenviar código</Button>
    </Screen>
  )
};
