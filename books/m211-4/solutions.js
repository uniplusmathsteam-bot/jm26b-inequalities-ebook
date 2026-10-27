/**
 * Worked solutions for M211 Introduction to Vectors (4), following the teacher's ANS method.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 *
 * Notation: vectors a, b, c, u, v and i, j, k are bold (V), a vector between two points
 * has an arrow (AR), and a modulus uses stretching bars (abs) so they cover arrows and fractions.
 */

import { m, t, h, lk } from "../../engine/authoring.js";

/** Bold the vector letters a b c u v i j k that stand alone; \text{...} is left as it is. */
const V = (s) =>
  s
    .split(/(\\text\{[^}]*\})/)
    .map((part, i) => (i % 2 ? part : part.replace(/(?<![A-Za-z\\{])([abcijkuv])(?![A-Za-z])/g, "\\mathbf{$1}")))
    .join("");
const mv = (tex, reason) => m(V(tex), reason);
const AR = (s) => `\\overrightarrow{${s}}`;
const abs = (s) => `\\left|${s}\\right|`;
const u = (s) => `\\underline{${s}}`;
const uu = (s) => `\\underline{\\underline{${s}}}`;
const det = (...rows) => `\\begin{vmatrix} ${rows.join(" \\\\ ")} \\end{vmatrix}`;
const minor = (a, b, c, d) => `\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix}`;
const IJK = "i & j & k";
const cross = (p, q) => `${AR(p)} \\times ${AR(q)}`;

export const SOLUTIONS = [
  {
    id: "q1",
    minScale: 0.62,
    boxes: [{
      steps: [
        mv(`u \\times v = ${det(IJK, "5 & 4 & 3", "1 & -2 & -3")}`),
        mv(`= ${minor("4", "3", "-2", "-3")}i - ${minor("5", "3", "1", "-3")}j + ${minor("5", "4", "1", "-2")}k`),
        mv(`= ${uu("-6i + 18j - 14k")}`),
        mv("v \\times u = -(u \\times v)", "b × a = −(a × b)"),
        mv(`= ${uu("6i - 18j + 14k")}`),
      ],
    }],
  },
  {
    id: "q2",
    minScale: 0.62,
    boxes: [{
      steps: [
        mv(`a \\times b = ${det(IJK, "-1 & 1 & 3", "2 & -2 & -6")}`),
        mv(`= (-2)${det(IJK, "-1 & 1 & 3", "-1 & 1 & 3")}`),
        mv("= \\mathbf{0}", "two equal rows"),
        t(`$\\therefore$ $${V("a")}$ and $${V("b")}$ are parallel.`),
      ],
    }],
  },
  {
    id: "q3",
    minScale: 0.62,
    boxes: [
      {
        steps: [
          h("(a)"),
          mv("\\because\\ a + 2b - 3c = \\mathbf{0}"),
          mv("\\therefore\\ a = 3c - 2b"),
          mv("a \\times b = (3c - 2b) \\times b"),
          mv("= 3(c \\times b) - 2(b \\times b)"),
          mv("= 3(c \\times b) - \\mathbf{0}", "b × b = 0"),
          mv("= 3(c \\times b)"),
          mv(`\\therefore\\ ${u("a \\times b = 3(c \\times b)")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          mv("(c - b) \\cdot a \\times b = c \\cdot a \\times b - b \\cdot a \\times b"),
          mv("= c \\cdot 3(c \\times b) - 0", "by (a); b ⊥ a × b"),
          mv("= 0", "c ⊥ c × b"),
        ],
      },
    ],
  },
  {
    id: "q4",
    minScale: 0.62,
    boxes: [{
      steps: [
        h("(a)"),
        mv(`a \\cdot b = ${abs("a")}${abs("b")}\\cos 45^{\\circ}`),
        mv("= (4\\sqrt{2})(4)\\left(\\dfrac{\\sqrt{2}}{2}\\right)"),
        mv(`= ${uu("16")}`),
        h("(b)"),
        mv(`${abs("a \\times b")} = ${abs("a")}${abs("b")}\\sin 45^{\\circ}`),
        mv("= (4\\sqrt{2})(4)\\left(\\dfrac{\\sqrt{2}}{2}\\right)"),
        mv(`= ${uu("16")}`),
        h("(c)"),
        mv("(5a - b) \\times (2a + 5b) = 10(a \\times a) + 25(a \\times b) - 2(b \\times a) - 5(b \\times b)"),
        mv("= \\mathbf{0} + 25(a \\times b) + 2(a \\times b) - \\mathbf{0}"),
        mv("= 27(a \\times b)"),
        mv(`\\therefore\\ ${abs("(5a - b) \\times (2a + 5b)")} = ${abs("27(a \\times b)")}`),
        mv(`= 27${abs("a \\times b")}`),
        mv("= 27(16)", "by (b)"),
        mv(`= ${uu("432")}`),
      ],
    }],
  },
  {
    id: "q5",
    minScale: 0.62,
    links: [
      { key: "perp", color: "blue", note: "perpendicular ⇔ dot product $= 0$", q: ["Is a perpendicular to"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          mv(`b \\times c = ${det(IJK, "2 & 1 & -3", "-1 & 3 & 1")}`),
          mv("= (1 + 9)i - (2 - 3)j + (6 + 1)k"),
          mv(`= ${uu("10i + j + 7k")}`),
          h("(b)"),
          mv("a \\cdot (b \\times c) = (i - 2j + k) \\cdot (10i + j + 7k)"),
          mv("= (1)(10) + (-2)(1) + (1)(7)"),
          mv("= 15"),
          lk("perp", mv("\\ne 0")),
          t(`$\\therefore$ $${V("a")}$ is not perpendicular to $${V("b \\times c")}$.`),
        ],
      },
      {
        steps: [
          h("(c)"),
          mv(`a \\times (b \\times c) = ${det(IJK, "1 & -2 & 1", "10 & 1 & 7")}`),
          mv("= (-14 - 1)i - (7 - 10)j + (1 + 20)k"),
          mv("= -15i + 3j + 21k"),
          mv(`${abs("a \\times (b \\times c)")} = \\sqrt{(-15)^2 + 3^2 + 21^2}`),
          mv("= 15\\sqrt{3}"),
          t("$\\therefore$ The required unit vectors"),
          mv("= \\pm\\dfrac{1}{15\\sqrt{3}}(-15i + 3j + 21k)"),
          mv(`= ${uu("-\\dfrac{\\sqrt{3}}{3}i + \\dfrac{\\sqrt{3}}{15}j + \\dfrac{7\\sqrt{3}}{15}k")}`),
          mv(`\\text{or } ${uu("\\dfrac{\\sqrt{3}}{3}i - \\dfrac{\\sqrt{3}}{15}j - \\dfrac{7\\sqrt{3}}{15}k")}`),
        ],
      },
    ],
  },
  {
    id: "q6",
    minScale: 0.62,
    boxes: [
      {
        steps: [
          h("(a)"),
          mv("a + b + c = \\mathbf{0}"),
          mv("c = -(a + b)"),
          mv("b \\times c = b \\times [-(a + b)]"),
          mv("= -b \\times a - b \\times b"),
          mv("= -b \\times a", "b × b = 0"),
          mv("= a \\times b"),
          mv("a + b + c = \\mathbf{0}"),
          mv("a = -(b + c)"),
          mv("c \\times a = c \\times [-(b + c)]"),
          mv("= -c \\times b - c \\times c"),
          mv("= -c \\times b", "c × c = 0"),
          mv("= b \\times c"),
          mv("\\therefore\\ a \\times b = b \\times c = c \\times a"),
        ],
      },
      {
        steps: [
          h("(b)"),
          mv("a \\times b = b \\times c = c \\times a"),
          mv(`${abs("a \\times b")} = ${abs("b \\times c")} = ${abs("c \\times a")}`),
          mv(`${abs("a")}${abs("b")}\\sin(\\pi - C) = ${abs("b")}${abs("c")}\\sin(\\pi - A) = ${abs("c")}${abs("a")}\\sin(\\pi - B)`, "∠ between a and b is π − C"),
          mv(`${abs("a")}${abs("b")}\\sin C = ${abs("b")}${abs("c")}\\sin A = ${abs("c")}${abs("a")}\\sin B`),
          mv(`\\therefore\\ \\dfrac{\\sin A}{${abs("a")}} = \\dfrac{\\sin B}{${abs("b")}} = \\dfrac{\\sin C}{${abs("c")}}`, "÷ |a||b||c|"),
        ],
      },
    ],
  },
  {
    id: "q7",
    minScale: 0.62,
    links: [
      { key: "orth", color: "blue", note: "orthogonal: $\\mathbf{a} \\cdot \\mathbf{b} = 0$", q: ["are orthogonal"] },
      { key: "area", color: "purple", note: "area $= |\\mathbf{u} \\times \\mathbf{v}|$", q: ["area of the parallelogram"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          mv(`${abs("u")}^2 = (3a + b) \\cdot (3a + b)`),
          mv("= 9(a \\cdot a) + 3(a \\cdot b) + 3(b \\cdot a) + b \\cdot b"),
          mv(`= 9${abs("a")}^2 + 6(a \\cdot b) + ${abs("b")}^2`),
          lk("orth", mv("= 9(1)^2 + 6(0) + 4^2", "a · b = 0")),
          mv("= 25"),
          mv(`\\therefore\\ ${abs("u")} = ${uu("5")}`),
          mv(`${abs("v")}^2 = (-a + 2b) \\cdot (-a + 2b)`),
          mv("= a \\cdot a - 2(a \\cdot b) - 2(b \\cdot a) + 4(b \\cdot b)"),
          mv(`= ${abs("a")}^2 - 4(a \\cdot b) + 4${abs("b")}^2`),
          mv("= 1^2 - 4(0) + 4(4)^2"),
          mv("= 65"),
          mv(`\\therefore\\ ${abs("v")} = ${uu("\\sqrt{65}")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          mv("u \\times v = (3a + b) \\times (-a + 2b)"),
          mv("= -3(a \\times a) + 6(a \\times b) - b \\times a + 2(b \\times b)"),
          mv("= \\mathbf{0} + 6(a \\times b) + a \\times b + \\mathbf{0}"),
          mv("= 7(a \\times b)"),
          lk("area", t("$\\therefore$ The required area")),
          mv(`= ${abs("7(a \\times b)")}`),
          mv(`= 7${abs("a \\times b")}`),
          mv(`= 7${abs("a")}${abs("b")}\\sin 90^{\\circ}`),
          mv("= 7(1)(4)(1)"),
          mv(`= ${uu("28")}`),
        ],
      },
    ],
  },
  {
    id: "q8",
    minScale: 0.62,
    links: [
      { key: "area", color: "purple", note: "area of △ $= \\frac{1}{2}|\\overrightarrow{AB} \\times \\overrightarrow{AC}|$", q: ["find the area of the triangle"] },
    ],
    boxes: [{
      steps: [
        mv(`${AR("AB")} = (-2i + j + 4k) - (i + 2j + 3k)`),
        mv("= -3i - j + k"),
        mv(`${AR("AC")} = (2i + 2j - k) - (i + 2j + 3k)`),
        mv("= i - 4k"),
        lk("area", mv(`\\therefore\\ \\text{Area of the triangle} = \\dfrac{1}{2}${abs(cross("AB", "AC"))}`)),
        mv(`= \\dfrac{1}{2}\\left|${det(IJK, "-3 & -1 & 1", "1 & 0 & -4")}\\right|`),
        mv(`= \\dfrac{1}{2}${abs("4i - 11j + k")}`),
        mv("= \\dfrac{1}{2}\\sqrt{4^2 + (-11)^2 + 1^2}"),
        mv(`= ${uu("\\dfrac{\\sqrt{138}}{2}")}`),
      ],
    }],
  },
  {
    id: "q9",
    minScale: 0.62,
    links: [
      { key: "abcd", color: "blue", note: "area of //gram $= |\\overrightarrow{BA} \\times \\overrightarrow{BC}|$", q: ["Find the area of ABCD"] },
      { key: "quarter", color: "purple", note: "area of △$AEB$ $= \\frac{1}{4}$ of $ABCD$", q: ["such that the area of"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        mv(`${AR("BA")} = j - 2k \\text{ and } ${AR("BC")} = 2i + j + 2k`),
        mv(`${cross("BA", "BC")} = ${det(IJK, "0 & 1 & -2", "2 & 1 & 2")}`),
        mv(`= ${minor("1", "-2", "1", "2")}i - ${minor("0", "-2", "2", "2")}j + ${minor("0", "1", "2", "1")}k`),
        mv("= 4i - 4j - 2k"),
        lk("abcd", mv(`\\text{Area of } ABCD = ${abs(cross("BA", "BC"))}`)),
        mv(`= ${abs("4i - 4j - 2k")}`),
        mv("= \\sqrt{4^2 + (-4)^2 + (-2)^2}"),
        mv(`= ${uu("6")}`),
        h("(b)"),
        mv(`${AR("BE")} = i + \\lambda j - k`),
        mv(`${cross("BE", "BA")} = ${det(IJK, "1 & \\lambda & -1", "0 & 1 & -2")}`),
        mv(`= ${minor("\\lambda", "-1", "1", "-2")}i - ${minor("1", "-1", "0", "-2")}j + ${minor("1", "\\lambda", "0", "1")}k`),
        mv("= (1 - 2\\lambda)i + 2j + k"),
        lk("quarter", mv("\\because\\ \\text{Area of } \\triangle AEB = \\dfrac{1}{4} \\times \\text{area of } ABCD")),
        mv(`\\therefore\\ \\dfrac{1}{2}${abs(cross("BE", "BA"))} = \\dfrac{1}{4} \\times 6`),
        mv(`${abs("(1 - 2\\lambda)i + 2j + k")} = 3`),
        mv("\\sqrt{(1 - 2\\lambda)^2 + 2^2 + 1^2} = 3"),
        mv("4\\lambda^2 - 4\\lambda - 3 = 0"),
        mv("(2\\lambda + 1)(2\\lambda - 3) = 0"),
        mv(`\\lambda = ${uu("-\\dfrac{1}{2}")} \\text{ or } \\lambda = ${uu("\\dfrac{3}{2}")}`),
      ],
    }],
  },
  {
    id: "q10",
    minScale: 0.62,
    links: [
      { key: "area", color: "purple", note: "area of △$ABC = \\sqrt{89}$", q: ["The area of ∆ABC is"] },
      { key: "dist", color: "blue", note: "area $= \\frac{1}{2} \\times BC \\times d$", q: ["perpendicular distance from A to BC"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          mv(`${AR("BA")} = [-5 - (-1)]i + (4 - 6)j + [2 - (-2)]k`),
          mv("= -4i - 2j + 4k"),
          mv(`${AR("BC")} = [x - (-1)]i + (8 - 6)j + [1 - (-2)]k`),
          mv("= (x + 1)i + 2j + 3k"),
          mv(`${cross("BA", "BC")} = ${det(IJK, "-4 & -2 & 4", "x + 1 & 2 & 3")}`),
          mv("= (-6 - 8)i - [-12 - 4(x + 1)]j + [-8 + 2(x + 1)]k"),
          mv("= -14i + (4x + 16)j + (2x - 6)k"),
          lk("area", mv("\\because\\ \\text{Area of } \\triangle ABC = \\sqrt{89}")),
          mv(`\\therefore\\ \\dfrac{1}{2}${abs(cross("BA", "BC"))} = \\sqrt{89}`),
          mv("\\dfrac{1}{2}\\sqrt{(-14)^2 + (4x + 16)^2 + (2x - 6)^2} = \\sqrt{89}"),
          mv("(-14)^2 + (4x + 16)^2 + (2x - 6)^2 = 356"),
          mv("196 + 16x^2 + 128x + 256 + 4x^2 - 24x + 36 = 356"),
          mv("20x^2 + 104x + 132 = 0"),
          mv("5x^2 + 26x + 33 = 0"),
          mv("(x + 3)(5x + 11) = 0"),
          mv(`x = ${uu("-3")} \\text{ or } ${uu("-\\dfrac{11}{5}")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let $d$ be the required distance."),
          t("When $x = -3$,"),
          mv(`${AR("BC")} = (-3 + 1)i + 2j + 3k`),
          mv("= -2i + 2j + 3k"),
          lk("dist", mv("\\text{Area of } \\triangle ABC = \\dfrac{1}{2}d(BC)")),
          mv("\\sqrt{89} = \\dfrac{1}{2}d\\sqrt{(-2)^2 + 2^2 + 3^2}"),
          mv(`${uu("d")} = \\dfrac{2\\sqrt{1513}}{17}`),
          mv(`\\therefore\\ ${u("\\text{The required distance is } \\dfrac{2\\sqrt{1513}}{17}.")}`),
        ],
      },
      {
        steps: [
          t("When $x = -\\dfrac{11}{5}$,"),
          mv(`${AR("BC")} = \\left(-\\dfrac{11}{5} + 1\\right)i + 2j + 3k`),
          mv("= -\\dfrac{6}{5}i + 2j + 3k"),
          mv("\\text{Area of } \\triangle ABC = \\dfrac{1}{2}d(BC)"),
          mv("\\sqrt{89} = \\dfrac{1}{2}d\\sqrt{\\left(-\\dfrac{6}{5}\\right)^2 + 2^2 + 3^2}"),
          mv(`${uu("d")} = \\dfrac{10\\sqrt{89}}{19}`),
          mv(`\\therefore\\ ${u("\\text{The required distance is } \\dfrac{10\\sqrt{89}}{19}.")}`),
        ],
      },
    ],
  },
  {
    id: "q11",
    minScale: 0.62,
    links: [
      { key: "am", color: "blue", note: "$AM : MC = 1 : 2$", q: ["AM : MC = 1 : 2"] },
      { key: "cn", color: "green", note: "$CN : NB = 1 : 2$", q: ["CN : NB = 1 : 2"] },
      { key: "oa", color: "pink", note: "$OA = 2OB$", q: ["OA = 2OB"] },
      { key: "ang", color: "purple", note: "$\\angle AOB = 60^{\\circ}$", q: ["Let ∠AOB = 60°"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)(i)"),
          lk("am", mv(`${AR("AM")} = \\dfrac{1}{3}${AR("AC")} = \\dfrac{1}{3}${AR("OB")} = \\dfrac{1}{3}b`)),
          mv(`${AR("OM")} = ${AR("OA")} + ${AR("AM")}`),
          mv(`= ${u("a + \\dfrac{1}{3}b")}`),
          lk("cn", mv(`${AR("BN")} = \\dfrac{2}{3}${AR("BC")} = \\dfrac{2}{3}${AR("OA")} = \\dfrac{2}{3}a`)),
          mv(`${AR("ON")} = ${AR("OB")} + ${AR("BN")}`),
          mv(`= ${u("\\dfrac{2}{3}a + b")}`),
          h("(ii)"),
          mv(`${cross("OM", "ON")} = \\left(a + \\dfrac{1}{3}b\\right) \\times \\left(\\dfrac{2}{3}a + b\\right)`),
          mv("= \\dfrac{2}{3}(a \\times a) + a \\times b + \\dfrac{2}{9}(b \\times a) + \\dfrac{1}{3}(b \\times b)"),
          mv("= \\mathbf{0} + a \\times b - \\dfrac{2}{9}(a \\times b) + \\mathbf{0}"),
          mv("= \\dfrac{7}{9}(a \\times b)"),
          mv(`\\therefore\\ ${u(`${cross("OM", "ON")} = \\dfrac{7}{9}(a \\times b)`)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          lk("oa", mv(`${abs("a")} = 2${abs("b")} = 2(3) = 6`)),
          mv(`${abs(AR("OM"))}^2 = ${AR("OM")} \\cdot ${AR("OM")}`),
          mv("= \\left(a + \\dfrac{1}{3}b\\right) \\cdot \\left(a + \\dfrac{1}{3}b\\right)"),
          mv("= a \\cdot a + \\dfrac{1}{3}(a \\cdot b) + \\dfrac{1}{3}(b \\cdot a) + \\dfrac{1}{9}(b \\cdot b)"),
          mv(`= ${abs("a")}^2 + \\dfrac{2}{3}(a \\cdot b) + \\dfrac{1}{9}${abs("b")}^2`),
          lk("ang", mv("= 6^2 + \\dfrac{2}{3}(6)(3)\\cos 60^{\\circ} + \\dfrac{1}{9}(3)^2")),
          mv("= 43"),
        ],
      },
      {
        steps: [
          mv(`${abs(AR("ON"))}^2 = ${AR("ON")} \\cdot ${AR("ON")}`),
          mv("= \\left(\\dfrac{2}{3}a + b\\right) \\cdot \\left(\\dfrac{2}{3}a + b\\right)"),
          mv("= \\dfrac{4}{9}(a \\cdot a) + \\dfrac{2}{3}(a \\cdot b) + \\dfrac{2}{3}(b \\cdot a) + b \\cdot b"),
          mv(`= \\dfrac{4}{9}${abs("a")}^2 + \\dfrac{4}{3}(a \\cdot b) + ${abs("b")}^2`),
          mv("= \\dfrac{4}{9}(6)^2 + \\dfrac{4}{3}(6)(3)\\cos 60^{\\circ} + 3^2"),
          mv("= 37"),
          mv(`${abs(cross("OM", "ON"))} = ${abs(AR("OM"))}${abs(AR("ON"))}\\sin\\angle MON`),
          mv(`${abs("\\dfrac{7}{9}(a \\times b)")} = ${abs(AR("OM"))}${abs(AR("ON"))}\\sin\\angle MON`, "by (a)(ii)"),
          mv(`\\dfrac{7}{9}${abs("a")}${abs("b")}\\sin 60^{\\circ} = ${abs(AR("OM"))}${abs(AR("ON"))}\\sin\\angle MON`),
          mv("\\sin\\angle MON = \\dfrac{\\frac{7}{9}(6)(3)\\sin 60^{\\circ}}{\\sqrt{43}\\sqrt{37}}"),
          mv(`\\angle MON = ${uu("17.7^{\\circ}")}`, "cor. to the nearest 0.1°"),
        ],
      },
    ],
  },
  {
    id: "q12",
    minScale: 0.62,
    links: [
      { key: "orth", color: "blue", note: "⊥ to both $\\Rightarrow$ // to $\\overrightarrow{AB} \\times \\overrightarrow{CD}$", q: ["is orthogonal to both"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          mv(`${AR("AP")} = m${AR("AB")} = m(-i - j - k) = -m i - m j - m k`),
          mv(`${AR("AQ")} = ${AR("AC")} + ${AR("CQ")}`),
          mv(`= ${AR("AC")} + n${AR("CD")}`),
          mv("= (2i - 4j - 4k) + n\\{(-3 - 2)i + [5 - (-2)]j + (4 - 0)k\\}"),
          mv("= (2 - 5n)i + (7n - 4)j + (4n - 4)k"),
          mv(`\\therefore\\ ${AR("PQ")} = ${AR("AQ")} - ${AR("AP")}`),
          mv("= [(2 - 5n)i + (7n - 4)j + (4n - 4)k] - (-m i - m j - m k)"),
          mv(`= ${u("(m - 5n + 2)i + (m + 7n - 4)j + (m + 4n - 4)k")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          mv(`${cross("AB", "CD")} = ${det(IJK, "-1 & -1 & -1", "-5 & 7 & 4")}`),
          mv("= (-4 + 7)i - (-4 - 5)j + (-7 - 5)k"),
          mv("= 3i + 9j - 12k"),
          h("(c)"),
          lk("orth", mv(`\\because\\ ${AR("PQ")} \\text{ is orthogonal to both } ${AR("AB")} \\text{ and } ${AR("CD")}.`)),
          mv(`\\therefore\\ ${AR("PQ")} \\text{ is parallel to } ${cross("AB", "CD")}.`),
          mv("\\therefore\\ \\dfrac{m - 5n + 2}{3} = \\dfrac{m + 7n - 4}{9} = \\dfrac{m + 4n - 4}{-12}", "the three ratios are (1), (2), (3)"),
          mv("(1) \\div (2){:}\\quad \\dfrac{m - 5n + 2}{m + 7n - 4} = \\dfrac{1}{3}"),
          mv("3m - 15n + 6 = m + 7n - 4"),
          mv("2m - 22n + 10 = 0"),
          mv("m - 11n + 5 = 0 \\quad \\cdots\\cdots (4)"),
          mv("(1) \\div (3){:}\\quad \\dfrac{m - 5n + 2}{m + 4n - 4} = -\\dfrac{1}{4}"),
          mv("4m - 20n + 8 = -m - 4n + 4"),
          mv("5m - 16n + 4 = 0 \\quad \\cdots\\cdots (5)"),
          mv("(4) \\times 5 - (5){:}\\quad -39n + 21 = 0"),
          mv("-39n = -21"),
          mv("n = \\dfrac{7}{13}"),
          t("Substitute $n = \\dfrac{7}{13}$ into (4)."),
          mv("m - 11\\left(\\dfrac{7}{13}\\right) + 5 = 0"),
          mv("m = \\dfrac{12}{13}"),
        ],
      },
    ],
  },
  {
    id: "q13",
    minScale: 0.62,
    links: [
      { key: "proj", color: "blue", note: "projection onto the normal $\\overrightarrow{AB} \\times \\overrightarrow{AC}$", q: ["Find the projection of"] },
      { key: "vol", color: "purple", note: "volume $= \\frac{1}{3} \\times$ base $\\times$ height", q: ["volume of the tetrahedron ABCD"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        mv(`${AR("AB")} = 3i - 3j - k \\text{ and } ${AR("AC")} = 2i - j + k`),
        mv(`${cross("AB", "AC")} = ${det(IJK, "3 & -3 & -1", "2 & -1 & 1")} = ${minor("-3", "-1", "-1", "1")}i - ${minor("3", "-1", "2", "1")}j + ${minor("3", "-3", "2", "-1")}k`),
        mv("= -4i - 5j + 3k"),
        h("(b)"),
        lk("proj", t(`$${V(`${AR("AD")} = 3i - 4j + 2k`)}$, the projection of $${AR("AD")}$ onto $${cross("AB", "AC")}$ is`)),
        mv(`\\left(\\dfrac{${AR("AD")} \\cdot (${cross("AB", "AC")})}{${abs(cross("AB", "AC"))}}\\right)\\dfrac{${cross("AB", "AC")}}{${abs(cross("AB", "AC"))}}`),
        mv(`= \\dfrac{(3i - 4j + 2k) \\cdot (-4i - 5j + 3k)}{${abs("-4i - 5j + 3k")}^2}(-4i - 5j + 3k)`),
        mv("= \\dfrac{7}{25}(-4i - 5j + 3k) = -\\dfrac{28}{25}i - \\dfrac{7}{5}j + \\dfrac{21}{25}k"),
        h("(c)"),
        lk("vol", mv(`\\text{The required volume is } \\dfrac{1}{3} \\times \\dfrac{1}{2} \\times ${abs("-4i - 5j + 3k")} \\times ${abs("-\\dfrac{28}{25}i - \\dfrac{7}{5}j + \\dfrac{21}{25}k")}`)),
        mv("= \\dfrac{1}{6} \\times \\sqrt{50} \\times \\dfrac{7}{25} \\times \\sqrt{50} = \\dfrac{7}{3}"),
      ],
    }],
  },
  {
    id: "q14",
    minScale: 0.62,
    links: [
      { key: "h", color: "blue", note: "height = projection of $\\overrightarrow{AD}$ on the normal", q: ["the height of the tetrahedron ABCD is"] },
      { key: "vol", color: "purple", note: "volume $= \\frac{1}{3} \\times$ base $\\times$ height", q: ["find the volume of the tetrahedron ABCD"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        mv(`${AR("AB")} = (i + 2j + k) - (2i - 3j + 4k)`),
        mv("= -i + 5j - 3k"),
        mv(`${AR("AC")} = (3i - j - k) - (2i - 3j + 4k)`),
        mv("= i + 2j - 5k"),
        mv(`\\text{Area of } \\triangle ABC = \\dfrac{1}{2}\\left|${det(IJK, "-1 & 5 & -3", "1 & 2 & -5")}\\right|`),
        mv(`= \\dfrac{1}{2}\\left|${minor("5", "-3", "2", "-5")}i - ${minor("-1", "-3", "1", "-5")}j + ${minor("-1", "5", "1", "2")}k\\right|`),
        mv(`= \\dfrac{1}{2}${abs("-19i - 8j - 7k")}`),
        mv(`= ${uu("\\dfrac{\\sqrt{474}}{2}")}`),
        h("(b)"),
        mv(`${AR("AD")} = (\\lambda i - 5j + 4k) - (2i - 3j + 4k)`),
        mv("= (\\lambda - 2)i - 2j"),
        lk("h", mv("\\dfrac{[(\\lambda - 2)i - 2j] \\cdot (-19i - 8j - 7k)}{\\sqrt{(-19)^2 + (-8)^2 + (-7)^2}} = \\dfrac{9\\sqrt{474}}{79}")),
        mv("\\dfrac{-19(\\lambda - 2) + 16}{\\sqrt{474}} = \\dfrac{9\\sqrt{474}}{79}"),
        mv("-19\\lambda + 54 = 54"),
        mv(`\\lambda = ${uu("0")}`),
        h("(c)"),
        lk("vol", mv("\\text{Volume of tetrahedron } ABCD = \\dfrac{1}{3} \\times \\dfrac{\\sqrt{474}}{2} \\times \\dfrac{9\\sqrt{474}}{79}")),
        mv(`= ${uu("9")}`),
      ],
    }],
  },
];
