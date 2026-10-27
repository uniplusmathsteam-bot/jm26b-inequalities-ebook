"""Manim scenes for M211 Introduction to Vectors (4).

Same conventions as jm29.py: REGION is the rectangle the video covers on the page
and every coordinate below is in page points. The two page-1 scenes end on the
printed panel exactly (it becomes the poster). The q13 scene sits in blank space
under the answer and ends on the general formula, not the numbers, so its poster
does not give the answer away.
"""

import numpy as np
from manim import (
    BOLD, ITALIC, NORMAL, PI, Arc, Create, DashedLine, FadeIn, FadeOut, Indicate, Line, MathTex,
    Polygon, Rotate, Text, Transform, TransformFromCopy, VGroup, Write,
)

from jm29 import BLUE, GREEN, GREY, INK, RED, PageScene

CMATH = "Cambria Math"
CAMBRIA = "Cambria"
CALIBRI = "Calibri"
IMPACT_FILE = "C:/Windows/Fonts/impact.ttf"  # Pango cannot load Impact, so the title is drawn from its outlines

VRED = "#b81414"
VBLUE = "#1f5a96"
GLOW_RED = "#f2b0b0"
GLOW_BLUE = "#bbc4e8"
GLOW_GREEN = "#b0e6bd"
PURPLE = "#7a3fc0"
ORANGE = "#e46c0a"
FILL_BLUE = "#cfe0ff"
FILL_RED = "#ffc9c9"
FILL_GREEN = "#c9f2d4"


