"""Solution guides for JM28 (A) Special Lines and Centres in Triangles.

One scene per green-diamond question (Q2, Q4, Q6, Q8, Q10, Q12), following the
teacher's red working in order. Each special line is shown by the move that
defines it: a median by a half-turn about the mid-point, an angle bisector by a
fold along it, a perpendicular bisector by a fold of one half of the base onto
the other. The angle sum of a triangle is its three angles gathering on a
straight line, and an exterior angle is the two interior opposite angles moved
into it (a slide and a half-turn).

Vertices are the printed corners, nudged where a fold must land exactly
(Q4's D, Q6's C, Q10's D, Q12's A and E) by at most a few points.
"""

import math

import numpy as np
from manim import (
    BOLD, Create, FadeIn, FadeOut, LaggedStart, Polygon, ReplacementTransform, VGroup, VMobject,
)

from guide import AMBER, BLUE, GREEN, INK, PINK, PURPLE, RED, Z_MARK, GuideScene, along, meet, mid


def _deg(v, p):
    """Direction from v to p, in the degrees polar() uses (counter-clockwise from east)."""
    return math.degrees(math.atan2(-(p[1] - v[1]), p[0] - v[0]))


def _bis(v, a, b):
    """The direction halfway between va and vb, the short way round."""
    d1, d2 = _deg(v, a), _deg(v, b)
    return d1 + ((d2 - d1 + 180) % 360 - 180) / 2


def _len(p, q):
    return math.hypot(q[0] - p[0], q[1] - p[1])


def _out(p, q, r):
    """The point r page points from the middle of pq, on the side that a positive r turns to (left of p→q on screen)."""
    m = mid(p, q)
    dx, dy = q[0] - p[0], q[1] - p[1]
    n = math.hypot(dx, dy)
    return (m[0] + dy / n * r, m[1] - dx / n * r)


class Guide(GuideScene):
    LINE = 1.1

    def letter(self, s, p, size=9):
        return self.name(s, p, size)

    def arrow(self, pts, color=INK, width=0.75, tip=3.0):
        """A printed pointer: a smooth curve through page points ending in a filled head."""
        ps = [np.array(self.P(*p), dtype=float) for p in pts]
        end, prev = ps[-1], ps[-2]
        d = (end - prev) / np.linalg.norm(end - prev)
        n = np.array([-d[1], d[0], 0.0])
        base = end - d * tip * self.k
        curve = VMobject(color=color, stroke_width=self.w(width))
        curve.set_points_smoothly(ps[:-1] + [base])
        head = Polygon(end, base + n * tip * 0.42 * self.k, base - n * tip * 0.42 * self.k,
                       color=color, fill_color=color, fill_opacity=1, stroke_width=0)
        return VGroup(curve, head).set_z_index(Z_MARK)

    def sides(self, *pairs, color, width=2.4):
        return VGroup(*[self.mark(p, q, color, width) for p, q in pairs])

    def bar_row(self, x, y, parts, scale):
        """Sides laid end to end on one row: [(length, color), ...] → the bars and their end x."""
        bars = VGroup()
        for length, color in parts:
            bars.add(self.mark((x, y), (x + length * scale, y), color, 3.6))
            x += length * scale
        return bars, x


