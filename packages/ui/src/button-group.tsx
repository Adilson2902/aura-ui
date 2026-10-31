import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * ButtonGroup — cola botões (e inputs/selects) num bloco só: remove os
 * raios internos, sobrepõe as bordas e eleva o item focado.
 * `attached={false}` mantém só o espaçamento (toolbar).
 */
const buttonGroupVariants = cva(
  "inline-flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col"
      },
      attached: {
        true: "",
        false: "gap-2"
      }
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        attached: true,
        class:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px"
      },
      {
        orientation: "vertical",
        attached: true,
        class:
          "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px"
      }
    ],
    defaultVariants: { orientation: "horizontal", attached: true }
  }
);

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, attached, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation ?? "horizontal"}
      className={cn(buttonGroupVariants({ orientation, attached }), className)}
      {...props}
    />
  )
);
ButtonGroup.displayName = "ButtonGroup";

/** Rótulo/sufixo não clicável dentro do grupo (ex.: "https://", "R$"). */
const ButtonGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--aura-radius)] border border-aura-border bg-aura-muted px-3 text-sm text-aura-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
);
ButtonGroupText.displayName = "ButtonGroupText";

/** Divisória fina entre botões sólidos (que não têm borda própria). */
const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    aria-orientation={orientation}
    className={cn(
      "relative z-10 shrink-0 self-stretch bg-black/15 dark:bg-white/15",
      orientation === "vertical" ? "w-px" : "h-px",
      className
    )}
    {...props}
  />
));
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export { ButtonGroup, ButtonGroupText, ButtonGroupSeparator, buttonGroupVariants };
