"""Manim scenes for JM03 (B) Percentages Key Concepts panels.

Panels are pictures in the QUE, so each scene uses PrintScene: cover parts of
the print and wipe them away in reading order. The last frame is the panel.
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
Z = 5

GREEN = "#00b050"
RED = "#e01e1e"
BLUE = "#00b0f0"
PURPLE = "#7030a0"
ORANGE = "#f39c32"


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
        part = self.img[round(y0 * Z):round(y1 * Z), round(x0 * Z):round(x1 * Z)]
        m = ImageMobject(part)
        m.stretch_to_fit_width((x1 - x0) * self.k).stretch_to_fit_height((y1 - y0) * self.k)
        return m.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))

    def rect(self, x0, y0, x1, y1, color, width=1.6, fill=None, opacity=0.0):
        r = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, color=color, stroke_width=self.w(width),
                      fill_color=fill or color, fill_opacity=opacity)
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))

    def ring(self, x0, y0, x1, y1, color, pad=1.5, width=1.4):
        r = RoundedRectangle(corner_radius=2.5 * self.k, width=(x1 - x0 + 2 * pad) * self.k,
                             height=(y1 - y0 + 2 * pad) * self.k, color=color, stroke_width=self.w(width))
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2)).set_z_index(5)

    def cover(self, x0, y0, x1, y1):
        c = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, stroke_width=0,
                      fill_color="#ffffff", fill_opacity=1).move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2))
        c.set_z_index(2)
        self.add(c)
        return c

    def wipe(self, c, run_time=0.8, edge="left"):
        keep = {"left": RIGHT, "top": DOWN, "right": LEFT, "bottom": UP}[edge]
        if edge in ("left", "right"):
            self.play(c.animate(run_time=run_time).stretch_to_fit_width(1e-4, about_edge=keep))
        else:
            self.play(c.animate(run_time=run_time).stretch_to_fit_height(1e-4, about_edge=keep))
        self.remove(c)


class ProfitLossFormulas(PrintScene):
    """Key Concepts 3: profit/loss formulas, then Selling = Cost × (1 ± %)."""

    BOOK, PAGE = "jm03b", 1

    def construct(self):
        title = self.cover(40.0, 218.0, 165.0, 245.0)
        profit = self.cover(55.0, 250.0, 520.0, 295.0)
        profit_pct = self.cover(55.0, 295.0, 520.0, 365.0)
        loss = self.cover(55.0, 365.0, 520.0, 415.0)
        loss_pct = self.cover(55.0, 415.0, 520.0, 485.0)
        selling = self.cover(55.0, 485.0, 540.0, 575.0)
        self.wait(0.25)

        self.wipe(title, 0.6)
        self.wipe(profit, 0.9)
        r = self.ring(70.0, 255.0, 510.0, 290.0, GREEN)
        self.play(Create(r), run_time=0.5)
        self.wipe(profit_pct, 1.0)
        self.play(FadeOut(r), run_time=0.4)

        self.wipe(loss, 0.9)
        r = self.ring(70.0, 370.0, 510.0, 410.0, RED)
        self.play(Create(r), run_time=0.5)
        self.wipe(loss_pct, 1.0)
        self.play(FadeOut(r), run_time=0.4)

        self.wipe(selling, 1.2)
        tags = [
            self.ring(200.0, 505.0, 280.0, 555.0, PURPLE),
            self.ring(310.0, 505.0, 380.0, 555.0, RED),
            self.ring(400.0, 500.0, 530.0, 565.0, ORANGE),
        ]
        self.play(*[Create(t) for t in tags], run_time=0.7)
        self.wait(0.5)
        self.play(FadeOut(VGroup(*tags)), run_time=0.5)
        self.wait(1.0)


class CostMarkedSelling(PrintScene):
    """Key Concepts 4: Cost → Marked → Selling, with profit/loss and discount."""

    BOOK, PAGE = "jm03b", 4

    def construct(self):
        title = self.cover(40.0, 70.0, 165.0, 110.0)
        bracket = self.cover(160.0, 70.0, 480.0, 120.0)
        cost = self.cover(55.0, 120.0, 200.0, 200.0)
        marked = self.cover(220.0, 120.0, 370.0, 200.0)
        selling = self.cover(390.0, 120.0, 545.0, 200.0)
        discount = self.cover(280.0, 200.0, 520.0, 255.0)
        self.wait(0.25)

        self.wipe(title, 0.6)
        self.wipe(cost, 0.9)
        self.wipe(marked, 0.9)
        self.wipe(selling, 0.9)
        self.wipe(bracket, 1.0)
        r = self.ring(170.0, 72.0, 470.0, 115.0, GREEN)
        self.play(Create(r), run_time=0.6)
        self.wipe(discount, 1.0)
        self.play(FadeOut(r), run_time=0.4)
        d = self.ring(300.0, 210.0, 500.0, 250.0, BLUE)
        self.play(Create(d), run_time=0.6)
        self.wait(0.5)
        self.play(FadeOut(d), run_time=0.4)
        self.wait(1.0)
