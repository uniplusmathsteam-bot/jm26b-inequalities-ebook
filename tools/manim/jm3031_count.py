"""Solution guides for the counting questions in JM30 JM31 Intensive.

Questions 1–6 are drawn on a blank canvas. Every count is the one in the
answer key: 8/7 lies past 1, ELEPHANT has no M, every digit of 19357713 is
odd, UNIVERSITY has four vowels, 14 of the 20 balls are black or yellow, and
5 of the 8 marbles are not yellow.
"""

from manim import FadeIn, LaggedStart, VGroup

from guide import GREEN, INK, PINK, RED, GuideScene

W, H = 1280, 720
SLATE = "#5c6b7a"


def _assert_key():
    vowels = [i for i, ch in enumerate("UNIVERSITY") if ch in "AEIOU"]
    assert vowels == [0, 2, 4, 7]
    assert "M" not in "ELEPHANT"
    assert all(int(ch) % 2 == 1 for ch in "19357713")
    assert 2 + 5 + 9 + 4 == 20 and 5 + 9 == 14
    assert 4 + 1 + 3 == 8 and 4 + 1 == 5


_assert_key()


class CountGuide(GuideScene):
    """A 16:9 canvas. Words sit inside stroke-only cards, clear of the stroke."""

    PAGE = 3
    REGION = (0, 0, W, H)

    def cap(self, s, y=78, size=28, color=INK):
        t = self.label(s, (W / 2, y), size=size, color=color)
        return t.set_z_index(3)

    def card(self, s, cx, cy, side=84, color=INK):
        x0, y0 = cx - side / 2, cy - side / 2
        box = self.frame(x0, y0, x0 + side, y0 + side, color, 1.8).set_z_index(1)
        lab = self.label(s, (cx, cy), size=30, color=color).set_z_index(3)
        return VGroup(box, lab)

    def disk(self, cx, cy, r, fill, stroke=INK):
        c = self.dot((cx, cy), color=fill, r=r).set_z_index(1)
        c.set_stroke(stroke, width=self.w(1.6))
        return c

    def ring(self, cx, cy, r, color=PINK):
        c = self.dot((cx, cy), color=color, r=r).set_z_index(2)
        c.set_fill(opacity=0)
        c.set_stroke(color, width=self.w(2.4))
        return c

    def stacked(self, num, den, cx, cy, size=34, color=RED):
        top = self.label(str(num), (cx, cy - 26), size=size, color=color).set_z_index(3)
        bot = self.label(str(den), (cx, cy + 26), size=size, color=color).set_z_index(3)
        bar_w = max(top.width, bot.width) / self.k + 14
        bar = self.line((cx - bar_w / 2, cy), (cx + bar_w / 2, cy), color, 1.5).set_z_index(2)
        return VGroup(top, bar, bot), bar_w

    def fractions(self, pairs, cy, size=34):
        """pairs is a list of (numerator, denominator). An equals sign joins them."""
        made = [self.stacked(n, d, 0, cy, size) for n, d in pairs]
        eq = self.label("=", (0, cy), size=size, color=RED).set_z_index(3) if len(made) > 1 else None
        eq_w = (eq.width / self.k + 28) if eq is not None else 0
        total = sum(w for _, w in made) + eq_w * (len(made) - 1)
        x = W / 2 - total / 2
        group = VGroup()
        for i, (g, w) in enumerate(made):
            g.shift(self.P(x + w / 2, cy) - self.P(0, cy))
            group.add(g)
            x += w
            if eq is not None and i == 0:
                eq.move_to(self.P(x + eq_w / 2, cy))
                group.add(eq)
                x += eq_w
        return group

    def arrive(self, *mobs, run_time=0.5):
        self.play(LaggedStart(*[FadeIn(m) for m in mobs], lag_ratio=0.06), run_time=run_time)


class Q1(CountGuide):
    """8/7 is the only option that sits past 1."""

    def construct(self):
        title = self.cap("A probability lies between 0 and 1.")
        axis = self.line((150, 400), (1140, 400), INK, 1.8)
        ticks = VGroup(
            self.line((220, 388), (220, 412), INK, 1.6),
            self.line((800, 388), (800, 412), INK, 1.6),
        )
        names = VGroup(self.cap("0", 448, 24), self.cap("1", 448, 24))
        names[0].move_to(self.P(220, 448))
        names[1].move_to(self.P(800, 448))
        band = self.line((220, 470), (800, 470), GREEN, 3.2)
        band_name = self.cap("from 0 to 1", 512, 22, GREEN)
        self.add(title, axis, ticks, names, band, band_name)
        self.wait(0.5)

        inside = [
            (340, "C   0.005", GREEN),
            (500, "A   π/7", GREEN),
            (680, "D   2024/2025", GREEN),
        ]
        marks = VGroup()
        for x, text, color in inside:
            dot = self.dot((x, 400), color=color, r=5).set_z_index(2)
            stem = self.line((x, 392), (x, 300), color, 1.4)
            lab = self.cap(text, 268, 22, color)
            lab.move_to(self.P(x, 268))
            marks.add(VGroup(dot, stem, lab))
        self.arrive(*marks, run_time=0.8)
        self.wait(0.3)

        x = 1020
        bad = VGroup(
            self.dot((x, 400), color=RED, r=5.5).set_z_index(2),
            self.line((x, 392), (x, 300), RED, 1.8),
        )
        lab = self.cap("B   8/7", 268, 24, RED)
        lab.move_to(self.P(x, 268))
        bad.add(lab)
        note = self.cap("8/7 is greater than 1.", 600, 28, RED)
        answer = self.cap("The answer is B.", 662, 28, RED)
        self.play(FadeIn(bad), FadeIn(note), run_time=0.6)
        self.wait(0.3)
        self.play(FadeIn(answer), run_time=0.4)
        self.wait(1.2)