class VectorScene(PageScene):
    """PageScene plus text calibrated to printed widths, glowing edges, vectors and dash-dot frames."""

    def setup(self):
        super().setup()
        self._em = {}

    # ---------- text ----------

    def calib(self, ref, width, pt, font=CMATH, weight=NORMAL, slant=NORMAL):
        """Fixes the scale of a font so that `ref` set at `pt` is `width` points wide, as printed."""
        t = Text(ref, font=font, weight=weight, slant=slant, font_size=48, disable_ligatures=True)
        self._em[(font, weight, slant)] = width * self.k / t.width / pt

    def calib_cap(self, cap, font=CALIBRI, weight=NORMAL, slant=NORMAL):
        """Scale a font from its cap height (a fraction of the point size) when no printed width is at hand."""
        t = Text("H", font=font, weight=weight, slant=slant, font_size=48)
        self._em[(font, weight, slant)] = cap * self.k / t.height

    def outline(self, s, font_file, x0, x1, top, color=INK):
        """Text drawn from the font file's glyph outlines, for faces Pango cannot load. Fitted to the printed ink width."""
        import hashlib
        from pathlib import Path

        from fontTools.pens.svgPathPen import SVGPathPen
        from fontTools.pens.transformPen import TransformPen
        from fontTools.ttLib import TTFont
        from manim import SVGMobject

        font = TTFont(font_file)
        glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
        pen, x = SVGPathPen(glyphs), 0
        for ch in s:
            name = cmap[ord(ch)]
            glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
            x += hmtx[name][0]
        svg = f'<svg xmlns="http://www.w3.org/2000/svg"><path d="{pen.getCommands()}" fill="#000"/></svg>'
        path = Path(__file__).resolve().parents[1] / "_manim" / f"outline_{hashlib.md5(svg.encode()).hexdigest()[:12]}.svg"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(svg, encoding="utf-8")
        mob = SVGMobject(str(path), stroke_width=0, fill_color=color, fill_opacity=1)
        mob.scale_to_fit_width((x1 - x0) * self.k)
        mob.shift(self.P(x0, top) - np.array([mob.get_left()[0], mob.get_top()[1], 0]))
        return mob

    def ptext(self, s, x, base, pt, font=CMATH, weight=NORMAL, slant=NORMAL, color=INK, t2c=None, center=False, ref=None):
        """Text at `pt` with its left ink edge (or centre) at x and its baseline at `base`.
        `ref` names the glyph that sits on the baseline when the most common bottom would be a descender."""
        key = (font, weight, slant)
        t = Text(s, font=font, weight=weight, slant=slant, font_size=48, color=color, t2c=t2c or {}, disable_ligatures=True)
        t.scale(self._em[key] * pt)
        target = self.P(x, base)
        dx = target[0] - (t.get_center()[0] if center else t.get_left()[0])
        bottom = t[ref].get_bottom()[1] if ref is not None else self._baseline(t)
        t.shift(np.array([dx, target[1] - bottom, 0]))
        return t

    def right_x(self, mob):
        return self.c[0] + mob.get_right()[0] / self.k

    def top_y(self, mob):
        return self.c[1] - mob.get_top()[1] / self.k

    def bar(self, x, base, pt, width=0.9, color=INK):
        return self.line((x, base - 1.02 * pt), (x, base + 0.27 * pt), color, width)

    def overarrow(self, x0, x1, y, color=INK, width=0.8, tip=2.6):
        shaft = self.line((x0, y), (x1 - tip * 0.6, y), color, width)
        head = Polygon(self.P(x1, y), self.P(x1 - tip, y - tip * 0.42), self.P(x1 - tip, y + tip * 0.42),
                       color=color, fill_color=color, fill_opacity=1, stroke_width=self.w(0.3))
        return VGroup(shaft, head)

    def row(self, parts, x, base, pt):
        """One line of mixed pieces on a baseline. Each part is (kind, text, color):
        m = Cambria Math, v = vector name with an arrow over it, | = modulus bar,
        w = Calibri word, f = fraction "1/2", _ = a space of `text` points."""
        out = VGroup()
        cur = x
        for kind, s, color in parts:
            color = color or INK
            if kind == "_":
                cur += float(s)
                continue
            if kind == "|":
                out.add(self.bar(cur + 0.6, base, pt, color=color))
                cur += 1.6
                continue
            if kind == "f":
                num, den = s.split("/")
                n = self.ptext(num, cur + 4.4, base - 0.36 * pt, pt * 0.87, center=True, color=color)
                d = self.ptext(den, cur + 4.4, base + 0.70 * pt, pt * 0.87, center=True, color=color)
                out.add(n, d, self.line((cur, base - 0.17 * pt), (cur + 8.8, base - 0.17 * pt), color, 0.8))
                cur += 9.5
                continue
            if kind == "v":
                t = self.ptext(s, cur, base, pt, font=CAMBRIA, weight=BOLD, slant=ITALIC, color=color)
                x0, x1 = cur + 0.06 * pt, self.right_x(t) + 0.02 * pt
                out.add(t, self.overarrow(x0, x1, base - 0.92 * pt))
            else:
                font = CALIBRI if kind == "w" else CMATH
                t = self.ptext(s, cur, base, pt, font=font, color=color)
                out.add(t)
            cur = self.right_x(t) + 1.2
        return out

    # ---------- drawing ----------

    def dashdot(self, x0, y0, x1, y1, width=1.5, pattern=(12, 4.5, 1.5, 4.5)):
        out = VGroup()
        pts = [(x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)]
        for (ax, ay), (bx, by) in zip(pts, pts[1:]):
            length = float(np.hypot(bx - ax, by - ay))
            ux, uy = (bx - ax) / length, (by - ay) / length
            s, i = 0.0, 0
            while s < length - 1e-6:
                seg = pattern[i % len(pattern)]
                if i % 2 == 0:
                    e = min(s + seg, length)
                    out.add(self.line((ax + ux * s, ay + uy * s), (ax + ux * e, ay + uy * e), INK, width))
                s += seg
                i += 1
        return out

    def glow(self, a, b, color, width=6.7, dashed=False, dash=7.0):
        if dashed:
            g = DashedLine(self.P(*a), self.P(*b), color=color, stroke_width=self.w(width), dash_length=dash * self.k)
        else:
            g = Line(self.P(*a), self.P(*b), color=color, stroke_width=self.w(width))
        g.set_stroke(opacity=0.85)
        return g

    def edge(self, a, b, glow=None, color=INK, width=2.7):
        out = VGroup()
        if glow:
            out.add(self.glow(a, b, glow))
        out.add(self.line(a, b, color, width))
        return out

    def vec(self, a, b, glow=None, color=INK, width=2.7, tip=10.0):
        """Arrow a → b with a filled head whose point is at b."""
        a, b = np.array(a, float), np.array(b, float)
        d = (b - a) / np.linalg.norm(b - a)
        n = np.array([-d[1], d[0]])
        base = b - d * tip
        out = VGroup()
        if glow:
            out.add(self.glow(tuple(a), tuple(b), glow))
        out.add(self.line(tuple(a), tuple(b - d * tip * 0.5), color, width))
        out.add(Polygon(self.P(*b), self.P(*(base + n * tip * 0.42)), self.P(*(base - n * tip * 0.42)),
                        color=color, fill_color=color, fill_opacity=1, stroke_width=self.w(0.3)))
        return out

    def fill(self, *pts, color=FILL_BLUE, opacity=0.6):
        return Polygon(*[self.P(*p) for p in pts], stroke_width=0, fill_color=color, fill_opacity=opacity).set_z_index(-1).set_z_index(-1)

    def arc(self, v, p1, p2, r=10, color=INK, width=1.0):
        c = self.P(*v)
        a1 = np.arctan2(*(self.P(*p1) - c)[1::-1])
        a2 = np.arctan2(*(self.P(*p2) - c)[1::-1])
        d = (a2 - a1 + PI) % (2 * PI) - PI
        return Arc(radius=r * self.k, start_angle=a1, angle=d, arc_center=c, color=color, stroke_width=self.w(width))

    def tex(self, s, x, y, pt=11, color=INK, center=False):
        """MathTex with its cap height matched to `pt`, left edge (or centre) at x, centred on y."""
        if "_texcap" not in self._em:
            self._em["_texcap"] = MathTex(r"\mathrm{H}").height
        t = MathTex(s, color=color)
        t.scale(pt * 0.7 * self.k / self._em["_texcap"])
        target = self.P(x, y)
        dx = target[0] - (t.get_center()[0] if center else t.get_left()[0])
        t.shift(np.array([dx, target[1] - t.get_center()[1], 0]))
        return t


