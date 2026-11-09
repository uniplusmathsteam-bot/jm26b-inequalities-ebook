/**
 * A flashcard deck on an end page (book.json "endPages" item with "deck": "flashcards.js").
 * The book's module exports
 *   DECK = { kicker, title, intro, choices: [{ id, label, tag, color }], cards: [card] }
 *   card = { title, text, fig, ask, answer, why }
 * Card text marks maths with *AB* (italic) and bold with **word**. A figure is a small
 * spec drawn in the summary-page colour code: blue = equal parts given, red arrows =
 * parallel lines, green = what the theorem gives. See docs/02-book-format.md.
 */

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = new URL("./deck.css", import.meta.url).href;
document.head.append(css);

const NS = "http://www.w3.org/2000/svg";
const COLOR = { ink: "#1a1a1a", given: "#2f6fd6", par: "#e02424", found: "#1f9d55", ask: "#e02424", note: "#4a5262" };
const LABEL_GAP = 11;
const DIRS = {
  n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [0.75, -0.75], nw: [-0.75, -0.75], se: [0.75, 0.75], sw: [-0.75, 0.75],
};

function esc(text) {
  return String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

/** *AB* sets maths in italic, **word** in bold; a number stays on the line with its unit. */
export function rich(text = "") {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, '<i class="dk-m">$1</i>')
    .replace(/(\d) (mm|cm|m|km)\b/g, "$1&nbsp;$2");
}

/* ---------- figures ---------- */

function svgEl(parent, tag, attrs, text) {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text != null) node.textContent = text;
  parent?.append(node);
  return node;
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const unit = (a, b) => {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
};

/** "AB" names a segment by two one-letter points; ["L1", "L2"] by longer names. */
function names(seg) {
  return typeof seg === "string" ? [...seg] : seg;
}

/**
 * Point specs, in order: [x, y, dir] or { mid: "AB", at: dir } or { on: "AC", t, at: dir }.
 * dir places the name: n, s, e, w, ne, nw, se, sw or an [dx, dy] offset; leave it out for an unnamed point.
 */
function place(spec, problems) {
  const P = {};
  for (const [name, v] of Object.entries(spec.pts || {})) {
    let p = null;
    let dir = null;
    if (Array.isArray(v)) {
      p = [v[0], v[1]];
      dir = v[2] || null;
    } else {
      const [a, b] = names(v.mid || v.on || "").map((n) => P[n]?.p);
      if (a && b) p = lerp(a, b, v.mid ? 0.5 : v.t ?? 0.5);
      dir = v.at || null;
    }
    if (!p || !p.every(Number.isFinite)) {
      problems.push(`point ${name} could not be placed`);
      continue;
    }
    P[name] = { p, dir, label: v.label ?? name };
  }
  return P;
}

function ticks(svg, a, b, n, color) {
  const [ux, uy] = unit(a, b);
  const c = lerp(a, b, 0.5);
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * 3.4;
    const x = c[0] + ux * o;
    const y = c[1] + uy * o;
    svgEl(svg, "line", { x1: x - uy * 5, y1: y + ux * 5, x2: x + uy * 5, y2: y - ux * 5, stroke: color, "stroke-width": 1.6, "stroke-linecap": "round" });
  }
}

/** Filled arrowheads pointing from a to b, as on the printed notes. */
function arrows(svg, a, b, n, at, color) {
  const s = 7;
  const [ux, uy] = unit(a, b);
  const c = lerp(a, b, at);
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * s * 1.05;
    const x = c[0] + ux * o;
    const y = c[1] + uy * o;
    const back = [x - ux * s * 0.45, y - uy * s * 0.45];
    const pts = [
      [x + ux * s * 0.55, y + uy * s * 0.55],
      [back[0] - uy * s * 0.62, back[1] + ux * s * 0.62],
      [x - ux * s * 0.1, y - uy * s * 0.1],
      [back[0] + uy * s * 0.62, back[1] - ux * s * 0.62],
    ];
    svgEl(svg, "path", { d: `M${pts.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join(" L")} Z`, fill: color, stroke: color, "stroke-width": 0.6, "stroke-linejoin": "round" });
  }
}

