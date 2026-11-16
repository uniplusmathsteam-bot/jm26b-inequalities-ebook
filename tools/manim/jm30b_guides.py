"""Solution guides for JM30 (B).

Q1–Q18 draw the tree or the table in the dialog, then mark the favourable
outcomes and write the probability as a stacked fraction. Q19 and Q20 keep
the printed board and map, and draw the grid, the routes and the tree as
lines on top of those pictures.
"""

import json
from pathlib import Path

import fitz
import numpy as np
from manim import (
    BOLD, NORMAL, Create, DashedLine, Dot, FadeIn, FadeOut, ImageMobject, LaggedStart, Rectangle,
    RoundedRectangle, VGroup, VMobject,
)

from guide import BLUE, GREEN, INK, PINK, RED, SERIF, Z_TEXT, GuideScene

ROOT = Path(__file__).resolve().parents[2]
SLATE = "#5c6b7a"
MISS = "#9aa8b5"

# Printed figure rectangles, page points (the embedded image on the QUE page).
BOARD = (460.50, 191.26, 572.20, 302.91)
MAP = (68.98, 98.09, 224.13, 207.00)


class FigGuide(GuideScene):
    """A guide whose figure is the printed picture, with vector lines over it."""

    PAGE = 1

    def picture(self, bbox, at, scale=1.0, edit=None):
        """The printed figure, top-left at canvas point `at`. Returns (image, page_to_canvas)."""
        x0, y0, x1, y1 = bbox
        book = json.loads((ROOT / "books" / "jm30b" / "book.json").read_text(encoding="utf-8"))
        doc = fitz.open(ROOT / "books" / "jm30b" / book["source"]["que"])
        page = doc[self.PAGE - 1]
        z = 8
        pix = page.get_pixmap(matrix=fitz.Matrix(z, z), clip=fitz.Rect(*bbox))
        doc.close()
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)[:, :, :3].copy()
        if edit:
            edit(img)
        w, h = (x1 - x0) * scale, (y1 - y0) * scale
        m = ImageMobject(img)
        m.stretch_to_fit_width(w * self.k).stretch_to_fit_height(h * self.k)
        m.move_to(self.P(at[0] + w / 2, at[1] + h / 2)).set_z_index(0)

        def loc(px, py):
            return (at[0] + (px - x0) * scale, at[1] + (py - y0) * scale)

        return m, loc

    def ink(self, a, b, width=1.15):
        """A grid line drawn over the photograph, so the stroke survives the video."""
        return self.seg(a, b, INK, width).set_z_index(2)

    def word(self, s, x, y, size=13, color=INK, weight=0, left=False):
        """A tree label. `page_left` / `page_right` are its ink edges, for the branches."""
        t = self._txt(s, (x, y), size, color, weight=BOLD if weight else NORMAL, font=SERIF).set_z_index(Z_TEXT)
        if left:
            t.shift(np.array([t.width / 2, 0, 0]))
            t.page_left = x
        else:
            t.page_left = x - t.width / self.k / 2
        t.page_right = t.page_left + t.width / self.k
        t.page_y = y
        return t

    def fraction(self, num, den, left, cy, size=16, color=RED):
        """A stacked fraction. The bar sits at page y `cy` and starts at `left`. Returns the group and its right edge."""
        top = self.word(str(num), 0, cy, size, color, weight=1)
        bot = self.word(str(den), 0, cy, size, color, weight=1)
        gap = 3.4
        bar_w = max(top.width, bot.width) / self.k + 8
        cx = left + bar_w / 2
        top.move_to(self.P(cx, cy - gap - top.height / self.k / 2))
        bot.move_to(self.P(cx, cy + gap + bot.height / self.k / 2))
        bar = self.seg((left, cy), (left + bar_w, cy), color, 1.15).set_z_index(2)
        return VGroup(top, bar, bot), left + bar_w

    def place_center(self, lab, cx, y):
        w = lab.width / self.k
        lab.move_to(self.P(cx, y))
        lab.page_left, lab.page_right, lab.page_y = cx - w / 2, cx + w / 2, y

    def place_left(self, lab, left, y):
        w = lab.width / self.k
        lab.move_to(self.P(left + w / 2, y))
        lab.page_left, lab.page_right, lab.page_y = left, left + w, y

    def answer_line(self, part, x, y):
        """(a)  stacked fraction = stacked fraction, in red. Returns the group and its right edge."""
        mobs = []
        if part.get("tag"):
            tag = self.word(part["tag"], x, y, 15, RED, weight=1, left=True)
            mobs.append(tag)
            x = tag.page_right + 8
        for i, (a, b) in enumerate(part["frac"]):
            if i:
                eq = self.word("=", x + 10, y, 15, RED, weight=1)
                mobs.append(eq)
                x = eq.page_right + 10
            group, x = self.fraction(a, b, x, y, size=15)
            mobs.append(group)
        return VGroup(*mobs), x

    def grow_tree(self, spec):
        """Grow a tree one stage at a time, then mark each part's outcomes and show the fraction."""
        paths = expand(spec["kids"])
        n, depth = len(paths), len(paths[0])
        outcomes = spec.get("outs") or [spec.get("sep", "").join(p) for p in paths]
        y0, dy = spec["y0"], spec["dy"]
        ys = [y0 + i * dy for i in range(n)]
        nodes, rows_of = {}, {}
        for i, path in enumerate(paths):
            for d in range(depth):
                key = tuple(path[:d + 1])
                rows_of.setdefault(key, []).append(i)
                nodes.setdefault(key, self.word(path[d], 0, 0, 14))
        heads = [self.word(c, 0, spec["head"], 12, weight=1) for c in spec["cols"]]
        outs = [self.word(text, 0, y, 13, left=True) for text, y in zip(outcomes, ys)]

        cursor, centers = 34, []
        for d in range(depth):
            w = max(heads[d].width, max(nodes[k].width for k in nodes if len(k) == d + 1)) / self.k
            centers.append(cursor + w / 2)
            cursor += w + 26
        out_left = cursor + 28
        out_w = max(heads[-1].width, max(m.width for m in outs)) / self.k
        for d in range(depth):
            for key, lab in nodes.items():
                if len(key) == d + 1:
                    y = sum(ys[i] for i in rows_of[key]) / len(rows_of[key])
                    self.place_center(lab, centers[d], y)
            self.place_center(heads[d], centers[d], spec["head"])
        self.place_center(heads[-1], out_left + out_w / 2, spec["head"])
        for mob, y in zip(outs, ys):
            self.place_left(mob, out_left, y)

        root_y = sum(nodes[k].page_y for k in nodes if len(k) == 1) / sum(1 for k in nodes if len(k) == 1)
        root = (centers[0] - (centers[0] - 34), root_y)  # the left edge of the first column
        root = (34 - 16, root_y)
        lines = [[] for _ in range(depth)]
        for key, lab in nodes.items():
            parent = root if len(key) == 1 else nodes[key[:-1]]
            lines[len(key) - 1].append(self.join(parent, lab))
        dashes = [self.join(nodes[tuple(path)], mob, dashed=True) for path, mob in zip(paths, outs)]

        self.add(*heads)
        self.wait(0.35)
        for d in range(depth):
            labs = [nodes[k] for k in nodes if len(k) == d + 1]
            self.show(lines[d], labs, run_time=0.65)
        self.show(dashes, outs, run_time=0.8)
        self.wait(0.25)
        self.finish(outs, outcomes, spec)

    def fill_table(self, spec):
        """Draw the grid, fill it row by row, cross out the impossible cells, then count."""
        rows = spec["rows"]
        nr, nc = len(rows), len(rows[0])
        labs = {}
        for r in range(nr):
            for c in range(nc):
                if rows[r][c]:
                    labs[(r, c)] = self.word(rows[r][c], 0, 0, 12, weight=1 if r == 0 or c == 0 else 0)
        col_w = []
        for c in range(nc):
            w = max(labs[(r, c)].width / self.k for r in range(nr) if (r, c) in labs)
            col_w.append(max(w + 16, 30))
        x0, y0, rh = 22, 18, 24
        xs = [x0]
        for w in col_w:
            xs.append(xs[-1] + w)
        ys = [y0 + r * rh for r in range(nr + 1)]
        grid = [self.ink((x, ys[0]), (x, ys[-1]), 1.0) for x in xs]
        grid += [self.ink((xs[0], y), (xs[-1], y), 1.0) for y in ys]
        for (r, c), lab in labs.items():
            self.place_center(lab, (xs[c] + xs[c + 1]) / 2, (ys[r] + ys[r + 1]) / 2)
        heads = [labs[(r, c)] for r, c in labs if r == 0 or c == 0]
        self.add(*grid, *heads)
        self.wait(0.35)
        for r in range(1, nr):
            body = [labs[(r, c)] for c in range(1, nc) if (r, c) in labs]
            if body:
                self.play(LaggedStart(*[FadeIn(m) for m in body], lag_ratio=0.04), run_time=0.4)
        crosses = {}
        for r, c in spec.get("strike", ()):
            crosses[(r, c)] = self.cross(xs[c + 1], ys[r + 1], xs[c + 2], ys[r + 2])
        if crosses:
            self.play(*[FadeIn(g) for g in crosses.values()], run_time=0.45)
        body_mobs = [labs[(r, c)] for r in range(1, nr) for c in range(1, nc) if (r, c) in labs]
        body_text = [rows[r][c] for r in range(1, nr) for c in range(1, nc) if rows[r][c]]
        # A part may cross out more cells before its count.
        spec = {**spec, "_xs": xs, "_ys": ys, "_rows": rows, "_labs": labs}
        self._table = spec
        self.wait(0.2)
        self.finish(body_mobs, body_text, spec)

    def cross(self, x0, y0, x1, y1):
        pad = 4.5
        a = self.seg((x0 + pad, y0 + pad), (x1 - pad, y1 - pad), RED, 1.25).set_z_index(4)
        b = self.seg((x0 + pad, y1 - pad), (x1 - pad, y0 + pad), RED, 1.25).set_z_index(4)
        return VGroup(a, b)

    def finish(self, mobs, texts, spec):
        """Colour one part's outcomes at a time and write its stacked fraction."""
        x = spec.get("ax", 22)
        y = spec["frac"]
        shown = None
        marks = (PINK, GREEN, BLUE)
        for i, part in enumerate(spec["parts"]):
            extra = []
            for word in part.get("strike", ()):
                for r in range(1, len(spec["_rows"])):
                    for c in range(1, len(spec["_rows"][0])):
                        if spec["_rows"][r][c] == word and (r, c) in spec["_labs"]:
                            box = self.cross(spec["_xs"][c], spec["_ys"][r], spec["_xs"][c + 1], spec["_ys"][r + 1])
                            extra += [FadeOut(spec["_labs"][(r, c)]), FadeIn(box)]
            want = set(part["hit"])
            color = marks[min(i, len(marks) - 1)]
            colors = [m.animate.set_color(color) for m, t in zip(mobs, texts) if t in want]
            group, right = self.answer_line(part, x if shown is None else shown, y)
            self.play(*colors, *extra, FadeIn(group), run_time=0.7)
            self.wait(1.3)
            shown = right + 18

    def _end(self, node, side, gap):
        if isinstance(node, tuple):
            return node
        x = node.page_left - gap if side == "left" else node.page_right + gap
        return (x, node.page_y)

    def join(self, a, b, gap=4, dashed=False):
        """A branch from the right of `a` to the left of `b`. A tuple is a bare point."""
        p, q = self._end(a, "right", gap), self._end(b, "left", gap)
        if dashed:
            line = DashedLine(self.P(*p), self.P(*q), color=SLATE, stroke_width=self.w(0.9), dash_length=2.6 * self.k)
        else:
            line = self.seg(p, q, INK, 1.05)
        return line.set_z_index(2)

    def show(self, *groups, run_time=0.7):
        """Branches are drawn; labels fade in. A label carries `page_y`."""
        anims = []
        for g in groups:
            for m in g:
                anims.append(FadeIn(m) if getattr(m, "page_y", None) is not None else Create(m))
        self.play(LaggedStart(*anims, lag_ratio=0.06), run_time=run_time)

    def tint(self, x0, y0, x1, y1, color, opacity=0.30):
        r = Rectangle(width=(x1 - x0) * self.k, height=(y1 - y0) * self.k, stroke_width=0,
                      fill_color=color, fill_opacity=opacity)
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2)).set_z_index(1)

    def ring(self, x0, y0, x1, y1, color):
        pad = 3.4
        r = RoundedRectangle(corner_radius=2 * self.k, width=(x1 - x0 - 2 * pad) * self.k,
                             height=(y1 - y0 - 2 * pad) * self.k, color=color, stroke_width=self.w(1.6))
        return r.move_to(self.P((x0 + x1) / 2, (y0 + y1) / 2)).set_z_index(4)


