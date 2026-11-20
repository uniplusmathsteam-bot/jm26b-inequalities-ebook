"""Copy the class slides and the built deck out of reference/ so the live site can serve them.

    python -X utf8 tools/pptx_class/publish_class.py

reference/ is gitignored. slides.html reads books/jm1517/class/slides/SlideN.PNG and
books/jm1517/class/deck/index.html, which this script refreshes from
reference/class/SlideN.PNG and the output of build_deck.py. Only index.html and
index_assets/ are copied; the Manim media and partial movies are build leftovers.
"""

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REF = ROOT / "books" / "jm1517" / "reference" / "class"
OUT = ROOT / "books" / "jm1517" / "class"


def main():
    slides = sorted(REF.glob("Slide*.PNG"), key=lambda p: int(p.stem[5:]))
    if len(slides) != 27:
        raise SystemExit(f"expected 27 slide images in {REF}, found {len(slides)}")
    deck = REF / "deck"
    if not (deck / "index.html").exists():
        raise SystemExit("no deck/index.html; run tools/pptx_class/build_deck.py first")

    shutil.rmtree(OUT / "slides", ignore_errors=True)
    (OUT / "slides").mkdir(parents=True)
    for p in slides:
        shutil.copy2(p, OUT / "slides" / p.name)

    shutil.rmtree(OUT / "deck", ignore_errors=True)
    (OUT / "deck").mkdir()
    shutil.copy2(deck / "index.html", OUT / "deck" / "index.html")
    shutil.copytree(deck / "index_assets", OUT / "deck" / "index_assets")

    files = list((OUT / "deck").rglob("*"))
    size = sum(f.stat().st_size for f in files if f.is_file())
    print(f"{len(slides)} slides, deck {len(files)} files, {size / 2**20:.1f} MB -> {OUT}")


if __name__ == "__main__":
    main()
