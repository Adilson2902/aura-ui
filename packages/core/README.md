# aura-ui-core

Tokens 3D, temas e utilitários do **Aura UI** — design system com profundidade real (shadcn + DaisyUI + Magic UI + Aceternity).

## Instalação

```bash
npm install aura-ui-core
# ou
pnpm add aura-ui-core
```

## Uso

### CSS (tokens + temas + primitivas 3D)

```css
@import "aura-ui-core/styles/tokens.css";
@import "aura-ui-core/styles/themes.css";
@import "aura-ui-core/styles/primitives.css";
```

### Temas (10 + light/dark)

```tsx
import { ThemeProvider, useTheme } from "aura-ui-core/client";
import { AURA_THEMES } from "aura-ui-core";

// No <html>: data-theme="ocean" | midnight | forest | sunset | cyber | rose | nord | mocha | synthwave | aura
<ThemeProvider defaultTheme="system" defaultColorScheme="aura">
  <App />
</ThemeProvider>;
```

### Hooks e utils

```tsx
import { cn } from "aura-ui-core";
import { useReducedMotion, useTheme } from "aura-ui-core/client";
```

## Tokens principais

| Token | Para quê |
| --- | --- |
| `--aura-primary` / `--aura-accent` | marca |
| `--aura-surface` / `--aura-muted` | superfícies |
| `--aura-elevation-0..5` | sombras em escala física |
| `--aura-depth-1..5` | translateZ em camadas |
| `--aura-perspective` / `--aura-tilt-max` | 3D |
| `--aura-light-x` / `--aura-light-y` | direção da luz (glare) |

Classes utilitárias: `.aura-surface` · `.aura-glass` · `.aura-glass-specular` · `.aura-scene` · `.aura-layer` · `.aura-tilt` · `.aura-press` · `.aura-gradient-*`

## Pacotes irmãos

- `aura-ui-components` — Button, Card, charts, Stat, Toast…
- `aura-ui-effects` — Card3D, LayeredCard, BentoGrid…
- `aura-ui-three` — cenas WebGL (R3F)
- `aura-ui-tailwind` — preset Tailwind v4
- `aura-ui-cli` — CLI `npx aura-ui-cli`

## Licença

MIT
