const fs = require("fs");
const path = require("path");

const map = {
  "@adilsonmatos/core/client": "aura-ui-core/client",
  "@adilsonmatos/core": "aura-ui-core",
  "@adilsonmatos/ui": "aura-ui-components",
  "@adilsonmatos/effects": "aura-ui-effects",
  "@adilsonmatos/three": "aura-ui-three",
  "@adilsonmatos/tailwind-preset": "aura-ui-tailwind",
  "@adilsonmatos/cli": "aura-ui-cli"
};

function walk(dir, fn) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".next", ".git", "storybook-static", ".turbo"].includes(e.name))
      continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, fn);
    else if (/\.(ts|tsx|js|jsx|json|css|md)$/.test(e.name)) fn(f);
  }
}

walk(".", (file) => {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [from, to] of Object.entries(map)) s = s.split(from).join(to);
  s = s.split("@aura-ui/").join("aura-ui-");
  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log("patched", file);
  }
});

for (const [p, name] of [
  ["packages/core/package.json", "aura-ui-core"],
  ["packages/ui/package.json", "aura-ui-components"],
  ["packages/effects/package.json", "aura-ui-effects"],
  ["packages/three/package.json", "aura-ui-three"],
  ["packages/tailwind-preset/package.json", "aura-ui-tailwind"],
  ["packages/cli/package.json", "aura-ui-cli"]
]) {
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.name = name;
  j.publishConfig = { access: "public" };
  const fix = (o) => {
    if (!o) return;
    for (const k of Object.keys(o)) {
      if (k.startsWith("@adilsonmatos/") || k.startsWith("@aura-ui/")) {
        const nk = map[k] || k.replace(/^@[^/]+\//, "aura-ui-");
        o[nk] = o[k];
        delete o[k];
      }
    }
  };
  fix(j.dependencies);
  fix(j.peerDependencies);
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("pkg", name);
}

const root = JSON.parse(fs.readFileSync("package.json", "utf8"));
root.scripts["build:all"] =
  "pnpm --filter aura-ui-core build && pnpm --filter aura-ui-components build && pnpm --filter aura-ui-effects build && pnpm --filter aura-ui-tailwind build && pnpm --filter aura-ui-three build && pnpm --filter aura-ui-cli build";
fs.writeFileSync("package.json", JSON.stringify(root, null, 2) + "\n");
console.log("done");
