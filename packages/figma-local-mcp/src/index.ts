#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Token priority: CLI flags -> Environment variables
// (nunca commite tokens aqui — use --token ou FIGMA_API_KEY)
const DEFAULT_TOKEN = "";

function getApiKey(): string {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--token" || args[i] === "--figma-api-key" || args[i] === "--key") {
      return args[i + 1] || DEFAULT_TOKEN;
    }
  }
  return (
    process.env.FIGMA_API_KEY ||
    process.env.FIGMA_ACCESS_TOKEN ||
    process.env.FIGMA_TOKEN ||
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN ||
    DEFAULT_TOKEN
  );
}

const FIGMA_API_KEY = getApiKey();
const FIGMA_API_BASE = "https://api.figma.com/v1";

/**
 * Parses Figma URL or returns key as-is.
 * Supports URLs like:
 * - https://www.figma.com/design/:fileKey/:fileName?node-id=:nodeId
 * - https://www.figma.com/file/:fileKey/...
 */
export function parseFigmaUrl(urlOrKey: string): { fileKey: string; nodeId?: string } {
  const trimmed = urlOrKey.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      const keyIndex = parts.findIndex((p) => ["file", "design", "board"].includes(p));
      const fileKey = keyIndex !== -1 && parts[keyIndex + 1] ? parts[keyIndex + 1] : parts[0];

      let rawNodeId = url.searchParams.get("node-id") || undefined;
      let nodeId: string | undefined = undefined;
      if (rawNodeId) {
        nodeId = decodeURIComponent(rawNodeId).replace(/-/g, ":");
      }
      return { fileKey, nodeId };
    } catch {
      // fallback
    }
  }
  return { fileKey: trimmed };
}

