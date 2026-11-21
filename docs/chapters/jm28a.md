# JM28 (A) Special Lines and Centres in Triangles (`jm28a`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm28a` (never rename) |
| Source | `books/jm28a/source/` QUE (4 pages), ANS (4 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm28a` |

## Source facts

- Page 1 opens with a printed row of the four special lines (altitude, median, angle bisector, perpendicular bisector); questions 1–13 follow, three or four to a page, each with its figure on the right.
- Green diamonds in the ANS: Q2, Q4, Q6, Q8, Q10, Q12.

## Question map

| Section | Questions | Pages | Notes |
| --- | --- | --- | --- |
| Altitude & Median (`am`) | q1–q2 | 1 | Pythagoras |
| Angle Bisector (`bis`) | q3–q7 | 1–2 | |
| Mixed (`mixed`) | q8–q13 | 3–4 | q12 has two side-by-side boxes, as in the ANS |

## Special cases

Regions come from the teacher's red boxes (`extract.overrides`), grown into the blank space left of each figure. q7 and q10, the last question on their pages, open extra `space` under the region. q5 does not: `space` shifts the rest of the page down, but the engine looks for figures in the unshifted page image, so Q6's step and film buttons were pushed left onto its working.

## Graphics

| Question | Graphic | Notes |
| --- | --- | --- |
| page 1 panel | `jm28:SpecialLines` | Each line drawn by the move that defines it: a plumb line, a halved base, a folded angle, a halved base with an upright line. Covers the four triangles, not the printed labels. |
| q2 | guide `jm28a_guides:Q2` | 13 and 8 give BC = √105; a half-turn about D carries DA onto DB (4); CD = 11. |
| q4 | guide `jm28a_guides:Q4` | Angles of △ABC gather on a line (62°); fold along AD (31° each); ∠DAE slides to E and ∠ADE half-turns into ∠DEC = 65°; ∠ADE = 34°. |
| q6 | guide `jm28a_guides:Q6` | Fold along AD, then fold ∠DAC onto ∠DCA across the perpendicular bisector of AC; angles gather with the right angle; ∠ACB = 30°. |
| q8 | guide `jm28a_guides:Q8` | Half-turn about D (median), turn BA onto BD; the two perimeters laid out as bars, the leftover is AD = 1 cm = CD. |
| q10 | guide `jm28a_guides:Q10` | Fold △DBE along DE (DB = DC), the same fold carries the base angle; angles of △ABC gather; ∠DBC = 16°. |
| q12 | guide `jm28a_guides:Q12` | Fold along AD (AB = AC), angles gather (50° each), ∠EBC = 33°, fold along CE (25° each), angles of △BCE gather; ∠BEC = 122°. |

Guide vertices are the printed corners, nudged where a fold must land exactly: Q4's D sits on the true bisector, Q6's C makes ∠C = 30°, Q10's D makes ∠DBC = 16°, Q12's A and E make ∠ABC = 50° and EC a true bisector (E moves about 4 pt). `python -X utf8 tools/audit_guides.py jm28a` reports all six clean. No slider graphics: `widgets.js` registers none.

## Review links

Every question has links (given values, the special line named in the question, and the unknown).

## Feedback log

| Date | Request | What changed |
| --- | --- | --- |
| 2026-11-21 | Check the unpublished draft, improve it, publish | Solutions checked line by line against the ANS (all 13 match). Added the six green-diamond guides (the draft listed seven guide videos that did not exist, including a non-diamond Q9). Replaced the template `widgets.js`. Released at cache v51. |

## Known warnings

`check_book.mjs jm28a`: answers scroll inside their regions on most questions (the teacher's working is in small print beside each figure). Same as the other live geometry books; accepted.
