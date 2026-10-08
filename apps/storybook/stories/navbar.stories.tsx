import type { Meta, StoryObj } from "@storybook/react";
import { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarAction } from "@aura/ui/navbar";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof Navbar> = {
  title: "UI/Navbar",
  component: Navbar,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const FloatingGlass: Story = {
  render: () => (
    <div className="relative min-h-[300px] w-full rounded-3xl bg-[#0B0C15] p-8 overflow-hidden flex flex-col justify-between">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-[#7857FF]/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[#00F2FE]/20 blur-[100px]" />

      <Navbar variant="floating">
        <NavbarBrand>
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-[#7857FF] to-[#00F2FE] flex items-center justify-center text-white font-black text-xs shadow-md">
            A
          </div>
          <span className="text-base font-bold">Aura UI</span>
        </NavbarBrand>

        <NavbarNav>
          <NavbarLink href="#" active>
            Componentes
          </NavbarLink>
          <NavbarLink href="#">Design System</NavbarLink>
          <NavbarLink href="#">Efeitos 3D</NavbarLink>
          <NavbarLink href="#">Docs</NavbarLink>
        </NavbarNav>

        <NavbarAction>
          <Button variant="glass" size="sm">
            Sign In
          </Button>
          <Button variant="gradient" size="sm">
            Get Started
          </Button>
        </NavbarAction>
      </Navbar>

      <div className="text-center text-white/50 text-sm mt-12">
        DesignCode UI Floating Glass Navigation Bar
      </div>
    </div>
  )
};
