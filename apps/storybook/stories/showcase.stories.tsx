import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "@aura/ui/button";
import { Input } from "@aura/ui/input";
import { CardTitle, CardDescription } from "@aura/ui/card";
import { AuroraBackground, AnimatedShinyText, Card3D, Spotlight, ShineBorder } from "@aura/effects";

const meta: Meta = {
  title: "Overview/Showcase",
  parameters: {
    layout: "fullscreen",
    a11y: { disable: false }
  }
};

export default meta;
type Story = StoryObj;

/* ---------- ícones inline (sem dependência) ---------- */

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  layers: "M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5",
  bolt: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  sparkles:
    "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "M20 6 9 17l-5-5"
} as const;

/* ---------- seções ---------- */

function Nav() {
  return (
    <header className="aura-glass mx-auto mt-6 flex w-[min(1100px,92%)] items-center justify-between rounded-full px-5 py-3">
      <div className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-aura-primary text-aura-primary-foreground shadow-aura-2">
          <Icon path={icons.layers} className="h-4 w-4" />
        </span>
        Aura UI
      </div>
      <nav className="hidden gap-7 text-sm text-aura-muted-foreground md:flex">
        <a href="#" className="transition-colors hover:text-aura-surface-foreground">
          Componentes
        </a>
        <a href="#" className="transition-colors hover:text-aura-surface-foreground">
          Efeitos
        </a>
        <a href="#" className="transition-colors hover:text-aura-surface-foreground">
          Temas
        </a>
        <a href="#" className="transition-colors hover:text-aura-surface-foreground">
          Docs
        </a>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Entrar
        </Button>
        <Button variant="3d" size="sm">
          Começar
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <AuroraBackground className="px-6 pb-20 pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="aura-glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-aura-muted-foreground">
          <Icon path={icons.sparkles} className="h-3.5 w-3.5 text-aura-primary" />
          Design System 3D · v0.1
        </span>
        <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          Interfaces com <AnimatedShinyText>profundidade real</AnimatedShinyText>,
          <br className="hidden md:block" /> não só sombras bonitas.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-aura-muted-foreground">
          O melhor de shadcn, Magic UI e Aceternity — tokenizado, acessível e SSR-safe. Copie o
          componente, mantenha o controle.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="3d" size="lg" className="gap-2">
            Explorar componentes
            <Icon path={icons.arrow} className="h-4 w-4" />
          </Button>
          <Button variant="glass" size="lg">
            npx aura init
          </Button>
        </div>
        <p className="mt-4 text-xs text-aura-muted-foreground">
          50+ componentes · 30+ efeitos · light/dark · prefers-reduced-motion
        </p>
      </div>
    </AuroraBackground>
  );
}

const features = [
  {
    icon: icons.layers,
    title: "Profundidade tokenizada",
    desc: "Elevação, luz direcional e glass via CSS variables — não sombras soltas."
  },
  {
    icon: icons.bolt,
    title: "Animações performáticas",
    desc: "Só transform/opacity, GPU-friendly e com fallback de movimento reduzido."
  },
  {
    icon: icons.shield,
    title: "Acessível por padrão",
    desc: "Radix por baixo, foco visível, aria-* e contraste validado por axe."
  }
];

function Bento() {
  return (
    <section className="mx-auto grid w-[min(1100px,92%)] gap-5 py-4 md:grid-cols-3">
      {features.map((f) => (
        <Card3D key={f.title} className="md:first:col-span-1">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-aura-primary/10 text-aura-primary">
            <Icon path={f.icon} className="h-5 w-5" />
          </span>
          <CardTitle className="mt-4">{f.title}</CardTitle>
          <CardDescription className="mt-2">{f.desc}</CardDescription>
        </Card3D>
      ))}
    </section>
  );
}

function Pricing() {
  return (
    <section className="mx-auto grid w-[min(1100px,92%)] items-stretch gap-5 py-16 md:grid-cols-2">
      <Spotlight className="aura-surface flex flex-col justify-between p-8">
        <div>
          <CardTitle className="text-2xl">Open source</CardTitle>
          <CardDescription className="mt-2">
            Todos os componentes, o registry e a CLI. Para sempre.
          </CardDescription>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Copia o código pro seu projeto",
              "Temas trocáveis por tokens",
              "Atualizações via aura diff"
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon path={icons.check} className="h-4 w-4 text-aura-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <Button variant="outline" className="mt-8 w-full">
          Clonar no GitHub
        </Button>
      </Spotlight>

      <ShineBorder className="h-full">
        <div className="flex h-full flex-col justify-between p-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-aura-primary">
              Pro
            </span>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-4xl font-extrabold tracking-tight">R$0</span>
              <span className="pb-1 text-sm text-aura-muted-foreground">/ por enquanto 😉</span>
            </div>
            <p className="mt-4 text-sm text-aura-muted-foreground">
              Receba blocos, templates e cenas 3D (r3f) à medida que saem.
            </p>
            <div className="mt-6 flex gap-2">
              <Input placeholder="seu@email.com" type="email" />
              <Button variant="3d">Quero</Button>
            </div>
          </div>
          <p className="mt-6 text-xs text-aura-muted-foreground">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </ShineBorder>
    </section>
  );
}

export const Showcase: Story = {
  render: () => (
    <div className="min-h-screen pb-20">
      <Nav />
      <Hero />
      <Bento />
      <Pricing />
    </div>
  )
};
