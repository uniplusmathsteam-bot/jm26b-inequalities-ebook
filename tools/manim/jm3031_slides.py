"""JM30 JM31 Intensive solution guides, made as class slides.

Each guide is a short run of slides in the look of the book's concept films:
a dark ground, one picture per slide, few words, and the answer as a large
fraction. `beat()` ends a slide. render_media.py writes those times to the
guide's "stops" and the reader pauses there until the teacher moves on.

Every slide explains itself on a projector: `step()` puts a numbered caption in
the bar along the foot, and every highlight colour is named on screen next to a
swatch of it (`label()`), so a coloured cell or path never needs a voice-over.

Words are Text so that tools/audit_guides.py checks their spacing; the boxes
behind words sit at z -3, below what the audit looks at.
"""

import numpy as np
from manim import (
    BOLD, DEGREES, DOWN, LEFT, NORMAL, PI, RIGHT, UP, AnimationGroup, AnnularSector, ArcBetweenPoints, Arrow, Circle, Create,
    DashedLine, Dot, FadeIn, FadeOut, GrowArrow, GrowFromCenter, GrowFromEdge, Indicate, LaggedStart, Line, MoveToTarget, Polygon,
    ReplacementTransform, RoundedRectangle, Text, TransformFromCopy, VGroup, VMobject, linear,
)

from guide import GuideScene, Z_TEXT

BG = "#0f172a"
PANEL = "#1e293b"
CELL = "#162238"
EDGE = "#334155"
WIRE = "#64748b"
TXT = "#e2e8f0"
MUTED = "#94a3b8"
FAINT = "#475569"
BLUE = "#60a5fa"
PINK = "#f472b6"
GOLD = "#fbbf24"
GREEN = "#4ade80"
RED = "#f87171"
VIOLET = "#a78bfa"
ORANGE = "#fb923c"
TINT = {GREEN: "#14532d", RED: "#7f1d1d", GOLD: "#713f12", BLUE: "#1e3a8a", PINK: "#831843", VIOLET: "#4c1d95", ORANGE: "#7c2d12"}
FONT = "Cambria"
# Glyphs Cambria draws as a solid box; they are set in SYMBOLS instead.
MISSING = "♥"
SYMBOLS = "Segoe UI Symbol"
Z_BOX = -3
MINUS = "\u2212"


def binary(a, b, depth):
    """Every run of `depth` picks from a and b, as tree kids."""
    return [] if depth == 0 else [(a, binary(a, b, depth - 1)), (b, binary(a, b, depth - 1))]


def signed(n):
    return f"+{n}" if n > 0 else f"{MINUS}{-n}" if n < 0 else "0"


