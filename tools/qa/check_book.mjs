/**
 * Emulated-iPad checks for one book, plus screenshots for a visual pass.
 *
 *   cd tools/qa && npm install        (once)
 *   node check_book.mjs <book-id> [--shots]
 *
 * Serves the site itself, opens reader.html?book=<id> as an iPad (1180×820,
 * touch, Retina) in Chrome, and reports:
 *   - questions in book.json with no solution, no layout entry or no anchor
 *   - review-link phrases that do not match the page text, or that have no
 *     marked answer part
 *   - side reasons containing TeX ($…$ or \command), which they show raw
 *   - answers pushed onto continuation sheets or shrunk below 75 %
 *   - graphics that throw or draw nothing
 *   - Pencil writing, finger tap-to-reveal and page errors
 * With --shots, every sheet (all answers shown) and every graphic is saved to
 * books/<id>/reference/qa/ (not published).
 * Exit code 1 when something must be fixed; warnings do not fail.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const id = process.argv[2];
const shots = process.argv.includes("--shots");
if (!id) {
  console.log("Usage: node check_book.mjs <book-id> [--shots]");
  process.exit(2);
}
const CHROME = process.env.CHROME || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff",
  ".ttf": "font/ttf", ".webmanifest": "application/manifest+json",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(ROOT, url.endsWith("/") ? `${url}index.html` : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const book = JSON.parse(fs.readFileSync(path.join(ROOT, "books", id, "book.json"), "utf8"));
const layout = JSON.parse(fs.readFileSync(path.join(ROOT, "books", id, "layout.json"), "utf8"));
const outDir = path.join(ROOT, "books", id, "reference", "qa");
if (shots) fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => fail(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") fail(`console error: ${m.text()}`);
  });
  page.on("requestfailed", (r) => fail(`failed to load ${r.url()}`));
  page.on("response", (r) => {
    if (r.status() >= 400) fail(`HTTP ${r.status()} ${r.url()}`);
  });
  await page.setViewport({ width: 1180, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`${base}reader.html?book=${id}`, { waitUntil: "networkidle0" });
  await page.evaluate((key) => { indexedDB.deleteDatabase(`${key}-ebook`); localStorage.removeItem(`${key}-ui`); }, book.storage || id);
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(1200);

  /* ---------- data consistency ---------- */
  const solved = await page.evaluate(async () => {
    const m = await import("/engine/book.js");
    return Object.fromEntries(Object.entries(m.SOLUTION_BY_ID).map(([k, s]) => [k, { printed: !!s.printed, graphic: m.hasGraphic(k) }]));
  });
  const laidOut = new Set(layout.pages.flatMap((p) => p.questions.map((q) => q.id)));
  for (const q of book.extract.questions) {
    if (!laidOut.has(q.id)) fail(`${q.id}: no anchor found on page ${q.page} (re-run extract_pages.py, check book.json anchors)`);
    if (!solved[q.id]) fail(`${q.id}: listed in book.json but has no entry in solutions.js`);
  }
  for (const sid of Object.keys(solved)) {
    if (!laidOut.has(sid)) fail(`${sid}: in solutions.js but not in layout.json`);
  }

  /* ---------- review links ---------- */
  const linkReport = await page.evaluate(async () => {
    const { SOLUTION_BY_ID, BOOK_DIR } = await import("/engine/book.js");
    const { questionRects } = await import("/engine/viewer/links.js");
    const lay = await fetch(`${BOOK_DIR}layout.json`).then((r) => r.json());
    const out = [];
    for (const pg of lay.pages) {
      for (const q of pg.questions) {
        for (const link of SOLUTION_BY_ID[q.id]?.links || []) {
          for (const phrase of link.q || []) {
            if (!questionRects(pg, q, phrase).length) out.push(`${q.id}: link "${link.key}" phrase not found on the page: "${phrase}"`);
          }
          if (!document.querySelector(`.qa[data-q="${q.id}"] .lk-${link.key}`)) {
            out.push(`${q.id}: link "${link.key}" has no marked answer part (L() or lk())`);
          }
        }
      }
    }
    return out;
  });
  linkReport.forEach(fail);

  /* ---------- layout fit ---------- */
  await page.tap("#show-all");
  await sleep(500);

  /* Answer underlines only appear once the marked steps are revealed. */
  const underlineReport = await page.evaluate(async () => {
    const { SOLUTION_BY_ID, BOOK_DIR } = await import("/engine/book.js");
    const lay = await fetch(`${BOOK_DIR}layout.json`).then((r) => r.json());
    const out = [];
    for (const pg of lay.pages) {
      for (const q of pg.questions) {
        for (const link of SOLUTION_BY_ID[q.id]?.links || []) {
          if (!document.querySelector(`.qa[data-q="${q.id}"] .lk-${link.key}`)) continue;
          if (!document.querySelector(`.rev[data-q="${q.id}"] .lk-u-g[data-link="${link.key}"]`)) {
            out.push(`${q.id}: link "${link.key}" has no answer-side underline`);
          }
        }
      }
    }
    return out;
  });
  underlineReport.forEach(fail);

  /* Each marked maths piece needs an underline as wide as its glyphs and below them (fractions, powers, roots). */
  const inkReport = await page.evaluate(() => {
    const out = [];
    const range = document.createRange();
    for (const n of document.querySelectorAll('.qa[data-q] .katex [class*="lk-"]')) {
      if (n.closest(".ln.hid")) continue;
      const qa = n.closest(".qa");
      const sheet = qa.closest(".sheet");
      for (const key of [...n.classList].filter((c) => /^lk-[\w-]+$/.test(c)).map((c) => c.slice(3))) {
        let lo = Infinity, hi = -Infinity, l = Infinity, r = -Infinity;
        const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
        for (let t = walker.nextNode(); t; t = walker.nextNode()) {
          if (!t.data.trim() || t.parentElement.closest(".katex-mathml")) continue;
          range.selectNodeContents(t);
          for (const g of range.getClientRects()) {
            lo = Math.min(lo, g.top); hi = Math.max(hi, g.bottom); l = Math.min(l, g.left); r = Math.max(r, g.right);
          }
        }
        if (!isFinite(lo) || (n.getClientRects().length > 1 && hi - lo > 40)) continue;
        const own = [...sheet.querySelectorAll(`.lk-u-g[data-q="${qa.dataset.q}"][data-link="${key}"] .lk-u`)]
          .map((ln) => ln.getBoundingClientRect())
          .some((b) => b.left <= l + 2 && b.right >= r - 2 && b.top >= hi - 1 && b.top < hi + 14);
        if (!own) out.push(`${qa.dataset.q}: link "${key}" underline does not sit under all of "${n.textContent.slice(0, 30)}"`);
      }
    }
    return out;
  });
  inkReport.forEach(fail);
  /* Side reasons are plain text, so TeX in them shows up raw. */
  const rawTex = await page.evaluate(() => [...document.querySelectorAll(".qa[data-q] .rs")]
    .filter((el) => /\\[a-zA-Z]+|\$[^$]+\$/.test(el.textContent))
    .map((el) => `${el.closest(".qa").dataset.q}: side reason shows raw TeX "${el.textContent}" (use ∠ △ ≅ // instead)`));
  [...new Set(rawTex)].forEach(fail);
  const fit = await page.evaluate(() => ({
    continued: [...new Set([...document.querySelectorAll(".sheet.continuation .qa[data-q]")].map((el) => el.dataset.q))],
    small: [...document.querySelectorAll(".qa")].map((qa) => {
      const k = Number(qa.querySelector('[style*="--k"]')?.style.getPropertyValue("--k") || 1);
      return [qa.dataset.q, k];
    }).filter(([, k]) => k < 0.75),
  }));
  if (fit.continued.length) warn(`answers continued on an extra sheet: ${fit.continued.join(", ")}`);
  for (const [q, k] of fit.small) warn(`${q}: answer text shrunk to ${Math.round(k * 100)} % to fit`);

  if (shots) {
    // Tall enough for a whole fit-width sheet; the reader pans with a transform, so jump by #hash.
    await page.setViewport({ width: 1180, height: 1800, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await sleep(400);
    const keys = await page.evaluate(() => [...document.querySelectorAll(".sheet")].map((s) => s.dataset.key));
    for (const [i, key] of keys.entries()) {
      await page.evaluate((k) => { location.hash = k; }, key);
      const rectOf = () => page.evaluate((k) => {
        const r = document.querySelector(`.sheet[data-key="${k}"]`).getBoundingClientRect();
        return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight - Math.max(0, r.top)) };
      }, key);
      let clip = await rectOf();
      for (let tries = 0; tries < 20; tries++) {
        await sleep(120);
        const next = await rectOf();
        if (Math.abs(next.y - clip.y) < 0.5) break;
        clip = next;
      }
      await page.screenshot({ path: path.join(outDir, `sheet-${String(i + 1).padStart(2, "0")}-${key}.png`), clip });
    }
    await page.setViewport({ width: 1180, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await sleep(400);
  }

  /* ---------- graphics ---------- */
  for (const [qid, info] of Object.entries(solved)) {
    if (!info.graphic) continue;
    const before = errors.length;
    const drawn = await page.evaluate(async (q) => {
      const { mountGraphic } = await import("/engine/book.js");
      const host = document.getElementById("graphic-body");
      document.getElementById("graphic").classList.add("open");
      try {
        mountGraphic(q, host);
      } catch (err) {
        return `threw ${err.message}`;
      }
      await new Promise((r) => setTimeout(r, 80));
      const n = host.querySelectorAll("svg *").length;
      return n > 3 ? "" : "drew nothing";
    }, qid);
    if (drawn) fail(`${qid}: graphic ${drawn}`);
    else if (errors.length > before) fail(`${qid}: graphic logged errors`);
    if (shots) await (await page.$("#graphic")).screenshot({ path: path.join(outDir, `graphic-${qid}.png`) });
  }
  await page.evaluate(() => document.getElementById("graphic").classList.remove("open"));

  /* ---------- input ---------- */
  await page.tap("#hide-all");
  const cdp = await page.createCDPSession();
  await page.tap('[data-tool="pen"]');
  await sleep(150);
  const pen = (type, x, y) => cdp.send("Input.dispatchMouseEvent", {
    type, x, y, button: "left", buttons: type === "mouseReleased" ? 0 : 1, clickCount: 1, pointerType: "pen", force: 0.5,
  });
  await pen("mousePressed", 300, 300);
  for (let i = 1; i <= 20; i++) await pen("mouseMoved", 300 + i * 10, 300 + (i % 3));
  await pen("mouseReleased", 500, 300);
  await sleep(100);
  const inked = await page.evaluate(() => [...document.querySelectorAll("canvas[data-layer='ink']")].some((c) => c.width > 1));
  if (!inked) fail("Pencil stroke did not reach the ink layer");

  await page.tap('[data-tool="read"]');
  const target = await page.evaluate(() => {
    const q = document.querySelector(".qa .abox")?.closest(".qa").dataset.q;
    location.hash = q;
    return q;
  });
  await sleep(500);
  const shownBefore = await page.evaluate((q) => document.querySelectorAll(`.ln[data-q="${q}"]:not(.hid)`).length, target);
  const at = await page.evaluate((q) => {
    const r = document.querySelector(`.qa[data-q="${q}"] .abox`).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + Math.min(18, r.height / 2) };
  }, target);
  await page.touchscreen.tap(at.x, at.y);
  await sleep(300);
  const shownAfter = await page.evaluate((q) => document.querySelectorAll(`.ln[data-q="${q}"]:not(.hid)`).length, target);
  if (shownAfter !== shownBefore + 1) fail(`finger tap on ${target} did not reveal one step (${shownBefore} → ${shownAfter})`);

  /* ---------- library ---------- */
  await page.goto(base, { waitUntil: "networkidle0" });
  const listed = await page.evaluate((bid) => Boolean(document.querySelector(`a.card[href*="book=${bid}"]`)), id);
  if (!listed) fail(`library does not list ${id} (add it to books/catalog.json)`);
} finally {
  await browser.close();
  server.close();
}

console.log(`\n${book.code} ${book.title} (${id})`);
for (const w of warnings) console.log(`  WARN  ${w}`);
for (const e of errors) console.log(`  FAIL  ${e}`);
if (!errors.length) console.log(`  OK    no blocking problems${warnings.length ? `, ${warnings.length} warning(s)` : ""}`);
if (shots) console.log(`  shots in ${path.relative(ROOT, outDir)}`);
process.exit(errors.length ? 1 : 0);
