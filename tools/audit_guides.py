"""Find words that touch the drawing in a book's solution guides.

Usage:
    python -X utf8 tools/audit_guides.py <book-id> [Class ...]

Runs each guide scene of book.json "guides" without making a video. After every
step, and at the largest moment of every Indicate (which grows a mark), it checks
each visible word (a Text) against the coloured angle wedges and other filled
marks, the lines and arcs, the other words, and the edge of the camera frame.
Every place where they come closer than the margin is printed
with the time in the video and the clearance in page points (negative: they
overlap). A clean guide prints only its name. Tints under a triangle are not
checked: values are meant to sit on them. Nor are lines under a word that has a
white background rectangle, which is there to cover them.
"""

import importlib
import json
import sys
from pathlib import Path

import numpy as np
from manim import AnimationGroup, BackgroundRectangle, Indicate, Text, VMobject, tempconfig

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "tools" / "_manim"
REGION_GAP = 2.0   # points between a word and a wedge, a chevron or another filled mark
STROKE_GAP = 1.2   # points between a word and the edge of a line or arc
WORD_GAP = 1.0     # points between two words
STEP = 0.3         # sampling step along outlines, in points


def bezier_samples(points, n=8):
    """Points along the cubic Bézier curves of a VMobject (control points in groups of four)."""
    pts = points[: len(points) // 4 * 4, :2].reshape(-1, 4, 2)
    if not len(pts):
        return np.zeros((0, 2))
    t = np.linspace(0, 1, n)[None, :, None]
    p0, p1, p2, p3 = (pts[:, i][:, None, :] for i in range(4))
    out = (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3
    return out.reshape(-1, 2)


def densify(pts, step):
    """Insert points so that no two neighbours are more than `step` apart."""
    if len(pts) < 2:
        return pts
    out = [pts[:1]]
    for a, b in zip(pts[:-1], pts[1:]):
        n = max(1, int(np.ceil(np.hypot(*(b - a)) / step)))
        out.append(a + (b - a) * np.linspace(0, 1, n + 1)[1:, None])
    return np.vstack(out)


def hull(pts):
    """Convex hull, counter-clockwise (monotone chain)."""
    pts = np.unique(np.round(pts, 6), axis=0)
    if len(pts) < 3:
        return pts
    pts = pts[np.lexsort((pts[:, 1], pts[:, 0]))]

    def turn(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    def half(seq):
        h = []
        for p in seq:
            while len(h) >= 2 and turn(h[-2], h[-1], p) <= 0:
                h.pop()
            h.append(p)
        return h

    lower, upper = half(pts), half(pts[::-1])
    return np.array(lower[:-1] + upper[:-1])


def inside(pts, poly):
    """Which of pts lie inside the polygon (even-odd rule)."""
    if len(poly) < 3 or not len(pts):
        return np.zeros(len(pts), bool)
    x, y = pts[:, :1], pts[:, 1:2]
    x1, y1 = poly[None, :, 0], poly[None, :, 1]
    x2, y2 = np.roll(poly[:, 0], -1)[None, :], np.roll(poly[:, 1], -1)[None, :]
    with np.errstate(divide="ignore", invalid="ignore"):
        cross = ((y1 > y) != (y2 > y)) & (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1)
    return cross.sum(axis=1) % 2 == 1


def edge_distance(pts, poly):
    """Distance from each point to the nearest edge of a closed polygon."""
    if not len(pts) or not len(poly):
        return np.full(len(pts), np.inf)
    a, b = poly, np.roll(poly, -1, axis=0)
    ab = b - a
    ap = pts[:, None, :] - a[None, :, :]
    t = np.clip((ap * ab[None]).sum(-1) / np.maximum((ab * ab).sum(-1), 1e-12)[None], 0, 1)
    return np.linalg.norm(ap - t[..., None] * ab[None], axis=-1).min(axis=1)


def clearance(word, pts, closed_region):
    """Signed gap between a word's hull and a sampled outline: negative when they overlap."""
    if not len(pts):
        return np.inf
    if inside(pts, word).any():
        return -edge_distance(pts[inside(pts, word)], word).max()
    if closed_region is not None and inside(word, closed_region).any():
        return -1.0
    return float(edge_distance(pts, word).min())


def describe(m):
    kind = {"Sector": "wedge", "Arc": "arc", "Line": "line", "DashedLine": "dashed line"}.get(type(m).__name__, "mark")
    return kind


def indicates(animations):
    for a in animations:
        if isinstance(a, Indicate):
            yield a
        elif isinstance(a, AnimationGroup):
            yield from indicates(a.animations)


def audit_state(scene, report, note=""):
    k = scene.k
    cx, cy = scene.c

    def page(p):
        return (round(float(p[0]) / k + cx, 1), round(cy - float(p[1]) / k, 1))

    texts, geometry = [], []
    in_text = set()
    for top in scene.mobjects:
        for m in top.get_family():
            if isinstance(m, Text):
                texts.append(m)
                in_text.update(id(x) for x in m.get_family())
    for top in scene.mobjects:
        for m in top.get_family():
            if id(m) in in_text or not isinstance(m, VMobject) or not m.has_points():
                continue
            if m.z_index <= -2:
                continue
            fill = m.get_fill_opacity() > 0.05
            stroke = m.get_stroke_opacity() > 0.05 and m.get_stroke_width() > 0
            if fill or stroke:
                geometry.append((m, fill, stroke))

    words = []
    for t in texts:
        glyphs = [g for g in t.family_members_with_points() if not isinstance(g, BackgroundRectangle)]
        if not glyphs or max(g.get_fill_opacity() for g in glyphs) < 0.3:
            continue
        pts = np.vstack([bezier_samples(g.points) for g in glyphs]) / k
        masked = any(isinstance(g, BackgroundRectangle) for g in t.get_family())
        words.append((t, hull(pts), masked))

    fw, fh = scene.camera.frame.width / k, scene.camera.frame.height / k
    fc = scene.camera.frame.get_center()[:2] / k
    frame = np.array([fc + [-fw / 2, -fh / 2], fc + [fw / 2, -fh / 2], fc + [fw / 2, fh / 2], fc + [-fw / 2, fh / 2]])

    time = scene.renderer.time
    shown = []
    for t, h, masked in words:
        within = inside(h, frame)
        if not within.any():
            continue
        shown.append((t, h))
        label = getattr(t, "original_text", t.text)
        where = page(t.get_center())
        if not within.all():
            report(time, label, where, "the edge of the frame" + note, None, -1.0)
        for m, fill, stroke in geometry:
            outline = densify(bezier_samples(m.points), STEP * k) / k
            gaps = []
            if fill:
                gaps.append(clearance(h, outline, outline) - REGION_GAP)
            if stroke and not masked:
                half = m.get_stroke_width() / 100 / k / 2
                gaps.append(clearance(h, outline, None) - half - STROKE_GAP)
            gap = min(gaps, default=np.inf)
            if gap < 0:
                report(time, label, where, describe(m) + note, (m.get_color().to_hex(), page(m.get_center())), gap)
    for i, (t1, h1) in enumerate(shown):
        for t2, h2 in shown[i + 1:]:
            gap = clearance(h1, densify(np.vstack([h2, h2[:1]]), STEP), h2) - WORD_GAP
            if gap < 0:
                other = getattr(t2, "original_text", t2.text)
                report(time, getattr(t1, "original_text", t1.text), page(t1.get_center()), f'the word "{other}"' + note, None, gap)


def run(book_dir, item):
    module, name = item["scene"].split(":")
    sys.path.insert(0, str(ROOT / "tools" / "manim"))
    cls = getattr(importlib.import_module(module), name)
    seen = {}

    def report(time, label, where, what, extra, gap):
        key = (label, where, what, extra)
        if key not in seen:
            seen[key] = (time, gap)
        else:
            seen[key] = (seen[key][0], min(seen[key][1], gap))

    def play(self, *args, **kwargs):
        grown = [a for a in indicates(args) if a.scale_factor != 1]
        for a in grown:
            a.mobject.scale(a.scale_factor)
        if grown:
            audit_state(self, report, " while a flash grows")
        for a in grown:
            a.mobject.scale(1 / a.scale_factor)
        cls.play(self, *args, **kwargs)
        audit_state(self, report)

    x0, y0, x1, y1 = cls.REGION
    w, h = 320, max(2, int(round(320 * (y1 - y0) / (x1 - x0) / 2)) * 2)
    scene_cls = type(name, (cls,), {"play": play})
    options = {
        "pixel_width": w, "pixel_height": h, "frame_height": 8.0, "frame_width": 8.0 * w / h, "media_dir": str(WORK),
        "disable_caching": True, "verbosity": "ERROR", "progress_bar": "none", "save_last_frame": True, "write_to_movie": False,
    }
    with tempconfig(options):
        scene_cls().render()
    print(f"{name}: {'clean' if not seen else f'{len(seen)} problem(s)'}")
    for (label, where, what, extra), (time, gap) in sorted(seen.items(), key=lambda kv: kv[1][0]):
        detail = f" {extra[0]} at {extra[1]}" if extra else ""
        print(f"  {time:5.1f} s  \"{label}\" at {where} touches {what}{detail}  ({gap:+.1f} pt)")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    book_dir = ROOT / "books" / args[0]
    book = json.loads((book_dir / "book.json").read_text(encoding="utf-8"))
    wanted = set(args[1:])
    for item in book.get("guides", []):
        if not wanted or item["scene"].split(":")[1] in wanted:
            run(book_dir, item)


if __name__ == "__main__":
    main()
