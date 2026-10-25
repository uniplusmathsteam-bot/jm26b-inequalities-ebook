"""Manim scenes for the JM29 Quadrilaterals summary panels.

Each scene draws in page points: REGION is the panel's rectangle on the page
(tools/render_media.py sets it from book.json) and P(x, y) maps a page point
into the frame, so the animation lines up with the printed panel it covers.
Every scene ends on the complete panel, which becomes the video's poster.
"""

import numpy as np
from manim import (
    BOLD, NORMAL, PI, UP, Arc, Create, DashedLine, Dot, FadeIn, FadeOut, GrowFromCenter, Indicate,
    LaggedStart, Line, Polygon, Rotate, Scene, Sector, Text, Transform, TransformFromCopy, VGroup,
    Write, config,
)

SERIF = "Times New Roman"
ROUND = "Arial Rounded MT"
CALIBRI = "Calibri"
MATH = "Cambria"  # only its regular weight has ∠ and △, so text() sets those signs in it
SYMBOL = "Segoe UI Symbol"

INK = "#1a1a1a"
GREY = "#6b7280"
BLUE = "#0070c0"
GREEN = "#00a050"
MAGENTA = "#c000c0"
PEACH = "#f0a868"
RED = "#e01e1e"
ORANGE = "#f39c32"
DIAG = "#f07a2a"
SQUARE_BLUE = "#4a5ee8"
FRAME_RED = "#bf4f4c"
FRAME_BLUE = "#4f81bd"
FRAME_PURPLE = "#7f63a1"
LABEL_ORANGE = "#e46c0a"
LABEL_PURPLE = "#9e7bd0"
LABEL_YELLOW = "#ffc000"


class PageScene(Scene):
    REGION = (0, 0, 595, 842)

    def setup(self):
        x0, y0, x1, y1 = self.REGION
        self.k = config.frame_height / (y1 - y0)
        self.c = ((x0 + x1) / 2, (y0 + y1) / 2)
        self.camera.background_color = "#ffffff"
        self._caps = {}

    # ---------- geometry in page points ----------

    def P(self, x, y):
        return np.array([(x - self.c[0]) * self.k, (self.c[1] - y) * self.k, 0.0])

    def w(self, pt):
        """Manim stroke width for a line pt points thick."""
        return pt * self.k * 100

    def line(self, a, b, color=INK, width=1.3):
        return Line(self.P(*a), self.P(*b), color=color, stroke_width=self.w(width))

    def dashed(self, a, b, color=DIAG, width=1.2, dash=3.5):
        return DashedLine(self.P(*a), self.P(*b), color=color, stroke_width=self.w(width), dash_length=dash * self.k)

    def poly(self, *pts, color=INK, width=1.3):
        return Polygon(*[self.P(*p) for p in pts], color=color, stroke_width=self.w(width))

    def frame(self, x0, y0, x1, y1, color, width=2):
        return self.poly((x0, y0), (x1, y0), (x1, y1), (x0, y1), color=color, width=width)

    def dot(self, p, color=INK, r=1.6):
        return Dot(self.P(*p), radius=r * self.k, color=color)

    def _dir(self, a, b):
        d = self.P(*b) - self.P(*a)
        return d / np.linalg.norm(d)

    def ticks(self, a, b, n=1, color=INK, size=3.6, width=1.3):
        """Equal-length marks across the middle of ab."""
        d = self._dir(a, b)
        nrm = np.array([-d[1], d[0], 0])
        mid = (self.P(*a) + self.P(*b)) / 2
        out = VGroup()
        for i in range(n):
            c = mid + d * (i - (n - 1) / 2) * 2.6 * self.k
            out.add(Line(c - nrm * size * self.k, c + nrm * size * self.k, color=color, stroke_width=self.w(width)))
        return out

    def chevrons(self, a, b, n=1, color=RED, size=4.2, at=0.5):
        """Filled parallel-line arrowheads on ab, pointing from a to b."""
        d = self._dir(a, b)
        nrm = np.array([-d[1], d[0], 0])
        base = self.P(*a) + (self.P(*b) - self.P(*a)) * at
        s = size * self.k
        out = VGroup()
        for i in range(n):
            c = base + d * (i - (n - 1) / 2) * s * 1.1
            pts = [c + d * s * 0.55, c - d * s * 0.45 + nrm * s * 0.75, c - d * s * 0.1, c - d * s * 0.45 - nrm * s * 0.75]
            out.add(Polygon(*pts, color=color, fill_color=color, fill_opacity=1, stroke_width=self.w(0.5)))
        return out

    def corner(self, v, p1, p2, r=7, color=BLUE, n=1, fill=None, width=1.3):
        """Arc(s) marking the angle p1-v-p2, with an optional tinted wedge."""
        c = self.P(*v)
        a1 = np.arctan2(*(self.P(*p1) - c)[1::-1])
        a2 = np.arctan2(*(self.P(*p2) - c)[1::-1])
        d = (a2 - a1 + PI) % (2 * PI) - PI
        out = VGroup()
        if fill:
            out.add(Sector(radius=r * self.k, start_angle=a1, angle=d, arc_center=c, fill_color=fill, fill_opacity=0.35, stroke_width=0))
        for i in range(n):
            out.add(Arc(radius=(r + i * 2.4) * self.k, start_angle=a1, angle=d, arc_center=c, color=color, stroke_width=self.w(width)))
        return out

    def right(self, v, p1, p2, size=6, color=SQUARE_BLUE, fill=SQUARE_BLUE):
        c = self.P(*v)
        u = self._dir(v, p1) * size * self.k
        t = self._dir(v, p2) * size * self.k
        return Polygon(c, c + u, c + u + t, c + t, color=color, stroke_width=self.w(0.9), fill_color=fill, fill_opacity=0.45)

    # ---------- text ----------

    def text(self, s, x, base, size=12, color=INK, font=SERIF, weight=NORMAL, t2c=None, center=False, bold_colored=False):
        """Text with its left edge (or centre) at x and its baseline at page y = base."""
        key = (font, weight)
        if key not in self._caps:
            self._caps[key] = Text("H", font=font, weight=weight, font_size=48).height
        signs = [ch for ch in "∠△≅" if ch in s]
        t2w = {k: BOLD for k in t2c or {}} if bold_colored else {}
        t2w.update({ch: NORMAL for ch in signs})
        t = Text(s, font=font, weight=weight, font_size=48, color=color, t2c=t2c or {}, t2f={ch: MATH for ch in signs}, t2w=t2w)
        t.scale(size * 0.7 * self.k / self._caps[key])
        target = self.P(x, base)
        dx = target[0] - (t.get_center()[0] if center else t.get_left()[0])
        t.shift(np.array([dx, target[1] - self._baseline(t), 0]))
        return t

    @staticmethod
    def _baseline(t):
        """The most common glyph bottom; ties go to the lower one, below raised signs like = and ∠."""
        if not t.submobjects:
            return t.get_bottom()[1]
        bottoms = [round(float(m.get_bottom()[1]), 2) for m in t.submobjects]
        return min(set(bottoms), key=lambda b: (-bottoms.count(b), b))

    def after(self, first, s, gap=3.5, **kw):
        """Text continuing on the same baseline after `first`."""
        base = self.c[1] - self._baseline(first) / self.k
        x = self.c[0] + first.get_right()[0] / self.k + gap
        return self.text(s, x, base, **kw)

    def bullet(self, x, base, size=12):
        return self.text("➢", x, base, size=size * 0.9, font=SYMBOL)

    def label(self, s, p, size=8, color=INK, font="Arial", weight=BOLD):
        t = Text(s, font=font, weight=weight, font_size=48, color=color)
        key = (font, weight)
        if key not in self._caps:
            self._caps[key] = Text("H", font=font, weight=weight, font_size=48).height
        t.scale(size * 0.7 * self.k / self._caps[key])
        t.move_to(self.P(*p))
        return t

    def tag(self, s, x0, y0, x1, y1, fill, size=12, font=ROUND, weight=BOLD):
        box = Polygon(*[self.P(*q) for q in ((x0, y0), (x1, y0), (x1, y1), (x0, y1))], stroke_width=0, fill_color=fill, fill_opacity=1)
        t = self.text(s, (x0 + x1) / 2, (y0 + y1) / 2 + size * 0.35, size=size, font=font, weight=weight, center=True)
        return VGroup(box, t)


