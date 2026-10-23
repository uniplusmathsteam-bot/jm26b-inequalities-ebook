/**
 * Interactive graphics for JM27 (B) Percentages II: simple and compound interest.
 * Principal / Interest / Amount bars, rate and time sliders, and side-by-side
 * bank compares. No function graphs (S3).
 */

import { C, S, T, H, scene, clear, bar, dashed, slider, readout, question, tabs, buttonRow } from "../../engine/widgets/kit.js";

function round(v, dp) {
  const k = 10 ** dp;
  return Math.round(v * k) / k;
}

function num(v, dp = 2) {
  const r = round(v, dp);
  const [i, f] = Math.abs(r).toFixed(dp).split(".");
  const int = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : i;
  const frac = f ? f.replace(/0+$/, "") : "";
  return `${r < 0 ? "−" : ""}${int}${frac ? `.${frac}` : ""}`;
}

const nb = (s) => s.replace(/(\d) (?=\d{3}\b)/g, "$1\u00a0");
const tnum = (v, dp) => num(v, dp).replace(/ /g, "\\ ").replace("−", "-");
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const HALO = { stroke: C.paper, "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round" };

function parts(root, names, builders) {
  const body = H("div");
  root.append(tabs(names, (i) => {
    body.replaceChildren();
    builders[i](body);
  }), body);
  builders[0](body);
}

function moneyBars(svg, { P, I, A, labels, top }) {
  const rows = [
    { lab: labels?.[0] || "Principal", v: P, fill: C.blue },
    { lab: labels?.[1] || "Interest", v: I, fill: I >= 0 ? C.green : C.pink },
    { lab: labels?.[2] || "Amount", v: A, fill: C.amber },
  ];
  const maxV = Math.max(...rows.map((r) => Math.abs(r.v)), top || 0, 1);
  const k = 400 / maxV;
  const x = 130;
  T(svg, 16, 24, "Principal · Interest · Amount", { "font-weight": 700, "font-size": 14 });
  rows.forEach((r, i) => {
    const y = 48 + i * 52;
    T(svg, x - 10, y + 18, r.lab, { "text-anchor": "end", "font-size": 13 });
    bar(svg, x, y, Math.abs(r.v) * k, 28, r.fill);
    T(svg, x + 8, y + 19, `$${num(r.v, Math.abs(r.v) >= 100 ? 0 : 2)}`, { fill: "#fff", "font-weight": 700, ...HALO });
  });
}

/**
 * Simple interest explorer. cfg: q, lets, P (or unknown slider), rate, years,
 * find ("I"|"A"|"P"|"r"|"t"), given, buttons, dp.
 */
function simple(root, cfg) {
  const svg = scene(640, 220);
  const r = readout();
  const kids = [question(nb(cfg.q), cfg.lets), svg];
  const uS = cfg.unknown ? slider(cfg.unknown) : null;
  const rateS = cfg.rateSlider ? slider(cfg.rateSlider) : null;
  const yearS = cfg.yearSlider ? slider(cfg.yearSlider) : null;
  if (uS) kids.push(uS.el);
  if (rateS) kids.push(rateS.el);
  if (yearS) kids.push(yearS.el);
  kids.push(r.el);
  if (cfg.buttons) {
    kids.push(buttonRow(cfg.buttons.map(([label, vals]) => [label, () => {
      if (vals.u != null && uS) uS.set(vals.u);
      if (vals.rate != null && rateS) rateS.set(vals.rate);
      if (vals.years != null && yearS) yearS.set(vals.years);
    }])));
  }
  root.append(...kids);

  const draw = () => {
    clear(svg);
    const u = uS ? uS.get() : null;
    const rate = rateS ? rateS.get() : (typeof cfg.rate === "function" ? cfg.rate(u) : cfg.rate);
    const years = yearS ? yearS.get() : (typeof cfg.years === "function" ? cfg.years(u) : cfg.years);
    const P = typeof cfg.P === "function" ? cfg.P(u, rate, years) : cfg.P;
    const I = P * (rate / 100) * years;
    const A = P + I;
    moneyBars(svg, { P, I, A, top: cfg.top });
    if (cfg.given != null) {
      dashed(svg, 130 + cfg.given * (400 / Math.max(A, P, cfg.given, 1)), 40, 130 + cfg.given * (400 / Math.max(A, P, cfg.given, 1)), 200, C.amber, cfg.givenLabel || "given");
    }
    const latex = cfg.read
      ? cfg.read(u, { P, I, A, rate, years })
      : `I = ${tnum(P, 0)} \\times ${rate}\\% \\times ${tnum(years, 4)} = ${tnum(I, cfg.dp ?? 0)},\\ A = ${tnum(A, cfg.dp ?? 0)}`;
    const [ok, caption, labels] = cfg.check
      ? cfg.check(u, { P, I, A, rate, years })
      : [null, cfg.caption ? cfg.caption({ P, I, A, rate, years }) : ""];
    r.set(latex, ok, caption, labels);
  };
  uS?.on(draw);
  rateS?.on(draw);
  yearS?.on(draw);
  draw();
}

/**
 * Compound interest explorer. cfg: P, rate, years, n (compoundings/year),
 * unknown / rateSlider / yearSlider / nSlider, find interest or amount.
 */
