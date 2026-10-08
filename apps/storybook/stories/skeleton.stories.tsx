import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@aura/ui/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Skeleton p/ loading states — variantes `shimmer` e `pulse`, animação desligada com `prefers-reduced-motion`."
      }
    }
  },
  argTypes: {
    variant: { control: "select", options: ["shimmer", "pulse"] }
  }
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {
  args: { className: "h-24 w-72" }
};

export const Card: Story = {
  render: (args) => (
    <div className="aura-surface w-72 space-y-3 p-6" aria-busy="true" aria-label="Carregando cartão">
      <Skeleton {...args} className="h-32 w-full" />
      <Skeleton {...args} className="h-4 w-3/4" />
      <Skeleton {...args} className="h-4 w-1/2" />
    </div>
  )
};
