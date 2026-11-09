"""Solution guides for JM29 (D) Quadrilaterals, the mid-point and intercept theorems: Q3, Q13, Q20.

Each scene follows the teacher's working in books/jm29d/solutions.js, one step per beat,
on the printed figure. The vertices are fitted to the printed lines; mid-points and the
points that cut AD into three are then placed exactly, so a mid-segment slid along a side
lands exactly on the half of the base it equals. Every pair of equal parts has a colour of
its own and its ticks take that colour; the triangle being worked in is tinted.
"""

from manim import (
    BOLD, ITALIC, NORMAL, Create, FadeIn, FadeOut, GrowFromCenter, Indicate, LaggedStart, ReplacementTransform,
    TransformFromCopy, VGroup,
)

from guide import AMBER, BLUE, GREEN, INK, PINK, PURPLE, RED, SERIF, Z_MARK, GuideScene, along, mid

TEAL = "#0f9fb0"
Z_TICK = Z_MARK + 1


class Guide(GuideScene):
    def letter(self, s, p, size=10, weight=NORMAL):
        """A vertex name in the printed serif italic."""
        return self._txt(s, p, size, INK, weight, ITALIC, SERIF)

    def given(self, a, b, n, size=3.2):
        """Printed equal-length ticks, kept above the coloured sides."""
        return self.ticks(a, b, n, INK, size, 0.9).set_z_index(Z_TICK)

    @staticmethod
    def recolor(color, *mobs):
        return [m.animate.set_color(color) for m in mobs]


