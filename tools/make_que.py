"""Make a question-paper PDF from an answer PDF, for chapters where the teacher sends only the ANS.

Usage:
    python tools/make_que.py <ANS.pdf> <QUE out.pdf> [--cover-red-text] [--stamp WORD]

Covers in white:
- the teacher's answer boxes: pure-red stroked frames at least 28 x 16 pt
  (the notes' own frames are a duller red and stay);
- the "Answer" stamp (or --stamp WORD) with its frame;
- asterisk markers on MC options ("*A", "*(B)").

Pure-red text outside those boxes is listed for checking. Usually it is a
correct MC option printed in red, which must be retyped in black, or working
outside a box; --cover-red-text covers it as well.

Scanned pages keep their image: only the covered pixels are blanked. Always
compare the result with the ANS (extract_pages.py previews).
"""

import sys

import fitz


def pure_red(color):
    if not color or len(color) < 3:
        return False
    r, g, b = color[:3]
    return r > 0.9 and g < 0.08 and b < 0.08


def span_red(span):
    c = span["color"]
    return pure_red(((c >> 16 & 255) / 255, (c >> 8 & 255) / 255, (c & 255) / 255))


def blank(src, dest, cover_red_text=False, stamp="Answer"):
    doc = fitz.open(src)
    total = 0
    for page in doc:
        drawings = page.get_drawings()
        rects = []
        for dr in drawings:
            rect = fitz.Rect(dr["rect"])
            if pure_red(dr.get("color")) and rect.width >= 28 and rect.height >= 16:
                rects.append(rect + (-1.5, -1.5, 1.5, 1.5))
        for w in page.get_text("words"):
            word, token = fitz.Rect(w[:4]), w[4]
            if token == stamp:
                cover = word + (-14, -10, 14, 10)
                for dr in drawings:
                    box = fitz.Rect(dr["rect"])
                    if box.contains(word) and 60 < box.width < 200 and 20 < box.height < 70:
                        cover = box + (-2, -2, 2, 2)
                rects.append(cover)
            if token.startswith("*") and 2 <= len(token) <= 4 and token[1:2].isalpha() or token[:2] == "*(":
                rects.append(word + (-1, -1, 1, 1))
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                for span in line["spans"]:
                    box = fitz.Rect(span["bbox"])
                    if not span["text"].strip() or not span_red(span) or any(r.contains(box) for r in rects):
                        continue
                    if cover_red_text:
                        rects.append(box + (-1, -1, 1, 1))
                    else:
                        print(f"  page {page.number + 1}: red text outside a box at {[round(v) for v in box]}: {span['text'].strip()[:60]!r}")
        for rect in rects:
            page.add_redact_annot(rect, fill=(1, 1, 1))
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS, graphics=fitz.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED, text=fitz.PDF_REDACT_TEXT_REMOVE)
        total += len(rects)
    doc.save(dest, garbage=4, deflate=True)
    doc.close()
    return total


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        sys.exit(__doc__)
    stamp = "Answer"
    if "--stamp" in sys.argv:
        stamp = sys.argv[sys.argv.index("--stamp") + 1]
        args = [a for a in args if a != stamp]
    n = blank(args[0], args[1], "--cover-red-text" in sys.argv, stamp)
    print(f"covered {n} areas -> {args[1]}")


if __name__ == "__main__":
    main()
