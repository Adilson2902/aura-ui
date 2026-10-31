import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@aura/ui/tabs";
import { CardDescription, CardTitle } from "@aura/ui/card";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="conta" className="w-[420px]">
      <TabsList className="w-full">
        <TabsTrigger value="conta" className="flex-1">
          Conta
        </TabsTrigger>
        <TabsTrigger value="senha" className="flex-1">
          Senha
        </TabsTrigger>
        <TabsTrigger value="time" className="flex-1">
          Time
        </TabsTrigger>
      </TabsList>
      <TabsContent value="conta">
        <div className="aura-surface p-4">
          <CardTitle>Conta</CardTitle>
          <CardDescription className="mt-1">Gerencie seus dados pessoais.</CardDescription>
        </div>
      </TabsContent>
      <TabsContent value="senha">
        <div className="aura-surface p-4">
          <CardTitle>Senha</CardTitle>
          <CardDescription className="mt-1">Atualize sua senha de acesso.</CardDescription>
        </div>
      </TabsContent>
      <TabsContent value="time">
        <div className="aura-surface p-4">
          <CardTitle>Time</CardTitle>
          <CardDescription className="mt-1">Convide e gerencie membros.</CardDescription>
        </div>
      </TabsContent>
    </Tabs>
  )
};

/** Os 5 estilos de lista (`pill`, `underline`, `outline`, `glass`, `3d`). */
export const Variants: Story = {
  render: () => (
    <div className="flex w-[460px] flex-col gap-6">
      {(["pill", "underline", "outline", "glass", "3d"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="geral">
          <TabsList variant={variant} fullWidth>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="cobranca">Cobrança</TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  )
};

/** Orientação vertical — lista à esquerda, conteúdo ao lado. */
export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="perfil" orientation="vertical" className="w-[480px]">
      <TabsList variant="underline">
        <TabsTrigger value="perfil">Perfil</TabsTrigger>
        <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        <TabsTrigger value="avisos">Avisos</TabsTrigger>
      </TabsList>
      <TabsContent value="perfil" className="aura-surface p-4 text-sm">Dados do perfil.</TabsContent>
      <TabsContent value="seguranca" className="aura-surface p-4 text-sm">Senha e 2FA.</TabsContent>
      <TabsContent value="avisos" className="aura-surface p-4 text-sm">Preferências de e-mail.</TabsContent>
    </Tabs>
  )
};
