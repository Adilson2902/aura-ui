import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@aura/ui/switch";
import { Label } from "@aura/ui/label";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch id="notifs" defaultChecked />
      <Label htmlFor="notifs">Notificações por e-mail</Label>
    </div>
  )
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch id="off" />
        <Label htmlFor="off">Desligado</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="on" defaultChecked />
        <Label htmlFor="on">Ligado</Label>
      </div>
      <div className="flex items-center gap-3 opacity-60">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled">Desabilitado</Label>
      </div>
    </div>
  )
};
