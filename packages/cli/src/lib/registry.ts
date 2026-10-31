import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";

export type RegistryFile = {
  path: string;
  type: string;
};

export type RegistryItem = {
  name: string;
  type: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
};

export type Registry = {
  name: string;
  items: RegistryItem[];
};

function monorepoRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../../../..");
}

export async function loadRegistry(): Promise<Registry> {
  const root = monorepoRoot();
  return fs.readJson(path.join(root, "registry/index.json"));
}

export async function resolveRegistryItem(registry: Registry, name: string, resolved: Set<string>) {
  if (resolved.has(name)) return;
  const item = registry.items.find((i) => i.name === name);
  if (!item) throw new Error(`Registry item not found: ${name}`);

  for (const dep of item.registryDependencies ?? []) {
    await resolveRegistryItem(registry, dep, resolved);
  }
  resolved.add(name);
}

type AuraConfig = {
  aliases: { ui: string; effects: string; utils: string; lib?: string };
};

/** Pacotes npm exigidos pelos itens resolvidos (para o `pnpm add` sugerido). */
export function collectDependencies(registry: Registry, names: Iterable<string>) {
  const deps = new Set<string>();
  for (const name of names) {
    const item = registry.items.find((i) => i.name === name);
    for (const dep of item?.dependencies ?? []) deps.add(dep);
  }
  return [...deps].sort();
}

export async function copyRegistryFiles(item: RegistryItem, config: AuraConfig, cwd: string) {
  const root = monorepoRoot();

  for (const file of item.files) {
    const src = path.join(root, file.path);
    const isEffect = file.path.includes("/effects/");
    const isLib = file.type === "registry:lib";
    const alias = isLib
      ? (config.aliases.lib ?? "@/lib")
      : isEffect
        ? config.aliases.effects
        : config.aliases.ui;
    const destDir = path.join(cwd, alias.replace("@/", "src/"));
    await fs.ensureDir(destDir);
    const dest = path.join(destDir, path.basename(file.path));

    let content = await fs.readFile(src, "utf8");
    content = content.replace(/@aura\/core/g, "@/lib/utils");
    await fs.writeFile(dest, content, "utf8");
  }
}
