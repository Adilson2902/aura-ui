import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut
} from "@aura/ui/command";
import { Button } from "@aura/ui/button";
import { Kbd } from "@aura/ui/kbd";

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Command>;

const Items = () => (
  <>
    <CommandInput placeholder="Digite um comando ou busque…" />
    <CommandList>
      <CommandEmpty>Nenhum resultado.</CommandEmpty>
      <CommandGroup heading="Sugestões">
        <CommandItem>Calendário</CommandItem>
        <CommandItem>Buscar emoji</CommandItem>
        <CommandItem disabled>Calculadora</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Configurações">
        <CommandItem>
          Perfil <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          Faturamento <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          Preferências <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </>
);

export const Inline: Story = {
  render: () => (
    <Command className="w-96 border border-aura-border shadow-aura-2">
      <Items />
    </Command>
  )
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <Command variant="glass" className="w-80">
        <Items />
      </Command>
      <Command variant="glow" className="w-80">
        <Items />
      </Command>
    </div>
  )
};

export const Palette: Story = {
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);
    return (
      <div className="flex items-center gap-3 text-sm text-aura-muted-foreground">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abrir paleta
        </Button>
        ou pressione <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Items />
        </CommandDialog>
      </div>
    );
  }
};
