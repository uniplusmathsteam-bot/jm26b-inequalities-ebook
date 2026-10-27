/**
 * Interactive graphics for this book, opened from a question's graphic button.
 * Build them from the shared kit; house rules are in docs/03-authoring-style.md.
 * books/jm26b/widgets.js has many worked examples (sliders, number lines,
 * bar models, MC checkers).
 */

import { C, T, scene, clear, bar, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

/* ---------- Q1: example pattern (question card, picture, slider, live check) ---------- */
function q1(root) {
  const svg = scene(620, 200);
  const s = slider({ label: "Green marbles k", min: 0, max: 12, step: 1, value: 3 });
  const r = readout();
  root.append(
    question("A box has $k$ green and $(3k + 5)$ blue marbles … (the question in brief).",
      ["Inequality: $3k + 5 \\le k + 20$"]),
    svg, s.el, r.el,
    buttonRow([["Maximum k: 7", () => s.set(7)]]),
  );
  const draw = (k) => {
    clear(svg);
    const ok = 3 * k + 5 <= k + 20;
    bar(svg, 20, 60, (3 * k + 5) * 12, 24, C.blue);
    bar(svg, 20, 100, (k + 20) * 12, 24, C.green);
    T(svg, 20, 40, "Compare the two sides", { "font-weight": 700 });
    r.set(`3(${k}) + 5 = ${3 * k + 5} ${ok ? "\\le" : ">"} ${k + 20}`, ok, ok ? "Allowed. Can k be larger?" : "Too many blue marbles.");
  };
  s.on(draw);
  draw(s.get());
}

const REGISTRY = {
  q1,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
