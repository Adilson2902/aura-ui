import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@aura/ui/textarea";
import { Label } from "@aura/ui/label";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Área de texto com as mesmas variantes do input (`default`, `glass`), `aria-invalid` e auto-expansão via `field-sizing`."
      }
    }
  },
  argTypes: {
    variant: { control: "select", options: ["default", "glass"] },
    disabled: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Playground: Story = {
  args: { placeholder: "Descreva sua ideia…", variant: "default" }
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Fale um pouco sobre você" />
    </div>
  )
};

export const Invalid: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="bio-invalid">Bio</Label>
      <Textarea id="bio-invalid" aria-invalid="true" defaultValue="a" />
      <p className="text-xs text-aura-destructive">Mínimo de 10 caracteres.</p>
    </div>
  )
};

export const Glass: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B0C15] p-6">
      <Textarea variant="glass" placeholder="Mensagem…" />
    </div>
  )
};
