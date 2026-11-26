"""Solution guides for JM30 (C), made as guided class slides like JM30 JM31 Intensive.

Each click is one reasoning move. A probability is built as on the board: the
whole sample space is outlined and joined to the denominator, the favourable
outcomes light up one at a time beside a running count, the count drops into
the numerator, then the fraction is simplified. An expected value is built one
term at a time, each value and its probability carried down from where they
were found, and the answer is double underlined. A "favourable?" part compares
the expected value with the cost.
"""

import numpy as np
from manim import (
    BOLD, DEGREES, DOWN, LEFT, UP, AnnularSector, Circle, Create, Dot, Ellipse, FadeIn, FadeOut, LaggedStart, Line,
    Polygon, ReplacementTransform, TransformFromCopy, VGroup, GrowArrow, there_and_back,
)

from jm3031_slides import (
    BG, BLUE, CELL, EDGE, FAINT, GOLD, GREEN, MINUS, MUTED, ORANGE, PANEL, PINK, RED, TINT, TXT, VIOLET, WIRE, Z_BOX,
    Guided, binary,
)


def _rgb(h):
    return np.array([int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)])


# The slide palette (dark) and what each colour becomes on the white page.
LIGHT = {
    BG: "#ffffff", PANEL: "#eef2f7", CELL: "#f8fafc", EDGE: "#cbd5e1", WIRE: "#94a3b8", TXT: "#1e293b",
    MUTED: "#64748b", FAINT: "#c4ccd6", BLUE: "#2563eb", PINK: "#db2777", GOLD: "#d97706", GREEN: "#16a34a",
    RED: "#dc2626", VIOLET: "#7c3aed", ORANGE: "#ea580c",
    TINT[GREEN]: "#dcfce7", TINT[RED]: "#fee2e2", TINT[GOLD]: "#fef3c7", TINT[BLUE]: "#dbeafe",
    TINT[PINK]: "#fce7f3", TINT[VIOLET]: "#ede9fe", TINT[ORANGE]: "#ffedd5", "#cbd5e1": "#a3afbf",
}
_SRC = np.array([_rgb(k) for k in LIGHT])
_DST = np.array([_rgb(v) for v in LIGHT.values()])
_I, _J = np.triu_indices(len(_SRC), 1)
_SEG = _SRC[_J] - _SRC[_I]
_LEN = np.maximum((_SEG ** 2).sum(1), 1e-12)
_SEEN = {}


def _light(c):
    """A palette colour, or a blend of two that an animation passes through, becomes the same blend of their
    light versions. Any other colour is left as it is."""
    key = tuple(np.round(c, 3))
    if key not in _SEEN:
        t = np.clip(((c - _SRC[_I]) * _SEG).sum(1) / _LEN, 0, 1)
        miss = np.linalg.norm(_SRC[_I] + t[:, None] * _SEG - c, axis=1)
        k = int(np.argmin(miss))
        _SEEN[key] = (_DST[_I[k]] + t[k] * (_DST[_J[k]] - _DST[_I[k]])) if miss[k] < 0.02 else c
    return _SEEN[key]


def _relight(rgbas):
    out = np.array(rgbas, dtype=float, copy=True)
    for row in out:
        row[:3] = _light(row[:3])
    return out


