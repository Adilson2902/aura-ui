import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import pc from "picocolors";

const DEFAULT_CONFIG = {
  style: "default",
  rsc: true,
  tsx: true,
  tailwind: {
    config: "",
    css: "src/app/globals.css",
    baseColor: "slate",
    cssVariables: true,
    prefix: ""
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    effects: "@/components/effects",
    lib: "@/lib"
  }
};

/** O preset já traz Tailwind + tokens + primitivas 3D + temas do aura-ui-core. */
const TOKENS_SNIPPET = `@import "aura-ui-tailwind";
`;

export async function initCommand() {
  const cwd = process.cwd();
  p.intro(pc.bgCyan(pc.black(" aura init ")));

  const configPath = path.join(cwd, "aura.config.json");
  if (await fs.pathExists(configPath)) {
    p.log.warn("aura.config.json já existe — pulando criação.");
  } else {
    await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
    p.log.success("Criado aura.config.json");
  }

  const cssPath = path.join(cwd, "src/styles/aura-tokens.css");
  await fs.ensureDir(path.dirname(cssPath));
  if (!(await fs.pathExists(cssPath))) {
    await fs.writeFile(cssPath, TOKENS_SNIPPET, "utf8");
    p.log.success(`Tokens em ${pc.dim("src/styles/aura-tokens.css")}`);
  }

  p.note(
    [
      "pnpm add aura-ui-core aura-ui-tailwind class-variance-authority",
      'No globals.css, troque @import "tailwindcss" por @import "./styles/aura-tokens.css"',
      "npx aura-ui-cli add button card card-3d"
    ].join("\n"),
    "Próximos passos"
  );

  p.outro(pc.green("Aura UI inicializado."));
}
