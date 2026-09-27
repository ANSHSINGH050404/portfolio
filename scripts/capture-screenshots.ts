import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";
import sharp from "sharp";

import { PROJECTS } from "../constants/index";

const OUT_DIR = path.join(process.cwd(), "public", "projects");
const VIEWPORT = { width: 1600, height: 1000 };
/** Rendered at 2x, then downscaled to this many CSS px wide. */
const OUTPUT_WIDTH = 1600;

/**
 * Captures a hero screenshot of each live project and writes it to
 * public/projects/{id}.webp. Run with: bun run screenshots
 */
async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  let failed = 0;

  for (const project of PROJECTS) {
    const pngPath = path.join(OUT_DIR, `${project.id}.png`);
    const webpPath = path.join(OUT_DIR, `${project.id}.webp`);

    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      colorScheme: "dark",
      reducedMotion: "reduce",
      locale: "en-US",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    });

    try {
      const page = await context.newPage();
      await page.goto(project.link, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      // Some apps poll forever and never reach "networkidle" — treat it as a
      // soft target so one chatty site can't fail the whole run.
      await page
        .waitForLoadState("networkidle", { timeout: 15_000 })
        .catch(() => {});
      await page
        .evaluate(() => document.fonts.ready.then(() => true))
        .catch(() => {});
      await page.waitForTimeout(2500);

      await page.screenshot({ path: pngPath, animations: "disabled" });
      await context.close();

      await sharp(pngPath)
        .resize({ width: OUTPUT_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(webpPath);

      const { size } = await stat(webpPath);
      // Keep the repo lean — the PNG is only an intermediate for sharp.
      await rm(pngPath, { force: true });
      console.log(
        `ok    ${project.id}  ${project.title.padEnd(20)} ` +
          `${(size / 1024).toFixed(0)} KB  ${project.link}`,
      );
    } catch (error) {
      failed += 1;
      await context.close().catch(() => {});
      console.log(
        `FAIL  ${project.id}  ${project.title.padEnd(20)} ${project.link}`,
      );
      console.log(`      ${error instanceof Error ? error.message : error}`);
    }
  }

  await browser.close();
  console.log(
    failed === 0
      ? `\nDone — ${PROJECTS.length} screenshots in ${OUT_DIR}`
      : `\n${failed} of ${PROJECTS.length} failed`,
  );
  process.exit(failed === 0 ? 0 : 1);
}

await main();
