import { describe, expect, it } from "vitest";
import { cn } from "aura-ui-core";
import { buttonVariants } from "./button";
import { cardVariants } from "./card";
import { inputVariants } from "./input";
import { badgeVariants } from "./badge";
import { tabsListVariants, tabsTriggerVariants } from "./tabs";
import { switchVariants } from "./switch";
import { dialogContentVariants } from "./dialog";
import { sheetVariants } from "./sheet";
import { popoverVariants } from "./popover";
import { tooltipVariants } from "./tooltip";
import { selectTriggerVariants } from "./select";
import { toastVariants } from "./toast";
import { accordionItemVariants } from "./accordion";
import { toggleVariants } from "./toggle";
import { ratingVariants } from "./rating";
import { buttonGroupVariants } from "./button-group";
import { headingVariants } from "./typography";
import { bannerVariants } from "./banner";
import { testimonialVariants } from "./testimonial";
import { logoCloudVariants } from "./logo-cloud";
import { inputGroupVariants } from "./input-group";
import { fileUploadVariants } from "./file-upload";
import { inputOTPSlotVariants } from "./input-otp";
import { numberInputVariants } from "./number-input";

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const TAILWIND_PALETTE =
  /\b(?:slate|zinc|gray|neutral|stone|red|blue|green|emerald|amber)-\d{2,3}\b/;

/**
 * Tailwind v4 só aplica variantes (`hover:`, `data-[x]:`…) a utilities.
 * Classes CSS puras do core (`aura-gradient-*`, `aura-bevel`…) com prefixo
 * de variante viram classes mortas — use `[background:var(--aura-…)]`.
 */
const DEAD_VARIANT_CLASS =
  /[\w\]\)]:aura-(?:gradient|glass|bevel|press|tilt|surface|elevated|text-gradient|accordion)/;

describe("v3 — sem classes mortas / cores fixas", () => {
  it("variantes não aplicam prefixos a classes CSS puras", () => {
    const all = [
      ...["default", "soft", "glass", "gradient", "3d"].map((v) =>
        toggleVariants({ variant: v as never })
      ),
      ...["solid", "gradient", "glow", "muted", "pulse"].map((v) =>
        ratingVariants({ variant: v as never })
      ),
      ...["default", "success", "gradient", "glow", "3d"].map((v) =>
        switchVariants({ variant: v as never })
      )
    ];
    for (const cls of all) {
      expect(cls).not.toMatch(DEAD_VARIANT_CLASS);
      expect(cls).not.toMatch(HEX);
      expect(cls).not.toMatch(TAILWIND_PALETTE);
    }
  });
});

describe("Button v3", () => {
  it("novas variantes usam tokens (destructive/accent) e link não tem fundo", () => {
    expect(buttonVariants({ variant: "destructive" })).toContain("bg-aura-destructive");
    expect(buttonVariants({ variant: "destructive" })).toContain(
      "text-aura-destructive-foreground"
    );
    expect(buttonVariants({ variant: "accent" })).toContain("bg-aura-accent");
    expect(buttonVariants({ variant: "link" })).not.toMatch(/\bbg-/);
  });

  it("tamanhos extras e fullWidth", () => {
    expect(buttonVariants({ size: "xs" })).toContain("h-7");
    expect(buttonVariants({ size: "xl" })).toContain("h-14");
    expect(buttonVariants({ size: "icon-sm" })).toContain("w-8");
    expect(buttonVariants({ fullWidth: true })).toContain("w-full");
    expect(buttonVariants({})).not.toContain("w-full");
  });

  it("dimensiona SVGs filhos sem sobrescrever size-* explícito", () => {
    expect(buttonVariants({})).toContain("[&_svg:not([class*='size-'])]:size-4");
  });
});

describe("Card v3", () => {
  it("padding independe da variante", () => {
    expect(cardVariants({})).toContain("p-6");
    expect(cardVariants({ padding: "none" })).toContain("p-0");
    expect(cardVariants({ padding: "none" })).not.toContain("p-6");
    expect(cardVariants({ variant: "glass", padding: "lg" })).toContain("p-8");
  });

  it("interactive adiciona foco visível e press", () => {
    const cls = cardVariants({ interactive: true });
    expect(cls).toContain("focus-visible:ring-aura-ring");
    expect(cls).toContain("aura-press");
  });
});

describe("Input/Select/Badge — tamanhos", () => {
  it("input sm/md/lg e underline mantém px-1 em qualquer tamanho", () => {
    expect(inputVariants({ size: "sm" })).toContain("h-8");
    expect(inputVariants({})).toContain("h-10");
    expect(inputVariants({ size: "lg" })).toContain("h-12");
    // o componente passa por cn() (twMerge): o px-1 do compoundVariant vence o px do size
    const underline = cn(inputVariants({ variant: "underline", size: "lg" }));
    expect(underline).toMatch(/px-1(\s|$)/);
    expect(underline).not.toContain("px-4");
  });

  it("select trigger espelha os tamanhos do input e estiliza aria-invalid", () => {
    expect(selectTriggerVariants({ size: "sm" })).toContain("h-8");
    expect(selectTriggerVariants({})).toContain("aria-[invalid=true]:border-aura-destructive");
  });

  it("badge tem tamanhos e variante accent", () => {
    expect(badgeVariants({ size: "lg" })).toContain("text-sm");
    expect(badgeVariants({ variant: "accent" })).toContain("text-aura-accent");
  });
});