class Q19(FigGuide):
    """Paul to move in grid 1, 2 or 3. Two of the six lines win; grid 3 never does."""

    PAGE = 11
    REGION = (0, 0, 530, 300)

    def construct(self):
        def wipe_digits(img):
            """The printed 1, 2 and 3 are too pale to survive the video, so the cells are cleared."""
            h, w = img.shape[:2]
            x0, y0, x1, y1 = BOARD
            inset = 14

            def sl(p0, p1, a, b, n):
                u = int(round((p0 - a) / (b - a) * n)) + inset
                v = int(round((p1 - a) / (b - a) * n)) - inset
                return slice(u, v)

            for px0, py0, px1, py1 in ((497.69, 191.26, 534.88, 228.51),
                                       (497.69, 265.70, 534.88, 302.91),
                                       (534.88, 265.70, 572.20, 302.91)):
                img[sl(py0, py1, y0, y1, h), sl(px0, px1, x0, x1, w)] = 255

        pic, loc = self.picture(BOARD, (400, 86), edit=wipe_digits)
        # The print's four strokes, traced again so they stay sharp.
        vx = [loc(497.69, 0)[0], loc(534.88, 0)[0]]
        hy = [loc(0, 228.51)[1], loc(0, 265.70)[1]]
        left, right = loc(460.50, 191.26)[0], loc(572.20, 191.26)[0]
        top, bot = loc(460.50, 191.26)[1], loc(460.50, 302.91)[1]
        grid = VGroup(
            self.ink((left, hy[0]), (right, hy[0])), self.ink((left, hy[1]), (right, hy[1])),
            self.ink((vx[0], top), (vx[0], bot)), self.ink((vx[1], top), (vx[1], bot)),
        )
        cells = {
            1: (vx[0], top, vx[1], hy[0]),
            2: (vx[0], hy[1], vx[1], bot),
            3: (vx[1], hy[1], right, bot),
        }
        nums = VGroup(*[
            self.word(str(n), (x0 + x1) / 2, (y0 + y1) / 2, 16, "#767676")
            for n, (x0, y0, x1, y1) in cells.items()
        ])
        self.add(pic, grid, nums)
        self.wait(0.4)

        rings = VGroup(*[self.ring(*cells[n], BLUE) for n in (1, 2, 3)])
        self.play(FadeIn(rings), run_time=0.5)
        self.wait(0.3)

        ys = [64, 94, 124, 154, 184, 214]
        xs = [72, 136, 200]
        heads = VGroup(
            self.word("Paul", xs[0], 34, 12, weight=1),
            self.word("Tina", xs[1], 34, 12, weight=1),
            self.word("Paul", xs[2], 34, 12, weight=1),
            self.word("Possible Outcomes", 292, 34, 12, weight=1),
        )
        self.play(FadeIn(heads), run_time=0.4)

        # Same nesting as the worked tree: Paul's grid, Tina's grid, Paul's last grid.
        rows = [("1", "2", "3", "123 (Draw)", False),
                ("1", "3", "2", "132 (Paul wins)", True),
                ("2", "1", "3", "213 (Draw)", False),
                ("2", "3", "1", "231 (Paul wins)", True),
                ("3", "1", "2", "312 (Draw)", False),
                ("3", "2", "1", "321 (Draw)", False)]
        first, second, third, outs = {}, {}, [], []
        for (a, b, c, text, win), y in zip(rows, ys):
            first.setdefault(a, self.word(a, xs[0], 0))
            second.setdefault((a, b), self.word(b, xs[1], 0))
            third.append(self.word(c, xs[2], y))
            outs.append(self.word(text, 252, y, 12, GREEN if win else INK, left=True))
        # A shared label sits on the mean height of the rows it covers.
        def set_y(groups):
            for lab, covered in groups:
                lab.page_y = sum(ys[i] for i in covered) / len(covered)
                lab.move_to(self.P(lab.page_left + (lab.page_right - lab.page_left) / 2, lab.page_y))
        set_y([(first[a], [i for i, r in enumerate(rows) if r[0] == a]) for a in "123"])
        set_y([(second[k], [i for i, r in enumerate(rows) if (r[0], r[1]) == k]) for k in second])
        root_y = sum(first[a].page_y for a in "123") / 3
        root = (30, root_y)

        level1 = [self.join(root, first[a]) for a in "123"]
        level2 = [self.join(first[a], second[(a, b)]) for a, b in second]
        level3 = [self.join(second[(a, b)], th) for (a, b, c, _, _), th in zip(rows, third)]
        dashes = [self.join(th, out, dashed=True) for th, out in zip(third, outs)]

        self.play(FadeOut(rings), run_time=0.3)
        self.show(level1, list(first.values()), run_time=0.7)
        self.show(level2, list(second.values()), run_time=0.8)
        self.show(level3, third, run_time=0.7)
        self.show(dashes, outs, run_time=0.9)
        self.wait(0.4)

        # Both wins are the middle column: Paul takes grid 1 and grid 2.
        col = self.ring(vx[0], top, vx[1], bot, GREEN)
        self.play(FadeIn(col), run_time=0.5)
        y = 248
        two, x = self.fraction("2", "6", 28, y)
        eq = self.word("=", x + 12, y, 16, RED, weight=1)
        one, right = self.fraction("1", "3", eq.page_right + 12, y)
        self.play(FadeIn(VGroup(two, eq, one)), run_time=0.5)
        self.wait(1.1)

        # Grid 3 opens only draws.
        cell3 = self.ring(*cells[3], RED)
        three = first["3"]
        self.play(FadeIn(cell3), three.animate.set_color(RED), run_time=0.6)
        no = self.word("not grid 3", right + 18, y, 16, RED, weight=1, left=True)
        self.play(FadeIn(no), run_time=0.5)
        self.wait(1.4)


