import { BOOK, SOLUTION_BY_ID, hasGraphic } from "../book.js";

const GAP = 7;
const CTL = 30;
// Writable area of a continuation sheet, below the page's header band.
const CONT = { top: 96, x: 48, width: 499, bottom: 812, ...BOOK.continuation };

/** Per-question step metadata: global reveal index of every line (headings get -1). */
export const META = {};
for (const [id, sol] of Object.entries(SOLUTION_BY_ID)) {
  let n = 0;
  const boxes = sol.boxes.map((box) => box.steps.map((step) => ({ step, i: step.h ? -1 : n++ })));
  META[id] = { boxes, total: n };
}

/** Steps actually on the page (optional number lines may be dropped to fit). */
const RENDERED = {};

export function totalSteps(id) {
  return RENDERED[id] ?? META[id]?.total ?? 0;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function kx(latex) {
  if (!window.katex) return esc(latex);
  return window.katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false,
    trust: (ctx) => ctx.command === "\\htmlClass",
  });
}

/** Text with $inline maths$, \$ for a dollar sign, **bold** and [[key|link]] spans. */
function inline(src) {
  let out = "";
  let buf = "";
  let bold = false;
  const flush = () => {
    out += esc(buf);
    buf = "";
  };
  for (let i = 0; i < src.length;) {
    if (src.startsWith("\\$", i)) {
      buf += "$";
      i += 2;
    } else if (src[i] === "$") {
      let j = i + 1;
      while (j < src.length && !(src[j] === "$" && src[j - 1] !== "\\")) j++;
      flush();
      out += kx(src.slice(i + 1, j));
      i = j + 1;
    } else if (src.startsWith("**", i)) {
      flush();
      out += bold ? "</b>" : "<b>";
      bold = !bold;
      i += 2;
    } else if (src.startsWith("[[", i) && src.indexOf("]]", i) > 0) {
      const end = src.indexOf("]]", i);
      const bar = src.indexOf("|", i);
      flush();
      out += `<span class="lk-${esc(src.slice(i + 2, bar))}">${inline(src.slice(bar + 1, end))}</span>`;
      i = end + 2;
    } else {
      buf += src[i++];
    }
  }
  flush();
  return bold ? `${out}</b>` : out;
}

const PLAIN = [
  [/\\begin\{cases\}|\\end\{cases\}/g, ""], [/\\\\(\[[^\]]*\])?/g, ";  "], [/&/g, " "],
  [/\\(le|leq)\b/g, "≤"], [/\\(ge|geq)\b/g, "≥"], [/\\ne\b/g, "≠"], [/\\times/g, "×"], [/\\div/g, "÷"],
  [/\\therefore/g, "∴"], [/\\because/g, "∵"], [/\\pi/g, "π"], [/\^\\circ|\\circ/g, "°"], [/\\Rightarrow/g, "⇒"],
  [/\\cdots/g, "…"], [/\\(quad|qquad|,|;|:|!| )/g, " "], [/\\left|\\right/g, ""], [/\\phantom\{[^{}]*\}/g, ""],
  [/\^2/g, "²"], [/\^3/g, "³"], [/\\(text|underline|mathrm|textbf)\{([^{}]*)\}/g, "$2"],
];

function unwrapClasses(s) {
  const tag = "\\htmlClass{";
  for (let at = s.indexOf(tag); at >= 0; at = s.indexOf(tag)) {
    const open = s.indexOf("}", at + tag.length) + 1;
    let depth = 0;
    let end = open;
    for (; end < s.length; end++) {
      if (s[end] === "{") depth++;
      else if (s[end] === "}" && --depth === 0) break;
    }
    s = s.slice(0, at) + s.slice(open + 1, end) + s.slice(end + 1);
  }
  return s;
}

/** Readable plain text for the PDF export. */
function plain(step) {
  let s = unwrapClasses(step.m ?? step.t ?? step.note ?? "").replace(/\[\[[\w-]+\|/g, "").replace(/\]\]/g, "");
  if (step.t || step.note) s = s.replace(/\\\$/g, "\u0001").replace(/\$/g, "").replace(/\u0001/g, "$").replace(/\*\*/g, "");
  for (let k = 0; k < 3; k++) s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)");
  for (let k = 0; k < 2; k++) for (const [re, to] of PLAIN) s = s.replace(re, to);
  return s.replace(/\\[a-zA-Z]+/g, "").replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
}

