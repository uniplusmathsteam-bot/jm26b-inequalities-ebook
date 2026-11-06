import { BOOK, SOLUTION_BY_ID, hasGraphic, hasGuide } from "../book.js";
import { guideButton } from "./guide.js";

const GAP = 7;
const CTL = 30;
/** Room for the scroll bar between an answer that scrolls and its controls. */
const BAR = 10;
/**
 * Type size of every answer at reader size 100%. It is the same in every
 * question: an answer that needs more room than its region scrolls inside it.
 */
const BASE = BOOK.answerScale ?? 1;

/** Per-question step metadata: global reveal index of every line (headings get -1). */
export const META = {};
for (const [id, sol] of Object.entries(SOLUTION_BY_ID)) {
  let n = 0;
  const boxes = sol.boxes.map((box) => box.steps.map((step) => ({ step, i: step.h ? -1 : n++ })));
  META[id] = { boxes, total: n };
}

/**
 * Reader's answer text size. At 1 every answer is set at BASE in its region and
 * scrolls when it needs more room. Any other size sets the type at that scale
 * and lets the region grow into a card that covers the page below it.
 */
let SIZE = 1;
export const ANSWER_SIZES = [0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];

export function setAnswerSize(f) {
  SIZE = ANSWER_SIZES.includes(f) ? f : 1;
}

export function answerSize() {
  return SIZE;
}

/** Answers on a printed grid keep their cells, so they stay fitted at every size. */
function flowable(sol) {
  return !sol.boxes.some((b) => b.steps.some((s) => s.table?.at));
}

export function totalSteps(id) {
  return META[id]?.total ?? 0;
}

