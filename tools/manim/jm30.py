"""Manim scenes for the JM30 Probabilities summary panels.

These panels are pictures in the QUE pdf, so a scene builds on the print itself:
the panel is rendered from the pdf into the frame, white covers hide its parts,
and the scene takes the covers away in reading order while highlights and moving
copies show where each number comes from. When the last cover goes, the frame is
the printed panel, which becomes the poster. Coordinates are page points measured
with tools/_ink.py style probes of the QUE page.
"""

import json
from pathlib import Path

import fitz
import numpy as np
from manim import (
    DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, ImageMobject, Rectangle, RoundedRectangle, Scene,
    VGroup, config,
)

ROOT = Path(__file__).resolve().parents[2]
Z = 5  # pixels per point of the panel render; the video is 2.5

BLUE = "#00b0f0"
GREEN = "#00b050"
RED = "#e01e1e"
ORANGE = "#f39c32"
PURPLE = "#7030a0"


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
        page = fitz.open(folder / book["source"]["que"])[self.PAGE - 1]
        pix = page.get_pixmap(matrix=fitz.Matrix(Z, Z), clip=fitz.Rect(page.rect))
        self.img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()
        self.add(self.crop(*self.REGION))

    def P(self, x, y):
        return np.array([(x - self.c[0]) * self.k, (self.c[1] - y) * self.k, 0.0])

    def w(self, pt):
        return pt * self.k * 100

    def crop(self, x0, y0, x1, y1):
        """The printed page inside a rectangle, placed where it is printed."""
        part = self.img[round(y0 * Z):round(y1 * Z), round(x0 * Z):round(x1 * Z)]
        m = ImageMobject(part)
        m.stretch_to_fit_width((x1 - x0) * self.k).stretch_to_fit_height((y1 - y0) * self.k)
        return m.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))

    def rect(self, x0, y0, x1, y1, color, width=1.6, fill=None, opacity=0.0):
        r = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, color=color, stroke_width=self.w(width),
                      fill_color=fill or color, fill_opacity=opacity)
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))

    def ring(self, x0, y0, x1, y1, color, pad=1.5, width=1.4):
        """A rounded highlight around a printed item."""
        r = RoundedRectangle(corner_radius=2.5 * self.k, width=(x1 - x0 + 2 * pad) * self.k,
                             height=(y1 - y0 + 2 * pad) * self.k, color=color, stroke_width=self.w(width))
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2)).set_z_index(5)

    def cover(self, x0, y0, x1, y1):
        """A white sheet over part of the panel; it is added at once and taken away later."""
        c = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, stroke_width=0,
                      fill_color="#ffffff", fill_opacity=1).move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))
        c.set_z_index(2)
        self.add(c)
        return c

    def covers(self, *rects):
        return [self.cover(*r) for r in rects]

    def wipe(self, c, run_time=0.8, edge="left"):
        """Reveal what a cover hides by sliding its leading edge across (left to right by default)."""
        keep = {"left": RIGHT, "top": DOWN, "right": LEFT, "bottom": UP}[edge]
        if edge in ("left", "right"):
            self.play(c.animate(run_time=run_time).stretch_to_fit_width(1e-4, about_edge=keep))
        else:
            self.play(c.animate(run_time=run_time).stretch_to_fit_height(1e-4, about_edge=keep))
        self.remove(c)

    def wipes(self, cs, run_time=0.8, edge="left"):
        keep = {"left": RIGHT, "top": DOWN, "right": LEFT, "bottom": UP}[edge]
        fit = "stretch_to_fit_width" if edge in ("left", "right") else "stretch_to_fit_height"
        self.play(*[getattr(c.animate(run_time=run_time), fit)(1e-4, about_edge=keep) for c in cs])
        self.remove(*cs)

    def fly(self, src, dst, run_time=0.9, extra=()):
        """A copy of the printed item in `src` travels to the centre of `dst`; returns the copy."""
        m = self.crop(*src).set_z_index(6)
        self.add(m)
        cx, cy = (dst[0] + dst[2]) / 2, (dst[1] + dst[3]) / 2
        self.play(m.animate(run_time=run_time).move_to(self.P(cx, cy)), *extra)
        return m

    def flies(self, pairs, run_time=0.9, extra=()):
        ms = [self.crop(*s).set_z_index(6) for s, _ in pairs]
        self.add(*ms)
        anims = [m.animate(run_time=run_time).move_to(self.P((d[0] + d[2]) / 2, (d[1] + d[3]) / 2)) for m, (_, d) in zip(ms, pairs)]
        self.play(*anims, *extra)
        return ms