function compound(root, cfg) {
  const svg = scene(640, 240);
  const r = readout();
  const kids = [question(nb(cfg.q), cfg.lets), svg];
  const uS = cfg.unknown ? slider(cfg.unknown) : null;
  const rateS = cfg.rateSlider ? slider(cfg.rateSlider) : null;
  const yearS = cfg.yearSlider ? slider(cfg.yearSlider) : null;
  const nS = cfg.nSlider ? slider(cfg.nSlider) : null;
  if (uS) kids.push(uS.el);
  if (rateS) kids.push(rateS.el);
  if (yearS) kids.push(yearS.el);
  if (nS) kids.push(nS.el);
  kids.push(r.el);
  if (cfg.buttons) {
    kids.push(buttonRow(cfg.buttons.map(([label, vals]) => [label, () => {
      if (vals.u != null && uS) uS.set(vals.u);
      if (vals.rate != null && rateS) rateS.set(vals.rate);
      if (vals.years != null && yearS) yearS.set(vals.years);
      if (vals.n != null && nS) nS.set(vals.n);
    }])));
  }
  root.append(...kids);

  const draw = () => {
    clear(svg);
    const u = uS ? uS.get() : null;
    const rate = rateS ? rateS.get() : (typeof cfg.rate === "function" ? cfg.rate(u) : cfg.rate);
    const years = yearS ? yearS.get() : (typeof cfg.years === "function" ? cfg.years(u) : cfg.years);
    const n = nS ? nS.get() : (typeof cfg.n === "function" ? cfg.n(u) : cfg.n);
    const P = typeof cfg.P === "function" ? cfg.P(u, rate, years, n) : cfg.P;
    const factor = (1 + rate / 100 / n) ** (n * years);
    const A = P * factor;
    const I = A - P;
    moneyBars(svg, { P, I: round(I, cfg.dp ?? 0), A: round(A, cfg.dp ?? 0), top: cfg.top });
    T(svg, 16, 220, `factor (1 + ${rate}%/${n})^{${n}×${num(years, 2)}} = ${num(factor, 6)}`, { "font-size": 12, fill: C.ink, "font-weight": 700 });
    if (cfg.given != null) {
      const maxV = Math.max(A, P, cfg.given, 1);
      const x = 130 + cfg.given * (400 / maxV);
      dashed(svg, x, 40, x, 190, C.amber, cfg.givenLabel || "given");
    }
    const latex = cfg.read
      ? cfg.read(u, { P, I, A, rate, years, n, factor })
      : `A = ${tnum(P, 0)}(1 + ${rate}\\%/${n})^{${n}\\times ${tnum(years, 2)}} = ${tnum(A, cfg.dp ?? 0)}`;
    const [ok, caption, labels] = cfg.check
      ? cfg.check(u, { P, I, A, rate, years, n, factor })
      : [null, cfg.caption ? cfg.caption({ P, I, A, rate, years, n, factor }) : ""];
    r.set(latex, ok, caption, labels);
  };
  uS?.on(draw);
  rateS?.on(draw);
  yearS?.on(draw);
  nS?.on(draw);
  draw();
}

/** Two banks side by side (simple or compound). */
function twoBanks(root, cfg) {
  const svg = scene(640, 240);
  const r = readout();
  const uS = cfg.unknown ? slider(cfg.unknown) : null;
  const kids = [question(nb(cfg.q), cfg.lets), svg];
  if (uS) kids.push(uS.el);
  kids.push(r.el);
  if (cfg.buttons) {
    kids.push(buttonRow(cfg.buttons.map(([label, u]) => [label, () => uS?.set(u)])));
  }
  root.append(...kids);

  const draw = () => {
    clear(svg);
    const u = uS ? uS.get() : null;
    const a = cfg.bankA(u);
    const b = cfg.bankB(u);
    const maxV = Math.max(a.I, b.I, a.A || 0, b.A || 0, 1);
    const k = 180 / maxV;
    T(svg, 16, 24, cfg.title || "Interest comparison", { "font-weight": 700, "font-size": 14 });
    bar(svg, 80, 50, 14, 14, C.blue);
    T(svg, 100, 62, a.name, { "font-size": 13 });
    bar(svg, 220, 50, 14, 14, C.amber);
    T(svg, 240, 62, b.name, { "font-size": 13 });
    [["Interest", a.I, b.I, 90], ["Amount", a.A, b.A, 150]].forEach(([lab, va, vb, y]) => {
      if (va == null && vb == null) return;
      T(svg, 70, y + 18, lab, { "text-anchor": "end", "font-size": 12 });
      if (va != null) {
        bar(svg, 80, y, va * k, 26, C.blue);
        T(svg, 88, y + 18, `$${num(va, cfg.dp ?? 0)}`, { fill: "#fff", "font-size": 11, "font-weight": 700 });
      }
      if (vb != null) {
        bar(svg, 280, y, vb * k, 26, C.amber);
        T(svg, 288, y + 18, `$${num(vb, cfg.dp ?? 0)}`, { fill: "#fff", "font-size": 11, "font-weight": 700 });
      }
    });
    const latex = cfg.read ? cfg.read(u, a, b) : `I_A = ${tnum(a.I, cfg.dp ?? 0)},\\ I_B = ${tnum(b.I, cfg.dp ?? 0)}`;
    const [ok, caption, labels] = cfg.check ? cfg.check(u, a, b) : [null, ""];
    r.set(latex, ok, caption, labels);
  };
  uS?.on(draw);
  draw();
}

const SI = (P, rate, years) => P * (rate / 100) * years;
const CI = (P, rate, years, n) => P * ((1 + rate / 100 / n) ** (n * years) - 1);
const CA = (P, rate, years, n) => P * (1 + rate / 100 / n) ** (n * years);

/* ---------- Simple interest ---------- */

function ex1(root) {
  simple(root, {
    q: "Kelvin deposits \\$12 000 for 8 years at 5% p.a. simple interest. Find the amount.",
    lets: ["$A = P(1 + r\\% \\times t)$"],
    P: 12000, rate: 5, years: 8,
    yearSlider: { label: "Years t", min: 0, max: 12, step: 1, value: 8, fmt: (v) => `${v}` },
    rateSlider: { label: "Rate r", min: 1, max: 10, step: 0.5, value: 5, fmt: (v) => `${v}%` },
    buttons: [["Question", { rate: 5, years: 8 }]],
    caption: ({ A }) => `Amount = $${num(A, 0)}.`,
  });
}

function p1(root) {
  simple(root, {
    q: "Stephy deposits \\$8400 at 2.5% p.a. simple interest. Amount after 5 years?",
    lets: ["$A = 8400(1 + 2.5\\% \\times 5)$"],
    P: 8400, rate: 2.5, years: 5,
    yearSlider: { label: "Years t", min: 0, max: 10, step: 1, value: 5, fmt: (v) => `${v}` },
    buttons: [["Answer: 5 years", { years: 5 }]],
    check: (u, { A }) => [near(A, 9450, 0.5), `Amount = $${num(A, 0)}.`, { yes: "matches $9450", no: "not yet" }],
  });
}

