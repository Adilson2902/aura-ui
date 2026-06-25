import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@aura/core";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--aura-radius)] text-sm font-medium transition-[transform,box-shadow,background] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "bg-aura-primary text-aura-primary-foreground shadow-aura-2 hover:brightness-110 aura-press",
        soft: "bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/80 aura-press",
        outline:
          "border border-aura-border bg-transparent hover:bg-aura-muted/50 aura-press",
        ghost: "hover:bg-aura-muted/60 aura-press",
        glass: "aura-glass text-aura-surface-foreground aura-press",
        "3d":
          "bg-aura-primary text-aura-primary-foreground shadow-aura-3 translate-y-0 hover:-translate-y-0.5 aura-press border border-white/10"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "solid",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