/** Height of a question's answer space: its printed region plus any room the book opens below it. */
function regionHeight(q) {
  return q.region[3] - q.region[1] + (q.space || 0);
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
    } else if (src.startsWith("\\%", i)) {
      buf += "%";
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
  if (step.tree) return `Possible outcomes: ${treeNodes(step.tree).leaves.join("; ")}`;
  if (step.table) return step.table.rows.map((row) => row.filter((v) => v != null && v !== "").join(" | ")).join("; ");
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

const TF = 11;
// Same stack as --font-serif in styles.css; Tinos and Liberation Serif share Times' metrics.
const SERIF = `"Times New Roman", Times, Tinos, "Liberation Serif", serif`;
let measure;
function textW(s, bold = false) {
  measure ??= document.createElement("canvas").getContext("2d");
  measure.font = `${bold ? "700 " : ""}${TF}px ${SERIF}`;
  return measure.measureText(s).width;
}

/** Nodes of a tree spec, with leaves in reading order and each leaf's outcome text. */
function treeNodes(spec) {
  const leaves = [];
  const levels = [];
  const walk = (list, depth, path) => list.map((n) => {
    const [label, kids] = Array.isArray(n) ? n : [n, null];
    const node = { label: String(label), depth };
    (levels[depth] ??= []).push(node);
    if (kids?.length) node.kids = walk(kids, depth + 1, [...path, node.label]);
    else {
      node.leaf = leaves.length;
      leaves.push(spec.out?.[leaves.length] ?? [...path, node.label].join(spec.sep ?? ""));
    }
    return node;
  });
  return { roots: walk(spec.kids, 0, []), levels, leaves };
}

function treeSvg(spec) {
  const ink = "#111";
  const DY = 15;
  const BR = 30;
  const DOTS = 46;
  const { roots, levels, leaves } = treeNodes(spec);
  const top = spec.cols || spec.label ? 19 : 3;
  const colW = levels.map((l) => Math.max(...l.map((n) => textW(n.label))));
  const cols = spec.cols || [];
  const headW = (d) => (cols[d] ? textW(cols[d], true) / 2 : 0);
  const labelR = spec.label ? 2 + textW(spec.label, true) : 0;
  let headR = labelR ? labelR - 2 : -Infinity;
  const clear = (at, d) => {
    if (!cols[d]) return at;
    at = Math.max(at, headR + 8 + headW(d));
    headR = at + headW(d);
    return at;
  };
  const cx = [];
  let x = 4 + BR;
  colW.forEach((w, d) => {
    cx[d] = clear(x + w / 2, d);
    x = cx[d] + w / 2 + BR;
  });
  const outW = Math.max(...leaves.map((s) => textW(s)));
  const xOut = clear(x - BR + DOTS + outW / 2, colW.length) - outW / 2;
  const mark = new Set(spec.mark || []);
  const setY = (n) => {
    if (n.kids) {
      n.kids.forEach(setY);
      n.y = (n.kids[0].y + n.kids[n.kids.length - 1].y) / 2;
    } else n.y = top + n.leaf * DY + DY / 2;
  };
  roots.forEach(setY);
  const line = (x1, y1, x2, y2, dash = "") => `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${ink}" stroke-width="0.9"${dash}/>`;
  const text = (s, x, y, anchor, extra = "") => `<text x="${x.toFixed(1)}" y="${(y + 3.8).toFixed(1)}" text-anchor="${anchor}"${extra}>${esc(s)}</text>`;
  let g = "";
  const draw = (list, fromX, fromY) => list.forEach((n) => {
    const half = textW(n.label) / 2;
    g += line(fromX, fromY, cx[n.depth] - half - 3, n.y);
    g += text(n.label, cx[n.depth], n.y, "middle");
    const right = cx[n.depth] + half + 3;
    if (n.kids) draw(n.kids, right, n.y);
    else {
      g += line(right + 4, n.y, xOut - 6, n.y, ` stroke-dasharray="2.6 2.4"`);
      const hit = mark.has(n.leaf) || mark.has(leaves[n.leaf]);
      g += text(leaves[n.leaf], xOut, n.y, "start", hit ? ` fill="#d00"` : "");
    }
  });
  draw(roots, 4, (roots[0].y + roots[roots.length - 1].y) / 2);
  let w = xOut + outW + 3;
  const bold = ` font-weight="700"`;
  if (spec.label) g += text(spec.label, 2, 7, "start", bold);
  if (spec.cols) {
    spec.cols.forEach((c, d) => {
      const at = d < cx.length ? cx[d] : xOut + outW / 2;
      w = Math.max(w, at + textW(c, true) / 2 + 3);
      g += text(c, at, 7, "middle", bold);
    });
  }
  const h = top + leaves.length * DY + 2;
  return `<svg class="trsvg" viewBox="0 0 ${w.toFixed(1)} ${h}" style="width:calc(${w.toFixed(1)}px * var(--k));height:calc(${h}px * var(--k))" font-family='${SERIF}' font-size="${TF}" fill="${ink}">${g}</svg>`;
}

/**
 * A table of outcomes. With `at: { xs, ys }` (page points of the printed grid lines) the
 * cells sit on a grid that is already printed; otherwise the whole table is drawn.
 */
function tableHTML(spec) {
  const cells = (list) => new Set((list || []).map(([r, c]) => `${r},${c}`));
  const strike = cells(spec.strike);
  const hl = cells(spec.hl);
  const content = (v) => (v == null || v === "" ? "" : `<span>${inline(String(v))}</span>`);
  const at = spec.at;
  const head = at ? 0 : spec.head ?? 1;
  const side = at ? 0 : spec.side ?? 1;
  const cls = (v, r, c) => {
    const k = `${r},${c}`;
    const list = [];
    if (r < head || c < side) list.push(r < head && c < side && (v == null || v === "") ? "corner" : "th");
    if (strike.has(k)) list.push("x");
    if (hl.has(k)) list.push("hl");
    if (spec.u && r >= head && c >= side) list.push("u");
    return list.length ? ` class="${list.join(" ")}"` : "";
  };
  if (at) {
    const { xs, ys } = at;
    const body = spec.rows.map((row, r) => row.map((v, c) => {
      const box = `left:${xs[c] - xs[0]}px;top:${ys[r] - ys[0]}px;width:${xs[c + 1] - xs[c]}px;height:${ys[r + 1] - ys[r]}px`;
      return `<div${cls(v, r, c).replace('class="', 'class="tc ') || ' class="tc"'} style="${box}">${content(v)}</div>`;
    }).join("")).join("");
    return `<div class="tbo" style="width:${xs[xs.length - 1] - xs[0]}px;height:${ys[ys.length - 1] - ys[0]}px">${body}</div>`;
  }
  const body = spec.rows.map((row, r) => `<tr>${row.map((v, c) => `<td${cls(v, r, c)}>${content(v)}</td>`).join("")}</tr>`).join("");
  const topCap = spec.top ? `<div class="tcap">${inline(spec.top)}</div>` : "";
  const leftCap = spec.left ? `<div class="lcap">${inline(spec.left)}</div>` : "";
  return `<div class="tb">${topCap}${leftCap}<table class="tbl">${body}</table></div>`;
}

const cache = new WeakMap();

/** Pieces of one equation, split before each top-level "=" so a narrow column can wrap there. */
function mathSegments(src) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") { i++; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === "=" && depth <= 0 && src.slice(start, i).trim()) {
      parts.push(src.slice(start, i).trim());
      start = i;
    }
  }
  const last = src.slice(start).trim();
  if (last) parts.push(last);
  return parts.length ? parts : [src];
}

