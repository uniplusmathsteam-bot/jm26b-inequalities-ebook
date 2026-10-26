"""Make a question-paper PDF from an answer PDF, for chapters where the teacher sends only the ANS.

Usage:
    python tools/make_que.py <ANS.pdf> <QUE out.pdf> [--red-text list|cover|black] [--stamp WORD]

Removes, without painting anything over the page:
- the teacher's answer boxes (pure-red stroked frames at least 28 x 16 pt; the
  notes' own frames are a duller red and stay) with all text, line art and
  images inside them;
- the "Answer" stamp (or --stamp WORD) and its frame;
- the "*" that marks the correct MC option.

Images that only overlap a box (question figures) are kept whole.

Pure-red text outside the boxes is handled by --red-text:
  list   (default) print it for checking;
  cover  remove it (teacher working written outside a box);
  black  recolour it black (a correct MC option printed in red).

Check the result against the ANS before extracting pages: every figure must
still be there, and no red working may remain.
"""

import re
import sys
from collections import Counter

import fitz


def pure_red(rgb):
    return bool(rgb) and len(rgb) >= 3 and rgb[0] > 0.9 and rgb[1] < 0.08 and rgb[2] < 0.08


def span_rgb(span):
    c = span["color"]
    return ((c >> 16 & 255) / 255, (c >> 8 & 255) / 255, (c & 255) / 255)


def inside(rect, boxes, share=0.6):
    area = rect.get_area()
    return area > 0 and any((rect & b).get_area() >= share * area for b in boxes)


def answer_boxes(page, stamp):
    """Areas to clear, and the frames drawn around them as (rect, stroke width)."""
    drawings = page.get_drawings()
    frames = [(fitz.Rect(d["rect"]), d.get("width") or 1) for d in drawings
              if pure_red(d.get("color")) and d["rect"].width >= 28 and d["rect"].height >= 16]
    boxes = [r + (-1.5, -1.5, 1.5, 1.5) for r, _ in frames]
    for w in page.get_text("words"):
        if w[4] == stamp:
            word = fitz.Rect(w[:4])
            around = [(fitz.Rect(d["rect"]), d.get("width") or 1) for d in drawings
                      if fitz.Rect(d["rect"]).contains(word) and 60 < d["rect"].width < 200 and 20 < d["rect"].height < 70]
            frames += around[:1]
            boxes.append((around[0][0] if around else word + (-14, -10, 14, 10)) + (-2, -2, 2, 2))
    return boxes, frames


def recolour_red_text(doc, page):
    """Turn pure-red fill colours (text) black in the page's content stream."""
    page.clean_contents()
    xref = page.get_contents()[0]
    stream = doc.xref_stream(xref).decode("latin-1")

    def black(match):
        r, g, b = (float(v) for v in match.group(1, 2, 3))
        return f"0 0 0 {match.group(4)}" if pure_red((r, g, b)) else match.group(0)

    stream = re.sub(r"([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(rg|sc|scn)\b", black, stream)
    doc.update_stream(xref, stream.encode("latin-1"))


def blank(src, dest, red_text="list", stamp="Answer"):
    doc = fitz.open(src)
    report = []
    uses = Counter(img[0] for page in doc for img in page.get_images(full=True))
    for page in doc:
        boxes, frames = answer_boxes(page, stamp)
        text_cuts, red_outside = [], []
        for block in page.get_text("rawdict")["blocks"]:
            for line in block.get("lines", []):
                # The MC marker "*" may sit in its own span, so look across the whole line.
                chars = [c for span in line["spans"] for c in span["chars"]]
                for n, c in enumerate(chars):
                    nxt = "".join(x["c"] for x in chars[n + 1:n + 4]).lstrip()
                    if c["c"] == "*" and nxt[:1].isalpha() or c["c"] == "*" and nxt[:1] == "(":
                        text_cuts.append(fitz.Rect(c["bbox"]))
                for span in line["spans"]:
                    word = "".join(c["c"] for c in span["chars"]).strip()
                    if not word:
                        continue
                    box = fitz.Rect(span["bbox"])
                    if inside(box, boxes):
                        text_cuts.append(box)
                    elif pure_red(span_rgb(span)):
                        red_outside.append((box, word))
        if red_text == "cover":
            text_cuts += [b for b, _ in red_outside]
        elif red_text == "list":
            report += [f"  page {page.number + 1}: red text outside a box at {[round(v) for v in b]}: {w[:60]!r}" for b, w in red_outside]
        # Text first (only the cut characters), then line art fully inside a box, then images mostly inside one.
        for r in text_cuts:
            page.add_redact_annot(r, fill=False)
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE, text=fitz.PDF_REDACT_TEXT_REMOVE)
        # One box at a time: adjoining boxes applied together leave one frame behind.
        for r in boxes:
            page.add_redact_annot(r, fill=False)
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED, text=fitz.PDF_REDACT_TEXT_NONE)
        # Teacher working pasted as an image: delete the image itself so a figure beneath it shows again.
        # Pixel blanking is the fallback for inline or shared images, and it also clears any figure underneath.
        placed = page.get_image_info(xrefs=True)
        teacher = {i["xref"] for i in placed if inside(fitz.Rect(i["bbox"]), boxes, 0.7)}
        pixel_cuts = []
        for xref in teacher:
            spots = [fitz.Rect(i["bbox"]) for i in placed if i["xref"] == xref]
            if xref and uses[xref] == 1 and all(inside(r, boxes, 0.7) for r in spots):
                page.delete_image(xref)
            else:
                pixel_cuts += [r for r in spots if inside(r, boxes, 0.7)]
        for r in pixel_cuts:
            page.add_redact_annot(r + (-1, -1, 1, 1), fill=False)
        if pixel_cuts:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS, graphics=fitz.PDF_REDACT_LINE_ART_NONE, text=fitz.PDF_REDACT_TEXT_NONE)
        # Faint edges survive in overlapping transparency layers; a white line exactly over each frame hides them
        # without eating into figures the frame crossed.
        for r, width in frames:
            page.draw_rect(r, color=(1, 1, 1), width=width + 0.5, overlay=True)
        if red_text == "black" and red_outside:
            recolour_red_text(doc, page)
        report.append(f"page {page.number + 1}: {len(boxes)} boxes, {len(text_cuts)} text cuts, {len(teacher)} images inside boxes, {len(red_outside)} red spans outside")
    doc.save(dest, garbage=4, deflate=True)
    doc.close()
    return report


def main():
    argv = sys.argv[1:]
    opts = {"--red-text": "list", "--stamp": "Answer"}
    for key in opts:
        if key in argv:
            i = argv.index(key)
            opts[key] = argv[i + 1]
            del argv[i:i + 2]
    if len(argv) != 2 or opts["--red-text"] not in ("list", "cover", "black"):
        sys.exit(__doc__)
    for line in blank(argv[0], argv[1], opts["--red-text"], opts["--stamp"]):
        print(line)
    print("->", argv[1])


if __name__ == "__main__":
    main()
