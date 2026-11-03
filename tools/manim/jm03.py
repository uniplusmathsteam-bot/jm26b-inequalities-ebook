"""Manim scenes for the JM03 (B) Key Concepts panels and the JM03 (C) formula sheet.

Panels are pictures in the QUE, so each scene uses PrintScene: cover parts of
the print and wipe them away in reading order. The last frame is the panel.
Cover rectangles are the ink boxes measured on pages/pNN.jpg (1 pt = 3 px);
each one stops short of its neighbours so a wipe never reveals another part.
"""

import json
from pathlib import Path

import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, ImageMobject, Rectangle, RoundedRectangle, Scene,
    VGroup, config,
)

ROOT = Path(__file__).resolve().parents[2]
Z = 5

GREEN = "#00b050"
RED = "#e01e1e"
BLUE = "#00b0f0"
PURPLE = "#7030a0"
ORANGE = "#f39c32"


def page_pixels(folder, book, page_no):
    """The QUE page at Z px/pt, or the extracted page image when the PDF is not on this machine."""
    pdf = folder / book["source"]["que"]
    if pdf.exists():
        import fitz

        page = fitz.open(pdf)[page_no - 1]
        pix = page.get_pixmap(matrix=fitz.Matrix(Z, Z), clip=fitz.Rect(page.rect))
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()
        return img, Z
    from PIL import Image

    im = Image.open(folder / "pages" / f"p{page_no:02d}.jpg").convert("RGB")
    return np.asarray(im).copy(), im.width / 595.28


class PrintScene(Scene):
    BOOK = ""
    PAGE = 1
    REGION = (0, 0, 595, 842)

    def setup(self):
        x0, y0, x1, y1 = self.REGION
        self.k = config.frame_height / (y1 - y0)
        self.c = ((x0 + x1) / 2, (y0 + y1) / 2)
        self.camera.background_color = "#ffffff"
        folder = ROOT / "books" / self.BOOK
        book = json.loads((folder / "book.json").read_text(encoding="utf-8"))
        self.img, self.z = page_pixels(folder, book, self.PAGE)
        self.add(self.crop(*self.REGION))

    def P(self, x, y):
        return np.array([(x - self.c[0]) * self.k, (self.c[1] - y) * self.k, 0.0])

    def w(self, pt):
        return pt * self.k * 100

    def crop(self, x0, y0, x1, y1):
        z = self.z
        part = self.img[round(y0 * z):round(y1 * z), round(x0 * z):round(x1 * z)]
        m = ImageMobject(part)
        m.stretch_to_fit_width((x1 - x0) * self.k).stretch_to_fit_height((y1 - y0) * self.k)
        return m.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))

    def ring(self, x0, y0, x1, y1, color, pad=1.5, width=1.4):
        r = RoundedRectangle(corner_radius=2.5 * self.k, width=(x1 - x0 + 2 * pad) * self.k,
                             height=(y1 - y0 + 2 * pad) * self.k, color=color, stroke_width=self.w(width))
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2)).set_z_index(5)

    def cover(self, x0, y0, x1, y1, z=2):
        c = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, stroke_width=0,
                      fill_color="#ffffff", fill_opacity=1).move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))
        c.set_z_index(z)
        self.add(c)
        return c

    def wipe(self, c, run_time=0.8, edge="left", *extra):
        keep = {"left": RIGHT, "top": DOWN, "right": LEFT, "bottom": UP}[edge]
        if edge in ("left", "right"):
            anim = c.animate(run_time=run_time).stretch_to_fit_width(1e-4, about_edge=keep)
        else:
            anim = c.animate(run_time=run_time).stretch_to_fit_height(1e-4, about_edge=keep)
        self.play(anim, *extra)
        self.remove(c)


