# aura-ui-tailwind

Preset **Tailwind CSS v4** do Aura UI — tokens 3D, temas e utilities de profundidade.

## Instalação

```bash
npm install aura-ui-core aura-ui-tailwind tailwindcss
```

## Uso (Tailwind v4)

```css
@import "aura-ui-tailwind";
/* já puxa tailwindcss + tokens.css + primitives.css + themes.css */

/* Componentes instalados como pacote: o Tailwind v4 não escaneia node_modules,
   então registre cada pacote que você usa (o @source é relativo ao pacote,
   funciona com npm, pnpm e yarn): */
@import "aura-ui-components/tailwind.css";
@import "aura-ui-effects/tailwind.css";
@import "aura-ui-three/tailwind.css";
```

Componentes copiados com o CLI (`npx aura add button`) ficam no seu `src/` e são detectados automaticamente — não precisam dessas linhas.

Ou monte na mão:

```css
@import "tailwindcss";
@import "aura-ui-core/styles/tokens.css";
@import "aura-ui-core/styles/themes.css";
@import "aura-ui-core/styles/primitives.css";
@import "aura-ui-components/tailwind.css";
@import "aura-ui-effects/tailwind.css";

@theme {
  --color-aura-primary: hsl(var(--aura-primary));
  --color-aura-surface: hsl(var(--aura-surface));
  --shadow-aura-1: var(--aura-elevation-1);
  --ease-aura-spring: var(--aura-ease-spring);
}
```

## O que o preset expõe

- Cores: `bg-aura-primary`, `text-aura-muted-foreground`, `border-aura-border`…
- Sombras: `shadow-aura-1..3`, `shadow-aura-glow-primary`
- Radius: `rounded-aura`
- Ease: `ease-aura-spring`

## Temas

Troque `data-theme` no `<html>`:

`aura` · `midnight` · `ocean` · `forest` · `sunset` · `cyber` · `rose` · `nord` · `mocha` · `synthwave`

**MIT**
