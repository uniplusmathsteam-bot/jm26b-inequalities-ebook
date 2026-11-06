"""Solution guides for JM29 (C) Quadrilaterals: the questions with a green diamond.

Each scene follows the teacher's working in books/jm29c/solutions.js, one step
per beat, on the printed figure. Figures keep the printed shape, but the given
relations are exact (an isosceles triangle is symmetric, a rhombus has four
equal sides), so a half-turn or a fold lands exactly on its target. Where the
working divides an angle into equal parts (Q1, Q3), the angles are drawn true.
Points are page points read off the print; label positions are the printed ones.
"""

import numpy as np
from manim import (
    BOLD, PI, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, ReplacementTransform, Transform,
    TransformFromCopy, VGroup, Write,
)

from guide import AMBER, BLUE, DIM, GREEN, INK, PINK, PURPLE, RED, Z_TEXT, Z_TINT, GuideScene, along, dist, meet, mid


class Q5(GuideScene):
    """AB = AC, ∠BAC = 42°, CDEF a rhombus on BCD and AFC. Find ∠DFE."""

    PAGE = 2
    REGION = (363.5, 626, 594.5, 756)

    def construct(self):
        B, C = (415.0, 730.0), (498.0, 730.0)
        A = ((B[0] + C[0]) / 2, 647.0)
        side = 44.0
        AC = np.hypot(A[0] - C[0], A[1] - C[1])
        F = along(C, A, side / AC)
        D = (C[0] + side, C[1])
        E = (F[0] + side, F[1])

        ab, bc, cd = self.seg(A, B), self.seg(B, C), self.seg(C, D)
        ac, fe, ed, fd = self.seg(A, C), self.seg(F, E), self.seg(E, D), self.seg(F, D)
        names = {k: self.name(k, p) for k, p in {
            "A": (A[0], A[1] - 7.5), "B": (B[0] - 6, B[1] + 6), "C": (C[0] + 1, C[1] + 10.5),
            "D": (D[0] + 7.5, D[1] + 5), "E": (E[0] + 4, E[1] - 7.5), "F": (F[0] + 3.6, F[1] - 7.5),
        }.items()}
        arc_a = self.arc(A, B, C, 11)
        n42 = self.value("42°", (A[0], A[1] + 19))
        self.add(ab, bc, cd, ac, fe, ed, fd, arc_a, n42, *names.values())
        self.hold(1.0)

        # The question: ∠DFE.
        at_dfe = self.polar(F, -15, 33.5)
        ask = VGroup(self.wedge(F, D, E, RED, 13), self.value("?", at_dfe, RED, 9, BOLD))
        self.play(FadeIn(ask), run_time=0.8)
        self.blink(ask[1])
        self.hold()
        rhombus = VGroup(cd, fe, ed, fd, names["D"], names["E"])
        self.play(FadeOut(ask), *self.dim(rhombus), run_time=0.9)
        self.hold(0.6)

        # In △ABC: AB = AC.
        sides = VGroup(self.mark(A, B, BLUE), self.mark(A, C, BLUE))
        ticks = VGroup(self.ticks(A, along(A, B, 0.6), 1, BLUE, 4, 1.4), self.ticks(A, along(A, C, 0.6), 1, BLUE, 4, 1.4))
        self.play(Create(sides), run_time=1.0)
        self.play(LaggedStart(*[GrowFromCenter(t) for t in ticks], lag_ratio=0.3), run_time=0.7)
        self.hold()

        # Base angles of the isosceles triangle: the mirror line through A carries ∠ABC onto ∠ACB.
        w_b = self.wedge(B, C, A, AMBER, 13)
        w_c = self.wedge(C, A, B, AMBER, 13)
        axis = self.dashed((A[0], A[1] + 25), (A[0], B[1] + 4), INK, 0.8, 3)
        self.play(FadeIn(w_b), run_time=0.7)
        self.play(Create(axis), run_time=0.6)
        mirror = w_b.copy()
        self.play(self.flip(mirror, (A[0], A[1]), (A[0], B[1])), run_time=1.4)
        self.add(w_c)
        self.remove(mirror)
        self.play(FadeOut(axis), run_time=0.4)
        self.flash(w_b, w_c)
        self.hold()

        # The apex angle, 42°.
        w_a = self.wedge(A, B, C, PINK, 11)
        self.play(FadeOut(arc_a), FadeIn(w_a), n42.animate.set_color(PINK), run_time=0.8)
        self.flash(w_a)
        self.hold()

        # Angle sum: the three angles fit together on a straight line.
        Q = (530.0, 667.0)
        R = 16
        b_start, b_sweep = self.span(B, C, A)
        a_start, a_sweep = self.span(A, B, C)
        c_start, c_sweep = self.span(C, A, B)
        line = self.seg((Q[0] - 27, Q[1]), (Q[0] + 27, Q[1]))
        to_b = self.sector(Q, b_start, b_sweep, AMBER, R)
        to_a = self.sector(Q, a_start - PI, a_sweep, PINK, R)
        to_c = self.sector(Q, c_start, c_sweep, AMBER, R)
        cb, ca, cc = w_b.copy(), w_a.copy(), w_c.copy()
        self.play(Create(line), run_time=0.5)
        self.play(Transform(cb, to_b), Transform(cc, to_c), run_time=1.3)
        self.play(Transform(ca, to_a, path_arc=-PI), run_time=1.5)
        straight = self.value("180°", (Q[0], Q[1] + 8))
        self.play(FadeIn(straight), run_time=0.6)
        self.hold()
        half = b_sweep / 2
        top42 = self.value("42°", (Q[0], Q[1] - R - 6), PINK)
        r69 = self.value("69°", self.polar(Q, np.degrees(half), R + 9), AMBER)
        l69 = self.value("69°", self.polar(Q, 180 - np.degrees(half), R + 9), AMBER)
        self.play(TransformFromCopy(n42, top42), run_time=0.9)
        self.hold(0.8)
        self.play(Write(r69), Write(l69), run_time=0.9)
        self.hold()
        v_b = self.value("69°", self.polar(B, np.degrees(half), 21), AMBER)
        v_c = self.value("69°", self.polar(C, 180 - np.degrees(half), 21), AMBER)
        self.play(ReplacementTransform(r69, v_b), ReplacementTransform(l69, v_c), run_time=1.2)
        self.play(FadeOut(VGroup(line, cb, ca, cc, straight, top42)), run_time=0.6)
        self.hold()

        # Now the rhombus CDEF.
        triangle_only = VGroup(ab, names["A"], names["B"], n42)
        arc_a.set_color(DIM)
        self.play(
            *self.undim(rhombus), *self.dim(triangle_only), FadeIn(arc_a),
            FadeOut(VGroup(sides, ticks, w_a, w_b, v_b)), run_time=1.0,
        )
        equal = VGroup(*[self.ticks(p, q, 2, GREEN, 4, 1.3) for p, q in ((C, F), (C, D), (D, E), (F, E))])
        self.play(LaggedStart(*[GrowFromCenter(t) for t in equal], lag_ratio=0.25), run_time=1.0)
        self.hold()

        # The diagonal FD is a fold line: △FCD folds onto △FED, so ∠DFC = ∠DFE.
        diag = self.mark(F, D, GREEN, 1.8)
        self.play(Create(diag), run_time=0.7)
        g_c = self.wedge(F, C, D, GREEN, 13)
        g_e = self.wedge(F, D, E, GREEN, 13)
        half_shape = VGroup(self.tint(F, C, D), g_c)
        self.play(FadeIn(half_shape), run_time=0.7)
        folded = half_shape.copy()
        self.play(self.flip(folded, F, D), run_time=1.6)
        self.add(g_e)
        self.remove(folded[1])
        self.play(FadeOut(VGroup(half_shape[0], folded[0])), run_time=0.5)
        self.flash(g_c, g_e)
        self.hold()

        # FE // BC: the 69° at C turns half a turn about the middle of FC onto ∠EFC (alternate angles).
        par = VGroup(self.chevrons(F, E, 1, PURPLE, 5, 0.82), self.chevrons(B, C, 1, PURPLE, 5, 0.42))
        zed = self.path(E, F, C, B, color=PURPLE, width=2.4).set_stroke(opacity=0.55)
        self.play(FadeIn(par), run_time=0.6)
        self.play(Create(zed), run_time=1.2)
        self.hold(0.8)
        spin = w_c.copy()
        halves = VGroup(g_c, g_e)
        self.play(self.half_turn(spin, along(F, C, 0.5)), FadeOut(halves), run_time=1.8)
        v_f = self.value("69°", at_dfe, AMBER)
        self.play(TransformFromCopy(v_c, v_f), run_time=0.9)
        self.hold()

        # FD cuts that 69° into two equal halves: ∠DFE = 34.5°.
        result = self.value("34.5°", at_dfe, RED, 8, BOLD)
        self.play(FadeOut(VGroup(spin, zed, par)), FadeIn(halves), run_time=1.0)
        self.play(Transform(v_f, result), run_time=1.0)
        self.flash(g_e)
        self.play(*self.undim(triangle_only, arc_a), run_time=0.9)
        self.hold(2.5)


