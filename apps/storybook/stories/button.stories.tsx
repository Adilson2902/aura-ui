import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "ghost", "glass", "3d"]
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { children: "Continuar", variant: "solid" }
};

export const Glass: Story = {
  args: { children: "Aura glass", variant: "glass" }
};

export const ThreeD: Story = {
  args: { children: "Botão 3D", variant: "3d", size: "lg" }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="solid">Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="3d">3D</Button>
    </div>
  )
};
