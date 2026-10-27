"""Render a book's animated summary panels with Manim.

Usage:
    python tools/render_media.py <book-id> [scene ...]           # videos + posters
    python tools/render_media.py <book-id> [scene ...] --still   # last frames only, to check layout

Each entry of "media" in book.json names a scene as "module:Class" from
tools/manim/ and the page region it covers. The video goes to the entry's
"src" and its last frame to "poster". --still writes the last frame to
books/<id>/reference/media/<Class>.png and <Class>_cmp.png, the printed panel
above the last frame, so the two can be compared line by line.
Needs Manim Community, ffmpeg and Pillow.
"""

import importlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

from manim import tempconfig

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2.5
WORK = ROOT / "tools" / "_manim"


def even(v):
    return int(round(v / 2)) * 2


def compare(book_dir, item, still_png):
    """Printed panel (cropped from the page image) above the last frame, saved as <Class>_cmp.png."""
    from PIL import Image

    page = Image.open(book_dir / "pages" / f"p{item['page']:02d}.jpg").convert("RGB")
    s = page.width / 595.32
    x0, y0, x1, y1 = item["region"]
    crop = page.crop((round(x0 * s), round(y0 * s), round(x1 * s), round(y1 * s)))
    frame = Image.open(still_png).convert("RGB").resize(crop.size)
    sheet = Image.new("RGB", (crop.width, crop.height * 2 + 12), "#d33")
    sheet.paste(crop, (0, 0))
    sheet.paste(frame, (0, crop.height + 12))
    sheet.save(still_png.with_name(f"{still_png.stem}_cmp.png"))


def render(book_dir, item, still):
    module, name = item["scene"].split(":")
    sys.path.insert(0, str(ROOT / "tools" / "manim"))
    cls = getattr(importlib.import_module(module), name)
    x0, y0, x1, y1 = item["region"]
    w, h = even((x1 - x0) * SCALE), even((y1 - y0) * SCALE)
    scene_cls = type(name, (cls,), {"REGION": tuple(item["region"])})
    options = {
        "pixel_width": w, "pixel_height": h, "frame_height": 8.0, "frame_width": 8.0 * w / h,
        "frame_rate": 30, "media_dir": str(WORK), "disable_caching": True, "verbosity": "WARNING",
        "progress_bar": "none", "background_color": "#ffffff",
    }
    if still:
        options.update(save_last_frame=True, write_to_movie=False)
    with tempconfig(options):
        scene = scene_cls()
        scene.render()
        writer = scene.renderer.file_writer
        out = Path(writer.image_file_path if still else writer.movie_file_path)
    if still:
        dest = book_dir / "reference" / "media" / f"{name}.png"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(out, dest)
        compare(book_dir, item, dest)
        print("still", dest.relative_to(ROOT), "and", dest.with_name(f"{name}_cmp.png").name)
        return
    video = book_dir / item["src"]
    poster = book_dir / item["poster"]
    video.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(video)], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.2", "-i", str(video), "-frames:v", "1", "-q:v", "3",
                    "-update", "1", str(poster)], check=True)
    print(f"video {video.relative_to(ROOT)} ({video.stat().st_size // 1024} KB), poster {poster.name}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    book_dir = ROOT / "books" / args[0]
    book = json.loads((book_dir / "book.json").read_text(encoding="utf-8"))
    wanted = set(args[1:])
    for item in book.get("media", []):
        if not wanted or item["scene"].split(":")[1] in wanted:
            render(book_dir, item, "--still" in sys.argv)


if __name__ == "__main__":
    main()
