import { SOLUTION_BY_ID } from "../data/solutions.js";
import { mountGraphic } from "../widgets/widgets.js";
import { createInk } from "../ink/ink.js";
import { exportAnnotations, exportPdf } from "../export/export.js";
import { buildOverlay, layoutAnswers, paint, totalSteps } from "./answers.js";
import { renderLinks, clearLinks } from "./links.js";

const PAGE_W = 595.32;
const PAGE_H = 841.92;
const GAP = 22;
const UI_KEY = "jm26b-ui";
const UI_SELECTOR = "button, input, select, textarea, a, label, .ctl, .drawer";

const world = document.getElementById("world");
const viewport = document.getElementById("viewport");
const toolbar = document.getElementById("toolbar");
const ink = createInk();

const state = {
  scale: 1,
  tx: 12,
  ty: 12,
  reveal: {},
  openLinks: {},
  hints: true,
  layout: null,
  currentKey: "p1",
  worldH: PAGE_H,
};

let lastPointer = "mouse";
let suppressClickUntil = 0;

const pad = (n) => String(n).padStart(2, "0");

/* ---------- persistence ---------- */

function loadUI() {
  try {
    const saved = JSON.parse(localStorage.getItem(UI_KEY) || "{}");
    state.reveal = saved.reveal || {};
    if (saved.tool) ink.setTool(saved.tool);
    if (saved.dock) toolbar.className = `toolbar dock-${saved.dock}`;
    if (saved.hints === false) state.hints = false;
  } catch { /* keep defaults */ }
  document.body.classList.toggle("no-hints", !state.hints);
  if (!ink.getTool().type || ink.getTool().type === "hand") ink.setTool({ type: "read" });
}

function saveUI() {
  const dock = [...toolbar.classList].find((c) => c.startsWith("dock-"))?.slice(5) || "right";
  localStorage.setItem(UI_KEY, JSON.stringify({ reveal: state.reveal, tool: ink.getTool(), dock, hints: state.hints }));
}

/* ---------- questions and reveal ---------- */

function questions() {
  const list = [];
  for (const page of state.layout.pages) {
    for (const q of page.questions) {
      if (SOLUTION_BY_ID[q.id]) list.push({ ...q, page: page.page });
    }
  }
  return list;
}

function revealed(id) {
  return Math.max(0, Math.min(totalSteps(id), state.reveal[id] ?? 0));
}

function setReveal(id, n) {
  state.reveal[id] = Math.max(0, Math.min(totalSteps(id), n));
  paint(world, id, state.reveal[id]);
  saveUI();
  syncLinks(id);
}

function paintAll() {
  for (const q of questions()) paint(world, q.id, revealed(q.id));
  syncAllLinks();
}

function pageOf(id) {
  for (const page of state.layout.pages) {
    const q = page.questions.find((item) => item.id === id);
    if (q) return { page, q };
  }
  return null;
}

function openSet(id) {
  if (!state.openLinks[id]) state.openLinks[id] = new Set();
  return state.openLinks[id];
}

function syncLinks(id) {
  if (!SOLUTION_BY_ID[id]?.links) return;
  const found = pageOf(id);
  const sheet = world.querySelector(`.qa[data-q="${id}"]`)?.closest(".sheet");
  if (!found || !sheet) return;
  const pos = renderLinks(sheet, id, found.page, found.q, openSet(id));
  const ctl = sheet.querySelector(`.qa[data-q="${id}"] .ctl`);
  if (!pos || !ctl) return;
  const qaLeft = parseFloat(ctl.closest(".qa").style.left) || 0;
  const limit = sheet.offsetWidth - qaLeft - ctl.offsetWidth - 6;
  ctl.style.left = `${Math.max(parseFloat(ctl.dataset.home) || 0, Math.min(pos.ctlLeft, limit))}px`;
}

function syncAllLinks() {
  for (const q of questions()) syncLinks(q.id);
}

function toggleLink(id, key) {
  const open = openSet(id);
  if (open.has(key)) open.delete(key);
  else open.add(key);
  syncLinks(id);
}

function setHints(on) {
  state.hints = on;
  document.body.classList.toggle("no-hints", !on);
  const btn = document.getElementById("hints-toggle");
  if (btn) btn.textContent = on ? "Hide link hints" : "Show link hints";
  saveUI();
}

function act(name, id) {
  if (name === "next") setReveal(id, revealed(id) + 1);
  else if (name === "back") setReveal(id, revealed(id) - 1);
  else if (name === "all") setReveal(id, totalSteps(id));
  else if (name === "reset") setReveal(id, 0);
  else if (name === "graphic") openGraphic(id);
}

