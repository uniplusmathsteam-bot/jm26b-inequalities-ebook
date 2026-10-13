/**
 * Interactive graphics for JM27 (A) Percentages II. Most questions use the
 * timeline: one bar per period, each step multiplied by its growth or decay
 * factor, with a slider for the unknown and a live check against the data.
 */

import { C, S, T, H, scene, clear, bar, dashed, slider, readout, question, tabs, buttonRow } from "../../engine/widgets/kit.js";

/* ---------- number formatting ---------- */

function round(v, dp) {
  const k = 10 ** dp;
  return Math.round(v * k) / k;
}

/** 1234567.8 → "1 234 567.8", 6500 → "6500" (HK spacing), trailing zeros dropped. */
function num(v, dp = 2) {
  const r = round(v, dp);
  const [i, f] = Math.abs(r).toFixed(dp).split(".");
  const int = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  const frac = f ? f.replace(/0+$/, "") : "";
  return `${r < 0 ? "−" : ""}${int}${frac ? `.${frac}` : ""}`;
}
/** Keeps "$1 080 000" on one line in question cards. */
const nb = (s) => s.replace(/(\d) (?=\d{3}\b)/g, "$1\u00a0");
const tnum = (v, dp) => num(v, dp).replace(/ /g, "\\ ").replace("−", "-");
const pct = (p) => `${p >= 0 ? "+" : "-"}${num(Math.abs(p), 2)}\\%`;
const factor = (p) => num(1 + p / 100, 6);

/** "6000 × 0.95^3 × 1.08" for the first n steps. */
function factorTex(rates, n) {
  const parts = [];
  for (let i = 0; i < n;) {
    let j = i;
    while (j < n && rates[j] === rates[i]) j++;
    const f = factor(rates[i]);
    parts.push(j - i > 1 ? `${f}^{${j - i}}` : f);
    i = j;
  }
  return parts.join(" \\times ");
}

/* ---------- timeline ---------- */

/**
 * cfg: q, lets, labels (one per bar), start (number or u => number), rates
 * (% per step, array or u => array), unknown (slider spec for u), unit,
 * prefix, dp, threshold { value: start => v, label, below }, compare
 * { name, values: u => [] }, loss, given { at, value }, check (u, n, vals) =>
 * [ok, caption], read (u, n, vals) => latex, buttons [[label, u, n]], title.
 */
function timeline(root, cfg) {
  const N = cfg.labels.length - 1;
  const svg = scene(640, 300);
  const r = readout();
  const pre = cfg.prefix || "";
  const dp = cfg.dp ?? 2;
  const uS = cfg.unknown ? slider(cfg.unknown) : null;
  const nS = slider({ label: cfg.stepLabel || "Periods passed", min: 0, max: N, step: 1, value: cfg.show ?? N, fmt: (v) => `${v}` });
  const kids = [question(nb(cfg.q), cfg.lets), svg];
  if (uS) kids.push(uS.el);
  if (!cfg.fixedSteps) kids.push(nS.el);
  kids.push(r.el);
  if (cfg.buttons) {
    kids.push(buttonRow(cfg.buttons.map(([label, u, n]) => [label, () => {
      if (u != null && uS) uS.set(u);
      if (n != null) nS.set(n);
    }])));
  }
  root.append(...kids);

  const draw = () => {
    clear(svg);
    const u = uS ? uS.get() : null;
    const n = nS.get();
    const start = typeof cfg.start === "function" ? cfg.start(u) : cfg.start;
    const rates = typeof cfg.rates === "function" ? cfg.rates(u) : cfg.rates;
    const vals = [start];
    rates.forEach((p) => vals.push(vals[vals.length - 1] * (1 + p / 100)));
    const thr = cfg.threshold ? cfg.threshold.value(start) : null;
    const cmp = cfg.compare ? cfg.compare.values(u) : null;
    const top = Math.max(...vals, thr ?? 0, ...(cmp || []), cfg.loss ? start : 0) * 1.12 || 1;

    const x0 = 34;
    const plotW = 500;
    const base = 238;
    const Hh = 170;
    const col = plotW / (N + 1);
    const bw = Math.min(56, col * 0.64);
    const Y = (v) => base - (v / top) * Hh;
    const cx = (i) => x0 + col * (i + 0.5);

    T(svg, 16, 24, cfg.title || "Value after each period", { "font-weight": 700, "font-size": 14 });
    if (cmp) {
      bar(svg, 360, 13, 14, 12, C.blue);
      T(svg, 378, 24, cfg.mainName || "", { "font-size": 12 });
      bar(svg, 470, 13, 14, 12, C.amber);
      T(svg, 488, 24, cfg.compare.name, { "font-size": 12 });
    }
    S("line", { x1: x0 - 6, y1: base, x2: x0 + plotW + 6, y2: base, stroke: C.line, "stroke-width": 1.2 }, svg);
    if (thr != null) dashed(svg, x0 - 6, Y(thr), x0 + plotW + 6, Y(thr), C.amber);
    if (cfg.given) S("line", { x1: x0 - 6, y1: Y(cfg.given.value), x2: x0 + plotW + 6, y2: Y(cfg.given.value), stroke: C.amber, "stroke-width": 1.4, "stroke-dasharray": "2 4" }, svg);

    const showAll = col >= 62;
    const wide = cmp ? bw / 2 : bw;
    for (let i = 0; i <= N; i++) {
      const x = cx(i) - bw / 2;
      T(svg, cx(i), base + 17, cfg.labels[i], { "text-anchor": "middle", "font-size": col < 40 ? 10 : 11.5, fill: i === n ? C.ink : "#555", "font-weight": i === n ? 700 : 400 });
      if (i > n) {
        bar(svg, x, base - 18, wide, 18, "none", { stroke: "#c8c2b6", "stroke-dasharray": "4 3" });
        continue;
      }
      const v = vals[i];
      const fill = i === 0 ? C.blue : rates[i - 1] >= 0 ? C.green : C.pink;
      if (cfg.loss && i > 0 && v < start) {
        bar(svg, x, Y(start), wide, Y(v) - Y(start), C.redSoft, { stroke: C.red, "stroke-dasharray": "4 3", "stroke-width": 1 });
      }
      bar(svg, x, Y(v), wide, base - Y(v), fill, { opacity: i === n ? 1 : 0.72 });
      if (cmp) bar(svg, x + wide, Y(cmp[i]), wide, base - Y(cmp[i]), C.amber, { opacity: i === n ? 1 : 0.72 });
      if (cfg.given && i === cfg.given.at) {
        S("line", { x1: x - 6, y1: Y(cfg.given.value), x2: x + bw + 6, y2: Y(cfg.given.value), stroke: C.amber, "stroke-width": 3.5 }, svg);
      }
      if (showAll || i === n || i === 0) {
        const lift = cmp ? Math.max(v, cmp[i]) : v;
        T(svg, cx(i), Y(lift) - 6, `${pre}${num(v, dp)}`, { "text-anchor": "middle", "font-size": showAll ? 11.5 : 11, "font-weight": i === n ? 700 : 400, fill: i === n ? C.ink : "#444", ...HALO });
      }
    }
    if (col >= 46) {
      for (let i = 0; i < N; i++) {
        T(svg, x0 + col * (i + 1), base + 36, `×${factor(rates[i])}`, { "text-anchor": "middle", "font-size": 11, fill: rates[i] >= 0 ? C.green : C.pink, "font-weight": 700 });
      }
    } else {
      const uniq = [...new Set(rates)];
      T(svg, x0, base + 38, `each period × ${uniq.map(factor).join(" or ×")}`, { "font-size": 12, fill: C.ink, "font-weight": 700 });
    }
    if (thr != null) {
      T(svg, x0 + plotW + 12, Y(thr) + 4, cfg.threshold.label, { "font-size": 12, "font-weight": 700, fill: C.amber });
    }
    if (cfg.given) {
      T(svg, x0 + plotW + 12, Y(cfg.given.value) + (thr != null && Math.abs(Y(thr) - Y(cfg.given.value)) < 16 ? 18 : 4), cfg.given.label || "given", { "font-size": 12, "font-weight": 700, fill: C.amber });
    }

    const tp = pre === "$" ? "\\$" : pre;
    const latex = cfg.read ? cfg.read(u, n, vals) : n === 0 ? `${tp}${tnum(start, dp)}` : `${tp}${tnum(start, dp)} \\times ${factorTex(rates, n)} = ${tp}${tnum(vals[n], dp)}`;
    const [ok, caption, labels] = cfg.check ? cfg.check(u, n, vals, thr) : [null, cfg.caption ? cfg.caption(n, vals) : ""];
    r.set(latex, ok, caption, labels);
  };
  uS?.on(draw);
  nS.on(draw);
  draw();
}

