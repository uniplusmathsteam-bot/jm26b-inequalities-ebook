import { BOOK, BOOK_DIR } from "../book.js";

/** Landscape 16:9 film plus a control strip, at the notes' width. */
export const FRONT_H = 380;

/**
 * Pages before the printed book, from book.json "frontPages":
 *   { "key", "label", "poster", "slides": ["media/concept/formula-1.mp4", ...] }
 * The sheet key is "front-<key>" and ink is saved under it, so never rename a key once a book is in use.
 */
export const FRONT_PAGES = (BOOK.frontPages || []).map((item) => ({
  ...item,
  sheetKey: `front-${item.key}`,
  src: item.poster ? `${BOOK_DIR}${item.poster}` : "",
  height: item.height || FRONT_H,
}));

/** A concept deck: each Manim clip plays, then the next one starts. */
export function mountFrontPage(item, overlay) {
  const root = document.createElement("div");
  root.className = "concept";
  const video = document.createElement("video");
  video.playsInline = true;
  video.muted = true;
  video.poster = item.src;
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  const bar = document.createElement("div");
  bar.className = "concept-bar";
  const prev = document.createElement("button");
  prev.type = "button";
  prev.textContent = "‹";
  prev.title = "Previous clip";
  const play = document.createElement("button");
  play.type = "button";
  play.className = "concept-play";
  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "›";
  next.title = "Next clip";
  const cap = document.createElement("span");
  bar.append(prev, play, next, cap);
  root.append(video, bar);
  overlay.append(root);

  const slides = item.slides || [];
  let index = 0;
  const label = (text, what) => {
    play.textContent = text;
    play.title = what;
    play.setAttribute("aria-label", what);
  };
  const show = (n, andPlay) => {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, n));
    cap.textContent = `${item.label}  ·  ${index + 1} / ${slides.length}`;
    const src = BOOK_DIR + slides[index];
    if (video.getAttribute("src") !== src) video.src = src;
    else if (andPlay && video.ended) video.currentTime = 0;
    label(andPlay ? "❚❚" : "▶", andPlay ? "Pause" : "Play");
    if (andPlay) video.play().catch(() => label("▶", "Play"));
  };
  prev.addEventListener("click", () => show(index - 1, true));
  next.addEventListener("click", () => show(index + 1, true));
  play.addEventListener("click", () => {
    if (!video.paused && !video.ended) video.pause();
    else show(index, true);
  });
  video.addEventListener("play", () => label("❚❚", "Pause"));
  video.addEventListener("pause", () => label(video.ended ? "↻" : "▶", video.ended ? "Replay" : "Play"));
  video.addEventListener("ended", () => {
    if (index < slides.length - 1) show(index + 1, true);
    else label("↻", "Replay");
  });
  show(0, false);
  return video;
}
