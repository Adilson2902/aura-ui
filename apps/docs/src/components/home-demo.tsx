"use client";

import { useState, type ReactNode } from "react";
import { useTheme } from "aura-ui-core/client";
import { AnimatedShinyText, Card3D, ShineBorder, AuroraBackground } from "aura-ui-effects";
import {
  Button,
  Input,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DataTable,
  type DataTableColumn
} from "aura-ui-components";

const categories = ["Todos", "Efeitos", "Interface", "Formulários", "Dados"] as const;
type Category = (typeof categories)[number];
const catalog = [
  {
    id: "card-3d",
    title: "Card 3D",
    category: "Efeitos",
    description: "Profundidade que acompanha cada movimento.",
    tag: "Interativo"
  },
  {
    id: "buttons",
    title: "Botões",
    category: "Interface",
    description: "Do essencial ao extraordinário, em um clique.",
    tag: "6 variantes"
  },
  {
    id: "shine-border",
    title: "Shine Border",
    category: "Efeitos",
    description: "Um contorno de luz para o que merece destaque.",
    tag: "Animado"
  },
  {
    id: "preferences",
    title: "Preferências",
    category: "Formulários",
    description: "Controles reais, estados claros e foco acessível.",
    tag: "Radix UI"
  },
  {
    id: "tabs",
    title: "Tabs",
    category: "Interface",
    description: "Organize conteúdo sem perder o contexto.",
    tag: "Acessível"
  },
  {
    id: "form",
    title: "Formulário + Dialog",
    category: "Formulários",
    description: "Validação, confirmação e navegação por teclado.",
    tag: "Funcional"
  },
  {
    id: "aurora",
    title: "Aurora Background",
    category: "Efeitos",
    description: "Uma atmosfera de cor, luz e movimento.",
    tag: "Animado"
  },
  {
    id: "text",
    title: "Shiny Text",
    category: "Efeitos",
    description: "Tipografia com aquele toque de magia.",
    tag: "Animado"
  },
  {
    id: "table",
    title: "Data Table",
    category: "Dados",
    description: "Seus dados, com todas as ferramentas no lugar.",
    tag: "Novo"
  }
];
const snippets: Record<string, string> = {
  "card-3d":
    'import { Card3D } from "aura-ui-effects";\n\n<Card3D maxTilt={12}>\n  <h3>Uma nova dimensão.</h3>\n  <p>Mova o cursor sobre o card.</p>\n</Card3D>',
  buttons:
    'import { Button } from "aura-ui-components";\n\n<Button variant="3d" onClick={handleClick}>\n  Criar algo incrível\n</Button>\n<Button variant="glass">Glass</Button>\n<Button variant="outline">Outline</Button>',
  "shine-border":
    'import { ShineBorder } from "aura-ui-effects";\n\n<ShineBorder>\n  <div className="p-8">\n    <h3>Feito para se destacar.</h3>\n  </div>\n</ShineBorder>',
  preferences:
    'import { useState } from "react";\nimport { Switch } from "aura-ui-components";\n\nfunction Preferences() {\n  const [enabled, setEnabled] = useState(true);\n  return <Switch aria-label="Notificações"\n    checked={enabled}\n    onCheckedChange={setEnabled} />;\n}',
  tabs: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "aura-ui-components";\n\n<Tabs defaultValue="design">\n  <TabsList>\n    <TabsTrigger value="design">Design</TabsTrigger>\n    <TabsTrigger value="code">Código</TabsTrigger>\n  </TabsList>\n  <TabsContent value="design">Crie com intenção.</TabsContent>\n  <TabsContent value="code">Seu código. Suas regras.</TabsContent>\n</Tabs>',
  form: 'import { Dialog, DialogTrigger, DialogContent,\n  DialogTitle, DialogDescription, Button } from "aura-ui-components";\n\n<Dialog>\n  <DialogTrigger asChild>\n    <Button>Abrir confirmação</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Tudo pronto!</DialogTitle>\n    <DialogDescription>Dados validados.</DialogDescription>\n  </DialogContent>\n</Dialog>',
  aurora:
    'import { AuroraBackground } from "aura-ui-effects";\n\n<AuroraBackground>\n  <h3>Um pouco de atmosfera.</h3>\n</AuroraBackground>',
  text: 'import { AnimatedShinyText } from "aura-ui-effects";\n\n<AnimatedShinyText>\n  Make it shine.\n</AnimatedShinyText>',
  table:
    'import { DataTable } from "aura-ui-components/data-table";\n\nconst data = [{ id: "1", name: "Ana", total: 249 }];\nconst columns = [\n  { id: "name", header: "Nome", accessor: row => row.name },\n  { id: "total", header: "Total", accessor: row => row.total }\n];\n\n<DataTable data={data} columns={columns}\n  getRowId={row => row.id} pageSize={5}\n  caption="Clientes" />'
};

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  plan: string;
  total: number;
};
const customers: Customer[] = [
  {
    id: "01",
    name: "Olivia Martins",
    email: "olivia@exemplo.com",
    status: "Ativo",
    plan: "Pro",
    total: 249
  },
  {
    id: "02",
    name: "Lucas Almeida",
    email: "lucas@exemplo.com",
    status: "Ativo",
    plan: "Team",
    total: 599
  },
  {
    id: "03",
    name: "Sofia Costa",
    email: "sofia@exemplo.com",
    status: "Pendente",
    plan: "Starter",
    total: 99
  },
  {
    id: "04",
    name: "Gabriel Santos",
    email: "gabriel@exemplo.com",
    status: "Ativo",
    plan: "Pro",
    total: 249
  },
  {
    id: "05",
    name: "Isabela Lima",
    email: "isabela@exemplo.com",
    status: "Inativo",
    plan: "Starter",
    total: 99
  },
  {
    id: "06",
    name: "Pedro Rocha",
    email: "pedro@exemplo.com",
    status: "Ativo",
    plan: "Team",
    total: 599
  },
  {
    id: "07",
    name: "Alice Ribeiro",
    email: "alice@exemplo.com",
    status: "Pendente",
    plan: "Pro",
    total: 249
  },
  {
    id: "08",
    name: "Rafael Alves",
    email: "rafael@exemplo.com",
    status: "Ativo",
    plan: "Starter",
    total: 99
  }
];
const columns: DataTableColumn<Customer>[] = [
  {
    id: "name",
    header: "Cliente",
    accessor: (row) => row.name,
    cell: (row) => (
      <div className="customer">
        <span className={`avatar avatar-${Number(row.id) % 3}`}>
          {row.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <span>
          <strong>{row.name}</strong>
          <small>{row.email}</small>
        </span>
      </div>
    )
  },
  { id: "email", header: "E-mail", accessor: (row) => row.email },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    cell: (row) => (
      <span className={`status status-${row.status.toLowerCase()}`}>● {row.status}</span>
    )
  },
  { id: "plan", header: "Plano", accessor: (row) => row.plan },
  {
    id: "total",
    header: "Valor",
    accessor: (row) => row.total,
    cell: (row) => row.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    spark: "m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6z",
    layers: "m12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5",
    search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    arrow: "M4 12h16 M14 6l6 6-6 6",
    code: "m8 7-5 5 5 5 m8-10 5 5-5 5 M14 4l-4 16",
    moon: "M20 14A9 9 0 0 1 10 4a9 9 0 1 0 10 10",
    table: "M3 4h18v16H3z M3 10h18 M9 4v16",
    sliders: "M4 7h16 M4 17h16 M8 4v6 M16 14v6",
    book: "M4 3h12a4 4 0 0 1 4 4v14H7a3 3 0 0 1-3-3z M4 17h16 M8 7h8 M8 11h6",
    check: "m5 12 4 4L19 6"
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

function Preview({ id, notify }: { id: string; notify: (message: string) => void }) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  if (id === "card-3d")
    return (
      <Card3D className="dimension-card">
        <div className="dimension-top">
          <span>AURA STUDIO</span>
          <Icon name="spark" />
        </div>
        <div className="orb-scene" aria-hidden="true">
          <div className="orb" />
          <div className="orb-ring" />
        </div>
        <h3>Uma nova dimensão.</h3>
        <p>Mova o cursor. Sinta a diferença.</p>
        <span className="dimension-arrow">↗</span>
      </Card3D>
    );
  if (id === "buttons")
    return (
      <div className="button-demo">
        <Button variant="3d" onClick={() => notify("Pronto! O evento onClick foi executado.")}>
          Criar algo incrível <Icon name="spark" size={15} />
        </Button>
        <div>
          <Button variant="outline" onClick={() => notify("Variante outline acionada.")}>
            Outline
          </Button>
          <Button variant="glass" onClick={() => notify("Variante glass acionada.")}>
            Glass ↗
          </Button>
        </div>
        <Button variant="soft" onClick={() => notify("Salvo nesta demonstração.")}>
          <Icon name="check" size={15} /> Salvar alterações
        </Button>
      </div>
    );
  if (id === "shine-border")
    return (
      <ShineBorder className="shine-demo">
        <div className="shine-inner">
          <span className="mini-spark">
            <Icon name="spark" size={24} />
          </span>
          <h3>Feito para se destacar.</h3>
          <p>
            Pequenos detalhes.
            <br />
            Grandes primeiras impressões.
          </p>
          <button
            type="button"
            onClick={() => notify("Shine Border aceita qualquer conteúdo interativo.")}
          >
            Explore as possibilidades ↗
          </button>
        </div>
      </ShineBorder>
    );
  if (id === "preferences")
    return (
      <div className="preferences-demo">
        <span className="overline">DO SEU JEITO</span>
        <h3>Um espaço mais seu.</h3>
        <div>
          <label htmlFor="notifications">
            <strong>Notificações</strong>
            <small>Fique por dentro das novidades.</small>
          </label>
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <div>
          <label htmlFor="newsletter">
            <strong>Newsletter</strong>
            <small>Uma dose mensal de inspiração.</small>
          </label>
          <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
        </div>
        <p aria-live="polite">
          {Number(notifications) + Number(newsletter)} de 2 preferências ativadas
        </p>
      </div>
    );
  if (id === "tabs")
    return (
      <Tabs defaultValue="design" className="tabs-demo">
        <TabsList>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
          <TabsTrigger value="ship">Entrega</TabsTrigger>
        </TabsList>
        <TabsContent value="design">
          <div className="swatches">
            <i />
            <i />
            <i />
            <i />
          </div>
          <h3>Crie com intenção.</h3>
          <p>
            Uma linguagem visual consistente,
            <br />
            do primeiro pixel ao último detalhe.
          </p>
        </TabsContent>
        <TabsContent value="code">
          <Icon name="code" size={38} />
          <h3>Seu código. Suas regras.</h3>
          <p>
            Componentes React que você pode
            <br />
            adaptar ao seu produto.
          </p>
        </TabsContent>
        <TabsContent value="ship">
          <Icon name="check" size={38} />
          <h3>Pronto para o próximo passo.</h3>
          <p>
            Teste as interações, ajuste os tokens
            <br />e construa a sua experiência.
          </p>
        </TabsContent>
      </Tabs>
    );
  if (id === "form")
    return (
      <>
        <form
          className="form-demo"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <span className="mini-spark">
            <Icon name="layers" />
          </span>
          <h3>Comece algo novo.</h3>
          <p>Experimente o formulário interativo.</p>
          <label htmlFor="demo-email">Seu e-mail</label>
          <Input
            id="demo-email"
            type="email"
            required
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit">
            Continuar <Icon name="arrow" size={15} />
          </Button>
        </form>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Tudo pronto!</DialogTitle>
            <DialogDescription>
              O e-mail {email} foi validado. Esta é uma demonstração local; nenhum dado foi enviado.
            </DialogDescription>
            <Button onClick={() => setOpen(false)}>Entendi</Button>
          </DialogContent>
        </Dialog>
      </>
    );
  if (id === "aurora")
    return (
      <AuroraBackground className="aurora-demo">
        <span className="overline">DEIXE A IDEIA FLUIR</span>
        <h3>
          Um pouco de
          <br />
          <em>atmosfera.</em>
        </h3>
        <p>O extraordinário começa no fundo.</p>
      </AuroraBackground>
    );
  if (id === "text")
    return (
      <div className="text-demo">
        <span className="text-pill">
          <Icon name="spark" size={13} /> Um detalhe faz toda a diferença
        </span>
        <h3>
          <AnimatedShinyText>Make it shine.</AnimatedShinyText>
        </h3>
        <p>Movimento sutil. Presença marcante.</p>
      </div>
    );
  return null;
}

function Example({
  item,
  children,
  onCode
}: {
  item: (typeof catalog)[number];
  children: ReactNode;
  onCode: () => void;
}) {
  return (
    <article className={`example ${item.id === "table" ? "example-wide" : ""}`} id={item.id}>
      <div className={`example-preview preview-${item.id}`}>{children}</div>
      <div className="example-info">
        <div>
          <h3>
            {item.title} <span>{item.tag}</span>
          </h3>
          <p>{item.description}</p>
        </div>
        <button
          className="code-button"
          type="button"
          onClick={onCode}
          aria-label={`Ver código de ${item.title}`}
        >
          <Icon name="code" size={17} />
        </button>
      </div>
    </article>
  );
}

export function HomeDemo() {
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [codeId, setCodeId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [guide, setGuide] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const { resolvedTheme, setTheme } = useTheme();
  const filtered = catalog.filter(
    (item) =>
      (category === "Todos" || item.category === category) &&
      `${item.title} ${item.description} ${item.category}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
  );
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Código copiado para a área de transferência.");
    } catch {
      setNotice("Não foi possível copiar. Selecione e copie o código exibido.");
    }
  }
  function choose(next: Category) {
    setCategory(next);
    setQuery("");
  }
  return (
    <div className="catalog-app">
      <a className="skip-link" href="#catalog">
        Pular para os componentes
      </a>
      <header className="topbar">
        <a href="#" className="brand" aria-label="Aura UI, início">
          <span className="brand-mark">a</span>aura<span className="brand-ui">ui</span>
          <span className="version">v0.2.1</span>
        </a>
        <nav aria-label="Navegação principal">
          <a className="active" href="#catalog" onClick={() => choose("Todos")}>
            Componentes
          </a>
          <a href="#catalog" onClick={() => choose("Efeitos")}>
            Efeitos
          </a>
          <a href="/demo/">Demo 3D</a>
          <button type="button" onClick={() => setGuide(true)}>
            Documentação
          </button>
        </nav>
        <div className="top-actions">
          <span>Feito para criar.</span>
          <button
            type="button"
            aria-label="Alternar tema"
            className="icon-button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Icon name="moon" />
          </button>
          <button type="button" className="start-button" onClick={() => setGuide(true)}>
            Começar <Icon name="arrow" size={15} />
          </button>
        </div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-label">WORKSPACE</div>
          <a
            href="#catalog"
            className={category === "Todos" ? "sidebar-link selected" : "sidebar-link"}
            onClick={() => choose("Todos")}
          >
            <Icon name="grid" /> Visão geral <span>9</span>
          </a>
          <button className="sidebar-link" onClick={() => setGuide(true)}>
            <Icon name="book" /> Introdução
          </button>
          <div className="sidebar-label section-label">BIBLIOTECA</div>
          {categories.slice(1).map((name, index) => (
            <a
              key={name}
              href="#catalog"
              onClick={() => choose(name)}
              className={`sidebar-link ${category === name ? "selected" : ""}`}
            >
              <Icon name={["spark", "layers", "sliders", "table"][index] ?? "grid"} />
              {name}
              <span>{catalog.filter((item) => item.category === name).length}</span>
            </a>
          ))}
          <div className="sidebar-label section-label">EXPLORAR</div>
          {catalog
            .filter((item) => item.category === category || category === "Todos")
            .map((item) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                className="component-link"
                onClick={() => setQuery("")}
              >
                {item.title}
                {item.id === "table" && <span className="new-dot" />}
              </a>
            ))}
          <div className="sidebar-bottom">
            <span className="tiny-orb" />
            <strong>
              Um toque de magia.
              <br />
              Todo o controle.
            </strong>
            <p>React · TypeScript · Tailwind</p>
            <button onClick={() => setGuide(true)}>
              Conheça o Aura <span>↗</span>
            </button>
          </div>
        </aside>
        <main className="main-content">
          <div className="breadcrumb">
            Biblioteca <span>/</span> <strong>Visão geral</strong>
          </div>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">
                <span /> SUA PRÓXIMA IDEIA COMEÇA AQUI
              </span>
              <h1>
                Interfaces que você
                <br />
                sente. <span>Não só vê.</span>
              </h1>
              <p>
                Componentes modernos, efeitos de outro nível e funcionalidades
                <br className="desktop-break" /> de verdade. Combine, personalize e faça do seu
                jeito.
              </p>
              <div className="hero-actions">
                <a href="#catalog" className="start-button" onClick={() => choose("Todos")}>
                  Explorar componentes <Icon name="arrow" size={16} />
                </a>
                <button type="button" className="hero-code" onClick={() => setGuide(true)}>
                  <Icon name="code" size={16} /> Guia de instalação
                </button>
              </div>
              <div className="hero-benefits">
                <span>
                  <Icon name="check" size={13} /> Código aberto
                </span>
                <span>
                  <Icon name="check" size={13} /> Seu código, seu controle
                </span>
                <span>
                  <Icon name="check" size={13} /> Light & dark
                </span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-grid" />
              <div className="floating-tag tag-top">
                <span /> built with aura
              </div>
              <div className="hero-object">
                <div className="object-layer layer-back" />
                <div className="object-layer layer-mid" />
                <div className="object-layer layer-front">
                  <Icon name="spark" size={66} />
                </div>
              </div>
              <div className="floating-tag tag-bottom">
                <Icon name="layers" size={15} /> Um novo nível de interface <span>↗</span>
              </div>
              <span className="art-coordinate">INTERFACE / REIMAGINED</span>
            </div>
          </section>
          <div className="principles">
            <span>Inspirado no que move a web.</span>
            <strong>
              Magic UI <span>↗</span>
            </strong>
            <i>+</i>
            <strong>
              Aceternity <span>↗</span>
            </strong>
            <i>+</i>
            <strong>
              shadcn/ui <span>↗</span>
            </strong>
            <span className="principles-end">A essência é sua.</span>
          </div>
          <section className="catalog-section" id="catalog">
            <div className="catalog-heading">
              <div>
                <span className="overline">MENOS REPETIÇÃO. MAIS CRIAÇÃO.</span>
                <h2>
                  Encontre seu próximo componente<span>.</span>
                </h2>
                <p>Explore as prévias. Teste cada detalhe. Leve para o seu projeto.</p>
              </div>
              <span className="component-count">{catalog.length} demonstrações</span>
            </div>
            <div className="catalog-toolbar">
              <div className="category-tabs" aria-label="Categorias">
                {categories.map((name) => (
                  <button
                    type="button"
                    key={name}
                    aria-pressed={category === name}
                    className={category === name ? "current" : ""}
                    onClick={() => choose(name)}
                  >
                    {name}
                    {name === "Dados" && <span className="new-dot" />}
                  </button>
                ))}
              </div>
              <label className="catalog-search">
                <Icon name="search" size={16} />
                <input
                  aria-label="Buscar componentes"
                  placeholder="Buscar componentes…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
            </div>
            <div className="example-grid">
              {filtered.map((item) => (
                <Example key={item.id} item={item} onCode={() => setCodeId(item.id)}>
                  {item.id === "table" ? (
                    <div className="table-demo">
                      <div className="table-demo-heading">
                        <div>
                          <span className="overline">SEU WORKSPACE, ORGANIZADO</span>
                          <h3>
                            Clientes <span>{customers.length}</span>
                          </h3>
                          <p>Dados de demonstração para explorar todas as interações.</p>
                        </div>
                        <label>
                          Status{" "}
                          <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            aria-label="Filtrar por status"
                          >
                            {["Todos", "Ativo", "Pendente", "Inativo"].map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <DataTable
                        key={statusFilter}
                        data={customers.filter(
                          (row) => statusFilter === "Todos" || row.status === statusFilter
                        )}
                        columns={columns}
                        getRowId={(row) => row.id}
                        caption="Clientes de demonstração"
                      />
                    </div>
                  ) : (
                    <Preview id={item.id} notify={setNotice} />
                  )}
                </Example>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="empty-state">
                <Icon name="search" size={28} />
                <h3>Nenhum componente encontrado</h3>
                <p>Experimente outro termo ou explore todas as categorias.</p>
                <Button variant="outline" onClick={() => choose("Todos")}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </section>
          <footer className="catalog-footer">
            <span>
              <strong>aura ui</strong> · Pequenos detalhes. Grandes experiências.
            </span>
            <span>Construído para você construir. ↗</span>
          </footer>
        </main>
      </div>
      <Dialog
        open={codeId !== null}
        onOpenChange={(open) => {
          if (!open) setCodeId(null);
        }}
      >
        <DialogContent className="code-dialog">
          <DialogTitle>{catalog.find((item) => item.id === codeId)?.title}</DialogTitle>
          <DialogDescription>
            Exemplo de composição. Personalize conteúdo, estilos e eventos no seu projeto.
          </DialogDescription>
          <pre className="source-code">
            <code>{codeId ? snippets[codeId] : ""}</code>
          </pre>
          <Button onClick={() => codeId && copy(snippets[codeId] ?? "")}>Copiar exemplo</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent className="code-dialog">
          <DialogTitle>Comece com Aura UI</DialogTitle>
          <DialogDescription>
            A biblioteca está neste monorepo. Execute na raiz do projeto para preparar os pacotes e
            abrir o catálogo.
          </DialogDescription>
          <pre className="source-code">
            <code>{"pnpm install\npnpm build\npnpm --filter @aura/docs dev"}</code>
          </pre>
          <p className="text-sm text-aura-muted-foreground">
            Nos apps deste workspace, importe componentes de <code>aura-ui-components</code> e
            efeitos de <code>aura-ui-effects</code>. O tema usa <code>ThemeProvider</code> de{" "}
            <code>aura-ui-core/client</code> e os estilos de <code>aura-ui-tailwind</code>.
          </p>
          <Button onClick={() => copy("pnpm install\npnpm build\npnpm --filter @aura/docs dev")}>
            Copiar comandos
          </Button>
        </DialogContent>
      </Dialog>
      {notice && (
        <div className="notice" role="status">
          <Icon name="check" size={18} />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Fechar notificação">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
