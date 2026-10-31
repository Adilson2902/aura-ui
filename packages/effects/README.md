# aura-ui-effects

Efeitos **3D / motion** do Aura UI — Magic UI + Aceternity, tokenizados, SSR-safe, com `prefers-reduced-motion`.

## Instalação

```bash
npm install aura-ui-core aura-ui-effects
```

```css
/* CSS do app (Tailwind v4) */
@import "aura-ui-tailwind";
@import "aura-ui-effects/tailwind.css";
```

Sem Tailwind, importe só o CSS do core: `aura-ui-core/styles/tokens.css` e `aura-ui-core/styles/primitives.css`.

```tsx
import { Card3D, LayeredCard, BentoGrid, HeroParallax } from "aura-ui-effects";
```

Importes granulares:

```tsx
import { Card3D } from "aura-ui-effects/card-3d";
import { Meteors } from "aura-ui-effects/meteors";
```

## Catálogo

| Efeito | O que faz |
| --- | --- |
| **Card3D** | tilt + glare que segue o cursor |
| **LayeredCard** | parallax em camadas (`data-depth`) |
| **GlassCard** | vidro especular + elevação |
| **MovingBorder** | borda conic animada |
| **BentoGrid / BentoItem** | grid com tilt por célula |
| **HeroParallax** | 3D no scroll |
| **StickyScroll** | sticky + destaque em Z |
| **OrbitingCircles** | órbita CSS |
| **AnimatedBeam** | feixe entre dois nós |
| **Meteors** | chuva de meteoros |
| **PerspectiveGrid** | chão 3D infinito |
| **Float** | flutuar em loop |
| **Spotlight** | luz que segue o mouse |
| **ShineBorder / BorderBeam** | brilho em borda |
| **AuroraBackground** | atmosfera de gradiente |
| **Marquee** | letreiro infinito |
| **ShimmerButton / AnimatedShinyText** | shimmer |
| **BlurFade / NumberTicker / Ripple / GlowOrb** | micro-motion |

## Exemplo rápido

```tsx
import { Card3D, Meteors, BentoGrid, BentoItem } from "aura-ui-effects";

export function Hero() {
  return (
    <div className="relative">
      <Meteors count={18} />
      <Card3D maxTilt={12}>
        <h2>Profundidade de verdade</h2>
      </Card3D>
      <BentoGrid cols={3}>
        <BentoItem colSpan>Destaque</BentoItem>
        <BentoItem>Card</BentoItem>
      </BentoGrid>
    </div>
  );
}
```

### LayeredCard (parallax)

```tsx
<LayeredCard>
  <div data-depth="1">fundo</div>
  <div data-depth="5">topo</div>
</LayeredCard>
```

## Contrato

- Cores só via tokens `--aura-*` (nada de hex hardcoded)
- Anima só `transform` / `opacity`
- Sem JS no primeiro paint (SSR-safe)
- Degrada com `prefers-reduced-motion`

[Repositório e documentação](https://github.com/Adilson2902/aura-ui)

**MIT**
