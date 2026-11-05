# JM29 (C) Quadrilaterals (`jm29c`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm29c` (never rename) |
| Source | `books/jm29c/source/` QUE made from the ANS by covering the red working (11 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm29c` |

Trapezium, rhombus, rectangle, square, then Level 2 (q12–q24). The question paper was not supplied separately; the background is the answer PDF with the red working removed. The five summary panels (trapezium, rhombus, rectangle, square, and the family tree on page 5) are Manim animations. The trapezium's area is shown by a half-turned copy that makes a parallelogram, and the isosceles trapezium's facts by its mirror line.

The background was rebuilt with `tools/make_que.py` (cache v17). The first version removed every image that touched a red box, so figures were missing on pages 1, 2, 6, 8 and 10; they are back, and the answer regions were grown again around them.

## Feedback log

- **2026-11 — teaching pass.** Answers keep one type size and scroll inside the region when they need more room (no shrink, no continuation sheets). Side-by-side `(a)`/`(b)` answers sit under their printed labels. Q1–Q3 open extra page space so the short answers show in full. Q3's Chinese margin note is English. Q14 has a rhombus figure behind the graphic button. Trapezium animation: half-turned copy stays in the panel; isosceles angle wedges are drawn as interior angles at D/C and A/B.
- **2026-11 — second pass.** Trapezium animation sits with a clear margin from the purple panel. Reasons stay beside their steps: Q6 (b) "property of rectangle" was under "OD = OB"; a broken step (Q6 (a), Q9 (b)) now carries its reason on its last row. Q6 opens 100 pt of page space so it shows in full.
- **2026-11 — third pass.** The trapezium's play button stays inside the page. The QUE was rebuilt (cache v28): the white line that hid each removed frame no longer runs across figures, so the Q21 figure and the "18 cm" label in Q1(b) are clean.

## Known warnings

Long Level-2 answers (q9, q12, q13, q16, q21, …) scroll inside their regions. Accepted.