function stepHTML(step, id, i, wrap = false) {
  if (step.h) return `<div class="hd">${inline(step.h)}</div>`;
  let body = wrap ? null : cache.get(step);
  if (!body) {
    const lk = step.lk ? ` lk lk-${esc(step.lk)}` : "";
    if (step.m != null) {
      const parts = wrap ? mathSegments(step.m) : [step.m];
      body = parts.length > 1
        ? `<span class="lx${lk} segs">${parts.map((p) => `<span class="seg">${kx(`\\displaystyle ${p}`)}</span>`).join("")}</span>`
        : `<span class="lx${lk}">${kx(`\\displaystyle ${step.m}`)}</span>`;
    } else if (step.t != null) body = `<span class="lx${lk}">${inline(step.t)}</span>`;
    else if (step.note != null) body = `<span class="lx${lk}">${inline(step.note)}</span>`;
    else if (step.tree || step.table) {
      body = step.tree ? treeSvg(step.tree) : tableHTML(step.table);
      if (lk) body = `<span class="lx${lk}">${body}</span>`;
    } else body = nlSvg(step.nl);
    if (step.r) body += `<span class="rs">${esc(step.r)}</span>`;
    if (!wrap) cache.set(step, body);
  }
  const kind = step.m != null ? "m" : step.t != null ? "t" : step.note != null ? "note" : step.tree ? "tree" : step.table ? "table" : "nl";
  return `<div class="ln ${kind}" data-q="${id}" data-i="${i}" data-plain="${esc(plain(step))}">${body}</div>`;
}

function renderPlan(inner, plan, id, wrap = false) {
  inner.innerHTML = plan.map((b) => `<div class="abox${b.box.bare ? " bare" : ""}">${b.items.map((e) => stepHTML(e.step, id, e.i, wrap)).join("")}</div>`).join("");
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
      const span = Math.max(w, inkWidth(el));
      colRight = Math.max(colRight, colX + span);
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
    const span = () => Math.max(el.offsetWidth, inkWidth(el));
    if (x > 0 && x + span() > W + 0.5) {
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
    x += span() + GAP;
    if (rowTop + h > H + 0.5) ok = false;
  });
  return ok;
}

/**
 * Side-by-side boxes whose lines are too long for the region at this size.
 * Each equation may break before an equals sign, so the type does not have to
 * shrink to the width of the longest unwrapped line. False when a piece still
 * overflows or the wrapped boxes are taller than the region.
 */
function placeWrap(els, plan, W, H) {
  if (plan.some((b) => b.box.left != null || b.box.w || b.box.bare)) return false;
  const info = els.map((el) => {
    el.style.width = "max-content";
    el.style.maxWidth = "none";
    const natural = Math.max(el.offsetWidth, inkWidth(el));
    const segs = [...el.querySelectorAll(".seg")];
    if (!segs.length) return { el, natural, floor: natural };
    const pad = parseFloat(getComputedStyle(el).paddingLeft) + parseFloat(getComputedStyle(el).paddingRight);
    const floor = Math.min(natural, Math.max(...segs.map((s) => s.offsetWidth)) + pad + 2);
    return { el, natural, floor };
  });
  if (!info.some((i) => i.floor < i.natural - 1)) return false;
  const gaps = GAP * Math.max(0, info.length - 1);
  const floorSum = info.reduce((s, i) => s + i.floor, 0);
  if (floorSum + gaps > W + 0.5) return false;
  let extra = W - gaps - floorSum;
  const slack = info.map((i) => i.natural - i.floor);
  const slackSum = slack.reduce((s, w) => s + w, 0);
  const widths = info.map((i, n) => i.floor + (slackSum > 0 ? Math.min(slack[n], extra * slack[n] / slackSum) : 0));
  let x = 0;
  let rowTop = 0;
  let rowH = 0;
  for (let n = 0; n < info.length; n++) {
    const { el } = info[n];
    if (x > 0 && x + widths[n] > W + 0.5) {
      rowTop += rowH + GAP;
      rowH = 0;
      x = 0;
    }
    const w = Math.max(60, Math.min(widths[n], W - x));
    el.style.width = `${w}px`;
    el.style.maxWidth = `${w}px`;
    if (el.scrollWidth > el.clientWidth + 3 || inkWidth(el) > w + 3) return false;
    const h = el.offsetHeight;
    el.style.left = `${x}px`;
    el.style.top = `${rowTop}px`;
    rowH = Math.max(rowH, h);
    x += w + GAP;
    if (rowTop + h > H + 0.5) return false;
  }
  return true;
}

/** Right edge of a box in its own coordinates, including a reason past the border. */
function inkWidth(el) {
  let right = el.offsetWidth;
  const border = el.clientLeft;
  for (const rs of el.querySelectorAll(".rs")) {
    const ln = rs.parentElement;
    right = Math.max(right, border + ln.offsetLeft + rs.offsetLeft + rs.offsetWidth);
  }
  return right;
}

