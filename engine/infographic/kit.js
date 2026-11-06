/**
 * Whiteboard infographics: a question's scenario drawn like a teacher's
 * marker sketch. A board is { title, w, h, items }, and `items` is built from
 * the helpers below (text, arrow, bar, flow, table ...). Items draw in order;
 * `with` starts an item together with the one before it, and `step()` makes the
 * rest wait for the presenter. See docs/06-infographics.md.
 */

const NS = "http://www.w3.org/2000/svg";

export const COL = {
  ink: "#26313d",
  blue: "#2463c9",
  red: "#d42f37",
  green: "#178a49",
  orange: "#d97400",
  purple: "#7440c0",
  pink: "#cf3580",
  grey: "#7d8793",
};

export const MARK = {
  yellow: "rgba(255, 221, 30, 0.55)",
  pink: "rgba(255, 110, 190, 0.40)",
  green: "rgba(110, 215, 110, 0.45)",
  blue: "rgba(110, 165, 245, 0.42)",
  orange: "rgba(255, 165, 60, 0.48)",
};

const col = (c) => COL[c] || c || COL.ink;
const mark = (c) => MARK[c] || c || MARK.yellow;

/* ---------- builders ---------- */

/** Board heading with a highlighter swipe under it. */
export function title(str, o = {}) {
  return { k: "text", str, x: o.x ?? 24, y: o.y ?? 44, size: o.size ?? 30, color: o.color ?? "ink", under: o.mark ?? "yellow", ...o };
}

/* A letter the hand font draws like a digit (I next to 1) is set as a serif italic variable. */
const VAR_FONT = '"Times New Roman", Times, serif';

/**
 * Handwritten text. `{blue:words}` colours part of the line; `{v:I}` sets a
 * variable in serif italic.
 * Options: size, color, anchor ("start" | "middle" | "end"), mark (highlighter
 * behind), ring (marker loop round it), after (continue the previous line).
 */
export function text(x, y, str, o = {}) {
  return { k: "text", str, x, y, size: 22, color: "ink", anchor: "start", ...o };
}

/** Continue the previous text on the same baseline, at its size. */
export function then(str, o = {}) {
  return { k: "text", str, after: true, color: "ink", ...o };
}

/** The answer of a line: red, highlighted and continuing the line. */
export function ans(str, o = {}) {
  return then(str, { color: "red", mark: "yellow", ...o });
}

/** Stacked fraction; `x` omitted continues the previous text. */
export function frac(num, den, o = {}) {
  return { k: "frac", num: String(num), den: String(den), size: 20, color: "ink", after: o.x == null, ...o };
}

/** Several lines of text, one under the other. */
export function lines(x, y, list, o = {}) {
  const gap = o.gap ?? 36;
  return list.map((s, i) => (typeof s === "string" ? text(x, y + i * gap, s, o) : { ...s, x: s.x ?? x, y: s.y ?? y + i * gap }));
}

/** Marker arrow from `a` to `b`, bowed through `via` or by `bend` (fraction of length, + bows up for a left-to-right arrow). */
export function arrow(a, b, o = {}) {
  return { k: "arrow", a, b, color: "ink", bend: 0.25, width: 2.6, ...o };
}

/** Hatched bar standing on `base`. `name` under it, `value` above it. */
export function bar(x, base, w, h, o = {}) {
  return { k: "bar", x, base, w, h, color: "blue", ...o };
}

export function box(x, y, w, h, o = {}) {
  return { k: "box", x, y, w, h, color: "ink", width: 2.2, ...o };
}

export function ring(cx, cy, rx, ry, o = {}) {
  return { k: "ring", cx, cy, rx, ry, color: "red", width: 2.4, ...o };
}

export function hl(x, y, w, h, o = {}) {
  return { k: "hl", x, y, w, h, color: "yellow", ...o };
}

export function line(pts, o = {}) {
  return { k: "line", pts, color: "ink", width: 2.2, ...o };
}

/** Curly brace from `a` to `b`, the tip pointing to the right of a → b. */
export function brace(a, b, o = {}) {
  return { k: "brace", a, b, color: "ink", width: 2.2, depth: 12, ...o };
}