def cells(xs, ys, pad=1.2):
    """Cover rectangles inside a printed grid, by row then column."""
    return [[(xs[c] + pad, ys[r] + pad, xs[c + 1] - pad, ys[r + 1] - pad) for c in range(len(xs) - 1)] for r in range(len(ys) - 1)]


# ---------------------------------------------------------------- JM30 (A) page 1

class BasicProbability(PrintScene):
    """P(E) = favourable / possible, read off the two rows of the table."""

    BOOK, PAGE = "jm30a", 1

    def construct(self):
        xs, ys = [54.0, 222.8, 347.4, 461.1, 545.4], [316.7, 343.0, 385.9, 428.1]
        body = cells(xs, ys[1:])
        table = self.cover(52.5, 315.2, 547.0, 429.6)
        rows = [self.covers(*row[:3]) for row in body]
        frac = [self.covers((462.3, 344.2, 544.2, 362.0), (462.3, 362.0, 544.2, 384.7)),
                self.covers((462.3, 387.1, 544.2, 405.5), (462.3, 405.5, 544.2, 426.9))]
        note = self.cover(335.0, 285.0, 500.0, 310.5)
        label = self.cover(53.0, 249.5, 181.5, 293.0)
        den = self.cover(226.5, 256.6, 401.5, 272.5)
        num = self.cover(226.5, 239.5, 401.5, 256.6)
        pe = self.cover(183.5, 246.0, 223.0, 262.0)
        self.wait(0.3)

        self.wipe(pe, 0.6)
        self.wipe(num, 0.9)
        self.wipe(den, 0.9)
        self.wipe(label, 0.8)
        self.wipe(note, 0.9)
        self.wait(0.3)
        self.play(FadeOut(table, run_time=0.6))

        top_num, top_den = (238.5, 240.0, 390.5, 250.5), (238.5, 258.5, 391.5, 271.5)
        row_specs = [
            # outcomes in the possible column that are favourable, and where they sit in the favourable column
            ([(260.0, 359.8, 275.2, 373.2), (279.1, 359.8, 294.5, 373.2)],
             [(385.0, 359.8, 399.5, 373.2), (406.8, 359.8, 418.9, 373.2)],
             (241.0, 359.8, 326.5, 373.2), (383.5, 359.0, 420.5, 372.5)),
            ([(249.5, 402.8, 264.5, 414.8), (288.0, 402.8, 303.0, 414.8), (326.5, 402.8, 338.5, 414.8)],
             [(380.0, 402.8, 394.9, 414.8), (398.1, 402.8, 410.4, 414.8), (414.3, 402.8, 426.5, 414.8)],
             (229.5, 402.8, 338.5, 414.8), (378.5, 402.5, 428.0, 415.0)),
        ]
        for (event, possible, favourable), (fn, fd), (srcs, dsts, all_possible, all_fav) in zip(rows, frac, row_specs):
            self.wipe(event, 1.0)
            self.wipe(possible, 1.0)
            rings = [self.ring(*s, BLUE) for s in srcs]
            self.play(*[Create(r) for r in rings], run_time=0.6)
            copies = self.flies(list(zip(srcs, dsts)), 1.0, extra=[FadeOut(VGroup(*rings), run_time=1.0)])
            self.play(FadeOut(favourable), *[FadeOut(m) for m in copies], run_time=0.5)
            blue = [self.ring(*top_num, BLUE), self.ring(*all_fav, BLUE)]
            self.play(*[Create(r) for r in blue], run_time=0.6)
            self.wipe(fn, 0.5, edge="top")
            green = [self.ring(*top_den, GREEN), self.ring(*all_possible, GREEN)]
            self.play(FadeOut(VGroup(*blue)), *[Create(r) for r in green], run_time=0.6)
            self.wipe(fd, 0.5, edge="top")
            self.play(FadeOut(VGroup(*green)), run_time=0.5)
            self.wait(0.3)
        self.wait(1.2)


# ---------------------------------------------------------------- JM30 (A) page 4