class Slides(GuideScene):
    PAGE = 3
    REGION = (0, 0, 1280, 720)
    Q = ""
    ASK = ()
    HOLD = 1.6
    ASK_RIGHT = 1240

    def setup(self):
        super().setup()
        self.camera.background_color = BG
        self.stops = []

    # ---------- words and numbers ----------

    def pt(self, v):
        """The page point of a scene point."""
        return (float(v[0]) / self.k + self.c[0], self.c[1] - float(v[1]) / self.k)

    def text(self, s, p, size=30, color=TXT, weight=NORMAL, t2c=None, left=False):
        """Words with their capitals centred on page point p (or starting at p when `left`)."""
        key = (FONT, weight, NORMAL)
        if key not in self._caps:
            self._caps[key] = Text("H", font=FONT, weight=weight, font_size=48).height
        t2f = {g: SYMBOLS for g in MISSING if g in s}
        t = Text(s, font=FONT, weight=weight, font_size=48, color=color, t2c=t2c or {}, t2f=t2f)
        t.scale(size * 0.7 * self.k / self._caps[key])
        x, y = self.P(*p)[:2]
        t.shift(np.array([x - (t.get_left()[0] if left else t.get_center()[0]), y - size * 0.35 * self.k - self._baseline(t), 0]))
        return t.set_z_index(Z_TEXT)

    def duo(self, a, b, p, size=30, sep="", ca=BLUE, cb=PINK):
        """A pair such as "MH", the first pick in blue and the second in pink."""
        t = self.text(a + sep + b, p, size)
        n, m = len(a.replace(" ", "")), len(b.replace(" ", ""))
        for g in t.submobjects[:n]:
            g.set_color(ca)
        for g in t.submobjects[len(t.submobjects) - m:]:
            g.set_color(cb)
        return t

    def frac(self, a, b, p, size=64, color=TXT, top=None):
        x, y = p
        num = self.text(str(a), (x, y - size * 0.62), size, top or color)
        den = self.text(str(b), (x, y + size * 0.62), size, color)
        half = max(num.width, den.width) / self.k / 2 + size * 0.14
        bar = Line(self.P(x - half, y), self.P(x + half, y), color=color, stroke_width=self.w(size * 0.055))
        return VGroup(num, bar, den)

    def row(self, mobs, p, gap=20):
        """Mobjects side by side, the row centred on page point p."""
        total = sum(m.width for m in mobs) + gap * self.k * (len(mobs) - 1)
        x, y = self.P(*p)[:2]
        x -= total / 2
        for m in mobs:
            m.move_to(np.array([x + m.width / 2, y, 0]))
            x += m.width + gap * self.k
        return VGroup(*mobs)

    def eq(self, items, p, size=60, colors=None):
        """Fractions (n, d) or (n, d, colour of n) and words in a row centred on p."""
        mobs = []
        for i, it in enumerate(items):
            if isinstance(it, tuple):
                mobs.append(self.frac(it[0], it[1], (0, 0), size, TXT, it[2] if len(it) > 2 else None))
            else:
                mobs.append(self.text(it, (0, 0), size * 0.85, (colors or {}).get(i, TXT)))
        return self.row(mobs, p, size * 0.3)

    def lefted(self, mob, x):
        return mob.shift(RIGHT * (self.P(x, 0)[0] - mob.get_left()[0]))

    # ---------- shapes ----------

    def box(self, p, w, h, fill=CELL, stroke=EDGE, r=10, width=1.6):
        b = RoundedRectangle(width=w * self.k, height=h * self.k, corner_radius=min(r, h / 2 - 0.5, w / 2 - 0.5) * self.k)
        b.set_fill(fill, 1).set_stroke(stroke, self.w(width))
        return b.move_to(self.P(*p)).set_z_index(Z_BOX)

    def tile(self, s, p, w, h, size=44, color=TXT, fill=CELL, stroke=EDGE, weight=NORMAL, r=10):
        return VGroup(self.box(p, w, h, fill, stroke, r), self.text(s, p, size, color, weight))

    def ball(self, p, r, fill, stroke=None):
        c = Circle(radius=r * self.k).set_fill(fill, 1).set_stroke(stroke or fill, self.w(2.2))
        return c.move_to(self.P(*p)).set_z_index(-1)

    def cross(self, p, w, h, color=FAINT, width=2.0):
        x, y = p
        a = Line(self.P(x - w * 0.32, y - h * 0.32), self.P(x + w * 0.32, y + h * 0.32), color=color, stroke_width=self.w(width))
        b = Line(self.P(x - w * 0.32, y + h * 0.32), self.P(x + w * 0.32, y - h * 0.32), color=color, stroke_width=self.w(width))
        return VGroup(a, b).set_z_index(-2)

    def bracket(self, x0, x1, y, over=True, color=TXT, depth=10):
        d = depth if over else -depth
        m = VMobject(stroke_color=color, stroke_width=self.w(2.4))
        m.set_points_as_corners([self.P(x0, y + d), self.P(x0, y), self.P(x1, y), self.P(x1, y + d)])
        return m

    def die(self, n, p, s=44):
        g = VGroup(self.box(p, s, s, "#f1f5f9", "#f1f5f9", r=8))
        q = s * 0.27
        spots = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
                 5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}[n]
        for a, b in spots:
            g.add(Dot(self.P(p[0] + a * q, p[1] + b * q), radius=s * 0.085 * self.k, color=BG).set_z_index(-2))
        return g

    def card(self, s, p, w=40, h=54, size=26):
        return VGroup(self.box(p, w, h, "#f8fafc", "#f8fafc", r=6), self.text(s, p, size, BG, BOLD))

    def coin(self, s, p, fill, r=28, size=22):
        c = Circle(radius=r * self.k).set_fill(fill, 1).set_stroke("#ffffff", self.w(1.4), opacity=0.5)
        return VGroup(c.move_to(self.P(*p)).set_z_index(Z_BOX), self.text(s, p, size, BG, BOLD))

    # ---------- slides ----------

    def header(self):
        chip = self.tile(self.Q, (78, 52), 96, 52, 28, BG, GOLD, GOLD, BOLD, r=12)
        lines = [self.text(s, (148, 52 + 40 * i), 26, TXT, left=True) for i, s in enumerate(self.ASK)]
        for t in lines:
            right = self.pt(t.get_right())[0]
            if right > self.ASK_RIGHT:
                print(f"  {type(self).__name__}: question line runs to x = {right:.0f}")
        self.add(chip, *lines)

    def step(self, s):
        """The slide's caption in the bar along the foot: what this slide shows. Content keeps above y 640."""
        self.n_step = getattr(self, "n_step", 0) + 1
        if not hasattr(self, "bar"):
            self.bar = self.box((640, 678), 1200, 44, PANEL, EDGE, r=10)
            self.add(self.bar)
        chip = self.tile(str(self.n_step), (70, 678), 36, 32, 22, BG, GOLD, GOLD, BOLD, r=8)
        words = self.text(s, (100, 672), 25, TXT, left=True)
        if self.pt(words.get_right())[0] > 1220:
            print(f"  {type(self).__name__}: caption {self.n_step} runs to x = {self.pt(words.get_right())[0]:.0f}")
        new = VGroup(chip, words)
        old = getattr(self, "cap", None)
        if old is None:
            self.add(new)
        else:
            self.add(new.set_opacity(0))
            self.play(old.animate.set_opacity(0), new.animate.set_opacity(1), run_time=0.4)
            self.remove(old)
        self.cap = new

    def swatch(self, kind, color, p):
        """A small sample of a highlight: cell, outline, dim, cross, path, ring or dot."""
        if kind == "cell":
            return self.box(p, 34, 26, TINT.get(color, CELL), color, r=6, width=2.2)
        if kind == "outline":
            return self.box(p, 34, 26, CELL, color, r=6, width=3.2)
        if kind == "dim":
            return self.box(p, 34, 26, CELL, EDGE, r=6)
        if kind == "cross":
            return VGroup(self.box(p, 34, 26, CELL, EDGE, r=6), self.cross(p, 34, 26, color, 2.6))
        if kind == "path":
            line = Line(self.P(p[0] - 18, p[1] + 9), self.P(p[0] + 7, p[1] - 4), color=color, stroke_width=self.w(4))
            node = Circle(radius=7 * self.k).set_fill(CELL, 1).set_stroke(color, self.w(2.4)).move_to(self.P(p[0] + 13, p[1] - 7))
            return VGroup(line, node).set_z_index(-2)
        if kind == "ring":
            c = Circle(radius=12 * self.k).set_fill(TINT.get(color, CELL), 1).set_stroke(color, self.w(2.4))
            return c.move_to(self.P(*p)).set_z_index(Z_BOX)
        return Dot(self.P(*p), radius=9 * self.k, color=color).set_z_index(-2)

    def label(self, kind, color, words, p, size=26, ink=None, left=False):
        """A highlight's swatch, then what it means; centred on p, or starting at p when `left`."""
        x, y = p
        t = self.text(words, (0, y), size, ink or (MUTED if kind == "dim" else color), left=True)
        x0 = x if left else x - (46 + t.width / self.k) / 2
        self.lefted(t, x0 + 46)
        return VGroup(self.swatch(kind, color, (x0 + 17, y)), t)

    def beat(self, hold=None):
        """The end of a slide: hold the picture, and mark where the reader pauses."""
        self.wait(self.HOLD if hold is None else hold)
        self.stops.append(round(self.renderer.time - 0.1, 2))
        self.wait(0.1)

    def answer(self, letter, p=(1150, 52)):
        g = VGroup(self.box(p, 200, 58, GOLD, GOLD, r=29), self.text(f"Answer {letter}", p, 30, BG, BOLD))
        self.play(GrowFromCenter(g), run_time=0.6)
        self.wait(2.2)

    def tally(self, n, d, p, top, bottom="outcomes", color=GOLD, size=72, simple=None, kind=None):
        """n/d with the favourable count in colour, named above (after the highlight's swatch) and below; then = a/b."""
        x, y = p
        fx = x - 80 if simple else x
        name = self.label(kind, color, top, (fx, y - size * 1.45)) if kind else self.text(top, (fx, y - size * 1.45), 26, color)
        parts = [name, self.frac(n, d, (fx, y), size, TXT, color),
                 self.text(bottom, (fx, y + size * 1.45), 26, MUTED)]
        if simple:
            parts += [self.text("=", (x + 12, y), size * 0.8), self.frac(*simple, (x + 96, y), size)]
        return VGroup(*parts)

    def part(self, tag, caption, items, x, y, size=50, color=GOLD, kind=None):
        """One part's answer: "(a)" and its fractions on a line, the event named above after its swatch."""
        lab = self.text(tag, (x, y), 32, color, BOLD, left=True)
        at = (x + 70, y - size * 1.4)
        cap = self.label(kind, color, caption, at, left=True) if kind else self.text(caption, at, 26, color, left=True)
        eq = self.lefted(self.eq(items, (0, y), size), x + 70)
        return VGroup(lab, cap, eq)

    def show(self, *mobs, rt=0.6):
        self.play(*[FadeIn(m) for m in mobs], run_time=rt)

    def jot(self, *mobs, rt=0.6):
        """Working for this slide only: shown now, cleared by the next wipe()."""
        self.scratch = getattr(self, "scratch", []) + list(mobs)
        self.show(*mobs, rt=rt)

    def wipe(self, rt=0.4):
        if getattr(self, "scratch", None):
            self.play(*[FadeOut(m) for m in self.scratch], run_time=rt)
        self.scratch = []

    # ---------- guided working: one reasoning move per click ----------

    def at_x(self, mob, x):
        """Centre a mobject on page x, kept inside the frame."""
        mob.shift(RIGHT * (self.P(x, 0)[0] - mob.get_center()[0]))
        return self.inside(mob)

    def inside(self, mob, margin=30):
        x0, x1 = self.pt(mob.get_left())[0], self.pt(mob.get_right())[0]
        dx = min(0, 1280 - margin - x1) or max(0, margin - x0)
        return mob.shift(RIGHT * dx * self.k)

    def join(self, src, dst, color=MUTED, gap=8, width=2.6):
        """An arrow from the edge of src to the edge of dst, across the wider of the two gaps."""
        c1, c2 = src.get_center(), dst.get_center()
        d = c2 - c1
        if abs(d[1]) - (src.height + dst.height) / 2 >= abs(d[0]) - (src.width + dst.width) / 2:
            a = np.array([c1[0], src.get_bottom()[1] if d[1] < 0 else src.get_top()[1], 0])
            b = np.array([c2[0], dst.get_top()[1] if d[1] < 0 else dst.get_bottom()[1], 0])
        else:
            a = np.array([src.get_right()[0] if d[0] > 0 else src.get_left()[0], c1[1], 0])
            b = np.array([dst.get_left()[0] if d[0] > 0 else dst.get_right()[0], c2[1], 0])
        u = (b - a) / np.linalg.norm(b - a)
        return Arrow(a + u * gap * self.k, b - u * gap * self.k, buff=0, color=color, stroke_width=self.w(width),
                     tip_length=12 * self.k, max_tip_length_to_length_ratio=0.45,
                     max_stroke_width_to_length_ratio=1000).set_z_index(1)

    def double(self, mob, color=TXT, width=2.2):
        """The double underline of a final answer."""
        x0, x1 = self.pt(mob.get_left())[0] - 6, self.pt(mob.get_right())[0] + 6
        y = self.pt(mob.get_bottom())[1] + 8
        return VGroup(*[Line(self.P(x0, y + d), self.P(x1, y + d), color=color, stroke_width=self.w(width)) for d in (0, 6)])

    def ring(self, mobs, color=BLUE, pad=8, width=2.6):
        """An outline round a group, such as the whole sample space."""
        g = VGroup(*mobs)
        r = RoundedRectangle(width=g.width + 2 * pad * self.k, height=g.height + 2 * pad * self.k, corner_radius=12 * self.k)
        return r.set_fill(opacity=0).set_stroke(color, self.w(width)).move_to(g.get_center()).set_z_index(-2)

    def fraction(self, name, n, d, p, size=48, simple=None, ncol=GOLD, dcol=BLUE):
        """The line "name = n/d (= a/b)", laid out in full once so that nothing shifts as its parts arrive.
        The numerator waits as a "?" until the favourable outcomes are counted."""
        row = self.eq([name, "=", (n, d)] + (["=", simple] if simple else []), p, size)
        F = {"row": row, "name": row[0], "eq": row[1], "frac": row[2], "num": row[2][0], "bar": row[2][1],
             "den": row[2][2], "rest": VGroup(*row[3:])}
        F["num"].set_color(ncol)
        F["den"].set_color(dcol)
        F["q"] = self.text("?", self.pt(F["num"].get_center()), size, MUTED)
        F["x"] = self.pt(F["frac"].get_center())[0]
        return F

    def den_click(self, F, label, *anims):
        """All the outcomes, counted (anims light them, then `label` names the count), an arrow down to the
        denominator, and "name = ?/d" with the denominator alone under the bar."""
        if anims:
            self.play(*anims, run_time=1.4)
        self.play(FadeIn(label), run_time=0.6)
        arrow = self.join(label, F["den"], F["den"].get_color())
        self.play(GrowArrow(arrow), run_time=0.6)
        self.play(FadeIn(F["name"]), FadeIn(F["eq"]), Create(F["bar"]), FadeIn(F["q"]), FadeIn(F["den"], scale=1.5), run_time=0.8)
        return arrow

    def counter(self, kind, color, words, x, y, size=28, start="0"):
        """A highlight's swatch, its name and a running count, centred on page x."""
        lab = self.label(kind, color, words, (0, y), size, left=True)
        nx = self.pt(lab.get_right())[0] + 12
        num = self.text(start, (nx, y), size + 4, color, BOLD, left=True)
        dx = x - self.pt(VGroup(lab, num).get_center())[0]
        dx += min(0, 1250 - 24 - (self.pt(num.get_right())[0] + dx))
        lab.shift(RIGHT * dx * self.k)
        num.shift(RIGHT * dx * self.k)
        return {"lab": lab, "num": num, "x": nx + dx, "y": y, "size": size + 4, "color": color, "n": 0}

    def tick(self, C, *anims, rt=0.5, value=None):
        """One more favourable outcome lights up (anims) and the running count goes up by one."""
        C["n"] += 1
        new = self.text(str(C["n"] if value is None else value), (C["x"], C["y"]), C["size"], C["color"], BOLD, left=True)
        self.play(*anims, ReplacementTransform(C["num"], new), run_time=rt)
        C["num"] = new

    def num_click(self, F, C):
        """An arrow from the count to the numerator, and the count drops into the place of the "?"."""
        arrow = self.join(VGroup(C["lab"], C["num"]), F["num"], C["color"])
        self.play(GrowArrow(arrow), run_time=0.6)
        self.play(FadeOut(F["q"]), TransformFromCopy(C["num"], F["num"]), run_time=0.9)
        return arrow

    def settle(self, F, *fade):
        """The fraction simplified (when it can be) and the final answer double underlined; `fade` clears
        connectors the underline would cross."""
        if fade:
            self.play(*[FadeOut(m) for m in fade], run_time=0.4)
        if len(F["rest"]):
            self.play(FadeIn(F["rest"], shift=LEFT * 0.15), run_time=0.8)
        u = self.double(F["rest"][-1] if len(F["rest"]) else F["frac"])
        self.play(Create(u), run_time=0.6)
        return u

    # ---------- letter tiles and bags ----------

    def letters(self, s, y, w, h, gap, size):
        x0 = 640 - (len(s) * w + (len(s) - 1) * gap) / 2 + w / 2
        xs = [x0 + i * (w + gap) for i in range(len(s))]
        return [self.tile(ch, (x, y), w, h, size) for ch, x in zip(s, xs)], xs

    def bag(self, groups, pick, y, r, step, gap, total_word, pick_word, then):
        """Balls in colour groups; `pick` names the favourable groups, which sit side by side.
        `then` is the caption of the slide that picks them out."""
        total = sum(g[0] for g in groups)
        x = 640 - ((total - 1) * step + (len(groups) - 1) * gap) / 2
        sets, names, spans = [], [], []
        for n, fill, stroke, word, ink in groups:
            xs = [x + step * k for k in range(n)]
            x = xs[-1] + step + gap
            sets.append(VGroup(*[self.ball((bx, y), r, fill, stroke) for bx in xs]))
            names.append(self.text(word, ((xs[0] + xs[-1]) / 2, y + r + 40), 26, ink))
            spans.append((xs[0], xs[-1]))
        self.add(*sets, *names)
        self.beat()
        self.step(then)
        x0, x1 = spans[0][0] - r, spans[-1][1] + r
        p0, p1 = spans[pick[0]][0] - r, spans[pick[-1]][1] + r
        over = self.bracket(x0, x1, y - r - 16, over=True)
        under = self.bracket(p0, p1, y + r + 16, over=False, color=GREEN)
        self.play(*[FadeOut(t) for t in names],
                  *[s.animate.set_opacity(0.22) for i, s in enumerate(sets) if i not in pick], run_time=0.7)
        self.play(Create(over), FadeIn(self.text(total_word, (640, y - r - 50), 30)), run_time=0.6)
        self.play(Create(under), FadeIn(self.text(pick_word, ((p0 + p1) / 2, y + r + 52), 30, GREEN)), run_time=0.6)
        self.beat()

    # ---------- tree diagrams ----------

    def tree(self, kids, xs, top, bottom, look, out_x, t2c=None, heads=(), head_y=150, size=28, r=21,
             note=None, out_size=30, outcome=None):
        """kids: [(label, kids)], leaves with []. look(label, depth) is a node's colour. `note` (w, h)
        draws nodes as banknotes. Returns the root, the levels of nodes and the leaves."""
        leaves, levels = [], [[] for _ in xs[1:]]

        def count(ks):
            return sum(count(k[1]) if k[1] else 1 for k in ks)

        step = (bottom - top) / max(count(kids) - 1, 1)
        root = {"x": xs[0], "hw": 7, "path": [], "kids": []}

        def place(ks, parent, depth):
            ys = []
            for label, sub in ks:
                node = {"label": label, "depth": depth, "x": xs[depth], "parent": parent, "kids": []}
                parent["kids"].append(node)
                levels[depth - 1].append(node)
                if sub:
                    node["y"] = float(np.mean(place(sub, node, depth + 1)))
                else:
                    node["y"] = top + step * len(leaves)
                    leaves.append(node)
                ys.append(node["y"])
            return ys

        root["y"] = float(np.mean(place(kids, root, 1)))
        root["mob"] = Dot(self.P(root["x"], root["y"]), radius=7 * self.k, color=MUTED).set_z_index(-2)
        for level in levels:
            for node in level:
                color = node["color"] = look(node["label"], node["depth"])
                p = (node["x"], node["y"])
                if note:
                    shape = self.box(p, *note, TINT[color], color, r=6, width=2)
                    node["hw"] = note[0] / 2
                    node["ink"] = TXT
                else:
                    shape = Circle(radius=r * self.k).set_fill(CELL, 1).set_stroke(color, self.w(2.4))
                    shape.move_to(self.P(*p)).set_z_index(Z_BOX)
                    node["hw"] = r
                    node["ink"] = color
                node["mob"] = VGroup(shape, self.text(node["label"], p, size, node["ink"]))
                up = node["parent"]
                node["line"] = Line(self.P(up["x"] + up["hw"], up["y"]), self.P(node["x"] - node["hw"], node["y"]),
                                    color=WIRE, stroke_width=self.w(2))
                node["path"] = up["path"] + [node]
        for leaf in leaves:
            word = "".join(n["label"] for n in leaf["path"])
            leaf["word"] = word
            shown = outcome(leaf) if outcome else word
            leaf["out"] = self.text(shown, (out_x, leaf["y"]), out_size, TXT, t2c=t2c, left=True)
        head = VGroup(*[self.text(h, (x, head_y), 22, MUTED) for h, x in heads])
        return {"root": root["mob"], "levels": levels, "leaves": leaves, "heads": head, "size": out_size}

    def grow(self, T, rt=0.7):
        self.play(FadeIn(T["root"]), run_time=0.3)
        for level in T["levels"]:
            self.play(*[Create(n["line"]) for n in level], run_time=rt * 0.6)
            self.play(*[FadeIn(n["mob"], scale=0.5) for n in level], run_time=rt * 0.5)
        self.play(LaggedStart(*[FadeIn(l["out"], shift=LEFT * 0.15) for l in T["leaves"]], lag_ratio=0.12), run_time=1.0)

    def recolor(self, T, judge):
        """Nodes take the colour judge(node) gives them (right green, wrong red)."""
        anims = []
        for level in T["levels"]:
            for n in level:
                c = n["color"] = n["ink"] = judge(n)
                anims += [n["mob"][0].animate.set_stroke(c).set_fill(TINT[c], 1), n["mob"][1].animate.set_color(c)]
        self.play(*anims, run_time=0.8)

    def leaf_box(self, T, leaf, color):
        g = VGroup(leaf["out"], *([leaf["extra"]] if "extra" in leaf else []))
        w = g.width / self.k + 26
        return self.box(self.pt(g.get_center()), w, T["size"] * 0.7 + 20, TINT[color], color, r=8, width=2)

    def light(self, T, picks, color=GOLD):
        """The paths to the picked outcomes turn `color` and the rest of the tree dims."""
        on = {id(n) for i in picks for n in T["leaves"][i]["path"]}
        anims = []
        for level in T["levels"]:
            for n in level:
                lit = id(n) in on
                anims += [n["line"].animate.set_stroke(color if lit else EDGE, self.w(3.4 if lit else 1.6)),
                          n["mob"].animate.set_opacity(1 if lit else 0.3)]
        for i, leaf in enumerate(T["leaves"]):
            for m in [leaf["out"]] + ([leaf["extra"]] if "extra" in leaf else []):
                anims.append(m.animate.set_opacity(1 if i in picks else 0.3))
        boxes = VGroup(*[self.leaf_box(T, T["leaves"][i], color) for i in picks])
        self.play(*anims, FadeIn(boxes), run_time=0.9)
        return boxes

    def unlight(self, T, boxes):
        anims = [FadeOut(boxes)]
        for level in T["levels"]:
            for n in level:
                anims += [n["line"].animate.set_stroke(WIRE, self.w(2)), n["mob"].animate.set_opacity(1)]
        for leaf in T["leaves"]:
            for m in [leaf["out"]] + ([leaf["extra"]] if "extra" in leaf else []):
                anims.append(m.animate.set_opacity(1))
        self.play(*anims, run_time=0.5)

    def leaves_of(self, leaf):
        return [leaf["out"]] + ([leaf["extra"]] if "extra" in leaf else [])

    def leaf_mark(self, T, leaf, color=BLUE):
        """An outline round one outcome: counted in the sample space."""
        g = VGroup(*self.leaves_of(leaf))
        return self.box(self.pt(g.get_center()), g.width / self.k + 26, T["size"] * 0.7 + 20, CELL, color, r=8, width=1.8)

    def dim_tree(self, T):
        anims = []
        for level in T["levels"]:
            for n in level:
                anims += [n["line"].animate.set_stroke(EDGE, self.w(1.6)), n["mob"].animate.set_opacity(0.3)]
        for leaf in T["leaves"]:
            anims += [m.animate.set_opacity(0.3) for m in self.leaves_of(leaf)]
        return anims

    def trace(self, T, i, color=GOLD):
        """Light one path of a dimmed tree: (animations, the box round its outcome)."""
        leaf = T["leaves"][i]
        anims = []
        for n in leaf["path"]:
            anims += [n["line"].animate.set_stroke(color, self.w(3.4)), n["mob"].animate.set_opacity(1)]
        anims += [m.animate.set_opacity(1) for m in self.leaves_of(leaf)]
        box = self.leaf_box(T, leaf, color)
        return anims + [FadeIn(box)], box

    def legend(self, items, x, y, gap=40):
        """Lines such as "B = boy", the letter in its colour."""
        return VGroup(*[self.text(f"{a} = {b}", (x, y + gap * i), 26, TXT, t2c={a: c}) for i, (a, b, c) in enumerate(items)])

    # ---------- tables ----------

    def table(self, rows, cols, x0, y0, cw, ch, value, hw=None, hh=None, size=30, head=None,
              row_title=None, col_title=None, ink=None):
        """value(i, j) is a cell's text, None for a cell left out. head(label, p, w, h) draws a
        header instead of a plain tile; ink(i, j, s, p) draws a cell's text."""
        hw, hh, g = hw or cw, hh or ch, 6
        T = {"cells": {}, "frame": VGroup(), "blank": {}, "titles": VGroup()}
        for j, lab in enumerate(cols):
            p = (x0 + hw + cw * (j + 0.5), y0 + hh / 2)
            T["frame"].add(head(lab, p, cw - g, hh - g) if head else self.tile(lab, p, cw - g, hh - g, size + 4, PINK, PANEL))
        for i, lab in enumerate(rows):
            p = (x0 + hw / 2, y0 + hh + ch * (i + 0.5))
            T["frame"].add(head(lab, p, hw - g, ch - g) if head else self.tile(lab, p, hw - g, ch - g, size + 4, BLUE, PANEL))
        for i in range(len(rows)):
            for j in range(len(cols)):
                p = (x0 + hw + cw * (j + 0.5), y0 + hh + ch * (i + 0.5))
                b = self.box(p, cw - g, ch - g, CELL, EDGE, r=8)
                T["frame"].add(b)
                s = value(i, j)
                if s is None:
                    T["blank"][(i, j)] = self.cross(p, cw - g, ch - g)
                    T["frame"].add(T["blank"][(i, j)])
                    continue
                T["cells"][(i, j)] = (b, ink(i, j, s, p) if ink else self.text(s, p, size))
        if col_title:
            T["titles"].add(self.text(col_title, (x0 + hw + cw * len(cols) / 2, y0 - 24), 24, PINK))
        if row_title:
            T["titles"].add(self.text(row_title, (x0 - 24, y0 + hh + ch * len(rows) / 2), 24, BLUE).rotate(PI / 2))
        T["right"] = x0 + hw + cw * len(cols)
        return T

    def fill(self, T, key=lambda ij: ij[0], rt=1.8):
        """Write the cells in waves: cells with the same key appear together."""
        waves = {}
        for ij, (b, t) in T["cells"].items():
            waves.setdefault(key(ij), []).append(t)
        self.play(LaggedStart(*[AnimationGroup(*[FadeIn(t, scale=0.6) for t in waves[k]]) for k in sorted(waves)],
                              lag_ratio=0.35), run_time=rt)

    def paint(self, T, keys, color):
        anims = []
        for key in keys:
            b, t = T["cells"][key]
            anims += [b.animate.set_fill(TINT[color], 1).set_stroke(color, self.w(2.2)), t.animate.set_color(color)]
        return anims

    def mute(self, T, keys):
        return [T["cells"][k][1].animate.set_color(FAINT) for k in keys]

    def unpaint(self, T, keys=None):
        anims = []
        for key in keys or T["cells"]:
            b, t = T["cells"][key]
            anims += [b.animate.set_fill(CELL, 1).set_stroke(EDGE, self.w(1.6)), t.animate.set_color(TXT)]
        return anims

    def dice_table(self, f, x0=104, y0=168, c=70):
        head = lambda lab, p, w, h: VGroup(self.box(p, w, h, PANEL, EDGE, r=8), self.die(int(lab), p, 44))
        nums = [str(i) for i in range(1, 7)]
        return self.table(nums, nums, x0, y0, c, c - 4, lambda i, j: str(f(i + 1, j + 1)), size=30, head=head,
                          row_title="1st dice", col_title="2nd dice")

    def card_table(self, cards, f, x0, y0, cw, ch, size=30, cs=(40, 54, 26)):
        head = lambda lab, p, w, h: VGroup(self.box(p, w, h, PANEL, EDGE, r=8), self.card(lab, p, *cs))
        return self.table([str(c) for c in cards], [str(c) for c in cards], x0, y0, cw, ch,
                          lambda i, j: None if i == j else str(f(cards[i], cards[j])), size=size, head=head,
                          row_title="1st card", col_title="2nd card")


