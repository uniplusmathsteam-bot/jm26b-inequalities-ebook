"""Export the teacher's red-boxed working from the ANS pdf, plus page previews."""

from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
ANS = ROOT / "S3 JM26 (B)  Inequalities I - 2026 (ANS).pdf"
OUT = ROOT / "reference" / "ans"
PREVIEW = ROOT / "reference" / "ans_pages"


def is_red(color):
    if not color or len(color) < 3:
        return False
    r, g, b = color[:3]
    return r > 0.85 and g < 0.15 and b < 0.15


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(ANS)
    mat = fitz.Matrix(2, 2)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save(str(PREVIEW / f"ans_{i+1:02d}.png"))
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
            shot.save(str(OUT / f"p{i+1:02d}_{n:02d}.png"))
        print("page", i + 1, "red boxes", n)


if __name__ == "__main__":
    main()
