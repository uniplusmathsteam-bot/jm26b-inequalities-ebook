"""Render one redrawn picture and compare it with the original crop.

    python -X utf8 tools/pptx_class/fig_check.py s6_8 [s7_8 ...]

Writes books/jm1517/reference/class/native/figcheck/<name>_<time>.png: the
original on top, the Manim redraw below, then an overlay (original red,
redraw blue, both = dark). Prints the mean pixel difference.
"""

import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
CLASS = ROOT / "books" / "jm1517" / "reference" / "class"
OUT = CLASS / "native" / "figcheck"
SCENE = '''
import sys
sys.path.insert(0, r"%(tools)s")
from manim import Scene
from jm1517_figures import figure

class FigCheck(Scene):
    def construct(self):
        self.add(figure("%(name)s.png"))
'''


def check(name):
    import json
    info = json.loads((CLASS / "pictures" / "pictures.json").read_text(encoding="utf-8"))[name + ".png"]
    work = CLASS / "native" / "figwork" / str(os.getpid())
    work.mkdir(parents=True, exist_ok=True)
    src = work / f"fig_{name}.py"
    src.write_text(SCENE % {"tools": ROOT / "tools" / "manim", "name": name}, encoding="utf-8")
    env = dict(os.environ, PYTHONIOENCODING="utf-8", JM1517_DARK="0")
    r = subprocess.run([sys.executable, "-X", "utf8", "-m", "manim", "render", "-r", "1920,1080", "-s", "--disable_caching",
                        "--media_dir", "media", "-o", f"fig_{name}", src.name, "FigCheck"],
                       cwd=work, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
    png = next((work / "media" / "images" / src.stem).glob(f"fig_{name}*.png"), None)
    if r.returncode or png is None:
        print(r.stdout[-3000:], r.stderr[-3000:])
        return
    frame = Image.open(png).convert("L")
    x, y, w, h = info["box"]
    box = (round(x * 2), round(y * 2), round((x + w) * 2), round((y + h) * 2))
    mine = frame.crop(box)
    orig_rgba = Image.open(CLASS / "pictures" / (name + ".png")).convert("RGBA")
    bg = Image.new("RGBA", orig_rgba.size, "white")
    bg.alpha_composite(orig_rgba)
    orig = bg.convert("L").resize(mine.size, Image.LANCZOS)
    a, b = np.asarray(orig, float) / 255, np.asarray(mine, float) / 255
    da, db = a < 0.6, b < 0.6
    none = ~da & ~db
    overlay = np.stack([(da & ~db) | none, none, (db & ~da) | none], axis=2) * 255
    ov = Image.fromarray(overlay.astype(np.uint8))
    W, H = mine.size
    sheet = Image.new("RGB", (W, H * 3 + 8), "gray")
    sheet.paste(orig.convert("RGB"), (0, 0))
    sheet.paste(mine.convert("RGB"), (0, H + 4))
    sheet.paste(ov, (0, 2 * H + 8))
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{name}_{int(time.time())}.png"
    sheet.save(out)
    print(f"{name}: diff {np.abs(a - b).mean():.4f} -> {out}")


if __name__ == "__main__":
    for n in sys.argv[1:]:
        check(n)
