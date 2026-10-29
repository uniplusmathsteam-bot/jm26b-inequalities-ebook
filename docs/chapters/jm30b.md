# JM30 (B) Probabilities (`jm30b`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm30b` (never rename) |
| Source | `books/jm30b/source/` QUE made from the ANS with `tools/make_que.py` (12 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm30b` |

Tree diagrams (q1–q6, pages 2–3), tables (q7–q10, pages 4–5), then Level 2 (q11–q20, pages 6–12). Page 1 is the tree-diagram summary. The question paper was not supplied; the background is the answer PDF with the red working removed.

## Special cases

- Tree answers use `tree()` with `grow()`; tables of outcomes use `table()`, with `strike` for impossible outcomes (drawing the same ball twice).
- q7, q8 and q9 have a second part far below the first, so `q7b`, `q8b` and `q9b` are separate items with `fixedAnchors`.
- Regions: q7b `[64.2, 692.6, 586, 797.0]`; q9b ends at 562; q19 stops at x = 458 so the controls stay off the figure.
- Some boxes have a fixed `w` so that nothing continues on an extra sheet. Every question uses `minScale: 0.7`.

## Graphics

No `widgets.js`. Three concept panels are Manim animations (`tools/manim/jm30.py`, built on the print like JM30 (A)):

| Page | Scene | What it shows |
| --- | --- | --- |
| 1 | `TreeDiagram` | Each tree grows a stage at a time; the branch labels move in to form the first outcome; then the outcomes are counted for P(H3) and P(1 tail and 1 head). |
| 4 (top) | `TreeVsTable` | The two-stage tree, then each outcome moves into its cell of the table. |
| 4 (bottom) | `RemoveImpossible` | The table of two draws is filled; the same-ball cells are struck out; then 2 of the 6 remaining outcomes are counted. |

## Review links

Every question has links.

## Known warnings

Nothing continues on an extra sheet. q7b and q9b shrink to 70 %. Accepted.
