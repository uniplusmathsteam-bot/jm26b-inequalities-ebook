"""Solution guides for JM29 (E) Quadrilaterals.

Each scene is a motion already used in (A)–(D), redrawn on this page:
Q1 and Q3 are the opposite-angle half-turn from the parallelogram properties,
Q6 and Q21 are the square-and-equilateral chase from JM29 (C) Q11,
Q18 is the rhombus area from JM29 (C) Q14 (that question prints no figure),
Q27 is the mid-point slide from JM29 (D) Q3.
Vertices are the printed corners, nudged by a fraction of a point so a square or
an equilateral triangle is exact. A half-turn, a fold or a slide therefore lands
on the line it is meant to.
"""

import math

from manim import (
    BOLD, ITALIC, NORMAL, Create, FadeIn, FadeOut, LaggedStart, ReplacementTransform, VGroup, Write,
)

from guide import AMBER, BLUE, GREEN, INK, PINK, PURPLE, RED, SERIF, Z_MARK, Z_TEXT, GuideScene, along, mid


def _deg(v, p):
    """Direction from v to p, in the same degrees polar() uses."""
    return math.degrees(math.atan2(-(p[1] - v[1]), p[0] - v[0]))


def _bisector(v, a, b):
    """The short-sweep bisector from va to vb, in polar degrees."""
    d1, d2 = _deg(v, a), _deg(v, b)
    return d1 + ((d2 - d1 + 180) % 360 - 180) / 2


def _meet(a, b, c, d):
    """Where line ab crosses line cd."""
    den = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0])
    t = ((a[0] - c[0]) * (c[1] - d[1]) - (a[1] - c[1]) * (c[0] - d[0])) / den
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


class Guide(GuideScene):
    def letter(self, s, p, size=10):
        """A vertex name in the printed serif italic."""
        return self._txt(s, p, size, INK, NORMAL, ITALIC, SERIF)


class Q1(Guide):
    """Parallelogram ABCD. ∠DAB = 3x°, ∠BCD = (x + 56)°. Find x."""

    PAGE = 1
    REGION = (424.0, 196.0, 580.0, 284.0)

    def construct(self):
        A, B = (446.67, 266.0), (547.17, 266.0)
        D, C = (452.0, 212.67), (552.83, 212.67)
        O = mid(A, C)
        sides = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, D), self.seg(D, A))
        names = VGroup(
            self.letter("A", (438.5, 274.5)), self.letter("B", (556.0, 274.0)),
            self.letter("C", (561.5, 207.5)), self.letter("D", (443.5, 206.0)),
        )
        a_lab = self.value("3x°", (466.0, 255.0), size=9)
        c_lab = self.value("(x + 56)°", (524.0, 228.0), size=9)
        arc_a = self.arc(A, D, B, 8, inside=O)
        arc_c = self.arc(C, B, D, 8, inside=O)
        self.add(sides, names, a_lab, c_lab, arc_a, arc_c)
        self.hold(1.0)

        self.ask(a_lab, c_lab)

        # Opposite angles: a half-turn about the centre carries ∠A onto ∠C.
        w = self.wedge(A, D, B, BLUE, 12, inside=O)
        self.play(FadeIn(w), a_lab.animate.set_color(BLUE), run_time=0.8)
        self.hold(0.6)
        turned = w.copy()
        self.play(self.half_turn(turned, O), run_time=1.5)
        self.play(c_lab.animate.set_color(BLUE), FadeOut(arc_a), FadeOut(arc_c), run_time=0.6)
        self.hold()

        # 3x = x + 56, so x = 28 and both angles are 84°.
        self.settle(a_lab, "84°", (466.0, 255.0), 9)
        self.settle(c_lab, "84°", (530.0, 226.0), 9)
        self.badge("x = 28", (500.0, 242.0), 10)
        self.hold(2.2)


