/**
 * Interactive graphics for JM30 JM31 Intensive.
 * Questions 40–43: the mean, the median and the mode all follow the same change.
 * The lock values are the ones in the answer key.
 */

import { C, H, T, axis, clear, pin, question, readout, scene, slider } from "../../engine/widgets/kit.js";

function statsLine(root, spec) {
  const svg = scene(620, 250);
  const s = slider(spec.slider);
  const r = readout();
  root.append(question(spec.question, spec.lets), svg, s.el, r.el);
  const draw = (k) => {
    clear(svg);
    const values = spec.values(k);
    const X = axis(svg, { x: 36, y: 168, w: 548, min: spec.min, max: spec.max, step: spec.step, every: spec.every });
    T(svg, 36, 28, spec.axisTitle, { "font-weight": 700 });
    values.forEach((item, i) => {
      pin(svg, X(item.value), 168, item.color, `${item.name} ${item.text}`, { level: i });
    });
    const ok = spec.ok(k);
    r.set(spec.latex(k, values), ok, spec.caption(k, ok), { yes: "matches the key", no: "keep going" });
  };
  s.on(draw);
  draw(s.get());
}

const Q40 = (root) => statsLine(root, {
  question: "The mean, the median and the mode are 29, 37 and 35. Subtract the same number from every datum.",
  lets: ["New mean = $29 - k$", "New median = $37 - k$", "New mode = $35 - k$"],
  slider: { label: "Subtract k from each datum", min: 0, max: 7, step: 1, value: 0, fmt: (v) => String(v), play: true },
  min: 18, max: 42, step: 2, every: 2,
  axisTitle: "Mean, median and mode after subtracting k",
  values: (k) => [
    { name: "mean", value: 29 - k, text: String(29 - k), color: C.blue },
    { name: "mode", value: 35 - k, text: String(35 - k), color: C.pink },
    { name: "median", value: 37 - k, text: String(37 - k), color: C.ink },
  ],
  ok: (k) => k === 7,
  latex: (k) => `29 - ${k} = ${29 - k},\\quad 37 - ${k} = ${37 - k},\\quad 35 - ${k} = ${35 - k}`,
  caption: (k, ok) => (ok
    ? "Subtracting 7 gives mean 22, median 30 and mode 28. The answer is B."
    : "All three fall by the same amount. The question subtracts 7."),
});

const Q41 = (root) => statsLine(root, {
  question: "The mean, the median and the mode are 36, 32 and 40. Divide every datum by the same number.",
  lets: ["New mean = $36 \\div d$", "New median = $32 \\div d$", "New mode = $40 \\div d$"],
  slider: { label: "Divide each datum by d", min: 1, max: 2, step: 1, value: 1, fmt: (v) => String(v), play: false },
  min: 10, max: 46, step: 4, every: 1,
  axisTitle: "Mean, median and mode after dividing by d",
  values: (d) => [
    { name: "median", value: 32 / d, text: String(32 / d), color: C.ink },
    { name: "mean", value: 36 / d, text: String(36 / d), color: C.blue },
    { name: "mode", value: 40 / d, text: String(40 / d), color: C.pink },
  ],
  ok: (d) => d === 2,
  latex: (d) => `\\dfrac{36}{${d}} = ${36 / d},\\quad \\dfrac{32}{${d}} = ${32 / d},\\quad \\dfrac{40}{${d}} = ${40 / d}`,
  caption: (d, ok) => (ok
    ? "Dividing by 2 gives mean 18, median 16 and mode 20. The answer is A."
    : "All three are divided by the same number. The question divides by 2."),
});

function rowOf(title, items, tone) {
  return H("div", {}, [
    H("p", { class: "g-intro" }, [title]),
    H("div", { class: "g-tiles" }, items.map((item) => H("div", { class: `g-tile ${tone}` }, [
      H("b", {}, [String(item.value)]),
      H("span", {}, [item.label]),
    ]))),
  ]);
}

const Q42 = (root) => {
  const s = slider({ label: "Mean m of a, b, c, d, e", min: 1, max: 9, step: 1, value: 4, fmt: (v) => String(v) });
  const r = readout();
  const original = H("div");
  const shifted = H("div");
  root.append(
    question("The mean of a, b, c, d and e is m. Find the mean of 10a − 3, 10b − 3, 10c − 3, 10d − 3 and 10e − 3.",
      ["A data set with mean m is $m-2,\\ m-1,\\ m,\\ m+1,\\ m+2$."]),
    s.el, original, shifted, r.el,
  );
  const draw = (m) => {
    const data = [m - 2, m - 1, m, m + 1, m + 2];
    const next = data.map((v) => 10 * v - 3);
    const names = ["a", "b", "c", "d", "e"];
    const mean = next.reduce((sum, v) => sum + v, 0) / next.length;
    original.replaceChildren(rowOf("Original data, mean m", data.map((v, i) => ({ value: v, label: names[i] })), ""));
    shifted.replaceChildren(rowOf("Each value becomes 10 × value − 3", next.map((v, i) => ({ value: v, label: `10${names[i]}−3` })), "ok"));
    r.set(`10m - 3 = 10(${m}) - 3 = ${10 * m - 3}`, mean === 10 * m - 3, "The new mean is 10m − 3 for every m. The answer is C.", { yes: "matches the key", no: "fails" });
  };
  s.on(draw);
  draw(s.get());
};

const Q43 = (root) => {
  const s = slider({ label: "Mean x of p, q, r, s, t", min: 1, max: 8, step: 1, value: 4, fmt: (v) => String(v) });
  const r = readout();
  const original = H("div");
  const shifted = H("div");
  root.append(
    question("The mean of p, q, r, s and t is x. Find the mean of x(x − p), x(x − q), x(x − r), x(x − s) and x(x − t).",
      ["A data set with mean x is $x-2,\\ x-1,\\ x,\\ x+1,\\ x+2$."]),
    s.el, original, shifted, r.el,
  );
  const draw = (x) => {
    const data = [x - 2, x - 1, x, x + 1, x + 2];
    const next = data.map((p) => x * (x - p));
    const names = ["p", "q", "r", "s", "t"];
    const mean = next.reduce((sum, v) => sum + v, 0) / next.length;
    original.replaceChildren(rowOf("Original data, mean x", data.map((v, i) => ({ value: v, label: names[i] })), ""));
    shifted.replaceChildren(rowOf("Each value becomes x(x − value)", next.map((v, i) => ({ value: v, label: names[i] })), "ok"));
    r.set(`\\text{new mean} = ${mean}`, mean === 0, "The five new values cancel, so the mean is 0. The answer is B.", { yes: "matches the key", no: "fails" });
  };
  s.on(draw);
  draw(s.get());
};

const REGISTRY = { q40: Q40, q41: Q41, q42: Q42, q43: Q43 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