# ---------------------------------------------------------------- JM29 (A)

class ParallelogramProperties(PageScene):
    """Three property cards; each property is shown by the half-turn symmetry about the centre."""

    def construct(self):
        cards = [(46, 343, 564, 442), (46, 452, 564, 560), (46, 568, 564, 677)]
        titles = ["The opposite sides are equal in length.", "The opposite angles are congruent.", "The diagonals bisect each other."]
        facts = [("AD = BC", "AB = DC"), ("∠A = ∠C", "∠B = ∠D"), ("AE = CE", "BE = DE")]
        reasons = ["[opp. sides of //gram]", "[opp. ∠s of //gram]", "[diags. of //gram]"]
        for i, (x0, y0, x1, y1) in enumerate(cards):
            box = self.frame(x0, y0, x1, y1, FRAME_RED)
            num = self.text(f"{i + 1}.", 54, y0 + 29, 14, font=CALIBRI, weight=BOLD)
            title = self.text(titles[i], 72, y0 + 28, 17, font=ROUND)
            if i < 2:
                A, D, B, C = (432, y0 + 24), (548, y0 + 24), (404, y0 + 80), (520, y0 + 80)
            else:
                A, D, B, C = (420, y0 + 20), (540, y0 + 20), (392, y0 + 88), (512, y0 + 88)
            O = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
            shape = self.poly(A, D, C, B, width=1.8)
            names = VGroup(
                self.label("A", (A[0] - 4, A[1] - 9), 10), self.label("D", (D[0] + 4, D[1] - 9), 10),
                self.label("B", (B[0] - 5, B[1] + 9), 10), self.label("C", (C[0] + 5, C[1] + 9), 10),
            )
            self.play(Create(box), Write(num), run_time=0.6)
            self.play(Write(title), Create(shape), FadeIn(names), run_time=1.2)
            first = self.text(facts[i][0] + ",", 72, y0 + 56, 14, color=BLUE, font=MATH, weight=BOLD, t2c={",": INK})
            second = self.after(first, facts[i][1], gap=5, size=14, color=GREEN, font=MATH, weight=BOLD)
            mark = dict(width=1.6, size=4.2)
            if i == 0:
                self.half_turn(self.line(A, D, BLUE, 3), O, self.ticks(A, D, 1, BLUE, **mark), self.ticks(B, C, 1, BLUE, **mark), first)
                self.half_turn(self.line(A, B, GREEN, 3), O, self.ticks(A, B, 2, GREEN, **mark), self.ticks(D, C, 2, GREEN, **mark), second)
            elif i == 1:
                self.half_turn(self.corner(A, D, B, 8, BLUE, 1, BLUE, 1.6), O, None, None, first)
                self.half_turn(self.corner(B, A, C, 8, GREEN, 2, GREEN, 1.6), O, None, None, second)
            else:
                E = O
                diagonals = VGroup(self.line(A, C, DIAG, 1.5), self.line(B, D, DIAG, 1.5))
                e = VGroup(self.dot(E), self.label("E", (E[0], E[1] + 10), 10))
                self.play(Create(diagonals), FadeIn(e), run_time=0.8)
                self.half_turn(self.line(A, E, BLUE, 3), E, self.ticks(A, E, 1, BLUE, **mark), self.ticks(E, C, 1, BLUE, **mark), first)
                self.half_turn(self.line(B, E, GREEN, 3), E, self.ticks(B, E, 2, GREEN, **mark), self.ticks(E, D, 2, GREEN, **mark), second)
            reason = self.text(reasons[i], 73, y0 + 84.5, 17, font=ROUND)
            self.play(Write(reason), run_time=0.8)
            self.wait(0.3)
        self.wait(1.5)

    def half_turn(self, part, centre, mark1, mark2, fact):
        """Shows `part`, turns a copy half a turn about the centre onto its opposite, then states the fact."""
        self.play(Create(part), run_time=0.6)
        copy = part.copy()
        self.play(Rotate(copy, PI, about_point=self.P(*centre)), run_time=1.1)
        anims = [Write(fact)]
        if mark1 is not None:
            anims += [FadeOut(part), FadeOut(copy), FadeIn(mark1), FadeIn(mark2)]
        self.play(*anims, run_time=0.8)


