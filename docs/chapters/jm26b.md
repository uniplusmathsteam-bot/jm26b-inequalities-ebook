# JM26 (B) Inequalities I (`jm26b`)

| | |
| --- | --- |
| Form | S3, 2026 |
| Book id / storage | `jm26b` (never rename: the iPad ink is stored as `jm26b-ebook`) |
| Source | `books/jm26b/source/`: QUE (16 pages), ANS (15 pages, no cover, so ANS page = QUE page − 1) |
| Status | live, the first book in the databank |
| Live | <https://uniplusmathsteam-bot.github.io/jm26b-inequalities-ebook/reader.html?book=jm26b> |

## Source facts

- Page 1 is a full-page cover image. Pages 2–16 hold the questions under three section titles: "Practical Problems!" (page 2), "Properties of Inequalities (MC)" (page 11) and "Challenge Zone" (page 14).
- Fonts: Calibri for the header, Cooper Black for titles, Times New Roman for maths.
- The ANS solutions are PNG screenshots inside red-bordered boxes (stroke colour about 0.933, 0, 0). `extract_ans_refs.py` finds them by colour.
- MC answers from the ANS text layer: 23 D, 24 D, 25 A, 26 D, 27 D, 28 C, 29 D, 30 C.

## Question map

| Section (`book.json` id) | Questions | Pages |
| --- | --- | --- |
| Practical (`practical`) | Example 1, Practice 1a, 1b, Q1–Q22 | 2–10 |
| MC (`mc`) | Example 2 (and its LQ method), Practice 2, Q23–Q30 | 11–13 |
| Challenge (`challenge`) | Q31–Q33 | 14–16 |

## Special cases

- **Printed examples:** Example 1, Example 2 and the Example 2 LQ method already show their working in the notes. They are `printed: true`: they get a graphic button at `ctlAt`, but no answer boxes.
- **Fixed anchor:** the Example 2 LQ method has no heading text to search for, so its anchor is pinned with `fixedAnchors.ex2lq = [327, 340]`.
- **Region overrides:** Example 1, Practice 1a, 1b and 2 are framed boxes. The working space for Example 2 and Q23–Q30 sits beside the MC options, and these have answer `square`s. Practice 2 has a `ring` around option A.
- **MC letters:** Q23–Q30 have no `letter`; the teacher asked to remove the answer letters from the MC boxes. Example 2 (C), its LQ method (C) and Practice 2 (A) keep theirs. The Q23–Q27 solutions still end with "∴ The answer is …".
- **Tight layouts:**
  - Q23–Q27 use `flow: "col"`; Q23–Q30 use `minScale: 0.62`.
  - Q20 uses `nowrap` and `minScale: 0.7`.
  - Q19's three part boxes use `left` to sit side by side.
- **Number lines** (`nl`) are written for Example 1, Practice 1a and Q1. They are dropped automatically where the space is too small.

## Graphics

Every question except the printed Example 2 LQ method has a graphic. Highlights:

| Question | Graphic |
| --- | --- |
| Example 1 | Page-count bars plus a number line; 101 is the least value |
| Practice 1a | Integer tiles with the working; a number line marking 1–6 |
| Practice 1b | Triangle ABC with an x slider; side labels outside the edges |
| Q1 | Chain $x \to x + 2 \to 2(x + 2) \to 11 - 2(x + 2)$, showing why the sign flips |
| Q2 | Polygon with sides fixed at 3 cm and an n slider; the sides unroll onto a 0–36 cm ruler with the 24 cm target |
| Q3 | Rectangle with length versus twice the width, and the perimeter |
| Q4 | Marble jars plus comparison bars |
| Q5–Q8 | A consecutive pair with a +2 / +1 / +6 jump, plus a condition line |
| Q9, Q10, Q12, Q17 | Count tables and trays |
| Q11 | Oranges (8 rotten) and paid / got-back money bars, with no function graph |
| Q13, Q14 | Journey bar models |
| Q15 | n-gon with interior and exterior angle arcs |
| Q18 | Beaker filling in layers |
| Q19–Q22 | x–y picture: both number lines, ranges shaded, overlap in orange |
| Q23–Q30, Example 2, Practice 2 | MC checker: sliders, a live true/false per statement, a counterexample search |
| Q31–Q33 | Term slider; two meeting lines (Q32); money bars with condition checks (Q33) |

## Review links

There are 116 links across 33 questions:
- Practices 1a, 1b and 2;
- Q1–Q27;
- Q31–Q33.

Skipped: Q28–Q30, which have no clear phrase-to-step pairs, and the printed examples. In Q5, only "the smaller number is x − 2" is linked, not "two consecutive even numbers".

## Feedback log

| Round | Request | What changed |
| --- | --- | --- |
| 1 | Turn the PDF into an ebook with step-by-step solutions in the blanks; add graphics (Q2 polygon slider); pens for annotating | First build: page backgrounds, solutions, widgets, ink |
| 2 | Answers inside the boxes with margins; click out steps; better graphics; a way to leave writing mode and scroll | Red answer boxes, step reveal, graphic drawer, Read tool |
| 3 | Fix graphics to match the questions | Question cards; pins; overlap fixes |
| 4 | HKDSE number lines | Stem, circle, arrow style everywhere |
| 5 | Q19–Q22: mark both domains and colour the overlap | x–y range picture |
| 6 | Notability-style hold to snap; highlight snapping | Shape recognition; text snapping |
| 7 | Highlight part of an answer line | Per-character snap targets |
| 8 | Review links for Practice 1(b), keeping a backup | Links with tags; backup folder `… (backup before review links)` |
| 9 | Tap dashed areas to reveal links; apply to all questions | Per-link tap hints, 116 links |
| 10 | Links tappable in writing modes; stronger hints | Pencil tap opens links; a tint on the hints |
| 11 | Q11 without a graph of functions | Orange-and-money picture |
| 12 | Q5: link less | Narrower link; `[[key|words]]` syntax |
| 13 | Laser pointer | Laser tool |
| 14 | Remove the MC answer letters for Q23–Q30 | `letter` removed |
| 15 | Publish for the iPad | GitHub Pages; iPad and Pencil hardening |
| 16 | Pencil delay between strokes | Live layer; save debounce; stylus claim |
| 17 | Edit ink by touch, undo by tap, triangles, presentation mode, Notability/OneNote features, Pencil sensitivity | Selection menu; two- and three-finger taps; triangle snap; Present mode; partial eraser; replay; hover; pressure tuning |
| 18 | Turn the project into a databank | `books/` and `engine/` split, library page, tools and docs |

## Known warnings

From `node tools/qa/check_book.mjs jm26b`, reviewed and accepted:

- Practice 2 continues on an extra sheet after page 11.
- Q23, Q25 and Q27 answer text is shrunk to 70 % to fit beside the options.
