"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Caixa do checkbox — `checked="indeterminate"` mostra um traço. */
const checkboxVariants = cva(
  "peer group shrink-0 border border-aura-border bg-aura-surface shadow-aura-1 transition-colors hover:border-aura-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-aura-destructive data-[state=checked]:border-aura-primary data-[state=checked]:bg-aura-primary data-[state=checked]:text-aura-primary-foreground data-[state=indeterminate]:border-aura-primary data-[state=indeterminate]:bg-aura-primary data-[state=indeterminate]:text-aura-primary-foreground",
  {
    variants: {
      size: {
        sm: "h-4 w-4 rounded-[5px]",
        md: "h-4.5 w-4.5 rounded-md",
        lg: "h-5.5 w-5.5 rounded-md"
      },
      shape: {
        square: "",
        circle: "rounded-full"
      }
    },
    defaultVariants: { size: "md", shape: "square" }
  }
);

export interface CheckboxProps
  extends
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size, shape, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size, shape }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[75%] w-[75%] group-data-[state=indeterminate]:hidden"
        >
          <path d="m5 12 5 5L20 7" />
        </svg>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="hidden h-[75%] w-[75%] group-data-[state=indeterminate]:block"
        >
          <path d="M6 12h12" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