class ExperimentalProbability(PrintScene):
    """P(E) is about frequency / trials; the 78 tails in 100 tosses go into the fraction."""

    BOOK, PAGE = "jm30a", 4

    def construct(self):
        tail_num = self.cover(163.0, 223.0, 189.5, 238.6)
        tail_den = self.cover(163.0, 244.6, 189.5, 260.5)
        tail_bar = self.cover(160.5, 238.6, 192.0, 244.6)
        simplest = self.cover(195.5, 222.5, 241.0, 261.0)
        tails = self.cover(89.0, 222.5, 157.5, 261.0)
        eg = self.cover(53.0, 198.0, 384.0, 216.0)
        note = self.cover(55.0, 161.0, 224.0, 176.0)
        arrow = self.cover(86.0, 139.6, 108.0, 160.0)
        den = self.cover(152.0, 131.4, 370.0, 148.0)
        num = self.cover(152.0, 110.0, 370.0, 131.4)
        pe = self.cover(99.0, 118.0, 148.5, 140.5)
        self.wait(0.3)

        self.wipe(pe, 0.7)
        self.wipe(num, 1.1)
        self.wipe(den, 0.9)
        self.wipe(note, 0.9)
        self.wipe(arrow, 0.5, edge="bottom")
        self.wait(0.4)
        self.wipe(eg, 1.8)

        hundred, seventy_eight = (237.2, 200.5, 291.2, 210.7), (340.8, 200.5, 381.7, 210.7)
        tag = [self.ring(*seventy_eight, BLUE), self.ring(*hundred, GREEN)]
        self.play(*[Create(r) for r in tag], run_time=0.7)
        self.wipe(tails, 0.8)
        self.wipe(tail_bar, 0.4)

        steps = [
            ((168.3, 112.8, 357.7, 126.0), BLUE, (340.8, 200.8, 354.0, 210.7), (170.3, 225.3, 183.5, 235.0), tail_num),
            ((199.3, 135.8, 322.7, 146.0), GREEN, (237.2, 200.8, 256.5, 210.7), (167.3, 248.3, 186.7, 258.2), tail_den),
        ]
        for line, color, src, dst, hide in steps:
            r = self.ring(*line, color)
            self.play(Create(r), run_time=0.6)
            m = self.fly(src, dst, 1.0)
            self.remove(hide)
            self.play(FadeOut(m), FadeOut(r), run_time=0.5)
        self.play(FadeOut(VGroup(*tag)), run_time=0.5)
        self.wait(0.3)
        self.wipe(simplest, 0.9)
        self.wait(1.5)


# ---------------------------------------------------------------- JM30 (B) page 1

