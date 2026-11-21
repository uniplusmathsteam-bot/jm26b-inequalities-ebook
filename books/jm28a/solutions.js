/**
 * Worked solutions for JM28 (A) Special Lines and Centres in Triangles, following the teacher's ANS.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    links: [
      { key: "alt", color: "blue", note: "altitude: $\\angle CDB = 90^\\circ$", q: ["CD is the altitude"] },
      { key: "bc", color: "pink", note: "$AB = BC = 15$ cm", q: ["AB = BC = 15 cm"] },
      { key: "bd", color: "green", note: "$BD = 9$ cm", q: ["BD = 9 cm"] },
      { key: "area", color: "purple", note: "area $= \\frac{1}{2}$ × base × height", q: ["area of ABC"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle BCD$,"),
        lk("alt", m("BC^2 = BD^2 + CD^2", "Pyth. theorem")),
        m(`${L("bc", "15^2")}\\text{ cm}^2 = ${L("bd", "9^2")}\\text{ cm}^2 + CD^2`),
        m("CD^2 = 144\\text{ cm}^2"),
        m("CD = 12\\text{ cm}"),
        lk("area", m("\\therefore \\text{Area of }\\triangle ABC = \\dfrac{AB \\times CD}{2}")),
        m("= \\dfrac{15 \\times 12}{2}\\text{ cm}^2"),
        m("= \\underline{90\\text{ cm}^2}"),
      ],
    }],
  },

  {
    id: "q2",
    links: [
      { key: "ac", color: "pink", note: "$AC = 13$", q: ["AC = 13"] },
      { key: "ab", color: "green", note: "$AB = 8$", q: ["AB = 8"] },
      { key: "med", color: "blue", note: "median: $D$ is the mid-point of $AB$", q: ["CD is a median"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ABC$,"),
        m("AC^2 = AB^2 + BC^2", "Pyth. theorem"),
        m(`BC^2 = ${L("ac", "13^2")} - ${L("ab", "8^2")}`),
        m("= 105"),
        lk("med", m("BD = \\dfrac{1}{2}AB", "median")),
        m("= \\dfrac{1}{2} \\times 8"),
        m("= 4"),
        t("In $\\triangle BCD$,"),
        m("CD^2 = BC^2 + BD^2", "Pyth. theorem"),
        m("= 105 + 4^2"),
        m("= 121"),
        m("CD = \\underline{11}"),
      ],
    }],
  },

  {
    id: "q3",
    links: [
      { key: "bis", color: "blue", note: "angle bisector: $\\angle FDE = 2x$", q: ["DG is the angle bisector"] },
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["DE = EF"] },
      { key: "dgf", color: "amber", note: "$\\angle DGF = 96^\\circ$", q: ["DGF = 96"] },
      { key: "ask", color: "purple", note: "find $\\angle DEF$", q: ["Find DEF"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\angle FDG = x$."),
        lk("bis", m("\\angle FDE = 2x", "angle bisector")),
        lk("iso", m("\\because DE = EF", "given")),
        m("\\therefore \\angle DFE = \\angle FDE", "base ∠s, isos. △"),
        m("= 2x"),
        t("In $\\triangle DFG$,"),
        m("\\angle FDG + \\angle DGF + \\angle DFG = 180^\\circ", "∠ sum of △"),
        m(`x + ${L("dgf", "96^\\circ")} + 2x = 180^\\circ`),
        m("3x = 84^\\circ"),
        m("x = 28^\\circ"),
        t("In $\\triangle DEF$,"),
        m("\\angle DEF + \\angle DFE + \\angle FDE = 180^\\circ", "∠ sum of △"),
        m("\\angle DEF + 2(28^\\circ) + 2(28^\\circ) = 180^\\circ"),
        lk("ask", m("\\angle DEF = \\underline{68^\\circ}")),
      ],
    }],
  },

  {
    id: "q4",
    links: [
      { key: "b", color: "pink", note: "$\\angle B = 74^\\circ$, $\\angle C = 44^\\circ$", q: ["B = 74, C = 44"] },
      { key: "bis", color: "blue", note: "angle bisector: $\\angle BAD = \\angle DAE$", q: ["AD is the angle bisector of"] },
      { key: "dec", color: "amber", note: "$\\angle DEC = 65^\\circ$", q: ["DEC = 65"] },
      { key: "ask", color: "purple", note: "find $\\angle ADE$", q: ["Find ADE"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ABC$,"),
        m("\\angle BAC + \\angle B + \\angle C = 180^\\circ", "∠ sum of △"),
        m(`\\angle BAC + ${L("b", "74^\\circ + 44^\\circ")} = 180^\\circ`),
        m("\\angle BAC = 62^\\circ"),
        lk("bis", m("\\therefore \\angle BAD = \\angle DAE", "angle bisector")),
        m("\\text{i.e. } \\angle DAE = \\dfrac{\\angle BAC}{2}"),
        m("= \\dfrac{62^\\circ}{2}"),
        m("= 31^\\circ"),
        t("In $\\triangle ADE$,"),
        m("\\angle DAE + \\angle ADE = \\angle DEC", "ext. ∠ of △"),
        m(`31^\\circ + \\angle ADE = ${L("dec", "65^\\circ")}`),
        lk("ask", m("\\angle ADE = \\underline{34^\\circ}")),
      ],
    }],
  },

  {
    id: "q5",
    links: [
      { key: "bac", color: "amber", note: "$\\angle BAC = 56^\\circ$", q: ["BAC = 56o"] },
      { key: "bis", color: "blue", note: "each bisector halves its angle", q: ["PB and PC are angle bisectors"] },
      { key: "ask", color: "purple", note: "find $\\angle BPC$", q: ["find ∠BPC"] },
    ],
    boxes: [{
      steps: [
        m(`\\angle ABC + \\angle ACB + ${L("bac", "56^\\circ")} = 180^\\circ`, "∠ sum of △"),
        m("\\angle ABC + \\angle ACB = 124^\\circ"),
        lk("bis", t("$\\because$ $PB$ and $PC$ are angle bisectors.")),
        m("\\therefore \\angle PBC + \\angle PCB = \\dfrac{124^\\circ}{2} = 62^\\circ"),
        m("\\therefore \\angle BPC + 62^\\circ = 180^\\circ", "∠ sum of △"),
        lk("ask", m("\\angle BPC = \\underline{118^\\circ}")),
      ],
    }],
  },

  {
    id: "q6",
    links: [
      { key: "bis", color: "blue", note: "angle bisector: $\\angle BAD = \\angle DAC$", q: ["AD is the angle bisector of BAC"] },
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["AD = CD"] },
      { key: "alt", color: "green", note: "altitude: $\\angle ABC = 90^\\circ$", q: ["AB is an altitude"] },
      { key: "ask", color: "purple", note: "find $\\angle ACB$", q: ["Find ACB"] },
    ],
    boxes: [{
      steps: [
        lk("bis", m("\\therefore \\angle BAD = \\angle DAC", "angle bisector")),
        lk("iso", m("\\because AD = CD", "given")),
        m("\\therefore \\angle DAC = \\angle DCA", "base ∠s, isos. △"),
        t("In $\\triangle ABC$,"),
        m("\\angle BAC + \\angle BCA + \\angle ABC = 180^\\circ", "∠ sum of △"),
        m(`2\\angle DCA + \\angle DCA + ${L("alt", "90^\\circ")} = 180^\\circ`),
        m("3\\angle DCA = 90^\\circ"),
        m("\\angle DCA = 30^\\circ"),
        lk("ask", m("\\therefore \\angle ACB = \\underline{30^\\circ}")),
      ],
    }],
  },

  {
    id: "q7",
    links: [
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["AB = AC"] },
      { key: "bis", color: "blue", note: "angle bisector: $\\angle BCE = \\angle ECA$", q: ["the angle bisector of ∠ACB"] },
      { key: "aec", color: "amber", note: "$\\angle AEC = 117^\\circ$", q: ["AEC = 117o"] },
      { key: "ask", color: "purple", note: "find $\\angle DAC$", q: ["Find ∠DAC"] },
    ],
    boxes: [{
      steps: [
        m(`\\angle CBE + \\angle BCE = ${L("aec", "117^\\circ")}`, "ext. ∠ of △"),
        lk("bis", m("\\angle BCE = \\angle ECA", "angle bisector")),
        lk("iso", m("\\angle CBE = \\angle ACB", "base ∠s, isos. △")),
        m("2\\angle BCE + \\angle BCE = 117^\\circ"),
        m("\\angle BCE = 39^\\circ"),
        lk("ask", m("\\angle DAC = \\angle CBE + 2\\angle BCE", "ext. ∠ of △")),
        m("= 4\\angle BCE"),
        m("= 4 \\times 39^\\circ"),
        m("= \\underline{156^\\circ}"),
      ],
    }],
  },

  {
    id: "q8",
    links: [
      { key: "med", color: "blue", note: "median: $D$ is the mid-point of $AC$", q: ["BD is a median"] },
      { key: "ab", color: "pink", note: "$AB = BD$", q: ["AB = BD"] },
      { key: "p1", color: "green", note: "perimeter of △ABC $= 6.4$ cm", q: ["6.4 cm"] },
      { key: "p2", color: "amber", note: "perimeter of △BCD $= 5.4$ cm", q: ["5.4 cm"] },
    ],
    boxes: [{
      steps: [
        lk("med", m("\\therefore AD = CD", "median")),
        lk("ab", m("\\text{Also, } AB = BD", "given")),
        m(`\\text{Perimeter of }\\triangle ABC = ${L("p1", "6.4")}\\text{ cm}`),
        m("AB + BC + AC = 6.4\\text{ cm}"),
        m("\\therefore AB + BC + 2CD = 6.4\\text{ cm} \\quad \\cdots\\cdots (1)"),
        m(`\\text{Perimeter of }\\triangle BCD = ${L("p2", "5.4")}\\text{ cm}`),
        m("BD + BC + CD = 5.4\\text{ cm}"),
        m("\\therefore AB + BC + CD = 5.4\\text{ cm} \\quad \\cdots\\cdots (2)"),
        m("(1) - (2):\\ AD = (6.4 - 5.4)\\text{ cm}"),
        m("= 1\\text{ cm}"),
        m("\\therefore CD = AD = \\underline{1\\text{ cm}}"),
      ],
    }],
  },

  {
    id: "q9",
    links: [
      { key: "bis", color: "blue", note: "angle bisectors: $\\angle ABC = 2x$, $\\angle ACB = 2y$", q: ["BD and CE are the angle bisectors"] },
      { key: "adb", color: "pink", note: "$\\angle ADB = 120^\\circ$", q: ["ADB = 120"] },
      { key: "aec", color: "green", note: "$\\angle AEC = 108^\\circ$", q: ["AEC = 108"] },
      { key: "ask", color: "purple", note: "find $\\angle BAC$", q: ["Find BAC"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\angle DBC = x$ and $\\angle ECB = y$."),
        lk("bis", m("\\angle ABC = 2x", "angle bisector")),
        m("\\angle ACB = 2y", "angle bisector"),
        m(`\\angle DBC + \\angle ACB = ${L("adb", "120^\\circ")}`, "ext. ∠ of △"),
        m("x + 2y = 120^\\circ"),
        m("x = 120^\\circ - 2y \\quad \\cdots\\cdots (1)"),
        m(`\\angle ECB + \\angle ABC = ${L("aec", "108^\\circ")}`, "ext. ∠ of △"),
        m("y + 2x = 108^\\circ \\quad \\cdots\\cdots (2)"),
        t("Substitute (1) into (2),"),
        m("y + 2(120^\\circ - 2y) = 108^\\circ"),
        m("y + 240^\\circ - 4y = 108^\\circ"),
        m("3y = 132^\\circ"),
        m("y = 44^\\circ"),
        t("Substitute $y = 44^\\circ$ into (1),"),
        m("x = 120^\\circ - 2(44^\\circ)"),
        m("= 32^\\circ"),
        t("In $\\triangle ABC$,"),
        m("\\angle BAC + \\angle ABC + \\angle ACB = 180^\\circ", "∠ sum of △"),
        m("\\angle BAC + 2(32^\\circ) + 2(44^\\circ) = 180^\\circ"),
        lk("ask", m("\\angle BAC = \\underline{28^\\circ}")),
      ],
    }],
  },

  {
    id: "q10",
    links: [
      { key: "perp", color: "blue", note: "⊥ bisector: $DB = DC$", q: ["DE is the perpendicular bisector of BC"] },
      { key: "abd", color: "pink", note: "$\\angle ABD = 50^\\circ$", q: ["ABD = 50"] },
      { key: "acd", color: "green", note: "$\\angle ACD = 21^\\circ$", q: ["ACD = 21"] },
      { key: "bac", color: "amber", note: "$\\angle BAC = 77^\\circ$", q: ["BAC = 77"] },
    ],
    boxes: [{
      steps: [
        lk("perp", t("$\\because$ $DE$ is the perpendicular bisector of $BC$.")),
        m("\\therefore DB = DC", "⊥ bisector property"),
        m("\\therefore \\angle DBC = \\angle DCB", "base ∠s, isos. △"),
        t("In $\\triangle ABC$,"),
        m("\\angle ABC + \\angle ACB + \\angle BAC = 180^\\circ", "∠ sum of △"),
        m(`(${L("abd", "50^\\circ")} + \\angle DBC) + (${L("acd", "21^\\circ")} + \\angle DCB) + ${L("bac", "77^\\circ")} = 180^\\circ`),
        m("2\\angle DBC = 32^\\circ"),
        m("\\angle DBC = \\underline{16^\\circ}"),
      ],
    }],
  },

  {
    id: "q11",
    links: [
      { key: "conv", color: "blue", note: "equal distances to $AB$ and $AD$: $CA$ bisects $\\angle BAD$", q: ["CE = CF, CE ⊥ AB and CF ⊥ AD"] },
      { key: "abd", color: "pink", note: "$\\angle ABD = 62^\\circ$, $\\angle ADB = 36^\\circ$", q: ["ABD = 62 and ∠ADB = 36"] },
      { key: "ask", color: "purple", note: "find $\\angle ACE$", q: ["Find ∠ACE"] },
    ],
    boxes: [{
      steps: [
        lk("conv", t("$\\because$ $CE = CF$, $CE \\perp AB$ and $CF \\perp AD$")),
        t("$\\therefore$ $CA$ is the angle bisector of $\\angle BAD$.", "converse of ∠ bisector property"),
        m("\\therefore \\angle BAC = \\angle DAC"),
        t("In $\\triangle ABD$,"),
        m("\\angle ABD + \\angle ADB + \\angle BAD = 180^\\circ", "∠ sum of △"),
        m(`${L("abd", "62^\\circ + 36^\\circ")} + 2\\angle BAC = 180^\\circ`),
        m("2\\angle BAC = 82^\\circ"),
        m("\\angle BAC = 41^\\circ"),
        t("In $\\triangle ACE$,"),
        m("\\angle ACE + \\angle BAC = \\angle BEC", "ext. ∠ of △"),
        m("\\angle ACE + 41^\\circ = 90^\\circ"),
        lk("ask", m("\\angle ACE = \\underline{49^\\circ}")),
      ],
    }],
  },

  {
    id: "q12",
    links: [
      { key: "perp", color: "blue", note: "⊥ bisector: $AB = AC$", q: ["AD is the perpendicular bisector of BC"] },
      { key: "bac", color: "amber", note: "$\\angle BAC = 80^\\circ$", q: ["BAC = 80"] },
      { key: "abe", color: "pink", note: "$\\angle ABE = 17^\\circ$", q: ["ABE = 17"] },
      { key: "bis", color: "green", note: "angle bisector: $\\angle ACE = \\angle BCE$", q: ["EC is the angle bisector of ∠ACB"] },
    ],
    boxes: [
      {
        steps: [
          lk("perp", t("$\\because$ $AD$ is the perpendicular bisector of $BC$.")),
          m("\\therefore AB = AC", "⊥ bisector property"),
          m("\\therefore \\angle ABC = \\angle ACB", "base ∠s, isos. △"),
          t("In $\\triangle ABC$,"),
          m("\\angle ABC + \\angle ACB + \\angle BAC = 180^\\circ", "∠ sum of △"),
          m(`2\\angle ABC + ${L("bac", "80^\\circ")} = 180^\\circ`),
          m("2\\angle ABC = 100^\\circ"),
          m("\\angle ABC = 50^\\circ"),
          m("\\angle EBC = \\angle ABC - \\angle ABE"),
          m(`= 50^\\circ - ${L("abe", "17^\\circ")}`),
          m("= 33^\\circ"),
        ],
      },
      {
        steps: [
          lk("bis", t("$\\because$ $EC$ is the angle bisector of $\\angle ACB$.")),
          m("\\therefore \\angle ACE = \\angle BCE"),
          m("\\therefore \\angle BCE = \\dfrac{1}{2} \\times \\angle ACB"),
          m("= \\dfrac{1}{2} \\times 50^\\circ"),
          m("= 25^\\circ"),
          t("In $\\triangle BCE$,"),
          m("\\angle BCE + \\angle BEC + \\angle CBE = 180^\\circ", "∠ sum of △"),
          m("25^\\circ + \\angle BEC + 33^\\circ = 180^\\circ"),
          m("\\angle BEC = \\underline{122^\\circ}"),
        ],
      },
    ],
  },

  {
    id: "q13",
    links: [
      { key: "bis", color: "blue", note: "angle bisectors: $\\angle ABC = 2x$, $\\angle ACE = 2y$", q: ["BD and CD are the angle bisectors"] },
      { key: "line", color: "green", note: "adj. ∠s on st. line", q: ["BCE is a straight line"] },
      { key: "ask", color: "purple", note: "find $\\angle BDC$", q: ["Find BDC"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\angle DBC = x$ and $\\angle DCE = y$."),
        lk("bis", m("\\angle ABC = 2x", "angle bisector")),
        m("\\angle ACE = 2y", "angle bisector"),
        lk("line", m("\\angle ACB + \\angle ACE = 180^\\circ", "adj. ∠s on st. line")),
        m("\\angle ACB = 180^\\circ - 2y"),
        t("In $\\triangle ABC$,"),
        m("64^\\circ + 2x + (180^\\circ - 2y) = 180^\\circ", "∠ sum of △"),
        m("2(x - y) = -64^\\circ"),
        m("y - x = 32^\\circ"),
        t("In $\\triangle BCD$,"),
        m("\\angle BDC + y + (180^\\circ - 2y) + x = 180^\\circ"),
        m("\\angle BDC + (x - y) + 180^\\circ = 180^\\circ"),
        m("\\angle BDC = y - x"),
        lk("ask", m("= \\underline{32^\\circ}")),
      ],
    }],
  },
];
