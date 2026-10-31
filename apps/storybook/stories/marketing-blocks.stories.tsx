import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@aura/ui/banner";
import { TestimonialCard, TestimonialGrid } from "@aura/ui/testimonial";
import { LogoCloud } from "@aura/ui/logo-cloud";
import { Button } from "@aura/ui/button";

const meta: Meta = {
  title: "Blocks/Marketing",
  tags: ["autodocs"],
  parameters: { layout: "padded" }
};

export default meta;
type Story = StoryObj;

export const Banners: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["gradient", "aurora", "primary", "muted", "glass", "warning"] as const).map((variant) => (
        <Banner
          key={variant}
          variant={variant}
          icon="✨"
          dismissible
          action={
            <a href="#" className="font-semibold underline underline-offset-4">
              Ver novidades →
            </a>
          }
        >
          Aura UI v3: 22 componentes novos ({variant})
        </Banner>
      ))}
    </div>
  )
};

const PEOPLE = [
  {
    author: "Marina Costa",
    role: "Head de Design, Lumen",
    quote:
      "Trocamos três bibliotecas pelo Aura. Os temas e o 3D sutil deram identidade ao produto sem custo de performance.",
    rating: 5
  },
  {
    author: "Rafael Lima",
    role: "Front-end, Orbita",
    quote: "O Field + InputGroup resolveu nossos formulários com react-hook-form em uma tarde.",
    rating: 5
  },
  {
    author: "Joana Prado",
    role: "Fundadora, Nébula",
    quote:
      "Montei a landing inteira com Hero, Pricing e Testimonials. Ficou pronta no mesmo dia e funciona no modo escuro.",
    rating: 4
  },
  {
    author: "Diego Alves",
    role: "CTO, Pulsar",
    quote: "Acessibilidade de verdade: foco, teclado e leitores de tela já vêm resolvidos.",
    rating: 5
  }
];

export const Testimonials: Story = {
  render: () => (
    <TestimonialGrid columns={2} className="max-w-3xl">
      {PEOPLE.map((p, i) => (
        <TestimonialCard key={p.author} variant={i === 1 ? "3d" : "surface"} {...p} />
      ))}
    </TestimonialGrid>
  )
};

export const TestimonialsGlass: Story = {
  render: () => (
    <div className="rounded-2xl p-8" style={{ background: "hsl(var(--aura-contrast))" }}>
      <TestimonialGrid columns={2} className="max-w-3xl">
        {PEOPLE.slice(0, 2).map((p, i) => (
          <TestimonialCard key={p.author} variant={i ? "glow" : "glass"} {...p} />
        ))}
      </TestimonialGrid>
    </div>
  )
};

const Logo = ({ name }: { name: string }) => (
  <span className="flex items-center gap-2 text-lg font-bold tracking-tight">
    <span className="h-6 w-6 rounded-md" style={{ background: "var(--aura-gradient-primary)" }} />
    {name}
  </span>
);
const LOGOS = ["Lumen", "Orbita", "Nébula", "Pulsar", "Quasar", "Vértice", "Atlas"];

export const Logos: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <LogoCloud title="Usado por times em" variant="muted">
        {LOGOS.map((l) => (
          <Logo key={l} name={l} />
        ))}
      </LogoCloud>
      <LogoCloud title="Marquee infinito (pausa no hover)" layout="marquee" speed={25}>
        {LOGOS.map((l) => (
          <Logo key={l} name={l} />
        ))}
      </LogoCloud>
      <div className="flex justify-center">
        <Button variant="outline">Ver todos os clientes</Button>
      </div>
    </div>
  )
};