class Q1(GuideScene):
    """Trapezium ABCD, AD // BC. (a) x at A, 2x at B. (b) AD = 12, BC = 18, DC = 10, AB = y, ∠ABC = 90°."""

    PAGE = 1
    REGION = (61.9, 449.0, 260.9, 561.0)
    PART_B = (441.4, 505.0)

    def construct(self):
        A, D = (108.0, 480.0), (217.0, 480.0)
        B, C = (A[0] + 52.5 / np.tan(np.radians(60)), 532.5), (188.0, 532.5)
        lx, l2x = self.value("x", (118.6, 486.2), it="x"), self.value("2x", (149.6, 523.5), it="x")
        arcs = VGroup(self.arc(A, D, B, 7), self.arc(B, C, A, 7))
        self.add(self.path(A, D, C, B, closed=True), arcs, lx, l2x, self.tag("(a)", (74.8, 465.2)))
        for k, p in {"A": (104.0, 474.0), "D": (223.0, 475.0), "B": (135.0, 538.5), "C": (191.5, 538.5)}.items():
            self.add(self.name(k, p))

        s = 6.2
        B2 = (387.0, 529.0)
        C2, A2 = (B2[0] + 18 * s, B2[1]), (B2[0], B2[1] - 8 * s)
        D2 = (A2[0] + 12 * s, A2[1])
        ly, l12, l10 = self.value("y cm", (376.2, 506.0), it="y"), self.value("12 cm", (424.0, 470.0)), self.value("10 cm", (491.0, 496.0))
        self.add(self.path(A2, D2, C2, B2, closed=True), self.right_mark(B2, A2, C2, 7), ly, l12, l10,
                 self.value("18 cm", (434.0, 538.0)), self.tag("(b)", (352.2, 467.2)))
        for k, p in {"A": (380.5, 476.0), "D": (464.0, 472.0), "B": (381.0, 537.0), "C": (507.0, 534.0)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)
        self.ask(lx)

        # (a) AD // BC, so the interior angles x and 2x make 180°.
        sides = VGroup(self.mark(A, D, PURPLE), self.mark(B, C, PURPLE))
        self.play(Create(sides), run_time=0.9)
        self.play(FadeIn(VGroup(self.chevrons(A, D, 1, PURPLE, 5, 0.55), self.chevrons(B, C, 1, PURPLE, 5, 0.55))), run_time=0.5)
        self.hold()
        w_a, w_b = self.wedge(A, D, B, PINK, 7), self.wedge(B, C, A, AMBER, 7)
        self.play(FadeOut(VGroup(sides, arcs)), FadeIn(VGroup(w_a, w_b)), lx.animate.set_color(PINK), l2x.animate.set_color(AMBER), run_time=1.0)
        self.hold()

        # Slide x down AB to B: next to 2x it fills the straight angle on AB.
        ext = self.dashed(B, along(A, B, 1 + 24 / dist(A, B)), INK, 0.8, 3)
        self.play(Create(ext), run_time=0.6)
        moved = w_a.copy()
        self.play(self.slide(moved, A, B), run_time=1.6)
        lx_b = self.value("x", self.polar(B, 330, 12), PINK, it="x")
        self.play(TransformFromCopy(lx, lx_b), run_time=0.8)
        start, _ = self.span(A, D, B)
        straight = self.arc_at(B, start, PI, 21, INK, 0.7)
        n180 = self.value("180°", self.polar(B, 330, 31.5))
        self.play(Create(straight), FadeIn(n180), run_time=1.0)
        self.hold()

        # x + 2x is three equal angles: 60° each.
        cuts, parts = self.spokes(B, start, PI, 3, 9), self.slices(B, start, PI, 3, 7)
        self.play(Create(cuts), run_time=0.6)
        self.add(parts)
        self.count(parts)
        self.hold()
        self.play(FadeOut(VGroup(ext, moved, lx_b, straight, n180, cuts, parts)), run_time=0.7)
        self.settle(lx, "60°", (121.0, 488.0))
        self.hold(2.0)

        # (b) Drop the height from D: H on BC.
        self.pan(self.PART_B)
        self.hold(0.8)
        self.ask(ly)
        H = (D2[0], B2[1])
        self.play(Create(self.dashed(D2, H, INK, 0.8, 3)), run_time=0.8)
        self.play(Create(self.right_mark(H, D2, C2, 5)), run_time=0.4)
        self.hold()

        # ABHD is a rectangle: DH = AB = y.
        ab = self.mark(A2, B2, BLUE)
        self.play(Create(ab), ly.animate.set_color(BLUE), run_time=0.8)
        dh = ab.copy()
        self.play(self.slide(dh, B2, H), run_time=1.4)
        at_y = (D2[0] - 5, mid(D2, H)[1])
        y_dh = self.value("y", at_y, BLUE, it="y")
        self.play(FadeIn(y_dh), run_time=0.5)
        self.hold()

        # BH = AD = 12, so HC = 18 − 12 = 6.
        ad = self.mark(A2, D2, PINK)
        self.play(Create(ad), l12.animate.set_color(PINK), run_time=0.8)
        bh = ad.copy()
        self.play(self.slide(bh, A2, B2), run_time=1.4)
        self.play(FadeIn(self.value("12", (mid(B2, H)[0], H[1] - 6), PINK)), run_time=0.5)
        self.hold(1.2)
        self.play(Create(self.mark(H, C2, GREEN)), FadeIn(self.value("6", (mid(H, C2)[0], H[1] + 8), GREEN)), run_time=0.9)
        self.hold()

        # Pythagoras' theorem in the right triangle DHC: y = 8.
        self.play(FadeIn(self.tint(D2, H, C2, color=AMBER, opacity=0.25)), Create(self.mark(D2, C2, PURPLE)),
                  l10.animate.set_color(PURPLE), run_time=1.0)
        self.hold(2.6)
        self.play(ReplacementTransform(y_dh, self.value("8", at_y, BLUE)), run_time=0.8)
        self.settle(ly, "8 cm", (375.3, 506.0))
        self.hold(2.5)


