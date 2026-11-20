"""Copy the built class deck out of reference/ so the live site can serve it.

    python -X utf8 tools/pptx_class/publish_class.py [--replay]

reference/ is gitignored. books/jm1517/class/slides.html plays books/jm1517/class/deck/index.html
and shows books/jm1517/class/thumbs/SNN.jpg in its slide strip. This script refreshes both from
the output of build_deck.py: the native Manim deck (reference/class/native/deck), or with
--replay the older PowerPoint image replay (reference/class/deck). Only index.html and
index_assets/ are copied; the Manim media and partial movies are build leftovers. Each
thumbnail is the last frame of that slide's last step, so it is Manim's own drawing.
"""

import re
import shutil
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[2]
REF = ROOT / "books" / "jm1517" / "reference" / "class"
OUT = ROOT / "books" / "jm1517" / "class"
SECTION = re.compile(r'<section[^>]*data-background-video="([^"]+)"[\s\S]*?<aside class="notes"[^>]*>Slide (\d+)/(\d+):')


def last_videos(html):
    last = {}
    for video, slide, total in SECTION.findall(html):
        last[int(slide)] = video
    if sorted(last) != list(range(1, int(total) + 1)):
        raise SystemExit(f"deck notes name slides {sorted(last)}, expected 1..{total}")
    return last


def main():
    deck = REF / "deck" if "--replay" in sys.argv else REF / "native" / "deck"
    if not (deck / "index.html").exists():
        raise SystemExit(f"no {deck / 'index.html'}; run tools/pptx_class/build_deck.py first")

    shutil.rmtree(OUT / "slides", ignore_errors=True)
    shutil.rmtree(OUT / "deck", ignore_errors=True)
    (OUT / "deck").mkdir(parents=True)
    shutil.copy2(deck / "index.html", OUT / "deck" / "index.html")
    shutil.copytree(deck / "index_assets", OUT / "deck" / "index_assets")

    last = last_videos((OUT / "deck" / "index.html").read_text(encoding="utf-8"))
    shutil.rmtree(OUT / "thumbs", ignore_errors=True)
    (OUT / "thumbs").mkdir()
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    for slide, video in last.items():
        out = OUT / "thumbs" / f"S{slide:02d}.jpg"
        subprocess.run([ffmpeg, "-v", "error", "-y", "-sseof", "-0.1", "-i", str(OUT / "deck" / video),
                        "-frames:v", "1", "-vf", "scale=384:-2", "-q:v", "4", str(out)], check=True)
        if not out.exists():
            raise SystemExit(f"no thumbnail for slide {slide} from {video}")

    files = list((OUT / "deck").rglob("*"))
    size = sum(f.stat().st_size for f in files if f.is_file())
    print(f"{len(last)} thumbnails, deck {len(files)} files, {size / 2**20:.1f} MB -> {OUT}")


if __name__ == "__main__":
    main()
