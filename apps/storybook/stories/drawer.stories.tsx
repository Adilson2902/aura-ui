import type { Meta, StoryObj } from "@storybook/react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from "@aura/ui/drawer";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof DrawerContent> = {
  title: "UI/Drawer",
  component: DrawerContent,
  tags: ["autodocs"],
  argTypes: {
    side: { control: "inline-radio", options: ["bottom", "top", "left", "right"] },
    variant: { control: "inline-radio", options: ["surface", "glass"] }
  },
  args: { side: "bottom", variant: "surface", dragToClose: true, handle: true }
};

export default meta;
type Story = StoryObj<typeof DrawerContent>;

export const Playground: Story = {
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="3d">Abrir drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Meta diária</DrawerTitle>
            <DrawerDescription>Arraste a alça para fechar ou pressione Esc.</DrawerDescription>
          </DrawerHeader>
          <div className="px-6 py-4 text-center">
            <p className="text-6xl font-bold tracking-tight">350</p>
            <p className="text-xs uppercase tracking-wide opacity-60">calorias/dia</p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
            <Button>Salvar</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
};

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["bottom", "top", "left", "right"] as const).map((side) => (
        <Drawer key={side}>
          <DrawerTrigger asChild>
            <Button variant="outline">{side}</Button>
          </DrawerTrigger>
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>Drawer {side}</DrawerTitle>
              <DrawerDescription>Gesto de fechar acompanha o lado.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
};

export const Glass: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="glow">Drawer glass</Button>
      </DrawerTrigger>
      <DrawerContent variant="glass">
        <DrawerHeader>
          <DrawerTitle>Compartilhar</DrawerTitle>
          <DrawerDescription className="text-white/60">
            Envie o link para o seu time.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="glass">Concluir</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
};
