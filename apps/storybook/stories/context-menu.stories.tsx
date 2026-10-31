import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent
} from "@aura/ui/context-menu";

const meta: Meta = {
  title: "UI/ContextMenu",
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

const Area = ({ children }: { children: React.ReactNode }) => (
  <ContextMenuTrigger className="flex h-40 w-80 items-center justify-center rounded-[var(--aura-radius)] border-2 border-dashed border-aura-border text-sm text-aura-muted-foreground">
    {children}
  </ContextMenuTrigger>
);

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <Area>Clique com o botão direito aqui</Area>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Voltar <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Avançar <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Recarregar <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Mais ferramentas</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Salvar página…</ContextMenuItem>
            <ContextMenuItem>Criar atalho…</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Ferramentas do dev</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>
          Excluir <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
};

export const CheckboxAndRadio: Story = {
  render: function Render() {
    const [grid, setGrid] = React.useState(true);
    const [rulers, setRulers] = React.useState(false);
    const [zoom, setZoom] = React.useState("100");
    return (
      <ContextMenu>
        <Area>Opções do canvas (botão direito)</Area>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Exibir</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Grade
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={rulers} onCheckedChange={setRulers}>
            Réguas
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Zoom</ContextMenuLabel>
          <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
            <ContextMenuRadioItem value="50">50%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
};
