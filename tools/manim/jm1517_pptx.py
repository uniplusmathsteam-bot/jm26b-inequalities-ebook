"""JM15 + JM17 intensive class, replayed from the teacher's PowerPoint in Manim.

Every slide is cut into layers by tools/pptx_class/export_layers.py, and the
PowerPoint timeline (tools/pptx_class/dump_timeline.py) is replayed on top:
each click is one manim-slides step, wipes reveal from the edge PowerPoint
uses, and motion paths keep PowerPoint's ease-in / ease-out.

    manim render -r 1920,1080 --fps 30 tools/manim/jm1517_pptx.py S06
"""

import json
from pathlib import Path

import numpy as np
from manim import Animation, AnimationGroup, ImageMobject, config, linear
from manim_slides import Slide

ROOT = Path(__file__).resolve().parents[2] / "books" / "jm1517" / "reference" / "class"
LAYERS = ROOT / "layers"
TIMELINE = json.loads((ROOT / "pptx" / "timeline.json").read_text(encoding="utf-8"))

PX = 1920, 1080
WIPE = 22
MOTION = 127
ON_CLICK = 1
FROM_BOTTOM = 3
FROM_LEFT = 4
FEATHER_PX = 12

config.background_color = "#FFFFFF"


def unit(px):
    return px * config.frame_height / PX[1]


def ppt_ease(t):
    """PowerPoint's accelerate 0.5 / decelerate 0.5: constant acceleration, then constant braking."""
    return 2 * t * t if t < 0.5 else 1 - 2 * (1 - t) ** 2


class Wipe(Animation):
    """PowerPoint's Wipe entrance: a soft edge sweeps across the shape's box."""

    def __init__(self, mob, base_alpha, layer, direction, run_time):
        super().__init__(mob, run_time=run_time, rate_func=linear)
        self.base = base_alpha
        h, w = self.base.shape
        bx, by, bw, bh = layer.get("box") or (layer["x"], layer["y"], layer["w"], layer["h"])
        if direction == FROM_LEFT:
            lo, hi = min(bx, layer["x"]), max(bx + bw, layer["x"] + w)
            u = (layer["x"] + np.arange(w) + 0.5 - lo) / max(hi - lo, 1)
            self.u = np.broadcast_to(u[None, :], (h, w))
            self.feather = FEATHER_PX / max(hi - lo, 1)
        else:
            lo, hi = min(by, layer["y"]), max(by + bh, layer["y"] + h)
            u = (hi - (layer["y"] + np.arange(h) + 0.5)) / max(hi - lo, 1)
            self.u = np.broadcast_to(u[:, None], (h, w))
            self.feather = FEATHER_PX / max(hi - lo, 1)

    def begin(self):
        self.interpolate_mobject(0)

    def finish(self):
        self.interpolate_mobject(1)

    def clean_up_from_scene(self, scene):
        pass

    def interpolate_mobject(self, alpha):
        edge = alpha * (1 + self.feather)
        mask = np.clip((edge - self.u) / self.feather, 0, 1)
        self.mobject.pixel_array[..., 3] = (self.base * mask).astype(np.uint8)


class Move(Animation):
    """PowerPoint's straight-line motion path, relative to where the shape is now."""

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


def path_offset(path):
    nums = [float(t) for t in path.replace("M", " ").replace("L", " ").split()]
    dx, dy = nums[-2] - nums[0], nums[-1] - nums[1]
    return np.array([unit(dx * PX[0]), -unit(dy * PX[1]), 0])


LECTURE_MIN = 120
STILL_SLIDE_MIN = 1
# PowerPoint slides left out of the class (13 is MC question 21). Their scenes still build,
# but the deck skips them and the class numbers its slides without them.
# tools/pptx_class/build_deck.py keeps the same list.
DROPPED = {13}
SHOWN = [s["n"] for s in TIMELINE["slides"] if s["n"] not in DROPPED]


def slide_label(n):
    """Speaker-note heading of PowerPoint slide n, numbered as the class shows it ("Slide 13/26")."""
    return f"Slide {SHOWN.index(n) + 1}/{len(SHOWN)}" if n in SHOWN else f"Dropped slide {n}"


