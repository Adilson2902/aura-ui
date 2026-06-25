import path from "node:path";
import fs from "fs-extra";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadRegistry, resolveRegistryItem, copyRegistryFiles } from "../lib/registry.js";

type AddOptions = { all?: boolean };

export async function addCommand(components: string[], options: AddOptions) {
  const cwd = process.cwd();
  p.intro(pc.bgCyan(pc.black(" aura add ")));

  const configPath = path.join(cwd, "aura.config.json");
  if (!(await fs.pathExists(configPath))) {
    p.log.error("Execute aura init primeiro.");
    process.exit(1);
  }

  const config = await fs.readJson(configPath);
  const registry = await loadRegistry();
  const names =
    options.all ? registry.items.map((i) => i.name) : components.length ? components : [];

  if (!names.length) {
    p.log.error("Informe componentes: aura add button card");
    process.exit(1);
  }

  const resolved = new Set<string>();
  for (const name of names) {
    await resolveRegistryItem(registry, name, resolved);
  }

  const spinner = p.spinner();
  spinner.start("Copiando arquivos do registry...");

  for (const name of resolved) {
    const item = registry.items.find((i) => i.name === name);
    if (!item) continue;
    await copyRegistryFiles(item, config, cwd);
  }

  spinner.stop(pc.green(`${resolved.size} item(ns) adicionado(s).`));
  p.outro("Componentes copiados para o seu projeto (ownership total).");
}