class Q3(Guide):
    """E, F, G the mid-points of AB, CD and AC; EGF straight. AD = 24 cm, EF = 30 cm. Find BC."""

    PAGE = 2
    REGION = (362.0, 88.0, 582.0, 211.75)

    def construct(self):
        A, D = (421.75, 118.17), (520.7, 118.17)
        B, C = (384.67, 181.19), (558.0, 181.19)
        E, F, G = mid(A, B), mid(D, C), mid(A, C)
        ad, bc = self.seg(A, D), self.seg(B, C)
        ae, eb, df, fc = self.seg(A, E), self.seg(E, B), self.seg(D, F), self.seg(F, C)
        ag, gc, eg, gf = self.seg(A, G), self.seg(G, C), self.seg(E, G), self.seg(G, F)
        t_ae, t_eb = self.given(A, E, 1), self.given(E, B, 1)
        t_df, t_fc = self.given(D, F, 2), self.given(F, C, 2)
        t_ag, t_gc = self.given(A, G, 3), self.given(G, C, 3)
        y = 160.1
        dim30 = VGroup(
            self.seg((E[0], y), (453.9, y), INK, 0.8), self.seg((490.6, y), (F[0], y), INK, 0.8),
            self.seg((E[0], y - 3), (E[0], y + 3), INK, 0.8), self.seg((F[0], y - 3), (F[0], y + 3), INK, 0.8),
            self.path((E[0] + 5.8, y - 3), (E[0], y), (E[0] + 5.8, y + 3), width=0.8),
            self.path((F[0] - 5.8, y - 3), (F[0], y), (F[0] - 5.8, y + 3), width=0.8),
        )
        l24, l30 = self.value("24 cm", (471.7, 111.7), size=11), self.value("30 cm", (472.0, 160.0), size=11)
        names = {k: self.name(k, p, 11) for k, p in {
            "A": (413.9, 115.5), "D": (531.7, 116.1), "E": (394.3, 148.2), "F": (549.4, 147.8),
            "G": (494.8, 142.6), "B": (377.1, 184.7), "C": (567.3, 181.9),
        }.items()}
        self.add(ad, bc, ae, eb, df, fc, ag, gc, eg, gf, t_ae, t_eb, t_df, t_fc, t_ag, t_gc, dim30, l24, l30, *names.values())
        self.hold(1.0)

        # The question: BC.
        at_bc = (mid(B, C)[0], 190.5)
        red_bc = self.mark(B, C, RED)
        q = self.value("?", at_bc, RED, 11, BOLD)
        self.play(Create(red_bc), FadeIn(q), run_time=0.9)
        self.blink(q)
        self.hold()
        self.play(FadeOut(red_bc), run_time=0.5)

        # In △ACD.
        abc_only = VGroup(ae, eb, bc, eg, t_ae, t_eb, names["B"], names["E"], dim30, l30)
        tri = self.tint(A, C, D, color=AMBER, opacity=0.12)
        self.play(*self.dim(abc_only), FadeIn(tri), run_time=1.0)
        self.hold(0.6)

        # F is the mid-point of CD: CF = FD.
        f_sides = VGroup(self.mark(D, F, BLUE), self.mark(F, C, BLUE))
        self.play(Create(f_sides), *self.recolor(BLUE, t_df, t_fc), run_time=1.0)
        self.hold(0.8)

        # G is the mid-point of AC: AG = GC.
        g_sides = VGroup(self.mark(A, G, PURPLE), self.mark(G, C, PURPLE))
        self.play(Create(g_sides), *self.recolor(PURPLE, t_ag, t_gc), run_time=1.0)
        self.hold()

        # Mid-point theorem: GF is half of AD. The right half of AD slides down along DC onto GF.
        M = mid(A, D)
        ad_halves = VGroup(self.mark(A, M, PINK), self.mark(M, D, PINK))
        self.play(Create(ad_halves), l24.animate.set_color(PINK), run_time=1.0)
        self.hold(0.6)
        half = ad_halves[1].copy()
        self.play(self.slide(half, M, G), run_time=1.6)
        l12 = self.value("12 cm", (516.0, 143.3), PINK, 9.5)
        self.play(TransformFromCopy(l24, l12), run_time=0.9)
        self.hold()
        self.play(FadeOut(VGroup(tri, f_sides, g_sides, ad_halves)), *self.undim(abc_only), run_time=1.0)
        self.hold(0.6)

        # EF = 30 cm. Take away GF = 12 cm: EG = 18 cm.
        ef = self.mark(E, F, GREEN).set_z_index(Z_MARK + 0.5)
        self.play(Create(ef), dim30.animate.set_color(GREEN), l30.animate.set_color(GREEN), run_time=1.0)
        self.hold(0.8)
        eg_m = self.mark(E, G, GREEN).set_z_index(Z_MARK + 0.5)
        self.play(ReplacementTransform(ef, eg_m), run_time=1.4)
        l18 = self.value("18 cm", (440.0, 143.3), GREEN, 9.5)
        self.play(FadeIn(l18), run_time=0.6)
        self.hold()

        # In △ABC.
        acd_only = VGroup(ad, df, fc, gf, t_df, t_fc, names["D"], names["F"], l24, dim30, l30)
        tri = self.tint(A, B, C, color=AMBER, opacity=0.12)
        self.play(*self.dim(acd_only), FadeOut(VGroup(half, l12)), FadeIn(tri), run_time=1.0)
        self.hold(0.6)

        # E is the mid-point of AB: AE = EB.
        e_sides = VGroup(self.mark(A, E, TEAL), self.mark(E, B, TEAL))
        self.play(Create(e_sides), *self.recolor(TEAL, t_ae, t_eb), run_time=1.0)
        self.hold(0.8)

        # G is the mid-point of AC.
        g_sides = VGroup(self.mark(A, G, PURPLE), self.mark(G, C, PURPLE))
        self.play(Create(g_sides), run_time=0.9)
        self.hold()

        # Mid-point theorem: EG is half of BC. Two copies of EG fill BC.
        H = mid(B, C)
        first, second = eg_m.copy(), eg_m.copy()
        self.play(self.slide(first, E, B), run_time=1.5)
        self.play(self.slide(second, E, H), run_time=1.5)
        n1 = self.value("18", (mid(B, H)[0], 190.5), GREEN, 9.5)
        n2 = self.value("18", (mid(H, C)[0], 190.5), GREEN, 9.5)
        self.play(TransformFromCopy(l18, n1), TransformFromCopy(l18, n2), run_time=1.0)
        self.hold()

        # BC = 2 × 18 cm = 36 cm.
        self.play(ReplacementTransform(VGroup(first, second), self.mark(B, C, RED)), FadeOut(VGroup(n1, n2)), run_time=1.0)
        self.settle(q, "36 cm", at_bc, 11)
        self.play(FadeOut(VGroup(tri, e_sides, g_sides)), *self.undim(acd_only), run_time=0.9)
        self.hold(2.5)


