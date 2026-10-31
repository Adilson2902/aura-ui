import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupButton
} from "@aura/ui/input-group";
import { Kbd } from "@aura/ui/kbd";
import { Field, FieldLabel, FieldControl, FieldError } from "@aura/ui/field";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const meta: Meta<typeof InputGroup> = {
  title: "UI/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "soft", "outline", "glass", "3d"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] }
  }
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Search: Story = {
  args: { variant: "default", size: "md" },
  render: (args) => (
    <InputGroup {...args} className="w-80">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Buscar componentes…" aria-label="Buscar" />
      <InputGroupAddon align="inline-end">
        <Kbd size="sm">⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
};

export const Addons: Story = {
  render: function AddonsStory() {
    const [copied, setCopied] = React.useState(false);
    return (
      <div className="flex w-96 flex-col gap-4">
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput placeholder="meusite" aria-label="Domínio" />
          <InputGroupAddon align="inline-end">.aura.dev</InputGroupAddon>
        </InputGroup>
        <InputGroup variant="soft">
          <InputGroupInput readOnly value="npx aura add input-group" aria-label="Comando" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copiado!" : "Copiar"}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup variant="3d" size="lg">
          <InputGroupAddon>R$</InputGroupAddon>
          <InputGroupInput inputMode="decimal" placeholder="0,00" aria-label="Valor" />
          <InputGroupAddon align="inline-end">BRL</InputGroupAddon>
        </InputGroup>
        <Field invalid>
          <FieldLabel>Usuário</FieldLabel>
          <InputGroup>
            <InputGroupAddon>@</InputGroupAddon>
            <FieldControl>
              <InputGroupInput defaultValue="ad" />
            </FieldControl>
          </InputGroup>
          <FieldError>Mínimo de 3 caracteres.</FieldError>
        </Field>
      </div>
    );
  }
};

export const Composer: Story = {
  render: () => (
    <InputGroup className="w-[420px]">
      <InputGroupTextarea placeholder="Escreva uma mensagem…" aria-label="Mensagem" />
      <InputGroupAddon align="block-end" className="justify-between">
        <span className="text-xs">Markdown suportado</span>
        <InputGroupButton variant="solid" size="sm">
          Enviar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
};

export const Glass: Story = {
  render: () => (
    <div className="rounded-2xl bg-aura-contrast p-8">
      <InputGroup variant="glass" className="w-80">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Buscar…" aria-label="Buscar" />
      </InputGroup>
    </div>
  )
};
