# JM30 (A) Probabilities (`jm30a`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm30a` (never rename) |
| Source | `books/jm30a/source/` QUE made from the ANS with `tools/make_que.py` (14 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm30a` |

Basic concepts (q1–q10, pages 1–3), experimental probability (q11–q16, pages 4–5), then Level 2 (q17–q37, pages 6–14). The question paper was not supplied; the background is the answer PDF with the red working removed.

## Special cases

- q17 and q18 are MC questions whose answer square is printed beside the options. The letter was blanked in the QUE and comes back through a `square` override with `letter`.
- Every question uses `minScale: 0.7`.

## Graphics

No `widgets.js`. Two concept panels are Manim animations (`tools/manim/jm30.py`):

| Page | Scene | What it shows |
| --- | --- | --- |
| 1 | `BasicProbability` | The formula, then each table row: the favourable outcomes are picked out of the possible ones and counted into $P(E)$. |
| 4 | `ExperimentalProbability` | The relative-frequency formula; 78 tails and 100 tosses move from the example sentence into the fraction. |

The panels are pictures in the PDF, so the scenes use the print itself (`PrintScene`): the panel is rendered from the QUE, white covers hide its parts and are taken away in reading order, and copies of printed items move to where they are used. The last frame is the printed panel.

## Review links

Every question has links.

## Known warnings

Nothing continues on an extra sheet. q7, q8, q10 and q23 shrink to 70 %. Accepted.
