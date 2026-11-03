/**
 * Interactive graphics for JM29 (C) Quadrilaterals. Q14 has no printed figure,
 * so the rhombus for that question sits behind the graphic button.
 */

import { C, S, T, scene, question } from "../../engine/widgets/kit.js";

/** Rhombus ABCD, side 4 cm, ∠A = 60°, with BE ⊥ AD used in the working. */
function q14(root) {
  root.append(question(
    "A rhombus has perimeter $16$ cm and an interior angle of $60^\\circ$. The figure matches the working for the area.",
    [
      "Each side $= 4$ cm.",
      "$\\angle DAB = 60^\\circ$, so $\\angle ABD = 60^\\circ$ (diagonal $BD$).",
      "$E$ on $AD$ with $BE \\perp AD$: $\\angle ABE = \\angle DBE = 30^\\circ$.",
    ],
  ));
  const svg = scene(560, 280);
  root.append(svg);

  // Side length in px; place A left, D up-right at 60°, B down-right at 0° from A along base… 
  // A at left; AD at 60° to horizontal AB.
  const side = 150;
  const A = [80, 200];
  const B = [A[0] + side, A[1]];
  const D = [A[0] + side * Math.cos(Math.PI / 3), A[1] - side * Math.sin(Math.PI / 3)];
  const C = [B[0] + (D[0] - A[0]), B[1] + (D[1] - A[1])];
  // E = midpoint of AD (AE = 2 when AD = 4); BE ⊥ AD.
  const E = [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2];

  S("polygon", {
    points: [A, B, C, D].map((p) => p.join(",")).join(" "),
    fill: C.blueSoft, stroke: C.ink, "stroke-width": 2.2,
  }, svg);
  S("line", { x1: B[0], y1: B[1], x2: D[0], y2: D[1], stroke: C.pink, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
  S("line", { x1: B[0], y1: B[1], x2: E[0], y2: E[1], stroke: C.green, "stroke-width": 2 }, svg);

  // Right angle at E.
  const u = [(D[0] - A[0]) / side, (D[1] - A[1]) / side];
  const v = [(B[0] - E[0]) / (side * Math.sin(Math.PI / 3)), (B[1] - E[1]) / (side * Math.sin(Math.PI / 3))];
  const s = 12;
  const r1 = [E[0] + u[0] * s, E[1] + u[1] * s];
  const r2 = [r1[0] + v[0] * s, r1[1] + v[1] * s];
  const r3 = [E[0] + v[0] * s, E[1] + v[1] * s];
  S("polyline", { points: [r1, r2, r3].map((p) => p.join(",")).join(" "), fill: "none", stroke: C.green, "stroke-width": 1.4 }, svg);

  for (const [p, name, dx, dy] of [
    [A, "A", -14, 6], [B, "B", 10, 16], [C, "C", 10, -4], [D, "D", -4, -10], [E, "E", -16, -4],
  ]) {
    S("circle", { cx: p[0], cy: p[1], r: 3.2, fill: C.ink }, svg);
    T(svg, p[0] + dx, p[1] + dy, name, { "font-size": 15, "font-weight": 700, fill: C.ink });
  }

  T(svg, (A[0] + B[0]) / 2, B[1] + 22, "4 cm", { "text-anchor": "middle", "font-size": 13, fill: C.ink });
  T(svg, (A[0] + E[0]) / 2 - 18, (A[1] + E[1]) / 2 + 4, "2 cm", { "font-size": 12, fill: C.blue });
  T(svg, (B[0] + E[0]) / 2 + 14, (B[1] + E[1]) / 2 + 4, "3.464 cm", { "font-size": 12, fill: C.green });
  T(svg, A[0] + 28, A[1] - 18, "60°", { "font-size": 13, fill: C.amber, "font-weight": 700 });
  T(svg, B[0] - 48, B[1] - 28, "30°", { "font-size": 12, fill: C.pink });
  T(svg, B[0] - 8, B[1] - 48, "30°", { "font-size": 12, fill: C.pink });
  T(svg, 320, 36, "Area = ½ × 2 × 3.464 × 4 = 13.9 cm²", { "font-size": 14, "font-weight": 700, fill: C.ink });
}

const REGISTRY = { q14 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
