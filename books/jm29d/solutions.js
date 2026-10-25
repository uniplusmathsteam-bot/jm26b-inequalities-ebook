import { m, t, h, note, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    minScale: 0.62,
    links: [
      { key: "unk", color: "purple", note: "the marked unknowns", q: ["Find the marked unknowns"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m("AM = MB", "given"),
          m("AN = NC", "given"),
          m("MN \\parallel BC", "mid-point theorem"),
          m(`\\therefore x = ${L("unk", "\\angle ACB")}`, "corr. ∠s, MN // BC"),
          m("= 68^\\circ"),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("AB = BD", "given"),
          m("AC = CE", "given"),
          m("BC \\parallel DE", "mid-point theorem"),
          m(`\\therefore x = ${L("unk", "\\angle ADE")}`, "corr. ∠s, BC // DE"),
          m("= 180^\\circ - 65^\\circ - 80^\\circ", "∠ sum of △"),
          m("= 35^\\circ"),
        ],
      },
    ],
  },

  {
    id: "q2",
    minScale: 0.62,
    links: [
      { key: "st", color: "blue", note: "$ADEB$, $AFGC$ straight", q: ["ADEB and AFGC are straight lines"] },
    ],
    boxes: [
      {
        steps: [
          m("\\because AD = DE \\text{ and } AF = FG"),
          m("\\therefore DF = \\dfrac{1}{2} \\times EG", "mid-pt. theorem"),
          m("3.5 = \\dfrac{1}{2} \\times x"),
          m(`x = 7`),
          m(`\\because ${L("st", "AE = AD + DE")}`),
          m("= (3 + 3)\\text{ cm}"),
          m("= 6\\text{ cm}"),
          m("\\text{and } AG = AF + FG"),
          m("= (2.5 + 2.5)\\text{ cm}"),
          m("= 5\\text{ cm}"),
        ],
      },
      {
        steps: [
          m("\\text{i.e. } AE = EB \\text{ and } AG = GC"),
          m("\\therefore EG = \\dfrac{1}{2} \\times BC", "mid-pt. theorem"),
          m("x = \\dfrac{1}{2} \\times y"),
          m("7 = \\dfrac{1}{2} \\times y"),
          m(`y = \\underline{14}`),
        ],
      },
    ],
  },

  {
    id: "q3",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "$E$, $F$, $G$ mid-points", q: ["mid-points of AB, CD and AC"] },
      { key: "ad", color: "pink", note: "$AD = 24$ cm", q: ["AD= 24 cm"] },
      { key: "ef", color: "green", note: "$EF = 30$ cm", q: ["EF= 30 cm"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ACD$,"),
        m(`\\because ${L("mid", "CF = FD")} \\text{ and } AG = GC`, "given"),
        m("\\therefore GF = \\dfrac{1}{2} \\times AD", "mid-pt. theorem"),
        m(`= \\dfrac{1}{2} \\times ${L("ad", "24")}\\text{ cm}`),
        m("= 12\\text{ cm}"),
        m("EG = EF - GF"),
        m(`= (${L("ef", "30")} - 12)\\text{ cm}`),
        m("= 18\\text{ cm}"),
        t("In $\\triangle ABC$,"),
        m("\\because AE = EB \\text{ and } AG = GC", "given"),
        m("\\therefore EG = \\dfrac{1}{2} \\times BC", "mid-pt. theorem"),
        m("18\\text{ cm} = \\dfrac{1}{2} \\times BC"),
        m(`BC = \\underline{36}\\text{ cm}`),
      ],
    }],
  },

  {
    id: "q4",
    minScale: 0.62,
    links: [
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ADE$,"),
        m("\\because AB = BD \\text{ and } AC = CE", "given"),
        m("\\therefore BC = \\dfrac{1}{2} \\times DE", "mid-pt. theorem"),
        m("k + 1 = \\dfrac{1}{2} \\times 4k"),
        m("k + 1 = 2k"),
        m(`k = \\underline{1}`),
        t("In $\\triangle EAG$,"),
        m("\\because EC = CA \\text{ and } EF = FG", "given"),
        m("\\therefore CF \\parallel AG", "mid-pt. theorem"),
        m("\\therefore \\angle EFC = \\angle EGA", "corr. ∠s, CF // AG"),
        m("= 40^\\circ"),
        t("In $\\triangle ECF$,"),
        m("\\angle CEF + \\angle ECF + \\angle EFC = 180^\\circ", "∠ sum of △"),
        m("h + 100^\\circ + 40^\\circ = 180^\\circ"),
        m(`h = \\underline{40^\\circ}`),
      ],
    }],
  },

  {
    id: "q5",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "$E$, $G$ mid-points", q: ["mid-points of GD and AF"] },
      { key: "ratio", color: "purple", note: "find $FE:EC$", q: ["Find FE: EC"] },
    ],
    boxes: [
      {
        steps: [
          t("In $\\triangle AFC$,"),
          m(`\\because ${L("mid", "AG = GF")} \\text{ and } AB = BC`, "given"),
          m("\\therefore GB = \\dfrac{1}{2} FC", "mid-pt. theorem"),
          t("In $\\triangle BDG$,"),
          m("\\because DC = CB \\text{ and } DE = DE", "given"),
          m("\\therefore EC = \\dfrac{1}{2} GB", "mid-pt. theorem"),
          m("= \\dfrac{1}{2}\\left(\\dfrac{1}{2} FC\\right)"),
          m("= \\dfrac{1}{4} FC"),
        ],
      },
      {
        steps: [
          m("FE:EC = (FC - EC):EC"),
          m("= \\left(FC - \\dfrac{1}{4} FC\\right):\\dfrac{1}{4} FC"),
          m("= \\dfrac{3}{4} FC:\\dfrac{1}{4} FC"),
          m(`= ${L("ratio", "\\underline{3:1}")}`),
        ],
      },
    ],
  },

  {
    id: "q6",
    minScale: 0.62,
    links: [
      { key: "xy", color: "purple", note: "find $x$ and $y$", q: ["Find x and y"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ABE$,"),
        m("\\because AB \\parallel CG"),
        m("\\text{and } AC = CE"),
        m("\\therefore EG = GB", "intercept theorem"),
        m(`x = ${L("xy", "\\underline{6}")}`),
        t("In $\\triangle BEF$,"),
        m("\\because GD \\parallel EF"),
        m("\\text{and } BG = GE", "proved"),
        m("\\therefore BD = DF", "intercept theorem"),
        m(`y = ${L("xy", "\\underline{4}")}`),
      ],
    }],
  },

  {
    id: "q7",
    minScale: 0.62,
    links: [
      { key: "unk", color: "purple", note: "the unknowns", q: ["Find the unknowns"] },
    ],
    boxes: [
      {
        steps: [
          m("AB \\parallel CD \\parallel EF \\parallel GH", "given"),
          m(`\\therefore a = b = ${L("unk", "4")}`, "intercept theorem"),
        ],
      },
      {
        steps: [
          m("AB = BC = \\dfrac{6}{2} = 3", "intercept theorem"),
          m("BC = CD = 3", "intercept theorem"),
          m(`m = ${L("unk", "9")}`),
        ],
      },
    ],
  },

  {
    id: "q8",
    minScale: 0.62,
    links: [
      { key: "unk", color: "purple", note: "the marked unknowns", q: ["Find the marked unknowns"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m("MN \\parallel BC", "given"),
          m("AM = MB", "given"),
          m("\\therefore AN = NC", "intercept theorem"),
          m(`x = ${L("unk", "2(4) = 8")}`),
          m("MN = \\dfrac{1}{2} BC", "mid-point theorem"),
          m("y = \\dfrac{1}{2}(8)"),
          m(`= ${L("unk", "4")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("DE \\parallel BC", "given"),
          m("AD = DB", "given"),
          m("\\therefore AE = EC", "intercept theorem"),
          m(`b = \\dfrac{1}{2}(14) = ${L("unk", "7")}`),
          m("DE = \\dfrac{1}{2} BC", "mid-point theorem"),
          m("a = 2(8)"),
          m(`= ${L("unk", "16")}`),
        ],
      },
    ],
  },

  {
    id: "q9",
    minScale: 0.62,
    links: [
      { key: "xyz", color: "purple", note: "find $x$, $y$ and $z$", q: ["Find x, y and z"] },
    ],
    boxes: [
      {
        steps: [
          t("In $\\triangle EGB$,"),
          m("\\because GF = FE \\text{ and } BG \\parallel DF", "given"),
          m("\\therefore BD = DE", "intercept theorem"),
          m("\\because BD = DE \\text{ and } GF = FE"),
          m("\\therefore DF = \\dfrac{1}{2} \\times BG", "mid-pt. theorem"),
          m("x = \\dfrac{1}{2} \\times 4"),
          m(`= ${L("xyz", "\\underline{2}")}`),
        ],
      },
      {
        steps: [
          t("In $\\triangle ACF$,"),
          m("\\because GF = AG \\text{ and } CF \\parallel BG"),
          m("\\therefore BC = AB", "intercept theorem"),
          m(`y = ${L("xyz", "\\underline{3}")}`),
          m("\\because AB = BC \\text{ and } AG = GF"),
          m("\\therefore BG = \\dfrac{1}{2} \\times CF", "mid-pt. theorem"),
          m("4 = \\dfrac{1}{2} \\times (z + x)"),
          m("8 = z + 2"),
          m(`z = ${L("xyz", "\\underline{6}")}`),
        ],
      },
    ],
  },

  {
    id: "q10",
    minScale: 0.62,
    links: [
      { key: "ae", color: "blue", note: "$AE = EB$", q: ["AE= EB"] },
      { key: "par", color: "pink", note: "$AD \\parallel EF \\parallel BC$", q: ["AD//EF//BC"] },
      { key: "bc", color: "green", note: "$BC = 32$ cm", q: ["BC= 32 cm"] },
      { key: "df", color: "amber", note: "$DF = 6$ cm", q: ["DF= 6 cm"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\because ${L("par", "AD \\parallel EF \\parallel BC")} \\text{ and } ${L("ae", "AE = EB")}`, "given"),
          m("\\therefore CF = DF", "intercept theorem"),
          m(`= ${L("df", "6")}\\text{ cm}`),
          m("CD = CF + DF"),
          m("= (6 + 6)\\text{ cm}"),
          m("= \\underline{12}\\text{ cm}"),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("In $\\triangle ABC$,"),
          m("\\because EG \\parallel BC \\text{ and } AE = EB", "given"),
          m("\\therefore AG = GC", "intercept theorem"),
          m("\\because AE = EB \\text{ and } AG = GC"),
          m("\\therefore EG = \\dfrac{1}{2} \\times BC", "mid-pt. theorem"),
          m(`= \\dfrac{1}{2} \\times ${L("bc", "32")}\\text{ cm}`),
          m("= 16\\text{ cm}"),
          m("GF = EF - EG"),
          m("= (28 - 16)\\text{ cm}"),
          m("= 12\\text{ cm}"),
          t("In $\\triangle ACD$,"),
          m("\\because AG = GC \\text{ and } CF = DF"),
          m("\\therefore GF = \\dfrac{1}{2} \\times AD", "mid-pt. theorem"),
          m("12\\text{ cm} = \\dfrac{1}{2} \\times AD"),
          m("AD = \\underline{24}\\text{ cm}"),
        ],
      },
    ],
  },

  {
    id: "q11",
    minScale: 0.62,
    links: [
      { key: "ac", color: "pink", note: "$AC = CE$", q: ["AC = CE"] },
      { key: "ab", color: "green", note: "$AB = 6$ cm", q: ["AB = 6 cm"] },
      { key: "ef", color: "amber", note: "$EF = 10$ cm", q: ["EF = 10 cm"] },
    ],
    boxes: [
      {
        steps: [
          t("Consider $\\triangle ABE$,"),
          m(`\\because CP \\parallel AB \\text{ and } ${L("ac", "EC = CA")}`),
          m("\\therefore EP = PB", "intercept theorem"),
          m("\\because EC = CA", "given"),
          m("EP = PB", "proved"),
          m(`\\therefore CP = \\dfrac{1}{2} \\times ${L("ab", "6")}`, "mid-point theorem"),
          m("= 3\\text{ cm}"),
          m(`\\text{Similarly, } PD = \\dfrac{1}{2} \\times ${L("ef", "10")} = 5\\text{ cm}`),
          m("\\therefore CD = 3 + 5 = \\underline{8}\\text{ cm}"),
        ],
      },
      {
        steps: [
          t("Join $BE$ and let $P$ be the intersection point of $BE$ and $CD$."),
        ],
      },
    ],
  },

  {
    id: "q12",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "$E$ mid-point of $AD$", q: ["E is the mid point of AD"] },
      { key: "ab", color: "pink", note: "$AB = 9$ cm", q: ["AB = 9 cm"] },
      { key: "cd", color: "green", note: "$CD = 3$ cm", q: ["CD = 3 cm"] },
      { key: "ang", color: "amber", note: "$\\angle ABC = 32^\\circ$, $\\angle ACB = 60^\\circ$", q: ["ABC = 32o", "ACB = 60o"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\angle DCB + ${L("ang", "\\angle ABC")} = 180^\\circ`, "int. ∠s, DC // AB"),
          m(`\\angle ACD + ${L("ang", "60^\\circ")} + 32^\\circ = 180^\\circ`),
          m("\\angle ACD = 180^\\circ - 60^\\circ - 32^\\circ"),
          m("= 88^\\circ"),
          m("y = 88^\\circ"),
          m(`${L("mid", "AE = ED")}`, "given"),
          m("DC \\parallel EG", "given"),
          m("AF = FC", "intercept theorem"),
          m(`EF = ${L("cd", "CD")} \\times \\dfrac{1}{2}`, "mid-point theorem"),
        ],
      },
      {
        steps: [
          m("EF = \\dfrac{3}{2}\\text{ cm}"),
          m("AF = FC", "proved"),
          m("AB \\parallel EG", "given"),
          m("CG = GB", "intercept theorem"),
          m("FG = \\dfrac{1}{2} AB", "mid-point theorem"),
          m(`= \\dfrac{1}{2} \\times ${L("ab", "9")}`),
          m("= \\dfrac{9}{2}\\text{ cm}"),
          m("x = EG"),
          m("= EF + FG"),
          m("= \\left(\\dfrac{3}{2} + \\dfrac{9}{2}\\right)"),
          m("= 6\\text{ cm}"),
        ],
      },
    ],
  },

  {
    id: "q13",
    minScale: 0.62,
    links: [
      { key: "eq", color: "blue", note: "$AB = BC = CD$", q: ["AB = BC = CD"] },
      { key: "ae", color: "pink", note: "$AE = EF$", q: ["AE = EF"] },
      { key: "df", color: "green", note: "prove $DF = FG$", q: ["DF = FG"] },
      { key: "be", color: "purple", note: "find $BE:EG$", q: ["Find BE"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle ACF$,"),
          m(`${L("eq", "AB = BC")}`, "given"),
          m(`${L("ae", "AE = EF")}`, "given"),
          m("\\therefore BE \\parallel CF", "mid-pt. theorem"),
          t("In $\\triangle DBG$,"),
          m("DC = CB", "given"),
          m("CF \\parallel BG", "proved"),
          m(`\\therefore ${L("df", "\\underline{DF = FG}")}`, "intercept theorem"),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("BE = \\dfrac{1}{2} CF", "mid-pt. theorem"),
          m("CF = \\dfrac{1}{2} BG", "mid-pt. theorem"),
          m("\\therefore BE = \\dfrac{1}{2} \\times \\dfrac{1}{2} BG"),
          m("BE = \\dfrac{1}{4} BG"),
          m("4BE = BG"),
          m("4BE = BE + EG"),
          m("3BE = EG"),
          m(`${L("be", "BE:EG")} = \\underline{1:3}`),
        ],
      },
    ],
  },

  {
    id: "q14",
    minScale: 0.62,
    links: [
      { key: "ed", color: "blue", note: "$ED = EF$", q: ["ED= EF"] },
      { key: "st", color: "pink", note: "$ACE$, $ADG$, $BDE$ straight", q: ["ACE, ADG and BDE are straight lines"] },
      { key: "xy", color: "purple", note: "find $x$ and $y$", q: ["Find the values of x and y"] },
    ],
    boxes: [
      {
        steps: [
          t("In $\\triangle AEB$,"),
          m(`\\because ${L("st", "EC = CA")} \\text{ and } AB \\parallel CD`, "given"),
          m("\\therefore ED = DB", "intercept theorem"),
          m("\\text{i.e. } ED = y\\text{ cm}"),
          m("\\because EC = CA \\text{ and } ED = DB"),
          m("\\therefore CD = \\dfrac{1}{2} \\times AB", "mid-pt. theorem"),
          m("x = \\dfrac{1}{2} \\times 3"),
          m(`= ${L("xy", "\\underline{1.5}")}`),
        ],
      },
      {
        steps: [
          t("In $\\triangle AEG$,"),
          m("\\because AC = CE \\text{ and } CD \\parallel EG", "given"),
          m("\\therefore AD = DG", "intercept theorem"),
          m("\\because AC = CE \\text{ and } AD = DG"),
          m("\\therefore CD = \\dfrac{1}{2} \\times EG", "mid-pt. theorem"),
          m("EG = 2 \\times CD"),
          m("= 2 \\times 1.5\\text{ cm}"),
          m("= 3\\text{ cm}"),
          m(`\\because ${L("ed", "EF = ED")}`),
          m("= y\\text{ cm}"),
          m("\\because EF + FG = EG"),
          m("y + 0.5 = 3"),
          m(`y = ${L("xy", "\\underline{2.5}")}`),
        ],
      },
    ],
  },

  {
    id: "q15",
    minScale: 0.62,
    links: [
      { key: "st", color: "blue", note: "$BCD$, $AHD$, $AJE$, $EFG$ straight", q: ["BCD, AHD, AJE and EFG are straight lines"] },
    ],
    boxes: [
      {
        steps: [
          t("In $\\triangle ABD$,"),
          m("\\because AH = HD \\text{ and } BA \\parallel CH", "given"),
          m("\\therefore BC = CD", "intercept theorem"),
          m("p = q"),
          m(`\\because ${L("st", "BD = BC + CD")}`),
          m("4 = p + q"),
          m(`\\therefore p = q = \\underline{2}`),
          t("In $\\triangle ADE$,"),
          m("\\because AH = HD \\text{ and } HJ \\parallel DE", "given"),
          m("\\therefore AJ = JE", "intercept theorem"),
          m("\\because AJ = JE \\text{ and } AH = HD"),
          m("\\therefore HJ = \\dfrac{1}{2} \\times DE", "mid-pt. theorem"),
          m("r = \\dfrac{1}{2} \\times 5"),
          m(`= \\underline{2.5}`),
        ],
      },
      {
        steps: [
          t("In $\\triangle AEG$,"),
          m("\\because AJ = JE \\text{ and } GF = FE"),
          m("\\therefore JF = \\dfrac{1}{2} \\times AG", "mid-pt. theorem"),
          m("7 = \\dfrac{1}{2} \\times s"),
          m(`s = \\underline{14}`),
        ],
      },
    ],
  },

  {
    id: "q16",
    minScale: 0.62,
    links: [
      { key: "mid", color: "blue", note: "$D$, $G$ mid-points", q: ["mid-points of AB and AC"] },
      { key: "pg", color: "purple", note: "prove $DEFG$ is a parallelogram", q: ["Prove that DEFG is a parallelogram"] },
    ],
    boxes: [{
      steps: [
        m(`EF = BC \\times \\dfrac{2{1 + 2 + 1}`),
        m("= \\dfrac{1}{2} BC"),
        m(`\\because ${L("mid", "AD = DB")} \\text{ and } AG = GC`, "given"),
        m("\\therefore DG = \\dfrac{1}{2} \\times BC \\text{ and } DG \\parallel EF", "mid-pt. theorem"),
        m("= EF"),
        lk("pg", t("$\\therefore$ $DEFG$ is a parallelogram.", "opp. sides equal and //")),
      ],
    }],
  },

  {
    id: "q17",
    minScale: 0.62,
    boxes: [{
      steps: [
        t("In $\\triangle ABD$,"),
        m("\\because AE = ED \\text{ and } AB \\parallel EF", "given"),
        m("\\therefore BF = FD", "intercept theorem"),
        t("In $\\triangle ACD$,"),
        m("\\because AE = ED \\text{ and } EF \\parallel DC", "given"),
        m("\\therefore AF = FC", "intercept theorem"),
        m("\\because BF = FD \\text{ and } AF = FC"),
        t("$\\therefore$ $ABCD$ is a parallelogram.", "diags. bisect each other"),
      ],
    }],
  },

  {
    id: "q18",
    minScale: 0.62,
    links: [
      { key: "trap", color: "blue", note: "trapezium, $AD \\parallel BC$", q: ["trapezium with AD//BC"] },
      { key: "mid", color: "pink", note: "$H$, $G$ mid-points", q: ["mid-points of AB and CD"] },
      { key: "af", color: "green", note: "$AFCD$ parallelogram, $E$ mid-point of $AF$", q: ["AFCD is a parallelogram", "mid-point of AF"] },
      { key: "ask", color: "purple", note: "prove $AD + BC = 2HG$", q: ["AD + BC = 2HG"] },
    ],
    boxes: [{
      steps: [
        m(`${L("mid", "AH = HB")}`, "given"),
        m(`${L("af", "AE = EF")}`, "given"),
        m("\\therefore HE = \\dfrac{1}{2} BF", "mid-point theorem"),
        m("HE \\parallel BF", "mid-point theorem"),
        m(`\\therefore EG \\parallel FC \\parallel ${L("trap", "AD")}`),
        m("\\therefore AEGD \\text{ is a parallelogram}", "by definition"),
        t("Similarly, $EFCG$ is a parallelogram."),
        m("EG = AD = FC", "opp. sides of //gram"),
        m(`\\therefore ${L("ask", "AD + BC")} = EG + BF + FC`),
        m("= EG + 2HE + EG"),
        m("= 2(HE + EG)"),
        m("= 2HG"),
      ],
    }],
  },

  {
    id: "q19",
    minScale: 0.62,
    links: [
      { key: "rh", color: "blue", note: "$ABCD$ is a rhombus", q: ["ABCD is a rhombus"] },
      { key: "mid", color: "pink", note: "$E$ mid-point of $AB$", q: ["mid-point of AB"] },
      { key: "rt", color: "green", note: "$\\angle AQE = 90^\\circ$", q: ["AQE= 90"] },
      { key: "ask", color: "purple", note: "prove $EF = \\dfrac{1}{2} BD$, then $FG$", q: ["Prove that EF", "prove that FG"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        m(`\\angle APB = 90^\\circ`, "property of rhombus"),
        m(`\\angle AQE = ${L("rt", "90^\\circ")}`, "given"),
        m("\\therefore EF \\parallel BD", "corr. ∠s equal"),
        m("AF = FD", "given"),
        m(`\\therefore ${L("mid", "AE = EB")}`, "intercept theorem"),
        m(`\\therefore ${L("ask", "\\underline{EF = \\dfrac{1}{2} BD}")}`, "mid-pt. theorem"),
        h("(b)"),
        m(`\\because ${L("rh", "AB \\parallel DC")}\\text{, i.e. } EB \\parallel GD,`, "property of rhombus"),
        m("\\text{and } EG \\parallel BD", "proved in (a)"),
        t("$\\therefore$ $BEGD$ is a parallelogram.", "by definition"),
        m("\\therefore EG = BD", "opp. sides of //gram"),
        m("EF + FG = BD"),
        m("\\dfrac{1}{2} BD + FG = BD", "proved in (a)"),
        m(`FG = ${L("ask", "\\dfrac{1}{2} BD")}`),
      ],
    }],
  },

  {
    id: "q20",
    minScale: 0.62,
    links: [
      { key: "rt", color: "blue", note: "right-angled at $N$", q: ["right-angled triangle"] },
      { key: "mid", color: "pink", note: "$A$, $B$, $C$ mid-points", q: ["mid-points on MN, LM and NL"] },
      { key: "rec", color: "purple", note: "prove $ABCN$ is a rectangle", q: ["ABCN is a rectangle"] },
    ],
    boxes: [{
      steps: [
        m(`${L("mid", "MA = AN")}`, "given"),
        m("MB = BL", "given"),
        m("AB \\parallel NL", "mid-point theorem"),
        m("LC = CN", "given"),
        m("BC \\parallel MN", "mid-point theorem"),
        m("\\therefore AB \\parallel NC \\text{ and } BC \\parallel AN"),
        t("$\\therefore$ $ABCN$ is a parallelogram.", "opp. sides //"),
        m(`\\because ${L("rt", "\\angle ANC = 90^\\circ")}`, "given"),
        lk("rec", t("$\\therefore$ $ABCN$ is a rectangle.")),
      ],
    }],
  },
];
