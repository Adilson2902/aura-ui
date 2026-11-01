const fs = require("node:fs");
const path = require("node:path");

const dir = path.join(__dirname, "../apps/docs/.next/types");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, "routes.d.ts");
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "export {};\n");
}
