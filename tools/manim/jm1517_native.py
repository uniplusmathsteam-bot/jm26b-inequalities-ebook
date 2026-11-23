"""JM15 + JM17 intensive class, rebuilt in Manim from the PowerPoint's own objects.

Nothing is a screenshot. tools/pptx_class/pptx_scene.py reads every text box,
equation, shape, freeform and ink stroke out of the deck; this module draws
them as Manim vectors (text through XeLaTeX in the deck's fonts) and replays
the PowerPoint timeline click by click. The exam-paper pictures in the deck are
retyped and redrawn in jm1517_figures.py.

    manim render -r 1920,1080 --fps 30 tools/manim/jm1517_native.py N06
"""

import colorsys
import json
import math
import os
import sys
from pathlib import Path

import numpy as np
from manim import (
    ORIGIN, Animation, AnimationGroup, Create, DashedVMobject, DrawBorderThenFill, LaggedStart,
    Scene, TexTemplate, Tex, VGroup, VMobject, Write, config, linear,
)
from manim.constants import CapStyleType
from manim_slides import Slide

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
ROOT = HERE.parents[1] / "books" / "jm1517" / "reference" / "class"
SCENE = json.loads((ROOT / "pptx" / "scene.json").read_text(encoding="utf-8"))
TIMELINE = json.loads((ROOT / "pptx" / "timeline.json").read_text(encoding="utf-8"))
BOXES = json.loads((ROOT / "pptx" / "boxes.json").read_text(encoding="utf-8"))

# Edits made for the class on top of the PowerPoint: (slide, shape id) -> text added to the
# end of the shape's last run. The shape then widens its fill to the new line ("fit").
APPEND = {(26, 5): ", 47"}
for (_n, _id), _extra in APPEND.items():
    _item = next(i for i in SCENE["slides"][_n - 1]["items"] if i["id"] == _id)
    [r for p in _item["text"]["paras"] for r in p["runs"] if r.get("text")][-1]["text"] += _extra
    _item["fit"] = True

# The class is shown on PowerPoint's white page, which is also what render_static.py compares
# against PowerPoint's own render. JM1517_DARK=1 renders it on Manim's black instead.
DARK = os.environ.get("JM1517_DARK") == "1"
BACKGROUND = "#000000" if DARK else "#FFFFFF"
config.background_color = BACKGROUND
SLIDE_W, SLIDE_H = SCENE["size"]
PT = config.frame_height / SLIDE_H
STROKE_PER_PT = 2 / 1.35
INK_PT = 72 / 2.54 / 1000

CLOUD = "C:/Users/Kinny/AppData/Local/Microsoft/FontCache/4/CloudFonts/"
WINFONTS = "C:/Windows/Fonts/"
TAGS = 120

PREAMBLE = r"""
\usepackage{fontspec}
\usepackage{xcolor}
\newfontfamily\LCal{LCALLIG.TTF}[Path=%(w)s, BoldFont=LCALLIG.TTF, BoldFeatures={FakeBold=2}, ItalicFont=LCALLIG.TTF, ItalicFeatures={FakeSlant=0.15}, BoldItalicFont=LCALLIG.TTF, BoldItalicFeatures={FakeBold=2, FakeSlant=0.15}]
\newfontfamily\LHand{LHANDW.TTF}[Path=%(w)s, BoldFont=LHANDW.TTF, BoldFeatures={FakeBold=2}, ItalicFont=LHANDW.TTF, ItalicFeatures={FakeSlant=0.15}, BoldItalicFont=LHANDW.TTF, BoldItalicFeatures={FakeBold=2, FakeSlant=0.15}]
\newfontfamily\CMath{Cambria Math}[BoldFont={Cambria Math}, BoldFeatures={FakeBold=1.5}]
\newfontfamily\AptosD{30169865670.ttf}[Path=%(c)sAptos Display/, BoldFont=32677218994.ttf]
\newfontfamily\Aptos{30153066857.ttf}[Path=%(c)sAptos/, BoldFont=32483553004.ttf, ItalicFont=26395700251.ttf, BoldItalicFont=26205970649.ttf]
\newfontfamily\Geo{Georgia}
\newfontfamily\TNR{Times New Roman}
\newfontfamily\Ari{Arial}
""" % {"w": WINFONTS, "c": CLOUD} + "".join(r"\definecolor{k%d}{RGB}{%d,0,%d}" % (k, k, 255 - k) + "\n" for k in range(TAGS))

