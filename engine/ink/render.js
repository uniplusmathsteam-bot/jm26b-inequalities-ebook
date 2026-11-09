import { getStroke } from "../../vendor/freehand/index.mjs";

export const HIGHLIGHT_ALPHA = 0.45;
/** Freehand pen ink renders at roughly this fraction of its nominal size. */
const PEN_WIDTH = 0.72;
const THINNING = 0.55;

const CLOSED = new Set(["rect", "ellipse", "triangle"]);

/** Lifts light Pencil pressure so soft writing still shows; 0.5 stays 0.5. */
function pressure(p) {
  if (p == null) return 0.5;
  return Math.max(0.06, Math.min(1, 0.5 * Math.pow(2 * p, 0.72)));
}

function lengthOf(pts) {
  let length = 0;
  for (let i = 1; i < pts.length; i++) length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return length;
}

/* perfect-freehand drops the points of a pen stroke shorter than about size + 3 pt
   and tapers both ends to nothing, so a Pencil tap (which always moves a little)
   drew a mark 0.02 pt wide. A wobbling tap fails the same way however far the
   tip travelled, so any pen mark that fits in this span is drawn as dabs instead. */
function small(stroke) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of stroke.points) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  return Math.hypot(x1 - x0, y1 - y0) < stroke.size + 3.5;
}

/** Round dabs at each point joined by bars, all wound the same way so the fill is their union. */
function dab(stroke) {
  const pts = stroke.points;
  const p = pts.reduce((sum, q) => sum + (q.p ?? 0.5), 0) / pts.length;
  const r = Math.max(stroke.size * 0.4, stroke.size * (0.5 - THINNING * (0.5 - pressure(p))));
  const path = new Path2D();
  for (const q of pts) {
    path.moveTo(q.x + r, q.y);
    path.arc(q.x, q.y, r, 0, Math.PI * 2);
  }
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-3) continue;
    const nx = (-(b.y - a.y) / d) * r;
    const ny = ((b.x - a.x) / d) * r;
    path.moveTo(a.x - nx, a.y - ny);
    path.lineTo(b.x - nx, b.y - ny);
    path.lineTo(b.x + nx, b.y + ny);
    path.lineTo(a.x + nx, a.y + ny);
    path.closePath();
  }
  return path;
}

function freehand(stroke) {
  const highlighter = stroke.tool === "highlighter";
  const pts = stroke.points;
  const taper = highlighter || stroke.cut ? 0 : Math.min(8, lengthOf(pts) * 0.3);
  return getStroke(pts.map((p) => [p.x, p.y, pressure(p.p)]), {
    size: stroke.size,
    thinning: highlighter ? 0 : THINNING,
    smoothing: 0.5,
    streamline: 0.3,
    simulatePressure: pts.every((p) => p.p == null || p.p === 0.5),
    last: true,
    start: { cap: true, taper },
    end: { cap: true, taper },
  });
}

/* Outlines are costly to compute, so each stroke keeps its path (in page units)
   until its points, size or shape change. */
const paths = new WeakMap();

function signature(stroke) {
  const pts = stroke.points;
  const a = pts[0];
  const b = pts[pts.length - 1];
  return `${pts.length}|${a?.x},${a?.y}|${b?.x},${b?.y}|${a?.p}|${b?.p}|${stroke.size}|${stroke.shape || ""}`;
}

function pathFor(stroke) {
  const key = signature(stroke);
  const hit = paths.get(stroke);
  if (hit && hit.key === key && hit.points === stroke.points) return hit.path;
  let path = new Path2D();
  if (stroke.shape) {
    stroke.points.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)));
    if (CLOSED.has(stroke.shape)) path.closePath();
  } else if (stroke.tool !== "highlighter" && small(stroke)) {
    path = dab(stroke);
  } else {
    const outline = freehand(stroke);
    outline.forEach((pt, i) => (i ? path.lineTo(pt[0], pt[1]) : path.moveTo(pt[0], pt[1])));
    if (outline.length) path.closePath();
  }
  paths.set(stroke, { key, points: stroke.points, path });
  return path;
}

/**
 * Paints one stroke. Snapped shapes (stroke.shape) are stroked as exact
 * paths; highlighter shapes use square ends so they cover whole words.
 */
export function paintStroke(ctx, stroke, sx, sy) {
  ctx.globalAlpha = stroke.tool === "highlighter" ? HIGHLIGHT_ALPHA : 1;
  if (!stroke.points.length || (stroke.shape && stroke.points.length < 2)) return;
  const path = pathFor(stroke);
  ctx.save();
  ctx.scale(sx, sy);
  if (stroke.shape) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * (stroke.tool === "highlighter" ? 1 : PEN_WIDTH);
    ctx.lineJoin = "round";
    ctx.lineCap = stroke.tool === "highlighter" ? "butt" : "round";
    ctx.stroke(path);
  } else {
    ctx.fillStyle = stroke.color;
    ctx.fill(path);
  }
  ctx.restore();
}
