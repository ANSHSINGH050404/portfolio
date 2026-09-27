import { stat } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";
import sharp from "sharp";

import { SITE, STATS_FALLBACK, STAT_LABELS } from "../constants/index";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");

const OG = { width: 1200, height: 630 };

const ogHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${OG.width}px; height: ${OG.height}px; }
  body {
    background: #000000;
    color: #f5f5f7;
    font-family: "Geist", system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 80px;
  }
  .glow {
    position: absolute;
    right: -220px;
    top: -260px;
    width: 720px;
    height: 720px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(41,151,255,0.28), transparent 65%);
  }
  .grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at 30% 50%, #000 20%, transparent 78%);
  }
  .top, .bottom { position: relative; display: flex; justify-content: space-between; align-items: center; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 500; letter-spacing: -0.02em; }
  .dot { width: 13px; height: 13px; border-radius: 50%; background: #30d158; }
  .url {
    font-family: "Geist Mono", monospace;
    font-size: 20px;
    letter-spacing: 0.14em;
    color: #86868b;
    text-transform: uppercase;
  }
  .mid { position: relative; }
  h1 {
    font-size: 96px;
    font-weight: 600;
    letter-spacing: -0.045em;
    line-height: 1;
    margin-bottom: 22px;
  }
  .role {
    font-size: 40px;
    font-weight: 400;
    letter-spacing: -0.02em;
    color: #2997ff;
  }
  .rule { height: 1px; background: rgba(255,255,255,0.12); margin-bottom: 26px; }
  .stats {
    font-family: "Geist Mono", monospace;
    font-size: 21px;
    letter-spacing: 0.04em;
    color: #86868b;
  }
  .stats b { color: #f5f5f7; font-weight: 500; }
  .avail {
    font-family: "Geist Mono", monospace;
    font-size: 19px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #86868b;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="grid"></div>

  <div class="top">
    <div class="brand"><span class="dot"></span>${SITE.shortName}</div>
    <div class="url">Portfolio</div>
  </div>

  <div class="mid">
    <h1>${SITE.name}</h1>
    <div class="role">Full-Stack &amp; Agentic AI Engineer</div>
  </div>

  <div class="bottom" style="flex-direction: column; align-items: stretch; gap: 0;">
    <div class="rule"></div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div class="stats">${STAT_LABELS.map(
        ({ key, label }, i) =>
          `<b>${STATS_FALLBACK[key]}</b> ${label.replace(" shipping", "").replace(" used", "")}${i < STAT_LABELS.length - 1 ? "  ·  " : ""}`,
      ).join("")}</div>
      <div class="avail">Available</div>
    </div>
  </div>
</body>
</html>`;

/** Full-bleed square — iOS applies its own mask, so don't pre-round it. */
const appleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#000000"/>
  <path fill="#f5f5f7" d="M32 13 L51 51 H42 L32 31 L22 51 H13 Z"/>
  <rect x="23" y="40" width="18" height="6" rx="1.5" fill="#2997ff"/>
</svg>`;

async function generateOg(): Promise<void> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: OG,
      deviceScaleFactor: 2,
      colorScheme: "dark",
    });
    await page.setContent(ogHtml, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(600);

    const png = await page.screenshot({ animations: "disabled" });
    const outputPath = path.join(APP_DIR, "opengraph-image.png");
    await sharp(png)
      .resize(OG.width, OG.height)
      .png({ compressionLevel: 9 })
      .toFile(outputPath);

    const { size } = await stat(outputPath);
    console.log(`ok    opengraph-image.png  ${(size / 1024).toFixed(0)} KB`);
  } finally {
    await browser.close();
  }
}

async function generateAppleIcon(): Promise<void> {
  const outputPath = path.join(APP_DIR, "apple-icon.png");
  await sharp(Buffer.from(appleIconSvg))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  console.log("ok    apple-icon.png  180x180");
}

async function main() {
  await Promise.all([generateOg(), generateAppleIcon()]);
  console.log("\nRegenerate with: bun run og");
}

await main();