TEX = TexTemplate(tex_compiler="xelatex", output_format=".xdv", preamble=PREAMBLE)
FONT_CMD = {
    "Lucida Calligraphy": r"\LCal", "Lucida Handwriting": r"\LHand", "Cambria Math": r"\CMath",
    "Aptos Display": r"\AptosD", "Aptos": r"\Aptos", "Georgia": r"\Geo", "Times New Roman": r"\TNR", "Arial": r"\Ari",
}
SPECIAL = {"\\": r"\textbackslash{}", "{": r"\{", "}": r"\}", "$": r"\$", "&": r"\&", "#": r"\#", "^": r"\textasciicircum{}",
           "_": r"\_", "%": r"\%", "~": r"\textasciitilde{}", " ": r"\ ", "\u00a0": r"\ "}


def to_xy(x, y):
    """Slide points (y down) to Manim units."""
    return np.array([(x - SLIDE_W / 2) * PT, (SLIDE_H / 2 - y) * PT, 0.0])


def apply(m, x, y):
    a, b, c, d, e, f = m
    return a * x + c * y + e, b * x + d * y + f


def hexa(col):
    return (col[0], col[1]) if col else ("#000000", 0.0)


def escape(text):
    return "".join(SPECIAL.get(ch, ch) for ch in text)


# PowerPoint's equation layout spaces relations and binary operators like TeX does.
RELATIONS = set("=≅∼~≈≠<>≤≥∥⊥≡∴∵→⇒")
BINARY = set("+−×÷±")


def escape_math(text, prev="", nxt=""):
    """prev / nxt are the neighbouring characters from the runs either side."""
    out = []
    for k, ch in enumerate(text):
        before = text[k - 1] if k else prev
        after = text[k + 1] if k + 1 < len(text) else nxt
        gap = "0.2778em" if ch in RELATIONS else "0.2222em" if ch in BINARY and before.strip() else None
        e = SPECIAL.get(ch, ch)
        if gap:
            left = r"\hspace{%s}" % gap if before not in (" ", "\u00a0", "") else ""
            right = r"\hspace{%s}" % gap if after not in (" ", "\u00a0", "") else ""
            e = left + e + right
        out.append(e)
    return "".join(out)


# ---------------------------------------------------------------- XeLaTeX lines

_scale_cache = {}


def tex_pt():
    """Manim units per TeX big point, from a 10bp rule."""
    if "s" not in _scale_cache:
        probe = Tex(r"\mbox{\rule{10bp}{10bp}}", tex_template=TEX, tex_environment=None)
        _scale_cache["s"] = probe.width / 10
    return _scale_cache["s"]


def run_tex(run, k, font_scale=1.0, prev="", nxt=""):
    font = FONT_CMD.get(run.get("font"), r"\Aptos")
    sz = round(run.get("sz", 18) * font_scale, 2)
    style = ""
    if run.get("b"):
        style += r"\bfseries"
    if run.get("i") and not run.get("math"):
        style += r"\itshape"
    text = escape_math(run["text"], prev, nxt) if run.get("math") else escape(run["text"])
    return r"\textcolor{k%d}{%s%s\fontsize{%sbp}{%sbp}\selectfont %s}" % (k, font, style, sz, round(sz * 1.2, 2), text)


