import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, DateRangePicker, type DateRange } from "@aura/ui/date-picker";
import { Field, FieldLabel, FieldDescription, FieldError } from "@aura/ui/field";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: { variant: "default", size: "md", clearable: true },
  argTypes: {
    variant: { control: "select", options: ["default", "soft", "outline", "glass", "3d"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] }
  },
  decorators: [(Story) => <div className="w-72">{Story()}</div>]
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const LongFormat: Story = {
  args: {
    defaultValue: new Date(),
    formatOptions: { weekday: "long", day: "numeric", month: "long" },
    variant: "3d"
  }
};

export const Range: Story = {
  render: function RangeStory() {
    const [range, setRange] = React.useState<DateRange | null>(null);
    return <DateRangePicker value={range} onValueChange={setRange} clearable />;
  }
};

export const InFieldWithError: Story = {
  render: function FieldStory() {
    const [date, setDate] = React.useState<Date | null>(null);
    const today = new Date();
    return (
      <Field invalid={!date} required>
        <FieldLabel>Data de entrega</FieldLabel>
        <DatePicker
          value={date}
          onValueChange={setDate}
          invalid={!date}
          clearable
          calendarProps={{ minDate: today, disabled: (d) => d.getDay() === 0 }}
        />
        <FieldDescription>Não entregamos aos domingos.</FieldDescription>
        <FieldError>Escolha uma data.</FieldError>
      </Field>
    );
  }
};
