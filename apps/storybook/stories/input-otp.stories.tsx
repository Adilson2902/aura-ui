import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InputOTP } from "@aura/ui/input-otp";
import { Field, FieldLabel, FieldDescription, FieldError } from "@aura/ui/field";

const meta: Meta<typeof InputOTP> = {
  title: "UI/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  args: { length: 6, variant: "default", size: "md" },
  argTypes: {
    variant: { control: "select", options: ["default", "soft", "glass", "3d"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    pattern: { control: "inline-radio", options: ["numeric", "alphanumeric"] }
  }
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {};

export const Grouped: Story = {
  args: { groupSize: 3, variant: "3d", size: "lg" }
};

export const Verification: Story = {
  render: function VerificationStory() {
    const [code, setCode] = React.useState("");
    const [status, setStatus] = React.useState<"idle" | "ok" | "error">("idle");
    return (
      <Field invalid={status === "error"} className="items-start">
        <FieldLabel>Código enviado por SMS</FieldLabel>
        <InputOTP
          value={code}
          groupSize={3}
          invalid={status === "error"}
          onChange={(v) => {
            setCode(v);
            setStatus("idle");
          }}
          onComplete={(v) => setStatus(v === "123456" ? "ok" : "error")}
        />
        <FieldDescription>
          {status === "ok" ? "Verificado ✓" : "Dica: o código correto é 123456."}
        </FieldDescription>
        <FieldError>Código inválido. Tente novamente.</FieldError>
      </Field>
    );
  }
};

export const MaskedGlass: Story = {
  render: () => (
    <div className="rounded-2xl bg-aura-contrast p-8">
      <InputOTP length={4} mask variant="glass" pattern="alphanumeric" />
    </div>
  )
};