class TreeDiagram(PrintScene):
    """Grow each tree a stage at a time, then count outcomes for P(H3) and P(1 tail and 1 head)."""

    BOOK, PAGE = "jm30b", 1

    def outcomes(self, rows, first):
        """Reveal the outcome rows; on the first row the two branch labels fly in to make the outcome."""
        cover, srcs, dsts = first
        rings = [self.ring(*s, ORANGE) for s in srcs]
        self.play(*[Create(r) for r in rings], run_time=0.5)
        copies = self.flies(list(zip(srcs, dsts)), 0.9, extra=[FadeOut(VGroup(*rings), run_time=0.9)])
        self.remove(cover)
        self.play(*[FadeOut(m) for m in copies], run_time=0.3)
        for c in rows:
            self.wipe(c, 0.45)

    def construct(self):
        # second tree and its probability, covered first so the first tree's covers sit on top
        prob2 = self.covers((316.5, 736.5, 440.0, 766.0), (443.5, 737.0, 453.5, 754.0),
                            (443.5, 754.0, 453.5, 766.0), (459.5, 737.0, 487.5, 766.0))
        order = self.cover(412.5, 674.5, 549.0, 689.5)
        box = self.covers((370.0, 626.5, 401.5, 631.5), (370.0, 690.0, 401.5, 695.0),
                          (370.0, 626.5, 375.5, 695.0), (395.5, 626.5, 401.5, 695.0))
        rows2 = [self.cover(261.0, y0 - 1.8, 397.0, y1 + 1.8)
                 for y0, y1 in ((603.2, 612.8), (633.3, 642.7), (675.0, 684.7), (705.3, 714.5))]
        tree2 = self.covers((80.5, 574.0, 144.5, 589.5), (41.0, 617.5, 119.5, 702.5),
                            (183.0, 574.0, 250.5, 589.5), (120.0, 602.5, 224.5, 717.0),
                            (340.0, 573.5, 432.5, 588.5))

        sides = self.covers((105.0, 467.0, 237.0, 489.5), (110.0, 497.5, 241.5, 526.0))
        likely = self.cover(457.0, 388.5, 526.5, 402.5)
        h3 = self.covers((459.5, 405.0, 529.5, 427.0), (531.5, 406.0, 541.0, 422.6), (531.5, 422.6, 541.0, 433.5))
        brace = self.cover(423.0, 338.0, 445.5, 456.5)
        rows1 = [self.cover(264.0, y0 - 1.8, 399.0, y1 + 1.8)
                 for y0, y1 in ((335.8, 344.2), (356.8, 364.7), (378.2, 386.0), (407.8, 415.5), (428.3, 436.2), (449.7, 457.5))]
        tree1 = self.covers((91.0, 306.5, 137.5, 322.0), (41.0, 355.0, 120.5, 439.0),
                            (179.0, 297.5, 285.0, 323.5), (121.0, 333.5, 233.0, 460.0),
                            (343.5, 304.5, 434.5, 318.5))
        formula = self.cover(170.0, 230.0, 411.0, 278.0)
        self.wait(0.3)

        self.play(FadeOut(formula, run_time=0.8))
        self.wait(0.4)
        for c in tree1:
            self.wipe(c, 0.8)
        self.outcomes(rows1[1:], (rows1[0], [(109.7, 357.7, 118.0, 365.5), (224.7, 336.3, 230.5, 344.2)],
                                  [(383.2, 335.8, 391.0, 343.7), (391.0, 335.8, 396.7, 343.7)]))
        self.wipe(brace, 0.6, edge="top")
        self.wipe(likely, 0.7)
        self.wipe(h3[0], 0.8)
        h3_ring, all1 = self.ring(383.5, 378.2, 396.7, 386.0, BLUE), self.ring(381.5, 334.5, 398.5, 459.0, GREEN)
        self.play(Create(h3_ring), run_time=0.6)
        self.wipe(h3[1], 0.4, edge="top")
        self.play(FadeOut(h3_ring), Create(all1), run_time=0.6)
        self.wipe(h3[2], 0.4, edge="top")
        self.play(FadeOut(all1), run_time=0.4)
        self.wipe(sides[0], 0.6, edge="top")
        self.wipe(sides[1], 0.9)
        self.wait(0.6)

        for c in tree2:
            self.wipe(c, 0.8)
        self.outcomes(rows2[1:], (rows2[0], [(107.7, 619.8, 116.2, 628.0), (213.3, 604.7, 222.2, 612.8)],
                                  [(376.5, 603.2, 384.9, 611.3), (384.9, 603.2, 393.2, 611.3)]))
        self.play(*[FadeOut(c) for c in box], run_time=0.6)
        self.wipe(order, 1.0)
        self.wait(0.3)
        self.wipe(prob2[0], 1.0)
        box_ring, all2 = self.ring(371.8, 628.5, 400.0, 692.8, BLUE), self.ring(369.5, 601.5, 402.0, 715.5, GREEN)
        self.play(Create(box_ring), run_time=0.6)
        self.wipe(prob2[1], 0.4, edge="top")
        self.play(FadeOut(box_ring), Create(all2), run_time=0.6)
        self.wipe(prob2[2], 0.4, edge="top")
        self.play(FadeOut(all2), run_time=0.4)
        self.wipe(prob2[3], 0.8)
        self.wait(1.5)


# ---------------------------------------------------------------- JM30 (B) page 4