/* ---------- sheets ---------- */

function sheets() {
  return [...world.querySelectorAll(".sheet")];
}

function makeCanvases() {
  const hl = document.createElement("canvas");
  hl.dataset.layer = "hl";
  hl.className = "hl";
  const pen = document.createElement("canvas");
  pen.dataset.layer = "ink";
  pen.className = "ink";
  return [hl, pen];
}

function buildPages() {
  world.replaceChildren();
  for (const page of state.layout.pages) {
    const sheet = document.createElement("article");
    sheet.className = "sheet";
    sheet.dataset.key = `p${page.page}`;
    sheet.dataset.page = String(page.page);
    sheet.style.width = `${PAGE_W}px`;
    sheet.style.height = `${PAGE_H}px`;
    const img = document.createElement("img");
    img.className = "bg";
    img.alt = "";
    img.draggable = false;
    img.src = `assets/pages/p${pad(page.page)}.jpg`;
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    buildOverlay(page, overlay);
    ink.setText(sheet.dataset.key, page.text);
    sheet.append(img, overlay, ...makeCanvases());
    world.append(sheet);
  }
}

function makeContinuation(pageNo) {
  const anchor = world.querySelector(`.sheet[data-key="p${pageNo}"]`);
  const sheet = document.createElement("article");
  sheet.className = "sheet continuation";
  sheet.dataset.key = `c${pageNo}-1`;
  sheet.dataset.page = String(pageNo);
  sheet.style.width = `${PAGE_W}px`;
  sheet.style.height = `${PAGE_H}px`;
  const band = document.createElement("div");
  band.className = "band";
  band.style.backgroundImage = `url("assets/pages/p${pad(pageNo)}.jpg")`;
  const foot = document.createElement("div");
  foot.className = "cont-foot";
  foot.textContent = `Answers continued from page ${pageNo}`;
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  sheet.append(band, foot, overlay, ...makeCanvases());
  anchor.after(sheet);
  return sheet;
}

function layout() {
  layoutAnswers(world, state.layout, makeContinuation);
  paintAll();
  layoutWorld();
  buildThumbs();
  applyTransform();
  ink.redrawAll();
}

function layoutWorld() {
  let y = 0;
  for (const sheet of sheets()) {
    sheet.style.top = `${y}px`;
    y += sheet.offsetHeight + GAP;
  }
  state.worldH = Math.max(PAGE_H, y - GAP);
  world.style.width = `${PAGE_W}px`;
  world.style.height = `${state.worldH}px`;
}

/* ---------- view transform ---------- */

function clampView() {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  const ww = PAGE_W * state.scale;
  const wh = state.worldH * state.scale;
  const mx = 40;
  const loX = Math.min(mx, vw - ww - mx);
  const hiX = Math.max(mx, vw - ww - mx);
  state.tx = Math.min(hiX, Math.max(loX, state.tx));
  const loY = Math.min(16, vh - wh - 60);
  state.ty = Math.min(16 + vh * 0.25, Math.max(loY, state.ty));
}

function applyTransform() {
  clampView();
  world.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
  updateIndicator();
  if (applyTransform.timer) return;
  applyTransform.timer = setTimeout(() => {
    applyTransform.timer = 0;
    ink.refresh();
  }, 80);
}

function reservedRight() {
  return toolbar.classList.contains("dock-right") ? 84 : 16;
}

function reservedLeft() {
  return toolbar.classList.contains("dock-left") ? 84 : 16;
}

function placeChrome() {
  const h = document.querySelector(".topbar").offsetHeight;
  document.documentElement.style.setProperty("--top", `${h}px`);
}

function fitWidth() {
  placeChrome();
  const keyTop = currentSheet();
  const avail = viewport.clientWidth - reservedLeft() - reservedRight();
  const before = keyTop ? (parseFloat(keyTop.style.top) || 0) : 0;
  const offset = keyTop ? (-state.ty / state.scale) - before : 0;
  state.scale = Math.min(1.8, Math.max(0.3, avail / PAGE_W));
  state.tx = reservedLeft() + (avail - PAGE_W * state.scale) / 2;
  state.ty = 16 - (before + Math.max(0, offset)) * state.scale;
  applyTransform();
}

function zoomAt(cx, cy, factor) {
  const next = Math.min(4, Math.max(0.3, state.scale * factor));
  const k = next / state.scale;
  state.tx = cx - (cx - state.tx) * k;
  state.ty = cy - (cy - state.ty) * k;
  state.scale = next;
  applyTransform();
}

