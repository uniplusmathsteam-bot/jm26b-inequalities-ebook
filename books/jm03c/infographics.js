/**
 * Whiteboard boards for JM03 (C), opened from the tab beside the question
 * number and presented a step at a time in class. Each board first lays the
 * question's data out the way a teacher would on the board (a two-way table,
 * a bar model, a price line), then fills it in following the ANS working
 * (solutions.js). Format: docs/06-infographics.md.
 */

import { title, text, then, ans, frac, chain, arrow, ring, line, brace, table, strip, step } from "../../engine/infographic/kit.js";

/* Blue: given in the question. Green: worked out on the board. Red: the answer. */
const GIVEN = "blue";
const FOUND = "green";
const W = 960;
const G = { color: GIVEN };
const F = { color: FOUND };
const GREY = { color: "grey" };

const legend = () => text(W - 24, 42, "{blue:blue}: given  ·  {green:green}: worked out  ·  {red:red}: answer", { anchor: "end", size: 17, color: "grey" });

/** Sets the variable I apart from the digit 1. */
const v = (s) => s.replace(/(?<![A-Za-z])I(?![A-Za-z])/g, "{v:I}");

/** A working line on the board. */
const say = (x, y, str, o = {}) => text(x, y, str, { size: 23, ...o });

/** Continues a line with a mixed-number percentage, e.g. 14 3/8 %. */
const mixed = (whole, num, den, o = {}) => [
  then(whole, o),
  frac(num, den, { size: 17, color: o.color ?? "ink" }),
  then("%", { ...o, gap: 4 }),
];
const ansMixed = (whole, num, den) => mixed(whole, num, den, { color: "red", mark: "yellow" });