export function pause(ms = 400) {
  return { k: "pause", ms };
}

/** Starts the next presentation step: what follows waits for a tap, → or PageDown. */
export function step() {
  return { k: "step" };
}

/**
 * Hand-ruled table from (x, y). `cols` and `rows` are cell widths and heights.
 * Options: headRows / headCols (tinted, default 1), totals (rule the last row
 * and column off), size (cell text). Returns the ruling as one item with
 *   .cell(r, c, str, o)  text centred in a cell. In a two-line cell `o.line`
 *                        is "top" or "sub" (smaller, under it); `o.sub` writes both.
 *   .at(r, c)            cell centre, .left(c) / .right(c) / .top(r) / .bottom(r) edges.
 */
export function table(x, y, cols, rows, o = {}) {
  const xs = cols.reduce((a, w) => [...a, a[a.length - 1] + w], [x]);
  const ys = rows.reduce((a, h) => [...a, a[a.length - 1] + h], [y]);
  const g = { k: "grid", xs, ys, color: "ink", width: 2, headRows: 1, headCols: 1, ...o };
  const size = o.size ?? 22;
  const at = (r, c) => [(xs[c] + xs[c + 1]) / 2, (ys[r] + ys[r + 1]) / 2];
  g.at = at;
  g.left = (c) => xs[c];
  g.right = (c) => xs[c + 1];
  g.top = (r) => ys[r];
  g.bottom = (r) => ys[r + 1];
  g.cell = (r, c, str, opt = {}) => {
    const [cx, cy] = at(r, c);
    const { sub, subColor, line: where, ...rest } = opt;
    if (where === "sub") return text(cx, cy + size * 0.86, str, { anchor: "middle", color: "grey", ...rest, size: rest.size ?? size - 5 });
    const s = rest.size ?? size;
    const main = text(cx, sub || where === "top" ? cy - 2 : cy + s * 0.34, str, { anchor: "middle", ...rest, size: s });
    if (!sub) return main;
    return [main, g.cell(r, c, sub, { line: "sub", color: subColor ?? rest.color ?? "grey" })];
  };
  return g;
}

/**
 * Bar model: boxes side by side from (x, y), each `h` high.
 * parts: [{ w, color, text, below, fill, hatch }]; `text` sits inside, `below` under the box.
 */
export function strip(x, y, h, parts, o = {}) {
  const items = [];
  let cx = x;
  parts.forEach((p, i) => {
    const color = p.color ?? "blue";
    items.push(box(cx, y, p.w, h, { color, fill: p.fill ?? markFor(color), hatch: p.hatch ?? false, dash: p.dash, with: i > 0 && o.together }));
    if (p.text) items.push(text(cx + p.w / 2, y + h / 2 + (p.size ?? 20) * 0.34, p.text, { anchor: "middle", size: p.size ?? 20, color: p.textColor ?? color }));
    if (p.below) items.push(text(cx + p.w / 2, y + h + 22, p.below, { anchor: "middle", size: 18, color: p.belowColor ?? "grey" }));
    cx += p.w;
  });
  return items;
}

/**
 * Quantities as bars with labelled arrows between them, e.g. Cathy → Baron → Amy.
 * nodes: [{ name, v, text, color, ask, reveal }], steps: [{ label, sub, color } | null].
 * `ask` shows "?" above the bar; `reveal` writes the found value under the name at the end.
 * Returns items with `.geo` = { xs, tops, base, barW, y(v), mid(i) } for extra marks.
 */