# ---------------------------------------------------------------- JM29 (B)

class ToShowParallelogram(PageScene):
    """Four tests; each card marks the given condition, then shows both pairs of sides parallel."""

    def construct(self):
        cards = [(42, 216, 277, 404), (305, 215, 539, 404), (42, 410, 277, 598), (306, 409, 540, 597)]
        titles = ["1. Opposite sides equal", "2. Opposite angles equal", "3. Diagonals bisect each other", "4. Opposite sides equal and //"]
        conds = [("If AB = DC", "and AD = BC"), ("If ∠A = ∠C", "and ∠B = ∠D"), ("If AE = CE", "and BE = DE"), ("If AD = BC", "and AD // BC")]
        reasons = ["[opp. sides equal]", "[opp. ∠s equal]", "[diags. bisect each other]", "[2 sides equal and //]"]
        for i, (x0, y0, x1, y1) in enumerate(cards):
            box = self.frame(x0, y0, x1, y1, FRAME_BLUE)
            num, words = titles[i].split(" ", 1)
            title = VGroup(self.text(num, x0 + 10, y0 + 23, 13.5, font=ROUND), self.text(words, x0 + 33, y0 + 23, 13.5, font=ROUND))
            A, D, B, C = (x0 + 66, y0 + 70), (x0 + 205, y0 + 70), (x0 + 37, y0 + 141), (x0 + 178, y0 + 141)
            E = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
            shape = self.poly(A, D, C, B)
            names = VGroup(
                self.label("A", (A[0] - 2, A[1] - 9), 10), self.label("D", (D[0] + 3, D[1] - 9), 10),
                self.label("B", (B[0] - 4, B[1] + 10), 10), self.label("C", (C[0] + 4, C[1] + 10), 10),
            )
            self.play(Create(box), Write(title), run_time=0.8)
            self.play(Create(shape), FadeIn(names), run_time=0.8)
            c1 = self.text(conds[i][0], x0 + 33, y0 + 50, 15, font=ROUND)
            c2 = self.after(c1, conds[i][1], gap=4, size=15, font=ROUND)
            if i == 0:
                g1 = VGroup(self.ticks(A, B, 2, GREEN), self.ticks(D, C, 2, GREEN))
                g2 = VGroup(self.ticks(A, D, 1, BLUE), self.ticks(B, C, 1, BLUE))
            elif i == 1:
                g1 = VGroup(self.corner(A, D, B, 8, BLUE, 1, BLUE), self.corner(C, B, D, 8, BLUE, 1, BLUE))
                g2 = VGroup(self.corner(B, A, C, 8, GREEN, 2, GREEN), self.corner(D, C, A, 8, GREEN, 2, GREEN))
            elif i == 2:
                diags = VGroup(self.line(A, C, GREY, 1.1), self.line(B, D, GREY, 1.1), self.label("E", (E[0], E[1] + 10), 10))
                self.play(Create(diags), run_time=0.6)
                g1 = VGroup(self.ticks(A, E, 1, BLUE), self.ticks(E, C, 1, BLUE))
                g2 = VGroup(self.ticks(B, E, 2, GREEN), self.ticks(E, D, 2, GREEN))
            else:
                g1 = VGroup(self.ticks(A, D, 1, BLUE), self.ticks(B, C, 1, BLUE))
                g2 = VGroup(self.chevrons(A, D, 1, GREEN, at=0.62), self.chevrons(B, C, 1, GREEN, at=0.62))
            self.play(Write(c1), LaggedStart(*[GrowFromCenter(m) for m in g1], lag_ratio=0.3), run_time=1)
            self.play(Write(c2), LaggedStart(*[GrowFromCenter(m) for m in g2], lag_ratio=0.3), run_time=1)
            par = VGroup(self.chevrons(B, A, 2, RED, at=0.25), self.chevrons(C, D, 2, RED, at=0.25))
            if i != 3:
                par.add(self.chevrons(A, D, 1, RED, at=0.75), self.chevrons(B, C, 1, RED, at=0.75))
            orange = self.poly(A, D, C, B, color=ORANGE, width=2.2)
            self.play(Create(orange), LaggedStart(*[FadeIn(m) for m in par], lag_ratio=0.2), run_time=1)
            reason = self.text(reasons[i], (x0 + x1) / 2, y0 + 173, 16.5, font=ROUND, center=True)
            self.play(Write(reason), run_time=0.8)
            self.wait(0.2)
        self.wait(1.5)


