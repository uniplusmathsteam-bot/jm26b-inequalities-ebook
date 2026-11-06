"""Solution guides: a question's figure animated step by step, following the teacher's working.

A guide draws in page points like the summary panels (PageScene in jm29.py).
REGION is the camera frame around the printed figure (16:9) and PAGE its page,
so `render_media.py <id> --still` can set the opening frame under the print. The
scene opens on the figure as printed, which becomes the poster, then shows one
idea per beat and holds while a narrator speaks. It puts values on the figure,
never lines of working. A question with parts (a) and (b) draws both printed
figures and pans along the page from one to the other.

Equal parts are shown by a motion that really carries one onto the other: a
mirror flip about a symmetry line, a half-turn about a midpoint (alternate
angles), a fold along a diagonal, a slide along a line (corresponding or
co-interior angles). Never morph one wedge into another with Transform; the
points interpolate and the wedge warps on the way.
"""

import numpy as np
from manim import (
    BOLD, ITALIC, NORMAL, OUT, PI, Arc, Create, FadeToColor, LaggedStart, Line, MovingCameraScene, Polygon,
    ReplacementTransform, Rotate, Sector, Text, VGroup, VMobject, Write, there_and_back,
)

from jm29 import PageScene

INK = "#1a1a1a"
DIM = "#c8cdd5"
BLUE = "#2f6fd6"
PINK = "#e0457f"
AMBER = "#ef9a1a"
GREEN = "#1f9d55"
PURPLE = "#7b4fd0"
RED = "#e02424"
FONT = "Arial"
SERIF = "Times New Roman"

# Drawing order: tints under wedges under the figure's lines, coloured sides above, words on top.
Z_TINT, Z_WEDGE, Z_MARK, Z_TEXT = -2, -1, 1, 3


def twice(t):
    """Rate function: there and back, two times over."""
    return there_and_back(2 * t % 1)


def along(p, q, t):
    """The point a fraction t of the way from p to q."""
    return (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)


def mid(p, q):
    return along(p, q, 0.5)


def dist(p, q):
    return float(np.hypot(q[0] - p[0], q[1] - p[1]))


def meet(p1, p2, p3, p4):
    """Where line p1p2 crosses line p3p4."""
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p1, p2, p3, p4
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4))
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))


