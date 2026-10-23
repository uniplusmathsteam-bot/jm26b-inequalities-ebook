/**
 * Worked solutions laid out like the JM27 (B) answer key. Field reference:
 * docs/02-book-format.md. House style: docs/03-authoring-style.md.
 *
 * Examples 1–4 are printed with their working, so they only get a graphic.
 */

import { m, t, h, L, lk } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;

export const SOLUTIONS = [
  { id: "ex1", printed: true, ctlAt: [520, 556], boxes: [] },
  {
    id: "p1",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$8400$", q: ["$8400 in a bank"] },
      { key: "r", color: "pink", note: "rate $= 2.5\\%$ p.a.", q: ["2.5% p.a."] },
      { key: "t", color: "green", note: "time $= 5$ years", q: ["after 5 years"] },
      { key: "a", color: "purple", note: "$A = P(1 + r\\% \\times t)$", q: ["Find the amount she"] },
    ],
    boxes: [{
      steps: [
        m(`${L("a", "\\text{Amount}")} = \\$${L("p", "8400")} \\times (1 + ${L("r", "2.5\\%")} \\times ${L("t", "5")})`),
        m("= \\$8400 \\times 1.125"),
        m(`= ${U("\\$9450")}`),
      ],
    }],
  },
  { id: "ex2", printed: true, ctlAt: [520, 125], boxes: [] },
  {
    id: "p2",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$3000$", q: ["$3000 is deposited"] },
      { key: "r", color: "pink", note: "rate $= 7\\%$ p.a.", q: ["7% p.a."] },
      { key: "t", color: "green", note: "time $= 6$ years", q: ["for 6 years"] },
      { key: "i", color: "amber", note: "$I = P \\times r\\% \\times t$", q: ["Find the simple interest"] },
      { key: "a", color: "purple", note: "$A = P + I$", q: ["the amount received"] },
    ],
    boxes: [{
      steps: [
        m(`${L("i", "\\text{Simple interest}")} = \\$${L("p", "3000")} \\times ${L("r", "7\\%")} \\times ${L("t", "6")}`),
        m(`= ${U("\\$1260")}`),
        m(`${L("a", "\\text{Amount}")} = \\$(3000 + 1260)`),
        m(`= ${U("\\$4260")}`),
      ],
    }],
  },
  {
    id: "q1",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$20\\ 000$", q: ["$20 000 is deposited"] },
      { key: "r", color: "pink", note: "rate $= 4\\%$ p.a.", q: ["4% p.a."] },
      { key: "t", color: "green", note: "$9$ months $= \\dfrac{3}{4}$ year", q: ["for 9 months"] },
      { key: "i", color: "amber", note: "$I = P \\times r\\% \\times t$", q: ["Find the simple interest"] },
      { key: "a", color: "purple", note: "$A = P + I$", q: ["the amount received"] },
    ],
    boxes: [{
      steps: [
        m(`${L("t", "9\\text{ months}")} = \\dfrac{9}{12}\\text{ year} = \\dfrac{3}{4}\\text{ year}`),
        m(`${L("i", "\\text{Simple interest}")} = \\$${L("p", "20\\ 000")} \\times ${L("r", "4\\%")} \\times \\dfrac{3}{4}`),
        m(`= ${U("\\$600")}`),
        m(`${L("a", "\\text{Amount}")} = \\$(20\\ 000 + 600)`),
        m(`= ${U("\\$20\\ 600")}`),
      ],
    }],
  },
  {
    id: "q2",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$35\\ 000$", q: ["$35 000 is deposited"] },
      { key: "r", color: "pink", note: "rate $= 3\\%$ p.a.", q: ["3% p.a."] },
      { key: "t", color: "green", note: "$28$ months $= \\dfrac{7}{3}$ years", q: ["for 28 months"] },
      { key: "i", color: "amber", note: "$I = P \\times r\\% \\times t$", q: ["Find the simple interest"] },
      { key: "a", color: "purple", note: "$A = P + I$", q: ["the amount received"] },
    ],
    boxes: [{
      steps: [
        m(`${L("t", "28\\text{ months}")} = \\dfrac{28}{12}\\text{ years} = \\dfrac{7}{3}\\text{ years}`),
        m(`${L("i", "\\text{Simple interest}")} = \\$${L("p", "35\\ 000")} \\times ${L("r", "3\\%")} \\times \\dfrac{7}{3}`),
        m(`= ${U("\\$2450")}`),
        m(`${L("a", "\\text{Amount}")} = \\$(35\\ 000 + 2450)`),
        m(`= ${U("\\$37\\ 450")}`),
      ],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "a", color: "blue", note: "amount $= \\$59\\ 200$", q: ["an amount of $59 200"] },
      { key: "r", color: "pink", note: "rate $= 12\\%$ p.a.", q: ["12% p.a."] },
      { key: "t", color: "green", note: "time $= 4$ years", q: ["After 4 years"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["Find the principal that Jennifer borrowed"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal that Jennifer borrowed]]."),
        m(`${L("a", "59\\ 200")} = P \\times (1 + ${L("r", "12\\%")} \\times ${L("t", "4")})`),
        m("59\\ 200 = 1.48P"),
        m("P = 40\\ 000"),
        t("$\\therefore$ The principal that Jennifer borrowed was \\$40 000."),
      ],
    }],
  },
  {
    id: "q4",
    links: [
      { key: "a", color: "blue", note: "amount $= \\$44\\ 100$", q: ["an amount of $44 100"] },
      { key: "r", color: "pink", note: "rate $= 9\\%$ p.a.", q: ["9% p.a."] },
      { key: "t", color: "green", note: "$30$ months $= \\dfrac{30}{12}$ years", q: ["After 30 months"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["Find the principal that Ellen deposited"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal that Ellen deposited]]."),
        m(`${L("a", "44\\ 100")} = P \\times \\left(1 + ${L("r", "9\\%")} \\times ${L("t", "\\dfrac{30}{12}")}\\right)`),
        m("44\\ 100 = 1.225P"),
        m("P = 36\\ 000"),
        t("$\\therefore$ The principal that Ellen deposited was \\$36 000."),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$32\\ 000$", q: ["borrowed $32 000"] },
      { key: "a", color: "green", note: "amount $= \\$42\\ 240$", q: ["an amount of $42 240"] },
      { key: "r", color: "pink", note: "rate $= 8\\%$ p.a.", q: ["8% p.a."] },
      { key: "i", color: "amber", note: "$I = A - P$", q: ["Find the simple interest paid by Benson"] },
      { key: "t", color: "purple", note: "unknown time $t$", q: ["For how long was the money borrowed"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        m(`${L("i", "\\text{Simple interest}")} = \\$(${L("a", "42\\ 240")} - ${L("p", "32\\ 000")})`),
        m(`= ${U("\\$10\\ 240")}`),
        h("(b)"),
        t("Suppose the money was borrowed for [[t|$t$ years]]."),
        m(`10\\ 240 = 32\\ 000 \\times ${L("r", "8\\%")} \\times t`),
        m("10\\ 240 = 2560t"),
        m("t = 4"),
        t("$\\therefore$ The money was borrowed for 4 years."),
      ],
    }],
  },
  {
    id: "q6",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$7000$", q: ["deposits $7000"] },
      { key: "r", color: "pink", note: "rate $= 3.5\\%$ p.a.", q: ["3.5% p.a."] },
      { key: "a", color: "green", note: "amount $= \\$8960$", q: ["an amount of $8960"] },
      { key: "t", color: "purple", note: "unknown time $t$", q: ["How long will it take"] },
    ],
    boxes: [{
      steps: [
        t("Let [[t|$t$ years be the required deposit period]]."),
        m(`${L("a", "8960")} = ${L("p", "7000")} \\times (1 + ${L("r", "3.5\\%")} \\times t)`),
        m("1.28 = 1 + 3.5\\% \\times t"),
        m("0.28 = 0.035t"),
        m("t = 8"),
        t("$\\therefore$ The required deposit period is 8 years."),
      ],
    }],
  },
  {
    id: "q7",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$11\\ 000$", q: ["deposits $11 000"] },
      { key: "i", color: "green", note: "interest $= \\$3080$", q: ["a simple interest of $3080"] },
      { key: "t", color: "amber", note: "time $= 7$ years", q: ["after 7 years"] },
      { key: "r", color: "purple", note: "unknown rate $r\\%$", q: ["What is the annual interest rate"] },
    ],
    boxes: [{
      steps: [
        t("Let [[r|$r\\%$ be the annual interest rate]]."),
        m(`${L("i", "3080")} = ${L("p", "11\\ 000")} \\times r\\% \\times ${L("t", "7")}`),
        m("r\\% = 0.04"),
        m("r = 4"),
        t("$\\therefore$ The annual interest rate is $4\\%$."),
      ],
    }],
  },
  {
    id: "q8",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$35\\ 000$", q: ["borrowed $35 000"] },
      { key: "a", color: "green", note: "amount $= \\$39\\ 900$", q: ["an amount of $39"] },
      { key: "t", color: "amber", note: "time $= 4$ years", q: ["4 years later"] },
      { key: "r", color: "purple", note: "unknown rate $r\\%$", q: ["What was the annual interest rate"] },
    ],
    boxes: [{
      steps: [
        t("Let [[r|$r\\%$ be the annual interest rate]]."),
        m(`${L("a", "39\\ 900")} = ${L("p", "35\\ 000")} \\times (1 + r\\% \\times ${L("t", "4")})`),
        m("1.14 = 1 + r\\% \\times 4"),
        m("r\\% = 0.035"),
        m("r = 3.5"),
        t("$\\therefore$ The annual interest rate was $3.5\\%$."),
      ],
    }],
  },
  {
    id: "q9",
    links: [
      { key: "pa", color: "blue", note: "Bank $A$: $P = \\$60\\ 000$, $r = 8\\%$", q: ["$60 000 from bank A"] },
      { key: "pb", color: "pink", note: "Bank $B$: $P = \\$40\\ 000$, $r = 9\\%$", q: ["$40 000 from bank B"] },
      { key: "t", color: "green", note: "time $= 3$ years", q: ["after 3"] },
      { key: "c", color: "amber", note: "compare with $\\$25\\ 000$", q: ["exceed $25 000"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Simple interest paid to Bank } A = \\$${L("pa", "60\\ 000")} \\times 8\\% \\times ${L("t", "3")}`),
        m("= \\$14\\ 400"),
        m(`\\text{Simple interest paid to Bank } B = \\$${L("pb", "40\\ 000")} \\times 9\\% \\times 3`),
        m("= \\$10\\ 800"),
        t("Total interest paid to the banks"),
        m("= \\$(14\\ 400 + 10\\ 800)"),
        m("= \\$25\\ 200"),
        m(`${L("c", "> \\$25\\ 000")}`),
        t("$\\therefore$ The total interest paid to the banks by Tim will exceed \\$25 000 after 3 years."),
      ],
    }],
  },
  {
    id: "q10",
    links: [
      { key: "pr", color: "blue", note: "Ray: $\\$7200$ at $6.5\\%$", q: ["loan of $7200"] },
      { key: "pt", color: "pink", note: "Tim: $\\$7500$ at $6\\%$", q: ["$7500 at a simple interest rate of 6% p.a."] },
      { key: "tm", color: "green", note: "$8$ months $= \\dfrac{8}{12}$ year", q: ["for 8 months"] },
      { key: "d", color: "purple", note: "difference asked", q: ["By how much"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\text{Simple interest paid by Ray} = \\$${L("pr", "7200")} \\times 6.5\\% \\times ${L("tm", "\\dfrac{8}{12}")}`),
          m("= \\$312"),
          m(`\\text{Simple interest paid by Tim} = \\$${L("pt", "7500")} \\times 6\\% \\times \\dfrac{8}{12}`),
          m("= \\$300"),
          m("\\therefore\\ \\$312 > \\$300"),
          t("$\\therefore$ Ray will pay more interest."),
        ],
      },
      {
        steps: [
          t("Difference between the interests paid by Ray and Tim"),
          m(`= ${L("d", "\\$(312 - 300)")}`),
          m("= \\$12"),
          t("$\\therefore$ Ray will pay \\$12 more."),
        ],
      },
    ],
  },
  {
    id: "q11",
    links: [
      { key: "r1", color: "pink", note: "original rate $= 2\\%$", q: ["2% p.a."] },
      { key: "r2", color: "green", note: "new rate $= 5\\%$", q: ["increased to 5% p.a."] },
      { key: "t", color: "amber", note: "time $= 5$ years", q: ["for 5 years"] },
      { key: "d", color: "blue", note: "extra interest $= \\$1650$", q: ["$1650 more"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["Find the principal"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal that Simon deposits]]."),
        m(`${L("d", "1650")} = P \\times (${L("r2", "5\\%")} - ${L("r1", "2\\%")}) \\times ${L("t", "5")}`),
        m("1650 = 0.15P"),
        m("P = 11\\ 000"),
        t("$\\therefore$ The principal that Simon deposits is \\$11 000."),
      ],
    }],
  },
  {
    id: "q12",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$30\\ 000$", q: ["borrows $30 000"] },
      { key: "t", color: "amber", note: "time $= 3$ years", q: ["After 3 years"] },
      { key: "d", color: "green", note: "extra interest $= \\$6300$", q: ["$6300 more"] },
      { key: "r", color: "purple", note: "unknown original rate $r\\%$", q: ["original annual interest rate"] },
    ],
    boxes: [{
      steps: [
        t("Let [[r|$r\\%$ be the original annual interest rate]]."),
        m(`${L("p", "30\\ 000")} \\times (3r\\% - r\\%) \\times ${L("t", "3")} = ${L("d", "6300")}`),
        m("90\\ 000 \\times 2r\\% = 6300"),
        m("r\\% = 0.035"),
        m("r = 3.5"),
        t("$\\therefore$ The original annual interest rate is $3.5\\%$."),
      ],
    }],
  },
  {
    id: "q13",
    links: [
      { key: "t", color: "amber", note: "time $= 20$ years", q: ["for 20 years"] },
      { key: "i", color: "green", note: "interest $= 3P$", q: ["triple the principal"] },
      { key: "r", color: "purple", note: "unknown rate $r\\%$", q: ["what is the annual interest rate"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$$P$ be the principal and [[r|$r\\%$ be the annual interest rate]]."),
        m(`P \\times r\\% \\times ${L("t", "20")} = ${L("i", "3P")}`),
        m("r\\% \\times 20 = 3"),
        m("r\\% = 0.15"),
        m("r = 15"),
        t("$\\therefore$ The annual interest rate is $15\\%$."),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "r", color: "pink", note: "rate $= 5\\%$ p.a.", q: ["5% p.a."] },
      { key: "a", color: "green", note: "amount $= 2P$", q: ["double the principal"] },
      { key: "t", color: "purple", note: "unknown time $t$", q: ["How many years will it take"] },
    ],
    boxes: [{
      steps: [
        t("Suppose Mrs Tsui invests \\$$P$ for [[t|$t$ years]]."),
        m(`P \\times (1 + ${L("r", "5\\%")} \\times t) = ${L("a", "2P")}`),
        m("1 + 5\\% \\times t = 2"),
        m("5\\% \\times t = 1"),
        m("0.05t = 1"),
        m("t = 20"),
        t("$\\therefore$ It will take 20 years for Mrs Tsui to receive an amount which is double the principal."),
      ],
    }],
  },
  {
    id: "q15",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$30\\ 000$", q: ["deposits $30 000"] },
      { key: "rs", color: "pink", note: "Sarah's rate $= 3\\%$", q: ["at 3% p.a."] },
      { key: "rj", color: "green", note: "John's rate $= 9.5\\%$", q: ["John at 9.5% p.a."] },
      { key: "t", color: "amber", note: "time $= 5$ years", q: ["After 5 years"] },
      { key: "pr", color: "purple", note: "bank profit $= I_J - I_S$", q: ["the profit made by the bank"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("Simple interest received by Sarah"),
        m(`= \\$${L("p", "30\\ 000")} \\times ${L("rs", "3\\%")} \\times ${L("t", "5")}`),
        m(`= ${U("\\$4500")}`),
        h("(b)"),
        t("Simple interest paid by John"),
        m(`= \\$30\\ 000 \\times ${L("rj", "9.5\\%")} \\times 5`),
        m(`= ${U("\\$14\\ 250")}`),
        h("(c)"),
        t("Profit made by the bank from these two transactions"),
        m(`= ${L("pr", "\\$(14\\ 250 - 4500)")}`),
        m(`= ${U("\\$9750")}`),
      ],
    }],
  },
  {
    id: "q16",
    links: [
      { key: "usd", color: "blue", note: "original $= 44\\ 000$ USD", q: ["44 000 US Dollars"] },
      { key: "fx1", color: "pink", note: "7.7 HKD/USD", q: ["7.7"] },
      { key: "r", color: "green", note: "rate $= 12\\%$ p.a.", q: ["12% p.a."] },
      { key: "t", color: "amber", note: "$9$ months", q: ["After 9 months"] },
      { key: "fx2", color: "purple", note: "1 USD $= 7.63$ HKD", q: ["1 USD = 7.63 HKD"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("Original sum of HKD Clara had"),
        m(`= \\text{HKD } ${L("fx1", "7.7")} \\times ${L("usd", "44\\ 000")}`),
        m(`= ${U("\\text{HKD } 338\\ 800")}`),
        h("(b)"),
        t("(i) Amount that Clara received in HKD after 9 months"),
        m(`= \\text{HKD } 338\\ 800 \\times \\left(1 + ${L("r", "12\\%")} \\times ${L("t", "\\dfrac{9}{12}")}\\right)`),
        m(`= ${U("\\text{HKD } 369\\ 292")}`),
        t("(ii) Exchange rate in USD/HKD $= \\dfrac{1}{7.63}$ USD/HKD"),
        t("Amount that Clara received in USD after 9 months"),
        m(`= \\text{USD } \\dfrac{1}{${L("fx2", "7.63")}} \\times 369\\ 292`),
        m(`= ${U("\\text{USD } 48\\ 400")}`),
        h("(c)"),
        t("Profit per cent that Clara made"),
        m("= \\dfrac{48\\ 400 - 44\\ 000}{44\\ 000} \\times 100\\%"),
        m(`= ${U("10\\%")}`),
      ],
    }],
  },
  {
    id: "q17",
    links: [
      { key: "tot", color: "blue", note: "total $= \\$200\\ 000$", q: ["$200 000 in banks"] },
      { key: "ra", color: "pink", note: "Bank $A$: $3.5\\%$", q: ["3.5%"] },
      { key: "rb", color: "green", note: "Bank $B$: $4.5\\%$", q: ["4.5%"] },
      { key: "t", color: "amber", note: "time $= 2$ years", q: ["After 2 years"] },
      { key: "x", color: "purple", note: "deposit in Bank $A$ $= x$", q: ["how much does he deposit in Bank A"] },
    ],
    boxes: [{
      steps: [
        t("Suppose Mr Wong deposits \\$[[x|$x$]] in Bank $A$, then he deposits $\\$(200\\ 000 - x)$ in Bank $B$."),
        m(`${L("x", "x")} \\times ${L("ra", "3.5\\%")} \\times ${L("t", "2")} = (${L("tot", "200\\ 000")} - x) \\times ${L("rb", "4.5\\%")} \\times 2`),
        m("0.035x = 9000 - 0.045x"),
        m("0.08x = 9000"),
        m("x = 112\\ 500"),
        t("$\\therefore$ Mr Wong deposits \\$112 500 in Bank $A$, and"),
        t("he deposits $\\$(200\\ 000 - 112\\ 500) = \\$87\\ 500$ in Bank $B$."),
      ],
    }],
  },
  { id: "ex3", printed: true, ctlAt: [520, 725], boxes: [] },
  {
    id: "p3",
    links: [
      { key: "n", color: "amber", note: "compounded quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "a", color: "blue", note: "(a) $P = \\$60\\ 000$, $r = 8\\%$, $t = 0.5$", q: ["$60 000"] },
      { key: "b", color: "pink", note: "(b) $P = \\$1800$, $r = 6\\%$, $t = 1$", q: ["$1800"] },
      { key: "c", color: "green", note: "(c) $P = \\$47\\ 000$, $r = 12\\%$, $t = 2.5$", q: ["$47 000"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("a", "\\text{Amount}")} = \\$60\\ 000 \\times \\left(1 + \\dfrac{8\\%}{${L("n", "4")}}\\right)^{0.5 \\times 4}`),
          m(`= ${U("\\$62\\ 424")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("b", "\\text{Amount}")} = \\$1800 \\times \\left(1 + \\dfrac{6\\%}{4}\\right)^{1 \\times 4}`),
          m(`= ${U("\\$1910")}\\text{ (cor. to the nearest integer)}`),
          h("(c)"),
          m(`${L("c", "\\text{Amount}")} = \\$47\\ 000 \\times \\left(1 + \\dfrac{12\\%}{4}\\right)^{2.5 \\times 4}`),
          m(`= ${U("\\$63\\ 164")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  { id: "ex4", printed: true, ctlAt: [520, 415], boxes: [] },
  {
    id: "p4",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$14\\ 000$", q: ["borrows $14 000"] },
      { key: "r", color: "pink", note: "rate $= 6\\%$ p.a.", q: ["6% p.a."] },
      { key: "t", color: "green", note: "time $= 3.5$ years", q: ["3.5"] },
      { key: "q", color: "amber", note: "quarterly → $n = 4$", q: ["quarterly"] },
      { key: "m", color: "purple", note: "monthly → $n = 12$", q: ["monthly"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Compound interest"),
          m(`= \\$${L("p", "14\\ 000")} \\times \\left[\\left(1 + \\dfrac{${L("r", "6\\%")}}{${L("q", "4")}}\\right)^{${L("t", "3.5")} \\times 4} - 1\\right]`),
          m("= \\$14\\ 000 \\times [(1 + 1.5\\%)^{14} - 1]"),
          m(`= ${U("\\$3245")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Compound interest"),
          m(`= \\$14\\ 000 \\times \\left[\\left(1 + \\dfrac{6\\%}{${L("m", "12")}}\\right)^{3.5 \\times 12} - 1\\right]`),
          m("= \\$14\\ 000 \\times [(1 + 0.5\\%)^{42} - 1]"),
          m(`= ${U("\\$3262")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q18",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$12\\ 250$", q: ["deposits $12 250"] },
      { key: "r", color: "pink", note: "rate $= 6\\%$ p.a.", q: ["6% p.a."] },
      { key: "t", color: "green", note: "time $= 1$ year", q: ["for 1 year"] },
      { key: "h", color: "amber", note: "half-yearly → $n = 2$", q: ["half-yearly"] },
      { key: "m", color: "purple", note: "monthly → $n = 12$", q: ["monthly"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Number of half-year periods in 1 year $= 2$"),
          m(`\\text{Interest rate per half year} = \\dfrac{${L("r", "6\\%")}}{${L("h", "2")}}`),
          m("= 3\\%"),
          m(`\\text{Amount} = \\$${L("p", "12\\ 250")} \\times (1 + 3\\%)^{${L("t", "2")}}`),
          m(`= ${U("\\$12\\ 996")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Number of months in 1 year $= 12$"),
          m(`\\text{Interest rate per month} = \\dfrac{6\\%}{${L("m", "12")}}`),
          m("= 0.5\\%"),
          m("\\text{Amount} = \\$12\\ 250 \\times (1 + 0.5\\%)^{12}"),
          m(`= ${U("\\$13\\ 006")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q19",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$36\\ 000$", q: ["borrowed $36 000"] },
      { key: "r", color: "pink", note: "rate $= 14\\%$ p.a.", q: ["14% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "t", color: "green", note: "$9$ months $= 3$ quarters", q: ["after 9 months"] },
    ],
    boxes: [{
      steps: [
        t(`Number of quarters in 9 months $= ${L("t", "3")}`),
        m(`\\text{Interest rate per quarter} = \\dfrac{${L("r", "14\\%")}}{${L("n", "4")}}`),
        m("= 3.5\\%"),
        m(`\\text{Amount} = \\$${L("p", "36\\ 000")} \\times (1 + 3.5\\%)^3`),
        m(`= ${U("\\$39\\ 914")}\\text{ (cor. to the nearest integer)}`),
      ],
    }],
  },
  {
    id: "q20",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$90\\ 000$", q: ["deposits $90 000"] },
      { key: "r", color: "pink", note: "rate $= 3\\%$ p.a.", q: ["3% p.a."] },
      { key: "t", color: "green", note: "time $= 4$ years", q: ["after 4 years"] },
      { key: "i", color: "purple", note: "$I = P[(1 + r\\%)^t - 1]$", q: ["Find the compound interest"] },
    ],
    boxes: [{
      steps: [
        m(`${L("i", "\\text{Compound interest}")} = \\$${L("p", "90\\ 000")} \\times [(1 + ${L("r", "3\\%")})^{${L("t", "4")}} - 1]`),
        m(`= ${U("\\$11\\ 296")}\\text{ (cor. to the nearest integer)}`),
      ],
    }],
  },
  {
    id: "q21",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$75\\ 000$", q: ["$75 000 is borrowed"] },
      { key: "r", color: "pink", note: "rate $= 8\\%$ p.a.", q: ["8% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "t1", color: "green", note: "$27$ months $= 9$ quarters", q: ["27 months"] },
      { key: "t2", color: "purple", note: "$2.5$ years $= 10$ quarters", q: ["2.5 years"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Compound interest"),
          m(`= \\$${L("p", "75\\ 000")} \\times \\left[\\left(1 + \\dfrac{${L("r", "8\\%")}}{${L("n", "4")}}\\right)^{${L("t1", "27")} \\div 3} - 1\\right]`),
          m("= \\$75\\ 000 \\times [(1 + 2\\%)^9 - 1]"),
          m(`= ${U("\\$14\\ 632")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Compound interest"),
          m(`= \\$75\\ 000 \\times \\left[\\left(1 + \\dfrac{8\\%}{4}\\right)^{${L("t2", "2.5")} \\times 4} - 1\\right]`),
          m("= \\$75\\ 000 \\times [(1 + 2\\%)^{10} - 1]"),
          m(`= ${U("\\$16\\ 425")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "a", color: "green", note: "amount $= \\$46\\ 925$", q: ["$46 925"] },
      { key: "r", color: "pink", note: "rate $= 4\\%$ p.a.", q: ["4% p.a."] },
      { key: "n", color: "amber", note: "half-yearly → $n = 2$", q: ["compounded half-yearly"] },
      { key: "t", color: "blue", note: "time $= 6$ years → $12$ periods", q: ["after 6"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["how much is the sum borrowed"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the sum of money which Emily borrowed]]."),
        m(`\\text{Number of half-year periods in 6 years} = ${L("t", "6")} \\times ${L("n", "2")}`),
        m("= 12"),
        m(`\\text{Interest rate per half year} = \\dfrac{${L("r", "4\\%")}}{2}`),
        m("= 2\\%"),
        m(`\\therefore\\ ${L("a", "46\\ 925")} = P \\times (1 + 2\\%)^{12}`),
        m("46\\ 925 = P \\times 1.02^{12}"),
        m("P = \\dfrac{46\\ 925}{1.02^{12}}"),
        m("= 37\\ 000\\text{ (cor. to the nearest integer)}"),
        t("$\\therefore$ Emily borrows \\$37 000."),
      ],
    }],
  },
  {
    id: "q23",
    links: [
      { key: "i", color: "green", note: "interest $= \\$955$", q: ["an interest of $955"] },
      { key: "r", color: "pink", note: "rate $= 12\\%$ p.a.", q: ["12% p.a."] },
      { key: "n", color: "amber", note: "monthly → $n = 12$", q: ["compounded monthly"] },
      { key: "t", color: "blue", note: "time $= 1$ year", q: ["after one year"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["how much does he deposit"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal which Jacky deposits]]."),
        m(`\\text{Number of months in one year} = ${L("t", "1")} \\times ${L("n", "12")}`),
        m("= 12"),
        m(`\\text{Interest rate per month} = \\dfrac{${L("r", "12\\%")}}{12}`),
        m("= 1\\%"),
        m(`\\therefore\\ ${L("i", "955")} = P \\times [(1 + 1\\%)^{12} - 1]`),
        m("955 = P \\times (1.01^{12} - 1)"),
        m("P = \\dfrac{955}{1.01^{12} - 1}"),
        m("= 7530\\text{ (cor. to the nearest integer)}"),
        t("$\\therefore$ Jacky deposits \\$7530."),
      ],
    }],
  },
  {
    id: "q24",
    links: [
      { key: "i", color: "green", note: "interest $= \\$2734$", q: ["an interest of $2734"] },
      { key: "r", color: "pink", note: "rate $= 8\\%$ p.a.", q: ["8% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "t", color: "blue", note: "time $= 2$ years → $8$ quarters", q: ["after 2 years"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["How much is the sum borrowed"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let \\$[[p|$P$ be the sum borrowed]]."),
          m(`\\text{Number of quarters in 2 years} = ${L("t", "2")} \\times ${L("n", "4")}`),
          m("= 8"),
          m(`\\text{Interest rate per quarter} = \\dfrac{${L("r", "8\\%")}}{4}`),
          m("= 2\\%"),
          m(`\\therefore\\ ${L("i", "2734")} = P \\times [(1 + 2\\%)^8 - 1]`),
          m("2734 = P \\times (1.02^8 - 1)"),
          m("P = \\dfrac{2734}{1.02^8 - 1}"),
          m("= 15\\ 927\\text{ (cor. to the nearest integer)}"),
          t("$\\therefore$ The sum borrowed is \\$15 927."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Total amount of money that Carl has to repay"),
          m("= \\$\\left(\\dfrac{2734}{1.02^8 - 1} + 2734\\right)"),
          m(`= ${U("\\$18\\ 661")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q25",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$9000$", q: ["deposit $9000"] },
      { key: "t", color: "amber", note: "time $= 3$ years", q: ["for 3 years"] },
      { key: "a", color: "pink", note: "Bank $A$: $5\\%$ half-yearly", q: ["5% p.a. compounded"] },
      { key: "b", color: "green", note: "Bank $B$: $4.5\\%$ monthly", q: ["4.5% p.a. compounded"] },
    ],
    boxes: [
      {
        steps: [
          t("For Bank $A$,"),
          m(`\\text{number of half-year periods in 3 years} = ${L("t", "3")} \\times 2`),
          m("= 6"),
          m(`\\text{interest rate per half year} = \\dfrac{${L("a", "5\\%")}}{2}`),
          m("= 2.5\\%"),
          m(`\\text{compound interest} = \\$[${L("p", "9000")} \\times (1 + 2.5\\%)^6 - 9000]`),
          m("= \\$1437\\text{ (cor. to the nearest integer)}"),
        ],
      },
      {
        steps: [
          t("For Bank $B$,"),
          m("\\text{number of months in 3 years} = 3 \\times 12"),
          m("= 36"),
          m(`\\text{interest rate per month} = \\dfrac{${L("b", "4.5\\%")}}{12}`),
          m("= 0.375\\%"),
          m("\\text{compound interest} = \\$[9000 \\times (1 + 0.375\\%)^{36} - 9000]"),
          m("= \\$1298\\text{ (cor. to the nearest integer)}"),
          t("$\\because$ Bank $A$ pays more interest compared with Bank $B$."),
          t("$\\therefore$ Sally should deposit the money in Bank $A$ to earn more interest."),
        ],
      },
    ],
  },
  {
    id: "q26",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$25\\ 000$", q: ["$25 000 is deposited"] },
      { key: "t", color: "amber", note: "time $= 2$ years", q: ["for 2 years"] },
      { key: "x", color: "pink", note: "Bank $X$: $4\\%$ half-yearly", q: ["4% p.a. compounded half-yearly"] },
      { key: "y", color: "green", note: "Bank $Y$: $3\\%$ daily", q: ["3% p.a. compounded daily"] },
      { key: "d", color: "purple", note: "difference of interests", q: ["the difference in interest"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("For Bank $X$,"),
          m(`\\text{number of half-year periods in 2 years} = ${L("t", "2")} \\times 2 = 4`),
          m(`\\text{interest rate per half year} = \\dfrac{${L("x", "4\\%")}}{2} = 2\\%`),
          m(`\\text{compound interest} = \\$[${L("p", "25\\ 000")} \\times (1 + 2\\%)^4 - 25\\ 000]`),
          m("= \\$2060.804"),
          t("For Bank $Y$,"),
          m("\\text{number of days in 2 years} = 2 \\times 365 = 730"),
          m(`\\text{interest rate per day} = \\dfrac{${L("y", "3\\%")}}{365}`),
          m("\\text{compound interest} = \\$\\left[25\\ 000 \\times \\left(1 + \\dfrac{3\\%}{365}\\right)^{730} - 25\\ 000\\right]"),
          m("\\approx \\$1545.8482"),
          t("$\\therefore$ Bank $X$ offers more interest."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("The difference in interest"),
          m(`\\approx ${L("d", "\\$(2060.804 - 1545.8482)")}`),
          m(`= ${U("\\$514.96")}\\text{ (cor. to 2 d.p.)}`),
        ],
      },
    ],
  },
  {
    id: "q27",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$5000$", q: ["deposits $5000"] },
      { key: "a", color: "green", note: "amount $= \\$5408$", q: ["an amount of $5408"] },
      { key: "n", color: "amber", note: "half-yearly → $n = 2$", q: ["compounded half-yearly"] },
      { key: "r", color: "purple", note: "unknown rate $r\\%$", q: ["Find the annual interest rate"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let [[r|$r\\%$ be the annual interest rate]]."),
          m(`${L("a", "5408")} = ${L("p", "5000")} \\times \\left(1 + \\dfrac{r\\%}{${L("n", "2")}}\\right)^{1 \\times 2}`),
          m("1.0816 = \\left(1 + \\dfrac{r\\%}{2}\\right)^2"),
          m("1.04 = 1 + \\dfrac{r\\%}{2}"),
          m("\\dfrac{r\\%}{2} = 0.04"),
          m("r\\% = 0.08"),
          m("r = 8"),
          t("$\\therefore$ The annual interest rate is $8\\%$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Total interest that Ray will get"),
          m("= \\$\\left[5408 \\times \\left(1 + \\dfrac{8\\%}{2}\\right)^2 - 5000\\right]"),
          m(`= ${U("\\$849")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q28",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$50\\ 000$", q: ["deposited $50 000"] },
      { key: "a", color: "green", note: "amount $= \\$53\\ 045$", q: ["an amount of $53 045"] },
      { key: "n", color: "amber", note: "half-yearly → $n = 2$", q: ["compounded half-yearly"] },
      { key: "r", color: "purple", note: "unknown rate $r\\%$", q: ["Find the annual interest rate"] },
      { key: "m", color: "pink", note: "monthly comparison", q: ["compounded monthly"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let [[r|$r\\%$ be the annual interest rate]]."),
          m(`${L("a", "53\\ 045")} = ${L("p", "50\\ 000")} \\times \\left(1 + \\dfrac{r\\%}{${L("n", "2")}}\\right)^{1 \\times 2}`),
          m("1.0609 = \\left(1 + \\dfrac{r\\%}{2}\\right)^2"),
          m("1.03 = 1 + \\dfrac{r\\%}{2}"),
          m("\\dfrac{r\\%}{2} = 0.03"),
          m("r\\% = 0.06"),
          m("r = 6"),
          t("$\\therefore$ The annual interest rate was $6\\%$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Interest that Mr Hui received when the interest was compounded half-yearly"),
          m("= \\$(53\\ 045 - 50\\ 000)"),
          m("= \\$3045"),
          t("If the interest was compounded monthly, the interest that Mr Hui could receive"),
          m(`= \\$50\\ 000 \\times \\left[\\left(1 + \\dfrac{6\\%}{${L("m", "12")}}\\right)^{1 \\times 12} - 1\\right]`),
          m("= \\$50\\ 000 \\times (1.005^{12} - 1)"),
          t("additional interest that Mr Hui could receive"),
          m("= \\$[50\\ 000 \\times (1.005^{12} - 1) - 3045]"),
          m(`= ${U("\\$39")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q29",
    links: [
      { key: "rs", color: "pink", note: "simple interest $6\\%$ p.a.", q: ["simple interest at 6% p.a."] },
      { key: "rc", color: "green", note: "compound rate $r\\%$ yearly", q: ["compound interest at"] },
      { key: "t", color: "amber", note: "time $= 2$ years", q: ["After 2 years"] },
      { key: "r", color: "purple", note: "find $r$", q: ["Find the value of r"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$$P$ be the principal that Tim deposited in the two banks."),
        m(`P \\times ${L("rs", "6\\%")} \\times ${L("t", "2")} = P[(1 + ${L("rc", "r\\%")})^2 - 1]`),
        m("0.12 = (1 + r\\%)^2 - 1"),
        m("(1 + r\\%)^2 = 1.12"),
        m("1 + r\\% = \\sqrt{1.12}"),
        m(`${L("r", "r")} = ${U("5.83")}\\text{ (cor. to 2 d.p.)}`),
      ],
    }],
  },
  {
    id: "q30",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$5000$", q: ["$5000 is deposited"] },
      { key: "r", color: "pink", note: "rate $= 6\\%$ p.a.", q: ["6% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "y2", color: "purple", note: "interest in the 2nd year", q: ["interest earned in the second year"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Number of quarters in one year} = 1 \\times ${L("n", "4")}`),
        m("= 4"),
        m(`\\text{Interest rate per quarter} = \\dfrac{${L("r", "6\\%")}}{4}`),
        m("= 1.5\\%"),
        m(`\\text{Amount after the first year} = \\$${L("p", "5000")} \\times (1 + 1.5\\%)^4`),
        m("\\text{Number of quarters in 2 years} = 2 \\times 4"),
        m("= 8"),
        m("\\text{Amount after the second year} = \\$5000 \\times (1 + 1.5\\%)^8"),
        t("$\\therefore$ Interest earned in the second year"),
        m(`= ${L("y2", "\\$[5000 \\times (1 + 1.5\\%)^8 - 5000 \\times (1 + 1.5\\%)^4]")}`),
        m(`= ${U("\\$326")}\\text{ (cor. to the nearest integer)}`),
      ],
    }],
  },
  {
    id: "q31",
    links: [
      { key: "i", color: "green", note: "2nd-year interest $= \\$1458$", q: ["an interest of $1458"] },
      { key: "r", color: "pink", note: "rate $= 8\\%$ p.a.", q: ["8% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded quarterly"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["find the principal"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal which Nancy deposited]]."),
        m(`\\text{Number of quarters in one year} = 1 \\times ${L("n", "4")}`),
        m("= 4"),
        m("\\text{Number of quarters in 2 years} = 2 \\times 4"),
        m("= 8"),
        m(`\\text{Interest rate per quarter} = \\dfrac{${L("r", "8\\%")}}{4}`),
        m("= 2\\%"),
        m(`\\therefore\\ ${L("i", "1458")} = P \\times (1 + 2\\%)^8 - P \\times (1 + 2\\%)^4`),
        m("1458 = P \\times 1.02^8 - P \\times 1.02^4"),
        m("P = \\dfrac{1458}{1.02^8 - 1.02^4}"),
        m("= 16\\ 340\\text{ (cor. to the nearest integer)}"),
        t("$\\therefore$ Nancy deposited \\$16 340 in the bank."),
      ],
    }],
  },
  {
    id: "q32",
    links: [
      { key: "i", color: "green", note: "5th-year interest $= \\$3752$", q: ["an interest of $3752"] },
      { key: "r", color: "pink", note: "rate $= 12\\%$ p.a.", q: ["12% p.a."] },
      { key: "n", color: "amber", note: "monthly → $n = 12$", q: ["compounded monthly"] },
      { key: "p", color: "purple", note: "unknown principal $P$", q: ["find the principal"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[p|$P$ be the principal which Peter deposited]]."),
        m("\\text{Number of months in 4 years} = 4 \\times 12"),
        m("= 48"),
        m("\\text{Number of months in 5 years} = 5 \\times 12"),
        m("= 60"),
        m(`\\text{Interest rate per month} = \\dfrac{${L("r", "12\\%")}}{${L("n", "12")}}`),
        m("= 1\\%"),
        m(`\\therefore\\ ${L("i", "3752")} = P \\times (1 + 1\\%)^{60} - P \\times (1 + 1\\%)^{48}`),
        m("3752 = P \\times 1.01^{60} - P \\times 1.01^{48}"),
        m("P = \\dfrac{3752}{1.01^{60} - 1.01^{48}}"),
        m("= 18\\ 350\\text{ (cor. to the nearest integer)}"),
        t("$\\therefore$ Peter deposited \\$18 350 in the bank."),
      ],
    }],
  },
  {
    id: "q33",
    links: [
      { key: "tot", color: "blue", note: "total $= \\$50\\ 000$", q: ["$50 000 in two banks"] },
      { key: "ra", color: "pink", note: "Bank $A$: simple $10.5\\%$", q: ["simple interest at 10.5% p.a."] },
      { key: "rb", color: "green", note: "Bank $B$: compound $10\\%$ yearly", q: ["10% p.a. compounded yearly"] },
      { key: "c", color: "amber", note: "$I_A = 1.5 \\times I_B$", q: ["50% more than"] },
      { key: "x", color: "purple", note: "Bank $A$ deposit $= x$", q: ["How much did Mr Johnson invest in Bank A"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[x|$x$ be the sum of money that Mr Johnson invested in Bank $A$]]."),
        t("Then, he invested $\\$(50\\ 000 - x)$ in Bank $B$."),
        t("Interest received from Bank $A$ after 2 years"),
        m(`= \\$x \\times ${L("ra", "10.5\\%")} \\times 2`),
        m("= \\$0.21x"),
        t("Interest received from Bank $B$ after 2 years"),
        m(`= \\$[(${L("tot", "50\\ 000")} - x) \\times (1 + ${L("rb", "10\\%")})^2 - (50\\ 000 - x)]`),
        m("= \\$(60\\ 500 - 1.21x - 50\\ 000 + x)"),
        m("= \\$(10\\ 500 - 0.21x)"),
        t("$\\therefore$ Interest received from Bank $A$ is $50\\%$ more than that received from Bank $B$."),
        m(`${L("c", "0.21x = (10\\ 500 - 0.21x) \\times (1 + 50\\%)")}`),
        m("0.21x = 15\\ 750 - 0.315x"),
        m("0.525x = 15\\ 750"),
        m("x = 30\\ 000"),
        t("$\\therefore$ Mr Johnson invested \\$30 000 and $\\$(50\\ 000 - 30\\ 000) = \\$20\\ 000$ in Bank $A$ and Bank $B$ respectively."),
      ],
    }],
  },
  {
    id: "q34",
    links: [
      { key: "p", color: "blue", note: "principal $= \\$40\\ 000$", q: ["borrowed $40 000"] },
      { key: "r", color: "pink", note: "rate $= 16\\%$ p.a.", q: ["16% p.a."] },
      { key: "n", color: "amber", note: "quarterly → $n = 4$", q: ["compounded"] },
      { key: "t", color: "green", note: "2017 → 2021 = 4 years", q: ["beginning of 2021"] },
      { key: "pay", color: "purple", note: "repay $\\$10\\ 000$ each year-end", q: ["repaid $10000"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Number of quarters in 4 years} = ${L("t", "4")} \\times ${L("n", "4")} = 16`),
          m(`\\text{Interest rate per quarter} = \\dfrac{${L("r", "16\\%")}}{4} = 4\\%`),
          t("Compound interest owed"),
          m(`= \\$[${L("p", "40\\ 000")} \\times (1 + 4\\%)^{16} - 40\\ 000]`),
          m(`= ${U("\\$34\\ 919")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Amount that Ken owed the bank at the beginning of 2018"),
          m(`= \\$[40\\ 000 \\times (1 + 4\\%)^4 - ${L("pay", "10\\ 000")}]`),
          m("= \\$36\\ 794.3424"),
          t("Amount that Ken owed the bank at the beginning of 2019"),
          m("= \\$[36\\ 794.3424 \\times (1 + 4\\%)^4 - 10\\ 000]"),
          m("\\approx \\$33\\ 044.1764"),
          t("Amount that Ken owed the bank at the beginning of 2020"),
          m("\\approx \\$[33\\ 044.1764 \\times (1 + 4\\%)^4 - 10\\ 000]"),
          m("\\approx \\$28\\ 657.0126"),
          t("Amount that Ken owed the bank at the beginning of 2021"),
          m("\\approx \\$[28\\ 657.0126 \\times (1 + 4\\%)^4 - 10\\ 000]"),
          m(`= ${U("\\$23\\ 525")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
];