# ---------------------------------------------------------------- JM29 (C)

class CardScene(PageScene):
    """Shared layout of the C booklet: a purple card of bullet points beside a figure."""

    def card(self, frame, heading, lines, base0, step=24):
        box = self.frame(*frame, FRAME_PURPLE)
        head = self.text(heading, 44, base0, 12)
        self.play(Create(box), Write(head), run_time=0.8)
        out = []
        for n, s in enumerate(lines):
            base = base0 + step * (n + 1)
            out.append(VGroup(self.bullet(68, base), self.text(s, 92, base, 12)))
        return out


class Trapezium(CardScene):
    def construct(self):
        rows = self.card((36, 215, 387, 334), "A.   Trapezium", ["The bases are parallel sides", "The perpendicular between the bases is the height", "Area ="], 239)
        U1, U2, L1, L2 = (453, 231), (521, 231), (437, 288), (561, 288)
        shape = self.poly(U1, U2, L2, L1, color=FRAME_BLUE, width=1.4)
        self.play(Create(shape), run_time=0.8)
        par = VGroup(self.chevrons(U1, U2, 1, INK, 4, 0.6), self.chevrons(L1, L2, 1, INK, 4, 0.6))
        upper = self.span((U1[0], 225), (U2[0], 225))
        lower = self.span((L1[0], 293.5), (L2[0], 293.5))
        names = VGroup(self.label("upper base", (487, 219), 8, font=SERIF, weight=NORMAL), self.label("lower base", (499, 299.5), 8, font=SERIF, weight=NORMAL))
        self.play(Write(rows[0]), FadeIn(par), Create(upper), Create(lower), FadeIn(names), Indicate(self.line(U1, U2, FRAME_BLUE, 2)), run_time=1.2)
        H = (458, 288)
        height = VGroup(
            self.line((458, 233), H, INK, 1.0), self.chevrons(H, (458, 233), 1, INK, 4, 1.0),
            self.right(H, (458, 233), L2, 5, INK, None), self.label("height", (472, 259), 8, font=SERIF, weight=NORMAL),
        )
        self.play(Write(rows[1]), Create(height), run_time=1.4)
        # Two copies of the trapezium make a parallelogram with base (upper + lower).
        M = ((U2[0] + L2[0]) / 2, (U2[1] + L2[1]) / 2)
        copy = self.poly(U1, U2, L2, L1, color=ORANGE, width=1.4).set_fill(ORANGE, 0.25)
        self.play(Rotate(copy, PI, about_point=self.P(*M)), run_time=1.4)
        whole = self.label("upper + lower", (540, 299.5), 8, color="#9a5b00", font=SERIF, weight=NORMAL)
        self.play(FadeOut(names[1]), FadeIn(whole), run_time=0.6)
        frac_top = self.text("(upper base+lower base) × height", 131, 304.5, 8.5, font=MATH)
        bar = self.line((131, 307.5), (270, 307.5), INK, 0.6)
        frac_bot = self.text("2", 198, 317, 8.5, font=MATH)
        self.play(Write(rows[2]), Write(frac_top), Create(bar), run_time=1.2)
        self.play(Write(frac_bot), Indicate(copy, color=ORANGE), run_time=0.9)
        self.play(FadeOut(copy), FadeOut(whole), FadeIn(names[1]), run_time=0.7)
        # Isosceles trapezium: the mirror line gives the equal angles and diagonals.
        title = self.text("Isosceles Trapezium", 452, 335, 12)
        A, B, D, C = (431, 432), (567, 432), (473, 356), (533, 356)
        mid = (A[0] + B[0]) / 2
        K = (mid, A[1] + (D[1] - A[1]) * (B[0] - A[0]) / (B[0] - A[0] + C[0] - D[0]))
        iso = self.poly(A, B, C, D, color=GREY, width=1.1)
        purple = "#4a4ad0"
        names2 = VGroup(*[self.label(s, p, 6.5, color=c, font="Arial", weight=NORMAL) for s, p, c in (
            ("A", (424, 428), purple), ("B", (573, 428), purple), ("D", (477, 351), purple), ("C", (539, 351), purple), ("K", (mid, K[1] + 8), purple))])
        sides = VGroup(self.ticks(A, D, 1, GREY), self.ticks(B, C, 1, GREY))
        box = VGroup(*[self.dashed(p, q, INK, 1.3, 5) for p, q in (((244, 353), (387, 353)), ((387, 353), (387, 434)), ((387, 434), (244, 434)), ((244, 434), (244, 353)))])
        arrow = VGroup(self.line((400, 390), (430, 390), INK, 1.4), self.chevrons((400, 390), (435, 390), 1, INK, 4, 0.93))
        self.play(Write(title), Create(iso), FadeIn(names2[:4]), FadeIn(sides), FadeIn(VGroup(self.dot(D, purple, 1.4), self.dot(C, purple, 1.4))), Create(box), Create(arrow), run_time=1.2)
        axis = self.dashed((mid, 348), (mid, 436), GREY, 0.9, 3)
        self.play(Create(axis), run_time=0.5)
        facts = [
            ("∠D = ∠C", self.corner(D, A, C, 8, "#e05050", 1, "#f3a0a0")),
            ("∠A = ∠B", self.corner(A, B, D, 9, "#2a9d4a", 1, "#8fd19e")),
            ("AC = BD", self.line(A, C, BLUE, 2.0)),
        ]
        for n, (fact, part) in enumerate(facts):
            row = VGroup(self.bullet(275, 375.5 + 24 * n), self.text(fact, 299, 375.5 + 24 * n, 12, font=MATH))
            self.play(Write(row), Create(part), run_time=0.8)
            mirror = part.copy()
            self.play(Rotate(mirror, PI, axis=UP, about_point=self.P(mid, 390)), run_time=1.0)
            if n == 2:
                diagonals = VGroup(self.line(A, C, GREY, 1.1), self.line(B, D, GREY, 1.1))
                self.play(FadeOut(part), FadeOut(mirror), FadeIn(diagonals), FadeIn(self.dot(K, purple, 1.4)), FadeIn(names2[4]), run_time=0.6)
        self.play(FadeOut(axis), run_time=0.4)
        self.wait(1.5)

    def span(self, a, b):
        """A dimension line with arrowheads at both ends."""
        return VGroup(self.line(a, b, INK, 0.9), self.chevrons(b, a, 1, INK, 3.5, 1.0), self.chevrons(a, b, 1, INK, 3.5, 1.0))


