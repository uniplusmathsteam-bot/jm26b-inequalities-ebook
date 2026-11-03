/**
 * Whiteboard scenario boards for JM03 (B) Percentages.
 * Numbers follow the ANS key (solutions.js). Table fills q1, q2 and q12
 * have no scenario to draw. Format: docs/06-infographics.md.
 */

import { title, text, then, ans, flow, chain } from "../../engine/infographic/kit.js";

/** Bars standing on one baseline, clear of the title and of the lines below. */
function bars(nodes, steps) {
  return flow({
    x0: 36, x1: 604, base: 292, maxH: 112, barW: nodes.length > 3 ? 68 : 84,
    nodes, steps,
  });
}

const Y0 = 360;
const dy = 36;
const at = (i) => Y0 + i * dy;

export const INFOGRAPHICS = {
  q3: {
    title: "A shirt: cost $12, sold at $60",
    w: 640, h: 500,
    items: [
      title("Shirt: cost and selling price"),
      bars(
        [
          { name: "Cost", v: 12, text: "$12", color: "blue" },
          { name: "Selling", v: 60, text: "$60", color: "green" },
        ],
        [{ label: "profit $48", sub: "60 − 12" }],
      ),
      text(28, at(0), "(a) Profit = $(60 − 12) ="),
      ans("$48"),
      text(28, at(1), "(b) Profit % = 48 / 12 × 100% ="),
      ans("400%"),
    ],
  },

  q4: {
    title: "Washing machine bought for $3500, sold for $2100",
    w: 640, h: 470,
    items: [
      title("Washing machine"),
      bars(
        [
          { name: "Bought", v: 3500, text: "$3500", color: "blue" },
          { name: "Sold", v: 2100, text: "$2100", color: "pink" },
        ],
        [{ label: "loss $1400", color: "red" }],
      ),
      text(28, at(0), "Loss % = 1400 / 3500 × 100% ="),
      ans("40%"),
    ],
  },

  q5: {
    title: "Five watches at $250, sold at a loss of 16%",
    w: 640, h: 430,
    items: [
      title("Five identical watches"),
      chain(150, 150, [
        { text: "$250", name: "each", color: "blue" },
        { text: "$1250", name: "cost of 5", color: "ink" },
        { text: "$1050", name: "selling", color: "pink" },
      ], ["× 5", "× 0.84"], { gap: 190 }),
      text(28, 250, "(a) Selling price = 1250 × (1 − 16%) ="),
      ans("$1050"),
      text(28, 300, "(b) Total loss = $(1250 − 1050) ="),
      ans("$200"),
    ],
  },

  q6: {
    title: "Theme park ticket sold at $261, profit $36",
    w: 640, h: 400,
    items: [
      title("Theme park ticket"),
      chain(170, 150, [
        { text: "$261", name: "selling", color: "green" },
        { text: "$225", name: "cost", color: "blue" },
      ], ["− $36"], { gap: 240 }),
      text(28, 250, "(a) Cost = $(261 − 36) ="),
      ans("$225"),
      text(28, 300, "(b) Profit % = 36 / 225 × 100% ="),
      ans("16%"),
    ],
  },

  q7: {
    title: "Gaming console: a 26% profit is $351",
    w: 640, h: 430,
    items: [
      title("Gaming console"),
      chain(140, 150, [
        { text: "$351", name: "profit", color: "pink" },
        { text: "$1350", name: "cost", color: "blue" },
        { text: "$1701", name: "selling", color: "green" },
      ], ["÷ 26%", "+ $351"], { gap: 190 }),
      text(28, 250, "(a) Cost = 351 ÷ 26% = 351 ÷ 0.26 ="),
      ans("$1350"),
      text(28, 300, "(b) Selling price = $(1350 + 351) ="),
      ans("$1701"),
    ],
  },

  q8: {
    title: "600 apples for $1000; 400 at $2.5, the rest at $2",
    w: 640, h: 500,
    items: [
      title("600 apples"),
      bars(
        [
          { name: "Cost", v: 1000, text: "$1000", color: "blue" },
          { name: "400 at $2.5", v: 1000, text: "$1000", color: "green" },
          { name: "200 at $2", v: 400, text: "$400", color: "pink" },
        ],
        [null, null],
      ),
      text(28, at(0), "Takings = $(2.5 × 400 + 2 × 200) = $1400"),
      text(28, at(1), "Profit = $(1400 − 1000) ="),
      ans("$400"),
      text(28, at(2), "Overall profit % = 400 / 1000 × 100% ="),
      ans("40%"),
    ],
  },

  q9: {
    title: "The same phone in shop A and shop B",
    w: 640, h: 540,
    items: [
      title("Which shop does better?"),
      bars(
        [
          { name: "A cost", v: 4000, text: "$4000", color: "blue" },
          { name: "A sells", v: 5520, text: "$5520", color: "blue" },
          { name: "B cost", v: 3600, text: "$3600", color: "pink" },
          { name: "B sells", v: 5040, text: "$5040", color: "pink" },
        ],
      ),
      text(28, at(0), "(a) Profit: A $1520, B $1440."),
      then("{blue:Shop A} makes the larger profit."),
      text(28, at(1), "(b) Profit %: A 38%, B 40%."),
      then("{pink:Shop B} makes the larger profit %."),
    ],
  },

  q10: {
    title: "A pen costs $1.5, a notebook $2, each sold at a $1 profit",
    w: 640, h: 500,
    items: [
      title("Pen and notebook"),
      bars(
        [
          { name: "Pen", v: 2.5, text: "$2.5", color: "blue" },
          { name: "Notebook", v: 3, text: "$3", color: "pink" },
        ],
        [{ label: "each + $1", sub: "profit" }],
      ),
      text(28, at(0), "(a) Pen: 1 / 1.5 ="),
      ans("66 2/3%"),
      then("  Notebook: 1 / 2 ="),
      ans("50%"),
      text(28, at(1), "(b) 2 pens + 6 notebooks: profit $8 on cost $15"),
      text(28, at(2), "Profit % = 8 / 15 × 100% ="),
      ans("53 1/3%"),
    ],
  },

  q11: {
    title: "Anson, Boris and Chris trade the same 60 postcards",
    w: 640, h: 540,
    items: [
      title("Who earns the larger profit %?"),
      chain(140, 140, [
        { text: "$240", name: "Anson paid", color: "blue" },
        { text: "$300", name: "to Boris", color: "pink" },
        { text: "$366", name: "to Chris", color: "green" },
      ], ["$60 / dozen", "$73.2 / dozen"], { gap: 190 }),
      text(28, 250, "Anson: profit $(300 − 240) = $60, so"),
      ans("25%"),
      text(28, 300, "Boris: profit $(366 − 300) = $66, so"),
      ans("22%"),
      text(28, 360, "25% > 22%, so"),
      ans("Anson"),
      then("earned the larger profit %."),
    ],
  },

  q13: {
    title: "A 9% discount on a violin saves $675",
    w: 640, h: 400,
    items: [
      title("Violin"),
      chain(170, 150, [
        { text: "$675", name: "saved", color: "pink" },
        { text: "$7500", name: "marked", color: "blue" },
      ], ["÷ 9%"], { gap: 260 }),
      text(28, 250, "9% of the marked price is $675."),
      text(28, 300, "Marked price = 675 ÷ 0.09 ="),
      ans("$7500"),
    ],
  },

  q14: {
    title: "Hamburger $20 and ice-cream $12, bought as a $28 tea set",
    w: 640, h: 470,
    items: [
      title("Tea set"),
      bars(
        [
          { name: "Hamburger", v: 20, text: "$20", color: "blue" },
          { name: "Ice-cream", v: 12, text: "$12", color: "pink" },
          { name: "Tea set", v: 28, text: "$28", color: "green" },
        ],
      ),
      text(28, at(0), "Together $32, tea set $28, so the discount is"),
      ans("$4"),
      text(28, at(1), "Discount % = 4 / 32 × 100% ="),
      ans("12.5%"),
    ],
  },

  q15: {
    title: "Trousers at 60% off sell for $96",
    w: 640, h: 400,
    items: [
      title("A pair of trousers"),
      chain(170, 150, [
        { text: "$96", name: "you pay", color: "pink" },
        { text: "$240", name: "marked", color: "blue" },
      ], ["÷ 0.4"], { gap: 260 }),
      text(28, 250, "You pay 40% of the marked price."),
      text(28, 300, "Marked price = 96 ÷ (1 − 60%) ="),
      ans("$240"),
    ],
  },

  q16: {
    title: "Darren pays $43.5 for a towel at 13% off",
    w: 640, h: 430,
    items: [
      title("Towel"),
      chain(150, 150, [
        { text: "$50", name: "marked", color: "blue" },
        { text: "$43.5", name: "Darren pays", color: "pink" },
      ], ["× 0.87"], { gap: 240 }),
      text(28, 250, "(a) Marked price = 43.5 ÷ (1 − 13%) ="),
      ans("$50"),
      text(28, 300, "(b) Darren saves $(50 − 43.5) ="),
      ans("$6.5"),
    ],
  },

  q17: {
    title: "A $500 dress: 20% off, then another $50 off",
    w: 640, h: 430,
    items: [
      title("Sally's dress"),
      chain(130, 150, [
        { text: "$500", name: "marked", color: "blue" },
        { text: "$400", name: "20% off", color: "pink" },
        { text: "$350", name: "Sally pays", color: "green" },
      ], ["× 0.8", "− $50"], { gap: 190 }),
      text(28, 250, "(a) She pays $(500 × 0.8 − 50) ="),
      ans("$350"),
      text(28, 300, "(b) Overall discount = 150 / 500 × 100% ="),
      ans("30%"),
    ],
  },

  q18: {
    title: "A bag marked $650 is 25% off. Chris has $500",
    w: 640, h: 400,
    items: [
      title("Can Chris buy the bag?"),
      bars(
        [
          { name: "Marked", v: 650, text: "$650", color: "blue" },
          { name: "Selling", v: 487.5, text: "$487.5", color: "green" },
          { name: "Chris has", v: 500, text: "$500", color: "pink" },
        ],
      ),
      text(28, at(0), "Selling price = 650 × (1 − 25%) = $487.5"),
      text(28, at(1), "$487.5 < $500, so"),
      ans("Chris can buy the bag"),
    ],
  },

  q19: {
    title: "Ice cream $45 a box. Buy 3, get 1 free. Bob wants 4",
    w: 640, h: 470,
    items: [
      title("Four boxes of ice cream"),
      bars(
        [
          { name: "Box 1", v: 45, text: "$45", color: "blue" },
          { name: "Box 2", v: 45, text: "$45", color: "blue" },
          { name: "Box 3", v: 45, text: "$45", color: "blue" },
          { name: "Free", v: 45, text: "$0", color: "green" },
        ],
      ),
      text(28, at(0), "(a) Marked price of 4 boxes = 45 × 4 ="),
      ans("$180"),
      text(28, at(1), "(b) The free box is the discount: 45 / 180 ="),
      ans("25%"),
    ],
  },

  q20: {
    title: "A television marked $4800: 25% off, then 8% off",
    w: 640, h: 470,
    items: [
      title("Tina's television"),
      chain(130, 140, [
        { text: "$4800", name: "marked", color: "blue" },
        { text: "$3600", name: "25% off", color: "pink" },
        { text: "$3312", name: "then 8% off", color: "green" },
      ], ["× 0.75", "× 0.92"], { gap: 190 }),
      text(28, 250, "(a) Overall discount = $(4800 − 3312) ="),
      ans("$1488"),
      text(28, 300, "(b) Overall discount % = 1488 / 4800 ="),
      ans("31%"),
    ],
  },

  q21: {
    title: "Three offers on 10 cans of coke",
    w: 640, h: 540,
    items: [
      title("Which offer is the biggest discount?"),
      bars(
        [
          { name: "Buy 2 get 1", v: 30, text: "30%", color: "blue" },
          { name: "Buy 5 get 2", v: 20, text: "20%", color: "pink" },
          { name: "Half price", v: 25, text: "25%", color: "green" },
        ],
      ),
      text(28, at(0), "(a) Buy 7, get 3 free: 3 / 10 ="),
      ans("30%"),
      text(28, at(1), "(b) Buy 8, get 2 free: 2 / 10 ="),
      ans("20%"),
      text(28, at(2), "(c) 5 full and 5 at half price:"),
      ans("25%"),
    ],
  },

  q22: {
    title: "A necklace marked $2400, which is 60% above cost, sold at 40% off",
    w: 640, h: 500,
    items: [
      title("Silver necklace"),
      bars(
        [
          { name: "Cost", v: 1500, text: "$1500", color: "blue" },
          { name: "Selling", v: 1440, text: "$1440", color: "pink" },
          { name: "Marked", v: 2400, text: "$2400", color: "green" },
        ],
        [null, { label: "60% above cost" }],
      ),
      text(28, at(0), "(a) Selling price = 2400 × (1 − 40%) ="),
      ans("$1440"),
      text(28, at(1), "(b) Cost = 2400 ÷ 1.6 = $1500."),
      text(28, at(2), "Cost $1500 > selling $1440, so"),
      ans("there is a loss"),
    ],
  },

  q23: {
    title: "A camera bought at $1500, sold on at a 20% profit, 10% off the marked price",
    w: 640, h: 540,
    items: [
      title("The camera changes hands"),
      chain(120, 140, [
        { text: "$1500", name: "cost", color: "blue" },
        { text: "$1800", name: "to Yannie", color: "pink" },
        { text: "$2000", name: "marked", color: "green" },
        { text: "$1620", name: "to Winnie", color: "orange" },
      ], ["× 1.2", "÷ 0.9", "Yannie"], { gap: 145 }),
      text(28, 250, "(a) Marked price: 1500 × 1.2 ÷ 0.9 ="),
      ans("$2000"),
      text(28, 300, "(b) Yannie paid $1800 and sells at $1620."),
      text(28, 350, "Loss % = 180 / 1800 × 100% ="),
      ans("10%"),
    ],
  },

  q24: {
    title: "Five pens at $12: 10% off, then $3 off purchases over $50",
    w: 640, h: 470,
    items: [
      title("Five pens"),
      chain(120, 140, [
        { text: "$60", name: "marked", color: "blue" },
        { text: "$54", name: "10% off", color: "pink" },
        { text: "$51", name: "pays", color: "green" },
      ], ["× 0.9", "− $3"], { gap: 190 }),
      text(28, 250, "$54 is over $50, so the extra $3 applies."),
      text(28, 300, "(a) Discount = $(60 − 51) ="),
      ans("$9"),
      text(28, 350, "(b) Discount % = 9 / 60 × 100% ="),
      ans("15%"),
    ],
  },

  q25: {
    title: "A console and a $350 controller sold together for $2739 at a 17% loss",
    w: 640, h: 430,
    items: [
      title("Game set"),
      chain(140, 150, [
        { text: "$2739", name: "sold for", color: "pink" },
        { text: "$3300", name: "total cost", color: "blue" },
        { text: "$2950", name: "console", color: "green" },
      ], ["÷ 0.83", "− $350"], { gap: 190 }),
      text(28, 260, "Total cost = 2739 ÷ (1 − 17%) = $3300."),
      text(28, 310, "Console = $(3300 − 350) ="),
      ans("$2950"),
    ],
  },

  q26: {
    title: "Shop A: 10% off is $600 more than 35% off. Shop B is marked $2200",
    w: 640, h: 500,
    items: [
      title("Where should Kinki buy?"),
      bars(
        [
          { name: "A marked", v: 2400, text: "$2400", color: "blue" },
          { name: "A, 20% off", v: 1920, text: "$1920", color: "blue" },
          { name: "B marked", v: 2200, text: "$2200", color: "pink" },
          { name: "B, 5% off", v: 2090, text: "$2090", color: "pink" },
        ],
      ),
      text(28, at(0), "(a) 0.9y − 0.65y = 600, so shop A is marked"),
      ans("$2400"),
      text(28, at(1), "(b) She pays $1920 in A and $2090 in B."),
      text(28, at(2), "A is cheaper, so"),
      ans("choose shop A"),
    ],
  },

  q27: {
    title: "A necklace sold at $66.5 is a 12.5% loss. What price gives a 25% profit?",
    w: 640, h: 430,
    items: [
      title("Necklace"),
      chain(140, 150, [
        { text: "$66.5", name: "sold, loss", color: "pink" },
        { text: "$76", name: "cost", color: "blue" },
        { text: "$95", name: "new price", color: "green" },
      ], ["÷ 0.875", "× 1.25"], { gap: 190 }),
      text(28, 260, "Cost = 66.5 ÷ (1 − 12.5%) = $76."),
      text(28, 310, "For a 25% profit, sell at 76 × 1.25 ="),
      ans("$95"),
    ],
  },
};