class Guide(Guided):
    """Drawn in the slide palette and shown on a white page: every colour is mapped as the frame is drawn."""

    def setup(self):
        super().setup()
        self.camera.background_color = "#ffffff"
        cam = self.camera
        fill, stroke = cam.get_fill_rgbas, cam.get_stroke_rgbas
        cam.get_fill_rgbas = lambda vm: _relight(fill(vm))
        cam.get_stroke_rgbas = lambda vm, background=False: _relight(stroke(vm, background))

    def die(self, n, p, s=44):
        """A white face with dark spots (the slides' die has spots in the page colour)."""
        g = VGroup(self.box(p, s, s, BG, WIRE, r=8, width=1.6))
        q = s * 0.27
        spots = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
                 5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}[n]
        for a, b in spots:
            g.add(Dot(self.P(p[0] + a * q, p[1] + b * q), radius=s * 0.085 * self.k, color=TXT).set_z_index(-2))
        return g

    def header(self):
        before = set(map(id, self.mobjects))
        super().header()
        self._header = [m for m in self.mobjects if id(m) not in before]

    def clear(self, *keep, rt=0.5):
        """Fade everything but the question, the caption bar and `keep`. An animated part of a kept group
        becomes a mobject of its own in the scene, so the whole family of each kept mobject is kept."""
        ids = {id(f) for m in [*self._header, self.bar, self.cap, *keep] for f in m.get_family()}

        def drop(m):
            if id(m) in ids:
                return []
            if any(id(f) in ids for f in m.get_family()[1:]):
                return [g for s in m.submobjects for g in drop(s)]
            return [m]

        gone = [g for m in self.mobjects for g in drop(m)]
        if gone:
            self.play(*[FadeOut(m) for m in gone], run_time=rt)
        self.scratch = []

    def simplify(self, F):
        """The simplified fraction, not yet an answer, so no underline."""
        self.play(FadeIn(F["rest"], shift=LEFT * 0.15), run_time=0.8)

    def carry(self, src, F, color):
        """An arrow from a count to the numerator, and the count drops into the place of the "?"."""
        arrow = self.join(src, F["num"], color)
        self.play(GrowArrow(arrow), run_time=0.6)
        self.play(FadeOut(F["q"]), TransformFromCopy(src, F["num"]), run_time=0.9)
        return arrow

    def lit(self, mob, color):
        """A shape tinted for a moment, in place."""
        return mob.animate(rate_func=there_and_back).set_fill(TINT[color], 1).set_stroke(color, self.w(3))

    def outline(self, mob):
        """A shape's outline flashes white for a moment; its words do not move or grow."""
        return mob.animate(rate_func=there_and_back).set_stroke(TXT, self.w(5))

    def under(self, items, x, y, size):
        """A row of working that starts at page x."""
        return self.lefted(self.eq(items, (0, y), size), x)

    def underline(self, mob):
        u = self.double(mob)
        self.play(Create(u), run_time=0.6)
        return u

    def verdict(self, lines, big, words, color, x, y0=270):
        """A "favourable?" part: the two amounts, the inequality, then (returned, shown on the next click) the conclusion."""
        rows = [self.text(s, (x, y0 + 50 * i), 30) for i, s in enumerate(lines)]
        self.jot(*rows, rt=0.6)
        self.jot(self.eq(big, (x, y0 + 50 * len(lines) + 70), 56, colors={0: color}), rt=0.7)
        return self.label("dot", color, words, (x, y0 + 50 * len(lines) + 170), 30)


# ======================= Q20: two dice, both prime =======================


class Q20(Guide):
    Q = "Q20"
    PAGE = 8
    ASK = ("A player throws 2 dice once. $80 is awarded if the 2 numbers are both prime;",
           "there is no reward otherwise. (a) Find the expected value of rewards Nelson gets.",
           "(b) Nelson pays $10 to play once. Is the game favourable to him?")

    def construct(self):
        self.header()
        self.step("Two dice: the row is the 1st dice and the column is the 2nd dice.")
        nums = [str(i) for i in range(1, 7)]
        head = lambda lab, p, w, h: VGroup(self.box(p, w, h, PANEL, EDGE, r=8), self.die(int(lab), p, 44))
        T = self.table(nums, nums, 104, 182, 68, 64, lambda i, j: f"{i + 1}, {j + 1}", size=24, head=head,
                       ink=lambda i, j, s, p: self.duo(str(i + 1), str(j + 1), p, 24, ", "),
                       row_title="1st dice", col_title="2nd dice")
        self.add(T["frame"], T["titles"])
        self.beat()

        self.step("Fill the table: the 1st number in blue, the 2nd number in pink.")
        self.fill(T, key=lambda ij: ij[0] + ij[1], rt=2.0)
        self.beat()

        x = 940
        F = self.fraction("P(both prime)", 9, 36, (x, 420), 44, simple=(1, 4))
        self.step("Count every outcome: 6 × 6 = 36. 36 is the denominator.")
        boxes = [b for b, _ in T["cells"].values()]
        total = self.at_x(self.text("6 × 6 = 36 outcomes", (0, 545), 28, BLUE), F["x"])
        den = self.den_click(F, total, LaggedStart(*[b.animate.set_stroke(BLUE, self.w(1.6)) for b in boxes], lag_ratio=0.02),
                             Create(self.ring(boxes, pad=6)))
        self.beat()

        self.step("The prime numbers on a dice are 2, 3 and 5.")
        primes = (1, 2, 4)
        heads = [T["frame"][k][0] for k in primes] + [T["frame"][6 + k][0] for k in primes]
        self.play(*[h.animate.set_stroke(GOLD, self.w(3.2)) for h in heads],
                  FadeIn(self.label("outline", GOLD, "prime numbers: 2, 3 and 5", (x, 200))), run_time=0.8)
        self.beat()

        self.step("Light up each outcome where both numbers are prime, and count them.")
        C = self.counter("cell", GOLD, "both prime:", F["x"], 300)
        self.show(C["lab"], C["num"], rt=0.5)
        hit = [(i, j) for i in primes for j in primes]
        for k in hit:
            self.tick(C, *self.paint(T, [k], GOLD), rt=0.45)
        self.play(*self.mute(T, [k for k in T["cells"] if k not in hit]), run_time=0.5)
        self.beat()

        self.step("9 outcomes have both numbers prime. 9 is the numerator.")
        num = self.num_click(F, C)
        self.beat()

        self.step("Simplify: P(both prime) = 9/36 = 1/4.")
        self.simplify(F)
        self.beat()

        self.step("(a) Other outcomes give no reward. Expected value of rewards = $80 × 1/4.")
        E = self.eq(["Expected value", "=", "$80", "×", (1, 4), "=", "$20"], (x, 560), 40)
        self.play(*[FadeOut(m) for m in (total, den, num, C["lab"], C["num"])], run_time=0.4)
        self.play(FadeIn(VGroup(*E[:4])), TransformFromCopy(F["rest"][1], E[4]), run_time=1.0)
        self.beat()

        self.step("$80 × 1/4 = $20. That answers (a).")
        self.play(FadeIn(VGroup(E[5], E[6]), shift=LEFT * 0.15), run_time=0.7)
        self.underline(E[6])
        self.beat()

        self.step("(b) Compare the expected reward with the cost of one game: $20 > $10.")
        self.clear(T["frame"], T["titles"], *[t for _, t in T["cells"].values()])
        end = self.verdict(["Expected value of rewards:  $20", "Cost of one game:  $10"], ["$20", ">", "$10"],
                           "The game is favourable to him.", GREEN, x)
        self.beat()

        self.step("The expected reward is more than the cost, so the game is favourable to Nelson.")
        self.play(FadeIn(end), run_time=0.6)
        self.wait(2.5)