class Q20(FigGuide):
    """Two east and two south: six routes, four of them through T."""

    PAGE = 12
    REGION = (0, 0, 540, 300)

    def construct(self):
        pic, loc = self.picture(MAP, (14, 82))
        gx = [loc(x, 0)[0] for x in (87.17, 140.92, 195.29)]
        gy = [loc(0, y)[1] for y in (135.09, 164.90, 194.40)]
        grid = VGroup(*[self.ink((gx[0], y), (gx[2], y)) for y in gy],
                      *[self.ink((x, gy[0]), (x, gy[2])) for x in gx])
        A, P, Q = (gx[0], gy[0]), (gx[1], gy[0]), (gx[2], gy[0])
        R, T, S = (gx[0], gy[1]), (gx[1], gy[1]), (gx[2], gy[1])
        U, V, B = (gx[0], gy[2]), (gx[1], gy[2]), (gx[2], gy[2])
        self.add(pic, grid)
        self.wait(0.3)

        legend = VGroup(
            self.word("S  south", 14, 64, 12, BLUE, weight=1, left=True),
            self.word("E  east", 92, 64, 12, BLUE, weight=1, left=True),
        )
        self.play(FadeIn(legend), run_time=0.4)

        ys = [78, 104, 130, 156, 182, 208]
        xs = [236, 292, 348, 404]
        heads = VGroup(
            *[self.word(h, x, 46, 12, weight=1) for h, x in zip(("1st", "2nd", "3rd", "4th"), xs)],
            self.word("Possible Routes", 470, 46, 12, weight=1),
        )
        self.play(FadeIn(heads), run_time=0.4)

        # Letters along each route, and whether that route enters T.
        routes = [
            ("SSEE", [A, R, U, V, B], False),
            ("SESE", [A, R, T, V, B], True),
            ("SEES", [A, R, T, S, B], True),
            ("ESSE", [A, P, T, V, B], True),
            ("ESES", [A, P, T, S, B], True),
            ("EESS", [A, P, Q, S, B], False),
        ]
        # Node at each depth, keyed so a shared prefix is one label.
        nodes = [{} for _ in range(4)]
        outs, paths = [], []
        for (word, pts, hit), y in zip(routes, ys):
            for d, ch in enumerate(word):
                nodes[d].setdefault(word[:d + 1], self.word(ch, xs[d], 0))
            outs.append(self.word(word, 448, y, 13, PINK if hit else INK, left=True))
            paths.append(self.path_of(pts, PINK if hit else MISS))

        def place(table):
            for key, lab in table.items():
                covered = [i for i, (w, _, _) in enumerate(routes) if w.startswith(key)]
                lab.page_y = sum(ys[i] for i in covered) / len(covered)
                lab.move_to(self.P((lab.page_left + lab.page_right) / 2, lab.page_y))

        for table in nodes:
            place(table)
        root = (196, sum(nodes[0][k].page_y for k in nodes[0]) / len(nodes[0]))

        levels = []
        prev = {"": root}
        for d in range(4):
            lines, labels = [], []
            for key, lab in nodes[d].items():
                lines.append(self.join(prev[key[:-1]], lab))
                labels.append(lab)
            levels.append((lines, labels))
            prev = nodes[d]

        for lines, labels in levels:
            self.show(lines, labels, run_time=0.65)
        self.wait(0.2)

        hits = []
        for (word, _, hit), out, path, line_src in zip(routes, outs, paths, [nodes[3][w] for w, _, _ in routes]):
            dash = self.join(line_src, out, dashed=True)
            self.play(Create(dash), FadeIn(out), Create(path), run_time=0.55)
            if hit:
                hits.append(path)
        self.wait(0.3)

        y = 250
        six = self.word("6 routes", 14, y, 16, RED, weight=1, left=True)
        self.play(FadeIn(six), run_time=0.4)
        self.wait(0.8)

        # The four routes through T, drawn last so they cover a shared edge.
        again = [p.copy().set_z_index(1.5) for p in hits]
        dot = Dot(self.P(*T), radius=3.4 * self.k, color=PINK).set_z_index(3)
        self.play(*[Create(p) for p in again], FadeIn(dot), run_time=0.8)
        four, x = self.fraction("4", "6", six.page_right + 22, y)
        eq = self.word("=", x + 12, y, 16, RED, weight=1)
        two, x = self.fraction("2", "3", eq.page_right + 12, y)
        gt = self.word("> 0.5", x + 14, y, 16, RED, weight=1, left=True)
        claim = VGroup(four, eq, two, gt)
        self.play(FadeIn(claim), run_time=0.5)
        self.wait(1.4)

    def path_of(self, pts, color):
        m = VMobject(color=color, stroke_width=self.w(4.4), stroke_opacity=0.9)
        m.set_points_as_corners([self.P(*p) for p in pts])
        return m.set_z_index(1)


