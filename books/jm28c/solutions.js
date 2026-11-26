/**
 * Worked solutions for JM28 (C) Special Lines and Centres in Triangles, following the teacher's ANS.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    links: [
      { key: "ab", color: "pink", note: "given", q: ["AB = AC"] },
      { key: "alt", color: "blue", note: "$\\angle ADB = \\angle ADC = 90^\\circ$", q: ["AD is an altitude"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle ABD$ and $\\triangle ACD$,"),
        lk("alt", t("$\\because$ $AD$ is an altitude of $\\triangle ABC$.")),
        m("\\therefore \\angle ADB = \\angle ADC = 90^\\circ"),
        lk("ab", m("AB = AC", "given")),
        m("AD = AD", "common side"),
        m("\\therefore \\triangle ABD \\cong \\triangle ACD", "RHS"),
      ],
    }],
  },

  {
    id: "q2",
    links: [
      { key: "bis", color: "blue", note: "$\\angle ACD = \\angle ECD$", q: ["CD is the angle bisector of ACB"] },
      { key: "dbc", color: "green", note: "$\\angle ECD = \\angle EBD$", q: ["DBC = DCB"] },
      { key: "rt", color: "pink", note: "$90^\\circ$ angles", q: ["CAB = DEB = 90"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle ACD$ and $\\triangle ECD$,"),
        lk("bis", t("$\\because$ $CD$ is the angle bisector of $\\angle ACB$.")),
        m("\\therefore \\angle ACD = \\angle ECD"),
        lk("rt", m("\\angle CAD = \\angle CED = 90^\\circ", "given")),
        m("CD = CD", "common side"),
        m("\\therefore \\triangle ACD \\cong \\triangle ECD", "AAS"),
        h("(b)"),
        t("In $\\triangle ECD$ and $\\triangle EBD$,"),
        lk("dbc", m("\\angle ECD = \\angle EBD", "given")),
        m("\\angle CED = \\angle BED = 90^\\circ", "given"),
        m("DE = DE", "common side"),
        m("\\therefore \\triangle ECD \\cong \\triangle EBD", "AAS"),
      ],
    }],
  },

  {
    id: "q3",
    links: [
      { key: "alt", color: "blue", note: "$\\angle AED = 90^\\circ$", q: ["DE is an altitude of ACD"] },
      { key: "sides", color: "pink", note: "given", q: ["AB = AE and DB = DE"] },
      { key: "ask", color: "purple", note: "$\\angle ABD = 90^\\circ$", q: ["Prove that AB is an altitude"] },
    ],
    boxes: [{
      steps: [
        lk("alt", t("$\\because$ $DE$ is an altitude of $\\triangle ACD$.")),
        m("\\therefore \\angle AED = 90^\\circ"),
        h("(a)"),
        t("In $\\triangle ABD$ and $\\triangle AED$,"),
        lk("sides", m("AB = AE", "given")),
        m("DB = DE", "given"),
        m("AD = AD", "common side"),
        m("\\therefore \\triangle ABD \\cong \\triangle AED", "SSS"),
        h("(b)"),
        m("\\therefore \\angle ABD = \\angle AED", "corr. ∠s, ≅△s"),
        m("= 90^\\circ"),
        lk("ask", t("$\\therefore$ $AB$ is an altitude of $\\triangle ABC$.")),
      ],
    }],
  },

  {
    id: "q4",
    links: [
      { key: "pq", color: "pink", note: "given", q: ["PQ = SR"] },
      { key: "ang", color: "blue", note: "given", q: ["PQT = SRT"] },
      { key: "ask", color: "purple", note: "$PT = ST$", q: ["Prove that QT is a median"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle PQT$ and $\\triangle SRT$,"),
        lk("ang", m("\\angle PQT = \\angle SRT", "given")),
        m("\\angle PTQ = \\angle STR", "vert. opp. ∠s"),
        lk("pq", m("PQ = SR", "given")),
        m("\\therefore \\triangle PQT \\cong \\triangle SRT", "AAS"),
        h("(b)"),
        m("PT = ST", "corr. sides, ≅△s"),
        lk("ask", t("$\\therefore$ $QT$ is a median of $\\triangle QPS$.")),
      ],
    }],
  },

  {
    id: "q5",
    links: [
      { key: "alt", color: "blue", note: "$\\angle CDA = \\angle CDB = 90^\\circ$", q: ["CD is the altitude"] },
      { key: "ang", color: "amber", note: "$\\angle CAB = 2x - x = x$", q: ["ABC = x and ∠BCE = 2x"] },
      { key: "ask", color: "purple", note: "$AD = BD$ and $CD \\perp AB$", q: ["CD is the perpendicular bisector of AB"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("ang", m("\\angle CAB = \\angle BCE - \\angle CBA", "ext. ∠ of △")),
        m("= 2x - x"),
        m("= x"),
        t("In $\\triangle CAD$ and $\\triangle CBD$,"),
        m("\\angle CAD = \\angle CBD = x", "proved"),
        lk("alt", m("\\angle CDA = \\angle CDB = 90^\\circ", "altitude")),
        m("CD = CD", "common side"),
        m("\\therefore \\triangle CAD \\cong \\triangle CBD", "A.A.S."),
        h("(b)"),
        m("\\therefore AD = BD", "corr. sides, ≅△s"),
        m("CD \\perp AB", "given"),
        lk("ask", t("$\\therefore$ $CD$ is the perpendicular bisector of $AB$.")),
      ],
    }],
  },

  {
    id: "q6",
    links: [
      { key: "par", color: "green", note: "alt. ∠s, $XU \\parallel WV$", q: ["XY // WV"] },
      { key: "yu", color: "pink", note: "given", q: ["YU = VW"] },
      { key: "med", color: "blue", note: "$UG = WG$", q: ["XG is a median of XUW"] },
      { key: "ask", color: "purple", note: "$XU = YU$", q: ["WU is a median of XYW"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle XUG$ and $\\triangle VWG$,"),
        lk("par", m("\\angle XUG = \\angle VWG", "alt. ∠s, XU // WV")),
        lk("med", t("$\\because$ $XG$ is a median of $\\triangle XUW$.")),
        m("\\therefore UG = WG"),
        m("\\angle UXG = \\angle WVG", "alt. ∠s, XU // WV"),
        m("\\therefore \\triangle XUG \\cong \\triangle VWG", "ASA"),
        h("(b)(i)"),
        m("\\therefore XG = VG", "corr. sides, ≅△s"),
        t("$\\therefore$ $WG$ is a median of $\\triangle XVW$."),
        h("(ii)"),
        m("\\because \\triangle XUG \\cong \\triangle VWG", "proved in (a)"),
        m("\\therefore XU = VW", "corr. sides, ≅△s"),
        lk("yu", m("\\text{Also, } YU = VW", "given")),
        m("\\therefore XU = YU"),
        lk("ask", t("$\\therefore$ $WU$ is a median of $\\triangle XYW$.")),
      ],
    }],
  },

  {
    id: "q7",
    links: [
      { key: "bis", color: "blue", note: "$\\angle QPT = \\angle SPT$", q: ["PR is the angle bisector of QPS"] },
      { key: "ang", color: "pink", note: "given", q: ["PQT = PST"] },
      { key: "line", color: "green", note: "adj. ∠s on st. line", q: ["PTR is a straight line"] },
      { key: "ask", color: "purple", note: "$QR = SR$", q: ["TR is a median of TQS"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle PQT$ and $\\triangle PST$,"),
          lk("ang", m("\\angle PQT = \\angle PST", "given")),
          lk("bis", t("$\\because$ $PR$ is the angle bisector of $\\angle QPS$.")),
          m("\\therefore \\angle QPT = \\angle SPT"),
          m("PT = PT", "common side"),
          m("\\therefore \\triangle PQT \\cong \\triangle PST", "AAS"),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("\\because \\triangle PQT \\cong \\triangle PST", "proved in (a)"),
          m("\\therefore \\angle QTP = \\angle STP", "corr. ∠s, ≅△s"),
          m("\\text{and } QT = ST", "corr. sides, ≅△s"),
          lk("line", m("\\angle QTR = 180^\\circ - \\angle QTP", "adj. ∠s on st. line")),
          m("= 180^\\circ - \\angle STP"),
          m("= \\angle STR", "adj. ∠s on st. line"),
          m("\\because QT = ST \\text{ and } \\angle QTR = \\angle STR"),
          m("\\therefore QR = SR", "prop. of isos. △"),
          lk("ask", t("$\\therefore$ $TR$ is a median of $\\triangle TQS$.")),
        ],
      },
    ],
  },

  {
    id: "q8",
    links: [
      { key: "med", color: "blue", note: "$AF = BF$", q: ["DF is the median of AB"] },
      { key: "cong", color: "green", note: "corr. sides, ≅△s", q: ["ABC  △DBF"] },
      { key: "ask", color: "purple", note: "$CD = BC$", q: ["AC is the median of BD"] },
    ],
    boxes: [{
      steps: [
        lk("cong", m("\\because \\triangle ABC \\cong \\triangle DBF", "given")),
        m("\\therefore AB = DB \\text{ and } BC = BF", "corr. sides, ≅△s"),
        m("\\therefore CD = BD - BC"),
        m("= AB - BF"),
        m("= AF"),
        lk("med", m("\\because AF = BF", "given")),
        m("\\therefore CD = BF"),
        m("= BC"),
        lk("ask", t("$\\therefore$ $AC$ is the median of $BD$ in $\\triangle ABD$.")),
      ],
    }],
  },

  {
    id: "q9",
    links: [
      { key: "sq", color: "green", note: "property of square", q: ["ABCD is a square"] },
      { key: "af", color: "pink", note: "given", q: ["AF = DE"] },
      { key: "ask", color: "purple", note: "$\\angle AGD = 90^\\circ$", q: ["DG is an altitude of ADF"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle ADF$ and $\\triangle DCE$,"),
        lk("sq", m("AD = DC", "property of square")),
        m("\\angle ADF = \\angle DCE = 90^\\circ", "property of square"),
        lk("af", m("AF = DE", "given")),
        m("\\therefore \\triangle ADF \\cong \\triangle DCE", "RHS"),
        h("(b)"),
        m("\\because \\triangle ADF \\cong \\triangle DCE", "proved in (a)"),
        m("\\therefore \\angle CDE = \\angle DAF", "corr. ∠s, ≅△s"),
        m("\\angle ADG = \\angle ADF - \\angle CDE"),
        m("= 90^\\circ - \\angle DAF"),
        t("In $\\triangle ADG$,"),
        m("\\angle ADG + \\angle DAF + \\angle AGD = 180^\\circ", "∠ sum of △"),
        m("(90^\\circ - \\angle DAF) + \\angle DAF + \\angle AGD = 180^\\circ"),
        m("\\angle AGD = 90^\\circ"),
        lk("ask", t("$\\therefore$ $DG$ is an altitude of $\\triangle ADF$.")),
      ],
    }],
  },

  {
    id: "q10",
    links: [
      { key: "given", color: "pink", note: "converse of ⊥ bisector property", q: ["PQ= PR and PT⊥QR"] },
      { key: "ask", color: "purple", note: "SSS", q: ["PQS≅∆PRS"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("given", m("\\because PQ = PR \\text{ and } PT \\perp QR")),
        t("$\\therefore$ $PT$ is the perpendicular bisector of $QR$.", "converse of ⊥ bisector property"),
        m("\\therefore QT = RT"),
        h("(b)"),
        t("In $\\triangle PQS$ and $\\triangle PRS$,"),
        m("PS = PS", "common side"),
        m("PQ = PR", "given"),
        t("$\\because$ $ST$ is the perpendicular bisector of $QR$.", "proved in (a)"),
        m("\\therefore QS = RS", "⊥ bisector property"),
        lk("ask", m("\\therefore \\triangle PQS \\cong \\triangle PRS", "SSS")),
      ],
    }],
  },

  {
    id: "q11",
    links: [
      { key: "mid", color: "blue", note: "$UT = PT$", q: ["T is the mid-point of PU"] },
      { key: "par", color: "green", note: "alt. ∠s, $PS \\parallel QR$", q: ["PS//QR"] },
      { key: "len", color: "pink", note: "$PS = 8$ cm, $RS = 17$ cm", q: ["PS= 8 cm", "RS= 17 cm"] },
      { key: "perp", color: "amber", note: "$RT \\perp QS$", q: ["RT⊥QS"] },
      { key: "ask", color: "purple", note: "find $RU$", q: ["Find the length of RU"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle UQT$ and $\\triangle PST$,"),
        m("\\angle UTQ = \\angle PTS", "vert. opp. ∠s"),
        lk("mid", m("UT = PT", "given")),
        lk("par", m("\\angle QUT = \\angle SPT", "alt. ∠s, PS // QR")),
        m("\\therefore \\triangle UQT \\cong \\triangle PST", "ASA"),
        m("\\therefore QT = ST", "corr. sides, ≅△s"),
        h("(b)"),
        m("\\because \\triangle UQT \\cong \\triangle PST", "proved in (a)"),
        m("\\therefore QU = SP", "corr. sides, ≅△s"),
        m(`= ${L("len", "8\\text{ cm}")}`),
        lk("perp", m("\\because RT \\perp QS \\text{ and } QT = ST")),
        t("$\\therefore$ $RT$ is the perpendicular bisector of $QS$."),
        m("\\therefore QR = RS", "⊥ bisector property"),
        m("QU + RU = RS"),
        m("RU = RS - QU"),
        m(`= (${L("len", "17")} - 8)\\text{ cm}`),
        lk("ask", m("= \\underline{\\underline{9\\text{ cm}}}")),
      ],
    }],
  },

  {
    id: "q12",
    links: [
      { key: "given", color: "pink", note: "converse of ∠ bisector property", q: ["PQ= PS, PQ⊥RQ and PS⊥RS"] },
      { key: "ask", color: "purple", note: "SAS", q: ["QRT≅∆SRT"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("given", m("\\because PQ = PS,\\ PQ \\perp RQ \\text{ and } PS \\perp RS")),
        t("$\\therefore$ $PR$ is the angle bisector of $\\angle QRS$.", "converse of ∠ bisector property"),
        m("\\therefore \\angle PRQ = \\angle PRS"),
        h("(b)"),
        t("In $\\triangle QRT$ and $\\triangle SRT$,"),
        m("\\because \\angle QPR = 180^\\circ - \\angle RQP - \\angle PRQ", "∠ sum of △"),
        m("= 180^\\circ - \\angle PSR - \\angle PRS"),
        m("= \\angle RPS", "∠ sum of △"),
        t("$\\therefore$ $PR$ is the angle bisector of $\\angle QPS$."),
        m("\\therefore QR = SR", "∠ bisector property"),
        m("\\because \\angle PRQ = \\angle PRS", "proved in (a)"),
        m("\\therefore \\angle QRT = \\angle SRT"),
        m("RT = RT", "common side"),
        lk("ask", m("\\therefore \\triangle QRT \\cong \\triangle SRT", "SAS")),
      ],
    }],
  },

  {
    id: "q13",
    links: [
      { key: "rs", color: "pink", note: "given", q: ["RS= TS"] },
      { key: "rt", color: "green", note: "$SQ \\perp PQ$, $SU \\perp PU$", q: ["PQS= ∠PUS= ∠QRS= ∠STU= 90"] },
      { key: "qpu", color: "amber", note: "$\\angle QPU = 72^\\circ$", q: ["QPU= 72"] },
      { key: "ask", color: "purple", note: "find $\\angle PSU$", q: ["Find ∠PSU"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("In $\\triangle QRS$ and $\\triangle UTS$,"),
        m("\\angle QSR = \\angle UST", "vert. opp. ∠s"),
        lk("rs", m("RS = TS", "given")),
        lk("rt", m("\\angle QRS = \\angle UTS", "given")),
        m("\\therefore \\triangle QRS \\cong \\triangle UTS", "ASA"),
        h("(b)"),
        m("\\because \\triangle QRS \\cong \\triangle UTS", "proved in (a)"),
        m("\\therefore QS = US", "corr. sides, ≅△s"),
        m("\\because QS = US,\\ SQ \\perp PQ \\text{ and } SU \\perp PU"),
        t("$\\therefore$ $PS$ is the angle bisector of $\\angle QPU$.", "converse of ∠ bisector property"),
        m("\\therefore \\angle SPU = \\dfrac{1}{2} \\times \\angle QPU"),
        m(`= \\dfrac{1}{2} \\times ${L("qpu", "72^\\circ")}`),
        m("= 36^\\circ"),
        t("In $\\triangle PSU$,"),
        m("\\angle PSU + \\angle PUS + \\angle SPU = 180^\\circ", "∠ sum of △"),
        m("\\angle PSU + 90^\\circ + 36^\\circ = 180^\\circ"),
        lk("ask", m("\\angle PSU = \\underline{\\underline{54^\\circ}}")),
      ],
    }],
  },

  {
    id: "q14",
    links: [
      { key: "alt", color: "pink", note: "$\\angle ADC = 90^\\circ$", q: ["AD is the altitude"] },
      { key: "bis", color: "blue", note: "$\\angle ECB = \\dfrac{\\angle ACD}{2}$", q: ["CE is the angle bisector of ACB"] },
      { key: "ang", color: "amber", note: "$58^\\circ$ and $74^\\circ$", q: ["DAC = 58o and ABC = 74o"] },
      { key: "ask", color: "purple", note: "find $\\angle AEC$", q: ["Find AEC"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("In $\\triangle ACD$,"),
          lk("alt", m(`\\angle ACD = 180^\\circ - 90^\\circ - ${L("ang", "58^\\circ")}`)),
          m("= 32^\\circ"),
          lk("bis", m("\\angle ECB = \\dfrac{\\angle ACD}{2}")),
          m("= \\dfrac{32^\\circ}{2}"),
          m("= 16^\\circ"),
          m(`\\angle AEC = 16^\\circ + ${L("ang", "74^\\circ")}`),
          lk("ask", m("= \\underline{\\underline{90^\\circ}}")),
        ],
      },
      {
        steps: [
          h("(b)"),
          m("AB \\perp CE", "proved"),
          t("In $\\triangle ACE$ and $\\triangle BCE$,"),
          m("\\angle BEC = 180^\\circ - \\angle AEC", "adj. ∠s on st. line"),
          m("= 180^\\circ - 90^\\circ"),
          m("= 90^\\circ"),
          m("= \\angle AEC"),
          m("CE = CE", "common side"),
          m("\\angle ACE = \\angle BCE", "angle bisector"),
          m("\\therefore \\triangle ACE \\cong \\triangle BCE", "A.S.A."),
          m("\\therefore AE = BE", "corr. sides, ≅△s"),
          t("$\\therefore$ $CE$ is the perpendicular bisector of $AB$."),
        ],
      },
    ],
  },

  {
    id: "q15",
    links: [
      { key: "iso", color: "pink", note: "base ∠s, isos. △", q: ["UR = UT"] },
      { key: "par", color: "green", note: "corr. and alt. ∠s, $QU \\parallel RT$", q: ["QU // RT"] },
      { key: "prt", color: "amber", note: "$\\angle PRT = 90^\\circ$", q: ["PRT = 90o"] },
      { key: "ask", color: "purple", note: "angle bisector and perpendicular bisector", q: ["QU is an angle bisector of ∠PUR and a perpendicular bisector of PR"] },
    ],
    boxes: [{
      steps: [
        t("In $\\triangle URT$,"),
        lk("iso", m("\\because UR = UT", "given")),
        m("\\therefore \\angle UTR = \\angle URT = a", "base ∠s, isos. △"),
        lk("par", m("\\angle PUQ = \\angle UTR = a", "corr. ∠s, QU // RT")),
        m("\\angle RUQ = \\angle URT = a", "alt. ∠s, QU // RT"),
        m("\\therefore \\angle PUQ = \\angle RUQ"),
        t("i.e. $QU$ is an angle bisector of $\\angle PUR$."),
        t("In $\\triangle PQU$ and $\\triangle RQU$,"),
        lk("prt", m("\\angle PQU = \\angle PRT = 90^\\circ", "corr. ∠s, QU // RT")),
        m("\\therefore \\angle PQU = \\angle UQR = 90^\\circ", "adj. ∠s on st. line"),
        m("\\angle PUQ = \\angle RUQ = a", "proved"),
        m("QU = QU", "common side"),
        m("\\therefore \\triangle PQU \\cong \\triangle RQU", "ASA"),
        m("\\therefore PQ = RQ", "corr. sides, ≅△s"),
        lk("ask", t("$\\therefore$ $QU$ is a perpendicular bisector of $PR$.")),
      ],
    }],
  },
];