# ======================= Q23: two balls, four slots =======================


class Q23(Guide):
    Q = "Q23"
    PAGE = 11
    ASK = ("Two balls fall at random into slots A, B, C and D. Same slot: $30 coupon; two",
           "adjacent slots: $20 coupon; otherwise none. (a) List the outcomes in a table.",
           "(b) Find P($20 coupon). (c) Find the expected award. (d) Fee $20: favourable?")

    L = "ABCD"

    def slots(self, x0, top, w, h):
        lines = VGroup(*[Line(self.P(x0 + w * i, top), self.P(x0 + w * i, top + h), color=TXT, stroke_width=self.w(2.4))
                         for i in range(5)])
        lines.add(Line(self.P(x0, top + h), self.P(x0 + 4 * w, top + h), color=TXT, stroke_width=self.w(2.4)))
        inside = [self.box((x0 + w * (i + 0.5), top + h / 2), w - 8, h - 6, BG, BG, r=4, width=0.5) for i in range(4)]
        names = VGroup(*[self.text(ch, (x0 + w * (i + 0.5), top + h + 24), 26, TXT) for i, ch in enumerate(self.L)])
        return lines, inside, names

    def award_cell(self, j, p):
        if j == 1:
            return self.frac(3, 8, p, 26)
        n, d, a, b = {0: (4, 16, 1, 4), 2: (6, 16, 3, 8)}[j]
        return self.row([self.frac(n, d, (0, 0), 26), self.text("=", (0, 0), 24), self.frac(a, b, (0, 0), 26)], p, 10)

    def construct(self):
        self.header()
        x0, top, w, h = 880, 172, 76, 96
        lines, inside, names = self.slots(x0, top, w, h)
        self.add(*inside, lines, names)
        self.step("Each ball falls into slot A, B, C or D. Here: 1st ball in A, 2nd ball in C, outcome AC.")
        drops = []
        for i in (0, 2):
            cx = x0 + w * (i + 0.5)
            b = self.ball((cx, top - 30), 22, "#cbd5e1")
            self.play(FadeIn(b), run_time=0.3)
            self.play(b.animate.move_to(self.P(cx, top + h - 25)), run_time=0.6)
            drops.append(b)
        self.beat()

        self.step("(a) 1st ball: the row. 2nd ball: the column. Fill all 4 × 4 = 16 outcomes.")
        L = self.L
        T = self.table(list(L), list(L), 110, 196, 104, 86, lambda i, j: L[i] + L[j], hw=70, hh=60, size=34,
                       ink=lambda i, j, s, p: self.duo(L[i], L[j], p, 34), row_title="1st ball", col_title="2nd ball")
        self.play(*[FadeOut(b) for b in drops], FadeIn(T["frame"]), FadeIn(T["titles"]), run_time=0.7)
        self.fill(T)
        self.beat()

        cells = list(T["cells"])
        boxes = [T["cells"][k][0] for k in cells]
        x = 945
        F = self.fraction("P($20 coupon)", 6, 16, (x, 455), 44, simple=(3, 8))
        self.step("(b) Count every outcome: 4 × 4 = 16. 16 is the denominator.")
        space = self.ring(boxes, pad=6)
        total = self.at_x(self.text("4 × 4 = 16 outcomes", (0, 575), 28, BLUE), F["x"])
        den = self.den_click(F, total, LaggedStart(*[b.animate.set_stroke(BLUE, self.w(2.2)) for b in boxes], lag_ratio=0.05),
                             Create(space))
        self.beat()

        self.step("Light up each pair of slots next to each other, and count them.")
        C = self.counter("cell", GOLD, "adjacent slots:", F["x"], 345)
        self.show(C["lab"], C["num"], rt=0.5)
        adj = [(0, 1), (1, 0), (1, 2), (2, 1), (2, 3), (3, 2)]
        for i, j in adj:
            self.tick(C, *self.paint(T, [(i, j)], GOLD), self.lit(inside[i], GOLD), self.lit(inside[j], GOLD), rt=0.8)
        self.beat()

        self.step("6 outcomes are in adjacent slots. 6 is the numerator.")
        num = self.num_click(F, C)
        self.beat()

        self.step("Simplify: 6/16 = 3/8. That answers (b).")
        u = self.settle(F)
        self.beat()

        # (c)
        same = [(i, i) for i in range(4)]
        rest = [k for k in cells if k not in same and k not in adj]
        A = self.table(["Probability"], ["$30", "$20", "$0"], 640, 334, 150, 84, lambda i, j: "", hw=150, hh=50, size=26,
                       ink=lambda i, j, s, p: self.award_cell(j, p))
        for j, c in enumerate((GREEN, GOLD, MUTED)):
            A["frame"][j][1].set_color(c)
        self.step("(c) Two balls in the same slot get $30: AA, BB, CC and DD. Light them up and count.")
        self.play(*[FadeOut(m) for m in (F["row"], u, total, den, num, C["lab"], C["num"], space)],
                  *[b.animate.set_stroke(EDGE, self.w(1.6)) for k, (b, _) in T["cells"].items() if k not in adj], run_time=0.5)
        self.play(FadeIn(A["frame"]), run_time=0.5)
        C = self.counter("cell", GREEN, "same slot:", x, 520)
        self.show(C["lab"], C["num"], rt=0.4)
        for i, j in same:
            self.tick(C, *self.paint(T, [(i, j)], GREEN), self.lit(inside[i], GREEN), rt=0.7)
        self.beat()

        self.step("4 of the 16 outcomes give $30: P($30 coupon) = 4/16 = 1/4.")
        self.play(FadeIn(A["cells"][(0, 0)][1]), run_time=0.7)
        self.beat()

        self.step("From (b), the 6 adjacent outcomes give $20: P($20 coupon) = 3/8.")
        self.play(*[T["cells"][k][0].animate(rate_func=there_and_back).set_stroke(TXT, self.w(4)) for k in adj], run_time=0.9)
        self.play(FadeIn(A["cells"][(0, 1)][1]), run_time=0.6)
        self.beat()

        self.step(f"The other 16 {MINUS} 4 {MINUS} 6 = 6 outcomes give no coupon: P(no coupon) = 6/16 = 3/8.")
        self.play(FadeOut(C["lab"]), FadeOut(C["num"]), *self.mute(T, rest), run_time=0.6)
        self.play(FadeIn(A["cells"][(0, 2)][1]), run_time=0.7)
        self.beat()

        E = self.eq(["Expected value", "=", "$30", "×", (1, 4), "+", "$20", "×", (3, 8), "+", "$0", "×", (3, 8)],
                    (x, 520), 30, colors={2: GREEN, 6: GOLD, 10: MUTED})
        terms = [(2, 3, 4), (5, 6, 7, 8), (9, 10, 11, 12)]
        says = ["Expected value: the $30 coupon × its probability 1/4.",
                "Add the $20 coupon × its probability 3/8.",
                "Add $0 × its probability 3/8, for no coupon."]
        for j, (idx, say) in enumerate(zip(terms, says)):
            self.step(say)
            lead = [FadeIn(E[0]), FadeIn(E[1])] if j == 0 else [FadeIn(E[idx[0]])]
            frac = A["cells"][(0, j)][1]
            frac = frac if j == 1 else frac[2]
            self.play(*lead, TransformFromCopy(A["frame"][j][1], E[idx[-3]]), FadeIn(E[idx[-2]]),
                      TransformFromCopy(frac, E[idx[-1]]), run_time=1.0)
            self.beat()

        self.step("Work it out: 7.5 + 7.5 + 0 = 15. The expected value is $15. That answers (c).")
        R = self.under(["=", "$15"], self.pt(E[1].get_left())[0], 596, 34)
        self.play(FadeIn(R, shift=LEFT * 0.15), run_time=0.7)
        self.underline(R[1])
        self.beat()

        self.step("(d) Compare the expected award with the entry fee: $15 < $20.")
        self.clear(*inside, lines, names, T["frame"], T["titles"], *[t for _, t in T["cells"].values()])
        end = self.verdict(["Expected value of the award:  $15", "Entry fee:  $20"], ["$15", "<", "$20"],
                           "The game is not favourable to her.", RED, x, y0=340)
        self.beat()

        self.step("The expected award is less than the fee, so the game is not favourable to Kristy.")
        self.play(FadeIn(end), run_time=0.6)
        self.wait(2.5)


