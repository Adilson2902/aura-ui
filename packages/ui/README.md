# aura-ui-components

73 componentes React do **Aura UI**: Radix acessível, tokens `--aura-*`, 33 temas, variantes limpas/glass/3D e overlays animados (com `prefers-reduced-motion`).

## Instalação

```bash
npm install aura-ui-components aura-ui-core aura-ui-tailwind tailwindcss react react-dom
```

No CSS do app (no lugar do `@import "tailwindcss"`):

```css
@import "aura-ui-tailwind"; /* Tailwind v4 + tokens + primitivas 3D + temas */
@import "aura-ui-components/tailwind.css"; /* registra as classes dos componentes */
```

```tsx
import { Button, Card, Field, FieldLabel, FieldControl, Input } from "aura-ui-components";
// ou por componente:
import { DatePicker } from "aura-ui-components/date-picker";
```

## O que tem

**Formulários:** Button · ButtonGroup · Input · InputGroup · InputOTP · NumberInput · Textarea · Field · Label · Checkbox · RadioGroup / RadioGroupCard · Switch · Select · Combobox · Slider · Toggle / ToggleGroup · TagsInput · Rating · FileUpload · CopyButton

**Datas:** Calendar (single/range) · DatePicker · DateRangePicker — sem libs de data, nomes via `Intl`

**Overlays:** Dialog · AlertDialog · Sheet · Drawer · Popover · HoverCard · Tooltip · DropdownMenu · ContextMenu · Command / CommandDialog · Toast

**Layout / dados:** Card · Table · DataTable · Tabs · Accordion · Collapsible · Carousel · AspectRatio · ScrollArea · Separator · Avatar / AvatarGroup · Badge · Kbd · Breadcrumb · Pagination · Progress · Meter · Spinner · Skeleton · Stat · Steps · Timeline · EmptyState · Alert · Typography (Heading / Text / Prose) · CodeBlock · Blockquote

**Blocos de página:** Navbar · Hero · Section / Container · FeatureGrid · PricingCard · CallToAction · TestimonialCard / TestimonialGrid · LogoCloud · Banner · Footer · Sidebar / AppShell

**Charts (SVG, zero deps):** BarChart · LineChart · MultiLineChart · DonutChart · Sparkline · RadialProgress · ChartFrame

**Tema:** ThemeSwitcher

## Exemplos

### Botões

```tsx
<Button variant="gradient" leftIcon={<SparklesIcon />}>Gerar</Button>
<Button loading loadingText="Salvando…">Salvar</Button>
<Button variant="destructive" size="sm">Excluir</Button>
<Button asChild variant="link"><a href="/docs">Docs</a></Button>
```

### Formulário com validação (react-hook-form + zod)

```tsx
<Field invalid={!!errors.email} required>
  <FieldLabel>E-mail</FieldLabel>
  <FieldControl>
    <Input {...register("email")} />
  </FieldControl>
  <FieldError>{errors.email?.message}</FieldError>
</Field>
```

`FieldControl` liga `id`, `aria-describedby`, `aria-invalid` e `aria-required` automaticamente.

### Toast

```tsx
<ToastProvider position="top-right">
  <App />
</ToastProvider>;

const { toast } = useToast();
toast.success("Alterações salvas");
toast({ title: "Movido p/ lixeira", action: { label: "Desfazer", onClick: undo } });
```

### Data e combobox

```tsx
<DatePicker value={date} onValueChange={setDate} />
<Combobox multiple options={frameworks} value={stack} onValueChange={setStack} />
```

## Acessibilidade

Primitivas Radix (foco preso, teclado, ARIA), foco visível em tudo, animações de overlay desligadas com `prefers-reduced-motion`, textos acessíveis customizáveis (`closeLabel`, `labels`…) com padrão em português.

## Ver também

- [`aura-ui-tailwind`](https://www.npmjs.com/package/aura-ui-tailwind) — preset Tailwind v4
- [`aura-ui-effects`](https://www.npmjs.com/package/aura-ui-effects) — efeitos 3D/motion
- [`aura-ui-cli`](https://www.npmjs.com/package/aura-ui-cli) — copie os componentes para o seu repo (`npx aura-ui-cli add button`)
- [Repositório e documentação](https://github.com/Adilson2902/aura-ui)

**MIT**