# ---------------------------------------------------------------- page 1, Area of Figures

class AreaOfFigures(VectorScene):
    """|AB × AD| is base × height of the parallelogram; the diagonal BD halves it."""

    A, B, C, D = (359.3, 663.3), (395.3, 598.3), (516.7, 598.3), (480.0, 663.3)

    def area_line(self, base, words, eq_x, bars, ab_x, times_x, ad_x, frac=None):
        """One printed formula line, every piece at its measured x. bars = (left x, right x, top, bottom)."""
        g = VGroup(*[self.ptext(s, x, base, 16, ref=0) for s, x in words], self.ptext("=", eq_x, base, 16))
        if frac:
            cx, num_base, den_base, bar_y, bx0, bx1 = frac
            g.add(self.ptext("1", cx, num_base, 16, center=True), self.ptext("2", cx, den_base, 16, center=True),
                  self.line((bx0, bar_y), (bx1, bar_y), INK, 0.8))
        left, right, top, bottom = bars
        g.add(self.line((left, top), (left, bottom), INK, 0.9), self.line((right, top), (right, bottom), INK, 0.9))
        for s, x, color in (("AB", ab_x, VRED), ("AD", ad_x, VBLUE)):
            t = self.ptext(s, x, base, 16, font=CAMBRIA, weight=BOLD, slant=ITALIC, color=color)
            g.add(t, self.overarrow(x + 0.8, self.right_x(t) + 0.6, base - 14.8))
        g.add(self.ptext("×", times_x, base, 16))
        return g

    def construct(self):
        A, B, C, D = self.A, self.B, self.C, self.D
        self.calib("𝐴𝑟𝑒𝑎", 35.7, 16)
        self.calib("AB", 21.5, 16, font=CAMBRIA, weight=BOLD, slant=ITALIC)
        self.calib_cap(0.644)

        frame = self.dashdot(337.3, 553.4, 560.0, 757.7, width=1.3, pattern=(5, 4, 1.3, 4))
        title = self.outline("Area of Figures", IMPACT_FILE, 342.7, 474.3, 558.3)
        self.play(Create(frame), FadeIn(title, shift=self.P(0, 0) - self.P(0, 4)), run_time=1.2)

        names = {k: self.ptext(s, x, base, 18, center=True) for k, s, x, base in (
            ("A", "𝐴", 349.0, 680.7), ("B", "𝐵", 395.35, 591.7), ("C", "𝐶", 520.85, 592.7), ("D", "𝐷", 474.5, 682.0))}
        ab = self.vec(A, B, GLOW_RED)
        ad = self.vec(A, D, GLOW_BLUE)
        self.play(FadeIn(names["A"]), run_time=0.3)
        self.play(Create(ab), FadeIn(names["B"]), run_time=0.9)
        self.play(Create(ad), FadeIn(names["D"]), run_time=0.9)
        theta = VGroup(self.arc(A, D, B, 12, INK, 1.0), self.ptext("𝜃", 377.0, 657.0, 12, center=True))
        self.play(Create(theta), run_time=0.6)

        bc = self.edge(B, C, GLOW_BLUE)
        dc = self.edge(D, C, GLOW_RED)
        self.play(TransformFromCopy(ad, bc), TransformFromCopy(ab, dc), FadeIn(names["C"]), run_time=1.2)

        # height and base: cut the triangle off one end and move it to the other
        H = (B[0], A[1])
        H2 = (C[0], D[1])
        h_line = self.dashed(B, H, GREY, 1.1, 3)
        h_mark = self.right(H, B, D, 5, GREY, GREY)
        h_name = self.ptext("ℎ", 400.0, 640.0, 13, color=GREY)
        para = self.fill(A, B, C, D, color=FILL_BLUE, opacity=0.55)
        self.play(FadeIn(para), Create(h_line), FadeIn(h_mark), FadeIn(h_name), run_time=0.9)
        cut = self.fill(A, B, H, color=FILL_RED, opacity=0.9)
        self.play(FadeIn(cut), run_time=0.4)
        shift = self.P(*D) - self.P(*A)
        rect_outline = VGroup(self.dashed(D, H2, GREY, 1.1, 3), self.dashed(C, H2, GREY, 1.1, 3))
        self.play(cut.animate.shift(shift), Create(rect_outline), run_time=1.3)

        w1 = self.ptext("Area = base × height", 345.0, 707.0, 14, font=CALIBRI)
        w2 = self.row([("m", "=", None), ("_", 2, None), ("|", "", None), ("v", "AD", VBLUE), ("|", "", None), ("_", 2, None),
                       ("|", "", None), ("v", "AB", VRED), ("|", "", None), ("m", "sin 𝜃", None)], 345.0, 726.0, 13)
        w3 = self.row([("m", "=", None), ("_", 2, None), ("|", "", None), ("v", "AB", VRED), ("m", "×", None),
                       ("v", "AD", VBLUE), ("|", "", None)], 345.0, 746.0, 13)
        self.play(Write(w1), run_time=0.9)
        self.play(Write(w2), Indicate(h_name, color=RED), run_time=1.2)
        self.play(Write(w3), run_time=0.9)
        self.wait(0.8)

        line1 = self.area_line(707.3, [("𝐴𝑟𝑒𝑎", 344.3), ("𝑜𝑓", 385.3), ("𝐴𝐵𝐶𝐷", 406.7)], 455.7,
                               (473.9, 543.0, 691.0, 712.7), 476.3, 504.0, 518.0)
        self.play(FadeOut(cut), FadeOut(rect_outline), FadeOut(VGroup(w1, w2)), Transform(w3, line1), run_time=1.0)
        self.play(FadeOut(VGroup(h_line, h_mark, h_name)), run_time=0.4)

        # the diagonal makes two congruent triangles
        dash = dict(dash_length=9.9 * self.k, dashed_ratio=0.65)
        bd_glow = DashedLine(self.P(*B), self.P(*D), color=GLOW_GREEN, stroke_width=self.w(6.7), **dash).set_stroke(opacity=0.85)
        bd = VGroup(bd_glow, DashedLine(self.P(*B), self.P(*D), color=INK, stroke_width=self.w(2.7), **dash))
        self.play(Create(bd), run_time=0.8)
        half = self.fill(A, B, D, color=FILL_GREEN, opacity=0.9)
        self.play(FadeOut(para), FadeIn(half), run_time=0.6)
        mid = ((B[0] + D[0]) / 2, (B[1] + D[1]) / 2)
        twin = half.copy()
        self.play(Rotate(twin, PI, about_point=self.P(*mid)), run_time=1.3)
        line2 = self.area_line(741.3, [("𝐴𝑟𝑒𝑎", 344.3), ("𝑜𝑓", 385.3), ("∆𝐴𝐵𝐷", 407.0)], 455.7,
                               (485.8, 555.0, 725.0, 746.7), 488.2, 516.0, 530.0,
                               frac=(476.35, 729.6, 752.3, 735.2, 471.7, 481.0))
        self.play(Write(line2), run_time=1.4)
        self.play(FadeOut(half), FadeOut(twin), FadeOut(theta), run_time=0.7)
        self.wait(2)


