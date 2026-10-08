import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@aura/ui/card";
import { Input } from "@aura/ui/input";
import { Button } from "@aura/ui/button";
import { Badge } from "@aura/ui/badge";
import { Card3D, Spotlight } from "@aura/effects";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Card>;

const Trend = () => (
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
    <path d="M3 17l6-6 4 4 8-8M21 7h-5M21 7v5" />
  </svg>
);

export const SignIn: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Use seu e-mail para acessar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input placeholder="email@exemplo.com" type="email" />
        <Input placeholder="••••••••" type="password" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="gradient">
          Entrar
        </Button>
      </CardFooter>
    </Card>
  )
};

/** Variantes de superfície lado a lado. */
export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Card className="w-[280px]">
        <CardTitle>Surface</CardTitle>
        <CardDescription className="mt-2">
          aura-surface: luz no topo + elevação ambiente.
        </CardDescription>
      </Card>

      <Card variant="glass-dc" className="w-[280px]">
        <CardTitle>DesignCode Glass</CardTitle>
        <CardDescription className="mt-2 text-white/70">
          Frosted blur 24px + specular bevel highlight.
        </CardDescription>
      </Card>

      <Card3D className="w-[280px]">
        <CardTitle>Card3D</CardTitle>
        <CardDescription className="mt-2">Tilt + glare seguindo o cursor.</CardDescription>
      </Card3D>

      <Spotlight className="aura-surface w-[280px] p-6">
        <CardTitle>Spotlight</CardTitle>
        <CardDescription className="mt-2">Gradiente acompanha o ponteiro.</CardDescription>
      </Spotlight>
    </div>
  )
};

export const DesignCodeProCard: Story = {
  render: () => (
    <div className="p-8 rounded-3xl bg-[#0B0C15] flex justify-center border border-white/10">
      <Card variant="glow" className="w-[340px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3">
            <Badge variant="gradient">DESIGN SYSTEM</Badge>
            <span className="text-xs text-white/60">v2.0</span>
          </div>
          <CardTitle className="text-xl font-bold text-white mt-2">
            DesignCode UI Kit
          </CardTitle>
          <CardDescription className="text-white/70 mt-2 leading-relaxed">
            Profundidade 3D, gradientes vibrantes, superfícies de vidro e microinterações táteis.
          </CardDescription>
        </div>
        <div className="pt-6 flex gap-3">
          <Button variant="gradient" size="md" className="flex-1">
            Começar
          </Button>
          <Button variant="glass" size="md">
            Preview
          </Button>
        </div>
      </Card>
    </div>
  )
};
