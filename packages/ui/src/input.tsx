import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais do input — inclui estado `aria-invalid` (RHF/Zod-friendly).
 * `default`/`soft`/`outline`/`underline` são limpas; `glass`/`glow` são dark-glass;
 * `3d` tem bevel físico (borda inferior grossa + depressão no foco).
 */
const inputVariants = cva(
  "flex h-10 w-full rounded-[var(--aura-radius)] px-3.5 py-2 text-sm transition-all duration-150 placeholder:text-aura-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-aura-destructive aria-[invalid=true]:focus-visible:ring-aura-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 focus-visible:ring-aura-ring",
        soft:
          "border border-transparent bg-aura-muted text-aura-surface-foreground focus-visible:bg-aura-surface focus-visible:ring-aura-ring/50",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground focus-visible:border-aura-primary focus-visible:ring-aura-primary/30",
        underline:
          "rounded-none border-0 border-b-2 border-aura-border bg-transparent px-1 text-aura-surface-foreground focus-visible:border-aura-primary focus-visible:ring-0",
        glass:
          "aura-glass-dc border border-white/15 text-white placeholder:text-white/40 focus-visible:border-aura-primary focus-visible:ring-aura-primary/40 shadow-inner",
        glow:
          "border border-aura-primary/40 bg-aura-muted/50 text-aura-surface-foreground focus-visible:border-aura-primary focus-visible:shadow-[var(--aura-glow-primary)] focus-visible:ring-aura-primary/40",
        "3d":
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel focus-visible:shadow-[0_1px_0_0_hsl(var(--aura-border))] focus-visible:translate-y-[2px] focus-visible:ring-aura-ring"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

/** Campo de texto Aura — 7 variantes (limpas, glass, glow e 3D com bevel físico). */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input, inputVariants };