class Q2(GuideScene):
    """Trapezium PQRS: PQ // SR, PS = QR, ∠PSQ = 27°, ∠SQR = 93°. Find ∠PSR."""

    PAGE = 1
    REGION = (376.0, 640.0, 589.33, 760.0)

    def construct(self):
        P, Q, S, R = (458.0, 664.0), (510.0, 664.0), (412.0, 739.0), (556.0, 739.0)
        axis = ((S[0] + R[0]) / 2, 652.0), ((S[0] + R[0]) / 2, 748.0)
        nP = self.name("P", (449.0, 662.0))
        top = VGroup(self.seg(P, Q), self.seg(P, S), self.chevrons(P, Q, 1, INK, 4.2, 0.45), self.ticks(P, S, 2, INK, 3.6, self.LINE), nP)
        arc27, arc93 = self.arc(S, P, Q, 25), self.arc(Q, S, R, 12)
        l27, l93 = self.value("27°", (439.2, 710.3)), self.value("93°", (504.0, 685.0))
        self.add(top, self.seg(Q, R), self.seg(S, R), self.seg(S, Q), self.chevrons(S, R, 1, INK, 4.2, 0.47),
                 self.ticks(Q, R, 2, INK, 3.6, self.LINE), arc27, arc93, l27, l93,
                 self.name("Q", (511.5, 658.0)), self.name("S", (405.0, 742.0)), self.name("R", (562.5, 742.0)))
        self.hold(1.0)

        # The question: ∠PSR.
        at_x = self.polar(S, 14, 27)
        ask = VGroup(self.wedge(S, P, R, RED, 14), self.value("?", at_x, RED, 9, BOLD))
        self.play(FadeIn(ask), run_time=0.8)
        self.blink(ask[1])
        self.hold()

        # Let ∠QSR = x; ∠PSQ = 27°.
        w_x, w_27 = self.wedge(S, Q, R, AMBER, 14), self.wedge(S, P, Q, PINK, 14)
        lx = self.value("x", at_x, AMBER, it="x")
        self.play(FadeOut(ask), FadeIn(w_x), FadeIn(lx), run_time=0.9)
        self.hold(1.0)
        self.play(FadeOut(arc27), FadeIn(w_27), l27.animate.set_color(PINK), run_time=0.8)
        self.hold()

        # PS = QR: the mirror line of the isosceles trapezium carries ∠PSR onto ∠QRS.
        sides = VGroup(self.mark(P, S, BLUE), self.mark(Q, R, BLUE))
        self.play(Create(sides), run_time=0.9)
        mirror = self.dashed(*axis, INK, 0.8, 3)
        self.play(Create(mirror), run_time=0.6)
        at_r = VGroup(w_27, w_x).copy()
        self.play(self.flip(at_r, *axis), run_time=1.6)
        l_r = self.value("x + 27°", self.polar(R, 160, 32), it="x")
        self.play(FadeOut(mirror), FadeIn(l_r), run_time=0.8)
        self.hold()

        # The angles of △QRS make 180°.
        tri = self.tint(Q, R, S, color=GREEN, opacity=0.12)
        w_q = self.wedge(Q, S, R, GREEN, 14)
        self.play(*self.dim(top), FadeOut(sides), FadeIn(tri), FadeOut(arc93), FadeIn(w_q), l93.animate.set_color(GREEN), run_time=1.0)
        self.hold(1.0)
        g = self.gather(Q, S, R, w_q, w_x, at_r, (418.0, 683.0), swing=-PI)
        n180 = self.value("180°", (418.0, 691.0))
        self.play(FadeIn(n180), run_time=0.5)
        self.hold(2.6)
        l30 = self.value("30°", at_x, AMBER)
        self.play(FadeOut(VGroup(g, n180)), run_time=0.6)
        self.play(ReplacementTransform(lx, l30), run_time=0.9)
        self.hold()

        # ∠PSR = x + 27° = 57°.
        self.play(*self.undim(top), FadeOut(VGroup(tri, w_q, at_r, l_r)), l93.animate.set_color(INK), FadeIn(arc93), run_time=1.0)
        self.play(FadeOut(VGroup(w_27, w_x)), FadeIn(self.wedge(S, P, R, RED, 14)), run_time=0.8)
        self.settle(VGroup(l30, l27), "57°", self.polar(S, 20, 30))
        self.hold(2.5)


class Q3(GuideScene):
    """Rhombus ABCD. (a) Diagonals meet at O; ∠OBC = 2a, ∠OCB = 3a, ∠ODC = b.
    (b) Diagonals meet at P; AB = 2y − 1, BC = 8 − y, DP = x + 2, PB = y + 4."""

    PAGE = 2
    REGION = (30.9, 196.5, 253.1, 321.5)
    PART_B = (422.0, 246.0)

    def construct(self):
        O = (141.5, 258.0)
        B, D = (O[0], 217.0), (O[0], 299.0)
        h = (O[1] - B[1]) * np.tan(np.radians(36))
        A, C = (O[0] - h, O[1]), (O[0] + h, O[1])
        ab, da, cd, oa, od = self.seg(A, B), self.seg(D, A), self.seg(C, D), self.seg(O, A), self.seg(O, D)
        arc_2a, arc_3a, arc_b = self.arc(B, D, C, 9), self.arc(C, A, B, 7), self.arc(D, B, C, 9)
        l2a, l3a = self.value("2a", (149.2, 240.8), it="a"), self.value("3a", (C[0] - 13.5, 251.0), it="a")
        lb = self.value("b", (147.2, 281.4), it="b")
        nA, nD = self.name("A", (A[0] - 5, 260.5)), self.name("D", (D[0], 305.0))
        self.add(ab, self.seg(B, C), cd, da, oa, self.seg(O, C), self.seg(O, B), od, arc_2a, arc_3a, arc_b, l2a, l3a, lb,
                 nA, nD, self.name("B", (B[0], 211.0)), self.name("C", (C[0] + 6, 260.5)), self.tag("(a)", (75.75, 206.65)))

        A2, D2 = (390.0, 219.0), (377.0, 284.0)
        B2, C2 = (A2[0] + dist(A2, D2), A2[1]), (D2[0] + dist(A2, D2), D2[1])
        P2 = mid(A2, C2)
        u = ((B2[0] - D2[0]) / dist(D2, B2), (B2[1] - D2[1]) / dist(D2, B2))
        tilt = np.degrees(np.arctan2(D2[1] - B2[1], B2[0] - D2[0]))

        def beside_db(t, off=6):
            p = along(D2, B2, t)
            return (p[0] + off * u[1], p[1] - off * u[0])

        l2y, l8y = self.value("2y − 1", (420.5, 210.9), it="y"), self.value("8 − y", (463.0, 255.0), it="y")
        lx2 = self.value("x + 2", beside_db(0.24), it="x").rotate(np.radians(tilt))
        ly4 = self.value("y + 4", beside_db(0.69, 7), it="y").rotate(np.radians(tilt))
        self.add(self.path(A2, B2, C2, D2, closed=True), self.seg(A2, C2), self.seg(D2, B2), l2y, l8y, lx2, ly4, self.tag("(b)", (349.3, 203.55)))
        for k, p in {"A": (385.5, 214.0), "B": (461.0, 214.5), "C": (447.5, 291.0), "D": (372.5, 291.5), "P": (407.2, 250.6)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)
        self.ask(l2a, l3a, lb)

        # (a) The diagonals of a rhombus are perpendicular: ∠BOC = 90°.
        lower = VGroup(ab, da, cd, oa, od, nA, nD, lb, arc_b)
        tri = self.tint(B, O, C, color=BLUE, opacity=0.14)
        ro = self.right_mark(O, C, B, 5, BLUE)
        self.play(*self.dim(lower), FadeIn(tri), run_time=1.0)
        self.play(Create(ro), run_time=0.5)
        self.play(Indicate(ro, color=BLUE, scale_factor=1.6), run_time=0.7)
        self.hold()

        # The angles of △BOC make 180°, so 2a + 3a = 90°: five equal parts of 18°.
        w_b, w_c, w_o = self.wedge(B, D, C, AMBER, 7.5), self.wedge(C, A, B, PINK, 7.5), self.wedge(O, C, B, BLUE, 7.5)
        self.play(FadeOut(VGroup(arc_2a, arc_3a)), FadeIn(VGroup(w_b, w_c, w_o)),
                  l2a.animate.set_color(AMBER), l3a.animate.set_color(PINK), run_time=1.0)
        self.hold(1.0)
        at = (222.0, 250.0)
        g = self.gather(B, O, C, w_b, w_o, w_c, at, reach=19)
        r90 = self.right_mark(at, self.polar(at, 0, 5), self.polar(at, 90, 5), 4.5, BLUE)
        self.play(Create(r90), run_time=0.5)
        self.hold()
        cuts, parts = self.spokes(at, PI / 2, PI / 2, 5, 9.5), self.slices(at, PI / 2, PI / 2, 5, 7.5)
        self.play(Create(cuts), run_time=0.8)
        self.add(parts)
        self.count(parts)
        self.hold(1.0)
        self.badge("a = 18°", (222.0, 214.0), it="a")
        self.hold()
        self.play(FadeOut(VGroup(g, r90, cuts, parts)), run_time=0.6)

        # BC = CD: the diagonal AC is the mirror line of △BCD, so b = 2a.
        self.play(*self.undim(lower), FadeOut(VGroup(tri, ro, w_o, w_c)), l3a.animate.set_color(INK), FadeIn(arc_3a), run_time=1.0)
        self.play(Create(VGroup(self.mark(B, C, BLUE), self.mark(C, D, BLUE))), run_time=0.9)
        ticks = VGroup(self.ticks(along(B, C, 0.2), C, 1, BLUE, 3.6, 1.2), self.ticks(C, D, 1, BLUE, 3.6, 1.2))
        self.play(LaggedStart(*[GrowFromCenter(t) for t in ticks], lag_ratio=0.3), run_time=0.6)
        self.hold()
        fold = self.dashed(A, C, PURPLE, 1.0, 3)
        self.play(Create(fold), run_time=0.6)
        folded = w_b.copy()
        self.play(self.flip(folded, O, C), FadeOut(arc_b), run_time=1.6)
        self.play(FadeOut(fold), lb.animate.set_color(AMBER), run_time=0.6)
        self.hold(1.4)
        self.settle(lb, "36°", (150.5, 271.4), 7.5)
        self.hold(2.0)

        # (b) All four sides of a rhombus are equal: AB = BC.
        self.pan(self.PART_B)
        self.hold(0.8)
        self.ask(l2y, l8y, lx2, ly4)
        ticks = VGroup(*[self.ticks(p, q, 1, BLUE, 3.0, 1.2) for p, q in ((A2, B2), (B2, C2), (C2, D2), (D2, A2))])
        self.play(LaggedStart(*[GrowFromCenter(t) for t in ticks], lag_ratio=0.25), run_time=1.0)
        self.play(Create(VGroup(self.mark(A2, B2, BLUE), self.mark(B2, C2, BLUE))),
                  l2y.animate.set_color(BLUE), l8y.animate.set_color(BLUE), run_time=1.0)
        self.hold(2.6)
        self.badge("y = 3", (503.0, 224.0), it="y")
        self.hold()

        # The diagonals bisect each other: a half-turn about P carries PB onto PD.
        pb = self.mark(P2, B2, GREEN)
        self.play(Create(pb), ly4.animate.set_color(GREEN), run_time=0.8)
        spun = pb.copy()
        self.play(self.half_turn(spun, P2), run_time=1.6)
        self.play(lx2.animate.set_color(GREEN), run_time=0.5)
        self.hold()
        self.play(ReplacementTransform(ly4, self.value("7", beside_db(0.69, 7), GREEN).rotate(np.radians(tilt))), run_time=0.9)
        self.hold(1.6)
        self.badge("x = 5", (503.0, 244.0), it="x")
        self.hold(2.5)