def expand(kids):
    """Every root-to-leaf path of a tree spec, in reading order."""
    rows = []

    def walk(n, path):
        if isinstance(n, (list, tuple)):
            label, sub = str(n[0]), (n[1] if len(n) > 1 else None)
        else:
            label, sub = str(n), None
        path = path + [label]
        if sub:
            for child in sub:
                walk(child, path)
        else:
            rows.append(path)

    for kid in kids:
        walk(kid, [])
    return rows


def grow(*stages):
    """Same branching as the worked solutions: every stage keeps the same choices."""
    if len(stages) == 1:
        return list(stages[0])
    return [[s, grow(*stages[1:])] for s in stages[0]]


def text_w(s, size):
    """A generous width, in page points, so the camera frame holds the real text."""
    return len(s) * size * 0.70 + 12


def tree_spec(cols, kids, parts, page, sep="", outs=None):
    paths = expand(kids)
    n, depth = len(paths), len(paths[0])
    outcomes = outs or [sep.join(p) for p in paths]
    dy = 20 if n > 8 else 23
    head, y0 = 20, 46
    frac = y0 + (n - 1) * dy + 34
    cursor = 34
    for d in range(depth):
        w = max(text_w(cols[d], 12), max(text_w(p[d], 14) for p in paths))
        cursor += w + 26
    out_w = max(text_w(cols[-1], 12), max(text_w(s, 13) for s in outcomes))
    width = max(cursor + 28 + out_w + 24, answer_width(parts))
    return {
        "page": page, "region": (0, 0, width, frac + 36), "cols": cols, "kids": kids,
        "sep": sep, "outs": outs, "parts": parts, "y0": y0, "dy": dy, "head": head,
        "frac": frac, "ax": 22,
    }