export const INFOGRAPHICS = {
  q1: (() => {
    const T = table(24, 74, [150, 120, 120, 130], [52, 64, 64, 64], { totals: true, size: 23 });
    const [px, py] = T.at(1, 2);
    const [wx, wy] = T.at(3, 2);
    const X = 590;
    return {
      title: "Factory workers: male or female, by train or not",
      w: W, h: 430,
      items: [
        title("Who goes to the factory by train?"),
        legend(),
        T,
        T.cell(0, 1, "Male"),
        T.cell(0, 2, "Female"),
        T.cell(0, 3, "Total", { sub: "% of all" }),
        T.cell(1, 0, "By train"),
        T.cell(2, 0, "Not by train"),
        T.cell(3, 0, "Total"),
        T.cell(3, 1, "420", { sub: "70%", ...G }),
        T.cell(1, 3, "35%", { line: "sub", ...G }),
        T.cell(1, 1, "93", G),
        T.cell(3, 3, "100%", { line: "sub" }),
        step(),
        say(X, 110, "Total workers = 420 ÷ 70% ="),
        then("600", F),
        T.cell(3, 3, "600", { line: "top", ...F }),
        step(),
        say(X, 160, "Female = 600 − 420 ="),
        then("180", F),
        T.cell(3, 2, "180", { sub: "30%", ...F }),
        step(),
        say(X, 210, "By train = 600 × 35% ="),
        then("210", F),
        T.cell(1, 3, "210", { line: "top", ...F }),
        step(),
        say(X, 260, "Female by train = 210 − 93 ="),
        then("117", F),
        T.cell(1, 2, "117", F),
        step(),
        ring(px, py, 40, 22),
        ring(wx, wy + 2, 46, 29, { with: true }),
        say(X, 320, "Female by train ÷ all female"),
        say(X, 380, "="),
        frac("117", "180", { size: 22 }),
        then("× 100% ="),
        ans("65%"),
        step(),
        T.cell(2, 1, "327", GREY),
        T.cell(2, 2, "63", GREY),
        T.cell(2, 3, "390", { sub: "65%", ...GREY }),
        text(24, 362, "Check the empty row:", { size: 19, ...GREY }),
        text(24, 394, "420 − 93 = 327,   180 − 117 = 63,   600 − 210 = 390", { size: 19, ...GREY }),
      ],
    };
  })(),

  q2: (() => {
    const x0 = 110;
    const C = 250;
    const X = 590;
    return {
      title: "Amy has 30% more than Baron. Baron has 10% more than Cathy",
      w: W, h: 480,
      items: [
        title("Who has more candies?"),
        legend(),
        text(24, 120, "Cathy", { size: 22 }),
        text(24, 184, "Baron", { size: 22 }),
        text(24, 248, "Amy", { size: 22 }),
        strip(x0, 92, 40, [{ w: C, color: "orange", text: "C" }]),
        strip(x0, 156, 40, [{ w: C, color: "orange" }, { w: C * 0.1, color: "pink" }]),
        text(x0 + C + 6, 150, "+10% of Cathy", { size: 17, ...G }),
        strip(x0, 220, 40, [{ w: C * 1.1, color: "purple", text: "as many as Baron", textColor: "grey", size: 18 }, { w: C * 0.33, color: "pink" }]),
        text(x0 + C * 1.1 + 6, 214, "+30% of Baron", { size: 17, ...G }),
        say(X, 110, "(a)  Let Cathy have C candies."),
        step(),
        say(X, 160, "Baron = C × (1 + 10%) ="),
        then("1.1C", F),
        text(x0 + C * 1.1 + 12, 184, "1.1C", { size: 22, ...F }),
        step(),
        say(X, 210, "Amy = 1.1C × (1 + 30%) ="),
        then("1.43C", F),
        text(x0 + C * 1.43 + 12, 248, "1.43C", { size: 22, ...F }),
        step(),
        line([[x0 + C, 84], [x0 + C, 268]], { dash: true, color: "grey", width: 1.8 }),
        brace([x0 + C, 270], [x0 + C * 1.43, 270], { color: "red", label: "0.43C more", labelColor: "red" }),
        say(X, 260, "Amy − Cathy = 1.43C − C = 0.43C"),
        say(X, 315, "0.43C ÷ C × 100% ="),
        ans("43%"),
        then("more"),
        step(),
        chain(150, 410, [
          { text: "200", name: "Cathy", color: GIVEN },
          { text: "220", name: "Baron", color: FOUND },
          { text: "286", name: "Amy", color: FOUND },
        ], ["× 1.1", "× 1.3"], { gap: 150 }),
        say(X, 385, "(b)  Cathy = 200"),
        say(X, 435, "Total = 200 + 220 + 286 ="),
        ans("706"),
      ],
    };
  })(),

  q3: (() => {
    const T = table(24, 74, [110, 100, 110, 100, 120], [52, 58, 58, 58]);
    const X = 600;
    return {
      title: "A toy car sold at $300 (20% profit) and a doll at $120 (20% loss)",
      w: W, h: 470,
      items: [
        title("Toy car and doll"),
        legend(),
        T,
        T.cell(0, 1, "Sold at"),
        T.cell(0, 2, "Profit/loss"),
        T.cell(0, 3, "Cost"),
        T.cell(0, 4, "(c) New price"),
        T.cell(1, 0, "Toy car"),
        T.cell(2, 0, "Doll"),
        T.cell(3, 0, "Total"),
        T.cell(1, 1, "$300", G),
        T.cell(2, 1, "$120", G),
        T.cell(1, 2, "+20%", G),
        T.cell(2, 2, "−20%", G),
        T.cell(1, 4, "10% off", { line: "sub", ...G }),
        T.cell(2, 4, "5% off", { line: "sub", ...G }),
        step(),
        say(X, 110, "Car cost = 300 ÷ (1 + 20%) ="),
        then("250", F),
        T.cell(1, 3, "$250", F),
        step(),
        say(X, 160, "Doll cost = 120 ÷ (1 − 20%) ="),
        then("150", F),
        T.cell(2, 3, "$150", F),
        step(),
        T.cell(3, 1, "$420", F),
        T.cell(3, 3, "$400", F),
        say(X, 215, "(a)  Profit = 420 − 400 ="),
        ans("$20"),
        T.cell(3, 2, "+$20", { color: "red" }),
        step(),
        say(X, 275, "(b)"),
        frac("20", "400", { size: 21 }),
        then("× 100% ="),
        ans("5%"),
        step(),
        T.cell(1, 4, "$270", { line: "top", ...F }),
        T.cell(2, 4, "$114", { line: "top", ...F }),
        T.cell(3, 4, "$384", F),
        say(X, 340, "(c)  New total = 270 + 114 = 384"),
        say(X, 390, "Loss = 400 − 384 = $16"),
        say(X, 445, "Loss % ="),
        frac("16", "400", { size: 21 }),
        then("× 100% ="),
        ans("4%"),
      ],
    };
  })(),

  q4: (() => {
    const T = table(24, 74, [110, 120, 100, 140, 140], [52, 62, 62, 56]);
    const X = 670;
    return {
      title: "10 cars marked $120 000. First 8 at 2.5% off, last 2 at 5% off",
      w: W, h: 420,
      items: [
        title("Ten cars"),
        legend(),
        T,
        T.cell(0, 1, "Marked"),
        T.cell(0, 2, "Discount"),
        T.cell(0, 3, "Each sold at"),
        T.cell(0, 4, "Total sold"),
        T.cell(1, 0, "First 8", G),
        T.cell(2, 0, "Last 2", G),
        T.cell(3, 0, "All 10"),
        T.cell(1, 1, "$120 000", G),
        T.cell(2, 1, "$120 000", G),
        T.cell(1, 2, "2.5%", G),
        T.cell(2, 2, "5%", G),
        text(24, 350, "Cost: $100 000 each", { size: 21, ...G }),
        step(),
        T.cell(1, 3, "$117 000", { sub: "× (1 − 2.5%)", ...F }),
        T.cell(1, 4, "$936 000", { sub: "× 8", ...F }),
        step(),
        T.cell(2, 3, "$114 000", { sub: "× (1 − 5%)", ...F }),
        T.cell(2, 4, "$228 000", { sub: "× 2", ...F }),
        step(),
        T.cell(3, 4, "$1 164 000", F),
        say(X, 110, "Selling = $1 164 000", { size: 22 }),
        step(),
        say(X, 160, "Cost = 10 × 100 000", { size: 22 }),
        say(X, 200, "= $1 000 000", { size: 22 }),
        say(X, 250, "Profit = $164 000", { size: 22 }),
        step(),
        say(X, 315, "Profit % =", { size: 22 }),
        frac("164 000", "1 000 000", { size: 19 }),
        then("× 100%"),
        say(X, 375, "=", { size: 22 }),
        ans("16.4%"),
      ],
    };
  })(),

  q5: (() => {
    const T = table(24, 70, [180, 150, 150], [48, 52, 64, 64, 52, 56, 56]);
    const X = 550;
    return {
      title: "Egg tarts: $8 yesterday, $6 today, 120 more sold today",
      w: W, h: 500,
      items: [
        title("Egg tarts, yesterday and today"),
        legend(),
        T,
        T.cell(0, 1, "Yesterday"),
        T.cell(0, 2, "Today"),
        T.cell(1, 0, "Price each"),
        T.cell(2, 0, "Number sold", { sub: "today 120 more", subColor: GIVEN }),
        T.cell(3, 0, "Received", { sub: "today 20% more", subColor: GIVEN }),
        T.cell(4, 0, "(b) Made"),
        T.cell(5, 0, "Cost", { sub: "$3 each", subColor: GIVEN }),
        T.cell(6, 0, "Profit"),
        T.cell(1, 1, "$8", G),
        T.cell(1, 2, "$6", G),
        T.cell(4, 1, "250", G),
        T.cell(4, 2, "350", G),
        step(),
        T.cell(2, 2, "n", { line: "top" }),
        T.cell(2, 1, "n − 120", { line: "top" }),
        T.cell(3, 1, "8(n − 120)", { line: "top" }),
        T.cell(3, 2, "6n", { line: "top" }),
        T.cell(3, 2, "× 1.2 of yesterday", { line: "sub", ...G }),
        step(),
        say(X, 100, "(a)  (8n − 960) × 1.2 = 6n"),
        say(X, 145, "9.6n − 1152 = 6n"),
        say(X, 190, "3.6n = 1152"),
        say(X, 235, "n ="),
        ans("320"),
        then("sold today"),
        T.cell(2, 2, "= 320", { line: "sub", ...F }),
        T.cell(2, 1, "= 200", { line: "sub", ...F }),
        step(),
        T.cell(5, 1, "$750", F),
        T.cell(5, 2, "$1050", F),
        T.cell(6, 1, "$850", F),
        T.cell(6, 2, "$870", F),
        say(X, 300, "(b)(i)  Yesterday: 1600 − 750 = $850"),
        say(X, 345, "Today: 1920 − 1050 = $870"),
        say(X, 390, "Greater profit:"),
        ans("today"),
        step(),
        say(X, 455, "(ii)"),
        frac("870 − 850", "850", { size: 20 }),
        then("× 100% ≈"),
        ans("2.4%"),
      ],
    };
  })(),

  q6: (() => {
    const T = table(24, 128, [150, 130, 130, 130], [48, 56, 56, 56]);
    const [jx] = T.at(0, 1);
    const [fx] = T.at(0, 2);
    const [mx] = T.at(0, 3);
    const top = T.top(0) - 6;
    const X = 600;
    return {
      title: "Bob's income: January 20% less than February, March 20% more",
      w: W, h: 530,
      items: [
        title("Bob's monthly income"),
        legend(),
        arrow([fx - 18, top], [jx + 10, top], { via: [(fx + jx) / 2, top - 44], color: GIVEN, label: "20% less", labelColor: GIVEN, labelSize: 20 }),
        arrow([fx + 18, top], [mx - 10, top], { via: [(fx + mx) / 2, top - 44], color: GIVEN, label: "20% more", labelColor: GIVEN, labelSize: 20, with: true }),
        T,
        T.cell(0, 1, "January"),
        T.cell(0, 2, "February"),
        T.cell(0, 3, "March"),
        T.cell(1, 0, "Income"),
        T.cell(2, 0, "(b) Income"),
        T.cell(3, 0, "(c) + $2000"),
        T.cell(2, 3, "$18 000", G),
        step(),
        T.cell(1, 2, v("I")),
        T.cell(1, 1, v("0.8I"), F),
        T.cell(1, 3, v("1.2I"), F),
        say(X, 150, v("Let February = I.")),
        step(),
        say(X, 200, "(a)(i)  Jan to Feb"),
        say(X, 245, v("0.2I ÷ 0.8I × 100% =")),
        ans("+25%"),
        step(),
        say(X, 295, "(ii)  Jan to Mar"),
        say(X, 340, v("0.4I ÷ 0.8I × 100% =")),
        ans("+50%"),
        step(),
        say(X, 400, v("(b)  1.2I = 18 000, I = 15 000")),
        say(X, 445, "Feb"),
        ans("$15 000"),
        then(", Jan", { gap: 2 }),
        ans("$12 000"),
        T.cell(2, 2, "$15 000", F),
        T.cell(2, 1, "$12 000", F),
        step(),
        T.cell(3, 1, v("0.8I + 2000")),
        T.cell(3, 2, v("I + 2000")),
        T.cell(3, 3, v("1.2I + 2000")),
        say(24, 390, v("(c)  The rise stays 0.2I, but January is now 0.8I + 2000.")),
        say(24, 440, v("0.2I ÷ (0.8I + 2000)  ≠  0.2I ÷ 0.8I")),
        say(24, 490, "So the percentages are"),
        ans("not the same"),
        then(": disagree.", { gap: 2 }),
      ],
    };
  })(),

  q7: (() => {
    const x0 = 140;
    const u = 6;
    const T = table(24, 226, [100, 320, 160, 230], [46, 54, 54, 54]);
    return {
      title: "80 bulbs at $20 each. Sold in parts; then one-fourth break",
      w: W, h: 470,
      items: [
        title("Light bulbs"),
        legend(),
        text(24, 112, "(a)", { size: 22 }),
        strip(x0, 86, 40, [
          { w: 30 * u, color: "blue", text: "30 at $30", textColor: GIVEN },
          { w: 50 * u, color: "green", text: "50 at $22", textColor: GIVEN },
        ]),
        text(24, 176, "(b)", { size: 22 }),
        strip(x0, 150, 40, [
          { w: 20 * u, color: "grey", fill: "rgba(125, 135, 147, 0.22)", text: "1/4 broken", textColor: GIVEN },
          { w: 60 * u, color: "orange", text: "60 unbroken", textColor: "ink" },
        ]),
        say(660, 112, "80 bulbs at $20", G),
        step(),
        say(660, 168, "Cost = 80 × 20 ="),
        then("$1600", F),
        T,
        T.cell(0, 1, "Selling price"),
        T.cell(0, 2, "Profit / loss"),
        T.cell(0, 3, "Per cent"),
        T.cell(1, 0, "(a)"),
        T.cell(2, 0, "(b)(i)"),
        T.cell(3, 0, "(b)(ii)"),
        step(),
        T.cell(1, 1, "30 × 30 + 50 × 22 = $2000", F),
        T.cell(1, 2, "+$400", F),
        T.cell(1, 3, "400 ÷ 1600 = 25%", { color: "red" }),
        step(),
        T.cell(2, 1, "60 × 22 = $1320", F),
        T.cell(2, 2, "−$280", F),
        T.cell(2, 3, "280 ÷ 1600 = 17.5%", { color: "red" }),
        step(),
        T.cell(3, 2, "+20%", G),
        T.cell(3, 1, "60p = 1600 × 1.2 = 1920", F),
        T.cell(3, 3, "p = 1920 ÷ 60 = $32", { color: "red" }),
      ],
    };
  })(),

  q8: (() => {
    const y = 210;
    const X = (v) => 60 + v * 4.48;
    const tick = (v) => line([[X(v), y - 9], [X(v), y + 9]], { width: 2.4 });
    const label = (v, name, expr, o = {}) => [
      text(X(v), 140, name, { anchor: "middle", size: 20, ...(o.nameColor ? { color: o.nameColor } : G) }),
      text(X(v), 170, expr, { anchor: "middle", size: 22, ...(o.color ? { color: o.color } : {}) }),
    ];
    const value = (v, str) => text(X(v), 242, str, { anchor: "middle", size: 21, ...F });
    return {
      title: "20% off gives a 20% profit; 60% off loses $50",
      w: W, h: 545,
      items: [
        title("A pair of shoes"),
        legend(),
        arrow([X(0) - 10, y], [X(187.5) + 30, y], { bend: 0, color: "grey", width: 2.2 }),
        tick(0),
        text(X(0), 242, "$0", { anchor: "middle", size: 19, ...GREY }),
        tick(187.5),
        label(187.5, "marked", "y"),
        tick(75),
        label(75, "60% off", "0.4y"),
        tick(150),
        label(150, "20% off", "0.8y"),
        step(),
        tick(125),
        label(125, "cost", "0.4y + 50", { nameColor: "ink", color: FOUND }),
        arrow([X(75) + 4, y + 42], [X(125) - 4, y + 42], { via: [X(100), y + 92], color: GIVEN, label: "+ $50", sub: "loss is $50", labelColor: GIVEN, labelSize: 21 }),
        say(24, 380, "Selling at 60% off loses $50, so cost = 0.4y + 50."),
        step(),
        arrow([X(125) + 4, y + 42], [X(150) - 4, y + 42], { via: [X(137.5), y + 92], color: GIVEN, label: "× 1.2", sub: "profit 20%", labelColor: GIVEN, labelSize: 21 }),
        say(24, 425, "20% off makes a 20% profit:  0.8y = (0.4y + 50) × 1.2"),
        step(),
        say(24, 470, "0.8y = 0.48y + 60,  0.32y = 60,  marked price y ="),
        ans("$187.5"),
        step(),
        say(24, 515, "Cost = 0.4 × 187.5 + 50 ="),
        ans("$125"),
        value(75, "$75"),
        value(125, "$125"),
        value(150, "$150"),
        value(187.5, "$187.5"),
      ],
    };
  })(),

  q9: (() => {
    const T = table(24, 74, [110, 90, 100, 140, 110, 180], [50, 62, 62, 56]);
    return {
      title: "80 shirts at $50 (30% profit) and some dresses at $200 (20% loss)",
      w: W, h: 565,
      items: [
        title("Shirts and dresses"),
        legend(),
        T,
        T.cell(0, 1, "Number"),
        T.cell(0, 2, "Cost each"),
        T.cell(0, 3, "Total cost"),
        T.cell(0, 4, "Sold at"),
        T.cell(0, 5, "Total selling"),
        T.cell(1, 0, "Shirts"),
        T.cell(2, 0, "Dresses"),
        T.cell(3, 0, "Total"),
        T.cell(1, 1, "80", G),
        T.cell(2, 1, "y"),
        T.cell(1, 2, "$50", G),
        T.cell(2, 2, "$200", G),
        T.cell(1, 4, "+30%", G),
        T.cell(2, 4, "−20%", G),
        T.cell(3, 4, "loss $1000", G),
        step(),
        T.cell(1, 3, "$4000", F),
        T.cell(2, 3, "$200y", F),
        T.cell(3, 3, "4000 + 200y", F),
        step(),
        T.cell(1, 5, "$5200", { sub: "50 × 1.3 × 80", ...F }),
        T.cell(2, 5, "$160y", { sub: "200 × 0.8 × y", ...F }),
        T.cell(3, 5, "5200 + 160y", F),
        step(),
        say(24, 340, "(a)  Cost − selling = loss", { size: 22 }),
        say(24, 385, "(4000 + 200y) − (5200 + 160y) = 1000", { size: 22 }),
        say(24, 430, "40y − 1200 = 1000", { size: 22 }),
        say(24, 475, "y =", { size: 22 }),
        ans("55"),
        then("dresses"),
        step(),
        say(490, 340, "(b)  No profit or loss: selling = cost", { size: 22 }),
        say(490, 385, "5200 + 200 × 55 × (1 − z%) = 4000 + 200 × 55", { size: 21 }),
        say(490, 430, "5200 + 11 000 × (1 − z%) = 15 000", { size: 22 }),
        say(490, 475, "16 200 − 110z = 15 000", { size: 22 }),
        say(490, 525, "Loss per cent z =", { size: 22 }),
        ansMixed("10", "10", "11"),
      ],
    };
  })(),

  q10: (() => {
    const T = table(24, 70, [200, 110, 110, 110], [48, 46, 46, 54, 54, 54, 54], { size: 22 });
    const X = 590;
    return {
      title: "500 soft toys at $32 each, three ways to price them",
      w: W, h: 480,
      items: [
        title("Which option earns more?"),
        legend(),
        T,
        T.cell(0, 0, "Option"),
        T.cell(0, 1, "I"),
        T.cell(0, 2, "II"),
        T.cell(0, 3, "III"),
        T.cell(1, 0, "Profit per cent"),
        T.cell(2, 0, "% sold"),
        T.cell(3, 0, "(a) Price each"),
        T.cell(4, 0, "Sold / unsold"),
        T.cell(5, 0, "(b) Profit, discard"),
        T.cell(6, 0, "(c) Profit, return"),
        ...["30%", "40%", "50%"].map((s, i) => T.cell(1, i + 1, s, G)),
        ...["90%", "80%", "70%"].map((s, i) => T.cell(2, i + 1, s, G)),
        say(X, 110, "500 toys at $32 each", G),
        step(),
        say(X, 160, "Price = 32 × (1 + 30%) ="),
        then("$41.6", F),
        ...["$41.6", "$44.8", "$48"].map((s, i) => T.cell(3, i + 1, s, F)),
        step(),
        say(X, 210, "Sold = 500 × 90% = 450"),
        ...["450 / 50", "400 / 100", "350 / 150"].map((s, i) => T.cell(4, i + 1, s, F)),
        step(),
        say(X, 265, "Profit = 41.6 × 450 − 32 × 500"),
        say(X, 305, "= $2720   (II and III alike)", { size: 21 }),
        ...["$2720", "$1920", "$800"].map((s, i) => T.cell(5, i + 1, s, F)),
        ring(...T.at(5, 1), 46, 21),
        say(X, 350, "Discarded: choose"),
        ans("option I"),
        step(),
        say(X, 405, "Profit = 2720 + 18 × 50 = $3620"),
        ...["$3620", "$3720", "$3500"].map((s, i) => T.cell(6, i + 1, s, F)),
        ring(...T.at(6, 2), 46, 21),
        say(X, 450, "Returned: choose"),
        ans("option II"),
      ],
    };
  })(),

  q11: (() => {
    const x0 = 150;
    const s = 1.5;
    const slab = ["blue", "green", "pink", "orange"];
    const row = (y, label, parts) => [
      text(24, y + 27, label, { size: 22 }),
      strip(x0, y, 40, parts.map(([amt, t], i) => ({ w: amt * s, color: slab[i], text: t, textColor: "ink", size: 19 }))),
    ];
    return {
      title: "10% off the first $200, 20% the next $100, 30% the next $100, 40% the rest",
      w: W, h: 560,
      items: [
        title("Discount in slabs"),
        legend(),
        row(84, "Offer", [[200, "10% off"], [100, "20% off"], [100, "30% off"], [107, "40% off"]]),
        ...[0, 200, 300, 400].map((v) => text(x0 + v * s, 146, `$${v}`, { anchor: "middle", size: 18, ...GREY })),
        text(x0 + 507 * s, 146, "the rest", { anchor: "end", size: 18, ...GREY }),
        step(),
        row(176, "$320", [[200, "$20"], [100, "$20"], [20, "$6"]]),
        step(),
        say(24, 250, "(a)(i)  20 + 20 + 6 = $46,   46 ÷ 320 × 100% =", { size: 22 }),
        ansMixed("14", "3", "8"),
        step(),
        row(282, "$480", [[200, "$20"], [100, "$20"], [100, "$30"], [80, "$32"]]),
        step(),
        say(24, 356, "(ii)  20 + 20 + 30 + 32 = $102,   102 ÷ 480 × 100% =", { size: 22 }),
        ansMixed("21", "1", "4"),
        step(),
        row(388, "400 + x", [[200, "$20"], [100, "$20"], [100, "$30"], [50, "40% of x"]]),
        step(),
        say(24, 470, "(b)  (400 + x) × 20% = 70 + 0.4x", { size: 22 }),
        say(24, 515, "80 + 0.2x = 70 + 0.4x,  x = 50,  he bought", { size: 22 }),
        ans("$450"),
      ],
    };
  })(),

  q12: (() => {
    const T = table(24, 74, [140, 200, 240], [48, 62, 62, 62, 62]);
    const X = 650;
    return {
      title: "Shop A: jacket $1 600 and a free T-shirt. Shop B: 39% and 14% off",
      w: W, h: 545,
      items: [
        title("Jacket and T-shirt"),
        legend(),
        T,
        T.cell(0, 1, "Shop A"),
        T.cell(0, 2, "Shop B"),
        T.cell(1, 0, "Jacket"),
        T.cell(2, 0, "T-shirt"),
        T.cell(3, 0, "Discount"),
        T.cell(4, 0, "You pay"),
        T.cell(1, 1, "$1600", { line: "top", ...G }),
        T.cell(2, 1, "$x, free", { line: "top", ...G }),
        T.cell(3, 1, "36% of (x + 1600)", { line: "top", ...G }),
        T.cell(1, 2, "$y, 39% off", { line: "top", ...G }),
        T.cell(2, 2, "$(x − 200), 14% off", { line: "top", ...G }),
        T.cell(3, 2, "$800", G),
        step(),
        T.cell(3, 1, "= x, the T-shirt", { line: "sub" }),
        say(X, 110, "(a)  (x + 1600) × 36% = x"),
        say(X, 155, "0.36x + 576 = x"),
        say(X, 200, "0.64x = 576"),
        say(X, 245, "x ="),
        ans("$900"),
        T.cell(2, 1, "= $900", { line: "sub", ...F }),
        step(),
        T.cell(2, 2, "= $700", { line: "sub", ...F }),
        say(X, 305, "(b)(i)  0.39y + 0.14 × 700 = 800"),
        say(X, 350, "0.39y = 702"),
        say(X, 395, "y ="),
        ans("$1800"),
        T.cell(1, 2, "= $1800", { line: "sub", ...F }),
        step(),
        T.cell(4, 1, "$1600", { line: "top", ...F }),
        T.cell(4, 1, "jacket only", { line: "sub" }),
        T.cell(4, 2, "$1700", { line: "top", ...F }),
        T.cell(4, 2, "1800 + 700 − 800", { line: "sub" }),
        say(X, 460, "(ii)  1600 < 1700, choose"),
        ans("shop A"),
      ],
    };
  })(),

  q13: (() => {
    const x0 = 150;
    const c = 120;
    const X = 590;
    return {
      title: "Sold at 50% off, a profit of 50%. Is the marked price a 100% profit?",
      w: W, h: 420,
      items: [
        title("The handbag"),
        legend(),
        text(24, 120, "Cost", { size: 22 }),
        text(24, 190, "50% off", { size: 22 }),
        text(24, 260, "Marked", { size: 22 }),
        strip(x0, 94, 40, [{ w: c, color: "blue", text: "c" }]),
        strip(x0, 164, 40, [{ w: c, color: "blue", text: "c" }, { w: c / 2, color: "green" }]),
        text(x0 + c + 6, 158, "+50% profit", { size: 17, ...G }),
        strip(x0, 234, 40, [{ w: c * 1.5, color: "pink", text: "half" }, { w: c * 1.5, color: "pink", text: "half" }]),
        line([[x0 + c * 1.5, 208], [x0 + c * 1.5, 232]], { dash: true, color: GIVEN, width: 1.8 }),
        say(X, 110, "Let cost = c, marked price = p."),
        step(),
        say(X, 160, "p × (1 − 50%) = c × (1 + 50%)"),
        say(X, 205, "0.5p = 1.5c, so p ="),
        then("3c", F),
        text(x0 + c * 1.5 + 12, 190, "1.5c", { size: 22, ...F }),
        text(x0 + c * 3 + 12, 260, "3c", { size: 22, ...F }),
        step(),
        line([[x0 + c, 86], [x0 + c, 284]], { dash: true, color: "grey", width: 1.8 }),
        brace([x0 + c, 286], [x0 + c * 3, 286], { color: "red", label: "profit 2c", labelColor: "red" }),
        say(X, 265, "Profit = 3c − c = 2c"),
        say(X, 315, "2c ÷ c × 100% ="),
        ans("200%"),
        step(),
        say(X, 375, "200% ≠ 100%, so"),
        ans("disagree"),
      ],
    };
  })(),

  q14: (() => {
    const T = table(24, 74, [130, 100, 110, 110, 150], [48, 62, 62, 56]);
    const X = 655;
    return {
      title: "Sunset Cooler: 100 mL orange juice and 150 mL cranberry juice, sold at $32.5",
      w: W, h: 460,
      items: [
        title("A glass of Sunset Cooler"),
        legend(),
        T,
        T.cell(0, 1, "Volume"),
        T.cell(0, 2, "Per mL"),
        T.cell(0, 3, "Cost"),
        T.cell(0, 4, "(b) New cost"),
        T.cell(1, 0, "Orange"),
        T.cell(2, 0, "Cranberry"),
        T.cell(3, 0, "A glass"),
        T.cell(1, 1, "100 mL", G),
        T.cell(2, 1, "150 mL", G),
        T.cell(1, 2, "$0.04", G),
        T.cell(2, 2, "$b", { line: "top", ...G }),
        T.cell(1, 4, "+13%", { line: "sub", ...G }),
        T.cell(2, 4, "−13%", { line: "sub", ...G }),
        text(24, 335, "Sold at $32.5 with a profit of 150%", { size: 21, ...G }),
        step(),
        T.cell(1, 3, "$4", F),
        T.cell(2, 3, "$150b", { line: "top", ...F }),
        say(X, 110, "(a)  Cost × (1 + 150%) = 32.5", { size: 22 }),
        say(X, 155, "Cost = 32.5 ÷ 2.5 = $13", { size: 22 }),
        T.cell(3, 3, "$13", F),
        step(),
        say(X, 205, "4 + 150b = 13", { size: 22 }),
        say(X, 250, "b = 9 ÷ 150 =", { size: 22 }),
        ans("0.06"),
        T.cell(2, 2, "= 0.06", { line: "sub", ...F }),
        T.cell(2, 3, "= $9", { line: "sub", ...F }),
        step(),
        T.cell(1, 4, "4 × 1.13", { line: "top", ...F }),
        T.cell(2, 4, "9 × 0.87", { line: "top", ...F }),
        T.cell(3, 4, "$12.35", F),
        say(X, 315, "(b)  New cost = $12.35", { size: 22 }),
        say(X, 370, "Decrease =", { size: 22 }),
        frac("13 − 12.35", "13", { size: 19 }),
        then("× 100%"),
        say(X, 425, "=", { size: 22 }),
        ans("5%"),
      ],
    };
  })(),

  q15: (() => {
    const T = table(24, 74, [150, 130, 160, 130], [48, 62, 62, 62]);
    const X = 630;
    return {
      title: "$1000 of stationery and books: two discount methods give the same discount",
      w: W, h: 500,
      items: [
        title("Stationery and books"),
        legend(),
        T,
        T.cell(0, 1, "Stationery"),
        T.cell(0, 2, "Books"),
        T.cell(0, 3, "Total"),
        T.cell(1, 0, "Marked"),
        T.cell(2, 0, "Method 1"),
        T.cell(3, 0, "Method 2", { sub: "$12 off per $150", subColor: GIVEN }),
        T.cell(1, 3, "$1000", G),
        T.cell(2, 1, "10% off", { line: "top", ...G }),
        T.cell(2, 2, "5% off", { line: "top", ...G }),
        T.cell(3, 1, "—", GREY),
        T.cell(3, 2, "—", GREY),
        step(),
        T.cell(1, 1, "$m", { line: "top" }),
        T.cell(1, 2, "$(1000 − m)", { line: "top" }),
        step(),
        T.cell(2, 1, "0.1m", { line: "sub", ...F }),
        T.cell(2, 2, "0.05(1000 − m)", { line: "sub", ...F }),
        T.cell(2, 3, "0.05m + 50", F),
        say(X, 110, "Method 1: 0.1m + 0.05(1000 − m)", { size: 22 }),
        say(X, 150, "= 0.05m + 50", { size: 22 }),
        step(),
        say(X, 210, "Method 2: 1000 ÷ 150 ≈ 6.67", { size: 22 }),
        say(X, 250, "6 full lots: 6 × $12 = $72", { size: 22 }),
        T.cell(3, 3, "$72", F),
        step(),
        say(X, 310, "0.05m + 50 = 72,  m = 440", { size: 22 }),
        T.cell(1, 1, "= $440", { line: "sub", ...F }),
        T.cell(1, 2, "= $560", { line: "sub", ...F }),
        step(),
        say(X, 375, "Less by", { size: 22 }),
        frac("560 − 440", "560", { size: 19 }),
        then("× 100%"),
        say(X, 435, "=", { size: 22 }),
        ansMixed("21", "3", "7"),
      ],
    };
  })(),

  q16: (() => {
    const x0 = 150;
    const C = 140;
    const X = 590;
    return {
      title: "The cost of a bracelet is x% lower than its selling price. Profit is 150%",
      w: W, h: 340,
      items: [
        title("The bracelet"),
        legend(),
        text(24, 120, "Selling", { size: 22 }),
        text(24, 200, "Cost", { size: 22 }),
        strip(x0, 94, 40, [{ w: C, color: "blue", text: "C" }, { w: C * 1.5, color: "green", text: "profit 150%", textColor: GIVEN }]),
        strip(x0, 174, 40, [{ w: C, color: "blue", text: "C" }]),
        brace([x0 + C, 222], [x0 + C * 2.5, 222], { color: GIVEN, label: "x% of the selling price", labelColor: GIVEN }),
        line([[x0 + C, 86], [x0 + C, 220]], { dash: true, color: "grey", width: 1.8 }),
        step(),
        say(X, 110, "Selling = C × (1 + 150%) ="),
        then("2.5C", F),
        step(),
        say(X, 165, "2.5C × (1 − x%) = C"),
        say(X, 215, "1 − x% = 0.4"),
        step(),
        say(X, 270, "x% = 0.6, so x ="),
        ans("60"),
        text(x0 + C * 2.5 + 12, 120, "100%", { size: 21, ...F }),
        text(x0 + C + 12, 200, "40%", { size: 21, ...F }),
      ],
    };
  })(),
};