class Q6(GuideScene):
    """Rectangle ABCD. (a) ∠DBC = 22°, x = ∠BDC. (b) Diagonals meet at O; OB = 5 cm, OD = x cm, AC = y cm."""

    PAGE = 3
    REGION = (47.92, 187.25, 275.48, 315.25)
    PART_B = (449.8, 253.0)

    def length_arrow(self, a, b, off, gap):
        """The printed length arrow beside ab, `off` points to its upper side, broken from gap[0] to gap[1] points for the label."""
        n_ = dist(a, b)
        u = ((b[0] - a[0]) / n_, (b[1] - a[1]) / n_)
        n = (u[1], -u[0])
        a1, b1 = (a[0] + off * n[0], a[1] + off * n[1]), (b[0] + off * n[0], b[1] + off * n[1])

        def at(t):
            return (a1[0] + u[0] * t, a1[1] + u[1] * t)

        def bar(p):
            return self.seg((p[0] + 3.5 * n[0], p[1] + 3.5 * n[1]), (p[0] - 3.5 * n[0], p[1] - 3.5 * n[1]), INK, 0.6)

        return VGroup(
            self.seg(a1, at(gap[0]), INK, 0.6), self.seg(at(gap[1]), b1, INK, 0.6), bar(a1), bar(b1),
            self.chevrons(at(10), a1, 1, INK, 3.4, 0.813), self.chevrons(at(n_ - 10), b1, 1, INK, 3.4, 0.813),
        )

    def construct(self):
        A, D, B, C = (96.0, 217.5), (224.5, 217.5), (96.0, 285.5), (224.5, 285.5)
        ab, ad, nA = self.seg(A, B), self.seg(A, D), self.name("A", (100.0, 209.5))
        arcs = VGroup(self.arc(B, C, D, 27), self.arc(D, B, C, 13))
        l22, lx = self.value("22°", (131.5, 277.0)), self.value("x", (213.0, 236.0), it="x")
        self.add(ab, ad, self.seg(B, C), self.seg(C, D), self.seg(B, D), arcs, l22, lx, nA, self.name("D", (220.5, 209.5)),
                 self.name("B", (99.5, 293.0)), self.name("C", (222.5, 293.5)), self.tag("(a)", (75.75, 203.95)))

        A2, D2, B2, C2 = (376.0, 220.0), (540.0, 220.0), (376.0, 286.0), (540.0, 286.0)
        O = mid(A2, C2)
        tilt = -np.degrees(np.arctan2(C2[1] - A2[1], C2[0] - A2[0]))
        l5, lx2 = self.value("5 cm", (397.0, 265.5)), self.value("x cm", (481.0, 233.5), it="x")
        ly2 = self.value("y cm", (430.0, 236.0), it="y").rotate(np.radians(tilt))
        self.add(self.path(A2, D2, C2, B2, closed=True), self.seg(A2, C2), self.seg(B2, D2), l5, lx2, ly2,
                 self.length_arrow(A2, C2, 8, (24, 82)), self.tag("(b)", (349.3, 200.85)))
        for k, p in {"A": (367.0, 210.5), "D": (546.0, 210.5), "B": (368.0, 294.5), "C": (546.0, 295.0), "O": (461.0, 263.5)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)
        self.ask(lx)

        # (a) ∠BCD = 90°: the angles of a rectangle are right angles.
        rc = self.right_mark(C, B, D, 6, BLUE)
        self.play(Create(rc), run_time=0.6)
        self.play(Indicate(rc, color=BLUE, scale_factor=1.6), run_time=0.7)
        self.hold()

        # The angles of △BCD make 180°.
        top = VGroup(ab, ad, nA)
        w_b, w_c, w_d = self.wedge(B, C, D, AMBER, 14), self.wedge(C, B, D, BLUE, 14), self.wedge(D, B, C, PINK, 14)
        self.play(*self.dim(top), FadeIn(self.tint(B, C, D, color=GREEN, opacity=0.12)), FadeOut(arcs), FadeIn(VGroup(w_b, w_c, w_d)),
                  l22.animate.set_color(AMBER), lx.animate.set_color(PINK), run_time=1.0)
        self.hold(1.0)
        g = self.gather(D, B, C, w_d, w_b, w_c, (124.0, 244.0), reach=21, swing=-PI)
        n180 = self.value("180°", (124.0, 252.0))
        self.play(FadeIn(n180), run_time=0.5)
        self.hold(2.6)
        self.play(FadeOut(VGroup(g, n180)), run_time=0.6)
        self.settle(lx, "68°", (211.0, 237.0))
        self.play(*self.undim(top), run_time=0.6)
        self.hold(2.0)

        # (b) The diagonals of a rectangle bisect each other: a half-turn about O carries OB onto OD.
        self.pan(self.PART_B)
        self.hold(0.8)
        self.ask(lx2, ly2)
        ob = self.mark(O, B2, GREEN)
        self.play(Create(ob), l5.animate.set_color(GREEN), run_time=0.8)
        od = ob.copy()
        self.play(self.half_turn(od, O), run_time=1.6)
        self.hold(0.8)
        self.settle(lx2, "5 cm", (481.0, 233.5))
        self.hold()

        # The diagonals are equal: the rectangle's mirror line carries BD onto AC, so y = 5 + 5.
        axis = ((O[0], 208.0), (O[0], 298.0))
        mirror = VGroup(self.dashed(axis[0], (O[0], 258.0), INK, 0.8, 3), self.dashed((O[0], 269.5), axis[1], INK, 0.8, 3))
        self.play(Create(mirror), run_time=0.6)
        across = VGroup(ob, od).copy()
        self.play(self.flip(across, *axis), run_time=1.6)
        self.play(FadeOut(mirror), run_time=0.4)
        self.hold(1.6)
        self.settle(ly2, "10 cm", (430.9, 233.8), angle=tilt)
        self.hold(2.5)


