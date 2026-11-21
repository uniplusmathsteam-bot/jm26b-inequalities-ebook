"""One picture per slide of a book's solution guides, for checking them by eye.

    python -X utf8 tools/guide_frames.py <book-id> [q ...]

For each guide with "stops", grabs the frame at every stop and the last frame
and tiles them into books/<id>/reference/guides/<q>_slides.png.
"""

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH = 640


def ffmpeg():
    found = shutil.which("ffmpeg")
    if found:
        return found
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    book_dir = ROOT / "books" / args[0]
    book = json.loads((book_dir / "book.json").read_text(encoding="utf-8"))
    wanted = set(args[1:])
    out_dir = book_dir / "reference" / "guides"
    out_dir.mkdir(parents=True, exist_ok=True)
    for g in book.get("guides", []):
        if wanted and g["q"] not in wanted:
            continue
        video = book_dir / g["src"]
        frames = []
        with tempfile.TemporaryDirectory() as tmp:
            for i, t in enumerate(list(g.get("stops", [])) + [None]):
                png = Path(tmp) / f"{i}.png"
                grab = ["-sseof", "-0.05"] if t is None else ["-ss", f"{t:.2f}"]
                subprocess.run([ffmpeg(), "-v", "error", "-y", *grab, "-i", str(video), "-frames:v", "1",
                                "-vf", f"scale={WIDTH}:-1", str(png)], check=True)
                frames.append(Image.open(png).convert("RGB"))
        h = frames[0].height
        cols = 2
        rows = -(-len(frames) // cols)
        sheet = Image.new("RGB", (cols * WIDTH + (cols - 1) * 6, rows * h + (rows - 1) * 6), "#888888")
        for i, f in enumerate(frames):
            sheet.paste(f, ((i % cols) * (WIDTH + 6), (i // cols) * (h + 6)))
        dest = out_dir / f"{g['q']}_slides.png"
        sheet.save(dest)
        print(dest.relative_to(ROOT), len(frames), "slides")


if __name__ == "__main__":
    main()
