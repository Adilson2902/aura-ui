/**
 * Publica os pacotes @aura-ui na ordem de dependência.
 * Pré-requisito: npm login e org/usuário dono do escopo @aura-ui.
 */
const { execSync } = require("child_process");

const order = [
  ["packages/core", "@aura-ui/core"],
  ["packages/tailwind-preset", "@aura-ui/tailwind-preset"],
  ["packages/ui", "@aura-ui/ui"],
  ["packages/effects", "@aura-ui/effects"],
  ["packages/three", "@aura-ui/three"],
  ["packages/cli", "@aura-ui/cli"]
];

function run(cmd, cwd) {
  console.log("\n$ " + cmd + (cwd ? "  (in " + cwd + ")" : ""));
  execSync(cmd, { stdio: "inherit", cwd });
}

try {
  const user = execSync("npm whoami", { encoding: "utf8" }).trim();
  console.log("Logged in as:", user);
} catch {
  console.error("Você não está logado. Rode: npm login");
  process.exit(1);
}

console.log(
  "\nIMPORTANTE: o escopo @aura-ui deve ser seu (org 'aura-ui' no npm ou publish sob @seuusuario).\n"
);

for (const [dir, name] of order) {
  console.log("\n=== publish " + name + " ===");
  run("npm publish --access public", dir);
}

console.log("\n✅ Todos os pacotes enviados. Confira em https://www.npmjs.com/");
