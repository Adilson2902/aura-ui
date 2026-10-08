const fs = require("fs");
const path = require("path");

const from = "@aura-ui/";
const to = "@adilsonmatos/";

function walk(dir, fn) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".next", ".git", "storybook-static", ".turbo"].includes(entry.name))
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fn);
    else if (/\.(ts|tsx|js|jsx|css|json|md)$/.test(entry.name)) fn(full);
  }
}

walk(".", (file) => {
  const s = fs.readFileSync(file, "utf8");
  if (!s.includes(from)) return;
  fs.writeFileSync(file, s.split(from).join(to));
  console.log("renamed", file);
});

// garante nomes
for (const [p, name] of [
  ["packages/core/package.json", "@adilsonmatos/core"],
  ["packages/ui/package.json", "@adilsonmatos/ui"],
  ["packages/effects/package.json", "@adilsonmatos/effects"],
  ["packages/three/package.json", "@adilsonmatos/three"],
  ["packages/tailwind-preset/package.json", "@adilsonmatos/tailwind-preset"],
  ["packages/cli/package.json", "@adilsonmatos/cli"]
]) {
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.name = name;
  j.publishConfig = { access: "public" };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("pkg", name);
}
console.log("done");