// Figma HTTP Helper
async function figmaFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${FIGMA_API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "X-Figma-Token": FIGMA_API_KEY,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Figma API error (${res.status} ${res.statusText}): ${errText}`);
  }

  return res.json();
}

/**
 * Simplifies a Figma node tree to produce clean, compact design context
 * for AI code generation (Tailwind, React, CSS, etc.)
 */
function simplifyNode(node: any): any {
  if (!node) return null;

  const result: any = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if (node.visible === false) {
    result.visible = false;
  }

  // Geometry
  if (node.absoluteBoundingBox) {
    result.width = Math.round(node.absoluteBoundingBox.width);
    result.height = Math.round(node.absoluteBoundingBox.height);
  }

  // Auto layout & Flex
  if (node.layoutMode) {
    result.layout = {
      direction: node.layoutMode === "HORIZONTAL" ? "row" : "column",
      gap: node.itemSpacing || 0,
      padding: {
        top: node.paddingTop || 0,
        right: node.paddingRight || 0,
        bottom: node.paddingBottom || 0,
        left: node.paddingLeft || 0,
      },
      alignItems: node.counterAxisAlignItems,
      justifyContent: node.primaryAxisAlignItems,
      wrap: node.layoutWrap === "WRAP",
    };
  }

  // Fills & Colors
  if (node.fills && Array.isArray(node.fills) && node.fills.length > 0) {
    result.fills = node.fills
      .filter((f: any) => f.visible !== false)
      .map((f: any) => {
        if (f.type === "SOLID" && f.color) {
          const r = Math.round(f.color.r * 255);
          const g = Math.round(f.color.g * 255);
          const b = Math.round(f.color.b * 255);
          const a = f.opacity !== undefined ? f.opacity : f.color.a !== undefined ? f.color.a : 1;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          return { type: "SOLID", hex, rgba: `rgba(${r}, ${g}, ${b}, ${a})` };
        }
        return { type: f.type };
      });
  }

  // Strokes & Borders
  if (node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {
    result.strokes = node.strokes.filter((s: any) => s.visible !== false);
    result.strokeWeight = node.strokeWeight;
  }

  // Corner radius
  if (node.cornerRadius !== undefined) {
    result.borderRadius = node.cornerRadius;
  }

  // Typography
  if (node.type === "TEXT") {
    result.characters = node.characters;
    if (node.style) {
      result.typography = {
        fontFamily: node.style.fontFamily,
        fontWeight: node.style.fontWeight,
        fontSize: node.style.fontSize,
        lineHeight: node.style.lineHeightPx,
        letterSpacing: node.style.letterSpacing,
        textAlign: node.style.textAlignHorizontal,
      };
    }
  }

  // Effects (Shadows, Blur)
  if (node.effects && Array.isArray(node.effects) && node.effects.length > 0) {
    result.effects = node.effects.filter((e: any) => e.visible !== false);
  }

  // Recursively simplify children
  if (node.children && Array.isArray(node.children)) {
    result.children = node.children.map(simplifyNode).filter(Boolean);
  }

  return result;
}

// MCP Server Setup
const server = new McpServer({
  name: "figma-local",
  version: "1.0.0",
});

/**
 * TOOL: get_design_context
 * Best for code generation. Extracts clean, token-aware React/Tailwind/CSS context.
 */
server.tool(
  "get_design_context",
  "Extracts simplified, structured design context (layout, geometry, colors, typography, styles) from a Figma URL or node ID. Perfect for generating React/Tailwind code.",
  {
    url: z.string().optional().describe("Figma frame/file URL (e.g. https://www.figma.com/design/:key/...?node-id=123:456)"),
    fileKey: z.string().optional().describe("Figma file key if not using URL"),
    nodeId: z.string().optional().describe("Figma node ID (e.g. '123:456' or '123-456')"),
    depth: z.number().optional().describe("Depth of child traversal (optional)"),
  },
  async ({ url, fileKey: rawKey, nodeId: rawNodeId, depth }) => {
    let fileKey = rawKey;
    let nodeId = rawNodeId;

    if (url) {
      const parsed = parseFigmaUrl(url);
      fileKey = parsed.fileKey || fileKey;
      nodeId = parsed.nodeId || nodeId;
    }

    if (!fileKey) {
      return {
        isError: true,
        content: [{ type: "text", text: "A valid Figma fileKey or url must be provided." }],
      };
    }

    const cleanNodeId = nodeId ? nodeId.replace(/-/g, ":") : undefined;

    try {
      if (cleanNodeId) {
        const data = await figmaFetch(
          `/files/${fileKey}/nodes?ids=${encodeURIComponent(cleanNodeId)}${depth ? `&depth=${depth}` : ""}`
        );
        const nodeData = data.nodes?.[cleanNodeId]?.document;
        if (!nodeData) {
          return {
            isError: true,
            content: [{ type: "text", text: `Node ${cleanNodeId} not found in file ${fileKey}.` }],
          };
        }
        const simplified = simplifyNode(nodeData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(simplified, null, 2),
            },
          ],
        };
      } else {
        const data = await figmaFetch(`/files/${fileKey}${depth ? `?depth=${depth}` : "?depth=2"}`);
        const simplified = simplifyNode(data.document);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  fileName: data.name,
                  lastModified: data.lastModified,
                  document: simplified,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to fetch design context: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: get_file
 * Retrieves file metadata, pages, and document tree.
 */
server.tool(
  "get_file",
  "Get comprehensive document data and pages from a Figma file",
  {
    fileKey: z.string().describe("Figma file key or URL"),
    depth: z.number().optional().describe("Depth of node hierarchy to traverse"),
  },
  async ({ fileKey: inputKey, depth }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    try {
      const data = await figmaFetch(`/files/${fileKey}${depth ? `?depth=${depth}` : ""}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to get file: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: get_node
 * Retrieves full raw data of specific nodes in a Figma file.
 */
server.tool(
  "get_node",
  "Get full node data for one or more node IDs in a Figma file",
  {
    fileKey: z.string().describe("Figma file key or URL"),
    nodeIds: z.array(z.string()).describe("List of node IDs (e.g. ['123:456'])"),
    depth: z.number().optional().describe("Depth of hierarchy to traverse"),
  },
  async ({ fileKey: inputKey, nodeIds, depth }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    const cleanIds = nodeIds.map((id) => id.replace(/-/g, ":"));
    try {
      const data = await figmaFetch(
        `/files/${fileKey}/nodes?ids=${cleanIds.map(encodeURIComponent).join(",")}${depth ? `&depth=${depth}` : ""}`
      );
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to get nodes: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: export_image
 * Exports node as PNG, SVG, JPG, or PDF and optionally saves it directly to local disk.
 */
server.tool(
  "export_image",
  "Render and export Figma frames/nodes to PNG, SVG, JPG, or PDF. Can save directly to project files.",
  {
    fileKey: z.string().describe("Figma file key or URL"),
    nodeId: z.string().describe("Node ID to render (e.g. '123:456')"),
    format: z.enum(["png", "svg", "jpg", "pdf"]).optional().default("png"),
    scale: z.number().optional().default(2),
    savePath: z.string().optional().describe("Local file path to save image (e.g. './public/icons/logo.svg')"),
  },
  async ({ fileKey: inputKey, nodeId: rawNodeId, format, scale, savePath }) => {
    const { fileKey, nodeId: urlNodeId } = parseFigmaUrl(inputKey);
    const targetNodeId = (rawNodeId || urlNodeId || "").replace(/-/g, ":");

    if (!targetNodeId) {
      return {
        isError: true,
        content: [{ type: "text", text: "A nodeId must be specified." }],
      };
    }

    try {
      const endpoint = `/images/${fileKey}?ids=${encodeURIComponent(targetNodeId)}&format=${format}&scale=${scale}`;
      const data = await figmaFetch(endpoint);
      const imageUrl = data.images?.[targetNodeId];

      if (!imageUrl) {
        return {
          isError: true,
          content: [{ type: "text", text: `Figma did not return an image URL for node ${targetNodeId}` }],
        };
      }

      if (savePath) {
        const resolvedPath = path.resolve(process.cwd(), savePath);
        await fs.mkdir(path.dirname(resolvedPath), { recursive: true });

        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) {
          throw new Error(`Failed to download image from ${imageUrl}: ${imgRes.statusText}`);
        }
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        await fs.writeFile(resolvedPath, buffer);

        return {
          content: [
            {
              type: "text",
              text: `Image successfully rendered and saved to: ${resolvedPath}\nSource URL: ${imageUrl}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ nodeId: targetNodeId, format, scale, imageUrl }, null, 2),
          },
        ],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to export image: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: get_variables
 * Retrieves Figma local design tokens & variables (colors, numbers, strings).
 */
server.tool(
  "get_variables",
  "Get all local design tokens and variables (colors, spacing, typography scales) from a Figma file",
  {
    fileKey: z.string().describe("Figma file key or URL"),
  },
  async ({ fileKey: inputKey }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    try {
      const data = await figmaFetch(`/files/${fileKey}/variables/local`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to get variables: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: get_styles
 * Retrieves style definitions (colors, typography, effects).
 */
server.tool(
  "get_styles",
  "Get all published/local styles (text, fill, effect) from a Figma file",
  {
    fileKey: z.string().describe("Figma file key or URL"),
  },
  async ({ fileKey: inputKey }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    try {
      const data = await figmaFetch(`/files/${fileKey}/styles`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to get styles: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: get_comments
 * Retrieves all user comments and replies.
 */
server.tool(
  "get_comments",
  "Get all comments and discussions on a Figma file",
  {
    fileKey: z.string().describe("Figma file key or URL"),
  },
  async ({ fileKey: inputKey }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    try {
      const data = await figmaFetch(`/files/${fileKey}/comments`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to get comments: ${err.message}` }],
      };
    }
  }
);

/**
 * TOOL: post_comment
 * Adds a new comment to a Figma file or specific node.
 */
server.tool(
  "post_comment",
  "Add a new comment to a Figma file or specific position/node",
  {
    fileKey: z.string().describe("Figma file key or URL"),
    message: z.string().describe("Comment message text"),
    clientMeta: z
      .object({
        node_id: z.string().optional(),
        node_offset: z.object({ x: z.number(), y: z.number() }).optional(),
      })
      .optional()
      .describe("Optional pin position or node connection"),
  },
  async ({ fileKey: inputKey, message, clientMeta }) => {
    const { fileKey } = parseFigmaUrl(inputKey);
    try {
      const body: any = { message };
      if (clientMeta) {
        body.client_meta = clientMeta;
      }
      const data = await figmaFetch(`/files/${fileKey}/comments`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to post comment: ${err.message}` }],
      };
    }
  }
);

// Start Stdio Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Figma Local MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error running Figma Local MCP Server:", err);
  process.exit(1);
});