/** Tabs that rebuild the graphic below them. */
function parts(root, names, builders) {
  const body = H("div");
  root.append(tabs(names, (i) => {
    body.replaceChildren();
    builders[i](body);
  }), body);
  builders[0](body);
}

const HALO = { stroke: C.paper, "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round" };
const same = (rate, k) => Array(k).fill(rate);
const near = (a, b, tol) => Math.abs(a - b) <= tol;

/* ---------- percentage change: original bar vs new bar ---------- */

function change(root, cfg) {
  const svg = scene(640, 200);
  const r = readout();
  const s = slider({ label: cfg.label, min: cfg.min, max: cfg.max, step: cfg.step || 1, value: cfg.to, fmt: (v) => `${cfg.prefix || ""}${num(v)}${cfg.unit || ""}` });
  root.append(question(nb(cfg.q), cfg.lets), svg, s.el, r.el,
    buttonRow([[`Question: ${cfg.prefix || ""}${num(cfg.to)}${cfg.unit || ""}`, () => s.set(cfg.to)], ["No change", () => s.set(cfg.from)]]));
  const draw = (to) => {
    clear(svg);
    const k = 470 / Math.max(cfg.max, cfg.from);
    const p = ((to - cfg.from) / cfg.from) * 100;
    const x = 130;
    T(svg, 16, 24, "Change compared with the ORIGINAL value", { "font-weight": 700, "font-size": 14 });
    T(svg, x - 10, 72, "original", { "text-anchor": "end", "font-size": 13 });
    bar(svg, x, 54, cfg.from * k, 28, C.blue);
    T(svg, x + 8, 73, `${cfg.prefix || ""}${num(cfg.from)}${cfg.unit || ""}`, { fill: "#fff", "font-weight": 700 });
    T(svg, x - 10, 132, "new", { "text-anchor": "end", "font-size": 13 });
    bar(svg, x, 114, to * k, 28, p >= 0 ? C.green : C.pink);
    T(svg, x + 8, 133, `${cfg.prefix || ""}${num(to)}${cfg.unit || ""}`, { fill: "#fff", "font-weight": 700 });
    const a = x + Math.min(cfg.from, to) * k;
    const b = x + Math.max(cfg.from, to) * k;
    if (b - a > 1) {
      bar(svg, a, 92, b - a, 12, p >= 0 ? C.greenSoft : C.redSoft, { stroke: p >= 0 ? C.green : C.red, "stroke-dasharray": "4 3" });
      T(svg, (a + b) / 2, 172, `${p >= 0 ? "+" : "−"}${cfg.prefix || ""}${num(Math.abs(to - cfg.from))}${cfg.unit || ""}`, { "text-anchor": "middle", "font-weight": 700, fill: p >= 0 ? C.green : C.red });
    }
    dashed(svg, x + cfg.from * k, 48, x + cfg.from * k, 150, C.ink);
    r.set(`\\dfrac{${tnum(to)} - ${tnum(cfg.from)}}{${tnum(cfg.from)}} \\times 100\\% = ${pct(p)}`, null,
      p > 0 ? "Positive: an increase." : p < 0 ? "Negative: a decrease." : "No change.");
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Examples ---------- */

function ex1(root) {
  parts(root, ["(a) $210 → $420", "(b) 160 cm → 136 cm"], [
    (b) => change(b, { q: "Find the percentage change when \\$210 is changed to \\$420.", lets: ["Percentage change $= \\dfrac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%$"], from: 210, to: 420, min: 0, max: 500, step: 5, prefix: "$", label: "New value" }),
    (b) => change(b, { q: "Find the percentage change when 160 cm is changed to 136 cm.", lets: ["Percentage change $= \\dfrac{\\text{new} - \\text{original}}{\\text{original}} \\times 100\\%$"], from: 160, to: 136, min: 0, max: 240, step: 2, unit: " cm", label: "New length" }),
  ]);
}

function ex2(root) {
  const one = (sign) => (b) => timeline(b, {
    q: `The price of a lunch set was \\$120 yesterday. It is ${sign < 0 ? "lowered" : "raised"} by $p\\%$ today.`,
    lets: [`New value $=$ original $\\times (1 ${sign < 0 ? "-" : "+"} p\\%)$`],
    labels: ["Yesterday", "Today"], prefix: "$", fixedSteps: true,
    unknown: { label: `${sign < 0 ? "Lowered" : "Raised"} by p%`, min: 0, max: 60, step: 5, value: sign < 0 ? 15 : 35, fmt: (v) => `${v}%` },
    start: 120, rates: (p) => [sign * p],
    title: "Price of the lunch set",
    buttons: [[sign < 0 ? "Question: 15%" : "Question: 35%", sign < 0 ? 15 : 35]],
    caption: () => "Multiply by ONE factor: 1 + (percentage change).",
  });
  parts(root, ["(a) lowered by 15%", "(b) raised by 35%"], [one(-1), one(1)]);
}

function ex3(root) {
  const one = (start, a, b) => (body) => timeline(body, {
    q: `${start} is ${a > 0 ? "increased" : "decreased"} by ${Math.abs(a)}% and then ${b > 0 ? "increased" : "decreased"} by ${Math.abs(b)}%. Find the new value.`,
    lets: [`New value $= ${start} \\times (1 ${a > 0 ? "+" : "-"} ${Math.abs(a)}\\%) \\times (1 ${b > 0 ? "+" : "-"} ${Math.abs(b)}\\%)$`],
    labels: ["Start", `${a > 0 ? "+" : "−"}${Math.abs(a)}%`, `${b > 0 ? "+" : "−"}${Math.abs(b)}%`],
    start, rates: [a, b], stepLabel: "Changes made",
    threshold: { value: () => start * (1 + (a + b) / 100), label: `not ×${factor(a + b)}` },
    caption: (n) => n === 2 ? `Not ${start} × (1 ${a + b >= 0 ? "+" : "−"} ${Math.abs(a + b)}%): the second change is a percentage of the NEW value.` : "Tap + to apply the next change.",
  });
  parts(root, ["(a) +30% then −20%", "(b) −10% then +45%"], [one(500, 30, -20), one(2400, -10, 45)]);
}

function ex4(root) {
  timeline(root, {
    q: "400 increases at a constant rate of 10% in each period. Find the new value after 3 periods.",
    lets: ["$A = P(1 + r\\%)^n$ with $P = 400$, $r = 10$, $n = 3$"],
    labels: ["0", "1", "2", "3"], start: 400, rates: same(10, 3),
    caption: (n) => n === 3 ? "The increase grows each period, because 10% is taken of a bigger value each time." : "",
  });
}

function ex5(root) {
  timeline(root, {
    q: "900 decreases at a constant rate of 30% in each period. Find the new value after 3 periods.",
    lets: ["$A = P(1 - r\\%)^n$ with $P = 900$, $r = 30$, $n = 3$"],
    labels: ["0", "1", "2", "3"], start: 900, rates: same(-30, 3), loss: true,
    caption: (n) => n === 3 ? "Decay factor 0.7 each period: 900 × 0.7³ = 308.7." : "",
  });
}

function backward(cfg) {
  return {
    show: cfg.given.at,
    ...cfg,
    check: (u, n, vals) => {
      const ok = near(vals[cfg.given.at], cfg.given.value, cfg.tol ?? 0.5);
      return [ok, ok ? cfg.yes : `Move the slider until the bar for ${cfg.labels[cfg.given.at]} reaches ${cfg.prefix || ""}${num(cfg.given.value)}.`, { yes: "matches", no: "too " + (vals[cfg.given.at] > cfg.given.value ? "big" : "small") }];
    },
  };
}

function ex6(root) {
  timeline(root, backward({
    q: "Bacteria decrease by 20% per hour. After 5 hours there are 327 680. Find the original number.",
    lets: ["Let $n$ be the original number.", "$n \\times (1 - 20\\%)^5 = 327\\ 680$"],
    labels: ["0 h", "1 h", "2 h", "3 h", "4 h", "5 h"], dp: 0,
    unknown: { label: "Original n", min: 400000, max: 1400000, step: 20000, value: 600000, fmt: (v) => num(v) },
    start: (n) => n, rates: same(-20, 5), stepLabel: "Hours passed",
    given: { at: 5, value: 327680, label: "327 680" },
    read: (n, k, vals) => `${tnum(n)} \\times 0.8^{${k}} = ${tnum(vals[k], 0)}`,
    tol: 1, yes: "n = 1 000 000: work backwards with ÷ 0.8⁵, not × 1.2⁵.",
    buttons: [["Wrong: 327 680 × 1.2⁵ ≈ 815 395", 820000], ["Answer: 1 000 000", 1000000]],
  }));
}

/* ---------- Practices ---------- */

function p3(root) {
  timeline(root, {
    q: "Eva's weight was 50 kg in March. It decreased by 2% in April, then increased by 6% in May.",
    lets: ["Weight in May $= 50 \\times (1 - 2\\%) \\times (1 + 6\\%)$"],
    labels: ["March", "April", "May"], start: 50, rates: [-2, 6], stepLabel: "Months",
    title: "Eva's weight (kg)", dp: 2,
    caption: (n) => n === 2 ? "51.94 kg. Not 50 × 1.04 = 52 kg: the 6% is of April's weight." : "",
  });
}

function p4(root) {
  timeline(root, {
    q: "A jewel is worth \\$8000. Its value increases at 15% per year. Find its value after 2 years.",
    lets: ["$A = 8000(1 + 15\\%)^2$"],
    labels: ["Now", "1 year", "2 years"], start: 8000, rates: same(15, 2), prefix: "$", stepLabel: "Years",
  });
}

function p5(root) {
  timeline(root, {
    q: "A scanner costs \\$6350 and depreciates at 11% per quarter. Find its value one year later.",
    lets: ["Decay factor $= 1 - 11\\% = 0.89$", "1 year = 4 quarters"],
    labels: ["Now", "Q1", "Q2", "Q3", "Q4"], start: 6350, rates: same(-11, 4), prefix: "$", stepLabel: "Quarters", loss: true,
    caption: (n) => n === 4 ? "$3984.13…, so $3980 correct to 3 significant figures." : "",
  });
}

function fish(root) {
  timeline(root, backward({
    q: "There are 630 000 fish now. The number has decreased by 3% per year for the past 7 years. Find the number 7 years ago.",
    lets: ["Let $n$ be the number of fish 7 years ago.", "$n \\times (1 - 3\\%)^7 = 630\\ 000$"],
    labels: ["−7", "−6", "−5", "−4", "−3", "−2", "−1", "Now"], dp: 0,
    unknown: { label: "n (7 years ago)", min: 640000, max: 900000, step: 5000, value: 700000, fmt: (v) => num(v) },
    start: (n) => n, rates: same(-3, 7), stepLabel: "Years passed",
    given: { at: 7, value: 630000, label: "630 000" },
    read: (n, k, vals) => `${tnum(n)} \\times 0.97^{${k}} = ${tnum(vals[k], 0)}`,
    tol: 400, yes: "n ≈ 780 000 (correct to the nearest thousand).",
    buttons: [["Answer: 780 000", 780000]],
  }));
}

/* ---------- Q1–Q10: percentage change ---------- */

function q1(root) {
  change(root, {
    q: "David's monthly salary was \\$9500 last year. It is increased by \\$1235 this year. Find the percentage change.",
    lets: ["Percentage change $= \\dfrac{1235}{9500} \\times 100\\%$"],
    from: 9500, to: 10735, min: 6000, max: 13000, step: 5, prefix: "$", label: "This year's salary",
  });
}

function q2(root) {
  timeline(root, {
    q: "80 tables were occupied at 12 pm. The number increased by 15% at 1 pm.",
    lets: ["Number at 1 pm $= 80 \\times (1 + 15\\%)$"],
    labels: ["12 pm", "1 pm"], start: 80, rates: (p) => [p], fixedSteps: true, dp: 0,
    unknown: { label: "Increase p%", min: 0, max: 50, step: 5, value: 15, fmt: (v) => `${v}%` },
    title: "Occupied tables", buttons: [["Question: 15%", 15]],
    read: (p) => `80 \\times (1 + ${p}\\%) = 80 \\times ${factor(p)} = ${num(80 * (1 + p / 100))}`,
  });
}

function q3(root) {
  timeline(root, backward({
    q: "A shop sells 102 USB fans this month, 15% fewer than last month. Find the number sold last month.",
    lets: ["Let $n$ be the number sold last month.", "$n \\times (1 - 15\\%) = 102$"],
    labels: ["Last month", "This month"], dp: 0, fixedSteps: true,
    unknown: { label: "Last month n", min: 90, max: 140, step: 1, value: 110 },
    start: (n) => n, rates: [-15],
    given: { at: 1, value: 102, label: "102" },
    read: (n) => `${n} \\times 0.85 = ${num(n * 0.85)}`, tol: 0.01,
    yes: "n = 120. Not 102 × 1.15 = 117.3: the 15% is of LAST month's number.",
    buttons: [["Wrong: 102 × 1.15 ≈ 117", 117], ["Answer: 120", 120]],
  }));
}

function q4(root) {
  timeline(root, backward({
    q: "Tim's expenditure fell by 35% from June to July, then rose by 12% from July to August. August: \\$32 760. Find June.",
    lets: ["Let \\$$x$ be the expenditure in June.", "$x \\times (1 - 35\\%) \\times (1 + 12\\%) = 32\\ 760$"],
    labels: ["June", "July", "August"], prefix: "$", dp: 0, stepLabel: "Months",
    unknown: { label: "June x", min: 30000, max: 60000, step: 500, value: 40000, fmt: (v) => `$${num(v)}` },
    start: (x) => x, rates: [-35, 12],
    given: { at: 2, value: 32760, label: "$32 760" },
    read: (x, n, vals) => `${tnum(x)} \\times ${factorTex([-35, 12], n) || "1"} = ${tnum(vals[n], 2)}`, tol: 1,
    yes: "x = 45 000: June's expenditure was $45 000.",
    buttons: [["Answer: $45 000", 45000, 2]],
  }));
}

function q5(root) {
  const svg = scene(640, 240);
  const a = slider({ label: "Male increase", min: 0, max: 30, step: 1, value: 12, fmt: (v) => `${v}%` });
  const b = slider({ label: "Female increase", min: 0, max: 30, step: 1, value: 5, fmt: (v) => `${v}%` });
  const r = readout();
  root.append(question("300 male and 200 female employees last year. Male +12% and female +5% this year.",
    ["(a) Total this year $= 300(1 + 12\\%) + 200(1 + 5\\%)$", "(b) Percentage change $= \\dfrac{546 - 500}{500} \\times 100\\%$"]),
  svg, a.el, b.el, r.el, buttonRow([["Question: 12% and 5%", () => { a.set(12); b.set(5); }]]));
  const draw = () => {
    clear(svg);
    const m = 300 * (1 + a.get() / 100);
    const f = 200 * (1 + b.get() / 100);
    const k = 0.62;
    const rows = [["Last year", 300, 200, 70], ["This year", m, f, 150]];
    T(svg, 16, 24, "Number of employees", { "font-weight": 700, "font-size": 14 });
    for (const [name, mm, ff, y] of rows) {
      T(svg, 104, y + 22, name, { "text-anchor": "end", "font-size": 13 });
      bar(svg, 112, y, mm * k, 34, C.blue);
      T(svg, 118, y + 22, `male ${num(mm)}`, { fill: "#fff", "font-weight": 700, "font-size": 12 });
      bar(svg, 112 + mm * k, y, ff * k, 34, C.pink);
      T(svg, 118 + mm * k, y + 22, `female ${num(ff)}`, { fill: "#fff", "font-weight": 700, "font-size": 12 });
      T(svg, 120 + (mm + ff) * k, y + 22, `= ${num(mm + ff)}`, { "font-weight": 700, fill: C.ink });
    }
    dashed(svg, 112 + 500 * k, 60, 112 + 500 * k, 196, C.ink);
    T(svg, 112 + 500 * k, 216, "500", { "text-anchor": "middle", fill: C.ink, "font-weight": 700 });
    const p = ((m + f - 500) / 500) * 100;
    r.set(`\\dfrac{${num(m + f)} - 500}{500} \\times 100\\% = ${pct(p)}`, null,
      `Total change ${num(p)}%: not ${a.get()}% + ${b.get()}%, because each rate applies to a different group.`);
  };
  a.on(draw);
  b.on(draw);
  draw();
}

function q6(root) {
  const svg = scene(640, 220);
  const s = slider({ label: "Drink B: y mL", min: 300, max: 600, step: 2.5, value: 420, fmt: (v) => `${num(v)} mL` });
  const r = readout();
  root.append(question("Drink $A$ is 300 mL. Increased by 30%, it equals 80% of drink $B$. Find drink $B$.",
    ["Let $y$ mL be the volume of drink $B$.", "$300 \\times (1 + 30\\%) = y \\times 80\\%$"]),
  svg, s.el, r.el, buttonRow([["Answer: 487.5 mL", () => s.set(487.5)]]));
  const draw = (y) => {
    clear(svg);
    const k = 0.75;
    T(svg, 16, 24, "Compare the two volumes", { "font-weight": 700, "font-size": 14 });
    T(svg, 130, 66, "A × 1.3", { "text-anchor": "end" });
    bar(svg, 140, 48, 300 * k, 28, C.blue);
    bar(svg, 140 + 300 * k, 48, 90 * k, 28, C.green);
    T(svg, 146, 67, "300", { fill: "#fff", "font-weight": 700 });
    T(svg, 146 + 300 * k, 67, "+90", { fill: "#fff", "font-weight": 700 });
    T(svg, 150 + 390 * k, 67, "= 390 mL", { "font-weight": 700, fill: C.ink });
    T(svg, 130, 136, "B = y", { "text-anchor": "end" });
    bar(svg, 140, 118, y * k, 28, C.soft, { stroke: C.pink });
    bar(svg, 140, 118, 0.8 * y * k, 28, C.pink);
    T(svg, 146, 137, `80% of y = ${num(0.8 * y)}`, { fill: "#fff", "font-weight": 700 });
    T(svg, 146 + y * k, 137, `y = ${num(y)}`, { "font-weight": 700, fill: C.pink });
    dashed(svg, 140 + 390 * k, 40, 140 + 390 * k, 160, C.amber);
    const ok = near(0.8 * y, 390, 0.01);
    r.set(`0.8 \\times ${num(y)} = ${num(0.8 * y)} ${ok ? "=" : "\\ne"} 390`, ok,
      ok ? "80% of B lines up exactly with 390 mL." : "Move y until the pink 80% part reaches the dashed line.", { yes: "equal", no: "not equal" });
  };
  s.on(draw);
  draw(s.get());
}

function q7(root) {
  timeline(root, {
    q: "Kitty's second score was 15% lower than the first; her third was 15% higher than the second. Which is higher: first or third?",
    lets: ["Let $x$ be the first score.", "Third $= x \\times 0.85 \\times 1.15 = 0.9775x$"],
    labels: ["1st exam", "2nd exam", "3rd exam"], dp: 2, stepLabel: "Exams",
    unknown: { label: "First score x", min: 40, max: 100, step: 1, value: 80 },
    start: (x) => x, rates: [-15, 15],
    threshold: { value: (s) => s, label: "first score" },
    read: (x, n, vals) => `${x} \\times ${factorTex([-15, 15], n) || "1"} = ${num(vals[n], 4)}`,
    check: (x, n, vals) => n < 2 ? [null, "Tap + to see the third exam."] : [vals[2] < x, `The third score is ${num(x - vals[2], 2)} marks below the first: 15% of the lower second score is less than 15% of the first.`, { yes: "first is higher", no: "third is higher" }],
  });
}

function q8(root) {
  timeline(root, backward({
    q: "625 cm is decreased by $y\\%$, then decreased by $y\\%$ again. The result is 400 cm. Find $y$.",
    lets: ["$625 \\times (1 - y\\%)^2 = 400$"],
    labels: ["Start", "−y%", "−y% again"], dp: 2, fixedSteps: true,
    unknown: { label: "y", min: 0, max: 40, step: 1, value: 10 },
    start: 625, rates: (y) => [-y, -y],
    given: { at: 2, value: 400, label: "400 cm" },
    read: (y) => `625 \\times ${factor(-y)}^2 = ${num(625 * (1 - y / 100) ** 2)}`, tol: 0.01,
    yes: "y = 20: 625 × 0.8² = 400.",
    buttons: [["Wrong guess: 36 ÷ 2 = 18", 18], ["Answer: 20", 20]],
  }));
}

/** Rectangle B × T whose area stands for A = 4BT. */
function q9(root) {
  const svg = scene(640, 260);
  const sb = slider({ label: "Change in B", min: -30, max: 40, step: 1, value: 16, fmt: (v) => `${v >= 0 ? "+" : ""}${v}%` });
  const st = slider({ label: "Change in T", min: -30, max: 40, step: 1, value: -8, fmt: (v) => `${v >= 0 ? "+" : ""}${v}%` });
  const r = readout();
  root.append(question("$A = 4BT$. $B$ is increased by 16% and $T$ is decreased by 8%. Find the percentage change in $A$.",
    ["New $A = 4(1.16B)(0.92T) = 4.2688BT$"]),
  svg, sb.el, st.el, r.el, buttonRow([["Question: +16%, −8%", () => { sb.set(16); st.set(-8); }], ["No change", () => { sb.set(0); st.set(0); }]]));
  const draw = () => {
    clear(svg);
    const fb = 1 + sb.get() / 100;
    const ft = 1 + st.get() / 100;
    const W = 200;
    const Hh = 120;
    T(svg, 16, 24, "A is proportional to the area B × T", { "font-weight": 700, "font-size": 14 });
    const x = 60;
    const y = 220;
    bar(svg, x, y - Hh * ft, W * fb, Hh * ft, C.greenSoft, { stroke: C.green, "stroke-width": 2, rx: 0 });
    bar(svg, x, y - Hh, W, Hh, "none", { stroke: C.ink, "stroke-width": 2, "stroke-dasharray": "6 4", rx: 0 });
    T(svg, x + W / 2, y + 18, "B", { "text-anchor": "middle", fill: C.ink, "font-weight": 700 });
    T(svg, x + W * fb, y + 18, `${num(fb, 2)}B`, { "text-anchor": "middle", fill: C.green, "font-weight": 700 });
    T(svg, x - 8, y - Hh / 2, "T", { "text-anchor": "end", fill: C.ink, "font-weight": 700 });
    T(svg, x + W * fb + 8, y - (Hh * ft) / 2, `${num(ft, 2)}T`, { fill: C.green, "font-weight": 700 });
    const f = fb * ft;
    T(svg, 420, 90, "area factor", { "font-size": 13, fill: "#555" });
    T(svg, 420, 116, `${num(fb, 2)} × ${num(ft, 2)} = ${num(f, 4)}`, { "font-size": 16, "font-weight": 700, fill: C.ink });
    T(svg, 420, 146, `so A changes by ${(f - 1) >= 0 ? "+" : "−"}${num(Math.abs(f - 1) * 100, 2)}%`, { "font-size": 14, fill: f >= 1 ? C.green : C.red, "font-weight": 700 });
    r.set(`\\dfrac{4(${num(fb, 2)}B)(${num(ft, 2)}T) - 4BT}{4BT} \\times 100\\% = ${pct((f - 1) * 100)}`, null,
      "Multiply the factors, don't add the percentages: 1.16 × 0.92 = 1.0672, not 1.08.");
  };
  sb.on(draw);
  st.on(draw);
  draw();
}

function q10(root) {
  const svg = scene(640, 260);
  const s = slider({ label: "Radius increase", min: -50, max: 100, step: 5, value: 20, fmt: (v) => `${v >= 0 ? "+" : ""}${v}%` });
  const r = readout();
  root.append(question("The radius of a circle is increased by 20%. Find the percentage change in its area.",
    ["Let $r$ be the original radius.", "New area $= \\pi(1.2r)^2 = 1.44\\pi r^2$"]),
  svg, s.el, r.el, buttonRow([["Question: +20%", () => s.set(20)], ["Double the radius", () => s.set(100)]]));
  const draw = (p) => {
    clear(svg);
    const f = 1 + p / 100;
    const R = 50;
    T(svg, 16, 24, "Area grows with the SQUARE of the radius", { "font-weight": 700, "font-size": 14 });
    S("circle", { cx: 150, cy: 145, r: R, fill: C.blueSoft, stroke: C.blue, "stroke-width": 2 }, svg);
    S("line", { x1: 150, y1: 145, x2: 150 + R, y2: 145, stroke: C.blue, "stroke-width": 2 }, svg);
    T(svg, 150 + R / 2, 138, "r", { "text-anchor": "middle", fill: C.blue, "font-weight": 700 });
    T(svg, 150, 240, "area πr²", { "text-anchor": "middle", fill: C.blue });
    S("circle", { cx: 400, cy: 145, r: R * f, fill: C.greenSoft, stroke: C.green, "stroke-width": 2 }, svg);
    S("circle", { cx: 400, cy: 145, r: R, fill: "none", stroke: C.blue, "stroke-dasharray": "5 4" }, svg);
    S("line", { x1: 400, y1: 145, x2: 400 + R * f, y2: 145, stroke: C.green, "stroke-width": 2 }, svg);
    T(svg, 400 + (R * f) / 2, 138, `${num(f, 2)}r`, { "text-anchor": "middle", fill: C.green, "font-weight": 700 });
    T(svg, 400, 250, `area ${num(f * f, 4)}πr²`, { "text-anchor": "middle", fill: C.green, "font-weight": 700 });
    r.set(`\\dfrac{${num(f * f, 4)}\\pi r^2 - \\pi r^2}{\\pi r^2} \\times 100\\% = ${pct((f * f - 1) * 100)}`, null,
      p === 20 ? "+20% on the radius gives +44% on the area, because 1.2² = 1.44." : `Area factor = ${num(f, 2)}² = ${num(f * f, 4)}.`);
  };
  s.on(draw);
  draw(s.get());
}

/* ---------- Q11–Q29: growth and decay ---------- */

const yrs = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

function q11(root) {
  timeline(root, {
    q: "An air ticket cost \\$1600 three weeks ago. Its price increases by 10% per week. Find the present price.",
    lets: ["Present price $= 1600(1 + 10\\%)^3$"],
    labels: ["3 wks ago", "2 wks ago", "1 wk ago", "Now"], start: 1600, rates: same(10, 3), prefix: "$", stepLabel: "Weeks",
  });
}

function q12(root) {
  timeline(root, {
    q: "Two years ago there were 500 monkeys. The number increases by 4% per year. Find the number one year from now.",
    lets: ["2 years ago → 1 year from now: 3 periods", "Number $= 500 \\times 1.04^3$"],
    labels: ["2 yrs ago", "1 yr ago", "Now", "1 yr later"], start: 500, rates: same(4, 3), stepLabel: "Years",
    caption: (n) => n === 3 ? "562.432 → 562 monkeys (nearest integer). Count the periods: 3, not 1." : "",
  });
}

function q13(root) {
  timeline(root, backward({
    q: "A drawing is worth \\$4913 now. Its value has increased by 15% per year. Find its value 3 years ago.",
    lets: ["Let \\$$y$ be the value 3 years ago.", "$y \\times 1.15^3 = 4913$"],
    labels: ["3 yrs ago", "2 yrs ago", "1 yr ago", "Now"], prefix: "$", dp: 2, stepLabel: "Years",
    unknown: { label: "Value 3 years ago y", min: 2500, max: 4500, step: 10, value: 2800, fmt: (v) => `$${num(v)}` },
    start: (y) => y, rates: same(15, 3),
    given: { at: 3, value: 4913, label: "$4913" }, tol: 6,
    yes: "y ≈ 3230 (3 significant figures).",
    buttons: [["Answer: $3230", 3230, 3]],
  }));
}

function q14(root) {
  timeline(root, backward({
    q: "A flat is worth \\$5 800 000 now. Its value increased by 7% per year in the past 5 years and will continue for the next 3 years.",
    lets: ["(a) $5\\ 800\\ 000 \\times 1.07^3$", "(b) Let \\$$V$ be the value 5 years ago: $V \\times 1.07^5 = 5\\ 800\\ 000$"],
    labels: ["−5", "−4", "−3", "−2", "−1", "Now", "+1", "+2", "+3"], prefix: "$", dp: 0, stepLabel: "Years from 5 years ago",
    unknown: { label: "V (5 years ago)", min: 3000000, max: 5800000, step: 5000, value: 3600000, fmt: (v) => `$${num(v)}` },
    start: (v) => v, rates: same(7, 8),
    given: { at: 5, value: 5800000, label: "$5 800 000" }, tol: 3600,
    yes: "V ≈ $4 135 000; 3 years later the flat is worth about $7 105 000.",
    buttons: [["(b) V = $4 135 000", 4135000, 5], ["(a) 3 years later", 4135000, 8]],
  }));
}

function q15(root) {
  timeline(root, {
    q: "Magazine sales were 40 000 three months ago and decrease by 5% per month. Find the sales this month.",
    lets: ["Sales $= 40\\ 000 \\times 0.95^3$"],
    labels: ["3 mths ago", "2 mths ago", "1 mth ago", "This month"], start: 40000, rates: same(-5, 3), loss: true, stepLabel: "Months",
  });
}

function q16(root) {
  timeline(root, {
    q: "A diamond ring was worth \\$9400 in 2016. Its value decreased by 6% per year. Find its value in 2021 and the overall decrease.",
    lets: ["(a) $9400 \\times 0.94^5$", "(b) Overall decrease $= 9400 - 9400 \\times 0.94^5$"],
    labels: yrs(2016, 2021), start: 9400, rates: same(-6, 5), prefix: "$", dp: 2, loss: true, stepLabel: "Years after 2016",
    caption: (n, vals) => `Red dashed part = decrease so far: $${num(9400 - vals[n], 2)}.`,
  });
}

function q18(root) {
  timeline(root, backward({
    q: "An earphone is worth \\$800 now and depreciates at 10% per month. Find its value 2 months later and 3 months ago.",
    lets: ["(a) $800 \\times 0.9^2$", "(b) Let \\$$y$ be the value 3 months ago: $y \\times 0.9^3 = 800$"],
    labels: ["−3", "−2", "−1", "Now", "+1", "+2"], prefix: "$", dp: 2, stepLabel: "Months from 3 months ago",
    unknown: { label: "y (3 months ago)", min: 800, max: 1300, step: 1, value: 1040, fmt: (v) => `$${num(v)}` },
    start: (y) => y, rates: same(-10, 5), loss: true,
    given: { at: 3, value: 800, label: "$800" }, tol: 0.4,
    yes: "y ≈ $1097; 2 months later the earphone is worth $648.",
    buttons: [["Wrong: 800 × 1.1³ = 1064.8", 1065, 3], ["(b) y = $1097", 1097, 3], ["(a) 2 months later", 1097, 5]],
  }));
}

function q19(root) {
  timeline(root, {
    q: "Water in a bathtub increases by 13% every 15 seconds. Now it is 5000 cm³. Find the volume after one minute.",
    lets: ["Number of periods $= \\dfrac{60\\text{ s}}{15\\text{ s}} = 4$", "Volume $= 5000 \\times 1.13^4$"],
    labels: ["0 s", "15 s", "30 s", "45 s", "60 s"], start: 5000, rates: same(13, 4), dp: 1, stepLabel: "15-second periods",
  });
}

function q20(root) {
  timeline(root, {
    q: "An ice cube of 15 cm³ loses 9% of its volume every 5 minutes. Find the volume 20 minutes later.",
    lets: ["Number of periods $= \\dfrac{20\\text{ min}}{5\\text{ min}} = 4$", "Volume $= 15 \\times 0.91^4$"],
    labels: ["0 min", "5 min", "10 min", "15 min", "20 min"], start: 15, rates: same(-9, 4), dp: 3, loss: true, stepLabel: "5-minute periods",
  });
}

function q21(root) {
  timeline(root, backward({
    q: "Flu cases: 79 860 in 2017. They rose 10% per year from 2014 to 2017, then fell 7% per year to 2021. Was 2021 higher than 2014?",
    lets: ["(a) Let $x$ be the number in 2014: $x \\times 1.1^3 = 79\\ 860$", "(b) 2021: $79\\ 860 \\times 0.93^4$"],
    labels: yrs(2014, 2021), dp: 0, stepLabel: "Years after 2014",
    unknown: { label: "x (2014)", min: 50000, max: 70000, step: 500, value: 55000, fmt: (v) => num(v) },
    start: (x) => x, rates: [10, 10, 10, -7, -7, -7, -7],
    given: { at: 3, value: 79860, label: "79 860" }, tol: 1,
    threshold: { value: (s) => s, label: "2014 level" },
    yes: "x = 60 000. Now press 2021: 59 739 < 60 000, so Holly is wrong.",
    buttons: [["(a) x = 60 000", 60000, 3], ["(b) go to 2021", 60000, 7]],
  }));
}

function q22(root) {
  timeline(root, {
    q: "A lake holds 6000 m³. It decreases by 5% per year for 3 years, then increases by 8% the next year. Find the overall percentage change.",
    lets: ["After 4 years: $6000 \\times 0.95^3 \\times 1.08 = 5555.79$", "Change $= \\dfrac{5555.79 - 6000}{6000} \\times 100\\%$"],
    labels: ["Start", "Year 1", "Year 2", "Year 3", "Year 4"], start: 6000, rates: [-5, -5, -5, 8], stepLabel: "Years",
    threshold: { value: (s) => s, label: "start 6000" },
    caption: (n, vals) => `Overall change so far: ${num(((vals[n] - 6000) / 6000) * 100, 1)}%.${n === 4 ? " The +8% does not cancel three −5%s." : ""}`,
  });
}

function q23(root) {
  timeline(root, {
    q: "A bicycle depreciated at a constant rate from 2016 to 2021. It was worth \\$6000 in 2019 and \\$4560 in 2020.",
    lets: ["(a) Rate $= \\dfrac{6000 - 4560}{6000} \\times 100\\% = 24\\%$", "(b) 2016: $\\dfrac{6000}{0.76^3}$; 2021: $4560 \\times 0.76$"],
    labels: yrs(2016, 2021), prefix: "$", dp: 0, loss: true, stepLabel: "Years after 2016",
    unknown: { label: "Rate r% per year", min: 10, max: 35, step: 1, value: 18, fmt: (v) => `${v}%` },
    start: (r) => 6000 / (1 - r / 100) ** 3, rates: (r) => same(-r, 5),
    given: { at: 3, value: 6000, label: "$6000 in 2019" },
    check: (r, n, vals) => {
      const ok = near(vals[4], 4560, 1);
      return [ok, ok ? `r = 24. Depreciation 2016 → 2021 = $${num(vals[0] - vals[5], 0)}.` : `2020 value is $${num(vals[4], 0)}; it should be $4560.`, { yes: "2020 = $4560", no: "2020 ≠ $4560" }];
    },
    read: (r, n, vals) => `\\text{2016} = \\dfrac{6000}{${factor(-r)}^3} = ${tnum(vals[0], 0)}`,
    buttons: [["Answer: 24%", 24, 5]],
  });
}

function q24(root) {
  timeline(root, {
    q: "A phone cost \\$6500 in 2021 and is worth \\$4875 a year later, falling at the same rate. Amy gets it when it is worth less than one third of \\$6500. Will she get it in 2024?",
    lets: ["(a) Rate $= \\dfrac{6500 - 4875}{6500} \\times 100\\% = 25\\%$", "(b) 2024: $6500 \\times 0.75^3$ vs $\\dfrac{6500}{3}$"],
    labels: yrs(2021, 2026), start: 6500, rates: same(-25, 5), prefix: "$", dp: 2, show: 3, stepLabel: "Years after 2021",
    threshold: { value: (s) => s / 3, label: "⅓ × 6500" },
    check: (u, n, vals) => {
      const ok = vals[n] < 6500 / 3;
      return [ok, `${yrs(2021, 2026)[n]}: $${num(vals[n], 2)} is ${ok ? "below" : "not below"} $${num(6500 / 3, 2)}.${n === 3 ? " So Amy will not receive it in 2024." : ""}`, { yes: "Amy gets it", no: "not yet" }];
    },
  });
}

function q25(root) {
  timeline(root, backward({
    q: "Light bulbs: 150 000 in Q1 2020 and 174 960 in Q3 2020, increasing by $r\\%$ per quarter.",
    lets: ["(a) $150\\ 000(1 + r\\%)^2 = 174\\ 960$", "(b) Q4 2021 is 7 quarters after Q1 2020"],
    labels: ["Q1 20", "Q2", "Q3", "Q4", "Q1 21", "Q2", "Q3", "Q4 21"], dp: 0, show: 2, stepLabel: "Quarters after Q1 2020",
    unknown: { label: "r", min: 0, max: 15, step: 0.5, value: 5, fmt: (v) => `${v}%` },
    start: 150000, rates: (r) => same(r, 7),
    given: { at: 2, value: 174960, label: "174 960" }, tol: 1,
    yes: "r = 8. Move to Q4 2021: increase = 150 000 × 1.08⁷ − 150 000 ≈ 107 074.",
    buttons: [["(a) r = 8", 8, 2], ["(b) Q4 2021", 8, 7]],
  }));
}

function q26(root) {
  timeline(root, {
    q: "Equipment depreciates by $x\\%$ every 6 months. It was \\$750 000 in Dec 2020 and \\$541 875 in Dec 2021.",
    lets: ["(a) $750\\ 000(1 - x\\%)^2 = 541\\ 875$", "(b) Jun 2019 → Dec 2020: 3 periods, $v \\times 0.85^3 = 750\\ 000$"],
    labels: ["Jun 19", "Dec 19", "Jun 20", "Dec 20", "Jun 21", "Dec 21"], prefix: "$", dp: 0, loss: true, stepLabel: "6-month periods",
    unknown: { label: "x", min: 5, max: 25, step: 1, value: 10, fmt: (v) => `${v}%` },
    start: (x) => 750000 / (1 - x / 100) ** 3, rates: (x) => same(-x, 5),
    given: { at: 3, value: 750000, label: "$750 000" },
    check: (x, n, vals) => {
      const ok = near(vals[5], 541875, 1);
      return [ok, ok ? `x = 15. Jun 2019 value = 750 000 ÷ 0.85³ ≈ $${num(vals[0], 0)}.` : `Dec 2021 is $${num(vals[5], 0)}; it should be $541 875.`, { yes: "Dec 21 matches", no: "Dec 21 wrong" }];
    },
    read: (x, n, vals) => `750\\ 000 \\times ${factor(-x)}^2 = ${tnum(vals[5], 0)}`,
    buttons: [["Answer: x = 15", 15, 5]],
  });
}

/** Q27 checks the depreciation (the red cap), not a bar height. */
function q27(root) {
  timeline(root, {
    q: "A 3D TV is worth \\$$n$ now and depreciates by 10% per year. The depreciation after 3 years is \\$7046.",
    lets: ["(a) $n - n(1 - 10\\%)^3 = 7046$, so $0.271n = 7046$", "(b) $26\\ 000 \\times 0.9^5$"],
    labels: ["Now", "1 yr", "2 yrs", "3 yrs", "4 yrs", "5 yrs"], prefix: "$", dp: 0, loss: true, show: 3, stepLabel: "Years",
    unknown: { label: "Value now n", min: 15000, max: 35000, step: 500, value: 20000, fmt: (v) => `$${num(v)}` },
    start: (n) => n, rates: same(-10, 5),
    read: (n, k, vals) => `\\text{Depreciation} = ${tnum(n)} - ${tnum(vals[k], 0)} = ${tnum(n - vals[k], 0)}`,
    check: (n, k, vals) => {
      const ok = near(n - vals[3], 7046, 0.5);
      return [ok, ok ? `n = 26 000. After 5 years: $${num(vals[5], 2)} ≈ $15 350.` : `After 3 years the red cap is $${num(n - vals[3], 0)}; it should be $7046.`, { yes: "loss = $7046", no: "loss ≠ $7046" }];
    },
    buttons: [["(a) n = 26 000", 26000, 3], ["(b) 5 years", 26000, 5]],
  });
}

function q28(root) {
  timeline(root, {
    q: "A car worth \\$$P$ in 2021 depreciates by 10% per year. Jerry buys another car when it is worth less than half of $P$.",
    lets: ["(a) 2027: $P \\times 0.9^6 = 0.531\\ 441P$", "(b) 2028: $P \\times 0.9^7 = 0.478\\ 296\\ 9P < 0.5P$"],
    labels: yrs(2021, 2029), start: 100, rates: same(-10, 8), dp: 1, loss: true, show: 6, stepLabel: "Years after 2021",
    title: "Value as a percentage of P",
    threshold: { value: () => 50, label: "½P" },
    read: (u, n) => `P \\times 0.9^{${n}} = ${num(0.9 ** n, 7)}P`,
    check: (u, n, vals) => {
      const ok = vals[n] < 50;
      return [ok, `${yrs(2021, 2029)[n]}: ${num(vals[n], 2)}% of P.${ok && vals[n - 1] >= 50 ? " The first year below half, so Jerry buys another car in 2028." : ""}`, { yes: "below ½P", no: "not below ½P" }];
    },
  });
}

function q29(root) {
  timeline(root, {
    q: "An operation expense increases by 4.8% per year. Will it exceed double in 15 years?",
    lets: ["Let \\$$E$ be the expense now.", "After 15 years: $E \\times 1.048^{15} \\approx 2.0203E$"],
    labels: Array.from({ length: 16 }, (_, i) => String(i)), start: 100, rates: same(4.8, 15), dp: 1, stepLabel: "Years",
    title: "Expense as a percentage of E",
    threshold: { value: () => 200, label: "2E" },
    read: (u, n) => `E \\times 1.048^{${n}} = ${num(1.048 ** n, 4)}E`,
    check: (u, n, vals) => [vals[n] > 200, n === 15 ? "2.0203E > 2E, so the claim is agreed (only just)." : `${num(vals[n] / 100, 4)}E after ${n} years.`, { yes: "more than double", no: "not double yet" }],
  });
}

/* ---------- Challenge ---------- */

function q30(root) {
  const base = {
    q: "A tablet cost \\$3750 in 2016. It depreciated 20% in 2017, then $y\\%$ each year after.",
    labels: yrs(2016, 2021), prefix: "$", dp: 1, loss: true, stepLabel: "Years after 2016",
    unknown: { label: "Rate y", min: 5, max: 45, step: 1, value: 15, fmt: (v) => `${v}%` },
    start: 3750, rates: (y) => [-20, -y, -y, -y, -y],
  };
  parts(root, ["(b)(i) 2019 drop of $2062.5", "(b)(ii) 2021 price $720.3"], [
    (b) => timeline(b, backward({
      ...base, show: 3,
      lets: ["2019 price $= 3750 - 2062.5 = 1687.5$", "$3000(1 - y\\%)^2 = 1687.5$"],
      given: { at: 3, value: 1687.5, label: "$1687.5" }, tol: 0.01,
      read: (y) => `3000 \\times ${factor(-y)}^2 = ${num(3000 * (1 - y / 100) ** 2, 2)}`,
      yes: "y = 25.", buttons: [["Answer: 25", 25, 3]],
    })),
    (b) => timeline(b, backward({
      ...base, show: 5,
      lets: ["2017 → 2021: 4 years of $(1 - y\\%)$", "$3000(1 - y\\%)^4 = 720.3$"],
      given: { at: 5, value: 720.3, label: "$720.3" }, tol: 0.01,
      read: (y) => `3000 \\times ${factor(-y)}^4 = ${num(3000 * (1 - y / 100) ** 4, 2)}`,
      yes: "y = 30.", buttons: [["Answer: 30", 30, 5]],
    })),
  ]);
}

function q31(root) {
  timeline(root, {
    q: "Peter's salary grows 8% per year and rose by \\$3246.4 from 2019 to 2022. David's was \\$15 000 in 2019 and \\$15 600 in 2020. Will Peter earn more in 2025?",
    lets: ["(a) $P(1.08^3 - 1) = 3246.4$, so $P = 12\\ 500$", "(b) David's growth factor $= \\dfrac{15\\ 600}{15\\ 000} = 1.04$"],
    labels: yrs(2019, 2025), start: 12500, rates: same(8, 6), prefix: "$", dp: 0, stepLabel: "Years after 2019",
    title: "Monthly salary", mainName: "Peter ×1.08", compare: { name: "David ×1.04", values: () => Array.from({ length: 7 }, (_, i) => 15000 * 1.04 ** i) },
    read: (u, n, vals) => `\\text{Peter } ${tnum(vals[n], 0)} \\quad \\text{David } ${tnum(15000 * 1.04 ** n, 0)}`,
    check: (u, n, vals) => {
      const ok = vals[n] > 15000 * 1.04 ** n;
      return [ok, n === 6 ? "2025: $19 836 > $18 980, so the claim is agreed." : ok ? "Peter is ahead this year." : "David is still ahead.", { yes: "Peter higher", no: "David higher" }];
    },
  });
}

function q32(root) {
  timeline(root, {
    q: "A sports car bought in 2019 depreciates at $r\\%$ per year. It lost \\$600 000 in 2020 and \\$1 080 000 from 2019 to 2021. Will it be worth less than one-tenth by 2029?",
    lets: ["$P \\times r\\% = 600\\ 000$ ...(1)", "$P - P(1 - r\\%)^2 = 1\\ 080\\ 000$ ...(2), giving $r = 20$"],
    labels: yrs(2019, 2029), prefix: "$", dp: 0, loss: true, show: 2, stepLabel: "Years after 2019",
    unknown: { label: "Rate r", min: 10, max: 30, step: 1, value: 15, fmt: (v) => `${v}%` },
    start: (r) => 600000 / (r / 100), rates: (r) => same(-r, 10),
    threshold: { value: (s) => s / 10, label: "P ÷ 10" },
    read: (r, n, vals) => `\\text{drop 2019 to 2021} = ${tnum(vals[0] - vals[2], 0)}`,
    check: (r, n, vals) => {
      const ok = near(vals[0] - vals[2], 1080000, 1);
      const p = `P = 600 000 ÷ ${r}% = $${num(vals[0], 0)}. `;
      return [ok, p + (ok ? (n === 10 ? "2029: 0.107…P > 0.1P, so the claim is disagreed." : "r = 20 fits both facts. Move to 2029.") : "The drop should be $1 080 000."), { yes: "fits (1) and (2)", no: "does not fit (2)" }];
    },
    buttons: [["r = 20", 20, 2], ["Go to 2029", 20, 10]],
  });
}

const REGISTRY = {
  ex1, ex2, ex3, p3, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
  ex4, p4, ex5, p5, ex6, p6: fish,
  q11, q12, q13, q14, q15, q16, q17: fish, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29,
  q30, q31, q32,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
