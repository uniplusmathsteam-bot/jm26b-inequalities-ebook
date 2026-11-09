"""Render a book's animations with Manim: summary panels ("media") and solution guides ("guides").

Usage:
    python tools/render_media.py <book-id> [scene ...]           # videos + posters
    python tools/render_media.py <book-id> [scene ...] --still   # check frames only, nothing in the book changes

Each entry of "media" in book.json names a scene as "module:Class" from
tools/manim/ and the page region it covers. The video goes to the entry's
"src" and its last frame to "poster". --still writes the last frame to
books/<id>/reference/media/<Class>.png and <Class>_cmp.png, the printed panel
above the last frame, so the two can be compared line by line.

A "guides" entry is a question's figure animated in a dialog. Its scene sets
PAGE and REGION (the camera frame in page points) itself; the video is
GUIDE_HEIGHT pixels tall and its poster is the first frame, the plain figure.
--still renders the whole guide and writes reference/guides/<Class>_cmp.png
(the printed figure above the opening frame) and <Class>_sheet.png (a frame
every two seconds).
Needs Manim Community, ffmpeg and Pillow.
"""

import importlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "manim"))
import textsvg  # noqa: E402

textsvg.install()
from manim import tempconfig  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2.5
GUIDE_HEIGHT = 720
WORK = ROOT / "tools" / "_manim"


def even(v):
    return int(round(v / 2)) * 2


def compare(book_dir, page_no, region, still_png):
    """Printed region (cropped from the page image) above the last frame, saved as <Class>_cmp.png."""
    from PIL import Image

    page = Image.open(book_dir / "pages" / f"p{page_no:02d}.jpg").convert("RGB")
    s = page.width / 595.32
    x0, y0, x1, y1 = region
    crop = page.crop((round(x0 * s), round(y0 * s), round(x1 * s), round(y1 * s)))
    frame = Image.open(still_png).convert("RGB").resize(crop.size)
    sheet = Image.new("RGB", (crop.width, crop.height * 2 + 12), "#d33")
    sheet.paste(crop, (0, 0))
    sheet.paste(frame, (0, crop.height + 12))
    sheet.save(still_png.with_name(f"{still_png.stem}_cmp.png"))


def render(book_dir, item, still, guide=False):
    module, name = item["scene"].split(":")
    sys.path.insert(0, str(ROOT / "tools" / "manim"))
    cls = getattr(importlib.import_module(module), name)
    region = tuple(cls.REGION if guide else item["region"])
    x0, y0, x1, y1 = region
    if guide:
        w, h = even(GUIDE_HEIGHT * (x1 - x0) / (y1 - y0)), GUIDE_HEIGHT
    else:
        w, h = even((x1 - x0) * SCALE), even((y1 - y0) * SCALE)
    scene_cls = type(name, (cls,), {"REGION": region})
    options = {
        "pixel_width": w, "pixel_height": h, "frame_height": 8.0, "frame_width": 8.0 * w / h,
        "frame_rate": 30, "media_dir": str(WORK), "disable_caching": True, "verbosity": "WARNING",
        "progress_bar": "none", "background_color": "#ffffff",
    }
    still_frame = still and not guide
    if still_frame:
        options.update(save_last_frame=True, write_to_movie=False)
    with tempconfig(options):
        scene = scene_cls()
        scene.render()
        writer = scene.renderer.file_writer
        out = Path(writer.image_file_path if still_frame else writer.movie_file_path)
        length = scene.renderer.time
    if still_frame:
        dest = book_dir / "reference" / "media" / f"{name}.png"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(out, dest)
        compare(book_dir, item["page"], region, dest)
        print("still", dest.relative_to(ROOT), "and", dest.with_name(f"{name}_cmp.png").name)
        return
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    if still:
        dest = book_dir / "reference" / "guides" / f"{name}.png"
        dest.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([ffmpeg, "-v", "error", "-y", "-i", str(out), "-frames:v", "1", "-update", "1", str(dest)], check=True)
        compare(book_dir, cls.PAGE, region, dest)
        rows = -(-int(length // 2 + 1) // 5)
        sheet = dest.with_name(f"{name}_sheet.png")
        subprocess.run([ffmpeg, "-v", "error", "-y", "-i", str(out), "-vf", f"fps=1/2,scale=360:-1,tile=5x{rows}:padding=4:color=red",
                        "-frames:v", "1", "-update", "1", str(sheet)], check=True)
        print(f"guide {name} ({length:.0f} s): {dest.with_name(f'{name}_cmp.png').relative_to(ROOT)} and {sheet.name}")
        return
    video = book_dir / item["src"]
    poster = book_dir / item["poster"]
    video.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([ffmpeg, "-v", "error", "-y", "-i", str(out), "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(video)], check=True)
    grab = ["-i", str(video)] if guide else ["-sseof", "-0.2", "-i", str(video)]
    subprocess.run([ffmpeg, "-v", "error", "-y", *grab, "-frames:v", "1", "-q:v", "3", "-update", "1", str(poster)], check=True)
    print(f"video {video.relative_to(ROOT)} ({video.stat().st_size // 1024} KB, {length:.0f} s), poster {poster.name}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    book_dir = ROOT / "books" / args[0]
    book = json.loads((book_dir / "book.json").read_text(encoding="utf-8"))
    wanted = set(args[1:])
    for key in ("media", "guides"):
        for item in book.get(key, []):
            if not wanted or item["scene"].split(":")[1] in wanted:
                render(book_dir, item, "--still" in sys.argv, guide=key == "guides")


if __name__ == "__main__":
    main()