function updateIndicator() {
  const mid = (viewport.clientHeight / 2 - state.ty) / state.scale;
  let best = null;
  let bestDist = Infinity;
  for (const sheet of sheets()) {
    const top = parseFloat(sheet.style.top) || 0;
    const dist = Math.abs(top + sheet.offsetHeight / 2 - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = sheet;
    }
  }
  if (!best) return;
  const label = document.getElementById("page-label");
  label.textContent = best.classList.contains("continuation") ? `Page ${best.dataset.page}+` : `Page ${best.dataset.page} / 16`;
  if (state.currentKey !== best.dataset.key) {
    state.currentKey = best.dataset.key;
    document.querySelectorAll(".thumb").forEach((t) => t.classList.toggle("on", t.dataset.key === state.currentKey));
  }
}

function currentSheet() {
  return sheets().find((s) => s.dataset.key === state.currentKey) || sheets()[0];
}

function scrollToY(y) {
  stopInertia();
  state.ty = 16 - y * state.scale;
  applyTransform();
}

function scrollToSheet(sheet) {
  scrollToY(parseFloat(sheet.style.top) || 0);
}

function scrollToQuestion(id) {
  const node = world.querySelector(`.qa[data-q="${id}"]`);
  if (!node) return;
  const sheet = node.closest(".sheet");
  const y = (parseFloat(sheet.style.top) || 0) + (parseFloat(node.style.top) || 0) - 110;
  scrollToY(Math.max(0, y));
  node.classList.add("flash");
  setTimeout(() => node.classList.remove("flash"), 1200);
}

function stepPage(dir) {
  const list = sheets();
  const index = Math.min(list.length - 1, Math.max(0, list.indexOf(currentSheet()) + dir));
  scrollToSheet(list[index]);
}

/* ---------- inertia ---------- */

let inertia = 0;

function stopInertia() {
  cancelAnimationFrame(inertia);
  inertia = 0;
}

function startInertia(vx, vy) {
  stopInertia();
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(40, now - last);
    last = now;
    state.tx += vx * dt;
    state.ty += vy * dt;
    const decay = Math.pow(0.994, dt);
    vx *= decay;
    vy *= decay;
    applyTransform();
    if (Math.hypot(vx, vy) > 0.02) inertia = requestAnimationFrame(tick);
    else inertia = 0;
  };
  inertia = requestAnimationFrame(tick);
}

/* ---------- tools and modes ---------- */

const MODE_TEXT = {
  read: "Read mode: drag or scroll to move, tap a box to reveal the next step",
  pen: "Pen: draw and hold to snap a straight line, circle or box; one finger scrolls",
  highlighter: "Highlighter: swipe across text and it snaps onto the line; hold to straighten",
  eraser: "Eraser: touch a stroke to remove it",
  lasso: "Select: circle strokes, then drag them or press Delete",
  laser: "Laser pointer: point with the pen or mouse; the trail fades and is never saved",
};

function toast(text) {
  const node = document.getElementById("toast");
  node.textContent = text;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2200);
}

function setTool(type, quiet = false) {
  ink.setTool({ type });
  toolbar.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("on", b.dataset.tool === type));
  toolbar.querySelectorAll(".opts").forEach((o) => {
    o.hidden = o.dataset.for !== type;
  });
  if (type === "pen" || type === "highlighter") {
    const color = ink.getTool()[`${type}Color`];
    if (color) ink.setTool({ color });
    const opts = toolbar.querySelector(`.opts[data-for="${type}"]`);
    const on = opts.querySelector(`[data-color="${ink.getTool().color}"]`) || opts.querySelector("[data-color]");
    opts.querySelectorAll("[data-color]").forEach((b) => b.classList.toggle("on", b === on));
    ink.setTool({ color: on.dataset.color });
  }
  document.body.dataset.mode = type;
  if (!quiet) toast(MODE_TEXT[type] || "");
  saveUI();
}

function syncSnapToggles() {
  toolbar.querySelectorAll("[data-snap]").forEach((b) => {
    const on = ink.getTool()[b.dataset.snap] !== false;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  });
}

