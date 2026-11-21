/**
 * Interactive graphics for JM30 JM31 Intensive, made for teaching in class.
 *
 * Q40, Q41: a real data set with the question's mean, median and mode. The
 * slider subtracts the same number from every datum (or divides every datum),
 * the dots slide, and the three averages ride along with them.
 * Q42, Q43: five data that the class can drag about. Whatever they are, the
 * new data set's mean follows the rule in the answer key.
 */

import { C, H, S, T, axis, clear, question, scene, slider } from "../../engine/widgets/kit.js";

const MINUS = "\u2212";

function show(n) {
  const r = Math.round(n * 100) / 100;
  const s = String(Object.is(r, -0) ? 0 : r);
  return s.startsWith("-") ? MINUS + s.slice(1) : s;
}

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;

function median(a) {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

function mode(a) {
  const count = new Map();
  a.forEach((v) => count.set(v, (count.get(v) || 0) + 1));
  let best = null;
  let most = 0;
  count.forEach((k, v) => {
    if (k > most) {
      most = k;
      best = v;
    }
  });
  return best;
}

/** Dots stacked over their values, like a dot plot. */
function stack(svg, X, y, values, attrs) {
  const seen = new Map();
  values.forEach((v) => {
    const key = Math.round(v * 1000);
    const k = seen.get(key) || 0;
    seen.set(key, k + 1);
    S("circle", { cx: X(v), cy: y - 12 - k * 17, r: 7.5, ...attrs }, svg);
  });
}

/** A fulcrum under the axis: the mean is where the data balance. */
function fulcrum(svg, x, y, color, label) {
  S("path", { d: `M${x},${y + 25} l-10,17 h20 z`, fill: color }, svg);
  if (label) T(svg, x, y + 60, label, { "text-anchor": "middle", "font-size": 15, "font-weight": 700, fill: color });
}

/** Markers hanging under the axis, [x, colour, text] each a level lower; stems first so no stem crosses a tag. */
function hang(svg, y, marks) {
  const tip = (level) => y + 28 + level * 32;
  marks.forEach(([x, color], level) => S("line", { x1: x, y1: y, x2: x, y2: tip(level), stroke: color, "stroke-width": 2.6 }, svg));
  marks.forEach(([x, color, text], level) => {
    S("circle", { cx: x, cy: y, r: 5.5, fill: color, stroke: "#fff", "stroke-width": 1.5 }, svg);
    const w = text.length * 9 + 20;
    S("rect", { x: x - w / 2, y: tip(level), width: w, height: 26, rx: 13, fill: color }, svg);
    T(svg, x, tip(level) + 18.5, text, { "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: "#fff" });
  });
}

/** Mean, median and mode before and after, one coloured row each. */
function averages(names) {
  const body = H("tbody");
  const rows = names.map(([name, color]) => {
    const was = H("td", { class: "g-num" });
    const now = H("td", { class: "g-num g-now" });
    body.append(H("tr", { style: `--c:${color}` }, [H("th", {}, [name]), was, H("td", { class: "g-arrow" }, ["→"]), now]));
    return { was, now };
  });
  return {
    el: H("table", { class: "g-avg" }, [body]),
    set(values) {
      values.forEach(([was, now], i) => {
        rows[i].was.textContent = was;
        rows[i].now.textContent = now;
      });
    },
  };
}

function verdict() {
  const el = H("p", { class: "g-verdict" });
  return {
    el,
    set(text, ok) {
      el.textContent = text;
      el.classList.toggle("ok", Boolean(ok));
    },
  };
}

// ---------- Q40, Q41: the same change to every datum ----------

function changeAll(root, spec) {
  const svg = scene(640, 300);
  const s = slider(spec.slider);
  const table = averages([["Mean", C.blue], ["Median", C.ink], ["Mode", C.pink]]);
  const say = verdict();
  root.append(question(spec.question), H("p", { class: "g-intro" }, [spec.intro]), svg, s.el, table.el, say.el);
  const y = 150;
  const draw = (k) => {
    clear(svg);
    const data = spec.data.map((v) => spec.apply(v, k));
    const X = axis(svg, { x: 34, y, w: 572, min: spec.min, max: spec.max, step: spec.step });
    T(svg, 34, 26, spec.caption, { "font-size": 15, "font-weight": 700, fill: C.line });
    if (k !== spec.slider.min) stack(svg, X, y, spec.data, { fill: "none", stroke: C.grey, "stroke-width": 1.4, "stroke-dasharray": "3 2" });
    stack(svg, X, y, data, { fill: "#56607a" });
    const avg = [mean(data), median(data), mode(data)];
    hang(svg, y, [[X(avg[0]), C.blue, `mean ${show(avg[0])}`], [X(avg[2]), C.pink, `mode ${show(avg[2])}`],
      [X(avg[1]), C.ink, `median ${show(avg[1])}`]]);
    const was = [mean(spec.data), median(spec.data), mode(spec.data)];
    table.set(was.map((v, i) => [show(v), k === spec.slider.min ? show(v) : `${show(v)} ${spec.sign} ${show(k)} = ${show(avg[i])}`]));
    const done = k === spec.target;
    say.set(done ? spec.done : spec.hint, done);
  };
  s.on(draw);
  draw(s.get());
}

const Q40 = (root) => changeAll(root, {
  question: "The mean, the median and the mode of a set of data are 29, 37 and 35. If 7 is subtracted from each datum, find the new mean, median and mode.",
  intro: "These 19 data have mean 29, median 37 and mode 35. Subtract the same number from every datum and watch the three averages.",
  caption: "Each dot is one datum; the dashed dots are the original data",
  data: [8, 8, 9, 9, 11, 11, 35, 35, 35, 37, 37, 38, 38, 39, 39, 40, 40, 41, 41],
  apply: (v, k) => v - k,
  slider: { label: "Subtract from each datum", min: 0, max: 7, step: 1, value: 0, fmt: (v) => `${MINUS} ${v}`, play: true },
  sign: MINUS,
  target: 7,
  min: 0, max: 44, step: 4,
  hint: "Every dot moves left by the same amount, so the mean, the median and the mode all fall by that amount.",
  done: "Subtracting 7 from every datum: mean 29 − 7 = 22, median 37 − 7 = 30, mode 35 − 7 = 28. The answer is B.",
});

const Q41 = (root) => changeAll(root, {
  question: "The mean, the median and the mode of a set of data are 36, 32 and 40. If each datum is divided by 2, find the new mean, median and mode.",
  intro: "These 7 data have mean 36, median 32 and mode 40. Divide every datum by the same number and watch the three averages.",
  caption: "Each dot is one datum; the dashed dots are the original data",
  data: [20, 24, 28, 32, 40, 40, 68],
  apply: (v, d) => v / d,
  slider: { label: "Divide each datum by", min: 1, max: 2, step: 0.25, value: 1, fmt: (v) => `÷ ${v}`, play: true },
  sign: "÷",
  target: 2,
  min: 0, max: 72, step: 8,
  hint: "Every datum is divided by the same number, so the mean, the median and the mode are all divided by it too.",
  done: "Dividing every datum by 2: mean 36 ÷ 2 = 18, median 32 ÷ 2 = 16, mode 40 ÷ 2 = 20. The answer is A.",
});

// ---------- Q42, Q43: drag the data ----------

function toSvg(svg, event) {
  const p = svg.createSVGPoint();
  p.x = event.clientX;
  p.y = event.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}

/** Five lettered dots on an axis that can be dragged; onChange(values) after every move. */
function dragDots(svg, { names, values, X, V, y, lo, hi, snap, onChange }) {
  const dots = names.map((name, i) => {
    const g = S("g", { class: "g-drag", tabindex: 0, role: "slider", "aria-label": `Datum ${name}` }, svg);
    S("circle", { cx: 0, cy: 0, r: 14, fill: C.amber, stroke: "#fff", "stroke-width": 2 }, g);
    T(g, 0, 5, name, { "text-anchor": "middle", "font-size": 15, "font-weight": 700, "font-style": "italic", fill: "#fff" });
    const set = (v) => {
      values[i] = Math.min(hi, Math.max(lo, Math.round(v / snap) * snap));
      place();
      onChange(values);
    };
    g.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        g.setPointerCapture(event.pointerId);
      } catch {
        // A pointer the browser no longer tracks; the drag still follows its moves over the dot.
      }
      g.classList.add("on");
      const move = (ev) => set(V(toSvg(svg, ev).x));
      const up = () => {
        g.classList.remove("on");
        g.removeEventListener("pointermove", move);
        g.removeEventListener("pointerup", up);
        g.removeEventListener("pointercancel", up);
      };
      g.addEventListener("pointermove", move);
      g.addEventListener("pointerup", up);
      g.addEventListener("pointercancel", up);
    });
    g.addEventListener("keydown", (event) => {
      const step = { ArrowLeft: -snap, ArrowDown: -snap, ArrowRight: snap, ArrowUp: snap }[event.key];
      if (!step) return;
      event.preventDefault();
      event.stopPropagation();
      set(values[i] + step);
    });
    return g;
  });
  function place() {
    const seen = new Map();
    dots.forEach((g, i) => {
      const k = seen.get(values[i]) || 0;
      seen.set(values[i], k + 1);
      g.setAttribute("transform", `translate(${X(values[i])},${y - 18 - k * 30})`);
      g.setAttribute("aria-valuenow", String(values[i]));
    });
  }
  place();
  return { place };
}

