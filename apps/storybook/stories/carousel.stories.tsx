import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots
} from "@aura/ui/carousel";

const meta: Meta<typeof Carousel> = {
  title: "UI/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Carrossel zero-deps com CSS scroll-snap: swipe/trackpad nativos, setas do teclado, indicadores e autoplay que pausa no hover e com reduced-motion."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const SLIDES = ["Aurora", "Glass", "Neon", "Depth", "Orbit"];

const Slide = ({ label, i }: { label: string; i: number }) => (
  <div
    className="flex h-48 items-center justify-center rounded-[var(--aura-radius)] text-2xl font-semibold text-white"
    style={{
      background: i % 2 ? "var(--aura-gradient-aurora)" : "var(--aura-gradient-primary)"
    }}
  >
    {label}
  </div>
);

export const Default: Story = {
  render: () => (
    <Carousel className="w-[480px]">
      <CarouselContent>
        {SLIDES.map((s, i) => (
          <CarouselItem key={s}>
            <Slide label={s} i={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
};

/** Vários por vez (`basis`) + loop + autoplay a cada 3s. */
export const MultipleAutoplay: Story = {
  render: () => (
    <Carousel className="w-[560px]" loop autoplay={3000}>
      <CarouselContent gap="sm">
        {SLIDES.map((s, i) => (
          <CarouselItem key={s} basis="calc((100% - 1rem) / 3)">
            <Slide label={s} i={i} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
};
