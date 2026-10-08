const fs = require("fs");

const map = {
  "@adilsonmatos/core": "aura-ui-core",
  "@adilsonmatos/ui": "aura-ui-components",
  "@adilsonmatos/effects": "aura-ui-effects",
  "@adilsonmatos/three": "aura-ui-three",
  "@adilsonmatos/tailwind-preset": "aura-ui-tailwind",
  "@adilsonmatos/cli": "aura-ui-cli",
  "@adilsonmatos/core/client": "aura-ui-core/client"
};

function patchFile(file) {
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  for (const [from, to] of Object.entries(map)) {
    s = s.split(from).join(to);
  }
  // also leftover aura-ui scoped
  s = s.split("@aura-ui/").join("aura-ui-");
  if (s !== before) {
    fs.writeFileSync(file, s);
    console.log("patched", file);
  }
}

const { execSync } = require("child_process");
const files = execSync(
  'rg -l "@adilsonmatos/|@aura-ui/" --glob "!node_modules" --glob "!dist" --glob "!*.lock"',
  { encoding: "utf8" }
)
  .split("\n")
  .map((x) => x.trim())
  .filter(Boolean);

for (const f of files) patchFile(f);

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
  // workspace deps should use workspace:* still — rewrite names
  const fix = (obj) => {
    if (!obj) return;
    for (const k of Object.keys(obj)) {
      if (k.startsWith("@adilsonmatos/") || k.startsWith("@aura-ui/")) {
        const nk = map[k] || k.replace(/^@[^/]+\//, "aura-ui-");
        obj[nk] = obj[k];
        delete obj[k];
      }
    }
  };
  fix(j.dependencies);
  fix(j.peerDependencies);
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("pkg", name);
}

const root = JSON.parse(fs.readFileSync("package.json", "utf8"));
for (const k of Object.keys(root.scripts || {})) {
  root.scripts[k] = (root.scripts[k] || "")
    .split("@adilsonmatos/").join("aura-ui-")
    .split("@aura-ui/").join("aura-ui-");
}
// fix script names for pnpm filter
root.scripts["build:all"] =
  "pnpm --filter aura-ui-core build && pnpm --filter aura-ui-components build && pnpm --filter aura-ui-effects build && pnpm --filter aura-ui-tailwind build && pnpm --filter aura-ui-three build && pnpm --filter aura-ui-cli build";
root.scripts.storybook = "pnpm --filter @aura-ui/storybook dev";
fs.writeFileSync("package.json", JSON.stringify(root, null, 2) + "\n");
console.log("done");