def tex_line(runs, font_scale=1.0):
    """One line of styled runs as a VGroup of per-run VGroups, scaled to slide points.

    Returns (mobject, runs_with_mobs, baseline_y). The 1bp anchor rule sits on the
    baseline at the start of the line and is removed after measuring.
    """
    parts = [r"\textcolor{k0}{\rule{1bp}{1bp}}"]
    keep = [r for r in runs if r.get("text")]
    for k, run in enumerate(keep):
        prev = keep[k - 1]["text"][-1] if k else ""
        nxt = keep[k + 1]["text"][0] if k + 1 < len(keep) else ""
        parts.append(run_tex(run, k + 1, font_scale, prev, nxt))
    if not keep:
        return None
    mob = Tex(r"\mbox{" + "".join(parts) + "}", tex_template=TEX, tex_environment=None)
    mob.scale(PT / tex_pt(), about_point=ORIGIN)
    groups = {}
    for p in mob.family_members_with_points():
        r, g, b = (int(round(v * 255)) for v in p.get_fill_color().to_rgb())
        groups.setdefault(r, []).append(p)
    anchor = VGroup(*groups.pop(0, []))
    base = anchor.get_bottom()[1] if len(anchor) else mob.get_bottom()[1]
    start = anchor.get_left()[0] if len(anchor) else mob.get_left()[0]
    line = VGroup()
    for k, run in enumerate(keep, 1):
        g = VGroup(*groups.get(k, []))
        if not len(g):
            continue
        style_run(g, run)
        line.add(g)
    return line, base, start


def style_run(g, run):
    col, alpha = hexa(run.get("color") or ("#000000", 1.0))
    g.set_fill(col, opacity=alpha)
    out = run.get("outline")
    if out:
        oc, oa = hexa(out["color"])
        g.set_stroke(oc, width=max(out["w"], 0.5) * STROKE_PER_PT, opacity=oa)
    else:
        g.set_stroke(width=0)
    glow = run.get("glow")
    if glow:
        gc, ga = hexa(glow["color"])
        g.set_stroke(gc, width=glow["rad"] * 2 * STROKE_PER_PT, opacity=ga * 0.8, background=True)


def split_lines(paras):
    """Paragraphs and line breaks into lines of runs (with their paragraph)."""
    out = []
    for p in paras:
        cur = []
        for r in p["runs"]:
            if r.get("br"):
                out.append((p, cur))
                cur = []
            else:
                cur.append(r)
        out.append((p, cur))
    return out


def build_text(item, slide_n):
    t = item["text"]
    m = item["m"]
    lines = []
    for para, runs in split_lines(t["paras"]):
        built = tex_line(runs, t.get("font_scale", 1.0)) if any(r.get("text", "").strip() for r in runs) else None
        size = max([r.get("sz", 18) for r in runs if r.get("text")] or [para["end"].get("sz", 18)]) * t.get("font_scale", 1.0)
        lines.append((para, built, size))
    if not any(b for _, b, _ in lines):
        return None
    # Lay the lines out the way PowerPoint does: top inset, 1.2 x size per line.
    l, ti, r, bi = t["ins"]
    w, h = item["w"], item["h"]
    y = ti
    group = VGroup()
    for para, built, size in lines:
        y += para.get("spcBef", 0)
        lh = 1.2 * size * para.get("lnSpc", 1.0)
        if built:
            line, base, start = built
            ascent = 0.95 * size
            target_base = y + ascent
            if para["algn"] == "ctr":
                x = (l + w - r) / 2
                line.shift(to_xy(0, 0) * 0)
                cx = line.get_center()[0]
                px, py = apply(m, x, target_base)
                line.shift([to_xy(px, py)[0] - cx, to_xy(px, py)[1] - base, 0])
            elif para["algn"] == "r":
                px, py = apply(m, w - r, target_base)
                line.shift([to_xy(px, py)[0] - line.get_right()[0], to_xy(px, py)[1] - base, 0])
            else:
                px, py = apply(m, l + para.get("marL", 0), target_base)
                line.shift([to_xy(px, py)[0] - start, to_xy(px, py)[1] - base, 0])
            first = next((r for r in para["runs"] if r.get("text")), None)
            if para.get("bu") and first:
                bullet = dict(first, text=para["bu"], font=para.get("buFont") or first.get("font"), b=False, i=False, math=False)
                bmob, bbase, bstart = tex_line([bullet], t.get("font_scale", 1.0))
                bx, by = apply(m, l + para.get("marL", 0) + para.get("indent", 0), target_base)
                bmob.shift([to_xy(bx, by)[0] - bstart, to_xy(bx, by)[1] - bbase, 0])
                line.add(*bmob.submobjects)
            group.add(line)
        y += lh
    if t["anchor"] == "ctr" and len(group):
        cy_box = to_xy(*apply(m, w / 2, h / 2))[1]
        group.shift([0, cy_box - group.get_center()[1], 0])
    measured = BOXES.get(str(slide_n), {}).get(str(item["id"]))
    if measured and len(group):
        x0, y0, x1, y1 = (v / 2 for v in measured)
        target = to_xy((x0 + x1) / 2, (y0 + y1) / 2)
        glow = any(r.get("glow") for p in t["paras"] for r in p["runs"])
        if item.get("fit"):
            # the measurement is of the PowerPoint text; the edited line keeps only its height
            group.shift([0, target[1] - group.get_center()[1], 0])
        elif not glow:
            group.shift(target - group.get_center())
        else:
            group.shift([target[0] - group.get_center()[0], target[1] - group.get_center()[1], 0])
    rot = math.degrees(math.atan2(m[1], m[0]))
    if abs(rot) > 0.5:
        group.rotate(-math.radians(rot))
    return group


