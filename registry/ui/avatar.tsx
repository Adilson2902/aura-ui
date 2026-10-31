"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[0.625rem]",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-24 w-24 text-2xl"
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-[var(--aura-radius)]"
      },
      ring: {
        none: "",
        soft: "ring-2 ring-aura-border",
        glow: "ring-2 ring-aura-primary/60 shadow-aura-glow-primary",
        float: "aura-tilt ring-2 ring-white/20 shadow-aura-3",
        gradient:
          "ring-2 ring-transparent bg-clip-padding [background:linear-gradient(var(--aura-gradient-primary))_border-box] shadow-aura-2"
      }
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      ring: "none"
    }
  }
);

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, shape, ring, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-shape={shape ?? "circle"}
    className={cn(avatarVariants({ size, shape, ring }), className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-aura-muted font-semibold text-aura-surface-foreground",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Máximo de avatares visíveis; o resto vira um contador "+N". */
  max?: number;
  /** Tamanho do contador "+N" (use o mesmo dos avatares). */
  size?: VariantProps<typeof avatarVariants>["size"];
  /** Rótulo acessível do contador (recebe o total oculto). */
  overflowLabel?: (hidden: number) => string;
}

/**
 * Pilha de avatares sobrepostos com anel na cor da superfície;
 * passa o mouse/foco e o avatar sobe à frente.
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      children,
      max,
      size = "md",
      overflowLabel = (n) => `mais ${n} pessoas`,
      ...props
    },
    ref
  ) => {
    const items = React.Children.toArray(children).filter(React.isValidElement);
    const visible = max != null ? items.slice(0, max) : items;
    const hidden = items.length - visible.length;
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-aura-surface [&>*]:transition-transform [&>*:hover]:z-10 [&>*:hover]:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {visible}
        {hidden > 0 && (
          <span
            aria-label={overflowLabel(hidden)}
            className={cn(
              avatarVariants({ size }),
              "items-center justify-center rounded-full bg-aura-muted font-semibold text-aura-muted-foreground"
            )}
          >
            +{hidden}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants };
