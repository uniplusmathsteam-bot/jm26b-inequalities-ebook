import { paintStroke } from "./render.js";
import { linePoints, recognise, snapAngle, snapToText, straightHighlight } from "./shapes.js";

const DB_NAME = "jm26b-ebook";
const STORE = "kv";
const HOLD_MS = 520;
const HOLD_SLOP = 5;
const LASER_FADE = 700;
// iPad Safari caps each canvas near 16.7 MP and all canvases together by memory,
// so only pages near the screen with ink on them get full-size canvases.
const MAX_PIXELS = 5e6;
const CLOSED = new Set(["rect", "ellipse", "triangle"]);
const DRAW_TOOLS = new Set(["pen", "highlighter", "eraser"]);

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function segDist(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2)) : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** Distance from a point to the drawn path of a stroke. */
function strokeDist(stroke, point) {
  const pts = stroke.points;
  if (!pts.length) return Infinity;
  let d = dist(pts[0], point);
  for (let i = 1; i < pts.length; i++) d = Math.min(d, segDist(point, pts[i - 1], pts[i]));
  if (CLOSED.has(stroke.shape) && pts.length > 2) d = Math.min(d, segDist(point, pts[pts.length - 1], pts[0]));
  return d;
}

function clone(stroke) {
  return { ...stroke, points: stroke.points.map((p) => ({ ...p })) };
}

