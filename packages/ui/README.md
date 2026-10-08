# aura-ui-components

Componentes React do **Aura UI** — paridade com o Toolspace + extras 3D + charts em SVG.

## Instalação

```bash
npm install aura-ui-core aura-ui-components react react-dom
```

```tsx
import { Button, Stat, DonutChart, ThemeSwitcher } from "aura-ui-components";
import "aura-ui-core/styles/tokens.css";
import "aura-ui-core/styles/themes.css";
import "aura-ui-core/styles/primitives.css";
```

## O que tem

**Formulário:** Input · Textarea · Label · Checkbox · Switch · Select · Slider · RadioGroup

**Layout / dados:** Card · Table · DataTable · Separator · Badge · Skeleton · Kbd · Breadcrumb · Pagination · Progress · Spinner · Stat · EmptyState · Avatar

**Overlay / nav:** Dialog · Sheet · Tooltip · Popover · DropdownMenu · Tabs · Accordion · Navbar · Toast

**Charts (SVG zero-dep):** `BarChart` · `LineChart` · `MultiLineChart` · `DonutChart` · `Sparkline` · `RadialProgress` · `ChartFrame`

**Tema:** `ThemeSwitcher`

## Exemplos

### Botão 3D

```tsx
import { Button } from "aura-ui-components";

<Button variant="3d">Criar</Button>
<Button variant="glass">Glass</Button>
<Button variant="gradient">Gradient</Button>
```

### KPI com tilt

```tsx
import { Stat } from "aura-ui-components";

<Stat label="Receita" value="R$ 12.480" delta="+12%" deltaDirection="up" variant="elevated" />;
```

### Chart

```tsx
import { DonutChart, BarChart } from "aura-ui-components";

<DonutChart
  title="Mix de planos"
  data={[
    { label: "Pro", value: 48 },
    { label: "Team", value: 32 },
    { label: "Starter", value: 20 }
  ]}
/>

<BarChart title="Canais" data={[{ label: "Direct", value: 42 }, { label: "Organic", value: 68 }]} />
```

### Toast

```tsx
import { ToastProvider, useToast } from "aura-ui-components";

<ToastProvider>
  <App />
</ToastProvider>;

const { toast } = useToast();
toast({ title: "Salvo", description: "Tudo certo", variant: "success" });
```

## Acessibilidade

Radix UI, foco visível, `prefers-reduced-motion`, tokens de tema trocáveis.

## Ver também

- `aura-ui-effects` — efeitos 3D/motion
- `aura-ui-core` — tokens e ThemeProvider

**MIT**