def table_spec(rows, parts, page, strike=()):
    nr, nc = len(rows), len(rows[0])
    width = 22
    for c in range(nc):
        w = max((text_w(rows[r][c], 12) for r in range(nr)), default=0) + 16
        width += max(w, 30)
    frac = 18 + nr * 24 + 32
    return {
        "page": page, "region": (0, 0, max(width + 28, answer_width(parts)), frac + 36),
        "rows": rows, "parts": parts, "strike": strike, "frac": frac, "ax": 22,
    }


def answer_width(parts):
    x = 22
    for part in parts:
        if part.get("tag"):
            x += text_w(part["tag"], 15) + 8
        for i, (a, b) in enumerate(part["frac"]):
            if i:
                x += 36
            x += max(text_w(str(a), 15), text_w(str(b), 15)) + 20
        x += 22
    return x + 16


def scene(name, kind, spec):
    def construct(self):
        (self.grow_tree if kind == "tree" else self.fill_table)(self.SPEC)

    return type(name, (FigGuide,), {
        "PAGE": spec["page"], "REGION": spec["region"], "SPEC": spec, "construct": construct,
    })


# ---------------------------------------------------------------- the other trees

Q1 = scene("Q1", "tree", tree_spec(
    ["Coin", "Card", "Possible Outcomes"], grow(["H", "T"], ["B", "W"]),
    [{"tag": "(b)", "hit": ["TB"], "frac": [("1", "4")]}], page=2))

