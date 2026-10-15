import { SOLUTION_BY_ID } from "../book.js";

const COLORS = {
  pink: { stroke: "#e0609a", fill: "rgba(251, 224, 236, 0.34)" },
  blue: { stroke: "#3b7ddd", fill: "rgba(219, 232, 251, 0.32)" },
  green: { stroke: "#1d8a4a", fill: "rgba(223, 243, 230, 0.34)" },
  amber: { stroke: "#d4890a", fill: "rgba(253, 235, 200, 0.38)" },
  purple: { stroke: "#7d55c7", fill: "rgba(234, 225, 250, 0.36)" },
};
const PAD = 1.5;
const CTL_W = 22;

function svgEl(name, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function tokenize(s) {
  return String(s).normalize("NFKC").toLowerCase().replace(/△/g, " ").match(/[a-z0-9]+/g) || [];
}

function rich(text) {
  const nodes = [];
  String(text).split("$").forEach((part, i) => {
    if (i % 2 === 0) {
      if (part) nodes.push(document.createTextNode(part));
      return;
    }
    const span = document.createElement("span");
    if (window.katex) {
      span.innerHTML = window.katex.renderToString(part, { throwOnError: false, displayMode: false });
      span.querySelector(".katex-mathml")?.remove();
    } else span.textContent = part;
    nodes.push(span);
  });
  return nodes;
}

/**
 * One rectangle per printed row covered by `phrase`, in PDF points. The search
 * starts below the previous question's region because some stems begin above
 * the detected anchor.
 */
export function questionRects(page, q, phrase) {
  const want = tokenize(phrase);
  if (!want.length || !page.text) return [];
  const idx = page.questions.findIndex((item) => item.id === q.id);
  const yLo = idx > 0 ? page.questions[idx - 1].region[3] - 1 : 0;
  const yHi = q.region[1];
  const toks = [];
  for (const row of page.text) {
    if (row[0] < yLo || row[0] >= yHi) continue;
    for (const w of row[2]) {
      for (const tok of tokenize(w[2] || "")) {
        toks.push({ tok, x0: w[0], x1: w[1], y0: row[0], y1: row[1] });
      }
    }
  }
  for (let i = 0; i <= toks.length - want.length; i++) {
    if (!want.every((w, k) => toks[i + k].tok === w)) continue;
    const groups = [];
    for (const t of toks.slice(i, i + want.length)) {
      const g = groups.find((item) => Math.abs(item.y0 - t.y0) < 1);
      if (g) {
        g.x0 = Math.min(g.x0, t.x0);
        g.x1 = Math.max(g.x1, t.x1);
        g.y1 = Math.max(g.y1, t.y1);
      } else groups.push({ x0: t.x0, x1: t.x1, y0: t.y0, y1: t.y1 });
    }
    return groups.map((g) => ({ x: g.x0, y: g.y0, w: g.x1 - g.x0, h: g.y1 - g.y0 }));
  }
  return [];
}

function sheetPoint(sheet, rect) {
  const origin = sheet.getBoundingClientRect();
  const k = sheet.offsetWidth / (origin.width || sheet.offsetWidth);
  return {
    x: (rect.left - origin.left) * k,
    y: (rect.top - origin.top) * k,
    w: rect.width * k,
    h: rect.height * k,
  };
}

function makeRect(box, link, open, id) {
  const c = COLORS[link.color] || COLORS.blue;
  const rect = svgEl("rect", {
    x: box.x - PAD,
    y: box.y - PAD,
    width: Math.max(1, box.w + PAD * 2),
    height: Math.max(1, box.h + PAD * 2),
    rx: 3,
    stroke: c.stroke,
    class: open ? "lk-r" : "lk-r hint",
    "data-link": link.key,
    "data-q": id,
  });
  rect.style.fill = c.fill;
  return { rect, area: box.w * box.h };
}

/**
 * Answer-side marker: a coloured underline (dotted when closed) with a
 * transparent hit area. Nested links drop the line by 2.6 pt per enclosing
 * `.lk-*` so neighbouring pieces never draw overlapping boxes.
 */
function makeUnderline(box, link, open, id, depth = 0) {
  const c = COLORS[link.color] || COLORS.blue;
  const g = svgEl("g", {
    class: open ? "lk-u-g" : "lk-u-g hint",
    "data-link": link.key,
    "data-q": id,
  });
  if (open) {
    g.append(svgEl("rect", {
      x: box.x,
      y: box.y,
      width: Math.max(1, box.w),
      height: Math.max(1, box.h),
      class: "lk-tint",
      fill: c.fill,
    }));
  }
  g.append(svgEl("rect", {
    x: box.x,
    y: box.y,
    width: Math.max(1, box.w),
    height: Math.max(1, box.h + 1.2 + depth * 2.6 + 2),
    class: "lk-hit",
  }));
  const y = box.y + box.h + 1.2 + depth * 2.6;
  g.append(svgEl("line", {
    x1: box.x,
    y1: y,
    x2: box.x + Math.max(1, box.w),
    y2: y,
    stroke: c.stroke,
    class: open ? "lk-u" : "lk-u hint",
  }));
  return { rect: g, area: box.w * box.h };
}

/** How many enclosing `.lk-*` ancestors sit inside the same answer box. */
function linkDepth(node) {
  let depth = 0;
  for (let el = node.parentElement; el && !el.classList.contains("abox") && !el.classList.contains("qa"); el = el.parentElement) {
    if ([...el.classList].some((c) => /^lk-/.test(c))) depth++;
  }
  return depth;
}

function answerNodes(qa, key) {
  return [...qa.querySelectorAll(`.lk-${key}`)].filter((n) => !n.closest(".ln.hid"));
}

function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

export function clearLinks(sheet, id) {
  sheet.querySelector(`.rev[data-q="${id}"]`)?.remove();
  const ctl = sheet.querySelector(`.qa[data-q="${id}"] .ctl`);
  if (ctl?.dataset.home) ctl.style.left = ctl.dataset.home;
}

/**
 * Draws faint dashed hints for every link of one question; links in `open`
 * get solid markers (boxes on the question, underlines in the answer), a
 * remark tag and a leader. Returns the control column left (relative to the
 * answer region) when tags sit right of the boxes, so the step buttons can
 * slide clear of them.
 */
export function renderLinks(sheet, id, page, q, open) {
  clearLinks(sheet, id);
  const sol = SOLUTION_BY_ID[id];
  const qa = sheet.querySelector(`.qa[data-q="${id}"]`);
  const boxes = qa ? [...qa.querySelectorAll(".abox")] : [];
  const overlay = sheet.querySelector(".overlay");
  if (!sol?.links || !qa || !boxes.length || !overlay) return null;

  const layer = document.createElement("div");
  layer.className = "rev";
  layer.dataset.q = id;
  const svg = svgEl("svg", { viewBox: `0 0 ${page.width} ${page.height}` });
  layer.append(svg);
  overlay.append(layer);

  const tags = [];
  const rects = [];
  for (const link of sol.links) {
    const isOpen = open.has(link.key);
    for (const phrase of link.q || []) {
      for (const r of questionRects(page, q, phrase)) rects.push(makeRect(r, link, isOpen, id));
    }
    const nodes = answerNodes(qa, link.key);
    for (const n of nodes) {
      const depth = linkDepth(n);
      for (const cr of n.getClientRects()) {
        if (cr.width < 0.4 || cr.height < 0.4) continue;
        rects.push(makeUnderline(sheetPoint(sheet, cr), link, isOpen, id, depth));
      }
    }
    if (!isOpen || !nodes.length) continue;
    const spots = nodes.map((n) => {
      const hostEl = n.closest(".abox") || boxes[0];
      return { anchor: sheetPoint(sheet, n.getBoundingClientRect()), hostEl };
    });
    tags.push({ link, spots, pick: Math.min(link.at ?? 0, nodes.length - 1) });
  }
  rects.sort((a, b) => b.area - a.area);
  for (const r of rects) svg.append(r.rect);
  if (!tags.length) return null;

  for (const t of tags) {
    const d = document.createElement("div");
    d.className = `lk-tag c-${t.link.color}`;
    d.append(...rich(t.link.note));
    layer.append(d);
    t.el = d;
    t.w = d.offsetWidth;
    t.h = d.offsetHeight || 16;
  }

  const boxS = new Map(boxes.map((b) => [b, sheetPoint(sheet, b.getBoundingClientRect())]));
  const right = Math.max(...[...boxS.values()].map((s) => s.x + s.w));
  const left = Math.min(...[...boxS.values()].map((s) => s.x));
  const bottom = Math.max(...[...boxS.values()].map((s) => s.y + s.h));
  const tagX = right + 10;

  // A side leader leaves its box's right edge at the clear height nearest the component.
  const exitY = (spot) => {
    const host = boxS.get(spot.hostEl);
    const blockers = [...boxS.entries()]
      .filter(([el, s]) => el !== spot.hostEl && s.x >= host.x + host.w - 1)
      .map(([, s]) => s);
    const blocked = (y) => blockers.some((s) => y >= s.y - 3 && y <= s.y + s.h + 3);
    const want = spot.anchor.y + spot.anchor.h / 2;
    const lo = host.y + 4;
    const hi = host.y + host.h - 4;
    const tries = [want, ...blockers.flatMap((s) => [s.y + s.h + 5, s.y - 5])]
      .map((y) => Math.max(lo, Math.min(hi, y)))
      .sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
    return tries.find((y) => !blocked(y)) ?? null;
  };
  const side = [];
  const below = [];
  for (const t of tags) {
    const order = [t.spots[t.pick], ...t.spots.filter((s, i) => i !== t.pick)];
    let best = null;
    for (const s of order) {
      const y = exitY(s);
      if (y == null) continue;
      const miss = Math.abs(y - (s.anchor.y + s.anchor.h / 2));
      if (!best || miss < best.miss - 1) best = { s, y, miss };
    }
    if (best) side.push({ ...t, anchor: best.s.anchor, host: boxS.get(best.s.hostEl), y: best.y });
    else below.push({ ...t, anchor: order[0].anchor, host: boxS.get(order[0].hostEl) });
  }
  for (let i = side.length - 1; i >= 0; i--) {
    const t = side[i];
    if (tagX + t.w + 8 + CTL_W <= sheet.offsetWidth - 6) continue;
    const spot = t.spots[t.pick];
    below.push({ ...t, anchor: spot.anchor, host: boxS.get(spot.hostEl), y: undefined });
    side.splice(i, 1);
  }
  const maxW = Math.max(0, ...side.map((t) => t.w));
  const obstacles = [...sheet.querySelectorAll(`.mcl[data-q="${id}"]`)]
    .map((el) => sheetPoint(sheet, el.getBoundingClientRect()))
    .filter((s) => s.x < tagX + maxW && s.x + s.w > tagX);

  const roomBelow = (x0, x1, y) => {
    let limit = page.height - 18;
    for (const row of page.text || []) {
      if (row[0] > y + 1 && row[0] < limit && row[2].some((w) => w[0] < x1 && w[1] > x0)) limit = row[0] - 2;
    }
    for (const s of boxS.values()) {
      if (s.y > y + 1 && s.y < limit && s.x < x1 && s.x + s.w > x0) limit = s.y - 2;
    }
    return limit;
  };

  if (side.length) placeColumn(svg, side, tagX, q, obstacles);
  if (below.length) {
    const groups = new Map();
    for (const t of below) {
      if (!groups.has(t.host)) groups.set(t.host, []);
      groups.get(t.host).push(t);
    }
    const underEach = [...groups].every(([h, list]) => layoutLegend(list, h.x, h.x + h.w, h.y + h.h, roomBelow(h.x, h.x + h.w, h.y + h.h)));
    if (underEach || layoutLegend(below, left, right, bottom, roomBelow(left, right, bottom))) drawLegend(svg, below);
    else placeCallouts(svg, below, sheet.offsetWidth, q);
  }

  if (!side.length) return null;
  const qaLeft = parseFloat(qa.style.left) || 0;
  return { ctlLeft: tagX + maxW + 8 - qaLeft };
}

/** Rows of tags under the answer boxes; false when they would run past `limit`. */
function layoutLegend(tags, left, right, bottom, limit) {
  const base = bottom + 7;
  for (const t of tags) t.base = base;
  const order = [...tags].sort((a, b) => (a.anchor.x + a.anchor.w / 2) - (b.anchor.x + b.anchor.w / 2));
  const rowH = Math.max(...tags.map((t) => t.h)) + 3;
  if (tags.some((t) => t.w > right - left)) return false;
  const lay = (packed) => {
    let row = 0;
    let prevRight = -1e9;
    for (const t of order) {
      const want = packed ? left : Math.max(left, t.anchor.x + t.anchor.w / 2 - 10);
      let x = Math.max(want, prevRight + 5);
      if (x + t.w > right) x = right - t.w;
      if (x < prevRight + 5) {
        row++;
        x = Math.min(want, right - t.w);
      }
      t.x = Math.max(left, x);
      t.top = base + row * rowH;
      prevRight = t.x + t.w;
    }
    return row;
  };
  const packedRows = lay(true);
  if (lay(false) > packedRows) lay(true);
  return Math.max(...order.map((t) => t.top + t.h)) <= limit;
}

/** Each legend tag hangs from its box's bottom edge. */
function drawLegend(svg, tags) {
  for (const t of tags) {
    t.el.style.left = `${t.x}px`;
    t.el.style.top = `${t.top}px`;
    const x0 = t.anchor.x + t.anchor.w / 2;
    const y0 = t.host.y + t.host.h;
    const inside = x0 >= t.x + 4 && x0 <= t.x + t.w - 4;
    const d = inside
      ? `M${x0} ${y0} V${t.top - 1}`
      : `M${x0} ${y0} V${t.base - 4} H${t.x + 8} V${t.top - 1}`;
    leader(svg, t.link.color, d, x0, y0);
  }
}

function leader(svg, color, d, x0, y0) {
  const c = COLORS[color] || COLORS.blue;
  svg.append(svgEl("circle", { cx: x0, cy: y0, r: 2.2, fill: c.stroke }));
  svg.append(svgEl("path", {
    d,
    fill: "none",
    stroke: c.stroke,
    "stroke-width": 1.15,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  }));
}

function placeColumn(svg, tags, tagX, q, obstacles = []) {
  for (const t of tags) t.y ??= t.anchor.y + t.anchor.h / 2;
  const order = [...tags].sort((a, b) => a.y - b.y);
  let prev = -1e9;
  for (const t of order) {
    let top = Math.max(t.y - t.h / 2, prev + 3);
    for (const o of obstacles) {
      if (top >= o.y + o.h + 3 || top + t.h <= o.y - 3) continue;
      const above = o.y - t.h - 3;
      top = t.y < o.y + o.h / 2 && above >= prev + 3 ? above : o.y + o.h + 3;
    }
    t.top = Math.min(top, q.region[3] - t.h - 2);
    prev = t.top + t.h;
  }
  for (let i = order.length - 2; i >= 0; i--) {
    order[i].top = Math.min(order[i].top, order[i + 1].top - order[i].h - 3);
  }

  for (const t of tags) {
    t.el.style.left = `${tagX}px`;
    t.el.style.top = `${t.top}px`;
    const x0 = t.host.x + t.host.w;
    const y0 = Math.max(t.host.y + 4, Math.min(t.host.y + t.host.h - 4, t.y));
    const y1 = t.top + t.h / 2;
    const x1 = tagX - 1;
    const d = Math.abs(y0 - y1) < 3
      ? `M${x0} ${y0} H${x1}`
      : `M${x0} ${y0} H${x0 + 7} V${y1} H${x1}`;
    leader(svg, t.link.color, d, x0, y0);
  }
}

/** Tags float just above-right of their component when there is no side room. */
function placeCallouts(svg, tags, sheetW, q) {
  const placed = [];
  const order = [...tags].sort((a, b) => a.anchor.y - b.anchor.y);
  for (const t of order) {
    const a = t.anchor;
    const box = {
      x: Math.max(6, Math.min(a.x + a.w - 6, sheetW - t.w - 6)),
      y: Math.max(q.region[1] - t.h - 4, a.y - t.h - 7),
      w: t.w,
      h: t.h,
    };
    for (let guard = 0; guard < 8; guard++) {
      const hit = placed.find((p) => overlaps(box, { x: p.x - 3, y: p.y - 3, w: p.w + 6, h: p.h + 6 }));
      if (!hit) break;
      box.y = hit.y - box.h - 3;
    }
    placed.push(box);
    t.el.style.left = `${box.x}px`;
    t.el.style.top = `${box.y}px`;
    const x0 = Math.min(a.x + a.w, box.x + 8);
    const y0 = a.y + 1;
    const x1 = box.x + 8;
    const y1 = box.y + box.h;
    const d = Math.abs(x0 - x1) < 1 ? `M${x0} ${y0} V${y1}` : `M${x0} ${y0} L${x1} ${y1}`;
    leader(svg, t.link.color, d, x0, y0);
  }
}
