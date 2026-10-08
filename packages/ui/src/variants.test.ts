import { describe, expect, it } from "vitest";
import { buttonVariants } from "./button";
import { badgeVariants } from "./badge";
import { cardVariants } from "./card";
import { inputVariants } from "./input";
import { textareaVariants } from "./textarea";
import { separatorVariants } from "./separator";
import { skeletonVariants } from "./skeleton";
import { tableVariants } from "./table";
import { kbdVariants } from "./kbd";
import { spinnerVariants } from "./spinner";
import { heroVariants } from "./hero";
import { ctaVariants } from "./cta";
import { featureCardVariants } from "./feature-grid";
import { pricingVariants } from "./pricing";
import { footerVariants } from "./footer";
import { timelineVariants } from "./timeline";
import { stepsVariants } from "./steps";
import { ratingVariants } from "./rating";
import { tagsInputVariants } from "./tags-input";
import { meterTrackVariants, meterFillVariants } from "./meter";
import { codeBlockVariants } from "./code-block";
import { blockquoteVariants } from "./blockquote";
import { toggleVariants } from "./toggle";
import { sidebarVariants } from "./sidebar";

const HEX = /#[0-9a-fA-F]{3,8}/;
const TAILWIND_PALETTE =
  /\b(?:slate|emerald|amber|red|blue|green|zinc|neutral|stone)-\d{2,3}\b/;

describe("buttonVariants", () => {
  it("usa raio, foco visível e disabled do contrato", () => {
    const cls = buttonVariants({});
    expect(cls).toContain("rounded-[var(--aura-radius)]");
    expect(cls).toContain("focus-visible:ring-aura-ring");
    expect(cls).toContain("disabled:opacity-50");
  });

  it("todas as variantes usam feedback físico aura-press", () => {
    for (const variant of [
      "solid",
      "soft",
      "outline",
      "ghost",
      "glass",
      "gradient",
      "glow",
      "cyber",
      "3d"
    ] as const) {
      expect(buttonVariants({ variant })).toContain("aura-press");
    }
  });

  it("não contém classes inválidas nem cores hardcoded", () => {
    for (const variant of ["gradient", "glow", "cyber"] as const) {
      const cls = buttonVariants({ variant });
      expect(cls).not.toContain("brightness-115");
      expect(cls).not.toMatch(HEX);
      expect(cls).not.toMatch(TAILWIND_PALETTE);
    }
  });

  it("cyber usa tinta de contraste tokenizada", () => {
    expect(buttonVariants({ variant: "cyber" })).toContain("text-aura-contrast");
  });
});

describe("badgeVariants", () => {
  it("semânticas vêm dos tokens aura (zero paleta hardcoded)", () => {
    expect(badgeVariants({ variant: "success" })).toContain("text-aura-success");
    expect(badgeVariants({ variant: "warning" })).toContain("text-aura-warning");
    expect(badgeVariants({ variant: "destructive" })).toContain("text-aura-destructive");
    for (const variant of ["success", "warning", "gradient", "glow", "cyber"] as const) {
      const cls = badgeVariants({ variant });
      expect(cls).not.toMatch(HEX);
      expect(cls).not.toMatch(TAILWIND_PALETTE);
    }
  });
});

describe("cardVariants", () => {
  it("glow/tilt declaram borda (border-* sem border é classe morta)", () => {
    expect(cardVariants({ variant: "glow" })).toMatch(/(^|\s)border(\s|$)/);
    expect(cardVariants({ variant: "tilt" })).toContain("aura-tilt");
  });
});

describe("inputVariants + textareaVariants", () => {
  it("expõem estado aria-invalid p/ validação (RHF/Zod)", () => {
    expect(inputVariants({})).toContain("aria-[invalid=true]:border-aura-destructive");
    expect(textareaVariants({})).toContain("aria-[invalid=true]:border-aura-destructive");
  });

  it("textarea tem altura mínima e espelha variantes do input", () => {
    expect(textareaVariants({})).toContain("min-h-");
    expect(textareaVariants({ variant: "glass" })).toContain("aura-glass-dc");
  });
});

describe("separatorVariants", () => {
  it("orientações mapeiam para dimensões corretas", () => {
    expect(separatorVariants({ orientation: "horizontal" })).toContain("h-px w-full");
    expect(separatorVariants({ orientation: "vertical" })).toContain("h-full w-px");
  });
});

describe("skeletonVariants", () => {
  it("shimmer usa gradiente tokenizado", () => {
    expect(skeletonVariants({ variant: "shimmer" })).toContain("hsl(var(--aura-muted))");
  });
});