function bindToolbar() {
  toolbar.addEventListener("click", (event) => {
    const tool = event.target.closest("[data-tool]");
    if (tool) {
      setTool(ink.getTool().type === tool.dataset.tool && tool.dataset.tool !== "read" ? "read" : tool.dataset.tool);
      return;
    }
    const color = event.target.closest("[data-color]");
    if (color) {
      const type = ink.getTool().type;
      ink.setTool({ color: color.dataset.color, [`${type}Color`]: color.dataset.color });
      color.parentElement.querySelectorAll("[data-color]").forEach((b) => b.classList.toggle("on", b === color));
      saveUI();
      return;
    }
    const snap = event.target.closest("[data-snap]");
    if (snap) {
      const key = snap.dataset.snap;
      ink.setTool({ [key]: ink.getTool()[key] === false });
      syncSnapToggles();
      saveUI();
      toast(`${snap.textContent.trim()}: ${ink.getTool()[key] ? "on" : "off"}`);
      return;
    }
    const size = event.target.closest("[data-size]");
    if (size) {
      ink.setTool({ size: Number(size.dataset.size) });
      toolbar.querySelectorAll("[data-size]").forEach((b) => b.classList.toggle("on", b === size));
      saveUI();
      return;
    }
    if (event.target.closest("#dock")) {
      const order = ["right", "bottom", "left"];
      const now = [...toolbar.classList].find((c) => c.startsWith("dock-"))?.slice(5) || "right";
      toolbar.className = `toolbar dock-${order[(order.indexOf(now) + 1) % 3]}`;
      saveUI();
      fitWidth();
    }
  });
  document.getElementById("undo").onclick = () => ink.undo();
  document.getElementById("redo").onclick = () => ink.redo();
  document.getElementById("delete-selection").onclick = () => ink.deleteSelection();
  const clear = document.getElementById("clear-page");
  clear.onclick = () => {
    if (clear.dataset.armed === "1") {
      ink.clearPage(currentSheet().dataset.key);
      clear.dataset.armed = "";
      clear.classList.remove("armed");
    } else {
      clear.dataset.armed = "1";
      clear.classList.add("armed");
      toast("Tap Clear again to erase all ink on this page");
      setTimeout(() => {
        clear.dataset.armed = "";
        clear.classList.remove("armed");
      }, 2200);
    }
  };
  document.addEventListener("ink-selection", (event) => {
    document.getElementById("delete-selection").hidden = event.detail.count === 0;
  });
  document.addEventListener("ink-snap", (event) => {
    const { shape, axis, onText } = event.detail;
    const line = { h: "Horizontal line", v: "Vertical line", d: "45° line" }[axis] || "Straight line";
    const name = shape === "line" ? line : shape === "rect" ? "Rectangle" : "Ellipse";
    toast(onText ? `${name}, snapped to the text` : shape === "line" ? `${name}: keep holding and move to adjust` : name);
  });
  syncSnapToggles();
  const size = ink.getTool().size;
  toolbar.querySelectorAll("[data-size]").forEach((b) => b.classList.toggle("on", Number(b.dataset.size) === size));
}

/* ---------- viewport gestures ---------- */