class ProfitLossFormulas(PrintScene):
    """Key Concepts 3: profit and loss formulas, then Selling = Cost x (1 +/- %).

    book.json region [24, 203, 488, 584.5]: the title box, the four formula
    boxes, the + and - signs on the left and the rounded Selling box.
    """

    BOOK, PAGE = "jm03b", 1

    def construct(self):
        title = self.cover(33, 204, 177, 252)
        profit = self.cover(64.5, 251.5, 486, 298.2)
        plus = self.cover(27, 296, 64.8, 333)
        profit_pct = self.cover(64.8, 298.3, 437.5, 364.5)
        loss = self.cover(64.5, 365, 486, 413.9)
        minus = self.cover(24.5, 399, 64.4, 415.5)
        loss_pct = self.cover(64.5, 414, 438, 480.6)
        outer = self.cover(116, 480.7, 474, 584)
        selling = self.cover(128, 518, 193, 576, z=3)
        equals = self.cover(194, 524, 211, 538, z=3)
        cost = self.cover(213, 519, 257, 576, z=3)
        times_one = self.cover(263, 519, 308, 543, z=3)
        plus_box = self.cover(319.5, 483.5, 438.5, 531.4, z=3)
        minus_box = self.cover(319.5, 531.5, 438.5, 579.5, z=3)
        close = self.cover(444, 519, 457, 543, z=3)
        self.wait(0.3)

        self.wipe(title, 0.5)
        self.wipe(profit, 0.9)
        self.wipe(plus, 0.35, "top")
        self.wipe(profit_pct, 0.9)
        r1 = self.ring(66, 299, 436, 363, GREEN)
        self.play(Create(r1), run_time=0.45)
        self.wait(0.3)

        self.wipe(loss, 0.9)
        self.wipe(minus, 0.35, "top")
        self.wipe(loss_pct, 0.9)
        r2 = self.ring(66, 415.5, 437, 479.5, RED)
        self.play(Create(r2), run_time=0.45)
        self.wait(0.3)
        self.play(FadeOut(VGroup(r1, r2)), run_time=0.4)

        self.wipe(outer, 0.6)
        self.wipe(selling, 0.5)
        self.wipe(equals, 0.25)
        self.wipe(cost, 0.5)
        self.wipe(times_one, 0.45)
        g1, g2 = self.ring(321, 485, 436.5, 531, GREEN), self.ring(28.5, 297.5, 64, 332, GREEN)
        self.wipe(plus_box, 0.6, "left", Create(g1), Create(g2))
        self.wait(0.35)
        q1, q2 = self.ring(321, 531.8, 436.5, 577.5, RED), self.ring(26, 400, 61.5, 414, RED)
        self.wipe(minus_box, 0.6, "left", Create(q1), Create(q2))
        self.wait(0.35)
        self.wipe(close, 0.25)
        self.wait(0.5)
        self.play(FadeOut(VGroup(g1, g2, q1, q2)), run_time=0.5)
        self.wait(1.1)


class CostMarkedSelling(PrintScene):
    """Key Concepts 4: Cost -> Marked -> Selling; profit or loss spans cost to
    selling, the discount spans marked to selling.

    book.json region [32, 68, 546, 264.3]: the title box, the heading, the
    three boxes and arrows, both brackets and the Discount label with its badge.
    """

    BOOK, PAGE = "jm03b", 4

    def construct(self):
        title = self.cover(33, 69, 177, 117)
        cost = self.cover(52, 127.6, 186.5, 211)
        arrow1 = self.cover(190, 149.5, 231, 186.5)
        marked = self.cover(231.2, 127.6, 365.5, 210.2)
        arrow2 = self.cover(367.5, 149.5, 408.2, 186.5)
        selling = self.cover(408.3, 127.6, 542.6, 210.2)
        top = self.cover(177.2, 70, 542.6, 127.9)
        top_left = self.cover(56, 117.2, 177.2, 127.9)
        bottom = self.cover(232, 210.2, 542.6, 264.3)
        self.wait(0.3)

        self.wipe(title, 0.5)
        self.wipe(cost, 0.6)
        self.wipe(arrow1, 0.35)
        self.wipe(marked, 0.6)
        self.wipe(arrow2, 0.35)
        self.wipe(selling, 0.6)
        self.wait(0.25)

        c1, c2 = self.ring(54, 128.3, 184.3, 209.6, GREEN, pad=2), self.ring(410, 128.3, 540.6, 209.6, GREEN, pad=2)
        self.wipe(top_left, 0.35, "left", Create(c1))
        self.wipe(top, 1.0, "left", Create(c2))
        self.wait(0.5)
        self.play(FadeOut(VGroup(c1, c2)), run_time=0.4)

        d1, d2 = self.ring(233, 128.3, 363.3, 209.6, BLUE, pad=2), self.ring(410, 128.3, 540.6, 209.6, BLUE, pad=2)
        self.wipe(bottom, 1.0, "left", Create(d1), Create(d2))
        self.wait(0.6)
        self.play(FadeOut(VGroup(d1, d2)), run_time=0.4)
        self.wait(1.1)


