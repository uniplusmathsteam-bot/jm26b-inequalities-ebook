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
- **2026-11 — solution guides.** Every green-diamond question (Q1, Q2, Q3, Q5, Q6, Q9, Q11, Q14, Q18, Q21, Q23) has a film button that plays its figure as an animated guide (`tools/manim/jm29c_guides.py`), following the teacher's steps for a narrator to speak over. Q5: equal sides, then the equal base angles, then the angle sum. Answers settle in bold red with no box. Two-part questions pan from figure (a) to figure (b). Q14 has no printed figure, so its guide draws the rhombus from the teacher's answer.
- **2026-11 — label margins.** "Some numbers overlap with the angles." Wedges were cut down to the printed arc radii, labels returned to their printed places (or moved along the angle's bisector), and mirror lines now break around labels. `tools/audit_guides.py` reports all eleven guides clean.
- **2026-11 — label margins, second round; Q14 graphic.** The old videos were still being served from the offline cache (cache v29 kept the first renders), so the cache is now v31. Unknowns had grown 1.5 times when they flashed and ran over the lines ("2x − 10°" in Q9). Now no word grows, the margins are wider (2 pt from wedges, 1.2 pt from lines) and the audit also checks every flash at its largest. The Q14 interactive rhombus was black: its vertex `C` hid the colour palette `C` in `widgets.js`. It is redrawn with angle arcs, and every label is placed clear of the lines.

## Known warnings

Long Level-2 answers (q9, q12, q13, q16, q21, …) scroll inside their regions. Accepted.