class Q9(GuideScene):
    """(a) Square EFGH, diagonals meet at O; ∠EOH = 2x − 10°, φ = ∠HGO.
    (b) Square ABCD, E on BC, DE meets AC at F; ∠AFD = 74°, x = ∠CDF, y = ∠DEC."""

    PAGE = 4
    REGION = (23.97, 197.0, 251.53, 325.0)
    PART_B = (415.5, 261.0)

    def construct(self):
        E, H, F, G = (95.0, 219.5), (177.5, 219.5), (95.0, 302.0), (177.5, 302.0)
        O = mid(E, G)
        arc_o, arc_g = self.arc(O, E, H, 13.5), self.arc(G, H, E, 14)
        l2x, lphi = self.value("2x − 10°", (136.2, 240.2), it="x"), self.name("φ", (170.0, 284.2), 8)
        nO = self.name("O", (145.7, 261.2))
        self.add(self.path(E, H, G, F, closed=True), self.seg(E, G), self.seg(F, H), arc_o, arc_g, l2x, lphi, nO, self.tag("(a)", (75.75, 205.15)))
        for k, p in {"E": (92.0, 212.5), "H": (181.0, 212.5), "F": (91.5, 309.5), "G": (181.5, 309.5)}.items():
            self.add(self.name(k, p))

        A2, D2, B2, C2 = (373.0, 220.0), (454.0, 220.0), (373.0, 301.0), (454.0, 301.0)
        E2 = (417.0, 301.0)
        F2 = meet(A2, C2, D2, E2)
        arc_f, arc_x, arc_y = self.arc(F2, A2, D2, 13.5), self.arc(D2, C2, E2, 21), self.arc(E2, D2, C2, 9)
        l74, lx2, ly2 = self.value("74°", (427.0, 257.2)), self.value("x", (448.2, 246.2), it="x"), self.value("y", (429.5, 295.3), it="y")
        self.add(self.path(A2, D2, C2, B2, closed=True), self.seg(A2, C2), self.seg(D2, E2), arc_f, arc_x, arc_y, l74, lx2, ly2,
                 self.tag("(b)", (349.3, 202.05)))
        for k, p in {"A": (371.0, 212.5), "D": (456.5, 212.5), "B": (370.5, 309.5), "E": (415.0, 309.5), "C": (456.0, 309.5), "F": (436.2, 273.7)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)
        self.ask(lphi, l2x)

        # (a) ∠FGH = 90°, and the diagonal GE folds it into two equal halves.
        rg = self.right_mark(G, H, F, 6, BLUE)
        self.play(Create(rg), run_time=0.6)
        self.play(Indicate(rg, color=BLUE, scale_factor=1.6), run_time=0.7)
        self.hold(1.0)
        half = VGroup(self.tint(G, H, E, color=AMBER, opacity=0.16), self.wedge(G, H, E, AMBER, 13))
        self.play(FadeOut(arc_g), FadeIn(half), lphi.animate.set_color(AMBER), run_time=0.9)
        self.hold(1.0)
        folded = half.copy()
        self.play(self.flip(folded, G, E), run_time=1.6)
        self.play(FadeOut(VGroup(half[0], folded[0])), run_time=0.6)
        self.hold()
        self.settle(lphi, "45°", self.polar(G, 112.5, 24), 7.5)
        self.hold()

        # A quarter turn about O carries the square onto itself: the four angles at O are equal, 90° each.
        w_o = self.wedge(O, E, H, PINK, 11)
        self.play(FadeOut(arc_o), FadeIn(w_o), l2x.animate.set_color(PINK), run_time=0.8)
        self.hold(1.0)
        turns = [w_o.copy() for _ in range(3)]
        self.play(FadeOut(nO), run_time=0.4)
        self.play(LaggedStart(*[self.turn(t, O, 90 * (i + 1)) for i, t in enumerate(turns)], lag_ratio=0.3), run_time=2.6)
        self.hold(1.4)
        self.play(FadeOut(VGroup(*turns)), Create(self.right_mark(O, E, H, 5, PINK)), FadeIn(nO), run_time=0.8)
        self.hold()
        self.badge("x = 50°", (216.0, 240.0), it="x")
        self.hold(2.0)

        # (b) ∠ACD = 45°: the diagonal of a square makes 45° with the sides.
        self.pan(self.PART_B)
        self.hold(0.8)
        self.ask(lx2, ly2)
        w45 = self.wedge(C2, D2, A2, AMBER, 8.5)
        l45 = self.value("45°", self.polar(C2, 112.5, 20), AMBER, 7)
        self.play(FadeIn(w45), FadeIn(l45), run_time=0.8)
        self.hold()

        # ∠AFD is an exterior angle of △CDF: the angles at C and D fill it.
        tri = self.tint(C2, D2, F2, color=PINK, opacity=0.12)
        w_f, w_x = self.wedge(F2, A2, D2, GREEN, 8.5), self.wedge(D2, C2, E2, PINK, 8.5)
        self.play(FadeIn(tri), FadeOut(VGroup(arc_f, arc_x)), FadeIn(VGroup(w_f, w_x)),
                  l74.animate.set_color(GREEN), lx2.animate.set_color(PINK), run_time=1.0)
        self.hold(1.0)
        up = self.dashed((F2[0], F2[1] - 13), (F2[0], F2[1] + 8), INK, 0.8, 3)
        self.play(Create(up), run_time=0.5)
        c45, cx = w45.copy(), w_x.copy()
        self.play(self.slide(c45, C2, F2), run_time=1.5)
        self.play(self.half_turn(cx, mid(D2, F2)), run_time=1.6)
        self.flash(w_f)
        self.hold(2.4)
        self.play(FadeOut(VGroup(c45, cx, up, tri)), run_time=0.6)
        self.settle(lx2, "29°", self.polar(D2, 257.7, 38), 7)
        self.hold()

        # The angles of △CDE make 180°.
        w_c, w_e = self.wedge(C2, D2, E2, BLUE, 8.5), self.wedge(E2, D2, C2, PURPLE, 8.5)
        self.play(FadeOut(VGroup(w45, l45, w_f)), FadeIn(arc_f), l74.animate.set_color(INK),
                  FadeIn(self.tint(C2, D2, E2, color=BLUE, opacity=0.12)), Create(self.right_mark(C2, D2, E2, 6, BLUE)),
                  FadeIn(w_c), FadeOut(arc_y), FadeIn(w_e), ly2.animate.set_color(PURPLE), run_time=1.0)
        self.hold(1.0)
        g = self.gather(D2, E2, C2, w_x, w_e, w_c, (394.0, 286.0), reach=19)
        n180 = self.value("180°", (394.0, 293.5))
        self.play(FadeIn(n180), run_time=0.5)
        self.hold(2.6)
        self.play(FadeOut(VGroup(g, n180)), run_time=0.6)
        self.settle(ly2, "61°", (431.0, 292.0))
        self.hold(2.5)