const SETS = [[2, 3.5, 5, 6, 8.5], [1, 4, 4.5, 7, 9.5], [3, 3, 6, 7.5, 8], [1.5, 2, 2.5, 9, 10]];

const Q42 = (root) => {
  const svg = scene(640, 440);
  const say = verdict();
  const table = averages([["Mean of a, b, c, d, e", C.blue], ["Mean of 10a, …, 10e", C.green], ["Mean of 10a − 3, …, 10e − 3", C.red]]);
  let pick = 0;
  const values = [...SETS[0]];
  const again = H("button", { type: "button" }, ["Another data set"]);
  root.append(
    question("If the mean of a, b, c, d and e is m, what is the mean of 10a − 3, 10b − 3, 10c − 3, 10d − 3 and 10e − 3?"),
    H("p", { class: "g-intro" }, ["Drag the dots a to e. Each line below applies one step to every datum, and the mean (the balance point ▲) takes the same step."]),
    svg, H("div", { class: "g-btns" }, [again]), table.el, say.el,
  );
  const x0 = 40;
  const w = 560;
  const rows = [
    { y: 96, X: (v) => x0 + (v / 10) * w, f: (v) => v, name: "a, b, c, d, e", color: C.blue },
    { y: 236, X: (v) => x0 + (v / 100) * w, f: (v) => 10 * v, name: "× 10", color: C.green },
    { y: 376, X: (v) => x0 + (v / 100) * w, f: (v) => 10 * v - 3, name: `× 10, then ${MINUS} 3`, color: C.red },
  ];
  axis(svg, { x: x0, y: rows[0].y, w, min: 0, max: 10, step: 1 });
  axis(svg, { x: x0, y: rows[1].y, w, min: 0, max: 100, step: 10 });
  axis(svg, { x: x0, y: rows[2].y, w, min: 0, max: 100, step: 10 });
  rows.forEach((r) => T(svg, x0 + w, r.y - 52, r.name, { "text-anchor": "end", "font-size": 15, "font-weight": 700, fill: r.color }));
  const live = S("g", {}, svg);
  const update = () => {
    clear(live);
    const m = mean(values);
    rows.slice(1).forEach((r, k) => {
      const prev = rows[k];
      values.forEach((v) => {
        S("line", { x1: prev.X(prev.f(v)), y1: prev.y + 6, x2: r.X(r.f(v)), y2: r.y - 18, stroke: "#b8bfcc", "stroke-width": 1.2, "stroke-dasharray": "4 3" }, live);
      });
      stack(live, r.X, r.y, values.map(r.f), { fill: r.color });
    });
    fulcrum(live, rows[0].X(m), rows[0].y, C.blue, `m = ${show(m)}`);
    fulcrum(live, rows[1].X(10 * m), rows[1].y, C.green, `10m = ${show(10 * m)}`);
    fulcrum(live, rows[2].X(10 * m - 3), rows[2].y, C.red, `10m ${MINUS} 3 = ${show(10 * m - 3)}`);
    const means = rows.map((r) => mean(values.map(r.f)));
    table.set([[show(means[0]), `m = ${show(m)}`], [show(means[1]), `10 × ${show(m)} = ${show(10 * m)}`],
      [show(means[2]), `10 × ${show(m)} ${MINUS} 3 = ${show(10 * m - 3)}`]]);
    say.set(`Whatever the data, the new mean is 10m ${MINUS} 3. The answer is C.`, true);
    dots.place();
  };
  const dots = dragDots(svg, { names: ["a", "b", "c", "d", "e"], values, X: rows[0].X, V: (x) => ((x - x0) / w) * 10, y: rows[0].y, lo: 0.5, hi: 10, snap: 0.5, onChange: update });
  again.addEventListener("click", () => {
    pick = (pick + 1) % SETS.length;
    SETS[pick].forEach((v, i) => { values[i] = v; });
    update();
  });
  update();
};

