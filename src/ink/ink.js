import { paintStroke } from "./render.js";
import { linePoints, recognise, snapAngle, snapToText, straightHighlight } from "./shapes.js";

const DB_NAME = "jm26b-ebook";
const STORE = "kv";
const HOLD_MS = 480;
const HOLD_SLOP = 5;
const LASER_FADE = 700;
// iPad Safari caps each canvas near 16.7 MP and all canvases together by memory,
// so only pages near the screen with ink on them get full-size canvases.
const MAX_PIXELS = 5e6;

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
  let draft = null;
  let lasso = null;
  let laser = null;
  let laserLoop = false;
  let moving = null;
  let eraserBatch = null;
  let saveTimer = 0;
  let dbPromise = null;

  function sheets() {
    return [...document.querySelectorAll(".sheet")];
  }

  function sheetByKey(key) {
    return document.querySelector(`.sheet[data-key="${key}"]`);
  }

  function clientToPdf(sheet, clientX, clientY) {
    const rect = sheet.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * sheet.offsetWidth,
      y: ((clientY - rect.top) / rect.height) * sheet.offsetHeight,
    };
  }

  function pushHistory(entry) {
    undoStack.push(entry);
    if (undoStack.length > 80) undoStack.shift();
    redoStack.length = 0;
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = 0;
      save();
    }, 350);
  }

  async function save() {
    try {
      const db = await (dbPromise ??= openDB());
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(strokes.map((s) => ({ ...s, points: s.points.map((p) => ({ ...p })) })), "strokes");
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
    const mine = strokes.filter((s) => s.page === key && !s.hidden);
    const live = draft && draft.page === key ? mine.concat(draft) : mine;
    const pens = live.filter((s) => s.tool !== "highlighter");
    const ink = sheet.querySelector('canvas[data-layer="ink"]');
    const lassoHere = lasso && lasso.page === key;
    const selectedHere = selection.size && mine.some((s) => selection.has(s.id));
    drawList(sheet.querySelector('canvas[data-layer="hl"]'), live.filter((s) => s.tool === "highlighter"), sheet, size);
    if (pens.length) drawList(ink, pens, sheet, size);
    else fit(ink, lassoHere || selectedHere ? size : TINY);
    if (lassoHere) paintLasso(ink, lasso.points, sheet);
    if (selectedHere) paintSelection(ink, key, sheet);
    sheet.dataset.inkSize = `${size.w}x${size.h}`;
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

  function paintSelection(canvas, key, sheet) {
    const box = bounds(strokes.filter((s) => s.page === key && selection.has(s.id)));
    if (!box) return;
    const ctx = canvas.getContext("2d");
    const sx = canvas.width / sheet.offsetWidth;
    const sy = canvas.height / sheet.offsetHeight;
    ctx.save();
    ctx.strokeStyle = "#163a86";
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.25 * sx;
    ctx.strokeRect(box.x0 * sx, box.y0 * sy, (box.x1 - box.x0) * sx, (box.y1 - box.y0) * sy);
    ctx.restore();
  }

  function bounds(list) {
    if (!list.length) return null;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const stroke of list) {
      for (const p of stroke.points) {
        x0 = Math.min(x0, p.x);
        y0 = Math.min(y0, p.y);
        x1 = Math.max(x1, p.x);
        y1 = Math.max(y1, p.y);
      }
    }
    return { x0: x0 - 4, y0: y0 - 4, x1: x1 + 4, y1: y1 + 4 };
  }

  function redrawAll() {
    refresh(true);
  }

  function hitStrokes(page, point, radius) {
    return strokes.filter((s) => s.page === page && s.points.some((p) => dist(p, point) <= radius));
  }

  function addPoint(target, event, sheet) {
    const list = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
    for (const item of list) {
      const p = clientToPdf(sheet, item.clientX, item.clientY);
      p.p = item.pressure && item.pressure > 0 ? item.pressure : 0.5;
      p.t = performance.now();
      const prev = target.points[target.points.length - 1];
      if (!prev || dist(prev, p) > 0.35) target.points.push(p);
    }
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
    const fit = tool.snapText !== false && sheet ? snapToText(a, b, stroke.rows) : null;
    if (fit) {
      stroke.points = linePoints(fit.a, fit.b);
      stroke.size = fit.size;
    } else stroke.size = stroke.baseSize ?? stroke.size;
    return Boolean(fit);
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
    let onText = false;
    if (draft.tool === "highlighter" && draft.shape === "line" && draft.axis === "h") onText = snapHighlightToText(draft);
    redraw(sheetByKey(draft.page));
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

  /* Laser pointer: a glowing trail that fades on its own canvas and is never saved. */
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

  function onDown(event) {
    if (event.pointerType === "touch") return;
    if (tool.type === "hand" || tool.type === "read") return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const sheet = event.target.closest?.(".sheet");
    if (!sheet) return;
    if (event.target.closest("button, input, a, select, textarea, .ctl")) return;
    event.preventDefault();
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
    const point = clientToPdf(sheet, event.clientX, event.clientY);
    if (tool.type === "lasso") {
      const box = bounds(strokes.filter((s) => selection.has(s.id) && s.page === sheet.dataset.key));
      if (box && point.x >= box.x0 && point.x <= box.x1 && point.y >= box.y0 && point.y <= box.y1) {
        moving = { page: sheet.dataset.key, last: point, before: strokes.filter((s) => selection.has(s.id)).map((s) => ({ id: s.id, points: s.points.map((p) => ({ ...p })) })) };
      } else {
        selection.clear();
        lasso = { page: sheet.dataset.key, points: [point] };
      }
      sheet.setPointerCapture?.(event.pointerId);
      redraw(sheet);
      return;
    }
    if (tool.type === "eraser") {
      eraserBatch = [];
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
    };
    draft.baseSize = draft.size;
    const hint = event.target.closest?.("[data-link]");
    if (hint) draft.tap = { q: hint.dataset.q, link: hint.dataset.link, t: performance.now() };
    addPoint(draft, event, sheet);
    armHold(event);
    sheet.setPointerCapture?.(event.pointerId);
    redraw(sheet);
  }

  function onMove(event) {
    if (event.pointerType === "touch") return;
    if (laser?.down) {
      const own = sheetByKey(laser.page);
      if (own) laserPoint(own, event);
      return;
    }
    const sheet = sheetByKey(draft?.page || lasso?.page || moving?.page || "");
    if (!sheet) return;
    const point = clientToPdf(sheet, event.clientX, event.clientY);
    if (moving) {
      const dx = point.x - moving.last.x;
      const dy = point.y - moving.last.y;
      for (const stroke of strokes) {
        if (!selection.has(stroke.id)) continue;
        for (const p of stroke.points) {
          p.x += dx;
          p.y += dy;
        }
      }
      moving.last = point;
      redraw(sheet);
      return;
    }
    if (lasso) {
      lasso.points.push(point);
      redraw(sheet);
      return;
    }
    if (!draft) return;
    if (draft.eraser) {
      eraseAt(sheet, point);
      return;
    }
    if (draft.shape) {
      adjustShape(point);
      redraw(sheet);
      return;
    }
    addPoint(draft, event, sheet);
    if (!hold || Math.hypot(event.clientX - hold.x, event.clientY - hold.y) > HOLD_SLOP) armHold(event);
    redraw(sheet);
  }

  function eraseAt(sheet, point) {
    const radius = 8 + tool.size;
    const hits = hitStrokes(sheet.dataset.key, point, radius);
    if (!hits.length) return;
    const removed = hits.map((s) => ({ ...s, points: s.points.map((p) => ({ ...p })) }));
    for (const hit of hits) {
      const index = strokes.indexOf(hit);
      if (index >= 0) strokes.splice(index, 1);
      selection.delete(hit.id);
    }
    if (eraserBatch) eraserBatch.push(...removed);
    else pushHistory({ type: "delete", strokes: removed });
    scheduleSave();
    redraw(sheet);
  }

  function onUp() {
    disarmHold();
    if (laser?.down) {
      laser.down = false;
      return;
    }
    if (moving) {
      const after = moving.before.map((item) => {
        const stroke = strokes.find((s) => s.id === item.id);
        return { id: item.id, points: stroke.points.map((p) => ({ ...p })) };
      });
      pushHistory({ type: "move", before: moving.before, after });
      moving = null;
      scheduleSave();
      return;
    }
    if (lasso) {
      const page = lasso.page;
      for (const stroke of strokes) {
        if (stroke.page !== page) continue;
        if (stroke.points.some((p) => pointInPoly(p, lasso.points))) selection.add(stroke.id);
      }
      lasso = null;
      redraw(sheetByKey(page));
      document.dispatchEvent(new CustomEvent("ink-selection", { detail: { count: selection.size } }));
      return;
    }
    if (!draft || draft.eraser) {
      if (eraserBatch && eraserBatch.length) pushHistory({ type: "delete", strokes: eraserBatch });
      eraserBatch = null;
      draft = null;
      return;
    }
    const tap = draft.tap;
    delete draft.tap;
    if (tap && performance.now() - tap.t < 350 && draft.points.every((p) => dist(p, draft.points[0]) < 2.5)) {
      // A quick tap on a link hint opens it instead of leaving a dot.
      const page = draft.page;
      draft = null;
      redraw(sheetByKey(page));
      document.dispatchEvent(new CustomEvent("ink-link-tap", { detail: tap }));
      return;
    }
    if (draft.points.length) {
      finishHighlight(draft);
      delete draft.anchor;
      delete draft.axis;
      delete draft.baseSize;
      delete draft.rows;
      const stroke = draft;
      strokes.push(stroke);
      pushHistory({ type: "add", stroke });
      scheduleSave();
    }
    const page = draft.page;
    draft = null;
    redraw(sheetByKey(page));
  }

  function undo() {
    const entry = undoStack.pop();
    if (!entry) return;
    redoStack.push(entry);
    apply(entry, true);
  }

  function redo() {
    const entry = redoStack.pop();
    if (!entry) return;
    undoStack.push(entry);
    apply(entry, false);
  }

  function apply(entry, reverse) {
    if (entry.type === "add") {
      if (reverse) {
        const index = strokes.findIndex((s) => s.id === entry.stroke.id);
        if (index >= 0) strokes.splice(index, 1);
      } else strokes.push(entry.stroke);
    } else if (entry.type === "delete") {
      if (reverse) strokes.push(...entry.strokes);
      else {
        for (const stroke of entry.strokes) {
          const index = strokes.findIndex((s) => s.id === stroke.id);
          if (index >= 0) strokes.splice(index, 1);
        }
      }
    } else if (entry.type === "move") {
      const source = reverse ? entry.before : entry.after;
      for (const item of source) {
        const stroke = strokes.find((s) => s.id === item.id);
        if (stroke) stroke.points = item.points.map((p) => ({ ...p }));
      }
    } else if (entry.type === "clear") {
      if (reverse) strokes.push(...entry.strokes);
      else {
        for (let i = strokes.length - 1; i >= 0; i--) {
          if (strokes[i].page === entry.page) strokes.splice(i, 1);
        }
      }
    }
    scheduleSave();
    redrawAll();
  }

  function clearPage(page) {
    const removed = strokes.filter((s) => s.page === page).map((s) => ({ ...s, points: s.points.map((p) => ({ ...p })) }));
    if (!removed.length) return;
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (strokes[i].page === page) strokes.splice(i, 1);
    }
    selection.clear();
    pushHistory({ type: "clear", page, strokes: removed });
    scheduleSave();
    redraw(sheetByKey(page));
  }

  function deleteSelection() {
    const removed = strokes.filter((s) => selection.has(s.id)).map((s) => ({ ...s, points: s.points.map((p) => ({ ...p })) }));
    if (!removed.length) return;
    for (let i = strokes.length - 1; i >= 0; i--) {
      if (selection.has(strokes[i].id)) strokes.splice(i, 1);
    }
    selection.clear();
    pushHistory({ type: "delete", strokes: removed });
    scheduleSave();
    redrawAll();
    document.dispatchEvent(new CustomEvent("ink-selection", { detail: { count: 0 } }));
  }

  function bind(world) {
    world.addEventListener("pointerdown", onDown, true);
    world.addEventListener("pointermove", onMove, true);
    world.addEventListener("pointerup", onUp, true);
    world.addEventListener("pointercancel", onUp, true);
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
    selectionCount() { return selection.size; },
    toJSON() {
      return strokes.map((s) => ({ ...s, points: s.points.map((p) => ({ x: p.x, y: p.y, p: p.p })) }));
    },
    fromJSON(data) {
      strokes.splice(0, strokes.length, ...(data || []));
      selection.clear();
      undoStack.length = 0;
      redoStack.length = 0;
      scheduleSave();
      redrawAll();
    },
    strokesFor(page) { return strokes.filter((s) => s.page === page); },
  };
}
