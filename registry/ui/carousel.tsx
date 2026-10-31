"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Carousel — zero deps: rolagem nativa com CSS scroll-snap (touch, trackpad
 * e teclado de graça), botões anterior/próximo, indicadores e autoplay
 * opcional (pausa no hover/foco e com reduced-motion).
 *
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>…</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious /> <CarouselNext /> <CarouselDots />
 * </Carousel>
 */

type CarouselContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  orientation: "horizontal" | "vertical";
  index: number;
  count: number;
  canPrev: boolean;
  canNext: boolean;
  scrollTo: (index: number) => void;
  prev: () => void;
  next: () => void;
  labels: { prev: string; next: string; slide: (i: number, n: number) => string };
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel deve ser usado dentro de <Carousel>");
  return ctx;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Volta ao início ao passar do último slide (padrão `false`). */
  loop?: boolean;
  /** Avança sozinho a cada N ms (desligado por padrão). */
  autoplay?: number;
  /** Callback quando o slide ativo muda. */
  onIndexChange?: (index: number) => void;
  /** Textos acessíveis. */
  labels?: Partial<CarouselContextValue["labels"]>;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = "horizontal",
      loop = false,
      autoplay,
      onIndexChange,
      labels,
      className,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [edges, setEdges] = React.useState({ start: true, end: false });
    const [hovered, setHovered] = React.useState(false);
    const vertical = orientation === "vertical";

    const slides = React.useCallback(
      () =>
        Array.from(
          viewportRef.current?.querySelectorAll<HTMLElement>("[data-carousel-item]") ?? []
        ),
      []
    );

    const scrollTo = React.useCallback(
      (i: number) => {
        const vp = viewportRef.current;
        const list = slides();
        if (!vp || !list.length) return;
        const target = list[Math.max(0, Math.min(list.length - 1, i))];
        if (!target) return;
        const offset = vertical
          ? target.offsetTop - vp.offsetTop
          : target.offsetLeft - (list[0]?.offsetLeft ?? 0);
        vp.scrollTo({ [vertical ? "top" : "left"]: offset, behavior: "smooth" });
      },
      [slides, vertical]
    );

    const prev = React.useCallback(() => {
      if (index > 0) scrollTo(index - 1);
      else if (loop) scrollTo(count - 1);
    }, [index, count, loop, scrollTo]);

    const next = React.useCallback(() => {
      if (!edges.end && index < count - 1) scrollTo(index + 1);
      else if (loop) scrollTo(0);
    }, [index, count, edges.end, loop, scrollTo]);

    // Slide ativo = o mais visível (IntersectionObserver); bordas via scroll.
    React.useEffect(() => {
      const vp = viewportRef.current;
      if (!vp) return;
      const list = slides();
      setCount(list.length);
      const ratios = new Map<Element, number>();
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
          let best = 0;
          let bestRatio = -1;
          list.forEach((el, i) => {
            const r = ratios.get(el) ?? 0;
            if (r > bestRatio + 0.01) {
              best = i;
              bestRatio = r;
            }
          });
          setIndex(best);
        },
        { root: vp, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      list.forEach((el) => io.observe(el));

      const onScroll = () => {
        const pos = vertical ? vp.scrollTop : vp.scrollLeft;
        const max = vertical ? vp.scrollHeight - vp.clientHeight : vp.scrollWidth - vp.clientWidth;
        setEdges({ start: pos <= 2, end: pos >= max - 2 });
      };
      onScroll();
      vp.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(onScroll);
      ro.observe(vp);
      return () => {
        io.disconnect();
        ro.disconnect();
        vp.removeEventListener("scroll", onScroll);
      };
    }, [slides, vertical, children]);

    React.useEffect(() => {
      onIndexChange?.(index);
    }, [index, onIndexChange]);

    // Autoplay (respeita reduced-motion e pausa com hover/foco).
    React.useEffect(() => {
      if (!autoplay || hovered) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const id = window.setInterval(() => {
        if (edges.end || index >= count - 1) scrollTo(0);
        else scrollTo(index + 1);
      }, autoplay);
      return () => window.clearInterval(id);
    }, [autoplay, hovered, index, count, edges.end, scrollTo]);

    const value = React.useMemo<CarouselContextValue>(
      () => ({
        viewportRef,
        orientation,
        index,
        count,
        canPrev: loop || !edges.start,
        canNext: loop || !edges.end,
        scrollTo,
        prev,
        next,
        labels: {
          prev: labels?.prev ?? "Slide anterior",
          next: labels?.next ?? "Próximo slide",
          slide: labels?.slide ?? ((i, n) => `Slide ${i} de ${n}`)
        }
      }),
      [orientation, index, count, loop, edges, scrollTo, prev, next, labels]
    );

    return (
      <CarouselContext.Provider value={value}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          data-orientation={orientation}
          className={cn("group/carousel relative", className)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            const back = vertical ? "ArrowUp" : "ArrowLeft";
            const fwd = vertical ? "ArrowDown" : "ArrowRight";
            if (e.key === back) {
              e.preventDefault();
              prev();
            } else if (e.key === fwd) {
              e.preventDefault();
              next();
            }
          }}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const carouselContentVariants = cva(
  "flex snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  {
    variants: {
      orientation: {
        horizontal: "snap-x overflow-x-auto",
        vertical: "snap-y flex-col overflow-y-auto"
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6"
      }
    },
    defaultVariants: { orientation: "horizontal", gap: "md" }
  }
);