function graphicButton(id) {
  return `<button type="button" data-act="graphic" data-q="${id}" title="Open the interactive graphic"><svg viewBox="0 0 20 20"><path d="M3 16h14M5 13l4-5 3 3 4-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
}

/** The control grid for a region `h` tall: the buttons wrap into columns when it is short. */
function ctlGrid(qa, h) {
  const count = qa.querySelectorAll(".ctl button").length;
  const rows = Math.max(2, Math.min(count, Math.floor((h + 3) / 25)));
  const cols = Math.ceil(count / rows);
  // In a short region the step counter would hang well below the buttons, over the next question.
  const side = rows * 25 + 12 > h + 13;
  return { rows, side, width: cols * 27 };
}

/**
 * Puts the controls just right of the boxes; a side counter may stick out past
 * the region. An answer that scrolls is clipped at its right edge, with the
 * scroll bar between it and the controls.
 */
function placeCtl(qa, els) {
  const ctl = qa.querySelector(".ctl");
  const { rows, side, width } = ctlGrid(qa, qa.offsetHeight);
  ctl.style.setProperty("--rows", rows);
  ctl.classList.toggle("side", side);
  const right = els.reduce((m, el) => Math.max(m, el.offsetLeft + inkWidth(el)), 0);
  const bar = qa.classList.contains("scroll") ? BAR : 0;
  if (bar) {
    qa.querySelector(".qa-in").style.width = `${Math.ceil(right) + 2}px`;
    qa.querySelector(".qa-bar").style.left = `${Math.ceil(right) + 3}px`;
  }
  const limit = qa.offsetWidth - width - (side ? 24 : 0);
  let left = Math.min(right + 6 + bar, limit);
  if (left < right + 2 + bar) left = right + 6 + bar;
  ctl.style.left = `${left}px`;
  ctl.style.right = "auto";
  ctl.dataset.home = ctl.style.left;
}

function ctlHTML(id) {
  return `<div class="ctl">
    <button type="button" data-act="next" data-q="${id}" title="Show the next step">▸</button>
    <button type="button" data-act="all" data-q="${id}" title="Show every step">»</button>
    <button type="button" data-act="back" data-q="${id}" title="Hide the last step">◂</button>
    <button type="button" data-act="reset" data-q="${id}" title="Hide all steps">↺</button>
    ${hasGraphic(id) ? graphicButton(id) : ""}
    ${hasGuide(id) ? guideButton(id) : ""}
    <span class="prog" data-q="${id}"></span>
  </div>`;
}

let scrolled = null;

/** `fn(id)` runs whenever an answer scrolls, so its review links can follow. */
export function onAnswerScroll(fn) {
  scrolled = fn;
}

/** The scrolling window of the answer under `target`, or null when that answer fits its region. */
export function answerScroller(target) {
  return target?.closest?.(".qa.scroll")?.querySelector(".qa-in") ?? null;
}

/** Sizes and places the scroll bar's thumb for the answer's current position. */
function syncBar(qa) {
  if (!qa.classList.contains("scroll")) return;
  const inner = qa.querySelector(".qa-in");
  const thumb = qa.querySelector(".qa-bar i");
  const H = inner.clientHeight;
  const max = Math.max(0, inner.scrollHeight - H);
  const h = Math.max(18, (H * H) / (H + max));
  Object.assign(thumb.style, { height: `${h}px`, top: `${max ? ((H - h) * inner.scrollTop) / max : 0}px` });
  qa.classList.toggle("at-end", inner.scrollTop >= max - 1);
}

/** Press anywhere on the bar to bring the thumb there, then drag it. */
function bindBar(qa) {
  const bar = qa.querySelector(".qa-bar");
  const inner = qa.querySelector(".qa-in");
  bar.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const thumb = bar.firstElementChild;
    const rect = bar.getBoundingClientRect();
    const k = rect.height / bar.offsetHeight || 1;
    const room = bar.offsetHeight - thumb.offsetHeight || 1;
    const max = inner.scrollHeight - inner.clientHeight;
    const grab = event.target === thumb ? (event.clientY - thumb.getBoundingClientRect().top) / k : thumb.offsetHeight / 2;
    const move = (e) => {
      const y = (e.clientY - rect.top) / k - grab;
      inner.scrollTop = max * Math.max(0, Math.min(1, y / room));
    };
    const stop = () => {
      bar.classList.remove("drag");
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", stop);
      bar.removeEventListener("pointercancel", stop);
    };
    bar.setPointerCapture(event.pointerId);
    bar.classList.add("drag");
    move(event);
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
  });
}

/**
 * Scrolls every window of answer `id` after its shown steps went from `from` to
 * `to`: the newly shown steps come into view, with the next grey bar when there
 * is room, and showing everything at once starts from the top.
 */
export function keepInView(root, id, from, to, smooth = true) {
  for (const qa of root.querySelectorAll(`.qa.scroll[data-q="${id}"]`)) {
    const inner = qa.querySelector(".qa-in");
    const H = inner.clientHeight;
    const view = inner.getBoundingClientRect();
    const k = view.height / H || 1;
    const span = (list) => {
      const rects = list.map((i) => inner.querySelector(`.ln[data-i="${i}"]`)?.getBoundingClientRect()).filter(Boolean);
      if (!rects.length) return null;
      const y = (v) => (v - view.top) / k + inner.scrollTop;
      return [y(Math.min(...rects.map((r) => r.top))), y(Math.max(...rects.map((r) => r.bottom)))];
    };
    const pad = 6;
    let top = inner.scrollTop;
    const shown = to > from ? Array.from({ length: to - from }, (_, n) => from + n) : [to - 1];
    const fresh = to > 0 ? span(shown) : null;
    if (!fresh) top = 0;
    else {
      const next = span([to]);
      const want = next ? [Math.min(fresh[0], next[0]), Math.max(fresh[1], next[1])] : fresh;
      const [a, b] = want[1] - want[0] + 2 * pad <= H ? want : fresh;
      if (b - a + 2 * pad > H) top = a - pad;
      else if (b + pad > top + H) top = b + pad - H;
      else if (a - pad < top) top = a - pad;
    }
    const max = inner.scrollHeight - H;
    inner.scrollTo({ top: Math.max(0, Math.min(max, top)), behavior: smooth ? "smooth" : "auto" });
  }
}

/** Creates the answer region, MC square and ring placeholders for one page overlay. */
export function buildOverlay(page, overlay) {
  for (const q of page.questions) {
    const sol = SOLUTION_BY_ID[q.id];
    if (!sol) continue;
    const [x0, y0, x1, y1] = q.region;
    if (sol.printed) {
      if (!hasGraphic(q.id) && !hasGuide(q.id)) continue;
      const [cx, cy] = sol.ctlAt;
      const chip = document.createElement("div");
      chip.className = "ctl printed";
      Object.assign(chip.style, { left: `${cx}px`, top: `${cy}px` });
      chip.innerHTML = (hasGraphic(q.id) ? graphicButton(q.id) : "") + (hasGuide(q.id) ? guideButton(q.id) : "");
      overlay.append(chip);
      continue;
    }
    const qa = document.createElement("div");
    qa.className = "qa";
    qa.dataset.q = q.id;
    Object.assign(qa.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px` });
    qa.innerHTML = `<div class="qa-in"></div><div class="qa-bar" title="Drag to scroll the answer"><i></i></div>${ctlHTML(q.id)}`;
    qa.querySelector(".qa-in").addEventListener("scroll", () => {
      syncBar(qa);
      scrolled?.(q.id);
    }, { passive: true });
    bindBar(qa);
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

