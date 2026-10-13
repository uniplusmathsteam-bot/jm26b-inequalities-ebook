/**
 * Worked solutions laid out like the JM27 (A) answer key. Field reference:
 * docs/02-book-format.md. House style: docs/03-authoring-style.md.
 *
 * Examples 1–6 are printed with their working, so they only get a graphic.
 */

import { m, t, h, L, lk } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;

export const SOLUTIONS = [
  { id: "ex1", printed: true, ctlAt: [436, 204], boxes: [] },
  { id: "ex2", printed: true, ctlAt: [518, 384], boxes: [] },
  { id: "ex3", printed: true, ctlAt: [553, 602], boxes: [] },
  {
    id: "p3",
    links: [
      { key: "w", color: "blue", note: "original $= 50$ kg", q: ["50 kg in March"] },
      { key: "d", color: "pink", note: "−2% → $\\times(1 - 2\\%)$", q: ["decreased by 2% in April"] },
      { key: "i", color: "green", note: "+6% → $\\times(1 + 6\\%)$", q: ["increased by 6%"] },
    ],
    boxes: [{
      steps: [
        t("Eva's weight in May"),
        m(`= ${L("w", "50")} \\times ${L("d", "(1 - 2\\%)")} \\times ${L("i", "(1 + 6\\%)")}\\text{ kg}`, "one factor per change"),
        m("= 50 \\times 0.98 \\times 1.06\\text{ kg}"),
        m(`= ${U("51.94\\text{ kg}")}`),
      ],
    }],
  },
  {
    id: "q1",
    links: [
      { key: "o", color: "blue", note: "original value $= 9500$", q: ["$9500 last year"] },
      { key: "c", color: "green", note: "change $= +1235$", q: ["increased by $1235"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Percentage change} = \\dfrac{${L("c", "1235")}}{${L("o", "9500")}} \\times 100\\%`, "change ÷ original"),
        m(`= ${U("+13\\%")}`),
      ],
    }],
  },
  {
    id: "q2",
    links: [
      { key: "o", color: "blue", note: "original $= 80$", q: ["80 tables occupied"] },
      { key: "i", color: "green", note: "+15% → $\\times(1 + 15\\%)$", q: ["increased by 15%"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Number of occupied tables} = ${L("o", "80")} \\times ${L("i", "(1 + 15\\%)")}`),
        m("= 80 \\times 1.15"),
        m(`= ${U("92")}`),
      ],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "n", color: "purple", note: "unknown: last month $= n$", q: ["find the number of USB fans sold in the shop last month"] },
      { key: "d", color: "pink", note: "−15% → $\\times(1 - 15\\%)$", q: ["decreases by 15%"] },
      { key: "v", color: "blue", note: "new value $= 102$", q: ["102 USB fans this month"] },
    ],
    boxes: [{
      steps: [
        t("Let [[n|$n$ be the number of USB fans sold last month]]."),
        m(`${L("n", "n")} \\times ${L("d", "(1 - 15\\%)")} = ${L("v", "102")}`, "original × factor = new"),
        m("n = 102 \\div (1 - 15\\%)"),
        m("= 102 \\div 0.85"),
        m("= 120"),
        t("$\\therefore$ The number of USB fans sold in the shop last month was 120."),
      ],
    }],
  },
  {
    id: "q4",
    links: [
      { key: "x", color: "purple", note: "unknown: June $= \\$x$", q: ["find the expenditure of Tim in June"] },
      { key: "d", color: "pink", note: "−35% → $\\times(1 - 35\\%)$", q: ["decreased by 35%"] },
      { key: "i", color: "green", note: "+12% → $\\times(1 + 12\\%)$", q: ["increased by 12%"] },
      { key: "v", color: "blue", note: "August $= 32\\,760$", q: ["August was $32 760"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[x|$x$ be the expenditure of Tim in June]]."),
        m(`${L("x", "x")} \\times ${L("d", "(1 - 35\\%)")} \\times ${L("i", "(1 + 12\\%)")} = ${L("v", "32\\ 760")}`),
        m("x \\times 0.65 \\times 1.12 = 32\\ 760"),
        m("x = 45\\ 000", "÷ 0.728"),
        t("$\\therefore$ The expenditure of Tim in June was \\$45 000."),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "m", color: "blue", note: "male: 300", q: ["300 male employees"] },
      { key: "f", color: "pink", note: "female: 200", q: ["200 female employees"] },
      { key: "i", color: "green", note: "+12% and +5%", q: ["increased by 12% and 5% respectively"] },
      { key: "pc", color: "purple", note: "change ÷ original × 100%", q: ["the percentage change in the total number of employees"], at: 0 },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        m(`\\text{Number of male employees this year} = ${L("m", "300")} \\times ${L("i", "(1 + 12\\%)")}`),
        m("= 336"),
        m(`\\text{Number of female employees this year} = ${L("f", "200")} \\times ${L("i", "(1 + 5\\%)")}`),
        m("= 210"),
        t("Total number of employees this year"),
        m("= 336 + 210"),
        m(`= ${U("546")}`),
        h("(b)"),
        m("\\text{Total number of employees last year} = 300 + 200"),
        m("= 500"),
        m(`${L("pc", "\\text{Percentage change}")} = \\dfrac{546 - 500}{500} \\times 100\\%`),
        m(`= ${U("+9.2\\%")}`),
      ],
    }],
  },
  {
    id: "q6",
    links: [
      { key: "a", color: "blue", note: "drink A $= 300$ mL", q: ["is 300 mL"] },
      { key: "i", color: "green", note: "+30% → $\\times(1 + 30\\%)$", q: ["increased by 30%"] },
      { key: "b", color: "pink", note: "$= 80\\%$ of $y$", q: ["equal to 80% of the volume of a bottle of drink B"] },
    ],
    boxes: [{
      steps: [
        t("Let $y$ mL be the volume of a bottle of drink $B$."),
        m(`${L("a", "300")} \\times ${L("i", "(1 + 30\\%)")} ${L("b", "{} = y \\times 80\\%")}`),
        m("390 = 0.8y"),
        m("y = 487.5", "÷ 0.8"),
        t("$\\therefore$ The volume of a bottle of drink $B$ is 487.5 mL."),
      ],
    }],
  },
  {
    id: "q7",
    links: [
      { key: "d", color: "pink", note: "15% lower → $\\times(1 - 15\\%)$", q: ["15% lower than that in the first"] },
      { key: "i", color: "green", note: "15% higher → $\\times(1 + 15\\%)$", q: ["15% higher than that in the second exam"] },
      { key: "c", color: "purple", note: "compare third with first", q: ["higher in the first exam or the third exam"] },
    ],
    boxes: [{
      steps: [
        t("Let $x$ be Kitty's score in the first exam."),
        m(`\\text{Kitty's score in the third exam} = x \\times ${L("d", "(1 - 15\\%)")} \\times ${L("i", "(1 + 15\\%)")}`),
        m("= x \\times 0.85 \\times 1.15"),
        m("= 0.9775x"),
        m(L("c", "< x")),
        t("$\\therefore$ Kitty's score was higher in the first exam."),
      ],
    }],
  },
  {
    id: "q8",
    links: [
      { key: "d", color: "pink", note: "−y% twice → $(1 - y\\%)^2$", q: ["decreased by y% and then further decreased by y%"] },
      { key: "r", color: "blue", note: "new value $= 400$", q: ["the result is 400 cm"] },
    ],
    boxes: [{
      steps: [
        m(`625 \\times ${L("d", "(1 - y\\%) \\times (1 - y\\%)")} = ${L("r", "400")}`),
        m("(1 - y\\%)^2 = 0.64", "÷ 625"),
        m("1 - y\\% = 0.8", "take the positive root"),
        m("1 - \\dfrac{y}{100} = 0.8"),
        m("\\dfrac{y}{100} = 0.2"),
        m(`y = ${U("20")}`),
      ],
    }],
  },
  {
    id: "q9",
    nowrap: true,
    links: [
      { key: "b", color: "blue", note: "+16% → $1.16B$", q: ["B is increased by 16%"] },
      { key: "t", color: "pink", note: "−8% → $0.92T$", q: ["T is decreased by 8%"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m("T = \\dfrac{A}{4B}"),
          m("A = 4BT", "× 4B"),
          h("(b)"),
          m("\\text{New value of } B = B \\times (1 + 16\\%)"),
          m(`= ${L("b", "1.16B")}`),
          m("\\text{New value of } T = T \\times (1 - 8\\%)"),
          m(`= ${L("t", "0.92T")}`),
          m(`\\text{New value of } A = 4(${L("b", "1.16B")})(${L("t", "0.92T")})`),
          m("= 4.2688BT"),
        ],
      },
      {
        steps: [
          t("Percentage change in the value of $A$"),
          m("= \\dfrac{4.2688BT - 4BT}{4BT} \\times 100\\%"),
          m("= \\dfrac{0.2688BT}{4BT} \\times 100\\%"),
          m(`= ${U("+6.72\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q10",
    links: [
      { key: "r", color: "green", note: "+20% → $r \\times (1 + 20\\%)$", q: ["radius of a circle is increased by 20%"] },
      { key: "a", color: "purple", note: "area uses $r^2$", q: ["percentage change in the area of the circle"] },
    ],
    boxes: [{
      steps: [
        t("Let $r$ be the original radius of the circle."),
        m("\\text{Original area of the circle} = \\pi r^2"),
        m(`\\text{New radius of the circle} = ${L("r", "r \\times (1 + 20\\%)")}`),
        m("= 1.2r"),
        m("\\text{New area of the circle} = \\pi \\times (1.2r)^2"),
        m("= 1.44\\pi r^2"),
        lk("a", t("Percentage change in the area of the circle")),
        m("= \\dfrac{1.44\\pi r^2 - \\pi r^2}{\\pi r^2} \\times 100\\%"),
        m("= \\dfrac{0.44\\pi r^2}{\\pi r^2} \\times 100\\%"),
        m(`= ${U("+44\\%")}`),
      ],
    }],
  },
  { id: "ex4", printed: true, ctlAt: [516, 295], boxes: [] },
  {
    id: "p4",
    links: [
      { key: "p", color: "blue", note: "$P = 8000$", q: ["$8000"] },
      { key: "r", color: "green", note: "$(1 + 15\\%)^2$: 15% a year for 2 years", q: ["increased at a constant rate of 15% per year", "after 2 years"] },
    ],
    boxes: [{
      steps: [
        t("Value of the jewel after 2 years"),
        m(`= \\$${L("p", "8000")} \\times ${L("r", "(1 + 15\\%)^2")}`, "A = P(1 + r%)ⁿ"),
        m("= \\$8000 \\times 1.15^2"),
        m(`= ${U("\\$10\\ 580")}`),
      ],
    }],
  },
  { id: "ex5", printed: true, ctlAt: [519, 79], boxes: [] },
  {
    id: "p5",
    links: [
      { key: "r", color: "pink", note: "decay factor $1 - 11\\%$", q: ["depreciates at a constant rate of 11% per quarter"] },
      { key: "n", color: "amber", note: "1 year = 4 quarters", q: ["one year later"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Decay factor} = ${L("r", "1 - 11\\%")}`),
          m(`= ${U("0.89")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Value of the scanner one year later"),
          m(`= \\$6350 \\times 0.89^{${L("n", "4")}}`, "4 quarters"),
          m(`= ${U("\\$3980")}\\text{ (cor. to 3 sig. fig.)}`),
        ],
      },
    ],
  },
  { id: "ex6", printed: true, ctlAt: [519, 382], boxes: [] },
  {
    id: "p6",
    links: [
      { key: "n", color: "purple", note: "unknown: 7 years ago $= n$", q: ["Find the number of fish in the ocean 7 years ago"] },
      { key: "r", color: "pink", note: "$(1 - 3\\%)$ for 7 years", q: ["decreasing at a rate of 3% per year for the past 7 years"] },
      { key: "v", color: "blue", note: "now $= 630\\,000$", q: ["630 000 now"] },
    ],
    boxes: [{
      steps: [
        t("Let [[n|$n$ be the number of fish in the ocean 7 years ago]]."),
        m(`${L("n", "n")} \\times ${L("r", "(1 - 3\\%)^7")} = ${L("v", "630\\ 000")}`),
        m("n \\times 0.97^7 = 630\\ 000"),
        m("n = \\dfrac{630\\ 000}{0.97^7}"),
        m("= 780\\ 000\\text{ (cor. to the nearest thousand)}"),
        t("$\\therefore$ The number of fish in the ocean 7 years ago was 780 000."),
      ],
    }],
  },
  {
    id: "q11",
    links: [
      { key: "p", color: "blue", note: "$P = 1600$", q: ["$1600"] },
      { key: "r", color: "green", note: "$(1 + 10\\%)^3$: 10% a week for 3 weeks", q: ["three weeks ago", "increased by 10% per week"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Present price of the air ticket} = \\$${L("p", "1600")} \\times ${L("r", "(1 + 10\\%)^3")}`),
        m("= \\$1600 \\times 1.1^3"),
        m(`= ${U("\\$2129.6")}`),
      ],
    }],
  },
  {
    id: "q12",
    links: [
      { key: "n", color: "amber", note: "2 years ago → 1 year from now: 3 periods", q: ["Two years ago", "one year from now"] },
      { key: "p", color: "blue", note: "$P = 500$", q: ["was 500"] },
      { key: "r", color: "green", note: "growth factor $1 + 4\\%$", q: ["increases by 4% per year"] },
    ],
    boxes: [{
      steps: [
        lk("n", t("Number of periods = 3")),
        t("Number of monkeys one year from now"),
        m(`= ${L("p", "500")} \\times ${L("r", "(1 + 4\\%)^3")}`),
        m("= 500 \\times 1.04^3"),
        m(`= ${U("562")}\\text{ (cor. to the nearest integer)}`),
      ],
    }],
  },
  {
    id: "q13",
    links: [
      { key: "y", color: "purple", note: "unknown: 3 years ago $= \\$y$", q: ["the value of the piece of drawing 3 years ago"] },
      { key: "r", color: "green", note: "growth factor $1 + 15\\%$", q: ["increasing at a rate of 15% per year"] },
      { key: "v", color: "blue", note: "now $= 4913$", q: ["$4913 now"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$[[y|$y$ be the value of the piece of drawing 3 years ago]]."),
        m(`${L("y", "y")} \\times ${L("r", "(1 + 15\\%)^3")} = ${L("v", "4913")}`),
        m("y \\times 1.15^3 = 4913"),
        m("y = \\dfrac{4913}{1.15^3}"),
        m("= 3230\\text{ (cor. to 3 sig. fig.)}"),
        t("$\\therefore$ The value of the piece of drawing 3 years ago was \\$3230."),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "v", color: "blue", note: "now $= 5\\,800\\,000$", q: ["$5 800 000 now"] },
      { key: "r", color: "green", note: "forward 3 years: $\\times(1 + 7\\%)^3$", q: ["increased at 7% per year", "3 years later"] },
      { key: "b", color: "pink", note: "backward: $V \\times 1.07^5 = 5\\,800\\,000$", q: ["5 years ago"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Value of the flat 3 years later"),
          m(`= \\$${L("v", "5\\ 800\\ 000")} \\times ${L("r", "(1 + 7\\%)^3")}`),
          m("= \\$5\\ 800\\ 000 \\times 1.07^3"),
          m(`= ${U("\\$7\\ 105\\ 000")}\\text{ (cor. to the nearest \\$1000)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let \\$$V$ be the value of the flat 5 years ago."),
          m(`${L("b", "V \\times (1 + 7\\%)^5")} = 5\\ 800\\ 000`),
          m("V \\times 1.07^5 = 5\\ 800\\ 000"),
          m("V = \\dfrac{5\\ 800\\ 000}{1.07^5}"),
          m("= 4\\ 135\\ 000\\text{ (cor. to the nearest \\$1000)}"),
          t("$\\therefore$ The value of the flat 5 years ago was \\$4 135 000."),
        ],
      },
    ],
  },
  {
    id: "q15",
    links: [
      { key: "p", color: "blue", note: "$P = 40\\,000$", q: ["40 000"] },
      { key: "r", color: "pink", note: "$(1 - 5\\%)^3$: 5% a month for 3 months", q: ["three months ago", "decreases by 5% per month"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Sales of the magazine this month} = ${L("p", "40\\ 000")} \\times ${L("r", "(1 - 5\\%)^3")}`),
        m("= 40\\ 000 \\times 0.95^3"),
        m(`= ${U("34\\ 295")}`),
      ],
    }],
  },
  {
    id: "q16",
    links: [
      { key: "p", color: "blue", note: "$P = 9400$ in 2016", q: ["worth $9400 in 2016"] },
      { key: "r", color: "pink", note: "2016 → 2021: $(1 - 6\\%)^5$", q: ["decreased at a constant rate of 6% per year", "its value in 2021"] },
      { key: "d", color: "purple", note: "decrease = original − new", q: ["the overall decrease in its value"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Value of the diamond ring in 2021"),
          m(`= \\$${L("p", "9400")} \\times ${L("r", "(1 - 6\\%)^5")}`),
          m("= \\$9400 \\times 0.94^5"),
          m(`= ${U("\\$6899")}\\text{ (cor. to the nearest dollar)}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          lk("d", t("Overall decrease in value")),
          m("= \\$(9400 - 9400 \\times 0.94^5)"),
          m(`= ${U("\\$2501")}\\text{ (cor. to the nearest dollar)}`),
        ],
      },
    ],
  },
  {
    id: "q17",
    links: [
      { key: "n", color: "purple", note: "unknown: 7 years ago $= n$", q: ["Find the number of fish in the ocean 7 years"] },
      { key: "r", color: "pink", note: "$(1 - 3\\%)$ for 7 years", q: ["decreasing at a rate of 3% per year for the past 7 years"] },
      { key: "v", color: "blue", note: "now $= 630\\,000$", q: ["630 000 now"] },
    ],
    boxes: [{
      steps: [
        t("Let [[n|$n$ be the number of fish in the ocean 7 years ago]]."),
        m(`${L("n", "n")} \\times ${L("r", "(1 - 3\\%)^7")} = ${L("v", "630\\ 000")}`),
        m("n \\times 0.97^7 = 630\\ 000"),
        m("n = \\dfrac{630\\ 000}{0.97^7}"),
        m("= 780\\ 000\\text{ (cor. to the nearest thousand)}"),
        t("$\\therefore$ The number of fish in the ocean 7 years ago was 780 000."),
      ],
    }],
  },
  {
    id: "q18",
    links: [
      { key: "v", color: "blue", note: "now $= 800$", q: ["worth $800 now"] },
      { key: "r", color: "pink", note: "forward 2 months: $\\times(1 - 10\\%)^2$", q: ["depreciation rate is 10% per month", "2 months later"] },
      { key: "b", color: "green", note: "backward: $y \\times 0.9^3 = 800$", q: ["3 months ago"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("The value of the earphone 2 months later"),
          m(`= \\$${L("v", "800")} \\times ${L("r", "(1 - 10\\%)^2")}`),
          m("= \\$800 \\times 0.9^2"),
          m(`= ${U("\\$648")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let \\$$y$ be the value of the earphone 3 months ago."),
          m(`${L("b", "y \\times (1 - 10\\%)^3")} = 800`),
          m("y \\times 0.9^3 = 800"),
          m("y = \\dfrac{800}{0.9^3}"),
          m("= 1097\\text{ (cor. to the nearest integer)}"),
          t("$\\therefore$ The value of the earphone 3 months ago was \\$1097."),
        ],
      },
    ],
  },
  {
    id: "q19",
    links: [
      { key: "r", color: "green", note: "$\\times(1 + 13\\%)$ every 15 s", q: ["increasing at a constant rate of 13% every 15 seconds"] },
      { key: "p", color: "blue", note: "$P = 5000$", q: ["is 5000 cm3"] },
      { key: "n", color: "amber", note: "1 min ÷ 15 s = 4 periods", q: ["after one minute"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Number of periods} = ${L("n", "\\dfrac{1\\text{ min}}{15\\text{ s}}")} = \\dfrac{60\\text{ s}}{15\\text{ s}} = 4`),
        t("Volume of water in the bathtub after one minute"),
        m(`= ${L("p", "5000")} \\times ${L("r", "(1 + 13\\%)^4")}\\text{ cm}^3`),
        m("= 5000 \\times 1.13^4\\text{ cm}^3"),
        m(`= ${U("8152.4\\text{ cm}^3")}\\text{ (cor. to the nearest 0.1 cm}^3\\text{)}`),
      ],
    }],
  },
  {
    id: "q20",
    links: [
      { key: "p", color: "blue", note: "$P = 15$", q: ["volume 15 cm3"] },
      { key: "r", color: "pink", note: "$\\times(1 - 9\\%)$ every 5 min", q: ["decreases by 9% every", "5 minutes"] },
      { key: "n", color: "amber", note: "20 min ÷ 5 min = 4 periods", q: ["20 minutes later"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Number of periods} = ${L("n", "\\dfrac{20\\text{ min}}{5\\text{ min}}")} = 4`),
        t("Volume of the ice cube 20 minutes later"),
        m(`= ${L("p", "15")} \\times ${L("r", "(1 - 9\\%)^4")}\\text{ cm}^3`),
        m("= 15 \\times 0.91^4\\text{ cm}^3"),
        m(`= ${U("10.3\\text{ cm}^3")}\\text{ (cor. to 3 sig. fig.)}`),
      ],
    }],
  },
  {
    id: "q21",
    links: [
      { key: "v", color: "blue", note: "2017 $= 79\\,860$", q: ["in 2017 was 79 860"] },
      { key: "up", color: "green", note: "2014 → 2017: $\\times 1.1^3$", q: ["increased at a rate of 10%", "per year from 2014 to 2017"] },
      { key: "dn", color: "pink", note: "2017 → 2021: $\\times 0.93^4$", q: ["decreased at 7% per year from 2017 to 2021"], at: 0 },
      { key: "c", color: "purple", note: "compare 2021 with 2014", q: ["more than", "that in 2014"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $x$ be the number of people catching the flu in 2014."),
          m(`x \\times ${L("up", "(1 + 10\\%)^3")} = ${L("v", "79\\ 860")}`),
          m("x \\times 1.1^3 = 79\\ 860"),
          m("x = \\dfrac{79\\ 860}{1.1^3}"),
          m("= 60\\ 000"),
          t("$\\therefore$ The number of people catching the flu in 2014 was 60 000."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Number of people catching the flu in 2021"),
          m(`= 79\\ 860 \\times ${L("dn", "(1 - 7\\%)^4")}`),
          m("= 79\\ 860 \\times 0.93^4"),
          m("\\approx 59\\ 739"),
          m(L("c", "< 60\\ 000")),
          t("$\\therefore$ Holly's claim is disagreed."),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "p", color: "blue", note: "$P = 6000$", q: ["is 6000 m3"] },
      { key: "d", color: "pink", note: "3 years of $\\times(1 - 5\\%)$", q: ["3 consecutive years", "decreases at a rate of 5% per year"] },
      { key: "i", color: "green", note: "then $\\times(1 + 8\\%)$", q: ["increases by 8% in the following year"] },
    ],
    boxes: [
      {
        steps: [
          t("Volume of water in the lake after 3 years"),
          m(`= ${L("p", "6000")} \\times ${L("d", "(1 - 5\\%)^3")}\\text{ m}^3`),
          m("= 5144.25\\text{ m}^3"),
          t("Volume of water in the lake after 4 years"),
          m(`= 5144.25 \\times ${L("i", "(1 + 8\\%)")}\\text{ m}^3`),
          m("= 5555.79\\text{ m}^3"),
        ],
      },
      {
        steps: [
          t("Overall percentage change"),
          m("= \\dfrac{(5555.79 - 6000)\\text{ m}^3}{6000\\text{ m}^3} \\times 100\\%"),
          m(`= ${U("-7.4\\%")}\\text{ (cor. to the nearest 0.1\\%)}`),
        ],
      },
    ],
  },
  {
    id: "q23",
    links: [
      { key: "v", color: "blue", note: "2019 → 2020: 6000 → 4560", q: ["values in 2019 and 2020 were $6000", "and $4560 respectively"] },
      { key: "d", color: "purple", note: "depreciation = 2016 value − 2021 value", q: ["depreciation from 2016 to 2021"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Depreciation rate per year} = \\dfrac{${L("v", "6000 - 4560")}}{6000} \\times 100\\%`),
          m("= \\dfrac{1440}{6000} \\times 100\\%"),
          m(`= ${U("24\\%")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let \\$$V$ be the value of the bicycle in 2016."),
          m("V \\times (1 - 24\\%)^3 = 6000", "2016 → 2019"),
          m("V \\times 0.76^3 = 6000"),
          m("V = \\dfrac{6000}{0.76^3}"),
          t("$\\therefore$ The value of the bicycle in 2016 was \\$$\\dfrac{6000}{0.76^3}$."),
          m("\\text{Value of the bicycle in 2021} = \\$4560 \\times (1 - 24\\%)", "2020 → 2021"),
          m("= \\$4560 \\times 0.76"),
          m("= \\$3465.6"),
          lk("d", t("Depreciation from 2016 to 2021")),
          m("= \\$\\left(\\dfrac{6000}{0.76^3} - 3465.6\\right)"),
          m(`= ${U("\\$10\\ 203")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q24",
    links: [
      { key: "v", color: "blue", note: "6500 → 4875 in one year", q: ["$6500 in 2021", "decrease to $4875 in one"] },
      { key: "th", color: "amber", note: "less than $\\dfrac{6500}{3}$?", q: ["less than one third of its", "original value"] },
      { key: "n", color: "pink", note: "2021 → 2024: 3 years", q: ["in 2024"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t("Depreciation rate per year"),
        m(`= \\dfrac{\\$(${L("v", "6500 - 4875")})}{\\$6500} \\times 100\\%`),
        m(`= ${U("25\\%")}`),
        h("(b)"),
        t("Value of the mobile phone in 2024"),
        m(`= \\$6500 \\times (1 - 25\\%)^{${L("n", "3")}}`),
        m("= \\$2742.1875"),
        m(L("th", "> \\dfrac{\\$6500}{3}")),
        t("$\\therefore$ Amy will not receive the mobile phone in 2024."),
      ],
    }],
  },
  {
    id: "q25",
    links: [
      { key: "r", color: "green", note: "growth factor $1 + r\\%$ per quarter", q: ["increases at a constant rate of r% per quarter"] },
      { key: "v", color: "blue", note: "Q1 → Q3: 2 quarters", q: ["150 000 light bulbs and 174 960 light bulbs"] },
      { key: "n", color: "amber", note: "Q1 2020 → Q4 2021: 7 quarters", q: ["from the 1st quarter of", "2020 to the 4th quarter of 2021"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("v", "150\\ 000")} \\times ${L("r", "(1 + r\\%)")}^2 = ${L("v", "174\\ 960")}`),
          m("(1 + r\\%)^2 = 1.1664", "÷ 150 000"),
          m("1 + r\\% = 1.08", "take the positive root"),
          m("r\\% = 0.08"),
          m(`r = ${U("8")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Number of light bulbs produced in the 4th quarter of 2021"),
          m(`= 150\\ 000 \\times (1 + 8\\%)^{${L("n", "7")}}`),
          m("= 150\\ 000 \\times 1.08^7"),
          t("The required increase in the number"),
          m("= 150\\ 000 \\times 1.08^7 - 150\\ 000"),
          m(`= ${U("107\\ 074")}\\text{ (cor. to the nearest integer)}`),
        ],
      },
    ],
  },
  {
    id: "q26",
    links: [
      { key: "r", color: "pink", note: "decay factor $1 - x\\%$ per 6 months", q: ["depreciated at a constant rate of x% every 6 months"] },
      { key: "v", color: "blue", note: "Dec 2020 → Dec 2021: 2 periods", q: ["$750 000 and $541 875 respectively"] },
      { key: "j", color: "amber", note: "Jun 2019 → Dec 2020: 3 periods", q: ["value of the equipment in Jun 2019"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("v", "750\\ 000")} \\times ${L("r", "(1 - x\\%)")}^2 = ${L("v", "541\\ 875")}`),
          m("(1 - x\\%)^2 = 0.7225", "÷ 750 000"),
          m("1 - x\\% = 0.85", "take the positive root"),
          m(`x = ${U("15")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          lk("j", t("Let \\$$v$ be the value of the equipment in Jun 2019. There were three 6-month periods from Jun 2019 to Dec 2020.")),
          m("v \\times (1 - 15\\%)^3 = 750\\ 000"),
          m("v = 750\\ 000 \\div 0.85^3"),
          m("= 1\\ 221\\ 250\\text{ (cor. to the nearest integer)}"),
          t("$\\therefore$ The value of the equipment in Jun 2019 was \\$1 221 250."),
        ],
      },
    ],
  },
  {
    id: "q27",
    links: [
      { key: "n", color: "blue", note: "now $= n$", q: ["$n now"] },
      { key: "d", color: "pink", note: "depreciation $= n - n(0.9)^3$", q: ["depreciation of the 3D TV will be $7046 after 3 years"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("d", `${L("n", "n")} - n \\times (1 - 10\\%)^3`)} = 7046`, "value lost in 3 years"),
          m("n - 0.729n = 7046"),
          m("0.271n = 7046"),
          m(`n = ${U("26\\ 000")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Value of the 3D TV after 5 years"),
          m("= \\$26\\ 000 \\times (1 - 10\\%)^5"),
          m(`= ${U("\\$15\\ 350")}\\text{ (cor. to the nearest ten)}`),
        ],
      },
    ],
  },
  {
    id: "q28",
    links: [
      { key: "p", color: "blue", note: "$P$ in 2021", q: ["$P in 2021"] },
      { key: "r", color: "pink", note: "decay factor $1 - 10\\%$", q: ["depreciated by 10% per year"] },
      { key: "h", color: "amber", note: "less than $0.5P$", q: ["less than half of its original value"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Value of the car in 2027"),
          m(`= \\$${L("p", "P")} \\times ${L("r", "(1 - 10\\%)^6")}`, "2021 → 2027"),
          m("= \\$P \\times 0.9^6"),
          m(`= ${U("\\$0.531\\ 441P")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Value of the car in 2028"),
          m("= \\$P \\times (1 - 10\\%)^7"),
          m("= \\$P \\times 0.9^7"),
          m("= \\$0.478\\ 296\\ 9P"),
          m(L("h", "< \\$0.5P")),
          t("$\\therefore$ Jerry will buy another car in 2028."),
        ],
      },
    ],
  },
  {
    id: "q29",
    links: [
      { key: "r", color: "green", note: "growth factor $1 + 4.8\\%$", q: ["increase at 4.8% per year"] },
      { key: "d", color: "amber", note: "more than $2E$ after 15 years?", q: ["exceed double in 15 years"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$$E$ be the operation expense of the tutorial centre now."),
        t("Operation expense of the tutorial centre after 15 years"),
        m(`= \\$E \\times ${L("r", "(1 + 4.8\\%)^{15}")}`),
        m("= \\$E \\times 1.048^{15}"),
        m("\\approx \\$2.0203E"),
        m(L("d", "> \\$2E")),
        t("$\\therefore$ The centre manager's claim is agreed."),
      ],
    }],
  },
  {
    id: "q30",
    links: [
      { key: "a", color: "pink", note: "2017: $\\times(1 - 20\\%)$", q: ["depreciation rate was 20% in 2017"] },
      { key: "y", color: "green", note: "then $\\times(1 - y\\%)$ each year", q: ["y% for each", "subsequent year"] },
      { key: "i", color: "blue", note: "2019 price $= 3750 - 2062.5$", q: ["depreciation of the tablet was $2062.5 as compared with the price in 2016"] },
      { key: "ii", color: "amber", note: "2017 → 2021: 4 years", q: ["In 2021, the price of the tablet was $720.3"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Price of the tablet in 2017"),
          m(`= \\$3750 \\times ${L("a", "(1 - 20\\%)")}`),
          m("= \\$3000"),
          t("$\\therefore$ Price of the tablet in 2019"),
          m(`= ${U(`\\$3000${L("y", "(1 - y\\%)^2")}`)}`, "2017 → 2019"),
          h("(b) (i)"),
          t("Price of the tablet in 2019"),
          m(`= \\$(${L("i", "3750 - 2062.5")})`),
          m("= \\$1687.5"),
          m("\\therefore\\quad 3000(1 - y\\%)^2 = 1687.5"),
          m("(1 - y\\%)^2 = 0.5625"),
          m("1 - y\\% = 0.75"),
          m("y\\% = 0.25"),
          m(`y = ${U("25")}`),
        ],
      },
      {
        steps: [
          h("(ii)"),
          m(`3000 \\times (1 - y\\%)^{${L("ii", "4")}} = ${L("ii", "720.3")}`),
          m("(1 - y\\%)^4 = 0.2401"),
          m("(1 - y\\%)^2 = 0.49"),
          m("1 - y\\% = 0.7"),
          m("y\\% = 0.3"),
          m(`y = ${U("30")}`),
        ],
      },
    ],
  },
  {
    id: "q31",
    links: [
      { key: "r", color: "green", note: "growth factor $1 + 8\\%$", q: ["increasing at a constant rate of 8% per year"] },
      { key: "inc", color: "blue", note: "2022 value = $P + 3246.4$", q: ["increased by $3 246.4"] },
      { key: "d", color: "pink", note: "growth factor $= 15\\,600 \\div 15\\,000$", q: ["$15 000 and $15 600 in 2019 and 2020 respectively"] },
      { key: "c", color: "amber", note: "compare in 2025", q: ["will exceed David’s in 2025"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let \\$$P$ be Peter's monthly salary in 2019."),
          t("Number of periods = 2022 − 2019 = 3"),
          m(`${L("inc", "P + 3\\ 246.4")} = P${L("r", "(1 + 8\\%)")}^3`),
          m("3\\ 246.4 = P(1.08^3 - 1)", "− P"),
          m("P = \\dfrac{3\\ 246.4}{1.08^3 - 1}"),
          m("= 12\\ 500"),
          t("$\\therefore$ Peter's monthly salary was \\$12 500 in 2019."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let $y$ be the growth factor of David's monthly salary."),
          m(`${L("d", "15\\ 000 \\times y = 15\\ 600")}`),
          m("y = \\dfrac{15\\ 600}{15\\ 000}"),
          m("= 1.04"),
          t("Number of periods = 2025 − 2019 = 6"),
          t("David's monthly salary in 2025"),
          m("= \\$15\\ 000 \\times 1.04^6"),
          m("= \\$18\\ 980\\text{, cor. to the nearest dollar}"),
          t("Peter's monthly salary in 2025"),
          m("= \\$12\\ 500 \\times 1.08^6"),
          m("= \\$19\\ 836\\text{, cor. to the nearest dollar}"),
          m(L("c", "\\because\\quad \\$19\\ 836 > \\$18\\ 980")),
          t("$\\therefore$ The claim is agreed."),
        ],
      },
    ],
  },
  {
    id: "q32",
    links: [
      { key: "a", color: "blue", note: "first year: $P \\times r\\% = 600\\,000$", q: ["depreciation of the car was $600 000 in 2020"] },
      { key: "b", color: "pink", note: "2 years: $P - P(1 - r\\%)^2$", q: ["From 2019 to 2021, the value of the car", "dropped by $1 080 000"] },
      { key: "c", color: "amber", note: "compare with $\\dfrac{1}{10}P$", q: ["less than one-", "tenth of the original value"] },
    ],
    boxes: [
      {
        steps: [
          t("Let \\$$P$ be the original value of the car and $r\\%$ be the depreciation rate."),
          t("From the question, we have"),
          m(`\\begin{cases} ${L("a", "P \\times r\\% = 600\\ 000")} & \\text{......(1)} \\\\ ${L("b", "P - P \\times (1 - r\\%)^2 = 1\\ 080\\ 000")} & \\text{......(2)} \\end{cases}`),
          t("From (2),"),
          m("P - P[1 - 2r\\% + (r\\%)^2] = 1\\ 080\\ 000"),
          m("P[2r\\% - (r\\%)^2] = 1\\ 080\\ 000"),
          m("P \\times r\\% \\times (2 - r\\%) = 1\\ 080\\ 000 \\quad \\text{......(3)}"),
          t("Substitute (1) into (3)."),
          m("600\\ 000 \\times (2 - r\\%) = 1\\ 080\\ 000"),
          m("2 - \\dfrac{r}{100} = 1.8"),
          m("r = 20"),
        ],
      },
      {
        steps: [
          t("Number of periods = 2029 − 2019 = 10"),
          t("$\\therefore$ Value of the car in 2029"),
          m("= \\$P(1 - 20\\%)^{10}"),
          m("= \\$P(0.107\\ldots)"),
          m(L("c", "> \\dfrac{1}{10} \\times \\$P")),
          t("$\\therefore$ The claim is disagreed."),
        ],
      },
    ],
  },
];
