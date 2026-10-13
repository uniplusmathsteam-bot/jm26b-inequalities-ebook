/** Small drawing and control kit shared by the interactive graphics. */

const NS = "http://www.w3.org/2000/svg";

export const C = {
  ink: "#163a86",
  red: "#d92d20",
  green: "#1d8a4a",
  greenSoft: "#dff3e6",
  redSoft: "#fde4e1",
  amber: "#f0a030",
  amberSoft: "#fdebc8",
  blue: "#3b7ddd",
  blueSoft: "#dbe8fb",
  pink: "#e0609a",
  pinkSoft: "#fbe0ec",
  grey: "#8a8f98",
  line: "#2b2b2b",
  paper: "#fbf8f2",
  soft: "#efe9dd",
};

export function S(tag, attrs = {}, parent) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined && v !== null) node.setAttribute(k, v);
  }
  if (parent) parent.append(node);
  return node;
}

export function T(parent, x, y, text, attrs = {}) {
  const node = S("text", { x, y, "font-size": 13, fill: C.line, ...attrs }, parent);
  node.textContent = text;
  return node;
}

export function H(tag, attrs = {}, kids = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null) node.setAttribute(k, v);
  }
  for (const kid of [].concat(kids)) {
    if (kid == null) continue;
    node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

export function tex(latex, display = false) {
  const span = document.createElement("span");
  if (window.katex) window.katex.render(latex, span, { throwOnError: false, displayMode: display });
  else span.textContent = latex;
  return span;
}

export function fmt(n, dp = 2) {
  if (!Number.isFinite(n)) return "—";
  const r = Math.round(n * 10 ** dp) / 10 ** dp;
  return String(Object.is(r, -0) ? 0 : r);
}

export function P(n, dp = 2) {
  const s = fmt(n, dp);
  return n < 0 ? `(${s})` : s;
}

export function scene(w, h) {
  const svg = S("svg", { viewBox: `0 0 ${w} ${h}`, class: "g-svg" });
  const defs = S("defs", {}, svg);
  for (const [id, color] of [["arr", C.line], ["arrInk", C.ink], ["arrGreen", C.green], ["arrRed", C.red], ["arrAmber", C.amber]]) {
    const marker = S("marker", { id: `${id}-${uidCounter}`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 11, markerHeight: 11, markerUnits: "userSpaceOnUse", orient: "auto-start-reverse" }, defs);
    S("path", { d: "M0,0 L10,5 L0,10 z", fill: color }, marker);
  }
  svg.dataset.uid = String(uidCounter++);
  return svg;
}
let uidCounter = 1;

export function marker(svg, name) {
  return `url(#${name}-${svg.dataset.uid})`;
}

export function clear(svg) {
  [...svg.children].forEach((child) => {
    if (child.tagName !== "defs") child.remove();
  });
}

export function niceStep(span, target = 8) {
  const raw = span / target;
  const p = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (raw <= m * p) return m * p;
  }
  return 10 * p;
}

/** Number line; returns the value-to-x mapping. */
export function axis(svg, { x, y, w, min, max, step, label, every = 1, color = C.line, arrows = true }) {
  const st = step ?? niceStep(max - min);
  const X = (v) => x + ((v - min) / (max - min)) * w;
  S("line", {
    x1: x - (arrows ? 10 : 0), y1: y, x2: x + w + (arrows ? 10 : 0), y2: y,
    stroke: color, "stroke-width": 1.4,
    "marker-end": arrows ? marker(svg, "arr") : null,
    "marker-start": arrows ? marker(svg, "arr") : null,
  }, svg);
  const first = Math.ceil(min / st - 1e-9) * st;
  let i = 0;
  for (let v = first; v <= max + 1e-9; v += st, i++) {
    const px = X(v);
    S("line", { x1: px, y1: y - 5, x2: px, y2: y + 5, stroke: color, "stroke-width": 1 }, svg);
    if (i % every === 0) T(svg, px, y + 19, label ? label(v) : fmt(v), { "text-anchor": "middle", "font-size": 11, fill: "#444" });
  }
  return X;
}

export const RAY_RISE = 26;

/**
 * HKDSE-style solution set: a vertical line up from the boundary value, a
 * circle on top (filled for ≤ / ≥, hollow for < / >) and an arrow from it.
 */
export function ray(svg, X, y, at, dir, closed, color = C.green, { min, max } = {}) {
  const x0 = X(at);
  const top = y - RAY_RISE;
  const end = dir === "right" ? X(max) + 8 : X(min) - 8;
  const arrow = color === C.red ? "arrRed" : color === C.ink ? "arrInk" : "arrGreen";
  S("line", { x1: x0, y1: y, x2: x0, y2: top, stroke: color, "stroke-width": 1.8 }, svg);
  S("line", {
    x1: x0, y1: top, x2: end, y2: top,
    stroke: color, "stroke-width": 2.6,
    "marker-end": marker(svg, arrow),
  }, svg);
  S("circle", { cx: x0, cy: top, r: 5.5, fill: closed ? color : "#fff", stroke: color, "stroke-width": 2.2 }, svg);
}

/**
 * Marks a value on an axis at height y: a dot on the axis, a stem and a
 * label tag. `level` lifts the tag so that nearby markers do not overlap.
 */
export function pin(svg, x, y, color, text, { up = true, level = 0 } = {}) {
  const dir = up ? -1 : 1;
  const len = (up ? RAY_RISE + 10 : 30) + level * 22;
  const tip = y + dir * len;
  S("line", { x1: x, y1: y, x2: x, y2: tip, stroke: color, "stroke-width": 1.6 }, svg);
  S("circle", { cx: x, cy: y, r: 4.6, fill: color, stroke: "#fff", "stroke-width": 1.5 }, svg);
  if (text == null || text === "") return;
  const label = String(text);
  const w = Math.max(24, label.length * 7.1 + 14);
  const h = 19;
  const top = up ? tip - h : tip;
  S("rect", { x: x - w / 2, y: top, width: w, height: h, rx: 9.5, fill: color }, svg);
  T(svg, x, top + 13.5, label, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "#fff" });
}

