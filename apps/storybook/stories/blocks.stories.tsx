import type { Meta, StoryObj } from "@storybook/react";
import { Hero, HeroContent, HeroEyebrow, HeroTitle, HeroSubtitle, HeroActions } from "@aura/ui/hero";
import { Section, Container, SectionHeading } from "@aura/ui/section";
import { FeatureGrid, FeatureCard } from "@aura/ui/feature-grid";
import { PricingGrid, PricingCard } from "@aura/ui/pricing";
import { CallToAction } from "@aura/ui/cta";
import { Steps } from "@aura/ui/steps";
import { Timeline, TimelineItem } from "@aura/ui/timeline";
import { Rating } from "@aura/ui/rating";
import { TagsInput } from "@aura/ui/tags-input";
import { Meter } from "@aura/ui/meter";
import { CodeBlock } from "@aura/ui/code-block";
import { Blockquote } from "@aura/ui/blockquote";
import { Toggle, ToggleGroup } from "@aura/ui/toggle";
import { Button } from "@aura/ui/button";
import { Badge } from "@aura/ui/badge";
import { Input } from "@aura/ui/input";
import { Textarea } from "@aura/ui/textarea";
import { Spinner } from "@aura/ui/spinner";
import { Kbd } from "@aura/ui/kbd";
import { Separator } from "@aura/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@aura/ui/table";
import { Sidebar, SidebarItem, SidebarLabel, AppShell } from "@aura/ui/sidebar";

const meta: Meta = {
  title: "Overview/Page Blocks",
  parameters: { layout: "fullscreen" }
};

export default meta;
type Story = StoryObj;

const icon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5" aria-hidden>
    <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Hero variants ---------- */

export const HeroVariants: Story = {
  name: "Hero — 6 variantes",
  render: () => (
    <div className="space-y-10">
      {(["clean", "muted", "gradient", "aurora", "glass", "grid"] as const).map((v) => (
        <Hero key={v} variant={v}>
          <HeroContent>
            <HeroEyebrow variant="gradient">v2.0</HeroEyebrow>
            <HeroTitle gradient>Construa sites em minutos</HeroTitle>
            <HeroSubtitle>
              Blocos prontos — hero, features, pricing, CTA e footer — com variantes limpas, glass
              e 3D. Variante: <code className="text-aura-primary">{v}</code>
            </HeroSubtitle>
            <HeroActions>
              <Button variant="3d">Começar agora</Button>
              <Button variant="glass">Ver docs</Button>
            </HeroActions>
          </HeroContent>
        </Hero>
      ))}
    </div>
  )
};

/* ---------- Features ---------- */

export const Features: Story = {
  name: "FeatureGrid + FeatureCard — 5 variantes",
  render: () => (
    <Container className="space-y-12 py-12">
      <SectionHeading
        eyebrow="Blocos"
        title="Tudo que uma landing precisa"
        description="Grade responsiva com cards de superfície, glass, glow e tilt."
      />
      {(["surface", "outline", "glass", "glow", "tilt"] as const).map((v) => (
        <div key={v}>
          <Badge variant="soft" className="mb-3">{v}</Badge>
          <FeatureGrid columns={3}>
            {[1, 2, 3].map((i) => (
              <FeatureCard key={i} variant={v} icon={icon} title={`Feature ${i}`} description="Ícone em chip da marca, hover físico e variantes tokenizadas." />
            ))}
          </FeatureGrid>
        </div>
      ))}
    </Container>
  )
};

/* ---------- Pricing ---------- */