function ex2(root) {
  simple(root, {
    q: "\\$3000 for 6 years at 7% p.a. simple interest. Find I and A.",
    lets: ["$I = P \\times r\\% \\times t$", "$A = P + I$"],
    P: 3000, rate: 7, years: 6,
    yearSlider: { label: "Years t", min: 0, max: 10, step: 1, value: 6, fmt: (v) => `${v}` },
    buttons: [["Question", { years: 6 }]],
    caption: ({ I, A }) => `I = $${num(I, 0)}, A = $${num(A, 0)}.`,
  });
}

function p2(root) {
  simple(root, {
    q: "Practice 2 (same figures as Example 2): \\$3000, 6 years, 7% p.a.",
    lets: ["$I = 3000 \\times 7\\% \\times 6$", "$A = 3000 + I$"],
    P: 3000, rate: 7, years: 6,
    yearSlider: { label: "Years t", min: 0, max: 10, step: 1, value: 6, fmt: (v) => `${v}` },
    check: (u, { I, A }) => [near(I, 1260, 0.5) && near(A, 4260, 0.5), `I = $${num(I, 0)}, A = $${num(A, 0)}.`, { yes: "matches key", no: "adjust years" }],
  });
}

function q1(root) {
  simple(root, {
    q: "\\$20 000 for 9 months at 4% p.a. simple interest.",
    lets: ["$9$ months $= \\dfrac{3}{4}$ year"],
    P: 20000, rate: 4, years: 0.75,
    yearSlider: { label: "Years t", min: 0.25, max: 2, step: 0.25, value: 0.75, fmt: (v) => num(v, 2) },
    buttons: [["9 months = ¾ yr", { years: 0.75 }]],
    check: (u, { I, A }) => [near(I, 600, 0.5), `I = $${num(I, 0)}, A = $${num(A, 0)}.`, { yes: "I = $600", no: "wrong time" }],
  });
}

function q2(root) {
  simple(root, {
    q: "\\$35 000 for 28 months at 3% p.a. simple interest.",
    lets: ["$28$ months $= \\dfrac{7}{3}$ years"],
    P: 35000, rate: 3, years: 7 / 3,
    yearSlider: { label: "Years t", min: 1, max: 4, step: 1 / 12, value: 7 / 3, fmt: (v) => num(v, 3) },
    buttons: [["28/12 = 7/3", { years: 7 / 3 }]],
    check: (u, { I }) => [near(I, 2450, 0.5), `I = $${num(I, 0)}.`, { yes: "I = $2450", no: "wrong time" }],
  });
}

function q3(root) {
  simple(root, {
    q: "Jennifer pays \\$59 200 after 4 years at 12% p.a. simple. Find P.",
    lets: ["$59\\ 200 = P(1 + 12\\% \\times 4)$"],
    P: (u) => u, rate: 12, years: 4,
    unknown: { label: "Principal P", min: 20000, max: 60000, step: 500, value: 30000, fmt: (v) => `$${num(v, 0)}` },
    given: 59200, givenLabel: "$59 200",
    buttons: [["Answer: $40 000", { u: 40000 }]],
    read: (u, { A }) => `A = ${tnum(A, 0)}`,
    check: (u, { A }) => [near(A, 59200, 1), near(A, 59200, 1) ? "P = $40 000." : `Amount is $${num(A, 0)}; need $59 200.`, { yes: "matches", no: "not yet" }],
  });
}