class Q6(Guide):
    """Square PQRS, PTS equilateral, T inside the square. Find ∠RQT."""

    PAGE = 2
    REGION = (458.0, 74.0, 586.0, 192.0)

    def construct(self):
        P, S = (481.67, 91.33), (481.67, 167.33)
        side = S[1] - P[1]
        Q, R = (P[0] + side, P[1]), (P[0] + side, S[1])
        T = (P[0] + side * 3 ** 0.5 / 2, (P[1] + S[1]) / 2)
        square = VGroup(self.seg(P, Q), self.seg(Q, R), self.seg(R, S), self.seg(S, P))
        rays = VGroup(self.seg(P, T), self.seg(Q, T), self.seg(S, T), self.seg(R, T))
        names = VGroup(
            self.letter("P", (473.5, 84.5)), self.letter("Q", (566.0, 84.5)),
            self.letter("S", (473.5, 176.5)), self.letter("R", (566.0, 176.0)),
            self.letter("T", (552.8, 128.6), 7.5),
        )
        self.add(square, rays, names)
        self.hold(1.0)

        # The question: ∠RQT.
        ask = VGroup(self.wedge(Q, R, T, RED, 14, inside=(554.5, 104.0)), self.value("?", (546.0, 104.0), RED, 8, BOLD))
        self.play(FadeIn(ask), run_time=0.8)
        self.blink(ask[1])
        self.hold()
        self.play(FadeOut(ask), run_time=0.5)

        # PTS is equilateral, so ∠TPS = 60°.
        eq = VGroup(self.ticks(P, T, 1, PINK, 3.2), self.ticks(T, S, 1, PINK, 3.2), self.ticks(P, S, 1, PINK, 3.2))
        self.play(LaggedStart(*[Create(t) for t in eq], lag_ratio=0.25), run_time=0.9)
        w60 = self.wedge(P, S, T, PINK, 12, inside=T)
        l60 = self.value("60°", self.polar(P, _bisector(P, S, T), 24), PINK, 7.5)
        self.play(FadeIn(w60), FadeIn(l60), run_time=0.8)
        self.hold()

        # The square's angle at P is 90°, so ∠QPT = 30°.
        w90 = self.wedge(P, S, Q, BLUE, 16, inside=Q)
        mark = self.right_mark(P, S, Q, 5, BLUE)
        self.play(FadeIn(w90), Create(mark), run_time=0.8)
        self.hold(0.6)
        w30 = self.wedge(P, Q, T, AMBER, 16, inside=(530.0, 100.0))
        l30 = self.value("30°", self.polar(P, _bisector(P, Q, T), 26), AMBER, 7)
        self.play(FadeOut(VGroup(w90, mark, w60, l60)), FadeIn(w30), FadeIn(l30), run_time=0.9)
        self.hold()

        # PQ = PT, so the base angles of △PQT are (180° − 30°) / 2 = 75°.
        same = VGroup(self.mark(P, Q, GREEN), self.mark(P, T, GREEN))
        self.play(Create(same), run_time=0.8)
        self.hold(0.5)
        wq = self.wedge(Q, P, T, AMBER, 14, inside=(529.0, 104.0))
        wt = self.wedge(T, P, Q, AMBER, 8, inside=(529.0, 104.0))
        self.play(FadeIn(wq), run_time=0.6)
        # The fold line is the bisector, which runs through 30°. Break it around that number.
        M = mid(Q, T)
        span = math.hypot(M[0] - P[0], M[1] - P[1])
        mirror = self.dashed(along(P, M, 38 / span), M, INK, 0.7, 2.5)
        self.play(Create(mirror), run_time=0.5)
        folded = wq.copy()
        self.play(self.flip(folded, P, mid(Q, T)), run_time=1.5)
        self.add(wt)
        self.remove(folded)
        self.play(FadeOut(mirror), run_time=0.4)
        l75 = VGroup(
            self.value("75°", self.polar(Q, _bisector(Q, P, T), 22), AMBER, 7),
            self.value("75°", self.polar(T, _bisector(T, P, Q), 13.5), AMBER, 7),
        )
        self.play(FadeIn(l75), run_time=0.6)
        self.hold()

        # ∠PQR = 90°, so ∠RQT = 90° − 75° = 15°.
        self.play(FadeOut(VGroup(w30, l30, eq, same, wt)), run_time=0.6)
        w15 = self.wedge(Q, T, R, RED, 14, inside=(554.5, 104.0))
        self.play(ReplacementTransform(wq, w15), FadeOut(l75), run_time=0.9)
        # 15° is too narrow to hold the number, so it sits just beside the arc.
        self.badge("15°", self.polar(Q, _bisector(Q, T, R) - 32, 20), 7.5)
        self.hold(2.4)