class GuideScene(PageScene, MovingCameraScene):
    PAGE = 1
    REGION = (0, 0, 160, 90)
    LINE = 0.9
    HOLD = 1.8

    # ---------- figure ----------

    def seg(self, a, b, color=INK, width=None):
        return Line(self.P(*a), self.P(*b), color=color, stroke_width=self.w(width or self.LINE))

    def path(self, *pts, color=INK, width=None, closed=False):
        m = VMobject(color=color, stroke_width=self.w(width or self.LINE))
        pts = [self.P(*p) for p in pts]
        m.set_points_as_corners(pts + pts[:1] if closed else pts)
        return m

    def _txt(self, s, p, size, color, weight=NORMAL, slant=NORMAL, font=FONT, it=()):
        key = (font, weight, slant)
        if key not in self._caps:
            self._caps[key] = Text("H", font=font, weight=weight, slant=slant, font_size=48).height
        t = Text(s, font=font, weight=weight, slant=slant, font_size=48, color=color, t2s={k: ITALIC for k in it})
        t.scale(size * 0.7 * self.k / self._caps[key])
        t.move_to(self.P(*p))
        return t.set_z_index(Z_TEXT)

    def name(self, s, p, size=9, color=INK):
        """A vertex name, italic like the printed figures."""
        return self._txt(s, p, size, color, slant=ITALIC)

    def value(self, s, p, color=INK, size=8, weight=NORMAL, it=()):
        """An angle or length written on the figure, centred at p; the letters in `it` are italic."""
        return self._txt(s, p, size, color, weight, it=it)

    def tag(self, s, p):
        """A part label, "(a)", as printed beside the figure."""
        return self._txt(s, p, 9, INK, font=SERIF)

    def mark(self, a, b, color, width=2.4):
        """A side drawn over in colour."""
        return self.seg(a, b, color, width).set_stroke(opacity=0.85).set_z_index(Z_MARK)

    def polar(self, v, deg, r):
        """The page point r points from v in direction deg (counter-clockwise from east, as on screen)."""
        t = np.radians(deg)
        return (v[0] + r * np.cos(t), v[1] - r * np.sin(t))

    # ---------- angles ----------

    def span(self, v, p1, p2, inside=None):
        """(start, sweep) in radians, counter-clockwise, of the angle at v between p1 and p2."""
        c = self.P(*v)
        a1 = np.arctan2(*(self.P(*p1) - c)[1::-1])
        a2 = np.arctan2(*(self.P(*p2) - c)[1::-1])
        d = (a2 - a1 + PI) % (2 * PI) - PI
        if inside is not None:
            ai = np.arctan2(*(self.P(*inside) - c)[1::-1])
            t = (ai - a1 + PI) % (2 * PI) - PI
            if not (min(0, d) - 1e-9 <= t <= max(0, d) + 1e-9):
                d = d - 2 * PI if d > 0 else d + 2 * PI
        return (a1 + d, -d) if d < 0 else (a1, d)

    def sector(self, v, start, sweep, color, r=10, opacity=0.4, width=1.1):
        c = self.P(*v)
        return VGroup(
            Sector(radius=r * self.k, start_angle=start, angle=sweep, arc_center=c, fill_color=color, fill_opacity=opacity, stroke_width=0),
            Arc(radius=r * self.k, start_angle=start, angle=sweep, arc_center=c, color=color, stroke_width=self.w(width)),
        ).set_z_index(Z_WEDGE)

    def wedge(self, v, p1, p2, color, r=10, inside=None, opacity=0.4):
        """The angle at v between p1 and p2 as a tinted wedge with its arc."""
        return self.sector(v, *self.span(v, p1, p2, inside), color, r, opacity)

    def arc(self, v, p1, p2, r=10, color=INK, width=None, inside=None):
        return self.arc_at(v, *self.span(v, p1, p2, inside), r, color, width)

    def arc_at(self, v, start, sweep, r=10, color=INK, width=None):
        return Arc(radius=r * self.k, start_angle=start, angle=sweep, arc_center=self.P(*v), color=color, stroke_width=self.w(width or self.LINE))

    def slices(self, v, start, sweep, n, r=10):
        """An angle cut into n equal sectors, clear until counted."""
        c = self.P(*v)
        return VGroup(*[
            Sector(radius=r * self.k, start_angle=start + i * sweep / n, angle=sweep / n, arc_center=c, fill_color=RED, fill_opacity=0, stroke_width=0)
            for i in range(n)
        ]).set_z_index(Z_MARK)

    def spokes(self, v, start, sweep, n, r=10, width=0.5):
        """The lines that cut an angle into n equal parts."""
        return VGroup(*[self.seg(v, self.polar(v, np.degrees(start + i * sweep / n), r), INK, width) for i in range(1, n)]).set_z_index(Z_MARK)

    def count(self, parts):
        """Light up equal parts one after another."""
        self.play(LaggedStart(*[p.animate(rate_func=there_and_back).set_fill(opacity=0.7) for p in parts], lag_ratio=0.7), run_time=0.8 + 0.55 * len(parts))

    def flash(self, *mobs):
        """Brighten wedges or tints for a moment, in place (Indicate would lift a wedge off its vertex)."""
        fills = [m[0] if isinstance(m, VGroup) else m for m in mobs]
        self.play(*[f.animate(rate_func=there_and_back).set_fill(opacity=0.85) for f in fills], run_time=1.0)

    def right_mark(self, v, p1, p2, size=5, color=INK, width=None):
        c = self.P(*v)
        u = self._dir(v, p1) * size * self.k
        t = self._dir(v, p2) * size * self.k
        m = VMobject(color=color, stroke_width=self.w(width or self.LINE))
        m.set_points_as_corners([c + u, c + u + t, c + t])
        return m.set_z_index(Z_MARK)

    # ---------- moves ----------

    def hold(self, t=None):
        """A pause for the narrator."""
        self.wait(self.HOLD if t is None else t)

    def dim(self, *mobs):
        return [FadeToColor(m, DIM) for m in mobs]

    def undim(self, *mobs):
        return [FadeToColor(m, INK) for m in mobs]

    def half_turn(self, mob, centre):
        """Rotate by half a turn about a page point (carries an angle onto its alternate angle)."""
        return Rotate(mob, PI, axis=OUT, about_point=self.P(*centre))

    def turn(self, mob, centre, deg):
        return Rotate(mob, np.radians(deg), axis=OUT, about_point=self.P(*centre))

    def flip(self, mob, a, b):
        """Fold over the line ab (carries a shape onto its mirror image)."""
        d = self.P(*b) - self.P(*a)
        return Rotate(mob, PI, axis=d / np.linalg.norm(d), about_point=self.P(*a))

    def slide(self, mob, a, b):
        """Translate so that page point a lands on b (corresponding and co-interior angles)."""
        return mob.animate.shift(self.P(*b) - self.P(*a))

    def pan(self, centre, run_time=1.6):
        """Slide along the page to another printed figure of the same question."""
        self.play(self.camera.frame.animate.move_to(self.P(*centre)), run_time=run_time)

    def gather(self, apex, b, c, wa, wb, wc, at, reach=22, run_time=1.3, swing=PI):
        """Copies of a triangle's three angle wedges meet at `at` and fill a straight angle on a line
        parallel to bc: the wedges at b and c slide across, the one at the apex turns half a turn
        (swing=-PI turns it clockwise, when the counter-clockwise path would leave the frame)."""
        q = self.P(*at)
        d = self._dir(b, c) * reach * self.k
        line = Line(q - d, q + d, color=INK, stroke_width=self.w(self.LINE)).set_z_index(Z_MARK)
        ca, cb, cc = wa.copy(), wb.copy(), wc.copy()
        self.play(Create(line), run_time=0.5)
        self.play(cb.animate.shift(q - self.P(*b)), cc.animate.shift(q - self.P(*c)), run_time=run_time)
        self.play(Rotate(ca, swing, about_point=(self.P(*apex) + q) / 2), run_time=run_time + 0.2)
        return VGroup(line, ca, cb, cc)

    # ---------- the unknowns and the answers ----------

    def pulse(self, *mobs, color=RED, run_time=1.2):
        """Words turn a colour and back, twice, where they stand. Words never grow: a bigger word
        runs into the lines and arcs around it."""
        self.play(LaggedStart(*[m.animate(rate_func=twice).set_color(color) for m in mobs], lag_ratio=0.4),
                  run_time=run_time + 0.4 * (len(mobs) - 1))

    def blink(self, *mobs, run_time=1.0):
        """Red marks (a "?") fade and return, twice."""
        self.play(*[m.animate(rate_func=twice).set_opacity(0.15) for m in mobs], run_time=run_time)

    def ask(self, *mobs):
        """The unknowns flash red."""
        self.pulse(*mobs)
        self.hold(0.8)

    def settle(self, old, s, p, size=8, it=(), angle=0):
        """An unknown on the figure becomes its value, in bold red."""
        new = self.value(s, p, RED, size, BOLD, it=it).rotate(np.radians(angle))
        self.play(ReplacementTransform(old, new), run_time=1.0)
        self.hold(0.7)
        return new

    def badge(self, s, p, size=8, it=()):
        """A result written beside the figure, in bold red."""
        t = self.value(s, p, RED, size, BOLD, it=it)
        self.play(Write(t), run_time=0.8)
        return t

    def tint(self, *pts, color=GREEN, opacity=0.22):
        m = Polygon(*[self.P(*p) for p in pts], color=color, stroke_width=self.w(1.0), fill_color=color, fill_opacity=opacity)
        return m.set_z_index(Z_TINT)