Q2 = scene("Q2", "tree", tree_spec(
    ["John", "Sam", "Possible Outcomes"], grow(["$10", "$20", "$50"], ["$10", "$20"]),
    [{"tag": "(b)", "hit": ["$10, $10", "$20, $20"], "frac": [("2", "6"), ("1", "3")]}],
    page=2, sep=", "))

Q3 = scene("Q3", "tree", tree_spec(
    ["Alan", "Ben", "Possible Outcomes"], grow(["W", "B", "Y"], ["P", "W", "B"]),
    [{"tag": "(b)", "hit": ["WP", "WB", "BP", "BW", "YP", "YW", "YB"], "frac": [("7", "9")]}],
    page=2))

Q4 = scene("Q4", "tree", tree_spec(
    ["Letter", "Number", "Possible Outcomes"], grow(["X", "Y", "Z"], ["1", "2", "3"]),
    [
        {"tag": "(a)", "hit": ["X3"], "frac": [("1", "9")]},
        {"tag": "(b)", "hit": ["X2", "Y1", "Y2", "Y3", "Z2"], "frac": [("5", "9")]},
    ], page=3))

Q5 = scene("Q5", "tree", tree_spec(
    ["Dice", "Coin", "Possible Outcomes"], grow(["1", "2", "3", "4", "5", "6"], ["H", "T"]),
    [
        {"tag": "(i)", "hit": ["2H", "3H", "5H"], "frac": [("3", "12"), ("1", "4")]},
        {"tag": "(ii)", "hit": ["2T", "4T"], "frac": [("2", "12"), ("1", "6")]},
    ], page=3))

