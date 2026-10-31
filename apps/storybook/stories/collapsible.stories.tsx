import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@aura/ui/collapsible";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-80 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">3 repositórios favoritados</p>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Alternar lista">
              <Chevron open={open} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="aura-surface px-4 py-2 font-mono text-sm">aura-ui/core</div>
        <CollapsibleContent className="space-y-2">
          <div className="aura-surface px-4 py-2 font-mono text-sm">aura-ui/effects</div>
          <div className="aura-surface px-4 py-2 font-mono text-sm">aura-ui/three</div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
};

export const Card: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(true);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="aura-surface w-96 overflow-hidden">
        <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-aura-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring">
          Detalhes do pedido
          <Chevron open={open} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <dl className="grid grid-cols-2 gap-2 px-5 pb-4 text-sm">
            <dt className="text-aura-muted-foreground">Plano</dt>
            <dd>Pro anual</dd>
            <dt className="text-aura-muted-foreground">Assentos</dt>
            <dd>12</dd>
            <dt className="text-aura-muted-foreground">Renovação</dt>
            <dd>31/10/2027</dd>
          </dl>
        </CollapsibleContent>
      </Collapsible>
    );
  }
};