/**
 * Draws a figure spec: { size: [w, h], pts, tint: [["ABC", fill]], lines, dashed,
 * given: [["AM", ticks]], found: [["AF", ticks]], par: [["MN", arrows, at]], dots: "MN",
 * notes: [[where, text, colour, dx, dy]] } where `where` is a point, a segment or [x, y].
 */
export function drawFigure(spec, problems = []) {
  const [w, h] = spec.size || [360, 220];
  const svg = svgEl(null, "svg", { viewBox: `0 0 ${w} ${h}`, class: "dk-fig", role: "img" });
  if (spec.alt) svg.setAttribute("aria-label", spec.alt);
  const P = place(spec, problems);
  const seg = (s) => {
    const [a, b] = names(s).map((n) => P[n]?.p);
    if (!a || !b) problems.push(`segment ${names(s).join("")} has an unknown point`);
    return a && b ? [a, b] : null;
  };
  const line = (s, color, width, extra = {}) => {
    const ends = seg(s);
    if (ends) svgEl(svg, "line", { x1: ends[0][0], y1: ends[0][1], x2: ends[1][0], y2: ends[1][1], stroke: color, "stroke-width": width, "stroke-linecap": "round", ...extra });
    return ends;
  };
  for (const [poly, fill] of spec.tint || []) {
    const pts = names(poly).map((n) => P[n]?.p);
    if (pts.every(Boolean)) svgEl(svg, "polygon", { points: pts.map((p) => p.join(",")).join(" "), fill });
    else problems.push(`tint ${names(poly).join("")} has an unknown point`);
  }
  for (const s of spec.lines || []) line(s, COLOR.ink, 1.6);
  for (const s of spec.dashed || []) line(s, COLOR.note, 1.3, { "stroke-dasharray": "4 3" });
  for (const [s, n = 0] of spec.given || []) {
    const ends = line(s, COLOR.given, 2.6);
    if (ends && n) ticks(svg, ...ends, n, COLOR.given);
  }
  for (const [s, n = 0] of spec.found || []) {
    const ends = line(s, COLOR.found, 2.6);
    if (ends && n) ticks(svg, ...ends, n, COLOR.found);
  }
  for (const [s, n = 1, at = 0.5] of spec.par || []) {
    const ends = seg(s);
    if (ends) arrows(svg, ...ends, n, at, COLOR.par);
  }
  for (const name of names(spec.dots || "")) {
    const pt = P[name];
    if (pt) svgEl(svg, "circle", { cx: pt.p[0], cy: pt.p[1], r: 2.4, fill: "#fff", stroke: COLOR.ink, "stroke-width": 1.4 });
    else problems.push(`dot ${name} is not a point`);
  }
  const text = (x, y, s, color, cls) => svgEl(svg, "text", {
    x: x.toFixed(2), y: y.toFixed(2), fill: color, class: cls, "text-anchor": "middle", "dominant-baseline": "central",
  }, s);
  for (const { p, dir, label } of Object.values(P)) {
    if (!dir) continue;
    const off = Array.isArray(dir) ? dir : DIRS[dir]?.map((k) => k * LABEL_GAP);
    if (!off) {
      problems.push(`label direction "${dir}" is not one of ${Object.keys(DIRS).join(", ")} or [dx, dy]`);
      continue;
    }
    text(p[0] + off[0], p[1] + off[1], label, COLOR.ink, "dk-pt");
  }
  for (const [where, s, color = "note", dx = 0, dy = 0] of spec.notes || []) {
    let at = null;
    if (Array.isArray(where) && typeof where[0] === "number") at = where;
    else if (P[where]) at = P[where].p;
    else {
      const ends = seg(where);
      if (ends) at = lerp(...ends, 0.5);
    }
    if (at) text(at[0] + dx, at[1] + dy, s, COLOR[color] || color, "dk-note");
  }
  if (svg.innerHTML.includes("NaN")) problems.push("figure has NaN coordinates");
  return svg;
}