Q6 = scene("Q6", "tree", tree_spec(
    ["Tens", "Units", "Possible Outcomes"], [["6", ["7", "8"]], ["7", ["6", "8"]], ["8", ["6", "7"]]],
    [{"tag": "(b)", "hit": ["78", "87"], "frac": [("2", "6"), ("1", "3")]}], page=3))

Q11 = scene("Q11", "tree", tree_spec(
    ["1st ball", "2nd ball", "Possible Outcomes"],
    [["W", ["B1", "B2"]], ["B1", ["W", "B2"]], ["B2", ["W", "B1"]]],
    [
        {"tag": "(a)", "hit": ["B1W", "B1B2", "B2W", "B2B1"], "frac": [("4", "6"), ("2", "3")]},
        {"tag": "(b)", "hit": ["WB1", "WB2", "B1W", "B2W"], "frac": [("4", "6"), ("2", "3")]},
    ], page=6))

Q12 = scene("Q12", "tree", tree_spec(
    ["Tens", "Units", "Possible Outcomes"],
    [["1", ["3", "5", "7"]], ["3", ["1", "5", "7"]], ["5", ["1", "3", "7"]], ["7", ["1", "3", "5"]]],
    [
        {"tag": "(a)", "hit": ["15", "35", "75"], "frac": [("3", "12"), ("1", "4")]},
        {"tag": "(b)", "hit": ["13", "17", "31", "37", "53", "71", "73"], "frac": [("7", "12")]},
    ], page=6))

Q15 = scene("Q15", "tree", tree_spec(
    ["Daniel", "Ellen", "Frank", "Possible Outcomes"], grow(["Y", "N"], ["Y", "N"], ["Y", "N"]),
    [
        {"tag": "(a)", "hit": ["YYY"], "frac": [("1", "8")]},
        {"tag": "(b)", "hit": ["YYN", "YNY", "NYY"], "frac": [("3", "8")]},
    ], page=8))

Q16 = scene("Q16", "tree", tree_spec(
    ["1st", "2nd", "3rd", "Possible Outcomes"],
    grow(["true", "false"], ["true", "false"], ["A", "B", "C"]),
    [
        {"tag": "(a)", "hit": ["true, true, A", "true, true, B", "false, true, C", "false, false, A", "false, false, B"],
         "frac": [("5", "12")]},
        {"tag": "(b)", "hit": ["true, true, C", "true, false, A", "true, false, B", "false, false, C"],
         "frac": [("4", "12"), ("1", "3")]},
    ], page=8, sep=", "))

