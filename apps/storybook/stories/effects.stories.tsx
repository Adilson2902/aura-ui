import type { Meta, StoryObj } from "@storybook/react";
import {
  Card3D,
  Spotlight,
  ShineBorder,
  AnimatedShinyText,
  AuroraBackground,
  GlowOrb,
  Marquee,
  BorderBeam,
  ShimmerButton,
  BlurFade,
  NumberTicker,
  Ripple
} from "@aura/effects";
import { CardTitle, CardDescription } from "@aura/ui/card";
import { Button } from "@aura/ui/button";
import { Badge } from "@aura/ui/badge";

const meta: Meta = {
  title: "Effects/Gallery",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Efeitos 3D/motion — todos SSR-safe e com fallback `prefers-reduced-motion`. Passe o mouse para interagir."
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const AllEffects: Story = {
  name: "Galeria completa",
  render: () => (
    <div className="grid w-[760px] max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
      <Card3D>
        <CardTitle>Card3D</CardTitle>
        <CardDescription className="mt-2">Mova o mouse para tilt + glare.</CardDescription>
      </Card3D>

      <Spotlight className="aura-surface p-6">
        <CardTitle>Spotlight</CardTitle>
        <CardDescription className="mt-2">Gradiente segue o cursor.</CardDescription>
      </Spotlight>

      <ShineBorder>
        <div className="p-6">
          <CardTitle>ShineBorder</CardTitle>
          <CardDescription className="mt-2">Borda com shimmer animado.</CardDescription>
        </div>
      </ShineBorder>

      <AuroraBackground className="grid place-items-center rounded-[var(--aura-radius)] border border-aura-border p-6">
        <div className="text-center">
          <CardTitle>AuroraBackground</CardTitle>
          <CardDescription className="mt-2">Blobs de luz desfocados.</CardDescription>
        </div>
      </AuroraBackground>
    </div>
  )
};

export const ShinyText: Story = {
  name: "AnimatedShinyText",
  render: () => (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold tracking-tight">
        <AnimatedShinyText>Aura UI brilhante</AnimatedShinyText>
      </h2>
      <p className="mt-3 text-aura-muted-foreground">
        Brilho varrendo o texto, parando com movimento reduzido.
      </p>
    </div>
  )
};

export const Hero: Story = {
  name: "Composição (hero)",
  render: () => (
    <AuroraBackground className="grid w-[760px] max-w-full place-items-center rounded-2xl border border-aura-border p-12">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Construa com <AnimatedShinyText>profundidade</AnimatedShinyText>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-aura-muted-foreground">
          AuroraBackground + AnimatedShinyText + Button 3D, juntos.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="3d" size="lg">
            Começar
          </Button>
          <Button variant="glass" size="lg">
            Ver docs
          </Button>
        </div>
      </div>
    </AuroraBackground>
  )
};

export const MotionGallery: Story = {
  name: "Galeria motion (novos)",
  render: () => (
    <div className="grid w-[760px] max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="aura-surface relative overflow-hidden p-6">
        <GlowOrb color="accent" size="md" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <CardTitle>GlowOrb</CardTitle>
        <CardDescription className="mt-2">Pulso tokenizado, parado com reduced-motion.</CardDescription>
      </div>

      <BorderBeam className="aura-surface p-6" duration={4}>
        <CardTitle>BorderBeam</CardTitle>
        <CardDescription className="mt-2">Feixe percorrendo a borda em loop.</CardDescription>
      </BorderBeam>

      <div className="aura-surface relative overflow-hidden p-6 text-center">
        <Ripple color="cyber" size={260} />
        <CardTitle>Ripple</CardTitle>
        <CardDescription className="mt-2">Ondas concêntricas atrás do conteúdo.</CardDescription>
        <div className="relative mt-4 flex justify-center">
          <ShimmerButton>Começar agora</ShimmerButton>
        </div>
      </div>

      <div className="aura-surface p-6 text-center">
        <CardTitle>NumberTicker</CardTitle>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">
          <NumberTicker value={12847} />
        </p>
        <CardDescription className="mt-2">Contagem com easing exponencial.</CardDescription>
      </div>
    </div>
  )
};

export const MarqueeDemo: Story = {
  name: "Marquee",
  render: () => (
    <div className="w-[760px] max-w-full space-y-4">
      <Marquee className="aura-surface py-3" duration={24}>
        {["DesignCode", "Aura UI", "Shadcn", "Magic UI", "Aceternity", "Radix UI"].map((label) => (
          <Badge key={label} variant="soft">
            {label}
          </Badge>
        ))}
      </Marquee>
      <Marquee className="aura-surface py-3" duration={32} reverse fadeEdges={false}>
        {["Loop perfeito", "Pausa no hover", "Sem snap", "Acessível"].map((label) => (
          <span key={label} className="text-sm font-medium text-aura-muted-foreground">
            {label}
          </span>
        ))}
      </Marquee>
    </div>
  )
};

export const BlurFadeDemo: Story = {
  name: "BlurFade (stagger)",
  render: () => (
    <div className="grid w-[760px] max-w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {[0, 150, 300].map((delay) => (
        <BlurFade key={delay} delay={delay}>
          <div className="aura-surface p-6">
            <CardTitle>Card {delay / 150 + 1}</CardTitle>
            <CardDescription className="mt-2">Revela com delay de {delay}ms.</CardDescription>
          </div>
        </BlurFade>
      ))}
    </div>
  )
};

export const Card3DProps: Story = {
  name: "Card3D (props)",
  render: () => (
    <div className="grid w-[760px] max-w-full grid-cols-1 gap-6 sm:grid-cols-2">
      <Card3D maxTilt={18} scale={1.03}>
        <CardTitle>Tilt agressivo</CardTitle>
        <CardDescription className="mt-2">maxTilt 18 + scale 1.03 + glare.</CardDescription>
      </Card3D>
      <Card3D glare={false} scale={1}>
        <CardTitle>Sem glare</CardTitle>
        <CardDescription className="mt-2">Só tilt, sem zoom nem brilho.</CardDescription>
      </Card3D>
    </div>
  )
};

export const ShineBorderWidths: Story = {
  name: "ShineBorder (espessuras)",
  render: () => (
    <div className="grid w-[760px] max-w-full grid-cols-1 gap-6">
      <ShineBorder borderWidth={1}>
        <div className="p-6">
          <CardTitle>Borda 1px</CardTitle>
          <CardDescription className="mt-2">Espessura real, arco concêntrico.</CardDescription>
        </div>
      </ShineBorder>
      <ShineBorder borderWidth={3} duration={5}>
        <div className="p-6">
          <CardTitle>Borda 3px, ciclo 5s</CardTitle>
          <CardDescription className="mt-2">borderWidth agora controla a borda de verdade.</CardDescription>
        </div>
      </ShineBorder>
      <ShineBorder borderWidth={2} surface={false} className="aura-gradient-primary">
        <div className="p-6 text-white">
          <CardTitle>Sobre gradiente</CardTitle>
          <CardDescription className="mt-2 text-white/80">
            surface=false não cobre o fundo com a superfície sólida.
          </CardDescription>
        </div>
      </ShineBorder>
    </div>
  )
};
