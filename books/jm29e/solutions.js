import { m, t, h, note, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "opp. $\\angle$s of //gram", q: ["ABCD is a parallelogram"] },
      { key: "x", color: "purple", note: "find $x$", q: ["Find x"] },
    ],
    boxes: [{
      steps: [
        lk("para", m("\\angle DAB = \\angle DCB", "opp. ∠s of //gram")),
        m("3x = x + 56"),
        m("2x = 56"),
        m(`x = ${L("x", "\\underline{28}")}`),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q2",
    minScale: 0.62,
    links: [
      { key: "rect", color: "blue", note: "property of rectangle", q: ["PQRS is a rectangle"] },
    ],
    boxes: [{
      steps: [
        lk("rect", m("OS = OR", "property of rectangle")),
        m("\\angle OSR = \\angle ORS", "base ∠s, isos. △"),
        m("= 28^{\\circ}"),
        m("x = \\angle SOR", "vert. opp. ∠s"),
        t("In $\\triangle ORS$,"),
        m("\\angle SOR + \\angle OSR + \\angle ORS = 180^{\\circ}", "∠ sum of △"),
        m("x + 28^{\\circ} + 28^{\\circ} = 180^{\\circ}"),
        m(`x = \\underline{\\underline{124^{\\circ}}}`),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q3",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "opp. $\\angle$s equal", q: ["ABCD is a parallelogram"] },
    ],
    boxes: [{
      steps: [
        t("In parallelogram $ABCD$,"),
        lk("para", m("\\angle A = \\angle C \\text{ and } \\angle B = \\angle D")),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q4",
    minScale: 0.62,
    links: [
      { key: "diag", color: "blue", note: "two diagonals given", q: ["length of two diagonals"] },
    ],
    boxes: [{
      steps: [
        lk("diag", t("The diagonals of a rhombus bisect each other at right angles, so each side can be found.")),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q5",
    minScale: 0.62,
    links: [
      { key: "ab", color: "blue", note: "$AB = 8$ cm", q: ["AB = 8 cm"] },
      { key: "bc", color: "pink", note: "$BC = 6$ cm", q: ["BC = 6 cm"] },
      { key: "per", color: "green", note: "perimeter of $\\triangle AOB = 18$ cm", q: ["perimeter of ∆AOB is 18 cm"] },
      { key: "ask", color: "purple", note: "perimeter of $\\triangle AOD$", q: ["perimeter of ∆AOD"] },
    ],
    boxes: [
      {
        steps: [
          lk("per", m("\\text{Perimeter of }\\triangle AOB = 18")),
          m(`AO + OB + ${L("ab", "8")} = 18`),
          m("OB = OD"),
          m("\\therefore AO + OD = 10"),
        ],
      },
      {
        steps: [
          m(`AD = BC = ${L("bc", "6")}`),
          lk("ask", m("\\text{Perimeter of }\\triangle AOD")),
          m("= 10 + 6 = 16"),
          t("The answer is B."),
        ],
      },
    ],
  },
  {
    id: "q6",
    minScale: 0.62,
    links: [
      { key: "sq", color: "blue", note: "square, so $90^{\\circ}$", q: ["PQRS is a square"] },
      { key: "eq", color: "pink", note: "equilateral, so $60^{\\circ}$", q: ["equilateral triangle"] },
      { key: "ask", color: "purple", note: "find $\\angle RQT$", q: ["Find ∠RQT"] },
    ],
    boxes: [{
      steps: [
        lk("eq", m("\\angle TPS = 60^{\\circ}")),
        lk("sq", m("\\angle QPT = 90^{\\circ} - 60^{\\circ} = 30^{\\circ}")),
        m("PQ = PT"),
        m("\\angle PQT = (180^{\\circ} - 30^{\\circ}) \\div 2 = 75^{\\circ}"),
        lk("ask", m("\\angle RQT = 90^{\\circ} - 75^{\\circ} = 15^{\\circ}")),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q7",
    minScale: 0.62,
    links: [
      { key: "trap", color: "blue", note: "trapezium", q: ["ABCD is a trapezium"] },
      { key: "eq", color: "pink", note: "$AB = AD$", q: ["AB = AD"] },
    ],
    boxes: [{
      steps: [
        lk("eq", m("\\because AB = AD", "given")),
        m("\\because \\angle ABD = \\angle ADB", "base ∠s, isos. △"),
        m("\\angle ABD + \\angle ADB + \\angle BAD = 180^{\\circ}", "∠ sum of △"),
        m("2\\angle ADB + 124^{\\circ} = 180^{\\circ}"),
        m("2\\angle ADB = 56^{\\circ}"),
        m("\\angle ADB = 28^{\\circ}"),
        lk("trap", m("\\angle ADC + \\angle DCB = 180^{\\circ}", "prop. of trapezium")),
        m("28^{\\circ} + 90^{\\circ} + x = 180^{\\circ}"),
        m(`x = 62^{\\circ}`),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q8",
    minScale: 0.62,
    links: [
      { key: "rh", color: "blue", note: "property of rhombus", q: ["ABCD is a rhombus"] },
    ],
    boxes: [
      {
        steps: [
          lk("rh", m("\\angle DAE = \\angle BAE", "prop. of rhombus")),
          m("= 22^{\\circ}"),
          m("\\angle AED = 90^{\\circ}", "prop. of rhombus"),
        ],
      },
      {
        steps: [
          t("In $\\triangle ADE$,"),
          m("\\angle ADE + \\angle DAE + \\angle AED = 180^{\\circ}"),
          m("\\angle ADE + 22^{\\circ} + 90^{\\circ} = 180^{\\circ}"),
          m("\\angle ADE = 68^{\\circ}"),
          t("The answer is C."),
        ],
      },
    ],
  },
  {
    id: "q9",
    minScale: 0.62,
    links: [
      { key: "qr", color: "blue", note: "$QR = 10$ cm", q: ["QR = 10 cm"] },
      { key: "rt", color: "pink", note: "$RT = 8$ cm", q: ["RT = 8 cm"] },
      { key: "sh", color: "purple", note: "shaded area", q: ["shaded region"] },
    ],
    boxes: [{
      steps: [
        m(`QT = ${L("qr", "10")}^{2} - ${L("rt", "8")}^{2} = 6`),
        m("\\text{Height of triangle} = (8 \\times 6) \\div 10 = 4.8"),
        m("\\text{Area of }PQRS = 4.8 \\times 10 = 48"),
        m("\\text{Area of }\\triangle QTR = (8 \\times 6) \\div 2 = 24"),
        lk("sh", m("\\text{Area of shaded region} = 48 - 24 = 24")),
        t("The answer is A."),
      ],
    }],
  },
  {
    id: "q10",
    minScale: 0.62,
    links: [
      { key: "rect", color: "blue", note: "rectangle", q: ["shows a rectangle"] },
      { key: "ang", color: "pink", note: "$\\angle ABE = 30^{\\circ}$", q: ["ABE = 30o"] },
      { key: "ask", color: "purple", note: "which is correct", q: ["which of the following is correct"] },
    ],
    boxes: [{
      steps: [
        m(`\\angle ADB = 180^{\\circ} - ${L("ang", "30^{\\circ}")} - 90^{\\circ} = 60^{\\circ}`),
        lk("rect", m("AE = AB")),
        m("\\angle ABE = \\angle BAE = 30^{\\circ}"),
        m("\\angle EAD = 90^{\\circ} - 30^{\\circ} = 60^{\\circ}"),
        lk("ask", m("\\angle EAD = \\angle ADB \\rightarrow AD = AE")),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q11",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "$AD \\parallel BC$", q: ["parallelogram ABCD"] },
      { key: "ask", color: "purple", note: "find $a$ and $b$", q: ["values of a and b"] },
    ],
    boxes: [{
      steps: [
        m("\\angle EAB = 75^{\\circ} - 25^{\\circ} = 50^{\\circ}", "ext. ∠ of △"),
        lk("para", m("\\angle CAD = 60^{\\circ}", "alt. ∠s, AD // BC")),
        lk("ask", m("a = 60^{\\circ} + 50^{\\circ} = 110^{\\circ}")),
        m("b = 180^{\\circ} - 25^{\\circ} - 110^{\\circ} = 45^{\\circ}", "∠ sum of △"),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q12",
    minScale: 0.62,
    links: [
      { key: "st", color: "blue", note: "straight lines", q: ["VACE and VBDF are straight lines"] },
    ],
    boxes: [{
      steps: [
        lk("st", m("\\therefore AB = \\dfrac{1}{2}CD", "mid-point theorem")),
        m("CD = 2 \\times 12\\text{ cm}"),
        m("= 24\\text{ cm}"),
        m("\\therefore CD = \\dfrac{1}{2}EF", "mid-point theorem"),
        m("EF = 2 \\times 24\\text{ cm}"),
        m("= 48\\text{ cm}"),
        t("The answer is A."),
      ],
    }],
  },
  {
    id: "q13",
    minScale: 0.62,
    links: [
      { key: "ap", color: "blue", note: "$AP = PB$", q: ["AP = PB"] },
      { key: "pq", color: "pink", note: "$PQ \\parallel BC$", q: ["PQ//BC"] },
      { key: "ask", color: "purple", note: "which may be false", q: ["may be false"] },
    ],
    boxes: [{
      steps: [
        m(`\\because ${L("ap", "AP = PB")} \\text{ and } ${L("pq", "PQ \\parallel BC")}`, "given"),
        m("\\therefore AQ = QC", "intercept theorem"),
        t("$\\therefore$ I is true."),
        m("\\because AP = PB \\text{ and } AQ = QC", "given"),
        m("\\therefore PQ = \\dfrac{1}{2}BC", "intercept theorem"),
        m("2PQ = BC"),
        t("$\\therefore$ II is true."),
        lk("ask", t("The answer is C.")),
      ],
    }],
  },
  {
    id: "q14",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "mid-points", q: ["mid-points of the sides"] },
    ],
    boxes: [{
      steps: [
        lk("mid", m("DF \\parallel BC", "mid-point th.")),
        m("\\therefore \\angle ADF = 50^{\\circ}"),
        m("DE \\parallel FC", "mid-point th."),
        m("\\therefore \\angle DEB = 30^{\\circ}"),
        m("x^{\\circ} = 50^{\\circ} + \\angle DEB", "ext. ∠ of △"),
        m("= 50^{\\circ} + 30^{\\circ}"),
        m("= 80^{\\circ}"),
        m(`x = 80`),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q15",
    minScale: 0.62,
    links: [
      { key: "eq", color: "blue", note: "$AB = BC$", q: ["AB = BC"] },
      { key: "af", color: "pink", note: "$AF = 5$ cm", q: ["AF = 5 cm"] },
      { key: "eb", color: "green", note: "$EB = 3$ cm", q: ["EB = 3 cm"] },
      { key: "dc", color: "purple", note: "find $DC$", q: ["find DC"] },
    ],
    boxes: [{
      steps: [
        m("EG = EB + BG"),
        lk("eq", m("BG = AF")),
        m(`EG = ${L("af", "5")} + ${L("eb", "3")} = 8`),
        m("DH = 8 \\times 2 = 16"),
        lk("dc", m("DC = 16 - 5 = 11")),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q16",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "two parallelograms", q: ["two parallelograms"] },
      { key: "af", color: "pink", note: "$AF = 8$ cm", q: ["AF = 8 cm"] },
      { key: "fe", color: "green", note: "$FE = 4$ cm", q: ["FE = 4 cm"] },
      { key: "ang", color: "amber", note: "$\\angle BCD = 40^{\\circ}$", q: ["BCD = 40o"] },
    ],
    boxes: [{
      steps: [
        m(`\\cos\\angle AFE = \\dfrac{${L("fe", "4")}}{${L("af", "8")}},\\ \\angle AFE = 60^{\\circ}`),
        lk("para", m("\\angle ABE = \\angle AFE = 60^{\\circ}", "property of // gram")),
        m(`\\angle BAD = \\angle BCD = ${L("ang", "40^{\\circ}")}`, "property of // gram"),
        m("a = 180^{\\circ} - 60^{\\circ} - 40^{\\circ} = 80^{\\circ}", "∠ sum of △"),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q17",
    minScale: 0.62,
    links: [
      { key: "x", color: "purple", note: "find $x$", q: ["value of x"] },
    ],
    boxes: [{
      steps: [
        m("\\angle BCD = 57^{\\circ}", "property of // gram"),
        m("\\angle DCF = 63^{\\circ}", "property of // gram"),
        lk("x", m("x = 57^{\\circ} + 63^{\\circ} = 120^{\\circ}")),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q18",
    minScale: 0.62,
    links: [
      { key: "side", color: "blue", note: "perimeter $16$ cm, so side $4$ cm", q: ["perimeter of a rhombus is 16 cm"] },
      { key: "ang", color: "pink", note: "interior angle $60^{\\circ}$", q: ["interior angles is 60o"] },
      { key: "area", color: "purple", note: "area of the rhombus", q: ["area of the rhombus"] },
    ],
    boxes: [{
      steps: [
        m(`\\angle ABD = ${L("ang", "60^{\\circ}")}`, "given"),
        m("\\therefore \\angle ABE = \\angle DBE = 30^{\\circ}", "property of rhombus"),
        m(`\\cos 30^{\\circ} = \\dfrac{BE}{${L("side", "4")}},\\ BE = 3.464\\text{ cm}`),
        m("\\sin 30^{\\circ} = \\dfrac{AE}{4},\\ AE = 2\\text{ cm}"),
        m("\\text{The area} = \\dfrac{1}{2}(2)(3.464) \\times 4", "corr. to 3 sig. fig."),
        lk("area", m("= 13.9\\text{ cm}^{2}")),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q19",
    minScale: 0.62,
    links: [
      { key: "rh", color: "blue", note: "property of rhombus", q: ["PQRS is a rhombus"] },
      { key: "sr", color: "purple", note: "$SR^{2}$", q: ["SR2"] },
    ],
    boxes: [{
      steps: [
        lk("rh", m("\\angle SER = 90^{\\circ}", "prop. of rhombus")),
        t("In $\\triangle SER$,"),
        m("SE^{2} + ER^{2} = SR^{2}", "Pyth. theorem"),
        m("\\left(\\dfrac{SQ}{2}\\right)^{2} + \\left(\\dfrac{PR}{2}\\right)^{2} = SR^{2}", "prop. of rhombus"),
        m("\\dfrac{SQ^{2}}{4} + \\dfrac{PR^{2}}{4} = SR^{2}"),
        lk("sr", m("SR^{2} = \\dfrac{PR^{2} + SQ^{2}}{4}")),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q20",
    minScale: 0.62,
    links: [
      { key: "rh", color: "blue", note: "rhombus $ABCD$", q: ["ABCD is a rhombus"] },
      { key: "e", color: "pink", note: "$E$ is $AC \\cap BD$", q: ["point of intersection of AC and BD"] },
    ],
    boxes: [{
      steps: [
        t("As shown in figure,"),
        lk("e", m("AE \\neq BE")),
        t("I incorrect"),
        lk("rh", m("\\because AE = EC,\\ BE = ED")),
        m("\\therefore \\dfrac{AE}{AC} = \\dfrac{BE}{BD} = \\dfrac{1}{2}"),
        t("II correct"),
        m("\\because \\angle AEB = 90^{\\circ} \\text{ and } CD = AB"),
        m("AE^{2} + BE^{2} = AB^{2} = CD^{2}"),
        t("III correct"),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q21",
    minScale: 0.62,
    links: [
      { key: "sq", color: "blue", note: "square $ABCD$", q: ["ABCD is a square"] },
      { key: "eq", color: "pink", note: "equilateral $\\triangle BCE$", q: ["equilateral triangle"] },
      { key: "p", color: "purple", note: "find $p$", q: ["p="] },
    ],
    boxes: [{
      steps: [
        lk("eq", m("\\angle PCB = 60^{\\circ}")),
        m("\\angle PCD = 30^{\\circ}"),
        lk("sq", m("\\angle PDC = 45^{\\circ}")),
        lk("p", m("p = 45^{\\circ} + 30^{\\circ} = 75^{\\circ}")),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q22",
    minScale: 0.62,
    links: [
      { key: "sq", color: "blue", note: "square, so $\\angle A = 90^{\\circ}$", q: ["ABCD is a square"] },
      { key: "ae", color: "pink", note: "$AE = 6$", q: ["AE = 6"] },
      { key: "ad", color: "green", note: "$AD = 8$", q: ["AD = 8"] },
      { key: "par", color: "purple", note: "distance between $BF \\parallel ED$", q: ["BF // ED"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Area of parallelogram} = ${L("ad", "8")}^{2} - 2\\left(\\dfrac{1}{2} \\times ${L("ae", "6")} \\times 8\\right) = 16`),
        lk("par", t("The height of parallelogram $= \\text{area} \\div BF$.")),
        lk("sq", m("BF = \\sqrt{6^{2} + 8^{2}} = 10")),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q23",
    minScale: 0.62,
    links: [
      { key: "par", color: "blue", note: "$AB \\parallel CD$", q: ["AB // CD"] },
      { key: "eq", color: "pink", note: "$AC = BD$", q: ["AC = BD"] },
      { key: "abd", color: "green", note: "$\\angle ABD = 124^{\\circ}$", q: ["ABD = 124o"] },
    ],
    boxes: [
      {
        steps: [
          lk("par", m(`\\angle APD = ${L("abd", "124^{\\circ}")}`, "property of //gram")),
          m("\\angle APC = 180^{\\circ} - \\angle APD", "adj. ∠s on st. line"),
          m("= 180^{\\circ} - 124^{\\circ}"),
          m("= 56^{\\circ}"),
          lk("eq", m("\\because AP = AC")),
          m("\\therefore \\angle ACP = \\angle APC", "base ∠s, isos. △"),
          m("= 56^{\\circ}"),
          t("In $\\triangle ACD$,"),
          m("\\angle CAD + \\angle ACD + \\angle ADC = 180^{\\circ}", "∠ sum of △"),
          m(`\\angle CAD + 56^{\\circ} + 26^{\\circ} = 180^{\\circ}`),
          m("\\angle CAD = 98^{\\circ}"),
          t("The answer is B."),
        ],
      },
      {
        steps: [
          t("As shown in the figure, draw $AP$ such that $AP \\parallel BD$."),
          t("Then, $AP = BD = AC$ and $ABDP$ is a parallelogram."),
        ],
      },
    ],
  },
  {
    id: "q24",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "parallelogram $ABCD$", q: ["ABCD is a parallelogram"] },
      { key: "st", color: "pink", note: "$BEF$ and $CED$ straight", q: ["BEF and CED are straight lines"] },
    ],
    boxes: [
      {
        steps: [
          lk("para", m("\\angle DCB = \\angle BAD = 2y")),
          lk("st", m("\\angle DCF = \\angle FCB - \\angle DCB")),
          m("= 90^{\\circ} - 2y"),
        ],
      },
      {
        steps: [
          t("In $\\triangle EFC$,"),
          m("\\angle ECF + x + z = 180^{\\circ}"),
          m("90^{\\circ} - 2y + x + z = 180^{\\circ}"),
          m("x = 90^{\\circ} + 2y - z"),
          t("The answer is D."),
        ],
      },
    ],
  },
  {
    id: "q25",
    minScale: 0.62,
    links: [
      { key: "s1", color: "blue", note: "(1) can be a rhombus", q: ["all angles at the intersection of the diagonals"] },
      { key: "s2", color: "pink", note: "(2) must be true", q: ["a rhombus is also a rectangle"] },
      { key: "s3", color: "green", note: "(3) can be an isos. trapezium", q: ["lengths of the diagonals of a quadrilateral are equal"] },
    ],
    boxes: [{
      steps: [
        lk("s1", t("(1) It can be a rhombus.")),
        lk("s3", t("(3) It can be isos. trapezium.")),
        lk("s2", t("The answer is B.")),
      ],
    }],
  },
  {
    id: "q26",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "parallelogram", q: ["shows a parallelogram"] },
      { key: "ask", color: "purple", note: "which must be true", q: ["must be true"] },
    ],
    boxes: [{
      steps: [
        lk("para", m("a + b = 180^{\\circ}", "int.∠s.")),
        t("I correct."),
        m("b + (360^{\\circ} - c) = 180^{\\circ}", "int.∠s."),
        m("c - b = 180^{\\circ}"),
        t("Not enough information to show II must be true."),
        m("(360^{\\circ} - c) + (360^{\\circ} - d) = 180^{\\circ}", "int.∠s."),
        m("c + d = 540^{\\circ}"),
        t("III correct."),
        lk("ask", t("The answer is B.")),
      ],
    }],
  },
  {
    id: "q27",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "mid-points of the sides", q: ["mid-points of BC, CA, AB"] },
      { key: "per", color: "purple", note: "perimeter of $AFDE$", q: ["perimeter of quadrilateral AFDE"] },
    ],
    boxes: [{
      steps: [
        lk("mid", m("BF = FA \\text{ and } BD = DC", "given")),
        m("\\therefore FD = \\dfrac{1}{2}AC", "mid-pt. theorem"),
        m("CE = EA \\text{ and } CD = DB", "given"),
        m("\\therefore DE = \\dfrac{1}{2}BA", "mid-pt. theorem"),
        lk("per", m("\\text{Perimeter of quadrilateral }AFDE = AF + FD + DE + EA")),
        m("= \\dfrac{1}{2}AB + \\dfrac{1}{2}AC + \\dfrac{1}{2}AB + \\dfrac{1}{2}AC"),
        m("= \\underline{AB + AC}"),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q28",
    minScale: 0.62,
    links: [
      { key: "pe", color: "blue", note: "$PE = 1$", q: ["PE = 1"] },
      { key: "ask", color: "purple", note: "$DP + BC$", q: ["DP + BC"] },
    ],
    boxes: [{
      steps: [
        m(`FG = 2${L("pe", "PE")} = 2,`),
        m("DE = 2FG = 4,"),
        m("\\therefore DP = DE - 1 = 3"),
        lk("ask", m("BC = 2DP = 6")),
        t("The answer is C."),
      ],
    }],
  },
  {
    id: "q29",
    minScale: 0.62,
    links: [
      { key: "st", color: "blue", note: "$ACE$ and $BDF$ straight", q: ["ACE and BDF are straight lines"] },
    ],
    boxes: [
      {
        steps: [
          m("AB = KD = GF = 12", "opp. sides of //gram"),
          m("CK = CD - KD"),
          m("= 20 - 12"),
          m("= 8"),
          lk("st", m("\\because AB \\parallel CD \\parallel EF \\text{ and } AC = CE", "given")),
          m("\\therefore AK = KG", "intercept theorem"),
          m("\\because AC = CE", "given"),
          m("AK = KG", "proved"),
          m("\\therefore CK = \\dfrac{1}{2}EG", "mid-point theorem"),
        ],
      },
      {
        steps: [
          m("EG = 2 \\times 8"),
          m("= 16"),
          m("\\therefore EF = EG + GF"),
          m("= 16 + 12"),
          m("= 28"),
          t("The answer is B."),
        ],
      },
    ],
  },
  {
    id: "q30",
    minScale: 0.62,
    links: [
      { key: "rh", color: "blue", note: "rhombus, $AD \\parallel BC$", q: ["ABCD is a rhombus"] },
      { key: "bad", color: "pink", note: "$\\angle BAD = 110^{\\circ}$", q: ["BAD= 110"] },
      { key: "ecf", color: "green", note: "$\\angle ECF = 42^{\\circ}$", q: ["ECF= 42"] },
      { key: "ask", color: "purple", note: "find $\\angle BEC$", q: ["BEC"] },
    ],
    boxes: [{
      steps: [
        lk("rh", m(`\\angle CBA = 180^{\\circ} - ${L("bad", "110^{\\circ}")} = 70^{\\circ}`, "int. ∠s, AD // BC")),
        m("\\therefore \\triangle CBE \\cong \\triangle CDF", "SAS"),
        m("\\angle BCE = \\angle DCF", "corr. ∠s, ≅ △s"),
        m(`2\\angle BCE + ${L("ecf", "42^{\\circ}")} = 110^{\\circ}`, "prop. of rhombus"),
        m("\\angle BCE = 34^{\\circ}"),
        lk("ask", m("\\angle BEC = 180^{\\circ} - 70^{\\circ} - 34^{\\circ} = 76^{\\circ}")),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q31",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "mid-points of $AD$ and $AE$", q: ["mid-points of AD and AE"] },
      { key: "par", color: "pink", note: "$CF \\parallel AD$", q: ["CF // AD"] },
    ],
    boxes: [{
      steps: [
        t("(1) $CF \\parallel BD$ and $AC = CE$"),
        lk("mid", m("EF = FD", "intercept theorem")),
        t("(2) $CF \\parallel BD$", "given"),
        lk("par", m("BC \\parallel DF", "mid-pt. theorem")),
        t("(3) In $\\triangle ABC$ and $\\triangle CFE$,"),
        m("AC = CE", "given"),
        m("\\angle BAC = \\angle FCE", "corr. ∠s, AD // CF"),
        m("\\angle BCA = \\angle FEC", "corr. ∠s, BC // DE"),
        m("\\therefore \\triangle ABC \\cong \\triangle CFE", "ASA"),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q32",
    minScale: 0.62,
    links: [
      { key: "x", color: "purple", note: "find $x$", q: ["find x"] },
    ],
    boxes: [{
      steps: [
        m("\\because \\triangle ABD \\cong \\triangle CBD", "SAS"),
        m("\\therefore \\angle CDB = \\angle ADB", "corr. ∠s, ≅ △s"),
        m("= 28^{\\circ}"),
        m("CB = BA", "given"),
        m("CE = ED", "given"),
        m("\\therefore BE \\parallel AD", "mid-pt. theorem"),
        m("\\angle CEB = \\angle CDA", "corr. ∠s, BE // AD"),
        m("x = \\angle CDB + \\angle ADB"),
        m("= 28^{\\circ} + 28^{\\circ}"),
        m(`= ${L("x", "\\underline{\\underline{56^{\\circ}}}")}`),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q33",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "parallelogram $ABCD$", q: ["ABCD is a parallelogram"] },
    ],
    boxes: [
      {
        steps: [
          m("\\because \\triangle EDF \\sim \\triangle EAG", "AAA"),
          m("\\therefore \\dfrac{ED}{EA} = \\dfrac{EF}{EG}", "corr. sides, ~△s"),
          m("\\dfrac{2.5}{2.5 + 4} = \\dfrac{2}{2 + FG}"),
          m("5 + 2.5FG = 13"),
          m("2.5FG = 8"),
          m("FG = 3.2"),
          lk("para", m("\\because \\triangle HBG \\sim \\triangle HCF", "AAA")),
        ],
      },
      {
        steps: [
          m("\\therefore \\dfrac{HB}{HC} = \\dfrac{HG}{HF}", "corr. sides, ~△s"),
          m("\\dfrac{HB}{HB + 4} = \\dfrac{1.6}{1.6 + 3.2}"),
          m("4.8HB = 1.6HB + 6.4"),
          m("3.2HB = 6.4"),
          m("HB = 2"),
          t("The answer is B."),
        ],
      },
    ],
  },
  {
    id: "q34",
    minScale: 0.62,
    links: [
      { key: "rect", color: "blue", note: "rectangle $ABCD$", q: ["ABCD is a rectangle"] },
      { key: "ac", color: "pink", note: "$AC = 5$ cm", q: ["AC = 5 cm"] },
      { key: "ab", color: "green", note: "$AB = 4$ cm", q: ["AB = 4 cm"] },
      { key: "bis", color: "amber", note: "perpendicular bisector of $AC$", q: ["perpendicular bisector of AC"] },
    ],
    boxes: [{
      steps: [
        m(`BC = \\sqrt{${L("ac", "5")}^{2} - ${L("ab", "4")}^{2}} = 3\\text{ cm},\\ ${L("bis", "OA = \\dfrac{AC}{2}")} = 2.5\\text{ cm}`),
        lk("rect", m("\\triangle OAE \\sim \\triangle BAC", "AAA")),
        m("\\dfrac{OE}{OA} = \\dfrac{BC}{BA}", "corr. sides, ~△s"),
        m("OE = 2.5 \\times \\dfrac{3}{4} = 1.875\\text{ cm}"),
        m("EF = 2OE = 3.75\\text{ cm}", "property of rhombus"),
        t("The answer is B."),
      ],
    }],
  },
  {
    id: "q35",
    minScale: 0.62,
    links: [
      { key: "para", color: "blue", note: "parallelogram, $AD \\parallel BC$", q: ["ABCD is a parallelogram"] },
      { key: "mid", color: "pink", note: "$E$ mid-point of $AD$", q: ["mid-point of AD"] },
      { key: "eq", color: "green", note: "$\\angle ABE = \\angle CBD = \\angle DBE$", q: ["ABE= CBD= DBE"] },
    ],
    boxes: [{
      steps: [
        lk("eq", t("Let $\\angle ABE = \\angle CBD = \\angle DBE = x$.")),
        lk("para", m("\\angle ADB = \\angle CBD = x", "alt. ∠s, AD // BC")),
        t("In $\\triangle DBE$,"),
        m("\\because \\angle EDB = \\angle EBD"),
        m("\\therefore BE = DE", "sides opp. eq. ∠s"),
        lk("mid", t("In $\\triangle ABE$, $BE = AE$")),
        m("\\angle EAB = \\angle EBA = x"),
        m("\\triangle ABE \\cong \\triangle DBE", "AAS"),
        m("AB = BD", "corr. sides, ≅ △s"),
        m("x + 3x = 180^{\\circ}", "int. ∠s, AD // BC"),
        m("x = 45^{\\circ}"),
        m("\\angle ABC = 3(45^{\\circ}) = 135^{\\circ}"),
        t("So, I, II and III are true."),
        t("The answer is D."),
      ],
    }],
  },
  {
    id: "q36",
    minScale: 0.62,
    links: [
      { key: "sq", color: "blue", note: "square $ABCD$", q: ["ABCD is a square"] },
      { key: "rh", color: "pink", note: "$CDEF$ is a rhombus", q: ["CDEF is a rhombus"] },
      { key: "par", color: "green", note: "$AF \\parallel BG$", q: ["AF//BG"] },
    ],
    boxes: [{
      steps: [
        t("Consider $\\triangle BFC$ and $\\triangle DFC$,"),
        lk("sq", m("CB = CD,\\ CF = CF \\text{ and } \\angle BCF = \\angle DCF = 180^{\\circ} - 45^{\\circ} = 135^{\\circ}")),
        m("\\triangle BFC \\cong \\triangle DFC", "SAS"),
        m("\\angle DFC = \\angle BFC"),
        lk("par", m("\\angle DFC = \\angle FGB", "corr. ∠s, AF // BG")),
        m("\\angle BFC = \\angle FBG", "alt. ∠s, AF // BG"),
        m("\\therefore DF = FG", "sides opp. eq. ∠s"),
        t("I correct."),
        lk("rh", m("\\because \\angle DFC = \\angle EFD = \\angle EDF", "prop. of rhombus")),
        m("\\angle FGB = \\angle FBG = \\angle EFD = \\angle EDF"),
        m("\\triangle BFG \\sim \\triangle DEF", "AA"),
        t("II correct."),
        m("\\because \\angle BCF = 135^{\\circ} \\text{ and } BC = CD = CF"),
        m("\\angle DFC = \\angle BFC = \\dfrac{180^{\\circ} - 135^{\\circ}}{2} = 22.5^{\\circ}"),
        m("\\angle ABG = 90^{\\circ} + 22.5^{\\circ} \\times 2 = 135^{\\circ}"),
        m("\\angle BFD = 22.5^{\\circ} \\times 2 = 45^{\\circ}"),
        m("\\therefore \\angle ABG + \\angle BFD = 180^{\\circ}"),
        t("III correct."),
        t("The answer is D."),
      ],
    }],
  },
];