# ---------------------------------------------------------------- shapes

def path_mob(pts, closed):
    v = VMobject()
    corners = [to_xy(*p) for p in pts]
    if closed and len(corners) > 2 and np.linalg.norm(corners[0] - corners[-1]) > 1e-6:
        corners.append(corners[0])
    v.set_points_as_corners(corners)
    return v


def build_shape(item):
    m = item["m"]
    out = VGroup()
    fill, line = item.get("fill"), item.get("line")
    for path in item["paths"]:
        pts = [apply(m, x, y) for x, y in path["pts"]]
        v = path_mob(pts, path["closed"])
        has_fill = path["fill"] and fill
        has_line = path["stroke"] and line
        if not has_fill and not has_line:
            continue
        if has_fill:
            c, a = hexa(fill)
            v.set_fill(c, opacity=a)
        else:
            v.set_fill(opacity=0)
        if has_line:
            c, a = hexa(line["color"])
            v.set_stroke(c, width=line["w"] * STROKE_PER_PT, opacity=a)
            v.cap_style = CapStyleType.ROUND if line.get("cap") == "rnd" else CapStyleType.BUTT
            if line.get("dash"):
                length = sum(np.linalg.norm(np.subtract(pts[i + 1], pts[i])) for i in range(len(pts) - 1))
                dash = {"sysDot": 2, "sysDash": 6, "dash": 8}.get(line["dash"], 4) * line["w"]
                v = DashedVMobject(v, num_dashes=max(2, int(length / max(dash, 0.5))), dashed_ratio=0.5)
        else:
            v.set_stroke(width=0)
        out.add(v)
    return out


