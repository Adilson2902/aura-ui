import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadRegistry } from "../lib/registry.js";

export async function diffCommand(component: string) {
  const cwd = process.cwd();
  const config = await fs.readJson(path.join(cwd, "aura.config.json"));
  const registry = await loadRegistry();
  const item = registry.items.find((i) => i.name === component);

  if (!item) {
    p.log.error(`Componente "${component}" não encontrado no registry.`);
    process.exit(1);
  }

  p.intro(pc.bgCyan(pc.black(` aura diff ${component} `)));
  p.note(
    "Comparação local vs upstream — Fase 4 implementará diff unificado (git-style).",
    "Em breve"
  );

  for (const file of item.files) {
    const dest = path.join(
      cwd,
      config.aliases.ui.replace("@/", "src/"),
      path.basename(file.path)
    );
    const exists = await fs.pathExists(dest);
    p.log.info(`${exists ? pc.yellow("local") : pc.red("ausente")} → ${dest}`);
  }

  p.outro("Use aura add para atualizar manualmente até o diff completo.");
}