export interface CarouselContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof carouselContentVariants>, "orientation"> {}

/** Viewport rolável com snap — os itens são filhos diretos. */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, gap, ...props }, ref) => {
    const { viewportRef, orientation } = useCarousel();
    return (
      <div
        ref={(node) => {
          viewportRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        tabIndex={0}
        className={cn(
          carouselContentVariants({ orientation, gap }),
          "rounded-[var(--aura-radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
          className
        )}
        {...props}
      />
    );
  }
);
CarouselContent.displayName = "CarouselContent";

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Largura/altura do slide (ex.: "100%", "80%", "calc(50% - 0.5rem)"). Padrão 100%. */
  basis?: string;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, basis = "100%", style, ...props }, ref) => {
    const { orientation, index, count, labels } = useCarousel();
    const [position, setPosition] = React.useState(0);
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      const el = innerRef.current;
      const parent = el?.parentElement;
      if (!el || !parent) return;
      setPosition(Array.from(parent.querySelectorAll("[data-carousel-item]")).indexOf(el));
    }, [count]);

    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="group"
        aria-roledescription="slide"
        aria-label={labels.slide(position + 1, count)}
        data-carousel-item=""
        data-active={position === index ? "" : undefined}
        style={{ flexBasis: basis, ...style }}
        className={cn(
          "min-w-0 shrink-0 grow-0",
          orientation === "horizontal" ? "snap-start" : "snap-start",
          className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

const navButton =
  "absolute z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-aura-border bg-aura-surface/90 text-aura-surface-foreground shadow-aura-2 backdrop-blur transition-[opacity,transform] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring disabled:pointer-events-none disabled:opacity-0";

const Chevron = ({ dir }: { dir: "prev" | "next" }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d={dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { prev, canPrev, orientation, labels } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label={labels.prev}
      disabled={!canPrev}
      onClick={prev}
      className={cn(
        navButton,
        orientation === "horizontal"
          ? "left-2 top-1/2 -translate-y-1/2"
          : "left-1/2 top-2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      {children ?? <Chevron dir="prev" />}
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { next, canNext, orientation, labels } = useCarousel();
  return (
    <button
      ref={ref}
      type="button"
      aria-label={labels.next}
      disabled={!canNext}
      onClick={next}
      className={cn(
        navButton,
        orientation === "horizontal"
          ? "right-2 top-1/2 -translate-y-1/2"
          : "bottom-2 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      {...props}
    >
      {children ?? <Chevron dir="next" />}
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

/** Indicadores (um por slide) — o ativo estica e ganha a cor da marca. */
const CarouselDots = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { count, index, scrollTo, labels } = useCarousel();
    if (count < 2) return null;
    return (
      <div ref={ref} className={cn("mt-4 flex justify-center gap-1.5", className)} {...props}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={labels.slide(i + 1, count)}
            aria-current={i === index ? "true" : undefined}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
              i === index
                ? "w-6 bg-aura-primary"
                : "w-2 bg-aura-border hover:bg-aura-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  }
);
CarouselDots.displayName = "CarouselDots";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  carouselContentVariants,
  useCarousel
};