function nlSvg(spec) {
  const w = 236;
  const h = 58;
  const yRay = 12;
  const yAxis = 38;
  const ink = "#111";
  const X = (v) => 22 + ((v - spec.min) / (spec.max - spec.min)) * (w - 44);
  const right = spec.op === "gt" || spec.op === "ge";
  const closed = spec.op === "ge" || spec.op === "le";
  const step = spec.max - spec.min > 16 ? 5 : 1;
  const head = (x, y, toRight) => `<path d="M${x},${y} l${toRight ? -8 : 8},-4.5 v9 z" fill="${ink}"/>`;
  let g = `<line x1="5" y1="${yAxis}" x2="${w - 5}" y2="${yAxis}" stroke="${ink}" stroke-width="1.2"/>${head(4, yAxis, false)}${head(w - 4, yAxis, true)}`;
  for (let v = Math.ceil(spec.min / step) * step; v <= spec.max; v += step) {
    const bold = v === spec.at || v === spec.mark ? ` font-weight="700"` : "";
    g += `<line x1="${X(v)}" y1="${yAxis - 4}" x2="${X(v)}" y2="${yAxis + 4}" stroke="${ink}" stroke-width="1"/>`;
    g += `<text x="${X(v)}" y="${yAxis + 15}" font-size="9.5" text-anchor="middle" fill="${ink}"${bold}>${String(v).replace("-", "−")}</text>`;
  }
  const x0 = X(spec.at);
  const end = right ? Math.max(x0 + 34, w - 30) : Math.min(x0 - 34, 30);
  g += `<line x1="${x0}" y1="${yAxis}" x2="${x0}" y2="${yRay}" stroke="${ink}" stroke-width="1.3"/>`;
  g += `<line x1="${x0}" y1="${yRay}" x2="${end + (right ? -6 : 6)}" y2="${yRay}" stroke="${ink}" stroke-width="1.5"/>${head(end, yRay, right)}`;
  g += `<circle cx="${x0}" cy="${yRay}" r="4.2" fill="${closed ? ink : "#fff"}" stroke="${ink}" stroke-width="1.5"/>`;
  for (const d of spec.dots || []) g += `<circle cx="${X(d)}" cy="${yAxis}" r="3" fill="#d00"/>`;
  if (spec.mark != null) g += `<circle cx="${X(spec.mark)}" cy="${yAxis}" r="3.4" fill="#d00"/>`;
  return `<svg class="nlsvg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${g}</svg>`;
}

const cache = new WeakMap();

function stepHTML(step, id, i) {
  if (step.h) return `<div class="hd">${inline(step.h)}</div>`;
  let body = cache.get(step);
    if (!body) {
    const lk = step.lk ? ` lk lk-${esc(step.lk)}` : "";
    if (step.m != null) body = `<span class="lx${lk}">${kx(`\\displaystyle ${step.m}`)}</span>`;
    else if (step.t != null) body = `<span class="lx${lk}">${inline(step.t)}</span>`;
    else if (step.note != null) body = `<span class="lx${lk}">${inline(step.note)}</span>`;
    else body = nlSvg(step.nl);
    if (step.r) body += `<span class="rs">${esc(step.r)}</span>`;
    cache.set(step, body);
  }
  const kind = step.m != null ? "m" : step.t != null ? "t" : step.note != null ? "note" : "nl";
  return `<div class="ln ${kind}" data-q="${id}" data-i="${i}" data-plain="${esc(plain(step))}">${body}</div>`;
}

function renderPlan(inner, plan, id) {
  inner.innerHTML = plan.map((b) => {
    const head = b.cont ? `<div class="hd cont">(continued)</div>` : "";
    return `<div class="abox">${head}${b.items.map((e) => stepHTML(e.step, id, e.i)).join("")}</div>`;
  }).join("");
  return [...inner.children];
}

/**
 * Absolutely positions the boxes; returns true when everything fits in W × H.
 * With `strict`, a column box that would have to wrap its lines does not fit.
 */
