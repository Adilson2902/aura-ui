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
  aliases: { ui: string; effects: string; utils: string };
};

export async function copyRegistryFiles(item: RegistryItem, config: AuraConfig, cwd: string) {
  const root = monorepoRoot();

  for (const file of item.files) {
    const src = path.join(root, file.path);
    const isEffect = file.path.includes("/effects/");
    const alias = isEffect ? config.aliases.effects : config.aliases.ui;
    const destDir = path.join(cwd, alias.replace("@/", "src/"));
    await fs.ensureDir(destDir);
    const dest = path.join(destDir, path.basename(file.path));

    let content = await fs.readFile(src, "utf8");
    content = content.replace(/@aura\/core/g, "@/lib/utils");
    await fs.writeFile(dest, content, "utf8");
  }
}