Q18 = scene("Q18", "tree", tree_spec(
    ["A to B", "B to C", "Possible Outcomes"], grow(["a", "b"], ["c", "d", "e"]),
    [
        {"tag": "(a)", "hit": ["ad  $55", "bd  $30"], "frac": [("2", "6"), ("1", "3")]},
        {"tag": "(b)", "hit": ["ac  $40", "ad  $55", "ae  $45"], "frac": [("3", "6"), ("1", "2")]},
    ], page=10, outs=["ac  $40", "ad  $55", "ae  $45", "bc  $15", "bd  $30", "be  $20"]))


# ---------------------------------------------------------------- the tables

def cross_table(labels, fill):
    """A header row, a header column, and one cell per pair."""
    return [["", *labels], *[[r, *[fill(r, c) for c in labels]] for r in labels]]


_SOCKS = ["W1", "W2", "B1", "B2", "R1", "R2"]

Q7 = scene("Q7", "table", table_spec(
    [["", "1", "2", "3", "4", "5", "6"],
     ["H", "H1", "H2", "H3", "H4", "H5", "H6"],
     ["T", "T1", "T2", "T3", "T4", "T5", "T6"]],
    [
        {"tag": "(i)", "hit": ["T2", "T4", "T6"], "frac": [("3", "12"), ("1", "4")]},
        {"tag": "(ii)", "hit": ["H1", "H2"], "frac": [("2", "12"), ("1", "6")]},
    ], page=4))

Q8 = scene("Q8", "table", table_spec(
    cross_table(["P", "B", "O"], lambda r, c: r + c),
    [{"tag": "(b)", "hit": ["PB", "BP"], "frac": [("2", "9")]}], page=5))

Q9 = scene("Q9", "table", table_spec(
    cross_table(["G", "Y", "B"], lambda r, c: "" if r == c else r + c),
    [{"tag": "(b)", "hit": ["GB", "BG"], "frac": [("2", "6"), ("1", "3")]}],
    page=5, strike=[(0, 0), (1, 1), (2, 2)]))

Q10 = scene("Q10", "table", table_spec(
    [["", "W3", "O", "B2"],
     ["W1", "W1W3", "W1O", "W1B2"],
     ["W2", "W2W3", "W2O", "W2B2"],
     ["B1", "B1W3", "B1O", "B1B2"]],
    [{"tag": "(b)", "hit": ["W1W3", "W2W3"], "frac": [("2", "9")]}], page=5))

Q13 = scene("Q13", "table", table_spec(
    [["", "7", "8", "11", "12"],
     ["7", "", "56", "77", "84"],
     ["8", "56", "", "88", "96"],
     ["11", "77", "88", "", "132"],
     ["12", "84", "96", "132", ""]],
    [{"hit": ["56", "77", "84"], "frac": [("6", "12"), ("1", "2")]}],
    page=7, strike=[(0, 0), (1, 1), (2, 2), (3, 3)]))

Q14 = scene("Q14", "table", table_spec(
    cross_table(_SOCKS, lambda r, c: "" if r == c else r + c),
    [
        {"tag": "(a)", "hit": ["W1W2", "W2W1", "B1B2", "B2B1", "R1R2", "R2R1"], "frac": [("6", "30"), ("1", "5")]},
        {"tag": "(b)", "hit": [a + b for a in _SOCKS for b in _SOCKS if a != b and ("B1" in (a, b) or "B2" in (a, b))],
         "frac": [("18", "30"), ("3", "5")]},
    ], page=7, strike=[(i, i) for i in range(6)]))

Q17 = scene("Q17", "table", table_spec(
    [["", "G", "R", "Y"],
     ["R", "RG $18", "RR $22", "RY $14"],
     ["Y", "YG $16", "YR $20", "YY $12"],
     ["B", "BG $17", "BR $21", "BY $13"]],
    [
        {"tag": "(a)", "hit": ["RG $18", "RR $22", "YG $16", "YR $20", "BG $17", "BR $21"],
         "frac": [("6", "9"), ("2", "3")]},
        {"tag": "(b)", "hit": ["RG $18", "RY $14", "YG $16", "BG $17", "BY $13"],
         "strike": ["RR $22", "YY $12"], "frac": [("5", "7")]},
    ], page=9))