def build_ink(item):
    m = item["m"]
    xs = [p[0] for s in item["strokes"] for p in s["pts"]]
    ys = [p[1] for s in item["strokes"] for p in s["pts"]]
    x0, y0 = min(xs), min(ys)
    bw, bh = (max(xs) - x0) * INK_PT, (max(ys) - y0) * INK_PT
    sx = item["w"] / bw if bw > 1 else 1.0
    sy = item["h"] / bh if bh > 1 else sx
    if bw <= 1:
        sx = sy
    out = VGroup()
    for s in item["strokes"]:
        br = item["brushes"].get(s["brush"]) or next(iter(item["brushes"].values()))
        raw = [apply(m, (x - x0) * INK_PT * sx, (y - y0) * INK_PT * sy) for x, y in s["pts"]]
        pts = [raw[0]]
        for p in raw[1:]:
            if math.dist(p, pts[-1]) > 0.6:
                pts.append(p)
        if len(pts) == 1:
            pts = [pts[0], raw[-1] if math.dist(raw[-1], pts[0]) > 0 else (pts[0][0] + 0.01, pts[0][1])]
        if br["tip"] == "rectangle":
            half = br["w"] / 2 * 72 / 2.54 * sx
            for end, nxt in ((0, 1), (-1, -2)):
                d = np.subtract(pts[end], pts[nxt])
                L = np.linalg.norm(d)
                if L > 1e-6:
                    pts[end] = tuple(np.add(pts[end], d / L * half))
        v = VMobject()
        if len(pts) > 2 and br["tip"] != "rectangle":
            v.set_points_smoothly([to_xy(*p) for p in pts])
        else:
            v.set_points_as_corners([to_xy(*p) for p in pts])
        horizontal = abs(pts[-1][0] - pts[0][0]) >= abs(pts[-1][1] - pts[0][1])
        thick = (br["h"] if br["tip"] == "rectangle" and horizontal else br["w"]) * 72 / 2.54 * (sx if br["tip"] == "rectangle" else 1)
        v.set_fill(opacity=0)
        v.set_stroke(br["color"], width=thick * STROKE_PER_PT, opacity=(1 - br["transparency"]) * (0.5 if br["highlighter"] else 1))
        v.cap_style = CapStyleType.BUTT if br["tip"] == "rectangle" else CapStyleType.ROUND
        out.add(v)
    out.highlighter = any(b["highlighter"] for b in item["brushes"].values())
    return out


# ---------------------------------------------------------------- slides

def build_item(item, n):
    kind = item["kind"]
    if item.get("hidden"):
        return None
    if kind == "ink":
        return build_ink(item)
    if kind == "picture":
        from jm1517_figures import build_picture
        return build_picture(item, n)
    mob = VGroup()
    t = build_text(item, n) if kind in ("text", "shape+text") and item.get("text") else None
    if kind == "shape+text" and item.get("fit") and t is not None:
        left = to_xy(*apply(item["m"], 0, 0))[0]
        w = max(item["w"], (t.get_right()[0] - left) / PT + item["text"]["ins"][2])
        k = w / item["w"]
        item = dict(item, w=w, paths=[dict(p, pts=[[x * k, y] for x, y in p["pts"]]) for p in item["paths"]])
    if kind in ("shape", "shape+text"):
        mob.add(build_shape(item))
    if t is not None:
        mob.add(t)
    return mob if len(mob.family_members_with_points()) else None


# ---------------------------------------------------------------- dark theme

def dark(col):
    """A PowerPoint colour on white -> (colour, opacity factor) on black.

    Greys flip (black ink turns white, a white mask turns black). Strong colours keep
    their hue and are lifted to read on black. Pale tints (highlighter and triangle
    fills) become a see-through wash of the same hue, so the text over them stays white.
    """
    r, g, b = col.to_rgb()
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if max(r, g, b) - min(r, g, b) < 0.08:
        v = min(0.95, 1 - l)
        return "#%02x%02x%02x" % ((round(v * 255),) * 3), 1.0
    if l <= 0.68:
        r, g, b = colorsys.hls_to_rgb(h, max(l, 0.62), min(1.0, s * 1.1))
        return "#%02x%02x%02x" % tuple(round(v * 255) for v in (r, g, b)), 1.0
    r, g, b = colorsys.hls_to_rgb(h, 0.55, max(s, 0.7))
    return "#%02x%02x%02x" % tuple(round(v * 255) for v in (r, g, b)), 0.6


def wash(col, alpha):
    """A see-through shape fill (the coloured triangles) on black: a mid-tone of its hue,
    dense enough to see, dark enough that white labels over it stay readable."""
    r, g, b = col.to_rgb()
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    r, g, b = colorsys.hls_to_rgb(h, 0.42, max(s, 0.7))
    return "#%02x%02x%02x" % tuple(round(v * 255) for v in (r, g, b)), min(0.72, max(0.5, 0.45 + 0.6 * alpha))


