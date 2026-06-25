import type { Meta, StoryObj } from "@storybook/react";
import { Card3D, Spotlight, ShineBorder, AnimatedShinyText, AuroraBackground } from "@aura/effects";
import { CardTitle, CardDescription } from "@aura/ui/card";

const meta: Meta = {
  title: "Effects/Card3D",
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

export const Tilt: Story = {
  render: () => (
    <Card3D className="w-[320px]">
      <CardTitle>Card3D</CardTitle>
      <CardDescription className="mt-2">Mova o mouse para tilt + glare.</CardDescription>
    </Card3D>
  )
};

export const SpotlightCard: Story = {
  name: "Spotlight",
  render: () => (
    <Spotlight className="w-[320px] rounded-[var(--aura-radius)] border border-aura-border p-6">
      <p className="font-semibold">Spotlight</p>
      <p className="text-sm text-aura-muted-foreground">Gradiente segue o cursor.</p>
    </Spotlight>
  )
};

export const Shine: Story = {
  name: "ShineBorder",
  render: () => (
    <ShineBorder className="w-[320px]">
      <div className="p-6">
        <p className="font-semibold">Shine border</p>
      </div>
    </ShineBorder>
  )
};

export const ShinyText: Story = {
  name: "AnimatedShinyText",
  render: () => (
    <h2 className="text-3xl font-bold">
      <AnimatedShinyText>Aura UI brilhante</AnimatedShinyText>
    </h2>
  )
};

export const Aurora: Story = {
  name: "AuroraBackground",
  render: () => (
    <AuroraBackground className="w-[480px] rounded-[var(--aura-radius)] p-10">
      <p className="text-center text-lg font-medium">Fundo aurora</p>
    </AuroraBackground>
  )
};
