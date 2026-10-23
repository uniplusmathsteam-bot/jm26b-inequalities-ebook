# JM27 (B) Percentages II (`jm27b`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm27b` (never rename) |
| Source | `books/jm27b/source/` QUE (16 pages), ANS (15 pages, no cover, offset −1) |
| Status | live |
| Live | `reader.html?book=jm27b` |

## Source facts

- Page structure: cover (p1); Simple interest — Examples 1–2, Practices 1–2, Q1–Q17 (p2–p8); Compound interest — Examples 3–4, Practices 3–4, Q18–Q32 (p8–p15); Challenge Zone heading on p15; Q33–Q34 (p15–p16).
- Examples 1–4 have the worked solution printed in the QUE.
- Practice 2 repeats Example 2’s figures on purpose (student rework).
- HK money spacing in solutions: `$12\ 000`.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Simple interest | Ex 1–2, Practice 1–2, Q1–Q17 | 2–8 | $I = Prt$, $A = P(1 + rt)$; months as year fractions |
| Compound interest | Ex 3–4, Practice 3–4, Q18–Q32 | 8–15 | $A = P(1 + r/n)^{nt}$; $n = 1,2,4,12,365$ |
| Challenge | Q33–Q34 | 15–16 | two-bank mix; loan with yearly repayments |

## Special cases

- `printed: true` for ex1–ex4, with a graphic button at the top right of each example frame (`ctlAt`).
- Q10 uses two boxes (who pays more; difference), matching the ANS crops.
- Practice 3: box (a) separate; (b)(c) together, like the key.
- Practice 4, Q18, Q21, Q24–Q28, Q34: one box per part when the ANS has separate boxes.
- Review links skip printed examples.

## Graphics

Every question has one (all 42). Shared helpers in `books/jm27b/widgets.js`: `simple()` and `compound()` (Principal / Interest / Amount bars with rate, years, and compounding-frequency sliders) and `twoBanks()` for side-by-side compares. Unknown $P$/$r$/$t$ use a slider until the given amount or interest matches.

| Question | Graphic | Notes |
| --- | --- | --- |
| Ex 1–2, P1–2, Q1–Q2, Q5(a), Q15(a)(b) | simple bars | rate / years sliders |
| Q3–Q4, Q6–Q8, Q11–Q14 | find unknown | slider until given matches |
| Q9–Q10, Q17, Q25–Q26, Q29, Q33 | two banks | side-by-side interest bars |
| Ex 3–4, P3–4, Q18–Q21, Q27–Q28, Q30, Q34(a) | compound bars | factor shown under the bars |
| Q22–Q24, Q31–Q32 | reverse compound | slider for $P$ until $I$ or $A$ matches |
| Q16 | FX then simple | HKD bar, then interest, then profit % |
| Q34(b) | yearly balance | repayment timeline 2017–2021 |

## Review links

Every practice and numbered question is linked: principal, rate, time, amount/interest, and what is asked. Ex 1–4 have no links (printed).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-10-23 | Author JM27 (B) ebook solutions and widgets | First build |

## Known warnings

`node tools/qa/check_book.mjs jm27b`: WARN answers continued on an extra sheet for q5, q8, q10, q15, q22, q28 (dense multi-step working; accepted). No FAILs.
