/**
 * Render an A4 HTML page (595.32 × 841.92 CSS px) to a PNG at the page-image scale (3×, 1786 × 2526),
 * for a book's end pages.
 *
 * Usage: node tools/qa/render_sheet.mjs <page.html> <out.png>
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.log("Usage: node tools/qa/render_sheet.mjs <page.html> <out.png>");
  process.exit(2);
}
const CHROME = process.env.CHROME || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewport({ width: 596, height: 842, deviceScaleFactor: 3 });
  await page.goto(pathToFileURL(path.resolve(src)).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const fit = await page.evaluate(() => {
    const body = document.body;
    const describe = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") + (el.className && typeof el.className === "string" ? `.${el.className.trim().replace(/\s+/g, ".")}` : "");
    const blocks = [...body.children].filter((el) => !["SCRIPT", "STYLE"].includes(el.tagName));
    const rects = blocks.map((el) => [el, el.getBoundingClientRect()]);
    const clashes = [];
    rects.forEach(([a, ra], i) => rects.slice(i + 1).forEach(([b, rb]) => {
      const dy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      const dx = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      if (dx > 0.5 && dy > 0.5) clashes.push(`${describe(a)} overlaps ${describe(b)} by ${dy.toFixed(1)}px`);
    }));
    const spills = [...body.querySelectorAll("*")]
      .filter((el) => !(el instanceof SVGElement) && el.clientWidth && el.scrollWidth > el.clientWidth + 1)
      .map((el) => `${describe(el)} is ${el.scrollWidth - el.clientWidth}px too narrow for its content`);
    return { w: body.scrollWidth, h: body.scrollHeight, clashes, spills };
  });
  if (errors.length) throw new Error(errors.join("\n"));
  if (fit.h > 843 || fit.w > 597) console.warn(`warning: content is ${fit.w} × ${fit.h}, larger than the page`);
  for (const line of [...fit.clashes, ...fit.spills]) console.warn(`warning: ${line}`);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 595.34, height: 841.92 } });
  console.log(`${out}`);
} finally {
  await browser.close();
}