class Guided(Slides):
    """The featured questions, taught one reasoning move per click. A probability is never shown whole:
    the sample space is counted and joined to a denominator under a "?", the favourable outcomes light up
    one at a time with a running count, the count is joined to the numerator, and only then is the
    fraction simplified and double underlined. Each part gets its own run of clicks."""
    HOLD = 2.0


# ======================= counting =======================


class Q1(Slides):
    Q = "Q1"
    ASK = ("Which of the following CANNOT be the probability of an event?",)
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("Four values. Which one can never be a probability?")
        opts = [("A", ("π", 7), np.pi / 7), ("B", (8, 7), 8 / 7), ("C", "0.005", 0.005), ("D", (2024, 2025), 2024 / 2025)]
        cards = []
        for i, (letter, v, _) in enumerate(opts):
            x, y = 250 + 260 * i, 240
            val = self.frac(*v, (x + 12, y + 8), 40 if i == 3 else 46) if isinstance(v, tuple) else self.text(v, (x + 12, y + 8), 46)
            cards.append(VGroup(self.box((x, y), 210, 150, CELL, EDGE, r=14), self.text(letter, (x - 80, y - 50), 28, GOLD, BOLD), val))
        self.add(*cards)
        self.beat()

        def X(v):
            return 140 + 800 * v

        y = 450
        self.step("Every probability lies from 0 (impossible) to 1 (certain).")
        axis = Line(self.P(X(0), y), self.P(X(1), y), color=TXT, stroke_width=self.w(4))
        ticks = VGroup(*[Line(self.P(X(v), y - 14), self.P(X(v), y + 14), color=TXT, stroke_width=self.w(3)) for v in (0, 0.5, 1)])
        zone = self.box((1091, y), 278, 64, TINT[RED], TINT[RED], r=8)
        words = VGroup(self.text("0", (X(0), y + 52), 34), self.text("1", (X(1), y + 52), 34),
                       self.text("impossible", (X(0), y + 96), 24, MUTED), self.text("certain", (X(1), y + 96), 24, MUTED),
                       self.text("greater than 1", (1091, y + 96), 24, RED))
        self.play(Create(axis), FadeIn(ticks), run_time=0.8)
        self.play(FadeIn(zone), FadeIn(words), run_time=0.6)
        self.beat()

        self.step("Place each value on the scale.")
        pins = []
        for letter, v, val in opts:
            x, color = X(val), (RED if val > 1 else GREEN)
            pins.append((Dot(self.P(x, y), radius=9 * self.k, color=color).set_z_index(2),
                         Line(self.P(x, y - 12), self.P(x, y - 50), color=color, stroke_width=self.w(2.4)),
                         self.text(letter, (x, y - 72), 30, color, BOLD)))
        self.play(LaggedStart(*[AnimationGroup(TransformFromCopy(cards[i][1], lab), GrowFromCenter(dot), Create(stem))
                                for i, (dot, stem, lab) in enumerate(pins)], lag_ratio=0.45), run_time=2.6)
        self.show(self.label("dot", GREEN, "from 0 to 1: can be a probability", (140, 604), left=True))
        self.beat()

        self.step("8/7 is greater than 1, so it cannot be a probability.")
        self.play(cards[1][0].animate.set_fill(TINT[RED], 1).set_stroke(RED, self.w(3)),
                  *[c.animate.set_opacity(0.35) for i, c in enumerate(cards) if i != 1], run_time=0.7)
        self.show(self.eq([(8, 7, RED), ">", "1"], (760, 596), 48))
        self.answer("B")


