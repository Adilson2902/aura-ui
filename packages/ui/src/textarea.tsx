import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes visuais do textarea — espelham o input (7), com `aria-invalid`. */
const textareaVariants = cva(
  "flex min-h-[5.5rem] w-full rounded-[var(--aura-radius)] px-3.5 py-2.5 text-sm transition-all duration-150 placeholder:text-aura-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-aura-destructive aria-[invalid=true]:focus-visible:ring-aura-destructive/40 field-sizing-content",
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

/**
 * Área de texto Aura — mesmas variantes do input, altura mínima tokenizada,
 * auto-expansão via `field-sizing` (com fallback gracioso) e `aria-invalid`.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => (
    <textarea className={cn(textareaVariants({ variant, className }))} ref={ref} {...props} />
  )
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