def slide_title(info):
    for s in sorted(info["shapes"], key=lambda s: s["z"]):
        if s.get("text") and s["name"].lower().startswith("title"):
            return " ".join(s["text"].split())
    return next((" ".join(s["text"].split()) for s in info["shapes"] if s.get("text")), "")


def pacing():
    """Minute mark for every click: still slides get a minute, the rest is shared by click count."""
    shown = [s for s in TIMELINE["slides"] if s["n"] not in DROPPED]
    clicks = [sum(1 for g in click_groups(s["effects"]) if not g["auto"]) for s in shown]
    still = sum(1 for c in clicks if c == 0)
    per_click = (LECTURE_MIN - still * STILL_SLIDE_MIN) / sum(clicks)
    marks, t = {n: [0.0] for n in DROPPED}, 0.0
    for info, c in zip(shown, clicks):
        marks[info["n"]] = [t + k * per_click for k in range(c + 1)]
        t += c * per_click if c else STILL_SLIDE_MIN
    return marks


def click_groups(effects):
    groups = []
    for e in effects:
        if e["trigger"] == ON_CLICK or not groups:
            groups.append({"auto": e["trigger"] != ON_CLICK, "effects": []})
        groups[-1]["effects"].append(e)
    return groups


class PptSlide(Slide):
    n = 0

    def construct(self):
        folder = LAYERS / f"slide{self.n}"
        manifest = json.loads((folder / "layers.json").read_text(encoding="utf-8"))
        effects = TIMELINE["slides"][self.n - 1]["effects"]
        entering = {e["shape_id"] for e in effects if e["type"] == WIPE}

        # Hidden shapes stay in the scene, fully transparent, so the draw order is always the z-order.
        mobs, layer_of, alpha_of = {}, {}, {}
        for layer in manifest:
            if not layer["file"]:
                continue
            mob = ImageMobject(str(folder / layer["file"]))
            mob.move_to([unit(layer["x"] + layer["w"] / 2 - PX[0] / 2), unit(PX[1] / 2 - layer["y"] - layer["h"] / 2), 0])
            if layer["kind"] == "anim":
                sid = layer["ids"][0]
                mobs[sid], layer_of[sid], alpha_of[sid] = mob, layer, mob.pixel_array[..., 3].copy()
                if sid in entering:
                    mob.pixel_array[..., 3] = 0
            self.add(mob)

        groups = click_groups(effects)
        info = TIMELINE["slides"][self.n - 1]
        marks = PACING[self.n]
        clicks = sum(1 for g in groups if not g["auto"])

        def notes(k):
            return f"{slide_label(self.n)}: {slide_title(info)}\nClick {k} of {clicks}. Aim to be here by {marks[min(k, len(marks) - 1)]:.0f} min."

        self.next_slide(notes=notes(0))
        if not groups or not groups[0]["auto"]:
            self.wait(1 / config.frame_rate)
        done = 0
        for group in groups:
            if not group["auto"]:
                done += 1
                self.next_slide(notes=notes(done))
            anims = []
            for e in group["effects"]:
                mob = mobs.get(e["shape_id"])
                if mob is None:
                    continue
                if e["type"] == WIPE:
                    sid = e["shape_id"]
                    anims.append(Wipe(mob, alpha_of[sid], layer_of[sid], e.get("dir"), e["dur"]))
                elif e["type"] == MOTION:
                    path = next(b["path"] for b in e["behaviors"] if b["type"] == 1)
                    anims.append(Move(mob, path_offset(path), e["dur"]))
            if anims:
                self.play(AnimationGroup(*anims))
            else:
                self.wait(1 / config.frame_rate)


PACING = pacing()

for _info in TIMELINE["slides"]:
    _name = f"S{_info['n']:02d}"
    globals()[_name] = type(_name, (PptSlide,), {"n": _info["n"]})

SCENES = [f"S{s['n']:02d}" for s in TIMELINE["slides"]]
