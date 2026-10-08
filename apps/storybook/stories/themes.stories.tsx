import type { Meta, StoryObj } from "@storybook/react";
import { AURA_THEMES, AURA_THEME_LABELS, AURA_DARK_THEMES } from "@aura/core";
import { Button } from "@aura/ui/button";
import { Badge } from "@aura/ui/badge";
import { Input } from "@aura/ui/input";
import { Rating } from "@aura/ui/rating";
import { Meter } from "@aura/ui/meter";

const meta: Meta = {
  title: "Overview/Theme Gallery (33)",
  parameters: { layout: "fullscreen" }
};

export default meta;
type Story = StoryObj;

/**
 * Cada cartão isola um `data-theme` — tokens cascateiam só para os filhos,
 * então dá para comparar os 33 temas lado a lado no mesmo canvas.
 */
function ThemeCard({ theme }: { theme: (typeof AURA_THEMES)[number] }) {
  const dark = (AURA_DARK_THEMES as readonly string[]).includes(theme);
  return (
    <div
      data-theme={theme}
      className={`flex flex-col gap-4 rounded-[var(--aura-radius)] border p-5 ${
        dark ? "border-white/10" : "border-aura-border"
      }`}
      style={{ background: "hsl(var(--aura-surface))" }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--aura-surface-foreground))" }}>
          <span className="h-4 w-4 rounded-full" style={{ background: "hsl(var(--aura-primary))" }} />
          {AURA_THEME_LABELS[theme]}
        </span>
        <Badge variant="gradient">{dark ? "dark" : "light"}</Badge>
      </div>

      <div className="aura-gradient-primary h-8 rounded-md" aria-hidden />

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="solid">Solid</Button>
        <Button size="sm" variant="gradient">Grad</Button>
        <Button size="sm" variant="3d">3D</Button>
      </div>

      <Input className="h-9" placeholder="Input…" />

      <div className="flex items-center justify-between gap-3">
        <Rating value={4} />
        <div className="w-24">
          <Meter value={68} size="sm" variant="gradient" tone="gradient" label="demo" />
        </div>
      </div>
    </div>
  );
}

export const Gallery: Story = {
  name: "33 temas — claro, escuro e neon",
  render: () => (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold">Galeria de temas</h1>
      <p className="mb-6 text-sm text-aura-muted-foreground">
        {AURA_THEMES.length} temas via <code>data-theme</code> · {AURA_DARK_THEMES.length} nativos
        dark · troque no provider ou por card.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {AURA_THEMES.map((t) => (
          <ThemeCard key={t} theme={t} />
        ))}
      </div>
    </div>
  )
};