# ======================= Q16: the lucky wheel =======================


class Q16(Guide):
    Q = "Q16"
    PAGE = 6
    ASK = ("A lucky wheel stops at 20 points, 10 points or 5 points with probabilities in the",
           "ratio 2 : 5 : 8. (a) Rita spins it 10 times: how many times do you expect ‘20 points’?",
           "(b) Find P(‘10 points’) in one spin. (c) Find the expected points in one spin.")
    ASK_RIGHT = 1250

    # (points, start clockwise from the pointer, sweep, colour)
    SECTORS = [("10", 294, 120, PINK), ("20", 54, 48, ORANGE), ("5", 102, 192, VIOLET)]

    def wheel(self, c, r):
        parts = {}
        for pts, start, sweep, color in self.SECTORS:
            s = AnnularSector(inner_radius=0, outer_radius=r * self.k, angle=-sweep * DEGREES,
                              start_angle=(90 - start) * DEGREES, arc_center=self.P(*c),
                              fill_color=TINT[color], fill_opacity=1, stroke_color=color, stroke_width=self.w(2.4))
            mid = np.radians(start + sweep / 2)
            reach = 0.64 if sweep < 60 else 0.55
            p = (c[0] + r * reach * np.sin(mid), c[1] - r * reach * np.cos(mid))
            words = VGroup(self.text(pts, (p[0], p[1] - 14), 34, color, BOLD), self.text("points", (p[0], p[1] + 20), 20, TXT))
            parts[pts] = VGroup(s.set_z_index(Z_BOX), words)
        tip = Polygon(self.P(c[0] - 12, c[1] - r - 22), self.P(c[0] + 12, c[1] - r - 22), self.P(c[0], c[1] - r - 2),
                      color=TXT, fill_color=TXT, fill_opacity=1, stroke_width=self.w(1)).set_z_index(2)
        return parts, tip

    def construct(self):
        self.header()
        c, r = (250, 420), 160
        parts, tip = self.wheel(c, r)
        self.step("The pointer stops in one of three sectors, with probabilities in the ratio 2 : 5 : 8.")
        self.play(LaggedStart(*[FadeIn(parts[k], scale=0.9) for k in ("10", "20", "5")], lag_ratio=0.25), FadeIn(tip),
                  run_time=1.2)
        order = [("20", ORANGE, 2, 690), ("10", PINK, 5, 880), ("5", VIOLET, 8, 1070)]
        names = {k: self.text(f"{k} points", (x, 200), 26, col) for k, col, _, x in order}
        ratio = {k: self.text(str(n), (x, 252), 44, col, BOLD) for k, col, n, x in order}
        colons = VGroup(self.text(":", (785, 252), 44), self.text(":", (975, 252), 44))
        self.play(LaggedStart(*[FadeIn(VGroup(names[k], ratio[k])) for k, *_ in order], lag_ratio=0.3), FadeIn(colons),
                  run_time=1.0)
        self.beat()

        # (a)
        x = 880
        F = self.fraction("P(20 points)", 2, 15, (x, 430), 44, ncol=ORANGE)
        self.step("(a) Add the parts of the ratio: 2 + 5 + 8 = 15 parts. 15 is the denominator.")
        total = self.at_x(self.text("2 + 5 + 8 = 15 parts", (0, 556), 28, BLUE), F["x"])
        whole = Circle(radius=(r + 7) * self.k, color=BLUE, stroke_width=self.w(2.6)).move_to(self.P(*c)).set_z_index(-2)
        den = self.den_click(F, total, Create(whole),
                             *[m.animate(rate_func=there_and_back).set_color(BLUE) for m in ratio.values()])
        self.beat()

        self.step("‘20 points’ is 2 of the 15 parts. 2 is the numerator.")
        self.play(self.outline(parts["20"][0]), run_time=0.8)
        num = self.carry(ratio["20"], F, ORANGE)
        self.beat()

        self.step("Rita spins 10 times. Expected number of times = 10 × P(20 points) = 10 × 2/15.")
        E = self.eq(["Expected number", "=", "10", "×", (2, 15, ORANGE), "=", (4, 3), "times"], (x, 556), 40)
        self.play(FadeOut(total), FadeOut(den), FadeOut(num), run_time=0.4)
        self.play(FadeIn(VGroup(*E[:4])), TransformFromCopy(F["frac"], E[4]), run_time=1.0)
        self.beat()

        self.step("10 × 2/15 = 4/3. Rita can expect ‘20 points’ 4/3 times. That answers (a).")
        self.play(FadeIn(VGroup(*E[5:]), shift=LEFT * 0.15), run_time=0.8)
        self.beat()

        # (b)
        G = self.fraction("P(10 points)", 5, 15, (x, 430), 44, simple=(1, 3), ncol=PINK)
        self.step("(b) ‘10 points’ is 5 of the same 15 parts: P(10 points) = 5/15.")
        self.play(FadeOut(F["row"]), FadeOut(E), run_time=0.4)
        self.play(self.outline(parts["10"][0]), FadeIn(G["name"]), FadeIn(G["eq"]), Create(G["bar"]), FadeIn(G["den"]),
                  TransformFromCopy(ratio["10"], G["num"]), run_time=1.0)
        self.beat()

        self.step("Simplify: 5/15 = 1/3. That answers (b).")
        u = self.settle(G)
        self.beat()

        # (c)
        self.step("(c) Each part of the ratio over the 15 parts gives a probability: 2/15, 1/3 and 8/15.")
        self.play(FadeOut(G["row"]), FadeOut(u), FadeOut(colons), run_time=0.4)
        probs = {"20": self.frac(2, 15, (690, 266), 34, TXT, ORANGE), "10": self.frac(1, 3, (880, 266), 34, TXT, PINK),
                 "5": self.frac(8, 15, (1070, 266), 34, TXT, VIOLET)}
        self.play(*[ReplacementTransform(ratio[k], probs[k]) for k in probs], run_time=1.0)
        self.play(self.outline(parts["5"][0]), run_time=0.8)
        self.beat()

        E = self.eq(["Expected points", "=", "20", "×", (2, 15), "+", "10", "×", (1, 3), "+", "5", "×", (8, 15)],
                    (x, 420), 34, colors={2: ORANGE, 6: PINK, 10: VIOLET})
        terms = [(2, 3, 4), (5, 6, 7, 8), (9, 10, 11, 12)]
        says = ["Expected points: 20 points × its probability 2/15.",
                "Add 10 points × its probability 1/3.",
                "Add 5 points × its probability 8/15."]
        for j, ((k, _, _, _), idx, say) in enumerate(zip(order, terms, says)):
            self.step(say)
            lead = [FadeIn(E[0]), FadeIn(E[1])] if j == 0 else [FadeIn(E[idx[0]])]
            self.play(self.outline(parts[k][0]), *lead, FadeIn(E[idx[-3]]), FadeIn(E[idx[-2]]),
                      TransformFromCopy(probs[k], E[idx[-1]]), run_time=1.0)
            self.beat()

        self.step("Work it out: 40/15 + 50/15 + 40/15 = 130/15 = 26/3. That answers (c).")
        R = self.under(["=", (26, 3)], self.pt(E[1].get_left())[0], 540, 40)
        self.play(FadeIn(R, shift=LEFT * 0.15), run_time=0.8)
        self.underline(R[1])
        self.wait(2.5)


