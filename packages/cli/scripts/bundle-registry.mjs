/**
 * Copia o registry do monorepo (`/registry`) para dentro do pacote do CLI,
 * para que `aura add` funcione quando instalado pelo npm (o pacote publicado
 * não enxerga a raiz do monorepo). Roda no fim do `build`.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(pkgDir, "../../registry");
const target = path.join(pkgDir, "registry");

if (!existsSync(path.join(source, "index.json"))) {
  console.error(`registry não encontrado em ${source}`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, {
  recursive: true,
  filter: (src) => !src.endsWith("schema.json")
});
console.log(`registry copiado para ${path.relative(process.cwd(), target) || target}`);