def to_dark(mob, shape=False):
    """shape: mob is a slide shape, whose see-through fills become a wash().
    Returns whether any fill did."""
    washed = False
    for m in mob.family_members_with_points():
        if m.get_fill_opacity() > 0:
            r, g, b = m.get_fill_color().to_rgb()
            if shape and m.get_fill_opacity() < 0.9 and max(r, g, b) - min(r, g, b) >= 0.08:
                c, a = wash(m.get_fill_color(), m.get_fill_opacity())
                m.set_fill(c, opacity=a, family=False)
                washed = True
            else:
                c, k = dark(m.get_fill_color())
                m.set_fill(c, opacity=m.get_fill_opacity() * k, family=False)
        for back in (False, True):
            if m.get_stroke_width(background=back) > 0 and m.get_stroke_opacity(background=back) > 0:
                c, k = dark(m.get_stroke_color(background=back))
                m.set_stroke(c, opacity=m.get_stroke_opacity(background=back) * k, background=back, family=False)
    return washed


def to_marker(mob):
    """Highlighter ink on black: a deep wash of its hue, which goes under the white text."""
    for m in mob.family_members_with_points():
        r, g, b = m.get_stroke_color().to_rgb()
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        r, g, b = colorsys.hls_to_rgb(h, 0.45, max(s, 0.75))
        m.set_stroke("#%02x%02x%02x" % tuple(round(v * 255) for v in (r, g, b)), opacity=0.55, family=False)
    return mob


def overlaps(a, b):
    return not (a[2] < b[0] or b[2] < a[0] or a[3] < b[1] or b[3] < a[1])


def slide_mobjects(n):
    """Every drawable on slide n: list of (item, mobject), z-ordered.

    On the dark page highlighter ink sits just below the lowest text or picture it
    covers: drawn over white text, as PowerPoint does, it would tint and dim the words
    it marks. (Sending it below the whole slide instead loses it in Manim's animated
    frames, though a still draws it.) A see-through triangle fill goes under the picture
    it shades in the same way, unless an opaque shape between them would then hide it.
    """
    items = SCENE["slides"][n - 1]["items"]
    out = []
    words = []
    solid = []
    for z, item in enumerate(items):
        mob = build_item(item, n)
        if mob is None:
            continue
        box = (*mob.get_corner([-1, -1, 0])[:2], *mob.get_corner([1, 1, 0])[:2])
        marker = DARK and getattr(mob, "highlighter", False)
        if marker:
            to_marker(mob)
            under = [wz for wz, wbox in words if overlaps(box, wbox)]
            mob.set_z_index(min(under) - 0.5 if under else z)
        else:
            washed = DARK and to_dark(mob, shape=item["kind"] == "shape")
            under = [wz for wz, wbox in words if overlaps(box, wbox)
                     and not any(wz < sz and overlaps(box, sbox) for sz, sbox in solid)] if washed else []
            mob.set_z_index(min(under) - 0.5 if under else z)
            if item["kind"] in ("text", "shape+text", "picture"):
                words.append((z, box))
            elif any(m.get_fill_opacity() >= 0.9 for m in mob.family_members_with_points()):
                solid.append((z, box))
        out.append((item, mob))
    return out


class StaticSlide(Scene):
    """Every object in its final place, for checking against PowerPoint."""
    n = 0

    def construct(self):
        for _, mob in slide_mobjects(self.n):
            self.add(mob)


# ---------------------------------------------------------------- animation

WIPE, MOTION, ON_CLICK = 22, 127, 1
INTRO_MAX = 2.5


def text_chars(item):
    return sum(len(r.get("text", "")) for p in item.get("text", {}).get("paras", []) for r in p["runs"])