class Q2(CountGuide):
    def construct(self):
        letters = list("ELEPHANT")
        title = self.cap("Letters in ELEPHANT")
        cards = self._letters(letters, 250)
        self.add(title, cards)
        self.wait(0.5)
        note = self.cap("There is no letter M.", 430, 28)
        zero = self.cap("P(M) = 0", 530, 36, RED)
        answer = self.cap("The answer is A.", 640, 28, RED)
        self.play(FadeIn(note), run_time=0.4)
        self.play(FadeIn(zero), FadeIn(answer), run_time=0.5)
        self.wait(1.2)

    def _letters(self, letters, cy, side=84, gap=18):
        pitch = side + gap
        span = pitch * (len(letters) - 1)
        x0 = W / 2 - span / 2
        return VGroup(*[self.card(ch, x0 + i * pitch, cy, side) for i, ch in enumerate(letters)])


class Q3(Q2):
    def construct(self):
        digits = list("19357713")
        title = self.cap("Digits in the password 19357713")
        cards = self._letters(digits, 250)
        self.add(title, cards)
        self.wait(0.5)
        self.play(*[card.animate.set_color(PINK) for card in cards], run_time=0.6)
        self.wait(0.2)
        note = self.cap("All 8 digits are odd.", 430, 28, PINK)
        one = self.cap("P(odd digit) = 1", 530, 36, RED)
        answer = self.cap("The answer is D.", 640, 28, RED)
        self.play(FadeIn(note), FadeIn(one), FadeIn(answer), run_time=0.6)
        self.wait(1.2)


class Q4(Q2):
    def construct(self):
        word = "UNIVERSITY"
        title = self.cap("Letters in UNIVERSITY")
        cards = self._letters(list(word), 230, side=78, gap=14)
        self.add(title, cards)
        self.wait(0.5)
        hits = [cards[i] for i, ch in enumerate(word) if ch in "AEIOU"]
        self.play(*[card.animate.set_color(PINK) for card in hits], run_time=0.6)
        note = self.cap("4 vowels: U, I, E and I.  Y is not counted.", 400, 26, PINK)
        fr = self.fractions([("4", "10"), ("2", "5")], 520)
        answer = self.cap("The answer is C.", 640, 28, RED)
        self.play(FadeIn(note), FadeIn(fr), run_time=0.6)
        self.play(FadeIn(answer), run_time=0.4)
        self.wait(1.2)


class Q5(CountGuide):
    def construct(self):
        groups = [
            ("white", 2, "#f4f1ea", SLATE, False),
            ("black", 5, "#2b2b2b", "#2b2b2b", True),
            ("yellow", 9, "#f5c518", "#c9a20f", True),
            ("orange", 4, "#f08a24", "#d06a10", False),
        ]
        title = self.cap("2 white, 5 black, 9 yellow, 4 orange")
        balls, rings, labels = self._balls(groups, cy=250, r=16, pitch=48)
        self.add(title, balls, labels)
        self.wait(0.5)
        self.play(FadeIn(rings), run_time=0.5)
        note = self.cap("14 are black or yellow, out of 20.", 470, 26, PINK)
        fr = self.fractions([("14", "20"), ("7", "10")], 565)
        answer = self.cap("The answer is C.", 662, 28, RED)
        self.play(FadeIn(note), FadeIn(fr), FadeIn(answer), run_time=0.6)
        self.wait(1.2)

    def _balls(self, groups, cy, r, pitch):
        n = sum(g[1] for g in groups)
        span = pitch * (n - 1)
        x = W / 2 - span / 2
        balls, rings, labels = VGroup(), VGroup(), VGroup()
        for name, count, fill, stroke, hit in groups:
            start = x
            for _ in range(count):
                balls.add(self.disk(x, cy, r, fill, stroke))
                if hit:
                    rings.add(self.ring(x, cy, r + 7))
                x += pitch
            mid = (start + x - pitch) / 2
            lab = self.cap(f"{count} {name}", cy + r + 46, 20, PINK if hit else INK)
            lab.move_to(self.P(mid, cy + r + 46))
            labels.add(lab)
        return balls, rings, labels


class Q6(Q5):
    def construct(self):
        groups = [
            ("red", 4, "#d92d20", "#b42318", True),
            ("green", 1, "#1d8a4a", "#146c38", True),
            ("yellow", 3, "#f5c518", "#c9a20f", False),
        ]
        title = self.cap("4 red, 1 green, 3 yellow")
        balls, rings, labels = self._balls(groups, cy=250, r=28, pitch=96)
        self.add(title, balls, labels)
        self.wait(0.5)
        self.play(FadeIn(rings), run_time=0.45)
        note = self.cap("5 are not yellow, out of 8.", 470, 28, PINK)
        fr = self.fractions([("5", "8")], 575)
        answer = self.cap("The answer is D.", 670, 28, RED)
        self.play(FadeIn(note), FadeIn(fr), FadeIn(answer), run_time=0.6)
        self.wait(1.2)
