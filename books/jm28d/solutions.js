/**
 * Worked solutions for JM28 (D) Special Lines and Centres in Triangles, following the teacher's ANS.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    links: [
      { key: "sim", color: "blue", note: "3 sides prop.", q: ["Name two similar triangles"] },
      { key: "bis", color: "purple", note: "$\\angle DAC = \\angle CAB$", q: ["AC bisects"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        m("\\dfrac{AD}{AC} = \\dfrac{4}{6} = \\dfrac{2}{3}"),
        m("\\dfrac{DC}{CB} = \\dfrac{3}{4.5} = \\dfrac{2}{3}"),
        m("\\dfrac{AC}{AB} = \\dfrac{6}{9} = \\dfrac{2}{3}"),
        lk("sim", m("\\therefore \\triangle ADC \\sim \\triangle ACB", "3 sides prop.")),
        h("(b)"),
        m("\\angle DAC = \\angle CAB", "corr. ∠s of ∼△s"),
        lk("bis", m("\\therefore AC \\text{ bisects } \\angle DAB")),
      ],
    }],
  },

  {
    id: "q2",
    links: [
      { key: "qs", color: "pink", note: "base ∠s, isos. △", q: ["QS = QT"] },
      { key: "pqt", color: "green", note: "$\\angle PRS = \\angle PQT$", q: ["PQT = ∠PRS"] },
      { key: "bis", color: "blue", note: "$\\angle RPS = \\angle QPS$", q: ["PS is the angle bisector"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          lk("qs", m("\\because QS = QT", "given")),
          m("\\therefore \\angle QST = \\angle QTS", "base ∠s, isos. △"),
          m("\\angle RPS = \\angle PSQ - \\angle PRS", "ext. ∠ of △"),
          m("= \\angle QTS - \\angle PQT", "proved"),
          m("= \\angle QPS", "ext. ∠ of △"),
          lk("bis", t("$\\therefore$ $PS$ is the angle bisector of $\\angle RPQ$.")),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("In $\\triangle PSR$ and $\\triangle PTQ$,"),
          m("\\angle RPS = \\angle QPT", "proved"),
          lk("pqt", m("\\angle PRS = \\angle PQT", "given")),
          m("\\angle PSR = 180^\\circ - \\angle RPS - \\angle PRS", "∠ sum of △"),
          m("= 180^\\circ - \\angle QPT - \\angle PQT", "proved"),
          m("= \\angle PTQ", "∠ sum of △"),
          m("\\therefore \\triangle PSR \\sim \\triangle PTQ", "equiangular"),
        ],
      },
    ],
  },

  {
    id: "q3",
    links: [
      { key: "sim", color: "green", note: "corr. ∠s and sides, ∼△s", q: ["ACD ~ CBE"] },
      { key: "med", color: "blue", note: "median: $BE = ED$", q: ["CE is a median"] },
      { key: "ask", color: "purple", note: "$AB = BC$", q: ["BD is a median of"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          lk("sim", m("\\because \\triangle ACD \\sim \\triangle CBE", "given")),
          m("\\therefore \\angle ACD = \\angle CBE", "corr. ∠s, ∼△s"),
          m("\\text{i.e. } \\angle BCD = \\angle CBD"),
          m("\\therefore BD = CD", "sides opp. equal ∠s"),
          lk("med", t("$\\because$ $CE$ is a median of $\\triangle BCD$.")),
          m("\\therefore BE = ED"),
          m("\\therefore CD = 2BE"),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("\\because \\triangle ACD \\sim \\triangle CBE", "given"),
          m("\\therefore \\dfrac{AC}{CB} = \\dfrac{CD}{BE}", "corr. sides, ∼△s"),
          m("= \\dfrac{2BE}{BE}", "from (a)"),
          m("= 2"),
          m("\\therefore AC = 2CB"),
          m("\\text{i.e. } AB = BC"),
          lk("ask", t("$\\therefore$ $BD$ is a median of $\\triangle ACD$.")),
        ],
      },
    ],
  },

  {
    id: "q4",
    links: [
      { key: "ac", color: "pink", note: "$\\dfrac{AC}{DC} = 2$", q: ["AC = 2DC"] },
      { key: "med", color: "blue", note: "median: $BE = EC$", q: ["AE is a median"] },
      { key: "bis", color: "green", note: "$\\angle ACB = \\angle DCE$", q: ["BC is the angle bisector"] },
      { key: "ask", color: "purple", note: "find $AE : DE$", q: ["find AE ∶DE"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle ABC$ and $\\triangle DEC$,"),
          lk("bis", t("$\\because$ $BC$ is the angle bisector of $\\angle ACD$.")),
          m("\\therefore \\angle ACB = \\angle DCE"),
          lk("med", t("$\\because$ $AE$ is a median of $\\triangle ABC$.")),
          m("\\therefore BE = EC"),
          lk("ac", m("\\because \\dfrac{AC}{DC} = \\dfrac{2DC}{DC}")),
          m("= 2"),
          m("\\dfrac{BC}{EC} = \\dfrac{BE + EC}{EC}"),
          m("= \\dfrac{EC + EC}{EC}"),
          m("= 2"),
          m("\\therefore \\dfrac{AC}{DC} = \\dfrac{BC}{EC}"),
          m("\\therefore \\triangle ABC \\sim \\triangle DEC"),
        ],
      },
      {
        steps: [
          h("(b)(i)"),
          m("\\because \\triangle ABC \\sim \\triangle DEC", "proved in (a)"),
          m("\\therefore \\angle ABC = \\angle DEC", "corr. ∠s, ∼△s"),
          m("\\angle AEB = \\angle DEC", "vert. opp. ∠s"),
          m("\\therefore \\angle ABC = \\angle AEB"),
          m("\\text{i.e. } \\angle AEB = \\angle ABE"),
          m("\\therefore AB = AE", "sides opp. equal ∠s"),
          h("(ii)"),
          m("\\because \\triangle ABC \\sim \\triangle DEC", "proved in (a)"),
          m("\\therefore \\dfrac{AB}{DE} = \\dfrac{AC}{DC}", "corr. sides, ∼△s"),
          m("= 2"),
          m("\\therefore AB = 2DE"),
          m("AB = AE", "proved in (b)(i)"),
          m("\\therefore AE = 2DE"),
          lk("ask", m("\\therefore AE : DE = \\underline{2 : 1}")),
        ],
      },
    ],
  },

  {
    id: "q5",
    links: [
      { key: "abc", color: "pink", note: "$\\angle ABC = 30^\\circ$", q: ["ABC = 30o"] },
      { key: "cad", color: "amber", note: "$\\angle CAD = 50^\\circ$", q: ["CAD = 50o"] },
      { key: "bis", color: "blue", note: "$\\angle BAD = \\angle CAD$", q: ["AD is an angle bisector"] },
      { key: "data", color: "green", note: "$AD = 3$, $BD = 4$, area $= 7$", q: ["AD = 3 cm, BD = 4 cm"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          lk("bis", t("$\\because$ $AD$ is an angle bisector of $\\angle BAC$.")),
          m("\\therefore \\angle BAD = \\angle CAD"),
          m(`= ${L("cad", "50^\\circ")}`),
          m("\\angle ACB + \\angle BAC + \\angle ABC = 180^\\circ", "∠ sum of △"),
          m("\\therefore \\angle ACD = 180^\\circ - 30^\\circ - (50^\\circ + 50^\\circ)"),
          m("= 50^\\circ = \\angle CAD"),
          t("$\\therefore$ $\\triangle ACD$ is an isosceles triangle."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("\\angle ABD = \\angle ABC"),
          lk("abc", m("= 30^\\circ", "common ∠")),
          m("\\angle BAD = \\angle ACB"),
          m("= 50^\\circ"),
          m("\\therefore \\triangle BAD \\sim \\triangle BCA", "A.A.A."),
          h("(c)"),
          m("\\because \\triangle BAD \\sim \\triangle BCA", "from (b)"),
          m("\\therefore \\dfrac{BD}{AB} = \\dfrac{AB}{BC}", "corr. sides, ∼△s"),
          m("(AB)^2 = (BD) \\times (BC)"),
        ],
      },
      {
        steps: [
          h("(d)"),
          t("$\\because$ $\\triangle ACD$ is an isosceles △ (from (a))"),
          m("\\therefore AD = CD"),
          m("(AB)^2 = (BD) \\times (BC)", "from (c)"),
          m("= (BD) \\times (BD + CD)"),
          m("= (BD) \\times (BD + AD)"),
          m(`= ${L("data", "4 \\times (4 + 3)")}`),
          m("= 28"),
          m("AB = \\sqrt{28}"),
          m("= 2\\sqrt{7}\\text{ cm}"),
          m("\\text{Area of }\\triangle ABD = 7\\text{ cm}^2"),
          m("\\dfrac{(AB)(ED)}{2} = 7"),
          m("\\dfrac{(2\\sqrt{7})(ED)}{2} = 7"),
          m("ED = \\underline{\\sqrt{7}\\text{ cm}}"),
        ],
      },
    ],
  },

  {
    id: "q6",
    links: [
      { key: "foot", color: "green", note: "$\\angle ABC = 90^\\circ$", q: ["B is the foot of perpendicular of A on CE"] },
      { key: "perp", color: "blue", note: "$\\angle EDC = 90^\\circ$, $AC = 2CD$", q: ["DE is the perpendicular bisector of AC"] },
      { key: "bc", color: "pink", note: "$BC = 10$, $CD = 13$", q: ["BC = 10 and CD = 13"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle ABC$ and $\\triangle EDC$,"),
          m("\\angle ACB = \\angle ECD", "common angle"),
          lk("foot", m("\\angle ABC = \\angle EDC = 90^\\circ", "given")),
          m("\\angle BAC = 180^\\circ - \\angle ACB - \\angle ABC", "∠ sum of △"),
          m("= 180^\\circ - \\angle ECD - \\angle EDC", "proved"),
          m("= \\angle DEC", "∠ sum of △"),
          m("\\therefore \\triangle ABC \\sim \\triangle EDC", "equiangular"),
          h("(b)"),
          m("\\dfrac{AC}{EC} = \\dfrac{BC}{DC}", "corr. sides, ∼△s"),
          lk("perp", m("\\dfrac{2 \\times CD}{BC + BE} = \\dfrac{BC}{DC}", "perpendicular bisector")),
          m(`\\dfrac{2 \\times 13}{10 + BE} = \\dfrac{10}{13}`),
          m("\\dfrac{2 \\times 13 \\times 13}{10} = 10 + BE"),
          m("BE + 10 = 33.8"),
          m("BE = \\underline{23.8}"),
        ],
      },
      {
        steps: [
          h("(c)"),
          t("In $\\triangle CDE$,"),
          m("CE^2 = CD^2 + DE^2", "Pyth. theorem"),
          m(`(${L("bc", "10")} + 23.8)^2 = ${L("bc", "13^2")} + DE^2`),
          m("DE^2 = 33.8^2 - 13^2"),
          m("DE^2 = 973.44"),
          m("DE = 31.2"),
          m("\\text{Area of }\\triangle CDE = \\dfrac{1}{2} \\times 13 \\times 31.2"),
          m("= \\underline{202.8}"),
        ],
      },
    ],
  },

  {
    id: "q7",
    links: [
      { key: "bis", color: "blue", note: "$\\angle ABC = 2x$", q: ["BD is the angle bisector"] },
      { key: "ad", color: "pink", note: "base ∠s, isos. △", q: ["AD = BD"] },
      { key: "bca", color: "amber", note: "$\\angle BCA = 84^\\circ$", q: ["BCA = 84o"] },
      { key: "ask", color: "purple", note: "find $\\angle BAC$", q: ["Find ∠BAC"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $\\angle BAC = x$."),
          lk("ad", m("\\because AD = BD", "given")),
          m("\\therefore \\angle DBA = \\angle BAC", "base ∠s, isos. △"),
          m("= x"),
          lk("bis", m("\\angle ABC = 2x", "angle bisector")),
          t("In $\\triangle ABC$,"),
          m("\\angle BAC + \\angle ABC + \\angle BCA = 180^\\circ", "∠ sum of △"),
          m(`x + 2x + ${L("bca", "84^\\circ")} = 180^\\circ`),
          m("x = 32^\\circ"),
          lk("ask", m("\\therefore \\angle BAC = \\underline{32^\\circ}")),
          h("(b)"),
          t("In $\\triangle ABC$ and $\\triangle BDC$,"),
          m("\\angle ACB = \\angle BCD", "common angle"),
          m("\\angle BAC = \\angle DBA", "proved"),
          m("= \\angle DBC", "angle bisector"),
          m("\\angle ABC = \\angle ABD + \\angle DBC"),
          m("= \\angle ABD + \\angle DAB", "proved"),
          m("= \\angle BDC", "ext. ∠ of △"),
          m("\\therefore \\triangle ABC \\sim \\triangle BDC", "equiangular"),
        ],
      },
      {
        steps: [
          h("(c)"),
          m("\\dfrac{AC}{BC} = \\dfrac{BC}{DC}", "corr. sides, ∼△s"),
          m("\\dfrac{AD + CD}{BC} = \\dfrac{BC}{CD}"),
          m("(AD + CD)CD = BC^2"),
          m("AD \\cdot CD + CD^2 = BC^2"),
          m("AD = \\dfrac{BC^2 - CD^2}{CD}"),
          m("\\therefore BD = \\dfrac{BC^2 - CD^2}{CD}"),
        ],
      },
    ],
  },

  {
    id: "q8",
    links: [
      { key: "line", color: "green", note: "adj. ∠ on st. line", q: ["BCD and EAC are straight lines"] },
      { key: "sim", color: "blue", note: "corr. ∠s and sides, ∼△s", q: ["ABC~ △EDC"] },
      { key: "ask", color: "purple", note: "$AC = AE$", q: ["AD is a median of"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("sim", m("\\because \\triangle ABC \\sim \\triangle EDC", "given")),
        m("\\therefore \\angle ACB = \\angle ECD", "corr. ∠s, ∼△s"),
        lk("line", m("\\angle ACB + \\angle ECD = 180^\\circ", "adj. ∠ on st. line")),
        m("2\\angle ACB = 180^\\circ"),
        m("\\angle ACB = 90^\\circ"),
        t("$\\therefore$ $AC$ is an altitude of $\\triangle ABC$."),
        h("(b)"),
        m("\\because \\triangle ABC \\sim \\triangle EDC", "given"),
        m("\\therefore \\dfrac{AC}{EC} = \\dfrac{AB}{ED}", "corr. sides, ∼△s"),
        m("= \\dfrac{2.5}{5}"),
        m("= \\dfrac{1}{2}"),
        m("\\therefore EC = 2AC"),
        m("\\text{i.e. } AC = AE"),
        lk("ask", t("$\\therefore$ $AD$ is a median of $\\triangle CDE$.")),
      ],
    }],
  },

  {
    id: "q9",
    links: [
      { key: "sides", color: "pink", note: "ratio of 2 sides", q: ["AE = 17cm, BE = 10.2cm, CE = 4.8cm and DE = 8cm"] },
      { key: "acb", color: "amber", note: "$\\angle BCE = 90^\\circ$", q: ["ACB = 90o"] },
      { key: "ask", color: "purple", note: "$\\dfrac{1}{2} \\times AD \\times BD$", q: ["Find the area of"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle AED$ and $\\triangle BEC$,"),
          m("\\angle AED = \\angle BEC", "vert. opp. ∠s"),
          lk("sides", m("\\dfrac{AE}{BE} = \\dfrac{17}{10.2} = \\dfrac{5}{3}")),
          m("\\dfrac{ED}{EC} = \\dfrac{8}{4.8} = \\dfrac{5}{3}"),
          m("\\dfrac{AE}{BE} = \\dfrac{ED}{EC}"),
          m("\\therefore \\triangle AED \\sim \\triangle BEC", "ratio of 2 sides, inc. ∠"),
          m("\\therefore \\angle ADE = \\angle BCE", "corr. ∠s, ∼△s"),
          lk("acb", m("= 90^\\circ")),
          t("$\\therefore$ $BD$ is the altitude of $\\triangle ABD$ on $AD$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("In $\\triangle AED$,"),
          m("AE^2 = AD^2 + DE^2", "Pyth. theorem"),
          m("17^2\\text{ cm}^2 = AD^2 + 8^2\\text{ cm}^2"),
          m("AD^2 = 225\\text{ cm}^2"),
          m("AD = 15\\text{ cm}"),
          lk("ask", m("\\text{Area of }\\triangle ABD = \\dfrac{1}{2} \\times AD \\times BD")),
          m("= \\dfrac{1}{2} \\times 15 \\times (8 + 10.2)\\text{ cm}^2"),
          m("= \\underline{136.5\\text{ cm}^2}"),
        ],
      },
    ],
  },

  {
    id: "q10",
    links: [
      { key: "perp", color: "green", note: "$\\angle DEA = \\angle BCA = 90^\\circ$", q: ["AC ⊥BC, DE ⊥AB"] },
      { key: "num", color: "pink", note: "$BC = 24$, $AD = 25$, $CD = 7$", q: ["BC = 24, AD = 25 and CD = 7"] },
      { key: "ask", color: "purple", note: "$EB = AE$", q: ["DE is the perpendicular bisector of AB"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle ADE$ and $\\triangle ABC$,"),
        lk("perp", m("\\angle DEA = \\angle BCA = 90^\\circ", "given")),
        m("\\angle DAE = \\angle BAC", "common angle"),
        m("\\angle ADE = 180^\\circ - \\angle DEA - \\angle DAE", "∠ sum of △"),
        m("= 180^\\circ - \\angle BCA - \\angle BAC", "proved"),
        m("= \\angle ABC", "∠ sum of △"),
        m("\\therefore \\triangle ADE \\sim \\triangle ABC", "equiangular"),
        h("(b)"),
        t("In $\\triangle ABC$,"),
        m("AB^2 = AC^2 + BC^2", "Pyth. theorem"),
        m(`= ${L("num", "(25 + 7)^2 + 24^2")}`),
        m("= 1600"),
        m("AB = 40"),
        m("\\because \\triangle ADE \\sim \\triangle ABC", "proved"),
        m("\\dfrac{AE}{AC} = \\dfrac{AD}{AB}", "corr. sides, ∼△s"),
        m("\\dfrac{AE}{25 + 7} = \\dfrac{25}{40}"),
        m("AE = 20"),
        m("EB = AB - AE"),
        m("= 40 - 20"),
        m("= 20"),
        m("= AE"),
        lk("ask", t("$\\therefore$ $DE$ is the perpendicular bisector of $AB$.")),
      ],
    }],
  },

  {
    id: "q11",
    links: [
      { key: "ang", color: "blue", note: "$\\angle PQT = \\angle PSR$", q: ["PQT = PSR"] },
      { key: "ask", color: "purple", note: "converse of Pyth. theorem", q: ["PRS is a right-angled triangle"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle PQT$ and $\\triangle PSR$,"),
        m("\\angle QPT = \\angle SPR", "common angle"),
        lk("ang", m("\\angle PQT = \\angle PSR", "given")),
        m("\\angle PTQ = 180^\\circ - \\angle QPT - \\angle PQT", "∠ sum of △"),
        m("= 180^\\circ - \\angle SPR - \\angle PSR"),
        m("= \\angle PRS", "∠ sum of △"),
        m("\\therefore \\triangle PQT \\sim \\triangle PSR", "AAA"),
        h("(b)(i)"),
        t("In $\\triangle PRS$,"),
        m("PR^2 + RS^2 = (5 + 1.4)^2 + 4.8^2"),
        m("= 64"),
        m("PS^2 = 8^2 = 64"),
        m("\\because PR^2 + RS^2 = PS^2"),
        lk("ask", t("$\\therefore$ $\\triangle PRS$ is a right-angled triangle, where $\\angle PRS = 90^\\circ$.", "converse of Pyth. theorem")),
      ],
    }],
  },

  {
    id: "q12",
    links: [
      { key: "ang", color: "blue", note: "$\\angle ACB = \\angle DAB$", q: ["such that ACB = DAB"] },
      { key: "num", color: "pink", note: "$AB = 40$, $AC = 30$, $AD = 24$", q: ["AB = 40 cm, AC = 30 cm and AD = 24 cm"] },
      { key: "ask", color: "purple", note: "$\\angle ADB = 90^\\circ$", q: ["AD is an altitude of"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle ABC$ and $\\triangle DBA$,"),
        lk("ang", m("\\angle ACB = \\angle DAB", "given")),
        m("\\angle ABC = \\angle DBA", "common angle"),
        m("\\angle BAC = 180^\\circ - \\angle ABC - \\angle ACB", "∠ sum of △"),
        m("= 180^\\circ - \\angle DBA - \\angle DAB"),
        m("= \\angle BDA", "∠ sum of △"),
        m("\\therefore \\triangle ABC \\sim \\triangle DBA", "AAA"),
        h("(b)"),
        m("\\because \\triangle ABC \\sim \\triangle DBA", "proved in (a)"),
        m("\\therefore \\dfrac{BD}{BA} = \\dfrac{AD}{CA}", "corr. sides, ∼△s"),
        m(`\\dfrac{BD}{${L("num", "40\\text{ cm}")}} = \\dfrac{24\\text{ cm}}{30\\text{ cm}}`),
        m("BD = 32\\text{ cm}"),
        t("In $\\triangle ABD$,"),
        m("AD^2 + BD^2 = (24^2 + 32^2)\\text{ cm}^2"),
        m("= 1600\\text{ cm}^2"),
        m("AB^2 = 40^2\\text{ cm}^2"),
        m("= 1600\\text{ cm}^2"),
        m("\\because AD^2 + BD^2 = AB^2"),
        m("\\therefore \\angle ADB = 90^\\circ", "converse of Pyth. theorem"),
        lk("ask", t("$\\therefore$ $AD$ is an altitude of $\\triangle ABC$.")),
      ],
    }],
  },
];
