import { defineConfig } from "tsup";

/** Bundle só para o .mcpb: o build do npm continua com dependências externas. */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  splitting: false,
  noExternal: ["@modelcontextprotocol/sdk", "zod"]
});