class Rhombus(CardScene):
    def construct(self):
        rows = self.card((36, 62, 387, 171), "B.   Rhombus", ["All sides are equal", "Diagonals are perpendicular to each other", "Interior angles bisected by the diagonals"], 85)
        A, B, C, D = (503, 69), (521, 123.5), (471, 160), (453.5, 107)
        E = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
        shape = self.poly(A, B, C, D, color=INK, width=1.3)
        corners = VGroup(*[self.dot(p, INK, 1.4) for p in (A, B, C, D)])
        names = VGroup(*[self.label(s, p, 6.5, color="#333333", font="Arial", weight=NORMAL) for s, p in (("A", (503, 64)), ("B", (527.5, 124)), ("C", (471, 168)), ("D", (446.5, 107)), ("E", (480.5, 119)))])
        self.play(Create(shape), FadeIn(corners), FadeIn(names), run_time=1)
        sides = VGroup(*[self.ticks(p, q, 1, INK) for p, q in ((A, B), (B, C), (C, D), (D, A))])
        self.play(Write(rows[0]), LaggedStart(*[GrowFromCenter(t) for t in sides], lag_ratio=0.25), run_time=1.3)
        diags = VGroup(self.dashed(A, C), self.dashed(B, D))
        self.play(Write(rows[1]), Create(diags), run_time=1.1)
        mark = self.right(E, A, B, 9)
        self.play(GrowFromCenter(mark), FadeIn(self.dot(E, INK, 1.4)), run_time=0.6)
        half1 = self.corner(C, D, A, 11, RED, 1, "#f06060")
        half2 = self.corner(C, A, B, 11, RED, 1, "#f06060")
        self.play(Write(rows[2]), FadeIn(half1), run_time=1)
        self.play(TransformFromCopy(half1, half2), run_time=0.9)
        self.wait(1.5)


class Rectangle(CardScene):
    def construct(self):
        rows = self.card((36, 60, 387, 166), "C.   Rectangles", ["All the interior angles are right angles", "Diagonals are equal", "Diagonals bisect each other into four equal parts"], 83)
        A, B, C, D = (425, 86), (552, 86), (552, 136), (425, 136)
        E = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
        shape = self.poly(A, B, C, D, color=INK, width=1.3)
        names = VGroup(*[self.label(s, p, 6.5, color="#333333", font="Arial", weight=NORMAL) for s, p in (("A", (418, 80)), ("B", (559, 80)), ("C", (559, 142)), ("D", (418, 142)), ("E", (490, 117)))])
        sides = VGroup(self.ticks(A, B, 1, INK), self.ticks(D, C, 1, INK), self.ticks(A, D, 2, INK), self.ticks(B, C, 2, INK))
        self.play(Create(shape), FadeIn(VGroup(*[self.dot(p, INK, 1.4) for p in (A, B, C, D)])), FadeIn(names), FadeIn(sides), run_time=1)
        corners = [self.right(A, B, D, 10), self.right(B, C, A, 10), self.right(C, D, B, 10), self.right(D, A, C, 10)]
        self.play(Write(rows[0]), LaggedStart(*[GrowFromCenter(m) for m in corners], lag_ratio=0.25), run_time=1.3)
        ac = self.line(A, C, DIAG, 1.8)
        bd = self.line(B, D, DIAG, 1.8)
        self.play(Write(rows[1]), Create(ac), run_time=0.9)
        self.play(TransformFromCopy(ac, bd), run_time=1.0)
        quarters = VGroup(*[self.ticks(p, E, 1, INK, 5, 2) for p in (A, B, C, D)])
        self.play(Write(rows[2]), FadeIn(self.dot(E, INK, 1.4)), run_time=1)
        self.play(LaggedStart(*[GrowFromCenter(t) for t in quarters], lag_ratio=0.25), run_time=1)
        self.play(Transform(ac, self.dashed(A, C)), Transform(bd, self.dashed(B, D)), run_time=0.6)
        self.wait(1.5)