/**
 * Sets one answer at the book's type size. It keeps the authored layout when
 * that fits the region, then tries long equations broken before "=", then tall
 * boxes cut into side-by-side columns; otherwise the answer scrolls in its region.
 */
function fit(page, q, qa) {
  const sol = SOLUTION_BY_ID[q.id];
  const full = META[q.id].boxes.map((items, k) => ({ box: sol.boxes[k], items }));
  const parts = partColumns(page, q, full);
  if (parts) {
    layoutParts(q, qa, parts, BASE, "scroll");
    return;
  }
  const x0 = q.region[0];
  const H = regionHeight(q);
  // One control column stays clear. Extra button columns may sit past the
  // region, so a reason can remain beside its step instead of leaving the box.
  const W = q.region[2] - x0 - CTL - 2;
  const inner = qa.querySelector(".qa-in");
  inner.style.width = `${W}px`;
  inner.style.setProperty("--k", BASE);
  const fractions = full.some((b) => b.items.some((e) => /\\[dt]?frac/.test(e.step.m ?? "")));
  const attempt = (tight) => {
    qa.classList.toggle("tight", tight);
    return place(renderPlan(inner, full, q.id), full, W, H, sol.flow, x0, sol.nowrap);
  };
  const attemptWrap = (tight) => {
    if (sol.nowrap || sol.flow === "col" || sol.flow === "row") return false;
    qa.classList.toggle("tight", tight);
    return placeWrap(renderPlan(inner, full, q.id, true), full, W, H);
  };
  const columns = (tight) => {
    if (sol.nowrap || sol.flow === "row") return false;
    qa.classList.toggle("tight", tight);
    const els = renderPlan(inner, full, q.id);
    for (const el of els) Object.assign(el.style, { width: "max-content", maxWidth: "none" });
    const cols = split(full, els, H);
    return !!cols && place(renderPlan(inner, cols, q.id), cols, W, H, "col", x0, false, true);
  };
  // Stacked fractions keep their breathing room unless only the tight spacing fits.
  for (const tryIt of [attempt, attemptWrap, columns]) {
    if (tryIt(false) || (fractions && tryIt(true))) {
      placeCtl(qa, [...inner.children]);
      return;
    }
  }
  flowFit(q, qa, BASE, "scroll");
}

