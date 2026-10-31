import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from "@aura/ui/button-group";
import { Button } from "@aura/ui/button";
import { Input } from "@aura/ui/input";
import { CopyButton } from "@aura/ui/copy-button";
import { AspectRatio } from "@aura/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarGroup } from "@aura/ui/avatar";
import { Badge } from "@aura/ui/badge";
import { RadioGroup, RadioGroupCard } from "@aura/ui/radio-group";
import { Checkbox } from "@aura/ui/checkbox";
import { Switch } from "@aura/ui/switch";
import { Label } from "@aura/ui/label";

const meta: Meta = {
  title: "UI/Utilities",
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

export const ButtonGroups: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup>
        <Button variant="outline">Dia</Button>
        <Button variant="outline">Semana</Button>
        <Button variant="outline">Mês</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Publicar</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="Mais opções">
          ▾
        </Button>
      </ButtonGroup>
      <ButtonGroup className="w-80">
        <ButtonGroupText>https://</ButtonGroupText>
        <Input placeholder="seu-site.com" />
        <Button variant="soft">Ir</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Zoom +</Button>
        <Button variant="outline">Zoom −</Button>
      </ButtonGroup>
    </div>
  )
};

export const Copy: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <code className="rounded-md bg-aura-muted px-3 py-2 text-sm">
        pnpm add aura-ui-components
      </code>
      <CopyButton value="pnpm add aura-ui-components" />
      <CopyButton value="npx aura add button" variant="outline">
        Copiar comando
      </CopyButton>
    </div>
  )
};

export const Ratio: Story = {
  render: () => (
    <div className="grid w-[480px] grid-cols-2 gap-4">
      <AspectRatio ratio={16 / 9} className="rounded-[var(--aura-radius)]">
        <div className="h-full w-full" style={{ background: "var(--aura-gradient-aurora)" }} />
      </AspectRatio>
      <AspectRatio ratio={1} className="rounded-[var(--aura-radius)]">
        <div className="h-full w-full" style={{ background: "var(--aura-gradient-primary)" }} />
      </AspectRatio>
    </div>
  )
};

export const AvatarsAndBadges: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-5">
      <AvatarGroup max={4}>
        {["AM", "JP", "RL", "MC", "DA", "TS"].map((i) => (
          <Avatar key={i}>
            <AvatarFallback>{i}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <div className="flex items-center gap-2">
        <Avatar shape="square" size="lg">
          <AvatarFallback>AU</AvatarFallback>
        </Avatar>
        <Badge size="sm" dot variant="success">
          Online
        </Badge>
        <Badge dot variant="warning">
          Pendente
        </Badge>
        <Badge size="lg" variant="accent">
          Novo
        </Badge>
      </div>
    </div>
  )
};

export const Selection: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-5">
      <RadioGroup defaultValue="pro">
        <RadioGroupCard value="starter">
          <p className="text-sm font-semibold">Starter</p>
          <p className="text-xs text-aura-muted-foreground">Para projetos pessoais.</p>
        </RadioGroupCard>
        <RadioGroupCard value="pro">
          <p className="text-sm font-semibold">Pro</p>
          <p className="text-xs text-aura-muted-foreground">Times de até 20 pessoas.</p>
        </RadioGroupCard>
      </RadioGroup>
      <div className="flex items-center gap-3">
        <Checkbox id="all" checked="indeterminate" />
        <Label htmlFor="all">Selecionar todos (parcial)</Label>
      </div>
      <div className="flex items-center gap-4">
        <Switch size="sm" defaultChecked />
        <Switch variant="gradient" defaultChecked />
        <Switch size="lg" variant="glow" defaultChecked />
        <Switch variant="success" defaultChecked />
      </div>
    </div>
  )
};
