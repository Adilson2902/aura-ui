"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Raiz — suporta `orientation="vertical"` (lista à esquerda, conteúdo ao lado). */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn("data-[orientation=vertical]:flex data-[orientation=vertical]:gap-4", className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

/**
 * Estilos da lista: `pill` (padrão, segmentado com superfície), `underline`
 * (linha ativa), `outline`, `glass` e `3d`. Os triggers herdam via contexto.
 */
const tabsListVariants = cva(
  "inline-flex items-center gap-1 text-aura-muted-foreground data-[orientation=vertical]:h-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  {
    variants: {
      variant: {
        pill: "h-10 justify-center rounded-[var(--aura-radius)] bg-aura-muted p-1",
        underline:
          "h-auto gap-4 rounded-none border-b border-aura-border bg-transparent p-0 data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-l",
        outline: "h-10 rounded-[var(--aura-radius)] border border-aura-border bg-transparent p-1",
        glass: "aura-glass-dc h-11 rounded-[var(--aura-radius)] p-1 text-white/60",
        "3d": "h-11 rounded-[var(--aura-radius)] border border-aura-border bg-aura-muted p-1 aura-bevel"
      },
      fullWidth: {
        true: "flex w-full [&>*]:flex-1",
        false: ""
      }
    },
    defaultVariants: { variant: "pill", fullWidth: false }
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        pill: "rounded-[calc(var(--aura-radius)-2px)] px-3 py-1.5 hover:text-aura-surface-foreground data-[state=active]:bg-aura-surface data-[state=active]:text-aura-surface-foreground data-[state=active]:shadow-aura-2",
        underline:
          "relative rounded-none px-1 pb-2.5 pt-1.5 hover:text-aura-surface-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors data-[state=active]:text-aura-surface-foreground data-[state=active]:after:bg-aura-primary data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-3 data-[orientation=vertical]:after:inset-x-auto data-[orientation=vertical]:after:inset-y-0 data-[orientation=vertical]:after:-left-px data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-0.5",
        outline:
          "rounded-[calc(var(--aura-radius)-2px)] border border-transparent px-3 py-1.5 hover:text-aura-surface-foreground data-[state=active]:border-aura-primary/40 data-[state=active]:bg-aura-primary/10 data-[state=active]:text-aura-primary",
        glass:
          "rounded-[calc(var(--aura-radius)-2px)] px-3 py-1.5 hover:text-white data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-aura-glow-primary",
        "3d": "rounded-[calc(var(--aura-radius)-2px)] px-3 py-1.5 hover:text-aura-surface-foreground data-[state=active]:bg-aura-primary data-[state=active]:text-aura-primary-foreground data-[state=active]:shadow-[0_2px_0_0_hsl(var(--aura-primary)/0.5)]"
      }
    },
    defaultVariants: { variant: "pill" }
  }
);

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>;
const TabsVariantContext = React.createContext<TabsVariant>("pill");

export interface TabsListProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = "pill", fullWidth, ...props }, ref) => (
    <TabsVariantContext.Provider value={variant ?? "pill"}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant, fullWidth }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring data-[orientation=vertical]:mt-0",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants };
