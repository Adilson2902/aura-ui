import type { Meta, StoryObj } from "@storybook/react";
import { Heading, Text, InlineCode, Prose } from "@aura/ui/typography";

const meta: Meta<typeof Heading> = {
  title: "UI/Typography",
  component: Heading,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Scale: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-3">
      <Heading as="h1" size="display" tone="aurora">
        Display aurora
      </Heading>
      <Heading as="h2" size="2xl">
        Título 2xl
      </Heading>
      <Heading as="h3" size="xl" tone="gradient">
        Título xl gradiente
      </Heading>
      <Heading as="h4" size="lg">
        Título lg
      </Heading>
      <Heading as="h5" size="md" tone="muted">
        Título md muted
      </Heading>
      <Text size="lead" tone="muted">
        Lead — texto de abertura com tamanho fluido para heros e seções.
      </Text>
      <Text>
        Corpo padrão com <InlineCode>InlineCode</InlineCode> e tons semânticos:{" "}
        <Text as="span" tone="success" weight="semibold">
          sucesso
        </Text>
        ,{" "}
        <Text as="span" tone="warning" weight="semibold">
          alerta
        </Text>{" "}
        e{" "}
        <Text as="span" tone="destructive" weight="semibold">
          erro
        </Text>
        .
      </Text>
      <Text size="sm" tone="muted" lines={2} className="max-w-sm">
        Texto limitado a duas linhas com reticências automáticas — útil em cards de listagem onde a
        descrição pode ser longa demais e precisa ser cortada de forma elegante.
      </Text>
    </div>
  )
};

/** Prose estiliza HTML de markdown/CMS sem classes. */
export const ProseContent: Story = {
  render: () => (
    <Prose>
      <h2>Começando</h2>
      <p>
        Instale o pacote e importe os tokens. Veja o <a href="#">guia completo</a> para detalhes.
      </p>
      <ul>
        <li>Tokens CSS com 33 temas</li>
        <li>Componentes Radix acessíveis</li>
      </ul>
      <blockquote>Design systems são produtos, não projetos.</blockquote>
      <pre>
        <code>pnpm add aura-ui-components</code>
      </pre>
    </Prose>
  )
};
