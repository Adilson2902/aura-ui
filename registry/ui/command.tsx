"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./dialog";

/** Superfícies da paleta de comandos. */
const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-[var(--aura-radius)]",
  {
    variants: {
      variant: {
        surface: "bg-aura-surface text-aura-surface-foreground",
        glass: "aura-glass text-aura-surface-foreground",
        glow: "aura-glass-dc border border-white/15 shadow-aura-glow-primary"
      }
    },
    defaultVariants: { variant: "surface" }
  }
);

export interface CommandProps
  extends
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
    VariantProps<typeof commandVariants> {}

/**
 * Command (cmdk) — lista filtrável por teclado: busca fuzzy, setas, Enter.
 * Base de paletas ⌘K, comboboxes e menus pesquisáveis.
 */
const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, variant, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(commandVariants({ variant }), className)}
      {...props}
    />
  )
);
Command.displayName = "Command";

export interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  /** Título para leitores de tela (visualmente oculto). */
  title?: string;
  /** Descrição para leitores de tela (visualmente oculta). */
  description?: string;
  /** Classe do DialogContent. */
  className?: string;
  /** Variante visual do Command interno. */
  variant?: CommandProps["variant"];
  /** Props repassadas ao Command (ex.: `filter`, `loop`, `shouldFilter`). */
  commandProps?: Omit<CommandProps, "children" | "variant">;
}

/** Paleta de comandos em modal (padrão ⌘K) — Dialog Aura + Command. */
function CommandDialog({
  title = "Paleta de comandos",
  description = "Busque um comando para executar.",
  className,
  variant,
  commandProps,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        showClose={false}
        className={cn(
          "max-w-xl gap-0 overflow-hidden p-0",
          variant === "glow" && "border-white/15 bg-transparent",
          className
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command
          variant={variant}
          {...commandProps}
          className={cn(
            "rounded-none [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:py-2.5",
            variant !== "glow" && "bg-transparent",
            commandProps?.className
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
CommandDialog.displayName = "CommandDialog";

/** Campo de busca do Command — ícone de lupa decorativo. */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-2 border-b border-current/10 px-3" cmdk-input-wrapper="">
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 opacity-50"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-aura-muted-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden p-1", className)}
    {...props}
  />
));
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm text-aura-muted-foreground", className)}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-aura-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-current/10", className)}
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

/** Item do Command — destaque por `data-selected` (teclado/hover), `data-disabled`. */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors",
      "data-[selected=true]:bg-aura-primary/10 data-[selected=true]:text-aura-primary",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-aura-muted-foreground", className)}
    {...props}
  />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  commandVariants
};
