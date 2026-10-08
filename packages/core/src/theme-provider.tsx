"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

/** Temas Aura (data-theme) + light/dark/system. */
import { AURA_THEMES, AURA_DARK_THEMES, AURA_THEME_LABELS, isDarkTheme, type AuraThemeName } from "./themes";

export { AURA_THEMES, AURA_DARK_THEMES, AURA_THEME_LABELS, isDarkTheme };
export type { AuraThemeName };
export type ThemeMode = "light" | "dark" | "system";
export type Theme = ThemeMode | AuraThemeName;
export type { AuraDarkThemeName } from "./themes";

type ThemeContextValue = {
  /** Valor selecionado (pode ser system / light / dark ou um tema nomeado). */
  theme: Theme;
  /** Tema nomeado efetivo (para data-theme). */
  colorScheme: AuraThemeName;
  /** light | dark resolvido. */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  setColorScheme: (name: AuraThemeName) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function isNamedTheme(t: Theme): t is AuraThemeName {
  return (AURA_THEMES as readonly string[]).includes(t);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "aura",
  storageKey = "aura-theme",
  colorSchemeKey = "aura-color-scheme"
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: AuraThemeName;
  storageKey?: string;
  colorSchemeKey?: string;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [colorScheme, setColorSchemeState] = useState<AuraThemeName>(defaultColorScheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey) as Theme | null;
    if (stored) setThemeState(stored);
    const storedScheme = window.localStorage.getItem(colorSchemeKey) as AuraThemeName | null;
    if (storedScheme && isNamedTheme(storedScheme)) setColorSchemeState(storedScheme);
  }, [storageKey, colorSchemeKey]);

  useEffect(() => {
    const named = isNamedTheme(theme) ? theme : null;
    const mode: "light" | "dark" =
      theme === "system"
        ? getSystemTheme()
        : theme === "dark" || (named !== null && isDarkTheme(named))
          ? "dark"
          : "light";

    // light/dark clássico
    if (theme === "light" || theme === "dark" || theme === "system") {
      setResolvedTheme(theme === "system" ? getSystemTheme() : theme);
    } else {
      setResolvedTheme(mode);
    }

    const effectiveScheme = named ?? colorScheme;
    const html = document.documentElement;
    html.dataset.theme = effectiveScheme;
    html.classList.toggle("dark", mode === "dark");
  }, [theme, colorScheme]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      window.localStorage.setItem(storageKey, next);
      if (isNamedTheme(next)) {
        setColorSchemeState(next);
        window.localStorage.setItem(colorSchemeKey, next);
      }
    },
    [storageKey, colorSchemeKey]
  );

  const setColorScheme = useCallback(
    (name: AuraThemeName) => {
      setColorSchemeState(name);
      window.localStorage.setItem(colorSchemeKey, name);
      document.documentElement.dataset.theme = name;
    },
    [colorSchemeKey]
  );

  const toggleMode = useCallback(() => {
    const next: Theme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme, colorScheme, resolvedTheme, setTheme, setColorScheme, toggleMode }),
    [theme, colorScheme, resolvedTheme, setTheme, setColorScheme, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
