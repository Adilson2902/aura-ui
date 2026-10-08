import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const spinnerVariants = cva("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-5 w-5",
      lg: "h-8 w-8"
    }
  },
  defaultVariants: { size: "md" }
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Rótulo acessível (padrão "Carregando"). */
  label?: string;
}

/** Indicador de carregamento leve, sem JS. */
const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = "Carregando", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  )
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
