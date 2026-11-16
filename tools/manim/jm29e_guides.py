"""Solution guides for JM29 (E) Quadrilaterals.

Only the questions whose figure and steps already have a scene in (A)–(D):
Q1 is the opposite-angle half-turn from the parallelogram properties,
Q6 is the square-and-equilateral chase from JM29 (C) Q11,
Q27 is the mid-point slide from JM29 (D) Q3.
Vertices are the printed corners. A half-turn or a slide therefore lands on the
printed line it is meant to.
"""

import math

from manim import (
    BOLD, ITALIC, NORMAL, Create, FadeIn, FadeOut, LaggedStart, ReplacementTransform, VGroup, Write,
)

from guide import AMBER, BLUE, GREEN, INK, PINK, RED, SERIF, Z_MARK, Z_TEXT, GuideScene, along, mid


def _deg(v, p):
    """Direction from v to p, in the same degrees polar() uses."""
    return math.degrees(math.atan2(-(p[1] - v[1]), p[0] - v[0]))


def _bisector(v, a, b):
    """The short-sweep bisector from va to vb, in polar degrees."""
    d1, d2 = _deg(v, a), _deg(v, b)
    return d1 + ((d2 - d1 + 180) % 360 - 180) / 2


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
