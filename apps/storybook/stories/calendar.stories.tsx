import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Calendar, type DateRange } from "@aura/ui/calendar";

const meta: Meta = {
  title: "UI/Calendar",
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: function SingleStory() {
    const [date, setDate] = React.useState<Date | null>(new Date());
    return (
      <div className="flex flex-col items-center gap-3">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <p className="text-xs text-aura-muted-foreground">
          {date ? date.toLocaleDateString("pt-BR") : "Nenhuma data"}
        </p>
      </div>
    );
  }
};

export const Range: Story = {
  render: function RangeStory() {
    const [range, setRange] = React.useState<DateRange | null>(null);
    return <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />;
  }
};

export const Constraints: Story = {
  render: () => {
    const today = new Date();
    return (
      <Calendar
        mode="single"
        weekStartsOn={1}
        minDate={today}
        maxDate={new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())}
        disabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
    );
  }
};

export const GlassEnglish: Story = {
  render: () => (
    <div className="rounded-2xl bg-aura-contrast p-8">
      <Calendar
        variant="glass"
        locale="en-US"
        labels={{ previousMonth: "Previous month", nextMonth: "Next month", today: "today" }}
      />
    </div>
  )
};
