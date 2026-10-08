const fs = require("fs");
const p = "registry/index.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));
const existing = new Set(j.items.map((i) => i.name));
for (const name of ["charts", "theme-switcher"]) {
  if (existing.has(name)) continue;
  j.items.push({
    name,
    type: "registry:ui",
    files: [{ path: "registry/ui/" + name + ".tsx", type: "registry:ui" }],
    registryDependencies: ["utils"]
  });
}
if (!existing.has("themes-css")) {
  j.items.push({
    name: "themes-css",
    type: "registry:lib",
    files: [{ path: "registry/lib/themes.css", type: "registry:lib" }]
  });
}
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
console.log("items", j.items.length);