class Q2(Slides):
    Q = "Q2"
    ASK = ("A letter is chosen at random from the word ‘ELEPHANT’.", "Find the probability of choosing a letter ‘M’.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("‘ELEPHANT’ has 8 letters, and each is equally likely to be chosen.")
        tiles, xs = self.letters("ELEPHANT", 340, 110, 128, 18, 60)
        self.add(*tiles)
        self.beat()
        self.step("Slide the gold ‘M’ along the word and compare it with every letter.")
        m = self.tile("M", (xs[0], 196), 92, 104, 56, GOLD, CELL, GOLD)
        self.play(FadeIn(m, shift=DOWN * 0.3), run_time=0.5)
        self.play(m.animate.move_to(self.P(xs[-1], 196)),
                  LaggedStart(*[t[1].animate.set_color(FAINT) for t in tiles], lag_ratio=1.0), run_time=2.4, rate_func=linear)
        self.play(m[0].animate.set_stroke(RED), m[1].animate.set_color(RED), FadeIn(self.cross((xs[-1], 196), 92, 104, RED, 4)),
                  FadeIn(self.label("cross", RED, "There is no letter ‘M’ in the word.", (640, 476), 34)), run_time=0.6)
        self.beat()
        self.step("No outcome is favourable, so P(M) = 0: the event is impossible.")
        self.show(self.eq(["P(M)", "=", ("0", 8, RED), "=", "0"], (640, 580), 60))
        self.answer("A")


class Q3(Slides):
    Q = "Q3"
    ASK = ("A digit is chosen at random from the password ‘19357713’.", "Find the probability of getting an odd digit.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("The password has 8 digits, and each is equally likely to be chosen.")
        tiles, xs = self.letters("19357713", 320, 110, 128, 18, 60)
        self.add(*tiles)
        self.beat()
        self.step("Colour every odd digit (1, 3, 5, 7 or 9) green.")
        self.play(LaggedStart(*[AnimationGroup(t[0].animate.set_fill(TINT[GREEN], 1).set_stroke(GREEN, self.w(2.4)),
                                               t[1].animate.set_color(GREEN)) for t in tiles], lag_ratio=0.3), run_time=2.0)
        self.show(self.label("cell", GREEN, "odd digit: all 8 of them", (640, 460), 34))
        self.beat()
        self.step("Every outcome is favourable, so P(odd) = 1: the event is certain.")
        self.show(self.eq(["P(odd)", "=", (8, 8, GREEN), "=", "1"], (640, 576), 60))
        self.answer("D")


class Q4(Slides):
    Q = "Q4"
    ASK = ("A letter is chosen at random from the word ‘UNIVERSITY’.", "Find the probability that it is a vowel.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("‘UNIVERSITY’ has 10 letters, and each is equally likely to be chosen.")
        tiles, xs = self.letters("UNIVERSITY", 370, 96, 116, 14, 54)
        self.add(*tiles)
        self.beat()
        self.step("Lift out the vowels (A, E, I, O, U) and colour them gold.")
        vowels = [0, 2, 4, 7]
        for i in vowels:
            tiles[i].generate_target()
            tiles[i].target.shift(UP * 130 * self.k)
            tiles[i].target[0].set_fill(TINT[GOLD], 1).set_stroke(GOLD, self.w(2.4))
            tiles[i].target[1].set_color(GOLD)
        self.play(*[MoveToTarget(tiles[i]) for i in vowels],
                  *[tiles[i][1].animate.set_color(FAINT) for i in range(10) if i not in vowels], run_time=1.0)
        self.show(VGroup(self.label("cell", GOLD, "vowel: 4", (500, 494), 32), self.label("dim", None, "not a vowel: 6", (800, 494), 32)))
        self.beat()
        self.step("P(vowel) = number of vowels ÷ number of letters.")
        self.show(self.eq(["P(vowel)", "=", (4, 10, GOLD), "=", (2, 5)], (640, 586), 54))
        self.answer("C")


class Q5(Slides):
    Q = "Q5"
    ASK = ("A bag has 2 white, 5 black, 9 yellow and 4 orange balls. A ball is",
           "drawn at random. Find the probability that it is black or yellow.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("20 balls in the bag, and each is equally likely to be drawn.")
        self.bag([(2, "#f8fafc", "#f8fafc", "2 white", TXT), (5, "#0b0f19", "#cbd5e1", "5 black", TXT),
                  (9, "#facc15", "#facc15", "9 yellow", "#facc15"), (4, ORANGE, ORANGE, "4 orange", ORANGE)],
                 [1, 2], 300, 22, 54, 30, "20 balls", "14 black or yellow",
                 "Dim the white and orange balls: 5 + 9 = 14 are black or yellow.")
        self.step("P(black or yellow) = favourable balls ÷ all balls.")
        self.show(self.eq(["P(black or yellow)", "=", (14, 20, GREEN), "=", (7, 10)], (640, 540), 56))
        self.answer("C")


class Q6(Slides):
    Q = "Q6"
    ASK = ("A box has 4 red, 1 green and 3 yellow marbles. A marble is drawn",
           "at random. Find the probability that it is not yellow.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("8 marbles in the box, and each is equally likely to be drawn.")
        self.bag([(4, "#ef4444", "#ef4444", "4 red", RED), (1, "#22c55e", "#22c55e", "1 green", GREEN),
                  (3, "#facc15", "#facc15", "3 yellow", "#facc15")],
                 [0, 1], 310, 34, 84, 40, "8 marbles", "5 not yellow",
                 "‘Not yellow’ means red or green: 4 + 1 = 5 marbles.")
        self.step("P(not yellow) = 5 out of 8 marbles.")
        self.show(self.eq(["P(not yellow)", "=", (5, 8, GREEN)], (640, 556), 60))
        self.answer("D")


class Q9(Slides):
    Q = "Q9"
    ASK = ("8◆9 is a 3-digit number, where ◆ is an integer from 0 to 9",
           "inclusive. Find the probability that it is divisible by 7.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("◆ can be any digit from 0 to 9, so there are 10 equally likely numbers.")
        xs = [640 + (d - 4.5) * 112 for d in range(10)]
        tiles = []
        for d, x in enumerate(xs):
            t = self.tile(f"8{d}9", (x, 222), 100, 66, 34)
            t[1][1].set_color(GOLD)
            tiles.append(t)
        self.play(LaggedStart(*[FadeIn(t, shift=DOWN * 0.2) for t in tiles], lag_ratio=0.08), run_time=1.2)
        self.show(self.text("◆ = 0, 1, 2, …, 9: 10 numbers", (640, 150), 28, GOLD))
        self.beat()

        self.step("770 = 7 × 110 is divisible by 7, and so is every number we reach by adding 7s.")
        y = 452

        def X(v):
            return 96 + (v - 770) * 8.4

        axis = Line(self.P(X(766), y), self.P(X(905), y), color=WIRE, stroke_width=self.w(3))
        steps = list(range(770, 900, 7))
        dots = VGroup(*[Dot(self.P(X(v), y), radius=4.5 * self.k, color=TXT).set_z_index(1) for v in steps])
        nums = VGroup(*[self.text(str(v), (X(v), y + 30), 17, MUTED) for v in steps])
        hops = VGroup(*[ArcBetweenPoints(self.P(X(a), y - 6), self.P(X(a + 7), y - 6), angle=-PI / 2.2,
                                         color=BLUE, stroke_width=self.w(2.2)) for a in steps[:-1]])
        start = self.text("770 = 7 × 110", (X(770) + 40, y - 74), 26, BLUE)
        plus = self.text("+7", ((X(770) + X(777)) / 2, y - 40), 22, BLUE)
        self.play(Create(axis), FadeIn(dots), FadeIn(nums), FadeIn(start), run_time=0.9)
        self.play(FadeIn(plus), LaggedStart(*[Create(h) for h in hops], lag_ratio=0.25), run_time=2.6)
        links = VGroup(*[DashedLine(self.P(xs[d], 256), self.P(X(809 + 10 * d), y - 12), color=FAINT,
                                    stroke_width=self.w(1.4), dash_length=0.08) for d in range(10)])
        self.play(Create(links), run_time=0.8)
        hint = self.label("dot", TXT, "a multiple of 7: where a hop lands", (640, 548), 26)
        self.show(hint)
        self.beat()

        self.step("8◆9 ends in 9. The hops that land on a units digit 9: 770 + 49 and 770 + 70 + 49.")
        hits = {1: 819, 8: 889}
        rings = VGroup(*[Circle(radius=11 * self.k).set_stroke(GREEN, self.w(3)).move_to(self.P(X(v), y)) for v in hits.values()])
        sums = VGroup(self.text("770 + 49 = 819", (X(819), y + 82), 28, GREEN),
                      self.text("770 + 70 + 49 = 889", (X(889) - 40, y + 82), 28, GREEN))
        self.play(*[AnimationGroup(tiles[d][0].animate.set_fill(TINT[GREEN], 1).set_stroke(GREEN, self.w(2.6)),
                                   tiles[d][1].animate.set_color(GREEN)) for d in hits],
                  *[tiles[d][1].animate.set_opacity(0.35) for d in range(10) if d not in hits],
                  *[links[d].animate.set_opacity(0.15) for d in range(10) if d not in hits],
                  *[links[d].animate.set_stroke(GREEN, self.w(2.4)) for d in hits],
                  start.animate.set_opacity(0.3), FadeOut(hint), Create(rings), run_time=1.0)
        self.show(sums)
        key = VGroup(self.label("cell", GREEN, "divisible by 7", (460, 604), 26),
                     self.label("dim", None, "not divisible by 7", (820, 604), 26))
        self.show(key)
        self.beat()

        self.step("◆ = 1 or 8: 2 of the 10 numbers. P(divisible by 7) = 2/10 = 1/5.")
        self.play(*[FadeOut(m) for m in (axis, dots, nums, hops, plus, start, links, rings, sums, key)], run_time=0.5)
        self.show(self.text("◆ = 1 or 8", (640, 380), 40, GREEN))
        self.show(self.eq(["P(divisible by 7)", "=", (2, 10, GREEN), "=", (1, 5)], (640, 486), 56))
        self.answer("A", (640, 588))


class Q10(Guided):
    Q = "Q10"
    ASK = ("7♣♥ is a 3-digit number, where ♣ and ♥ are integers from 0 to 9",
           "inclusive. Find the probability that it is divisible by 7.")
    ASK_RIGHT = 1040

    def construct(self):
        self.header()
        self.step("♣ is the tens digit and ♥ is the units digit. Each can be any digit from 0 to 9.")
        T = self.table([str(i) for i in range(10)], [str(j) for j in range(10)], 120, 168, 54, 43,
                       lambda i, j: f"7{i}{j}", hw=48, hh=36, size=19, row_title="♣  tens digit", col_title="♥  units digit")
        self.add(T["frame"], T["titles"])
        self.beat()

        self.step("Fill the grid: the row gives ♣ and the column gives ♥. The numbers run from 700 to 799.")
        self.fill(T, key=lambda ij: ij[0], rt=2.0)
        self.beat()

        F = self.fraction("P(divisible by 7)", 15, 100, (995, 440), 42, simple=(3, 20))
        self.step("Count every number in the grid: 10 × 10 = 100. 100 is the denominator.")
        boxes = [b for b, _ in T["cells"].values()]
        total = self.at_x(self.text("10 × 10 = 100 numbers", (0, 566), 28, BLUE), F["x"])
        self.den_click(F, total, LaggedStart(*[b.animate.set_stroke(BLUE, self.w(1.6)) for b in boxes], lag_ratio=0.02),
                       Create(self.ring(boxes, pad=6)))
        self.beat()

        value = {k: 700 + 10 * k[0] + k[1] for k in T["cells"]}
        mult = sorted((k for k in value if value[k] % 7 == 0), key=value.get)
        first = [k for k in mult if value[k] <= 770]
        rest = [k for k in mult if value[k] > 770]
        self.step("700 = 7 × 100 is divisible by 7. Add 7 each time and light up 700, 707, 714, …, 770.")
        C = self.counter("cell", GOLD, "divisible by 7:", F["x"], 316)
        self.show(C["lab"], C["num"], rt=0.5)
        for k in first:
            self.tick(C, *self.paint(T, [k], GOLD), rt=0.36)
        self.show(self.text("700, 707, …, 770: 11 numbers", (770, 206), 24, GOLD, left=True))
        self.beat()

        self.step("Keep adding 7: 777, 784, 791 and 798. The next one, 805, is past 799.")
        for k in rest:
            self.tick(C, *self.paint(T, [k], GOLD), rt=0.55)
        self.play(*self.mute(T, [k for k in T["cells"] if k not in mult]),
                  FadeIn(self.text("777, 784, 791, 798: 4 more", (770, 246), 24, GOLD, left=True)), run_time=0.7)
        self.beat()

        self.step("15 numbers are divisible by 7. 15 is the numerator.")
        self.num_click(F, C)
        self.beat()

        self.step("Simplify: 15/100 = 3/20. The answer is D.")
        self.settle(F)
        self.answer("D")


# ======================= tree diagrams =======================

FAV = "favourable path"


class Q13(Slides):
    Q = "Q13"
    ASK = ("Mrs Lee has 3 children. Find the probability that exactly 2 of the", "children are boys.")

    def construct(self):
        self.header()
        self.step("Each child is a boy (B) or a girl (G), equally likely.")
        cols = {"B": BLUE, "G": PINK}
        T = self.tree(binary("B", "G", 3), (110, 270, 430, 590), 186, 626, lambda s, d: cols[s], 660, cols,
                      [("1st child", 270), ("2nd child", 430), ("3rd child", 590), ("Outcome", 700)])
        self.add(T["heads"], self.legend([("B", "boy", BLUE), ("G", "girl", PINK)], 1070, 210))
        self.beat()
        self.step("The tree lists all 2 × 2 × 2 = 8 outcomes, one path each.")
        self.grow(T)
        self.beat()
        self.step("Light up the paths with exactly 2 boys: BBG, BGB and GBB.")
        self.light(T, [i for i, l in enumerate(T["leaves"]) if l["word"].count("B") == 2])
        self.show(self.tally(3, 8, (1070, 440), "exactly 2 boys", size=64, kind="path"))
        self.beat()
        self.step("3 of the 8 equally likely outcomes, so P(exactly 2 boys) = 3/8.")
        self.answer("B", (1070, 610))


class Q14(Slides):
    Q = "Q14"
    ASK = ("A test has 3 true-or-false questions: +1 mark for a correct answer and",
           f"{MINUS}1 mark for a wrong answer. Amy guesses all three. Find P({MINUS}1 mark).")

    def construct(self):
        self.header()
        self.step(f"Each answer is correct (C, +1) or wrong (W, {MINUS}1), equally likely.")
        cols = {"C": GREEN, "W": RED}
        T = self.tree(binary("C", "W", 3), (110, 270, 430, 590), 186, 626, lambda s, d: cols[s], 660, cols,
                      [("1st", 270), ("2nd", 430), ("3rd", 590), ("Outcome", 700), ("Mark", 810)])
        self.add(T["heads"], self.legend([("C", "correct, +1", GREEN), ("W", f"wrong, {MINUS}1", RED)], 1080, 210))
        self.beat()
        self.step("8 outcomes. Add up the marks along each path.")
        self.grow(T)
        for leaf in T["leaves"]:
            leaf["extra"] = self.text(signed(leaf["word"].count("C") - leaf["word"].count("W")), (810, leaf["y"]), 30, TXT)
        self.play(LaggedStart(*[FadeIn(l["extra"], shift=LEFT * 0.15) for l in T["leaves"]], lag_ratio=0.12), run_time=1.0)
        self.beat()
        self.step(f"{MINUS}1 mark needs 1 correct and 2 wrong: CWW, WCW and WWC.")
        self.light(T, [i for i, l in enumerate(T["leaves"]) if l["word"].count("W") == 2])
        self.show(self.tally(3, 8, (1080, 440), f"{MINUS}1 mark", size=64, kind="path"))
        self.beat()
        self.step(f"3 of the 8 equally likely outcomes, so P({MINUS}1 mark) = 3/8.")
        self.answer("B", (1080, 610))


class Q15(Slides):
    Q = "Q15"
    ASK = ("Celine has a $10, a $20, a $50 and a $100 note. She takes out 2 notes",
           "at random. Find the probability that she gets at least $70.")

    def construct(self):
        self.header()
        self.step("4 notes. The 2nd note comes from the 3 that are left.")
        notes = [10, 20, 50, 100]
        hue = {"$10": VIOLET, "$20": BLUE, "$50": GREEN, "$100": RED}
        kids = [(f"${a}", [(f"${b}", []) for b in notes if b != a]) for a in notes]
        T = self.tree(kids, (110, 300, 520), 180, 632, lambda s, d: hue[s], 640, None,
                      [("1st note", 300), ("2nd note", 520), ("Total", 680)], head_y=148, size=22, note=(84, 34),
                      out_size=26, outcome=lambda leaf: f"${sum(int(n['label'][1:]) for n in leaf['path'])}")
        self.add(T["heads"])
        self.beat()
        self.step("4 × 3 = 12 outcomes. Add the two notes on each path.")
        self.grow(T)
        self.beat()
        self.step("‘At least $70’ means a total of $70 or more: 8 paths.")
        hits = [i for i, l in enumerate(T["leaves"]) if sum(int(n["label"][1:]) for n in l["path"]) >= 70]
        self.light(T, hits)
        self.show(self.tally(8, 12, (1010, 420), "at least $70", simple=(2, 3), size=64, kind="path"))
        self.beat()
        self.step("8 of the 12 equally likely outcomes: P = 8/12 = 2/3.")
        self.answer("D", (1010, 610))


class S6(Slides):
    Q = "S6"
    ASK = ("A cat gives birth to 3 kittens. Find the probabilities that (a) all 3 are",
           "female, (b) exactly one is female, (c) at least one is female.")

    def construct(self):
        self.header()
        self.step("Each kitten is male (M) or female (F), equally likely.")
        cols = {"M": BLUE, "F": PINK}
        T = self.tree(binary("M", "F", 3), (110, 270, 430, 590), 186, 626, lambda s, d: cols[s], 660, cols,
                      [("1st kitten", 270), ("2nd kitten", 430), ("3rd kitten", 590), ("Outcome", 700)])
        self.add(T["heads"], self.legend([("M", "male", BLUE), ("F", "female", PINK)], 1060, 186))
        self.beat()
        self.step("The tree lists all 2 × 2 × 2 = 8 outcomes.")
        self.grow(T)
        self.beat()
        parts = [("(a)", "all 3 female", lambda w: w == "FFF", 1, "(a) All 3 female: only FFF."),
                 ("(b)", "exactly one female", lambda w: w.count("F") == 1, 3, "(b) Exactly one female: MMF, MFM and FMM."),
                 ("(c)", "at least one female", lambda w: "F" in w, 7, "(c) At least one female: every path except MMM.")]
        for k, (tag, cap, test, n, says) in enumerate(parts):
            self.step(says)
            boxes = self.light(T, [i for i, l in enumerate(T["leaves"]) if test(l["word"])])
            self.show(self.part(tag, cap, [(n, 8, GOLD)], 880, 348 + 112 * k, size=40, kind="path"))
            self.beat()
            if k < len(parts) - 1:
                self.unlight(T, boxes)
        self.wait(1)


class S7(Guided):
    Q = "S7"
    ASK = ("Questions 1 and 2 are true-or-false; question 3 has choices A, B, C.",
           "The correct answers are ‘true’, ‘false’ and ‘C’. Grace guesses all three.",
           "Find P(only one answer correct) and P(only two answers correct).")

    def construct(self):
        self.header()
        self.step("Q1 and Q2 are true or false, and Q3 is A, B or C. The correct answers are T, F and C.")
        hue = {"T": BLUE, "F": PINK, "A": VIOLET, "B": VIOLET, "C": VIOLET}
        right = {1: "T", 2: "F", 3: "C"}
        tf = [("T", None), ("F", None)]
        abc = [("A", []), ("B", []), ("C", [])]
        kids = [(a, [(b, abc) for b, _ in tf]) for a, _ in tf]
        T = self.tree(kids, (100, 230, 360, 490), 200, 632, lambda s, d: hue[s], 550, hue,
                      [("Q1", 230), ("Q2", 360), ("Q3", 490), ("Outcome", 590), ("Correct", 690)],
                      head_y=170, size=22, r=17, out_size=26)
        self.add(T["heads"], self.legend([("T", "true", BLUE), ("F", "false", PINK)], 830, 200),
                 self.text("Correct answers: T, F, C", (1090, 200), 26, GREEN))
        self.beat()
        self.step("Draw the tree: 2 × 2 × 3 = 12 paths, one for each possible outcome.")
        self.grow(T)
        self.beat()
        self.step("Mark each answer right or wrong, then count the correct answers on each path.")
        self.recolor(T, lambda n: GREEN if n["label"] == right[n["depth"]] else RED)
        for leaf in T["leaves"]:
            leaf["hits"] = sum(n["label"] == right[n["depth"]] for n in leaf["path"])
            leaf["extra"] = self.text(str(leaf["hits"]), (690, leaf["y"]), 28, GREEN)
        self.play(LaggedStart(*[FadeIn(l["extra"], shift=LEFT * 0.15) for l in T["leaves"]], lag_ratio=0.1), run_time=1.0)
        self.show(VGroup(self.label("ring", GREEN, "correct answer", (960, 256), left=True),
                         self.label("ring", RED, "wrong answer", (960, 296), left=True)))
        self.beat()

        # (a)
        F = self.fraction("P(only one correct)", 5, 12, (970, 490), 40)
        self.step("(a) Count every path: 2 × 2 × 3 = 12 outcomes. 12 is the denominator.")
        marks = [self.leaf_mark(T, leaf) for leaf in T["leaves"]]
        total = self.at_x(self.text("2 × 2 × 3 = 12 outcomes", (0, 598), 26, BLUE), F["x"])
        a_den = self.den_click(F, total, LaggedStart(*[FadeIn(m) for m in marks], lag_ratio=0.15))
        self.beat()

        def count(hits, F, words):
            C = self.counter("path", GOLD, words, F["x"], 384)
            self.play(*self.dim_tree(T), FadeIn(C["lab"]), FadeIn(C["num"]), run_time=0.7)
            boxes = []
            for i, leaf in enumerate(T["leaves"]):
                if leaf["hits"] == hits:
                    anims, box = self.trace(T, i)
                    boxes.append(box)
                    self.tick(C, *anims, rt=0.7)
            return C, boxes

        self.step("Light up each path with exactly one correct answer, and count them.")
        C, boxes = count(1, F, "only one correct:")
        self.beat()

        self.step("5 paths have only one correct answer. 5 is the numerator: P(only one correct) = 5/12.")
        a_num = self.num_click(F, C)
        a_u = self.settle(F, a_den)
        self.beat()

        # (b)
        G = self.fraction("P(only two correct)", 4, 12, (970, 490), 40, simple=(1, 3))
        self.step("(b) The outcomes are the same 12 paths, so 12 is the denominator again.")
        self.play(*[FadeOut(m) for m in (F["row"], a_u, total, a_num, C["lab"], C["num"])], run_time=0.5)
        self.unlight(T, VGroup(*boxes))
        total = self.at_x(self.text("2 × 2 × 3 = 12 outcomes", (0, 598), 26, BLUE), G["x"])
        b_den = self.den_click(G, total)
        self.beat()

        self.step("Light up each path with exactly two correct answers, and count them.")
        C, boxes = count(2, G, "only two correct:")
        self.beat()

        self.step("4 paths have only two correct answers. 4 is the numerator.")
        b_num = self.num_click(G, C)
        self.beat()

        self.step("Simplify: 4/12 = 1/3. That answers (b).")
        b_u = self.settle(G)
        self.beat()

        self.step("Check: sort the 12 paths by how many answers are correct. 2 + 5 + 4 + 1 = 12.")
        tree = [T["root"], T["heads"], *boxes, *marks, G["row"], b_u, total, b_den, b_num, C["lab"], C["num"]]
        for level in T["levels"]:
            tree += [m for n in level for m in (n["mob"], n["line"])]
        tree += [m for leaf in T["leaves"] for m in (leaf["out"], leaf["extra"])]
        self.play(*[FadeOut(m) for m in tree], run_time=0.6)
        cols = []
        for h, x in zip(range(4), (140, 290, 440, 590)):
            words = [leaf["word"] for leaf in T["leaves"] if leaf["hits"] == h]
            ink = GOLD if h in (1, 2) else MUTED
            col = VGroup(self.text(f"{h} correct", (x, 196), 26, ink, BOLD))
            col.add(*[self.tile(w, (x, 244 + 44 * i), 104, 36, 24, ink, TINT[GOLD] if h in (1, 2) else CELL,
                                GOLD if h in (1, 2) else EDGE, r=8) for i, w in enumerate(words)])
            col.add(self.text(f"{len(words)} path{'s' if len(words) > 1 else ''}", (x, 244 + 44 * 5 + 10), 26, ink))
            cols.append(col)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cols], lag_ratio=0.3), run_time=1.6)
        self.show(self.eq(["2", "+", "5", "+", "4", "+", "1", "=", "12"], (365, 560), 40, colors={2: GOLD, 4: GOLD}))
        self.wait(2.5)


# ======================= tables =======================


class Q11(Slides):
    Q = "Q11"
    ASK = ("A letter is chosen at random from each of the words ‘MEN’ and ‘HEN’.",
           "Find the probability that the two letters drawn are different.")

    def construct(self):
        self.header()
        self.step("One letter from ‘MEN’ and one from ‘HEN’: 3 × 3 = 9 outcomes.")
        rows, cols = "MEN", "HEN"
        T = self.table(list(rows), list(cols), 150, 180, 160, 118, lambda i, j: rows[i] + cols[j], hw=120, hh=96,
                       size=46, ink=lambda i, j, s, p: self.duo(s[0], s[1], p, 46), row_title="1st word ‘MEN’",
                       col_title="2nd word ‘HEN’")
        self.add(T["frame"], T["titles"])
        self.beat()
        self.step("Fill the table: the 1st letter in blue, the 2nd letter in pink.")
        self.fill(T)
        self.beat()
        self.step("Keep the pairs of different letters. Cross out EE and NN.")
        same = [k for k in T["cells"] if rows[k[0]] == cols[k[1]]]
        diff = [k for k in T["cells"] if k not in same]
        self.play(*self.paint(T, diff, GREEN), *self.mute(T, same),
                  *[FadeIn(self.cross(self.pt(T["cells"][k][0].get_center()), 154, 112, RED, 3)) for k in same], run_time=0.9)
        self.show(self.label("cross", RED, "same letter", (880, 236), left=True),
                  self.tally(7, 9, (1020, 420), "different letters", color=GREEN, kind="cell"))
        self.beat()
        self.step("7 of the 9 equally likely outcomes, so P(different) = 7/9.")
        self.answer("D", (1020, 610))


class Q12(Slides):
    Q = "Q12"
    ASK = ("Two multiple choice questions each have options A, B, C and D. The correct",
           "answers are A and C. Mabel guesses both. Find the probability that she",
           "answers at least one question correctly.")

    def construct(self):
        self.header()
        self.step("4 options for each question: 4 × 4 = 16 outcomes.")
        L = "ABCD"
        T = self.table(list(L), list(L), 116, 194, 126, 90, lambda i, j: f"{L[i]}, {L[j]}", hw=100, hh=76, size=32,
                       ink=lambda i, j, s, p: self.duo(L[i], L[j], p, 32, ", "), row_title="1st question",
                       col_title="2nd question")
        self.add(T["frame"], T["titles"])
        self.beat()
        self.step("Fill the table: the 1st answer in blue, the 2nd answer in pink.")
        self.fill(T)
        self.beat()
        x = 768
        rowA = [(0, j) for j in range(4)]
        colC = [(i, 2) for i in range(4)]
        self.step("Gold row: the 1st answer is A, which is correct.")
        self.play(*self.paint(T, rowA, GOLD), run_time=0.7)
        self.show(self.label("cell", GOLD, "1st correct (row A)", (x, 250), 28, left=True), self.text("4", (1200, 250), 40, GOLD))
        self.beat()
        self.step("Blue column: the 2nd answer is C. The cell (A, C) is in both, so count it once.")
        self.play(*self.paint(T, colC[1:], BLUE), T["cells"][(0, 2)][0].animate.set_stroke(TXT, self.w(4)), run_time=0.7)
        self.show(self.label("cell", BLUE, "2nd correct (column C)", (x, 316), 28, left=True), self.text("4", (1200, 316), 40, BLUE))
        self.show(self.label("outline", TXT, "A, C is counted twice", (x, 382), 28, left=True), self.text(f"{MINUS}1", (1200, 382), 40, TXT))
        self.beat()
        self.step(f"4 + 4 {MINUS} 1 = 7 of the 16 outcomes have at least one correct answer.")
        sep = Line(self.P(x, 420), self.P(1236, 420), color=MUTED, stroke_width=self.w(2))
        self.play(Create(sep), FadeIn(self.text("at least one correct", (x + 46, 462), 28, GREEN, left=True)),
                  FadeIn(self.text("7", (1200, 462), 40, GREEN)), run_time=0.6)
        self.show(self.eq([(7, 16, GREEN)], (860, 574), 60))
        self.answer("C", (1100, 574))


class Q16(Slides):
    Q = "Q16"
    ASK = ("Two fair dice are thrown. Find the probability that the sum of the two",
           "numbers obtained is less than 9.")

    def construct(self):
        self.header()
        self.step("Two dice: 6 × 6 = 36 equally likely outcomes.")
        T = self.dice_table(lambda a, b: a + b)
        self.add(T["frame"], T["titles"])
        self.beat()
        self.step("Each cell is the sum of the two dice.")
        self.fill(T, key=lambda ij: ij[0] + ij[1])
        self.beat()
        self.step("Red: sums of 9 or more. These are quicker to count: 10.")
        big = [k for k in T["cells"] if sum(k) + 2 >= 9]
        small = [k for k in T["cells"] if k not in big]
        self.play(*self.paint(T, big, RED), run_time=0.8)
        self.show(self.label("cell", RED, "sum 9 or more: 10 outcomes", (930, 236), 30))
        self.beat()
        self.step(f"Green: the other 36 {MINUS} 10 = 26 sums are less than 9.")
        self.play(*self.paint(T, small, GREEN), run_time=0.8)
        self.show(self.label("cell", GREEN, "sum less than 9", (930, 300), 30),
                  self.eq(["36", MINUS, "10", "=", "26"], (930, 362), 44, colors={2: RED, 4: GREEN}))
        self.beat()
        self.step("P(sum less than 9) = 26/36 = 13/18.")
        self.show(self.eq([(26, 36, GREEN), "=", (13, 18)], (930, 490), 60))
        self.answer("C", (930, 610))


class Q17(Slides):
    Q = "Q17"
    ASK = ("Two fair dice are thrown. Find the probability that the difference in",
           "the two numbers obtained is greater than 2.")

    def construct(self):
        self.header()
        self.step("Two dice: 6 × 6 = 36 equally likely outcomes.")
        T = self.dice_table(lambda a, b: abs(a - b))
        self.add(T["frame"], T["titles"])
        self.beat()
        self.step("Each cell is the larger number minus the smaller one.")
        self.fill(T, key=lambda ij: abs(ij[0] - ij[1]))
        self.beat()
        self.step("Green: a difference greater than 2, that is 3, 4 or 5.")
        far = [k for k in T["cells"] if abs(k[0] - k[1]) > 2]
        self.play(*self.paint(T, far, GREEN), *self.mute(T, [k for k in T["cells"] if k not in far]), run_time=0.9)
        self.show(self.label("cell", GREEN, "difference 3, 4 or 5", (930, 236), 30),
                  self.label("dim", None, "difference 0, 1 or 2", (930, 290), 30),
                  self.text("6 + 6 = 12 outcomes", (930, 352), 30, GREEN))
        self.beat()
        self.step("P(difference greater than 2) = 12/36 = 1/3.")
        self.show(self.eq([(12, 36, GREEN), "=", (1, 3)], (930, 486), 64))
        self.answer("B", (930, 612))


class Q18(Slides):
    Q = "Q18"
    ASK = ("Two cards are drawn at the same time from four cards numbered 2, 6, 8, 11.",
           "Find the probability that the product of the two numbers is less than 48.")

    def construct(self):
        self.header()
        self.step(f"The two cards are different, so the diagonal is crossed out: 16 {MINUS} 4 = 12.")
        T = self.card_table([2, 6, 8, 11], lambda a, b: a * b, 150, 196, 110, 88, size=32)
        self.add(T["frame"], T["titles"])
        self.show(self.label("cross", FAINT, "A card cannot be drawn twice:", (990, 240), 28, ink=TXT),
                  self.text(f"16 {MINUS} 4 = 12 outcomes", (1013, 282), 28, TXT))
        self.beat()
        self.step("Each cell is the product of the two cards.")
        self.fill(T)
        self.beat()
        self.step("Green: products less than 48.")
        hits = [k for k in T["cells"] if int(T["cells"][k][1].text) < 48]
        self.play(*self.paint(T, hits, GREEN), *self.mute(T, [k for k in T["cells"] if k not in hits]), run_time=0.9)
        self.show(self.tally(6, 12, (990, 460), "product less than 48", color=GREEN, simple=(1, 2), size=56, kind="cell"))
        self.beat()
        self.step("6 of the 12 equally likely outcomes: P = 6/12 = 1/2.")
        self.answer("A", (990, 610))


class Q19(Slides):
    Q = "Q19"
    ASK = ("Two cards are drawn at the same time from seven cards numbered",
           "4, 4, 5, 5, 5, 8, 9. Find the probability that the sum of the two numbers is 13.")

    def construct(self):
        self.header()
        self.step(f"The two cards are different, so the diagonal is crossed out: 49 {MINUS} 7 = 42.")
        T = self.card_table([4, 4, 5, 5, 5, 8, 9], lambda a, b: a + b, 110, 172, 62, 58, size=26, cs=(34, 46, 22))
        self.add(T["frame"], T["titles"])
        self.show(self.label("cross", FAINT, "A card cannot be drawn twice:", (960, 240), 28, ink=TXT),
                  self.text(f"49 {MINUS} 7 = 42 outcomes", (983, 282), 28, TXT))
        self.beat()
        self.step("Each cell is the sum of the two cards.")
        self.fill(T, rt=2.2)
        self.beat()
        self.step("Gold: a sum of 13, made by 4 + 9 or 5 + 8.")
        hits = [k for k in T["cells"] if T["cells"][k][1].text == "13"]
        self.play(*self.paint(T, hits, GOLD), run_time=0.9)
        self.show(self.tally(10, 42, (960, 450), "sum is 13", simple=(5, 21), size=56, kind="cell"))
        self.beat()
        self.step("10 of the 42 equally likely outcomes: P = 10/42 = 5/21.")
        self.answer("A", (960, 610))


class S8(Slides):
    Q = "S8"
    ASK = ("One wallet holds two $1 coins, a $5 coin and a $10 coin; the other holds",
           "two $5 coins and a $10 coin. A coin is drawn from each. Find the probabilities",
           "that the total (a) is equal to $15, (b) is not greater than $10.")

    def construct(self):
        self.header()
        self.step("4 coins in the 1st wallet, 3 in the 2nd: 4 × 3 = 12 outcomes.")
        hue = {"$1": "#cbd5e1", "$5": "#fcd34d", "$10": ORANGE}
        rows, cols = ["$1", "$1", "$5", "$10"], ["$5", "$5", "$10"]
        head = lambda lab, p, w, h: VGroup(self.box(p, w, h, PANEL, EDGE, r=8), self.coin(lab, p, hue[lab]))
        T = self.table(rows, cols, 150, 200, 120, 88, lambda i, j: f"${int(rows[i][1:]) + int(cols[j][1:])}",
                       hw=100, hh=84, size=32, head=head, row_title="1st wallet", col_title="2nd wallet")
        self.add(T["frame"], T["titles"])
        self.show(self.text("12 outcomes", (960, 220), 28, MUTED))
        self.beat()
        self.step("Each cell is the total of the two coins.")
        self.fill(T)
        self.beat()
        self.step("(a) Gold: a total of exactly $15.")
        cash = {k: int(T["cells"][k][1].text[1:]) for k in T["cells"]}
        a = [k for k in cash if cash[k] == 15]
        self.play(*self.paint(T, a, GOLD), run_time=0.8)
        self.show(self.part("(a)", "equal to $15", [(3, 12, GOLD), "=", (1, 4)], 770, 380, kind="cell"))
        self.beat()
        self.step("(b) Green: ‘not greater than $10’ means a total of $10 or less.")
        b = [k for k in cash if cash[k] <= 10]
        self.play(*self.unpaint(T, a), run_time=0.4)
        self.play(*self.paint(T, b, GREEN), run_time=0.8)
        self.show(self.part("(b)", "not greater than $10", [(6, 12, GREEN), "=", (1, 2)], 770, 570, color=GREEN, kind="cell"))
        self.wait(2.5)


class S9(Slides):
    Q = "S9"
    ASK = ("Two cards are drawn at the same time from four cards numbered 2, 4, 6",
           "and 9. Find the probability that the product of the numbers is greater than 24.")

    def construct(self):
        self.header()
        self.step(f"The two cards are different, so the diagonal is crossed out: 16 {MINUS} 4 = 12.")
        T = self.card_table([2, 4, 6, 9], lambda a, b: a * b, 150, 196, 110, 88, size=32)
        self.add(T["frame"], T["titles"])
        self.show(self.label("cross", FAINT, "A card cannot be drawn twice:", (990, 240), 28, ink=TXT),
                  self.text(f"16 {MINUS} 4 = 12 outcomes", (1013, 282), 28, TXT))
        self.beat()
        self.step("Each cell is the product of the two cards.")
        self.fill(T)
        self.beat()
        self.step("Gold: products greater than 24. 4 of the 12 outcomes, so P = 4/12 = 1/3.")
        hits = [k for k in T["cells"] if int(T["cells"][k][1].text) > 24]
        self.play(*self.paint(T, hits, GOLD), *self.mute(T, [k for k in T["cells"] if k not in hits]), run_time=0.9)
        self.show(self.tally(4, 12, (990, 470), "product greater than 24", simple=(1, 3), size=60, kind="cell"))
        self.wait(2.5)


class S10(Guided):
    Q = "S10"
    ASK = ("Wrapping paper: red $10, yellow $8, blue $9. Ribbon: green $8, red $12,",
           "yellow $4. (a) Find P(Sara pays more than $15). (b) If the two colours are",
           "different, find P(the total is less than $20).")

    def construct(self):
        self.header()
        self.step("Each wrapping paper can go with each ribbon. Every pair is one outcome.")
        paper = [("R", "#ef4444", 10, TXT), ("Y", "#facc15", 8, BG), ("B", "#3b82f6", 9, TXT)]
        ribbon = [("G", "#22c55e", 8, BG), ("R", "#ef4444", 12, TXT), ("Y", "#facc15", 4, BG)]

        def head(lab, p, w, h):
            name, fill, cost, ink = lab
            word = {"R": "Red", "Y": "Yellow", "B": "Blue", "G": "Green"}[name]
            return VGroup(self.box(p, w, h, fill, fill, r=8), self.text(f"{word} ${cost}", p, 22, ink, BOLD))

        T = self.table(paper, ribbon, 130, 204, 136, 102, lambda i, j: f"${paper[i][2] + ribbon[j][2]}", hw=146, hh=62,
                       size=34, head=head, row_title="Wrapping paper", col_title="Ribbon")
        self.add(T["frame"], T["titles"])
        self.beat()

        self.step("Each cell is paper + ribbon. For example, red paper $10 + green ribbon $8 = $18.")
        demo = self.text("$10 + $8 = $18", (960, 250), 34, GOLD)
        self.play(Indicate(T["frame"][3], color=GOLD), Indicate(T["frame"][0], color=GOLD), FadeIn(demo), run_time=1.0)
        self.play(TransformFromCopy(demo, T["cells"][(0, 0)][1]), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(t, scale=0.6) for k, (b, t) in T["cells"].items() if k != (0, 0)], lag_ratio=0.15),
                  run_time=1.6)
        self.beat()

        cells = list(T["cells"])
        boxes = [T["cells"][k][0] for k in cells]
        cash = {k: int(T["cells"][k][1].text[1:]) for k in cells}

        # (a)
        F = self.fraction("P(more than $15)", 6, 9, (975, 430), 44, simple=(2, 3))
        self.step("(a) Count every outcome: 3 × 3 = 9 cells. 9 is the denominator.")
        self.play(FadeOut(demo), run_time=0.4)
        space = self.ring(boxes)
        total = self.at_x(self.text("3 × 3 = 9 outcomes", (0, 562), 28, BLUE), F["x"])
        a_den = self.den_click(F, total, LaggedStart(*[b.animate.set_stroke(BLUE, self.w(2.4)) for b in boxes], lag_ratio=0.12),
                               Create(space))
        self.beat()

        self.step("Light up each total of more than $15, and count them.")
        C = self.counter("cell", GOLD, "more than $15:", F["x"], 308)
        self.show(C["lab"], C["num"], rt=0.5)
        for k in cells:
            if cash[k] > 15:
                self.tick(C, *self.paint(T, [k], GOLD), rt=0.6)
        self.play(*self.mute(T, [k for k in cells if cash[k] <= 15]), run_time=0.5)
        self.beat()

        self.step("6 of the totals are more than $15. 6 is the numerator.")
        a_num = self.num_click(F, C)
        self.beat()

        self.step("Simplify: 6/9 = 2/3. That answers (a).")
        a_u = self.settle(F)
        self.beat()

        # (b)
        same = [k for k in cells if paper[k[0]][0] == ribbon[k[1]][0]]
        left = [k for k in cells if k not in same]

        def strike(k):
            return [FadeOut(T["cells"][k][1]), T["cells"][k][0].animate.set_stroke(RED, self.w(2.4)),
                    FadeIn(self.cross(self.pt(T["cells"][k][0].get_center()), 130, 96, RED, 3))]

        self.step("(b) Now the colours must differ. Red paper with a red ribbon is the same colour: cross it out.")
        self.play(*[FadeOut(m) for m in (F["row"], a_u, total, a_den, a_num, C["lab"], C["num"], space)], *self.unpaint(T),
                  run_time=0.6)
        self.play(Indicate(T["frame"][3], color=GOLD, scale_factor=1.06), Indicate(T["frame"][1], color=GOLD, scale_factor=1.06),
                  run_time=0.9)
        self.play(*strike(same[0]), FadeIn(self.label("cross", RED, "same colour: not allowed", (730, 214), 26, ink=TXT, left=True)),
                  run_time=0.7)
        self.beat()

        self.step("Yellow paper with a yellow ribbon is the same colour too: cross it out.")
        self.play(Indicate(T["frame"][4], color=GOLD, scale_factor=1.06), Indicate(T["frame"][2], color=GOLD, scale_factor=1.06),
                  run_time=0.9)
        self.play(*strike(same[1]), run_time=0.7)
        self.beat()

        F = self.fraction("P(less than $20)", 5, 7, (945, 430), 44, ncol=GREEN)
        self.step(f"9 {MINUS} 2 = 7 outcomes are left. 7 is the new denominator.")
        total = self.at_x(self.text(f"9 {MINUS} 2 = 7 outcomes left", (0, 562), 28, BLUE), F["x"])
        b_den = self.den_click(F, total, LaggedStart(*[T["cells"][k][0].animate.set_stroke(BLUE, self.w(2.4)) for k in left],
                                                     lag_ratio=0.15))
        self.beat()

        self.step("Light up each total of less than $20 among the 7 that are left, and count them.")
        C = self.counter("cell", GREEN, "less than $20:", F["x"], 308)
        self.show(C["lab"], C["num"], rt=0.5)
        for k in left:
            if cash[k] < 20:
                self.tick(C, *self.paint(T, [k], GREEN), rt=0.6)
        self.beat()

        self.step("$20 is equal to $20, so it is not less than $20. $21 is more. Both are left out.")
        no = [k for k in left if cash[k] >= 20]
        self.play(*[Indicate(T["cells"][k][1], color=RED, scale_factor=1.15) for k in no], run_time=1.0)
        self.play(*self.mute(T, no), FadeIn(self.label("dim", None, "$20 and $21: not less than $20", (730, 254), 26, left=True)),
                  run_time=0.6)
        self.beat()

        self.step("5 of the totals are less than $20. 5 is the numerator: P(less than $20) = 5/7.")
        self.num_click(F, C)
        self.settle(F, b_den)
        self.wait(2.5)


# ======================= central tendency and expected value =======================


def nth(i):
    return f"{i}{'st' if i == 1 else 'nd' if i == 2 else 'rd' if i == 3 else 'th'}"


class Q36(Guided):
    Q = "Q36"
    ASK = ("The mean and the median of 2, 4, 4, 5, 5, 6, 7, 8, 11, a, b are both 6, where a and b",
           "are positive integers. Which of the following must be true?",
           "I  a ≥ 6        II  b ≤ 8        III  a + b = 14")

    CLAIMS = (("I", "I    a ≥ 6", 390), ("II", "II   b ≤ 8", 440), ("III", "III  a + b = 14", 490))

    def construct(self):
        self.header()
        self.step("11 data: nine are known, and a and b are unknown. Which statements must be true?")
        vals = ["2", "4", "4", "5", "5", "6", "7", "8", "11", "a", "b"]
        xs = [640 + (i - 5) * 96 for i in range(11)]
        tiles = [self.tile(v, (x, 226), 82, 68, 38, GOLD if v in "ab" else TXT, CELL, GOLD if v in "ab" else EDGE)
                 for v, x in zip(vals, xs)]
        self.play(LaggedStart(*[FadeIn(t, shift=DOWN * 0.2) for t in tiles], lag_ratio=0.08), run_time=1.2)
        open_ = {k: self.text(s, (946, y), 30, MUTED, left=True) for k, s, y in self.CLAIMS}
        done = {k: self.label("dot", GREEN, s, (900, y), 30, left=True) for k, s, y in self.CLAIMS}
        self.show(self.text("Must be true?", (900, 336), 28, MUTED, left=True), *open_.values())
        self.beat()

        def prove(k):
            self.play(FadeOut(open_[k]), FadeIn(done[k]), run_time=0.6)

        self.step("Mean = 6. First add the nine known data: 2 + 4 + 4 + 5 + 5 + 6 + 7 + 8 + 11 = 52.")
        self.jot(self.bracket(xs[0] - 41, xs[8] + 41, 270, over=False, color=MUTED),
                 self.text("2 + 4 + 4 + 5 + 5 + 6 + 7 + 8 + 11 = 52", ((xs[0] + xs[8]) / 2, 304), 26, MUTED), rt=0.8)
        self.beat()

        self.step("The mean of all 11 data is 6: (52 + a + b) ÷ 11 = 6.")
        self.jot(self.eq([("52 + a + b", "11"), "=", "6"], (420, 410), 42), rt=0.8)
        self.beat()

        self.step("Multiply both sides by 11: 52 + a + b = 66.")
        self.jot(self.text("52 + a + b = 66", (420, 500), 36), rt=0.7)
        self.beat()

        self.step("Take 52 from both sides: a + b = 14. So III must be true.")
        self.jot(self.text("a + b = 14", (420, 570), 40, GOLD), rt=0.7)
        prove("III")
        self.beat()

        self.step("Median = 6. With 11 data in order, the median is the 6th datum, so the 6th datum is 6.")
        self.wipe()
        self.jot(self.text("11 data in order:  median = 6th datum = 6", (120, 340), 28, TXT, left=True), rt=0.7)
        self.beat()

        self.step("5 of the known data (2, 4, 4, 5 and 5) are already less than 6.")
        self.play(*[AnimationGroup(tiles[i][0].animate.set_fill(TINT[RED], 1).set_stroke(RED, self.w(2.4)),
                                   tiles[i][1].animate.set_color(RED)) for i in range(5)], run_time=0.8)
        self.jot(self.text("5 data are less than 6", (xs[2], 292), 24, RED))
        self.beat()

        self.step("Suppose a were less than 6. Then 6 of the data would be less than 6.")
        row = []
        for i, v in enumerate(["2", "4", "4", "5", "5", "a"]):
            x = 160 + 82 * i
            unknown = v == "a"
            row.append(self.tile(v, (x, 454), 70, 58, 32, GOLD if unknown else RED, CELL if unknown else TINT[RED],
                                 GOLD if unknown else RED))
            row.append(self.text(nth(i + 1), (x, 506), 22, RED if unknown else MUTED))
        self.jot(self.text("Suppose a were less than 6:", (120, 394), 28, TXT, left=True), VGroup(*row), rt=0.8)
        self.beat()

        self.step("Then the 6th datum would be less than 6, so the median could not be 6.")
        self.jot(self.cross((570, 454), 70, 58, RED, 4),
                 self.text("The 6th datum would be less than 6:", (120, 556), 28, TXT, left=True),
                 self.text("the median could not be 6.", (120, 596), 28, RED, left=True), rt=0.8)
        self.beat()

        self.step("So a ≥ 6, and the same reasoning gives b ≥ 6. So I must be true.")
        self.wipe()
        self.play(*[AnimationGroup(tiles[i][0].animate.set_fill(CELL, 1).set_stroke(EDGE, self.w(1.6)),
                                   tiles[i][1].animate.set_color(TXT)) for i in range(5)],
                  *[tiles[i][0].animate.set_stroke(GREEN, self.w(3)) for i in (9, 10)], run_time=0.6)
        self.jot(self.text("a ≥ 6   and   b ≥ 6", (420, 440), 46, GOLD), rt=0.7)
        prove("I")
        self.beat()

        self.step(f"From III, a + b = 14. So b = 14 {MINUS} a.")
        self.wipe()
        self.play(Indicate(done["III"], color=GOLD, scale_factor=1.0), run_time=0.9)
        self.jot(self.text(f"b = 14 {MINUS} a", (240, 384), 40, TXT, left=True), rt=0.7)
        self.beat()

        self.step(f"From I, a ≥ 6. So b ≤ 14 {MINUS} 6 = 8, i.e. b ≤ 8. So II must be true.")
        self.play(Indicate(done["I"], color=GOLD, scale_factor=1.0), run_time=0.9)
        for s, x, y, c in ((f"≤ 14 {MINUS} 6", 266, 440, TXT), ("= 8", 266, 496, TXT), ("i.e.  b ≤ 8", 214, 570, GOLD)):
            self.jot(self.text(s, (x, y), 40, c, left=True), rt=0.5)
        prove("II")
        self.beat()

        self.step("I, II and III must all be true, so the answer is D.")
        self.answer("D", (1010, 590))


class S16(Guided):
    Q = "S16"
    ASK = ("A fair game: David pays $15.8 to turn the wheel once and wins the prize of",
           "the sector at the pointer. A 108°, $(x + 2); B 42°, $3x; C 75°, $9; D 135°, $x.",
           "Find the probability that David loses money in the game.")

    SECTORS = [("A", 108, BLUE, "$(x + 2)", 15, "3/10"), ("B", 42, PINK, "$3x", 39, "7/60"),
               ("C", 75, VIOLET, "$9", 9, "5/24"), ("D", 135, ORANGE, "$x", 13, "3/8")]

    def wheel(self, c, r):
        parts, start = [], 0
        for name, sweep, color, *_ in self.SECTORS:
            s = AnnularSector(inner_radius=0, outer_radius=r * self.k, angle=-sweep * DEGREES,
                              start_angle=(90 - start) * DEGREES, arc_center=self.P(*c),
                              fill_color=TINT[color], fill_opacity=1, stroke_color=color, stroke_width=self.w(2.4))
            mid = np.radians(start + sweep / 2)
            reach = 0.72 if sweep < 60 else 0.58
            p = (c[0] + r * reach * np.sin(mid), c[1] - r * reach * np.cos(mid))
            words = VGroup(self.text(name, (p[0], p[1] - 14), 34, color, BOLD), self.text(f"{sweep}°", (p[0], p[1] + 22), 22, TXT))
            parts.append(VGroup(s.set_z_index(Z_BOX), words))
            start += sweep
        tip = Polygon(self.P(c[0] - 12, c[1] - r - 22), self.P(c[0] + 12, c[1] - r - 22), self.P(c[0], c[1] - r - 2),
                      color=TXT, fill_color=TXT, fill_opacity=1, stroke_width=self.w(1)).set_z_index(2)
        return parts, tip

    def construct(self):
        self.header()
        self.step("The pointer stops in one of four sectors. The table lists each angle and prize.")
        c, r = (250, 428), 158
        parts, tip = self.wheel(c, r)
        self.play(LaggedStart(*[FadeIn(p, scale=0.9) for p in parts], lag_ratio=0.25), FadeIn(tip), run_time=1.4)

        def ink(i, j, s, p):
            if j < 2:
                return self.text(s, p, 28)
            n, d = self.SECTORS[i][5].split("/")
            return self.row([self.frac(f"{self.SECTORS[i][1]}°", "360°", (0, 0), 17), self.text("=", (0, 0), 18),
                             self.frac(n, d, (0, 0), 17)], p, 10)

        T = self.table([s[0] for s in self.SECTORS], ["Angle", "Prize", "Probability"], 500, 176, 200, 54,
                       lambda i, j: (f"{self.SECTORS[i][1]}°", self.SECTORS[i][3], self.SECTORS[i][5])[j], hw=64, hh=44,
                       size=28, ink=ink)
        for i, s in enumerate(self.SECTORS):
            T["frame"][3 + i][1].set_color(s[2])
        self.add(T["frame"])
        self.play(LaggedStart(*[FadeIn(T["cells"][(i, j)][1]) for i in range(4) for j in (0, 1)], lag_ratio=0.1), run_time=1.0)
        self.beat()

        self.step("Each probability is the sector's angle ÷ 360°. For A: 108°/360° = 3/10.")
        self.play(LaggedStart(*[AnimationGroup(Indicate(parts[i], scale_factor=1.04, color=self.SECTORS[i][2]),
                                               FadeIn(T["cells"][(i, 2)][1])) for i in range(4)], lag_ratio=0.6), run_time=3.2)
        self.beat()

        E = self.eq(["15.8", "=", "(x + 2)", "×", (3, 10), "+", "3x", "×", (7, 60), "+", "9", "×", (5, 24),
                     "+", "x", "×", (3, 8)], (850, 502), 32)
        self.step("The game is fair, so the expected prize equals the cost of one game, $15.8.")
        wait = self.text("expected prize", self.pt(E[2].get_left()), 26, MUTED, left=True)
        self.play(FadeIn(E[0]), FadeIn(E[1]), FadeIn(wait), run_time=0.8)
        self.beat()

        terms = [(2, 3, 4), (5, 6, 7, 8), (9, 10, 11, 12), (13, 14, 15, 16)]
        says = ["Expected prize, sector A: prize (x + 2) × probability 3/10.",
                "Sector B: add prize 3x × probability 7/60.",
                "Sector C: add prize 9 × probability 5/24.",
                "Sector D: add prize x × probability 3/8. The fair-game equation is complete."]
        for i, (idx, say) in enumerate(zip(terms, says)):
            self.step(say)
            color = self.SECTORS[i][2]
            cells = [(i, 1), (i, 2)]
            self.play(*self.paint(T, cells, color), Indicate(parts[i], scale_factor=1.04, color=color), run_time=0.8)
            lead = [FadeOut(wait)] if i == 0 else [FadeIn(E[idx[0]])]
            self.play(*lead, TransformFromCopy(T["cells"][(i, 1)][1], E[idx[-3]]), FadeIn(E[idx[-2]]),
                      TransformFromCopy(T["cells"][(i, 2)][1][2], E[idx[-1]]), run_time=1.0)
            self.play(*self.unpaint(T, cells), run_time=0.4)
            self.beat()

        E2 = self.eq(["15.8", "=", (99, 40), "+", ("41x", 40)], (720, 590), 32)
        self.step("Multiply out and collect the terms: 15.8 = 99/40 + 41x/40.")
        self.play(FadeIn(E2), run_time=0.8)
        self.beat()

        self.step("Solve the equation: x = 13.")
        xv = self.text("x = 13", (1040, 592), 40, GOLD)
        self.play(FadeIn(xv, shift=LEFT * 0.15), run_time=0.7)
        self.beat()

        self.step("Put x = 13 into the prizes: A $(13 + 2) = $15, B $3 × 13 = $39, D $13.")
        self.play(FadeOut(E), FadeOut(E2), xv.animate.move_to(self.P(560, 498)), run_time=0.6)
        swaps = []
        for i, s in enumerate(self.SECTORS):
            b, old = T["cells"][(i, 1)]
            new = self.text(f"${s[4]}", self.pt(b.get_center()), 30, GOLD)
            swaps.append(ReplacementTransform(old, new))
            T["cells"][(i, 1)] = (b, new)
        self.play(*swaps, run_time=0.9)
        self.jot(xv, self.text("A: 13 + 2 = 15     B: 3 × 13 = 39     D: 13", (900, 498), 26, GOLD))
        self.beat()

        self.step("David loses money when the prize is less than $15.8: sectors A ($15), C ($9) and D ($13).")
        self.wipe()
        lose = [0, 2, 3]
        self.play(*self.paint(T, [(i, 1) for i in lose], RED), *self.paint(T, [(1, 1)], GREEN),
                  *[parts[i][0].animate.set_stroke(RED, self.w(4)) for i in lose],
                  parts[1].animate.set_opacity(0.35), run_time=0.9)
        self.jot(self.label("cell", RED, "prize less than $15.8: loses money", (560, 500), 26, left=True),
                 self.label("cell", GREEN, "prize more than $15.8: gains", (560, 540), 26, left=True))
        self.beat()

        F = self.fraction("P(losing money)", "108° + 75° + 135°", "360°", (840, 574), 34, simple=(53, 60), ncol=RED)
        self.step("P(losing money): the whole wheel, 360°, is the denominator.")
        self.wipe()
        total = self.text("whole wheel: 360°", (c[0], 620), 26, BLUE)
        w_den = self.den_click(F, total, Create(Circle(radius=(r + 7) * self.k, color=BLUE, stroke_width=self.w(2.6))
                                                .move_to(self.P(*c)).set_z_index(-2)))
        self.beat()

        self.step("Light up each losing sector and add up its angle: 108°, then 75°, then 135°.")
        C = self.counter("cell", RED, "losing angles:", F["x"], 476, start="0°")
        self.show(C["lab"], C["num"], rt=0.5)
        run = 0
        for i in lose:
            run += self.SECTORS[i][1]
            self.tick(C, Indicate(parts[i], scale_factor=1.04, color=RED), parts[i][0].animate.set_fill(TINT[RED], 1),
                      rt=1.0, value=f"{run}°")
        self.beat()

        self.step("The losing angles, 108° + 75° + 135°, are the numerator.")
        arrow = self.join(VGroup(C["lab"], C["num"]), F["num"], RED)
        self.play(GrowArrow(arrow), run_time=0.6)
        self.play(FadeOut(F["q"]), FadeIn(F["num"], shift=DOWN * 0.15), run_time=0.9)
        self.beat()

        self.step("Simplify: (108° + 75° + 135°)/360° = 318°/360° = 53/60.")
        self.settle(F)
        self.wait(2.5)


class S19(Guided):
    Q = "S19"
    ASK = ("The table shows how many times a group of adults went hiking last year.",
           "(a) Find the mean. (b) Are the median and the mode equal? (c) x more adults who",
           "each went 6 times join. Find x for (i), (ii) and (iii).")

    FREQ = [6, 22, 9, 2, 5, 2, 4]
    BASE = 604
    UNIT = 12

    def bx(self, v):
        return 168 + (v - 1) * 76

    def bar(self, v, f, lift=0, color=WIRE, fill=CELL):
        h = f * self.UNIT
        return self.box((self.bx(v), self.BASE - lift * self.UNIT - h / 2), 54, max(h, 1), fill, color, r=4, width=2)

    def construct(self):
        self.header()
        self.step("The table and the bar chart show how many times each adult went hiking last year.")
        T = self.table(["Frequency"], [str(v) for v in range(1, 8)], 96, 172, 70, 44, lambda i, j: str(self.FREQ[j]),
                       hw=210, hh=44, size=26)
        corner = self.text("Number of times", (96 + 105, 194), 24, PINK)
        axis = VGroup(Line(self.P(120, self.BASE), self.P(700, self.BASE), color=TXT, stroke_width=self.w(2.4)),
                      Line(self.P(120, self.BASE), self.P(120, self.BASE - 25 * self.UNIT), color=TXT, stroke_width=self.w(2.4)))
        for n in range(0, 26, 5):
            y = self.BASE - n * self.UNIT
            axis.add(Line(self.P(114, y), self.P(120, y), color=TXT, stroke_width=self.w(2)), self.text(str(n), (100, y), 18, MUTED))
        axis.add(*[self.text(str(v), (self.bx(v), self.BASE + 20), 22, TXT) for v in range(1, 8)])
        bars = [self.bar(v, f) for v, f in zip(range(1, 8), self.FREQ)]
        tops = [self.text(str(f), (self.bx(v), self.BASE - f * self.UNIT - 16), 22, TXT) for v, f in zip(range(1, 8), self.FREQ)]
        self.add(T["frame"], corner, *[t for _, t in T["cells"].values()])
        self.play(Create(axis), run_time=0.6)
        self.play(LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.15), FadeIn(VGroup(*tops)), run_time=1.4)
        self.beat()

        def lit(bs, color):
            return [b.animate.set_fill(TINT[color], 1).set_stroke(color, self.w(2.4)) for b in bs]

        def unlit(bs):
            return [b.animate.set_fill(CELL, 1).set_stroke(WIRE, self.w(2)) for b in bs]

        self.step("Number of adults: add the frequencies, 6 + 22 + 9 + 2 + 5 + 2 + 4 = 50.")
        self.play(LaggedStart(*[AnimationGroup(*self.paint(T, [(0, j)], BLUE)) for j in range(7)], lag_ratio=0.3), run_time=1.4)
        self.jot(self.text("6 + 22 + 9 + 2 + 5 + 2 + 4 = 50 adults", (1005, 300), 26, BLUE))
        self.beat()

        self.step("(a) Total number of hikes: multiply each number of times by its frequency, and add.")
        self.play(*self.unpaint(T), run_time=0.4)
        r1 = self.row([self.text(s, (0, 0), 28) for s in ("1×6", "+", "2×22", "+", "3×9", "+", "4×2")], (1020, 366), 8)
        r2 = self.row([self.text(s, (0, 0), 28) for s in ("+", "5×5", "+", "6×2", "+", "7×4", "= 150")], (1020, 410), 8)
        pieces = [[r1[0]], [r1[1], r1[2]], [r1[3], r1[4]], [r1[5], r1[6]], [r2[0], r2[1]], [r2[2], r2[3]], [r2[4], r2[5]]]
        for v, ps in enumerate(pieces):
            self.play(*lit([bars[v]], GOLD), *self.paint(T, [(0, v)], GOLD), *[FadeIn(p) for p in ps], run_time=0.6)
        self.play(*unlit(bars), *self.unpaint(T), FadeIn(r2[6]), run_time=0.7)
        self.scratch += [r1, r2]
        self.beat()

        self.step("Mean = total number of hikes ÷ number of adults = 150 ÷ 50 = 3.")
        mean_eq = self.lefted(self.eq(["Mean", "=", ("150", "50"), "=", "3"], (0, 500), 44), 860)
        self.jot(self.text("(a)", (790, 500), 32, GOLD, BOLD, left=True), mean_eq, rt=0.8)
        top9 = self.BASE - 9 * self.UNIT - 36
        mean = DashedLine(self.P(self.bx(3), 330), self.P(self.bx(3), top9), color=GOLD, stroke_width=self.w(2.4))
        u = self.double(mean_eq[-1])
        self.play(Create(mean), Create(u), run_time=0.7)
        self.jot(mean, u, self.text("mean = 3", (self.bx(3), 312), 22, GOLD), rt=0.3)
        self.beat()

        self.step("(b) 50 adults in order: the median is the mean of the 25th and 26th values.")
        self.wipe()
        self.jot(self.text("50 adults in order:", (1020, 290), 26),
                 self.text("median = mean of the 25th and 26th", (1020, 326), 26), rt=0.7)
        self.beat()

        self.step("Count along the bars: 1 time is the 1st–6th adults, then 2 times is the 7th–28th.")
        self.play(*lit([bars[0]], BLUE), run_time=0.5)
        self.jot(self.text("1st–6th", (self.bx(1), self.BASE - 6 * self.UNIT - 42), 20, BLUE))
        self.play(*lit([bars[1]], GOLD), run_time=0.5)
        self.jot(self.text("7th–28th", (self.bx(2), self.BASE - 22 * self.UNIT - 42), 20, GOLD),
                 self.text("25th and 26th: 2 times", (1020, 372), 26, GOLD))
        self.beat()

        self.step("The 25th and 26th values are both 2: median = (2 + 2) ÷ 2 = 2.")
        self.jot(self.eq(["Median", "=", ("2 + 2", "2"), "=", "2"], (1020, 430), 40), rt=0.8)
        self.beat()

        self.step("Mode: the tallest bar is at 2 times, so the mode is 2. The median and the mode are equal.")
        self.play(Indicate(bars[1], color=GOLD, scale_factor=1.0), run_time=0.8)
        self.jot(self.text("Mode = 2  (the tallest bar)", (1020, 516), 30), rt=0.6)
        self.jot(self.label("dot", GREEN, "The median and the mode are equal.", (1020, 580), 28), rt=0.6)
        self.beat()

        self.step("(c) x more adults who each went 6 times join: the bar at 6 grows by x.")
        self.wipe()
        self.play(*unlit(bars[:2]), run_time=0.4)
        ghost = DashedLine(self.P(self.bx(6) - 27, self.BASE - 2 * self.UNIT - 60), self.P(self.bx(6) + 27, self.BASE - 2 * self.UNIT - 60),
                           color=GOLD, stroke_width=self.w(2.4))
        plus = self.text("+ x", (self.bx(6), self.BASE - 2 * self.UNIT - 84), 26, GOLD)
        self.play(Create(ghost), FadeIn(plus), run_time=0.7)
        self.beat()

        self.step("(i) The mean goes up by 2, to 5: 3 × 50 + 6x = (3 + 2)(50 + x).")
        self.jot(self.text("3 × 50 + 6x = (3 + 2)(50 + x)", (1020, 340), 30), rt=0.8)
        self.beat()

        self.step("Solve: 150 + 6x = 250 + 5x, so x = 100.")
        self.jot(self.text("150 + 6x = 250 + 5x", (1020, 410), 32), rt=0.6)
        self.jot(self.text("x = 100", (1020, 486), 42, GOLD), rt=0.6)
        self.beat()

        self.step("(ii) For a median of 3, fewer adults went 1 or 2 times than went 3 or more times.")
        self.wipe()
        self.play(FadeOut(ghost), FadeOut(plus), *lit(bars[:2], BLUE), *lit(bars[2:], PINK), run_time=0.7)
        self.jot(self.label("cell", BLUE, "1 or 2 times: 6 + 22", (790, 318), 28, left=True),
                 self.label("cell", PINK, "3 to 7 times: 9 + 2 + 5 + 2 + 4 + x", (790, 362), 28, left=True), rt=0.7)
        self.jot(self.text("6 + 22 < 9 + 2 + 5 + 2 + 4 + x", (1020, 428), 32), rt=0.7)
        self.beat()

        self.step("So 28 < 22 + x, which gives x > 6. The least possible x is 7.")
        self.jot(self.text("28 < 22 + x", (1020, 488), 32), self.text("x > 6", (1020, 540), 32), rt=0.6)
        extra = self.bar(6, 7, lift=2, color=GOLD, fill=TINT[GOLD])
        self.play(GrowFromEdge(extra, DOWN), run_time=0.7)
        self.jot(extra, self.text("+7", (self.bx(6), self.BASE - 9 * self.UNIT - 16), 22, GOLD),
                 self.text("least x = 7", (1020, 600), 38, GOLD), rt=0.5)
        self.beat()

        self.step("(iii) The mode stays 2 only while the bar at 6 stays below 22: 2 + x < 22.")
        self.wipe()
        self.play(*unlit(bars), run_time=0.4)
        cap = DashedLine(self.P(120, self.BASE - 22 * self.UNIT), self.P(700, self.BASE - 22 * self.UNIT), color=RED,
                         stroke_width=self.w(2))
        self.play(Create(cap), run_time=0.6)
        self.jot(cap, self.text("22", (735, self.BASE - 22 * self.UNIT), 22, RED), self.text("2 + x < 22", (1020, 380), 34), rt=0.6)
        self.beat()

        self.step("So x < 20. The greatest possible x is 19.")
        extra = self.bar(6, 19, lift=2, color=GOLD, fill=TINT[GOLD])
        self.play(GrowFromEdge(extra, DOWN), run_time=1.2)
        self.jot(extra, self.text("2 + 19 = 21", (self.bx(6), self.BASE - 22 * self.UNIT - 22), 22, GOLD), rt=0.3)
        self.jot(self.text("x < 20", (1020, 440), 34), rt=0.5)
        self.jot(self.text("greatest x = 19", (1020, 516), 40, GOLD), rt=0.5)
        self.wait(2.5)


