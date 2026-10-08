const fs = require("fs");

function patch(file, fn) {
  const s = fs.readFileSync(file, "utf8");
  const out = fn(s);
  if (out !== s) {
    fs.writeFileSync(file, out);
    console.log("patched", file);
  }
}

patch("apps/storybook/package.json", (s) => s.replace(/@aura\//g, "@aura-ui/"));
patch("apps/docs/package.json", (s) => s.replace("@aura/docs", "@aura-ui/docs"));
patch("examples/landing/package.json", (s) =>
  s.replace("@aura/example-landing", "@aura-ui/example-landing").replace(/@aura\//g, "@aura-ui/")
);

// garante bin do cli
const cli = JSON.parse(fs.readFileSync("packages/cli/package.json", "utf8"));
cli.name = "@aura-ui/cli";
cli.bin = { "aura-ui": "./dist/index.js", aura: "./dist/index.js" };
if (!cli.publishConfig) cli.publishConfig = { access: "public" };
fs.writeFileSync("packages/cli/package.json", JSON.stringify(cli, null, 2) + "\n");

// workspace name fields
for (const [p, name] of [
  ["packages/core/package.json", "@aura-ui/core"],
  ["packages/ui/package.json", "@aura-ui/ui"],
  ["packages/effects/package.json", "@aura-ui/effects"],
  ["packages/three/package.json", "@aura-ui/three"],
  ["packages/tailwind-preset/package.json", "@aura-ui/tailwind-preset"]
]) {
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.name = name;
  j.publishConfig = { access: "public" };
  // workspace deps
  const fix = (obj) => {
    if (!obj) return;
    for (const k of Object.keys(obj)) {
      if (k.startsWith("@aura/") && !k.startsWith("@aura-ui/")) {
        obj[k.replace("@aura/", "@aura-ui/")] = obj[k];
        delete obj[k];
      }
    }
  };
  fix(j.dependencies);
  fix(j.peerDependencies);
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log("pkg", name);
}

console.log("ok");