export function flow(o) {
  const { nodes, steps = [] } = o;
  const x0 = o.x0 ?? 50;
  const x1 = o.x1 ?? 550;
  const base = o.base ?? 320;
  const maxH = o.maxH ?? 150;
  const barW = o.barW ?? 80;
  const vmax = o.vmax ?? Math.max(...nodes.map((d) => d.v));
  const n = nodes.length;
  const gap = n > 1 ? (x1 - x0 - barW * n) / (n - 1) : 0;
  const xs = nodes.map((_, i) => (n > 1 ? x0 + i * (barW + gap) : (x0 + x1 - barW) / 2));
  const y = (v) => base - Math.max(14, (maxH * v) / vmax);
  const tops = nodes.map((d) => y(d.v));
  const items = [];
  const later = [];
  nodes.forEach((d, i) => {
    items.push(bar(xs[i], base, barW, base - tops[i], {
      color: d.color || "blue",
      name: d.name,
      value: d.ask ? "?" : d.text,
      ask: d.ask,
      valueColor: d.ask ? "red" : d.valueColor,
    }));
    if (d.reveal) later.push(text(xs[i] + barW / 2, base + (d.name2 ? 74 : 52), d.reveal, { anchor: "middle", color: "red", size: 22, mark: "yellow" }));
    const s = steps[i];
    if (i < n - 1 && s) {
      const ya = tops[i] - (o.lift ?? 36);
      const yb = tops[i + 1] - (o.lift ?? 36);
      const a = [xs[i] + barW * 0.72, ya];
      const b = [xs[i + 1] + barW * 0.28, yb];
      items.push(arrow(a, b, { via: [(a[0] + b[0]) / 2, Math.min(ya, yb) - 34], color: s.color || "ink", label: s.label, sub: s.sub, labelColor: s.labelColor || s.color || "red" }));
    }
  });
  const out = [...items, ...later];
  out.geo = { xs, tops, base, barW, y, mid: (i) => xs[i] + barW / 2 };
  return out;
}

/**
 * Numbers flowing along arrows on one line: 200 →×1.1→ 220 →×1.3→ 286.
 * vals: [{ text, name, color, mark, ring } | string], steps: [label | { label, color } | null].
 */
export function chain(x, y, vals, steps = [], o = {}) {
  const gap = o.gap ?? 150;
  const pad = o.pad ?? 36;
  const items = [];
  vals.forEach((v, i) => {
    const d = typeof v === "string" ? { text: v } : v;
    const cx = x + i * gap;
    items.push(text(cx, y, d.text, { anchor: "middle", size: o.size ?? 26, color: d.color ?? o.color ?? "ink", mark: d.mark, ring: d.ring }));
    if (d.name) items.push(text(cx, y + 24, d.name, { anchor: "middle", size: 18, color: d.nameColor ?? "grey" }));
    const s = steps[i];
    if (i < vals.length - 1 && s) {
      const st = typeof s === "string" ? { label: s } : s;
      items.push(arrow([cx + pad, y - 8], [cx + gap - pad, y - 8], { bend: 0.28, label: st.label, labelSize: 21, labelColor: st.color ?? "red", width: 2.2 }));
    }
  });
  return items;
}

/* ---------- sketchy geometry ---------- */

let R = Math.random;

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const J = (amt) => (R() * 2 - 1) * amt;
const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

function seg(a, b, amp) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const o = Math.min(amp, len * 0.05);
  const s = [a[0] + J(o * 0.4), a[1] + J(o * 0.4)];
  const e = [b[0] + J(o * 0.4), b[1] + J(o * 0.4)];
  const k1 = J(o);
  const k2 = J(o);
  const c1 = [a[0] + dx * 0.3 + nx * k1, a[1] + dy * 0.3 + ny * k1];
  const c2 = [a[0] + dx * 0.7 + nx * k2, a[1] + dy * 0.7 + ny * k2];
  return `M${f(s)} C${f(c1)} ${f(c2)} ${f(e)}`;
}

function roughLine(a, b, amp = 2, passes = 2) {
  let d = "";
  for (let i = 0; i < passes; i++) d += seg(a, b, amp * (i ? 1.4 : 1));
  return d;
}

function roughRect(x, y, w, h, amp = 1.6) {
  const o = 3;
  return [
    seg([x - o, y], [x + w + o, y], amp),
    seg([x + w, y - o], [x + w, y + h + o], amp),
    seg([x + w + o, y + h], [x - o, y + h], amp),
    seg([x, y + h + o], [x, y - o], amp),
  ].join("");
}

