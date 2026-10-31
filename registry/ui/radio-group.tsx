"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn(
      "grid gap-2.5 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-4",
      className
    )}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = "RadioGroup";

const radioItemVariants = cva(
  "aspect-square shrink-0 rounded-full border border-aura-border bg-aura-surface shadow-aura-1 transition-colors hover:border-aura-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-aura-destructive data-[state=checked]:border-aura-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-4 [&_.aura-radio-dot]:h-1.5 [&_.aura-radio-dot]:w-1.5",
        md: "h-4.5 w-4.5 [&_.aura-radio-dot]:h-2 [&_.aura-radio-dot]:w-2",
        lg: "h-5.5 w-5.5 [&_.aura-radio-dot]:h-2.5 [&_.aura-radio-dot]:w-2.5"
      }
    },
    defaultVariants: { size: "md" }
  }
);

export interface RadioGroupItemProps
  extends
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioItemVariants({ size }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="aura-radio-dot rounded-full bg-aura-primary shadow-aura-glow-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

/**
 * Opção em cartão (radio card): toda a área é clicável e o cartão ganha
 * borda/realce quando selecionado. Use com título/descrição/ícone como filhos.
 */
const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer items-start gap-3 rounded-[var(--aura-radius)] border border-aura-border bg-aura-surface p-4 text-left shadow-aura-1 transition-[border-color,box-shadow,background]",
      "hover:border-aura-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
      "data-[state=checked]:border-aura-primary data-[state=checked]:bg-aura-primary/5 data-[state=checked]:shadow-aura-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <span
      aria-hidden
      className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-aura-border transition-colors group-data-[state=checked]:border-aura-primary"
    >
      <span className="h-2 w-2 scale-0 rounded-full bg-aura-primary transition-transform group-data-[state=checked]:scale-100" />
    </span>
    <span className="flex-1">{children}</span>
  </RadioGroupPrimitive.Item>
));
RadioGroupCard.displayName = "RadioGroupCard";

export { RadioGroup, RadioGroupItem, RadioGroupCard, radioItemVariants };
