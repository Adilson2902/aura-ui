#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadCatalog } from "./catalog.js";
import { createServer } from "./server.js";

const server = createServer(loadCatalog());
await server.connect(new StdioServerTransport());
// stdout é o canal do protocolo — logs só no stderr
console.error(`aura-ui-mcp pronto (stdio)`);