class Q13(Guide):
    """△ADF with AB = BC = CD and AE = EF; BE and DF produced meet at G. (a) DF = FG. (b) BE : EG."""

    PAGE = 5
    REGION = (360.0, 557.7, 610.0, 698.33)

    def construct(self):
        A, D, F = (445.9, 580.1), (410.2, 677.0), (482.5, 677.0)
        B, C = along(A, D, 1 / 3), along(A, D, 2 / 3)
        E = mid(A, F)
        G = (2 * F[0] - D[0], F[1])
        s = {k: self.seg(*v) for k, v in {
            "AB": (A, B), "BC": (B, C), "CD": (C, D), "AE": (A, E), "EF": (E, F),
            "DF": (D, F), "FG": (F, G), "BE": (B, E), "EG": (E, G), "CF": (C, F),
        }.items()}
        t = {"AB": self.given(A, B, 1, 3.4), "BC": self.given(B, C, 1, 3.4), "CD": self.given(C, D, 1, 3.4),
             "AE": self.given(A, E, 2, 3.4), "EF": self.given(E, F, 2, 3.4)}
        names = {k: self.letter(k, p, 10, BOLD) for k, p in {
            "A": (446.9, 573.0), "B": (427.7, 611.2), "C": (416.2, 643.5), "D": (403.5, 678.7),
            "E": (470.0, 623.4), "F": (482.4, 684.0), "G": (562.6, 678.9),
        }.items()}
        self.add(*s.values(), *t.values(), *names.values())
        self.hold(1.0)

        # (a) To prove: DF = FG.
        red = VGroup(self.mark(D, F, RED), self.mark(F, G, RED))
        qs = VGroup(*[self.value("?", (mid(p, q)[0], 670.0), RED, 9, BOLD) for p, q in ((D, F), (F, G))])
        self.play(Create(red), FadeIn(qs), run_time=0.9)
        self.blink(*qs)
        self.hold()
        self.play(FadeOut(VGroup(red, qs)), run_time=0.5)

        # In △ACF.
        out_acf = VGroup(s["CD"], s["DF"], s["FG"], s["EG"], t["CD"], names["D"], names["G"])
        tri = self.tint(A, C, F, color=AMBER, opacity=0.12)
        self.play(*self.dim(out_acf), FadeIn(tri), run_time=1.0)
        self.hold(0.6)

        # B is the mid-point of AC: AB = BC.
        b_sides = VGroup(self.mark(A, B, BLUE), self.mark(B, C, BLUE))
        self.play(Create(b_sides), *self.recolor(BLUE, t["AB"], t["BC"]), run_time=1.0)
        self.hold(0.8)

        # E is the mid-point of AF: AE = EF.
        e_sides = VGroup(self.mark(A, E, PINK), self.mark(E, F, PINK))
        self.play(Create(e_sides), *self.recolor(PINK, t["AE"], t["EF"]), run_time=1.0)
        self.hold()

        # Mid-point theorem: BE // CF. BE slides down along BC and lies on CF.
        be = self.mark(B, E, PURPLE)
        self.play(Create(be), run_time=0.8)
        moved = be.copy()
        self.play(self.slide(moved, B, C), run_time=1.6)
        cf = self.mark(C, F, PURPLE)
        par = VGroup(self.chevrons(B, E, 1, PURPLE, 5, 0.5), self.chevrons(C, F, 1, PURPLE, 5, 0.5))
        self.play(FadeIn(cf), FadeOut(moved), FadeIn(par), run_time=0.8)
        self.hold()

        # In △DBG.
        out_dbg = VGroup(s["AB"], s["AE"], s["EF"], t["AB"], t["AE"], t["EF"], names["A"])
        tri2 = self.tint(D, B, G, color=AMBER, opacity=0.12)
        self.play(*self.dim(out_dbg), *self.undim(out_acf), FadeOut(VGroup(tri, e_sides, b_sides[0])), FadeIn(tri2),
                  run_time=1.0)
        self.hold(0.6)

        # C is the mid-point of DB: DC = CB.
        cd = self.mark(C, D, BLUE)
        self.play(Create(cd), *self.recolor(BLUE, t["CD"]), run_time=0.9)
        self.hold(0.8)

        # CF // BG, proved in (a).
        eg = self.mark(E, G, PURPLE)
        self.play(Create(eg), par[0].animate.move_to(self.P(*mid(B, G))), run_time=1.0)
        self.hold()

        # Intercept theorem: DF = FG. DF slides along DG onto FG.
        df = self.mark(D, F, GREEN)
        self.play(Create(df), run_time=0.8)
        moved = df.copy()
        self.play(self.slide(moved, D, F), run_time=1.6)
        equal = VGroup(self.ticks(D, F, 3, GREEN, 3.4, 0.9), self.ticks(F, G, 3, GREEN, 3.4, 0.9)).set_z_index(Z_TICK)
        self.play(LaggedStart(*[GrowFromCenter(x) for x in equal], lag_ratio=0.3), run_time=0.8)
        self.badge("DF = FG", (548.0, 598.0), 9, it=("DF", "FG"))
        self.hold(2.0)

        # (b) BE : EG.
        self.play(FadeOut(VGroup(tri2, b_sides[1], cd, be, eg, cf, par, df, moved)), *self.undim(out_dbg), run_time=1.0)
        self.hold(0.6)
        unit = self.mark(B, E, PURPLE)
        rest = self.mark(E, G, AMBER)
        self.play(Create(unit), run_time=0.8)
        self.play(Create(rest), run_time=0.9)
        self.hold()
        self.play(FadeOut(rest), run_time=0.5)

        # Mid-point theorem in △ACF: CF = 2 BE. Two copies of BE fill CF.
        K = mid(C, F)
        u1, u2 = unit.copy(), unit.copy()
        self.play(self.slide(u1, B, C), run_time=1.3)
        self.play(self.slide(u2, B, K), run_time=1.3)
        self.hold()

        # Mid-point theorem in △DBG: BG = 2 CF. Two copies of CF fill BG: four lengths of BE.
        H = mid(B, G)
        w1, w2 = VGroup(u1, u2).copy(), VGroup(u1, u2).copy()
        self.play(self.slide(w1, C, B), run_time=1.5)
        self.play(self.slide(w2, C, H), run_time=1.5)
        self.hold()

        # BE is one of them, EG is the other three.
        three = VGroup(w1[1], w2[0], w2[1])
        self.play(*self.recolor(AMBER, *three), run_time=0.8)
        up = (0.474, -0.88)

        def above(t, off):
            p = along(B, G, t)
            return (p[0] + up[0] * off, p[1] + up[1] * off)

        one = self.value("1", above(0.125, 7.5), PURPLE, 8, BOLD)
        counts = [self.value(str(i + 1), above(0.375 + 0.25 * i, 7.5), AMBER, 8, BOLD) for i in range(3)]
        self.play(FadeIn(one), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(c) for c in counts], lag_ratio=0.6), run_time=1.6)
        self.hold()
        self.badge("BE : EG = 1 : 3", (548.0, 614.0), 9, it=("BE", "EG"))
        self.hold(2.5)


