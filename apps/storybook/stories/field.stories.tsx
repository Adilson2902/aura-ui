import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet
} from "@aura/ui/field";
import { Input } from "@aura/ui/input";
import { Textarea } from "@aura/ui/textarea";
import { Switch } from "@aura/ui/switch";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel>Nome completo</FieldLabel>
      <FieldControl>
        <Input placeholder="Ada Lovelace" />
      </FieldControl>
      <FieldDescription>Como aparece no seu documento.</FieldDescription>
    </Field>
  )
};

export const WithError: Story = {
  render: function WithErrorStory() {
    const [email, setEmail] = React.useState("ada@");
    const invalid = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    return (
      <Field className="w-80" invalid={invalid} required>
        <FieldLabel>E-mail</FieldLabel>
        <FieldControl>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldControl>
        <FieldDescription>Usaremos para enviar o recibo.</FieldDescription>
        <FieldError>Informe um e-mail válido.</FieldError>
      </Field>
    );
  }
};

export const Form: Story = {
  render: () => (
    <form className="w-[420px]" onSubmit={(e) => e.preventDefault()}>
      <FieldSet legend="Perfil" description="Informações públicas da sua conta.">
        <FieldGroup>
          <Field required>
            <FieldLabel>Usuário</FieldLabel>
            <FieldControl>
              <Input placeholder="@aura" />
            </FieldControl>
          </Field>
          <Field invalid>
            <FieldLabel>Bio</FieldLabel>
            <FieldControl>
              <Textarea placeholder="Conte um pouco sobre você" />
            </FieldControl>
            <FieldError errors={[{ message: "Mínimo de 20 caracteres" }, "Sem links"]} />
          </Field>
          <Field orientation="horizontal">
            <FieldControl>
              <Switch />
            </FieldControl>
            <FieldLabel>Perfil público</FieldLabel>
          </Field>
          <Field disabled>
            <FieldLabel>Plano</FieldLabel>
            <FieldControl>
              <Input defaultValue="Pro" />
            </FieldControl>
            <FieldDescription>Altere o plano em Cobrança.</FieldDescription>
          </Field>
          <Button type="submit" className="self-start">
            Salvar
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  )
};
