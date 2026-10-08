import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const alertVariants = cva(
  "relative w-full rounded-[var(--aura-radius)] border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "aura-surface text-aura-surface-foreground",
        info: "border-aura-primary/35 bg-aura-primary/10 text-aura-surface-foreground",
        success: "border-aura-success/40 bg-aura-success/10 text-aura-surface-foreground",
        warning: "border-aura-warning/40 bg-aura-warning/10 text-aura-surface-foreground",
        destructive: "border-aura-destructive/40 bg-aura-destructive/10 text-aura-surface-foreground",
        glass: "aura-glass text-aura-surface-foreground"
      },
      elevation: {
        none: "",
        soft: "shadow-aura-1",
        raised: "shadow-aura-2 aura-elevated"
      }
    },
    defaultVariants: {
      variant: "default",
      elevation: "none"
    }
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

/** Callout de status (Toolspace-parity) com variantes tokenizadas + elevação opcional. */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, elevation, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, elevation, className }))}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
