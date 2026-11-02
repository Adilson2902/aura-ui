import * as React from "react";
import { useColorScheme, type StyleProp, type ViewStyle } from "react-native";
import { alpha } from "./color";
import { AURA_DARK_THEMES, AURA_THEMES, BASE_RADIUS, PALETTES } from "./palettes.generated";
import {
  fontWeights,
  radiusScale,
  shadow,
  space,
  type FontWeightToken,
  type RadiusToken,
  type ShadowLevel
} from "./tokens";
import type { ColorTokens, GradientName, GradientSpec } from "./types";

export type AuraThemeName = (typeof AURA_THEMES)[number];
export type AuraMode = "light" | "dark" | "system";

/** Componente de gradiente compatível com expo-linear-gradient / react-native-linear-gradient. */
export type GradientComponent = React.ComponentType<{
  colors: readonly string[];
  locations?: readonly number[] | null;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}>;

/** Componente de blur compatível com expo-blur (`BlurView`). */
export type BlurComponent = React.ComponentType<{
  intensity?: number;
  tint?: "light" | "dark" | "default";
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}>;

export type AuraOverrides = {
  /** Troca cores do tema (ex.: cor da marca). Aplicado nos modos claro e escuro… */
  colors?: Partial<ColorTokens>;
  /** …ou só em um deles. */
  light?: Partial<ColorTokens>;
  dark?: Partial<ColorTokens>;
  /** Raio base em px (padrão 14, igual ao web). */
  radius?: number;
  /** Fontes carregadas (expo-font) por peso. Sem isso, usa a fonte do sistema. */
  fonts?: Partial<Record<FontWeightToken, string>>;
};

export type AuraProviderProps = {
  children: React.ReactNode;
  /** Tema (controlado). Um dos 33 temas do Aura UI. */
  theme?: AuraThemeName;
  /** Tema inicial (não-controlado). Padrão "aura". */
  defaultTheme?: AuraThemeName;
  /** Modo (controlado): "light" | "dark" | "system". */
  mode?: AuraMode;
  /** Modo inicial (não-controlado). Padrão "system". */
  defaultMode?: AuraMode;
  onThemeChange?: (theme: AuraThemeName) => void;
  onModeChange?: (mode: AuraMode) => void;
  overrides?: AuraOverrides;
  /** Plugue componentes nativos opcionais p/ variantes `gradient` e `glass`. */
  components?: { LinearGradient?: GradientComponent; BlurView?: BlurComponent };
};

export type AuraTheme = {
  name: AuraThemeName;
  /** Modo escolhido (pode ser "system"). */
  mode: AuraMode;
  /** true quando a paleta efetiva é escura. */
  isDark: boolean;
  colors: ColorTokens;
  gradients: Record<GradientName, GradientSpec>;
  radius: Record<RadiusToken, number>;
  /** `space(4)` = 16. */
  space: (n: number) => number;
  /** Sombra física por nível 0–5. */
  shadow: (level: ShadowLevel) => ViewStyle;
  /** Estilo de fonte para um peso (respeita `overrides.fonts`). */
  font: (weight: FontWeightToken) => {
    fontWeight?: (typeof fontWeights)[FontWeightToken];
    fontFamily?: string;
  };
  alpha: typeof alpha;
  components: NonNullable<AuraProviderProps["components"]>;
  setTheme: (theme: AuraThemeName) => void;
  setMode: (mode: AuraMode) => void;
  /** Alterna claro/escuro (sai do "system"). */
  toggleMode: () => void;
  themes: readonly AuraThemeName[];
};

function buildTheme(
  name: AuraThemeName,
  mode: AuraMode,
  system: "light" | "dark",
  overrides: AuraOverrides | undefined,
  components: AuraTheme["components"],
  actions: Pick<AuraTheme, "setTheme" | "setMode" | "toggleMode">
): AuraTheme {
  const wantsDark = mode === "system" ? system === "dark" : mode === "dark";
  const pair = PALETTES[name] ?? PALETTES.aura!;
  const palette = wantsDark ? pair.dark : pair.light;
  const colors: ColorTokens = {
    ...palette.colors,
    ...overrides?.colors,
    ...(palette.dark ? overrides?.dark : overrides?.light)
  };
  const fonts = overrides?.fonts;
  return {
    name,
    mode,
    isDark: palette.dark,
    colors,
    gradients: palette.gradients,
    radius: radiusScale(overrides?.radius ?? BASE_RADIUS),
    space,
    shadow: (level) => shadow(level, palette.dark),
    font: (weight) =>
      fonts?.[weight] ? { fontFamily: fonts[weight] } : { fontWeight: fontWeights[weight] },
    alpha,
    components,
    themes: AURA_THEMES,
    ...actions
  };
}

declare const __DEV__: boolean | undefined;

const warnNoProvider = () => {
  if (typeof __DEV__ === "undefined" || __DEV__) {
    console.warn("aura-ui-native: setTheme/setMode precisam de <AuraProvider> acima.");
  }
};

const DEFAULT_THEME = buildTheme(
  "aura",
  "light",
  "light",
  undefined,
  {},
  {
    setTheme: warnNoProvider,
    setMode: warnNoProvider,
    toggleMode: warnNoProvider
  }
);

const AuraContext = React.createContext<AuraTheme>(DEFAULT_THEME);

/**
 * Provider do Aura UI. Funciona sem props (tema "aura", modo do sistema).
 * Os componentes também funcionam sem provider (tema aura claro).
 */
export function AuraProvider({
  children,
  theme,
  defaultTheme = "aura",
  mode,
  defaultMode = "system",
  onThemeChange,
  onModeChange,
  overrides,
  components
}: AuraProviderProps) {
  const system = useColorScheme() === "dark" ? "dark" : "light";
  const [innerTheme, setInnerTheme] = React.useState<AuraThemeName>(defaultTheme);
  const [innerMode, setInnerMode] = React.useState<AuraMode>(defaultMode);
  const name = theme ?? innerTheme;
  const currentMode = mode ?? innerMode;

  const setTheme = React.useCallback(
    (t: AuraThemeName) => {
      if (theme === undefined) setInnerTheme(t);
      onThemeChange?.(t);
    },
    [theme, onThemeChange]
  );
  const setMode = React.useCallback(
    (m: AuraMode) => {
      if (mode === undefined) setInnerMode(m);
      onModeChange?.(m);
    },
    [mode, onModeChange]
  );

  const value = React.useMemo(() => {
    const isDark = currentMode === "system" ? system === "dark" : currentMode === "dark";
    return buildTheme(name, currentMode, system, overrides, components ?? {}, {
      setTheme,
      setMode,
      toggleMode: () => setMode(isDark ? "light" : "dark")
    });
  }, [name, currentMode, system, overrides, components, setTheme, setMode]);

  return <AuraContext.Provider value={value}>{children}</AuraContext.Provider>;
}

/** Tema atual: cores, raios, espaçamento, sombras e ações (setTheme/setMode). */
export function useAura(): AuraTheme {
  return React.useContext(AuraContext);
}

export function isDarkTheme(name: string): boolean {
  return (AURA_DARK_THEMES as readonly string[]).includes(name);
}