class Square(CardScene):
    def construct(self):
        rows = self.card((36, 59, 387, 166), "D.   Squares", ["All sides are equal", "Diagonals are perpendicular to each other", "Angle between each diagonal and a side is 45°"], 82.5)
        A, B, C, D = (450, 75), (526, 75), (526, 151), (450, 151)
        E = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
        shape = self.poly(A, B, C, D, color=INK, width=1.3)
        names = VGroup(*[self.label(s, p, 6.5, color="#333333", font="Arial", weight=NORMAL) for s, p in (("A", (445, 70)), ("B", (531, 70)), ("C", (531, 156)), ("D", (445, 156)), ("E", (481, 112)))])
        corners = VGroup(self.right(A, B, D, 10), self.right(B, C, A, 10), self.right(C, D, B, 10), self.right(D, A, C, 10))
        self.play(Create(shape), FadeIn(VGroup(*[self.dot(p, INK, 1.4) for p in (A, B, C, D)])), FadeIn(names), FadeIn(corners), run_time=1)
        sides = VGroup(*[self.ticks(p, q, 1, INK) for p, q in ((A, B), (B, C), (C, D), (D, A))])
        self.play(Write(rows[0]), LaggedStart(*[GrowFromCenter(t) for t in sides], lag_ratio=0.25), run_time=1.3)
        diags = VGroup(self.dashed(A, C), self.dashed(B, D))
        self.play(Write(rows[1]), Create(diags), run_time=1.0)
        mark = self.right(E, B, C, 10, RED, "#f06060")
        self.play(GrowFromCenter(mark), FadeIn(self.dot(E, INK, 1.4)), run_time=0.6)
        angle = self.corner(A, B, C, 18, RED, 1, "#f06060")
        deg = self.label("45°", (473, 84), 6.5, color=RED, font="Arial", weight=BOLD)
        self.play(Write(rows[2]), FadeIn(angle), FadeIn(deg), run_time=1)
        others = VGroup(self.corner(A, D, C, 18, RED, 1, "#f06060"), self.corner(C, B, A, 18, RED, 1, "#f06060"), self.corner(C, D, A, 18, RED, 1, "#f06060"))
        self.play(LaggedStart(*[TransformFromCopy(angle, o) for o in others], lag_ratio=0.3), run_time=1.2)
        self.play(FadeOut(others), run_time=0.5)
        self.wait(1.5)


class QuadrilateralFamily(PageScene):
    """The family tree, with one shape in the empty top-left corner that changes as each condition is added."""

    def construct(self):
        self.play(Create(self.frame(44, 87, 582, 211, FRAME_PURPLE)), run_time=0.6)

        def word(s, x, base):
            return self.text(s, x, base, 12, font=CALIBRI)

        def note(lines, x, base):
            return VGroup(*[self.text(s, x, base + 18 * n, 12, font=CALIBRI) for n, s in enumerate(lines)])

        def arrow(a, b):
            return VGroup(self.line(a, b, INK, 1.3), self.chevrons(a, b, 1, INK, 4.5, 0.9))

        shapes = {
            "quad": ([(128, 132), (146, 100), (186, 106), (196, 134)], GREY),
            "trap": ([(130, 132), (146, 102), (176, 102), (196, 132)], BLUE),
            "para": ([(128, 132), (144, 102), (196, 102), (180, 132)], GREEN),
            "rect": ([(135, 132), (135, 102), (189, 102), (189, 132)], ORANGE),
            "rhom": ([(140, 132), (152, 102), (184, 102), (172, 132)], MAGENTA),
            "sq": ([(147, 132), (147, 102), (177, 102), (177, 132)], RED),
        }

        def icon(name):
            pts, color = shapes[name]
            return self.poly(*pts, color=color, width=1.4).set_fill(color, 0.18)

        live = icon("quad")
        self.play(Write(word("Quadrilateral", 65, 153.5)), Create(live), run_time=1)
        # (arrow from, arrow to, condition, its position, name, its position, shape, morph from)
        steps = [
            ((143, 149), (171, 149), ["One pair of", "parallel line"], (129, 169.5), "Trapezium", (180, 153.5), "trap", None),
            ((243, 149), (272, 149), ["Two pair of", "parallel line"], (226, 169.5), "Parallelogram", (281, 153.5), "para", None),
            ((356, 144), (397, 120), ["All interior angles", "are right angles"], (293, 109.5), "Rectangle", (407, 126.5), "rect", None),
            ((357, 154), (397, 178), ["Four sides", "are equal"], (326, 176.5), "Rhombus", (407, 182.5), "rhom", "para"),
        ]
        for a, b, lines, at, name, nat, key, back in steps:
            if back:
                self.play(Transform(live, icon(back)), run_time=0.5)
            self.play(Create(arrow(a, b)), Write(note(lines, *at)), run_time=1)
            self.play(Transform(live, icon(key)), Write(word(name, *nat)), run_time=1.1)
        self.play(Create(arrow((464, 121), (504, 145))), Write(note(["Four sides", "are equal"], 482, 109.5)), run_time=1)
        self.play(Create(arrow((465, 179), (506, 155))), Write(note(["All interior angles", "are right angles"], 480, 179.5)), run_time=1)
        self.play(Transform(live, icon("sq")), Write(word("Square", 513, 154.5)), run_time=1.2)
        self.wait(1)
        self.play(FadeOut(live), run_time=0.6)
        self.wait(1)


