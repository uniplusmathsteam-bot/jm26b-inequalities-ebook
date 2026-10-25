"""Grow each answer region in book.json into the blank space around it.

Usage:
    python tools/grow_regions.py <book-id>            # report, draw previews
    python tools/grow_regions.py <book-id> --write    # also update extract.overrides

Regions taken from a teacher's answer boxes are often just big enough for
handwriting, so typeset answers shrink or spill onto extra sheets. Each region
becomes the largest ink-free rectangle over it, kept a few points clear of
printed text and figures and above the next question and the footer. Run it
on the teacher's boxes once; a second run starts from the grown regions. Previews go to books/<id>/reference/regions/ (old dashed orange, new
blue). Re-run tools/extract_pages.py afterwards.
"""

import json
import sys
from pathlib import Path

import fitz
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2
GAP = 5
CELL = 2
X_MIN, X_MAX = 60, 550


def ink_table(page):
    """Summed-area table of inked pixels."""
    pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), colorspace=fitz.csGRAY, alpha=False)
    ink = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width) < 225
    return np.pad(ink.astype(np.int32).cumsum(0).cumsum(1), ((1, 0), (1, 0)))


def free_grid(sat, top, bottom):
    """CELL-point cells between X_MIN..X_MAX and top..bottom with no ink within GAP."""
    xs = np.arange(X_MIN, X_MAX - CELL + 0.01, CELL)
    ys = np.arange(top, bottom - CELL + 0.01, CELL)
    h, w = sat.shape[0] - 1, sat.shape[1] - 1
    a = np.clip(((xs - GAP) * SCALE).astype(int), 0, w)
    c = np.clip(((xs + CELL + GAP) * SCALE).astype(int), 0, w)
    b = np.clip(((ys - GAP) * SCALE).astype(int), 0, h)
    d = np.clip(((ys + CELL + GAP) * SCALE).astype(int), 0, h)
    s = sat[d][:, c] - sat[b][:, c] - sat[d][:, a] + sat[b][:, a]
    return s == 0, xs, ys


def rectangles(free, xs, ys):
    """Every maximal free rectangle, by the histogram method, in page points."""
    rows, cols = free.shape
    height = np.zeros(cols, dtype=int)
    out = []
    for r in range(rows):
        height = np.where(free[r], height + 1, 0)
        stack = []
        for c in range(cols + 1):
            hc = height[c] if c < cols else 0
            start = c
            while stack and stack[-1][1] >= hc:
                start, hs = stack.pop()
                if hs:
                    out.append((xs[start], ys[r - hs + 1], xs[c - 1] + CELL, ys[r] + CELL))
            stack.append((start, hc))
    return out


def area(r):
    return max(0, r[2] - r[0]) * max(0, r[3] - r[1])


def choose(sat, old, top, bottom):
    """The largest free rectangle over the teacher's box; one keeping most of that box wins unless much smaller."""
    free, xs, ys = free_grid(sat, top, bottom)
    if not free.size:
        return old
    over = lambda r: area([max(r[0], old[0]), max(r[1], old[1]), min(r[2], old[2]), min(r[3], old[3])]) / area(old)
    found = [r for r in rectangles(free, xs, ys) if over(r) >= 0.3]
    if not found:
        return old
    widest = max(found, key=area)
    keeping = [r for r in found if over(r) >= 0.75]
    if keeping and area(max(keeping, key=area)) >= 0.75 * area(widest):
        return list(max(keeping, key=area))
    return list(widest)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    book_id = sys.argv[1]
    folder = ROOT / "books" / book_id
    book = json.loads((folder / "book.json").read_text(encoding="utf-8"))
    layout = json.loads((folder / "layout.json").read_text(encoding="utf-8"))
    cfg = book["extract"]
    footer = cfg.get("footer", 822)
    overrides = cfg.setdefault("overrides", {})
    doc = fitz.open(folder / book["source"]["que"])
    preview = folder / "reference" / "regions"
    preview.mkdir(parents=True, exist_ok=True)
    for lp in layout["pages"]:
        page = doc[lp["page"] - 1]
        t = ink_table(page)
        qs = lp["questions"]
        found = []
        for n, q in enumerate(qs):
            if "region" not in overrides.get(q["id"], {}):
                continue
            old = overrides[q["id"]]["region"]
            bottom = (qs[n + 1]["anchor"][0] - 6) if n + 1 < len(qs) else footer - 14
            new = [round(float(v), 1) for v in choose(t, old, q["anchor"][0], bottom)]
            print(f"p{lp['page']} {q['id']:>4}: {old} -> {new}  ({new[2] - new[0]:.0f} x {new[3] - new[1]:.0f})")
            found.append((old, new))
            overrides[q["id"]]["region"] = new
        shape = page.new_shape()
        for old, new in found:
            shape.draw_rect(fitz.Rect(old))
            shape.finish(color=(1, 0.6, 0), width=0.8, dashes="[3] 0")
            shape.draw_rect(fitz.Rect(new))
            shape.finish(color=(0, 0.5, 1), width=1.2)
        shape.commit()
        page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3)).save(str(preview / f"p{lp['page']:02d}.png"))
    if "--write" in sys.argv:
        (folder / "book.json").write_text(json.dumps(book, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print("updated", folder / "book.json")


if __name__ == "__main__":
    main()