def entrance(item, mob):
    """How a shape comes on: text is written, ink and outlines are drawn along their path."""
    kind = item["kind"]
    if kind == "ink":
        return Create(mob, run_time=0.5, rate_func=linear)
    if kind == "picture":
        return Write(mob, run_time=min(2.0, 0.6 + 0.004 * len(mob.family_members_with_points())), lag_ratio=0.02)
    if kind == "text":
        return Write(mob, run_time=min(1.4, 0.45 + 0.05 * text_chars(item)))
    shape, text = mob.submobjects[0], mob.submobjects[1:]
    parts = [Write(t, run_time=min(1.4, 0.45 + 0.05 * text_chars(item))) for t in text]
    if shape.family_members_with_points():
        filled = any(m.get_fill_opacity() > 0 for m in shape.family_members_with_points())
        parts.insert(0, DrawBorderThenFill(shape, run_time=0.8) if filled else Create(shape, run_time=0.6, rate_func=linear))
    return parts[0] if len(parts) == 1 else AnimationGroup(*parts)


class Move(Animation):
    """PowerPoint's straight motion path, relative to where the shape is now."""

    def __init__(self, mob, offset, run_time):
        super().__init__(mob, run_time=run_time, rate_func=ppt_ease)
        self.offset = offset

    def begin(self):
        self.start = self.mobject.get_center().copy()
        self.interpolate_mobject(0)

    def finish(self):
        self.interpolate_mobject(1)

    def clean_up_from_scene(self, scene):
        pass

    def interpolate_mobject(self, alpha):
        self.mobject.move_to(self.start + self.rate_func(alpha) * self.offset)


def ppt_ease(t):
    """PowerPoint's accelerate 0.5 / decelerate 0.5."""
    return 2 * t * t if t < 0.5 else 1 - 2 * (1 - t) ** 2


def path_offset(path):
    nums = [float(t) for t in path.replace("M", " ").replace("L", " ").split()]
    return np.array([(nums[-2] - nums[0]) * SLIDE_W * PT, -(nums[-1] - nums[1]) * SLIDE_H * PT, 0])


class NativeSlide(Slide):
    """One PowerPoint slide: the shapes on screen when it opens are built first, then every
    click of the PowerPoint timeline is one manim-slides step."""
    n = 0

    def construct(self):
        from jm1517_pptx import PACING, click_groups, slide_label, slide_title

        info = TIMELINE["slides"][self.n - 1]
        effects = info["effects"]
        entering = {e["shape_id"] for e in effects if e["type"] == WIPE and not e["exit"]}
        by_top = {}
        for item, mob in slide_mobjects(self.n):
            by_top.setdefault(item["top"], []).append((item, mob))

        groups = click_groups(effects)
        clicks = sum(1 for g in groups if not g["auto"])
        marks = PACING[self.n]

        def notes(k):
            return (f"{slide_label(self.n)}: {slide_title(info)}\n"
                    f"Click {k} of {clicks}. Aim to be here by {marks[min(k, len(marks) - 1)]:.0f} min.")

        self.next_slide(notes=notes(0))
        intro = [entrance(item, mob) for top, leaves in by_top.items() if top not in entering for item, mob in leaves]
        if intro:
            lag = min(0.25, INTRO_MAX / max(len(intro), 1))
            self.play(LaggedStart(*intro, lag_ratio=lag / max(a.run_time for a in intro)))
        else:
            self.wait(1 / config.frame_rate)
        done = 0
        for group in groups:
            if not group["auto"]:
                done += 1
                self.next_slide(notes=notes(done))
            anims = []
            for e in group["effects"]:
                leaves = by_top.get(e["shape_id"], [])
                if e["type"] == WIPE and not e["exit"]:
                    anims += [entrance(item, mob) for item, mob in leaves]
                elif e["type"] == MOTION:
                    path = next(b["path"] for b in e["behaviors"] if b["type"] == 1)
                    anims += [Move(mob, path_offset(path), e["dur"]) for _, mob in leaves]
            if anims:
                self.play(AnimationGroup(*anims))
            else:
                self.wait(1 / config.frame_rate)


for _s in SCENE["slides"]:
    _name = f"Static{_s['n']:02d}"
    globals()[_name] = type(_name, (StaticSlide,), {"n": _s["n"]})
    _name = f"N{_s['n']:02d}"
    globals()[_name] = type(_name, (NativeSlide,), {"n": _s["n"]})

SCENES = [f"N{s['n']:02d}" for s in SCENE["slides"]]