# ---------------------------------------------------------------- JM29 (D)

class MidPointTheorem(PageScene):
    def construct(self):
        self.play(Create(self.frame(152, 183, 441, 373, FRAME_PURPLE)), run_time=0.5)
        A, B, C = (263, 208), (190, 335), (309.5, 335)
        M = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
        N = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
        tri = VGroup(self.line(A, B), self.line(A, C), self.line(B, C))
        names = VGroup(self.label("A", (263, 197.5), 9, color="#5b2c83"), self.label("B", (184.5, 338), 9, color="#5b2c83"), self.label("C", (313.5, 338), 9, color="#5b2c83"))
        self.play(Create(tri), FadeIn(names), run_time=1)
        bold = dict(font=CALIBRI, size=16.5, bold_colored=True)
        hue = {"=": BLUE}
        t1 = self.text("IF AM = MB", 338.5, 212.5, t2c={"AM": MAGENTA, "MB": MAGENTA, **hue}, **bold)
        ab = self.line(A, B, MAGENTA, 1.8)
        mm = VGroup(self.dot(M, "#7fc4e8", 2.2), self.label("M", (217, 271), 9, color="#5b2c83"), self.ticks(A, M, 1, BLUE), self.ticks(M, B, 1, BLUE))
        self.play(Create(ab), Write(t1), run_time=0.9)
        self.play(FadeIn(mm), run_time=0.6)
        t2 = self.text("and AN = NC", 328, 239.5, t2c={"AN": PEACH, "NC": PEACH, "=": GREEN}, **bold)
        ac = self.line(A, C, PEACH, 1.8)
        nn = VGroup(self.dot(N, "#7fc4e8", 2.2), self.label("N", (293.5, 271.5), 9, color="#5b2c83"), self.ticks(A, N, 2, GREEN), self.ticks(N, C, 2, GREEN))
        self.play(Create(ac), Write(t2), run_time=0.9)
        self.play(FadeIn(nn), run_time=0.6)
        mn = self.line(M, N, RED, 1.8)
        self.play(Create(mn), Write(self.text("Then", 336, 269, **bold)), run_time=0.9)
        # Two copies of MN laid end to end along BC.
        half = ((B[0] + C[0]) / 2, B[1])
        c1, c2 = mn.copy(), mn.copy()
        self.play(c1.animate.move_to(self.P((B[0] + half[0]) / 2, B[1])), c2.animate.move_to(self.P((half[0] + C[0]) / 2, B[1])), run_time=1.3)
        t3 = self.text("MN = ½ BC", 338.5, 298, color=RED, font=CALIBRI, weight=BOLD, size=16.5)
        self.play(Write(t3), Indicate(VGroup(c1, c2), color=RED), run_time=1)
        self.play(FadeOut(c1), FadeOut(c2), run_time=0.4)
        par = VGroup(self.line(B, C, RED, 1.8), self.chevrons(M, N, 1, RED, 8, 0.6), self.chevrons(B, C, 1, RED, 8, 0.6))
        t4 = self.text("MN // BC", 340, 329, color=RED, font=CALIBRI, weight=BOLD, size=16.5)
        self.play(FadeIn(par), Write(t4), run_time=1)
        self.play(FadeIn(self.tag("[mid-pt. theorem]", 289, 344, 422, 367, LABEL_ORANGE, 14, CALIBRI)), run_time=0.8)
        self.wait(1.5)


