# aura-ui-cli

## 0.2.0

### Patch Changes

- 364dc9c: Catálogo v3 — 22 componentes novos, overlays animados e APIs mais flexíveis

  - **22 novos componentes**: AlertDialog, HoverCard, ContextMenu, Collapsible, Command/CommandDialog (cmdk), Combobox (simples/múltiplo), Drawer (arrastar p/ fechar), Field (label/descrição/erro com ARIA automático), InputGroup, InputOTP, NumberInput, FileUpload, Calendar (single/range, sem deps), DatePicker/DateRangePicker, ButtonGroup, AspectRatio, CopyButton, Typography (Heading/Text/InlineCode/Prose), Banner, Carousel (scroll-snap, sem deps), TestimonialCard/TestimonialGrid, LogoCloud (grid/marquee)
  - **Core**: animações de overlay por `data-state` (`aura-overlay`, `aura-pop`, `aura-sheet`, `aura-expandable`, `aura-toast`) com saída animada e `prefers-reduced-motion`
  - **Fix**: Dialog/Sheet/Popover/Menu/Select/Tooltip não animavam (classes `animate-in` de um plugin não instalado / transições que o Radix não espera); Accordion, Toggle `gradient` e Rating `gradient` usavam variantes Tailwind em classes CSS puras (ignoradas pelo Tailwind v4); seta do Tooltip era cortada; Toast semântico era transparente sobre a página
  - **APIs**: Button (`loading`, `loadingText`, `leftIcon`/`rightIcon`, `fullWidth`, tamanhos `xs`/`xl`/`icon-sm`/`icon-lg`, variantes `accent`/`destructive`/`link`); Card (`padding`, `interactive`, `asChild`, `CardAction`); `size` em Input/Select/Badge/Switch/Checkbox/Radio; Dialog/Sheet (`size`, `showClose`, `closeLabel`); Tabs (5 estilos + vertical); Accordion (4 estilos); Toast (6 posições, ações, `toast.success/error/warning/info`, pausa no hover); Avatar (`shape`, `AvatarGroup`); Checkbox indeterminado; `RadioGroupCard`; `SimpleTooltip`; `SelectSeparator`
  - **Tailwind preset**: `aura-destructive-foreground`, `shadow-aura-4`/`shadow-aura-5`
  - **Registry/CLI**: 40 arquivos do registry eram `export *` relativos ao monorepo (quebravam no `aura add`) — agora `pnpm registry:sync` gera cópias completas e deps reais (98 itens); arquivos `lib` vão p/ `aliases.lib`; `aura add` lista o `pnpm add` necessário