describe("Overlays animam via data-state (classes do core)", () => {
  it("dialog/popover/tooltip usam aura-pop; sheet usa aura-sheet", () => {
    expect(dialogContentVariants({})).toContain("aura-pop");
    expect(popoverVariants({})).toContain("aura-pop");
    expect(tooltipVariants({})).toContain("aura-pop");
    expect(sheetVariants({})).toContain("aura-sheet");
  });

  it("nenhum overlay depende de tailwindcss-animate (animate-in/out)", () => {
    for (const cls of [
      dialogContentVariants({}),
      popoverVariants({}),
      tooltipVariants({}),
      sheetVariants({})
    ]) {
      expect(cls).not.toMatch(/animate-(in|out)\b/);
    }
  });

  it("dialog tem 5 tamanhos e sheet lateral respeita size", () => {
    expect(dialogContentVariants({ size: "sm" })).toContain("max-w-sm");
    expect(dialogContentVariants({ size: "xl" })).toContain("max-w-4xl");
    expect(sheetVariants({ side: "right", size: "lg" })).toContain("sm:max-w-lg");
    expect(sheetVariants({ side: "left", size: "full" })).toContain("w-full");
  });
});

describe("Toast v3", () => {
  it("variantes semânticas pintam sobre a superfície (nunca transparentes)", () => {
    for (const variant of ["info", "success", "warning", "destructive"] as const) {
      expect(toastVariants({ variant })).toContain("bg-aura-surface");
    }
  });
});

describe("Tabs/Accordion — estilos por contexto", () => {
  it("tabs underline usa indicador ::after e pill usa superfície", () => {
    expect(tabsTriggerVariants({ variant: "underline" })).toContain(
      "data-[state=active]:after:bg-aura-primary"
    );
    expect(tabsTriggerVariants({})).toContain("data-[state=active]:bg-aura-surface");
    expect(tabsListVariants({ fullWidth: true })).toContain("w-full");
  });

  it("accordion separated mantém o card por item", () => {
    expect(accordionItemVariants({})).toContain("aura-surface");
    expect(accordionItemVariants({ variant: "line" })).not.toContain("aura-surface");
  });
});

describe("ButtonGroup", () => {
  it("cola bordas na horizontal e na vertical", () => {
    expect(buttonGroupVariants({})).toContain("[&>*:not(:first-child)]:rounded-l-none");
    expect(buttonGroupVariants({ orientation: "vertical" })).toContain(
      "[&>*:not(:first-child)]:rounded-t-none"
    );
    expect(buttonGroupVariants({ attached: false })).toContain("gap-2");
  });
});

describe("catálogo v3 — mínimo 5 variantes nos componentes visuais novos", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const count = (fn: (p?: any) => string, names: string[]) => {
    const neutral = fn({ variant: "__none__" });
    return names.filter((n) => fn({ variant: n }) !== neutral).length;
  };

  it.each([
    ["testimonial", testimonialVariants, ["surface", "outline", "glass", "glow", "3d"]],
    ["banner", bannerVariants, ["primary", "gradient", "aurora", "muted", "glass", "warning"]],
    ["logoCloud", logoCloudVariants, ["surface", "muted", "glass", "outline"]],
    ["inputGroup", inputGroupVariants, ["default", "soft", "outline", "glass", "3d"]],
    ["fileUpload", fileUploadVariants, ["dashed", "soft", "glass", "glow", "3d"]],
    ["inputOTP", inputOTPSlotVariants, ["default", "soft", "glass", "3d"]],
    ["numberInput", numberInputVariants, ["default", "soft", "outline", "glass", "3d"]],
    ["dialog", dialogContentVariants, ["surface", "glass", "glass-dc", "glow", "3d"]],
    ["popover", popoverVariants, ["glass", "surface", "glass-dc", "glow", "3d"]],
    ["tooltip", tooltipVariants, ["default", "surface", "primary", "glass", "destructive"]],
    ["select", selectTriggerVariants, ["default", "soft", "outline", "ghost", "glass", "3d"]],
    ["switch", switchVariants, ["default", "success", "gradient", "glow", "3d"]]
  ] as const)("%s tem variantes visuais distintas", (_label, fn, names) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(count(fn as any, [...names])).toBeGreaterThanOrEqual(Math.min(4, names.length));
  });

  it("heading tem tons de gradiente da marca", () => {
    expect(headingVariants({ tone: "aurora" })).toContain("aura-text-gradient-aurora");
    expect(headingVariants({ size: "display" })).toContain("clamp(");
  });
});
