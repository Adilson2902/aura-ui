"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { useTheme, AURA_THEMES, AURA_THEME_LABELS, type AuraThemeName } from "aura-ui-core/client";

export interface ThemeSwitcherProps {
  className?: string;
  /** Mostra o toggle light/dark junto (padrão true). */
  showModeToggle?: boolean;
  /** Labels amigáveis (padrão: catálogo `AURA_THEME_LABELS` do core). */
  labels?: Partial<Record<AuraThemeName | "light" | "dark", string>>;
}

const DEFAULT_LABELS: Record<string, string> = {
  ...AURA_THEME_LABELS,
  light: "Claro",
  dark: "Escuro"
};

/**
 * Seletor de tema (data-theme) + light/dark.
 * Persiste em localStorage via ThemeProvider.
 */
export function ThemeSwitcher({
  className,
  showModeToggle = true,
  labels = DEFAULT_LABELS
}: ThemeSwitcherProps) {
  const { colorScheme, resolvedTheme, setColorScheme, toggleMode } = useTheme();
  const label = (k: string) => labels[k as keyof typeof labels] ?? DEFAULT_LABELS[k] ?? k;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <label className="sr-only" htmlFor="aura-theme-select">
        Tema
      </label>
      <select
        id="aura-theme-select"
        value={colorScheme}
        onChange={(e) => setColorScheme(e.target.value as AuraThemeName)}
        className="h-9 rounded-[var(--aura-radius)] border border-aura-border bg-aura-surface px-2 text-sm text-aura-surface-foreground shadow-aura-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
      >
        {AURA_THEMES.map((t) => (
          <option key={t} value={t}>
            {label(t)}
          </option>
        ))}
      </select>
      {showModeToggle && (
        <button
          type="button"
          onClick={toggleMode}
          aria-label="Alternar claro/escuro"
          className="aura-press h-9 rounded-[var(--aura-radius)] border border-aura-border px-3 text-sm shadow-aura-1 hover:bg-aura-muted"
        >
          {resolvedTheme === "dark" ? "☾" : "☀"} {label(resolvedTheme)}
        </button>
      )}
    </div>
  );
}
