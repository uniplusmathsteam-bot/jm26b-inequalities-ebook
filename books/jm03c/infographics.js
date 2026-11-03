/**
 * Whiteboard scenario boards for JM03 (C), opened from the tab beside the
 * question number. Numbers follow the ANS key (solutions.js). Format:
 * docs/06-infographics.md.
 */

import { title, text, then, ans, flow, chain, arrow } from "../../engine/infographic/kit.js";

function bars(nodes, steps) {
  return flow({
    x0: 36, x1: 604, base: 292, maxH: 112, barW: nodes.length > 3 ? 68 : 84,
    nodes, steps,
  });
}

const Y0 = 360;
const at = (i) => Y0 + i * 36;

export const INFOGRAPHICS = {
  q1: {
    title: "Factory workers: 70% male, 35% by train",
    w: 640, h: 540,
    items: [
      title("Who goes to the factory by train?"),
      bars([
        { name: "Male", v: 420, text: "420", color: "blue" },
        { name: "Female", v: 180, text: "180", color: "pink" },
        { name: "By train", v: 210, text: "210", color: "green" },
        { name: "Female, train", v: 117, text: "117", color: "orange" },
      ]),
      text(28, at(0), "70% are male and there are 420 men, so the factory has 600 workers."),
      text(28, at(1), "Women = 600 − 420 = 180. Train = 35% of 600 = 210."),
      text(28, at(2), "Women on the train = 210 − 93 = 117."),
      text(28, at(3), "117 / 180 × 100% ="),
      ans("65%"),
    ],
  },

  q2: {
    title: "Amy, Baron and Cathy's candies",
    w: 600,
    h: 620,
    items: [
      title("Who has more candies?"),
      flow({
        x0: 70, x1: 530, base: 310, maxH: 150, barW: 84,
        nodes: [
          { name: "Cathy", v: 1, text: "C", color: "green" },
          { name: "Baron", v: 1.1, text: "1.1C", color: "blue" },
          { name: "Amy", v: 1.43, text: "1.43C", color: "pink" },
        ],
        steps: [
          { label: "×1.1", sub: "10% more" },
          { label: "×1.3", sub: "30% more" },
        ],
      }),
      arrow([112, 360], [488, 360], { via: [300, 414], color: "red", label: "×1.1 × 1.3 = ×1.43", labelSize: 25 }),
      text(26, 470, "(a)"),
      then("1.43C = C + {red:0.43C}"),
      then("so Amy has"),
      ans("43% more"),
      then("than Cathy"),
      text(26, 532, "(b)"),
      chain(120, 532, [
        { text: "200", name: "Cathy", color: "green" },
        { text: "220", name: "Baron", color: "blue" },
        { text: "286", name: "Amy", color: "pink" },
      ], ["×1.1", "×1.3"], { gap: 160 }),
      text(26, 600, "Total = 200 + 220 + 286 ="),
      ans("706 candies"),
    ],
  },

  q3: {
    title: "A toy car at $300 (20% profit) and a doll at $120 (20% loss)",
    w: 640, h: 580,
    items: [
      title("Car and doll, then a sale"),
      bars([
        { name: "Car cost", v: 250, text: "$250", color: "blue" },
        { name: "Doll cost", v: 150, text: "$150", color: "pink" },
        { name: "First sale", v: 420, text: "$420", color: "green" },
        { name: "After sale", v: 384, text: "$384", color: "orange" },
      ]),
      text(28, at(0), "(a) Costs $250 + $150 = $400. First selling price $420."),
      text(28, at(1), "Profit $(420 − 400) ="),
      ans("$20"),
      text(28, at(2), "(b) Profit % = 20 / 400 ="),
      ans("5%"),
      text(28, at(3), "(c) After 10% and 5% off: $270 + $114 = $384."),
      text(28, at(4), "Loss $(400 − 384) = $16, which is"),
      ans("4%"),
    ],
  },

  q4: {
    title: "10 cars marked $120 000. First 8 at 2.5% off, last 2 at 5% off",
    w: 640, h: 500,
    items: [
      title("Ten cars"),
      bars([
        { name: "First 8", v: 936000, text: "$936 000", color: "blue" },
        { name: "Last 2", v: 228000, text: "$228 000", color: "pink" },
        { name: "Profit", v: 164000, text: "$164 000", color: "green" },
      ]),
      text(28, at(0), "Selling price = 120 000 × 0.975 × 8 + 120 000 × 0.95 × 2"),
      text(28, at(1), "= $1 164 000. Cost of 10 cars = $1 000 000."),
      text(28, at(2), "Profit % = 164 000 / 1 000 000 ="),
      ans("16.4%"),
    ],
  },

  q5: {
    title: "Egg tarts were $8. Today they are $6, and 120 more are sold",
    w: 640, h: 500,
    items: [
      title("Egg tarts, yesterday and today"),
      bars([
        { name: "Yesterday", v: 850, text: "$850", color: "blue" },
        { name: "Today", v: 870, text: "$870", color: "green" },
      ], [{ label: "+ $20", sub: "profit" }]),
      text(28, at(0), "(a) Takings today are 20% more, so 320 tarts are sold today."),
      text(28, at(1), "(b) Yesterday's profit $850. Today's profit $870."),
      text(28, at(2), "Today is greater by (870 − 850) / 850 ="),
      ans("2.4%"),
    ],
  },

  q6: {
    title: "January is 20% less than February. March is 20% more. March is $18 000",
    w: 640, h: 580,
    items: [
      title("Bob's monthly income"),
      bars([
        { name: "January", v: 0.8, text: "0.8I", color: "pink" },
        { name: "February", v: 1, text: "I", color: "blue" },
        { name: "March", v: 1.2, text: "1.2I", color: "green" },
      ], [
        { label: "+25%", sub: "Jan to Feb" },
        { label: "×1.2", sub: "Feb to Mar" },
      ]),
      text(28, at(0), "(a) January to February is +25%. January to March is"),
      ans("+50%"),
      text(28, at(1), "(b) March is $18 000, so February is"),
      ans("$15 000"),
      then("and January is"),
      ans("$12 000"),
      text(28, at(2), "(c) An extra $2 000 each month changes the base."),
      text(28, at(3), "The percentages are"),
      ans("not the same"),
      then("as in (a)."),
    ],
  },

  q7: {
    title: "80 bulbs at $20. Some break. The rest must still make 20%",
    w: 640, h: 540,
    items: [
      title("Light bulbs"),
      bars([
        { name: "Cost", v: 1600, text: "$1600", color: "ink" },
        { name: "30 at $30", v: 2000, text: "$2000", color: "green" },
        { name: "60 at $22", v: 1320, text: "$1320", color: "pink" },
        { name: "60 at $32", v: 1920, text: "$1920", color: "blue" },
      ]),
      text(28, at(0), "(a) 30 at $30 and 50 at $22: profit $400, which is"),
      ans("25%"),
      text(28, at(1), "(b) A quarter break. 60 sold at $22 is a loss of"),
      ans("17.5%"),
      text(28, at(2), "A 20% profit on $1 600 needs $1 920, so each bulb is"),
      ans("$32"),
    ],
  },

  q8: {
    title: "20% off the marked price is a 20% profit. 60% off loses $50",
    w: 640, h: 470,
    items: [
      title("A pair of shoes"),
      bars([
        { name: "60% off", v: 75, text: "$75", color: "pink" },
        { name: "Cost", v: 125, text: "$125", color: "ink" },
        { name: "20% off", v: 150, text: "$150", color: "green" },
        { name: "Marked", v: 187.5, text: "$187.5", color: "blue" },
      ]),
      text(28, at(0), "20% off still makes 20%, and 60% off loses $50."),
      text(28, at(1), "Marked price"),
      ans("$187.5"),
      then("and the cost is"),
      ans("$125"),
    ],
  },

  q9: {
    title: "80 shirts at $50, sold at 30% profit. Dresses at $200, sold at a 20% loss",
    w: 640, h: 500,
    items: [
      title("Shirts and dresses"),
      bars([
        { name: "Shirt cost", v: 4000, text: "$4000", color: "blue" },
        { name: "Shirt sale", v: 5200, text: "$5200", color: "green" },
        { name: "55 dresses", v: 11000, text: "$11 000", color: "pink" },
      ]),
      text(28, at(0), "(a) Overall loss $1 000 fixes the number of dresses at"),
      ans("55"),
      text(28, at(1), "(b) To break even, sell the dresses at a loss of"),
      ans("10 10/11%"),
    ],
  },

  q10: {
    title: "500 toys at $32. Three ways to price them",
    w: 640, h: 540,
    items: [
      title("Which option earns more?"),
      bars([
        { name: "I discarded", v: 2720, text: "$2720", color: "blue" },
        { name: "II discarded", v: 1920, text: "$1920", color: "green" },
        { name: "III discarded", v: 800, text: "$800", color: "orange" },
      ]),
      text(28, at(0), "(a) Selling prices: I $41.6, II $44.8, III $48."),
      text(28, at(1), "(b) If unsold toys are thrown away, choose"),
      ans("option I"),
      text(28, at(2), "(c) Returned at $18: profits $3620, $3720, $3500."),
      text(28, at(3), "Then choose"),
      ans("option II"),
    ],
  },

  q11: {
    title: "10% off the first $200, then 20%, 30% and 40%",
    w: 640, h: 500,
    items: [
      title("Discount slabs"),
      bars([
        { name: "First $200", v: 10, text: "10%", color: "blue" },
        { name: "Next $100", v: 20, text: "20%", color: "green" },
        { name: "Next $100", v: 30, text: "30%", color: "pink" },
        { name: "The rest", v: 40, text: "40%", color: "orange" },
      ]),
      text(28, at(0), "(a) On $320 the discount is 46 / 320 ="),
      ans("14 3/8%"),
      text(28, at(1), "On $480 the discount is 102 / 480 ="),
      ans("21 1/4%"),
      text(28, at(2), "(b) An overall 20% on more than $400 means he bought"),
      ans("$450"),
    ],
  },

  q12: {
    title: "Shop A: jacket $1 600 and a free T-shirt, 36% off overall",
    w: 640, h: 500,
    items: [
      title("Jacket and T-shirt"),
      bars([
        { name: "A, you pay", v: 1600, text: "$1600", color: "blue" },
        { name: "B, you pay", v: 1700, text: "$1700", color: "pink" },
      ], [{ label: "A is cheaper" }]),
      text(28, at(0), "(a) The free T-shirt is the whole discount, so it is marked"),
      ans("$900"),
      text(28, at(1), "(b) In shop B the jacket is $1 800 and the T-shirt $700."),
      text(28, at(2), "She pays $1 700 there. $1 600 < $1 700, so choose"),
      ans("shop A"),
    ],
  },

  q13: {
    title: "50% off a handbag still makes a 50% profit",
    w: 640, h: 520,
    items: [
      title("Is the marked price only a 100% profit?"),
      bars([
        { name: "Cost", v: 1, text: "c", color: "ink" },
        { name: "50% off", v: 1.5, text: "1.5c", color: "pink" },
        { name: "Marked", v: 3, text: "3c", color: "blue" },
      ], [
        { label: "50% profit" },
        { label: "× 2" },
      ]),
      text(28, at(0), "Half the marked price is 1.5 times the cost, so the marked price is 3c."),
      text(28, at(1), "Profit at the marked price = 2c / c ="),
      ans("200%"),
      text(28, at(2), "That is not the claimed 100%. The claim is"),
      ans("disagreed"),
    ],
  },

  q14: {
    title: "Sunset Cooler: orange juice and cranberry juice, sold at $32.5",
    w: 640, h: 500,
    items: [
      title("A glass of Sunset Cooler"),
      bars([
        { name: "Orange", v: 4, text: "$4", color: "orange" },
        { name: "Cranberry", v: 9, text: "$9", color: "pink" },
        { name: "Selling", v: 32.5, text: "$32.5", color: "green" },
      ]),
      text(28, at(0), "(a) A 150% profit means the price is 2.5 times the cost."),
      text(28, at(1), "Cost = $13, so b ="),
      ans("0.06"),
      text(28, at(2), "(b) After +13% and −13% the cost is $12.35."),
      text(28, at(3), "The decrease is 0.65 / 13 ="),
      ans("5%"),
    ],
  },

  q15: {
    title: "Two discount methods on $1 000 of stationery and books",
    w: 640, h: 500,
    items: [
      title("Stationery and books"),
      bars([
        { name: "Method 1", v: 72, text: "$72", color: "blue" },
        { name: "Method 2", v: 72, text: "$72", color: "green" },
        { name: "Stationery", v: 440, text: "$440", color: "pink" },
        { name: "Books", v: 560, text: "$560", color: "orange" },
      ]),
      text(28, at(0), "The two discounts are equal, both $72."),
      text(28, at(1), "Stationery is marked"),
      ans("$440"),
      then("and the books"),
      ans("$560"),
      text(28, at(2), "Stationery is less than the books by 120 / 560 ="),
      ans("21 3/7%"),
    ],
  },

  q16: {
    title: "The cost of a bracelet is x% below its selling price. Profit is 150%",
    w: 640, h: 430,
    items: [
      title("Bracelet"),
      bars([
        { name: "Cost", v: 40, text: "0.4S", color: "blue" },
        { name: "Selling", v: 100, text: "S", color: "green" },
      ], [{ label: "profit 150%", sub: "S = 2.5 × cost" }]),
      text(28, at(0), "A 150% profit means the selling price is 2.5 times the cost."),
      text(28, at(1), "So the cost is 60% lower than the selling price:"),
      ans("x = 60"),
    ],
  },
};