function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const hit = ((yi > p.y) !== (yj > p.y)) && (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-9) + xi);
    if (hit) inside = !inside;
  }
  return inside;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function createInk() {
  const strokes = [];
  let tool = { type: "read", color: "#1c1c1c", size: 2.4, snapShapes: true, snapText: true };
  const textRows = new Map();
  let hold = null;
  const undoStack = [];
  const redoStack = [];
  const selection = new Set();
  const replayHidden = new Set();
  let draft = null;
  let lasso = null;
  let laser = null;
  let laserLoop = false;
  let moving = null;
  let replay = null;
  let activeId = null;
  let eraserBatch = null;
  let saveTimer = 0;
  let dbPromise = null;
  let selEl = null;

  function sheets() {
    return [...document.querySelectorAll(".sheet")];
  }

  function sheetByKey(key) {
    return document.querySelector(`.sheet[data-key="${key}"]`);
  }

  function sheetAt(x, y) {
    return sheets().find((sheet) => {
      const r = sheet.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
  }

  /** Screen pixels per page point for a sheet at the current zoom. */
  function zoomOf(sheet) {
    return sheet.getBoundingClientRect().width / sheet.offsetWidth || 1;
  }

  function clientToPdf(sheet, clientX, clientY) {
    const rect = sheet.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * sheet.offsetWidth,
      y: ((clientY - rect.top) / rect.height) * sheet.offsetHeight,
    };
  }

  /* ---------- history ---------- */

  function pushHistory(entry) {
    undoStack.push(entry);
    if (undoStack.length > 120) undoStack.shift();
    redoStack.length = 0;
  }

  function removeId(id) {
    const index = strokes.findIndex((s) => s.id === id);
    if (index >= 0) strokes.splice(index, 1);
  }

  /** Takes out `remove` and puts in `add`; strokes kept by id stay in place. */
  function applySwap(remove, add) {
    const keep = new Set(add.map((s) => s.id));
    for (const stroke of remove) if (!keep.has(stroke.id)) removeId(stroke.id);
    for (const stroke of add) {
      const index = strokes.findIndex((s) => s.id === stroke.id);
      if (index >= 0) strokes[index] = clone(stroke);
      else strokes.push(clone(stroke));
    }
  }

  /** Records an edit of existing strokes made by `change`. */
  function editStrokes(list, change) {
    if (!list.length) return false;
    const before = list.map(clone);
    const changed = list.map(change).some(Boolean);
    if (!changed) return false;
    pushHistory({ type: "swap", removed: before, added: list.map(clone) });
    scheduleSave();
    const pages = new Set(list.map((s) => s.page));
    for (const page of pages) redraw(sheetByKey(page));
    syncSelection();
    return true;
  }

  /* ---------- saving ---------- */

  /** Saving clones every stroke, so it waits for a pause and never runs mid-stroke. */
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (draft || lasso || moving) {
        scheduleSave();
        return;
      }
      saveTimer = 0;
      save();
    }, 1500);
  }

  async function save() {
    try {
      const db = await (dbPromise ??= openDB());
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(strokes, "strokes");
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn("Could not save ink", err);
    }
  }

  async function load() {
    try {
      const db = await (dbPromise ??= openDB());
      const saved = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get("strokes");
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
      strokes.splice(0, strokes.length, ...saved);
      redrawAll();
    } catch (err) {
      console.warn("Could not load ink", err);
    }
  }

  /* ---------- canvases ---------- */

  function targetSize(sheet) {
    const rect = sheet.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (rect.width * rect.height)));
    return { w: Math.max(1, Math.round(rect.width * dpr)), h: Math.max(1, Math.round(rect.height * dpr)) };
  }

  function fit(canvas, size) {
    if (canvas.width !== size.w || canvas.height !== size.h) {
      canvas.width = size.w;
      canvas.height = size.h;
    } else canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  const TINY = { w: 1, h: 1 };

  function release(sheet) {
    if (sheet.dataset.inkSize === "") return;
    for (const canvas of sheet.querySelectorAll("canvas")) fit(canvas, TINY);
    sheet.dataset.inkSize = "";
  }

  function drawList(canvas, list, sheet, size) {
    fit(canvas, list.length ? size : TINY);
    if (!list.length) return;
    const ctx = canvas.getContext("2d");
    ctx.save();
    const sx = canvas.width / sheet.offsetWidth;
    const sy = canvas.height / sheet.offsetHeight;
    for (const stroke of list) paintStroke(ctx, stroke, sx, sy);
    ctx.restore();
  }

  function redraw(sheet) {
    if (!sheet) return;
    const size = targetSize(sheet);
    if (!size) return;
    const key = sheet.dataset.key;
    const mine = strokes.filter((s) => s.page === key && !replayHidden.has(s.id));
    drawList(sheet.querySelector('canvas[data-layer="hl"]'), mine.filter((s) => s.tool === "highlighter"), sheet, size);
    drawList(sheet.querySelector('canvas[data-layer="ink"]'), mine.filter((s) => s.tool !== "highlighter"), sheet, size);
    sheet.dataset.inkSize = `${size.w}x${size.h}`;
  }

  /** Adds one finished stroke to its layer without repainting the page. */
  function commit(stroke) {
    const sheet = sheetByKey(stroke.page);
    if (!sheet) return;
    const size = targetSize(sheet);
    const canvas = sheet.querySelector(`canvas[data-layer="${stroke.tool === "highlighter" ? "hl" : "ink"}"]`);
    if (!size || sheet.dataset.inkSize !== `${size.w}x${size.h}` || canvas.width !== size.w || canvas.height !== size.h) {
      redraw(sheet);
      return;
    }
    const ctx = canvas.getContext("2d");
    paintStroke(ctx, stroke, canvas.width / sheet.offsetWidth, canvas.height / sheet.offsetHeight);
    ctx.globalAlpha = 1;
  }

  /* The stroke being drawn (and the lasso) live on their own canvas, painted
     at most once per frame, so a busy page never slows the pen down. */
  let liveFrame = 0;
  let livePage = null;

  function liveCanvas(sheet) {
    let canvas = sheet.querySelector('canvas[data-layer="live"]');
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.dataset.layer = "live";
      sheet.append(canvas);
    }
    const size = targetSize(sheet) || TINY;
    if (canvas.width !== size.w || canvas.height !== size.h) {
      canvas.width = size.w;
      canvas.height = size.h;
    }
    return canvas;
  }

  function clearLive(page) {
    const canvas = page && sheetByKey(page)?.querySelector('canvas[data-layer="live"]');
    canvas?.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }

  /** Paints one temporary stroke on the live layer of its page. */
  function paintTemp(sheet, stroke) {
    const canvas = liveCanvas(sheet);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.toggle("hl", stroke?.tool === "highlighter");
    if (stroke && stroke.points.length) {
      paintStroke(ctx, stroke, canvas.width / sheet.offsetWidth, canvas.height / sheet.offsetHeight);
      ctx.globalAlpha = 1;
    }
    return canvas;
  }

  function paintLive() {
    cancelAnimationFrame(liveFrame);
    liveFrame = 0;
    const item = draft && !draft.eraser ? draft : null;
    const page = item?.page || lasso?.page || null;
    if (livePage && livePage !== page) clearLive(livePage);
    livePage = page;
    if (!page) return;
    const sheet = sheetByKey(page);
    if (!sheet) return;
    // Predicted points (where supported) close the gap between the ink and the Pencil tip.
    const shown = item?.predicted?.length ? { ...item, points: item.points.concat(item.predicted) } : item;
    const canvas = paintTemp(sheet, shown);
    if (lasso) paintLasso(canvas, lasso.points, sheet);
  }

  function scheduleLive() {
    if (!liveFrame) liveFrame = requestAnimationFrame(paintLive);
  }

  /** Repaints pages near the screen when their size changed; frees the rest. */
  function refresh(force = false) {
    const margin = window.innerHeight * 0.6;
    for (const sheet of sheets()) {
      const rect = sheet.getBoundingClientRect();
      if (rect.bottom < -margin || rect.top > window.innerHeight + margin) {
        release(sheet);
        continue;
      }
      const size = targetSize(sheet);
      if (size && (force || sheet.dataset.inkSize !== `${size.w}x${size.h}`)) redraw(sheet);
    }
  }

  function redrawAll() {
    refresh(true);
  }

  function paintLasso(canvas, points, sheet) {
    if (!points.length) return;
    const ctx = canvas.getContext("2d");
    const sx = canvas.width / sheet.offsetWidth;
    const sy = canvas.height / sheet.offsetHeight;
    ctx.save();
    ctx.strokeStyle = "#163a86";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5 * sx;
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x * sx, p.y * sy) : ctx.moveTo(p.x * sx, p.y * sy)));
    ctx.stroke();
    ctx.restore();
  }

  function bounds(list) {
    if (!list.length) return null;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const stroke of list) {
      const r = stroke.size / 2;
      for (const p of stroke.points) {
        x0 = Math.min(x0, p.x - r);
        y0 = Math.min(y0, p.y - r);
        x1 = Math.max(x1, p.x + r);
        y1 = Math.max(y1, p.y + r);
      }
    }
    return { x0: x0 - 4, y0: y0 - 4, x1: x1 + 4, y1: y1 + 4 };
  }

  /* ---------- selection ---------- */

  function selected() {
    return strokes.filter((s) => selection.has(s.id));
  }

  function syncSelection() {
    for (const id of [...selection]) if (!strokes.some((s) => s.id === id)) selection.delete(id);
    const list = selected();
    const box = bounds(list);
    const sheet = box && sheetByKey(list[0].page);
    if (!sheet) {
      selEl?.remove();
      selEl = null;
    } else {
      if (!selEl) {
        selEl = document.createElement("div");
        selEl.className = "ink-sel";
        selEl.innerHTML = '<i class="ink-handle"></i>';
      }
      if (selEl.parentElement !== sheet) sheet.append(selEl);
      selEl.style.left = `${box.x0}px`;
      selEl.style.top = `${box.y0}px`;
      selEl.style.width = `${box.x1 - box.x0}px`;
      selEl.style.height = `${box.y1 - box.y0}px`;
      selEl.style.setProperty("--k", String(1 / zoomOf(sheet)));
    }
    document.dispatchEvent(new CustomEvent("ink-selection", { detail: { count: selection.size, moving: Boolean(moving) } }));
  }

  function selectIds(ids) {
    selection.clear();
    for (const id of ids) selection.add(id);
    syncSelection();
  }

  function clearSelection() {
    if (!selection.size) return;
    selection.clear();
    syncSelection();
  }

  /** The topmost stroke under a point: pen ink wins over highlights beneath it. */
  function hitStroke(page, point, slop) {
    let fallback = null;
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i];
      if (s.page !== page || replayHidden.has(s.id)) continue;
      if (strokeDist(s, point) > s.size / 2 + slop) continue;
      if (s.tool !== "highlighter") return s;
      fallback ??= s;
    }
    return fallback;
  }

  /** "move", "scale" (corner handle) or null for a point on a sheet. */
  function selectionGrab(sheet, point) {
    const list = selected();
    if (!list.length || list[0].page !== sheet.dataset.key) return null;
    const box = bounds(list);
    const reach = 16 / zoomOf(sheet);
    if (dist(point, { x: box.x1, y: box.y1 }) <= reach) return "scale";
    if (point.x >= box.x0 && point.x <= box.x1 && point.y >= box.y0 && point.y <= box.y1) return "move";
    return null;
  }

  /** A tap on ink selects it; a tap elsewhere clears the selection. Returns true if used. */
  function tapSelect(clientX, clientY, slopPx = 8) {
    const sheet = sheetAt(clientX, clientY);
    if (!sheet) return false;
    const point = clientToPdf(sheet, clientX, clientY);
    const hit = hitStroke(sheet.dataset.key, point, slopPx / zoomOf(sheet));
    if (hit) {
      selectIds([hit.id]);
      return true;
    }
    if (!selection.size) return false;
    if (selectionGrab(sheet, point)) return true;
    clearSelection();
    return true;
  }

  function startEdit(mode, sheet, point) {
    const live = selected();
    moving = { mode, page: sheet.dataset.key, start: point, last: point, box: bounds(live), orig: live.map(clone), live, frame: 0 };
    syncSelection();
  }

  function applyEdit() {
    const m = moving;
    m.frame = 0;
    if (m.mode === "move") {
      const dx = m.last.x - m.start.x;
      const dy = m.last.y - m.start.y;
      m.live.forEach((s, i) => {
        s.points = m.orig[i].points.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
      });
    } else {
      const ax = m.box.x0;
      const ay = m.box.y0;
      const vx = m.box.x1 - ax;
      const vy = m.box.y1 - ay;
      const f = Math.max(0.15, Math.min(8, ((m.last.x - ax) * vx + (m.last.y - ay) * vy) / (vx * vx + vy * vy || 1)));
      m.live.forEach((s, i) => {
        const o = m.orig[i];
        s.points = o.points.map((p) => ({ ...p, x: ax + (p.x - ax) * f, y: ay + (p.y - ay) * f }));
        s.size = Math.max(0.4, Math.min(90, o.size * f));
      });
    }
    redraw(sheetByKey(m.page));
    syncSelection();
  }

  function finishEdit() {
    const m = moving;
    if (m.frame) {
      cancelAnimationFrame(m.frame);
      applyEdit();
    }
    moving = null;
    if (dist(m.start, m.last) > 0.5) {
      pushHistory({ type: "swap", removed: m.orig, added: m.live.map(clone) });
      scheduleSave();
    }
    syncSelection();
  }

  /** Recolours the selected strokes of one tool ("pen" covers all pen ink). */
  function recolorSelection(color, kind) {
    const list = selected().filter((s) => (kind === "highlighter" ? s.tool === "highlighter" : s.tool !== "highlighter"));
    return editStrokes(list, (s) => {
      const same = s.color === color;
      s.color = color;
      return !same;
    });
  }

  function thickenSelection(factor) {
    return editStrokes(selected(), (s) => {
      s.size = Math.max(0.4, Math.min(90, s.size * factor));
      return true;
    });
  }

  function shapeSelection() {
    return editStrokes(selected(), (s) => {
      if (s.shape) return false;
      const found = recognise(s.points);
      if (!found) return false;
      s.shape = found.shape;
      s.points = found.points;
      return true;
    });
  }

  function duplicateSelection() {
    const copies = selected().map((s) => ({ ...clone(s), id: uid(), points: s.points.map((p) => ({ ...p, x: p.x + 14, y: p.y + 14 })) }));
    if (!copies.length) return false;
    strokes.push(...copies);
    pushHistory({ type: "swap", removed: [], added: copies.map(clone) });
    scheduleSave();
    redraw(sheetByKey(copies[0].page));
    selectIds(copies.map((s) => s.id));
    return true;
  }

  function deleteSelection() {
    const removed = selected().map(clone);
    if (!removed.length) return;
    for (const stroke of removed) removeId(stroke.id);
    selection.clear();
    pushHistory({ type: "swap", removed, added: [] });
    scheduleSave();
    redrawAll();
    syncSelection();
  }

  /* ---------- drawing helpers ---------- */

  function addPoint(target, event, sheet) {
    // pointerdown usually has no coalesced events, which would drop the first point.
    const coalesced = event.getCoalescedEvents?.() || [];
    const list = coalesced.length ? coalesced : [event];
    const pen = event.pointerType === "pen";
    for (const item of list) {
      const p = clientToPdf(sheet, item.clientX, item.clientY);
      const prev = target.points[target.points.length - 1];
      // Pencil pressure is noisy, and often 0 on the very first sample: smooth it.
      if (pen) p.p = item.pressure > 0 ? (prev ? prev.p * 0.35 + item.pressure * 0.65 : item.pressure) : prev?.p ?? 0.35;
      else p.p = item.pressure > 0 ? item.pressure : 0.5;
      p.t = performance.now();
      if (!prev || dist(prev, p) > target.minStep) target.points.push(p);
      else if (pen) prev.p = p.p;
    }
    const predicted = pen && event.getPredictedEvents ? event.getPredictedEvents() : [];
    const last = target.points[target.points.length - 1];
    target.predicted = predicted.slice(0, 3).map((item) => ({ ...clientToPdf(sheet, item.clientX, item.clientY), p: last?.p ?? 0.5 }));
  }

  /**
   * Snap targets inside an answer line: one box per character of maths and
   * per word of prose, so a highlight can stop part-way along the line.
   */
  function tokenRects(el) {
    const out = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement.closest(".katex-mathml")) continue;
      const math = Boolean(node.parentElement.closest(".katex-html"));
      const text = node.data;
      const pattern = math ? /\S/g : /\S+/g;
      for (let m = pattern.exec(text); m; m = pattern.exec(text)) {
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const r = range.getBoundingClientRect();
        if (r.width > 0.5) out.push(r);
      }
    }
    return out;
  }

  /** Printed text rows of the page plus the visible answer-box lines on it. */
  function rowsFor(sheet) {
    const rows = [...(textRows.get(sheet.dataset.key) || [])];
    const origin = sheet.getBoundingClientRect();
    const k = sheet.offsetWidth / (origin.width || sheet.offsetWidth);
    const sx = (v) => (v - origin.left) * k;
    for (const line of sheet.querySelectorAll(".overlay .ln:not(.hid), .overlay .hd")) {
      const parts = line.classList.contains("hd") ? [line] : [...line.querySelectorAll(".lx, .rs")];
      const boxes = parts.map((el) => el.getBoundingClientRect()).filter((r) => r.width > 0);
      if (!boxes.length) continue;
      const tokens = parts.flatMap(tokenRects).sort((p, q) => p.left - q.left);
      const y0 = (Math.min(...boxes.map((r) => r.top)) - origin.top) * k;
      const y1 = (Math.max(...boxes.map((r) => r.bottom)) - origin.top) * k;
      rows.push([y0, y1, (tokens.length ? tokens : boxes).map((r) => [sx(r.left), sx(r.right)])]);
    }
    return rows;
  }

  /** Centres a horizontal highlight on the text line under it. */
  function snapHighlightToText(stroke) {
    const sheet = sheetByKey(stroke.page);
    const a = stroke.points[0];
    const b = stroke.points[stroke.points.length - 1];
    if (sheet && !stroke.rows) stroke.rows = rowsFor(sheet);
    const fitted = tool.snapText !== false && sheet ? snapToText(a, b, stroke.rows) : null;
    if (fitted) {
      stroke.points = linePoints(fitted.a, fitted.b);
      stroke.size = fitted.size;
    } else stroke.size = stroke.baseSize ?? stroke.size;
    return Boolean(fitted);
  }

  function armHold(event) {
    clearTimeout(hold?.timer);
    hold = { x: event.clientX, y: event.clientY, timer: setTimeout(onHold, HOLD_MS) };
  }

  function disarmHold() {
    clearTimeout(hold?.timer);
    hold = null;
  }

  function onHold() {
    hold = null;
    if (!draft || draft.eraser || draft.shape || tool.snapShapes === false) return;
    const found = recognise(draft.points);
    if (!found) return;
    draft.shape = found.shape;
    draft.anchor = found.a ? { x: found.a.x, y: found.a.y } : null;
    draft.axis = found.axis || null;
    draft.points = found.points;
    draft.predicted = null;
    let onText = false;
    if (draft.tool === "highlighter" && draft.shape === "line" && draft.axis === "h") onText = snapHighlightToText(draft);
    scheduleLive();
    document.dispatchEvent(new CustomEvent("ink-snap", { detail: { shape: draft.shape, axis: draft.axis, onText } }));
  }

  /** While still holding after a snap, the free end of a line follows the pen. */
  function adjustShape(point) {
    if (draft.shape !== "line" || !draft.anchor) return;
    const tip = snapAngle(draft.anchor, point);
    draft.axis = tip.axis;
    draft.points = linePoints(draft.anchor, tip);
    if (draft.tool === "highlighter") {
      if (draft.axis === "h") snapHighlightToText(draft);
      else draft.size = draft.baseSize;
    }
  }

  function finishHighlight(stroke) {
    if (stroke.tool !== "highlighter" || stroke.shape || tool.snapText === false) return;
    const straight = straightHighlight(stroke.points);
    if (!straight) return;
    stroke.shape = "line";
    stroke.points = linePoints(straight.a, straight.b);
    snapHighlightToText(stroke);
  }

  /* ---------- eraser ---------- */

  /** The parts of a stroke left after rubbing out a circle. */
  function splitStroke(stroke, point, radius) {
    let pts = stroke.points;
    const inside = (p) => dist(p, point) <= radius;
    if (!pts.some(inside)) return null;
    if (CLOSED.has(stroke.shape)) {
      const first = pts.findIndex(inside);
      pts = pts.slice(first).concat(pts.slice(0, first), [pts[first]]);
    }
    const pieces = [];
    let run = [];
    for (const p of pts) {
      if (inside(p)) {
        if (run.length > 1) pieces.push(run);
        run = [];
      } else run.push({ ...p });
    }
    if (run.length > 1) pieces.push(run);
    return pieces.map((points) => ({
      ...stroke,
      id: uid(),
      points,
      shape: stroke.shape ? "path" : undefined,
      cut: true,
    }));
  }

  function eraseAt(sheet, point) {
    const radius = 8 + tool.size;
    const page = sheet.dataset.key;
    const onlyHighlights = tool.eraseHighlights === true;
    const partial = tool.erasePartial === true;
    const hits = strokes.filter((s) => s.page === page
      && (!onlyHighlights || s.tool === "highlighter")
      && strokeDist(s, point) <= radius + s.size * 0.3);
    if (!hits.length) return;
    for (const hit of hits) {
      const pieces = partial ? splitStroke(hit, point, radius + hit.size * 0.3) : [];
      if (!pieces) continue;
      const index = strokes.indexOf(hit);
      strokes.splice(index, 1, ...pieces);
      selection.delete(hit.id);
      const fresh = eraserBatch.added.findIndex((s) => s.id === hit.id);
      if (fresh >= 0) eraserBatch.added.splice(fresh, 1);
      else eraserBatch.removed.push(clone(hit));
      eraserBatch.added.push(...pieces);
    }
    redraw(sheet);
  }

  /* ---------- laser ---------- */

  function laserCanvas(sheet) {
    let canvas = sheet.querySelector('canvas[data-layer="laser"]');
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.dataset.layer = "laser";
      sheet.append(canvas);
    }
    const size = targetSize(sheet) || TINY;
    if (canvas.width !== size.w || canvas.height !== size.h) {
      canvas.width = size.w;
      canvas.height = size.h;
    }
    return canvas;
  }

  function laserFrame() {
    if (!laser) return;
    const sheet = sheetByKey(laser.page);
    if (!sheet) {
      laser = null;
      laserLoop = false;
      return;
    }
    const canvas = laserCanvas(sheet);
    const ctx = canvas.getContext("2d");
    const now = performance.now();
    laser.points = laser.points.filter((p) => now - p.t < LASER_FADE);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const k = canvas.width / sheet.offsetWidth;
    ctx.save();
    ctx.scale(k, k);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "rgba(255, 40, 40, 0.9)";
    ctx.shadowBlur = 6 * k;
    const pts = laser.points;
    for (let i = 1; i < pts.length; i++) {
      const life = 1 - (now - pts[i].t) / LASER_FADE;
      ctx.strokeStyle = `rgba(255, 45, 45, ${(0.85 * life).toFixed(3)})`;
      ctx.lineWidth = 1.2 + 2.6 * life;
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    if (laser.down && laser.head) {
      ctx.fillStyle = "rgba(255, 40, 40, 0.95)";
      ctx.beginPath();
      ctx.arc(laser.head.x, laser.head.y, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(laser.head.x, laser.head.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (laser.down || pts.length) requestAnimationFrame(laserFrame);
    else {
      laser = null;
      laserLoop = false;
      fit(canvas, TINY);
    }
  }

  function laserPoint(sheet, event) {
    const p = clientToPdf(sheet, event.clientX, event.clientY);
    p.t = performance.now();
    laser.head = p;
    laser.points.push(p);
  }

  /* ---------- ink replay ---------- */

  function stopReplay() {
    if (!replay) return;
    cancelAnimationFrame(replay.frame);
    const key = replay.key;
    replay = null;
    replayHidden.clear();
    clearLive(key);
    redraw(sheetByKey(key));
    document.dispatchEvent(new CustomEvent("ink-replay", { detail: { playing: false } }));
  }

  /** Redraws a page's ink stroke by stroke, in the order it was written. */
  function replayPage(key) {
    stopReplay();
    const sheet = sheetByKey(key);
    const list = strokes.filter((s) => s.page === key);
    if (!sheet || !list.length) return false;
    clearSelection();
    for (const s of list) replayHidden.add(s.id);
    redraw(sheet);
    const total = list.reduce((n, s) => n + s.points.length, 0);
    const rate = Math.max(0.3, total / 9000);
    replay = { key, list, i: 0, n: 0, wait: 250, last: performance.now(), frame: 0 };
    const frame = (now) => {
      if (!replay) return;
      const dt = Math.min(50, now - replay.last);
      replay.last = now;
      if (replay.wait > 0) replay.wait -= dt;
      else {
        const stroke = replay.list[replay.i];
        replay.n += dt * rate * (stroke.shape ? 3 : 1);
        if (replay.n >= stroke.points.length) {
          replayHidden.delete(stroke.id);
          clearLive(key);
          commit(stroke);
          replay.i += 1;
          replay.n = 0;
          replay.wait = 70;
          if (replay.i >= replay.list.length) {
            stopReplay();
            return;
          }
        } else {
          const part = { ...stroke, points: stroke.points.slice(0, Math.max(1, Math.floor(replay.n))), shape: stroke.shape ? "path" : undefined };
          paintTemp(sheet, part);
        }
      }
      replay.frame = requestAnimationFrame(frame);
    };
    replay.frame = requestAnimationFrame(frame);
    document.dispatchEvent(new CustomEvent("ink-replay", { detail: { playing: true } }));
    return true;
  }

  /* ---------- pointer handling ---------- */

  function onDown(event) {
    if (replay) stopReplay();
    const sheet = event.target.closest?.(".sheet");
    if (!sheet) return;
    if (event.target.closest("button, input, a, select, textarea, .ctl")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (activeId !== null) {
      // A second finger or a palm never interrupts the Pencil.
      if (event.pointerType === "touch") return;
      finish();
    }
    const point = clientToPdf(sheet, event.clientX, event.clientY);
    // Dragging inside a selection moves it (or resizes it from the corner), with any tool.
    const grab = selectionGrab(sheet, point);
    if (grab) {
      event.preventDefault();
      event.stopPropagation();
      activeId = event.pointerId;
      startEdit(grab, sheet, point);
      sheet.setPointerCapture?.(event.pointerId);
      return;
    }
    if (event.pointerType === "touch") return;
    if (tool.type === "hand" || tool.type === "read") return;
    event.preventDefault();
    activeId = event.pointerId;
    if (tool.type === "laser") {
      const running = laser?.page === sheet.dataset.key;
      if (laser && !running) laserCanvas(sheetByKey(laser.page) || sheet).getContext("2d").clearRect(0, 0, 1e5, 1e5);
      laser = { page: sheet.dataset.key, points: running ? laser.points : [], down: true, head: null };
      laserPoint(sheet, event);
      sheet.setPointerCapture?.(event.pointerId);
      if (!laserLoop) {
        laserLoop = true;
        requestAnimationFrame(laserFrame);
      }
      return;
    }
    clearSelection();
    if (tool.type === "lasso") {
      lasso = { page: sheet.dataset.key, points: [point] };
      sheet.setPointerCapture?.(event.pointerId);
      scheduleLive();
      return;
    }
    if (tool.type === "eraser") {
      eraserBatch = { removed: [], added: [] };
      eraseAt(sheet, point);
      draft = { eraser: true, page: sheet.dataset.key };
      sheet.setPointerCapture?.(event.pointerId);
      return;
    }
    draft = {
      id: uid(),
      page: sheet.dataset.key,
      tool: tool.type,
      color: tool.color,
      size: tool.type === "highlighter" ? tool.size * 7 : tool.size,
      points: [],
      minStep: 0.45 / zoomOf(sheet),
    };
    draft.baseSize = draft.size;
    const hint = event.target.closest?.("[data-link]");
    if (hint) draft.tap = { q: hint.dataset.q, link: hint.dataset.link, t: performance.now() };
    addPoint(draft, event, sheet);
    armHold(event);
    sheet.setPointerCapture?.(event.pointerId);
    paintLive();
  }

  function onMove(event) {
    if (event.pointerId !== activeId) return;
    if (laser?.down) {
      const own = sheetByKey(laser.page);
      if (own) laserPoint(own, event);
      return;
    }
    const sheet = sheetByKey(draft?.page || lasso?.page || moving?.page || "");
    if (!sheet) return;
    const point = clientToPdf(sheet, event.clientX, event.clientY);
    if (moving) {
      moving.last = point;
      if (!moving.frame) moving.frame = requestAnimationFrame(applyEdit);
      return;
    }
    if (lasso) {
      lasso.points.push(point);
      scheduleLive();
      return;
    }
    if (!draft) return;
    if (draft.eraser) {
      eraseAt(sheet, point);
      return;
    }
    if (draft.shape) {
      adjustShape(point);
      scheduleLive();
      return;
    }
    addPoint(draft, event, sheet);
    if (!hold || Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > HOLD_SLOP) armHold(event);
    scheduleLive();
  }

  function onUp(event) {
    // A palm lifting off the glass must not end the Pencil stroke.
    if (event.pointerId !== activeId) return;
    finish();
  }

  function finish() {
    activeId = null;
    disarmHold();
    if (laser?.down) {
      laser.down = false;
      return;
    }
    if (moving) {
      finishEdit();
      return;
    }
    if (lasso) {
      const page = lasso.page;
      const pts = lasso.points;
      const box = bounds([{ size: 0, points: pts }]);
      lasso = null;
      paintLive();
      if (box.x1 - box.x0 < 12 && box.y1 - box.y0 < 12) {
        // A tap with the select tool picks the stroke under it.
        const sheet = sheetByKey(page);
        const hit = sheet && hitStroke(page, pts[0], 8 / zoomOf(sheet));
        selectIds(hit ? [hit.id] : []);
        return;
      }
      selectIds(strokes.filter((s) => s.page === page && s.points.some((p) => pointInPoly(p, pts))).map((s) => s.id));
      return;
    }
    if (!draft || draft.eraser) {
      if (eraserBatch && (eraserBatch.removed.length || eraserBatch.added.length)) {
        pushHistory({ type: "swap", removed: eraserBatch.removed, added: eraserBatch.added.map(clone) });
        scheduleSave();
      }
      eraserBatch = null;
      draft = null;
      return;
    }
    const tap = draft.tap;
    delete draft.tap;
    if (tap && performance.now() - tap.t < 350 && draft.points.every((p) => dist(p, draft.points[0]) < 2.5)) {
      // A quick tap on a link hint opens it instead of leaving a dot.
      draft = null;
      paintLive();
      document.dispatchEvent(new CustomEvent("ink-link-tap", { detail: tap }));
      return;
    }
    const stroke = draft;
    draft = null;
    if (stroke.points.length) {
      finishHighlight(stroke);
      for (const key of ["anchor", "axis", "baseSize", "rows", "minStep", "predicted"]) delete stroke[key];
      strokes.push(stroke);
      pushHistory({ type: "add", stroke: clone(stroke) });
      commit(stroke);
      scheduleSave();
    }
    paintLive();
  }

  /* ---------- undo and page actions ---------- */

  function undo() {
    stopReplay();
    const entry = undoStack.pop();
    if (!entry) return false;
    redoStack.push(entry);
    apply(entry, true);
    return true;
  }

  function redo() {
    stopReplay();
    const entry = redoStack.pop();
    if (!entry) return false;
    undoStack.push(entry);
    apply(entry, false);
    return true;
  }

  function apply(entry, reverse) {
    if (entry.type === "add") {
      if (reverse) removeId(entry.stroke.id);
      else strokes.push(clone(entry.stroke));
    } else if (entry.type === "swap") {
      if (reverse) applySwap(entry.added, entry.removed);
      else applySwap(entry.removed, entry.added);
    } else if (entry.type === "clear") {
      if (reverse) strokes.push(...entry.strokes.map(clone));
      else {
        for (let i = strokes.length - 1; i >= 0; i--) {
          if (strokes[i].page === entry.page) strokes.splice(i, 1);
        }
      }
    }
    scheduleSave();
    redrawAll();
    syncSelection();
  }

  function clearPage(page) {
    const removed = strokes.filter((s) => s.page === page).map(clone);
    if (!removed.length) return;
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (strokes[i].page === page) strokes.splice(i, 1);
    }
    selection.clear();
    pushHistory({ type: "clear", page, strokes: removed });
    scheduleSave();
    redraw(sheetByKey(page));
    syncSelection();
  }

  /* ---------- Pencil hover preview ---------- */

  function bindHover(world) {
    const dot = document.createElement("div");
    dot.className = "pencil-hover";
    document.body.append(dot);
    let timer = 0;
    const hide = () => {
      clearTimeout(timer);
      dot.classList.remove("show");
    };
    world.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "pen" || event.buttons || !DRAW_TOOLS.has(tool.type)) {
        hide();
        return;
      }
      const sheet = event.target.closest?.(".sheet");
      if (!sheet) {
        hide();
        return;
      }
      const k = zoomOf(sheet);
      const eraser = tool.type === "eraser";
      const d = eraser ? (8 + tool.size) * 2 * k : tool.type === "highlighter" ? tool.size * 7 * k : Math.max(4, tool.size * 0.9 * k);
      dot.style.width = `${d}px`;
      dot.style.height = `${d}px`;
      dot.style.transform = `translate(${event.clientX - d / 2}px, ${event.clientY - d / 2}px)`;
      dot.style.setProperty("--c", eraser ? "transparent" : tool.color);
      dot.classList.toggle("eraser", eraser);
      dot.classList.toggle("marker", tool.type === "highlighter");
      dot.classList.add("show");
      clearTimeout(timer);
      timer = setTimeout(hide, 500);
    });
    world.addEventListener("pointerdown", hide, true);
    world.addEventListener("pointerleave", hide);
  }

  function bind(world) {
    world.addEventListener("pointerdown", onDown, true);
    world.addEventListener("pointermove", onMove, true);
    world.addEventListener("pointerup", onUp, true);
    world.addEventListener("pointercancel", onUp, true);
    // Without this, Safari holds back quick successive Pencil strokes while it
    // checks for a double-tap, scroll or text-selection gesture.
    const claimStylus = (event) => {
      if (tool.type === "read" || tool.type === "hand") return;
      if (event.target.closest?.("button, input, a, select, textarea, .ctl")) return;
      if ([...event.changedTouches].some((t) => t.touchType === "stylus")) event.preventDefault();
    };
    world.addEventListener("touchstart", claimStylus, { passive: false });
    world.addEventListener("touchmove", claimStylus, { passive: false });
    world.addEventListener("touchend", claimStylus, { passive: false });
    bindHover(world);
    // iPadOS can discard a backgrounded tab without warning, so save at once.
    const flush = () => {
      if (!saveTimer) return;
      clearTimeout(saveTimer);
      saveTimer = 0;
      save();
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    window.addEventListener("pagehide", flush);
    load();
  }

  return {
    bind,
    redraw,
    redrawAll,
    refresh,
    setTool(next) { tool = { ...tool, ...next }; },
    setText(page, rows) { textRows.set(page, rows || []); },
    getTool() { return tool; },
    undo,
    redo,
    clearPage,
    deleteSelection,
    clearSelection,
    tapSelect,
    recolorSelection,
    thickenSelection,
    shapeSelection,
    duplicateSelection,
    syncSelection,
    selectionCount() { return selection.size; },
    selectionTools() { return [...new Set(selected().map((s) => s.tool))]; },
    selectionRect() { return selEl?.getBoundingClientRect() || null; },
    replayPage,
    stopReplay,
    replaying() { return Boolean(replay); },
    toJSON() {
      return strokes.map((s) => ({ ...s, points: s.points.map((p) => ({ x: p.x, y: p.y, p: p.p })) }));
    },
    fromJSON(data) {
      stopReplay();
      strokes.splice(0, strokes.length, ...(data || []));
      selection.clear();
      undoStack.length = 0;
      redoStack.length = 0;
      scheduleSave();
      redrawAll();
      syncSelection();
    },
    strokesFor(page) { return strokes.filter((s) => s.page === page); },
  };
}
