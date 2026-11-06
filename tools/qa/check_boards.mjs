/**
 * Scenario boards (books/<id>/infographics.js): draws every board with all its
 * steps showing and reports
 *   - handwriting that overlaps other handwriting
 *   - handwriting crossed by a table rule
 *   - handwriting outside the board
 * Saves books/<id>/reference/boards/<q>.png (not published).
 *
 *   node check_boards.mjs <book-id> [q1 q5 ...]
 *
 * Exit code 1 when a board has a problem.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [id, ...only] = process.argv.slice(2);
if (!id) {
  console.log("Usage: node check_boards.mjs <book-id> [q1 q5 ...]");
  process.exit(2);
}
const CHROME = process.env.CHROME || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2",
};
const SHEET = `<!doctype html><html><head><meta charset="utf-8">
  <link rel="stylesheet" href="/engine/infographic/infographic.css">
  <style>body{margin:0;background:#eef0f3} .wrap{width:820px;padding:12px}</style>
  <script type="module">
    import { render } from "/engine/infographic/kit.js";
    import { INFOGRAPHICS } from "/books/${id}/infographics.js";
    window.__render = render;
    window.__BOARDS = INFOGRAPHICS;
  </script>
  </head><body><div class="wrap"><svg class="ig-board" xmlns="http://www.w3.org/2000/svg"></svg></div></body></html>`;
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (url === "/__boards.html") {
    res.writeHead(200, { "Content-Type": "text/html" }).end(SHEET);
    return;
  }
  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const outDir = path.join(ROOT, "books", id, "reference", "boards");
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let bad = 0;
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewport({ width: 900, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${base}__boards.html`, { waitUntil: "load", timeout: 20000 });
  await page.waitForFunction(() => window.__BOARDS, { timeout: 15000 });
  await page.evaluate(() => Promise.race([document.fonts.load('24px "IG Hand"'), new Promise((r) => setTimeout(r, 5000))]));
  const ids = await page.evaluate(() => Object.keys(window.__BOARDS));

  for (const q of ids) {
    if (only.length && !only.includes(q)) continue;
    const report = await page.evaluate((q) => {
      const board = window.__BOARDS[q];
      const svg = document.querySelector(".ig-board");
      const steps = window.__render(svg, board, { seed: 7 });
      const w = board.w || 600;
      const h = board.h || 480;
      const issues = [];
      /* Ink, not the font's line box: cap height above the baseline, descenders below. */
      const boxes = [...svg.querySelectorAll("text")]
        .filter((t) => !t.getAttribute("transform") && t.textContent.trim())
        .map((t) => {
          const r = t.getBBox();
          const y = parseFloat(t.getAttribute("y"));
          const s = parseFloat(t.getAttribute("font-size"));
          return { s: t.textContent, b: { x: r.x, width: r.width, y: y - 0.74 * s, height: 0.96 * s } };
        });
      const pad = 1.5;
      for (let i = 0; i < boxes.length; i++) {
        const a = boxes[i].b;
        if (a.x < -1 || a.y < -1 || a.x + a.width > w + 1 || a.y + a.height > h + 1) issues.push(`off the board: "${boxes[i].s}"`);
        for (let j = i + 1; j < boxes.length; j++) {
          const b = boxes[j].b;
          const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) - 2 * pad;
          const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) - 2 * pad;
          if (ox > 0 && oy > 0) issues.push(`overlap: "${boxes[i].s}" / "${boxes[j].s}"`);
        }
      }
      const grids = (board.items || []).flat(3).filter((it) => it && it.k === "grid");
      for (const g of grids) {
        const y0 = g.ys[0];
        const y1 = g.ys[g.ys.length - 1];
        const x0 = g.xs[0];
        const x1 = g.xs[g.xs.length - 1];
        for (const { s, b } of boxes) {
          const inX = (x) => x > b.x + 2 && x < b.x + b.width - 2;
          const inY = (y) => y > b.y + 3 && y < b.y + b.height - 3;
          const crossV = g.xs.some((x) => inX(x) && b.y + b.height > y0 && b.y < y1);
          const crossH = g.ys.some((y) => inY(y) && b.x + b.width > x0 && b.x < x1);
          if (crossV || crossH) issues.push(`table rule through "${s}"`);
        }
      }
      return { steps: steps.length, issues };
    }, q);
    const el = await page.$(".ig-board");
    await el.screenshot({ path: path.join(outDir, `${q}.png`) });
    const status = report.issues.length ? "FAIL" : "ok  ";
    if (report.issues.length) bad += 1;
    console.log(`${status} ${q}  ${report.steps} step(s)`);
    for (const m of report.issues) console.log(`       ${m}`);
  }
  for (const e of errors) {
    bad += 1;
    console.log(`page error: ${e}`);
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`Screenshots in books/${id}/reference/boards/`);
process.exit(bad ? 1 : 0);
