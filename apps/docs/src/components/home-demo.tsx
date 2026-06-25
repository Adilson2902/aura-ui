"use client";

import { AuroraBackground, AnimatedShinyText, Card3D, ShineBorder, Spotlight } from "@aura/effects";
import { Button } from "@aura/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@aura/ui/card";
import { Input } from "@aura/ui/input";

export function HomeDemo() {
  return (
    <AuroraBackground className="px-6 py-16">
      <main className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="text-center">
          <p className="text-sm font-medium text-aura-muted-foreground">Fase 0 + 1</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
            <AnimatedShinyText>Aura UI</AnimatedShinyText>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-aura-muted-foreground">
            Design system 3D — ownership do código, Radix, tokens de profundidade e efeitos
            SSR-safe.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="3d" size="lg">
              Começar
            </Button>
            <Button variant="glass" size="lg">
              npx aura init
            </Button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Spotlight>
            <Card>
              <CardHeader>
                <CardTitle>Primitivos</CardTitle>
                <CardDescription>Button, Input, Card com variantes 3D e glass.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="Seu e-mail" type="email" />
                <Button className="w-full">Continuar</Button>
              </CardContent>
            </Card>
          </Spotlight>

          <ShineBorder>
            <Card3D>
              <CardTitle>Card3D</CardTitle>
              <CardDescription className="mt-2">
                Tilt com glare — respeita prefers-reduced-motion.
              </CardDescription>
            </Card3D>
          </ShineBorder>
        </section>

        <footer className="text-center text-sm text-aura-muted-foreground">
          Monorepo em <code className="rounded bg-aura-muted px-1">~/Documents/aura-ui</code>
        </footer>
      </main>
    </AuroraBackground>
  );
}