class Q11(GuideScene):
    """Square ABCD and equilateral triangle CDE; AFE is a straight line with F on CD. (a) ∠ADE. (b) ∠CAE."""

    PAGE = 4
    REGION = (374.56, 649.0, 595.0, 773.0)

    def construct(self):
        s = 76.5
        A, B = (417.5, 672.5), (417.5, 672.5 + s)
        D, C = (A[0] + s, A[1]), (A[0] + s, B[1])
        E = (D[0] + s * np.sqrt(3) / 2, (D[1] + C[1]) / 2)
        self.add(self.path(A, D, C, B, closed=True), self.seg(A, C), self.seg(A, E), self.seg(D, E), self.seg(C, E))
        for k, p in {"A": (414.5, 663.0), "D": (497.0, 662.5), "B": (414.5, 760.5), "C": (497.0, 761.0), "E": (568.0, 711.5), "F": (500.5, 702.5)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)

        # (a) The question: ∠ADE.
        ask = VGroup(self.wedge(D, A, E, RED, 9), self.value("?", self.polar(D, 205, 17), RED, 9, BOLD))
        self.play(FadeIn(ask), run_time=0.8)
        self.blink(ask[1])
        self.hold()
        self.play(FadeOut(ask), run_time=0.5)

        # ∠ADC = 90° in the square, ∠CDE = 60° in the equilateral triangle.
        w90, rd = self.wedge(D, A, C, BLUE, 9), self.right_mark(D, A, C, 5, BLUE)
        l90 = self.value("90°", self.polar(D, 203, 18), BLUE, 7.5)
        self.play(FadeIn(w90), Create(rd), FadeIn(l90), run_time=0.9)
        self.hold()
        eq = VGroup(*[self.ticks(p, q, 1, PINK, 3.6, 1.2) for p, q in ((D, C), (D, E), (C, E))])
        self.play(LaggedStart(*[GrowFromCenter(t) for t in eq], lag_ratio=0.3), run_time=0.8)
        w60 = self.wedge(D, C, E, PINK, 9)
        l60 = self.value("60°", self.polar(D, 310, 21), PINK, 7.5)
        self.play(FadeIn(w60), FadeIn(l60), run_time=0.8)
        self.hold()
        self.settle(VGroup(l90, l60), "150°", self.polar(D, 248, 28), 7.5)
        self.hold()

        # (b) The question: ∠CAE.
        self.play(FadeOut(VGroup(w90, rd, w60, eq)), run_time=0.6)
        ask = VGroup(self.wedge(A, E, C, RED, 18), self.value("?", self.polar(A, -30, 30), RED, 9, BOLD))
        self.play(FadeIn(ask), run_time=0.8)
        self.blink(ask[1])
        self.hold()
        self.play(FadeOut(ask), run_time=0.5)

        # AD = DC = DE, so △ADE is isosceles: its mirror line carries ∠DAE onto ∠DEA.
        self.play(Create(VGroup(self.mark(A, D, BLUE), self.mark(D, E, BLUE))), run_time=0.9)
        self.hold(1.0)
        tri = self.tint(A, D, E, color=BLUE, opacity=0.12)
        w_a, w_e = self.wedge(A, D, E, AMBER, 22), self.wedge(E, D, A, AMBER, 22)
        self.play(FadeIn(tri), FadeIn(w_a), run_time=0.8)
        M = mid(A, E)
        mirror = self.dashed(D, M, INK, 0.8, 3)
        self.play(Create(mirror), run_time=0.6)
        folded = w_a.copy()
        self.play(self.flip(folded, D, M), run_time=1.6)
        self.add(w_e)
        self.remove(folded)
        self.play(FadeOut(mirror), run_time=0.4)
        self.hold(1.6)
        l15 = VGroup(self.value("15°", self.polar(A, -7.5, 40), AMBER, 7), self.value("15°", self.polar(E, 158.5, 50), AMBER, 7))
        self.play(FadeIn(l15), run_time=0.7)
        self.hold()

        # ∠CAD = 45° in the square, so ∠CAE = 45° − 15°.
        w45 = self.wedge(A, D, C, GREEN, 15)
        self.play(FadeIn(w45), run_time=0.7)
        self.flash(w45)
        self.hold()
        self.play(FadeOut(VGroup(w45, tri, w_e, l15[1])), FadeIn(self.wedge(A, E, C, RED, 15)), run_time=0.9)
        self.badge("30°", self.polar(A, -30, 30), 7.5)
        self.hold(2.5)


class Q14(GuideScene):
    """A rhombus with perimeter 16 cm and an interior angle of 60°: find its area. No figure is printed,
    so the rhombus is drawn as in the teacher's answer (diagonals BC and AD meet at E, ∠ABD = 60°)
    in a frame of its own; REGION is not a place on the page."""

    PAGE = 6
    REGION = (0.0, 0.0, 200.0, 112.5)

    def construct(self):
        E, side = (100.0, 58.0), 60.0
        B, C = (E[0] - side * np.cos(np.radians(30)), E[1]), (E[0] + side * np.cos(np.radians(30)), E[1])
        D, A = (E[0], E[1] - side / 2), (E[0], E[1] + side / 2)
        self.add(self.path(B, D, C, A, closed=True), self.seg(B, C), self.seg(D, A))
        for k, p in {"B": (B[0] - 6.5, B[1]), "C": (C[0] + 6.5, C[1]), "D": (D[0], D[1] - 7), "A": (A[0], A[1] + 7.5), "E": (E[0] + 5, E[1] - 5.5)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)

        # Perimeter 16 cm: four equal sides of 4 cm.
        rim = [(B, D), (D, C), (C, A), (A, B)]
        sides = VGroup(*[self.mark(p, q, BLUE) for p, q in rim])
        self.play(LaggedStart(*[Create(m) for m in sides], lag_ratio=0.6), run_time=2.2)
        n4 = self.value("4 cm", (69.5, 80.8), BLUE)
        self.play(FadeIn(VGroup(*[self.ticks(p, q, 1, BLUE, 3.6, 1.2) for p, q in rim])), FadeIn(n4), run_time=0.8)
        self.hold()
        self.play(FadeOut(sides), run_time=0.5)

        # One angle is 60°: ∠ABD.
        w60 = self.wedge(B, A, D, PINK, 14)
        l60 = self.value("60°", self.polar(B, 0, 25), PINK)
        l60.add_background_rectangle(color="#ffffff", opacity=1, buff=0.8 * self.k).set_z_index(Z_TEXT)
        self.play(FadeIn(w60), FadeIn(l60), run_time=0.8)
        self.hold()

        # The diagonal BC halves it: fold ∠ABE over BC onto ∠DBE, 30° each.
        lower = self.wedge(B, A, C, AMBER, 14)
        self.play(FadeOut(VGroup(w60, l60)), FadeIn(lower), run_time=0.7)
        folded = lower.copy()
        self.play(self.flip(folded, B, C), run_time=1.6)
        l30 = VGroup(self.value("30°", self.polar(B, -15, 27), AMBER, 7.5), self.value("30°", self.polar(B, 15, 27), AMBER, 7.5))
        self.play(FadeIn(l30), run_time=0.6)
        self.hold()

        # The diagonals meet at right angles: in △ABE, BE = 4 cos 30° and AE = 4 sin 30°.
        tri = self.tint(A, B, E, color=GREEN, opacity=0.2)
        self.play(FadeOut(VGroup(folded, l30[1])), FadeIn(tri), Create(self.right_mark(E, B, A, 5, GREEN)), run_time=0.9)
        self.hold()
        self.play(Create(self.mark(A, B, PURPLE)), n4.animate.set_color(PURPLE), run_time=0.7)
        self.hold(1.0)
        self.play(Create(self.mark(B, E, BLUE)), FadeIn(self.value("3.464", (84.0, 52.3), BLUE, 7)), run_time=0.8)
        self.hold()
        self.play(Create(self.mark(A, E, AMBER)), FadeIn(self.value("2", (104.5, 75.0), AMBER)), run_time=0.8)
        self.hold()

        # Four such triangles make the rhombus.
        copies = [tri.copy() for _ in range(3)]
        self.play(self.flip(copies[0], B, C), run_time=1.3)
        self.play(self.flip(copies[1], A, D), run_time=1.3)
        self.play(self.half_turn(copies[2], E), run_time=1.3)
        self.hold(1.4)
        self.badge("13.9 cm²", (172.0, 96.0))
        self.hold(2.5)


