# Receitas Aura UI

Exemplos no **modo pacote** (`import … from "aura-ui-components"`). No modo CLI, troque pelos caminhos locais (`@/components/ui/<nome>`). Confirme props com `get_component` se for além do que está aqui.

## Landing page

```tsx
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarLink,
  NavbarAction,
  Hero,
  HeroContent,
  HeroEyebrow,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  Section,
  Container,
  SectionHeading,
  FeatureGrid,
  FeatureCard,
  PricingCard,
  TestimonialGrid,
  TestimonialCard,
  LogoCloud,
  CallToAction,
  Footer,
  FooterBottom,
  Button
} from "aura-ui-components";

export default function Landing() {
  return (
    <>
      <Navbar>
        <NavbarBrand>Acme</NavbarBrand>
        <NavbarNav>
          <NavbarLink href="#recursos" active>
            Recursos
          </NavbarLink>
          <NavbarLink href="#precos">Preços</NavbarLink>
        </NavbarNav>
        <NavbarAction>
          <Button size="sm">Começar</Button>
        </NavbarAction>
      </Navbar>

      <Hero variant="aurora">
        <HeroContent>
          <HeroEyebrow variant="glass">Novo · v2</HeroEyebrow>
          <HeroTitle gradient>Lance seu produto em dias</HeroTitle>
          <HeroSubtitle>Componentes prontos, temas e efeitos 3D.</HeroSubtitle>
          <HeroActions>
            <Button variant="glow" size="lg">
              Testar grátis
            </Button>
            <Button variant="glass" size="lg">
              Ver demo
            </Button>
          </HeroActions>
        </HeroContent>
      </Hero>

      <Section id="recursos" spacing="lg">
        <Container>
          <SectionHeading eyebrow="Recursos" title="Tudo que você precisa" align="center" />
          <FeatureGrid columns={3}>
            <FeatureCard variant="glass" title="Rápido" description="Pronto para produção." />
            {/* … */}
          </FeatureGrid>
        </Container>
      </Section>

      <Section id="precos" background="muted">
        <Container width="md" className="grid gap-6 md:grid-cols-3">
          <PricingCard
            name="Starter"
            price="R$ 0"
            priceSuffix="/mês"
            features={["1 projeto"]}
            actions={
              <Button variant="outline" fullWidth>
                Começar
              </Button>
            }
          />
          <PricingCard
            name="Pro"
            price="R$ 49"
            priceSuffix="/mês"
            badge="Mais popular"
            featured
            variant="gradient"
            features={["Projetos ilimitados"]}
            actions={
              <Button variant="glass" fullWidth>
                Assinar
              </Button>
            }
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <LogoCloud title="Usado por times em" layout="marquee">
            {/* <img …/> ou SVGs */}
          </LogoCloud>
          <TestimonialGrid columns={3}>
            <TestimonialCard
              quote="Montamos tudo em uma tarde."
              author="Marina Costa"
              role="CTO, Lumen"
              rating={5}
            />
          </TestimonialGrid>
        </Container>
      </Section>

      <CallToAction
        variant="aurora"
        title="Pronto para começar?"
        actions={<Button variant="glass">Criar conta</Button>}
      />
      <Footer>
        <FooterBottom>© 2026 Acme</FooterBottom>
      </Footer>
    </>
  );
}
```

## Dashboard

```tsx
import {
  AppShell,
  Sidebar,
  SidebarItem,
  SidebarLabel,
  Stat,
  Sparkline,
  BarChart,
  DataTable,
  Card,
  CardHeader,
  CardTitle
} from "aura-ui-components";

type Pedido = { id: string; cliente: string; total: number };

export function Dashboard({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <AppShell
      sidebar={
        <Sidebar brand="Acme">
          <SidebarLabel>Geral</SidebarLabel>
          <SidebarItem href="/" active>
            Visão geral
          </SidebarItem>
          <SidebarItem href="/pedidos">Pedidos</SidebarItem>
        </Sidebar>
      }
    >
      <div className="grid gap-4 p-6 md:grid-cols-3">
        <Stat
          label="Receita"
          value="R$ 12.480"
          delta="+12%"
          deltaDirection="up"
          icon={<Sparkline data={[3, 5, 4, 8, 7, 9]} />}
        />
        <Stat label="Pedidos" value={pedidos.length} delta="-3%" deltaDirection="down" />
        <Stat label="Ticket médio" value="R$ 86" variant="elevated" />
      </div>
      <div className="grid gap-4 px-6 lg:grid-cols-2">
        <BarChart
          title="Canais"
          data={[
            { label: "Direto", value: 42 },
            { label: "Orgânico", value: 68 }
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Últimos pedidos</CardTitle>
          </CardHeader>
          <DataTable
            data={pedidos}
            getRowId={(p) => p.id}
            pageSize={8}
            columns={[
              { id: "cliente", header: "Cliente", accessor: (p) => p.cliente },
              {
                id: "total",
                header: "Total",
                accessor: (p) => p.total,
                cell: (p) => `R$ ${p.total.toFixed(2)}`
              }
            ]}
          />
        </Card>
      </div>
    </AppShell>
  );
}
```

## Formulário com validação (react-hook-form + zod)

```tsx
"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  useToast
} from "aura-ui-components";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  plano: z.string().min(1, "Escolha um plano")
});
type Dados = z.infer<typeof schema>;

export function Cadastro() {
  const { toast } = useToast(); // requer <ToastProvider> acima
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Dados>({ resolver: zodResolver(schema) });

  const enviar = async (dados: Dados) => {
    await salvar(dados);
    toast.success("Cadastro feito!");
  };

  return (
    <form onSubmit={handleSubmit(enviar)} className="grid max-w-md gap-5">
      <Field invalid={!!errors.email} required>
        <FieldLabel>E-mail</FieldLabel>
        <FieldControl>
          <Input type="email" {...register("email")} />
        </FieldControl>
        <FieldDescription>Usamos só para login.</FieldDescription>
        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Field invalid={!!errors.plano} required>
        <FieldLabel>Plano</FieldLabel>
        <Controller
          control={control}
          name="plano"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <FieldControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
              </FieldControl>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.plano?.message}</FieldError>
      </Field>

      <Button type="submit" loading={isSubmitting} loadingText="Enviando…">
        Criar conta
      </Button>
    </form>
  );
}
```

## Confirmação destrutiva

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Excluir</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
      <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={excluir}>
        Excluir
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