class Q27(Guide):
    """D, E, F mid-points of BC, CA, AB. The perimeter of quadrilateral AFDE."""

    PAGE = 6
    REGION = (416.0, 294.0, 568.0, 402.0)

    def construct(self):
        A = (493.67, 310.67)
        B, C = (434.5, 376.0), (548.2, 376.0)
        F, E, D = mid(A, B), mid(A, C), mid(B, C)
        tri = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, A))
        inner = VGroup(self.seg(F, D), self.seg(D, E), self.seg(E, F))
        ticks = VGroup(
            self.ticks(A, F, 1, INK, 3.0, 0.9), self.ticks(F, B, 1, INK, 3.0, 0.9),
            self.ticks(A, E, 2, INK, 3.0, 0.9), self.ticks(E, C, 2, INK, 3.0, 0.9),
            self.ticks(B, D, 3, INK, 3.0, 0.9), self.ticks(D, C, 3, INK, 3.0, 0.9),
        )
        names = {k: self.letter(k, p) for k, p in {
            "A": (493.7, 301.5), "B": (426.0, 382.5), "C": (556.5, 382.0),
            "D": (491.4, 386.5), "F": (456.5, 338.0), "E": (529.0, 338.0),
        }.items()}
        self.add(tri, inner, ticks, *names.values())
        self.hold(1.0)

        # The question: the perimeter of AFDE.
        quad = self.tint(A, F, D, E, color=AMBER, opacity=0.16)
        q = self.value("?", (492.0, 352.0), RED, 11, BOLD)
        self.play(FadeIn(quad), FadeIn(q), run_time=0.8)
        self.blink(q)
        self.hold()
        self.play(FadeOut(q), run_time=0.4)

        # F and D are mid-points, so FD = ½ AC. AE, half of AC, slides onto FD.
        fd = VGroup(self.mark(A, F, BLUE), self.mark(F, B, BLUE), self.mark(B, D, PINK), self.mark(D, C, PINK))
        self.play(Create(fd), run_time=1.0)
        self.hold(0.6)
        half_ac = self.mark(A, E, GREEN)
        self.play(Create(half_ac), run_time=0.7)
        copy = half_ac.copy()
        self.play(self.slide(copy, A, F), run_time=1.5)
        on_fd = self.mark(F, D, GREEN).set_z_index(Z_MARK + 0.5)
        self.add(on_fd)
        self.remove(copy)
        lab_ac = self.value("½ AC", ((B[0] + F[0] + D[0]) / 3, (B[1] + F[1] + D[1]) / 3 - 2), GREEN, 7.5)
        self.play(FadeIn(lab_ac), run_time=0.5)
        self.hold()

        # E and D are mid-points, so DE = ½ AB. AF slides onto DE.
        half_ab = self.mark(A, F, AMBER).set_z_index(Z_MARK + 0.5)
        self.play(Create(half_ab), run_time=0.7)
        copy = half_ab.copy()
        self.play(self.slide(copy, A, E), run_time=1.5)
        on_de = self.mark(D, E, AMBER).set_z_index(Z_MARK + 0.5)
        self.add(on_de)
        self.remove(copy)
        lab_ab = self.value("½ AB", ((C[0] + E[0] + D[0]) / 3, (C[1] + E[1] + D[1]) / 3 - 2), AMBER, 7.5)
        self.play(FadeIn(lab_ab), run_time=0.5)
        self.hold()

        # AF + FD + DE + EA = ½AB + ½AC + ½AB + ½AC = AB + AC.
        self.play(FadeOut(VGroup(fd, half_ac, half_ab, quad)), run_time=0.6)
        result = self.value("AB + AC", (mid(F, E)[0], mid(F, E)[1]), RED, 8, BOLD)
        result.add_background_rectangle(color="#ffffff", opacity=1, buff=0.4 * self.k).set_z_index(Z_TEXT)
        self.play(Write(result), run_time=0.8)
        self.hold(2.4)


