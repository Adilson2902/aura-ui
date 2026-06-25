import * as React from "react";
import { cn } from "@aura/core";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-[var(--aura-radius)] border border-aura-border bg-aura-surface px-3 py-2 text-sm shadow-aura-1",
      "placeholder:text-aura-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
