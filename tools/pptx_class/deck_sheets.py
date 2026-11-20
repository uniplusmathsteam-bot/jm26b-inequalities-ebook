"""Contact sheets of the published class deck: the last frame of every slide, nine to a sheet.

    python -X utf8 tools/pptx_class/deck_sheets.py

Writes books/jm1517/reference/class/native/qa/sheet1.png ... sheet3.png from
books/jm1517/class/deck, for reviewing the whole deck at a glance.
"""

import re
import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
DECK = ROOT / "books" / "jm1517" / "class" / "deck"
OUT = ROOT / "books" / "jm1517" / "reference" / "class" / "native" / "qa"
SECTION = re.compile(r'<section[^>]*data-background-video="([^"]+)"[\s\S]*?<aside class="notes"[^>]*>Slide (\d+)/(\d+):')
W, H = 640, 360


def main():
    last = {}
    for video, slide, _ in SECTION.findall((DECK / "index.html").read_text(encoding="utf-8")):
        last[int(slide)] = video
    OUT.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    frames = {}
    with tempfile.TemporaryDirectory() as tmp:
        for n, video in sorted(last.items()):
            png = Path(tmp) / f"{n}.png"
            subprocess.run([ffmpeg, "-v", "error", "-y", "-sseof", "-0.05", "-i", str(DECK / video),
                            "-frames:v", "1", "-vf", f"scale={W}:{H}", str(png)], check=True)
            frames[n] = Image.open(png).convert("RGB")
    slides = sorted(frames)
    for k in range(0, len(slides), 9):
        sheet = Image.new("RGB", (3 * W, 3 * H), "#333333")
        draw = ImageDraw.Draw(sheet)
        for j, n in enumerate(slides[k:k + 9]):
            x, y = (j % 3) * W, (j // 3) * H
            sheet.paste(frames[n], (x, y))
            draw.rectangle([x, y, x + 34, y + 20], fill="#e0a020")
            draw.text((x + 6, y + 4), str(n), fill="black")
        path = OUT / f"sheet{k // 9 + 1}.png"
        sheet.save(path)
        print(path)


if __name__ == "__main__":
    main()
