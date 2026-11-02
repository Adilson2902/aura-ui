import type { ColorToken, ColorTokens } from "./types";

function parseHex(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

/** `alpha("#7857ff", 0.1)` → `"rgba(120, 87, 255, 0.1)"` (cores não-hex voltam como vieram). */
export function alpha(color: string, opacity: number): string {
  const rgb = parseHex(color);
  if (!rgb) return color;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
}

/** Aceita um token (`"primary"`) ou uma cor crua (`"#fff"`, `"tomato"`). */
export function resolveColor(colors: ColorTokens, value: ColorToken | (string & {}) | undefined) {
  if (value == null) return undefined;
  return value in colors ? colors[value as ColorToken] : value;
}