function spline(pts) {
  let d = `M${f(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1)} ${f(c2)} ${f(p2)}`;
  }
  return d;
}

function roughEllipse(cx, cy, rx, ry) {
  const n = 16;
  const start = -2.3 + J(0.3);
  const span = Math.PI * 2 * 1.1;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const th = start + (span * i) / n;
    const r = 1 + J(0.04) + (i / n) * 0.06;
    pts.push([cx + rx * r * Math.cos(th), cy + ry * r * Math.sin(th)]);
  }
  return spline(pts);
}

function hachure(x, y, w, h, gap = 7) {
  let d = "";
  for (let c = -h + gap / 2; c < w; c += gap) {
    const t0 = Math.max(0, -c);
    const t1 = Math.min(h, w - c);
    if (t1 - t0 < 2) continue;
    const a = [x + c + t0 + J(0.8), y + h - t0 + J(0.8)];
    const b = [x + c + t1 + J(0.8), y + h - t1 + J(0.8)];
    d += seg(a, b, 1.2);
  }
  return d;
}

function quad(a, c, b, t) {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

/* ---------- renderer ---------- */

const DUR = { text: 0, frac: 420, arrow: 650, bar: 750, box: 450, ring: 520, hl: 320, line: 380, brace: 480, grid: 900 };
const TINT = "rgba(120, 140, 170, 0.13)";

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) if (v != null) node.setAttribute(k, v);
  if (parent) parent.append(node);
  return node;
}

function timing(node, del, dur) {
  node.style.setProperty("--del", `${Math.round(del)}ms`);
  node.style.setProperty("--dur", `${Math.round(dur)}ms`);
}

function ink(d, color, width, del, dur, parent, extra = {}) {
  const p = el("path", { d, stroke: col(color), "stroke-width": width, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, class: "ig-d", ...extra }, parent);
  timing(p, del, dur);
  return p;
}

function swipe(box, color, del, parent, under) {
  const h = under ? box.height * 0.42 : box.height * 0.78;
  const y = under ? box.y + box.height * 0.8 : box.y + box.height * 0.52;
  const a = [box.x - 4, y + J(1.5)];
  const b = [box.x + box.width + 4, y + J(1.5)];
  const d = `M${f(a)} Q${f([(a[0] + b[0]) / 2, y + J(2.5)])} ${f(b)}`;
  const p = el("path", { d, stroke: mark(color), "stroke-width": h.toFixed(1), fill: "none", "stroke-linecap": "butt", pathLength: 1, class: "ig-d ig-hl" }, parent);
  timing(p, del, DUR.hl);
  return p;
}

/** Write `str` with optional {colour:words} spans; returns the <text>. */
function writeText(item, del, layer, state) {
  const size = item.size ?? (item.after && state.last?.size) ?? 22;
  let x = item.x;
  let y = item.y;
  if (item.after && state.last) {
    x = state.last.end + (item.gap ?? 7);
    y = state.last.y;
  }
  const node = el("text", { x, y, "font-size": size, fill: col(item.color), "text-anchor": item.anchor || "start", class: "ig-t" }, layer.text);
  if (item.rotate) node.setAttribute("transform", `rotate(${item.rotate} ${x} ${y})`);
  const parts = [];
  const re = /\{(\w+):([^}]*)\}/g;
  let at = 0;
  let m;
  while ((m = re.exec(item.str))) {
    if (m.index > at) parts.push([null, item.str.slice(at, m.index)]);
    parts.push([m[1], m[2]]);
    at = re.lastIndex;
  }
  if (at < item.str.length) parts.push([null, item.str.slice(at)]);
  const step = Math.max(14, Math.min(32, 520 / Math.max(1, item.str.length)));
  let t = del;
  for (const [c, s] of parts) {
    for (const ch of s) {
      const span = el("tspan", { class: "ig-c" }, node);
      if (c === "v") {
        span.setAttribute("font-family", VAR_FONT);
        span.setAttribute("font-style", "italic");
      } else if (c) span.setAttribute("fill", col(c));
      span.textContent = ch;
      span.style.setProperty("--del", `${Math.round(t)}ms`);
      t += step;
    }
  }
  const box = node.getBBox();
  if (item.mark) swipe(box, item.mark, del, layer.marks, false);
  if (item.under) swipe(box, item.under, t, layer.marks, true);
  if (item.ring) {
    const r = el("g", {}, layer.ink);
    ink(roughEllipse(box.x + box.width / 2, box.y + box.height / 2, box.width / 2 + 10, box.height / 2 + 6), item.ring === true ? "red" : item.ring, 2.2, t, DUR.ring, r);
    t += DUR.ring;
  }
  state.last = { end: box.x + box.width, y, size };
  return t - del;
}

