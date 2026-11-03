# JM03 (C) Percentages I (`jm03c`)

| | |
| --- | --- |
| Form | S1 |
| Book id / storage | `jm03c` (never rename) |
| Source | `books/jm03c/source/` QUE (12 pages), ANS (12 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm03c` |

## Source facts

- Page 1 is the formula sheet (percentage change, profit or loss, discount). No questions and no red boxes. Left as printed. The panels are equations, so they are not animated.
- Q1–Q16 are numbered long problems. No examples, practices, or multiple choice.
- Both PDFs have 12 pages and the questions line up, so `ansPageOffset` is 0.
- The teacher's working is a raster image inside each red frame, not PDF text. Solutions are transcribed from `reference/ans/`.
- The notes do not split the problems under headings. One top-bar section: Questions.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Questions | Q1–Q16 | 2–12 | percentage change, profit or loss, discount |

## Special cases

- Default gap regions. No overrides. The blank under each question already holds the teacher's boxes.
- Side-by-side boxes, with widths so they share a row: Q1, Q2, Q6 (two pairs, then (c)), Q7 (b), Q14, Q15.
- Q3 uses `flow: "col"` so (a) stays on the left and (b) and (c) stack on the right.
- `minScale: 0.62` on the dense questions. Q5 still draws at 70% because the three stacked boxes fill the page down to the footer.

## Graphics

One bar picture per question, with a slider and a live check. No function graphs.

| Question | Graphic | Notes |
| --- | --- | --- |
| 1 | male, female, train bars | slider is the number of male workers |
| 2 | Amy, Baron, Cathy | the 43% stays fixed while the total changes |
| 3 | cost against the new selling prices | slider is the later car discount |
| 4 | first 8 cars, last 2, profit | slider is the discount on the first 8 |
| 5 | yesterday, the 20% target, today | slider is the number sold today |
| 6 | January, February, March, plus the $2000 | slider is February's income |
| 7 | cost, selling at $22, this price | slider is the selling price |
| 8 | marked, 20% off, cost, 60% off | slider is the marked price |
| 9 | cost, selling price, loss | slider is the number of dresses |
| 10 | discarded profit beside returned profit | slider picks option I, II or III |
| 11 | discount slabs | buttons for $320, $480 and $450 |
| 12 | jacket, T-shirt, amount paid | slider is the T-shirt's marked price |
| 13 | cost, half price, marked price | shows the 200% profit at the marked price |
| 14 | orange, cranberry, selling price | slider is $b per mL |
| 15 | the two discounts and the stationery | slider is the stationery's marked price |
| 16 | selling price and cost | slider is x |

## Review links

Every question is linked. Nothing was skipped.

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-11-03 | Import S1 JM03 (C) Percentages I. The QUE is the reference. | First build |

## Known warnings

`node tools/qa/check_book.mjs jm03c`: Q5 answer text shrunk to 70% to fit. The three boxes run to the footer, as in the key. Accepted.