function place(els, plan, W, H, flow, x0, nowrap = false, strict = false) {
  let ok = true;
  if (flow === "col") {
    let colX = 0;
    let colRight = 0;
    let y = 0;
    els.forEach((el, k) => {
      const want = plan[k].box.w;
      el.style.width = want ? `${want}px` : "max-content";
      el.style.maxWidth = "none";
      const natural = el.offsetWidth;
      el.style.maxWidth = `${Math.max(60, W - colX)}px`;
      let h = el.offsetHeight;
      if (y > 0 && y + h > H) {
        colX = colRight + GAP;
        y = 0;
        el.style.maxWidth = `${Math.max(60, W - colX)}px`;
        h = el.offsetHeight;
      }
      if (strict && colX + natural > W + 0.5) ok = false;
      el.style.left = `${colX}px`;
      el.style.top = `${y}px`;
      const w = el.offsetWidth;
      colRight = Math.max(colRight, colX + w);
      y += h + GAP;
      if (colX + w > W + 0.5 || y - GAP > H + 0.5) ok = false;
    });
    return ok;
  }
  let x = 0;
  let rowTop = 0;
  let rowH = 0;
  els.forEach((el, k) => {
    const box = plan[k].box;
    if (box.left != null) x = Math.max(x, box.left - x0);
    el.style.width = box.w ? `${box.w}px` : "max-content";
    el.style.maxWidth = `${W}px`;
    let w = el.offsetWidth;
    if (x > 0 && x + w > W + 0.5) {
      if (nowrap) ok = false;
      rowTop += rowH + GAP;
      rowH = 0;
      x = box.left != null && box.left - x0 + w <= W ? box.left - x0 : 0;
    }
    if (x + w > W) {
      el.style.maxWidth = `${W - x}px`;
      w = el.offsetWidth;
    }
    el.style.left = `${x}px`;
    el.style.top = `${rowTop}px`;
    const h = el.offsetHeight;
    rowH = Math.max(rowH, h);
    x += w + GAP;
    if (rowTop + h > H + 0.5) ok = false;
  });
  return ok;
}

function usedHeight(els) {
  return els.reduce((m, el) => Math.max(m, el.offsetTop + el.offsetHeight), 0);
}

/** The first `count` lines of a plan, keeping the box structure. */
function head(plan, count) {
  const out = [];
  let n = 0;
  for (const b of plan) {
    const items = b.items.slice(0, Math.max(0, count - n));
    n += b.items.length;
    if (items.some((e) => !e.step.h)) out.push({ box: b.box, items });
  }
  return out;
}

function graphicButton(id) {
  return `<button type="button" data-act="graphic" data-q="${id}" title="Open the interactive graphic"><svg viewBox="0 0 20 20"><path d="M3 16h14M5 13l4-5 3 3 4-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
}

/** Puts the controls just right of the boxes, wrapping into columns when the region is short. */
function placeCtl(qa, els, W) {
  const ctl = qa.querySelector(".ctl");
  const count = ctl.querySelectorAll("button").length;
  const rows = Math.max(2, Math.min(count, Math.floor((qa.offsetHeight + 3) / 25)));
  const cols = Math.ceil(count / rows);
  ctl.style.setProperty("--rows", rows);
  const right = els.reduce((m, el) => Math.max(m, el.offsetLeft + el.offsetWidth), 0);
  const width = cols * 27;
  ctl.style.left = `${Math.min(right + 6, qa.offsetWidth - width)}px`;
  ctl.style.right = "auto";
  ctl.dataset.home = ctl.style.left;
}

function ctlHTML(id, cont) {
  const graphic = hasGraphic(id) ? graphicButton(id) : "";
  return `<div class="ctl">
    <button type="button" data-act="next" data-q="${id}" title="Show the next step">▸</button>
    <button type="button" data-act="all" data-q="${id}" title="Show every step">»</button>
    <button type="button" data-act="back" data-q="${id}" title="Hide the last step">◂</button>
    <button type="button" data-act="reset" data-q="${id}" title="Hide all steps">↺</button>
    ${cont ? "" : graphic}
    <span class="prog" data-q="${id}"></span>
  </div>`;
}

/** Creates the answer region, MC square and ring placeholders for one page overlay. */
export function buildOverlay(page, overlay) {
  for (const q of page.questions) {
    const sol = SOLUTION_BY_ID[q.id];
    if (!sol) continue;
    const [x0, y0, x1, y1] = q.region;
    if (sol.printed) {
      if (!hasGraphic(q.id)) continue;
      const [cx, cy] = sol.ctlAt;
      const chip = document.createElement("div");
      chip.className = "ctl printed";
      Object.assign(chip.style, { left: `${cx}px`, top: `${cy}px` });
      chip.innerHTML = graphicButton(q.id);
      overlay.append(chip);
      continue;
    }
    const qa = document.createElement("div");
    qa.className = "qa";
    qa.dataset.q = q.id;
    Object.assign(qa.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px` });
    qa.innerHTML = `<div class="qa-in"></div>${ctlHTML(q.id, false)}`;
    overlay.append(qa);
    if (q.square && sol.letter) {
      const [a, b, c, d] = q.square;
      const sq = document.createElement("div");
      sq.className = "mcl";
      sq.dataset.q = q.id;
      sq.textContent = sol.letter;
      Object.assign(sq.style, { left: `${a}px`, top: `${b}px`, width: `${c - a}px`, height: `${d - b}px` });
      overlay.append(sq);
    }
    if (q.ring) {
      const [a, b, c, d] = q.ring;
      const ring = document.createElement("div");
      ring.className = "ring";
      ring.dataset.q = q.id;
      Object.assign(ring.style, { left: `${a}px`, top: `${b}px`, width: `${c - a}px`, height: `${d - b}px` });
      overlay.append(ring);
    }
  }
}