class TreeVsTable(PrintScene):
    """The two-stage tree and the table list the same outcomes; each outcome moves into its cell."""

    BOOK, PAGE = "jm30b", 4

    def construct(self):
        note = self.covers((328.5, 263.5, 570.5, 276.0), (335.5, 276.0, 507.0, 289.0))
        body = [self.cover(*c) for row in cells([493.0, 528.8, 564.7], [201.3, 220.0, 238.7], 1.0) for c in row]
        table = self.cover(403.0, 150.5, 567.0, 241.0)
        arrow = self.cover(309.0, 205.0, 384.0, 225.5)
        tree_rows = [(262.2, 172.3, 278.5, 180.2), (263.2, 199.2, 278.2, 207.0),
                     (263.2, 223.2, 278.2, 231.0), (264.2, 249.2, 277.8, 257.0)]
        rows = [self.cover(183.0, y0 - 1.8, 280.5, max(y1, l1) + 1.8)
                for (_, y0, _, y1), l1 in zip(tree_rows, (181.8, 207.3, 231.0, 257.3))]
        tree = self.covers((57.5, 151.0, 118.5, 165.0), (44.0, 184.0, 96.0, 245.5),
                           (138.5, 151.0, 203.0, 165.5), (100.5, 172.0, 174.5, 259.5),
                           (228.0, 151.0, 316.0, 165.0))
        self.wait(0.3)

        for c in tree:
            self.wipe(c, 0.7)
        for c in rows:
            self.wipe(c, 0.45)
        self.wait(0.3)
        self.wipe(arrow, 0.7)
        self.play(FadeOut(table, run_time=0.8))
        table_text = [(503.3, 208.0, 519.5, 215.7), (539.5, 208.0, 554.5, 215.7),
                      (503.3, 225.2, 517.8, 233.0), (540.5, 225.5, 553.7, 233.4)]
        for src, dst, c in zip(tree_rows, table_text, body):
            r = self.ring(*src, ORANGE)
            self.play(Create(r), run_time=0.4)
            m = self.fly(src, dst, 0.9, extra=[FadeOut(r, run_time=0.9)])
            self.remove(c)
            self.play(FadeOut(m), run_time=0.25)
        self.wait(0.4)
        self.wipe(note[0], 1.0)
        self.wipe(note[1], 0.8)
        self.wait(1.5)


class RemoveImpossible(PrintScene):
    """Fill the table of two draws, strike out drawing the same ball twice, then count what is left."""

    BOOK, PAGE = "jm30b", 4

    def construct(self):
        xs, ys = [119.9, 160.4, 201.2, 241.7], [418.9, 437.1, 455.8, 474.0]
        final = self.covers((289.5, 486.5, 375.0, 514.0), (378.5, 487.0, 388.5, 502.4),
                            (378.5, 502.4, 388.5, 514.0), (392.5, 486.5, 417.0, 514.0))
        imply = self.cover(290.0, 446.5, 507.5, 459.5)
        note = self.covers((289.5, 411.5, 527.0, 423.6), (289.5, 423.6, 527.0, 436.5))
        arrow = self.cover(383.0, 348.6, 412.0, 410.5)
        body = [[self.cover(*c) for c in row] for row in cells(xs, ys, 1.0)]
        table = self.cover(43.0, 385.5, 244.0, 476.5)
        lines = self.covers((35.5, 334.5, 486.0, 348.4), (36.0, 354.5, 321.0, 368.5))
        self.wait(0.3)

        self.wipe(lines[0], 1.8)
        self.wipe(lines[1], 1.3)
        self.wait(0.3)
        self.play(FadeOut(table, run_time=0.8))
        heads = [self.ring(89.5, 418.9, 119.9, 437.1, ORANGE, pad=0.2), self.ring(160.4, 400.5, 201.2, 418.9, ORANGE, pad=0.2)]
        self.play(*[Create(r) for r in heads], run_time=0.6)
        self.wipe(body[0][1], 0.6)
        self.play(FadeOut(VGroup(*heads)), run_time=0.4)
        for r, c in ((0, 2), (1, 0), (1, 2), (2, 0), (2, 1)):
            self.wipe(body[r][c], 0.4)
        self.wait(0.4)

        self.wipe(arrow, 0.6, edge="top")
        self.wipe(note[0], 1.4)
        self.wipes([body[i][i] for i in range(3)], 0.8)
        self.wipe(note[1], 1.2)
        self.wipe(imply, 1.2)
        self.wait(0.4)

        self.wipe(final[0], 0.9)
        reds = [self.ring(*c, BLUE, pad=-0.6) for c in (cells(xs, ys, 0)[0][1], cells(xs, ys, 0)[1][0])]
        self.play(*[Create(r) for r in reds], run_time=0.6)
        self.wipe(final[1], 0.4, edge="top")
        left = [self.ring(*cells(xs, ys, 0)[r][c], GREEN, pad=-0.6) for r in range(3) for c in range(3) if r != c]
        self.play(FadeOut(VGroup(*reds)), *[Create(r) for r in left], run_time=0.7)
        self.wipe(final[2], 0.4, edge="top")
        self.play(FadeOut(VGroup(*left)), run_time=0.4)
        self.wipe(final[3], 0.8)
        self.wait(1.5)
