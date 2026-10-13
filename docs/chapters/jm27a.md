# JM27 (A) Percentages II (`jm27a`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm27a` (never rename) |
| Source | `books/jm27a/source/` QUE (16 pages), ANS (15 pages, no cover, offset −1) |
| Status | live |
| Live | `reader.html?book=jm27a` |

## Source facts

- Page structure: cover (p1); percentage change, Examples 1–3, Practice 3, Q1–Q10 (p2–p5); "Increase / Decrease at a Constant Rate", Examples 4–6, Practices 4–6 (p6–p7); Q11–Q29 (p8–p14); "Challenge Zone" heading on p14 between Q29 and Q30; Q30–Q32 (p14–p16).
- Maths letters (y, A, B, T, x, n, P, r) are in Cambria Math. The raw PDF text shows "??", but `layout.json` reads them correctly, so review links can use them.
- Examples 1–6 have the worked solution printed in the QUE.
- Practices 3–6 are framed boxes with blank space inside the frame.
- **ANS typo:** Q14(b) ends "…was $413 500", but the working gives $4 135 000. The ebook uses $4 135 000; tell the teacher.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Change | Ex 1–3, Practice 3, Q1–Q10 | 2–5 | percentage change, successive changes, reverse percentages |
| Growth & decay | Ex 4–6, Practices 4–6, Q11–Q29 | 6–14 | $P(1 \pm r\%)^n$, forwards and backwards, depreciation |
| Challenge | Q30–Q32 | 14–16 | unknown rate, salary comparison, simultaneous equations |

## Special cases

- `printed: true` for ex1–ex6, with a graphic button at the top right of each example frame (`ctlAt`).
- Region overrides (in `book.json`):
  - p3, p4, p5 and p6: inside the practice frame, x from 44 to the frame edge. The gap rule would otherwise run p4 down into the "Decrease at a Constant Rate" panel;
  - q29: ends at y 274, above the "Challenge Zone" heading (278–299).
- Q11 and Q15 have only about 68 pt of space. Their first line joins the label and the first factor ("Present price of the air ticket = $1600 × (1 + 10%)³") so the box fits in 3 lines without shrinking.
- Q9 uses `nowrap` with two boxes, like the key.
- Review links include the exponent inside the factor, for example `L("r", "(1 + 15\\%)^3")`. A link that stops before `^3` looks cramped.

## Graphics

Every question has one (all 48). Most use the shared `timeline()` in `books/jm27a/widgets.js`: one bar per period, the factor between bars, a slider for periods and, where needed, a slider for the unknown. A full-width amber line marks a given value or threshold, and red dashed caps show the value lost so far.

| Question | Graphic | Notes |
| --- | --- | --- |
| Ex 1, Q1 | original bar vs new bar | slider for the new value; readout is the % change |
| Ex 2, Q2 | one-step timeline | slider for the rate |
| Ex 3, P3 | two-step timeline | amber line marks the wrong "add the percentages" answer |
| Q3, Q4, Q8, Ex 6, P6, Q13, Q14, Q17, Q18, Q21, Q25, Q30 | work backwards | slider for the unknown start or rate until the given bar matches |
| Q5 | stacked male and female bars | two rate sliders |
| Q6 | A × 1.3 vs 80 % of B | slider for y |
| Q7 | timeline vs the first score | slider for x; the third score is always 0.9775x |
| Q9 | rectangle B × T (area ∝ A) | sliders for the % change in B and in T |
| Q10 | two circles r and 1.2r | radius % slider; area factor squared |
| Ex 4–5, P4–5, Q11, Q12, Q15, Q16, Q19, Q20, Q22 | forward timeline | Q16 and Q22 show the overall change |
| Q23, Q26 | rate slider; start found from the given year | checks the second given value |
| Q24, Q28, Q29, Q32 | timeline with a threshold (⅓, ½, 2E, P ÷ 10) | finds the first year past it |
| Q27 | timeline; checks the red loss cap = $7046 | |
| Q31 | Peter and David side by side, 2019–2025 | |

## Review links

Every practice and numbered question is linked: the original value, each growth or decay factor with its number of periods, the given value, and the unknown or comparison asked for. Ex 1–6 have no links (printed).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-10-13 | "Do another ebook for this JM27 (A), put it in the same link" | First build, published as `reader.html?book=jm27a` |

## Known warnings

`node tools/qa/check_book.mjs jm27a`: none.
