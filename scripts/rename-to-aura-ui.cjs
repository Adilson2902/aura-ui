const fs = require("fs");
const path = require("path");

const root = process.cwd();

/** Renomeia packages para o escopo @aura-ui (o @aura e 'aura' estão ocupados). */
const renames = [
  ["@aura/core", "@aura-ui/core"],
  ["@aura/ui", "@aura-ui/ui"],
  ["@aura/effects", "@aura-ui/effects"],
  ["@aura/three", "@aura-ui/three"],
  ["@aura/tailwind-preset", "@aura-ui/tailwind-preset"],
  ["@aura/core/client", "@aura-ui/core/client"],
  ["\"aura\"", "\"@aura-ui/cli\""],
  ["\"name\": \"aura\"", "\"name\": \"@aura-ui/cli\""]
];

function rewrite(file, pairs) {
  if (!fs.existsSync(file)) return;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  for (const [from, to] of pairs) {
    src = src.split(from).join(to);
  }
  if (src !== before) {
    fs.writeFileSync(file, src);
    console.log("updated", path.relative(root, file));
  }
}

// package.json de todos os packages
const pkgPaths = [
  "packages/core/package.json",
  "packages/ui/package.json",
  "packages/effects/package.json",
  "packages/three/package.json",
  "packages/tailwind-preset/package.json",
  "packages/cli/package.json",
  "package.json",
  ".changeset/config.json",
  "apps/docs/package.json",
  "examples/landing/package.json"
];

const nameOnly = [
  ["\"@aura/core\"", "\"@aura-ui/core\""],
  ["\"@aura/ui\"", "\"@aura-ui/ui\""],
  ["\"@aura/effects\"", "\"@aura-ui/effects\""],
  ["\"@aura/three\"", "\"@aura-ui/three\""],
  ["\"@aura/tailwind-preset\"", "\"@aura-ui/tailwind-preset\""],
  ["\"aura\"", "\"@aura-ui/cli\""]
];

for (const p of pkgPaths) rewrite(p, nameOnly);

// imports em source/docs (opcional manter @aura como alias — preferimos consistência)
const globDirs = ["packages", "apps/docs/src", "registry"];
function walk(dir, fn) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".next") continue;
      walk(full, fn);
    } else if (/\.(ts|tsx|js|jsx|css|json|md)$/.test(entry.name)) {
      fn(full);
    }
  }
}

const importPairs = [
  ["@aura/core/client", "@aura-ui/core/client"],
  ["@aura/core", "@aura-ui/core"],
  ["@aura/ui/data-table", "@aura-ui/ui/data-table"],
  ["@aura/ui", "@aura-ui/ui"],
  ["@aura/effects", "@aura-ui/effects"],
  ["@aura/three", "@aura-ui/three"],
  ["@aura/tailwind-preset", "@aura-ui/tailwind-preset"]
];

for (const dir of globDirs) {
  walk(dir, (file) => rewrite(file, importPairs));
}

// CLI bin name
const cliPkg = "packages/cli/package.json";
if (fs.existsSync(cliPkg)) {
  const j = JSON.parse(fs.readFileSync(cliPkg, "utf8"));
  if (j.bin) {
    j.bin = { "aura-ui": "./dist/index.js", aura: "./dist/index.js" };
    j.name = "@aura-ui/cli";
    fs.writeFileSync(cliPkg, JSON.stringify(j, null, 2) + "\n");
    console.log("cli bin set");
  }
}

console.log("done");
