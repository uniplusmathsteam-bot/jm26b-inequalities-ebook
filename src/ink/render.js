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

/**
 * Paints one stroke. Snapped shapes (stroke.shape) are stroked as exact
 * paths; highlighter shapes use square ends so they cover whole words.
 */
export function paintStroke(ctx, stroke, sx, sy) {
  ctx.globalAlpha = stroke.tool === "highlighter" ? HIGHLIGHT_ALPHA : 1;
  if (stroke.shape) {
    const pts = stroke.points;
    if (pts.length < 2) return;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x * sx, p.y * sy) : ctx.moveTo(p.x * sx, p.y * sy)));
    if (stroke.shape === "ellipse" || stroke.shape === "rect") ctx.closePath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size * (stroke.tool === "highlighter" ? 1 : PEN_WIDTH) * sx;
    ctx.lineJoin = "round";
    ctx.lineCap = stroke.tool === "highlighter" ? "butt" : "round";
    ctx.stroke();
    return;
  }
  const outline = freehand(stroke);
  if (!outline.length) return;
  ctx.beginPath();
  outline.forEach((pt, i) => (i ? ctx.lineTo(pt[0] * sx, pt[1] * sy) : ctx.moveTo(pt[0] * sx, pt[1] * sy)));
  ctx.closePath();
  ctx.fillStyle = stroke.color;
  ctx.fill();
}