function q4(root) {
  simple(root, {
    q: "Ellen receives \\$44 100 after 30 months at 9% p.a. simple. Find P.",
    lets: ["$44\\ 100 = P\\left(1 + 9\\% \\times \\dfrac{30}{12}\\right)$"],
    P: (u) => u, rate: 9, years: 2.5,
    unknown: { label: "Principal P", min: 20000, max: 50000, step: 500, value: 30000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $36 000", { u: 36000 }]],
    read: (u, { A }) => `A = ${tnum(A, 0)}`,
    check: (u, { A }) => [near(A, 44100, 1), near(A, 44100, 1) ? "P = $36 000." : `Amount $${num(A, 0)}; need $44 100.`, { yes: "matches", no: "not yet" }],
  });
}

function q5(root) {
  parts(root, ["(a) Interest", "(b) Time"], [
    (b) => simple(b, {
      q: "Benson borrowed \\$32 000 at 8% p.a. and repaid \\$42 240.",
      lets: ["(a) $I = A - P$"],
      P: 32000, rate: 8, years: 4,
      caption: ({ I }) => `Interest = $42 240 − $32 000 = $${num(I, 0)}.`,
    }),
    (b) => simple(b, {
      q: "Find how long the money was borrowed.",
      lets: ["$10\\ 240 = 32\\ 000 \\times 8\\% \\times t$"],
      P: 32000, rate: 8, years: (u) => u,
      unknown: { label: "Years t", min: 1, max: 8, step: 1, value: 3, fmt: (v) => `${v}` },
      buttons: [["Answer: 4 years", { u: 4 }]],
      check: (u, { I }) => [near(I, 10240, 1), `I = $${num(I, 0)}.`, { yes: "t = 4", no: "not yet" }],
    }),
  ]);
}

function q6(root) {
  simple(root, {
    q: "Doris deposits \\$7000 at 3.5% p.a. How long until amount is \\$8960?",
    lets: ["$8960 = 7000(1 + 3.5\\% \\times t)$"],
    P: 7000, rate: 3.5, years: (u) => u,
    unknown: { label: "Years t", min: 1, max: 12, step: 1, value: 5, fmt: (v) => `${v}` },
    buttons: [["Answer: 8 years", { u: 8 }]],
    check: (u, { A }) => [near(A, 8960, 1), `A = $${num(A, 0)}.`, { yes: "t = 8", no: "not yet" }],
  });
}

function q7(root) {
  simple(root, {
    q: "Peter deposits \\$11 000. After 7 years, I = \\$3080. Find the rate.",
    lets: ["$3080 = 11\\ 000 \\times r\\% \\times 7$"],
    P: 11000, years: 7, rate: (u) => u,
    unknown: { label: "Rate r", min: 1, max: 10, step: 0.5, value: 3, fmt: (v) => `${v}%` },
    buttons: [["Answer: 4%", { u: 4 }]],
    check: (u, { I }) => [near(I, 3080, 1), `I = $${num(I, 0)}.`, { yes: "r = 4%", no: "not yet" }],
  });
}

function q8(root) {
  simple(root, {
    q: "Elaine borrowed \\$35 000 and repaid \\$39 900 after 4 years. Find r.",
    lets: ["$39\\ 900 = 35\\ 000(1 + r\\% \\times 4)$"],
    P: 35000, years: 4, rate: (u) => u,
    unknown: { label: "Rate r", min: 1, max: 8, step: 0.5, value: 2, fmt: (v) => `${v}%` },
    buttons: [["Answer: 3.5%", { u: 3.5 }]],
    check: (u, { A }) => [near(A, 39900, 1), `A = $${num(A, 0)}.`, { yes: "r = 3.5%", no: "not yet" }],
  });
}

function q9(root) {
  twoBanks(root, {
    q: "Tim borrows \\$60 000 at 8% and \\$40 000 at 9% for 3 years. Total I > \\$25 000?",
    lets: ["$I_A = 60\\ 000 \\times 8\\% \\times 3$", "$I_B = 40\\ 000 \\times 9\\% \\times 3$"],
    bankA: () => ({ name: "Bank A", I: SI(60000, 8, 3), A: 60000 + SI(60000, 8, 3) }),
    bankB: () => ({ name: "Bank B", I: SI(40000, 9, 3), A: 40000 + SI(40000, 9, 3) }),
    read: (u, a, b) => `I_A + I_B = ${tnum(a.I + b.I, 0)}`,
    check: (u, a, b) => {
      const tot = a.I + b.I;
      return [tot > 25000, `Total interest $${num(tot, 0)} ${tot > 25000 ? ">" : "≤"} $25 000.`, { yes: "exceeds", no: "does not" }];
    },
  });
}

function q10(root) {
  twoBanks(root, {
    q: "Ray \\$7200 at 6.5% vs Tim \\$7500 at 6%, both for 8 months. Who pays more?",
    lets: ["$t = \\dfrac{8}{12}$ year"],
    bankA: () => ({ name: "Ray", I: SI(7200, 6.5, 8 / 12) }),
    bankB: () => ({ name: "Tim", I: SI(7500, 6, 8 / 12) }),
    read: (u, a, b) => `I_R = ${tnum(a.I, 0)},\\ I_T = ${tnum(b.I, 0)},\\ \\text{diff} = ${tnum(a.I - b.I, 0)}`,
    check: (u, a, b) => [a.I > b.I, `Ray pays $${num(a.I - b.I, 0)} more.`, { yes: "Ray more", no: "Tim more" }],
  });
}

function q11(root) {
  simple(root, {
    q: "At 2% for 5 years vs 5% for 5 years, interest differs by \\$1650. Find P.",
    lets: ["$1650 = P(5\\% - 2\\%) \\times 5$"],
    P: (u) => u, rate: 3, years: 5,
    unknown: { label: "Principal P", min: 5000, max: 20000, step: 500, value: 8000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $11 000", { u: 11000 }]],
    read: (u, { I }) => `\\text{extra } I = ${tnum(I, 0)}`,
    check: (u, { I }) => [near(I, 1650, 1), near(I, 1650, 1) ? "P = $11 000." : `Extra I = $${num(I, 0)}.`, { yes: "matches", no: "not yet" }],
  });
}

function q12(root) {
  simple(root, {
    q: "\\$30 000 for 3 years. Tripling the rate adds \\$6300 interest. Find original r.",
    lets: ["$30\\ 000 \\times 2r\\% \\times 3 = 6300$"],
    P: 30000, years: 3, rate: (u) => 2 * u,
    unknown: { label: "Original r", min: 1, max: 8, step: 0.5, value: 2, fmt: (v) => `${v}%` },
    buttons: [["Answer: 3.5%", { u: 3.5 }]],
    read: (u, { I }) => `\\text{extra } I = ${tnum(I, 0)}`,
    check: (u, { I }) => [near(I, 6300, 1), near(I, 6300, 1) ? "r = 3.5%." : `Extra I = $${num(I, 0)}.`, { yes: "matches", no: "not yet" }],
  });
}

function q13(root) {
  simple(root, {
    q: "Interest over 20 years is triple the principal. Find r.",
    lets: ["$P \\times r\\% \\times 20 = 3P$"],
    P: 1000, years: 20, rate: (u) => u,
    unknown: { label: "Rate r", min: 5, max: 25, step: 1, value: 10, fmt: (v) => `${v}%` },
    buttons: [["Answer: 15%", { u: 15 }]],
    read: (u, { I, P }) => `I/P = ${tnum(I / P, 2)}`,
    check: (u, { I, P }) => [near(I / P, 3, 0.01), `I = ${num(I / P, 2)}P.`, { yes: "triple", no: "not triple" }],
  });
}

function q14(root) {
  simple(root, {
    q: "At 5% p.a. simple, how long until amount doubles?",
    lets: ["$P(1 + 5\\% \\times t) = 2P$"],
    P: 1000, rate: 5, years: (u) => u,
    unknown: { label: "Years t", min: 5, max: 30, step: 1, value: 10, fmt: (v) => `${v}` },
    buttons: [["Answer: 20 years", { u: 20 }]],
    read: (u, { A, P }) => `A/P = ${tnum(A / P, 2)}`,
    check: (u, { A, P }) => [near(A / P, 2, 0.01), `A = ${num(A / P, 2)}P.`, { yes: "doubled", no: "not yet" }],
  });
}

function q15(root) {
  parts(root, ["(a) Sarah", "(b) John", "(c) Profit"], [
    (b) => simple(b, {
      q: "Sarah: \\$30 000 at 3% p.a. for 5 years.",
      lets: ["$I = 30\\ 000 \\times 3\\% \\times 5$"],
      P: 30000, rate: 3, years: 5,
      check: (u, { I }) => [near(I, 4500, 0.5), `I = $${num(I, 0)}.`, { yes: "$4500", no: "" }],
    }),
    (b) => simple(b, {
      q: "John: \\$30 000 at 9.5% p.a. for 5 years.",
      lets: ["$I = 30\\ 000 \\times 9.5\\% \\times 5$"],
      P: 30000, rate: 9.5, years: 5,
      check: (u, { I }) => [near(I, 14250, 0.5), `I = $${num(I, 0)}.`, { yes: "$14 250", no: "" }],
    }),
    (b) => twoBanks(b, {
      q: "Bank profit = John's interest − Sarah's interest.",
      lets: ["$14\\ 250 - 4500 = 9750$"],
      bankA: () => ({ name: "John pays", I: 14250 }),
      bankB: () => ({ name: "Sarah receives", I: 4500 }),
      read: () => `\\text{profit} = 14250 - 4500 = 9750`,
      check: () => [true, "Bank profit = $9750.", { yes: "profit", no: "" }],
    }),
  ]);
}

function q16(root) {
  parts(root, ["(a) HKD", "(b) After interest", "(c) Profit %"], [
    (b) => {
      const svg = scene(640, 160);
      const r = readout();
      b.append(question("Clara exchanges 44 000 USD at 7.7 HKD/USD.", ["HKD $= 7.7 \\times 44\\ 000$"]), svg, r.el);
      clear(svg);
      bar(svg, 40, 60, 400, 28, C.blue);
      T(svg, 50, 79, "HKD 338 800", { fill: "#fff", "font-weight": 700 });
      r.set("7.7 \\times 44\\ 000 = 338\\ 800", true, "Original HKD sum.", { yes: "ok" });
    },
    (b) => simple(b, {
      q: "HKD 338 800 at 12% p.a. simple for 9 months, then convert at 7.63 HKD/USD.",
      lets: ["$A = 338\\ 800\\left(1 + 12\\% \\times \\dfrac{9}{12}\\right)$"],
      P: 338800, rate: 12, years: 0.75,
      yearSlider: { label: "Years", min: 0.25, max: 2, step: 0.25, value: 0.75, fmt: (v) => num(v, 2) },
      buttons: [["9 months", { years: 0.75 }]],
      check: (u, { A }) => {
        const usd = A / 7.63;
        return [near(A, 369292, 1), `HKD ${num(A, 0)} ≈ USD ${num(usd, 0)}.`, { yes: "matches", no: "not yet" }];
      },
    }),
    (b) => {
      const svg = scene(640, 160);
      const r = readout();
      b.append(question("Profit % on original 44 000 USD.", ["$\\dfrac{48\\ 400 - 44\\ 000}{44\\ 000} \\times 100\\%$"]), svg, r.el);
      clear(svg);
      bar(svg, 40, 50, 300, 26, C.blue);
      T(svg, 50, 68, "44 000 USD", { fill: "#fff", "font-weight": 700 });
      bar(svg, 40, 100, 330, 26, C.green);
      T(svg, 50, 118, "48 400 USD", { fill: "#fff", "font-weight": 700 });
      r.set("\\dfrac{4400}{44000}\\times 100\\% = 10\\%", true, "Profit 10%.", { yes: "10%" });
    },
  ]);
}

function q17(root) {
  twoBanks(root, {
    q: "\\$200 000 split between 3.5% and 4.5% banks; equal interest after 2 years.",
    lets: ["$x \\times 3.5\\% \\times 2 = (200\\ 000 - x) \\times 4.5\\% \\times 2$"],
    unknown: { label: "Bank A deposit", min: 50000, max: 150000, step: 2500, value: 100000, fmt: (v) => `$${num(v, 0)}` },
    bankA: (u) => ({ name: "Bank A 3.5%", I: SI(u, 3.5, 2), A: u + SI(u, 3.5, 2) }),
    bankB: (u) => ({ name: "Bank B 4.5%", I: SI(200000 - u, 4.5, 2), A: 200000 - u + SI(200000 - u, 4.5, 2) }),
    buttons: [["Answer: $112 500", 112500]],
    check: (u, a, b) => [near(a.I, b.I, 1), `I_A = $${num(a.I, 0)}, I_B = $${num(b.I, 0)}.`, { yes: "equal", no: "unequal" }],
  });
}

/* ---------- Compound interest ---------- */

function ex3(root) {
  compound(root, {
    q: "Example 3: compound half-yearly. Try row (a) $5000 at 4% for 1 year.",
    lets: ["$A = P\\left(1 + \\dfrac{r\\%}{n}\\right)^{nt}$, $n = 2$"],
    P: 5000, rate: 4, years: 1, n: 2, dp: 0,
    yearSlider: { label: "Years", min: 0.5, max: 4, step: 0.5, value: 1, fmt: (v) => num(v, 1) },
    rateSlider: { label: "Rate", min: 1, max: 12, step: 1, value: 4, fmt: (v) => `${v}%` },
    caption: ({ A }) => `Amount ≈ $${num(A, 0)}.`,
  });
}

function p3(root) {
  parts(root, ["(a) $60 000", "(b) $1800", "(c) $47 000"], [
    (b) => compound(b, {
      q: "Practice 3 (a): $60 000 at 8% for 6 months, quarterly.",
      lets: ["$n = 4$, $t = 0.5$"],
      P: 60000, rate: 8, years: 0.5, n: 4, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 62424, 0), `A ≈ $${num(A, 0)}.`, { yes: "$62 424", no: "" }],
    }),
    (b) => compound(b, {
      q: "Practice 3 (b): $1800 at 6% for 1 year, quarterly.",
      lets: ["$n = 4$, $t = 1$"],
      P: 1800, rate: 6, years: 1, n: 4, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 1910, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$1910", no: "" }],
    }),
    (b) => compound(b, {
      q: "Practice 3 (c): $47 000 at 12% for 2.5 years, quarterly.",
      lets: ["$n = 4$, $t = 2.5$"],
      P: 47000, rate: 12, years: 2.5, n: 4, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 63164, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$63 164", no: "" }],
    }),
  ]);
}

