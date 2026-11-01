"use client";

import {
  AnimatedShinyText,
  AuroraBackground,
  BentoGrid,
  BentoItem,
  Card3D,
  Float,
  GlassCard,
  HeroParallax,
  LayeredCard,
  Meteors,
  MovingBorder,
  OrbitingCircles,
  PerspectiveGrid,
  ShineBorder
} from "aura-ui-effects";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  BarChart,
  Breadcrumb,
  Button,
  Checkbox,
  DonutChart,
  EmptyState,
  Kbd,
  LineChart,
  MultiLineChart,
  Pagination,
  Progress,
  RadialProgress,
  Slider,
  Sparkline,
  Spinner,
  Stat,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ThemeSwitcher
} from "aura-ui-components";

const orbIcons = ["◆", "●", "▲", "■", "★"];

export function Lab3D() {
  return (
    <main className="lab">
      <header className="lab-header">
        <div>
          <p className="lab-kicker">Aura UI · Fase 3</p>
          <h1>
            Lab <span className="aura-text-gradient-primary">3D</span>
          </h1>
          <p className="lab-sub">
            Toque, incline, role. A suíte de profundidade (Daisy tokens + Magic motion + Aceternity
            wow) em um só lugar.
          </p>
        </div>
        <div className="lab-actions">
          <ThemeSwitcher />
          <Button variant="3d">Começar</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="outline">Docs</Button>
        </div>
      </header>

      {/* HERO SCENE */}
      <section className="lab-hero aura-surface">
        <PerspectiveGrid cell={56} duration={14} />
        <Meteors count={16} duration={3.2} />
        <div className="lab-hero-inner">
          <Float amplitude={10} duration={5}>
            <Badge>Interativo</Badge>
          </Float>
          <h2>
            Profundidade que se <em>sente</em>.
          </h2>
          <p>Tokens de elevação, luz direcional e camadas em Z — não sombras aleatórias.</p>
          <AnimatedShinyText>Mova o mouse nos cards abaixo</AnimatedShinyText>
        </div>
      </section>

      {/* DEPTH CARDS */}
      <section className="lab-grid-2">
        <article className="lab-block">
          <header>
            <h3>LayeredCard</h3>
            <p>
              Camadas em <code>data-depth</code> com parallax real.
            </p>
          </header>
          <LayeredCard className="lab-layered">
            <div data-depth="1" className="lab-chip">
              fundo
            </div>
            <div data-depth="2.5" className="lab-title">
              Camada média
            </div>
            <div data-depth="5" className="lab-chip lab-chip-accent">
              topo · z alto
            </div>
            <p className="lab-copy">
              Cada nó sobe em <code>translateZ</code> conforme o cursor.
            </p>
          </LayeredCard>
        </article>

        <article className="lab-block">
          <header>
            <h3>GlassCard</h3>
            <p>Vidro especular + elevação física.</p>
          </header>
          <GlassCard elevation={4} className="lab-glass">
            <p className="lab-kicker">Elevation 4</p>
            <h4>Superfície de vidro</h4>
            <p className="lab-copy">
              <code>--aura-glass-*</code> + <code>--aura-elevation-*</code> + specular.
            </p>
            <div className="lab-row">
              <Button size="sm" variant="solid">
                Ação
              </Button>
              <Button size="sm" variant="ghost">
                Cancelar
              </Button>
            </div>
          </GlassCard>
        </article>
      </section>

      {/* MOVING BORDER + CARD3D */}
      <section className="lab-grid-2">
        <article className="lab-block">
          <header>
            <h3>MovingBorder</h3>
            <p>Borda conic animada (Aceternity).</p>
          </header>
          <MovingBorder duration={5} borderSize={2}>
            <div className="lab-moving-inner aura-surface">
              <h4>Destaque com borda viva</h4>
              <p className="lab-copy">Ideal em CTAs e cards de preço.</p>
              <Button variant="gradient">Assinar agora</Button>
            </div>
          </MovingBorder>
        </article>

        <article className="lab-block">
          <header>
            <h3>Card3D</h3>
            <p>Tilt + glare que segue o cursor.</p>
          </header>
          <Card3D maxTilt={14} scale={1.03}>
            <p className="lab-kicker">Pointer-driven</p>
            <h4>Incline este card</h4>
            <p className="lab-copy">
              <code>rotateX/rotateY</code> via rAF + luz em <code>--aura-light-x/y</code>.
            </p>
          </Card3D>
        </article>
      </section>

      {/* BENTO */}
      <section className="lab-block">
        <header>
          <h3>BentoGrid</h3>
          <p>Células com tilt individual e specular.</p>
        </header>
        <BentoGrid cols={3}>
          <BentoItem colSpan>
            <p className="lab-kicker">Destaque</p>
            <h4>Grid com hierarquia</h4>
            <p className="lab-copy">Itens maiores, mesma linguagem de profundidade.</p>
          </BentoItem>
          <BentoItem>
            <h4>Velocidade</h4>
            <p className="lab-copy">Só transform/opacity.</p>
          </BentoItem>
          <BentoItem>
            <h4>A11y</h4>
            <p className="lab-copy">prefers-reduced-motion.</p>
          </BentoItem>
          <BentoItem rowSpan>
            <h4>Tema</h4>
            <p className="lab-copy">
              Tudo por CSS vars. Troque <code>--aura-primary</code> e o resto acompanha.
            </p>
          </BentoItem>
          <BentoItem>
            <h4>SSR</h4>
            <p className="lab-copy">Sem flash de hidratação.</p>
          </BentoItem>
        </BentoGrid>
      </section>

      {/* ORBIT + SHINE */}
      <section className="lab-grid-2">
        <article className="lab-block">
          <header>
            <h3>OrbitingCircles</h3>
            <p>Órbita CSS com counter-rotation.</p>
          </header>
          <div className="lab-orbit-wrap">
            <OrbitingCircles
              radius="110px"
              duration={18}
              center={
                <div className="lab-orbit-core aura-gradient-primary">
                  <span>✦</span>
                </div>
              }
            >
              {orbIcons.map((g, i) => (
                <div key={i} className="lab-orb">
                  {g}
                </div>
              ))}
            </OrbitingCircles>
          </div>
        </article>

        <article className="lab-block">
          <header>
            <h3>Shine + Aurora</h3>
            <p>Luz de assinatura DesignCode.</p>
          </header>
          <ShineBorder className="lab-shine">
            <AuroraBackground className="lab-aurora">
              <h4>Atmosfera viva</h4>
              <p className="lab-copy">Gradientes + brilho em loop perfeito.</p>
            </AuroraBackground>
          </ShineBorder>
        </article>
      </section>

      {/* HERO PARALLAX */}
      <section className="lab-block lab-parallax-block">
        <header>
          <h3>HeroParallax</h3>
          <p>Role a página — as linhas se movem em profundidade.</p>
        </header>
        <HeroParallax range={90} speed={0.4}>
          <div data-parallax-row data-parallax-speed="0.5" className="lab-parallax-row">
            {["Nova dimensão", "Luz real", "Motion honesto"].map((t) => (
              <div key={t} className="lab-parallax-card aura-surface">
                {t}
              </div>
            ))}
          </div>
          <div
            data-parallax-row
            data-parallax-speed="0.85"
            className="lab-parallax-row lab-parallax-row-b"
          >
            {["Tokens 3D", "Glass + Bevel", "Scenes"].map((t) => (
              <div key={t} className="lab-parallax-card aura-surface">
                {t}
              </div>
            ))}
          </div>
          <div data-parallax-row data-parallax-speed="1.2" className="lab-parallax-row">
            {["Bento", "Órbita", "Meteors"].map((t) => (
              <div key={t} className="lab-parallax-card aura-surface">
                {t}
              </div>
            ))}
          </div>
        </HeroParallax>
      </section>

      {/* UI KIT (Toolspace parity) */}
      <section className="lab-block">
        <header>
          <h3>UI Kit — paridade Toolspace + extras 3D</h3>
          <p>
            Accordion, Alert, Avatar, Breadcrumb, Checkbox, Pagination, Progress, Slider, Stat,
            Table, Toast…
          </p>
        </header>

        <div className="lab-grid-2">
          <div className="lab-ui-col">
            <Stat
              label="Receita"
              value="R$ 12.480"
              delta="+12,4%"
              deltaDirection="up"
              hint="vs. mês anterior"
              variant="elevated"
            />
            <div className="lab-row">
              <Avatar>
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <Badge variant="outline">Pro</Badge>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <Spinner size="sm" />
            </div>
            <Breadcrumb
              items={[
                { label: "Início", href: "/" },
                { label: "Ferramentas", href: "#" },
                { label: "Lab 3D" }
              ]}
            />
            <Progress value={68} label="Progresso" variant="glow" />
            <Slider defaultValue={[42]} max={100} step={1} aria-label="Intensidade" />
            <label className="lab-row">
              <Checkbox defaultChecked /> Aceito os termos
            </label>
            <Pagination page={3} pageCount={12} onPageChange={() => {}} />
          </div>

          <div className="lab-ui-col">
            <Alert variant="success" elevation="soft">
              <AlertTitle>Tudo certo</AlertTitle>
              <AlertDescription>
                Componentes alinhados aos tokens <code>--ts-*</code> / <code>--aura-*</code>.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>Revise os campos destacados.</AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="a">
                <AccordionTrigger>Como funciona o 3D?</AccordionTrigger>
                <AccordionContent>
                  Profundidade vem de tokens (<code>--aura-depth-*</code>, elevações, luz), não de
                  sombras soltas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>É acessível?</AccordionTrigger>
                <AccordionContent>
                  Sim — Radix, foco visível e <code>prefers-reduced-motion</code> em todos os
                  efeitos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="lab-surface">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Componente</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>3D</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Stat</TableCell>
                    <TableCell>Toolspace KPI</TableCell>
                    <TableCell>tilt + elevação</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sheet</TableCell>
                    <TableCell>Toolspace drawer</TableCell>
                    <TableCell>glass option</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Toast</TableCell>
                    <TableCell>Toolspace toast</TableCell>
                    <TableCell>glow variant</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <EmptyState
              title="Sem resultados"
              description="Tente outro filtro ou limpe a busca."
              action={<Button size="sm">Limpar filtros</Button>}
            />
          </div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="lab-block">
        <header>
          <h3>Charts — SVG zero-dep</h3>
          <p>Bar, Line/Area, Multi-série, Donut, Sparkline e RadialProgress.</p>
        </header>
        <div className="lab-grid-2">
          <BarChart
            title="Receita por canal"
            data={[
              { label: "Direct", value: 42 },
              { label: "Organic", value: 68 },
              { label: "Paid", value: 31 },
              { label: "Referral", value: 24 }
            ]}
            formatValue={(v) => `R$ ${v}k`}
          />
          <LineChart
            title="Ativos 30d"
            area
            data={[
              { label: "S1", value: 12 },
              { label: "S2", value: 18 },
              { label: "S3", value: 15 },
              { label: "S4", value: 27 },
              { label: "S5", value: 34 }
            ]}
          />
          <DonutChart
            title="Mix de planos"
            centerSublabel="total"
            data={[
              { label: "Pro", value: 48 },
              { label: "Team", value: 32 },
              { label: "Starter", value: 20 }
            ]}
          />
          <div className="lab-surface lab-ui-col" style={{ padding: 20 }}>
            <div className="lab-row" style={{ justifyContent: "space-between" }}>
              <div>
                <p className="lab-kicker">Sessões</p>
                <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>8.240</p>
              </div>
              <Sparkline data={[4, 8, 6, 12, 10, 16, 14, 22, 20]} />
            </div>
            <MultiLineChart
              title="Tráfego"
              height={140}
              series={[
                {
                  name: "Web",
                  data: [
                    { label: "a", value: 10 },
                    { label: "b", value: 16 },
                    { label: "c", value: 14 },
                    { label: "d", value: 22 }
                  ]
                },
                {
                  name: "App",
                  data: [
                    { label: "a", value: 6 },
                    { label: "b", value: 9 },
                    { label: "c", value: 13 },
                    { label: "d", value: 18 }
                  ]
                }
              ]}
            />
            <div className="lab-row" style={{ justifyContent: "space-around" }}>
              <RadialProgress value={72} size={96} label="72%" sublabel="Lighthouse" />
              <RadialProgress
                value={41}
                size={96}
                label="41%"
                sublabel="Meta mês"
                color="hsl(var(--aura-accent))"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="lab-footer">
        <p>
          Tokens: <code>--aura-depth-*</code> · <code>--aura-elevation-*</code> ·{" "}
          <code>--aura-perspective</code> · <code>--aura-light-*</code>
        </p>
      </footer>
    </main>
  );
}