const Q43 = (root) => {
  const svg = scene(640, 440);
  const say = verdict();
  const names = ["p", "q", "r", "s", "t"];
  let pick = 0;
  const values = [...SETS[0]];
  const again = H("button", { type: "button" }, ["Another data set"]);
  root.append(
    question("The mean of p, q, r, s and t is x. Find the mean of x(x − p), x(x − q), x(x − r), x(x − s) and x(x − t)."),
    H("p", { class: "g-intro" }, ["Drag the dots p to t. The arrows run from each datum to the mean x: those to the right (x − p > 0) and those to the left always cancel."]),
    svg, H("div", { class: "g-btns" }, [again]), say.el,
  );
  const x0 = 40;
  const w = 560;
  const y = 150;
  const X = (v) => x0 + (v / 10) * w;
  axis(svg, { x: x0, y, w, min: 0, max: 10, step: 1 });
  T(svg, x0, 24, "Data p, q, r, s, t and their mean x", { "font-size": 15, "font-weight": 700, fill: C.line });
  const base = 330;
  T(svg, x0, 226, "Each bar is x(x − datum)", { "font-size": 15, "font-weight": 700, fill: C.line });
  const live = S("g", {}, svg);
  const update = () => {
    clear(live);
    const x = mean(values);
    fulcrum(live, X(x), y, C.blue, `x = ${show(x)}`);
    values.forEach((v, i) => {
      const d = x - v;
      if (Math.abs(d) < 1e-9) return;
      const color = d > 0 ? C.green : C.red;
      const ay = 42 + i * 11;
      S("line", { x1: X(v), y1: ay, x2: X(x) - Math.sign(d) * 7, y2: ay, stroke: color, "stroke-width": 3 }, live);
      S("path", { d: `M${X(x)},${ay} l${-Math.sign(d) * 9},-5 v10 z`, fill: color }, live);
    });
    const bars = values.map((v) => x * (x - v));
    const top = Math.max(10, ...bars.map(Math.abs));
    const bw = 64;
    S("line", { x1: x0, y1: base, x2: x0 + w, y2: base, stroke: C.line, "stroke-width": 1.4 }, live);
    bars.forEach((b, i) => {
      const cx = x0 + 70 + i * 105;
      const h = (Math.abs(b) / top) * 78;
      const color = b >= 0 ? C.green : C.red;
      S("rect", { x: cx - bw / 2, y: b >= 0 ? base - h : base, width: bw, height: Math.max(h, 1), rx: 4, fill: color, opacity: 0.85 }, live);
      T(live, cx, b >= 0 ? base - h - 8 : base + h + 18, show(b), { "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: color });
      T(live, cx, b >= 0 ? base + 19 : base - 8, `x(x − ${names[i]})`, { "text-anchor": "middle", "font-size": 14, "font-style": "italic", fill: C.line });
    });
    const up = bars.filter((b) => b > 0).reduce((s, b) => s + b, 0);
    say.set(`Green bars add to ${show(up)} and red bars to ${show(-up)}, so the five values add to 0 and their mean is 0 for any data. The answer is B.`, true);
    dots.place();
  };
  const dots = dragDots(svg, { names, values, X, V: (px) => ((px - x0) / w) * 10, y, lo: 0.5, hi: 10, snap: 0.5, onChange: update });
  again.addEventListener("click", () => {
    pick = (pick + 1) % SETS.length;
    SETS[pick].forEach((v, i) => { values[i] = v; });
    update();
  });
  update();
};

const REGISTRY = { q40: Q40, q41: Q41, q42: Q42, q43: Q43 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