# ======================= Q22: two tubes =======================


class Q22(Guide):
    Q = "Q22"
    PAGE = 10
    ASK = ("Balls drop one by one, each falling at random into tube A or tube B. Option I: 2 balls;",
           "same tube 10 tokens, otherwise 5. Option II: 3 balls; same tube 13 tokens, otherwise 5.",
           "(a) Find the expected number of tokens for each option. (b) Which option is better?")
    ASK_RIGHT = 1250
    HUE = {"A": VIOLET, "B": PINK}

    def tubes(self, xs, top, h, w):
        g = VGroup()
        for x, name in zip(xs, "AB"):
            g.add(self.box((x, top + h / 2), w, h, CELL, WIRE, r=10, width=2.2))
            g.add(Ellipse(width=w * self.k, height=16 * self.k).set_fill(PANEL, 1).set_stroke(WIRE, self.w(2.2))
                  .move_to(self.P(x, top)).set_z_index(-2))
            g.add(self.text(name, (x, top + h + 28), 30, self.HUE[name], BOLD))
        return g

    def option(self, depth, xs, top, bottom, heads, r, size, out_x, out_size):
        return self.tree(binary("A", "B", depth), xs, top, bottom, lambda s, d: self.HUE[s], out_x, self.HUE, heads,
                         head_y=180, size=size, r=r, out_size=out_size)

    def same_tube(self, T, n, x, words, simple, diff, fy=360):
        """Count the sample space, light the same-tube paths, then the two probabilities move up and stay."""
        F = self.fraction("P(same tube)", 2, n, (x, fy), 40, simple=(1, simple))
        marks = [self.leaf_mark(T, leaf) for leaf in T["leaves"]]
        self.step(f"Count every path: {words} = {n} outcomes. {n} is the denominator.")
        total = self.at_x(self.text(f"{words} = {n} outcomes", (0, fy + 120), 28, BLUE), F["x"])
        den = self.den_click(F, total, LaggedStart(*[FadeIn(m) for m in marks], lag_ratio=0.1))
        self.beat()

        same = [i for i, leaf in enumerate(T["leaves"]) if len(set(leaf["word"])) == 1]
        self.step("Light up each path where every ball falls into the same tube, and count them.")
        C = self.counter("path", GOLD, "same tube:", F["x"], fy - 110)
        self.play(*self.dim_tree(T), FadeIn(C["lab"]), FadeIn(C["num"]), run_time=0.7)
        for i in same:
            anims, _ = self.trace(T, i)
            self.tick(C, *anims, rt=0.7)
        self.beat()

        a, b = (T["leaves"][i]["word"] for i in same)
        self.step(f"2 paths, {a} and {b}, have every ball in the same tube. 2 is the numerator.")
        num = self.num_click(F, C)
        self.beat()

        self.step(f"Simplify: 2/{n} = 1/{simple}.")
        self.simplify(F)
        self.beat()

        d, p, q = diff
        G = self.fraction("P(different tubes)", d, n, (x, 330), 40, simple=(p, q))
        self.step(f"The other {d} outcomes are in different tubes: P(different tubes) = {d}/{n} = {p}/{q}.")
        self.play(*[FadeOut(m) for m in (total, den, num, C["lab"], C["num"], *marks)],
                  F["row"].animate.shift(UP * (fy - 250) * self.k), run_time=0.6)
        self.play(FadeIn(G["row"]), run_time=0.7)
        self.beat()
        return F, G

    def tokens(self, F, G, win, ps, pd, value, x0, say, done):
        """Expected tokens = win × P(same tube) + 5 × P(different tubes), then its value."""
        head = self.text("Expected number of tokens", (x0, 430), 30, MUTED, left=True)
        E = self.under(["=", str(win), "×", ps, "+", "5", "×", pd], x0, 505, 36)
        self.step(say)
        self.play(FadeIn(head), FadeIn(VGroup(E[0], E[1], E[2])), TransformFromCopy(F["rest"][1], E[3]), FadeIn(E[4]),
                  FadeIn(VGroup(E[5], E[6])), TransformFromCopy(G["rest"][1], E[7]), run_time=1.2)
        self.beat()
        self.step(done)
        R = self.under(["=", value], x0, 585, 36)
        self.play(FadeIn(R, shift=LEFT * 0.15), run_time=0.7)
        self.underline(R[1])
        self.beat()

    def construct(self):
        self.header()
        pic = self.tubes((110, 182), 262, 190, 72)
        self.add(pic)
        self.step("Each ball falls into tube A or tube B, at random.")
        drops = []
        for x in (110, 182):
            b = self.ball((x, 222), 22, "#cbd5e1")
            self.play(FadeIn(b), run_time=0.3)
            self.play(b.animate.move_to(self.P(x, 262 + 190 - 28)), run_time=0.6)
            drops.append(b)
        self.beat()

        # (a)(i)
        T = self.option(2, (270, 380, 490), 250, 560, [("1st ball", 380), ("2nd ball", 490), ("Outcome", 600)], 21, 28, 560, 30)
        self.step("(a)(i) Option I drops 2 balls. Tree: the 1st ball A or B, then the 2nd ball A or B.")
        self.play(*[FadeOut(b) for b in drops], FadeIn(T["heads"]), run_time=0.4)
        self.grow(T)
        self.beat()
        F, G = self.same_tube(T, 4, 975, "2 × 2", 2, (2, 1, 2))
        self.tokens(F, G, 10, (1, 2), (1, 2), "7.5", 700,
                    "Expected tokens = 10 tokens × P(same tube) + 5 tokens × P(different tubes).",
                    "Work it out: 5 + 2.5 = 7.5 tokens for option I.")

        # (a)(ii)
        T = self.option(3, (270, 365, 460, 555), 228, 612,
                        [("1st ball", 365), ("2nd ball", 460), ("3rd ball", 555), ("Outcome", 650)], 18, 24, 605, 26)
        self.step("(a)(ii) Option II drops 3 balls, so the tree has a 3rd stage: 2 × 2 × 2 = 8 paths.")
        self.clear(pic)
        self.play(FadeIn(T["heads"]), run_time=0.3)
        self.grow(T, rt=0.6)
        self.beat()
        F, G = self.same_tube(T, 8, 990, "2 × 2 × 2", 4, (6, 3, 4))
        self.tokens(F, G, 13, (1, 4), (3, 4), "7", 715,
                    "Expected tokens = 13 tokens × P(same tube) + 5 tokens × P(different tubes).",
                    "Work it out: 3.25 + 3.75 = 7 tokens for option II.")

        # (b)
        self.step("(b) The costs are the same. Compare the expected numbers of tokens: 7.5 > 7.")
        self.clear(pic)
        end = self.verdict(["Option I:  7.5 tokens", "Option II:  7 tokens"], ["7.5", ">", "7"],
                           "The player should adopt option I.", GREEN, 760)
        self.beat()

        self.step("Option I gives more tokens on average, so the player should adopt option I.")
        self.play(FadeIn(end), run_time=0.6)
        self.wait(2.5)


