import { paintStroke } from "../ink/render.js";

const PAGE_W = 595.32;
const PAGE_H = 841.92;

function paintStrokes(ctx, strokes, scaleX, scaleY) {
  for (const stroke of strokes) paintStroke(ctx, stroke, scaleX, scaleY);
  ctx.globalAlpha = 1;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = "";
  let yy = y;
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else line = trial;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

async function rasterSheet(sheet, strokes) {
  const scale = 2;
  const cssH = sheet.offsetHeight || PAGE_H;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_W * scale);
  canvas.height = Math.round(cssH * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const bg = sheet.querySelector("img.bg");
  if (bg && bg.complete && bg.naturalWidth) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  } else if (sheet.classList.contains("continuation")) {
    ctx.fillStyle = "#163a86";
    ctx.font = `${16 * scale}px Georgia, serif`;
    ctx.fillText("Solution, continued", 40 * scale, 46 * scale);
    ctx.fillStyle = "#1aa3c4";
    ctx.fillRect(40 * scale, 58 * scale, 220 * scale, 3 * scale);
  }
  ctx.save();
  ctx.scale(scale, scale);
  const origin = sheet.getBoundingClientRect();
  const k = sheet.offsetWidth / (origin.width || sheet.offsetWidth);
  const local = (el) => {
    const r = el.getBoundingClientRect();
    return { x: (r.left - origin.left) * k, y: (r.top - origin.top) * k, w: r.width * k, h: r.height * k };
  };
  for (const box of sheet.querySelectorAll(".abox")) {
    const lines = [...box.querySelectorAll(".hd, .ln:not(.hid)")];
    if (!lines.some((n) => n.classList.contains("ln"))) continue;
    const b = local(box);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = "#e00000";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    for (const line of lines) {
      const r = local(line);
      const size = Math.max(7, Math.min(12, r.h * 0.62));
      ctx.font = `${size}px 'Times New Roman', Times, serif`;
      ctx.fillStyle = "#111111";
      const text = line.classList.contains("hd") ? line.textContent.trim() : line.dataset.plain || "";
      wrapText(ctx, text, r.x + 3, r.y + r.h * 0.5 + size * 0.35, Math.max(40, b.x + b.w - r.x - 6), size * 1.2);
    }
  }
  for (const square of sheet.querySelectorAll(".mcl.show")) {
    const r = local(square);
    ctx.fillStyle = "#e00000";
    ctx.font = "20px 'Times New Roman', Times, serif";
    ctx.textAlign = "center";
    ctx.fillText(square.textContent, r.x + r.w / 2, r.y + r.h / 2 + 7);
    ctx.textAlign = "left";
  }
  ctx.restore();
  const mine = strokes.filter((s) => s.page === sheet.dataset.key);
  const high = mine.filter((s) => s.tool === "highlighter");
  const pens = mine.filter((s) => s.tool !== "highlighter");
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  paintStrokes(ctx, high, scale, scale);
  ctx.restore();
  paintStrokes(ctx, pens, scale, scale);
  return canvas;
}

function download(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** A tap-to-share bar, because Safari only opens the share sheet straight after a tap. */
function offerShare(file, label) {
  document.querySelector(".share-ready")?.remove();
  const bar = document.createElement("div");
  bar.className = "share-ready";
  const text = document.createElement("span");
  text.textContent = `${label} is ready`;
  const save = document.createElement("button");
  save.type = "button";
  save.textContent = "Save / Share";
  save.onclick = () => {
    bar.remove();
    navigator.share({ files: [file] }).catch(() => {});
  };
  const close = document.createElement("button");
  close.type = "button";
  close.className = "ghost";
  close.textContent = "✕";
  close.onclick = () => bar.remove();
  bar.append(text, save, close);
  document.body.append(bar);
}

/** On iPad, files go to the share sheet (Save to Files, AirDrop, other apps); elsewhere they download. */
async function deliver(bytes, name, type, label) {
  const file = new File([bytes], name, { type });
  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
    } catch (err) {
      if (err.name !== "AbortError") offerShare(file, label);
    }
    return;
  }
  download(file);
}

export async function exportPdf(sheets, strokes) {
  const { PDFDocument } = await import("../../vendor/pdf-lib/pdf-lib.min.js");
  const pdf = await PDFDocument.create();
  for (const sheet of sheets) {
    if (sheet.style.display === "none") sheet.style.display = "";
    const canvas = await rasterSheet(sheet, strokes);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    canvas.width = 0;
    canvas.height = 0;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const image = await pdf.embedJpg(bytes);
    const height = (sheet.offsetHeight || PAGE_H);
    const page = pdf.addPage([PAGE_W, height]);
    page.drawImage(image, { x: 0, y: 0, width: PAGE_W, height });
  }
  const out = await pdf.save();
  await deliver(out, "JM26-B-Inequalities-I-solutions.pdf", "application/pdf", "PDF");
}

export function exportAnnotations(strokes) {
  return deliver(JSON.stringify(strokes, null, 2), "jm26b-annotations.json", "application/json", "Ink file");
}
