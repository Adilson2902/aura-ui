import { beforeAll, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { findComponent, loadCatalog, searchComponents } from "./catalog.js";
import { createServer } from "./server.js";

const catalog = loadCatalog();
let client: Client;

const call = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await client.callTool({ name, arguments: args });
  const content = res.content as { type: string; text: string }[];
  return { text: content.map((c) => c.text).join("\n"), isError: Boolean(res.isError) };
};

beforeAll(async () => {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await createServer(catalog).connect(serverSide);
  client = new Client({ name: "teste", version: "0.0.0" });
  await client.connect(clientSide);
});

describe("catálogo", () => {
  it("tem os componentes, temas e tokens do repositório", () => {
    expect(catalog.components.length).toBeGreaterThanOrEqual(98);
    expect(catalog.themes).toHaveLength(33);
    expect(catalog.themes.filter((t) => t.dark).length).toBeGreaterThan(0);
    expect(catalog.tokens.some((t) => t.name === "--aura-primary")).toBe(true);
    expect(catalog.classes).toContain("aura-glass");
  });

  it("todo componente de UI tem categoria conhecida, resumo e código", () => {
    for (const c of catalog.components.filter((x) => x.kind !== "lib")) {
      expect(c.category, c.name).not.toBe("outros");
      expect(c.summary.length, c.name).toBeGreaterThan(10);
      expect(c.files[0]?.content.length, c.name).toBeGreaterThan(50);
    }
  });

  it("acha por nome do registry ou por export", () => {
    expect(findComponent(catalog, "date-picker")?.name).toBe("date-picker");
    expect(findComponent(catalog, "DatePicker")?.name).toBe("date-picker");
    expect(findComponent(catalog, "AlertDialogAction")?.name).toBe("alert-dialog");
    expect(findComponent(catalog, "nao-existe")).toBeUndefined();
  });

  it("busca ranqueia pelo que importa", () => {
    expect(searchComponents(catalog, "combobox")[0]?.name).toBe("combobox");
    expect(searchComponents(catalog, "upload").map((c) => c.name)).toContain("file-upload");
    expect(
      searchComponents(catalog, "", "dates")
        .map((c) => c.name)
        .sort()
    ).toEqual(["calendar", "date-picker"]);
  });
});

describe("servidor MCP", () => {
  it("expõe as 5 ferramentas, todas somente leitura", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(
      ["get_component", "get_design_tokens", "get_setup", "list_components", "list_themes"].sort()
    );
    for (const t of tools) expect(t.annotations?.readOnlyHint, t.name).toBe(true);
  });

  it("envia instruções de uso ao cliente", () => {
    expect(client.getInstructions()).toContain("get_setup");
  });

  it("list_components agrupa por categoria e busca", async () => {
    const all = await call("list_components");
    expect(all.text).toContain("## Formulários");
    expect(all.text).toContain("**button**");
    const found = await call("list_components", { query: "modal confirmação" });
    expect(found.text).toContain("alert-dialog");
  });

  it("get_component traz import, CLI, exports e código", async () => {
    const { text, isError } = await call("get_component", { name: "Button" });
    expect(isError).toBe(false);
    expect(text).toContain('from "aura-ui-components/button"');
    expect(text).toContain("npx aura-ui-cli add button");
    expect(text).toContain("buttonVariants");
    expect(text).toContain("```tsx");
  });

  it("get_component com dependências inclui o código delas", async () => {
    const { text } = await call("get_component", { name: "combobox", include_dependencies: true });
    for (const dep of ["# combobox", "# popover", "# command", "# dialog"])
      expect(text).toContain(dep);
  });

  it("get_component sem código fica enxuto", async () => {
    const { text } = await call("get_component", { name: "calendar", include_source: false });
    expect(text).not.toContain("```tsx");
  });

  it("get_component sugere nomes parecidos quando erra", async () => {
    const { text, isError } = await call("get_component", { name: "buton" });
    expect(isError).toBe(true);
    expect(text).toContain("button");
  });

  it("get_setup cobre pacote e CLI", async () => {
    const pkg = await call("get_setup", { mode: "package", framework: "vite" });
    expect(pkg.text).toContain('@import "aura-ui-components/tailwind.css"');
    expect(pkg.text).toContain("@tailwindcss/vite");
    const cli = await call("get_setup", { mode: "cli" });
    expect(cli.text).toContain("npx aura-ui-cli init");
  });

  it("list_themes e get_design_tokens", async () => {
    const themes = await call("list_themes");
    expect(themes.text).toContain("`midnight`");
    const tokens = await call("get_design_tokens", { group: "color" });
    expect(tokens.text).toContain("--aura-primary");
    expect(tokens.text).toContain("bg-/text-/border-/ring-aura-primary");
  });
});
