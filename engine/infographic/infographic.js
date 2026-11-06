import { BOOK, BOOK_ID } from "../book.js";
import { render } from "./kit.js";

/**
 * Scenario infographics: a whiteboard sketch of a word problem, opened from a
 * tab beside the question number. Boards live in books/<id>/infographics.js
 * (export INFOGRAPHICS = { q2: board }) and load when book.json sets
 * "infographics": true. See docs/06-infographics.md.
 */

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = new URL("./infographic.css", import.meta.url).href;
document.head.append(css);

let BOARDS = {};
if (BOOK.infographics) {
  try {
    const mod = await import(new URL(`../../books/${BOOK_ID}/infographics.js`, import.meta.url).href);
    BOARDS = mod.INFOGRAPHICS || {};
  } catch (err) {
    console.warn("Infographics failed to load", err);
  }
}

export function hasInfographic(id) {
  return Boolean(BOARDS[id]);
}

const ICON = `<svg viewBox="0 0 18 16" aria-hidden="true"><path d="M2 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/><rect x="3" y="9" width="3" height="5" rx=".6" fill="#2463c9"/><rect x="7.5" y="6.5" width="3" height="7.5" rx=".6" fill="#178a49"/><rect x="12" y="3.5" width="3" height="10.5" rx=".6" fill="#cf3580"/><path d="M3.5 6.5Q7 1.8 12.5 1.6" stroke="#d42f37" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M10.8.6l1.9 1-1.5 1.5" stroke="#d42f37" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Left page edge, level with the question's first line (layout.json anchor). Clear of the printed level diamonds. */
function homeOf(q) {
  if (!q.anchor) return null;
  const [y0, y1] = q.anchor;
  return [6, (y0 + y1) / 2 - 11];
}

/** Adds a tab for every question on `page` (a layout.json page) that has a board. */
export function addInfographics(page, overlay) {
  for (const q of page.questions || []) {
    const board = BOARDS[q.id];
    if (!board) continue;
    const at = board.at || homeOf(q);
    if (!at) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ig-btn";
    btn.dataset.infographic = q.id;
    const what = `Picture Q${q.label}: scenario summary`;
    btn.title = what;
    btn.setAttribute("aria-label", what);
    btn.innerHTML = ICON;
    Object.assign(btn.style, { left: `${at[0]}px`, top: `${at[1]}px` });
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      open(q, btn);
    });
    overlay.append(btn);
  }
}

let modal = null;
let current = null;
/* Presentation steps of the open board: render() output, how many show, when the last finishes drawing. */
let steps = [];
let shown = 0;
let drawingUntil = 0;
let still = false;

function seedOf(id) {
  let h = 2166136261;
  for (const ch of `${BOOK_ID}:${id}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function build() {
  modal = document.createElement("div");
  modal.className = "ig-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="ig-card" role="dialog" aria-modal="true" aria-labelledby="ig-title">
      <header>
        <strong id="ig-title"></strong>
        <span class="ig-steps">
          <button type="button" data-ig="back" title="Previous step (←)">◂ Back</button>
          <span class="ig-count" aria-live="polite"></span>
          <button type="button" data-ig="next" class="ig-next" title="Next step (→, PageDown or tap the board)">Next ▸</button>
          <button type="button" data-ig="all" title="Show every step">All</button>
        </span>
        <button type="button" data-ig="replay" title="Draw the board again">Replay ↻</button>
        <button type="button" data-ig="close" title="Close (Esc)">Close ✕</button>
      </header>
      <div class="ig-board-wrap"><svg class="ig-board" xmlns="http://www.w3.org/2000/svg" role="img"></svg></div>
      <p class="ig-hint"></p>
    </div>`;
  document.body.append(modal);
  modal.addEventListener("click", (event) => {
    const act = event.target.closest("[data-ig]")?.dataset.ig;
    if (act === "close" || event.target === modal) close();
    else if (act === "replay") draw(true);
    else if (act === "next") next();
    else if (act === "back") back();
    else if (act === "all") showAll();
    else if (event.target.closest(".ig-board")) next();
  });
  for (const type of ["pointerdown", "pointermove", "pointerup", "wheel", "touchstart", "touchmove"]) {
    modal.addEventListener(type, (event) => event.stopPropagation(), { passive: true });
  }
}

/* Presentation clickers send PageDown / PageUp or the arrow keys. */
const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown", "PageDown"]);
const BACK_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp"]);

function onKey(event) {
  if (!current) return;
  const onButton = event.target.closest?.("button");
  if (event.key === "Escape") {
    event.preventDefault();
    close();
  } else if (NEXT_KEYS.has(event.key) || (event.key === " " && !onButton)) {
    event.preventDefault();
    next();
  } else if (BACK_KEYS.has(event.key)) {
    event.preventDefault();
    back();
  }
  if (event.key !== "Tab") event.stopImmediatePropagation();
}

async function draw(animate) {
  const svg = modal.querySelector(".ig-board");
  const board = BOARDS[current.q.id];
  svg.setAttribute("aria-label", board.alt || board.title || "");
  try {
    await document.fonts?.load('24px "IG Hand"');
  } catch {
    /* system handwriting fallback */
  }
  still = !animate || matchMedia("(prefers-reduced-motion: reduce)").matches;
  steps = render(svg, board, { seed: seedOf(current.q.id) });
  for (const s of steps) for (const g of s.groups) g.classList.add("ig-later");
  shown = 0;
  reveal();
}

function settle(s) {
  for (const g of s.groups) g.classList.remove("ig-anim");
}

/** Shows the next hidden step, drawing it on unless motion is reduced. */
function reveal() {
  const s = steps[shown];
  if (!s) return;
  for (const g of s.groups) {
    g.classList.remove("ig-later");
    g.classList.toggle("ig-anim", !still);
  }
  drawingUntil = still ? 0 : performance.now() + s.dur;
  shown += 1;
  sync();
}

/** A tap while a step is still drawing finishes it; otherwise the next step starts. */
function next() {
  if (performance.now() < drawingUntil) {
    settle(steps[shown - 1]);
    drawingUntil = 0;
    return;
  }
  reveal();
}

function back() {
  if (shown <= 1) return;
  shown -= 1;
  for (const g of steps[shown].groups) {
    g.classList.add("ig-later");
    g.classList.remove("ig-anim");
  }
  settle(steps[shown - 1]);
  drawingUntil = 0;
  sync();
}

function showAll() {
  while (shown < steps.length) reveal();
  steps.forEach(settle);
  drawingUntil = 0;
}

function sync() {
  const many = steps.length > 1;
  modal.querySelector(".ig-steps").hidden = !many;
  modal.querySelector(".ig-count").textContent = `Step ${shown} of ${steps.length}`;
  modal.querySelector('[data-ig="back"]').disabled = shown <= 1;
  modal.querySelector('[data-ig="next"]').disabled = shown >= steps.length;
  modal.querySelector('[data-ig="all"]').disabled = shown >= steps.length;
  modal.querySelector(".ig-hint").textContent = many
    ? "Tap the board, press → or use a clicker for the next step. ← goes back."
    : "Tap the board to finish drawing.";
}

function open(q, trigger) {
  if (!modal) build();
  current = { q, trigger };
  const board = BOARDS[q.id];
  modal.querySelector("#ig-title").textContent = `Q${q.label}`;
  modal.hidden = false;
  window.addEventListener("keydown", onKey, true);
  modal.querySelector('[data-ig="close"]').focus({ preventScroll: true });
  draw(true).then(() => {
    if (steps.length > 1) modal.querySelector('[data-ig="next"]').focus({ preventScroll: true });
  });
}

function close() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  window.removeEventListener("keydown", onKey, true);
  const back = current?.trigger;
  current = null;
  back?.focus({ preventScroll: true });
}
