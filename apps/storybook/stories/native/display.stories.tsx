import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ActionSheet,
  Alert,
  AlertDialog,
  Avatar,
  AvatarGroup,
  Badge,
  BottomSheet,
  Button,
  EmptyState,
  HStack,
  Heading,
  ListItem,
  ListSection,
  Progress,
  Screen,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Text,
  ToastProvider,
  VStack,
  useToast,
  type AuraThemeName
} from "aura-ui-native";
import { themeArgTypes, withPhone } from "./phone";

const meta: Meta<{ auraTheme: AuraThemeName }> = {
  title: "Native/Exibição e overlays",
  decorators: [withPhone],
  argTypes: themeArgTypes,
  args: { auraTheme: "aura" },
  parameters: { layout: "centered" }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Perfil: Story = {
  render: () => (
    <Screen padding={0}>
      <VStack align="center" space={2} p={6}>
        <Avatar name="Ana Souza" size="xl" status="online" ring />
        <Text variant="h3">Ana Souza</Text>
        <HStack space={2}>
          <Badge variant="soft">Pro</Badge>
          <Badge variant="success" dot>
            Verificada
          </Badge>
        </HStack>
      </VStack>
      <ListSection title="Conta">
        <ListItem
          title="Dados pessoais"
          subtitle="Nome, e-mail, telefone"
          chevron
          onPress={() => {}}
        />
        <ListItem title="Notificações" right={<Switch defaultChecked />} />
        <ListItem title="Plano" right={<Text tone="muted">Pro</Text>} chevron onPress={() => {}} />
      </ListSection>
      <ListSection title="Time" footer="Convide pessoas pelo link do projeto.">
        <ListItem
          title="Membros"
          right={
            <AvatarGroup max={3} size="sm">
              <Avatar name="Ana Souza" />
              <Avatar name="Bruno Lima" />
              <Avatar name="Carla Dias" />
              <Avatar name="Diego Alves" />
              <Avatar name="Eva Rocha" />
            </AvatarGroup>
          }
        />
        <ListItem title="Sair da conta" destructive onPress={() => {}} />
      </ListSection>
    </Screen>
  )
};

export const Status: Story = {
  render: () => (
    <Screen>
      <Heading level={3}>Alertas</Heading>
      <Alert
        variant="info"
        title="Atualização disponível"
        description="Versão 2.4 com modo offline."
      />
      <Alert variant="success" title="Pagamento confirmado" onClose={() => {}} />
      <Alert
        variant="warning"
        title="Plano perto do limite"
        description="92% do armazenamento usado."
      />
      <Alert
        variant="destructive"
        title="Falha na sincronização"
        action={
          <Button size="sm" variant="outline">
            Tentar de novo
          </Button>
        }
      />
      <Heading level={3}>Progresso</Heading>
      <Progress value={68} label="Upload" />
      <Progress indeterminate tone="accent" />
      <HStack space={4}>
        <Spinner />
        <Spinner tone="accent" size="large" />
      </HStack>
      <Heading level={3}>Carregando</Heading>
      <HStack space={3}>
        <Skeleton circle width={48} height={48} />
        <VStack space={2} flex={1}>
          <Skeleton height={14} width="70%" />
          <Skeleton height={12} width="45%" />
        </VStack>
      </HStack>
      <EmptyState
        icon={<Text style={{ fontSize: 32 }}>📭</Text>}
        title="Nada por aqui"
        description="Seus pedidos aparecem nesta tela."
        action={<Button size="sm">Novo pedido</Button>}
      />
    </Screen>
  )
};

export const Overlays: Story = {
  render: () => (
    <ToastProvider position="top">
      <OverlaysDemo />
    </ToastProvider>
  )
};

function OverlaysDemo() {
  const { toast } = useToast();
  const [cidade, setCidade] = React.useState<string | null>(null);
  return (
    <Screen>
      <Heading level={3}>Overlays</Heading>
      <AlertDialog
        trigger={
          <Button variant="destructive" fullWidth>
            Excluir projeto
          </Button>
        }
        title="Excluir projeto?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => toast.success("Projeto excluído")}
      />
      <BottomSheet
        trigger={
          <Button variant="soft" fullWidth>
            Abrir bottom sheet
          </Button>
        }
        title="Filtros"
        description="Arraste a alça para baixo para fechar."
      >
        <VStack space={3} pb={2}>
          <Switch defaultChecked label="Somente ativos" />
          <Switch label="Com desconto" />
          <Button fullWidth>Aplicar</Button>
        </VStack>
      </BottomSheet>
      <ActionSheet
        trigger={
          <Button variant="outline" fullWidth>
            Ações da foto
          </Button>
        }
        title="Foto de perfil"
        actions={[
          { label: "Tirar foto", onPress: () => toast.info("Câmera") },
          { label: "Escolher da galeria", onPress: () => toast.info("Galeria") },
          {
            label: "Remover foto",
            destructive: true,
            onPress: () => toast.warning("Foto removida")
          }
        ]}
      />
      <Select
        label="Cidade"
        placeholder="Selecione"
        searchable
        value={cidade}
        onValueChange={(v) => setCidade(v)}
        options={[
          { value: "sp", label: "São Paulo" },
          { value: "rj", label: "Rio de Janeiro" },
          { value: "bh", label: "Belo Horizonte" },
          { value: "poa", label: "Porto Alegre" },
          { value: "rec", label: "Recife" }
        ]}
      />
      <Button
        variant="ghost"
        onPress={() =>
          toast({ title: "Sincronizado", description: "Tudo em dia.", variant: "success" })
        }
      >
        Mostrar toast
      </Button>
    </Screen>
  );
}