function bindViewport() {
  const touches = new Map();
  let drag = null;
  let pinch = null;
  let penId = null;
  let penUntil = 0;

  // Palm rejection: while the Pencil is on the glass (and just after), touches
  // neither scroll the page nor count as taps.
  const palm = (event) => event.pointerType === "touch" && (penId !== null || performance.now() < penUntil);

  window.addEventListener("pointerdown", (event) => {
    if (palm(event)) {
      suppressClickUntil = performance.now() + 450;
      return;
    }
    lastPointer = event.pointerType;
    if (event.pointerType === "pen") {
      penId = event.pointerId;
      if (drag && touches.has(drag.id)) {
        drag = null;
        document.body.classList.remove("dragging");
      }
      touches.clear();
      pinch = null;
    }
  }, true);

  const penUp = (event) => {
    if (event.pointerId !== penId) return;
    penId = null;
    penUntil = performance.now() + 500;
  };
  window.addEventListener("pointerup", penUp, true);
  window.addEventListener("pointercancel", penUp, true);

  // Safari ignores user-scalable=no; stop it zooming the whole app.
  for (const type of ["gesturestart", "gesturechange"]) {
    document.addEventListener(type, (event) => event.preventDefault(), { passive: false });
  }

  const startDrag = (event) => {
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, tx: state.tx, ty: state.ty, moved: false, samples: [] };
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(UI_SELECTOR)) return;
    if (palm(event)) return;
    stopInertia();
    if (event.pointerType === "touch") {
      touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touches.size === 1) startDrag(event);
      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        drag = null;
      }
      return;
    }
    if (ink.getTool().type === "read" || event.button === 1) {
      if (event.button === 1) event.preventDefault();
      startDrag(event);
      document.body.classList.add("dragging");
    }
  });

  window.addEventListener("pointermove", (event) => {
    if (touches.has(event.pointerId)) touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinch && touches.size >= 2) {
      const [a, b] = [...touches.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      state.tx += mx - pinch.x;
      state.ty += my - pinch.y;
      const rect = viewport.getBoundingClientRect();
      zoomAt(mx - rect.left, my - rect.top, dist / pinch.dist);
      pinch = { dist, x: mx, y: my };
      suppressClickUntil = performance.now() + 400;
      return;
    }
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 6) drag.moved = true;
    if (!drag.moved) return;
    state.tx = drag.tx + dx;
    state.ty = drag.ty + dy;
    const now = performance.now();
    drag.samples.push({ x: event.clientX, y: event.clientY, t: now });
    while (drag.samples.length > 2 && now - drag.samples[0].t > 90) drag.samples.shift();
    applyTransform();
  });

  const end = (event) => {
    touches.delete(event.pointerId);
    if (touches.size < 2) pinch = null;
    if (!drag || drag.id !== event.pointerId) return;
    document.body.classList.remove("dragging");
    if (drag.moved) {
      suppressClickUntil = performance.now() + 350;
      const s = drag.samples;
      if (s.length >= 2) {
        const a = s[0];
        const b = s[s.length - 1];
        const dt = Math.max(16, b.t - a.t);
        const vx = (b.x - a.x) / dt;
        const vy = (b.y - a.y) / dt;
        if (performance.now() - b.t < 80 && Math.hypot(vx, vy) > 0.25) startInertia(vx, vy);
      }
    }
    drag = null;
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);

  window.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil && !event.target.closest(".toolbar, .topbar, .drawer")) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);

  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    stopInertia();
    if (event.ctrlKey || event.metaKey) {
      const rect = viewport.getBoundingClientRect();
      zoomAt(event.clientX - rect.left, event.clientY - rect.top, Math.exp(-event.deltaY * 0.004));
      return;
    }
    const unit = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? viewport.clientHeight : 1;
    const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
    const dy = event.shiftKey && !event.deltaX ? 0 : event.deltaY;
    state.tx -= dx * unit;
    state.ty -= dy * unit;
    applyTransform();
  }, { passive: false });

  world.addEventListener("click", (event) => {
    const button = event.target.closest("[data-act]");
    if (button) {
      event.stopPropagation();
      act(button.dataset.act, button.dataset.q);
      return;
    }
    const tapOK = ink.getTool().type === "read" || lastPointer === "touch";
    if (!tapOK) return;
    const hint = event.target.closest("[data-link]");
    if (hint) {
      toggleLink(hint.dataset.q, hint.dataset.link);
      return;
    }
    const square = event.target.closest(".mcl");
    if (square) {
      act("all", square.dataset.q);
      return;
    }
    const qa = event.target.closest(".abox") && event.target.closest(".qa");
    if (!qa) return;
    const id = qa.dataset.q;
    const hidden = event.target.closest(".ln.hid");
    if (hidden) setReveal(id, Number(hidden.dataset.i) + 1);
    else if (revealed(id) < totalSteps(id)) setReveal(id, revealed(id) + 1);
  });
}

/* ---------- chrome ---------- */

function buildThumbs() {
  const bar = document.getElementById("thumbs");
  bar.replaceChildren();
  for (const sheet of sheets()) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb";
    btn.dataset.key = sheet.dataset.key;
    const page = sheet.dataset.page;
    if (sheet.classList.contains("continuation")) {
      btn.textContent = `p.${page} continued`;
      btn.classList.add("cont");
    } else {
      const img = document.createElement("img");
      img.src = `assets/pages/p${pad(page)}.jpg`;
      img.alt = `Page ${page}`;
      const cap = document.createElement("span");
      cap.textContent = page;
      btn.append(img, cap);
    }
    btn.addEventListener("click", () => scrollToSheet(sheet));
    bar.append(btn);
  }
}

function buildJump() {
  const select = document.getElementById("jump");
  for (const item of questions()) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    select.append(option);
  }
  select.addEventListener("change", () => {
    if (select.value) scrollToQuestion(select.value);
    select.value = "";
  });
}

