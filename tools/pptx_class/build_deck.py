"""Render the class scenes and bundle them into one HTML deck.

    python -X utf8 tools/pptx_class/build_deck.py --native [--workers 4] [-r 1920,1080] [scene ...]

--native renders tools/manim/jm1517_native.py (every shape rebuilt in Manim)
inside books/jm1517/reference/class/native/deck; without it, the older
PowerPoint image replay tools/manim/jm1517_pptx.py inside class/deck. Then
runs `manim-slides convert` to write index.html there (offline: reveal.js is
downloaded into the assets folder). --no-convert skips the HTML step.
"""

import argparse
import os
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CLASS = ROOT / "books" / "jm1517" / "reference" / "class"
SLIDES = range(1, 28)


def run(cmd, cwd, log):
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    with open(log, "w", encoding="utf-8") as fh:
        return subprocess.run(cmd, cwd=cwd, env=env, stdout=fh, stderr=subprocess.STDOUT).returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--native", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("-r", "--resolution", default="1920,1080")
    ap.add_argument("--no-convert", action="store_true")
    ap.add_argument("--tag", default="", help="media folder prefix, so two batches can render at once")
    ap.add_argument("scenes", nargs="*")
    args = ap.parse_args()
    prefix = "N" if args.native else "S"
    script = ROOT / "tools" / "manim" / ("jm1517_native.py" if args.native else "jm1517_pptx.py")
    out = CLASS / "native" / "deck" if args.native else CLASS / "deck"
    out.mkdir(parents=True, exist_ok=True)
    every = [f"{prefix}{n:02d}" for n in SLIDES]
    todo = args.scenes or every
    batches = [todo[k::args.workers] for k in range(args.workers) if todo[k::args.workers]]

    # One media folder per worker: workers sharing a Tex cache race on the same files.
    def render(scenes, k):
        cmd = [sys.executable, "-X", "utf8", "-m", "manim", "render", "-r", args.resolution, "--fps", "30",
               "--media_dir", f"media{args.tag}{k}", "--disable_caching", "--progress_bar", "none", "-v", "WARNING", str(script), *scenes]
        code = run(cmd, out, out / f"render{args.tag}{k}.log")
        print(f"worker {k}: {' '.join(scenes)} -> exit {code}", flush=True)
        return code

    with ThreadPoolExecutor(len(batches)) as pool:
        codes = list(pool.map(render, batches, range(len(batches))))
    if any(codes):
        sys.exit(f"render failed; see {out}/render*.log")
    if args.no_convert:
        return
    # manim-slides names assets by content hash and will not replace an existing file, so a
    # white render left in index_assets would keep serving after a dark rebuild of the same scene.
    for stale in (out / "index_assets", out / "index.html"):
        if stale.is_dir():
            shutil.rmtree(stale)
        elif stale.exists():
            stale.unlink()
    cmd = [sys.executable, "-X", "utf8", "-m", "manim_slides", "convert", "--to", "html", "--offline",
           "-ctitle=JM15 + JM17 Intensive Class", "-cprogress=true", "-chash=true", "-ccontrols=true",
           f"-cbackground_color={'black' if args.native else 'white'}", *every, "index.html"]
    code = run(cmd, out, out / "convert.log")
    print("convert -> exit", code)
    sys.exit(code)


if __name__ == "__main__":
    main()