/**
 * Sets the whole answer at type size k in rows across the region, each equation
 * free to break before an equals sign (see fitInWidth). "grow" makes the
 * region as tall as the answer (growSheet() then opens
 * the page below it); "scroll" keeps the region and lets the answer scroll.
 */
function flowFit(q, qa, k, mode) {
  const sol = SOLUTION_BY_ID[q.id];
  const bar = mode === "scroll" ? BAR : 0;
  const inner = qa.querySelector(".qa-in");
  qa.classList.remove("tight");
  inner.style.setProperty("--k", k);
  const full = META[q.id].boxes.map((items, n) => ({ box: sol.boxes[n], items }));
  const draw = (wide) => {
    const W = answerRight(q, qa, bar, wide);
    inner.style.width = `${W}px`;
    const els = renderPlan(inner, full, q.id, true);
    let x = 0;
    let rowTop = 0;
    let rowH = 0;
    let cost = 0;
    for (const el of els) {
      cost += fitInWidth(el, W, k);
      const w = Math.max(el.offsetWidth, inkWidth(el));
      if (x > 0 && x + w > W + 0.5) {
        rowTop += rowH + GAP;
        rowH = 0;
        x = 0;
      }
      el.style.left = `${x}px`;
      el.style.top = `${rowTop}px`;
      rowH = Math.max(rowH, el.offsetHeight);
      x += w + GAP;
    }
    return { els, used: rowTop + rowH + 4, cost };
  };
  let out = draw(false);
  if (out.cost) {
    const wide = draw(true);
    out = wide.cost < out.cost ? wide : draw(false);
  }
  finish(q, qa, out.els, out.used, mode);
}

/**
 * Right edge of the answer, in region coordinates. `wide` lets the answer use
 * the strip kept for the step buttons, which then sit in the page margin, so a
 * reason can stay beside its step.
 */
function answerRight(q, qa, bar, wide) {
  const x0 = q.region[0];
  const right = q.region[2] - x0 - CTL - 2;
  if (!wide) return right - bar;
  const { width, side } = ctlGrid(qa, regionHeight(q));
  return Math.max(right, PAGE_W - 4 - width - (side ? 24 : 0) - 6 - x0) - bar;
}

/**
 * Keeps a box within W, giving up as little as it can. Returns what that cost:
 * 0 nothing breaks, 1 a step breaks before "=" with its reason beside its last
 * row, 2 a reason drops under its step, 3 a line that cannot break (a wide
 * fraction, table or tree) gives the box a smaller type of its own.
 */
function fitInWidth(el, W, k) {
  el.classList.add("wrap");
  el.style.width = "max-content";
  el.style.maxWidth = "none";
  const wide = () => Math.max(el.offsetWidth, el.scrollWidth, inkWidth(el));
  const fits = wide() <= W + 0.5;
  el.style.maxWidth = `${W}px`;
  if (fits) return 0;
  let cost = 1;
  for (const ln of el.querySelectorAll(".ln")) {
    const rs = ln.querySelector(":scope > .rs");
    if (!rs) continue;
    const lx = ln.querySelector(":scope > .lx.segs");
    const over = ln.scrollWidth > ln.clientWidth + 0.5;
    const broken = lx && lx.lastElementChild.offsetTop > lx.firstElementChild.offsetTop + 1;
    if ((over || broken) && tuck(ln, lx, rs)) continue;
    if (over) {
      ln.classList.add("drop");
      cost = 2;
    }
  }
  const w = wide();
  if (w <= W + 0.5) return cost;
  el.style.setProperty("--k", Math.max(0.5, k * (W / w)).toFixed(3));
  return 3;
}

/** Moves a broken step's reason to the end of its last row, on that row's baseline. False when it has no room there. */
function tuck(ln, lx, rs) {
  if (!lx) return false;
  const cs = getComputedStyle(ln);
  const gap = parseFloat(cs.columnGap) + parseFloat(getComputedStyle(rs).marginLeft);
  const room = ln.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - rs.offsetWidth - gap;
  if (lx.lastElementChild.offsetWidth > room) return false;
  ln.classList.add("tuck");
  lx.style.width = `${room}px`;
  const last = lx.lastElementChild;
  const baseline = (host) => {
    const probe = document.createElement("i");
    probe.className = "baseline";
    host.append(probe);
    const y = probe.offsetTop;
    probe.remove();
    return y;
  };
  rs.style.left = `${last.offsetLeft + last.offsetWidth + gap - parseFloat(getComputedStyle(rs).marginLeft)}px`;
  rs.style.top = "0px";
  rs.style.top = `${baseline(last) - baseline(rs)}px`;
  return true;
}

