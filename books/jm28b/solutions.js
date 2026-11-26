/**
 * Worked solutions for JM28 (B) Special Lines and Centres in Triangles, following the teacher's ANS.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, note, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    links: [
      { key: "ask", color: "purple", note: "find $x$", q: ["Find the value of"] },
    ],
    boxes: [{
      steps: [
        m("\\because \\angle BAD = \\angle CAD"),
        t("$\\therefore$ $AD$ is the angle bisector of $\\angle BAC$."),
        m("\\therefore CD = BD", "∠ bisector property"),
        m("5x - 8 = 2(x + 2)"),
        m("5x - 8 = 2x + 4"),
        m("3x = 12"),
        lk("ask", m("x = \\underline{\\underline{4}}")),
      ],
    }],
  },

  {
    id: "q2",
    links: [
      { key: "bis", color: "blue", note: "∠ bisector property: $SU = ST$", q: ["PS is the angle bisector of ∠QPR"] },
      { key: "side", color: "pink", note: "$PQ = 15$ cm, $PR = 13$ cm", q: ["PQ= 15 cm", "PR= 13 cm"] },
      { key: "area", color: "green", note: "area of △PQR $= 84$ cm²", q: ["area of △PQR is 84 cm2"] },
      { key: "ask", color: "purple", note: "distance $= ST$", q: ["find the distance between S and PQ"] },
    ],
    boxes: [{
      steps: [
        t("Let $T$ and $U$ be points on $PQ$ and $PR$ respectively such that $ST \\perp PQ$ and $SU \\perp PR$."),
        lk("bis", t("$\\because$ $PS$ is the angle bisector of $\\angle QPR$.")),
        m("\\therefore SU = ST", "∠ bisector property"),
        lk("area", m("\\because \\text{Area of }\\triangle PQR = 84\\text{ cm}^2")),
        m("\\therefore \\text{Area of }\\triangle PQS + \\text{area of }\\triangle PRS = 84\\text{ cm}^2"),
        m(`\\dfrac{1}{2} \\times ${L("side", "15\\text{ cm}")} \\times ST + \\dfrac{1}{2} \\times ${L("side", "13\\text{ cm}")} \\times ST = 84\\text{ cm}^2`),
        m("14ST = 84\\text{ cm}"),
        m("ST = 6\\text{ cm}"),
        lk("ask", t("$\\therefore$ The distance between $S$ and $PQ$ is $6$ cm.")),
      ],
    }],
  },

  {
    id: "q3",
    links: [
      { key: "cd", color: "pink", note: "equal distances from $D$", q: ["CD= DE"] },
      { key: "abe", color: "amber", note: "$\\angle ABE = 128^\\circ$", q: ["ABE= 128"] },
      { key: "rt", color: "green", note: "$DE \\perp BE$, $DC \\perp BC$", q: ["BED= ∠BCD= 90"] },
      { key: "ask", color: "purple", note: "find $x$ and $y$", q: ["Find x and y"] },
    ],
    boxes: [{
      steps: [
        lk("cd", t("$\\because$ $CD = DE$, $DE \\perp BE$ and $DC \\perp BC$")),
        t("$\\therefore$ $BD$ is the angle bisector of $\\angle CBE$."),
        m("\\therefore \\angle DBE = \\angle CBD = x", "converse of ∠ bisector property"),
        m("\\angle ABE + \\angle DBE + \\angle CBD = 180^\\circ", "adj. ∠s on st. line"),
        m(`${L("abe", "128^\\circ")} + x + x = 180^\\circ`),
        m("2x = 52^\\circ"),
        lk("ask", m("x = \\underline{\\underline{26^\\circ}}")),
        t("In $\\triangle BDE$,"),
        m("\\angle BDE + \\angle DBE + \\angle BED = 180^\\circ", "∠ sum of △"),
        m(`y + 26^\\circ + ${L("rt", "90^\\circ")} = 180^\\circ`),
        m("y = \\underline{\\underline{64^\\circ}}"),
      ],
    }],
  },

  {
    id: "q4",
    links: [
      { key: "ask", color: "purple", note: "converse of ∠ bisector property", q: ["Prove that PR is the angle bisector of ∠QPS"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle PQR$,"),
        m("PQ^2 + QR^2 = (55^2 + 48^2)\\text{ cm}^2"),
        m("= (3025 + 2304)\\text{ cm}^2"),
        m("= 5329\\text{ cm}^2"),
        m("PR^2 = 73^2\\text{ cm}^2"),
        m("= 5329\\text{ cm}^2"),
        m("\\because PQ^2 + QR^2 = PR^2"),
        t("$\\therefore$ $\\triangle PQR$ is a right-angled triangle, where $\\angle PQR = 90^\\circ$.", "converse of Pyth. theorem"),
        m("\\because QR = RS,\\ QR \\perp PQ \\text{ and } RS \\perp PS"),
        lk("ask", t("$\\therefore$ $PR$ is the angle bisector of $\\angle QPS$.", "converse of ∠ bisector property")),
      ],
    }],
  },

  {
    id: "q5",
    links: [
      { key: "line", color: "green", note: "$H$ on the straight line $EG$", q: ["EHG is a straight line"] },
      { key: "ask", color: "purple", note: "find $x$", q: ["Find the value of"] },
    ],
    boxes: [{
      steps: [
        lk("line", m("\\because FH \\perp EG \\text{ and } EH = GH")),
        t("$\\therefore$ $FH$ is the perpendicular bisector of $EG$."),
        m("\\therefore EF = GF", "⊥ bisector property"),
        m("x + 5 = 3x - 3"),
        m("8 = 2x"),
        lk("ask", m("x = \\underline{\\underline{4}}")),
      ],
    }],
  },

  {
    id: "q6",
    links: [
      { key: "perp", color: "blue", note: "⊥ bisector property: $CD = AD$", q: ["DE is the perpendicular bisector of AC"] },
      { key: "len", color: "pink", note: "$AD = 15$ cm, $BD = 8$ cm", q: ["AD= 15 cm and BD= 8 cm"] },
      { key: "ask", color: "purple", note: "$\\dfrac{1}{2} \\times AB \\times CD$", q: ["Find the area of"] },
    ],
    boxes: [{
      steps: [
        lk("perp", t("$\\because$ $DE$ is the perpendicular bisector of $AC$.")),
        m("\\therefore CD = AD", "⊥ bisector property"),
        m(`= ${L("len", "15\\text{ cm}")}`),
        lk("ask", m("\\text{Area of }\\triangle ABC = \\dfrac{1}{2} \\times AB \\times CD")),
        m(`= \\dfrac{1}{2} \\times ${L("len", "(15 + 8)")} \\times 15\\text{ cm}^2`),
        m("= \\underline{\\underline{172.5\\text{ cm}^2}}"),
      ],
    }],
  },

  {
    id: "q7",
    links: [
      { key: "perp", color: "blue", note: "converse of ⊥ bisector property", q: ["YZ⊥WX", "WY= XY= 26 cm"] },
      { key: "wz", color: "pink", note: "$WZ = XZ$", q: ["WZ= 2(x−1)cm and XZ= (x+ 4)cm"] },
      { key: "area", color: "purple", note: "$\\dfrac{1}{2} \\times WX \\times YZ$", q: ["Find the area of"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("perp", m("\\because WY = XY \\text{ and } YZ \\perp WX")),
        t("$\\therefore$ $YZ$ is the perpendicular bisector of $WX$."),
        m("\\therefore WZ = XZ", "converse of ⊥ bisector property"),
        lk("wz", m("2(x - 1) = x + 4")),
        m("2x - 2 = x + 4"),
        m("x = \\underline{\\underline{6}}"),
        h("(b)"),
        m("WZ = 2(x - 1)\\text{ cm}"),
        m("= 2(6 - 1)\\text{ cm}"),
        m("= 10\\text{ cm}"),
        t("In $\\triangle WYZ$,"),
        m("YZ^2 + WZ^2 = WY^2", "Pyth. theorem"),
        m("YZ = \\sqrt{WY^2 - WZ^2}"),
        m("= \\sqrt{26^2 - 10^2}\\text{ cm}"),
        m("= 24\\text{ cm}"),
        lk("area", m("\\text{Area of }\\triangle WXY = \\dfrac{1}{2} \\times WX \\times YZ")),
        m("= \\dfrac{1}{2} \\times (2 \\times 10) \\times 24\\text{ cm}^2"),
        m("= \\underline{\\underline{240\\text{ cm}^2}}"),
      ],
    }],
  },

  {
    id: "q8",
    links: [
      { key: "mid", color: "blue", note: "$QT = TR$", q: ["T is the mid-point of QR"] },
      { key: "ang", color: "amber", note: "$\\angle PSR = 76^\\circ$, $\\angle RQS = 38^\\circ$", q: ["PSR= 76", "RQS= 38"] },
      { key: "ask", color: "purple", note: "converse of ⊥ bisector property", q: ["ST is the perpendicular bisector of QR"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle QRS$,"),
        m("\\angle QRS + \\angle RQS = \\angle PSR", "ext. ∠ of △"),
        m(`\\angle QRS + ${L("ang", "38^\\circ")} = ${L("ang", "76^\\circ")}`),
        m("\\angle QRS = 38^\\circ"),
        m("\\because \\angle RQS = \\angle QRS"),
        m("\\therefore QS = RS", "sides opp. equal ∠s"),
        lk("mid", m("\\because QS = RS \\text{ and } QT = TR")),
        lk("ask", t("$\\therefore$ $ST$ is the perpendicular bisector of $QR$.", "converse of ⊥ bisector property")),
      ],
    }],
  },

  {
    id: "q9",
    links: [
      { key: "perp", color: "blue", note: "⊥ bisector property: $PS = RS$", q: ["ST is the perpendicular bisector of PR"] },
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["PQ= PR"] },
      { key: "qr", color: "green", note: "$QR = PS = RS$", q: ["If QR= PS"] },
      { key: "ask", color: "purple", note: "$\\angle QRS = \\angle PRS$", q: ["Peter claims that RS is the angle bisector"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("perp", t("$\\because$ $ST$ is the perpendicular bisector of $PR$.")),
        m("\\therefore PS = RS", "⊥ bisector property"),
        m("\\therefore \\angle RPS = \\angle PRS", "base ∠s, isos. △"),
        h("(b)"),
        t("Let $\\angle RPS = \\angle PRS = x$."),
        t("In $\\triangle PRS$,"),
        m("\\angle QSR = \\angle PRS + \\angle RPS", "ext. ∠ of △"),
        m("= x + x"),
        m("= 2x"),
        lk("qr", m("\\because QR = PS", "given")),
        m("= RS"),
        m("\\therefore \\angle RQS = \\angle QSR", "base ∠s, isos. △"),
        m("= 2x"),
        lk("iso", m("\\because PQ = PR")),
        m("\\therefore \\angle PRQ = \\angle PQR", "base ∠s, isos. △"),
        m("= 2x"),
        m("\\angle QRS = \\angle PRQ - \\angle PRS"),
        m("= 2x - x"),
        m("= x"),
        m("\\because \\angle QRS = \\angle PRS"),
        t("$\\therefore$ $RS$ is the angle bisector of $\\angle PRQ$."),
        lk("ask", t("$\\therefore$ Peter's claim is agreed.")),
      ],
    }],
  },

  {
    id: "q10",
    links: [
      { key: "line", color: "green", note: "ext. ∠ of △BCD", q: ["ABC is a straight line"] },
      { key: "ask", color: "purple", note: "$\\angle ADB = \\angle BDC$", q: ["DB is the angle bisector of ADC"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle BCD$,"),
        lk("line", m("\\angle BDC + \\angle BCD = \\angle ABD", "ext. ∠ of △")),
        m("\\angle BDC + 64^\\circ = 96^\\circ"),
        m("\\angle BDC = 32^\\circ"),
        t("In $\\triangle ACD$,"),
        m("\\angle ADC + \\angle ACD + \\angle CAD = 180^\\circ", "∠ sum of △"),
        m("\\angle BDC + \\angle ADB + 64^\\circ + 52^\\circ = 180^\\circ"),
        m("\\angle ADB + 148^\\circ = 180^\\circ"),
        m("\\angle ADB = 32^\\circ"),
        m("\\because \\angle ADB = \\angle BDC"),
        lk("ask", t("$\\therefore$ $DB$ is the angle bisector of $\\angle ADC$ in $\\triangle ACD$.")),
      ],
    }],
  },

  {
    id: "q11",
    links: [
      { key: "bis", color: "blue", note: "$\\angle ACB = 2\\angle ACD$", q: ["CD is the angle bisector of ACB"] },
      { key: "ang", color: "amber", note: "$48^\\circ$, $98^\\circ$, $22^\\circ$", q: ["BAC = 48o , ADC = 98o and EBC = 22o"] },
      { key: "ask", color: "purple", note: "$\\angle BEC = 90^\\circ$", q: ["prove that BE is an altitude"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ACD$,"),
        m(`\\angle ACD = ${L("ang", "180^\\circ - 48^\\circ - 98^\\circ")}`, "∠ sum of △"),
        m("= 34^\\circ"),
        lk("bis", m("\\angle ACB = 2\\angle ACD", "angle bisector")),
        m("= 2(34^\\circ)"),
        m("= 68^\\circ"),
        t("In $\\triangle BEC$,"),
        m("\\angle BEC = 180^\\circ - 22^\\circ - 68^\\circ", "∠ sum of △"),
        m("= 90^\\circ"),
        lk("ask", t("$\\therefore$ $BE$ is an altitude of $\\triangle ABC$.")),
      ],
    }],
  },

  {
    id: "q12",
    links: [
      { key: "bis", color: "blue", note: "$\\angle CAD = \\angle BAC$", q: ["AC is the angle bisector of BAD"] },
      { key: "par", color: "green", note: "alt. ∠s, $BA \\parallel CD$", q: ["BA//CD"] },
      { key: "ang", color: "amber", note: "$\\angle ABD = 65^\\circ$, $\\angle BAC = 25^\\circ$", q: ["ABD = 65 and BAC = 25"] },
      { key: "ask", color: "purple", note: "$\\angle ADB = \\angle BDC$", q: ["Prove that BD is the angle bisector of ADC"] },
    ],
    boxes: [{
      steps: [
        lk("par", m("\\angle BDC = \\angle ABD", "alt. ∠s, BA // CD")),
        m(`= ${L("ang", "65^\\circ")}`),
        lk("bis", t("$\\because$ $AC$ is the angle bisector of $\\angle BAD$.")),
        m("\\therefore \\angle CAD = \\angle BAC = 25^\\circ"),
        t("In $\\triangle ABD$,"),
        m("\\angle ADB = 180^\\circ - \\angle ABD - \\angle BAD", "∠ sum of △"),
        m("= 180^\\circ - 65^\\circ - (25^\\circ + 25^\\circ)"),
        m("= 65^\\circ"),
        m("= \\angle BDC"),
        lk("ask", t("$\\therefore$ $BD$ is the angle bisector of $\\angle ADC$.")),
      ],
    }],
  },

  {
    id: "q13",
    links: [
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["AB = AC and BAC = 90"] },
      { key: "am", color: "green", note: "$\\angle MAC = \\angle MCA$", q: ["AM = MC"] },
      { key: "ask", color: "purple", note: "$\\angle MAB = \\angle MAC$", q: ["AM is the angle bisector of BAC"] },
    ],
    boxes: [
      {
        steps: [
          t("In $\\triangle ABC$,"),
          lk("iso", m("\\because AB = AC")),
          m("\\therefore \\angle ABC = \\angle ACB"),
          m("\\angle ABC + \\angle ACB + \\angle BAC = 180^\\circ"),
          m("2\\angle ACB + 90^\\circ = 180^\\circ"),
          m("\\angle ACB = 45^\\circ"),
        ],
      },
      {
        steps: [
          t("In $\\triangle AMC$,"),
          lk("am", m("\\because AM = MC")),
          m("\\therefore \\angle MAC = \\angle MCA = 45^\\circ"),
          m("\\angle MAB = \\angle BAC - \\angle MAC"),
          m("= 90^\\circ - 45^\\circ"),
          m("= 45^\\circ"),
          m("\\therefore \\angle MAB = \\angle MAC"),
          lk("ask", t("$\\therefore$ $AM$ is the angle bisector of $\\angle BAC$ in $\\triangle ABC$.")),
        ],
      },
    ],
  },

  {
    id: "q14",
    links: [
      { key: "perp", color: "blue", note: "$BD = DC$ and $ED \\perp BC$", q: ["DE is the perpendicular bisector of BC"] },
      { key: "de", color: "pink", note: "base ∠s, isos. △", q: ["DE = BD"] },
      { key: "ask", color: "purple", note: "$\\angle BEC = 90^\\circ$", q: ["Prove that BE is an altitude"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("perp", t("$\\because$ $DE$ is the perpendicular bisector of $BC$.")),
        m("\\therefore BD = DC \\text{ and } ED \\perp BC"),
        t("In $\\triangle BDE$,"),
        lk("de", m("\\because BD = DE", "given")),
        m("\\therefore \\angle DBE = \\angle DEB", "base ∠s, isos. △"),
        m("\\angle DBE + \\angle DEB + \\angle BDE = 180^\\circ", "∠ sum of △"),
        m("2\\angle DEB + 90^\\circ = 180^\\circ"),
        m("\\angle DEB = \\underline{\\underline{45^\\circ}}"),
        h("(b)"),
        t("In $\\triangle CDE$,"),
        m("\\because DC = DE"),
        m("\\therefore \\angle DCE = \\angle DEC", "base ∠s, isos. △"),
        m("\\angle DCE + \\angle DEC + \\angle CDE = 180^\\circ", "∠ sum of △"),
        m("2\\angle DEC + 90^\\circ = 180^\\circ"),
        m("\\angle DEC = 45^\\circ"),
        m("\\therefore \\angle BEC = \\angle DEB + \\angle DEC"),
        m("= 45^\\circ + 45^\\circ"),
        m("= 90^\\circ"),
        lk("ask", t("$\\therefore$ $BE$ is an altitude of $\\triangle ABC$.")),
      ],
    }],
  },

  {
    id: "q15",
    links: [
      { key: "eq", color: "pink", note: "prop. of equil. △", q: ["BCD is an equilateral triangle"] },
      { key: "par", color: "green", note: "alt. and corr. ∠s, $DE \\parallel BC$", q: ["DE // BC"] },
      { key: "ask", color: "purple", note: "$\\angle ADE = \\angle EDC$", q: ["Prove that DE is the angle bisector"] },
    ],
    boxes: [{
      steps: [
        lk("eq", t("$\\because$ $\\triangle BCD$ is an equilateral triangle.", "given")),
        m("\\therefore \\angle BCD = \\angle CDB = \\angle DBC = 60^\\circ", "prop. of equil. △"),
        lk("par", m("\\angle EDC = \\angle BCD = 60^\\circ", "alt. ∠s, DE // BC")),
        m("\\angle ADE = \\angle DBC = 60^\\circ", "corr. ∠s, DE // BC"),
        m("\\therefore \\angle ADE = \\angle EDC"),
        lk("ask", t("$\\therefore$ $DE$ is the angle bisector of $\\angle ADC$ in $\\triangle ADC$.")),
      ],
    }],
  },

  {
    id: "q16",
    links: [
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["AC = AE"] },
      { key: "par", color: "green", note: "alt. ∠s, $AD \\parallel CE$", q: ["DA//CE"] },
      { key: "ask", color: "purple", note: "$\\angle DAB = \\angle CAD$", q: ["Prove that AD is the angle bisector"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ACE$,"),
        lk("iso", m("\\angle E = \\angle C", "base ∠s, isos. △")),
        lk("par", m("\\angle C = \\angle CAD", "alt. ∠s, AD // CE")),
        m("\\angle CAB = \\angle C + \\angle E", "ext. ∠ of △"),
        m("\\angle CAD + \\angle DAB = \\angle C + \\angle E"),
        m("\\angle DAB = \\angle C + \\angle E - \\angle CAD"),
        m("\\angle DAB = \\angle E"),
        lk("ask", m("\\angle DAB = \\angle CAD")),
      ],
    }],
  },

  {
    id: "q17",
    links: [
      { key: "par", color: "green", note: "alt. ∠s, $AB \\parallel DC$", q: ["AB//CD"] },
      { key: "perp", color: "pink", note: "$90^\\circ$ at $E$", q: ["AC ⊥BD"] },
      { key: "bis", color: "blue", note: "$\\angle ABD = \\angle CBD = a$", q: ["DB is an angle bisector of ∠ABC"] },
      { key: "ask", color: "purple", note: "$\\angle DCA = \\angle BCA$", q: ["show that AC is an angle bisector"] },
    ],
    boxes: [{
      steps: [
        lk("bis", t("Let $\\angle ABD = a = \\angle CBD$.")),
        lk("perp", m("\\angle BCA = 180^\\circ - 90^\\circ - \\angle CBD", "∠ sum of △")),
        m("= 90^\\circ - a"),
        m("\\angle BAC = 180^\\circ - 90^\\circ - \\angle ABD", "∠ sum of △"),
        m("= 90^\\circ - a"),
        lk("par", m("\\because \\angle DCA = \\angle BAC", "alt. ∠s, AB // DC")),
        m("\\therefore \\angle DCA = 90^\\circ - a"),
        m("\\because \\angle DCA = \\angle BCA"),
        lk("ask", t("$\\therefore$ $AC$ is an angle bisector of $\\triangle BCD$.")),
      ],
    }],
  },

  {
    id: "q18",
    links: [
      { key: "ang", color: "blue", note: "$a_1 = a_2$, $b_1 = b_2$", q: ["BAD = ∠CBD, ∠ABD = ∠BCD"] },
      { key: "ask", color: "purple", note: "$\\angle BDC = 90^\\circ$", q: ["Show that BD is an altitude"] },
    ],
    boxes: [{
      steps: [
        note("$a_1 = \\angle BAD$, $a_2 = \\angle CBD$, $b_1 = \\angle ABD$, $b_2 = \\angle BCD$"),
        h("(a)"),
        m("b_1 + a_1 + b_2 + a_2 = 180^\\circ", "∠ sum of △"),
        lk("ang", m("2a_1 + 2b_1 = 180^\\circ", "∵ a₁ = a₂, b₁ = b₂")),
        m("a_1 + b_1 = 90^\\circ"),
        m("\\because \\angle BDC = a_1 + b_1", "ext. ∠ of △"),
        m("\\therefore \\angle BDC = 90^\\circ"),
        lk("ask", t("i.e. $BD$ is an altitude of $\\triangle ABC$.")),
        h("(b)"),
        m("\\angle ABC = b_1 + a_2 = a_1 + b_1 = 90^\\circ"),
        t("$\\therefore$ $\\triangle ABC$ is a right-angled triangle."),
        h("(c)"),
        t("$BD$, $AB$ and $BC$."),
      ],
    }],
  },

  {
    id: "q19",
    links: [
      { key: "ts", color: "pink", note: "$\\angle PST = 90^\\circ$", q: ["TS ⊥ PR"] },
      { key: "ang", color: "blue", note: "$\\angle PRQ = \\angle PTS$", q: ["PTS = PRQ"] },
      { key: "ask", color: "purple", note: "$\\angle PQR = 90^\\circ$", q: ["Prove that PQ is an altitude"] },
    ],
    boxes: [{
      steps: [
        lk("ang", m("\\angle PRQ = \\angle PTS", "given")),
        t("In $\\triangle PQR$,"),
        m("\\angle PQR = 180^\\circ - \\angle PRQ - \\angle QPR", "∠ sum of △"),
        m("= 180^\\circ - \\angle PTS - \\angle TPS"),
        m("= \\angle PST", "∠ sum of △"),
        lk("ts", m("= 90^\\circ")),
        lk("ask", t("$\\therefore$ $PQ$ is an altitude of $\\triangle PQR$.")),
      ],
    }],
  },

  {
    id: "q20",
    links: [
      { key: "alt", color: "pink", note: "$\\angle ABC = 90^\\circ$", q: ["AB is the altitude of BC in △ ABC"] },
      { key: "ang", color: "blue", note: "$\\angle CDE = \\angle BAC$", q: ["BAC = CDE"] },
      { key: "ask", color: "purple", note: "$\\angle DEC = 90^\\circ$", q: ["prove that DE is the altitude"] },
    ],
    boxes: [{
      steps: [
        lk("alt", t("$\\because$ $AB$ is the altitude of $BC$ in $\\triangle ABC$.", "given")),
        m("\\therefore \\angle ABC = 90^\\circ"),
        lk("ang", m("\\because \\angle CDE = \\angle BAC", "given")),
        m("\\therefore \\angle DEC = 180^\\circ - \\angle CDE - \\angle DCE", "∠ sum of △"),
        m("= 180^\\circ - \\angle BAC - \\angle BCA"),
        m("= \\angle ABC", "∠ sum of △"),
        m("= 90^\\circ"),
        lk("ask", t("$\\therefore$ $DE$ is the altitude of $CE$ in $\\triangle CED$.")),
      ],
    }],
  },

  {
    id: "q21",
    links: [
      { key: "alt", color: "pink", note: "$\\angle BCD = 90^\\circ$", q: ["CD is an altitude of BCD"] },
      { key: "eb", color: "green", note: "base ∠s, isos. △", q: ["EB = EC"] },
      { key: "ang", color: "blue", note: "$\\angle BAC = \\angle CDB$", q: ["BAC = CDB"] },
      { key: "ask", color: "purple", note: "$\\angle ABC = 90^\\circ$", q: ["Prove that AB is an altitude"] },
    ],
    boxes: [{
      steps: [
        lk("alt", t("$\\because$ $CD$ is an altitude of $\\triangle BCD$.")),
        m("\\therefore \\angle BCD = 90^\\circ"),
        t("In $\\triangle EBC$,"),
        lk("eb", m("\\because EB = EC", "given")),
        m("\\therefore \\angle EBC = \\angle ECB", "base ∠s, isos. △"),
        lk("ang", m("\\angle BAC = \\angle CDB", "given")),
        t("In $\\triangle ABC$,"),
        m("\\angle ABC = 180^\\circ - \\angle BAC - \\angle ECB", "∠ sum of △"),
        m("= 180^\\circ - \\angle CDB - \\angle EBC"),
        m("= \\angle BCD", "∠ sum of △"),
        m("= 90^\\circ"),
        lk("ask", t("$\\therefore$ $AB$ is an altitude of $\\triangle ABC$.")),
      ],
    }],
  },
];
