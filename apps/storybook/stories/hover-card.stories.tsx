import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@aura/ui/hover-card";
import { Avatar, AvatarFallback } from "@aura/ui/avatar";

const meta: Meta<typeof HoverCardContent> = {
  title: "UI/HoverCard",
  component: HoverCardContent,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["surface", "glass", "glow"] },
    side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] }
  },
  args: { variant: "surface", side: "bottom", arrow: true }
};

export default meta;
type Story = StoryObj<typeof HoverCardContent>;

const Profile = () => (
  <div className="flex gap-3">
    <Avatar ring="glow">
      <AvatarFallback>AU</AvatarFallback>
    </Avatar>
    <div className="space-y-1">
      <p className="text-sm font-semibold">@aura-ui</p>
      <p className="text-sm opacity-80">Design system 3D com tokens, temas e efeitos.</p>
      <p className="text-xs opacity-60">Entrou em outubro de 2026</p>
    </div>
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <a
          href="#"
          className="text-sm font-medium text-aura-primary underline-offset-4 hover:underline"
        >
          @aura-ui
        </a>
      </HoverCardTrigger>
      <HoverCardContent {...args}>
        <Profile />
      </HoverCardContent>
    </HoverCard>
  )
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-8">
      {(["surface", "glass", "glow"] as const).map((variant) => (
        <HoverCard key={variant} openDelay={100}>
          <HoverCardTrigger asChild>
            <button type="button" className="text-sm font-medium underline underline-offset-4">
              {variant}
            </button>
          </HoverCardTrigger>
          <HoverCardContent variant={variant} arrow>
            <Profile />
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
};