function openGraphic(id) {
  const drawer = document.getElementById("graphic");
  const item = questions().find((q) => q.id === id);
  const label = item ? (/^\d/.test(item.label) ? `Q${item.label}` : item.label) : "";
  document.getElementById("graphic-title").textContent = `${label}: interactive graphic`;
  mountGraphic(id, document.getElementById("graphic-body"));
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeGraphic() {
  const drawer = document.getElementById("graphic");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function bindChrome() {
  document.getElementById("fit").onclick = fitWidth;
  document.getElementById("zoom-in").onclick = () => zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1.15);
  document.getElementById("zoom-out").onclick = () => zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1 / 1.15);
  document.getElementById("show-all").onclick = () => {
    for (const q of questions()) state.reveal[q.id] = totalSteps(q.id);
    paintAll();
    saveUI();
  };
  document.getElementById("hide-all").onclick = () => {
    for (const q of questions()) state.reveal[q.id] = 0;
    paintAll();
    saveUI();
  };
  document.getElementById("thumbs-toggle").onclick = () => {
    document.getElementById("sidebar").classList.toggle("open");
  };
  document.querySelectorAll("[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = questions().find((q) => q.section === btn.dataset.section);
      if (item) scrollToSheet(world.querySelector(`.sheet[data-key="p${item.page}"]`));
    });
  });
  document.getElementById("prev-page").onclick = () => stepPage(-1);
  document.getElementById("next-page").onclick = () => stepPage(1);
  document.getElementById("graphic-close").onclick = closeGraphic;
  const more = document.getElementById("more");
  document.addEventListener("click", (event) => {
    if (more.open && !event.target.closest("#more")) more.open = false;
  });
  document.getElementById("export-pdf").onclick = async () => {
    more.open = false;
    const btn = document.getElementById("export-pdf");
    btn.disabled = true;
    toast("Building the PDF…");
    try {
      await exportPdf(sheets(), ink.toJSON());
    } finally {
      btn.disabled = false;
    }
  };
  document.getElementById("export-json").onclick = () => exportAnnotations(ink.toJSON());
  document.getElementById("import-json").onclick = () => document.getElementById("import-file").click();
  document.getElementById("import-file").onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    ink.fromJSON(JSON.parse(await file.text()));
    event.target.value = "";
  };
  document.addEventListener("ink-link-tap", (event) => toggleLink(event.detail.q, event.detail.link));
  document.getElementById("hints-toggle").onclick = () => {
    more.open = false;
    setHints(!state.hints);
  };
  setHints(state.hints);
  document.getElementById("print").onclick = () => {
    more.open = false;
    window.print();
  };
  window.addEventListener("keydown", (event) => {
    if (event.target.closest("input, select, textarea")) return;
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "z") {
      event.preventDefault();
      if (event.shiftKey) ink.redo();
      else ink.undo();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && key === "y") {
      event.preventDefault();
      ink.redo();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tools = { escape: "read", v: "read", p: "pen", h: "highlighter", e: "eraser", l: "lasso", k: "laser" };
    if (key === "escape" && document.body.classList.contains("drawer-open")) {
      closeGraphic();
      return;
    }
    if (tools[key]) {
      setTool(tools[key]);
      return;
    }
    const step = viewport.clientHeight * 0.85;
    const moves = { arrowdown: [0, -60], arrowup: [0, 60], arrowleft: [60, 0], arrowright: [-60, 0], pagedown: [0, -step], pageup: [0, step], " ": [0, event.shiftKey ? step : -step] };
    if (moves[key]) {
      event.preventDefault();
      state.tx += moves[key][0];
      state.ty += moves[key][1];
      applyTransform();
    } else if (key === "home") scrollToY(0);
    else if (key === "end") scrollToY(state.worldH);
    else if (key === "delete" || key === "backspace") ink.deleteSelection();
  });
  window.addEventListener("resize", fitWidth);
}

/* ---------- start ---------- */

async function main() {
  loadUI();
  state.layout = await fetch("src/data/layout.json").then((r) => r.json());
  placeChrome();
  buildPages();
  buildJump();
  bindToolbar();
  bindViewport();
  bindChrome();
  ink.bind(world);
  setTool(ink.getTool().type || "read", true);
  layout();
  fitWidth();
  await document.fonts.ready;
  layout();
  const openHash = () => {
    const hash = location.hash.slice(1);
    if (!hash) return;
    const sheet = world.querySelector(`.sheet[data-key="${hash}"]`);
    if (sheet) scrollToSheet(sheet);
    else if (SOLUTION_BY_ID[hash]) scrollToQuestion(hash);
  };
  openHash();
  window.addEventListener("hashchange", openHash);
  navigator.storage?.persist?.().catch(() => {});
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

main();
