"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Estilos do accordion: `separated` (padrão — cada item é um card),
 * `contained` (um card com divisórias), `line` (só divisórias, sem fundo)
 * e `glass` (dark-glass). Itens/triggers herdam a variante via contexto.
 */
const accordionVariants = cva("", {
  variants: {
    variant: {
      separated: "",
      contained: "aura-surface overflow-hidden divide-y divide-aura-border",
      line: "divide-y divide-aura-border border-y border-aura-border",
      glass: "flex flex-col gap-2"
    }
  },
  defaultVariants: { variant: "separated" }
});

const accordionItemVariants = cva("overflow-hidden", {
  variants: {
    variant: {
      separated: "aura-surface transition-shadow data-[state=open]:shadow-aura-3",
      contained: "",
      line: "",
      glass: "aura-glass-dc"
    }
  },
  defaultVariants: { variant: "separated" }
});

type AccordionVariant = NonNullable<VariantProps<typeof accordionVariants>["variant"]>;
const AccordionVariantContext = React.createContext<AccordionVariant>("separated");

type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants>;

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, ...props }, ref) => (
  <AccordionVariantContext.Provider value={variant ?? "separated"}>
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  </AccordionVariantContext.Provider>
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    /** Ícone à direita (padrão: chevron que gira ao abrir). */
    icon?: React.ReactNode;
  }
>(({ className, children, icon, ...props }, ref) => {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:pointer-events-none disabled:opacity-50",
          variant === "line" ? "px-0 hover:text-aura-primary" : "px-5",
          variant === "glass" ? "hover:bg-white/5" : variant !== "line" && "hover:bg-aura-muted/40",
          className
        )}
        {...props}
      >
        {children}
        {icon ?? (
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

/** Conteúdo — anima a altura real medida pelo Radix (`aura-expandable`). */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const variant = React.useContext(AccordionVariantContext);
  return (
    <AccordionPrimitive.Content ref={ref} className="aura-expandable text-sm" {...props}>
      <div
        className={cn(
          "pb-4 pt-0",
          variant === "line" ? "px-0" : "px-5",
          variant === "glass" ? "text-white/70" : "text-aura-muted-foreground",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants
};
