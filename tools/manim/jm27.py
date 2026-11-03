"""Manim scene for the JM27 (A) "Increase at a Constant Rate" panel.

The panel is a picture on the page, so positions are the ink boxes measured
from that picture (page points, origin top-left). The last frame is the panel.
"""

import numpy as np
from manim import (
    NORMAL, Create, DashedVMobject, FadeIn, ITALIC, Line, Polygon, RoundedRectangle, Text, VGroup, Write,
)

from jm29 import PageScene

PINK = "#F992C1"
BLUE = "#09A0F6"
GREEN = "#0BB162"
RED = "#F40E12"
MAGENTA = "#DE81D4"
INK = "#262626"
MATH = "Cambria"
CJK = "Microsoft JhengHei"


class IncreaseAtConstantRate(PageScene):
    def fit(self, s, x, top, height, font, color=INK, slant=NORMAL, t2c=None, width=None):
        """Left edge at x. Ink height is `height` points; `width` stretches it to that width."""
        t = Text(s, font=font, slant=slant, font_size=64, color=color, t2c=t2c or {}, disable_ligatures=True)
        t.scale(height * self.k / t.height)
        if width:
            t.stretch_to_fit_width(width * self.k)
        target = self.P(x, top + height / 2)
        t.shift(np.array([target[0] - t.get_left()[0], target[1] - t.get_center()[1], 0.0]))
        return t

    def arrow(self, a, b, color=GREEN, width=1.55, head=6.4):
        d = self._dir(a, b)
        nrm = np.array([-d[1], d[0], 0.0])
        tip = self.P(*b)
        back = tip - d * head * self.k
        shaft = Line(self.P(*a), back, color=color, stroke_width=self.w(width))
        head_w = head * 0.42 * self.k
        tri = Polygon(tip, back + nrm * head_w, back - nrm * head_w, color=color, fill_color=color, fill_opacity=1, stroke_width=0)
        return VGroup(shaft, tri)

    def rounded(self, x0, y0, x1, y1, radius, color, width):
        """Stroke centred on the path, so the path is inset by half the stroke."""
        inset = width / 2
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        rr = RoundedRectangle(
            width=(x1 - x0 - width) * self.k,
            height=(y1 - y0 - width) * self.k,
            corner_radius=radius * self.k,
            color=color,
            stroke_width=self.w(width),
        )
        rr.move_to(self.P(cx, cy))
        return rr

    def chain_term(self, x, width, exp=None):
        term = self.fit("P × (1 + r%)", x, 143.2, 16.2, MATH, BLUE, ITALIC, t2c={"r%": GREEN}, width=width)
        if not exp:
            return term
        mark = self.fit(exp, x + width + 0.6, 139.4, 7.0, MATH, RED, ITALIC)
        return VGroup(term, mark)

    def rate(self, x_arrow, x_label):
        """An upward arrow and the r% beside it, above a horizontal arrow."""
        up = self.arrow((x_arrow, 141.8), (x_arrow, 118.2), head=6.0)
        label = self.fit("r%", x_label, 124.4, 11.2, MATH, GREEN, ITALIC)
        return VGroup(up, label)

    def construct(self):
        # Coordinates are ink boxes on pages/p06.jpg, not the source picture's own grid.
        frame = self.rounded(89.33, 93.33, 504.33, 266.67, 8.2, PINK, 2.05)
        first = self.fit("P", 98.3, 141.0, 16.8, MATH, BLUE, ITALIC)
        hop = (
            VGroup(self.arrow((115.0, 150.0), (155.2, 150.0), head=8.0), self.rate(126.4, 140.0)),
            VGroup(self.arrow((234.3, 150.4), (272.6, 150.4), head=8.0), self.rate(243.9, 258.0)),
            VGroup(self.arrow((351.0, 150.4), (390.0, 150.4), head=8.0), self.rate(362.2, 377.0)),
        )
        terms = VGroup(
            self.chain_term(162.0, 66),
            self.chain_term(278.0, 62, "2"),
            self.chain_term(396.0, 60, "3"),
        )
        dots = VGroup(*[self.dot((x, 152.0), BLUE, 1.45) for x in (474.4, 478.8, 483.2, 487.6, 492.0)])

        added = self.fit("增加", 99.7, 202.0, 14.6, CJK, width=28)
        en = self.fit("n", 131.5, 207.4, 8.0, MATH, RED, ITALIC)
        label = VGroup(added, en, self.fit("次之後：", 146.5, 202.2, 14.4, CJK, width=38))
        chip = DashedVMobject(
            self.rounded(188.3, 191.0, 314.3, 233.0, 4.0, BLUE, 1.2),
            num_dashes=42, dashed_ratio=0.58,
        )
        formula = self.fit(
            "A = P(1 + r%)", 206.0, 206.4, 12.6, MATH, INK, ITALIC,
            t2c={"A": MAGENTA, "P": BLUE, "r%": GREEN}, width=80,
        )
        power = self.fit("n", 289.0, 201.0, 6.2, MATH, RED, ITALIC)
        note1 = VGroup(
            self.fit("*", 324.0, 206.0, 8.6, MATH, INK),
            self.fit("A : New value", 338.0, 203.2, 12.0, MATH, MAGENTA, ITALIC),
        )
        note2 = VGroup(
            self.fit("*", 324.0, 232.4, 8.0, MATH, INK),
            self.fit("(1 + r%)", 337.0, 229.6, 11.8, MATH, GREEN, ITALIC),
            self.fit("叫做", 398.0, 229.8, 12.2, CJK),
            self.fit("'growth factor'", 428.0, 230.0, 11.4, MATH, INK, ITALIC),
        )

        self.play(Create(frame), run_time=0.5)
        self.play(Write(first), run_time=0.45)
        for jump, term in zip(hop, terms):
            self.play(Create(jump), Write(term), run_time=0.95)
        self.play(Write(dots), run_time=0.3)
        self.play(Write(label), run_time=0.7)
        self.play(Create(chip), Write(formula), Write(power), run_time=0.95)
        self.play(FadeIn(note1), FadeIn(note2), run_time=0.6)
        self.wait(1.2)
