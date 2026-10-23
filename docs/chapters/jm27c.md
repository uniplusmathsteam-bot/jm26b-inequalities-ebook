# JM27 (C) Percentages II (`jm27c`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm27c` (never rename) |
| Source | `books/jm27c/source/` QUE (8 pages), ANS (7 pages, no cover, offset −1) |
| Status | live |
| Live | `reader.html?book=jm27c` |

## Source facts

- Page structure: cover (p1); Salaries Tax intro + Example 1 + Practice 1 (p2); Q1–Q3 (p3); Q4–Q7 (p4); Q8 (p5); Q9 (p6); Q10 (p7); Challenge Zone Q11 (p8).
- Progressive rates: first / next / next / next $50 000 at 2% / 6% / 10% / 14%; remainder 17%.
- Net chargeable income = annual income − allowances. Monthly × 12 = annual.
- Example 1 has the worked solution printed in the QUE.
- **ANS typo (Q10):** Matthew's remainder is written as $47 300 (tax $2838, excess 96%), but net $87 300 − $50 000 = $37 300 → tax $2238 → excess **65%**. The ebook uses the correct figures; tell the teacher.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Salaries tax | Ex 1, Practice 1, Q1–Q10 | 2–7 | progressive brackets; Q8–Q9 add compound interest |
| Challenge | Q11 | 8 | Joyce vs Peter; tax difference $1760 |

## Special cases

- `printed: true` for ex1, with a graphic button at `ctlAt: [520, 336]` (top right of Example 1).
- Q1, Q4 and Q5 have short answer regions; answers may shrink or continue — accepted.
- Q8 and Q9 use two boxes for (a)/(b), matching the ANS.
- Q10 uses two boxes (Joseph, then Matthew + percentage).
- Q11 uses two boxes (Peter's tax in $x$, then Joyce + solve).

## Graphics

Every question has one (all 13). Shared `taxStack` draws bracket bars with rates and a live total; income/allowance or net sliders where useful.

| Question | Graphic | Notes |
| --- | --- | --- |
| Ex 1, P1, Q1–Q3, Q6–Q7 | tax stack + sliders | live total; quick buttons for the printed values |
| Q4, Q5 | tax stack | shows net ≤ 0 → tax $0 |
| Q8 | tax stack + interest vs tax bars | 5% compounded quarterly |
| Q9 | tax stack + deposit → amount | 11.5% compounded monthly; least $P$ |
| Q10 | Joseph vs Matthew side-by-side bars | excess % |
| Q11 | Joyce/Peter nets + tax-difference slider | target $1760 → $117 000 |

## Review links

Every practice and numbered question is linked (income, allowance, net, rates, what is asked). Ex 1 has no links (printed).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-10-23 | Author JM27 (C) salaries-tax ebook | First build, published as `reader.html?book=jm27c` |

## Known warnings

`node tools/qa/check_book.mjs jm27c`: none.
