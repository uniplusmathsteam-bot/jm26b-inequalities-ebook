"""Export the teacher's red-boxed working from a book's ANS pdf, plus page previews.

Usage:
    python tools/extract_ans_refs.py <book-id>

Writes books/<book-id>/reference/ans/pNN_KK.png (one per red box, numbered by
ANS page) and reference/ans_pages/ans_NN.png. The reference folder is not
published. book.json "source.ansPageOffset" says how ANS pages map to QUE pages.
"""

import json
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]


def is_red(color):
    if not color or len(color) < 3:
        return False
    r, g, b = color[:3]
    return r > 0.85 and g < 0.15 and b < 0.15


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = ROOT / "books" / sys.argv[1]
    book = json.loads((folder / "book.json").read_text(encoding="utf-8"))
    out = folder / "reference" / "ans"
    preview = folder / "reference" / "ans_pages"
    out.mkdir(parents=True, exist_ok=True)
    preview.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(folder / book["source"]["ans"])
    mat = fitz.Matrix(2, 2)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save(str(preview / f"ans_{i+1:02d}.png"))
        n = 0
        for dr in page.get_drawings():
            if not is_red(dr.get("color")):
                continue
            rect = fitz.Rect(dr["rect"])
            if rect.width < 40 or rect.height < 30:
                continue
            clip = rect + (-2, -2, 2, 2)
            clip = clip & page.rect
            shot = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2), clip=clip, alpha=False)
            n += 1
            shot.save(str(out / f"p{i+1:02d}_{n:02d}.png"))
        print("page", i + 1, "red boxes", n)


if __name__ == "__main__":
    main()
