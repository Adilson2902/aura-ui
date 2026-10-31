import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Combobox, type ComboboxOption } from "@aura/ui/combobox";
import { Label } from "@aura/ui/label";

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const frameworks: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix", keywords: ["react router"] },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "angular", label: "Angular", disabled: true }
];

export const Single: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("");
    return (
      <div className="flex w-72 flex-col gap-2">
        <Label htmlFor="fw">Framework</Label>
        <Combobox
          id="fw"
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Escolha um framework…"
        />
        <p className="text-xs text-aura-muted-foreground">Valor: {value || "—"}</p>
      </div>
    );
  }
};

export const Multiple: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<string[]>(["next", "astro"]);
    return (
      <div className="flex w-80 flex-col gap-2">
        <Label htmlFor="stack">Stack</Label>
        <Combobox
          id="stack"
          multiple
          options={frameworks}
          value={value}
          onValueChange={setValue}
          maxChips={3}
          placeholder="Selecione frameworks…"
        />
        <p className="text-xs text-aura-muted-foreground">Valor: {value.join(", ") || "—"}</p>
      </div>
    );
  }
};

export const Uncontrolled: Story = {
  render: () => (
    <form
      className="flex w-72 flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        alert(new FormData(e.currentTarget).getAll("framework").join(", "));
      }}
    >
      <Combobox name="framework" aria-label="Framework" options={frameworks} defaultValue="nuxt" />
      <button type="submit" className="text-sm text-aura-primary underline">
        Enviar formulário
      </button>
    </form>
  )
};
