/**
 * Worked solutions for JM27 (C) Percentages II (salaries tax), laid out like
 * the teacher's ANS. Field reference: docs/02-book-format.md.
 * House style: docs/03-authoring-style.md.
 *
 * Example 1 is printed with its working, so it only gets a graphic.
 */

import { m, t, h, L, lk } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;

/** Tax-bracket row: portion · rate · tax (one revealable line). */
const R = (who, amt, rate, tax) =>
  m(`\\text{${who} }\\$${amt}\\ ${rate}\\quad ${tax}`);

export const SOLUTIONS = [
  { id: "ex1", printed: true, ctlAt: [520, 336], boxes: [] },

  {
    id: "p1",
    links: [
      { key: "inc", color: "blue", note: "annual income $= \\$290\\ 000$", q: ["$290 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$180\\ 000$", q: ["$180 000"] },
      { key: "net", color: "green", note: "net $= \\$110\\ 000$", q: ["Find the salaries tax he should pay"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Net chargeable income} = \\$(${L("inc", "290\\ 000")} - ${L("all", "180\\ 000")})`),
        m(`= ${L("net", "\\$110\\ 000")}`),
        m("= \\$(50\\ 000 + 50\\ 000 + 10\\ 000)"),
        R("On the first", "50\\ 000", "2\\%", "\\$1000"),
        R("On the next", "50\\ 000", "6\\%", "\\$3000"),
        R("On the next", "10\\ 000", "10\\%", "\\$1000"),
        t("$\\therefore$ Anthony's salaries tax payable"),
        m("= \\$(1000 + 3000 + 1000)"),
        m(`= ${U("\\$5000")}`),
      ],
    }],
  },

  {
    id: "q1",
    links: [
      { key: "net", color: "blue", note: "net $= \\$40\\ 000$", q: ["$40 000"] },
      { key: "tax", color: "purple", note: "tax at 2%", q: ["Find his salaries tax payable"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{On the first }${L("net", "\\$40\\ 000")}\\ 2\\%\\quad ${L("tax", "\\$800")}`),
        t("$\\therefore$ Mark's salaries tax payable"),
        m(`= ${U("\\$800")}`),
      ],
    }],
  },

  {
    id: "q2",
    links: [
      { key: "net", color: "blue", note: "net $= \\$120\\ 000$", q: ["$120 000"] },
      { key: "tax", color: "purple", note: "sum the bracket taxes", q: ["Find his salaries tax payable"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Net chargeable income} = ${L("net", "\\$120\\ 000")}`),
        m("= \\$(50\\ 000 + 50\\ 000 + 20\\ 000)"),
        R("On the first", "50\\ 000", "2\\%", "\\$1000"),
        R("On the next", "50\\ 000", "6\\%", "\\$3000"),
        R("On the next", "20\\ 000", "10\\%", "\\$2000"),
        t("$\\therefore$ Leon's salaries tax payable"),
        m(`= ${L("tax", "\\$(1000 + 3000 + 2000)")}`),
        m(`= ${U("\\$6000")}`),
      ],
    }],
  },

  {
    id: "q3",
    links: [
      { key: "inc", color: "blue", note: "annual income $= \\$350\\ 000$", q: ["$350 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$192\\ 000$", q: ["$192 000"] },
      { key: "net", color: "green", note: "net $= \\$158\\ 000$", q: ["how much salaries tax should he pay"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Net chargeable income} = \\$(${L("inc", "350\\ 000")} - ${L("all", "192\\ 000")})`),
        m(`= ${L("net", "\\$158\\ 000")}`),
        m("= \\$(50\\ 000 + 50\\ 000 + 50\\ 000 + 8\\ 000)"),
        R("On the first", "50\\ 000", "2\\%", "\\$1000"),
        R("On the next", "50\\ 000", "6\\%", "\\$3000"),
        R("On the next", "50\\ 000", "10\\%", "\\$5000"),
        R("On the next", "8\\ 000", "14\\%", "\\$1120"),
        t("$\\therefore$ Chris's salaries tax payable"),
        m("= \\$(1000 + 3000 + 5000 + 1120)"),
        m(`= ${U("\\$10\\ 120")}`),
      ],
    }],
  },

  {
    id: "q4",
    links: [
      { key: "inc", color: "blue", note: "annual income $= \\$240\\ 000$", q: ["$240 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$250\\ 000$", q: ["$250 000"] },
      { key: "tax", color: "purple", note: "allowance $>$ income → tax $= 0$", q: ["Find the salaries tax he should pay"] },
    ],
    boxes: [{
      steps: [
        m(`\\because\\ ${L("all", "\\$250\\ 000")} > ${L("inc", "\\$240\\ 000")}`),
        t(`$\\therefore$ Jimmy's salaries tax payable $= ${L("tax", U("\\$0"))}$.`),
      ],
    }],
  },

  {
    id: "q5",
    links: [
      { key: "m", color: "blue", note: "monthly $= \\$19\\ 000$", q: ["$19 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$230\\ 000$", q: ["$230 000"] },
      { key: "claim", color: "amber", note: "annual $<$ allowance → no tax", q: ["He claims that he does not have to pay salaries tax"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Gordon's annual income} = \\$${L("m", "19\\ 000")} \\times 12`),
        m("= \\$228\\ 000"),
        m(`{} < ${L("all", "\\$230\\ 000")}`),
        lk("claim", t("$\\therefore$ Gordon's claim is agreed.")),
      ],
    }],
  },

  {
    id: "q6",
    links: [
      { key: "m", color: "blue", note: "monthly $= \\$17\\ 400$", q: ["$17 400"] },
      { key: "all", color: "pink", note: "allowance $= \\$142\\ 000$", q: ["$142 000"] },
      { key: "net", color: "green", note: "net $= \\$66\\ 800$", q: ["Find the salaries tax she should pay"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Net chargeable income} = \\$(${L("m", "17\\ 400")} \\times 12 - ${L("all", "142\\ 000")})`),
        m(`= ${L("net", "\\$66\\ 800")}`),
        m("= \\$(50\\ 000 + 16\\ 800)"),
        R("On the first", "50\\ 000", "2\\%", "\\$1000"),
        R("On the next", "16\\ 800", "6\\%", "\\$1008"),
        t("$\\therefore$ Wendy's salaries tax payable"),
        m("= \\$(1000 + 1008)"),
        m(`= ${U("\\$2008")}`),
      ],
    }],
  },

  {
    id: "q7",
    links: [
      { key: "m", color: "blue", note: "monthly $= \\$49\\ 000$", q: ["$49 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$195\\ 000$", q: ["$195 000"] },
      { key: "net", color: "green", note: "net $= \\$393\\ 000$", q: ["Find the salaries tax she should pay"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Net chargeable income} = \\$(${L("m", "49\\ 000")} \\times 12 - ${L("all", "195\\ 000")})`),
        m(`= ${L("net", "\\$393\\ 000")}`),
        m("= \\$(50\\ 000 + 50\\ 000 + 50\\ 000 + 50\\ 000 + 193\\ 000)"),
        R("On the first", "50\\ 000", "2\\%", "\\$1000"),
        R("On the next", "50\\ 000", "6\\%", "\\$3000"),
        R("On the next", "50\\ 000", "10\\%", "\\$5000"),
        R("On the next", "50\\ 000", "14\\%", "\\$7000"),
        R("Remainder", "193\\ 000", "17\\%", "\\$32\\ 810"),
        t("$\\therefore$ Tiffany's salaries tax payable"),
        m("= \\$(1000 + 3000 + 5000 + 7000 + 32\\ 810)"),
        m(`= ${U("\\$48\\ 810")}`),
      ],
    }],
  },

  {
    id: "q8",
    links: [
      { key: "m", color: "blue", note: "monthly $= \\$29\\ 000$", q: ["$29 000"] },
      { key: "all", color: "pink", note: "allowance $= \\$173\\ 000$", q: ["$173 000"] },
      { key: "dep", color: "green", note: "deposit $= \\$240\\ 000$", q: ["deposited $240 000"] },
      { key: "r", color: "amber", note: "5% compounded quarterly", q: ["5% compounded quarterly"] },
      { key: "cmp", color: "purple", note: "interest $<$ tax", q: ["the interest received enough to pay the salaries tax found in (a)"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Net chargeable income} = \\$(${L("m", "29\\ 000")} \\times 12 - ${L("all", "173\\ 000")})`),
          m("= \\$175\\ 000"),
          m("= \\$(50\\ 000 + 50\\ 000 + 50\\ 000 + 25\\ 000)"),
          R("On the first", "50\\ 000", "2\\%", "\\$1000"),
          R("On the next", "50\\ 000", "6\\%", "\\$3000"),
          R("On the next", "50\\ 000", "10\\%", "\\$5000"),
          R("On the next", "25\\ 000", "14\\%", "\\$3500"),
          t("$\\therefore$ Sarah's salaries tax payable"),
          m("= \\$(1000 + 3000 + 5000 + 3500)"),
          m(`= ${U("\\$12\\ 500")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Interest received} = \\$${L("dep", "240\\ 000")} \\times \\!\\left[\\!\\left(1 + \\dfrac{${L("r", "5\\%")}}{4}\\right)^{1 \\times 4} - 1\\right]`),
          m("= \\$240\\ 000 \\times [(1 + 1.25\\%)^4 - 1]"),
          m("\\approx \\$12\\ 226.88"),
          m(L("cmp", "{} < \\$12\\ 500")),
          t("$\\therefore$ The interest received is not enough to pay the salaries tax found in (a)."),
        ],
      },
    ],
  },

  {
    id: "q9",
    links: [
      { key: "m", color: "blue", note: "monthly $= \\$75\\ 500$", q: ["$75 500"] },
      { key: "all", color: "pink", note: "allowance $= \\$155\\ 000$", q: ["$155 000"] },
      { key: "r", color: "amber", note: "11.5% compounded monthly", q: ["11.5% compounded monthly"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["At least how much should she deposit"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Net chargeable income} = \\$(${L("m", "75\\ 500")} \\times 12 - ${L("all", "155\\ 000")})`),
          m("= \\$751\\ 000"),
          m("= \\$(50\\ 000 + 50\\ 000 + 50\\ 000 + 50\\ 000 + 551\\ 000)"),
          R("On the first", "50\\ 000", "2\\%", "\\$1000"),
          R("On the next", "50\\ 000", "6\\%", "\\$3000"),
          R("On the next", "50\\ 000", "10\\%", "\\$5000"),
          R("On the next", "50\\ 000", "14\\%", "\\$7000"),
          R("Remainder", "551\\ 000", "17\\%", "\\$93\\ 670"),
          t("$\\therefore$ Vicky's salaries tax payable"),
          m("= \\$(1000 + 3000 + 5000 + 7000 + 93\\ 670)"),
          m(`= ${U("\\$109\\ 670")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let \\$[[p|$P$ be the principal which Vicky deposited]]."),
          m(`${L("p", "P")} \\times \\!\\left(1 + \\dfrac{${L("r", "11.5\\%")}}{12}\\right)^{1 \\times 12} = 109\\ 670`),
          m("P = \\dfrac{109\\ 670}{\\left(1 + \\dfrac{11.5\\%}{12}\\right)^{1 \\times 12}}"),
          m("= 97\\ 810\\text{ (cor. to the nearest integer)}"),
          t("$\\therefore$ Vicky should deposit at least \\$97 810."),
        ],
      },
    ],
  },

  {
    id: "q10",
    links: [
      { key: "jm", color: "blue", note: "Joseph monthly $= \\$18\\ 000$", q: ["$18 000"] },
      { key: "ja", color: "pink", note: "Joseph allowance $= \\$150\\ 000$", q: ["$150 000"] },
      { key: "mi", color: "green", note: "+5% → $\\times(1 + 5\\%)$", q: ["5% higher than that of Joseph"] },
      { key: "ma", color: "amber", note: "−7% → $\\times(1 - 7\\%)$", q: ["7% lower than that of Joseph"] },
      { key: "pc", color: "purple", note: "excess ÷ Joseph's tax", q: ["By what percentage does Matthew's salaries tax exceed that of Joseph"] },
    ],
    boxes: [
      {
        steps: [
          t("For Joseph,"),
          m(`\\text{net chargeable income} = \\$(${L("jm", "18\\ 000")} \\times 12 - ${L("ja", "150\\ 000")})`),
          m("= \\$66\\ 000"),
          m("= \\$(50\\ 000 + 16\\ 000)"),
          R("On the first", "50\\ 000", "2\\%", "\\$1000"),
          R("On the next", "16\\ 000", "6\\%", "\\$960"),
          t("$\\therefore$ Joseph's salaries tax payable"),
          m("= \\$(1000 + 960)"),
          m("= \\$1960"),
        ],
      },
      {
        steps: [
          t("For Matthew,"),
          m(`\\text{net chargeable income} = \\$[18\\ 000 \\times ${L("mi", "(1 + 5\\%)")} \\times 12 - 150\\ 000 \\times ${L("ma", "(1 - 7\\%)")}]`),
          m("= \\$87\\ 300"),
          m("= \\$(50\\ 000 + 37\\ 300)"),
          R("On the first", "50\\ 000", "2\\%", "\\$1000"),
          R("On the next", "37\\ 300", "6\\%", "\\$2238"),
          t("$\\therefore$ Matthew's salaries tax payable"),
          m("= \\$(1000 + 2238)"),
          m("= \\$3238"),
          t("$\\therefore$ The required percentage"),
          m(`${L("pc", "{} = \\dfrac{\\$(3238 - 1960)}{\\$1960} \\times 100\\%")}`),
          m(`= ${U("65\\%")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },

  {
    id: "q11",
    links: [
      { key: "diff", color: "blue", note: "Joyce $= $ Peter $+ \\$18\\ 000$", q: ["$18 000 more than Peter's"] },
      { key: "td", color: "pink", note: "tax difference $= \\$1760$", q: ["$1 760 more than Peter's"] },
      { key: "rng", color: "amber", note: "$100\\ 000 < x < 118\\ 000$", q: ["greater than $100 000 but less than $118 000"] },
      { key: "x", color: "purple", note: "Joyce's net $= \\$x$", q: ["Find Joyce's net chargeable income"] },
    ],
    boxes: [
      {
        steps: [
          t(`Let \\$${L("x", "x")} be Joyce's net chargeable income.`),
          m(`\\text{Then, Peter's net chargeable income} = \\$(${L("x", "x")} - ${L("diff", "18\\ 000")})`),
          t("$\\therefore$ Peter's net chargeable income is greater than \\$82 000 (i.e. \\$100 000 − \\$18 000) and less than \\$100 000 (i.e. \\$118 000 − \\$18 000)."),
          t("Peter's salaries tax payable"),
          m("= \\$[50\\ 000 \\times 2\\% + (x - 18\\ 000 - 50\\ 000) \\times 6\\%]"),
          m("= \\$(1000 + 0.06x - 4080)"),
          m("= \\$(0.06x - 3080)"),
        ],
      },
      {
        steps: [
          t("Joyce's salaries tax payable"),
          m("= \\$[50\\ 000 \\times 2\\% + 50\\ 000 \\times 6\\% + (x - 2 \\times 50\\ 000) \\times 10\\%]"),
          m("= \\$(1000 + 3000 + 0.1x - 10\\ 000)"),
          m("= \\$(0.1x - 6000)"),
          m(`\\therefore\\ (0.1x - 6000) - (0.06x - 3080) = ${L("td", "1760")}`),
          m("0.04x - 2920 = 1760"),
          m("0.04x = 4680"),
          m(`x = ${L("rng", "117\\ 000")}`),
          t(`$\\therefore$ [[x|Joyce's net chargeable income is \\$117 000]].`),
        ],
      },
    ],
  },
];