class Q3(Guide):
    """Parallelogram ABCD. A half-turn about the centre swaps each pair of opposite angles."""

    PAGE = 1
    REGION = (430.0, 466.0, 566.0, 548.0)

    def construct(self):
        A, B = (446.5, 531.0), (543.3, 531.0)
        D = (451.3, 480.5)
        C = (A[0] + (B[0] - A[0]) + (D[0] - A[0]), A[1] + (D[1] - A[1]))
        O = mid(A, C)
        sides = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, D), self.seg(D, A))
        names = VGroup(
            self.letter("A", (443.1, 536.2), 9), self.letter("B", (547.3, 533.2), 9),
            self.letter("C", (553.1, 477.5), 9), self.letter("D", (444.0, 475.0), 9),
        )
        self.add(sides, names)
        self.hold(1.0)

        # Opposite angles: a half-turn about the centre carries angle A onto angle C.
        wA = self.wedge(A, D, B, BLUE, 10, inside=O)
        self.play(FadeIn(wA), run_time=0.8)
        self.hold(0.5)
        turned = wA.copy()
        self.play(self.half_turn(turned, O), run_time=1.5)
        self.hold()
        eq1 = self._txt("∠A = ∠C", (O[0], O[1] - 7), 8, BLUE, it=("A", "C"), font="Cambria")
        self.play(Write(eq1), run_time=0.7)
        self.hold()

        # The same half-turn carries angle B onto angle D.
        wB = self.wedge(B, C, A, GREEN, 10, inside=O)
        self.play(FadeIn(wB), run_time=0.8)
        self.hold(0.4)
        turned = wB.copy()
        self.play(self.half_turn(turned, O), run_time=1.5)
        self.hold()
        eq2 = self._txt("∠B = ∠D", (O[0], O[1] + 7), 8, GREEN, it=("B", "D"), font="Cambria")
        self.play(Write(eq2), run_time=0.7)
        self.hold(0.6)
        self.play(eq1.animate.set_color(RED), eq2.animate.set_color(RED), run_time=0.6)
        self.hold(2.0)


class Q18(Guide):
    """A rhombus with perimeter 16 cm and one angle 60°: area 13.9 cm². No figure is printed,
    so this is JM29 (C) Q14 in a frame of its own. REGION is not a place on the page."""

    PAGE = 4
    REGION = (0.0, 0.0, 200.0, 112.5)

    def construct(self):
        E, side = (100.0, 58.0), 60.0
        span = side * math.cos(math.radians(30))
        B, C = (E[0] - span, E[1]), (E[0] + span, E[1])
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

        # One angle is 60°: angle ABD.
        w60 = self.wedge(B, A, D, PINK, 14)
        l60 = self.value("60°", self.polar(B, 0, 25), PINK)
        l60.add_background_rectangle(color="#ffffff", opacity=1, buff=0.8 * self.k).set_z_index(Z_TEXT)
        self.play(FadeIn(w60), FadeIn(l60), run_time=0.8)
        self.hold()

        # The diagonal BC halves it: fold angle ABE over BC onto angle DBE, 30° each.
        lower = self.wedge(B, A, C, AMBER, 14)
        self.play(FadeOut(VGroup(w60, l60)), FadeIn(lower), run_time=0.7)
        folded = lower.copy()
        self.play(self.flip(folded, B, C), run_time=1.6)
        l30 = VGroup(self.value("30°", self.polar(B, -15, 27), AMBER, 7.5), self.value("30°", self.polar(B, 15, 27), AMBER, 7.5))
        self.play(FadeIn(l30), run_time=0.6)
        self.hold()

        # The diagonals meet at right angles: in triangle ABE, BE = 4 cos 30° and AE = 4 sin 30°.
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


