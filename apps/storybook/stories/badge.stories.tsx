import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@aura/ui/badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "muted", "success", "warning", "destructive"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  args: { children: "Novo", variant: "soft" }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="success">Ativo</Badge>
      <Badge variant="warning">Pendente</Badge>
      <Badge variant="destructive">Erro</Badge>
    </div>
  )
};

export const WithDot: Story = {
  render: () => (
    <Badge variant="success">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Online
    </Badge>
  )
};
