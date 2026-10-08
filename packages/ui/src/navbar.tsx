import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes do navbar — `floating`/`sticky` são dark-glass por design
 * (overlay escuro intencional, legível nos dois temas).
 */
const navbarVariants = cva(
  "flex items-center justify-between transition-all duration-200",
  {
    variants: {
      variant: {
        floating:
          "mx-auto w-full max-w-5xl rounded-2xl aura-glass-dc border border-white/15 px-6 py-3 shadow-aura-3",
        sticky:
          "sticky top-0 z-50 w-full aura-glass-dc border-b border-white/10 px-6 py-4",
        ghost:
          "w-full bg-transparent px-6 py-4"
      }
    },
    defaultVariants: {
      variant: "floating"
    }
  }
);

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {}

/** Navbar Aura + Brand/Nav/Link/Action — landmark `header`/`nav` nativo. */
const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, variant, ...props }, ref) => (
    <header ref={ref} className={cn(navbarVariants({ variant, className }))} {...props} />
  )
);
Navbar.displayName = "Navbar";

const NavbarBrand = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2.5 font-bold tracking-tight text-white", className)}
      {...props}
    />
  )
);
NavbarBrand.displayName = "NavbarBrand";

const NavbarNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("hidden md:flex items-center gap-6 text-sm font-medium", className)}
      {...props}
    />
  )
);
NavbarNav.displayName = "NavbarNav";

export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ className, active, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "transition-colors duration-150 py-1 px-2.5 rounded-lg text-sm font-medium",
        active
          ? "text-white bg-white/10"
          : "text-white/70 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    />
  )
);
NavbarLink.displayName = "NavbarLink";

const NavbarAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-3", className)} {...props} />
  )
);
NavbarAction.displayName = "NavbarAction";

export { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarAction, navbarVariants };
