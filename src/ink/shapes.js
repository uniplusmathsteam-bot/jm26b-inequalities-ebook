/**
 * "Draw and hold" shape recognition, in the spirit of Notability and
 * OneNote: a roughly straight stroke becomes a perfect line (snapped to
 * horizontal, vertical or 45°), a closed loop becomes a circle, ellipse or
 * rectangle. All coordinates are sheet units (PDF points).
 */

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) len += dist(points[i - 1], points[i]);
  return len;
}

function box(points) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of points) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

function deviation(points, a, b) {
  const len = dist(a, b) || 1;
  let max = 0;
  for (const p of points) {
    const d = Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
    max = Math.max(max, d);
  }
  return max;
}

/** Angle snapping: within 10° of horizontal or vertical, 6° of a diagonal. */
export function snapAngle(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return { ...b, axis: null };
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  for (const target of [0, 90, 180, -90, -180]) {
    if (Math.abs(deg - target) <= 10) {
      return target === 0 || Math.abs(target) === 180 ? { x: b.x, y: a.y, axis: "h" } : { x: a.x, y: b.y, axis: "v" };
    }
  }
  for (const target of [45, 135, -45, -135]) {
    if (Math.abs(deg - target) <= 6) {
      const r = (target * Math.PI) / 180;
      const along = dx * Math.cos(r) + dy * Math.sin(r);
      return { x: a.x + along * Math.cos(r), y: a.y + along * Math.sin(r), axis: "d" };
    }
  }
  return { x: b.x, y: b.y, axis: null };
}

function densify(corners, closed, step = 3) {
  const out = [];
  const list = closed ? [...corners, corners[0]] : corners;
  for (let i = 0; i < list.length - 1; i++) {
    const a = list[i];
    const b = list[i + 1];
    const n = Math.max(1, Math.ceil(dist(a, b) / step));
    for (let k = 0; k < n; k++) out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n, p: 0.5 });
  }
  if (!closed) out.push({ x: list[list.length - 1].x, y: list[list.length - 1].y, p: 0.5 });
  return out;
}

export function linePoints(a, b) {
  return densify([a, b], false);
}

function ellipsePoints(cx, cy, rx, ry) {
  const n = Math.max(48, Math.round((rx + ry) * 1.2));
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    out.push({ x: cx + rx * Math.cos(t), y: cy + ry * Math.sin(t), p: 0.5 });
  }
  return out;
}

function rectPoints(b) {
  return densify([{ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y0 }, { x: b.x1, y: b.y1 }, { x: b.x0, y: b.y1 }], true);
}

/**
 * Returns { shape, points, a, axis } for a recognisable stroke, or null to
 * keep it freehand.
 */
export function recognise(points) {
  if (points.length < 3) return null;
  const a = points[0];
  const end = points[points.length - 1];
  const len = pathLength(points);
  if (len < 12) return null;
  const b = box(points);
  const span = Math.max(b.w, b.h);
  const closed = dist(a, end) < Math.max(14, span * 0.3) && len > span * 2.2 && Math.min(b.w, b.h) > 8;

  if (!closed) {
    const chord = dist(a, end);
    if (chord < 10 || deviation(points, a, end) > Math.max(5, chord * 0.12)) return null;
    const tip = snapAngle(a, end);
    return { shape: "line", a, axis: tip.axis, points: linePoints(a, tip) };
  }

  const cx = (b.x0 + b.x1) / 2;
  const cy = (b.y0 + b.y1) / 2;
  const rx = Math.max(3, b.w / 2);
  const ry = Math.max(3, b.h / 2);
  let ellErr = 0;
  let rectErr = 0;
  for (const p of points) {
    ellErr += Math.abs(Math.hypot((p.x - cx) / rx, (p.y - cy) / ry) - 1);
    rectErr += Math.min(Math.abs(p.x - b.x0), Math.abs(p.x - b.x1), Math.abs(p.y - b.y0), Math.abs(p.y - b.y1)) / Math.min(rx, ry);
  }
  ellErr /= points.length;
  rectErr /= points.length;
  if (Math.min(ellErr, rectErr) > 0.24) return null;
  if (rectErr < ellErr) return { shape: "rect", points: rectPoints(b) };
  if (Math.abs(rx - ry) / Math.max(rx, ry) < 0.15) {
    const r = (rx + ry) / 2;
    return { shape: "ellipse", points: ellipsePoints(cx, cy, r, r) };
  }
  return { shape: "ellipse", points: ellipsePoints(cx, cy, rx, ry) };
}

/** A loose freehand highlighter stroke that is basically a horizontal swipe. */
export function straightHighlight(points) {
  if (points.length < 2) return null;
  const a = points[0];
  const end = points[points.length - 1];
  const chord = dist(a, end);
  if (chord < 4) return null;
  const deg = Math.abs((Math.atan2(end.y - a.y, end.x - a.x) * 180) / Math.PI);
  if (Math.min(deg, 180 - deg) > 12) return null;
  if (deviation(points, a, end) > Math.max(5, chord * 0.15)) return null;
  const y = points.reduce((s, p) => s + p.y, 0) / points.length;
  return { a: { x: a.x, y }, b: { x: end.x, y } };
}

/**
 * Snaps a horizontal highlight onto a line of text: centred on the line,
 * as tall as the text, with its ends extended to whole words.
 * `rows` are [y0, y1, [[x0, x1], ...words]].
 */
export function snapToText(a, b, rows) {
  const x0 = Math.min(a.x, b.x);
  const x1 = Math.max(a.x, b.x);
  const y = (a.y + b.y) / 2;
  let best = null;
  for (const row of rows) {
    const [ry0, ry1, words] = row;
    const h = ry1 - ry0;
    const mid = (ry0 + ry1) / 2;
    const off = Math.abs(mid - y);
    if (off > Math.max(6, h * 0.8)) continue;
    if (!words.some(([w0, w1]) => w1 > x0 - 2 && w0 < x1 + 2)) continue;
    if (!best || off < best.off) best = { row, off, mid, h };
  }
  if (!best) return null;
  const words = best.row[2];
  let s = x0;
  let e = x1;
  const first = words.find(([w0, w1]) => w1 > x0 - 2);
  if (first && first[0] - x0 < 8) s = first[0] - 1;
  const last = [...words].reverse().find(([w0]) => w0 < x1 + 2);
  if (last && x1 - last[1] < 8) e = last[1] + 1;
  if (e - s < 4) return null;
  return {
    a: { x: s, y: best.mid },
    b: { x: e, y: best.mid },
    size: Math.max(8, Math.min(30, best.h * 1.15)),
  };
}
