import fs from "fs-extra";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

export async function themeCommand() {
  const cwd = process.cwd();
  p.intro(pc.bgCyan(pc.black(" aura theme ")));

  const primary = await p.text({
    message: "Cor primária (HSL sem hsl(), ex: 222 89% 56%)",
    initialValue: "222 89% 56%"
  });
  if (p.isCancel(primary)) process.exit(0);

  const radius = await p.text({
    message: "Border radius (ex: 0.75rem)",
    initialValue: "0.75rem"
  });
  if (p.isCancel(radius)) process.exit(0);

  const out = path.join(cwd, "src/styles/aura-theme.css");
  await fs.ensureDir(path.dirname(out));
  await fs.writeFile(
    out,
    `:root {
  --aura-primary: ${primary};
  --aura-radius: ${radius};
}
`,
    "utf8"
  );

  p.log.success(`Tema salvo em ${pc.dim("src/styles/aura-theme.css")}`);
  p.outro(pc.green("Importe após os tokens base."));
}