export function bar(svg, x, y, w, h, fill, attrs = {}) {
  return S("rect", { x, y, width: Math.max(0, w), height: Math.max(0, h), rx: 4, fill, ...attrs }, svg);
}

export function dashed(svg, x1, y1, x2, y2, color = C.red, label, labelAttrs = {}) {
  S("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 2, "stroke-dasharray": "6 4" }, svg);
  if (label) T(svg, x2, y1 - 6, label, { "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: color, ...labelAttrs });
}

/** Range slider with − / + nudges and an optional play loop. */
export function slider({ label, min, max, step = 1, value, fmt: show = (v) => fmt(v), play = true }) {
  const listeners = [];
  const input = H("input", { type: "range", min, max, step, value });
  const out = H("output", {}, [show(Number(value))]);
  let timer = 0;
  const emit = () => {
    out.textContent = show(Number(input.value));
    listeners.forEach((fn) => fn(Number(input.value)));
  };
  const nudge = (dir) => {
    stop();
    const next = Math.min(max, Math.max(min, Number(input.value) + dir * step));
    input.value = String(roundStep(next, step));
    emit();
  };
  const playBtn = H("button", { type: "button", class: "g-play", title: "Play" }, ["▶"]);
  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = 0;
    playBtn.textContent = "▶";
  }
  playBtn.addEventListener("click", () => {
    if (timer) return stop();
    playBtn.textContent = "❚❚";
    timer = setInterval(() => {
      let next = Number(input.value) + step;
      if (next > max + 1e-9) next = min;
      input.value = String(roundStep(next, step));
      emit();
    }, 650);
  });
  input.addEventListener("input", () => {
    stop();
    emit();
  });
  const el = H("div", { class: "g-slider" }, [
    H("span", { class: "g-lab" }, [label]),
    H("button", { type: "button", class: "g-nudge", onclick: () => nudge(-1), title: "Smaller" }, ["−"]),
    input,
    H("button", { type: "button", class: "g-nudge", onclick: () => nudge(1), title: "Larger" }, ["+"]),
    out,
    play ? playBtn : null,
  ]);
  return {
    el,
    get: () => Number(input.value),
    set(v) {
      stop();
      input.value = String(v);
      emit();
    },
    on(fn) {
      listeners.push(fn);
      return this;
    },
    stop,
  };
}

function roundStep(v, step) {
  const dp = (String(step).split(".")[1] || "").length;
  return Number(v.toFixed(dp));
}

export function readout() {
  const expr = H("div", { class: "g-expr" });
  const chip = H("span", { class: "g-chip" });
  const cap = H("p", { class: "g-cap" });
  const el = H("div", { class: "g-read" }, [H("div", { class: "g-read-row" }, [expr, chip]), cap]);
  return {
    el,
    /** `ok` null hides the check chip; `labels` replaces "satisfies" / "fails". */
    set(latex, ok, caption, labels = {}) {
      expr.replaceChildren(tex(latex, true));
      chip.hidden = ok == null;
      chip.className = `g-chip ${ok ? "ok" : "bad"}`;
      chip.textContent = ok ? `✓ ${labels.yes || "satisfies"}` : `✗ ${labels.no || "fails"}`;
      cap.textContent = caption || "";
    },
  };
}

export function tabs(names, onChange) {
  const row = H("div", { class: "g-tabs" });
  names.forEach((name, i) => {
    row.append(H("button", {
      type: "button",
      class: i === 0 ? "on" : "",
      onclick: (event) => {
        [...row.children].forEach((b) => b.classList.toggle("on", b === event.currentTarget));
        onChange(i);
      },
    }, [name]));
  });
  return row;
}

export function buttonRow(items) {
  return H("div", { class: "g-btns" }, items.map(([label, fn]) => H("button", { type: "button", onclick: fn }, [label])));
}

/** Text with $inline maths$; \$ is a literal dollar sign. */
function rich(text) {
  const DOLLAR = "\u0001";
  return String(text).replace(/\\\$/g, DOLLAR).split("$").map((part, i) => {
    const s = part.replace(/\u0001/g, "$");
    return i % 2 ? tex(s.replace(/\$/g, "\\$")) : document.createTextNode(s);
  });
}

export function intro(text) {
  return H("p", { class: "g-intro" }, rich(text));
}

/** Question card: the question in brief, then what each letter stands for. */
export function question(text, lets = []) {
  return H("div", { class: "g-q" }, [
    H("p", {}, rich(text)),
    lets.length ? H("ul", {}, lets.map((line) => H("li", {}, rich(line)))) : null,
  ]);
}

/** Pie-free arc sector between two directions (screen coordinates). */
export function sector(svg, cx, cy, r, a0, a1, fill, stroke) {
  let d = a1 - a0;
  while (d <= -Math.PI) d += 2 * Math.PI;
  while (d > Math.PI) d -= 2 * Math.PI;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a0 + d);
  const y1 = cy + r * Math.sin(a0 + d);
  S("path", {
    d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${x1},${y1} Z`,
    fill, stroke, "stroke-width": 1.5, opacity: 0.85,
  }, svg);
  return a0 + d / 2;
}

export function regular(n, cx, cy, R, rot = -Math.PI / 2) {
  return Array.from({ length: n }, (_, i) => {
    const a = rot + (i * 2 * Math.PI) / n;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
}
