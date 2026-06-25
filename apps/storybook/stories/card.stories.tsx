import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@aura/ui/card";
import { Input } from "@aura/ui/input";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Use seu e-mail para acessar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input placeholder="email@exemplo.com" type="email" />
        <Button className="w-full">Entrar</Button>
      </CardContent>
    </Card>
  )
};