function scales(min) {
  const list = [];
  for (let k = 1; k > min + 1e-6; k -= 0.06) list.push(Number(k.toFixed(2)));
  list.push(min);
  return list;
}

/**
 * Cuts boxes taller than H into pieces that each fit H, using the rendered line
 * heights in `els`, never leaving a part label at the bottom of a piece.
 * Null when no box needs cutting.
 */
function split(plan, els, H) {
  let any = false;
  const out = [];
  plan.forEach((b, k) => {
    const el = els[k];
    const lines = [...el.children];
    const pad = el.offsetHeight - lines.reduce((s, ln) => s + ln.offsetHeight, 0);
    const loose = { ...b.box, w: undefined, left: undefined };
    let cut = false;
    let piece = [];
    let h = pad;
    b.items.forEach((e, i) => {
      const lh = lines[i].offsetHeight;
      if (piece.some((p) => !p.step.h) && h + lh > H) {
        const carry = [];
        while (piece.length > 1 && piece[piece.length - 1].step.h) carry.unshift(piece.pop());
        out.push({ box: loose, items: piece });
        cut = any = true;
        piece = carry;
        h = pad + carry.reduce((s, c) => s + lines[b.items.indexOf(c)].offsetHeight, 0);
      }
      piece.push(e);
      h += lh;
    });
    out.push({ box: cut ? loose : b.box, items: piece });
  });
  return any ? out : null;
}

