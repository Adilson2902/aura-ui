/**
 * Sincroniza o registry do CLI (`aura add`) com o código-fonte dos pacotes.
 *
 * - Copia packages/ui/src/*.tsx -> registry/ui/ e packages/effects/src/*.tsx -> registry/effects/
 *   (arquivo completo: o CLI copia p/ o projeto do usuário, então re-exports
 *   relativos ao monorepo não funcionam lá).
 * - Regenera registry/index.json: `dependencies` (npm) e `registryDependencies`
 *   (imports "./x") são lidos dos imports reais de cada arquivo.
 * - Mantém a ordem dos itens existentes e itens só-registry (utils, themes-css).
 *
 * Uso: node scripts/sync-registry.cjs [--check]
 *   --check  não escreve nada; sai com código 1 se o registry estiver desatualizado.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const check = process.argv.includes("--check");

const SOURCES = [
  { dir: "packages/ui/src", out: "registry/ui", type: "registry:ui" },
  { dir: "packages/effects/src", out: "registry/effects", type: "registry:ui" }
];

/** Pacotes que o usuário já tem (peer) ou que vêm do `aura init`. */
const IMPLICIT = new Set(["react", "react-dom", "aura-ui-core"]);

const indexPath = path.join(root, "registry/index.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const byName = new Map(index.items.map((item) => [item.name, item]));

function packageName(spec) {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0];
}

function readImports(code) {
  const specs = [];
  const re = /(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(code))) specs.push(m[1]);
  return specs;
}

let stale = 0;
const seen = new Set();

for (const { dir, out, type } of SOURCES) {
  const srcDir = path.join(root, dir);
  const outDir = path.join(root, out);
  if (!check) fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith(".tsx"))
    .sort();
  const local = new Set(files.map((f) => f.replace(/\.tsx$/, "")));

  for (const file of files) {
    const name = file.replace(/\.tsx$/, "");
    const code = fs.readFileSync(path.join(srcDir, file), "utf8").replace(/\r\n/g, "\n");
    const target = path.join(outDir, file);
    const current = fs.existsSync(target)
      ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n")
      : null;
    if (current !== code) {
      stale++;
      if (check) console.log(`desatualizado: ${out}/${file}`);
      else fs.writeFileSync(target, code, "utf8");
    }

    const deps = new Set();
    const regDeps = new Set(["utils"]);
    for (const spec of readImports(code)) {
      if (spec.startsWith("./")) {
        const dep = spec.slice(2).replace(/\.(tsx?|js)$/, "");
        if (local.has(dep)) regDeps.add(dep);
      } else if (!spec.startsWith(".")) {
        const pkg = packageName(spec);
        if (!IMPLICIT.has(pkg)) deps.add(pkg);
      }
    }

    const item = {
      name,
      type,
      files: [{ path: `${out}/${file}`, type }],
      ...(deps.size ? { dependencies: [...deps].sort() } : {}),
      registryDependencies: [...regDeps]
    };
    if (seen.has(name)) throw new Error(`nome duplicado no registry: ${name}`);
    seen.add(name);
    const prev = byName.get(name);
    if (JSON.stringify(prev) !== JSON.stringify(item)) {
      if (check) console.log(`index.json desatualizado: ${name}`);
      stale++;
    }
    byName.set(name, item);
  }
}

// Itens que existiam só no index (ex.: utils, themes-css) são preservados.
const ordered = [
  ...index.items.map((item) => byName.get(item.name)),
  ...[...byName.values()].filter((item) => !index.items.some((i) => i.name === item.name))
];

if (check) {
  if (stale) {
    console.error(`\nRegistry desatualizado (${stale}). Rode: pnpm registry:sync`);
    process.exit(1);
  }
  console.log("Registry em dia.");
} else {
  fs.writeFileSync(indexPath, JSON.stringify({ ...index, items: ordered }, null, 2) + "\n");
  console.log(`Registry sincronizado: ${ordered.length} itens (${stale} alterações).`);
}
