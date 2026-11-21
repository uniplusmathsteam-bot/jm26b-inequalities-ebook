"""Manim scene for the JM28 (A) panel of special lines in a triangle.

The video covers the row of four triangles on page 1, not the labels under them,
so "Altitude", "Median", "Angle Bisector" and "Perpendicular Bisector" stay
printed. Each line is drawn by the move that defines it: a plumb line dropped
from the vertex, a base halved, an angle folded onto itself, and a base halved
with a line standing upright on it. The last frame is the printed row.
"""

import numpy as np
from manim import (
    OUT, PI, Arc, Create, Dot, FadeIn, FadeOut, GrowFromCenter, LaggedStart, Line, Polygon, Rotate,
    Sector, VGroup, VMobject,
)

from jm29 import PageScene

INK = "#1a1a1a"
FILL = "#ece8dc"
GREEN = "#14a84a"
ORANGE = "#f7b500"
TICK = "#1565ff"
APEX = "#e8141c"
FOOT = "#1fa8e0"
SOFT = "#ffe7a3"


class SpecialLines(PageScene):
    def tri(self, a, b, c):
        return Polygon(*[self.P(*p) for p in (a, b, c)], color=INK, stroke_width=self.w(1.7),
                       fill_color=FILL, fill_opacity=1)

    def ball(self, p, color, r=2.3):
        ring = Dot(self.P(*p), radius=(r + 1.1) * self.k, color=INK)
        core = Dot(self.P(*p), radius=r * self.k, color=color)
        return VGroup(ring, core).set_z_index(3)

    def bar(self, x, y, color=TICK):
        return Line(self.P(x, y - 4.2), self.P(x, y + 4.2), color=color, stroke_width=self.w(1.6)).set_z_index(2)

    def square(self, corner, size, left=True, color=GREEN):
        """The open right-angle mark standing on the base, beside a vertical line at corner."""
        x, y = corner
        s = -size if left else size
        m = VMobject(color=color, stroke_width=self.w(0.8))
        m.set_points_as_corners([self.P(x + s, y), self.P(x + s, y - size), self.P(x, y - size)])
        return m.set_z_index(1)

    def construct(self):
        # Page points read from the print (1 pt = 3 px of the page image).
        A1, B1, C1 = (74.7, 84.0), (42.5, 138.5), (156.2, 138.5)
        A2, B2, C2 = (207.5, 84.0), (175.8, 138.0), (289.2, 138.0)
        A3, B3, C3 = (342.2, 84.0), (310.3, 138.0), (424.2, 138.0)
        A4, B4, C4 = (480.0, 82.7), (448.7, 138.5), (562.0, 138.5)

        tris = VGroup(self.tri(A1, B1, C1), self.tri(A2, B2, C2), self.tri(A3, B3, C3), self.tri(A4, B4, C4))
        apexes = VGroup(self.ball(A1, APEX), self.ball(A2, APEX), self.ball(A3, APEX))
        self.play(LaggedStart(*[Create(t) for t in tris], lag_ratio=0.25), run_time=1.6)
        self.play(LaggedStart(*[GrowFromCenter(a) for a in apexes], lag_ratio=0.2), run_time=0.7)
        self.wait(0.4)

        # Altitude: a plumb line falls from the vertex and meets the base at right angles.
        foot1 = (A1[0], B1[1])
        plumb = Line(self.P(*A1), self.P(*foot1), color=GREEN, stroke_width=self.w(0.8)).set_opacity(0.6)
        bob = Dot(self.P(*A1), radius=1.6 * self.k, color=GREEN).set_z_index(2)
        self.play(Create(plumb), bob.animate.move_to(self.P(*foot1)), run_time=1.1)
        sq1 = self.square(foot1, 10.5)
        alt = Line(self.P(*A1), self.P(*foot1), color=GREEN, stroke_width=self.w(2.0)).set_z_index(1)
        self.play(Create(sq1), FadeOut(bob), run_time=0.5)
        self.play(Create(alt), FadeOut(plumb), run_time=0.8)
        self.wait(0.6)

        # Median: the base splits into two equal halves; the line runs to the mid-point.
        m2 = ((B2[0] + C2[0]) / 2, B2[1])
        left = Line(self.P(*B2), self.P(*m2), color=TICK, stroke_width=self.w(2.6)).set_z_index(1)
        right = Line(self.P(*m2), self.P(*C2), color=TICK, stroke_width=self.w(2.6)).set_z_index(1)
        self.play(Create(left), run_time=0.6)
        copy = left.copy()
        self.play(Rotate(copy, PI, axis=OUT, about_point=self.P(*m2)), run_time=0.9)
        self.add(right)
        self.remove(copy)
        ticks2 = VGroup(self.bar(207.0, m2[1]), self.bar(255.5, m2[1]))
        foot2 = self.ball((231.5, 138.5), FOOT)
        self.play(FadeIn(ticks2), GrowFromCenter(foot2), FadeOut(left), FadeOut(right), run_time=0.7)
        med = Line(self.P(*A2), self.P(231.5, 138.5), color=GREEN, stroke_width=self.w(2.0)).set_z_index(1)
        self.play(Create(med), run_time=0.8)
        self.wait(0.6)

        # Angle bisector: one half of the vertex angle folds over the line onto the other half.
        foot3 = (353.8, 137.7)
        c = self.P(*A3)
        ang = lambda p: float(np.arctan2(*(self.P(*p) - c)[1::-1]))
        a_left, a_foot, a_right = ang(B3), ang(foot3), ang(C3)
        r = 14.7 * self.k
        wedge = Sector(radius=r, start_angle=a_foot, angle=a_left - a_foot, arc_center=c, fill_color=SOFT,
                       fill_opacity=0.9, stroke_width=0).set_z_index(0.5)
        self.play(FadeIn(wedge), run_time=0.5)
        guide = Line(c, self.P(*foot3), color=ORANGE, stroke_width=self.w(0.8)).set_opacity(0.6)
        self.play(Create(guide), run_time=0.5)
        d = self.P(*foot3) - c
        folded = wedge.copy()
        self.play(Rotate(folded, PI, axis=d / np.linalg.norm(d), about_point=c), run_time=1.3)
        arcs = VGroup(
            Arc(radius=r, start_angle=a_foot, angle=a_left - a_foot, arc_center=c, color=ORANGE, stroke_width=self.w(1.4)),
            Arc(radius=r, start_angle=a_right, angle=a_foot - a_right, arc_center=c, color=ORANGE, stroke_width=self.w(1.4)),
        ).set_z_index(1)
        bis = Line(c, self.P(*foot3), color=ORANGE, stroke_width=self.w(2.0)).set_z_index(1)
        self.play(Create(arcs), Create(bis), FadeOut(guide), run_time=0.8)
        self.play(FadeOut(wedge), FadeOut(folded), run_time=0.5)
        self.wait(0.6)

        # Perpendicular bisector: the base is halved, then a line stands upright on the mid-point.
        m4 = (505.3, 138.5)
        left4 = Line(self.P(*B4), self.P(*m4), color=TICK, stroke_width=self.w(2.6)).set_z_index(1)
        self.play(Create(left4), run_time=0.6)
        copy4 = left4.copy()
        self.play(Rotate(copy4, PI, axis=OUT, about_point=self.P(*m4)), run_time=0.9)
        ticks4 = VGroup(self.bar(479.7, m4[1]), self.bar(528.3, m4[1]))
        foot4 = self.ball(m4, APEX)
        self.play(FadeIn(ticks4), GrowFromCenter(foot4), FadeOut(left4), FadeOut(copy4), run_time=0.7)
        perp = Line(self.P(*m4), self.P(m4[0], 92.2), color=GREEN, stroke_width=self.w(2.0)).set_z_index(1)
        self.play(Create(perp), run_time=0.9)
        sq4 = self.square(m4, 11.0)
        self.play(Create(sq4), run_time=0.5)
        self.wait(1.2)
