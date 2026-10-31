/**
 * Publica os pacotes aura-ui-* na ordem de dependência.
 * Pré-requisito: npm login (dono dos pacotes aura-ui-*).
 *
 * Usa `pnpm publish` (não `npm publish`): só o pnpm troca `workspace:*`
 * pela versão real no package.json publicado. Com `npm publish` o pacote
 * vai com `"aura-ui-core": "workspace:*"` e quebra a instalação do usuário.
 * Versões já existentes no npm são puladas.
 */
const { execSync } = require("child_process");

const order = [
  ["packages/core", "aura-ui-core"],
  ["packages/tailwind-preset", "aura-ui-tailwind"],
  ["packages/ui", "aura-ui-components"],
  ["packages/effects", "aura-ui-effects"],
  ["packages/three", "aura-ui-three"],
  ["packages/cli", "aura-ui-cli"],
  ["packages/mcp", "aura-ui-mcp"]
];

function run(cmd, cwd) {
  console.log("\n$ " + cmd + (cwd ? "  (in " + cwd + ")" : ""));
  execSync(cmd, { stdio: "inherit", cwd });
}

function published(name, version) {
  try {
    // stderr ignorado: versão inédita responde 404, que é o caso esperado aqui
    const out = execSync(`npm view ${name}@${version} version`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    return out.trim() === version;
  } catch {
    return false;
  }
}

try {
  const user = execSync("npm whoami", { encoding: "utf8" }).trim();
  console.log("Logged in as:", user);
} catch {
  console.error("Você não está logado. Rode: npm login");
  process.exit(1);
}

for (const [dir, name] of order) {
  const { version } = require(require("path").resolve(dir, "package.json"));
  if (published(name, version)) {
    console.log(`\n=== ${name}@${version} já está no npm — pulando ===`);
    continue;
  }
  console.log(`\n=== publish ${name}@${version} ===`);
  run("pnpm publish --access public", dir);
}

console.log("\n✅ Todos os pacotes enviados. Confira em https://www.npmjs.com/");