class Q20(Guide):
    """Right-angled △LMN; A, B, C the mid-points of MN, LM and NL. Prove ABCN is a rectangle."""

    PAGE = 8
    REGION = (338.33, 491.0, 631.67, 656.0)

    def construct(self):
        M, N, L = (431.5, 510.3), (431.5, 634.4), (543.6, 634.4)
        A, B, C = mid(M, N), mid(M, L), mid(N, L)
        s = {k: self.seg(*v) for k, v in {
            "MA": (M, A), "AN": (A, N), "MB": (M, B), "BL": (B, L), "NC": (N, C), "CL": (C, L), "AB": (A, B), "BC": (B, C),
        }.items()}
        t = {"MA": self.given(M, A, 1, 3.6), "AN": self.given(A, N, 1, 3.6), "MB": self.given(M, B, 2, 3.6),
             "BL": self.given(B, L, 2, 3.6), "NC": self.given(N, C, 3, 3.6), "CL": self.given(C, L, 3, 3.6)}
        r_n = self.right_mark(N, M, L, 10)
        names = {k: self.letter(k, p, 11) for k, p in {
            "M": (431.5, 503.5), "A": (419.7, 574.5), "N": (419.6, 635.7), "B": (495.2, 567.2), "C": (486.4, 643.3),
            "L": (551.2, 637.0),
        }.items()}
        self.add(*s.values(), *t.values(), r_n, *names.values())
        self.hold(1.0)

        # To prove: ABCN is a rectangle.
        goal = self.path(A, B, C, N, color=RED, width=2.4, closed=True).set_stroke(opacity=0.6)
        q = self.value("?", mid(A, C), RED, 11, BOLD)
        self.play(Create(goal), FadeIn(q), run_time=1.2)
        self.blink(q)
        self.hold()
        self.play(FadeOut(VGroup(goal, q)), run_time=0.5)

        # In △MNL.
        tri = self.tint(M, N, L, color=AMBER, opacity=0.1)
        self.play(FadeIn(tri), run_time=0.7)

        # A is the mid-point of MN: MA = AN.
        a_sides = VGroup(self.mark(M, A, PINK), self.mark(A, N, PINK))
        self.play(Create(a_sides), *self.recolor(PINK, t["MA"], t["AN"]), run_time=1.0)
        self.hold(0.8)

        # B is the mid-point of ML: MB = BL.
        b_sides = VGroup(self.mark(M, B, BLUE), self.mark(B, L, BLUE))
        self.play(Create(b_sides), *self.recolor(BLUE, t["MB"], t["BL"]), run_time=1.0)
        self.hold()

        # Mid-point theorem: AB // NL. AB slides down along AN and lies on NL.
        ab = self.mark(A, B, PURPLE)
        self.play(Create(ab), run_time=0.8)
        moved = ab.copy()
        self.play(self.slide(moved, A, N), run_time=1.6)
        par1 = VGroup(self.chevrons(A, B, 1, PURPLE, 5, 0.5), self.chevrons(N, L, 1, PURPLE, 5, 0.38))
        self.play(FadeIn(par1), FadeOut(moved), run_time=0.7)
        self.hold()

        # C is the mid-point of NL: LC = CN. With MB = BL, the mid-point theorem gives BC // MN.
        self.play(FadeOut(a_sides), run_time=0.5)
        c_sides = VGroup(self.mark(N, C, GREEN), self.mark(C, L, GREEN))
        self.play(Create(c_sides), *self.recolor(GREEN, t["NC"], t["CL"]), run_time=1.0)
        self.hold(0.8)
        bc = self.mark(B, C, TEAL)
        self.play(Create(bc), run_time=0.8)
        moved = bc.copy()
        self.play(self.slide(moved, C, N), run_time=1.6)
        par2 = VGroup(self.chevrons(C, B, 2, TEAL, 5, 0.5), self.chevrons(N, A, 2, TEAL, 5, 0.3))
        self.play(FadeIn(par2), FadeOut(moved), run_time=0.7)
        self.hold()

        # AB // NC and BC // AN: ABCN is a parallelogram.
        self.play(FadeOut(VGroup(tri, b_sides, c_sides)), run_time=0.6)
        pgram = self.tint(A, B, C, N, color=PURPLE, opacity=0.14)
        self.play(FadeIn(pgram), Create(self.mark(N, C, PURPLE)), Create(self.mark(N, A, TEAL)), run_time=1.0)
        self.hold()

        # ∠ANC = 90°, given: a parallelogram with a right angle is a rectangle.
        self.play(r_n.animate.set_color(RED), run_time=0.5)
        self.play(Indicate(r_n, color=RED, scale_factor=1.5), run_time=0.8)
        corners = VGroup(self.right_mark(A, N, B, 7, RED), self.right_mark(B, A, C, 7, RED), self.right_mark(C, B, N, 7, RED))
        self.play(LaggedStart(*[Create(c) for c in corners], lag_ratio=0.4), run_time=1.4)
        self.hold(0.8)
        self.badge("ABCN is a rectangle", (565.0, 548.0), 9, it=("ABCN",))
        self.hold(2.5)
