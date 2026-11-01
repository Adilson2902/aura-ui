import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stage = path.resolve(pkgRoot, "../../tmp/mcpb-stage");
const output = path.join(pkgRoot, "aura-ui-mcp.mcpb");

function run(args) {
  const result = spawnSync("pnpm", args, { cwd: pkgRoot, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

rmSync(stage, { recursive: true, force: true });
mkdirSync(path.join(stage, "dist"), { recursive: true });

run(["build"]);
run([
  "exec",
  "tsup",
  "--config",
  "tsup.bundle.config.ts",
  "--out-dir",
  path.join(stage, "dist"),
  "--no-clean"
]);

cpSync(path.join(pkgRoot, "data"), path.join(stage, "data"), { recursive: true });
cpSync(path.join(pkgRoot, "manifest.json"), path.join(stage, "manifest.json"));

const pkg = JSON.parse(readFileSync(path.join(pkgRoot, "package.json"), "utf8"));
writeFileSync(
  path.join(stage, "package.json"),
  `${JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      license: "MIT",
      private: true,
      type: "module"
    },
    null,
    2
  )}\n`
);

run(["exec", "mcpb", "validate", path.join(stage, "manifest.json")]);
run(["exec", "mcpb", "pack", stage, output]);
console.log(`Bundle gerado em ${output} (não publicado).`);