class Q18(GuideScene):
    """Square ABCD with diagonals meeting at E, BE = 8 cm; ABC is a sector centred at B. Its area in terms of π."""

    PAGE = 7
    REGION = (346.1, 339.0, 595.0, 479.0)

    def construct(self):
        A, D, B, C = (446.0, 357.0), (541.0, 357.0), (446.0, 452.0), (541.0, 452.0)
        E = mid(A, C)
        r = C[0] - B[0]
        l8 = self.value("8 cm", (485.4, 434.0), size=9.5)
        self.add(self.sector(B, 0, PI / 2, "#bfbfbf", r, opacity=1.0, width=0).set_z_index(-3),
                 self.path(A, D, C, B, closed=True), self.seg(A, C), self.seg(B, D), self.arc(B, C, A, r), l8)
        for k, p in {"A": (435.4, 358.3), "D": (548.4, 355.7), "B": (440.4, 460.7), "C": (542.8, 461.7), "E": (480.4, 405.7)}.items():
            self.add(self.name(k, p, 10.5))
        self.hold(1.0)

        # The question: the area of sector ABC.
        rim = VGroup(self.seg(B, C, RED, 1.6), self.arc(B, C, A, r, RED, 1.6), self.seg(A, B, RED, 1.6)).set_z_index(1)
        self.play(Create(rim), run_time=1.4)
        self.hold()
        self.play(FadeOut(rim), run_time=0.5)

        # In △BCE: the diagonals of a square meet at right angles.
        tri = self.tint(B, C, E, color=GREEN, opacity=0.3)
        re = self.right_mark(E, B, C, 6, BLUE)
        self.play(FadeIn(tri), Create(re), run_time=0.9)
        self.play(Indicate(re, color=BLUE, scale_factor=1.6), run_time=0.7)
        self.hold()

        # The diagonals are equal and bisect each other: the square's mirror line carries BE onto CE.
        be = self.mark(B, E, BLUE)
        self.play(Create(be), l8.animate.set_color(BLUE), run_time=0.8)
        axis = ((E[0], 398.0), (E[0], 456.0))
        mirror = VGroup(self.dashed(axis[0], (E[0], 428.5), INK, 0.8, 3), self.dashed((E[0], 439.5), axis[1], INK, 0.8, 3))
        self.play(Create(mirror), run_time=0.5)
        ce = be.copy()
        self.play(self.flip(ce, *axis), run_time=1.5)
        self.play(FadeOut(mirror), FadeIn(self.value("8 cm", (521.9, 423.7), BLUE, 9.5).rotate(-PI / 4)), run_time=0.7)
        self.hold()

        # Pythagoras' theorem: BC = √128 cm.
        bc = self.mark(B, C, GREEN)
        self.play(Create(bc), FadeIn(self.value("√128 cm", (E[0], 461.5), GREEN, 9.5)), run_time=0.9)
        self.hold(2.6)

        # ∠ABC = 90°: the sector is a quarter of the circle of radius BC.
        self.play(FadeOut(VGroup(tri, re, be, ce)), Create(self.right_mark(B, C, A, 7, PURPLE)), run_time=0.9)
        radius = bc.copy()
        self.play(self.turn(radius, B, 90), Create(self.arc(B, C, A, r, RED, 1.6).set_z_index(1)), run_time=2.2)
        self.play(FadeIn(self.sector(B, 0, PI / 2, RED, r, opacity=0.16, width=0).set_z_index(Z_TINT)), FadeOut(radius), run_time=0.8)
        self.hold(2.4)
        self.badge("32π cm²", (398.0, 404.0), 9.5)
        self.hold(2.5)


class Q21(GuideScene):
    """Rectangle ABCD, E on CD with AE ⊥ EB. (a) △ADE ~ △ECB. (b) AB = 13 cm, EC = 4 cm: area of △ABE."""

    PAGE = 8
    REGION = (346.0, 479.0, 570.0, 605.0)

    def construct(self):
        u = 168.0 / 13
        D, C, A, B = (372.0, 504.5), (540.0, 504.5), (372.0, 582.0), (540.0, 582.0)
        E = (D[0] + 9 * u, D[1])
        r_d, r_c, r_e = self.right_mark(D, A, C, 7.5), self.right_mark(C, D, B, 7.5), self.right_mark(E, A, B, 7)
        self.add(self.tint(A, B, E, color="#d9d9d9", opacity=1.0).set_stroke(width=0).set_z_index(-3),
                 self.path(A, D, C, B, closed=True), self.seg(A, E), self.seg(E, B), r_d, r_c, r_e)
        for k, p in {"D": (365.0, 498.5), "C": (548.0, 499.0), "A": (366.0, 590.5), "B": (546.5, 594.5), "E": (489.5, 491.5)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)

        # (a) The two triangles to compare.
        t_ade, t_ecb = self.tint(A, D, E, color=BLUE, opacity=0.18), self.tint(E, C, B, color=GREEN, opacity=0.18)
        self.play(FadeIn(t_ade), run_time=0.7)
        self.play(FadeIn(t_ecb), run_time=0.7)
        self.hold()

        # ∠ADE = ∠ECB = 90°.
        self.play(r_d.animate.set_color(BLUE), r_c.animate.set_color(BLUE), run_time=0.5)
        self.play(Indicate(r_d, color=BLUE, scale_factor=1.6), Indicate(r_c, color=BLUE, scale_factor=1.6), run_time=0.8)
        self.hold()

        # ∠BED, an exterior angle of △BCE: it is 90° + ∠DEA ...
        ext = self.arc(E, D, B, 24, INK, 1.2).set_z_index(1)
        w_dea, w_aeb = self.wedge(E, D, A, PINK, 14), self.wedge(E, A, B, BLUE, 14)
        self.play(Create(ext), run_time=0.8)
        self.play(FadeIn(w_dea), FadeIn(w_aeb), run_time=0.8)
        self.hold(2.0)

        # ... and also ∠BCE + ∠CBE = 90° + ∠CBE.
        w_bce, w_cbe = self.wedge(C, E, B, BLUE, 14), self.wedge(B, C, E, PINK, 14)
        self.play(FadeOut(VGroup(w_dea, w_aeb)), FadeIn(VGroup(w_bce, w_cbe)), run_time=0.8)
        self.hold(1.0)
        c_bce, c_cbe = w_bce.copy(), w_cbe.copy()
        self.play(self.slide(c_bce, C, E), run_time=1.5)
        self.play(self.half_turn(c_cbe, mid(B, E)), run_time=1.6)
        self.hold(2.0)

        # Take away the right angle from both: ∠DEA = ∠CBE.
        self.play(FadeOut(c_bce), FadeIn(w_dea), run_time=0.7)
        self.play(self.turn(c_cbe, E, -90), run_time=1.4)
        self.play(FadeOut(VGroup(c_cbe, ext)), run_time=0.5)
        self.flash(w_dea, w_cbe)
        self.hold()

        # The third angles are equal too (angle sums): ∠DAE = ∠CEB.
        w_dae, w_ceb = self.wedge(A, D, E, AMBER, 14), self.wedge(E, C, B, AMBER, 14)
        self.play(FadeIn(w_dae), FadeIn(w_ceb), run_time=0.8)
        self.hold()

        # △ECB turns a quarter turn, grows by half and lands on △ADE: the triangles are similar.
        small = VGroup(t_ecb, w_cbe, w_ceb, r_c).copy()
        self.play(small.animate(path_arc=PI / 2).rotate(PI / 2, about_point=self.P(*C)).scale(1.5, about_point=self.P(*C))
                  .shift(self.P(*D) - self.P(*C)), run_time=2.6)
        self.hold(2.0)
        self.play(FadeOut(small), run_time=0.6)

        # (b) AB = 13 cm, EC = 4 cm.
        self.play(FadeOut(VGroup(t_ade, t_ecb, w_dea, w_cbe, w_dae, w_ceb)), r_d.animate.set_color(INK), r_c.animate.set_color(INK), run_time=0.8)
        ab = self.mark(A, B, PINK)
        self.play(Create(ab), FadeIn(self.value("13 cm", (mid(A, B)[0], 590.5), PINK)), run_time=0.9)
        ec = self.mark(E, C, GREEN)
        self.play(Create(ec), FadeIn(self.value("4", (mid(E, C)[0], 498.0), GREEN)), run_time=0.9)
        self.hold()

        # CD = AB = 13 cm, so DE = 13 − 4 = 9 cm.
        dc = ab.copy()
        self.play(self.slide(dc, A, D), run_time=1.4)
        self.hold(1.2)
        de = self.mark(D, E, BLUE)
        self.play(FadeOut(dc), Create(de), FadeIn(self.value("9", (mid(D, E)[0], 498.0), BLUE)), run_time=0.9)
        self.hold()

        # AD = CB, and the corresponding sides of the similar triangles: DE with CB, AD with EC. So CB × CB = 9 × 4, CB = 6 cm.
        ad, cb = self.mark(A, D, PURPLE), self.mark(C, B, PURPLE)
        self.play(Create(VGroup(ad, cb)), run_time=0.9)
        self.hold(1.0)
        self.play(Indicate(de, color=BLUE, scale_factor=1.15), Indicate(cb, color=PURPLE, scale_factor=1.15), run_time=1.0)
        self.hold(0.6)
        self.play(Indicate(ad, color=PURPLE, scale_factor=1.15), Indicate(ec, color=GREEN, scale_factor=1.15), run_time=1.0)
        self.hold(1.6)
        self.play(FadeIn(VGroup(self.value("6", (364.0, 543.0), PURPLE), self.value("6", (548.0, 543.0), PURPLE))), run_time=0.7)
        self.hold()

        # Area of △ABE: base AB, height 6 cm.
        self.play(Create(self.dashed(E, (E[0], A[1]), PURPLE, 1.0, 3)), FadeIn(self.value("6", (E[0] + 5, 545.0), PURPLE)), run_time=0.9)
        self.hold(2.4)
        self.badge("39 cm²", (450.0, 565.0))
        self.hold(2.5)


