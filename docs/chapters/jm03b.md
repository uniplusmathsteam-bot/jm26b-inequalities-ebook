# JM03 (B) Percentages (`jm03b`)

| | |
| --- | --- |
| Form | S1 |
| Book id / storage | `jm03b` (never rename) |
| Source | `books/jm03b/source/` QUE + ANS (8 pages each, offset 0) |
| Status | live |
| Live | `reader.html?book=jm03b` |

Profit and loss (q1–q11, pages 1–3), discount (q12–q20, pages 4–6), then Level 2 (q21–q27, pages 6–8). Both PDFs were supplied.

## Special cases

- q1, q2 and q12 fill printed tables with a bare `table({ at: { xs, ys } })` (empty string for cells already printed).
- Every question uses `minScale: 0.7`; q21 uses `flow: "col"` and `minScale: 0.62`.

## Graphics

No `widgets.js` sliders. Two Key Concepts panels are Manim animations (`tools/manim/jm03.py`, PrintScene over the QUE print):

| Page | Scene | What it shows |
| --- | --- | --- |
| 1 | `ProfitLossFormulas` | Profit and loss formulas, then Selling = Cost × (1 ± %). |
| 4 | `CostMarkedSelling` | Cost → Marked → Selling, with profit/loss and discount. |

## Review links

Every word problem has links. Table fills q1, q2 and q12 are skipped (cells only).

## Known warnings

q17 shrinks to 70 %. Accepted.