/** Problems in a deck (for QA): unknown answers, missing text, figures that cannot be drawn. */
export function checkDeck(deck) {
  const problems = [];
  const ids = new Set((deck.choices || []).map((c) => c.id));
  if (ids.size < 2) problems.push("a deck needs at least two choices");
  (deck.cards || []).forEach((card, i) => {
    const at = `card ${i + 1} (${card.title || "untitled"})`;
    if (!ids.has(card.answer)) problems.push(`${at}: answer "${card.answer}" is not a choice`);
    for (const key of ["title", "text", "ask", "why"]) if (!card[key]) problems.push(`${at}: no ${key}`);
    if (card.fig) {
      const found = [];
      drawFigure(card.fig, found);
      for (const p of found) problems.push(`${at}: ${p}`);
    }
  });
  if (!deck.cards?.length) problems.push("a deck needs cards");
  return problems;
}

/* ---------- the deck ---------- */

function shuffled(n) {
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Builds the deck into `root` (an end page's overlay); progress is kept in localStorage under `storeKey`. */
export function mountDeck(root, deck, storeKey) {
  const n = deck.cards.length;
  const choice = Object.fromEntries(deck.choices.map((c) => [c.id, c]));
  const fresh = (shuffle) => ({ order: shuffle ? shuffled(n) : [...Array(n).keys()], answers: {}, at: 0 });
  let st = fresh(false);
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || "null");
    if (saved && saved.order?.length === n && [...saved.order].sort((a, b) => a - b).every((v, i) => v === i)) st = saved;
  } catch { /* start fresh */ }
  const save = () => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(st));
    } catch { /* private mode */ }
  };

  const box = document.createElement("div");
  box.className = "dk";
  box.innerHTML = `
    <header class="dk-head">
      <div class="dk-kicker">${rich(deck.kicker || "Flashcards")}</div>
      <h2>${rich(deck.title || "")}</h2>
      <p>${rich(deck.intro || "")}</p>
      <div class="dk-score" aria-live="polite"></div>
    </header>
    <div class="dk-dots" role="group" aria-label="Cards"></div>
    <section class="dk-card"></section>
    <div class="dk-choices"></div>
    <div class="dk-feedback" aria-live="polite"></div>
    <nav class="dk-nav">
      <button type="button" data-dk="prev">◀ Previous card</button>
      <button type="button" data-dk="restart">Shuffle and start again ↻</button>
    </nav>`;
  root.append(box);
  const $ = (sel) => box.querySelector(sel);

  for (const c of deck.choices) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dk-choice";
    btn.dataset.choice = c.id;
    btn.style.setProperty("--c", c.color || "#26324a");
    btn.innerHTML = `<b>${rich(c.label)}</b>${c.tag ? `<span>${rich(c.tag)}</span>` : ""}`;
    $(".dk-choices").append(btn);
  }

  const tally = () => {
    const done = Object.entries(st.answers);
    return { answered: done.length, right: done.filter(([i, id]) => deck.cards[i].answer === id).length };
  };

  function renderDots() {
    const bar = $(".dk-dots");
    bar.replaceChildren();
    st.order.forEach((card, k) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.dataset.go = String(k);
      const got = st.answers[card];
      dot.className = `dk-dot${k === st.at ? " now" : ""}${got ? (got === deck.cards[card].answer ? " right" : " wrong") : ""}`;
      dot.setAttribute("aria-label", `Card ${k + 1}${got ? (got === deck.cards[card].answer ? ", right" : ", wrong") : ""}`);
      bar.append(dot);
    });
  }

  function renderEnd() {
    const { right } = tally();
    const card = $(".dk-card");
    card.classList.add("end");
    const rows = st.order.map((i, k) => {
      const c = deck.cards[i];
      const got = st.answers[i];
      const mark = !got ? "–" : got === c.answer ? "✓" : "✗";
      const cls = !got ? "" : got === c.answer ? "right" : "wrong";
      return `<li class="${cls}"><button type="button" data-go="${k}"><span class="dk-mark">${mark}</span><span>${rich(c.title)}</span><em>${rich(choice[c.answer].label)}</em></button></li>`;
    }).join("");
    const message = right === n ? "Every card right. You can tell the two theorems apart."
      : right >= n * 0.7 ? "Well done. Tap a card below to look at it again."
        : "Look again at the summary page, then try the cards in a new order.";
    card.innerHTML = `
      <div class="dk-tag">Your score</div>
      <div class="dk-big">${right} / ${n}</div>
      <p class="dk-msg">${esc(message)}</p>
      <ol class="dk-list">${rows}</ol>`;
    $(".dk-choices").hidden = true;
    const fb = $(".dk-feedback");
    fb.className = "dk-feedback";
    fb.innerHTML = `
      <div class="dk-fbrow">
        <div><div class="dk-verdict">Try them again?</div><p class="dk-why">The cards come back in a new order. Tap a card in the list to look at it first.</p></div>
        <button type="button" class="dk-next" data-dk="restart">Shuffle and start again ↻</button>
      </div>`;
  }

  function render() {
    const { answered, right } = tally();
    $(".dk-score").innerHTML = answered ? `<b>${right}</b> / ${answered} right` : `${n} cards`;
    renderDots();
    $('[data-dk="prev"]').disabled = st.at === 0;
    $('.dk-nav [data-dk="restart"]').hidden = st.at >= n;
    if (st.at >= n) {
      renderEnd();
      return;
    }
    const index = st.order[st.at];
    const card = deck.cards[index];
    const got = st.answers[index];
    const host = $(".dk-card");
    host.classList.remove("end");
    host.innerHTML = `
      <div class="dk-tag">Card ${st.at + 1} of ${n}</div>
      <p class="dk-text">${rich(card.text)}</p>
      <div class="dk-figwrap"></div>
      <p class="dk-ask">${rich(card.ask)}</p>`;
    if (card.fig) host.querySelector(".dk-figwrap").append(drawFigure(card.fig));
    else host.querySelector(".dk-figwrap").remove();
    $(".dk-choices").hidden = false;
    for (const btn of box.querySelectorAll(".dk-choice")) {
      const id = btn.dataset.choice;
      btn.disabled = Boolean(got);
      btn.classList.toggle("right", Boolean(got) && id === card.answer);
      btn.classList.toggle("wrong", Boolean(got) && id === got && id !== card.answer);
    }
    const fb = $(".dk-feedback");
    if (!got) {
      fb.className = "dk-feedback";
      fb.innerHTML = `<p class="dk-prompt">Tap the theorem you would use.</p>`;
      return;
    }
    const ok = got === card.answer;
    fb.className = `dk-feedback ${ok ? "right" : "wrong"}`;
    const verdict = ok ? `✓ Right: the ${choice[card.answer].label.toLowerCase()}` : `✗ Not this time: it is the ${choice[card.answer].label.toLowerCase()}`;
    fb.innerHTML = `
      <div class="dk-fbrow">
        <div><div class="dk-verdict">${rich(verdict)}</div><p class="dk-why">${rich(card.why)}</p></div>
        <button type="button" class="dk-next" data-dk="next">${st.at + 1 < n ? "Next card ▶" : "See my score ▶"}</button>
      </div>`;
  }

  box.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn || !box.contains(btn)) return;
    event.stopPropagation();
    if (btn.dataset.choice) {
      st.answers[st.order[st.at]] = btn.dataset.choice;
      save();
      render();
      $(".dk-next")?.focus({ preventScroll: true });
      return;
    }
    if (btn.dataset.go != null) st.at = Number(btn.dataset.go);
    else if (btn.dataset.dk === "next") st.at = Math.min(n, st.at + 1);
    else if (btn.dataset.dk === "prev") st.at = Math.max(0, st.at - 1);
    else if (btn.dataset.dk === "restart") st = fresh(true);
    else return;
    save();
    render();
  });
  render();
}