class FormulaSheetScene(PrintScene):
    """A JM03 (C) page 1 panel: a framed rule box, then boxes of the form
    "new = old x (1 +/- rate)". Each box frame is wiped first, then its parts
    in reading order; the +/- part is ringed in its colour while it appears."""

    BOOK, PAGE = "jm03c", 1
    RULE = ()      # (frame, [parts...]) of the first box
    FORMS = ()     # ((frame, left part, sign part, ring colour), ...)

    def construct(self):
        frame, parts = self.RULE
        rule = self.cover(*frame)
        rule_parts = [self.cover(*p, z=3) for p in parts]
        forms = [(self.cover(*f), self.cover(*a, z=3), self.cover(*s, z=3), s, col) for f, a, s, col in self.FORMS]
        self.wait(0.3)

        self.wipe(rule, 0.5)
        for c in rule_parts:
            self.wipe(c, 0.7)
        self.wait(0.3)
        rings = []
        for f, a, s, box, col in forms:
            self.wipe(f, 0.4)
            self.wipe(a, 0.8)
            r = self.ring(box[0] + 0.5, box[1] + 1, box[2] - 0.5, box[3] - 1, col, pad=1.2)
            self.wipe(s, 0.7, "left", Create(r))
            rings.append(r)
            self.wait(0.35)
        self.wait(0.4)
        self.play(FadeOut(VGroup(*rings)), run_time=0.5)
        self.wait(1.1)


class PercentageChange(FormulaSheetScene):
    """Panel 1: % increase/decrease = (new - original) / original x 100%,
    new value = original value x (1 + % increase) and x (1 - % decrease).
    book.json region [27, 193, 386, 392.2]."""

    RULE = ((27, 193, 386, 291.8), [(44, 220, 252, 241), (44, 247, 315, 285.5)])
    FORMS = (
        ((27, 291.8, 386, 340.1), (43, 305, 270.6, 327.5), (270.8, 305, 369.5, 327.5), GREEN),
        ((27, 340.1, 386, 392.2), (42, 354, 270.2, 376.5), (270.4, 354, 371.5, 376.5), RED),
    )


class ProfitLossPercent(FormulaSheetScene):
    """Panel 2: profit or loss % = (selling - cost) / cost x 100%,
    selling price = cost x (1 + profit %) and x (1 - loss %).
    book.json region [30, 392.3, 384, 593]."""

    RULE = ((30, 392.3, 384, 490.3), [(72, 417, 188, 438.5), (40, 446, 264, 484)])
    FORMS = (
        ((30, 490.3, 384, 539.3), (42, 505, 218.6, 526), (218.8, 505, 306.5, 526), GREEN),
        ((30, 539.3, 384, 593), (41, 554.5, 218.2, 575.5), (218.4, 554.5, 299.5, 575.5), RED),
    )


class DiscountPercent(FormulaSheetScene):
    """Panel 3: discount % = (marked - selling) / marked x 100%,
    selling price = marked price x (1 - discount %).
    book.json region [27, 598, 394, 777]."""

    RULE = ((27, 598, 394, 722.7), [(39, 633, 145, 654.5), (39, 669, 314, 710.5)])
    FORMS = (
        ((27, 722.7, 394, 777), (39, 738, 272.2, 759.5), (272.4, 738, 378.5, 759.5), BLUE),
    )