function drawFrac(item, del, layer, state) {
  let x = item.x;
  let y = item.y;
  if (item.after && state.last) {
    x = state.last.end + 8;
    y = state.last.y;
  }
  const s = item.size;
  const g = el("g", { class: "ig-f" }, layer.text);
  timing(g, del, DUR.frac);
  const num = el("text", { x: 0, y: y - s * 0.62, "font-size": s, fill: col(item.color), "text-anchor": "middle", class: "ig-t" }, g);
  num.textContent = item.num;
  const den = el("text", { x: 0, y: y + s * 0.62, "font-size": s, fill: col(item.color), "text-anchor": "middle", class: "ig-t" }, g);
  den.textContent = item.den;
  const w = Math.max(num.getBBox().width, den.getBBox().width) + 8;
  const cx = x + w / 2;
  num.setAttribute("x", cx);
  den.setAttribute("x", cx);
  ink(seg([x, y - s * 0.28], [x + w, y - s * 0.28], 0.8), item.color, 1.8, del, 200, layer.ink);
  state.last = { end: x + w, y, size: state.last?.size };
  return DUR.frac;
}

function drawArrow(item, del, layer) {
  const { a, b } = item;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const c = item.via || [(a[0] + b[0]) / 2 + (dy / len) * item.bend * len, (a[1] + b[1]) / 2 - (dx / len) * item.bend * len];
  const g = el("g", {}, layer.ink);
  const pass = () => `M${f([a[0] + J(1), a[1] + J(1)])} Q${f([c[0] + J(3), c[1] + J(3)])} ${f([b[0] + J(0.6), b[1] + J(0.6)])}`;
  const shaft = item.dash ? `M${f(a)} Q${f(c)} ${f(b)}` : pass();
  const p = ink(shaft, item.color, item.width, del, DUR.arrow * 0.75, g);
  if (item.dash) {
    p.setAttribute("stroke-dasharray", "7 7");
    p.setAttribute("class", "ig-f");
  }
  const ang = Math.atan2(b[1] - c[1], b[0] - c[0]);
  const hl = 13;
  const h1 = [b[0] - hl * Math.cos(ang - 0.5), b[1] - hl * Math.sin(ang - 0.5)];
  const h2 = [b[0] - hl * Math.cos(ang + 0.5), b[1] - hl * Math.sin(ang + 0.5)];
  ink(`M${f(h1)} L${f(b)} L${f(h2)}`, item.color, item.width, del + DUR.arrow * 0.72, 160, g);
  let used = DUR.arrow;
  if (item.label || item.sub) {
    const apex = quad(a, c, b, 0.5);
    const below = item.labelBelow ?? c[1] > (a[1] + b[1]) / 2;
    const lx = apex[0] + (item.labelDx || 0);
    let ly = below ? apex[1] + 30 : apex[1] - 12;
    const state = {};
    if (item.label) {
      used += writeText({ str: item.label, x: lx, y: ly, size: item.labelSize || 26, color: item.labelColor, anchor: "middle" }, del + used * 0.9, layer, state);
    }
    if (item.sub) {
      ly = below ? ly + 26 : ly - 28;
      used += writeText({ str: item.sub, x: lx, y: ly, size: item.subSize || 19, color: item.subColor || "grey", anchor: "middle" }, del + used, layer, state);
    }
  }
  return used;
}