/** Fits one question into its region; returns the plan that did not fit (or null). */
function fit(q, qa) {
  const sol = SOLUTION_BY_ID[q.id];
  const [x0, y0, x1, y1] = q.region;
  const W = x1 - x0 - CTL - 2;
  const H = y1 - y0;
  const inner = qa.querySelector(".qa-in");
  inner.style.width = `${W}px`;
  const ks = scales(sol.minScale ?? 0.82);
  const full = META[q.id].boxes.map((items, k) => ({ box: sol.boxes[k], items }));
  const attempt = (plan, k) => {
    inner.style.setProperty("--k", k);
    return place(renderPlan(inner, plan, q.id), plan, W, H, sol.flow, x0, sol.nowrap);
  };
  const lean = full
    .map((b) => ({ ...b, items: b.items.filter((e) => !e.step.optional) }))
    .filter((b) => b.items.length);
  const leaner = lean.some((b, k) => b.items.length !== full[k]?.items.length) || lean.length !== full.length;
  const columns = (k) => {
    if (sol.nowrap || sol.flow === "row") return false;
    inner.style.setProperty("--k", k);
    const els = renderPlan(inner, full, q.id);
    for (const el of els) Object.assign(el.style, { width: "max-content", maxWidth: "none" });
    const cols = split(full, els, H);
    return !!cols && place(renderPlan(inner, cols, q.id), cols, W, H, "col", x0, false, true);
  };
  // Side-by-side columns read better than text below about 3/4 size, so they come first.
  const big = ks.filter((k) => k >= 0.76);
  for (const k of big) if (attempt(full, k)) return null;
  if (leaner) for (const k of big) if (attempt(lean, k)) return null;
  for (const k of big) if (columns(k)) return null;
  for (const k of ks.filter((k) => k < 0.76)) {
    if (attempt(full, k) || (leaner && attempt(lean, k)) || columns(k)) return null;
  }
  const kmin = ks[ks.length - 1];
  const count = lean.reduce((n, b) => n + b.items.length, 0);
  let lo = 1;
  let hi = count - 1;
  let best = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (attempt(head(lean, mid), kmin)) {
      best = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  attempt(head(lean, best), kmin);
  return markCont(lean, best);
}

function markCont(plan, from) {
  const out = [];
  let n = 0;
  for (const b of plan) {
    const start = n;
    const end = n + b.items.length;
    n = end;
    if (end <= from) continue;
    const items = b.items.slice(Math.max(0, from - start));
    if (!items.some((e) => !e.step.h)) continue;
    out.push({ box: { ...b.box, left: undefined }, items, cont: from > start });
  }
  return out;
}

/**
 * Lays out every answer region. Questions that overflow even at their minimum
 * scale continue on an extra sheet created by makeSheet(page) after the page.
 */
export function layoutAnswers(world, layout, makeSheet) {
  world.querySelectorAll(".sheet.continuation").forEach((s) => s.remove());
  const rest = new Map();
  for (const page of layout.pages) {
    for (const q of page.questions) {
      const qa = world.querySelector(`.qa[data-q="${q.id}"]`);
      if (!qa) continue;
      const tail = fit(q, qa);
      placeCtl(qa, [...qa.querySelector(".qa-in").children]);
      qa.classList.toggle("has-cont", !!tail);
      if (tail) {
        if (!rest.has(page.page)) rest.set(page.page, []);
        rest.get(page.page).push({ q, tail });
      }
    }
  }
  for (const [pageNo, items] of rest) {
    const sheet = makeSheet(pageNo);
    const overlay = sheet.querySelector(".overlay");
    let y = CONT.top;
    for (const { q, tail } of items) {
      const sol = SOLUTION_BY_ID[q.id];
      const title = document.createElement("div");
      title.className = "cont-title";
      title.textContent = `${q.label} (continued)`;
      Object.assign(title.style, { left: `${CONT.x}px`, top: `${y}px` });
      overlay.append(title);
      y += 20;
      const qa = document.createElement("div");
      qa.className = "qa cont";
      qa.dataset.q = q.id;
      qa.innerHTML = `<div class="qa-in"></div>${ctlHTML(q.id, true)}`;
      const W = CONT.width - CTL - 2;
      Object.assign(qa.style, { left: `${CONT.x}px`, top: `${y}px`, width: `${CONT.width}px`, height: `${CONT.bottom - y}px` });
      overlay.append(qa);
      const inner = qa.querySelector(".qa-in");
      inner.style.width = `${W}px`;
      inner.style.setProperty("--k", 1);
      const els = renderPlan(inner, tail, q.id);
      place(els, tail, W, CONT.bottom - y, sol.flow === "col" ? "row" : sol.flow, 0);
      const used = Math.max(70, usedHeight(els));
      qa.style.height = `${used}px`;
      placeCtl(qa, els);
      y += used + 26;
    }
  }
  for (const id of Object.keys(META)) {
    const lines = world.querySelectorAll(`.ln[data-q="${id}"]`);
    RENDERED[id] = [...lines].reduce((m, el) => Math.max(m, Number(el.dataset.i) + 1), 0);
  }
  return rest;
}

/** Shows the first n steps of a question; hidden steps keep their space. */
export function paint(root, id, n) {
  const total = totalSteps(id);
  root.querySelectorAll(`.ln[data-q="${id}"]`).forEach((el) => {
    const i = Number(el.dataset.i);
    el.classList.toggle("hid", i >= n);
    el.classList.toggle("next", i === n);
  });
  root.querySelectorAll(`.prog[data-q="${id}"]`).forEach((el) => {
    el.textContent = `${Math.min(n, total)}/${total}`;
  });
  const done = n >= total;
  root.querySelectorAll(`.qa[data-q="${id}"]`).forEach((el) => {
    el.classList.toggle("done", done);
    el.classList.toggle("fresh", n === 0);
  });
  root.querySelectorAll(`.mcl[data-q="${id}"], .ring[data-q="${id}"]`).forEach((el) => el.classList.toggle("show", done));
}