/** Makes the region as tall as the answer ("grow"), or lets an answer taller than its region scroll. */
function finish(q, qa, els, used, mode) {
  const H = regionHeight(q);
  if (mode === "grow") {
    qa.classList.add("flow");
    qa.flowUsed = used;
    qa.style.height = `${Math.max(H, used)}px`;
  } else {
    qa.classList.toggle("scroll", used > H + 0.5);
    qa.querySelector(".qa-in").style.setProperty("--used", `${Math.ceil(used)}px`);
  }
  placeCtl(qa, els);
}

const PART = /^\([a-h]\)$/;

/**
 * Parts printed side by side ("(a)" … "(b)" on one row of the question, the
 * first at the left margin): each part's boxes go in the column under its own
 * label. Null when the parts are printed one under another, or the boxes do not
 * open with those labels.
 */
function partColumns(page, q, plan) {
  const top = q.anchor ? q.anchor[0] : q.region[1];
  let labels = null;
  for (const [y0, , words] of page.text || []) {
    if (y0 < top - 2 || y0 > q.region[1]) continue;
    const row = words.filter((w) => PART.test(w[2]));
    if (row.length > 1 && row[0][0] < q.region[0] + 30 && row.every((w, i) => !i || w[0] - row[i - 1][0] > 90)) {
      labels = row.map((w) => ({ x: w[0], label: w[2] }));
      break;
    }
  }
  if (!labels) return null;
  const pieces = [];
  for (const b of plan) {
    const box = { ...b.box, w: undefined, left: undefined };
    let piece = null;
    for (const e of b.items) {
      const col = e.step.h ? labels.findIndex((l) => e.step.h.trim().startsWith(l.label)) : -1;
      if (!piece || (col >= 0 && piece.items.some((i) => !i.step.h))) {
        piece = { box, items: [], col: col >= 0 ? col : pieces.at(-1)?.col ?? -1 };
        pieces.push(piece);
      }
      piece.items.push(e);
    }
  }
  const cols = new Set(pieces.map((p) => p.col));
  return cols.has(-1) || cols.size !== labels.length ? null : { labels, pieces };
}

/** Left and right edges of each part's column, in region coordinates; the last column ends at `right`. */
function partBounds(q, labels, right) {
  const x0 = q.region[0];
  return labels.map((l, i) => ({
    x: Math.max(0, l.x - 4 - x0),
    r: i + 1 < labels.length ? labels[i + 1].x - 4 - x0 - GAP : right,
  }));
}

/** Each part's boxes stacked in the column under its printed label, at type size k. */
function layoutParts(q, qa, parts, k, mode) {
  const inner = qa.querySelector(".qa-in");
  qa.classList.remove("tight");
  inner.style.setProperty("--k", k);
  const draw = (bar, wide) => {
    const cols = partBounds(q, parts.labels, answerRight(q, qa, bar, wide));
    inner.style.width = `${cols[cols.length - 1].r}px`;
    const els = renderPlan(inner, parts.pieces, q.id, true);
    const y = cols.map(() => 0);
    let cost = 0;
    els.forEach((el, n) => {
      const { col } = parts.pieces[n];
      cost += fitInWidth(el, cols[col].r - cols[col].x, k);
      Object.assign(el.style, { left: `${cols[col].x}px`, top: `${y[col]}px` });
      y[col] += el.offsetHeight + GAP;
    });
    return { els, used: Math.max(...y) - GAP + 4, cost };
  };
  const attempt = (wide) => {
    const out = draw(0, wide);
    return mode === "scroll" && out.used > regionHeight(q) + 0.5 ? draw(BAR, wide) : out;
  };
  let out = attempt(false);
  if (out.cost) {
    const wide = attempt(true);
    out = wide.cost < out.cost ? wide : attempt(false);
  }
  finish(q, qa, out.els, out.used, mode);
}

const PAGE_W = 595.32;
const PAGE_H = 841.92;
/** Per page image: 1 for each point row that is blank across the whole page. */
const BLANK = new Map();
let rowsReady = null;

/** Called once a page image that a reflow had to guess at has loaded. */
export function onPageRows(fn) {
  rowsReady = fn;
}

function blankRows(img) {
  if (BLANK.has(img.src)) return BLANK.get(img.src);
  if (!img.complete || !img.naturalWidth) {
    img.addEventListener("load", () => rowsReady?.(), { once: true });
    return null;
  }
  const w = Math.round(PAGE_W);
  const h = Math.round(PAGE_H);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  let data;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    BLANK.set(img.src, null);
    return null;
  }
  const rows = new Uint8Array(h);
  for (let y = 0; y < h; y++) {
    let blank = 1;
    for (let x = 3, i = (y * w + 3) * 4; x < w - 3; x++, i += 4) {
      if (data[i] + data[i + 1] + data[i + 2] < 600) {
        blank = 0;
        break;
      }
    }
    rows[y] = blank;
  }
  BLANK.set(img.src, rows);
  return rows;
}