export const Pricing: Story = {
  name: "PricingCard — 5 variantes",
  render: () => (
    <Container className="py-12">
      <SectionHeading title="Planos" description="Plano destacado com badge e elevação." />
      <PricingGrid>
        <PricingCard
          name="Starter"
          price="R$0"
          priceSuffix="/mês"
          description="Para testar a biblioteca."
          features={["10 componentes", "Temas claros", "Comunidade"]}
          actions={<Button variant="outline" className="w-full">Começar</Button>}
        />
        <PricingCard
          featured
          badge="Mais popular"
          variant="gradient"
          name="Pro"
          price="R$49"
          priceSuffix="/mês"
          description="Para produtos em produção."
          features={["Todos os 51 componentes", "33 temas + dark", "Efeitos 3D e animados", "CLI + registry", "Suporte prioritário"]}
          actions={<Button variant="glass" className="w-full">Assinar Pro</Button>}
        />
        <PricingCard
          name="Team"
          price="R$99"
          priceSuffix="/mês"
          features={["Tudo do Pro", "Seats ilimitados", "SLA 99.9%"]}
          actions={<Button variant="outline" className="w-full">Falar com vendas</Button>}
        />
      </PricingGrid>
    </Container>
  )
};

/* ---------- Steps + Timeline ---------- */

export const StepsAndTimeline: Story = {
  name: "Steps + Timeline",
  render: () => (
    <Container className="grid gap-16 py-12 lg:grid-cols-2">
      <div className="space-y-10">
        <SectionHeading title="Steps" align="left" />
        <Steps
          active={1}
          steps={[
            { title: "Instalar", description: "npx aura init" },
            { title: "Adicionar", description: "npx aura add hero pricing" },
            { title: "Temar", description: "33 temas via data-theme" },
            { title: "Publicar" }
          ]}
        />
        <Steps
          variant="cards"
          orientation="vertical"
          active={2}
          steps={[
            { title: "Onboarding" },
            { title: "Configuração" },
            { title: "Deploy" }
          ]}
        />
      </div>
      <div>
        <SectionHeading title="Timeline" align="left" />
        <Timeline variant="gradient">
          <TimelineItem title="v0.1 — Fundação" time="Jan 2026">
            Tokens 3D, core, preset Tailwind e Storybook.
          </TimelineItem>
          <TimelineItem title="v0.2 — Catálogo" time="Mar 2026">
            51 componentes, 23 efeitos e CLI com registry.
          </TimelineItem>
          <TimelineItem title="v0.3 — 33 temas" time="Out 2026">
            Catálogo de temas completo + blocos de página.
          </TimelineItem>
        </Timeline>
      </div>
    </Container>
  )
};

/* ---------- Formularios avulsos ---------- */

export const FormKit: Story = {
  name: "Input/Textarea — 7 variantes · Tags · Toggle · Rating · Meter",
  render: () => (
    <Container className="space-y-12 py-12">
      <section className="space-y-4">
        <SectionHeading title="Inputs — 7 variantes" align="left" />
        <div className="grid gap-4 md:grid-cols-2">
          {(["default", "soft", "outline", "underline", "glass", "glow", "3d"] as const).map((v) => (
            <div key={v} className="space-y-1.5">
              <label className="text-xs font-medium text-aura-muted-foreground">{v}</label>
              <Input variant={v} placeholder={`Input ${v}…`} />
            </div>
          ))}
        </div>
        <Textarea variant="3d" placeholder="Textarea 3d — bevel físico no foco…" />
      </section>

      <section className="space-y-5">
        <SectionHeading title="Tags · Toggle · Rating · Meter" align="left" />
        <TagsInput defaultValue={["design", "3d", "temas"]} tone="gradient" />
        <ToggleGroup
          variant="3d"
          items={[
            { label: "Limpo", value: "clean" },
            { label: "3D", value: "3d" },
            { label: "Animado", value: "anim" }
          ]}
          defaultValue={["3d"]}
        />
        <div className="flex flex-wrap items-center gap-8">
          <Rating value={4} onChange={() => {}} variant="glow" />
          <Rating value={3.5} variant="gradient" />
          <div className="w-56 space-y-3">
            <Meter value={72} label="Disco" showValue />
            <Meter value={93} label="Memória" variant="glass" tone="warning" showValue />
          </div>
        </div>
      </section>
    </Container>
  )
};

