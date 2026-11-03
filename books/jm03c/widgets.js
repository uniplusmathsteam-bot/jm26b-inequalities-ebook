/**
 * Bar pictures for JM03 (C) Percentages I. Each question has a card, a
 * picture of the amounts, a slider and a live check. No function graphs.
 */

import { C, T, scene, clear, bar, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

function num(v, dp = 2) {
  const n = Math.round(v * 10 ** dp) / 10 ** dp;
  const neg = n < 0;
  const [i, f = ""] = Math.abs(n).toFixed(dp).split(".");
  const int = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  const frac = f.replace(/0+$/, "");
  return `${neg ? "−" : ""}${int}${frac ? `.${frac}` : ""}`;
}

function tex(v, dp = 2) {
  return num(v, dp).replace(/ /g, "\\ ").replace("−", "-");
}

function live(root, cfg) {
  const svg = scene(640, cfg.h || 188);
  const s = slider(cfg.slider);
  const r = readout();
  root.append(
    question(cfg.q, cfg.lets || []),
    svg,
    s.el,
    r.el,
    cfg.buttons ? buttonRow(cfg.buttons.map(([label, v]) => [label, () => s.set(v)])) : null,
  );
  const draw = (v) => {
    clear(svg);
    cfg.draw(svg, v, r);
  };
  s.on(draw);
  draw(s.get());
}

function bars(svg, items, title) {
  if (title) T(svg, 16, 18, title, { "font-weight": 700, "font-size": 14, fill: C.ink });
  const max = Math.max(...items.map((it) => Math.abs(it.v)), 1);
  const x0 = 156;
  const span = 330;
  const top = title ? 30 : 8;
  items.forEach((it, i) => {
    const y = top + i * 34;
    T(svg, 10, y + 17, it.name, { "font-size": 13, fill: C.ink });
    const w = Math.max(2, (Math.abs(it.v) / max) * span);
    bar(svg, x0, y + 2, w, 20, it.color || C.blue);
    const label = it.label ?? num(it.v, it.dp ?? 0);
    if (w > label.length * 7.2 + 12) T(svg, x0 + 8, y + 16, label, { fill: "#fff", "font-weight": 700, "font-size": 12 });
    else T(svg, Math.min(612, x0 + w + 8), y + 16, label, { "font-size": 12, fill: C.ink });
  });
}

function q1(root) {
  live(root, {
    h: 188,
    q: "70% of the workers are male. 35% go by train, of whom 93 are male. 420 workers are male. What percentage of the female workers go by train?",
    lets: ["Let $n$ be the total number of workers.", "Female workers by train $\\div$ female workers."],
    slider: { label: "Male workers", min: 280, max: 560, step: 20, value: 420, fmt: (v) => num(v, 0) },
    buttons: [["Question: 420", 420]],
    draw(svg, male, r) {
      const n = male / 0.7;
      const female = n - male;
      const train = n * 0.35;
      const ft = train - 93;
      const pct = female > 0 ? (ft / female) * 100 : 0;
      bars(svg, [
        { name: "Male", v: male, color: C.blue },
        { name: "Female", v: female, color: C.pink },
        { name: "By train", v: train, color: C.green },
        { name: "Female, train", v: Math.max(0, ft), color: C.amber },
      ]);
      const ok = male === 420;
      r.set(`\\dfrac{${tex(ft, 0)}}{${tex(female, 0)}} \\times 100\\% = ${tex(pct, 1)}\\%`, ok,
        ok ? "117 of 180 female workers go by train: 65%." : "Set the male workers to 420, as in the question.");
    },
  });
}

function q2(root) {
  live(root, {
    h: 160,
    q: "Amy has 30% more candies than Baron. Baron has 10% more than Cathy.",
    lets: ["$B = C \\times (1 + 10\\%)$", "$A = B \\times (1 + 30\\%) = 1.43C$"],
    slider: { label: "Cathy's candies", min: 100, max: 400, step: 20, value: 200, fmt: (v) => num(v, 0) },
    buttons: [["Question: 200", 200]],
    draw(svg, c, r) {
      const b = 1.1 * c;
      const a = 1.43 * c;
      bars(svg, [
        { name: "Amy", v: a, color: C.pink },
        { name: "Baron", v: b, color: C.blue },
        { name: "Cathy", v: c, color: C.green },
      ]);
      const ok = c === 200;
      r.set(`\\dfrac{1.43C - C}{C} \\times 100\\% = 43\\% \\quad\\text{Total} = ${tex(a + b + c, 0)}`, ok,
        "Amy is always 43% more than Cathy. The total changes with Cathy's number.");
    },
  });
}

function q3(root) {
  live(root, {
    h: 188,
    q: "A toy car sells for \\$300 at a profit of 20%. A doll sells for \\$120 at a loss of 20%. Then the car is 10% off and the doll 5% off.",
    lets: ["Car cost $= 300 \\div 1.2 = 250$", "Doll cost $= 120 \\div 0.8 = 150$"],
    slider: { label: "Later discount on the car", min: 0, max: 30, step: 1, value: 10, fmt: (v) => `${v}%` },
    buttons: [["No extra discount", 0], ["Question: 10%", 10]],
    draw(svg, d, r) {
      const car = 300 * (1 - d / 100);
      const doll = 120 * 0.95;
      const sp = car + doll;
      const profit = sp - 400;
      bars(svg, [
        { name: "Cost", v: 400, color: C.ink, label: "$400" },
        { name: "Car, new", v: car, color: C.blue, label: `$${num(car, 0)}` },
        { name: "Doll, new", v: doll, color: C.pink, label: `$${num(doll, 0)}` },
        { name: "New total", v: sp, color: profit >= 0 ? C.green : C.red, label: `$${num(sp, 0)}` },
      ]);
      const ok = d === 10;
      r.set(`\\text{New selling price} = ${tex(sp, 0)} \\quad ${profit >= 0 ? "\\text{profit}" : "\\text{loss}"} = ${tex(Math.abs(profit), 0)}`, ok,
        ok ? "After 10% and 5% off, the loss is $16, which is 4%." : d === 0 ? "Before the extra discounts the profit is $20, which is 5%." : "The doll stays at 5% off. Slide the car discount.");
    },
  });
}

function q4(root) {
  live(root, {
    h: 150,
    q: "10 cars, marked \\$120 000. The first 8 are discounted, the last 2 by 5%. Cost \\$100 000 each.",
    lets: ["Profit % $= \\dfrac{\\text{total selling price} - 1\\,000\\,000}{1\\,000\\,000} \\times 100\\%$"],
    slider: { label: "Discount on the first 8", min: 0, max: 10, step: 0.5, value: 2.5, fmt: (v) => `${num(v, 1)}%` },
    buttons: [["Question: 2.5%", 2.5]],
    draw(svg, d, r) {
      const first = 120000 * (1 - d / 100) * 8;
      const last = 120000 * 0.95 * 2;
      const sp = first + last;
      const pct = ((sp - 1000000) / 1000000) * 100;
      bars(svg, [
        { name: "First 8", v: first, color: C.blue, label: `$${num(first, 0)}` },
        { name: "Last 2", v: last, color: C.pink, label: `$${num(last, 0)}` },
        { name: "Profit", v: Math.max(0, sp - 1000000), color: C.green, label: `$${num(sp - 1000000, 0)}` },
      ]);
      r.set(`\\dfrac{${tex(sp - 1000000, 0)}}{1\\,000\\,000} \\times 100\\% = ${tex(pct, 1)}\\%`, d === 2.5,
        d === 2.5 ? "Overall profit is 16.4%." : "The last 2 cars stay at 5% off.");
    },
  });
}

function q5(root) {
  live(root, {
    h: 160,
    q: "Egg tarts were \\$8. Today they are \\$6, and 120 more are sold. Takings today are 20% more than yesterday.",
    lets: ["Let $n$ be the number sold today.", "Yesterday: $8(n - 120)$. Today: $6n$."],
    slider: { label: "Sold today", min: 200, max: 450, step: 10, value: 320, fmt: (v) => num(v, 0) },
    buttons: [["Question: 320", 320]],
    draw(svg, n, r) {
      const yest = 8 * (n - 120);
      const today = 6 * n;
      const target = yest * 1.2;
      bars(svg, [
        { name: "Yesterday", v: Math.max(0, yest), color: C.blue, label: `$${num(yest, 0)}` },
        { name: "Target", v: Math.max(0, target), color: C.amber, label: `$${num(target, 0)}` },
        { name: "Today", v: today, color: C.green, label: `$${num(today, 0)}` },
      ]);
      const ok = n === 320;
      r.set(`8(n - 120) \\times 1.2 = ${tex(target, 0)} \\quad 6n = ${tex(today, 0)}`, ok,
        ok ? "320 sold today. Profit today is $870, against $850 yesterday: 2.4% more." : "Today's takings should meet the amber target.");
    },
  });
}

function q6(root) {
  live(root, {
    h: 188,
    q: "January was 20% less than February. March was 20% more than February. March is \\$18 000.",
    lets: ["January $= 0.8I$", "March $= 1.2I$"],
    slider: { label: "February income $", min: 10000, max: 20000, step: 500, value: 15000, fmt: (v) => num(v, 0) },
    buttons: [["Question: 15 000", 15000]],
    draw(svg, I, r) {
      bars(svg, [
        { name: "January", v: 0.8 * I, color: C.pink, label: `$${num(0.8 * I, 0)}` },
        { name: "February", v: I, color: C.blue, label: `$${num(I, 0)}` },
        { name: "March", v: 1.2 * I, color: C.green, label: `$${num(1.2 * I, 0)}` },
        { name: "Jan + 2000", v: 0.8 * I + 2000, color: C.amber, label: `$${num(0.8 * I + 2000, 0)}` },
      ]);
      const ok = I === 15000;
      const withBonus = (0.2 * I) / (0.8 * I + 2000) * 100;
      r.set(`1.2I = ${tex(1.2 * I, 0)} \\quad \\text{Jan to Feb with } \\$2000: ${tex(withBonus, 1)}\\%`, ok,
        ok ? "February is $15 000 and January is $12 000. With $2000 the change is not +25%." : "March should be $18 000, so February is $15 000.");
    },
  });
}

function q7(root) {
  live(root, {
    h: 150,
    q: "80 bulbs at \\$20. One-fourth break. The rest are sold at \\$p each, aiming at a 20% profit.",
    lets: ["Unbroken bulbs $= 80 \\times \\dfrac{3}{4} = 60$", "Cost $= \\$1600$"],
    slider: { label: "Selling price of each bulb", min: 20, max: 40, step: 1, value: 32, fmt: (v) => `$${v}` },
    buttons: [["Question: $32", 32]],
    draw(svg, p, r) {
      const revenue = 60 * p;
      const pct = ((revenue - 1600) / 1600) * 100;
      bars(svg, [
        { name: "Cost", v: 1600, color: C.ink, label: "$1600" },
        { name: "At $22", v: 1320, color: C.pink, label: "$1320" },
        { name: "This price", v: revenue, color: pct >= 20 ? C.green : C.amber, label: `$${num(revenue, 0)}` },
      ]);
      r.set(`60 \\times ${p} = ${tex(revenue, 0)} \\quad \\text{profit} = ${tex(pct, 1)}\\%`, p === 32,
        p === 32 ? "Selling at $32 gives a 20% profit. Selling all unbroken bulbs at $22 is a 17.5% loss." : "A 20% profit on $1600 needs $1920 from 60 bulbs.");
    },
  });
}

function q8(root) {
  live(root, {
    h: 160,
    q: "20% off the marked price gives a 20% profit. 60% off gives a loss of \\$50.",
    lets: ["Let $y$ be the marked price.", "Cost $= 0.4y + 50$"],
    slider: { label: "Marked price $", min: 100, max: 250, step: 0.5, value: 187.5, fmt: (v) => num(v, 1) },
    buttons: [["Question: 187.5", 187.5]],
    draw(svg, y, r) {
      const cost = 0.4 * y + 50;
      const sp20 = 0.8 * y;
      const sp60 = 0.4 * y;
      bars(svg, [
        { name: "Marked", v: y, color: C.blue, label: `$${num(y, 1)}` },
        { name: "20% off", v: sp20, color: C.green, label: `$${num(sp20, 1)}` },
        { name: "Cost", v: cost, color: C.ink, label: `$${num(cost, 1)}` },
        { name: "60% off", v: sp60, color: C.pink, label: `$${num(sp60, 1)}` },
      ]);
      const ok = Math.abs(y - 187.5) < 0.01;
      r.set(`0.8y = (0.4y + 50) \\times 1.2 \\quad \\text{cost} = ${tex(cost, 1)}`, ok,
        ok ? "Marked price $187.5, cost $125." : "The pink bar should sit $50 under the cost.");
    },
  });
}

function q9(root) {
  live(root, {
    h: 160,
    q: "80 shirts at \\$50, sold at a 30% profit. Dresses at \\$200, sold at a 20% loss. Overall loss \\$1000.",
    lets: ["Let $y$ be the number of dresses.", "Cost $-$ selling price $= 1000$"],
    slider: { label: "Number of dresses", min: 20, max: 80, step: 1, value: 55, fmt: (v) => num(v, 0) },
    buttons: [["Question: 55", 55]],
    draw(svg, y, r) {
      const cost = 4000 + 200 * y;
      const sp = 5200 + 160 * y;
      const loss = cost - sp;
      bars(svg, [
        { name: "Cost", v: cost, color: C.ink, label: `$${num(cost, 0)}` },
        { name: "Selling", v: sp, color: C.blue, label: `$${num(sp, 0)}` },
        { name: "Loss", v: Math.max(0, loss), color: C.red, label: `$${num(loss, 0)}` },
      ]);
      r.set(`(4000 + 200y) - (5200 + 160y) = ${tex(loss, 0)}`, y === 55,
        y === 55 ? "55 dresses. To break even, sell them at a loss of 10 10/11%." : "The loss should be $1000.");
    },
  });
}

function q10(root) {
  const opts = [
    { name: "I", price: 41.6, sold: 0.9, disc: 2720, back: 3620, color: C.blue },
    { name: "II", price: 44.8, sold: 0.8, disc: 1920, back: 3720, color: C.green },
    { name: "III", price: 48, sold: 0.7, disc: 800, back: 3500, color: C.amber },
  ];
  live(root, {
    h: 250,
    q: "500 toys at \\$32. Options: 30% and 90% sold, 40% and 80% sold, 50% and 70% sold.",
    lets: ["Unsold toys are discarded in (b), or returned for \\$18 in (c)."],
    slider: { label: "Option", min: 1, max: 3, step: 1, value: 1, fmt: (v) => ["", "I", "II", "III"][v] },
    buttons: [["I", 1], ["II", 2], ["III", 3]],
    draw(svg, v, r) {
      T(svg, 16, 16, "Profit if unsold toys are discarded", { "font-weight": 700, "font-size": 13, fill: C.ink });
      opts.forEach((o, i) => {
        const y = 28 + i * 28;
        const w = o.disc / 16;
        bar(svg, 28, y, w, 18, o.color, v === i + 1 ? {} : { opacity: 0.45 });
        T(svg, 34 + w, y + 14, `${o.name} $${num(o.disc, 0)}`, { "font-size": 12, fill: C.ink });
      });
      T(svg, 340, 16, "If returned for $18", { "font-weight": 700, "font-size": 13, fill: C.ink });
      opts.forEach((o, i) => {
        const y = 28 + i * 28;
        const w = o.back / 20;
        bar(svg, 340, y, w, 18, o.color, v === i + 1 ? {} : { opacity: 0.45 });
        T(svg, 346 + w, y + 14, `${o.name} $${num(o.back, 0)}`, { "font-size": 12, fill: C.ink });
      });
      const pick = opts[v - 1];
      const bestDisc = v === 1;
      const bestBack = v === 2;
      r.set(`\\text{Selling price} = \\$${tex(pick.price, 1)} \\quad \\text{discarded } \\$${tex(pick.disc, 0)} \\quad \\text{returned } \\$${tex(pick.back, 0)}`,
        bestDisc || bestBack,
        bestDisc ? "If unsold toys are discarded, option I earns the most." : bestBack ? "If they are returned for $18, option II earns the most." : "Option III is lower in both cases.",
        { yes: "best", no: "lower" });
    },
  });
}

function slabs(amount) {
  const bands = [[200, 0.1], [100, 0.2], [100, 0.3], [Infinity, 0.4]];
  let left = amount;
  let off = 0;
  const parts = [];
  for (const [cap, rate] of bands) {
    const take = Math.min(left, cap);
    if (take <= 0) break;
    off += take * rate;
    parts.push({ take, rate, off: take * rate });
    left -= take;
  }
  return { off, parts };
}

function q11(root) {
  live(root, {
    h: 188,
    q: "Discounts: 10% on the first \\$200, 20% on the next \\$100, 30% on the next \\$100, 40% on the rest.",
    lets: ["Overall discount % $= \\dfrac{\\text{discount}}{\\text{amount}} \\times 100\\%$"],
    slider: { label: "Amount purchased $", min: 200, max: 700, step: 10, value: 320, fmt: (v) => num(v, 0) },
    buttons: [["$320", 320], ["$480", 480], ["$450", 450]],
    draw(svg, amount, r) {
      const { off, parts } = slabs(amount);
      const colors = [C.blue, C.green, C.pink, C.amber];
      let x = 16;
      parts.forEach((p, i) => {
        const w = Math.max(28, p.take * 0.7);
        bar(svg, x, 40, w, 36, colors[i]);
        T(svg, x + 6, 62, `${num(p.rate * 100, 0)}%`, { fill: "#fff", "font-weight": 700, "font-size": 12 });
        x += w + 6;
      });
      T(svg, 16, 110, `Discount $${num(off, 0)} of $${num(amount, 0)}`, { "font-size": 14, "font-weight": 700, fill: C.ink });
      const pct = (off / amount) * 100;
      const known = amount === 320 || amount === 480 || amount === 450;
      r.set(`\\dfrac{${tex(off, 0)}}{${tex(amount, 0)}} \\times 100\\% = ${tex(pct, 2)}\\%`, known,
        amount === 320 ? "Overall discount 14 3/8%." : amount === 480 ? "Overall discount 21 1/4%." : amount === 450 ? "An overall 20% discount on more than $400 means $450 of goods." : "Try $320, $480 or $450.");
    },
  });
}

function q12(root) {
  live(root, {
    h: 160,
    q: "In shop A the jacket is \\$1 600 and the T-shirt is free. The overall discount is 36%.",
    lets: ["Discount $= $ marked price of the T-shirt", "$(1600 + x) \\times 36\\% = x$"],
    slider: { label: "T-shirt marked price in A", min: 400, max: 1400, step: 20, value: 900, fmt: (v) => num(v, 0) },
    buttons: [["Question: 900", 900]],
    draw(svg, x, r) {
      const pct = (x / (1600 + x)) * 100;
      bars(svg, [
        { name: "Jacket", v: 1600, color: C.blue, label: "$1600" },
        { name: "T-shirt", v: x, color: C.pink, label: `$${num(x, 0)}` },
        { name: "You pay", v: 1600, color: C.green, label: "$1600" },
      ]);
      const shopB = x === 900 ? 1700 : null;
      r.set(`\\dfrac{x}{1600 + x} \\times 100\\% = ${tex(pct, 1)}\\%`, x === 900,
        x === 900 ? "The T-shirt is $900. Shop B then costs $1700, so shop A is cheaper." : "The free T-shirt should be 36% of the two marked prices.");
      if (shopB) T(svg, 500, 150, "Shop B $1700", { "font-size": 13, "font-weight": 700, fill: C.amber });
    },
  });
}

function q13(root) {
  live(root, {
    h: 150,
    q: "At a 50% discount a handbag makes a 50% profit. The shopkeeper says the marked price would make a 100% profit.",
    lets: ["Let the cost be \\$100.", "50% off and 50% profit means the marked price is \\$300."],
    slider: { label: "Marked price $", min: 150, max: 400, step: 10, value: 300, fmt: (v) => num(v, 0) },
    buttons: [["Fits the 50%", 300]],
    draw(svg, p, r) {
      const half = p * 0.5;
      const profitHalf = ((half - 100) / 100) * 100;
      const profitFull = ((p - 100) / 100) * 100;
      bars(svg, [
        { name: "Cost", v: 100, color: C.ink, label: "$100" },
        { name: "50% off", v: half, color: C.pink, label: `$${num(half, 0)}` },
        { name: "Marked", v: p, color: C.blue, label: `$${num(p, 0)}` },
      ]);
      const ok = p === 300;
      r.set(`\\text{At marked price, profit} = ${tex(profitFull, 0)}\\%`, ok,
        ok ? "The profit at the marked price is 200%, not 100%. The claim is disagreed." : `At 50% off the profit is ${num(profitHalf, 0)}%. It should be 50%.`,
        { yes: "disagreed", no: "not the data" });
    },
  });
}

function q14(root) {
  live(root, {
    h: 160,
    q: "100 mL of orange juice at \\$0.04 per mL and 150 mL of cranberry juice at \\$b per mL. Sold at \\$32.5 with a 150% profit.",
    lets: ["Cost $= 4 + 150b$", "$(4 + 150b) \\times 2.5 = 32.5$"],
    slider: { label: "Cranberry juice $ per mL", min: 0.02, max: 0.12, step: 0.01, value: 0.06, fmt: (v) => num(v, 2) },
    buttons: [["Question: 0.06", 0.06]],
    draw(svg, b, r) {
      const orange = 4;
      const cran = 150 * b;
      const cost = orange + cran;
      const profit = ((32.5 - cost) / cost) * 100;
      bars(svg, [
        { name: "Orange", v: orange, color: C.amber, label: "$4", dp: 2 },
        { name: "Cranberry", v: cran, color: C.pink, label: `$${num(cran, 2)}`, dp: 2 },
        { name: "Selling", v: 32.5, color: C.green, label: "$32.50", dp: 2 },
      ], "");
      const ok = Math.abs(b - 0.06) < 0.001;
      r.set(`(4 + 150b) \\times 2.5 = ${tex(cost * 2.5, 2)} \\quad \\text{profit} = ${tex(profit, 1)}\\%`, ok,
        ok ? "b = 0.06. After +13% and −13% the cost falls from $13 to $12.35, a 5% decrease." : "A 150% profit means the selling price is 2.5 times the cost.");
    },
  });
}

function q15(root) {
  live(root, {
    h: 150,
    q: "Method 1: 10% off stationery and 5% off books. Method 2: \\$12 off every \\$150. Total marked price \\$1000.",
    lets: ["Let $m$ be the marked price of the stationery.", "The two discounts are equal."],
    slider: { label: "Stationery marked price $", min: 0, max: 1000, step: 20, value: 440, fmt: (v) => num(v, 0) },
    buttons: [["Question: 440", 440]],
    draw(svg, m, r) {
      const d1 = 0.1 * m + 0.05 * (1000 - m);
      const d2 = 72;
      const books = 1000 - m;
      const pct = books > 0 ? ((books - m) / books) * 100 : 0;
      bars(svg, [
        { name: "Method 1", v: d1, color: C.blue, label: `$${num(d1, 0)}` },
        { name: "Method 2", v: d2, color: C.green, label: "$72" },
        { name: "Stationery", v: Math.max(m, 1), color: C.pink, label: `$${num(m, 0)}` },
      ]);
      const ok = m === 440;
      r.set(`0.05m + 50 = ${tex(d1, 0)} \\quad \\text{method 2} = 72`, ok,
        ok ? "Stationery $440, books $560. Stationery is 21 3/7% less than the books." : `Stationery is ${num(pct, 1)}% ${pct >= 0 ? "less" : "more"} than the books. The discounts should match.`);
    },
  });
}

function q16(root) {
  live(root, {
    h: 140,
    q: "The cost of a bracelet is x% lower than its selling price, and the profit is 150%.",
    lets: ["Selling price $= 2.5 \\times$ cost", "Cost $= $ selling price $\\times (1 - x\\%)$"],
    slider: { label: "x %", min: 0, max: 100, step: 1, value: 60, fmt: (v) => `${v}` },
    buttons: [["Question: 60", 60]],
    draw(svg, x, r) {
      const sp = 100;
      const cost = sp * (1 - x / 100);
      const profit = cost > 0 ? ((sp - cost) / cost) * 100 : 0;
      bars(svg, [
        { name: "Selling", v: sp, color: C.green, label: "$100" },
        { name: "Cost", v: Math.max(0, cost), color: C.blue, label: `$${num(cost, 0)}` },
      ]);
      r.set(`\\dfrac{${tex(sp, 0)} - ${tex(cost, 0)}}{${tex(cost, 1)}} \\times 100\\% = ${tex(profit, 0)}\\%`, x === 60,
        x === 60 ? "x = 60. The cost is 60% lower than the selling price, and the profit is 150%." : "A 150% profit means the selling price is 2.5 times the cost.");
    },
  });
}

const REGISTRY = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16 };

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
