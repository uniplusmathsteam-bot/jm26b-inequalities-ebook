# JM29 (D) Quadrilaterals (`jm29d`)

| | |
| --- | --- |
| Form | S3 |
| Book id / storage | `jm29d` (never rename) |
| Source | `books/jm29d/source/` QUE made from the ANS by covering the red working (8 pages, offset 0) |
| Status | live |
| Live | `reader.html?book=jm29d` |

Mid-point theorem (q1–q10), then Level 2 (q11–q20). The question paper was not supplied separately; the background is the answer PDF with the red working removed. The mid-point theorem (page 1) and intercept theorem (page 3) panels are Manim animations: two copies of MN tile BC, and the second transversal tilts while its parts stay equal.

The background was rebuilt with `tools/make_que.py` (cache v17). The first version removed every image that touched a red box, so the figures for q11–q14 and others on pages 4–6 were missing; they are back, including the parts of the q12 figure the teacher's box covered in the ANS. The answer regions were grown again around them.

Rebuilt again for cache v28: the white line over each removed frame used to cut gaps in the figure lines on pages 4 and 5; it now skips figures.

## Solution guides (cache v32)

Q3, Q13 and Q20 have guide videos (`tools/manim/jm29d_guides.py`), which follow the teacher's working step by step. Each equal pair of lengths has its own colour, and that colour carries through: in Q13 the B pair is blue and the E pair pink, BE is purple and is laid along CF, and DF slides onto FG. Q3 tints △ACD and △ABC in turn and moves the halves of AD and EF to show 12 cm and 18 cm, then 36 cm. Q20 builds the parallelogram ABCN, then turns the right angle at N red and copies it to A, B and C. Figure points were measured from the page image with iterative line fits (within about 0.3 pt). `python tools/audit_guides.py jm29d` reports no label touching a mark, another label or the frame.

## Summary and flashcards (cache v32)

Two end pages follow page 8 (`endPages` in book.json):
- `end-summary`: `pages/summary.png`, rendered from `tools/sheets/jm29d-summary.html`. It covers the mid-point theorem, both forms of the intercept theorem, a "which theorem?" table and the Q13 chain. Colour code: blue = equal parts given, red arrows = parallel, green = what the theorem gives. Tags are worded as printed: `[mid-pt. theorem]`, `[intercept theorem]`.
- `end-cards`: ten "Which theorem?" cards (`flashcards.js`), five for each theorem, in an order that does not alternate. The sheet is a landscape slide at the notes' width (595 × 380 pt): figure on the left, prompt and two buttons on the right, so presentation mode shows the whole card and the score on one page. "Which comes first?" is the one chained case: the intercept theorem first, then the mid-point theorem.

Do not rename `summary` or `cards`: ink on the summary page is saved under `end-summary`.

## Known warnings

q10 and q12 continue on an extra sheet; q12's link to "AB = 9 cm" is underlined there. Several answers shrink to about 62%. Accepted.
