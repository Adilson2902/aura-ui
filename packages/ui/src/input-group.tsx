"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes do InputGroup — mesmo visual do Input, mas o foco vem de
 * `focus-within` e o estado inválido de qualquer filho com `aria-invalid`.
 */
const inputGroupVariants = cva(
  [
    "group/input-group relative flex w-full items-center rounded-[var(--aura-radius)] transition-all duration-150",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
    "has-[>[data-mode=block]]:h-auto has-[>[data-mode=block]]:flex-wrap has-[>[data-mode=block]]:py-2",
    "focus-within:ring-2",
    "aria-[invalid=true]:border-aura-destructive has-[[aria-invalid=true]]:border-aura-destructive",
    "has-[[aria-invalid=true]]:focus-within:ring-aura-destructive/40"
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 focus-within:ring-aura-ring",
        soft: "border border-transparent bg-aura-muted text-aura-surface-foreground focus-within:bg-aura-surface focus-within:ring-aura-ring/50",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground focus-within:border-aura-primary focus-within:ring-aura-primary/30",
        glass:
          "aura-glass-dc border border-white/15 text-white focus-within:border-aura-primary focus-within:ring-aura-primary/40 [&_input::placeholder]:text-white/40 [&_textarea::placeholder]:text-white/40",
        "3d": "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel focus-within:translate-y-[2px] focus-within:shadow-[0_1px_0_0_hsl(var(--aura-border))] focus-within:ring-aura-ring"
      },
      size: {
        sm: "h-8 gap-1.5 px-2.5 text-xs",
        md: "h-10 gap-2 px-3 text-sm",
        lg: "h-12 gap-2.5 px-4 text-base"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

export interface InputGroupProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof inputGroupVariants> {}

/**
 * InputGroup — input com addons (ícones, prefixos, Kbd, botões) dentro da mesma borda.
 * Ex.: busca com ícone + atalho, `https://` + domínio, input + botão copiar.
 */
const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="input-group"
      className={cn(inputGroupVariants({ variant, size }), className)}
      {...props}
    />
  )
);
InputGroup.displayName = "InputGroup";

const inputGroupAddonVariants = cva(
  "flex shrink-0 select-none items-center gap-1.5 text-aura-muted-foreground group-[.aura-glass-dc]/input-group:text-white/60 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      align: {
        "inline-start": "order-first",
        "inline-end": "order-last",
        "block-start": "order-first w-full basis-full pb-1",
        "block-end": "order-last w-full basis-full pt-1"
      }
    },
    defaultVariants: { align: "inline-start" }
  }
);

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof inputGroupAddonVariants> {}

/**
 * Addon do grupo — texto ou ícone. `align` posiciona no início/fim (inline)
 * ou acima/abaixo do campo (block). Clicar no addon foca o campo.
 */
const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", onClick, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-align={align}
      data-mode={align?.startsWith("block") ? "block" : "inline"}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) return;
        e.currentTarget.parentElement?.querySelector<HTMLElement>("input,textarea")?.focus();
      }}
      {...props}
    />
  )
);
InputGroupAddon.displayName = "InputGroupAddon";

const fieldReset =
  "min-w-0 flex-1 border-0 bg-transparent p-0 text-inherit shadow-none outline-none placeholder:text-aura-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed";

/** Input sem borda própria — o visual vem do InputGroup. */
const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    data-slot="input-group-control"
    className={cn(fieldReset, "h-full", className)}
    {...props}
  />
));
InputGroupInput.displayName = "InputGroupInput";

/** Textarea sem borda própria — combine com addons `block-*` (ex.: composer de chat). */
const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    data-slot="input-group-control"
    className={cn(fieldReset, "w-full resize-none py-1", className)}
    {...props}
  />
));
InputGroupTextarea.displayName = "InputGroupTextarea";

const inputGroupButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[calc(var(--aura-radius)-4px)] font-medium transition-[background,color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:pointer-events-none disabled:opacity-50 aura-press [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        ghost:
          "text-aura-muted-foreground hover:bg-aura-muted hover:text-aura-surface-foreground group-[.aura-glass-dc]/input-group:text-white/70 group-[.aura-glass-dc]/input-group:hover:bg-white/10",
        soft: "bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/70",
        solid: "bg-aura-primary text-aura-primary-foreground shadow-aura-1 hover:brightness-110"
      },
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-7 px-2.5 text-xs",
        icon: "h-7 w-7"
      }
    },
    defaultVariants: { variant: "ghost", size: "xs" }
  }
);

export interface InputGroupButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof inputGroupButtonVariants> {}

/** Botão compacto dentro do grupo (copiar, limpar, enviar…). */
const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-slot="input-group-button"
      className={cn(inputGroupButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
InputGroupButton.displayName = "InputGroupButton";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupButton,
  inputGroupVariants,
  inputGroupAddonVariants,
  inputGroupButtonVariants
};
