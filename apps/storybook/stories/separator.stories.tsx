import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@aura/ui/separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Separador tokenizado (`bg-aura-border`), horizontal ou vertical, com `role=\"separator\"` — ou decorativo (`aria-hidden`)."
      }
    }
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    decorative: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-72 space-y-4">
      <p className="text-sm">Conteúdo acima</p>
      <Separator {...args} />
      <p className="text-sm text-aura-muted-foreground">Conteúdo abaixo</p>
    </div>
  )
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center gap-4 text-sm">
      <span>Esquerda</span>
      <Separator orientation="vertical" />
      <span className="text-aura-muted-foreground">Direita</span>
    </div>
  )
};
