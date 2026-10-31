/**
 * Worked solutions for JM03 (B) Percentages. Follow the ANS red boxes.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk, align, table } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;

const LIST = [
  {
    id: "q1",
    boxes: [{
      bare: true,
      steps: [table({
        at: { xs: [105, 190, 295, 410, 535], ys: [620, 641, 660, 680] },
        rows: [
          ["", "", "\\$45", "50\\%"],
          ["", "\\$104", "", "30\\%"],
          ["", "\\$468", "\\$208", ""],
        ],
      })],
    }],
  },
  {
    id: "q2",
    boxes: [{
      bare: true,
      steps: [table({
        at: { xs: [105, 190, 295, 410, 535], ys: [724, 744, 764, 784] },
        rows: [
          ["\\$500", "", "", "34\\%"],
          ["\\$420", "\\$189", "", ""],
          ["\\$160", "", "\\$40", ""],
        ],
      })],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "c", color: "blue", note: "cost \\$12", q: ["cost price of a shirt is $12"] },
      { key: "s", color: "pink", note: "sold at \\$60", q: ["sold at $60"] },
      { key: "p", color: "green", note: "profit asked", q: ["the profit"] },
      { key: "r", color: "purple", note: "profit % asked", q: ["the profit per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Profit} = \\$(${L("s", "60")} - ${L("c", "12")}) = ${U("\\$48")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("r", "\\text{Profit }\\%")} = \\dfrac{${L("p", "48")}}{12} \\times 100\\% = ${U("400\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q4",
    links: [
      { key: "c", color: "blue", note: "bought for \\$3500", q: ["bought a washing machine for $3500"] },
      { key: "s", color: "pink", note: "sold for \\$2100", q: ["sold it to Mr Wong for $2100"] },
      { key: "l", color: "amber", note: "loss % asked", q: ["Find the loss per cent"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Loss} = \\$(${L("c", "3500")} - ${L("s", "2100")}) = \\$1400`),
        m(`${L("l", "\\text{Loss }\\%")} = \\dfrac{1400}{3500} \\times 100\\% = ${U("40\\%")}`),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "n", color: "blue", note: "5 watches", q: ["5 identical watches"] },
      { key: "r", color: "amber", note: "loss 16%", q: ["sold at a loss of 16%"] },
      { key: "c", color: "pink", note: "each costs \\$250", q: ["cost price of each watch is $250"] },
      { key: "s", color: "green", note: "total selling price", q: ["total selling price of the 5 watches"] },
      { key: "l", color: "purple", note: "total loss", q: ["Find the total loss"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Total cost price of the 5 watches} = \\$${L("c", "250")} \\times ${L("n", "5")} = \\$1250`),
          m(`\\text{Total selling price} = \\$1250 \\times (1 - ${L("r", "16\\%")})`),
          m(`= \\$1250 \\times 0.84 = ${U("\\$1050")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("l", "\\text{Total loss}")} = \\$(1250 - ${L("s", "1050")}) = ${U("\\$200")}`),
        ],
      },
    ],
  },
  {
    id: "q6",
    links: [
      { key: "p", color: "pink", note: "profit \\$36", q: ["sold at a profit of $36"] },
      { key: "s", color: "blue", note: "selling price \\$261", q: ["selling price of the ticket is $261"] },
      { key: "c", color: "green", note: "cost price asked", q: ["the cost price of the theme park ticket"] },
      { key: "r", color: "purple", note: "profit % asked", q: ["the profit per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("c", "\\text{Cost price}")} = \\$(${L("s", "261")} - ${L("p", "36")}) = ${U("\\$225")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("r", "\\text{Profit }\\%")} = \\dfrac{36}{225} \\times 100\\% = ${U("16\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q7",
    links: [
      { key: "r", color: "amber", note: "profit 26%", q: ["sold at a profit of 26%"] },
      { key: "p", color: "pink", note: "profit \\$351", q: ["a profit of $351 is made"] },
      { key: "c", color: "blue", note: "cost price asked", q: ["cost price"] },
      { key: "s", color: "green", note: "selling price asked", q: ["selling price"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $\\$p$ be the cost price of the gaming console."),
          m(`${L("c", "p")} \\times ${L("r", "26\\%")} = ${L("p", "351")}`),
          m(`p = 351 \\div 26\\% = 351 \\div 0.26 = 1350`),
          t("$\\therefore$ The cost price of the gaming console is $\\$1350$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("s", "\\text{Selling price}")} = \\$(1350 + 351) = ${U("\\$1701")}`),
        ],
      },
    ],
  },
  {
    id: "q8",
    links: [
      { key: "n", color: "blue", note: "600 apples for \\$1000", q: ["bought 600 apples for $1000"] },
      { key: "a", color: "pink", note: "400 at \\$2.5", q: ["400 apples are first sold at $2.5 each"] },
      { key: "b", color: "green", note: "rest at \\$2", q: ["the rest are sold at $2 each"] },
      { key: "r", color: "purple", note: "overall profit %", q: ["overall profit per cent"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Total profit} = \\$[${L("a", "2.5 \\times 400")} + ${L("b", "2 \\times (600 - 400)")}] - ${L("n", "1000")}`),
        m(`= ${U("\\$400")}`),
        m(`${L("r", "\\text{Overall profit }\\%")} = \\dfrac{400}{1000} \\times 100\\% = ${U("40\\%")}`),
      ],
    }],
  },
  {
    id: "q9",
    links: [
      { key: "a", color: "blue", note: "shop A: cost \\$4000, sell \\$5520", q: ["Shop A buys a mobile phone at a cost price of $4000 and sells it at $5520"] },
      { key: "b", color: "pink", note: "shop B: cost \\$3600, sell \\$5040", q: ["Shop B buys the same mobile phone at a cost price of $3600 and sells it at $5040"] },
      { key: "p", color: "green", note: "larger profit", q: ["Which shop makes a larger profit"] },
      { key: "r", color: "purple", note: "larger profit %", q: ["Which shop makes a larger profit per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Profit of shop } A = \\$(${L("a", "5520 - 4000")}) = \\$1520`),
          m(`\\text{Profit of shop } B = \\$(${L("b", "5040 - 3600")}) = \\$1440`),
          t("[[p|Shop A]] makes a larger profit."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Profit }\\%\\text{ of shop } A = \\dfrac{1520}{4000} \\times 100\\% = 38\\%`),
          m(`\\text{Profit }\\%\\text{ of shop } B = \\dfrac{1440}{3600} \\times 100\\% = 40\\%`),
          t("[[r|Shop B]] makes a larger profit per cent."),
        ],
      },
    ],
  },
  {
    id: "q10",
    links: [
      { key: "p", color: "blue", note: "pen costs \\$1.5", q: ["cost prices of a pen and a notebook are $1.5 and $2"] },
      { key: "n", color: "pink", note: "notebook costs \\$2", q: ["$1.5 and $2 respectively"] },
      { key: "g", color: "green", note: "profit \\$1 each", q: ["both sold at a profit of $1"] },
      { key: "m", color: "purple", note: "2 pens and 6 notebooks", q: ["2 pens and 6 notebooks are sold"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Profit }\\%\\text{ of the pen} = \\dfrac{${L("g", "1")}}{${L("p", "1.5")}} \\times 100\\% = ${U("66\\dfrac{2}{3}\\%")}`),
          m(`\\text{Profit }\\%\\text{ of the notebook} = \\dfrac{1}{${L("n", "2")}} \\times 100\\% = ${U("50\\%")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Profit }\\% = \\dfrac{${L("m", "2 + 6")}}{1.5 \\times 2 + 2 \\times 6} \\times 100\\%`),
          m(`= \\dfrac{8}{15} \\times 100\\% = ${U("53\\dfrac{1}{3}\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q11",
    links: [
      { key: "a", color: "blue", note: "Anson: 60 for \\$240", q: ["Anson bought 60 postcards for $240"] },
      { key: "b", color: "pink", note: "sold to Boris at \\$60 a dozen", q: ["sold them to Boris at $60 a dozen"] },
      { key: "c", color: "green", note: "Boris sold at \\$73.2 a dozen", q: ["sold the postcards to Chris at $73.2 a dozen"] },
      { key: "w", color: "purple", note: "who has larger profit %", q: ["Who earned a larger profit per cent"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\text{Total selling price for Anson} = \\dfrac{60}{12} \\times ${L("b", "60")} = \\$300`),
          m(`\\text{Profit for Anson} = \\$(300 - ${L("a", "240")}) = \\$60`),
          m(`\\text{Profit }\\%\\text{ for Anson} = \\dfrac{60}{240} \\times 100\\% = 25\\%`),
        ],
      },
      {
        steps: [
          m(`\\text{Total selling price for Boris} = \\dfrac{${L("c", "73.2")}}{12} \\times 60 = \\$366`),
          m(`\\text{Profit for Boris} = \\$(366 - 300) = \\$66`),
          m(`\\text{Profit }\\%\\text{ for Boris} = \\dfrac{66}{300} \\times 100\\% = 22\\%`),
          t("[[w|Anson]] earned a larger profit per cent."),
        ],
      },
    ],
  },
  {
    id: "q12",
    boxes: [{
      bare: true,
      steps: [table({
        at: { xs: [105, 190, 295, 410, 535], ys: [294, 314, 334, 354] },
        rows: [
          ["", "", "\\$107", "20\\%"],
          ["\\$1000", "", "", "37.5\\%"],
          ["", "\\$468", "\\$312", ""],
        ],
      })],
    }],
  },
  {
    id: "q13",
    links: [
      { key: "s", color: "pink", note: "saves \\$675", q: ["saves $675"] },
      { key: "d", color: "amber", note: "9% discount", q: ["receiving a 9% discount"] },
      { key: "m", color: "blue", note: "marked price asked", q: ["Find the marked price of the violin"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\$x$ be the marked price of the violin."),
        m(`${L("m", "x")} \\times ${L("d", "9\\%")} = ${L("s", "675")}`),
        m(`x = 675 \\div 9\\% = 675 \\div 0.09 = 7500`),
        t("$\\therefore$ The marked price of the violin is $\\$7500$."),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "h", color: "blue", note: "hamburger \\$20", q: ["selling prices of a hamburger and an ice-cream are $20 and $12"] },
      { key: "i", color: "pink", note: "ice-cream \\$12", q: ["$20 and $12 respectively"] },
      { key: "t", color: "green", note: "tea set \\$28", q: ["which costs $28"] },
      { key: "d", color: "purple", note: "discount % asked", q: ["What is the discount per cent"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\text{Discount} = \\$[(${L("h", "20")} + ${L("i", "12")}) - ${L("t", "28")}] = \\$4`),
        ],
      },
      {
        steps: [
          m(`${L("d", "\\text{Discount }\\%")} = \\dfrac{4}{20 + 12} \\times 100\\%`),
          m(`= \\dfrac{4}{32} \\times 100\\% = ${U("12.5\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q15",
    links: [
      { key: "d", color: "amber", note: "60% off", q: ["sold at 60% off"] },
      { key: "s", color: "pink", note: "selling price \\$96", q: ["selling price of a pair of trousers is $96"] },
      { key: "m", color: "blue", note: "marked price asked", q: ["find the marked price"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\$p$ be the marked price of the pair of trousers."),
        m(`${L("m", "p")} \\times (1 - ${L("d", "60\\%")}) = ${L("s", "96")}`),
        m(`p = 96 \\div (1 - 60\\%) = 96 \\div 0.4 = 240`),
        t("$\\therefore$ The marked price of the pair of trousers is $\\$240$."),
      ],
    }],
  },
  {
    id: "q16",
    links: [
      { key: "s", color: "pink", note: "pays \\$43.5", q: ["buys a towel for $43.5"] },
      { key: "d", color: "amber", note: "13% discount", q: ["at a discount of 13%"] },
      { key: "m", color: "blue", note: "marked price asked", q: ["What is the marked price of the towel"] },
      { key: "v", color: "green", note: "how much saved", q: ["How much does Darren save"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $\\$x$ be the marked price of the towel."),
          m(`${L("m", "x")} \\times (1 - ${L("d", "13\\%")}) = ${L("s", "43.5")}`),
          m(`x = 43.5 \\div (1 - 13\\%) = 43.5 \\div 0.87 = 50`),
          t("$\\therefore$ The marked price of the towel is $\\$50$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("v", "\\text{Discount}")} = \\$(50 - 43.5) = ${U("\\$6.5")}`),
          t("$\\therefore$ Darren saves $\\$6.5$."),
        ],
      },
    ],
  },
  {
    id: "q17",
    links: [
      { key: "d", color: "amber", note: "20% discount", q: ["sold at a discount of 20%"] },
      { key: "e", color: "pink", note: "extra \\$50 off", q: ["gets an extra $50 off on the selling price"] },
      { key: "m", color: "blue", note: "marked \\$500", q: ["marked price of the dress is $500"] },
      { key: "p", color: "green", note: "how much Sally pays", q: ["how much does Sally pay"] },
      { key: "r", color: "purple", note: "overall discount %", q: ["overall discount per cent for Sally"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("p", "\\text{Amount that Sally pays}")} = \\$[${L("m", "500")} \\times (1 - ${L("d", "20\\%")}) - ${L("e", "50")}]`),
          m(`= \\$(500 \\times 0.8 - 50) = \\$(400 - 50) = ${U("\\$350")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Overall discount} = \\$(500 - 350) = \\$150`),
          m(`${L("r", "\\text{Overall discount }\\%")} = \\dfrac{150}{500} \\times 100\\% = ${U("30\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q18",
    links: [
      { key: "d", color: "amber", note: "25% discount", q: ["sold at a discount of 25%"] },
      { key: "m", color: "blue", note: "marked \\$650", q: ["marked price is $650"] },
      { key: "c", color: "pink", note: "Chris has \\$500", q: ["Chris has $500 only"] },
      { key: "q", color: "purple", note: "can he buy?", q: ["can he buy the bag"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Selling price} = \\$${L("m", "650")} \\times (1 - ${L("d", "25\\%")})`),
        m(`= \\$650 \\times 0.75 = \\$487.5`),
        m(`< ${L("c", "\\$500")}`),
        t("$\\therefore$ [[q|Chris can buy the bag]]."),
      ],
    }],
  },
  {
    id: "q19",
    links: [
      { key: "p", color: "blue", note: "\\$45 a box", q: ["marked price of a box of ice cream is $45"] },
      { key: "f", color: "pink", note: "buy 3 get 1 free", q: ["buying 3 boxes of ice cream can get an extra box of ice cream for free"] },
      { key: "n", color: "green", note: "Bob wants 4 boxes", q: ["Bob wants to buy 4 boxes of ice cream"] },
      { key: "d", color: "purple", note: "discount % asked", q: ["Find the discount per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Total marked price} = \\$${L("p", "45")} \\times ${L("n", "4")} = ${U("\\$180")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Discount} = \\$${L("f", "45")}`),
          m(`${L("d", "\\text{Discount }\\%")} = \\dfrac{45}{180} \\times 100\\% = ${U("25\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q20",
    links: [
      { key: "m", color: "blue", note: "marked \\$4800", q: ["marked price of a television is $4 800"] },
      { key: "d", color: "amber", note: "25% then 8%", q: ["sold at a discount of 25%", "further 8% discount on the reduced price"] },
      { key: "o", color: "green", note: "overall discount asked", q: ["Find the overall discount that Tina gets"] },
      { key: "r", color: "purple", note: "overall discount %", q: ["Find the overall discount per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Selling price} = \\$${L("m", "4800")} \\times (1 - ${L("d", "25\\%")}) \\times (1 - 8\\%)`),
          m(`= \\$4800 \\times 0.75 \\times 0.92 = \\$3312`),
          m(`${L("o", "\\text{Overall discount}")} = \\$(4800 - 3312) = ${U("\\$1488")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("r", "\\text{Overall discount }\\%")} = \\dfrac{1488}{4800} \\times 100\\% = ${U("31\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q21",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "n", color: "blue", note: "10 cans", q: ["buy 10 cans of coke"] },
      { key: "a", color: "pink", note: "buy 2 get 1 free", q: ["Buy 2 get 1 free"] },
      { key: "b", color: "green", note: "buy 5 get 2 free", q: ["Buy 5 get 2 free"] },
      { key: "c", color: "purple", note: "buy 1 get 1 at half price", q: ["Buy 1 get 1 more at half price"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Buy 7, get 3 free."),
          m(`\\therefore\\ \\text{Discount }\\% = \\dfrac{${L("a", "3")}}{${L("n", "10")}} \\times 100\\% = ${U("30\\%")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Buy 8, get 2 free."),
          m(`\\therefore\\ \\text{Discount }\\% = \\dfrac{${L("b", "2")}}{10} \\times 100\\% = ${U("20\\%")}`),
        ],
      },
      {
        steps: [
          h("(c)"),
          t("5 at full price, 5 at half."),
          m(`\\therefore\\ \\text{Discount }\\% = \\dfrac{${L("c", "5 \\times 0.5")}}{10} \\times 100\\% = ${U("25\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "m", color: "blue", note: "marked \\$2400", q: ["marked price of a silver necklace is $2400"] },
      { key: "d", color: "amber", note: "40% discount", q: ["sold at a discount of 40% on its marked price"] },
      { key: "s", color: "pink", note: "selling price asked", q: ["Find the selling price of the silver necklace"] },
      { key: "c", color: "green", note: "marked is 60% above cost", q: ["marked price of the silver necklace is 60% above its cost price"] },
      { key: "g", color: "purple", note: "gain or loss?", q: ["determine whether there will be a gain or a loss"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("s", "\\text{Selling price}")} = \\$${L("m", "2400")} \\times (1 - ${L("d", "40\\%")})`),
          m(`= \\$2400 \\times 0.6 = ${U("\\$1440")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("Let $\\$x$ be the cost price of the silver necklace."),
          m(`x \\times (1 + ${L("c", "60\\%")}) = 2400`),
          m(`x = 2400 \\div (1 + 60\\%) = 2400 \\div 1.6 = 1500`),
          t("$\\because$ Cost price ($\\$1500$) $>$ selling price ($\\$1440$)."),
          t("$\\therefore$ [[g|There will be a loss]] after selling the silver necklace."),
        ],
      },
    ],
  },
  {
    id: "q23",
    links: [
      { key: "c", color: "blue", note: "bought at \\$1500", q: ["bought a camera at $1500"] },
      { key: "p", color: "pink", note: "profit 20%", q: ["with a profit of 20%"] },
      { key: "d", color: "amber", note: "discount 10%", q: ["giving Yannie a discount of 10%"] },
      { key: "m", color: "green", note: "marked price asked", q: ["Find the marked price of the camera"] },
      { key: "s", color: "purple", note: "Yannie sells at \\$1620", q: ["Yannie sells the camera to Winnie at $1620"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $\\$p$ be the marked price of the camera."),
          m(`${L("m", "p")} \\times (1 - ${L("d", "10\\%")}) = ${L("c", "1500")} \\times (1 + ${L("p", "20\\%")})`),
          m(`p \\times 0.9 = 1500 \\times 1.2`),
          m(`p = 1800 \\div 0.9 = 2000`),
          t("$\\therefore$ The marked price of the camera is $\\$2000$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Selling price to Yannie} = \\$1500 \\times 1.2 = \\$1800`),
          m(`\\text{Loss} = \\$(1800 - ${L("s", "1620")}) = \\$180`),
          m(`\\text{Loss }\\% = \\dfrac{180}{1800} \\times 100\\% = ${U("10\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q24",
    links: [
      { key: "d", color: "amber", note: "10% discount", q: ["sold at a discount of 10%"] },
      { key: "e", color: "pink", note: "further \\$3 over \\$50", q: ["purchases over $50 can enjoy a further reduction of $3"] },
      { key: "n", color: "blue", note: "5 pens at \\$12", q: ["buy 5 pens and the marked price is $12 each"] },
      { key: "a", color: "green", note: "discount asked", q: ["Find the discount"] },
      { key: "r", color: "purple", note: "discount % asked", q: ["Find the discount per cent"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`\\text{Selling price after } 10\\% = \\$${L("n", "12")} \\times 5 \\times (1 - ${L("d", "10\\%")})`),
          m(`= \\$60 \\times 0.9 = \\$54`),
          t("$\\because$ $\\$54 > \\$50$, a further $\\$3$ reduction applies."),
          m(`\\text{Amount paid} = \\$(54 - ${L("e", "3")}) = \\$51`),
          m(`${L("a", "\\text{Discount}")} = \\$(60 - 51) = ${U("\\$9")}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`${L("r", "\\text{Discount }\\%")} = \\dfrac{9}{60} \\times 100\\% = ${U("15\\%")}`),
        ],
      },
    ],
  },
  {
    id: "q25",
    links: [
      { key: "s", color: "pink", note: "sold for \\$2739", q: ["sold a game set consisting of a console and a controller for $2739"] },
      { key: "l", color: "amber", note: "loss 17%", q: ["at a loss of 17%"] },
      { key: "k", color: "blue", note: "controller \\$350", q: ["bought the controller for $350"] },
      { key: "c", color: "green", note: "console cost asked", q: ["What was the cost price of the console"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\$x$ be the total cost price of the game set."),
        m(`x \\times (1 - ${L("l", "17\\%")}) = ${L("s", "2739")}`),
        m(`x = 2739 \\div 0.83 = 3300`),
        t("Total cost price is $\\$3300$."),
        m(`${L("c", "\\text{Cost price of the console}")} = \\$(3300 - ${L("k", "350")}) = ${U("\\$2950")}`),
      ],
    }],
  },
  {
    id: "q26",
    links: [
      { key: "a", color: "blue", note: "10% vs 35% differ by \\$600", q: ["selling price of an air-conditioner with a discount of 10% is $600 more than that with a discount of 35%"] },
      { key: "b", color: "pink", note: "shop B marked \\$2200", q: ["In shop B, the marked price of the same air-conditioner is $2200"] },
      { key: "m", color: "green", note: "shop A marked asked", q: ["Find the marked price of the air-conditioner in shop A"] },
      { key: "c", color: "purple", note: "which shop to choose", q: ["which shop should she choose"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("Let $\\$y$ be the marked price of the air-conditioner in shop A."),
          m(`y \\times (1 - 10\\%) - y \\times (1 - 35\\%) = ${L("a", "600")}`),
          m(`0.9y - 0.65y = 600`),
          m(`0.25y = 600`),
          m(`y = 2400`),
          t("$\\therefore$ The marked price of the air-conditioner in shop A is $\\$2400$."),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(`\\text{Shop A: } \\$${L("m", "2400")} \\times (1 - 20\\%) = \\$2400 \\times 0.8 = \\$1920`),
          m(`\\text{Shop B: } \\$${L("b", "2200")} \\times (1 - 5\\%) = \\$2200 \\times 0.95 = \\$2090`),
          t("$\\because$ Selling price in shop A $<$ selling price in shop B."),
          t("$\\therefore$ [[c|Kinki should choose shop A]]."),
        ],
      },
    ],
  },
  {
    id: "q27",
    links: [
      { key: "s", color: "pink", note: "sells for \\$66.5", q: ["sells the necklace for $66.5"] },
      { key: "l", color: "amber", note: "loss 12.5%", q: ["makes a loss of 12.5%"] },
      { key: "p", color: "green", note: "want profit 25%", q: ["make a profit of 25%"] },
      { key: "n", color: "blue", note: "new selling price", q: ["what should be the selling price"] },
    ],
    boxes: [{
      steps: [
        t("Let $\\$p$ be the cost price of the necklace."),
        m(`p \\times (1 - ${L("l", "12.5\\%")}) = ${L("s", "66.5")}`),
        m(`p = 66.5 \\div 0.875 = 76`),
        t("Cost price is $\\$76$."),
        m(`${L("n", "\\text{Selling price}")} = \\$76 \\times (1 + ${L("p", "25\\%")})`),
        m(`= \\$76 \\times 1.25 = ${U("\\$95")}`),
      ],
    }],
  },
];

/** Dense pages: allow shrink to 70 %. */
export const SOLUTIONS = LIST.map((s) => ({
  minScale: 0.7,
  ...s,
  boxes: s.boxes.map((b) => ({ ...b, steps: align(b.steps) })),
}));