class Q23(GuideScene):
    """Parallelogram ABCD; ∠CED = 90°, ∠CDE = ∠DCF = ∠BCF, ∠ADF = ∠CDF. (a) ∠CFD. (b) CEDF is a rectangle."""

    PAGE = 10
    REGION = (328.33, 87.0, 595.0, 237.0)

    def construct(self):
        D, C = (436.0, 154.0), (546.0, 154.0)
        A = (D[0] - 63.0 / np.tan(np.radians(60)), 217.0)
        B = (A[0] + C[0] - D[0], A[1])
        E = self.polar(D, 30, (C[0] - D[0]) * np.cos(np.radians(30)))
        F = self.polar(D, -60, (C[0] - D[0]) * np.cos(np.radians(60)))
        arcs_d = VGroup(self.arc(D, A, F, 9), self.arc(D, F, C, 9))
        arcs_c = VGroup(*[self.arc(C, p, q, r) for p, q in ((D, F), (F, B)) for r in (9, 11.4)])
        r_e = self.right_mark(E, D, C, 6)
        self.add(self.path(A, B, C, D, closed=True), self.seg(D, E), self.seg(E, C), self.seg(D, F), self.seg(F, C),
                 arcs_d, arcs_c, VGroup(*[self.arc(D, C, E, r) for r in (12, 14.4)]), r_e)
        for k, p in {"E": (517.0, 97.5), "D": (424.8, 148.0), "C": (556.0, 154.5), "F": (462.5, 210.0), "A": (392.5, 221.0), "B": (514.0, 222.0)}.items():
            self.add(self.name(k, p))
        self.hold(1.0)

        # (a) The question: ∠CFD.
        w_f = self.wedge(F, C, D, RED, 12)
        q = self.value("?", self.polar(F, 75, 18), RED, 9, BOLD)
        self.play(FadeIn(w_f), FadeIn(q), run_time=0.8)
        self.blink(q)
        self.hold()

        # AD // BC.
        sides = VGroup(self.mark(A, D, PURPLE), self.mark(B, C, PURPLE))
        self.play(Create(sides), run_time=0.9)
        self.play(FadeIn(VGroup(self.chevrons(A, D, 1, PURPLE, 5, 0.5), self.chevrons(B, C, 1, PURPLE, 5, 0.5))), run_time=0.5)
        self.hold()

        # ∠ADC and ∠BCD are each cut into two equal halves.
        d1, d2 = self.wedge(D, A, F, PINK, 12), self.wedge(D, F, C, PINK, 12)
        c1, c2 = self.wedge(C, D, F, AMBER, 12), self.wedge(C, F, B, AMBER, 12)
        self.play(FadeOut(VGroup(sides, arcs_d, arcs_c)), FadeIn(VGroup(d1, d2, c1, c2)), run_time=1.0)
        self.hold()

        # Interior angles: slide ∠BCD along CD to D; with ∠ADC it makes a straight angle.
        moved = VGroup(c1, c2).copy()
        self.play(self.slide(moved, C, D), run_time=1.6)
        straight = self.arc_at(D, PI, PI, 17, INK, 0.7)
        n180 = self.value("180°", self.polar(D, 220, 31))
        self.play(Create(straight), FadeIn(n180), run_time=0.8)
        self.hold(2.0)

        # One pink and one amber are half of it: 90°.
        self.flash(moved[1], d1)
        quarter = self.right_mark(D, self.polar(D, 210, 5), self.polar(D, 300, 5), 6, GREEN)
        self.play(Create(quarter), run_time=0.5)
        self.hold()
        self.play(FadeOut(VGroup(moved, straight, n180, quarter)), run_time=0.6)

        # In △CDF the angles at D and C make 90°, so the third angle is 90°.
        tri = self.tint(C, D, F, color=GREEN, opacity=0.14)
        self.play(FadeOut(VGroup(d1, c2)), FadeIn(tri), run_time=0.8)
        self.hold(1.0)
        g = self.gather(F, D, C, w_f, d2, c1, (395.0, 118.0), reach=20)
        n180 = self.value("180°", (395.0, 110.5))
        self.play(FadeIn(n180), run_time=0.5)
        self.hold(2.4)
        r_f = self.right_mark(F, C, D, 6, RED)
        self.play(FadeOut(VGroup(g, n180, w_f)), Create(r_f), run_time=0.8)
        self.settle(q, "90°", self.polar(F, 75, 18))
        self.hold()

        # (b) The four angles of CEDF.
        self.play(FadeOut(VGroup(tri, d2, c1)), run_time=0.6)
        outline = self.path(C, E, D, F, color=BLUE, width=2.4, closed=True).set_stroke(opacity=0.6)
        self.play(Create(outline), run_time=1.4)
        self.hold()
        self.play(FadeOut(outline), run_time=0.5)

        # ∠CDE = ∠DCF are alternate angles: a half-turn about the middle of DC carries one onto the other, so DE // FC.
        a_d, a_c = self.wedge(D, C, E, AMBER, 12), self.wedge(C, D, F, AMBER, 12)
        self.play(FadeIn(a_d), FadeIn(a_c), run_time=0.8)
        zed = self.path(E, D, C, F, color=PURPLE, width=2.4).set_stroke(opacity=0.55)
        self.play(Create(zed), run_time=1.2)
        spin = a_d.copy()
        self.play(self.half_turn(spin, mid(D, C)), run_time=1.6)
        self.play(FadeOut(spin), FadeIn(VGroup(self.chevrons(D, E, 2, PURPLE, 4.5, 0.55), self.chevrons(F, C, 2, PURPLE, 4.5, 0.55))), run_time=0.7)
        self.hold()
        self.play(FadeOut(VGroup(zed, a_d, a_c)), run_time=0.6)

        # Interior angles between DE and FC: the right angle at E slides along EC to C, so ∠ECF = 90°.
        w_e = self.wedge(E, D, C, BLUE, 10)
        self.play(FadeIn(w_e), r_e.animate.set_color(BLUE), run_time=0.7)
        moved = w_e.copy()
        self.play(self.slide(moved, E, C), run_time=1.5)
        straight = self.arc_at(C, np.radians(120), PI, 15, INK, 0.7)
        self.play(Create(straight), run_time=0.6)
        r_c = self.right_mark(C, E, F, 6, GREEN)
        self.play(Create(r_c), run_time=0.5)
        self.hold(1.6)
        self.play(FadeOut(VGroup(moved, w_e, straight)), run_time=0.6)

        # And the right angle at F slides along FD to D, so ∠EDF = 90°.
        w_fd = self.wedge(F, C, D, BLUE, 10)
        self.play(FadeIn(w_fd), run_time=0.6)
        moved = w_fd.copy()
        self.play(self.slide(moved, F, D), run_time=1.5)
        straight = self.arc_at(D, np.radians(-60), PI, 15, INK, 0.7)
        self.play(Create(straight), run_time=0.6)
        r_d = self.right_mark(D, E, F, 6, GREEN)
        self.play(Create(r_d), run_time=0.5)
        self.hold(1.6)
        self.play(FadeOut(VGroup(moved, w_fd, straight)), run_time=0.6)

        # Four right angles: CEDF is a rectangle.
        corners = VGroup(r_e, r_c, r_d, r_f)
        self.play(FadeIn(self.tint(C, E, D, F, color=PURPLE, opacity=0.16)), corners.animate.set_color(RED), run_time=0.9)
        self.play(LaggedStart(*[Indicate(m, color=RED, scale_factor=1.6) for m in corners], lag_ratio=0.3), run_time=1.6)
        self.badge("CEDF is a rectangle", (390.0, 118.0), it=("CEDF",))
        self.hold(2.5)
