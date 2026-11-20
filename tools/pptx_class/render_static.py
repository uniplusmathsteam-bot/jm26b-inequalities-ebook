"""Render rebuilt slides as stills and compare them with PowerPoint's own render.

    python -X utf8 tools/pptx_class/render_static.py [--dark] 6 7 8

Writes books/jm1517/reference/class/native/check/sN.png (the Manim still) and
sN_vs.png (PowerPoint on top, Manim below, and a red/blue overlay). The comparison
renders PowerPoint's white page; --dark renders the class's black theme instead,
for looking at only (its diff against PowerPoint means nothing).
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "tools" / "manim" / "jm1517_native.py"
OUT = ROOT / "books" / "jm1517" / "reference" / "class" / "native"
REF = ROOT / "books" / "jm1517" / "reference" / "class" / "layers"


def render(n):
    env = dict(os.environ, PYTHONIOENCODING="utf-8", JM1517_LIGHT="0" if DARK else "1")
    cmd = [sys.executable, "-X", "utf8", "-m", "manim", "render", "-r", "1920,1080", "-s", "-v", "ERROR",
           "--media_dir", "media", str(SCRIPT), f"Static{n:02d}"]
    p = subprocess.run(cmd, cwd=OUT, env=env, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if p.returncode:
        print(p.stdout[-3000:], p.stderr[-3000:])
        return None
    png = next((OUT / "media" / "images" / "jm1517_native").glob(f"Static{n:02d}*.png"))
    dest = OUT / "check" / f"s{n}.png"
    dest.parent.mkdir(exist_ok=True)
    shutil.copy(png, dest)
    return dest


def compare(n, mine):
    ref = Image.open(REF / f"slide{n}" / "final.png").convert("RGB")
    new = Image.open(mine).convert("RGB")
    a = np.asarray(ref, dtype=np.float32) / 255
    b = np.asarray(new, dtype=np.float32) / 255
    ink_a = 1 - a.mean(axis=2)
    ink_b = 1 - b.mean(axis=2)
    over = np.ones_like(a)
    over[..., 0] = 1 - ink_b
    over[..., 1] = 1 - np.maximum(ink_a, ink_b)
    over[..., 2] = 1 - ink_a
    overlay = Image.fromarray((over * 255).astype(np.uint8))
    sheet = Image.new("RGB", (1920, 1080 * 3), "white")
    sheet.paste(ref, (0, 0))
    sheet.paste(new, (0, 1080))
    sheet.paste(overlay, (0, 2160))
    sheet.resize((960, 1620)).save(OUT / "check" / f"s{n}_vs.png")
    print(f"slide {n}: mean |diff| {np.abs(a - b).mean():.4f}")


DARK = "--dark" in sys.argv

if __name__ == "__main__":
    for arg in (a for a in sys.argv[1:] if a != "--dark"):
        mine = render(int(arg))
        if mine:
            compare(int(arg), mine)
