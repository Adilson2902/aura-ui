"use client";

import dynamic from "next/dynamic";
import { useTheme } from "aura-ui-core/client";
import {
  AuroraBackground,
  BentoGrid,
  BentoItem,
  BorderBeam,
  Card3D,
  Float,
  GlassCard,
  GlowOrb,
  LayeredCard,
  Marquee,
  MovingBorder,
  NumberTicker,
  OrbitingCircles,
  PerspectiveGrid,
  ShineBorder,
  Spotlight
} from "aura-ui-effects";
import { Button } from "aura-ui-components";
import styles from "./demo-showcase.module.css";

const DemoHeroScene = dynamic(() => import("./demo-scenes").then((mod) => mod.DemoHeroScene), {
  ssr: false,
  loading: () => (
    <div className={styles.sceneFallback} role="status">
      Carregando HeroScene…
    </div>
  )
});

const DemoParticleScene = dynamic(
  () => import("./demo-scenes").then((mod) => mod.DemoParticleScene),
  {
    ssr: false,
    loading: () => (
      <div className={styles.sceneFallback} role="status">
        Carregando cena de partículas…
      </div>
    )
  }
);

const marqueeItems = [
  "Card3D",
  "GlassCard",
  "LayeredCard",
  "MovingBorder",
  "ShineBorder",
  "BorderBeam",
  "Aurora",
  "Orbit",
  "Bento",
  "Spotlight"
];

const orbitGlyphs = ["◆", "●", "▲", "★"];