# ======================= Q7: a bag of coins =======================


class Q7(Guide):
    Q = "Q7"
    PAGE = 3
    ASK = ("A bag contains four $2 coins, two $5 coins and three $10 coins. A coin is drawn",
           "at random. (a) Complete the table of the probability of each coin drawn.",
           "(b) Find the expected value of the coin drawn.")

    KINDS = [("$2", 4, "#3b82f6"), ("$5", 2, "#ec4899"), ("$10", 3, "#f59e0b")]

    def cell(self, j, p):
        """A probability cell: the count in gold over the 9 coins in blue."""
        if j == 2:
            f = self.frac(3, 9, (0, 0), 28, TXT, GOLD)
            f[2].set_color(BLUE)
            return self.row([f, self.text("=", (0, 0), 26), self.frac(1, 3, (0, 0), 28)], p, 12)
        f = self.frac((4, 2)[j], 9, p, 28, TXT, GOLD)
        f[2].set_color(BLUE)
        return f

    def construct(self):
        self.header()
        y, step, gap, rad = 262, 72, 44, 30
        x = 640 - (8 * step + 2 * gap) / 2
        groups, spans = [], []
        for name, n, fill in self.KINDS:
            xs = [x + step * i for i in range(n)]
            x = xs[-1] + step + gap
            groups.append(VGroup(*[self.coin(name, (cx, y), fill, r=rad, size=20) for cx in xs]))
            spans.append((xs[0], xs[-1]))

        T = self.table(["Probability"], [k[0] for k in self.KINDS], 300, 350, 170, 90, lambda i, j: "", hw=200, hh=60,
                       size=28, ink=lambda i, j, s, p: self.cell(j, p))
        for j, (_, _, fill) in enumerate(self.KINDS):
            T["frame"][j][1].set_color(fill)
        corner = self.text("Coin drawn", (400, 380), 26, MUTED)
        self.step("The bag holds four $2 coins, two $5 coins and three $10 coins.")
        self.play(LaggedStart(*[FadeIn(g, shift=DOWN * 0.2) for g in groups], lag_ratio=0.3), FadeIn(T["frame"]), FadeIn(corner),
                  run_time=1.2)
        self.beat()

        self.step("Count every coin: 4 + 2 + 3 = 9 coins. Each coin is equally likely to be drawn.")
        over = self.bracket(spans[0][0] - rad, spans[-1][1] + rad, y - rad - 14, over=True, color=BLUE)
        total = self.text("4 + 2 + 3 = 9 coins", (640, y - rad - 46), 28, BLUE)
        self.play(Create(over), FadeIn(total), run_time=0.7)
        self.beat()

        says = ["(a) 4 of the 9 coins are $2 coins: P($2) = 4/9.",
                "2 of the 9 coins are $5 coins: P($5) = 2/9.",
                "3 of the 9 coins are $10 coins: P($10) = 3/9 = 1/3."]
        for j, ((name, n, fill), say) in enumerate(zip(self.KINDS, says)):
            self.step(say)
            mid = (spans[j][0] + spans[j][1]) / 2
            under = self.bracket(spans[j][0] - rad, spans[j][1] + rad, y + rad + 12, over=False, color=GOLD)
            count = self.text(f"{n} coins", (mid, y + rad + 40), 26, GOLD)
            self.play(*[g.animate.set_opacity(1 if i == j else 0.25) for i, g in enumerate(groups)], Create(under), FadeIn(count),
                      run_time=0.7)
            self.play(FadeIn(T["cells"][(0, j)][1], scale=0.7), total.animate(rate_func=there_and_back).set_color(TXT), run_time=0.8)
            self.beat()
            self.play(FadeOut(under), FadeOut(count), run_time=0.3)

        E = self.eq(["Expected value", "=", "$2", "×", (4, 9), "+", "$5", "×", (2, 9), "+", "$10", "×", (1, 3)],
                    (640, 560), 34, colors={2: self.KINDS[0][2], 6: self.KINDS[1][2], 10: self.KINDS[2][2]})
        terms = [(2, 3, 4), (5, 6, 7, 8), (9, 10, 11, 12)]
        says = ["(b) Expected value: the $2 coin × its probability 4/9.",
                "Add the $5 coin × its probability 2/9.",
                "Add the $10 coin × its probability 1/3."]
        for j, (idx, say) in enumerate(zip(terms, says)):
            self.step(say)
            lead = [FadeIn(E[0]), FadeIn(E[1])] if j == 0 else [FadeIn(E[idx[0]])]
            frac = T["cells"][(0, j)][1]
            frac = frac[2] if j == 2 else frac
            self.play(*lead, *[g.animate.set_opacity(1 if i == j else 0.25) for i, g in enumerate(groups)],
                      TransformFromCopy(T["frame"][j][1], E[idx[-3]]), FadeIn(E[idx[-2]]), TransformFromCopy(frac, E[idx[-1]]),
                      run_time=1.0)
            self.beat()

        self.step("Work it out: 8/9 + 10/9 + 30/9 = 48/9 = 16/3. The expected value is $16/3.")
        self.play(E.animate.shift(LEFT * 90 * self.k), *[g.animate.set_opacity(1) for g in groups], run_time=0.5)
        R = self.under(["=", "$", (16, 3)], self.pt(E.get_right())[0] + 12, 560, 34)
        self.play(FadeIn(R, shift=LEFT * 0.15), run_time=0.7)
        self.underline(VGroup(R[1], R[2]))
        self.wait(2.5)