/**
 * Contrato v2: cada componente listado tem ≥5 variantes nominais e as
 * variantes visuais produzem classes além da base (cva com valor desconhecido
 * retorna só a base — base neutra confiável p/ comparação).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VariantFn = (props?: any) => string;

function expectVariants(fn: VariantFn, names: string[], label: string) {
  expect(names.length, `${label} deve ter ≥5 variantes`).toBeGreaterThanOrEqual(5);
  const neutral = fn({ variant: "__none__" });
  // ao menos 4 das variantes declaradas são visuais (geram classes próprias)
  const visual = names.filter((n) => fn({ variant: n }) !== neutral);
  expect(visual.length, `${label} precisa de ≥4 variantes visuais (>${visual.length} de ${names.join(",")})`).toBeGreaterThanOrEqual(4);
}

describe("catálogo v2 — mínimo 5 variantes por componente (contrato Aura)", () => {
  it("componentes têm ≥5 variantes válidas", () => {
    expectVariants(buttonVariants, ["solid", "soft", "outline", "ghost", "glass", "gradient", "glow", "cyber", "3d"], "button");
    expectVariants(badgeVariants, ["solid", "soft", "outline", "muted", "success", "warning", "destructive", "gradient", "glow", "cyber"], "badge");
    expectVariants(cardVariants, ["surface", "soft", "outline", "gradient", "glass", "glass-dc", "glow", "tilt", "3d"], "card");
    expectVariants(inputVariants, ["default", "soft", "outline", "underline", "glass", "glow", "3d"], "input");
    expectVariants(textareaVariants, ["default", "soft", "outline", "underline", "glass", "glow", "3d"], "textarea");
    expectVariants(tableVariants, ["default", "clean", "striped", "bordered", "glass", "3d"], "table");
    expectVariants(kbdVariants, ["raised", "flat", "outline", "glass", "3d"], "kbd");
    expectVariants(separatorVariants, ["solid", "gradient", "glow", "dashed", "glass"], "separator");
    expectVariants(spinnerVariants, ["ring", "dots", "bars", "pulse", "gradient"], "spinner");
    expectVariants(heroVariants, ["clean", "muted", "gradient", "aurora", "glass", "grid"], "hero");
    expectVariants(ctaVariants, ["surface", "gradient", "glass", "aurora", "glow"], "cta");
    expectVariants(featureCardVariants, ["surface", "outline", "glass", "glow", "tilt"], "featureCard");
    expectVariants(pricingVariants, ["surface", "outline", "gradient", "glass", "glow"], "pricing");
    expectVariants(footerVariants, ["none", "muted", "surface", "gradient", "glass"], "footer");
    expectVariants(timelineVariants, ["line", "gradient", "glass", "dots", "cards"], "timeline");
    expectVariants(stepsVariants, ["line", "dots", "gradient", "glass", "cards"], "steps");
    expectVariants(ratingVariants, ["solid", "gradient", "glow", "muted", "pulse"], "rating");
    expectVariants(tagsInputVariants, ["default", "soft", "outline", "glass", "3d"], "tagsInput");
    expectVariants(meterTrackVariants, ["default", "glass", "3d", "outline", "gradient"], "meterTrack");
    expectVariants(codeBlockVariants, ["surface", "dark", "glass", "gradient-border", "terminal"], "codeBlock");
    expectVariants(blockquoteVariants, ["line", "surface", "glass", "gradient", "quote-mark"], "blockquote");
    expectVariants(toggleVariants, ["default", "soft", "glass", "gradient", "3d"], "toggle");
    expectVariants(sidebarVariants, ["surface", "muted", "glass", "dark", "gradient"], "sidebar");
  });

  it("tons semânticos do meter (prop tone) estão completos", () => {
    const neutral = meterFillVariants({ tone: "__none__" as never });
    for (const tone of ["primary", "accent", "success", "warning", "destructive", "gradient", "glow"] as const) {
      expect(meterFillVariants({ tone }), `meter.tone.${tone}`).not.toBe(neutral);
    }
  });

  it("famílias de entrada (input/textarea/tags-input) são consistentes", () => {
    expect(inputVariants({ variant: "glass" })).toContain("aura-glass-dc");
    expect(textareaVariants({ variant: "glass" })).toContain("aura-glass-dc");
    expect(tagsInputVariants({ variant: "3d" })).toContain("aura-bevel");
    for (const v of ["default", "soft", "outline", "underline", "glass", "glow", "3d"] as const) {
      expect(inputVariants({ variant: v }), `input.${v}`).toBeTruthy();
      expect(textareaVariants({ variant: v }), `textarea.${v}`).toBeTruthy();
    }
  });

  it("tabela tem variantes limpas, glass e 3D", () => {
    expect(tableVariants({ variant: "glass" })).toContain("aura-glass-dc");
    expect(tableVariants({ variant: "3d" })).toContain("aura-elevated");
    expect(tableVariants({ variant: "striped" })).toContain("nth-child(even)");
  });

  it("variantes 3D usam bevel/press/elevated tokenizados (sem cor fixa)", () => {
    const TAILWIND_PALETTE_LOCAL = /\b(?:slate|emerald|amber|red|blue|green|zinc|neutral|stone)-\d{2,3}\b/;
    const HEX = /#[0-9a-fA-F]{3,8}/;
    for (const cls of [
      inputVariants({ variant: "3d" }),
      cardVariants({ variant: "3d" }),
      toggleVariants({ variant: "3d" }),
      pricingVariants({ variant: "gradient" }),
      heroVariants({ variant: "aurora" }),
      ctaVariants({ variant: "gradient" })
    ]) {
      expect(cls).not.toMatch(HEX);
      expect(cls).not.toMatch(TAILWIND_PALETTE_LOCAL);
    }
  });
});