# ---------------------------------------------------------------- page 1, Properties item 6

class CrossDotIdentity(VectorScene):
    """Property 6 from |a × b| = |a||b| sin θ, a · b = |a||b| cos θ and sin²θ + cos²θ = 1."""

    ITEMS = [
        (579.3, "𝐚 × 𝐛 = −(𝐛 × 𝐚)", 135.1),
        (614.6, "(𝑘𝐚) × 𝐛 = 𝑘(𝐚 × 𝐛) = 𝐚 × (𝑘𝐛)", 247.0),
        (651.3, "𝐚 × (𝐛 + 𝐜) = 𝐚 × 𝐛 + 𝐚 × 𝐜", 212.8),
        (687.3, "(𝐚 + 𝐛) × 𝐜 = 𝐚 × 𝐜 + 𝐛 × 𝐜", 211.6),
        (723.3, "𝐚 × 𝐛 = 𝟎 ⟺ 𝐚 // 𝐛", 153.6),
    ]

    def construct(self):
        self.calib("Properties", 77.5, 18, font=CALIBRI, weight=BOLD)
        self.calib("𝐚 × 𝐛 = −(𝐛 × 𝐚)", 135.1, 18)
        self.calib_cap(0.644)
        self.calib_cap(0.667, font=CAMBRIA, weight=BOLD)

        frame = self.dashdot(30.8, 514.6, 318.8, 776.4)
        title = self.ptext("Properties", 38.6, 543.3, 18, font=CALIBRI, weight=BOLD)
        items = VGroup()
        for i, (base, s, _) in enumerate(self.ITEMS):
            items.add(VGroup(self.ptext(f"{i + 1}.", 38.6, base, 18, font=CALIBRI, weight=BOLD), self.ptext(s, 61.6, base, 18)))
        self.play(Create(frame), Write(title), run_time=1.0)
        self.play(FadeIn(items, lag_ratio=0.15), run_time=1.2)
        self.wait(0.5)
        self.play(FadeOut(items), run_time=0.6)

        # a and b with the angle between them
        O, a_end, b_end = (222.0, 612.0), (306.0, 612.0), (258.0, 562.0)
        a_vec = self.vec(O, a_end, color=BLUE, width=1.6, tip=7)
        b_vec = self.vec(O, b_end, color=RED, width=1.6, tip=7)
        a_name = self.ptext("𝐚", 266.0, 625.0, 15, color=BLUE, center=True)
        b_name = self.ptext("𝐛", 230.0, 588.0, 15, color=RED, center=True)
        th = VGroup(self.arc(O, a_end, b_end, 14, INK, 1.0), self.ptext("𝜃", 243.0, 605.0, 12, center=True))
        self.play(Create(a_vec), Create(b_vec), FadeIn(a_name), FadeIn(b_name), run_time=1.0)
        self.play(Create(th), run_time=0.5)

        pt = 15
        s1 = self.ptext("|𝐚 × 𝐛| = |𝐚||𝐛| sin 𝜃", 40.0, 577.0, pt, t2c={"sin 𝜃": RED})
        s2 = self.ptext("𝐚 ∙ 𝐛 = |𝐚||𝐛| cos 𝜃", 40.0, 604.0, pt, t2c={"cos 𝜃": BLUE})
        self.play(Write(s1), run_time=1.0)
        self.play(Write(s2), run_time=1.0)
        hint = self.ptext("square both and add", 40.0, 628.0, 12, font=CALIBRI, color=GREY)
        self.play(FadeIn(hint), run_time=0.4)
        s3 = self.ptext("|𝐚 × 𝐛|² + (𝐚 ∙ 𝐛)²", 40.0, 652.0, pt)
        s4 = self.ptext("= |𝐚|²|𝐛|² sin²𝜃 + |𝐚|²|𝐛|² cos²𝜃", 40.0, 677.0, pt, t2c={"sin²𝜃": RED, "cos²𝜃": BLUE})
        s5 = self.ptext("= |𝐚|²|𝐛|² (sin²𝜃 + cos²𝜃)", 40.0, 702.0, pt, t2c={"sin²𝜃": RED, "cos²𝜃": BLUE})
        s6 = self.ptext("= |𝐚|²|𝐛|²", 40.0, 727.0, pt)
        note = self.ptext("sin²𝜃 + cos²𝜃 = 1", 200.0, 727.0, 12, color=GREY)
        self.play(Write(s3), run_time=0.9)
        self.play(Write(s4), run_time=1.3)
        self.play(Write(s5), run_time=1.1)
        self.play(Write(s6), FadeIn(note), run_time=1.0)
        self.wait(0.6)

        six = self.item_six()
        num, lhs, rhs, minus = six
        self.play(FadeIn(num), TransformFromCopy(s3[:6], lhs), TransformFromCopy(s6, rhs), run_time=1.2)
        self.play(TransformFromCopy(s3[7:], minus), run_time=1.0)
        self.play(Indicate(six, color=RED, scale_factor=1.04), run_time=0.9)
        self.play(FadeOut(VGroup(s1, s2, s3, s4, s5, s6, hint, note, a_vec, b_vec, a_name, b_name, th)), run_time=0.7)
        self.play(FadeIn(items, lag_ratio=0.1), run_time=0.8)
        self.wait(2)

    def item_six(self):
        """Item 6 piece by piece at the printed positions: number, |a × b|², = |a|²|b|², −(a · b)²."""
        two = lambda x: self.ptext("2", x + 0.4, 753.1, 12.96, font=CAMBRIA, weight=BOLD)
        num = self.ptext("6.", 38.6, 759.7, 18, font=CALIBRI, weight=BOLD)
        lhs = VGroup(self.ptext("|𝐚 × 𝐛|", 63.7, 759.3, 18, ref=1), two(114.7))
        rhs = VGroup(self.ptext("=", 129.7, 756.7, 18), self.ptext("|𝐚|", 148.7, 759.3, 18, ref=1), two(168.0),
                     self.ptext("|𝐛|", 178.7, 759.3, 18, ref=1), two(198.9))
        minus = VGroup(self.ptext("−", 212.7, 754.7, 18), self.ptext("(𝐚 ∙ 𝐛)", 230.3, 759.3, 18, ref=1), two(276.9))
        return VGroup(num, lhs, rhs, minus)