function ex4(root) {
  compound(root, {
    q: "Ben deposits \\$7000 at 6% p.a. compounded yearly for 3 years. Find CI.",
    lets: ["$I = 7000[(1 + 6\\%)^3 - 1]$"],
    P: 7000, rate: 6, years: 3, n: 1, dp: 0,
    yearSlider: { label: "Years", min: 1, max: 6, step: 1, value: 3, fmt: (v) => `${v}` },
    caption: ({ I }) => `Compound interest ≈ $${num(Math.round(I), 0)}.`,
  });
}

function p4(root) {
  parts(root, ["(a) Quarterly", "(b) Monthly"], [
    (b) => compound(b, {
      q: "Ben borrows \\$14 000 at 6% for 3.5 years, compounded quarterly.",
      lets: ["$n = 4$"],
      P: 14000, rate: 6, years: 3.5, n: 4, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 3245, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$3245", no: "" }],
    }),
    (b) => compound(b, {
      q: "Same loan, compounded monthly.",
      lets: ["$n = 12$"],
      P: 14000, rate: 6, years: 3.5, n: 12, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 3262, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$3262", no: "" }],
    }),
  ]);
}

function q18(root) {
  parts(root, ["(a) Half-yearly", "(b) Monthly"], [
    (b) => compound(b, {
      q: "Howard: \\$12 250 at 6% for 1 year, half-yearly.",
      lets: ["$n = 2$"],
      P: 12250, rate: 6, years: 1, n: 2, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 12996, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$12 996", no: "" }],
    }),
    (b) => compound(b, {
      q: "Same deposit, compounded monthly.",
      lets: ["$n = 12$"],
      P: 12250, rate: 6, years: 1, n: 12, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 13006, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$13 006", no: "" }],
    }),
  ]);
}

