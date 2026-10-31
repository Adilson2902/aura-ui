"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("aura-overlay fixed inset-0 z-50 bg-aura-contrast/45 backdrop-blur-sm", className)}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

/**
 * Painel lateral: `side` define a borda de origem (anima deslizando dela),
 * `size` a largura (left/right) ou altura (top/bottom, só `full`).
 */
const sheetVariants = cva(
  "aura-sheet fixed z-50 flex flex-col gap-4 overflow-y-auto bg-aura-surface p-6 text-aura-surface-foreground shadow-aura-5 focus:outline-none",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 max-h-[85dvh] border-b border-aura-border",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] border-t border-aura-border",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-aura-border",
        right: "inset-y-0 right-0 h-full w-3/4 border-l border-aura-border"
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        full: ""
      },
      glass: {
        true: "aura-glass-dc text-white border-white/10",
        false: ""
      }
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", class: "sm:max-w-xs" },
      { side: ["left", "right"], size: "md", class: "sm:max-w-sm" },
      { side: ["left", "right"], size: "lg", class: "sm:max-w-lg" },
      { side: ["left", "right"], size: "xl", class: "sm:max-w-2xl" },
      { side: ["left", "right"], size: "full", class: "w-full" },
      { side: ["top", "bottom"], size: "full", class: "h-dvh max-h-dvh" }
    ],
    defaultVariants: {
      side: "right",
      size: "md",
      glass: false
    }
  }
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Exibe o botão fechar no canto (padrão `true`). */
  showClose?: boolean;
  /** Rótulo acessível do botão fechar (padrão "Fechar"). */
  closeLabel?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      size,
      glass = false,
      showClose = true,
      closeLabel = "Fechar",
      className,
      children,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-side={side}
        className={cn(sheetVariants({ side, size, glass }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 pr-6 text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-aura-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants
};
