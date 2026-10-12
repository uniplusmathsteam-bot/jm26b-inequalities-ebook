import {
  C, S, T, H, tex, fmt, P, scene, marker, clear, niceStep, axis, ray, RAY_RISE, pin, bar, dashed,
  slider, readout, tabs, buttonRow, intro, question, sector, regular,
} from "./kit.js";

const sign = (ok, yes, no) => (ok ? yes : no);

const CMP = {
  "<": [(a, b) => a < b, "<", "\\ge"],
  "≤": [(a, b) => a <= b, "\\le", ">"],
  ">": [(a, b) => a > b, ">", "\\le"],
  "≥": [(a, b) => a >= b, "\\ge", "<"],
};

/** Inequality ray for a condition "value op at" drawn on an axis. */
function condRay(svg, X, y, at, op, color, range) {
  ray(svg, X, y, at, op === ">" || op === "≥" ? "right" : "left", op === "≤" || op === "≥", color, range);
}

/** Vertical number line at x = lx, values increasing upwards. */
function vAxis(svg, Y, lx, min, max, step) {
  S("line", {
    x1: lx, y1: Y(min) + 10, x2: lx, y2: Y(max) - 10, stroke: C.line, "stroke-width": 1.4,
    "marker-end": marker(svg, "arr"), "marker-start": marker(svg, "arr"),
  }, svg);
  for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + 1e-9; v += step) {
    S("line", { x1: lx - 5, y1: Y(v), x2: lx + 5, y2: Y(v), stroke: C.line }, svg);
    T(svg, lx - 9, Y(v) + 4, fmt(v), { "text-anchor": "end", "font-size": 11, fill: "#444" });
  }
}

/** HKDSE-style range on a vertical number line: stem out from the value, circle, arrow up or down. */
function vRay(svg, Y, lx, at, up, closed, color, min, max) {
  const y = Y(at);
  const cx = lx + RAY_RISE;
  const arrow = color === C.red ? "arrRed" : color === C.ink ? "arrInk" : "arrGreen";
  S("line", { x1: lx, y1: y, x2: cx, y2: y, stroke: color, "stroke-width": 1.8 }, svg);
  S("line", { x1: cx, y1: y, x2: cx, y2: up ? Y(max) - 8 : Y(min) + 8, stroke: color, "stroke-width": 2.6, "marker-end": marker(svg, arrow) }, svg);
  S("circle", { cx, cy: y, r: 5.5, fill: closed ? color : "#fff", stroke: color, "stroke-width": 2.2 }, svg);
}

/** Dots for whole-number candidates: green when they satisfy the condition. */
function candidates(svg, X, y, values, test, best) {
  for (const v of values) {
    const ok = test(v);
    S("circle", { cx: X(v), cy: y, r: ok ? 4.2 : 3.4, fill: ok ? C.green : "#fff", stroke: ok ? C.green : "#c9a6a2", "stroke-width": 1.6 }, svg);
  }
  if (best != null) {
    S("circle", { cx: X(best), cy: y, r: 9, fill: "none", stroke: C.amber, "stroke-width": 2.4 }, svg);
  }
}

function range(a, b, step) {
  const out = [];
  for (let v = a; v <= b + 1e-9; v += step) out.push(Number(v.toFixed(6)));
  return out;
}

function polygonPoints(pts) {
  return pts.map((p) => p.join(",")).join(" ");
}