class S29(Guided):
    Q = "S29"
    ASK = ("A stem-and-leaf diagram of students' weights: mean 55.5 kg, mode 66 kg, median",
           "58 kg. (a) Find a, b and c. (b) Amy, Paul and the two lightest students leave and",
           "the mean is unchanged. Find their weights, and P(weight > 60 kg) after they leave.")

    ROWS = [(4, ["1", "2", "a", "4", "4"]), (5, ["0", "1", "2", "b", "8", "9", "9"]), (6, ["1", "2", "6", "6", "c"]), (7, ["7"])]
    ROW_Y = 270

    def construct(self):
        self.header()
        self.step("Stem-and-leaf: the stem is the tens digit (10 kg) and each leaf is a units digit (1 kg).")
        heads = VGroup(self.text("Stem (10 kg)", (150, 194), 24, MUTED), self.text("Leaf (1 kg)", (340, 194), 24, MUTED))
        bar = Line(self.P(212, 230), self.P(212, 520), color=TXT, stroke_width=self.w(2.4))
        leaf, order, rows, n = {}, {}, [], 0
        stems = VGroup()
        for r, (stem, leaves) in enumerate(self.ROWS):
            y = self.ROW_Y + 72 * r
            stems.add(self.text(str(stem), (170, y), 38))
            row = []
            for i, s in enumerate(leaves):
                n += 1
                unknown = s in "abc"
                leaf[(stem, i)] = self.tile(s, (258 + 54 * i, y), 46, 52, 36, GOLD if unknown else TXT, CELL,
                                            GOLD if unknown else CELL, r=8)
                order[(stem, i)] = n
                row.append(leaf[(stem, i)])
            rows.append(row)
        self.add(heads, bar, stems)
        self.beat()

        self.step("Build the diagram row by row: 18 weights, with the unknown leaves a, b and c in gold.")
        for row in rows:
            self.play(LaggedStart(*[FadeIn(t, shift=LEFT * 0.15) for t in row], lag_ratio=0.12), run_time=0.8)
        self.beat()

        def swap(key, s, color=GOLD):
            t = leaf[key]
            new = self.text(s, self.pt(t[1].get_center()), 36, color)
            self.play(ReplacementTransform(t[1], new), t[0].animate.set_stroke(color, self.w(2.6)), run_time=0.7)
            leaf[key] = VGroup(t[0], new)

        def outline(keys, color, width=3):
            return [leaf[k][0].animate.set_stroke(color, self.w(width)) for k in keys]

        self.step("(a) Median = 58 kg. With 18 weights, the median is the mean of the 9th and 10th.")
        nums = VGroup(*[self.text(str(order[k]), (258 + 54 * k[1], self.ROW_Y + 72 * (k[0] - 4) - 38), 16, MUTED) for k in leaf])
        self.jot(nums, rt=0.8)
        self.play(*outline(((5, 3), (5, 4)), BLUE), run_time=0.6)
        self.jot(self.text("9th = 50 + b,   10th = 58", (960, 300), 30, BLUE))
        self.beat()

        self.step("Write the median condition: ((50 + b) + 58) ÷ 2 = 58.")
        self.jot(self.eq([("(50 + b) + 58", "2"), "=", "58"], (960, 390), 40), rt=0.8)
        self.beat()

        self.step("Solve: 108 + b = 116, so b = 8.")
        self.jot(self.text("108 + b = 116", (960, 476), 34), rt=0.6)
        self.jot(self.text("b = 8", (960, 536), 40, GOLD), rt=0.6)
        swap((5, 3), "8")
        self.play(leaf[(5, 4)][0].animate.set_stroke(CELL, self.w(1.6)), run_time=0.3)
        self.beat()

        self.step("Mode = 66 kg. 44, 58 and 59 each appear twice.")
        self.wipe()
        pairs = ((4, 3), (4, 4), (5, 3), (5, 4), (5, 5), (5, 6))
        self.play(*outline(pairs, PINK), run_time=0.7)
        self.jot(self.label("outline", PINK, "44, 58 and 59: twice each", (960, 300), 28))
        self.beat()

        self.step("66 must appear more often than they do, so 3 times: c = 6.")
        self.play(*outline(((6, 2), (6, 3)), GOLD), run_time=0.6)
        self.jot(self.text("66 must appear 3 times", (960, 370), 30), rt=0.6)
        self.jot(self.text("c = 6", (960, 440), 40, GOLD), rt=0.6)
        swap((6, 4), "6")
        self.play(*outline(pairs + ((6, 2), (6, 3)), CELL, 1.6), run_time=0.4)
        self.beat()

        self.step("Mean = 55.5 kg. Add the 18 weights: 41 + 42 + (40 + a) + … + 77 = 996 + a.")
        self.wipe()
        self.jot(self.text("41 + 42 + (40 + a) + 44 × 2 + … + 77", (960, 296), 26, MUTED),
                 self.text("= 996 + a", (960, 336), 30), rt=0.8)
        self.beat()

        self.step("Divide by 18 for the mean: (996 + a) ÷ 18 = 55.5.")
        self.jot(self.eq([("996 + a", "18"), "=", "55.5"], (960, 424), 38), rt=0.8)
        self.beat()

        self.step("Solve: 996 + a = 999, so a = 3.")
        self.jot(self.text("996 + a = 999", (960, 504), 32), rt=0.6)
        self.jot(self.text("a = 3", (960, 560), 40, GOLD), rt=0.6)
        swap((4, 2), "3")
        self.beat()

        gone = ((4, 0), (4, 1))
        pair = ((6, 1), (7, 0))
        self.step("(b)(i) The two lightest (41 kg, 42 kg), Amy (x kg) and Paul (y kg) leave: 14 are left.")
        self.wipe()
        self.play(FadeIn(VGroup(*[self.cross(self.pt(leaf[k][0].get_center()), 46, 52, RED, 3.4) for k in gone])),
                  *[leaf[k][1].animate.set_opacity(0.35) for k in gone], run_time=0.6)
        self.jot(self.text(f"18 {MINUS} 4 = 14 students left", (960, 296), 30), rt=0.6)
        self.beat()

        self.step(f"The mean is unchanged: (18 × 55.5 {MINUS} 41 {MINUS} 42 {MINUS} (x + y)) ÷ 14 = 55.5.")
        mean = self.eq([(f"18 × 55.5 {MINUS} 41 {MINUS} 42 {MINUS} (x + y)", "14"), "=", "55.5"], (960, 384), 30)
        self.jot(mean, rt=0.8)
        self.beat()

        self.step(f"Solve: 916 {MINUS} (x + y) = 777, so x + y = 139.")
        self.jot(self.text(f"916 {MINUS} (x + y) = 777", (960, 470), 32), rt=0.6)
        self.jot(self.text("x + y = 139", (960, 528), 40, GOLD), rt=0.6)
        self.beat()

        self.step("Which two weights add up to 139? By inspection, 62 + 77: Amy 62 kg, Paul 77 kg.")
        self.play(*[Indicate(leaf[k], color=GOLD) for k in pair], *outline(pair, GOLD), run_time=0.9)
        self.jot(self.text("Amy 62 kg,  Paul 77 kg", (960, 596), 32, GOLD), rt=0.6)
        self.play(FadeIn(VGroup(*[self.cross(self.pt(leaf[k][0].get_center()), 46, 52, RED, 3.4) for k in pair])),
                  *[leaf[k][1].animate.set_opacity(0.35) for k in pair], run_time=0.6)
        self.beat()

        left = [k for k in leaf if k not in gone + pair]
        F = self.fraction("P(more than 60 kg)", 4, 14, (960, 440), 44, simple=(2, 7), ncol=GREEN)
        self.step("(b)(ii) 14 students are left. 14 is the denominator.")
        self.wipe()
        self.play(*outline(pair, CELL, 1.6), run_time=0.3)
        total = self.at_x(self.text(f"18 {MINUS} 4 = 14 students left", (0, 566), 28, BLUE), F["x"])
        self.den_click(F, total, LaggedStart(*outline(left, BLUE, 2.4), lag_ratio=0.06))
        self.beat()

        self.step("Light up each weight of more than 60 kg that is left, and count them: 61, 66, 66, 66.")
        C = self.counter("cell", GREEN, "more than 60 kg:", F["x"], 318)
        self.show(C["lab"], C["num"], rt=0.5)
        for k in ((6, 0), (6, 2), (6, 3), (6, 4)):
            self.tick(C, leaf[k][0].animate.set_fill(TINT[GREEN], 1).set_stroke(GREEN, self.w(2.6)),
                      leaf[k][1].animate.set_color(GREEN), rt=0.7)
        self.beat()

        self.step("4 of the students left weigh more than 60 kg. 4 is the numerator.")
        self.num_click(F, C)
        self.beat()

        self.step("Simplify: 4/14 = 2/7.")
        self.settle(F)
        self.wait(2.5)