function drawBar(item, del, layer) {
  const { x, base, w, h } = item;
  const y = base - h;
  const g = el("g", {}, layer.ink);
  const fill = el("rect", { x, y, width: w, height: h, fill: mark(item.fill || markFor(item.color)), class: "ig-f ig-grow" }, layer.marks);
  timing(fill, del + 200, 400);
  ink(roughRect(x, y, w, h), item.color, 2.4, del, 420, g);
  ink(hachure(x + 3, y + 3, w - 6, h - 6), item.color, 1.3, del + 260, 480, g, { opacity: 0.55 });
  let used = DUR.bar;
  const state = {};
  if (item.value) {
    used += writeText({ str: item.value, x: x + w / 2, y: y - 10, size: item.valueSize || (item.ask ? 30 : 24), color: item.valueColor || item.color, anchor: "middle", ring: item.ask ? "red" : null }, del + used * 0.7, layer, state);
  }
  if (item.name) {
    const [n1, n2] = String(item.name).split("\n");
    used += writeText({ str: n1, x: x + w / 2, y: base + 26, size: item.nameSize || 21, color: item.color, anchor: "middle" }, del + used * 0.8, layer, state);
    if (n2) used += writeText({ str: n2, x: x + w / 2, y: base + 48, size: (item.nameSize || 21) - 3, color: "grey", anchor: "middle" }, del + used * 0.8, layer, state);
  }
  ink(roughLine([x - 14, base + 1], [x + w + 14, base + 1], 1, 1), "grey", 1.6, del, 300, g);
  return used;
}

function drawGrid(item, del, layer) {
  const { xs, ys, headRows, headCols } = item;
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const y0 = ys[0];
  const y1 = ys[ys.length - 1];
  const tint = (x, y, w, h) => {
    if (w <= 0 || h <= 0) return;
    const r = el("rect", { x, y, width: w, height: h, fill: item.head || TINT, class: "ig-f" }, layer.marks);
    timing(r, del, 300);
  };
  if (item.head !== false) {
    tint(x0, y0, x1 - x0, ys[headRows] - y0);
    tint(x0, ys[headRows], xs[headCols] - x0, y1 - ys[headRows]);
  }
  const strongY = new Set([0, ys.length - 1, headRows, ...(item.totals ? [ys.length - 2] : [])]);
  const strongX = new Set([0, xs.length - 1, headCols, ...(item.totals ? [xs.length - 2] : [])]);
  let d = "";
  ys.forEach((y, i) => { d += roughLine([x0 - 4, y], [x1 + 4, y], 1.2, strongY.has(i) ? 2 : 1); });
  xs.forEach((x, i) => { d += roughLine([x, y0 - 4], [x, y1 + 4], 1.2, strongX.has(i) ? 2 : 1); });
  ink(d, item.color, item.width, del, DUR.grid, layer.ink);
  return DUR.grid;
}

function markFor(color) {
  return { blue: "blue", red: "pink", pink: "pink", green: "green", orange: "orange", purple: "blue" }[color] || "yellow";
}

function drawBrace(item, del, layer) {
  const { a, b, depth } = item;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const P = (s, t) => [a[0] + ux * s + nx * t + J(0.6), a[1] + uy * s + ny * t + J(0.6)];
  const q = depth / 2;
  const m = len / 2;
  const d = `M${f(P(0, 0))} Q${f(P(0, q))} ${f(P(Math.min(q * 1.5, m / 2), q))} L${f(P(m - q, q))} Q${f(P(m, q))} ${f(P(m, depth))} Q${f(P(m, q))} ${f(P(m + q, q))} L${f(P(len - Math.min(q * 1.5, m / 2), q))} Q${f(P(len, q))} ${f(P(len, 0))}`;
  ink(d, item.color, item.width, del, DUR.brace, layer.ink);
  let used = DUR.brace;
  if (item.label) {
    const tip = [a[0] + ux * m + nx * (depth + 8), a[1] + uy * m + ny * (depth + 8)];
    const horiz = Math.abs(nx) > Math.abs(ny);
    const anchor = horiz ? (nx > 0 ? "start" : "end") : "middle";
    const ty = horiz ? tip[1] + 7 : tip[1] + (ny > 0 ? 20 : -4);
    used += writeText({ str: item.label, x: tip[0], y: ty, size: item.labelSize || 21, color: item.labelColor || item.color, anchor, mark: item.mark }, del + used, layer, {});
  }
  return used;
}