/* ---------- Tabela + utilitários ---------- */

const rows = [
  { name: "Hero", type: "Bloco", variants: 6 },
  { name: "Button", type: "Form", variants: 9 },
  { name: "Table", type: "Data", variants: 6 },
  { name: "Input", type: "Form", variants: 7 }
];

export const TableVariants: Story = {
  name: "Table — 6 variantes · Kbd · Separator · Spinner",
  render: () => (
    <Container className="space-y-10 py-12">
      {(["default", "clean", "striped", "bordered", "glass", "3d"] as const).map((v) => (
        <div key={v} className="space-y-2">
          <Badge variant="soft">{v}</Badge>
          <Table variant={v}>
            <TableHeader>
              <TableRow>
                <TableHead>Componente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Variantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-aura-muted-foreground">{r.type}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.variants}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-6 rounded-[var(--aura-radius)] border border-aura-border p-6">
        <Spinner variant="dots" />
        <Spinner variant="bars" />
        <Spinner variant="pulse" />
        <Spinner variant="gradient" />
        <Separator orientation="vertical" className="h-6" variant="glow" />
        <Kbd variant="3d">Ctrl</Kbd> + <Kbd variant="glass">K</Kbd>
        <Separator orientation="vertical" className="h-6" variant="dashed" />
        <Kbd variant="flat">⌘</Kbd>
      </div>
    </Container>
  )
};

/* ---------- CTA + Footer ---------- */

export const CtaAndFooter: Story = {
  name: "CallToAction + Footer",
  render: () => (
    <div>
      <Container className="py-12">
        <CallToAction
          variant="aurora"
          title="Pronto para construir mais rápido?"
          description="51 componentes, 23 efeitos e 33 temas — copie e possua o código."
          actions={
            <>
              <Button variant="glass" size="lg">Começar grátis</Button>
              <Button variant="3d" size="lg">Ver componentes</Button>
            </>
          }
        />
      </Container>
      <Section background="muted">
        <Blockquote
          variant="quote-mark"
          author="Equipe Aura"
          role="dogfooding"
        >
          A própria documentação é montada com estes blocos — hero, features, pricing e CTA em
          minutos, com profundidade real.
        </Blockquote>
        <div className="mt-10">
          <CodeBlock
            language="bash"
            code={"npx aura init\nnpx aura add hero pricing footer --theme synthwave"}
          />
        </div>
      </Section>
    </div>
  )
};

/* ---------- AppShell ---------- */

export const DashboardShell: Story = {
  name: "Sidebar + AppShell (dashboard)",
  render: () => (
    <AppShell
      sidebar={
        <Sidebar
          variant="surface"
          collapsed={false}
          onCollapsedChange={() => {}}
          brand={
            <span className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg aura-gradient-primary text-sm font-black text-aura-primary-foreground">A</span>
              <span className="truncate">Aura Admin</span>
            </span>
          }
          footer={<span className="px-3 text-xs text-aura-muted-foreground">v2.0.0</span>}
        >
          <SidebarLabel>Principal</SidebarLabel>
          <SidebarItem active icon={icon}>Visão geral</SidebarItem>
          <SidebarItem icon={icon}>Análises</SidebarItem>
          <SidebarLabel>Conta</SidebarLabel>
          <SidebarItem icon={icon}>Configurações</SidebarItem>
          <SidebarItem icon={icon}>Sair</SidebarItem>
        </Sidebar>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Visão geral</h1>
          <Button variant="gradient">Novo relatório</Button>
        </div>
        <FeatureGrid columns={3}>
          <FeatureCard title="Receita" description={<Meter value={64} showValue label="Meta" />} />
          <FeatureCard title="Usuários" description={<Meter value={91} tone="warning" variant="glass" showValue label="Capacidade" />} />
          <FeatureCard title="Churn" description={<Meter value={12} tone="success" showValue label="Alerta" />} />
        </FeatureGrid>
      </div>
    </AppShell>
  )
};
