import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import pc from "picocolors";

const DEFAULT_CONFIG = {
  $schema: "https://aura-ui.dev/schema.json",
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

const TOKENS_SNIPPET = `@import "@aura/core/styles/tokens.css";
@import "@aura/core/styles/primitives.css";
@import "@aura/tailwind-preset";
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
      "pnpm add @aura/core @aura/tailwind-preset class-variance-authority tailwind-merge clsx",
      'Importe aura-tokens.css no seu globals.css',
      "npx aura add button card card-3d"
    ].join("\n"),
    "Próximos passos"
  );

  p.outro(pc.green("Aura UI inicializado."));
}