# ---------------------------------------------------------------- page 10, q13 projection onto AB × AC

class ProjectionOnNormal(VectorScene):
    """The tetrahedron of q13 drawn to scale. The projection of AD onto the normal AB × AC is its height."""

    PTS = {"A": (-1, 2, 3), "B": (2, -1, 2), "C": (1, 1, 4), "D": (2, -2, 5)}
    ORIGIN = (130.0, 748.0)
    SCALE = 30.0

    def setup(self):
        super().setup()
        A = np.array(self.PTS["A"], float)
        ab = np.array(self.PTS["B"], float) - A
        ac = np.array(self.PTS["C"], float) - A
        n = np.cross(ab, ac)
        e1 = ab / np.linalg.norm(ab)
        e3 = n / np.linalg.norm(n)
        e2 = np.cross(e3, e1)
        self.frame3 = (A, e1, e2, e3)

    def S(self, p):
        """A point given in plane coordinates (x along AB, y across, z along the normal) on the page."""
        x, y, z = p
        phi, eps = np.radians(-28), np.radians(22)
        sx = x * np.cos(phi) - y * np.sin(phi)
        depth = x * np.sin(phi) + y * np.cos(phi)
        sy = z * np.cos(eps) + depth * np.sin(eps)
        return (self.ORIGIN[0] + self.SCALE * sx, self.ORIGIN[1] - self.SCALE * sy)

    def W(self, name):
        A, e1, e2, e3 = self.frame3
        d = np.array(self.PTS[name], float) - A
        return self.S((d @ e1, d @ e2, d @ e3))

    def construct(self):
        self.calib("𝐴", 8.6, 13)
        self.calib("projection", 52.0, 11, font=CALIBRI)
        A, e1, e2, e3 = self.frame3
        dD = np.array(self.PTS["D"], float) - A
        h = dD @ e3
        a, b, c, d = self.W("A"), self.W("B"), self.W("C"), self.W("D")
        p = self.S((0, 0, h))
        f = self.S((dD @ e1, dD @ e2, 0))
        tip = self.S((0, 0, h + 1.5))

        plane = self.fill(self.S((-0.8, -0.9, 0)), self.S((5.4, -0.9, 0)), self.S((5.4, 3.1, 0)), self.S((-0.8, 3.1, 0)),
                          color="#e8edf5", opacity=1)
        base = VGroup(self.fill(a, b, c, color=FILL_BLUE, opacity=0.9), self.poly(a, b, c, color=INK, width=1.3))
        labels = {
            "A": self.ptext("𝐴", a[0] - 9, a[1] + 6, 13, center=True),
            "B": self.ptext("𝐵", b[0] + 4, b[1] + 13, 13, center=True),
            "C": self.ptext("𝐶", c[0] + 3, c[1] + 15, 13, center=True),
            "D": self.ptext("𝐷", d[0] + 9, d[1] - 3, 13, center=True),
        }
        cap = self.ptext("plane 𝐴𝐵𝐶", 70.0, 800.0, 11, color=GREY)
        self.play(FadeIn(plane), Create(base), FadeIn(labels["A"]), FadeIn(labels["B"]), FadeIn(labels["C"]), FadeIn(cap), run_time=1.2)

        n_arrow = self.vec(a, tip, color=GREEN, width=1.6, tip=7)
        n_name = self.tex(r"\mathbf{n}=\overrightarrow{AB}\times\overrightarrow{AC}", tip[0] + 6, tip[1] + 2, 10, GREEN)
        perp = VGroup(self.right(a, tip, b, 5, GREEN, GREEN), self.right(a, tip, c, 5, GREEN, GREEN))
        x0 = 330.0
        l1 = self.tex(r"\mathbf{n}=\overrightarrow{AB}\times\overrightarrow{AC}\ \perp\ \text{plane }ABC", x0, 612, 10.5)
        self.play(Create(n_arrow), Write(n_name), run_time=1.0)
        self.play(FadeIn(perp), Write(l1), run_time=1.0)

        ad = self.vec(a, d, color=PURPLE, width=1.6, tip=7)
        self.play(Create(ad), FadeIn(labels["D"]), run_time=1.0)
        phi = VGroup(self.arc(a, tip, d, 16, PURPLE, 1.0), self.tex(r"\phi", a[0] + 9, a[1] - 22, 9, PURPLE, center=True))
        self.play(Create(phi), run_time=0.5)

        drop = self.dashed(d, p, GREY, 1.1, 3)
        foot = self.right(p, a, d, 5, GREY, GREY)
        proj = self.vec(a, p, color=ORANGE, width=3.0, tip=8)
        proj_name = self.ptext("projection", a[0] - 54, (a[1] + p[1]) / 2 + 4, 11, font=CALIBRI, color=ORANGE)
        self.play(Create(drop), FadeIn(foot), run_time=0.8)
        self.play(Create(proj), FadeIn(proj_name), run_time=0.9)
        l2 = self.tex(r"\text{length} = |\overrightarrow{AD}|\cos\phi = \dfrac{\overrightarrow{AD}\cdot\mathbf{n}}{|\mathbf{n}|}", x0, 648, 10.5)
        l3 = self.tex(r"\text{projection of }\overrightarrow{AD}\text{ onto }\mathbf{n} = \left(\dfrac{\overrightarrow{AD}\cdot\mathbf{n}}{|\mathbf{n}|}\right)\dfrac{\mathbf{n}}{|\mathbf{n}|}", x0, 694, 10.5)
        self.play(Write(l2), run_time=1.2)
        self.play(Write(l3), run_time=1.4)
        self.wait(0.6)

        # the same length is the height of the tetrahedron above ABC
        faces = VGroup(self.fill(a, b, d, color=PURPLE, opacity=0.08), self.fill(a, c, d, color=PURPLE, opacity=0.08),
                       self.dashed(d, b, INK, 0.9, 3), self.dashed(d, c, INK, 0.9, 3))
        self.play(FadeIn(faces), run_time=0.8)
        height = proj.copy()
        self.play(height.animate.shift(self.P(*d) - self.P(*p)), run_time=1.2)
        f_mark = self.right(f, d, b, 5, ORANGE, ORANGE)
        h_name = self.ptext("height", d[0] + 6, (d[1] + f[1]) / 2 + 4, 11, font=CALIBRI, color=ORANGE)
        l4 = self.tex(r"\text{height of tetrahedron }ABCD = |\text{projection}|", x0, 742, 10.5, ORANGE)
        self.play(FadeIn(f_mark), FadeIn(h_name), Write(l4), run_time=1.1)
        l5 = self.tex(r"\text{volume} = \dfrac{1}{3}\times\text{area of }\triangle ABC\times\text{height}", x0, 775, 10.5)
        self.play(Write(l5), run_time=1.1)
        self.wait(2)