class Q2(Guide):
    """AB ⊥ BC, CD a median, AC = 13, AB = 8. Find CD."""

    PAGE = 1
    REGION = (403.0, 358.0, 663.0, 504.25)
    LINE = 1.4

    def construct(self):
        A, B, C = (501.2, 373.7), (501.2, 489.5), (567.3, 489.5)
        D = mid(A, B)
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(D, C))
        corner = self.right_mark(B, A, C, 6.7, "#8b1a1a", 0.6)
        ticks = VGroup(self.ticks(A, D, 1, INK, 2.6, 0.7), self.ticks(D, B, 1, INK, 2.6, 0.7))
        names = VGroup(
            self.letter("A", (500.5, 366.5), 8), self.letter("D", (495.0, 429.5), 8),
            self.letter("B", (500.5, 496.0), 8), self.letter("C", (567.8, 496.0), 8),
        )
        self.add(fig, corner, ticks, names)
        self.hold(1.0)

        # The question: CD.
        q = self.value("?", _out(D, C, 7), RED, 10, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # In △ABC the right angle is at B: AC = 13 and AB = 8 give BC² = 13² − 8² = 105.
        tri = self.tint(A, B, C, color=GREEN, opacity=0.14)
        self.play(FadeIn(tri), corner.animate.set_color(GREEN), run_time=0.7)
        self.hold(0.5)
        ac = self.mark(A, C, BLUE)
        n13 = self.value("13", _out(A, C, 7), BLUE, 8)
        self.play(Create(ac), FadeIn(n13), run_time=0.8)
        ab = self.mark(A, B, AMBER)
        n8 = self.value("8", (490.0, 402.6), AMBER, 8)
        self.play(Create(ab), FadeIn(n8), run_time=0.8)
        self.hold()
        bc = self.mark(B, C, PINK)
        n105 = self.value("√105", (534.2, 498.0), PINK, 8)
        self.play(Create(bc), FadeIn(n105), run_time=0.8)
        self.hold()

        # CD is a median, so D is the mid-point of AB: a half-turn about D carries DA onto DB.
        self.play(FadeOut(VGroup(tri, ac, n13, ab)), corner.animate.set_color(INK), run_time=0.6)
        ad = self.mark(A, D, AMBER)
        self.play(Create(ad), run_time=0.6)
        turned = ad.copy()
        self.play(self.half_turn(turned, D), run_time=1.4)
        n4 = self.value("4", (490.0, 460.5), AMBER, 8)
        self.play(FadeOut(n8), FadeIn(n4), run_time=0.6)
        self.hold()

        # In △BCD: CD² = 105 + 4² = 121, so CD = 11.
        tri2 = self.tint(D, B, C, color=GREEN, opacity=0.16)
        self.play(FadeOut(ad), FadeIn(tri2), corner.animate.set_color(GREEN), run_time=0.7)
        self.hold(0.6)
        self.play(Create(self.mark(D, C, RED)), run_time=0.7)
        self.settle(q, "11", _out(D, C, 7), 9)
        self.hold(2.2)


class Q4(Guide):
    """AD bisects ∠BAC, ∠B = 74°, ∠C = 44°, ∠DEC = 65°. Find ∠ADE."""

    PAGE = 2
    REGION = (357.0, 101.0, 595.0, 234.9)

    def construct(self):
        A, B, C = (445.9, 118.8), (415.5, 219.8), (559.7, 219.8)
        ab, ac = _len(A, B), _len(A, C)
        D = along(B, C, ab / (ab + ac))
        E = along(A, C, 0.4376)
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(A, D), self.seg(D, E))
        arcs = VGroup(self.arc(B, C, A, 15.5), self.arc(C, A, B, 18.5), self.arc(E, D, C, 15.5))
        names = VGroup(
            self.letter("A", (443.9, 111.0), 8), self.letter("B", (406.2, 223.3), 8),
            self.letter("C", (566.6, 223.3), 8), self.letter("D", (475.0, 230.1), 8),
            self.letter("E", (499.1, 156.6), 8),
        )
        l74 = self.value("74°", (439.0, 204.4), size=10)
        l65 = self.value("65°", (502.2, 185.3), size=10)
        l44 = self.value("44°", (528.1, 210.7), size=10)
        self.add(fig, arcs, names, l74, l65, l44)
        self.hold(1.0)

        # The question: ∠ADE.
        q = self.value("?", self.polar(D, _bis(D, A, E), 22), RED, 9, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # ∠ sum of △ABC: the three angles gather on a straight line, so ∠BAC = 180° − 74° − 44° = 62°.
        wb = self.wedge(B, C, A, BLUE, 12)
        wc = self.wedge(C, A, B, GREEN, 12)
        wa = self.wedge(A, B, C, PURPLE, 12)
        self.play(FadeIn(wb), FadeIn(wc), l74.animate.set_color(BLUE), l44.animate.set_color(GREEN), run_time=0.7)
        self.play(FadeIn(wa), run_time=0.5)
        at = (385.0, 162.0)
        line = self.gather(A, B, C, wa, wb, wc, at, reach=22)
        self.hold(0.6)
        l62 = self.value("62°", (385.0, 141.0), PURPLE, 8)
        self.play(FadeIn(l62), run_time=0.5)
        self.hold()
        self.play(FadeOut(VGroup(line, wb, wc, l62)), l74.animate.set_color(INK), l44.animate.set_color(INK), run_time=0.7)

        # AD bisects ∠BAC: fold ∠BAD along AD onto ∠DAE, 31° each.
        half = self.wedge(A, B, D, PINK, 14)
        self.play(FadeOut(wa), FadeIn(half), run_time=0.6)
        folded = half.copy()
        self.play(self.flip(folded, A, D), run_time=1.5)
        l31 = VGroup(
            self.value("31°", self.polar(A, _bis(A, B, D), 30), PINK, 7),
            self.value("31°", self.polar(A, _bis(A, D, C), 30), PINK, 7),
        )
        self.play(FadeIn(l31), run_time=0.6)
        self.hold()

        # Ext. ∠ of △ADE: ∠DAE slides along AC to E, ∠ADE turns half a turn about the middle of DE,
        # and together they fill ∠DEC = 65°.
        self.play(FadeOut(VGroup(half, l31[0])), l65.animate.set_color(AMBER), run_time=0.6)
        ext = self.wedge(E, D, C, AMBER, 13)
        self.play(FadeIn(ext), run_time=0.6)
        self.hold(0.6)
        slid = self.wedge(A, D, C, PINK, 12)
        self.play(FadeOut(folded), FadeIn(slid), run_time=0.4)
        self.play(self.slide(slid, A, E), run_time=1.5)
        wd = self.wedge(D, A, E, RED, 12)
        self.play(FadeIn(wd), run_time=0.5)
        turned = wd.copy()
        self.play(self.half_turn(turned, mid(D, E)), run_time=1.5)
        self.flash(slid, turned)
        self.hold()

        # 31° + ∠ADE = 65°, so ∠ADE = 34°.
        self.play(FadeOut(VGroup(slid, turned, ext, l31[1])), run_time=0.6)
        self.settle(q, "34°", self.polar(D, _bis(D, A, E), 27), 7.5)
        self.hold(2.2)


class Q6(Guide):
    """AD bisects ∠BAC, AD = CD, AB an altitude. Find ∠ACB."""

    PAGE = 2
    REGION = (400.0, 453.0, 585.0, 557.06)

    def construct(self):
        A, B = (425.5, 466.7), (425.5, 543.0)
        h = B[1] - A[1]
        D = (A[0] + h * math.tan(math.radians(30)), B[1])
        C = (A[0] + h * math.tan(math.radians(60)), B[1])
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(A, D))
        corner = self.right_mark(B, A, C, 9, INK, 0.7)
        ticks = VGroup(self.ticks(A, D, 2, INK, 2.6, 0.8), self.ticks(D, C, 2, INK, 2.6, 0.8))
        names = VGroup(
            self.letter("A", (424.3, 459.3), 8.3), self.letter("B", (418.3, 543.8), 8.3),
            self.letter("D", (470.5, 551.7), 8.3), self.letter("C", (566.7, 543.8), 8.3),
        )
        self.add(fig, corner, ticks, names)
        self.hold(1.0)

        # The question: ∠ACB.
        q = self.value("?", self.polar(C, 165, 27), RED, 9, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # AD bisects ∠BAC: fold ∠BAD along AD onto ∠DAC.
        w1 = self.wedge(A, B, D, BLUE, 14)
        self.play(FadeIn(w1), run_time=0.6)
        w2 = w1.copy()
        self.play(self.flip(w2, A, D), run_time=1.5)
        self.hold()

        # AD = CD: △ADC is isosceles. Fold along the line from D through the middle of AC:
        # ∠DAC lands on ∠DCA.
        same = self.sides((A, D), (D, C), color=PINK)
        self.play(Create(same), run_time=0.8)
        self.hold(0.5)
        M = mid(A, C)
        mirror = self.dashed(D, along(D, M, 1.25), INK, 0.6, 2.4)
        self.play(Create(mirror), run_time=0.5)
        w3 = w2.copy()
        self.play(self.flip(w3, D, M), run_time=1.5)
        self.play(FadeOut(VGroup(mirror, same)), run_time=0.5)
        self.hold()

        # ∠ sum of △ABC: 2∠DCA + ∠DCA + 90° = 180°. The three angles gather on a straight line.
        right = self.wedge(B, C, A, AMBER, 9)
        self.play(FadeIn(right), corner.animate.set_color(AMBER), run_time=0.6)
        at = (528.0, 481.0)
        line = self.gather(A, B, C, VGroup(w1, w2), right, w3, at, reach=24)
        self.hold()

        # The 90° leaves three equal parts: ∠DCA = 30°.
        self.hold(0.6)
        self.play(FadeOut(line), corner.animate.set_color(INK), run_time=0.6)
        self.settle(q, "30°", self.polar(C, 165, 27), 8)
        self.hold(2.2)


class Q8(Guide):
    """AB = BD, BD a median, perimeters of △ABC and △BCD are 6.4 cm and 5.4 cm. Find CD."""

    PAGE = 3
    REGION = (362.0, 94.0, 605.0, 230.69)
    LINE = 1.3

    def construct(self):
        A, B, C = (497.8, 116.2), (420.0, 196.7), (552.0, 196.7)
        D = mid(A, C)
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(B, D))
        ticks = VGroup(self.ticks(A, B, 2, INK, 3.6, 1.0), self.ticks(B, D, 2, INK, 3.6, 1.0))
        names = VGroup(
            self.letter("A", (497.8, 108.7), 11), self.letter("B", (412.0, 199.2), 11),
            self.letter("C", (560.0, 199.7), 11), self.letter("D", (532.5, 151.3), 11),
        )
        self.add(fig, ticks, names)
        self.hold(1.0)

        # The question: CD.
        q_at = _out(D, C, 8)
        q = self.value("?", q_at, RED, 10, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # BD is a median, so D is the mid-point of AC: a half-turn about D carries DA onto DC.
        da = self.mark(D, A, PINK)
        self.play(Create(da), run_time=0.6)
        turned = da.copy()
        self.play(self.half_turn(turned, D), run_time=1.4)
        self.hold()

        # AB = BD (given): turning BA about B lands it on BD.
        ba = self.mark(B, A, BLUE)
        self.play(Create(ba), run_time=0.6)
        bd = ba.copy()
        self.play(self.turn(bd, B, _deg(B, D) - _deg(B, A)), run_time=1.4)
        self.hold()

        # Perimeter of △ABC = 6.4 cm: AB + BC + CD + DA laid end to end.
        s, x0 = 0.45, 410.0
        ab, bc, half = _len(A, B), _len(B, C), _len(A, D)
        tri = self.tint(A, B, C, color=AMBER, opacity=0.12)
        bc_mark = self.mark(B, C, GREEN)
        self.play(FadeIn(tri), Create(bc_mark), run_time=0.7)
        row1, end1 = self.bar_row(x0, 212.0, [(ab, BLUE), (bc, GREEN), (half, PINK), (half, PINK)], s)
        self.play(LaggedStart(
            ReplacementTransform(ba.copy(), row1[0]),
            ReplacementTransform(bc_mark.copy(), row1[1]),
            ReplacementTransform(turned.copy(), row1[2]),
            ReplacementTransform(da.copy(), row1[3]),
            lag_ratio=0.35,
        ), run_time=2.2)
        n64 = self.value("6.4", (392.0, 212.0), INK, 8)
        self.play(FadeIn(n64), run_time=0.4)
        self.hold()

        # Perimeter of △BCD = 5.4 cm: BD + BC + CD, with BD as long as AB.
        tri2 = self.tint(B, C, D, color=GREEN, opacity=0.14)
        self.play(FadeOut(tri), FadeIn(tri2), run_time=0.6)
        row2, _ = self.bar_row(x0, 222.0, [(ab, BLUE), (bc, GREEN), (half, PINK)], s)
        self.play(LaggedStart(
            ReplacementTransform(bd.copy(), row2[0]),
            ReplacementTransform(bc_mark.copy(), row2[1]),
            ReplacementTransform(turned.copy(), row2[2]),
            lag_ratio=0.35,
        ), run_time=2.0)
        n54 = self.value("5.4", (392.0, 222.0), INK, 8)
        self.play(FadeIn(n54), run_time=0.4)
        self.hold()

        # The rows match except AD: AD = 6.4 − 5.4 = 1 cm, and CD = AD.
        self.pulse(row1[3])
        self.badge("1 cm", (end1 + 12.0, 212.0), 8)
        self.hold(0.6)
        self.play(FadeOut(tri2), run_time=0.4)
        self.settle(q, "1 cm", (q_at[0] + 6.0, q_at[1]), 9)
        self.hold(2.2)


class Q10(Guide):
    """DE the perpendicular bisector of BC, ∠ABD = 50°, ∠ACD = 21°, ∠BAC = 77°. Find ∠DBC."""

    PAGE = 3
    REGION = (396.6, 619.0, 579.7, 722.0)

    def construct(self):
        A, B, C = (453.8, 631.3), (419.6, 707.8), (558.9, 707.8)
        E = mid(B, C)
        D = (E[0], E[1] - (E[0] - B[0]) * math.tan(math.radians(16)))
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(B, D), self.seg(D, C), self.seg(D, E))
        arcs = VGroup(self.arc(A, B, C, 12), self.arc(B, A, D, 12.5), self.arc(C, A, D, 30))
        names = VGroup(
            self.letter("A", (455.3, 625.7), 9.5), self.letter("B", (412.6, 709.6), 9.5),
            self.letter("C", (564.3, 709.6), 9.5), self.letter("D", (490.9, 682.3), 9.5),
            self.letter("E", (490.9, 714.8), 9.5),
        )
        l77 = self.value("77°", (461.6, 650.8), size=10.5)
        l50 = self.value("50°", (439.3, 694.4), size=10.5)
        l21 = self.value("21°", (518.0, 688.9), size=8.8)
        self.add(fig, arcs, names, l77, l50, l21)
        self.hold(1.0)

        # The question: ∠DBC.
        q_at = (463.0, 702.6)
        q = self.value("?", q_at, RED, 8, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # DE is the perpendicular bisector of BC: fold △DBE along DE onto △DCE, so DB = DC.
        corner = self.right_mark(E, D, C, 4.5, GREEN, 0.8)
        halves = VGroup(self.ticks(B, E, 1, GREEN, 3.0, 1.0), self.ticks(E, C, 1, GREEN, 3.0, 1.0))
        self.play(Create(corner), FadeIn(halves), run_time=0.7)
        self.hold(0.5)
        half = self.tint(D, B, E, color=PINK, opacity=0.25)
        self.play(FadeIn(half), run_time=0.5)
        folded = half.copy()
        self.play(self.flip(folded, D, E), run_time=1.5)
        same = self.sides((along(D, B, 0.1), B), (along(D, C, 0.1), C), color=PINK, width=1.8)
        self.play(FadeOut(VGroup(half, folded)), Create(same), run_time=0.7)
        self.hold()

        # Base ∠s of isos. △DBC: the same fold carries ∠DBC onto ∠DCB.
        wx = self.wedge(B, C, D, AMBER, 20)
        self.play(FadeIn(wx), run_time=0.5)
        wy = wx.copy()
        self.play(self.flip(wy, D, E), run_time=1.5)
        self.play(FadeOut(VGroup(same, corner, halves)), run_time=0.5)
        self.hold()

        # ∠ sum of △ABC: (50° + x) + (21° + x) + 77° = 180°, the angles gathered on a straight line.
        wa = self.wedge(A, B, C, PURPLE, 10)
        wb = VGroup(self.wedge(B, A, D, BLUE, 10), self.wedge(B, D, C, AMBER, 10))
        wc = VGroup(self.wedge(C, A, D, GREEN, 10), self.wedge(C, D, B, AMBER, 10))
        self.play(FadeOut(VGroup(wx, wy)), FadeIn(VGroup(wa, wb, wc)),
                  l77.animate.set_color(PURPLE), l50.animate.set_color(BLUE), l21.animate.set_color(GREEN), run_time=0.8)
        self.hold(0.5)
        line = self.gather(A, B, C, wa, wb, wc, (533.0, 647.0), reach=24)
        self.hold()

        # 2∠DBC = 180° − 50° − 21° − 77° = 32°, so ∠DBC = 16°.
        self.play(FadeOut(VGroup(line, wa, wb, wc)), l77.animate.set_color(INK), l50.animate.set_color(INK),
                  l21.animate.set_color(INK), run_time=0.7)
        self.play(FadeIn(self.wedge(B, C, D, RED, 20, opacity=0.25)), run_time=0.5)
        self.settle(q, "16°", q_at, 7.5)
        self.hold(2.2)


class Q12(Guide):
    """AD the perpendicular bisector of BC, EC bisects ∠ACB, ∠ABE = 17°, ∠BAC = 80°. Find ∠BEC."""

    PAGE = 4
    REGION = (408.0, 358.5, 591.5, 461.72)

    def construct(self):
        B, C = (428.2, 448.5), (559.5, 448.5)
        D = mid(B, C)
        A = (D[0], D[1] - (D[0] - B[0]) * math.tan(math.radians(50)))
        E = meet(B, self.polar(B, 33, 10), C, self.polar(C, 155, 10))
        F = meet(E, C, A, D)
        fig = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A), self.seg(A, D), self.seg(B, E), self.seg(E, C))
        arcs = VGroup(self.arc(A, B, C, 15), self.arc(B, A, E, 14))
        pointers = VGroup(
            self.arrow([(447.6, 407.0), (448.6, 421.0), (444.5, 433.0), (441.6, 436.6)]),
            self.arrow([(524.5, 397.0), (511.8, 396.6), (502.0, 393.0), (497.4, 389.8)]),
        )
        names = VGroup(
            self.letter("A", (494.0, 363.9), 9), self.letter("B", (422.4, 449.6), 9),
            self.letter("C", (565.5, 451.5), 9), self.letter("D", (494.0, 457.3), 9),
        )
        ef = VGroup(self.letter("E", (E[0] - 1.8, E[1] - 5.8), 9), self.letter("F", (F[0] + 6.8, F[1] - 5.3), 9))
        l17 = self.value("17°", (446.4, 402.0), size=10)
        l80 = self.value("80°", (535.5, 395.1), size=10)
        self.add(fig, arcs, pointers, names, ef, l17, l80)
        self.hold(1.0)

        # The question: ∠BEC.
        q_at = self.polar(E, 274, 10)
        q = self.value("?", q_at, RED, 8, BOLD)
        self.play(FadeIn(q), run_time=0.5)
        self.blink(q)
        self.hold(0.6)

        # AD is the perpendicular bisector of BC: fold △ABD along AD onto △ACD, so AB = AC.
        corner = self.right_mark(D, A, C, 4.5, GREEN, 0.8)
        halves = VGroup(self.ticks(B, D, 1, GREEN, 3.0, 1.0), self.ticks(D, C, 1, GREEN, 3.0, 1.0))
        self.play(Create(corner), FadeIn(halves), run_time=0.7)
        half = self.tint(A, B, D, color=PINK, opacity=0.2)
        self.play(FadeIn(half), run_time=0.5)
        folded = half.copy()
        self.play(self.flip(folded, A, D), run_time=1.5)
        same = self.sides((A, B), (A, C), color=PINK)
        self.play(FadeOut(VGroup(half, folded)), Create(same), run_time=0.7)
        self.hold()

        # Base ∠s of isos. △ABC: the fold carries ∠ABC onto ∠ACB.
        wb = self.wedge(B, C, A, BLUE, 10)
        self.play(FadeOut(VGroup(same, corner, halves)), FadeIn(wb), run_time=0.6)
        wc = wb.copy()
        self.play(self.flip(wc, A, D), run_time=1.5)
        self.hold(0.6)

        # ∠ sum of △ABC: 2∠ABC + 80° = 180°, so ∠ABC = ∠ACB = 50°.
        wa = self.wedge(A, B, C, PURPLE, 10)
        self.play(FadeIn(wa), l80.animate.set_color(PURPLE), run_time=0.6)
        line = self.gather(A, B, C, wa, wb, wc, (452.0, 381.0), reach=22)
        self.hold()
        l50 = VGroup(
            self.value("50°", self.polar(B, 12, 29), BLUE, 7),
            self.value("50°", self.polar(C, 168, 29), BLUE, 7),
        )
        self.play(FadeOut(VGroup(line, wa)), l80.animate.set_color(INK), FadeIn(l50), run_time=0.7)
        self.hold()

        # ∠EBC = 50° − 17° = 33°.
        w17 = self.wedge(B, A, E, PINK, 14)
        self.play(FadeIn(w17), l17.animate.set_color(PINK), run_time=0.6)
        self.hold(0.6)
        web = self.wedge(B, C, E, AMBER, 12)
        l33 = self.value("33°", self.polar(B, 16.5, 31), AMBER, 7)
        self.play(FadeOut(VGroup(w17, wb, l50[0])), l17.animate.set_color(INK), FadeIn(web), FadeIn(l33), run_time=0.8)
        self.hold()

        # EC bisects ∠ACB: fold ∠ACE along CE onto ∠BCE, 25° each.
        wace = self.wedge(C, A, E, GREEN, 12)
        self.play(FadeOut(VGroup(wc, l50[1])), FadeIn(wace), run_time=0.6)
        wec = wace.copy()
        self.play(self.flip(wec, C, E), run_time=1.5)
        l25 = self.value("25°", self.polar(C, 167.5, 31), GREEN, 7)
        self.play(FadeOut(wace), FadeIn(l25), run_time=0.6)
        self.hold()

        # ∠ sum of △BCE: the three angles gather on a straight line.
        small_b = self.wedge(B, C, E, AMBER, 9)
        small_c = self.wedge(C, B, E, GREEN, 9)
        we = self.wedge(E, B, C, RED, 7)
        self.play(FadeOut(VGroup(web, wec, q)), FadeIn(VGroup(small_b, small_c, we)), run_time=0.6)
        line2 = self.gather(E, B, C, we, small_b, small_c, (452.0, 381.0), reach=22)
        self.hold()

        # 25° + ∠BEC + 33° = 180°, so ∠BEC = 122°.
        self.play(FadeOut(VGroup(line2, small_b, small_c)), run_time=0.6)
        self.badge("122°", self.polar(E, 274, 13), 7.5)
        self.hold(2.2)