class Q21(Guide):
    """Square ABCD, equilateral triangle BCE inside it. CE meets diagonal BD at P; the marked angle is 75°."""

    PAGE = 5
    REGION = (470.0, 76.0, 582.0, 180.0)

    def construct(self):
        s = 77.33
        A = (485.17, 87.50)
        D, B, C = (A[0] + s, A[1]), (A[0], A[1] + s), (A[0] + s, A[1] + s)
        E = ((B[0] + C[0]) / 2, B[1] - s * math.sqrt(3) / 2)
        P = _meet(B, D, C, E)
        square = VGroup(self.seg(A, B), self.seg(B, C), self.seg(C, D), self.seg(D, A))
        extra = VGroup(self.seg(B, E), self.seg(C, E), self.seg(B, D))
        names = VGroup(
            self.letter("A", (478.6, 83.8), 9), self.letter("B", (480.8, 168.9), 9),
            self.letter("C", (567.6, 168.0), 9), self.letter("D", (570.6, 82.6), 9),
            self.letter("E", (516.6, 97.0), 9), self.letter("P", (536.5, 105.2), 9),
        )
        below = (P[0], P[1] + 10)
        arc_p = self.arc(P, B, C, 8, inside=below)
        p_letter = self.letter("p", (531.8, 134.0), 9)
        self.add(square, extra, names, arc_p, p_letter)
        self.hold(1.0)

        self.ask(p_letter)

        # Equilateral triangle BCE: angle PCB is 60°.
        ticks = VGroup(
            self.ticks(B, C, 1, PINK, 3.2, 1.0), self.ticks(B, E, 1, PINK, 3.2, 1.0),
            self.ticks(C, E, 1, PINK, 3.2, 1.0),
        )
        w60 = self.wedge(C, B, E, PINK, 13, inside=self.polar(C, 150, 16))
        l60 = self.value("60°", self.polar(C, 150, 24), PINK, 7)
        self.play(FadeIn(ticks), FadeIn(w60), FadeIn(l60), run_time=0.8)
        self.hold()

        # The square's corner is 90°, so the angle between CE and CD is 30°.
        corner = self.right_mark(C, B, D, 5, BLUE)
        self.play(Create(corner), run_time=0.6)
        self.hold(0.8)
        w30 = self.wedge(C, E, D, AMBER, 12, inside=self.polar(C, 105, 16))
        l30 = self.value("30°", self.polar(C, 105, 30), AMBER, 7)
        self.play(FadeOut(VGroup(ticks, w60, l60, corner)), FadeIn(w30), FadeIn(l30), run_time=0.8)
        self.hold()

        # The diagonal of the square halves the right angle at D: fold one 45° onto the other.
        mark_d = self.right_mark(D, A, C, 5, GREEN)
        left = self.wedge(D, A, B, GREEN, 12, inside=self.polar(D, 202.5, 8))
        self.play(FadeIn(mark_d), FadeIn(left), run_time=0.7)
        self.hold(0.5)
        folded = left.copy()
        self.play(self.flip(folded, D, B), run_time=1.5)
        l45 = self.value("45°", self.polar(D, -112.5, 24), GREEN, 7)
        self.play(FadeOut(VGroup(left, mark_d)), FadeIn(l45), run_time=0.6)
        self.hold()

        # p is the exterior angle of triangle PCD, so the 45° and the 30° fill it.
        self.play(FadeOut(VGroup(l30, l45, arc_p, p_letter)), run_time=0.5)
        self.play(self.slide(folded, D, P), run_time=1.4)
        self.play(self.half_turn(w30, mid(C, P)), run_time=1.5)
        self.flash(folded, w30)
        self.hold(0.4)
        self.badge("75°", self.polar(P, _bisector(P, B, C), 22), 7.5)
        self.hold(2.2)