class InterceptTheorem(PageScene):
    def construct(self):
        bold = dict(font=CALIBRI, size=16, bold_colored=True)
        # Left: a line through the mid-point of one side, parallel to the base.
        self.play(Create(self.frame(36, 66, 304, 271, FRAME_PURPLE)), Create(self.frame(309, 66, 578, 271, FRAME_PURPLE)), run_time=0.6)
        A, B, C = (130, 93), (55, 219.5), (175, 219.5)
        E = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)
        F = ((A[0] + C[0]) / 2, (A[1] + C[1]) / 2)
        tri = VGroup(self.line(A, B, MAGENTA, 1.6), self.line(A, C, PEACH, 1.6), self.line(B, C, FRAME_BLUE, 1.3))
        names = VGroup(*[self.label(s, p, 9, color="#5b2c83") for s, p in (("A", (A[0], A[1] - 9)), ("B", (B[0] - 7, B[1] + 5)), ("C", (C[0] + 7, C[1] + 5)))])
        heading = VGroup(self.text("In", 205.5, 97, **bold))
        heading.add(self.after(heading[0], "△ABC", gap=4, size=16, color=LABEL_YELLOW, font=SERIF))
        self.play(Create(tri), FadeIn(names), Write(heading), run_time=1)
        e = VGroup(self.dot(E, "#7fc4e8", 2.2), self.label("E", (E[0] - 9, E[1]), 9, color="#5b2c83"), self.ticks(A, E, 1, FRAME_BLUE), self.ticks(E, B, 1, FRAME_BLUE))
        self.play(FadeIn(e), Write(self.text("IF AE = EB", 205.5, 122.5, t2c={"AE": MAGENTA, "EB": MAGENTA, "=": BLUE}, **bold)), run_time=0.9)
        ef = self.line(E, F, FRAME_BLUE, 1.3)
        par = VGroup(self.chevrons(E, F, 1, RED, 8, 0.6), self.chevrons(B, C, 1, RED, 8, 0.6))
        self.play(Create(ef), FadeIn(par), Write(self.text("and EF // BC", 186, 150, t2c={"EF // BC": RED}, **bold)), run_time=1.1)
        f = VGroup(self.dot(F, "#7fc4e8", 2.2), self.label("F", (F[0] + 9, F[1]), 9, color="#5b2c83"))
        self.play(FadeIn(f), Write(self.text("Then", 202, 175, **bold)), run_time=0.6)
        ff = VGroup(self.ticks(A, F, 2, GREEN), self.ticks(F, C, 2, GREEN))
        self.play(LaggedStart(*[GrowFromCenter(t) for t in ff], lag_ratio=0.4), Write(self.text("AF = FC", 219.5, 199, t2c={"AF": PEACH, "FC": PEACH, "=": GREEN}, **bold)), run_time=1)
        self.play(FadeIn(self.tag("[intercept theorem]", 69, 232.5, 211.5, 254, LABEL_PURPLE, 13, CALIBRI)), FadeIn(self.tag("for triangles", 214, 234.5, 289, 254, LABEL_YELLOW, 11, CALIBRI)), run_time=0.8)

        # Right: three parallel lines cut equal parts on every transversal.
        ys = (115, 154.5, 192.5)
        lines = VGroup(*[self.line((339, y), (466, y), FRAME_BLUE, 1.2) for y in ys])
        par2 = VGroup(*[self.chevrons((339, y), (466, y), 1, RED, 8, 0.55) for y in ys])
        ln = VGroup(*[self.text(s, 324, y + 1, 10, color=RED, font=SERIF, weight=BOLD) for s, y in zip(("L₁", "L₂", "L₃"), ys)])
        self.play(Create(lines), FadeIn(par2), FadeIn(ln), run_time=1)
        left = self.line((364, 78), (336, 222), FRAME_BLUE, 1.2)
        ax = lambda y: 364 + (336 - 364) * (y - 78) / (222 - 78)
        P1 = [(ax(y), y) for y in ys]
        abc = VGroup(*[self.label(s, (p[0] + 5, p[1] - 7), 9, color="#5b2c83") for s, p in zip("ABC", P1)])
        seg = VGroup(self.line(P1[0], P1[2], MAGENTA, 1.6), self.ticks(P1[0], P1[1], 1, FRAME_BLUE), self.ticks(P1[1], P1[2], 1, FRAME_BLUE))
        self.play(Create(left), FadeIn(abc), run_time=0.7)
        self.play(Create(seg), Write(self.text("IF AB = BC", 481.5, 97, t2c={"AB": MAGENTA, "BC": MAGENTA, "=": BLUE}, **bold)), run_time=1)
        self.play(Write(self.text("and L₁ // L₂ // L₃", 448, 124, t2c={"L₁ // L₂ // L₃": RED}, **bold)), run_time=0.9)
        tops, bots = (427, 78), (451, 222)
        right = self.line(tops, bots, FRAME_BLUE, 1.2)
        self.play(Create(right), Write(self.text("Then", 479.5, 149, **bold)), run_time=0.8)

        def marks(top, bottom):
            bx = lambda y: top[0] + (bottom[0] - top[0]) * (y - top[1]) / (bottom[1] - top[1])
            q = [(bx(y), y) for y in ys]
            return VGroup(
                self.line(q[0], q[2], PEACH, 1.6), self.ticks(q[0], q[1], 2, GREEN), self.ticks(q[1], q[2], 2, GREEN),
                *[self.label(s, (p[0] + 8, p[1] - 7), 9, color="#5b2c83") for s, p in zip("DEF", q)],
            )

        m = marks(tops, bots)
        self.play(FadeIn(m), Write(self.text("DE = EF", 495, 173, t2c={"DE": PEACH, "EF": PEACH, "=": GREEN}, **bold)), run_time=1)
        # Tilt the second transversal: the parts stay equal.
        for top, bottom in (((412, 78), (470, 222)), ((440, 78), (436, 222)), (tops, bots)):
            self.play(Transform(right, self.line(top, bottom, FRAME_BLUE, 1.2)), Transform(m, marks(top, bottom)), run_time=0.9)
        self.play(FadeIn(self.tag("[intercept theorem]", 420, 231, 564, 253, LABEL_PURPLE, 13, CALIBRI)), run_time=0.8)
        self.wait(1.5)
