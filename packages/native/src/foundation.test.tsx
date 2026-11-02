import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  AURA_DARK_THEMES,
  AURA_THEMES,
  AuraProvider,
  Box,
  Button,
  Card,
  CardTitle,
  HStack,
  PALETTES,
  Text,
  angleToPoints,
  alpha,
  useAura,
  type AuraTheme
} from "./index";

function Probe({ onTheme }: { onTheme: (t: AuraTheme) => void }) {
  onTheme(useAura());
  return null;
}

const themeOf = (ui: React.ReactElement) => {
  let theme!: AuraTheme;
  render(React.cloneElement(ui, {}, <Probe onTheme={(t) => (theme = t)} />));
  return theme;
};

describe("paletas geradas do core", () => {
  it("cobrem os 33 temas com claro e escuro", () => {
    expect(AURA_THEMES).toHaveLength(33);
    for (const name of AURA_THEMES) {
      const p = PALETTES[name]!;
      expect(p.light.colors.primary, name).toMatch(/^#[0-9a-f]{6}$/);
      expect(p.dark.dark, name).toBe(true);
    }
  });

  it("temas escuros são escuros nos dois modos; claros mudam de superfície", () => {
    for (const name of AURA_DARK_THEMES) expect(PALETTES[name]!.light.dark, name).toBe(true);
    expect(PALETTES.ocean!.light.colors.surface).not.toBe(PALETTES.ocean!.dark.colors.surface);
  });

  it("a cor da marca aura bate com o web (#7857FF)", () => {
    expect(PALETTES.aura!.light.colors.primary).toBe("#7857ff");
  });
});

describe("AuraProvider", () => {
  it("funciona sem provider (tema aura claro)", () => {
    let theme!: AuraTheme;
    render(<Probe onTheme={(t) => (theme = t)} />);
    expect(theme.name).toBe("aura");
    expect(theme.isDark).toBe(false);
  });

  it("aplica tema, modo e overrides", () => {
    const t = themeOf(
      <AuraProvider
        theme="ocean"
        mode="dark"
        overrides={{ colors: { primary: "#ff0055" }, radius: 20 }}
      >
        <></>
      </AuraProvider>
    );
    expect(t.name).toBe("ocean");
    expect(t.isDark).toBe(true);
    expect(t.colors.primary).toBe("#ff0055");
    expect(t.colors.surface).toBe(PALETTES.ocean!.dark.colors.surface);
    expect(t.radius.md).toBe(20);
    expect(t.space(4)).toBe(16);
  });

  it("setTheme/setMode funcionam no modo não-controlado", () => {
    let theme!: AuraTheme;
    function Toggle() {
      theme = useAura();
      return (
        <Button
          onPress={() => {
            theme.setTheme("forest");
            theme.setMode("dark");
          }}
        >
          trocar
        </Button>
      );
    }
    render(
      <AuraProvider defaultMode="light">
        <Toggle />
      </AuraProvider>
    );
    expect(theme.isDark).toBe(false);
    fireEvent.click(screen.getByText("trocar"));
    expect(theme.name).toBe("forest");
    expect(theme.isDark).toBe(true);
  });
});

describe("componentes base", () => {
  it("Button chama onPress e respeita disabled/loading", () => {
    const onPress = vi.fn();
    const { rerender } = render(<Button onPress={onPress}>Salvar</Button>);
    fireEvent.click(screen.getByText("Salvar"));
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(
      <Button onPress={onPress} loading loadingText="Salvando…">
        Salvar
      </Button>
    );
    expect(screen.getByText("Salvando…")).toBeTruthy();
    fireEvent.click(screen.getByText("Salvando…"));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
  });

  it("todas as variantes renderizam", () => {
    for (const variant of [
      "solid",
      "soft",
      "outline",
      "ghost",
      "accent",
      "destructive",
      "link",
      "gradient",
      "glass"
    ] as const) {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByText(variant)).toBeTruthy();
    }
  });

  it("Box traduz props de token em estilo", () => {
    render(
      <AuraProvider defaultMode="light">
        <Box testID="box" p={4} bg="primary" radius="full" />
      </AuraProvider>
    );
    const el = screen.getByTestId("box");
    expect(el.style.paddingTop || el.style.padding).toBe("16px");
    expect(el.style.backgroundColor).toBe("rgb(120, 87, 255)");
    expect(el.style.borderTopLeftRadius || el.style.borderRadius).toBe("9999px");
  });

  it("Text aplica tom e Card renderiza título", () => {
    render(
      <AuraProvider defaultMode="light">
        <HStack>
          <Text tone="muted">sub</Text>
          <Card variant="gradient">
            <CardTitle>Plano Pro</CardTitle>
          </Card>
        </HStack>
      </AuraProvider>
    );
    expect(screen.getByText("Plano Pro")).toBeTruthy();
    expect(screen.getByText("sub").style.color).not.toBe("");
  });
});

describe("utilitários", () => {
  it("alpha e ângulo de gradiente", () => {
    expect(alpha("#7857ff", 0.1)).toBe("rgba(120, 87, 255, 0.1)");
    const { start, end } = angleToPoints(90); // esquerda → direita
    expect(start.x).toBeCloseTo(0);
    expect(end.x).toBeCloseTo(1);
    expect(start.y).toBeCloseTo(0.5);
  });
});
