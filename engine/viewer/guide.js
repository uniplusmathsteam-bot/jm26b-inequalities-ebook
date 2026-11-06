import { BOOK_DIR, GUIDE_BY_ID } from "../book.js";

/**
 * Solution guides: the question's figure animated step by step, following the
 * teacher's working (book.json "guides"). The film button in the answer's
 * control strip opens the video in a dialog. tools/render_media.py renders it.
 * The controls sit under the video, not over it, so a paused or finished frame
 * shows the whole figure.
 */

const ICON = `<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="4" width="16" height="12" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.2 7.3v5.4l4.6-2.7z" fill="currentColor"/></svg>`;

export function guideButton(id) {
  return `<button type="button" data-act="guide" data-q="${id}" title="Play the solution guide">${ICON}</button>`;
}

let modal = null;
let trigger = null;
let frame = 0;

const $ = (sel) => modal.querySelector(sel);

function clock(s) {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

function showTime() {
  const v = $("video");
  const d = v.duration || 0;
  $(".gd-seek").value = d ? String(Math.round((v.currentTime / d) * 1000)) : "0";
  $(".gd-time").textContent = `${clock(v.currentTime)} / ${clock(d)}`;
}

function tick() {
  showTime();
  frame = $("video").paused ? 0 : requestAnimationFrame(tick);
}

function showState() {
  const v = $("video");
  const btn = $('[data-gd="play"]');
  const playing = !v.paused && !v.ended;
  btn.textContent = playing ? "❚❚" : v.ended ? "↻" : "▶";
  btn.title = playing ? "Pause (space)" : v.ended ? "Play again" : "Play (space)";
  btn.setAttribute("aria-label", btn.title);
  cancelAnimationFrame(frame);
  if (playing) frame = requestAnimationFrame(tick);
  showTime();
}

function toggle() {
  const v = $("video");
  if (v.paused || v.ended) v.play().catch(() => {});
  else v.pause();
}

function replay() {
  const v = $("video");
  v.currentTime = 0;
  v.play().catch(() => {});
}

function seek(by) {
  const v = $("video");
  v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + by));
  showTime();
}

function build() {
  modal = document.createElement("div");
  modal.className = "gd-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="gd-card" role="dialog" aria-modal="true" aria-labelledby="gd-title">
      <header>
        <strong id="gd-title"></strong>
        <button type="button" data-gd="replay" title="Play from the start">Replay ↻</button>
        <button type="button" data-gd="close" title="Close (Esc)">Close ✕</button>
      </header>
      <video playsinline preload="auto" disablepictureinpicture></video>
      <div class="gd-bar">
        <button type="button" data-gd="play">▶</button>
        <input class="gd-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="Position in the guide">
        <span class="gd-time">0:00 / 0:00</span>
      </div>
    </div>`;
  document.body.append(modal);
  const v = $("video");
  v.setAttribute("playsinline", "");
  v.addEventListener("loadedmetadata", () => {
    if (v.videoWidth && v.videoHeight) modal.firstElementChild.style.setProperty("--ar", String(v.videoWidth / v.videoHeight));
    showTime();
  });
  for (const type of ["play", "pause", "ended", "seeked"]) v.addEventListener(type, showState);
  $(".gd-seek").addEventListener("input", (event) => {
    if (v.duration) v.currentTime = (Number(event.target.value) / 1000) * v.duration;
    $(".gd-time").textContent = `${clock(v.currentTime)} / ${clock(v.duration)}`;
  });
  modal.addEventListener("click", (event) => {
    const act = event.target.closest("[data-gd]")?.dataset.gd;
    if (act === "close" || event.target === modal) closeGuide();
    else if (act === "replay") replay();
    else if (act === "play" || event.target === v) toggle();
  });
  // The reader pans, zooms and inks on these; the dialog keeps them to itself.
  for (const type of ["pointerdown", "pointermove", "pointerup", "wheel", "touchstart", "touchmove"]) {
    modal.addEventListener(type, (event) => event.stopPropagation(), { passive: true });
  }
}

function onKey(event) {
  if (event.key === "Tab") return;
  event.stopImmediatePropagation();
  const key = event.key.toLowerCase();
  if (key === "escape") {
    event.preventDefault();
    closeGuide();
  } else if ((key === " " || key === "k") && !event.target.closest?.("button")) {
    event.preventDefault();
    toggle();
  } else if (key === "arrowleft" || key === "arrowright") {
    event.preventDefault();
    seek(key === "arrowright" ? 5 : -5);
  }
}

/** Opens the guide for question `id`; `label` is how the question is named in the title ("Q5"). */
export function openGuide(id, label) {
  const guide = GUIDE_BY_ID[id];
  if (!guide) return;
  if (!modal) build();
  trigger = document.activeElement;
  $("#gd-title").textContent = `${label}: solution guide`;
  const v = $("video");
  v.setAttribute("aria-label", `Animated solution guide for ${label}`);
  if (v.dataset.src !== guide.src) {
    v.dataset.src = guide.src;
    v.poster = BOOK_DIR + guide.poster;
    v.src = BOOK_DIR + guide.src;
  } else {
    v.currentTime = 0;
  }
  modal.hidden = false;
  showState();
  window.addEventListener("keydown", onKey, true);
  $('[data-gd="close"]').focus({ preventScroll: true });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
}

function closeGuide() {
  if (!modal || modal.hidden) return;
  $("video").pause();
  cancelAnimationFrame(frame);
  modal.hidden = true;
  window.removeEventListener("keydown", onKey, true);
  trigger?.focus?.({ preventScroll: true });
  trigger = null;
}
