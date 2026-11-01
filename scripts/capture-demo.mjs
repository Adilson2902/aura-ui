import { spawn } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs/assets");
const videoDir = path.join(root, "tmp/demo-video");
const port = 4180;
const base = `http://127.0.0.1:${port}`;

const server = spawn(
  "python3",
  ["-m", "http.server", String(port), "--directory", path.join(root, "apps/docs/out")],
  { stdio: "ignore" }
);

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${base}/demo/`);
      if (response.ok) return;
    } catch {
      // o servidor ainda está abrindo a porta
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("O site estático do docs não respondeu em /demo/.");
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg saiu com código ${code}`));
    });
  });
}

try {
  await waitForServer();
  await mkdir(outDir, { recursive: true });
  await rm(videoDir, { recursive: true, force: true });
  await mkdir(videoDir, { recursive: true });

  const browser = await chromium.launch({
    args: ["--use-gl=angle", "--enable-webgl", "--ignore-gpu-blocklist"]
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
    recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } }
  });
  const page = await context.newPage();
  await page.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  await page.locator("[data-demo-ready='true']").waitFor({ timeout: 20_000 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(outDir, "demo.png") });

  const distance = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const steps = 6;
  for (let step = 1; step <= steps; step += 1) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round((distance * step) / steps));
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(400);

  const video = page.video();
  await context.close();
  await browser.close();
  const webm = video ? await video.path() : (await readdir(videoDir)).find((name) => name.endsWith(".webm"));
  if (!webm) throw new Error("Playwright não gravou o vídeo da demo.");
  const input = video ? webm : path.join(videoDir, webm);

  await ffmpeg([
    "-y",
    "-i",
    input,
    "-vf",
    "fps=8,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer",
    "-loop",
    "0",
    path.join(outDir, "demo.gif")
  ]);
} finally {
  server.kill();
}
