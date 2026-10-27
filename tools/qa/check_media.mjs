/**
 * Plays every book.json "media" animation in the reader (emulated iPad, headless Chrome).
 *
 *   node check_media.mjs <book-id> [--shots]
 *
 * For each entry: the poster and video load, tapping the round button starts
 * playback, and 2.5 s later the video is still playing and has passed 1 s.
 * The server answers Range requests the way GitHub Pages does, so seeking and
 * Safari-style partial loads are exercised. With --shots, a screenshot of each
 * panel mid-play goes to books/<id>/reference/qa/media-<n>.png.
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
  console.log("Usage: node check_media.mjs <book-id> [--shots]");
  process.exit(2);
}
const CHROME = process.env.CHROME || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".woff2": "font/woff2",
  ".woff": "font/woff", ".ttf": "font/ttf", ".webmanifest": "application/manifest+json",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(ROOT, url.endsWith("/") ? `${url}index.html` : url);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1, "Accept-Ranges": "bytes" });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

const book = JSON.parse(fs.readFileSync(path.join(ROOT, "books", id, "book.json"), "utf8"));
const layout = JSON.parse(fs.readFileSync(path.join(ROOT, "books", id, "layout.json"), "utf8"));
const media = book.media || [];
const outDir = path.join(ROOT, "books", id, "reference", "qa");
if (shots) fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];

console.log(`\n${book.title} (${id}): ${media.length} animation(s)`);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--autoplay-policy=no-user-gesture-required"] });
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`page error: ${e.message}`));
  await page.setViewport({ width: 1180, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`${base}reader.html?book=${id}`, { waitUntil: "networkidle0" });
  await sleep(1200);

  for (const [n, item] of media.entries()) {
    const name = item.scene.split(":")[1];
    for (const file of [item.src, item.poster]) {
      if (!fs.existsSync(path.join(ROOT, "books", id, file))) errors.push(`${name}: missing ${file} (run render_media.py)`);
    }
    // The reader pans with a transform, so jump with a hash (a question on the same page) and wheel the rest.
    const target = layout.pages.find((p) => p.page === item.page)?.questions[0]?.id || `p${item.page}`;
    await page.evaluate((h) => { location.hash = h; }, target);
    await sleep(700);
    const rect = () => page.evaluate((i) => {
      const b = document.querySelector(`.media-play[data-media="${i}"]`)?.getBoundingClientRect();
      return b && { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    }, n);
    let at = await rect();
    // Keep clear of the top bar and toolbar, which would take the tap.
    for (let tries = 0; at && (at.y < 160 || at.y > 700) && tries < 12; tries++) {
      await page.mouse.move(590, 410);
      await page.mouse.wheel({ deltaY: at.y - 300 });
      await sleep(350);
      at = await rect();
    }
    if (!at) {
      errors.push(`${name}: no play button on page ${item.page}`);
      continue;
    }
    if (process.env.DEBUG) console.log(at, await page.evaluate((p) => document.elementFromPoint(p.x, p.y)?.className, at));
    await page.touchscreen.tap(at.x, at.y);
    await sleep(2500);
    const state = await page.evaluate((i) => {
      const v = document.querySelector(`.media-play[data-media="${i}"]`).closest(".media").querySelector("video");
      return { t: v.currentTime, paused: v.paused, error: v.error?.code || 0, w: v.videoWidth, poster: v.poster };
    }, n);
    const posterOK = await page.evaluate((u) => fetch(u).then((r) => r.ok), state.poster);
    const ok = state.t > 1 && !state.paused && !state.error && state.w > 0 && posterOK;
    console.log(`  ${ok ? "OK  " : "FAIL"}  ${name} (page ${item.page}): t=${state.t.toFixed(1)} s, ${state.paused ? "paused" : "playing"}, ${state.w}px wide${state.error ? `, media error ${state.error}` : ""}${posterOK ? "" : ", poster missing"}`);
    if (!ok) errors.push(`${name}: did not play`);
    if (shots) {
      const box = await page.evaluate((i) => {
        const b = document.querySelector(`.media-play[data-media="${i}"]`).closest(".media").getBoundingClientRect();
        return { x: Math.max(0, b.left), y: Math.max(0, b.top), width: b.width, height: b.height };
      }, n);
      await page.screenshot({ path: path.join(outDir, `media-${n + 1}.png`), clip: box });
    }
    await page.evaluate((i) => document.querySelector(`.media-play[data-media="${i}"]`).closest(".media").querySelector("video").pause(), n);
  }
} finally {
  await browser.close();
  server.close();
}
for (const e of errors) console.log(`  FAIL  ${e}`);
console.log(errors.length ? `  ${errors.length} problem(s)` : "  OK    every animation plays");
process.exit(errors.length ? 1 : 0);
