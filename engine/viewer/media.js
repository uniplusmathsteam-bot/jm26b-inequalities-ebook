import { BOOK, BOOK_DIR } from "../book.js";

/**
 * Animations (book.json "media") laid over the printed summary panels they
 * replace. The poster is the last frame, so a panel that is never played still
 * reads like the printed one.
 */
export function addMedia(pageNo, overlay) {
  for (const [n, item] of (BOOK.media || []).entries()) {
    if (item.page !== pageNo) continue;
    const [x0, y0, x1, y1] = item.region;
    const box = document.createElement("div");
    box.className = "media";
    Object.assign(box.style, { left: `${x0}px`, top: `${y0}px`, width: `${x1 - x0}px`, height: `${y1 - y0}px` });
    const video = document.createElement("video");
    Object.assign(video, { muted: true, playsInline: true, preload: "none", poster: BOOK_DIR + item.poster, src: BOOK_DIR + item.src });
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "media-play";
    button.dataset.media = String(n);
    const title = item.title || "Play the animation";
    const label = (text, what) => {
      button.textContent = text;
      button.title = what;
      button.setAttribute("aria-label", what);
    };
    label("▶", title);
    video.addEventListener("play", () => { box.classList.add("playing"); label("❚❚", "Pause the animation"); });
    video.addEventListener("pause", () => {
      box.classList.remove("playing");
      label(video.ended ? "↻" : "▶", video.ended ? "Replay the animation" : "Resume the animation");
    });
    box.append(video, button);
    overlay.append(box);
  }
}

export function toggleMedia(button) {
  const video = button.closest(".media").querySelector("video");
  if (!video.paused && !video.ended) {
    video.pause();
    return;
  }
  if (video.ended) video.currentTime = 0;
  video.play().catch(() => {});
}
