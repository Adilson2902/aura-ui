import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "@aura/ui/number-input";
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from "@aura/ui/field";

const meta: Meta<typeof NumberInput> = {
  title: "UI/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  args: { defaultValue: 3, min: 0, max: 10, controls: "sides", variant: "default", size: "md" },
  argTypes: {
    controls: { control: "inline-radio", options: ["sides", "stacked", "none"] },
    variant: { control: "select", options: ["default", "soft", "outline", "glass", "glow", "3d"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] }
  },
  decorators: [(Story) => <div className="w-56">{Story()}</div>]
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {};

export const Currency: Story = {
  args: {
    defaultValue: 1999.9,
    step: 0.5,
    precision: 2,
    min: 0,
    max: undefined,
    controls: "stacked",
    formatOptions: { style: "currency", currency: "BRL" }
  }
};

export const Percent: Story = {
  args: {
    defaultValue: 0.25,
    step: 0.05,
    min: 0,
    max: 1,
    variant: "3d",
    formatOptions: { style: "percent" }
  }
};

export const InField: Story = {
  render: function InFieldStory() {
    const [qty, setQty] = React.useState<number | null>(12);
    const invalid = qty === null || qty > 10;
    return (
      <Field invalid={invalid}>
        <FieldLabel>Quantidade</FieldLabel>
        <FieldControl>
          <NumberInput value={qty} onValueChange={setQty} min={1} clampOnBlur={false} />
        </FieldControl>
        <FieldDescription>Máximo de 10 por pedido.</FieldDescription>
        <FieldError>{qty === null ? "Informe a quantidade." : "Acima do limite."}</FieldError>
      </Field>
    );
  }
};
