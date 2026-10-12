import { getStroke } from "../../vendor/freehand/index.mjs";

export const HIGHLIGHT_ALPHA = 0.45;
/** Freehand pen ink renders at roughly this fraction of its nominal size. */
const PEN_WIDTH = 0.72;

function freehand(stroke) {
  const highlighter = stroke.tool === "highlighter";
  return getStroke(stroke.points.map((p) => [p.x, p.y, p.p ?? 0.5]), {
    size: stroke.size,
    thinning: highlighter ? 0 : 0.55,
    smoothing: 0.55,
    streamline: 0.45,
    simulatePressure: stroke.points.every((p) => p.p == null || p.p === 0.5),
    start: { cap: true, taper: highlighter ? 0 : 8 },
    end: { cap: true, taper: highlighter ? 0 : 8 },
  });
}

/* Outlines are costly to compute, so each stroke keeps its path (in page units)
   until its points, size or shape change. */
const paths = new WeakMap();

function signature(stroke) {
  const pts = stroke.points;
  const a = pts[0];
  const b = pts[pts.length - 1];
  return `${pts.length}|${a?.x},${a?.y}|${b?.x},${b?.y}|${stroke.size}|${stroke.shape || ""}`;
}

function pathFor(stroke) {
  const key = signature(stroke);
  const hit = paths.get(stroke);
  if (hit && hit.key === key && hit.points === stroke.points) return hit.path;
  const path = new Path2D();
  if (stroke.shape) {
    stroke.points.forEach((p, i) => (i ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y)));
    if (stroke.shape === "ellipse" || stroke.shape === "rect") path.closePath();
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
