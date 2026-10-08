import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Botão com variantes modernas (incl. DesignCode UI `gradient`, `glow`, `cyber`, `glass` e `3d` com feedback físico `aura-press`). asChild via Radix Slot."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "ghost", "glass", "gradient", "glow", "cyber", "3d"]
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
    disabled: { control: "boolean" }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

const Arrow = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Sparkles = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden
  >
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
);

export const Playground: Story = {
  args: { children: "Continuar", variant: "gradient", size: "lg" }
};

/** Matriz completa: cada variante × cada tamanho. */
export const Variants: Story = {
  render: () => {
    const variants = [
      "solid",
      "soft",
      "outline",
      "ghost",
      "glass",
      "gradient",
      "glow",
      "cyber",
      "3d"
    ] as const;
    return (
      <div className="flex flex-col gap-4">
        {variants.map((v) => (
          <div key={v} className="flex items-center gap-3">
            <span className="w-20 text-xs font-medium text-aura-muted-foreground">{v}</span>
            <Button variant={v} size="sm">
              Small
            </Button>
            <Button variant={v} size="md">
              Medium
            </Button>
            <Button variant={v} size="lg">
              Large
            </Button>
          </div>
        ))}
      </div>
    );
  }
};

/** DesignCode UI Signature Buttons */
export const DesignCodeSuite: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#0B0C15] p-8 border border-white/10">
      <Button variant="gradient" size="lg" className="gap-2">
        <Sparkles /> Explorar Pro
      </Button>
      <Button variant="glow" size="lg">
        Aurora Glow
      </Button>
      <Button variant="cyber" size="lg">
        Cyber Aqua
      </Button>
      <Button variant="glass" size="lg">
        Frosted Glass <Arrow />
      </Button>
    </div>
  )
};
