/**
 * Interactive graphics for JM29 (C) Quadrilaterals. Q14 has no printed figure,
 * so the rhombus for that question sits behind the graphic button.
 */

import { C, S, T, scene, question, sector } from "../../engine/widgets/kit.js";

const toward = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
const out = (p, angle, r) => [p[0] + r * Math.cos(angle), p[1] + r * Math.sin(angle)];
const MID = { "text-anchor": "middle", "dominant-baseline": "central" };

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

  // AB along the bottom, AD at 60° to it; E is the foot of the perpendicular from B, the midpoint of AD.
  const side = 200;
  const A = [30, 245];
  const B = [A[0] + side, A[1]];
  const D = [A[0] + side / 2, A[1] - side * Math.sin(Math.PI / 3)];
  const Cv = [B[0] + D[0] - A[0], D[1]];
  const E = [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2];
  const ad = toward(A, D);
  const eb = toward(E, B);
  const outside = ad - Math.PI / 2;

  const rhombus = [A, B, Cv, D].map((p) => p.join(",")).join(" ");
  S("polygon", { points: rhombus, fill: C.blueSoft }, svg);
  sector(svg, A[0], A[1], 26, 0, ad, C.amberSoft, C.amber);
  sector(svg, B[0], B[1], 30, Math.PI, toward(B, E), C.pinkSoft, C.pink);
  sector(svg, B[0], B[1], 30, toward(B, E), toward(B, D), C.pinkSoft, C.pink);
  S("polygon", { points: rhombus, fill: "none", stroke: C.ink, "stroke-width": 2.2, "stroke-linejoin": "round" }, svg);
  S("line", { x1: B[0], y1: B[1], x2: D[0], y2: D[1], stroke: C.pink, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
  S("line", { x1: B[0], y1: B[1], x2: E[0], y2: E[1], stroke: C.green, "stroke-width": 2 }, svg);
  const r1 = out(E, ad, 12);
  S("polyline", { points: [r1, out(r1, eb, 12), out(E, eb, 12)].map((p) => p.join(",")).join(" "), fill: "none", stroke: C.green, "stroke-width": 1.4 }, svg);

  for (const [p, name, at] of [
    [A, "A", [A[0] - 16, A[1]]], [B, "B", [B[0] + 10, B[1] + 14]], [Cv, "C", [Cv[0] + 15, Cv[1]]],
    [D, "D", [D[0] - 2, D[1] - 14]], [E, "E", out(E, outside, 16)],
  ]) {
    S("circle", { cx: p[0], cy: p[1], r: 3.2, fill: C.ink }, svg);
    T(svg, at[0], at[1], name, { ...MID, "font-size": 15, "font-weight": 700, fill: C.ink });
  }

  T(svg, (A[0] + B[0]) / 2, B[1] + 20, "4 cm", { ...MID, "font-size": 13, fill: C.ink });
  const ae = out([(A[0] + E[0]) / 2, (A[1] + E[1]) / 2], outside, 16);
  T(svg, ae[0], ae[1], "2 cm", { ...MID, "font-size": 12, fill: C.blue });
  const be = out(out(E, eb, 55), eb - Math.PI / 2, 11);
  T(svg, be[0], be[1], "3.464 cm", { ...MID, "font-size": 12, fill: C.green, transform: `rotate(${(eb * 180) / Math.PI} ${be[0]} ${be[1]})` });
  const a60 = out(A, ad / 2, 50);
  T(svg, a60[0], a60[1], "60°", { ...MID, "font-size": 13, "font-weight": 700, fill: C.amber });
  for (const deg of [195, 225]) {
    const p = out(B, (deg * Math.PI) / 180, 70);
    T(svg, p[0], p[1], "30°", { ...MID, "font-size": 12, fill: C.pink });
  }
  T(svg, 352, 130, "Area = ½ × 2 × 3.464 × 4", { "font-size": 14, "font-weight": 700, fill: C.ink });
  T(svg, 352, 154, "= 13.9 cm²", { "font-size": 14, "font-weight": 700, fill: C.ink });
}

const REGISTRY = { q14 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