export function DemoShowcase() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <span aria-hidden="true">a</span>
          Aura UI
        </a>
        <nav aria-label="Seções da demo">
          <a href="#efeitos">Efeitos</a>
          <a href="#cenas">Cenas</a>
          <a href="/">Catálogo</a>
        </nav>
        <button
          type="button"
          className={styles.themeButton}
          aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        >
          {dark ? "Claro" : "Escuro"}
        </button>
      </header>

      <main id="conteudo">
        <section className={styles.hero} aria-labelledby="demo-titulo">
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>aura-ui-effects · aura-ui-three · v0.2.1</p>
            <h1 id="demo-titulo">Interfaces com profundidade real</h1>
            <p className={styles.lead}>
              Efeitos em CSS e cenas WebGL no mesmo sistema de tokens. 73 componentes, 23 efeitos,
              publicados no npm.
            </p>
            <div className={styles.actions}>
              <Button
                variant="3d"
                onClick={() => document.getElementById("efeitos")?.scrollIntoView()}
              >
                Ver efeitos
              </Button>
              <a className={styles.secondary} href="#cenas">
                Ver cenas 3D
              </a>
            </div>
            <dl className={styles.stats}>
              <div>
                <dt>Componentes</dt>
                <dd>
                  <NumberTicker value={73} />
                </dd>
              </div>
              <div>
                <dt>Efeitos</dt>
                <dd>
                  <NumberTicker value={23} />
                </dd>
              </div>
              <div>
                <dt>Temas</dt>
                <dd>
                  <NumberTicker value={33} />
                </dd>
              </div>
            </dl>
          </div>
          <DemoHeroScene />
        </section>

        <div className={styles.marqueeWrap}>
          <Marquee duration={28} aria-label="Nomes dos efeitos em destaque">
            {marqueeItems.map((item) => (
              <span key={item} className={styles.marqueeItem}>
                {item}
              </span>
            ))}
          </Marquee>
        </div>

        <section id="efeitos" className={styles.section} aria-labelledby="efeitos-titulo">
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>aura-ui-effects</p>
            <h2 id="efeitos-titulo">Efeitos</h2>
            <p className={styles.lead}>
              Profundidade, bordas de luz e movimento. Tudo responde a{" "}
              <code>prefers-reduced-motion</code>.
            </p>
          </div>

          <div className={styles.grid}>
            <Card3D className={styles.card}>
              <p className={styles.kicker}>Card3D</p>
              <h3>Incline com o cursor</h3>
              <p>Tilt e glare seguem o ponteiro, com tokens de luz.</p>
            </Card3D>

            <GlassCard elevation={4} className={styles.card}>
              <p className={styles.kicker}>GlassCard</p>
              <h3>Vidro com elevação</h3>
              <p>Blur, bevel e sombra física no mesmo card.</p>
            </GlassCard>

            <LayeredCard className={styles.layered}>
              <p className={styles.kicker} data-depth="1">
                LayeredCard
              </p>
              <h3 data-depth="3">Camadas em Z</h3>
              <p data-depth="5">Cada bloco sobe conforme o cursor.</p>
            </LayeredCard>

            <MovingBorder duration={6} borderSize={2}>
              <div className={styles.movingInner}>
                <p className={styles.kicker}>MovingBorder</p>
                <h3>Borda viva</h3>
                <p>Anel cônico para CTAs e preços.</p>
              </div>
            </MovingBorder>

            <ShineBorder className={styles.shine}>
              <div className={styles.card}>
                <p className={styles.kicker}>ShineBorder</p>
                <h3>Contorno de luz</h3>
                <p>Um brilho que percorre a borda em loop.</p>
              </div>
            </ShineBorder>

            <BorderBeam className={styles.card} duration={7}>
              <p className={styles.kicker}>BorderBeam</p>
              <h3>Feixe na borda</h3>
              <p>Arco tokenizado, estático quando o movimento reduz.</p>
            </BorderBeam>
          </div>

          <Spotlight className={styles.spotlight}>
            <PerspectiveGrid cell={48} duration={16} />
            <div className={styles.spotlightCopy}>
              <p className={styles.kicker}>Spotlight · PerspectiveGrid</p>
              <h3>Luz que segue o ponteiro</h3>
              <p>O halo usa a posição publicada nos tokens de luz.</p>
            </div>
          </Spotlight>

          <div className={styles.split}>
            <AuroraBackground className={styles.aurora}>
              <p className={styles.kicker}>AuroraBackground</p>
              <h3>Atmosfera</h3>
              <Float amplitude={8} duration={5}>
                <p className={styles.floatBadge}>Float</p>
              </Float>
            </AuroraBackground>

            <div className={styles.orbitCard}>
              <p className={styles.kicker}>OrbitingCircles</p>
              <h3>Órbita</h3>
              <div className={styles.orbitStage}>
                <OrbitingCircles
                  radius="92px"
                  duration={18}
                  center={<span className={styles.orbitCore}>✦</span>}
                >
                  {orbitGlyphs.map((glyph) => (
                    <span key={glyph} className={styles.orbitItem} aria-hidden="true">
                      {glyph}
                    </span>
                  ))}
                </OrbitingCircles>
              </div>
            </div>
          </div>

          <BentoGrid cols={3}>
            <BentoItem colSpan>
              <p className={styles.kicker}>BentoGrid</p>
              <h3>Hierarquia no grid</h3>
              <p>Células com tilt e a mesma linguagem de profundidade.</p>
            </BentoItem>
            <BentoItem>
              <h3>SSR</h3>
              <p>Sem flash de hidratação.</p>
            </BentoItem>
            <BentoItem>
              <h3>Tokens</h3>
              <p>Troque a marca e o resto acompanha.</p>
            </BentoItem>
          </BentoGrid>

          <div className={styles.glowRow}>
            <GlowOrb color="primary" size="md" className={styles.glow} />
            <p>
              <strong>GlowOrb.</strong> Brilho decorativo, só com tokens, atrás do conteúdo.
            </p>
          </div>
        </section>

        <section id="cenas" className={styles.section} aria-labelledby="cenas-titulo">
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>aura-ui-three</p>
            <h2 id="cenas-titulo">Cenas WebGL</h2>
            <p className={styles.lead}>
              React Three Fiber entra só quando a página precisa de malha de verdade. Sem WebGL, o
              hero cai para o gradiente.
            </p>
          </div>
          <DemoParticleScene />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Aura UI 0.2.1 · MIT · efeitos CSS e cenas three no mesmo tema.</p>
        <a href="/">Voltar ao catálogo</a>
      </footer>
    </div>
  );
}
