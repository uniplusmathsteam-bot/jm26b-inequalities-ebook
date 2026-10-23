/**
 * Interactive graphics for JM27 (C) Percentages II — progressive salaries tax.
 * Stacked bracket bars with rates and a live total; compound-interest checks
 * for Q8–Q9; Joseph vs Matthew for Q10; Joyce/Peter slider for Q11.
 */

import { C, S, T, scene, clear, bar, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

const BRACKETS = [
  { cap: 50_000, rate: 0.02, label: "2%" },
  { cap: 50_000, rate: 0.06, label: "6%" },
  { cap: 50_000, rate: 0.10, label: "10%" },
  { cap: 50_000, rate: 0.14, label: "14%" },
  { cap: Infinity, rate: 0.17, label: "17%" },
];
const COLORS = [C.blue, C.green, C.amber, C.pink, "#7c5cff"];

function round(v, dp = 2) {
  const k = 10 ** dp;
  return Math.round(v * k) / k;
}

/** HK grouping: 1234567 → "1 234 567". */
function num(v, dp = 0) {
  const r = round(v, dp);
  const [i, f] = Math.abs(r).toFixed(dp).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const frac = f && Number(f) ? `.${f.replace(/0+$/, "")}` : (dp && f ? `.${f}` : "");
  return `${r < 0 ? "−" : ""}${int}${frac}`;
}

const tnum = (v, dp = 0) => num(v, dp).replace(/ /g, "\\ ");

/** Split net into bracket portions; returns [{amount, rate, tax, label, color}]. */
function portions(net) {
  let rem = Math.max(0, net);
  const out = [];
  for (let i = 0; i < BRACKETS.length && rem > 0; i++) {
    const b = BRACKETS[i];
    const a = Math.min(rem, b.cap);
    out.push({ amount: a, rate: b.rate, tax: a * b.rate, label: b.label, color: COLORS[i] });
    rem -= a;
  }
  return out;
}

function taxOf(net) {
  return portions(net).reduce((s, p) => s + p.tax, 0);
}

/**
 * Draw a horizontal stack of bracket bars (width ∝ amount) with rate labels
 * and a live total readout. Optional income/allowance sliders.
 */
function taxStack(root, cfg) {
  const svg = scene(640, cfg.h || 220);
  const r = readout();
  const kids = [question(cfg.q, cfg.lets || [])];
  const incomeS = cfg.income ? slider(cfg.income) : null;
  const allowS = cfg.allowance ? slider(cfg.allowance) : null;
  const netS = cfg.net ? slider(cfg.net) : null;
  if (incomeS) kids.push(incomeS.el);
  if (allowS) kids.push(allowS.el);
  if (netS) kids.push(netS.el);
  kids.push(svg, r.el);
  if (cfg.buttons) kids.push(buttonRow(cfg.buttons));
  root.append(...kids);

  const draw = () => {
    clear(svg);
    let net;
    if (netS) net = netS.get();
    else if (incomeS) {
      const inc = incomeS.get() * (cfg.monthly ? 12 : 1);
      const all = allowS ? allowS.get() : (cfg.fixedAllowance ?? 0);
      net = inc - all;
    } else net = cfg.fixedNet ?? 0;

    const parts = portions(net);
    const total = parts.reduce((s, p) => s + p.tax, 0);
    const maxW = 520;
    const scale = Math.max(net, 1) > 0 ? maxW / Math.max(net, 50_000) : 0;
    const y0 = 56;
    const bh = 36;

    T(svg, 16, 24, cfg.title || "Salaries tax by bracket", { "font-weight": 700, "font-size": 14 });

    if (net <= 0) {
      bar(svg, 40, y0, maxW, bh, C.soft, { stroke: C.grey, "stroke-dasharray": "5 4" });
      T(svg, 40 + maxW / 2, y0 + 24, "Net ≤ 0 → tax $0", {
        "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: C.green,
      });
      r.set("\\text{tax} = \\$0", true, "No salaries tax when net chargeable income is not positive.", { yes: "tax $0", no: "tax due" });
      if (cfg.onDraw) cfg.onDraw({ net, total: 0, parts, svg, r });
      return;
    }

    let x = 40;
    for (const p of parts) {
      const w = Math.max(4, p.amount * scale);
      bar(svg, x, y0, w, bh, p.color, { opacity: 0.9 });
      if (w > 36) {
        T(svg, x + w / 2, y0 + 16, p.label, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "#fff" });
        T(svg, x + w / 2, y0 + 30, `$${num(p.tax, 0)}`, { "text-anchor": "middle", "font-size": 10, fill: "#fff" });
      } else {
        T(svg, x + w / 2, y0 - 6, p.label, { "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: p.color });
      }
      x += w + 2;
    }
    T(svg, 40, y0 + 58, `Net chargeable income = $${num(Math.max(0, net), 0)}`, { "font-size": 13, fill: C.ink });
    T(svg, 40, y0 + 78, `Salaries tax = $${num(total, total % 1 ? 2 : 0)}`, { "font-size": 14, "font-weight": 700, fill: C.ink });

    // Legend
    let lx = 40;
    const ly = y0 + 108;
    for (let i = 0; i < BRACKETS.length; i++) {
      bar(svg, lx, ly, 12, 12, COLORS[i]);
      T(svg, lx + 16, ly + 11, BRACKETS[i].label, { "font-size": 11, fill: "#444" });
      lx += 52;
    }

    const latex = cfg.read
      ? cfg.read(net, total, parts)
      : `\\$ ${tnum(Math.max(0, net))} \\rightarrow \\text{tax }\\$${tnum(total, total % 1 ? 2 : 0)}`;
    const [ok, caption, labels] = cfg.check
      ? cfg.check(net, total, parts)
      : [null, cfg.caption ? cfg.caption(net, total) : `Live total: $${num(total, total % 1 ? 2 : 0)}`];
    r.set(latex, ok, caption, labels);
    if (cfg.onDraw) cfg.onDraw({ net, total, parts, svg, r });
  };

  incomeS?.on(draw);
  allowS?.on(draw);
  netS?.on(draw);
  draw();
  return { draw, incomeS, allowS, netS };
}

/* ---------- Example 1 / Practice 1 / simple tax ---------- */

function p1(root) {
  taxStack(root, {
    q: "Anthony's annual income is $\\$290\\ 000$, allowance $\\$180\\ 000$. Find his salaries tax.",
    lets: ["Net $= \\$290\\ 000 - \\$180\\ 000 = \\$110\\ 000$"],
    title: "Practice 1 — Anthony",
    income: { label: "Annual income ($)", min: 150_000, max: 400_000, step: 10_000, value: 290_000, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 100_000, max: 250_000, step: 10_000, value: 180_000, fmt: (v) => `$${num(v)}` },
    check: (net, total) => [
      Math.abs(net - 110_000) < 1 && Math.abs(total - 5000) < 0.5,
      Math.abs(total - 5000) < 0.5 ? "Matches Practice 1: tax $5000." : `Tax $${num(total)}. Answer is $5000.`,
    ],
  });
}

function q1(root) {
  taxStack(root, {
    q: "Mark's net chargeable income is $\\$40\\ 000$. Find his salaries tax payable.",
    title: "Q1 — Mark",
    net: { label: "Net chargeable ($)", min: 0, max: 80_000, step: 1000, value: 40_000, fmt: (v) => `$${num(v)}` },
    check: (net, total) => [
      Math.abs(net - 40_000) < 1 && Math.abs(total - 800) < 0.5,
      Math.abs(total - 800) < 0.5 ? "Tax = $800 at 2%." : `Tax $${num(total)}.`,
    ],
  });
}

function q2(root) {
  taxStack(root, {
    q: "Leon's net chargeable income is $\\$120\\ 000$. Find his salaries tax payable.",
    title: "Q2 — Leon",
    net: { label: "Net chargeable ($)", min: 0, max: 250_000, step: 5000, value: 120_000, fmt: (v) => `$${num(v)}` },
    check: (net, total) => [
      Math.abs(net - 120_000) < 1 && Math.abs(total - 6000) < 0.5,
      Math.abs(total - 6000) < 0.5 ? "Tax = $6000." : `Tax $${num(total)}.`,
    ],
  });
}

function q3(root) {
  taxStack(root, {
    q: "Chris: annual income $\\$350\\ 000$, allowance $\\$192\\ 000$.",
    lets: ["Net $= \\$350\\ 000 - \\$192\\ 000 = \\$158\\ 000$"],
    title: "Q3 — Chris",
    income: { label: "Annual income ($)", min: 200_000, max: 500_000, step: 10_000, value: 350_000, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 100_000, max: 250_000, step: 2000, value: 192_000, fmt: (v) => `$${num(v)}` },
    check: (net, total) => [
      Math.abs(net - 158_000) < 1 && Math.abs(total - 10_120) < 0.5,
      Math.abs(total - 10_120) < 0.5 ? "Tax = $10 120." : `Tax $${num(total)}.`,
    ],
  });
}

function q4(root) {
  taxStack(root, {
    q: "Jimmy: annual income $\\$240\\ 000$, allowance $\\$250\\ 000$.",
    lets: ["$\\because$ allowance $>$ income $\\Rightarrow$ tax $= \\$0$"],
    title: "Q4 — Jimmy (net ≤ 0)",
    income: { label: "Annual income ($)", min: 100_000, max: 300_000, step: 10_000, value: 240_000, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 100_000, max: 300_000, step: 10_000, value: 250_000, fmt: (v) => `$${num(v)}` },
    check: (net, total) => [
      net <= 0 && total === 0,
      net <= 0 ? "Allowance exceeds income → tax $0." : `Net $${num(net)} → tax $${num(total)}.`,
      { yes: "tax $0", no: "tax due" },
    ],
  });
}

function q5(root) {
  taxStack(root, {
    q: "Gordon: monthly $\\$19\\ 000$, allowance $\\$230\\ 000$. Does he pay tax?",
    lets: ["Annual $= \\$19\\ 000 \\times 12 = \\$228\\ 000 < \\$230\\ 000$"],
    title: "Q5 — Gordon (net ≤ 0 → tax 0)",
    income: { label: "Monthly income ($)", min: 10_000, max: 30_000, step: 500, value: 19_000, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 150_000, max: 280_000, step: 5000, value: 230_000, fmt: (v) => `$${num(v)}` },
    monthly: true,
    check: (net, total) => [
      net <= 0 && total === 0,
      net <= 0 ? "Annual < allowance → claim agreed, tax $0." : `Net $${num(net)} → he would pay $${num(total)}.`,
      { yes: "no tax", no: "pays tax" },
    ],
  });
}

function q6(root) {
  taxStack(root, {
    q: "Wendy: monthly $\\$17\\ 400$, allowance $\\$142\\ 000$.",
    title: "Q6 — Wendy",
    income: { label: "Monthly income ($)", min: 10_000, max: 30_000, step: 200, value: 17_400, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 80_000, max: 200_000, step: 2000, value: 142_000, fmt: (v) => `$${num(v)}` },
    monthly: true,
    check: (net, total) => [
      Math.abs(net - 66_800) < 1 && Math.abs(total - 2008) < 0.5,
      Math.abs(total - 2008) < 0.5 ? "Tax = $2008." : `Tax $${num(total)}.`,
    ],
  });
}

function q7(root) {
  taxStack(root, {
    q: "Tiffany: monthly $\\$49\\ 000$, allowance $\\$195\\ 000$.",
    title: "Q7 — Tiffany",
    income: { label: "Monthly income ($)", min: 20_000, max: 70_000, step: 1000, value: 49_000, fmt: (v) => `$${num(v)}` },
    allowance: { label: "Allowance ($)", min: 100_000, max: 250_000, step: 5000, value: 195_000, fmt: (v) => `$${num(v)}` },
    monthly: true,
    check: (net, total) => [
      Math.abs(net - 393_000) < 1 && Math.abs(total - 48_810) < 0.5,
      Math.abs(total - 48_810) < 0.5 ? "Tax = $48 810." : `Tax $${num(total)}.`,
    ],
  });
}

/* ---------- Q8: tax + compound interest ---------- */

function q8(root) {
  const svg = scene(640, 280);
  const r = readout();
  const incS = slider({ label: "Monthly income ($)", min: 15_000, max: 45_000, step: 1000, value: 29_000, fmt: (v) => `$${num(v)}` });
  const allS = slider({ label: "Allowance ($)", min: 100_000, max: 220_000, step: 1000, value: 173_000, fmt: (v) => `$${num(v)}` });
  const depS = slider({ label: "Deposit ($)", min: 100_000, max: 400_000, step: 10_000, value: 240_000, fmt: (v) => `$${num(v)}` });
  root.append(
    question("Sarah: tax from monthly income, then compare with quarterly compound interest.",
      ["Interest $= P\\bigl[(1 + 5\\%/4)^4 - 1\\bigr]$", "Is interest enough to pay the tax?"]),
    incS.el, allS.el, depS.el, svg, r.el,
    buttonRow([["Sarah's values", () => { incS.set(29_000); allS.set(173_000); depS.set(240_000); }]]),
  );

  const draw = () => {
    clear(svg);
    const net = incS.get() * 12 - allS.get();
    const tax = taxOf(net);
    const P = depS.get();
    const interest = P * ((1 + 0.05 / 4) ** 4 - 1);
    const ok = interest >= tax;

    // Tax stack (compact)
    const parts = portions(net);
    const maxW = 500;
    const scale = maxW / Math.max(net, 1);
    let x = 40;
    T(svg, 16, 22, "(a) Salaries tax", { "font-weight": 700, "font-size": 13 });
    if (net <= 0) {
      T(svg, 40, 60, "Net ≤ 0 → tax $0", { fill: C.green, "font-weight": 700 });
    } else {
      for (const p of parts) {
        const w = Math.max(3, p.amount * scale);
        bar(svg, x, 36, w, 28, p.color);
        x += w + 1;
      }
      T(svg, 40, 82, `Tax = $${num(tax)}`, { "font-size": 13, "font-weight": 700 });
    }

    // Interest bar vs tax line
    T(svg, 16, 118, "(b) Interest vs tax", { "font-weight": 700, "font-size": 13 });
    const top = Math.max(tax, interest, 1) * 1.15;
    const Y = (v) => 250 - (v / top) * 100;
    bar(svg, 80, Y(interest), 70, 250 - Y(interest), ok ? C.green : C.pink);
    bar(svg, 200, Y(tax), 70, 250 - Y(tax), C.amber);
    T(svg, 115, 268, "interest", { "text-anchor": "middle", "font-size": 12 });
    T(svg, 235, 268, "tax", { "text-anchor": "middle", "font-size": 12 });
    S("line", { x1: 60, y1: Y(tax), x2: 300, y2: Y(tax), stroke: C.amber, "stroke-width": 1.5, "stroke-dasharray": "4 3" }, svg);
    T(svg, 310, Y(tax) + 4, `$${num(tax)}`, { "font-size": 12, fill: C.amber, "font-weight": 700 });
    T(svg, 115, Y(interest) - 6, `$${num(interest, 2)}`, { "text-anchor": "middle", "font-size": 11, "font-weight": 700 });

    r.set(
      `\\$ ${tnum(interest, 2)} ${ok ? "\\ge" : "<"} \\$ ${tnum(tax)}`,
      ok,
      ok ? "Interest covers the tax." : "Interest is not enough to pay the tax.",
      { yes: "enough", no: "not enough" },
    );
  };
  incS.on(draw); allS.on(draw); depS.on(draw);
  draw();
}

/* ---------- Q9: tax + reverse compound ---------- */

function q9(root) {
  const svg = scene(640, 260);
  const r = readout();
  const incS = slider({ label: "Monthly income ($)", min: 40_000, max: 100_000, step: 500, value: 75_500, fmt: (v) => `$${num(v)}` });
  const allS = slider({ label: "Allowance ($)", min: 100_000, max: 220_000, step: 5000, value: 155_000, fmt: (v) => `$${num(v)}` });
  const pS = slider({ label: "Deposit P ($)", min: 60_000, max: 130_000, step: 500, value: 97_810, fmt: (v) => `$${num(v)}` });
  root.append(
    question("Vicky: find tax, then least deposit at 11.5% p.a. compounded monthly.",
      ["Amount $= P(1 + 11.5\\%/12)^{12}$", "Need amount $\\ge$ tax"]),
    incS.el, allS.el, pS.el, svg, r.el,
    buttonRow([["Vicky's values", () => { incS.set(75_500); allS.set(155_000); pS.set(97_810); }]]),
  );

  const draw = () => {
    clear(svg);
    const net = incS.get() * 12 - allS.get();
    const tax = taxOf(net);
    const P = pS.get();
    const amount = P * (1 + 0.115 / 12) ** 12;
    const need = tax / (1 + 0.115 / 12) ** 12;
    const ok = amount + 0.5 >= tax; // nearest-integer deposit

    const parts = portions(net);
    const maxW = 500;
    const scale = maxW / Math.max(net, 1);
    let x = 40;
    T(svg, 16, 22, "(a) Salaries tax", { "font-weight": 700, "font-size": 13 });
    for (const p of parts) {
      const w = Math.max(2, p.amount * scale);
      bar(svg, x, 36, w, 26, p.color);
      x += w + 1;
    }
    T(svg, 40, 80, `Tax = $${num(tax)}`, { "font-size": 13, "font-weight": 700 });

    T(svg, 16, 118, "(b) Deposit → amount after 1 year", { "font-weight": 700, "font-size": 13 });
    const top = Math.max(tax, amount, 1) * 1.12;
    const Y = (v) => 240 - (v / top) * 90;
    bar(svg, 100, Y(amount), 80, 240 - Y(amount), ok ? C.green : C.pink);
    S("line", { x1: 70, y1: Y(tax), x2: 280, y2: Y(tax), stroke: C.amber, "stroke-width": 2, "stroke-dasharray": "4 3" }, svg);
    T(svg, 290, Y(tax) + 4, `tax $${num(tax)}`, { "font-size": 12, fill: C.amber, "font-weight": 700 });
    T(svg, 140, Y(amount) - 6, `$${num(amount, 0)}`, { "text-anchor": "middle", "font-size": 12, "font-weight": 700 });
    T(svg, 400, 160, `Least P ≈ $${num(Math.round(need))}`, { "font-size": 13, "font-weight": 700, fill: C.ink });

    r.set(
      `P = \\$ ${tnum(P)} \\rightarrow \\$ ${tnum(amount, 0)} ${ok ? "\\ge" : "<"} \\$ ${tnum(tax)}`,
      ok,
      ok ? `Enough. Least deposit ≈ $${num(Math.round(need))}.` : `Too small. Need about $${num(Math.round(need))}.`,
      { yes: "enough", no: "too small" },
    );
  };
  incS.on(draw); allS.on(draw); pS.on(draw);
  draw();
}

/* ---------- Q10: Joseph vs Matthew ---------- */

function q10(root) {
  const svg = scene(640, 260);
  const r = readout();
  const jmS = slider({ label: "Joseph monthly ($)", min: 12_000, max: 30_000, step: 500, value: 18_000, fmt: (v) => `$${num(v)}` });
  const jaS = slider({ label: "Joseph allowance ($)", min: 100_000, max: 200_000, step: 5000, value: 150_000, fmt: (v) => `$${num(v)}` });
  const miS = slider({ label: "Matthew income +%", min: 0, max: 20, step: 1, value: 5, fmt: (v) => `+${v}%` });
  const maS = slider({ label: "Matthew allowance −%", min: 0, max: 20, step: 1, value: 7, fmt: (v) => `−${v}%` });
  root.append(
    question("Joseph vs Matthew: compare salaries tax.",
      ["Matthew income $= $ Joseph $\\times(1 + 5\\%)$", "Matthew allowance $= $ Joseph $\\times(1 - 7\\%)$"]),
    jmS.el, jaS.el, miS.el, maS.el, svg, r.el,
    buttonRow([["Question values", () => { jmS.set(18_000); jaS.set(150_000); miS.set(5); maS.set(7); }]]),
  );

  const draw = () => {
    clear(svg);
    const jNet = jmS.get() * 12 - jaS.get();
    const mNet = jmS.get() * (1 + miS.get() / 100) * 12 - jaS.get() * (1 - maS.get() / 100);
    const jTax = taxOf(jNet);
    const mTax = taxOf(mNet);
    const pct = jTax > 0 ? ((mTax - jTax) / jTax) * 100 : 0;
    const top = Math.max(jTax, mTax, 1) * 1.2;
    const Y = (v) => 200 - (v / top) * 140;

    T(svg, 16, 24, "Salaries tax side by side", { "font-weight": 700, "font-size": 14 });
    bar(svg, 120, Y(jTax), 90, 200 - Y(jTax), C.blue);
    bar(svg, 320, Y(mTax), 90, 200 - Y(mTax), C.amber);
    T(svg, 165, 220, "Joseph", { "text-anchor": "middle", "font-size": 13, "font-weight": 700 });
    T(svg, 365, 220, "Matthew", { "text-anchor": "middle", "font-size": 13, "font-weight": 700 });
    T(svg, 165, Y(jTax) - 8, `$${num(jTax)}`, { "text-anchor": "middle", "font-size": 13, "font-weight": 700 });
    T(svg, 365, Y(mTax) - 8, `$${num(mTax)}`, { "text-anchor": "middle", "font-size": 13, "font-weight": 700 });
    T(svg, 480, 100, `Net J $${num(Math.max(0, jNet))}`, { "font-size": 12 });
    T(svg, 480, 120, `Net M $${num(Math.max(0, mNet))}`, { "font-size": 12 });
    T(svg, 480, 150, `Excess ≈ ${num(pct, 1)}%`, { "font-size": 14, "font-weight": 700, fill: C.ink });

    const ans = Math.abs(jmS.get() - 18_000) < 1 && Math.abs(jaS.get() - 150_000) < 1
      && miS.get() === 5 && maS.get() === 7;
    r.set(
      `\\dfrac{${tnum(mTax)} - ${tnum(jTax)}}{${tnum(jTax)}} \\times 100\\% \\approx ${tnum(Math.round(pct))}\\%`,
      ans ? Math.round(pct) === 65 : null,
      ans ? `At the question values: ${Math.round(pct)}% (nearest integer).` : `Matthew exceeds Joseph by about ${num(pct, 1)}%.`,
    );
  };
  jmS.on(draw); jaS.on(draw); miS.on(draw); maS.on(draw);
  draw();
}

/* ---------- Q11: Joyce vs Peter ---------- */

function q11(root) {
  const svg = scene(640, 260);
  const r = readout();
  const xS = slider({
    label: "Joyce's net ($)",
    min: 100_000,
    max: 118_000,
    step: 500,
    value: 117_000,
    fmt: (v) => `$${num(v)}`,
  });
  root.append(
    question("Joyce's net is $\\$18\\ 000$ more than Peter's; her tax is $\\$1760$ more.",
      ["$100\\ 000 < x < 118\\ 000$", "Peter in 6% band; Joyce in 10% band"]),
    xS.el, svg, r.el,
    buttonRow([
      ["$100 000", () => xS.set(100_500)],
      ["Answer $117 000", () => xS.set(117_000)],
      ["$117 500", () => xS.set(117_500)],
    ]),
  );

  const draw = () => {
    clear(svg);
    const x = xS.get();
    const peter = x - 18_000;
    const jTax = taxOf(x);
    const pTax = taxOf(peter);
    const diff = jTax - pTax;
    const ok = Math.abs(diff - 1760) < 0.5;

    T(svg, 16, 24, "Net chargeable income", { "font-weight": 700, "font-size": 14 });
    const maxNet = 120_000;
    const scale = 480 / maxNet;
    bar(svg, 80, 50, peter * scale, 28, C.blue);
    bar(svg, 80, 100, x * scale, 28, C.amber);
    T(svg, 16, 70, "Peter", { "font-size": 12, "font-weight": 700, fill: C.blue });
    T(svg, 16, 120, "Joyce", { "font-size": 12, "font-weight": 700, fill: C.amber });
    T(svg, 80 + peter * scale + 8, 70, `$${num(peter)}`, { "font-size": 12 });
    T(svg, 80 + x * scale + 8, 120, `$${num(x)}`, { "font-size": 12 });

    // Tax difference
    T(svg, 16, 160, "Tax difference", { "font-weight": 700, "font-size": 13 });
    const top = Math.max(diff, 1760, 1) * 1.3;
    const Y = (v) => 240 - (v / top) * 60;
    bar(svg, 120, Y(diff), 60, 240 - Y(diff), ok ? C.green : C.pink);
    S("line", { x1: 90, y1: Y(1760), x2: 240, y2: Y(1760), stroke: C.amber, "stroke-width": 2, "stroke-dasharray": "4 3" }, svg);
    T(svg, 250, Y(1760) + 4, "target $1760", { "font-size": 12, fill: C.amber, "font-weight": 700 });
    T(svg, 150, Y(diff) - 6, `$${num(diff, 0)}`, { "text-anchor": "middle", "font-size": 12, "font-weight": 700 });
    T(svg, 360, 190, `Joyce tax $${num(jTax)}`, { "font-size": 12 });
    T(svg, 360, 210, `Peter tax $${num(pTax)}`, { "font-size": 12 });

    r.set(
      `(0.1x - 6000) - (0.06x - 3080) = ${tnum(diff, 0)}`,
      ok,
      ok ? "Tax difference = $1760 → Joyce's net is $117 000." : `Difference $${num(diff)}. Target $1760.`,
      { yes: "$1760", no: "not yet" },
    );
  };
  xS.on(draw);
  draw();
}

function ex1(root) {
  const svg = scene(640, 220);
  const r = readout();
  const incomeS = slider({ label: "Annual income ($)", min: 200_000, max: 600_000, step: 10_000, value: 470_000, fmt: (v) => `$${num(v)}` });
  const allowS = slider({ label: "Allowance ($)", min: 80_000, max: 250_000, step: 10_000, value: 160_000, fmt: (v) => `$${num(v)}` });
  root.append(
    question("Ronald's annual income is $\\$470\\ 000$, allowance $\\$160\\ 000$. Find his salaries tax.",
      ["Net $= \\$470\\ 000 - \\$160\\ 000 = \\$310\\ 000$"]),
    incomeS.el, allowS.el, svg, r.el,
    buttonRow([
      ["Ronald", () => { incomeS.set(470_000); allowS.set(160_000); }],
      ["Anthony (P1)", () => { incomeS.set(290_000); allowS.set(180_000); }],
    ]),
  );
  const draw = () => {
    clear(svg);
    const net = incomeS.get() - allowS.get();
    const parts = portions(net);
    const total = parts.reduce((s, p) => s + p.tax, 0);
    T(svg, 16, 24, "Example 1 — bracket stack", { "font-weight": 700, "font-size": 14 });
    if (net <= 0) {
      T(svg, 40, 80, "Net ≤ 0 → tax $0", { fill: C.green, "font-weight": 700, "font-size": 14 });
      r.set("\\text{tax} = \\$0", true, "No tax.", { yes: "tax $0", no: "tax due" });
      return;
    }
    const maxW = 520;
    const scale = maxW / Math.max(net, 50_000);
    let x = 40;
    for (const p of parts) {
      const w = Math.max(4, p.amount * scale);
      bar(svg, x, 50, w, 36, p.color);
      if (w > 40) {
        T(svg, x + w / 2, 66, p.label, { "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "#fff" });
        T(svg, x + w / 2, 80, `$${num(p.tax)}`, { "text-anchor": "middle", "font-size": 10, fill: "#fff" });
      }
      x += w + 2;
    }
    T(svg, 40, 110, `Net $${num(net)} → tax $${num(total)}`, { "font-size": 14, "font-weight": 700 });
    let lx = 40;
    for (let i = 0; i < BRACKETS.length; i++) {
      bar(svg, lx, 140, 12, 12, COLORS[i]);
      T(svg, lx + 16, 151, BRACKETS[i].label, { "font-size": 11, fill: "#444" });
      lx += 52;
    }
    const match = Math.abs(total - 34_700) < 0.5;
    r.set(`\\$ ${tnum(net)} \\rightarrow \\$ ${tnum(total)}`, match || null, match ? "Matches Example 1: $34 700." : `Tax $${num(total)}.`);
  };
  incomeS.on(draw); allowS.on(draw);
  draw();
}

const REGISTRY = {
  ex1,
  p1,
  q1,
  q2,
  q3,
  q4,
  q5,
  q6,
  q7,
  q8,
  q9,
  q10,
  q11,
};

export function hasGraphic(id) {
  return Boolean(REGISTRY[id]);
}

export function mountGraphic(id, root) {
  REGISTRY[id]?.(root);
}