/**
 * Draw `board` into `svg` with every step showing. Returns the steps as
 * [{ groups, dur }]: the step's <g> in each layer and its drawing time in ms.
 * The caller hides later steps and adds `ig-anim` to a step's groups to play it.
 */
export function render(svg, board, { seed = 1 } = {}) {
  R = seeded(seed);
  const w = board.w || 600;
  const h = board.h || 480;
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.classList.remove("ig-anim");
  const root = { marks: el("g", { class: "ig-marks" }, svg), ink: el("g", {}, svg), text: el("g", {}, svg) };
  const steps = [];
  let layer;
  const begin = () => {
    layer = { marks: el("g", { class: "ig-step" }, root.marks), ink: el("g", { class: "ig-step" }, root.ink), text: el("g", { class: "ig-step" }, root.text) };
    steps.push({ groups: [layer.marks, layer.ink, layer.text], dur: 0 });
  };
  begin();
  const state = {};
  let t = 150;
  let prev = t;
  for (const item of (board.items || []).flat(3)) {
    if (!item) continue;
    if (item.k === "pause") {
      t += item.ms;
      continue;
    }
    if (item.k === "step") {
      steps[steps.length - 1].dur = t;
      begin();
      t = 150;
      prev = t;
      continue;
    }
    const del = item.with ? prev : t;
    let used = 0;
    if (item.k === "text") used = writeText(item, del, layer, state);
    else if (item.k === "frac") used = drawFrac(item, del, layer, state);
    else if (item.k === "arrow") used = drawArrow(item, del, layer);
    else if (item.k === "bar") used = drawBar(item, del, layer);
    else if (item.k === "brace") used = drawBrace(item, del, layer);
    else if (item.k === "grid") used = drawGrid(item, del, layer);
    else if (item.k === "box") {
      ink(roughRect(item.x, item.y, item.w, item.h), item.color, item.width, del, DUR.box, layer.ink, item.dash ? { "stroke-dasharray": item.dash } : {});
      if (item.fill) {
        const r = el("rect", { x: item.x, y: item.y, width: item.w, height: item.h, fill: mark(item.fill), class: "ig-f" }, layer.marks);
        timing(r, del, DUR.box);
        if (item.hatch !== false) ink(hachure(item.x + 2, item.y + 2, item.w - 4, item.h - 4, item.gapH || 6), item.hatchColor || item.color, 1.2, del + 150, DUR.box, layer.ink, { opacity: 0.5 });
      }
      used = DUR.box;
    } else if (item.k === "ring") {
      ink(roughEllipse(item.cx, item.cy, item.rx, item.ry), item.color, item.width, del, DUR.ring, layer.ink);
      used = DUR.ring;
    } else if (item.k === "hl") {
      swipe({ x: item.x, y: item.y, width: item.w, height: item.h }, item.color, del, layer.marks, false);
      used = DUR.hl;
    } else if (item.k === "line") {
      let d = "";
      for (let i = 0; i < item.pts.length - 1; i++) d += item.dash ? `M${f(item.pts[i])} L${f(item.pts[i + 1])}` : seg(item.pts[i], item.pts[i + 1], 1.6);
      const p = ink(d, item.color, item.width, del, DUR.line, layer.ink);
      if (item.dash) {
        p.setAttribute("stroke-dasharray", item.dash === true ? "6 6" : item.dash);
        p.setAttribute("class", "ig-f");
      }
      used = DUR.line;
    }
    prev = del;
    t = del + used + (item.gapAfter ?? 60);
  }
  steps[steps.length - 1].dur = t;
  return steps.filter((s) => s.groups.some((g) => g.childNodes.length));
}
