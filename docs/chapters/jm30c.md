# JM30 (C) Probabilities (`jm30c`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm30c` (never rename) |
| Source | `books/jm30c/source/` QUE made from the ANS with `tools/make_que.py` (12 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm30c` |

Expected number (q1–q3, page 1), expected value (q4–q9, pages 2–3), then Level 2 (q10–q24, pages 4–12). The question paper was not supplied; the background is the answer PDF with the red working removed.

## Source facts

- The key for q3 lists the favourable outcomes as 28, 58 and 82 but counts 4. The fourth is 52; the solution lists all four.

## Special cases

- q7 fills a probability table printed on the page: a bare box with `table({ at: { xs, ys } })` puts the answers in the printed cells. Its part (b) is a separate item, `q7b`, with `fixedAnchors`.
- Long expected-value lines are split by hand (q5, q14, q22) because KaTeX breaks them after "=". q8 (c) is its own box.
- q3, q9 and q20 regions end at 822 rather than 800 to use the space above the footer.
- Every question uses `minScale: 0.7`.

## Graphics

No `widgets.js`. Two concept panels are Manim animations (`tools/manim/jm30.py`, built on the print like JM30 (A)):

| Page | Scene | What it shows |
| --- | --- | --- |
| 1 | `ExpectedNumber` | Trials × probability; 315 throws and the 1/6 chance go into the working, then 52.5. |
| 2 | `ExpectedValue` | Each column of the lucky-draw table (value and probability) moves into its term of the sum, then $20. |

## Review links

Every question has links except the q7 table, which only fills printed cells.

## Known warnings

Nothing continues on an extra sheet. q8 shrinks to 70 %. Accepted.