/* ---------- Example 1: story books ---------- */
function ex1(root) {
  const svg = scene(620, 300);
  const s = slider({ label: "Chinese book: x pages", min: 90, max: 110, step: 1, value: 95 });
  const r = readout();
  root.append(
    question("The Chinese story book has $x$ pages and the English story book has twice as many. Together they have more than 300 pages. Find the least possible $x$.",
      ["Chinese book: $x$ pages", "English book: $2x$ pages", "Total: $x + 2x > 300$"]),
    svg, s.el, r.el,
    buttonRow([["Try x = 100", () => s.set(100)], ["Least value: 101", () => s.set(101)]]),
  );
  const draw = (x) => {
    clear(svg);
    const base = 250;
    const k = 0.55;
    const ok = 3 * x > 300;
    T(svg, 20, 22, "Number of pages", { "font-weight": 700 });
    bar(svg, 30, base - x * k, 64, x * k, C.blue);
    T(svg, 62, base + 18, "Chinese", { "text-anchor": "middle" });
    T(svg, 62, base - x * k - 7, `x = ${x}`, { "text-anchor": "middle", "font-weight": 700, fill: C.blue });
    bar(svg, 112, base - 2 * x * k, 64, 2 * x * k, C.pink);
    T(svg, 144, base + 18, "English", { "text-anchor": "middle" });
    T(svg, 144, base - 2 * x * k - 7, `2x = ${2 * x}`, { "text-anchor": "middle", "font-weight": 700, fill: C.pink });
    bar(svg, 200, base - x * k, 70, x * k, C.blue);
    bar(svg, 200, base - 3 * x * k, 70, 2 * x * k, C.pink);
    T(svg, 235, base + 18, "Total", { "text-anchor": "middle" });
    T(svg, 276, base - 3 * x * k + 5, `3x = ${3 * x}`, { "font-weight": 700, fill: ok ? C.green : C.red });
    dashed(svg, 192, base - 300 * k, 274, base - 300 * k, C.red);
    T(svg, 188, base - 300 * k + 4, "300", { "text-anchor": "end", fill: C.red, "font-weight": 700 });

    const X = axis(svg, { x: 340, y: 210, w: 260, min: 90, max: 110, step: 1, every: 5 });
    T(svg, 340, 70, "Values of x that work", { "font-weight": 700 });
    T(svg, 340, 92, "x > 100, and x is a whole number", { "font-size": 12, fill: "#555" });
    condRay(svg, X, 210, 100, ">", C.green, { min: 90, max: 110 });
    candidates(svg, X, 210, range(90, 110, 1), (v) => v > 100, 101);
    T(svg, X(101), 256, "101 is the least", { "text-anchor": "middle", "font-size": 12, fill: C.amber, "font-weight": 700 });
    pin(svg, X(x), 210, ok ? C.green : C.red, `x = ${x}`, { level: 1 });
    r.set(`x + 2x = ${x} + ${2 * x} = ${3 * x} ${sign(ok, ">", "\\le")} 300`, ok,
      ok ? (x === 101 ? "101 is the least whole number of pages that works." : "This works, but a smaller number of pages also works.")
        : x === 100 ? "Exactly 300 pages is not MORE than 300, so x = 100 does not work." : "The total is not more than 300 yet.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Practice 1a: integer tiles ---------- */
function p1a(root) {
  const grid = H("div", { class: "g-tiles" });
  const svg = scene(620, 130);
  const r = readout();
  let pick = 4;
  root.append(
    question("Twice $x$ minus 10 is less than 4, and $x$ is a positive integer. Find all the possible values of $x$.",
      ["Inequality: $2x - 10 < 4$", "Solving gives $x < 7$"]),
    intro("Tap a positive integer to test it."), grid, svg, r.el,
  );
  const draw = () => {
    grid.replaceChildren();
    for (let k = 1; k <= 10; k++) {
      const ok = 2 * k - 10 < 4;
      grid.append(H("button", {
        type: "button",
        class: `g-tile ${ok ? "ok" : "bad"} ${k === pick ? "on" : ""}`,
        onclick: () => { pick = k; draw(); },
      }, [H("b", {}, [String(k)]), H("span", {}, [`2(${k}) − 10 = ${2 * k - 10}`])]));
    }
    clear(svg);
    const X = axis(svg, { x: 40, y: 92, w: 540, min: 0, max: 10, step: 1 });
    condRay(svg, X, 92, 7, "<", C.green, { min: 0, max: 10 });
    candidates(svg, X, 92, range(1, 10, 1), (v) => v < 7);
    T(svg, X(7), 124, "x < 7", { "text-anchor": "middle", "font-weight": 700, fill: C.green });
    const ok = 2 * pick - 10 < 4;
    pin(svg, X(pick), 92, ok ? C.green : C.red, `x = ${pick}`, { level: 1 });
    r.set(`2(${pick}) - 10 = ${2 * pick - 10} ${sign(ok, "<", "\\ge")} 4`, ok,
      ok ? "This integer is a possible value. All possible values: 1, 2, 3, 4, 5, 6." : "Integers from 7 upward do not work.");
  };
  draw();
}

/* ---------- Practice 1b: triangle ---------- */
function p1b(root) {
  const svg = scene(620, 320);
  const s = slider({ label: "BC = x cm", min: 6, max: 22, step: 0.5, value: 11 });
  const r = readout();
  root.append(
    question("In △ABC, AB is 4 cm longer than BC, and AC is 1 cm longer than twice BC. BC = $x$ cm. The perimeter is greater than 61 cm.",
      ["$BC = x$", "$AB = x + 4$", "$AC = 2x + 1$", "Perimeter: $(x + 4) + x + (2x + 1) > 61$"]),
    svg, s.el, r.el,
    buttonRow([["Boundary x = 14", () => s.set(14)], ["Try x = 15", () => s.set(15)]]),
  );
  const draw = (x) => {
    clear(svg);
    const a = x;
    const c = x + 4;
    const b = 2 * x + 1;
    const ax = (c * c - b * b + a * a) / (2 * a);
    const ay = Math.sqrt(Math.max(0, c * c - ax * ax));
    const raw = [[ax, -ay], [0, 0], [a, 0]];
    const xs = raw.map((p) => p[0]);
    const ys = raw.map((p) => p[1]);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    const k = Math.min(250 / w, 190 / Math.max(h, 1));
    const ox = 60 - Math.min(...xs) * k;
    const oy = 255;
    const [A, B, Cc] = raw.map(([px, py]) => [ox + px * k, oy + py * k]);
    const per = a + b + c;
    const ok = per > 61;
    S("polygon", { points: polygonPoints([A, B, Cc]), fill: ok ? C.greenSoft : C.redSoft, stroke: C.ink, "stroke-width": 2.5 }, svg);
    const g = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3];
    const side = (p, q, text, color) => {
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      let nx = q[1] - p[1];
      let ny = p[0] - q[0];
      const len = Math.hypot(nx, ny) || 1;
      nx /= len;
      ny /= len;
      if ((mx - g[0]) * nx + (my - g[1]) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const anchor = nx > 0.35 ? "start" : nx < -0.35 ? "end" : "middle";
      T(svg, mx + nx * 12, my + ny * 14 + 4, text, { "text-anchor": anchor, "font-weight": 700, "font-size": 13, fill: color });
    };
    side(A, B, `AB = x + 4 = ${fmt(c)}`, C.pink);
    side(B, Cc, `BC = x = ${fmt(a)}`, C.blue);
    side(A, Cc, `AC = 2x + 1 = ${fmt(b)}`, C.amber);
    T(svg, A[0], A[1] - 10, "A", { "font-weight": 700, "font-size": 15, "text-anchor": "middle" });
    T(svg, B[0] - 16, B[1] + 6, "B", { "font-weight": 700, "font-size": 15 });
    T(svg, Cc[0] + 6, Cc[1] + 6, "C", { "font-weight": 700, "font-size": 15 });

    const bx = 380;
    const scale = 220 / 95;
    T(svg, bx, 40, "Perimeter (cm)", { "font-weight": 700 });
    bar(svg, bx, 56, c * scale, 26, C.pink);
    bar(svg, bx + c * scale, 56, a * scale, 26, C.blue);
    bar(svg, bx + (c + a) * scale, 56, b * scale, 26, C.amber);
    dashed(svg, bx + 61 * scale, 46, bx + 61 * scale, 96, C.red);
    T(svg, bx + 61 * scale, 112, "61 cm", { "text-anchor": "middle", fill: C.red, "font-weight": 700 });
    T(svg, bx, 140, `= ${fmt(per)} cm`, { "font-size": 17, "font-weight": 700, fill: ok ? C.green : C.red });
    T(svg, bx, 162, ok ? "greater than 61 cm ✓" : "not greater than 61 cm ✗", { fill: ok ? C.green : C.red });
    const X = axis(svg, { x: bx, y: 250, w: 220, min: 6, max: 22, step: 2 });
    T(svg, bx, 200, "x > 14", { "font-weight": 700, fill: C.green });
    condRay(svg, X, 250, 14, ">", C.green, { min: 6, max: 22 });
    pin(svg, X(x), 250, ok ? C.green : C.red, fmt(x), { level: 0 });
    r.set(`(${fmt(x)} + 4) + ${fmt(x)} + (2(${fmt(x)}) + 1) = 4(${fmt(x)}) + 5 = ${fmt(per)} ${sign(ok, ">", "\\le")} 61`, ok,
      ok ? "The perimeter is greater than 61 cm, so this x is in the range x > 14." : "Not greater than 61 cm — x must be greater than 14.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q1: operation chain ---------- */
function q1(root) {
  const svg = scene(620, 290);
  const s = slider({ label: "x", min: -14, max: 0, step: 1, value: -4 });
  const r = readout();
  root.append(
    question("Subtracting twice the sum of $x$ and 2 from 11 is at least 23. What is the greatest value of $x$?",
      ["The sum of $x$ and 2: $x + 2$", "Twice the sum: $2(x + 2)$", "Inequality: $11 - 2(x + 2) \\ge 23$"]),
    svg, s.el, r.el, buttonRow([["Greatest value: −8", () => s.set(-8)]]),
  );
  const draw = (x) => {
    clear(svg);
    const vals = [x, x + 2, 2 * (x + 2), 11 - 2 * (x + 2)];
    const labels = ["x", "sum: x + 2", "twice: 2(x + 2)", "11 − 2(x + 2)"];
    const ops = ["+ 2", "× 2", "take from 11"];
    vals.forEach((v, i) => {
      const bx = 14 + i * 152;
      const last = i === 3;
      S("rect", { x: bx, y: 24, width: 124, height: 58, rx: 10, fill: last ? (v >= 23 ? C.greenSoft : C.redSoft) : C.blueSoft, stroke: C.ink }, svg);
      T(svg, bx + 62, 44, labels[i], { "text-anchor": "middle", "font-size": 11.5 });
      T(svg, bx + 62, 72, fmt(v), { "text-anchor": "middle", "font-size": 19, "font-weight": 700, fill: C.ink });
      if (i < 3) {
        S("line", { x1: bx + 126, y1: 53, x2: bx + 150, y2: 53, stroke: C.line, "stroke-width": 2, "marker-end": marker(svg, "arr") }, svg);
        T(svg, bx + 138, 100, ops[i], { "text-anchor": "middle", "font-size": 12, fill: C.ink, "font-weight": 700 });
      }
    });
    T(svg, 14, 130, "Subtracting a bigger amount gives a smaller result, so larger x makes the result smaller.", { fill: "#555", "font-size": 12 });
    T(svg, 14, 150, "Dividing by −2 when solving reverses the sign: −2(x + 2) ≥ 12  →  x + 2 ≤ −6", { fill: C.red, "font-size": 12, "font-weight": 700 });
    const X = axis(svg, { x: 40, y: 240, w: 540, min: -14, max: 0, step: 1, every: 2 });
    condRay(svg, X, 240, -8, "≤", C.green, { min: -14, max: 0 });
    T(svg, X(-8), 278, "x ≤ −8", { "text-anchor": "middle", "font-weight": 700, fill: C.green });
    const ok = vals[3] >= 23;
    pin(svg, X(x), 240, ok ? C.green : C.red, `x = ${x}`, { level: 1 });
    r.set(`11 - 2(${P(x)} + 2) = ${vals[3]} ${sign(ok, "\\ge", "<")} 23`, ok,
      ok ? (x === -8 ? "x = −8 is the greatest value that works." : "This works, and so does every smaller x.") : "Too big: the result is less than 23.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q2: polygon with fixed 3 cm sides ---------- */
function q2(root) {
  const svg = scene(620, 410);
  const strip = H("div", { class: "g-strip" });
  const s = slider({ label: "Number of sides n", min: 3, max: 12, step: 1, value: 5 });
  const r = readout();
  root.append(
    question("Each side of a regular $n$-sided polygon is 3 cm. The perimeter is at least 24 cm. Find the least possible value of $n$.",
      ["Perimeter $= 3 \\times n = 3n$", "Inequality: $3n \\ge 24$"]),
    svg, s.el, strip, r.el,
    buttonRow([["Least n: 8", () => s.set(8)], ["Start again", () => s.set(3)]]),
  );
  const draw = (n) => {
    clear(svg);
    const side = 62;
    const R = side / (2 * Math.sin(Math.PI / n));
    const cx = 170;
    const cy = 168;
    const pts = regular(n, cx, cy, R, -Math.PI / 2 - Math.PI / n);
    const ok = 3 * n >= 24;
    S("polygon", { points: polygonPoints(pts), fill: ok ? C.greenSoft : C.amberSoft, stroke: ok ? C.green : C.amber, "stroke-width": 3 }, svg);
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % n];
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      const d = Math.hypot(mx - cx, my - cy) || 1;
      T(svg, mx + ((mx - cx) / d) * 13, my + ((my - cy) / d) * 13 + 4, "3", { "text-anchor": "middle", "font-size": 12, fill: C.ink, "font-weight": 700 });
      S("circle", { cx: p[0], cy: p[1], r: 3.5, fill: C.ink }, svg);
    });
    T(svg, cx, cy + 5, `n = ${n}`, { "text-anchor": "middle", "font-size": 18, "font-weight": 700, fill: C.ink });
    T(svg, 360, 60, "Perimeter", { "font-weight": 700 });
    T(svg, 360, 92, `3 × ${n} = ${3 * n} cm`, { "font-size": 22, "font-weight": 700, fill: ok ? C.green : C.red });
    T(svg, 360, 120, ok ? "at least 24 cm ✓" : "shorter than 24 cm ✗", { "font-size": 14, fill: ok ? C.green : C.red });
    const x0 = 30;
    const w = 560;
    const k = w / 36;
    const y = 372;
    T(svg, x0, y - 44, "Unroll the sides onto a ruler (cm):", { "font-size": 12, fill: "#555" });
    for (let i = 0; i < n; i++) {
      bar(svg, x0 + i * 3 * k + 1, y - 30, 3 * k - 2, 20, i % 2 ? C.blue : C.ink, { rx: 3 });
      T(svg, x0 + (i + 0.5) * 3 * k, y - 16, "3", { "text-anchor": "middle", fill: "#fff", "font-size": 11, "font-weight": 700 });
    }
    S("line", { x1: x0, y1: y, x2: x0 + w, y2: y, stroke: C.line, "stroke-width": 1.4 }, svg);
    for (let v = 0; v <= 36; v += 3) {
      S("line", { x1: x0 + v * k, y1: y - 4, x2: x0 + v * k, y2: y + 4, stroke: C.line }, svg);
      T(svg, x0 + v * k, y + 18, String(v), { "text-anchor": "middle", "font-size": 11 });
    }
    dashed(svg, x0 + 24 * k, y - 50, x0 + 24 * k, y + 6, C.red);
    T(svg, x0 + 24 * k, y - 54, "24 cm", { "text-anchor": "middle", "font-size": 12, fill: C.red, "font-weight": 700 });
    strip.replaceChildren(...Array.from({ length: 10 }, (_, i) => {
      const m = i + 3;
      const good = 3 * m >= 24;
      return H("button", {
        type: "button",
        class: `g-cell ${good ? "ok" : "bad"} ${m === n ? "on" : ""} ${m === 8 ? "star" : ""}`,
        onclick: () => s.set(m),
      }, [H("b", {}, [`n=${m}`]), H("span", {}, [`${3 * m} cm`])]);
    }));
    r.set(`3n = 3(${n}) = ${3 * n} ${sign(ok, "\\ge", "<")} 24`, ok,
      n < 8 ? "Not enough sides yet." : n === 8 ? "n = 8 is the least possible number of sides." : "This works, but 8 sides is already enough.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q3: rectangle ---------- */
function q3(root) {
  let part = 0;
  const svg = scene(620, 330);
  const s = slider({ label: "x", min: 0.3, max: 8, step: 0.1, value: 1.5 });
  const r = readout();
  root.append(
    question("The length and the width of a rectangle are $(2x + 3)$ cm and $(4x - 1)$ cm. (a) The length is shorter than twice its width. (b) The perimeter is greater than 64 cm.",
      ["(a) $2x + 3 < 2(4x - 1)$", "(b) $2[(2x + 3) + (4x - 1)] > 64$"]),
    tabs(["(a) length < 2 × width", "(b) perimeter > 64"], (i) => { part = i; draw(s.get()); }), svg, s.el, r.el,
  );
  const draw = (x) => {
    clear(svg);
    const L = 2 * x + 3;
    const W = 4 * x - 1;
    const k = Math.min(160 / L, 160 / Math.max(W, 0.2));
    S("rect", { x: 30, y: 40, width: L * k, height: Math.max(1, W * k), fill: C.blueSoft, stroke: C.ink, "stroke-width": 2.5 }, svg);
    T(svg, 30 + (L * k) / 2, 32, `length 2x + 3 = ${fmt(L)}`, { "text-anchor": "middle", "font-weight": 700, fill: C.ink });
    T(svg, 36 + L * k, 44 + (W * k) / 2, `width 4x − 1 = ${fmt(W)}`, { "font-weight": 700, fill: C.pink });
    const bx = 330;
    if (part === 0) {
      const twice = 2 * W;
      const ok = L < twice;
      const m = Math.max(L, twice, 1);
      T(svg, bx, 76, "Compare", { "font-weight": 700 });
      bar(svg, bx, 88, (L / m) * 260, 24, C.ink);
      T(svg, bx + 4, 105, `length ${fmt(L)}`, { fill: "#fff", "font-size": 12, "font-weight": 700 });
      bar(svg, bx, 120, (twice / m) * 260, 24, C.pink);
      T(svg, bx + 4, 137, `2 × width ${fmt(twice)}`, { fill: "#fff", "font-size": 12, "font-weight": 700 });
      const X = axis(svg, { x: 40, y: 290, w: 540, min: 0, max: 3, step: 0.25, every: 2 });
      condRay(svg, X, 290, 5 / 6, ">", C.green, { min: 0, max: 3 });
      T(svg, X(5 / 6) - 10, 240, "x > 5/6", { "text-anchor": "end", "font-weight": 700, fill: C.green });
      if (x <= 3) pin(svg, X(x), 290, ok ? C.green : C.red, fmt(x, 1), { level: 1 });
      r.set(`2(${fmt(x)}) + 3 = ${fmt(L)} ${sign(ok, "<", "\\ge")} ${fmt(twice)} = 2(4(${fmt(x)}) - 1)`, ok,
        ok ? "The length is shorter than twice the width." : "The length is not shorter yet — try a larger x.");
    } else {
      const per = 2 * (L + W);
      const ok = per > 64;
      const k2 = 260 / 100;
      T(svg, bx, 76, "Perimeter = L + W + L + W", { "font-weight": 700 });
      bar(svg, bx, 88, L * k2, 24, C.ink);
      bar(svg, bx + L * k2, 88, W * k2, 24, C.pink);
      bar(svg, bx + (L + W) * k2, 88, L * k2, 24, C.ink);
      bar(svg, bx + (2 * L + W) * k2, 88, W * k2, 24, C.pink);
      dashed(svg, bx + 64 * k2, 78, bx + 64 * k2, 124, C.red);
      T(svg, bx + 64 * k2, 140, "64 cm", { "text-anchor": "middle", fill: C.red, "font-weight": 700 });
      T(svg, bx, 168, `${fmt(per)} cm`, { "font-size": 18, "font-weight": 700, fill: ok ? C.green : C.red });
      const X = axis(svg, { x: 40, y: 290, w: 540, min: 0, max: 8, step: 1 });
      condRay(svg, X, 290, 5, ">", C.green, { min: 0, max: 8 });
      T(svg, X(5) - 10, 240, "x > 5", { "text-anchor": "end", "font-weight": 700, fill: C.green });
      pin(svg, X(x), 290, ok ? C.green : C.red, fmt(x, 1), { level: 1 });
      r.set(`2[(2(${fmt(x)}) + 3) + (4(${fmt(x)}) - 1)] = ${fmt(per)} ${sign(ok, ">", "\\le")} 64`, ok,
        ok ? "The perimeter is greater than 64 cm." : "The perimeter is not greater than 64 cm.");
    }
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q4: marbles ---------- */
function q4(root) {
  const svg = scene(620, 330);
  const s = slider({ label: "Green marbles k", min: 0, max: 12, step: 1, value: 3 });
  const r = readout();
  root.append(
    question("A box has $k$ green, $(3k + 5)$ blue and 20 yellow marbles. The number of blue marbles is not more than the green and yellow marbles together.",
      ["Inequality: $3k + 5 \\le k + 20$", "$k$ must be a whole number"]),
    svg, s.el, r.el, buttonRow([["Maximum k: 7", () => s.set(7)]]),
  );
  const jar = (x, count, color, title) => {
    S("rect", { x, y: 30, width: 150, height: 190, rx: 16, fill: "#fff", stroke: "#999", "stroke-width": 2 }, svg);
    for (let i = 0; i < count; i++) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      S("circle", { cx: x + 14 + col * 17.5, cy: 206 - row * 17, r: 7, fill: color, stroke: "rgba(0,0,0,.2)" }, svg);
    }
    T(svg, x + 75, 240, `${title}: ${count}`, { "text-anchor": "middle", "font-weight": 700, fill: color });
  };
  const draw = (k) => {
    clear(svg);
    jar(20, k, C.green, "green k");
    jar(235, 3 * k + 5, C.blue, "blue 3k + 5");
    jar(450, 20, C.amber, "yellow");
    const blue = 3 * k + 5;
    const other = k + 20;
    const ok = blue <= other;
    const m = 45;
    bar(svg, 20, 262, (blue / m) * 580, 20, C.blue);
    T(svg, 26, 277, `blue ${blue}`, { fill: "#fff", "font-weight": 700, "font-size": 12 });
    bar(svg, 20, 290, (k / m) * 580, 20, C.green);
    bar(svg, 20 + (k / m) * 580, 290, (20 / m) * 580, 20, C.amber);
    T(svg, 26, 305, `green + yellow ${other}`, { fill: "#fff", "font-weight": 700, "font-size": 12 });
    r.set(`3(${k}) + 5 = ${blue} ${sign(ok, "\\le", ">")} ${other} = ${k} + 20`, ok,
      ok ? (k === 7 ? "k = 7 is the maximum: 7 green and 3(7) + 5 = 26 blue marbles." : "Allowed. Can k be larger?") : "Too many blue marbles.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q5–Q8: consecutive numbers ---------- */
const CONSEC = {
  q5: {
    ask: "If the sum of two consecutive even numbers is less than 190, what is the greatest possible value of the larger number?",
    lets: ["Larger number $= x$", "Smaller number $= x - 2$", "Inequality: $(x - 2) + x < 190$, so $x < 96$"],
    label: "Larger even number x", min: 84, max: 104, step: 2, start: 88,
    pair: (x) => [x - 2, x], gap: "+2", xIs: "larger",
    name: "sum of the two numbers", val: (x) => 2 * x - 2, sub: (x) => `(${x} - 2) + ${x}`,
    op: "<", limit: 190, vRange: [160, 220], bound: 96, answer: 94,
    win: "x < 96 and x is even, so the greatest larger number is 94.",
  },
  q6: {
    ask: "If the sum of two consecutive odd numbers is greater than or equal to 202, what is the smallest possible value of the smaller number?",
    lets: ["Smaller number $= x$", "Larger number $= x + 2$", "Inequality: $x + (x + 2) \\ge 202$, so $x \\ge 100$"],
    label: "Smaller odd number x", min: 91, max: 111, step: 2, start: 97,
    pair: (x) => [x, x + 2], gap: "+2", xIs: "smaller",
    name: "sum of the two numbers", val: (x) => 2 * x + 2, sub: (x) => `${x} + (${x} + 2)`,
    op: "≥", limit: 202, vRange: [180, 230], bound: 100, answer: 101,
    win: "x ≥ 100 and x is odd, so the smallest smaller number is 101.",
  },
  q7: {
    ask: "For two consecutive numbers, twice the larger number minus the smaller number is not greater than 8. Find the largest possible value of the smaller number.",
    lets: ["Smaller number $= x$", "Larger number $= x + 1$", "Inequality: $2(x + 1) - x \\le 8$, so $x \\le 6$"],
    label: "Smaller number x", min: 0, max: 12, step: 1, start: 3,
    pair: (x) => [x, x + 1], gap: "+1", xIs: "smaller",
    name: "2 × larger − smaller", val: (x) => x + 2, sub: (x) => `2(${x} + 1) - ${x}`,
    op: "≤", limit: 8, vRange: [0, 16], bound: 6, answer: 6,
    win: "x ≤ 6, so the largest smaller number is 6.",
  },
  q8: {
    ask: "For two consecutive multiples of 6, 4 times the larger number minus 3 times the smaller number exceeds 60. Find the smallest possible value of the smaller number.",
    lets: ["Smaller number $= x$", "Larger number $= x + 6$", "Inequality: $4(x + 6) - 3x > 60$, so $x > 36$"],
    label: "Smaller multiple of 6, x", min: 12, max: 72, step: 6, start: 24,
    pair: (x) => [x, x + 6], gap: "+6", xIs: "smaller",
    name: "4 × larger − 3 × smaller", val: (x) => x + 24, sub: (x) => `4(${x} + 6) - 3(${x})`,
    op: ">", limit: 60, vRange: [30, 100], bound: 36, answer: 42,
    win: "x > 36 and x is a multiple of 6, so the smallest smaller number is 42.",
  },
};

function consecutive(root, id) {
  const spec = CONSEC[id];
  const svg = scene(620, 330);
  const s = slider({ label: spec.label, min: spec.min, max: spec.max, step: spec.step, value: spec.start });
  const r = readout();
  root.append(question(spec.ask, spec.lets), svg, s.el, r.el, buttonRow([[`Answer: ${spec.answer}`, () => s.set(spec.answer)]]));
  const [test, yes, no] = CMP[spec.op];
  const lo = spec.min - spec.step;
  const hi = spec.max + spec.step;
  const draw = (x) => {
    clear(svg);
    const [small, large] = spec.pair(x);
    const v = spec.val(x);
    const ok = test(v, spec.limit);

    T(svg, 20, 22, `The two numbers (x is the ${spec.xIs} number)`, { "font-weight": 700 });
    const y = 128;
    const X = axis(svg, { x: 40, y, w: 540, min: lo, max: hi, step: spec.step, every: spec.step === 1 ? 1 : 1 });
    condRay(svg, X, y, spec.bound, spec.op, C.green, { min: lo, max: hi });
    candidates(svg, X, y, range(spec.min, spec.max, spec.step), (c) => test(spec.val(c), spec.limit), spec.answer);
    const arcY = y + 30;
    S("path", { d: `M${X(small)},${arcY} Q${(X(small) + X(large)) / 2},${arcY + 26} ${X(large)},${arcY}`, fill: "none", stroke: C.amber, "stroke-width": 2, "marker-end": marker(svg, "arrAmber") }, svg);
    T(svg, (X(small) + X(large)) / 2, arcY + 32, spec.gap, { "text-anchor": "middle", fill: C.amber, "font-weight": 700 });
    pin(svg, X(small), y, C.blue, `smaller ${small}`, { level: 1 });
    pin(svg, X(large), y, C.pink, `larger ${large}`, { level: 2 });

    T(svg, 20, 222, `Condition: ${spec.name} ${spec.op} ${spec.limit}`, { "font-weight": 700 });
    const [a, b] = spec.vRange;
    const vy = 296;
    const V = axis(svg, { x: 40, y: vy, w: 540, min: a, max: b });
    condRay(svg, V, vy, spec.limit, spec.op, C.ink, { min: a, max: b });
    const vx = V(Math.max(a, Math.min(b, v)));
    pin(svg, vx, vy, ok ? C.green : C.red, `${v}`);

    r.set(`${spec.sub(x)} = ${v} ${ok ? yes : no} ${spec.limit}`, ok,
      ok ? (x === spec.answer ? spec.win : "This pair works. Is it the extreme value? Look for the ringed dot.") : "This pair does not satisfy the condition.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q9, Q10, Q12, Q17: two kinds of item ---------- */
function icon(svg, shape, cx, cy, size, color, letter) {
  const h = size * 0.7;
  if (shape === "duck") {
    S("ellipse", { cx, cy: cy - 2, rx: size * 0.42, ry: h * 0.34, fill: color }, svg);
    S("circle", { cx: cx + size * 0.3, cy: cy - h * 0.38, r: size * 0.15, fill: color }, svg);
    for (const dx of [-0.12, 0.12]) S("line", { x1: cx + dx * size, y1: cy + h * 0.2, x2: cx + dx * size, y2: cy + h * 0.45, stroke: "#8a5a00", "stroke-width": 1.6 }, svg);
  } else if (shape === "pig") {
    S("rect", { x: cx - size * 0.42, y: cy - h * 0.38, width: size * 0.84, height: h * 0.56, rx: h * 0.25, fill: color }, svg);
    for (const dx of [-0.3, -0.12, 0.12, 0.3]) S("line", { x1: cx + dx * size, y1: cy + h * 0.15, x2: cx + dx * size, y2: cy + h * 0.45, stroke: "#8c2f5a", "stroke-width": 1.6 }, svg);
  } else if (shape === "bottle") {
    S("rect", { x: cx - size * 0.1, y: cy - h * 0.5, width: size * 0.2, height: h * 0.2, rx: 2, fill: color }, svg);
    S("rect", { x: cx - size * 0.24, y: cy - h * 0.32, width: size * 0.48, height: h * 0.8, rx: 5, fill: color }, svg);
  } else if (shape === "doll") {
    S("circle", { cx, cy: cy - h * 0.3, r: size * 0.16, fill: color }, svg);
    S("path", { d: `M${cx},${cy - h * 0.15} l${size * 0.28},${h * 0.62} h${-size * 0.56} z`, fill: color }, svg);
  } else {
    S("rect", { x: cx - size * 0.45, y: cy - h * 0.45, width: size * 0.9, height: h * 0.9, rx: 7, fill: color }, svg);
  }
  if (letter) T(svg, cx, cy + 4, letter, { "text-anchor": "middle", "font-size": Math.max(9, size * 0.28), "font-weight": 700, fill: "#fff" });
}

const MIX = {
  q9: {
    ask: "Lisa wants to spend less than \\$400 on 10 lunch sets. Set lunch A costs \\$32 and set lunch B costs \\$48. She buys at least 1 of each. Find the maximum number of set lunch B.",
    lets: ["Set lunch B: $x$", "Set lunch A: $10 - x$", "Inequality: $32(10 - x) + 48x < 400$"],
    label: "Set lunch B, x", min: 1, max: 9, start: 2, total: 10,
    kinds: (x) => [{ n: 10 - x, name: "A ($32)", color: C.blue, shape: "tray", letter: "A" }, { n: x, name: "B ($48)", color: C.amber, shape: "tray", letter: "B" }],
    value: (x) => 32 * (10 - x) + 48 * x, money: true, unit: "", what: "total cost", limit: 400, op: "<", maxScale: 480,
    latex: (x, v) => `32(10 - ${x}) + 48(${x}) = ${v}`, answer: 4,
    caption: (ok, x) => (ok ? (x === 4 ? "4 sets of B is the maximum ($384)." : "Under $400 — can she afford more B?") : "Costs $400 or more."),
  },
  q10: {
    ask: "There are 55 ducks and pigs on a farm. The total number of legs is not more than 150. Find the maximum number of pigs.",
    lets: ["Pigs: $x$ (4 legs each)", "Ducks: $55 - x$ (2 legs each)", "Inequality: $2(55 - x) + 4x \\le 150$"],
    label: "Pigs, x", min: 0, max: 30, start: 12, total: 55,
    kinds: (x) => [{ n: 55 - x, name: "ducks (2 legs)", color: C.amber, shape: "duck" }, { n: x, name: "pigs (4 legs)", color: C.pink, shape: "pig" }],
    value: (x) => 2 * (55 - x) + 4 * x, unit: "legs", what: "legs", limit: 150, op: "≤", maxScale: 200,
    latex: (x, v) => `2(55 - ${x}) + 4(${x}) = ${v}`, answer: 20,
    caption: (ok, x) => (ok ? (x === 20 ? "20 pigs is the maximum (exactly 150 legs)." : "Not more than 150 legs.") : "More than 150 legs."),
  },
  q12: {
    ask: "Sally sends 20 bottles of body cream (500 g each) and nail remover (180 g each). The parcel cannot be heavier than 5 kg.",
    lets: ["Body cream: $x$ bottles", "Nail remover: $20 - x$ bottles", "Inequality: $500x + 180(20 - x) \\le 5000$"],
    label: "Body cream, x", min: 0, max: 20, start: 6, total: 20,
    kinds: (x) => [{ n: x, name: "body cream 500 g", color: C.ink, shape: "bottle", letter: "C" }, { n: 20 - x, name: "nail remover 180 g", color: C.pink, shape: "bottle", letter: "N" }],
    value: (x) => 500 * x + 180 * (20 - x), unit: "g", what: "weight", limit: 5000, op: "≤", maxScale: 10000,
    latex: (x, v) => `500(${x}) + 180(20 - ${x}) = ${v}`, answer: 4,
    caption: (ok, x) => (ok ? (x === 4 ? "(a) 4 bottles of body cream is the maximum, so (b) at least 20 − 4 = 16 nail removers." : "Within 5 kg.") : "Heavier than 5 kg."),
  },
  q17: {
    ask: "30 dolls are ordered. Doll A sells at \\$120 × 90% = \\$108 (cost \\$40); doll B sells at \\$300 × 80% = \\$240 (cost \\$80). The profit must be at least \\$3880.",
    lets: ["Dolls A: $x$, profit \\$68 each", "Dolls B: $30 - x$, profit \\$160 each", "Inequality: $68x + 160(30 - x) \\ge 3880$"],
    label: "Dolls A, x", min: 0, max: 30, start: 18, total: 30,
    kinds: (x) => [{ n: x, name: "A (+$68)", color: C.blue, shape: "doll", letter: "A" }, { n: 30 - x, name: "B (+$160)", color: C.amber, shape: "doll", letter: "B" }],
    value: (x) => 68 * x + 160 * (30 - x), money: true, unit: "", what: "profit", limit: 3880, op: "≥", maxScale: 5200,
    latex: (x, v) => `68(${x}) + 160(30 - ${x}) = ${v}`, answer: 10,
    caption: (ok, x) => (ok ? (x === 10 ? "At most 10 dolls A (profit exactly $3880)." : "Profit is at least $3880.") : "Profit is below $3880."),
  },
};

function mix(root, id) {
  const spec = MIX[id];
  const svg = scene(620, 330);
  const s = slider({ label: spec.label, min: spec.min, max: spec.max, step: 1, value: spec.start });
  const r = readout();
  root.append(question(spec.ask, spec.lets), svg, s.el, r.el, buttonRow([[`Answer: ${spec.answer}`, () => s.set(spec.answer)]]));
  const show = (v) => (spec.money ? `$${v}` : `${v} ${spec.unit}`);
  const draw = (x) => {
    clear(svg);
    const kinds = spec.kinds(x);
    const cols = spec.total > 30 ? 14 : 10;
    const size = spec.total > 30 ? 36 : 50;
    const rowH = size * 0.78 + 4;
    const rows = Math.ceil(spec.total / cols);
    let i = 0;
    kinds.forEach((kind) => {
      for (let j = 0; j < kind.n; j++, i++) {
        const cx = 30 + (i % cols) * (size + 4) + size / 2;
        const cy = 22 + Math.floor(i / cols) * rowH + size * 0.39;
        icon(svg, kind.shape, cx, cy, size, kind.color, kind.letter);
      }
    });
    const y0 = 22 + rows * rowH + 20;
    kinds.forEach((kind, k) => {
      bar(svg, 30 + k * 250, y0, 16, 16, kind.color);
      T(svg, 52 + k * 250, y0 + 13, `${kind.name} × ${kind.n}`, { "font-weight": 700 });
    });
    const v = spec.value(x);
    const [test, yes, no] = CMP[spec.op];
    const ok = test(v, spec.limit);
    const k = 560 / spec.maxScale;
    T(svg, 30, y0 + 44, `${spec.what[0].toUpperCase()}${spec.what.slice(1)}:`, { "font-weight": 700 });
    bar(svg, 30, y0 + 52, v * k, 28, ok ? C.green : C.red);
    T(svg, 36, y0 + 71, show(v), { fill: "#fff", "font-weight": 700 });
    dashed(svg, 30 + spec.limit * k, y0 + 42, 30 + spec.limit * k, y0 + 90, C.ink);
    T(svg, 30 + spec.limit * k, y0 + 108, `need ${spec.op} ${show(spec.limit)}`, { "text-anchor": "middle", "font-weight": 700, fill: C.ink });
    svg.setAttribute("viewBox", `0 0 620 ${y0 + 120}`);
    r.set(`${spec.latex(x, v)} ${ok ? yes : no} ${spec.limit}`, ok, spec.caption(ok, x));
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q11: oranges and money bars ---------- */
function orange(svg, cx, cy, rotten) {
  S("circle", { cx, cy, r: 8.5, fill: rotten ? "#8a6a43" : "#f39a1e", stroke: rotten ? "#5e4628" : "#d07a0c", "stroke-width": 1 }, svg);
  if (rotten) {
    S("circle", { cx: cx - 3, cy: cy + 2, r: 1.8, fill: "#5e4628" }, svg);
    S("circle", { cx: cx + 3, cy: cy - 1, r: 1.3, fill: "#5e4628" }, svg);
    S("path", { d: `M${cx - 5},${cy - 5} L${cx + 5},${cy + 5} M${cx + 5},${cy - 5} L${cx - 5},${cy + 5}`, stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round" }, svg);
  } else {
    S("ellipse", { cx: cx + 2.5, cy: cy - 8.5, rx: 3.2, ry: 1.6, fill: C.green, transform: `rotate(-25 ${cx + 2.5} ${cy - 8.5})` }, svg);
    S("circle", { cx: cx - 3, cy: cy - 3, r: 2, fill: "#ffd08a" }, svg);
  }
}

function q11(root) {
  const svg = scene(620, 400);
  const s = slider({ label: "Oranges bought, x", min: 8, max: 120, step: 1, value: 40 });
  const r = readout();
  root.append(
    question("A shopkeeper buys some oranges at \\$4 each. 8 are rotten; the rest are sold at \\$4.5 each. He does not suffer a loss. At least how many oranges did he buy?",
      ["Oranges bought: $x$, cost $4x$", "Oranges sold: $x - 8$, income $4.5(x - 8)$", "No loss: $4.5(x - 8) - 4x \\ge 0$"]),
    svg, s.el, r.el, buttonRow([["Too few: 60", () => s.set(60)], ["Just enough: 72", () => s.set(72)], ["More: 100", () => s.set(100)]]),
  );
  const COLS = 20;
  const GAP = 26;
  const gx = 40;
  const gy = 46;
  const bx = 150;
  const k = (600 - bx) / 504;
  const draw = (x) => {
    clear(svg);
    const sold = x - 8;
    const cost = 4 * x;
    const income = 4.5 * sold;
    const p = income - cost;
    const ok = p >= 0;

    T(svg, 30, 22, `He buys ${x} oranges`, { "font-weight": 700, "font-size": 14 });
    orange(svg, 250, 17, true);
    T(svg, 262, 22, `8 rotten (cannot sell)`, { "font-size": 12, fill: "#5e4628", "font-weight": 700 });
    orange(svg, 420, 17, false);
    T(svg, 432, 22, `${sold} sold at $4.5`, { "font-size": 12, fill: "#b8650a", "font-weight": 700 });
    for (let i = 0; i < x; i++) {
      orange(svg, gx + (i % COLS) * GAP, gy + Math.floor(i / COLS) * 24, i < 8);
    }

    const y0 = gy + 6 * 24 + 8;
    T(svg, 30, y0 + 4, "Money (same scale)", { "font-weight": 700, "font-size": 14 });
    const rows = [
      { y: y0 + 18, label: "Paid", sub: `${x} × $4`, v: cost, color: C.red, soft: C.redSoft, per: 4 },
      { y: y0 + 62, label: "Got back", sub: `${sold} × $4.5`, v: income, color: C.green, soft: C.greenSoft, per: 4.5 },
    ];
    for (const row of rows) {
      T(svg, 30, row.y + 15, row.label, { "font-weight": 700, fill: row.color });
      T(svg, 30, row.y + 30, row.sub, { "font-size": 11, fill: "#555" });
      bar(svg, bx, row.y, row.v * k, 30, row.color);
      for (let n = 10; n * row.per < row.v - 1e-9; n += 10) {
        const tx = bx + n * row.per * k;
        S("line", { x1: tx, y1: row.y + 3, x2: tx, y2: row.y + 27, stroke: "#fff", "stroke-width": 1, opacity: 0.6 }, svg);
      }
      T(svg, bx + 8, row.y + 20, `$${fmt(row.v)}`, { fill: "#fff", "font-weight": 700 });
    }

    const lo = bx + Math.min(cost, income) * k;
    const hi = bx + Math.max(cost, income) * k;
    const top = rows[0].y - 4;
    const bottom = rows[1].y + 34;
    S("rect", { x: lo, y: top, width: Math.max(0, hi - lo), height: bottom - top, fill: ok ? C.greenSoft : C.redSoft, opacity: 0.55 }, svg);
    for (const gx2 of [lo, hi]) S("line", { x1: gx2, y1: top, x2: gx2, y2: bottom + 6, stroke: ok ? C.green : C.red, "stroke-width": 1.6, "stroke-dasharray": "4 3" }, svg);
    const label = p === 0 ? "no loss, no profit" : ok ? `profit $${fmt(p)}` : `loss $${fmt(-p)}`;
    const mid = Math.min(Math.max((lo + hi) / 2, bx + 50), 560);
    T(svg, mid, bottom + 22, label, { "text-anchor": "middle", "font-weight": 700, "font-size": 14, fill: ok ? C.green : C.red });

    const yk = bottom + 48;
    T(svg, 30, yk, "Each sold orange earns $0.5 more than it cost, but the 8 rotten ones wasted 8 × $4 = $32.", { "font-size": 12, fill: C.ink });
    T(svg, 30, yk + 18, `Extra from ${sold} sold oranges: ${sold} × $0.5 = $${fmt(sold * 0.5)}  ${sold * 0.5 >= 32 ? "≥" : "<"}  $32`, { "font-size": 12, "font-weight": 700, fill: ok ? C.green : C.red });
    svg.setAttribute("viewBox", `0 0 620 ${yk + 30}`);

    r.set(`4.5(${x} - 8) - 4(${x}) = ${fmt(p)} ${sign(ok, "\\ge", "<")} 0`, ok,
      ok ? (x === 72 ? "Exactly break even: 72 is the least number of oranges." : `No loss (profit $${fmt(p)}).`)
        : `Loss of $${fmt(-p)}: the rotten oranges are not covered yet.`);
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q13, Q14: journeys ---------- */
function journey(root, id) {
  const q13 = id === "q13";
  const svg = scene(620, 260);
  const s = q13
    ? slider({ label: "Running speed x (m/s)", min: 3, max: 8.5, step: 0.1, value: 5 })
    : slider({ label: "Speed A→B, x (km/h)", min: 40, max: 80, step: 1, value: 55 });
  const r = readout();
  root.append(
    q13
      ? question("Hugo runs for 25 minutes, then cycles 1.5 m/s faster for 30 minutes. The total distance is not less than 22.5 km. Find his minimum running speed.",
        ["Running speed: $x$ m/s for $25 \\times 60$ s", "Cycling speed: $(x + 1.5)$ m/s for $30 \\times 60$ s", "Inequality: $1500x + 1800(x + 1.5) \\ge 22\\,500$"])
      : question("Harry drives from A to B for 2 hours, then 20 km/h faster from B to C for 1 hour 15 minutes. The total distance is at least 233 km. Can his speed from A to B be 60 km/h?",
        ["A → B: $x$ km/h for 2 h", "B → C: $(x + 20)$ km/h for 1.25 h", "Inequality: $2x + 1.25(x + 20) \\ge 233$"]),
    svg, s.el, r.el,
    buttonRow(q13 ? [["Minimum speed: 6 m/s", () => s.set(6)]] : [["Test 60 km/h", () => s.set(60)], ["Minimum speed: 64", () => s.set(64)]]),
  );
  const draw = (x) => {
    clear(svg);
    const d1 = q13 ? (x * 25 * 60) / 1000 : 2 * x;
    const d2 = q13 ? ((x + 1.5) * 30 * 60) / 1000 : 1.25 * (x + 20);
    const target = q13 ? 22.5 : 233;
    const maxD = q13 ? 32 : 300;
    const k = 540 / maxD;
    const y = 120;
    S("line", { x1: 40, y1: y, x2: 40 + maxD * k, y2: y, stroke: "#ddd", "stroke-width": 16, "stroke-linecap": "round" }, svg);
    S("line", { x1: 40, y1: y, x2: 40 + d1 * k, y2: y, stroke: C.blue, "stroke-width": 16, "stroke-linecap": "round" }, svg);
    S("line", { x1: 40 + d1 * k, y1: y, x2: 40 + (d1 + d2) * k, y2: y, stroke: C.amber, "stroke-width": 16, "stroke-linecap": "round" }, svg);
    const names = q13 ? ["Start", "", "End"] : ["A", "B", "C"];
    [0, d1, d1 + d2].forEach((d, i) => {
      S("circle", { cx: 40 + d * k, cy: y, r: 11, fill: "#fff", stroke: C.ink, "stroke-width": 3 }, svg);
      if (names[i]) T(svg, 40 + d * k, y - 22, names[i], { "text-anchor": "middle", "font-weight": 700 });
    });
    T(svg, 40 + (d1 * k) / 2, y + 36, `${q13 ? "run" : "A→B"} ${fmt(d1)} km`, { "text-anchor": "middle", fill: C.blue, "font-weight": 700 });
    T(svg, 40 + (d1 + d2 / 2) * k, y + 36, `${q13 ? "cycle" : "B→C"} ${fmt(d2)} km`, { "text-anchor": "middle", fill: C.amber, "font-weight": 700 });
    dashed(svg, 40 + target * k, 70, 40 + target * k, 170, C.red);
    T(svg, 40 + target * k, 62, `${target} km needed`, { "text-anchor": "middle", fill: C.red, "font-weight": 700 });
    const total = d1 + d2;
    const ok = total >= target - 1e-9;
    T(svg, 40, 222, `Total ${fmt(total)} km`, { "font-size": 18, "font-weight": 700, fill: ok ? C.green : C.red });
    if (q13) {
      const m = x * 1500 + (x + 1.5) * 1800;
      r.set(`${fmt(x)}(25)(60) + (${fmt(x)} + 1.5)(30)(60) = ${fmt(m, 0)} ${sign(ok, "\\ge", "<")} 22\\,500`, ok,
        ok ? (Math.abs(x - 6) < 1e-9 ? "6 m/s is the minimum running speed." : "Far enough.") : "Not far enough yet.");
    } else {
      r.set(`2(${x}) + 1.25(${x} + 20) = ${fmt(total)} ${sign(ok, "\\ge", "<")} 233`, ok,
        x === 60 ? "60 km/h gives only 210 km, less than 233 km, so it cannot be 60 km/h." : ok ? "At least 233 km." : "Less than 233 km.");
    }
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q15: interior and exterior angles ---------- */
function q15(root) {
  const svg = scene(620, 330);
  const s = slider({ label: "Number of sides n", min: 3, max: 20, step: 1, value: 6 });
  const r = readout();
  root.append(
    question("In a regular $n$-sided polygon, each interior angle is greater than its exterior angle by at least 100°. Keith claims that $n$ is at least 10.",
      ["Interior angle $x^\\circ$, exterior angle $(180 - x)^\\circ$", "(a) $x \\ge (180 - x) + 100$, so $x \\ge 140$", "(b) $(n - 2) \\times 180 \\ge 140n$, so $n \\ge 9$"]),
    svg, s.el, r.el, buttonRow([["Least n: 9", () => s.set(9)], ["Keith's n = 10", () => s.set(10)]]),
  );
  const draw = (n) => {
    clear(svg);
    const cx = 170;
    const cy = 165;
    const pts = regular(n, cx, cy, 115, Math.PI / 2 - Math.PI / n);
    S("polygon", { points: polygonPoints(pts), fill: "#fff", stroke: C.ink, "stroke-width": 2.5 }, svg);
    const v = pts[0];
    const next = pts[1];
    const prev = pts[n - 1];
    const aNext = Math.atan2(next[1] - v[1], next[0] - v[0]);
    const aPrev = Math.atan2(prev[1] - v[1], prev[0] - v[0]);
    const aExt = aPrev + Math.PI;
    S("line", { x1: v[0], y1: v[1], x2: v[0] + 80 * Math.cos(aExt), y2: v[1] + 80 * Math.sin(aExt), stroke: C.amber, "stroke-width": 2, "stroke-dasharray": "5 4" }, svg);
    sector(svg, v[0], v[1], 36, aNext, aPrev, C.blueSoft, C.blue);
    sector(svg, v[0], v[1], 44, aExt, aNext, C.amberSoft, C.amber);
    const interior = ((n - 2) * 180) / n;
    const exterior = 360 / n;
    const ok = interior >= exterior + 100 - 1e-9;
    const bx = 360;
    T(svg, bx, 50, `interior = ${fmt(interior, 1)}°`, { "font-size": 16, "font-weight": 700, fill: C.blue });
    T(svg, bx, 76, `exterior = 180° − ${fmt(interior, 1)}° = ${fmt(exterior, 1)}°`, { "font-size": 13, "font-weight": 700, fill: C.amber });
    const k = 230 / 180;
    bar(svg, bx, 100, interior * k, 22, C.blue);
    T(svg, bx + 4, 116, "interior", { fill: "#fff", "font-size": 11, "font-weight": 700 });
    bar(svg, bx, 130, exterior * k, 22, C.amber);
    bar(svg, bx + exterior * k, 130, 100 * k, 22, "#cfc6b5");
    T(svg, bx + exterior * k + 4, 146, "+100°", { "font-size": 11, "font-weight": 700 });
    T(svg, bx, 190, `difference ${fmt(interior - exterior, 1)}°`, { "font-size": 15, "font-weight": 700, fill: ok ? C.green : C.red });
    T(svg, bx, 214, "need at least 100°", { "font-size": 12, fill: "#666" });
    r.set(`\\frac{(${n}-2)\\times 180^\\circ}{${n}} = ${fmt(interior, 1)}^\\circ ${sign(ok, "\\ge", "<")} ${fmt(exterior, 1)}^\\circ + 100^\\circ`, ok,
      n === 9 ? "n = 9 already works (interior 140°, exterior 40°), so Keith's claim that n ≥ 10 is wrong." : ok ? "Works for this n." : "Difference is less than 100°.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q16: profit percentage ---------- */
function q16(root) {
  const svg = scene(620, 280);
  const s = slider({ label: "Selling price $x", min: 55, max: 70, step: 0.1, value: 60, fmt: (v) => `$${fmt(v, 1)}` });
  const r = readout();
  root.append(
    question("200 phone cases cost \\$7030 in total; 5% are broken and cannot be sold. The manager wants a profit of at least 70% and claims the price should be \\$60.",
      ["Cases sold: $200 \\times 95\\% = 190$", "Selling price: \\$$x$ each", "Inequality: $\\dfrac{190x - 7030}{7030} \\times 100\\% \\ge 70\\%$"]),
    svg, s.el, r.el, buttonRow([["Test $60", () => s.set(60)], ["Minimum price $62.9", () => s.set(62.9)]]),
  );
  const draw = (x) => {
    clear(svg);
    const revenue = 190 * x;
    const profit = revenue - 7030;
    const pct = (profit / 7030) * 100;
    const ok = pct >= 70 - 1e-6;
    const k = 520 / 14000;
    bar(svg, 60, 30, 7030 * k, 28, C.red);
    T(svg, 66, 49, "cost $7030", { fill: "#fff", "font-weight": 700 });
    bar(svg, 60, 70, revenue * k, 28, C.green);
    T(svg, 66, 89, `income 190x = $${fmt(revenue, 0)}`, { fill: "#fff", "font-weight": 700 });
    bar(svg, 60 + 7030 * k, 110, Math.max(0, profit) * k, 28, C.amber);
    T(svg, 60 + 7030 * k + 6, 129, `profit $${fmt(profit, 0)}`, { "font-weight": 700 });
    const g = 520 / 100;
    T(svg, 60, 186, `profit % = ${fmt(pct, 1)}%`, { "font-size": 15, "font-weight": 700, fill: ok ? C.green : C.red });
    bar(svg, 60, 200, 100 * g, 26, "#e5ded0");
    bar(svg, 60, 200, Math.max(0, Math.min(100, pct)) * g, 26, ok ? C.green : C.red);
    dashed(svg, 60 + 70 * g, 190, 60 + 70 * g, 236, C.ink);
    T(svg, 60 + 70 * g, 254, "70%", { "text-anchor": "middle", "font-weight": 700, fill: C.ink });
    r.set(`\\dfrac{190(${fmt(x, 1)}) - 7030}{7030} \\times 100\\% = ${fmt(pct, 1)}\\% ${sign(ok, "\\ge", "<")} 70\\%`, ok,
      Math.abs(x - 60) < 1e-6 ? "At $60 the profit is only about 62%, so the manager's claim is wrong." : ok ? "At least 70% profit." : "Below 70% profit.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q18: beaker ---------- */
function q18(root) {
  const svg = scene(620, 360);
  const s = slider({ label: "Extra sugar solution (π cm³)", min: 0, max: 80, step: 1, value: 20, fmt: (v) => `${v}π` });
  const r = readout();
  root.append(
    question("A beaker (radius 4 cm, height 25 cm) holds 12π cm³ of sugar solution. Water is added up to one-fifth of the height. Then extra sugar solution and 100π cm³ of water are added. The sugar solution must be at most 25%.",
      ["Mixed solution: $\\pi(4)^2(25)\\left(\\tfrac15\\right) = 80\\pi$ cm³", "Extra sugar solution: $x$ cm³", "Inequality: $x + 12\\pi \\le 25\\%\\,(80\\pi + x + 100\\pi)$"]),
    svg, s.el, r.el, buttonRow([["Maximum: 44π", () => s.set(44)]]),
  );
  const draw = (x) => {
    clear(svg);
    const cx = 150;
    const rx = 80;
    const ry = 16;
    const top = 30;
    const k = 11;
    const bottom = top + 25 * k;
    const layers = [
      { v: 12, color: C.amber, name: "sugar 12π" },
      { v: 68, color: C.blueSoft, name: "water 68π (to 5 cm)" },
      { v: x, color: "#f6c66a", name: `extra sugar ${x}π` },
      { v: 100, color: "#bcd6f7", name: "water 100π" },
    ];
    S("ellipse", { cx, cy: bottom, rx, ry, fill: "#eee", stroke: "#999" }, svg);
    let level = 0;
    let labelY = bottom + 4;
    layers.forEach((layer) => {
      const h = (layer.v / 16) * k;
      if (h <= 0) return;
      const y1 = bottom - level - h;
      S("rect", { x: cx - rx, y: y1, width: 2 * rx, height: h, fill: layer.color }, svg);
      S("ellipse", { cx, cy: y1, rx, ry, fill: layer.color, stroke: "rgba(0,0,0,.12)" }, svg);
      labelY = Math.min(labelY - 16, y1 + h / 2 + 4);
      T(svg, cx + rx + 12, labelY, layer.name, { "font-size": 12, "font-weight": 700, fill: "#555" });
      level += h;
    });
    S("line", { x1: cx - rx, y1: top, x2: cx - rx, y2: bottom, stroke: "#777", "stroke-width": 2 }, svg);
    S("line", { x1: cx + rx, y1: top, x2: cx + rx, y2: bottom, stroke: "#777", "stroke-width": 2 }, svg);
    S("ellipse", { cx, cy: top, rx, ry, fill: "none", stroke: "#777", "stroke-width": 2 }, svg);
    T(svg, cx - rx - 8, top + 4, "25 cm", { "text-anchor": "end", "font-size": 11, fill: "#777" });
    const fifth = bottom - 5 * k;
    dashed(svg, cx - rx - 22, fifth, cx - rx, fifth, C.ink);
    T(svg, cx - rx - 24, fifth + 4, "5 cm", { "text-anchor": "end", "font-size": 11, fill: C.ink, "font-weight": 700 });
    const sugar = 12 + x;
    const total = 180 + x;
    const pct = (sugar / total) * 100;
    const ok = pct <= 25 + 1e-9;
    const gx = 440;
    const gh = 260;
    bar(svg, gx, top, 50, gh, "#e5ded0");
    bar(svg, gx, top + gh - (pct / 50) * gh, 50, (pct / 50) * gh, ok ? C.green : C.red);
    dashed(svg, gx - 10, top + gh / 2, gx + 60, top + gh / 2, C.ink);
    T(svg, gx + 64, top + gh / 2 + 4, "25%", { "font-weight": 700, fill: C.ink });
    T(svg, gx + 25, top + gh + 22, `${fmt(pct, 1)}%`, { "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: ok ? C.green : C.red });
    T(svg, gx + 25, top + gh + 40, "sugar solution", { "text-anchor": "middle", "font-size": 11 });
    r.set(`\\dfrac{12\\pi + ${x}\\pi}{80\\pi + ${x}\\pi + 100\\pi} = ${fmt(pct, 1)}\\% ${sign(ok, "\\le", ">")} 25\\%`, ok,
      x === 44 ? "44π cm³ is the most sugar solution Victor can add." : ok ? "Within 25%." : "More than 25% sugar solution.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q19–Q22: mapping between two number lines ---------- */
const MAPS = {
  q19: {
    ask: "In each of the following, if $y > 5$, express the range of values of $x$ by an inequality.",
    parts: [
      { name: "(a) x = 2y", from: "y", to: "x", f: (y) => 2 * y, range: [0, 12], cond: { at: 5, op: ">" }, result: "x > 10" },
      { name: "(b) x = 3y + 4", from: "y", to: "x", f: (y) => 3 * y + 4, range: [0, 12], cond: { at: 5, op: ">" }, result: "x > 19" },
      { name: "(c) x = −5y", from: "y", to: "x", f: (y) => -5 * y, range: [0, 12], cond: { at: 5, op: ">" }, result: "x < −25" },
    ],
  },
  q20: {
    ask: "In each of the following, if $y < -\\tfrac72$, express the range of values of $x$ by an inequality.",
    parts: [
      { name: "(a) x = −(3/7)y − 1/2", from: "y", to: "x", f: (y) => (-3 / 7) * y - 0.5, range: [-10, 0], cond: { at: -3.5, op: "<" }, result: "x > 1" },
      { name: "(b) x = (7/2)(y − 1)", from: "y", to: "x", f: (y) => 3.5 * (y - 1), range: [-10, 0], cond: { at: -3.5, op: "<" }, result: "x < −63/4" },
    ],
  },
  q21: {
    ask: "Given that $y = 7 - \\tfrac{x}{2}$ and $x \\ge 36$, find the maximum value of $y$.",
    parts: [
      { name: "y = 7 − x/2", from: "x", to: "y", f: (x) => 7 - x / 2, range: [30, 50], cond: { at: 36, op: "≥" }, result: "y ≤ −11" },
    ],
  },
  q22: {
    ask: "Given that $24 - 3x + y = 0$, i.e. $y = 3x - 24$.",
    parts: [
      { name: "(a) x > 0", from: "x", to: "y", f: (x) => 3 * x - 24, range: [-3, 10], cond: { at: 0, op: ">" }, result: "y > −24" },
      { name: "(b) y ≤ −15", from: "y", to: "x", f: (y) => (24 + y) / 3, range: [-30, 0], cond: { at: -15, op: "≤" }, result: "x ≤ 3" },
      { name: "(c) x > 7", from: "x", to: "y", f: (x) => 3 * x - 24, range: [4, 12], cond: { at: 7, op: ">" }, result: "y > −3, so y can be 0" },
    ],
  },
};

function mapping(root, id) {
  const spec = MAPS[id];
  const parts = spec.parts;
  let part = parts[0];
  const svg = scene(620, 392);
  const legend = H("div", { class: "g-legend" });
  const r = readout();
  const s = slider({ label: "Move the sample point", min: 0, max: 100, step: 1, value: 70, fmt: () => "" });
  root.append(question(spec.ask, [
    "The green band marks the given range; the blue band marks the range it leads to.",
    "The orange overlap is where both hold: the red part of the line lies inside it.",
  ]));
  if (parts.length > 1) root.append(tabs(parts.map((p) => p.name), (i) => { part = parts[i]; draw(s.get()); }));
  root.append(svg, legend, s.el, r.el);
  const PX0 = 96;
  const PX1 = 596;
  const PY0 = 32;
  const PY1 = 316;
  const XLINE = 356;
  const YLINE = 46;
  const draw = (t) => {
    clear(svg);
    const [a, b] = part.range;
    const fa = part.f(a);
    const fb = part.f(b);
    const pad = (Math.max(fa, fb) - Math.min(fa, fb)) * 0.05;
    const toRange = [Math.min(fa, fb) - pad, Math.max(fa, fb) + pad];
    const fromIsX = part.from === "x";
    const [x0, x1] = fromIsX ? [a, b] : toRange;
    const [y0, y1] = fromIsX ? toRange : [a, b];
    const X = (v) => PX0 + ((v - x0) / (x1 - x0)) * (PX1 - PX0);
    const Y = (v) => PY1 - ((v - y0) / (y1 - y0)) * (PY1 - PY0);
    const pt = (v) => (fromIsX ? [v, part.f(v)] : [part.f(v), v]);

    const c = part.cond;
    const [test] = CMP[c.op];
    const closed = c.op === "≤" || c.op === "≥";
    const givenUp = c.op === ">" || c.op === "≥";
    const increasing = fb > fa;
    const img = part.f(c.at);
    const derivedUp = givenUp === increasing;
    const xDom = fromIsX ? { at: c.at, up: givenUp, color: C.green, soft: C.greenSoft } : { at: img, up: derivedUp, color: C.ink, soft: C.blueSoft };
    const yDom = fromIsX ? { at: img, up: derivedUp, color: C.ink, soft: C.blueSoft } : { at: c.at, up: givenUp, color: C.green, soft: C.greenSoft };

    const xs = niceStep(x1 - x0);
    const ys = niceStep(y1 - y0);
    for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) S("line", { x1: X(v), y1: PY0, x2: X(v), y2: PY1, stroke: "#ebe4d6" }, svg);
    for (let v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9; v += ys) S("line", { x1: PX0, y1: Y(v), x2: PX1, y2: Y(v), stroke: "#ebe4d6" }, svg);

    const bx = X(xDom.at);
    const by = Y(yDom.at);
    const xa = xDom.up ? bx : PX0;
    const xb = xDom.up ? PX1 : bx;
    const ya = yDom.up ? PY0 : by;
    const yb = yDom.up ? by : PY1;
    S("rect", { x: xa, y: PY0, width: xb - xa, height: PY1 - PY0, fill: xDom.soft, opacity: 0.85 }, svg);
    S("rect", { x: PX0, y: ya, width: PX1 - PX0, height: yb - ya, fill: yDom.soft, opacity: 0.85 }, svg);
    S("rect", { x: xa, y: ya, width: xb - xa, height: yb - ya, fill: "#fbd793" }, svg);
    S("rect", { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0, fill: "none", stroke: "#cfc6b4" }, svg);
    if (x0 < 0 && x1 > 0) S("line", { x1: X(0), y1: PY0, x2: X(0), y2: PY1, stroke: "#8d877c", "stroke-width": 1.2 }, svg);
    if (y0 < 0 && y1 > 0) S("line", { x1: PX0, y1: Y(0), x2: PX1, y2: Y(0), stroke: "#8d877c", "stroke-width": 1.2 }, svg);

    const [ax, ay] = pt(a);
    const [ex, ey] = pt(b);
    S("line", { x1: X(ax), y1: Y(ay), x2: X(ex), y2: Y(ey), stroke: "#6b665d", "stroke-width": 2 }, svg);
    const [sx, sy] = pt(givenUp ? b : a);
    S("line", { x1: bx, y1: by, x2: X(sx), y2: Y(sy), stroke: C.red, "stroke-width": 4.5, "stroke-linecap": "round" }, svg);
    dashed(svg, bx, by, bx, XLINE - 2, C.red);
    dashed(svg, bx, by, YLINE + 2, by, C.red);
    S("circle", { cx: bx, cy: by, r: 6, fill: closed ? C.red : "#fff", stroke: C.red, "stroke-width": 2.2 }, svg);
    T(svg, bx + (increasing ? -10 : 10), by - 10, `(${fmt(xDom.at)}, ${fmt(yDom.at)})`, { "text-anchor": increasing ? "end" : "start", "font-size": 12, "font-weight": 700, fill: C.red });

    const XA = axis(svg, { x: PX0, y: XLINE, w: PX1 - PX0, min: x0, max: x1, step: xs });
    T(svg, 612, XLINE - 10, "x", { "text-anchor": "middle", "font-size": 16, "font-weight": 700, "font-style": "italic" });
    ray(svg, XA, XLINE, xDom.at, xDom.up ? "right" : "left", closed, xDom.color, { min: x0, max: x1 });
    vAxis(svg, Y, YLINE, y0, y1, ys);
    T(svg, YLINE + 9, 14, "y", { "font-size": 16, "font-weight": 700, "font-style": "italic" });
    vRay(svg, Y, YLINE, yDom.at, yDom.up, closed, yDom.color, y0, y1);

    const v = a + ((b - a) * t) / 100;
    const out = part.f(v);
    const ok = test(v, c.at);
    const [px, py] = pt(v);
    const dot = ok ? C.green : C.grey;
    S("line", { x1: X(px), y1: Y(py), x2: X(px), y2: XLINE, stroke: dot, "stroke-dasharray": "3 3" }, svg);
    S("line", { x1: X(px), y1: Y(py), x2: YLINE, y2: Y(py), stroke: dot, "stroke-dasharray": "3 3" }, svg);
    S("circle", { cx: X(px), cy: XLINE, r: 4, fill: dot }, svg);
    S("circle", { cx: YLINE, cy: Y(py), r: 4, fill: dot }, svg);
    S("circle", { cx: X(px), cy: Y(py), r: 6.5, fill: dot, stroke: "#fff", "stroke-width": 2 }, svg);

    const sw = (color) => `display:inline-block;width:12px;height:12px;border-radius:3px;margin:0 5px 0 12px;vertical-align:-1px;background:${color}`;
    const given = `${part.from} ${c.op} ${fmt(c.at)}`;
    legend.replaceChildren(
      H("span", { style: sw(C.green) }), `given: ${given}`,
      H("span", { style: sw(C.ink) }), `so: ${part.result}`,
      H("span", { style: sw(C.amber) }), "both hold",
      H("b", { style: `margin-left:12px;color:${increasing ? C.green : C.red}` }, [increasing ? "same direction" : "negative coefficient: sign reversed"]),
    );
    r.set(`${part.from} = ${fmt(v, 2)} \\;\\Rightarrow\\; ${part.to} = ${fmt(out, 2)}`, ok,
      ok ? `This ${part.from} satisfies ${given}, so the point is in the orange overlap: ${part.result}.` : `This ${part.from} is outside the given range, so the point is outside the overlap.`);
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- MC: test values, counterexamples and the answer letter ---------- */
const MC = {
  ex2: {
    ask: "If $h$ and $k$ are non-zero constants such that $\\tfrac{h}{k} > 0$, which of the following must be true?",
    vars: ["h", "k"], guard: (v) => v.h !== 0 && v.k !== 0 && v.h / v.k > 0, guardTex: "h, k \\ne 0,\\ \\tfrac{h}{k} > 0",
    rows: [["I", "hk > 0", (v) => v.h * v.k > 0], ["II", "h - k > 0", (v) => v.h - v.k > 0], ["III", "h\\left(\\tfrac1k\\right) + k\\left(\\tfrac1h\\right) > 0", (v) => v.h / v.k + v.k / v.h > 0]],
    seek: "true", options: [["A", ["I"]], ["B", ["II"]], ["C", ["I", "III"]], ["D", ["II", "III"]]], start: { h: 3, k: 4 },
  },
  p2: {
    ask: "If $m \\ge n$ and $k > 0$, which of the following must be true?",
    vars: ["m", "n", "k"], guard: (v) => v.m >= v.n && v.k > 0, guardTex: "m \\ge n,\\ k > 0",
    rows: [["I", "k + m \\ge k + n", (v) => v.k + v.m >= v.k + v.n], ["II", "kn \\le km", (v) => v.k * v.n <= v.k * v.m], ["III", "m^2 \\ge n^2", (v) => v.m * v.m >= v.n * v.n]],
    seek: "true", options: [["A", ["I", "II"]], ["B", ["I", "III"]], ["C", ["II", "III"]], ["D", ["I", "II", "III"]]], start: { m: 2, n: 1, k: 2 },
  },
  q23: {
    ask: "If $u > v$, which of the following inequalities is NOT true?",
    vars: ["u", "v"], guard: (v) => v.u > v.v, guardTex: "u > v",
    rows: [["A", "u - v > 0", (v) => v.u - v.v > 0], ["B", "u + v > 2v", (v) => v.u + v.v > 2 * v.v], ["C", "u + v < 2u", (v) => v.u + v.v < 2 * v.u], ["D", "2 - v < 2 - u", (v) => 2 - v.v < 2 - v.u]],
    seek: "false", options: [["A", ["A"]], ["B", ["B"]], ["C", ["C"]], ["D", ["D"]]], start: { u: 3, v: 1 },
  },
  q24: {
    ask: "If $m < n$ and $k < 0$, which of the following must be true?",
    vars: ["m", "n", "k"], guard: (v) => v.m < v.n && v.k < 0, guardTex: "m < n,\\ k < 0",
    rows: [["I", "m - k < n - k", (v) => v.m - v.k < v.n - v.k], ["II", "-km < -kn", (v) => -v.k * v.m < -v.k * v.n], ["III", "\\tfrac{m}{k^2} < \\tfrac{n}{k^2}", (v) => v.m / (v.k * v.k) < v.n / (v.k * v.k)]],
    seek: "true", options: [["A", ["I", "II"]], ["B", ["I", "III"]], ["C", ["II", "III"]], ["D", ["I", "II", "III"]]], start: { m: 1, n: 3, k: -2 },
  },
  q25: {
    ask: "If $p \\ge q$, which of the following must be correct?",
    vars: ["p", "q"], guard: (v) => v.p >= v.q && v.p !== 0 && v.q !== 0, guardTex: "p \\ge q\\ (p, q \\ne 0)",
    rows: [["I", "p - 2 \\ge q - 2", (v) => v.p - 2 >= v.q - 2], ["II", "-\\tfrac{p}{5} \\le -\\tfrac{q}{5}", (v) => -v.p / 5 <= -v.q / 5], ["III", "\\tfrac{2}{p} \\le \\tfrac{2}{q}", (v) => 2 / v.p <= 2 / v.q]],
    seek: "true", options: [["A", ["I", "II"]], ["B", ["I", "III"]], ["C", ["II", "III"]], ["D", ["I", "II", "III"]]], start: { p: 3, q: 1 },
  },
  q26: {
    ask: "If $x > y$ and $a < 0$, which of the following must be true?",
    vars: ["x", "y", "a"], guard: (v) => v.x > v.y && v.a < 0, guardTex: "x > y,\\ a < 0",
    rows: [["I", "\\tfrac{x}{a} > \\tfrac{y}{a}", (v) => v.x / v.a > v.y / v.a], ["II", "a - 2x < a - 2y", (v) => v.a - 2 * v.x < v.a - 2 * v.y], ["III", "-5a^3x > -5a^3y", (v) => -5 * v.a ** 3 * v.x > -5 * v.a ** 3 * v.y]],
    seek: "true", options: [["A", ["I"]], ["B", ["II"]], ["C", ["I", "III"]], ["D", ["II", "III"]]], start: { x: 2, y: 1, a: -1 },
  },
  q27: {
    ask: "If $x \\le y$ and $z > y$, where $z$ is a negative number, which of the following is not true?",
    vars: ["x", "y", "z"], guard: (v) => v.x <= v.y && v.z > v.y && v.z < 0, guardTex: "x \\le y,\\ z > y,\\ z < 0",
    rows: [["A", "x \\le y < z", (v) => v.x <= v.y && v.y < v.z], ["B", "y - x < z - x", (v) => v.y - v.x < v.z - v.x], ["C", "xz < xy", (v) => v.x * v.z < v.x * v.y], ["D", "-\\tfrac{x}{4} < -\\tfrac{z}{4}", (v) => -v.x / 4 < -v.z / 4]],
    seek: "false", options: [["A", ["A"]], ["B", ["B"]], ["C", ["C"]], ["D", ["D"]]], start: { x: -5, y: -3, z: -1 },
  },
  q28: {
    ask: "Which of the following is true?",
    vars: ["a", "x", "y"], guard: () => true, guardTex: "\\text{any } a, x, y",
    rows: [
      ["A", "\\text{If } a - x < a - y, \\text{ then } x < y", (v) => !(v.a - v.x < v.a - v.y) || v.x < v.y],
      ["B", "\\text{If } ax < ay, \\text{ then } x < y", (v) => !(v.a * v.x < v.a * v.y) || v.x < v.y],
      ["C", "\\text{If } a^2x < a^2y, \\text{ then } x < y", (v) => !(v.a * v.a * v.x < v.a * v.a * v.y) || v.x < v.y],
      ["D", "\\text{If } x^2 < y^2, \\text{ then } x < y", (v) => !(v.x * v.x < v.y * v.y) || v.x < v.y],
    ],
    seek: "true", options: [["A", ["A"]], ["B", ["B"]], ["C", ["C"]], ["D", ["D"]]], start: { a: 2, x: 1, y: 2 },
  },
  q29: {
    ask: "If $x < y$, which of the following is false? I. $a - x < a - y$  II. $a^2x < a^2y$  III. $x^2 < y^2$",
    vars: ["x", "y", "a"], guard: (v) => v.x < v.y, guardTex: "x < y",
    rows: [["I", "a - x < a - y", (v) => v.a - v.x < v.a - v.y], ["II", "a^2x < a^2y", (v) => v.a * v.a * v.x < v.a * v.a * v.y], ["III", "x^2 < y^2", (v) => v.x * v.x < v.y * v.y]],
    seek: "false", options: [["A", ["I", "II"]], ["B", ["II", "III"]], ["C", ["I", "III"]], ["D", ["I", "II", "III"]]], start: { x: 1, y: 2, a: 1 },
  },
  q30: {
    ask: "If $x < y$, which of the following is incorrect?",
    vars: ["x", "y", "a"], guard: (v) => v.x < v.y, guardTex: "x < y",
    rows: [["A", "x - a < y - a", (v) => v.x - v.a < v.y - v.a], ["B", "-y < -x", (v) => -v.y < -v.x], ["C", "a^2x < a^2y", (v) => v.a * v.a * v.x < v.a * v.a * v.y], ["D", "x^3 < y^3", (v) => v.x ** 3 < v.y ** 3]],
    seek: "false", options: [["A", ["A"]], ["B", ["B"]], ["C", ["C"]], ["D", ["D"]]], start: { x: 1, y: 2, a: 1 },
  },
};

const GRID = (() => {
  const order = [1, -1, 2, -2, 0, 3, -3, 0.5, -0.5, 4, -4, 5, -5, 6, -6, 1.5, -1.5, 2.5, -2.5];
  const all = [];
  for (let v = -6; v <= 6; v += 0.5) all.push(v);
  return all.sort((p, q) => {
    const ip = order.indexOf(p);
    const iq = order.indexOf(q);
    return (ip < 0 ? 99 : ip) - (iq < 0 ? 99 : iq);
  });
})();

function counterexample(spec, fn) {
  const names = spec.vars;
  const cur = {};
  const rec = (i) => {
    if (i === names.length) return spec.guard(cur) && !fn(cur) ? { ...cur } : null;
    for (const v of GRID) {
      cur[names[i]] = v;
      const hit = rec(i + 1);
      if (hit) return hit;
    }
    return null;
  };
  return rec(0);
}

function mc(root, id) {
  const spec = MC[id];
  const values = { ...spec.start };
  const sliders = {};
  const status = {};
  const svg = scene(620, 145);
  const cond = H("div", { class: "g-cond" });
  const list = H("div", { class: "g-checks" });
  const verdict = H("div", { class: "g-verdict" });
  const options = H("div", { class: "g-options" });
  root.append(
    question(spec.ask, ["Pick numbers that satisfy the condition: a green row only shows that one example works.", "“Find counterexample” searches for numbers that break a statement."]),
    cond, svg,
  );
  for (const name of spec.vars) {
    const s = slider({ label: name, min: -6, max: 6, step: 0.5, value: values[name], play: false });
    s.on((v) => { values[name] = v; refresh(); });
    sliders[name] = s;
    root.append(s.el);
  }
  root.append(list, buttonRow([["Check every statement", checkAll]]), options, verdict);
  const colors = [C.blue, C.pink, C.amber];
  function refresh() {
    const ok = spec.guard(values);
    cond.replaceChildren(H("span", {}, ["Condition "]), tex(spec.guardTex), H("b", { class: ok ? "ok" : "bad" }, [ok ? " met" : " not met"]));
    clear(svg);
    const X = axis(svg, { x: 30, y: 118, w: 560, min: -6, max: 6, step: 1 });
    spec.vars.forEach((name, i) => pin(svg, X(values[name]), 118, colors[i], `${name} = ${fmt(values[name])}`, { level: i }));
    list.replaceChildren(...spec.rows.map(([tag, latex, fn]) => {
      const held = ok && fn(values);
      const known = status[tag];
      const row = H("div", { class: `g-check ${!ok ? "idle" : held ? "ok" : "bad"} ${known === "must" ? "proved" : ""}` }, [
        H("b", {}, [tag]),
        tex(latex),
        H("span", { class: "g-state" }, [known === "must" ? "must be true" : known === "can-fail" ? "can be false" : !ok ? "—" : held ? "true here" : "false here"]),
        H("button", { type: "button", onclick: () => search(tag, fn) }, ["Find counterexample"]),
      ]);
      return row;
    }));
  }
  function search(tag, fn) {
    const hit = counterexample(spec, fn);
    if (hit) {
      status[tag] = "can-fail";
      for (const name of spec.vars) {
        values[name] = hit[name];
        sliders[name].set(hit[name]);
      }
    } else status[tag] = "must";
    refresh();
  }
  function checkAll() {
    for (const [tag, , fn] of spec.rows) status[tag] = counterexample(spec, fn) ? "can-fail" : "must";
    refresh();
    const want = spec.rows.map(([tag]) => tag).filter((tag) => (spec.seek === "true" ? status[tag] === "must" : status[tag] === "can-fail"));
    const match = spec.options.find(([, set]) => set.length === want.length && set.every((t) => want.includes(t)));
    const describe = (letter, set) => {
      if (set.length === 1 && set[0] === letter) return "";
      if (set.length === spec.rows.length && set.length > 1) return " I, II and III";
      return ` ${set.join(" and ")}${set.length < spec.rows.length ? " only" : ""}`;
    };
    options.replaceChildren(...spec.options.map(([letter, set]) => H("span", { class: `g-option ${match && match[0] === letter ? "on" : ""}` }, [
      H("b", {}, [letter]), describe(letter, set),
    ])));
    const what = spec.seek === "true" ? "must be true" : "can be false";
    verdict.textContent = `Statements that ${what}: ${want.join(", ") || "none"}.  Answer: ${match ? match[0] : "?"}`;
  }
  refresh();
}

/* ---------- Q31: arithmetic sequence ---------- */
function q31(root) {
  const svg = scene(620, 230);
  const s = slider({ label: "Term number n", min: 1, max: 150, step: 1, value: 45 });
  const r = readout();
  root.append(
    question("The sequence is 100, 103, 106, …, and the $n$th term is $100 + 3(n - 1)$. (a) Find the first term that exceeds 250. (b) How many terms are between 250 and 500 exclusively?",
      ["(a) $100 + 3(n - 1) > 250$, so $n > 51$", "(b) $100 + 3(n - 1) < 500$, so $n < 134\\tfrac13$"]),
    svg, s.el, r.el,
    buttonRow([["First term > 250 (n = 52)", () => s.set(52)], ["Last term < 500 (n = 134)", () => s.set(134)]]),
  );
  const draw = (n) => {
    clear(svg);
    const X = axis(svg, { x: 30, y: 130, w: 560, min: 100, max: 560, step: 50 });
    for (let k = 1; k <= 154; k++) {
      const term = 100 + 3 * (k - 1);
      const inside = term > 250 && term < 500;
      S("line", { x1: X(term), y1: 112, x2: X(term), y2: 126, stroke: inside ? C.green : "#bbb", "stroke-width": 1.4 }, svg);
    }
    dashed(svg, X(250), 46, X(250), 136, C.red);
    dashed(svg, X(500), 46, X(500), 136, C.red);
    T(svg, X(250), 40, "250", { "text-anchor": "middle", fill: C.red, "font-weight": 700 });
    T(svg, X(500), 40, "500", { "text-anchor": "middle", fill: C.red, "font-weight": 700 });
    const term = 100 + 3 * (n - 1);
    pin(svg, X(Math.min(term, 560)), 130, C.ink, `T${n} = ${term}`, { level: 1 });
    T(svg, 30, 186, "First term above 250: T52 = 253", { "font-size": 13, fill: C.ink, "font-weight": 700 });
    T(svg, 330, 186, "Last term below 500: T134 = 499", { "font-size": 13, fill: C.ink, "font-weight": 700 });
    T(svg, 30, 210, "Number of green terms = 134 − 52 + 1 = 83", { "font-size": 13, fill: C.green, "font-weight": 700 });
    const ok = term > 250 && term < 500;
    r.set(`T_{${n}} = 100 + 3(${n} - 1) = ${term}`, ok, ok ? "Between 250 and 500." : term <= 250 ? "Not above 250 yet." : "500 or more.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q32: two lines ---------- */
function q32(root) {
  const svg = scene(620, 380);
  const s = slider({ label: "k", min: 8, max: 14, step: 0.25, value: 9 });
  const r = readout();
  root.append(
    question("Two positive numbers $x$ and $y$ satisfy $3x + 4y = 15$ and $2x + 3y = k$, where $k$ is an integral constant. Determine the value(s) of $k$.",
      ["Solving: $x = 45 - 4k$, $y = 3k - 30$", "$x > 0$ and $y > 0$: $10 < k < 11.25$"]),
    svg, s.el, r.el,
    buttonRow([["k = 10", () => s.set(10)], ["k = 11", () => s.set(11)], ["k = 12", () => s.set(12)]]),
  );
  const ox = 260;
  const oy = 250;
  const u = 16;
  const draw = (k) => {
    clear(svg);
    S("rect", { x: ox, y: oy - 15 * u, width: 21 * u, height: 15 * u, fill: C.greenSoft }, svg);
    for (let i = -15; i <= 21; i++) S("line", { x1: ox + i * u, y1: oy - 15 * u, x2: ox + i * u, y2: oy + 7 * u, stroke: "#eee" }, svg);
    for (let j = -7; j <= 15; j++) S("line", { x1: ox - 15 * u, y1: oy - j * u, x2: ox + 21 * u, y2: oy - j * u, stroke: "#eee" }, svg);
    S("line", { x1: ox - 15 * u, y1: oy, x2: ox + 21 * u, y2: oy, stroke: C.line, "stroke-width": 1.5 }, svg);
    S("line", { x1: ox, y1: oy + 7 * u, x2: ox, y2: oy - 15 * u, stroke: C.line, "stroke-width": 1.5 }, svg);
    T(svg, ox + 21 * u - 10, oy - 6, "x", { "font-style": "italic", "font-weight": 700 });
    T(svg, ox + 6, oy - 15 * u + 12, "y", { "font-style": "italic", "font-weight": 700 });
    const clipId = `q32clip-${svg.querySelector("marker").id}`;
    const clip = S("clipPath", { id: clipId }, svg);
    S("rect", { x: ox - 15 * u, y: oy - 15 * u, width: 36 * u, height: 22 * u }, clip);
    const lineFor = (fy, color) => {
      S("line", { x1: ox - 15 * u, y1: oy - fy(-15) * u, x2: ox + 21 * u, y2: oy - fy(21) * u, stroke: color, "stroke-width": 2.5, "clip-path": `url(#${clipId})` }, svg);
    };
    lineFor((x) => (15 - 3 * x) / 4, C.ink);
    lineFor((x) => (k - 2 * x) / 3, C.red);
    const lx = ox + 21 * u - 10;
    S("rect", { x: lx - 150, y: oy - 15 * u + 6, width: 154, height: 70, rx: 8, fill: "#fff", opacity: 0.92 }, svg);
    T(svg, lx, oy - 15 * u + 26, "x > 0, y > 0", { "text-anchor": "end", fill: C.green, "font-weight": 700 });
    T(svg, lx, oy - 15 * u + 47, "3x + 4y = 15", { "text-anchor": "end", fill: C.ink, "font-weight": 700, "font-size": 14 });
    T(svg, lx, oy - 15 * u + 68, `2x + 3y = ${fmt(k)}`, { "text-anchor": "end", fill: C.red, "font-weight": 700, "font-size": 14 });
    const x = 45 - 4 * k;
    const y = 3 * k - 30;
    const pos = x > 0 && y > 0;
    const integer = Number.isInteger(k);
    S("circle", { cx: ox + x * u, cy: oy - y * u, r: 6, fill: pos ? C.green : C.red, stroke: "#fff", "stroke-width": 2 }, svg);
    T(svg, ox + x * u + 10, oy - y * u - 8, `(${fmt(x)}, ${fmt(y)})`, { "font-weight": 700, fill: pos ? C.green : C.red });
    T(svg, 20, 366, "10 < k < 11.25 and k is an integer, so k = 11", { "font-weight": 700, fill: C.ink });
    const ok = pos && integer;
    r.set(`x = 45 - 4(${fmt(k)}) = ${fmt(x)},\\quad y = 3(${fmt(k)}) - 30 = ${fmt(y)}`, ok,
      !pos ? "x and y are not both positive." : integer ? "Both positive with an integral k: k = 11." : "Both positive, but k must be an integer.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q33: Ben, Cathy and Dick ---------- */
function q33(root) {
  let mode = 0;
  const svg = scene(620, 320);
  const host = H("div");
  const r = readout();
  root.append(
    question("Ben has \\$$(2x + 34)$, Cathy has \\$$(5x + 10)$ and Dick has \\$$y$. (I) Two of them have the same amount, but not Dick and Cathy. (II) Any two together have more than the third. Can they afford a \\$600 dinner?",
      ["Case 1: Ben = Cathy, so $x = 8$", "Case 2: Ben = Dick, so $y = 2x + 34$"]),
    tabs(["Case 1: Ben = Cathy", "Case 2: Ben = Dick"], (i) => { mode = i; build(); }), svg, host, r.el,
  );
  let s;
  const build = () => {
    host.replaceChildren();
    s = mode === 0
      ? slider({ label: "Dick y ($)", min: 0, max: 140, step: 1, value: 60 })
      : slider({ label: "x", min: 0, max: 70, step: 1, value: 30 });
    host.append(s.el);
    s.on(draw);
    draw(s.get());
  };
  const draw = (val) => {
    clear(svg);
    const x = mode === 0 ? 8 : val;
    const ben = 2 * x + 34;
    const cathy = 5 * x + 10;
    const dick = mode === 0 ? val : ben;
    const people = [["Ben", ben, C.blue], ["Cathy", cathy, C.pink], ["Dick", dick, C.amber]];
    const k = 200 / (mode === 0 ? 160 : 380);
    people.forEach(([name, amt, color], i) => {
      const bx = 50 + i * 110;
      bar(svg, bx, 240 - amt * k, 70, amt * k, color);
      T(svg, bx + 35, 260, name, { "text-anchor": "middle", "font-weight": 700 });
      T(svg, bx + 35, 234 - amt * k, `$${fmt(amt)}`, { "text-anchor": "middle", "font-weight": 700 });
    });
    const checks = [
      ["Ben + Cathy > Dick", ben + cathy > dick],
      ["Ben + Dick > Cathy", ben + dick > cathy],
      ["Cathy + Dick > Ben", cathy + dick > ben],
    ];
    T(svg, 390, 36, "Condition (II)", { "font-weight": 700 });
    checks.forEach(([text, ok], i) => T(svg, 390, 62 + i * 26, `${ok ? "✓" : "✗"} ${text}`, { fill: ok ? C.green : C.red, "font-weight": 700 }));
    const total = ben + cathy + dick;
    const valid = checks.every((c) => c[1]);
    T(svg, 390, 160, `Total = $${fmt(total)}`, { "font-size": 18, "font-weight": 700, fill: total >= 600 ? C.red : C.green });
    T(svg, 390, 184, total >= 600 ? "enough for $600" : "less than $600", { fill: "#555" });
    if (mode === 0) {
      r.set(`50 + 50 + ${fmt(dick)} = ${fmt(total)}`, valid,
        valid ? "With (II), Dick has less than $100, so the total is less than $200." : "This y breaks condition (II).");
    } else {
      r.set(`9(${x}) + 78 = ${fmt(total)}`, valid,
        valid ? "Condition (II) forces x < 58, so the total stays below 9(58) + 78 = $600." : "x ≥ 58 breaks condition (II).");
    }
  };
  build();
}

const REGISTRY = {
  ex1, p1a, p1b, q1, q2, q3, q4,
  q5: (r) => consecutive(r, "q5"), q6: (r) => consecutive(r, "q6"), q7: (r) => consecutive(r, "q7"), q8: (r) => consecutive(r, "q8"),
  q9: (r) => mix(r, "q9"), q10: (r) => mix(r, "q10"), q11, q12: (r) => mix(r, "q12"),
  q13: (r) => journey(r, "q13"), q14: (r) => journey(r, "q14"), q15, q16, q17: (r) => mix(r, "q17"), q18,
  q19: (r) => mapping(r, "q19"), q20: (r) => mapping(r, "q20"), q21: (r) => mapping(r, "q21"), q22: (r) => mapping(r, "q22"),
  q31, q32, q33,
};
for (const id of Object.keys(MC)) REGISTRY[id] = (r) => mc(r, id);

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  root.replaceChildren();
  REGISTRY[id]?.(root);
}