function q19(root) {
  compound(root, {
    q: "Yuki borrowed \\$36 000 at 14% p.a. compounded quarterly. Amount after 9 months?",
    lets: ["$3$ quarters, rate per quarter $= 3.5\\%$"],
    P: 36000, rate: 14, years: 0.75, n: 4, dp: 0,
    yearSlider: { label: "Years", min: 0.25, max: 2, step: 0.25, value: 0.75, fmt: (v) => num(v, 2) },
    buttons: [["9 months", { years: 0.75 }]],
    check: (u, { A }) => [near(Math.round(A), 39914, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$39 914", no: "" }],
  });
}

function q20(root) {
  compound(root, {
    q: "Jessie deposits \\$90 000 at 3% p.a. compounded yearly for 4 years. Find CI.",
    lets: ["$I = 90\\ 000[(1 + 3\\%)^4 - 1]$"],
    P: 90000, rate: 3, years: 4, n: 1, dp: 0,
    yearSlider: { label: "Years", min: 1, max: 8, step: 1, value: 4, fmt: (v) => `${v}` },
    check: (u, { I }) => [near(Math.round(I), 11296, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$11 296", no: "" }],
  });
}

function q21(root) {
  parts(root, ["(a) 27 months", "(b) 2.5 years"], [
    (b) => compound(b, {
      q: "\\$75 000 at 8% compounded quarterly for 27 months.",
      lets: ["$27 \\div 3 = 9$ quarters"],
      P: 75000, rate: 8, years: 27 / 12, n: 4, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 14632, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$14 632", no: "" }],
    }),
    (b) => compound(b, {
      q: "Same loan for 2.5 years.",
      lets: ["$2.5 \\times 4 = 10$ quarters"],
      P: 75000, rate: 8, years: 2.5, n: 4, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 16425, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$16 425", no: "" }],
    }),
  ]);
}

function q22(root) {
  compound(root, {
    q: "Emily: amount \\$46 925 after 6 years at 4% half-yearly. Find P.",
    lets: ["$46\\ 925 = P(1.02)^{12}$"],
    P: (u) => u, rate: 4, years: 6, n: 2, dp: 0,
    unknown: { label: "Principal P", min: 25000, max: 50000, step: 500, value: 35000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $37 000", { u: 37000 }]],
    check: (u, { A }) => [near(Math.round(A), 46925, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "matches", no: "not yet" }],
  });
}

function q23(root) {
  compound(root, {
    q: "Jacky earns \\$955 interest in 1 year at 12% compounded monthly. Find P.",
    lets: ["$955 = P[(1.01)^{12} - 1]$"],
    P: (u) => u, rate: 12, years: 1, n: 12, dp: 0,
    unknown: { label: "Principal P", min: 4000, max: 12000, step: 10, value: 7000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $7530", { u: 7530 }]],
    check: (u, { I }) => [near(Math.round(I), 955, 0), `I ≈ $${num(Math.round(I), 0)}.`, { yes: "matches", no: "not yet" }],
  });
}

function q24(root) {
  parts(root, ["(a) Principal", "(b) Amount"], [
    (b) => compound(b, {
      q: "Carl: interest \\$2734 after 2 years at 8% quarterly. Find P.",
      lets: ["$2734 = P[(1.02)^8 - 1]$"],
      P: (u) => u, rate: 8, years: 2, n: 4, dp: 0,
      unknown: { label: "Principal P", min: 10000, max: 25000, step: 1, value: 15000, fmt: (v) => `$${num(v, 0)}` },
      buttons: [["Answer: $15 927", { u: 15927 }]],
      check: (u, { I }) => [near(Math.round(I), 2734, 0), `I ≈ $${num(Math.round(I), 0)}.`, { yes: "matches", no: "not yet" }],
    }),
    (b) => compound(b, {
      q: "Total amount = P + 2734.",
      lets: ["$A \\approx 15\\ 927 + 2734 = 18\\ 661$"],
      P: 15927, rate: 8, years: 2, n: 4, dp: 0,
      check: (u, { A }) => [near(Math.round(A), 18661, 0), `A ≈ $${num(Math.round(A), 0)}.`, { yes: "$18 661", no: "" }],
    }),
  ]);
}

function q25(root) {
  twoBanks(root, {
    q: "Sally: \\$9000 for 3 years. Bank A 5% half-yearly vs Bank B 4.5% monthly.",
    lets: ["Compare compound interests"],
    bankA: () => ({ name: "Bank A", I: Math.round(CI(9000, 5, 3, 2)) }),
    bankB: () => ({ name: "Bank B", I: Math.round(CI(9000, 4.5, 3, 12)) }),
    read: (u, a, b) => `I_A = ${tnum(a.I, 0)},\\ I_B = ${tnum(b.I, 0)}`,
    check: (u, a, b) => [a.I > b.I, `Choose Bank A ($${num(a.I, 0)} > $${num(b.I, 0)}).`, { yes: "A better", no: "B better" }],
  });
}

function q26(root) {
  parts(root, ["(a) Which bank?", "(b) Difference"], [
    (b) => twoBanks(b, {
      q: "\\$25 000 for 2 years: X at 4% half-yearly vs Y at 3% daily.",
      lets: ["Take 1 year = 365 days"],
      dp: 2,
      bankA: () => ({ name: "Bank X", I: CI(25000, 4, 2, 2) }),
      bankB: () => ({ name: "Bank Y", I: CI(25000, 3, 2, 365) }),
      check: (u, a, b) => [a.I > b.I, `X: $${num(a.I, 2)}; Y: $${num(b.I, 2)}.`, { yes: "X more", no: "Y more" }],
    }),
    (b) => {
      const ix = CI(25000, 4, 2, 2);
      const iy = CI(25000, 3, 2, 365);
      const svg = scene(640, 160);
      const r = readout();
      b.append(question("Difference in interest (2 d.p.).", [`$\\approx ${num(ix - iy, 2)}$`]), svg, r.el);
      clear(svg);
      bar(svg, 40, 60, 400, 28, C.amber);
      T(svg, 50, 79, `Difference $${num(ix - iy, 2)}`, { fill: "#fff", "font-weight": 700 });
      r.set(`${tnum(ix, 3)} - ${tnum(iy, 4)} = ${tnum(round(ix - iy, 2), 2)}`, true, "Difference $514.96.", { yes: "ok" });
    },
  ]);
}

function q27(root) {
  parts(root, ["(a) Rate", "(b) Total interest"], [
    (b) => compound(b, {
      q: "Ray: \\$5000 → \\$5408 in 1 year, half-yearly. Find r.",
      lets: ["$5408 = 5000\\left(1 + \\dfrac{r\\%}{2}\\right)^2$"],
      P: 5000, years: 1, n: 2, rate: (u) => u, dp: 0,
      unknown: { label: "Rate r", min: 2, max: 14, step: 1, value: 6, fmt: (v) => `${v}%` },
      buttons: [["Answer: 8%", { u: 8 }]],
      check: (u, { A }) => [near(A, 5408, 0.5), `A = $${num(A, 2)}.`, { yes: "r = 8%", no: "not yet" }],
    }),
    (b) => compound(b, {
      q: "Continue one more year at 8% half-yearly. Total interest from start?",
      lets: ["$I = 5408\\left(1 + 4\\%\\right)^2 - 5000$"],
      P: 5000, rate: 8, years: 2, n: 2, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 849, 0), `Total I ≈ $${num(Math.round(I), 0)}.`, { yes: "$849", no: "" }],
    }),
  ]);
}

function q28(root) {
  parts(root, ["(a) Rate", "(b) Extra if monthly"], [
    (b) => compound(b, {
      q: "Mr Hui: \\$50 000 → \\$53 045 in 1 year, half-yearly. Find r.",
      lets: ["$53\\ 045 = 50\\ 000\\left(1 + \\dfrac{r\\%}{2}\\right)^2$"],
      P: 50000, years: 1, n: 2, rate: (u) => u, dp: 0,
      unknown: { label: "Rate r", min: 2, max: 12, step: 1, value: 5, fmt: (v) => `${v}%` },
      buttons: [["Answer: 6%", { u: 6 }]],
      check: (u, { A }) => [near(A, 53045, 0.5), `A = $${num(A, 2)}.`, { yes: "r = 6%", no: "not yet" }],
    }),
    (b) => {
      const half = 3045;
      const month = CI(50000, 6, 1, 12);
      const svg = scene(640, 180);
      const r = readout();
      b.append(question("How much more interest if compounded monthly?", ["Extra $= I_{monthly} - 3045$"]), svg, r.el,
        buttonRow([["Show", () => {}]]));
      clear(svg);
      bar(svg, 40, 50, 280, 26, C.blue);
      T(svg, 50, 68, `Half-yearly I $${num(half, 0)}`, { fill: "#fff", "font-weight": 700 });
      bar(svg, 40, 100, 280 * (month / half), 26, C.green);
      T(svg, 50, 118, `Monthly I $${num(month, 2)}`, { fill: "#fff", "font-weight": 700 });
      r.set(`${tnum(month, 2)} - 3045 \\approx ${tnum(Math.round(month - half), 0)}`, true, "About $39 more.", { yes: "$39" });
    },
  ]);
}

function q29(root) {
  twoBanks(root, {
    q: "Same P: simple 6% for 2 years equals compound r% yearly for 2 years. Find r.",
    lets: ["$0.12 = (1 + r\\%)^2 - 1$"],
    unknown: { label: "Compound rate r", min: 4, max: 8, step: 0.01, value: 5.5, fmt: (v) => `${num(v, 2)}%` },
    bankA: () => ({ name: "Simple 6%", I: 0.12 }),
    bankB: (u) => ({ name: "Compound", I: (1 + u / 100) ** 2 - 1 }),
    buttons: [["Answer: 5.83%", 5.83]],
    dp: 4,
    check: (u, a, b) => [near(a.I, b.I, 0.0002), `Simple factor 0.12 vs compound ${num(b.I, 4)}.`, { yes: "equal", no: "not yet" }],
  });
}

function q30(root) {
  compound(root, {
    q: "\\$5000 at 6% quarterly. Interest earned in the second year?",
    lets: ["$A_2 - A_1 = 5000[(1.015)^8 - (1.015)^4]$"],
    P: 5000, rate: 6, years: 2, n: 4, dp: 0,
    yearSlider: { label: "End of year", min: 1, max: 4, step: 1, value: 2, fmt: (v) => `${v}` },
    read: (u, { P, rate, years, n }) => {
      const a1 = CA(P, rate, 1, n);
      const a2 = CA(P, rate, years, n);
      return `A_{${years}} - A_1 \\approx ${tnum(a2 - a1, 0)}`;
    },
    check: (u, { P, rate, years, n }) => {
      const diff = CA(P, rate, years, n) - CA(P, rate, 1, n);
      return [years === 2 && near(Math.round(diff), 326, 0), `Year-2 interest ≈ $${num(Math.round(diff), 0)}.`, { yes: "$326", no: "move to year 2" }];
    },
  });
}

function q31(root) {
  compound(root, {
    q: "Nancy: 2nd-year interest \\$1458 at 8% quarterly. Find P.",
    lets: ["$1458 = P(1.02^8 - 1.02^4)$"],
    P: (u) => u, rate: 8, years: 2, n: 4, dp: 0,
    unknown: { label: "Principal P", min: 10000, max: 25000, step: 10, value: 15000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $16 340", { u: 16340 }]],
    read: (u, { P, rate, n }) => {
      const d = CA(P, rate, 2, n) - CA(P, rate, 1, n);
      return `\\text{2nd-year } I \\approx ${tnum(d, 0)}`;
    },
    check: (u, { P, rate, n }) => {
      const d = CA(P, rate, 2, n) - CA(P, rate, 1, n);
      return [near(Math.round(d), 1458, 0), `2nd-year I ≈ $${num(Math.round(d), 0)}.`, { yes: "matches", no: "not yet" }];
    },
  });
}

function q32(root) {
  compound(root, {
    q: "Peter: 5th-year interest \\$3752 at 12% monthly. Find P.",
    lets: ["$3752 = P(1.01^{60} - 1.01^{48})$"],
    P: (u) => u, rate: 12, years: 5, n: 12, dp: 0,
    unknown: { label: "Principal P", min: 10000, max: 30000, step: 10, value: 16000, fmt: (v) => `$${num(v, 0)}` },
    buttons: [["Answer: $18 350", { u: 18350 }]],
    read: (u, { P, rate, n }) => {
      const d = CA(P, rate, 5, n) - CA(P, rate, 4, n);
      return `\\text{5th-year } I \\approx ${tnum(d, 0)}`;
    },
    check: (u, { P, rate, n }) => {
      const d = CA(P, rate, 5, n) - CA(P, rate, 4, n);
      return [near(Math.round(d), 3752, 0), `5th-year I ≈ $${num(Math.round(d), 0)}.`, { yes: "matches", no: "not yet" }];
    },
  });
}

function q33(root) {
  twoBanks(root, {
    q: "\\$50 000 total. Bank A simple 10.5%; Bank B compound 10% yearly. After 2 years, I_A = 1.5 I_B.",
    lets: ["Let $x$ be invested in Bank $A$"],
    unknown: { label: "Bank A", min: 10000, max: 45000, step: 500, value: 25000, fmt: (v) => `$${num(v, 0)}` },
    bankA: (u) => ({ name: "Bank A (SI)", I: SI(u, 10.5, 2) }),
    bankB: (u) => ({ name: "Bank B (CI)", I: CI(50000 - u, 10, 2, 1) }),
    buttons: [["Answer: $30 000 / $20 000", 30000]],
    check: (u, a, b) => {
      const ok = near(a.I, 1.5 * b.I, 1);
      return [ok, `I_A = $${num(a.I, 0)}, 1.5 I_B = $${num(1.5 * b.I, 0)}.`, { yes: "fits", no: "not yet" }];
    },
  });
}

function q34(root) {
  parts(root, ["(a) No repayments", "(b) $10 000 / year"], [
    (b) => compound(b, {
      q: "Ken borrows \\$40 000 at 16% quarterly from 2017 to 2021 (4 years). Find CI.",
      lets: ["$16$ quarters at $4\\%$ each"],
      P: 40000, rate: 16, years: 4, n: 4, dp: 0,
      check: (u, { I }) => [near(Math.round(I), 34919, 0), `CI ≈ $${num(Math.round(I), 0)}.`, { yes: "$34 919", no: "" }],
    }),
    (b) => {
      const svg = scene(640, 260);
      const r = readout();
      const yearS = slider({ label: "Beginning of year", min: 2018, max: 2021, step: 1, value: 2021, fmt: (v) => `${v}` });
      b.append(
        question("Ken repays \\$10 000 at each year-end. Balance at start of year?", ["Each year: $\\times(1.04)^4$, then −10 000"]),
        svg, yearS.el, r.el,
        buttonRow([["Go to 2021", () => yearS.set(2021)]]),
      );
      const balances = [40000];
      for (let i = 0; i < 4; i++) balances.push(balances[i] * (1.04) ** 4 - 10000);
      const draw = () => {
        clear(svg);
        const y = yearS.get();
        const idx = y - 2017;
        const maxV = Math.max(...balances);
        const k = 400 / maxV;
        T(svg, 16, 24, "Balance after each year-end repayment", { "font-weight": 700, "font-size": 14 });
        balances.forEach((v, i) => {
          const x = 40 + i * 100;
          bar(svg, x, 220 - v * k, 50, v * k, i === idx ? C.amber : C.blue, { opacity: i === idx ? 1 : 0.7 });
          T(svg, x + 25, 238, String(2017 + i), { "text-anchor": "middle", "font-size": 11 });
          if (i <= idx) T(svg, x + 25, 220 - v * k - 6, `$${num(v, 0)}`, { "text-anchor": "middle", "font-size": 11, "font-weight": 700 });
        });
        const v = balances[idx];
        const ok = y === 2021 && near(Math.round(v), 23525, 0);
        r.set(`\\text{${y}: } ${tnum(v, 2)}`, ok || y < 2021 ? null : ok, y === 2021 ? `Owes ≈ $${num(Math.round(v), 0)}.` : `Balance ≈ $${num(v, 0)}.`, { yes: "$23 525", no: "keep going" });
      };
      yearS.on(draw);
      draw();
    },
  ]);
}

const REGISTRY = {
  ex1, p1, ex2, p2,
  q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
  q11, q12, q13, q14, q15, q16, q17,
  ex3, p3, ex4, p4,
  q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31, q32,
  q33, q34,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