/**
 * Where to open the page for a region that grows: its bottom edge, or the
 * lowest blank row above it when a figure or option list beside the region
 * crosses that edge, so the printed page is never torn through its ink.
 */
function cutFor(rows, y0, y1) {
  if (!rows) return y1;
  const clear = (y) => rows[y - 1] && rows[y] && rows[y + 1];
  for (let y = Math.min(rows.length - 2, Math.round(y1)); y > y0 + 2; y--) if (clear(y)) return y;
  return y1;
}

/**
 * Opens room in a page under every region with authored space (`space` in
 * layout.json) or that grew with the reader's text size: the page image is cut
 * into slices and everything on the overlay below a cut moves down with it.
 * Authored space is always cut at the region's own bottom edge, so ink drawn
 * on that sheet stays put. Room opened for the reader's size depends on the
 * text, so a sheet that has grown that way hides its ink until the answers are
 * back at 100%.
 */
function growSheet(sheet, page) {
  const img = sheet.querySelector("img.bg");
  const cuts = [];
  let grown = false;
  for (const q of page.questions) {
    const room = q.space || 0;
    const qa = sheet.querySelector(`.qa.flow[data-q="${q.id}"]`);
    const extra = qa ? qa.flowUsed - regionHeight(q) : 0;
    if (extra > 0.5) grown = true;
    const d = room + Math.max(0, extra);
    if (d > 0.5) cuts.push({ y: room ? q.region[3] : cutFor(blankRows(img), q.region[1], q.region[3]), d: Math.ceil(d) });
  }
  cuts.sort((a, b) => a.y - b.y);
  // Regions side by side end at about the same height: one gap, as tall as the taller needs.
  const merged = [];
  for (const c of cuts) {
    const last = merged[merged.length - 1];
    if (last && c.y - last.y < 3) last.d = Math.max(last.d, c.d);
    else merged.push({ ...c });
  }
  const shift = (y) => merged.reduce((s, c) => (y >= c.y ? s + c.d : s), 0);
  sheet.shiftY = merged.length ? (y) => y + shift(y) : null;
  sheet.classList.toggle("grown", grown);
  sheet.style.height = `${PAGE_H + merged.reduce((s, c) => s + c.d, 0)}px`;
  for (const el of sheet.querySelector(".overlay").children) {
    if (el.classList.contains("rev")) continue;
    if (!("y" in el.dataset)) el.dataset.y = parseFloat(el.style.top) || 0;
    const y = Number(el.dataset.y);
    el.style.top = `${y + shift(y)}px`;
  }
  sheet.querySelectorAll(".bg-slice").forEach((s) => s.remove());
  img.hidden = merged.length > 0;
  if (!merged.length) return;
  let from = 0;
  let off = 0;
  let after = img;
  for (const c of [...merged, { y: PAGE_H, d: 0 }]) {
    const slice = document.createElement("div");
    slice.className = "bg-slice";
    slice.dataset.from = from;
    slice.dataset.to = c.y;
    Object.assign(slice.style, { top: `${from + off}px`, height: `${c.y - from}px` });
    const part = document.createElement("img");
    part.src = img.src;
    part.alt = "";
    part.draggable = false;
    part.style.top = `${-from}px`;
    slice.append(part);
    after.after(slice);
    after = slice;
    off += c.d;
    from = c.y;
  }
}

/**
 * Lays out every answer region at the book's type size (scrolling where an
 * answer needs more room), or at the reader's size with the page opened up,
 * then opens each page under its regions.
 */
export function layoutAnswers(world, layout) {
  for (const page of layout.pages) {
    for (const q of page.questions) {
      const qa = world.querySelector(`.qa[data-q="${q.id}"]`);
      if (!qa) continue;
      qa.classList.remove("flow", "scroll");
      qa.style.height = `${regionHeight(q)}px`;
      const sol = SOLUTION_BY_ID[q.id];
      if (SIZE !== 1 && flowable(sol)) {
        const full = META[q.id].boxes.map((items, k) => ({ box: sol.boxes[k], items }));
        const parts = partColumns(page, q, full);
        if (parts) layoutParts(q, qa, parts, BASE * SIZE, "grow");
        else flowFit(q, qa, BASE * SIZE, "grow");
      } else fit(page, q, qa);
      syncBar(qa);
    }
    const sheet = world.querySelector(`.sheet[data-key="p${page.page}"]`);
    if (sheet) growSheet(sheet, page);
  }
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
