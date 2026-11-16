# JM29 (E) Quadrilaterals (`jm29e`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm29e` (never rename) |
| Source | `books/jm29e/source/` QUE made from the ANS (8 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm29e` |

Multiple choice, q1–q36. Level 2 starts at q16. The question paper was not supplied separately. The background is the answer PDF with the red working covered, the correct option turned back to black, and the asterisk removed. q4 has no red working box; its short reason sits under the options.

The background was rebuilt with `tools/make_que.py` (cache v17). The first version removed every image that touched a red box, so figures were missing on pages 5 and 8 (the q36 figure and its degree sign among them); they are back. A `*` that sat in its own text span ("*D.") is now removed too.

Made with `tools/make_que.py --red-text black`. Rebuilt for cache v28 so the white line over a removed frame no longer cuts the figure on page 5. Answers that needed the page margin were drawing over the figures (q26, q27, q31 and the same layout on the other questions); they now stop 14 pt short of each figure, and the step buttons stay in that margin. A hidden step's grey bar is only as wide as that step, so the placeholder does not run past the text onto the figure.

Q1, Q3, Q6, Q18, Q21 and Q27 have a film button. Each guide is a motion from an earlier quadrilaterals book: Q1 and Q3 are the opposite-angle half-turn, Q6 and Q21 are the square-and-equilateral chase from JM29 (C) Q11, Q18 is the rhombus area from JM29 (C) Q14 (the question prints no figure), and Q27 is the mid-point slide from JM29 (D) Q3. `tools/audit_guides.py` reports all six clean.

## Known warnings

The working boxes beside the options are grown into the blank space around them. q23 and q36 continue on an extra sheet. Text often shrinks to about 62% or sits in side-by-side columns. Accepted.
