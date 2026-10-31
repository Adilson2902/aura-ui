"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { useReducedMotion } from "aura-ui-core/client";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerPortal = DialogPrimitive.Portal;

/** Backdrop do drawer — fade de entrada/saída (`aura-overlay`). */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("aura-overlay fixed inset-0 z-50 bg-black/45 backdrop-blur-sm", className)}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

/** Lado de abertura + superfície do drawer. */
const drawerVariants = cva(
  "aura-sheet fixed z-50 flex flex-col bg-aura-surface text-aura-surface-foreground shadow-aura-3 outline-none",
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 max-h-[85vh] rounded-t-[calc(var(--aura-radius)*1.5)] border-t border-aura-border",
        top: "inset-x-0 top-0 max-h-[85vh] rounded-b-[calc(var(--aura-radius)*1.5)] border-b border-aura-border",
        left: "inset-y-0 left-0 h-full w-3/4 max-w-sm rounded-r-[calc(var(--aura-radius)*1.5)] border-r border-aura-border",
        right:
          "inset-y-0 right-0 h-full w-3/4 max-w-sm rounded-l-[calc(var(--aura-radius)*1.5)] border-l border-aura-border"
      },
      variant: {
        surface: "",
        glass: "aura-glass-dc border-white/10 text-white"
      }
    },
    defaultVariants: { side: "bottom", variant: "surface" }
  }
);

type DrawerSide = NonNullable<VariantProps<typeof drawerVariants>["side"]>;

/** Eixo/sentido do gesto que fecha, por lado. */
const DRAG: Record<DrawerSide, { axis: "x" | "y"; sign: 1 | -1 }> = {
  bottom: { axis: "y", sign: 1 },
  top: { axis: "y", sign: -1 },
  left: { axis: "x", sign: -1 },
  right: { axis: "x", sign: 1 }
};

export interface DrawerContentProps
  extends
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerVariants> {
  /** Permite arrastar a alça para fechar (padrão `true`). */
  dragToClose?: boolean;
  /** Fração do tamanho do painel que precisa ser arrastada para fechar (padrão 0.3). */
  closeThreshold?: number;
  /** Mostra a alça visual (padrão `true`). */
  handle?: boolean;
  /** Rótulo do botão de fechar (oculto, para leitores de tela). */
  closeLabel?: string;
}

/**
 * Gaveta (Radix Dialog) — desliza do lado escolhido (`aura-sheet`), com alça
 * arrastável: soltar além de `closeThreshold` fecha; antes disso, volta com mola.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      side,
      variant,
      dragToClose = true,
      closeThreshold = 0.3,
      handle = true,
      closeLabel = "Fechar",
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const resolvedSide: DrawerSide = side ?? "bottom";
    const { axis, sign } = DRAG[resolvedSide];
    const reducedMotion = useReducedMotion();
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const closeRef = React.useRef<HTMLButtonElement>(null);
    const drag = React.useRef<{ start: number; delta: number; pointerId: number } | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef]
    );

    const translate = (px: number) =>
      axis === "y" ? `translate3d(0, ${px}px, 0)` : `translate3d(${px}px, 0, 0)`;

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragToClose || e.button !== 0) return;
      const node = contentRef.current;
      if (!node) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      node.style.transition = "none";
      drag.current = {
        start: axis === "y" ? e.clientY : e.clientX,
        delta: 0,
        pointerId: e.pointerId
      };
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      const node = contentRef.current;
      if (!state || !node || state.pointerId !== e.pointerId) return;
      const raw = (axis === "y" ? e.clientY : e.clientX) - state.start;
      // Só desloca no sentido de fechar; no sentido oposto aplica resistência.
      const delta = raw * sign > 0 ? raw : raw * 0.15;
      state.delta = delta;
      node.style.transform = translate(delta);
    };

    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      const state = drag.current;
      const node = contentRef.current;
      if (!state || !node || state.pointerId !== e.pointerId) return;
      drag.current = null;
      const size = axis === "y" ? node.offsetHeight : node.offsetWidth;
      if (state.delta * sign > size * closeThreshold) {
        // A animação de saída parte da posição arrastada (animations > inline style).
        closeRef.current?.click();
        return;
      }
      node.style.transition = reducedMotion
        ? "none"
        : "transform var(--aura-dur) var(--aura-ease-spring)";
      node.style.transform = "";
    };

    const handleEl = handle ? (
      <div
        aria-hidden
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "flex shrink-0 touch-none items-center justify-center",
          dragToClose && (axis === "y" ? "cursor-grab active:cursor-grabbing" : "cursor-grab"),
          axis === "y" ? "h-7 w-full" : "absolute inset-y-0 w-7",
          resolvedSide === "left" && "right-0",
          resolvedSide === "right" && "left-0"
        )}
      >
        <span
          className={cn(
            "rounded-full bg-current opacity-20",
            axis === "y" ? "h-1.5 w-12" : "h-12 w-1.5"
          )}
        />
      </div>
    ) : null;

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Content
          ref={setRefs}
          data-side={resolvedSide}
          className={cn(
            drawerVariants({ side: resolvedSide, variant }),
            resolvedSide === "left" && handle && "pr-7",
            resolvedSide === "right" && handle && "pl-7",
            className
          )}
          {...props}
        >
          {resolvedSide !== "top" && handleEl}
          {children}
          {resolvedSide === "top" && handleEl}
          <DialogPrimitive.Close
            ref={closeRef}
            tabIndex={-1}
            aria-label={closeLabel}
            className="sr-only"
          />
        </DialogPrimitive.Content>
      </DrawerPortal>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 pb-2 pt-2 text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-aura-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  drawerVariants
};
