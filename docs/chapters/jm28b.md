# JM28 (B) Special Lines and Centres in Triangles (`jm28b`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm28b` (never rename) |
| Source | `books/jm28b/source/` QUE (8 pages), ANS (8 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm28b` |

## Source facts

- Page 1 is a printed panel of the angle bisector and perpendicular bisector properties (no questions). Page 5 opens with the four special lines and the parallel-line angle panels.
- Questions 1–21 on pages 2–8, one red box per question in the ANS.
- Green diamonds in the ANS: Q4, Q8, Q11, Q15, Q17, Q21.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Angle Bisector (`bis`) | q1–q4 | 2–3 | |
| Perp. Bisector (`perp`) | q5–q9 | 3–4 | |
| Parallel Lines (`par`) | q10–q17 | 5–7 | |
| Altitude (`alt`) | q18–q21 | 7–8 | |

## Special cases

Regions come from the teacher's red boxes (`books/jm28d/reference/setup_book.py jm28b` assigns each box to the question above it), grown with `grow_regions.py`. Q2's sketch inside the teacher's box is left out; its "Let T and U be points…" line is kept. Q18 adds a note naming the teacher's $a_1, a_2, b_1, b_2$; part (b) is written as $\angle ABC = b_1 + a_2$ and "△ABC is a right-angled triangle" (the key has $a_1 + b_2$ and △ABD). Q3 and Q7 carry the "converse of … property" reason on the next step so the long sentence is not squeezed.

## Graphics

None yet. No guides for the green-diamond questions and no animation of the page 1 panel.

## Review links

Every question has links (given values, the special line named, and what is to be proved or found).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-11-26 | Build from the QUE and ANS PDFs and publish | First release, cache v60. |

## Known warnings

`check_book.mjs jm28b`: answers scroll inside their regions on every question, as in `jm28a`; accepted.
