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

Five questions have a guided solution film (`tools/manim/jm30c_guides.py`), built like the JM30 JM31 Intensive guided films on `Guided` from `jm3031_slides.py`, but on white: `Guide.setup` maps every palette colour to a light-theme one as the camera draws (white page, dark ink, deeper accents, pale tints), so the shared helpers need no change. Each film has a numbered caption per click, and the reader pauses at every slide (`stops`). A probability is built as on the board: the sample space is outlined and joined to the denominator, the favourable outcomes light up one at a time beside a running count, and the count drops into the numerator. An expected value is built one term at a time, each value and probability carried down from where it was found. A "favourable?" part compares the expected value with the cost. q7b plays the same film as q7.

| Question | Scene | What it shows |
| --- | --- | --- |
| 7 | `Q7` | The nine coins are counted (4 + 2 + 3 = 9); each kind lights up in turn and fills its cell of the printed table (4/9, 2/9, 3/9 = 1/3); then each coin value × its probability moves into the sum, $16/3. |
| 16 | `Q16` | The wheel and the ratio 2 : 5 : 8. (a) 2 + 5 + 8 = 15 parts is the denominator and the 2 drops into the numerator; 10 × 2/15 = 4/3 times. (b) 5/15 = 1/3. (c) The ratio turns into 2/15, 1/3 and 8/15, and the expected points build term by term to 26/3. |
| 20 | `Q20` | The 6 × 6 dice table. The prime faces 2, 3 and 5 are outlined, the 9 cells with both prime are counted, 9/36 = 1/4, $80 × 1/4 = $20 > $10: favourable. |
| 22 | `Q22` | Two balls drop into the tubes. (i) A 2-stage tree, AA and BB light up: P(same tube) = 1/2, 10 × 1/2 + 5 × 1/2 = 7.5. (ii) A 3-stage tree, AAA and BBB: 1/4, 13 × 1/4 + 5 × 3/4 = 7. (b) 7.5 > 7, adopt option I. |
| 23 | `Q23` | Two balls drop into slots A and C (outcome AC). The 4 × 4 table; each adjacent pair lights its two slots as it is counted: 6/16 = 3/8. The same-slot diagonal (1/4) and the 6 others (3/8) fill a small award table, whose values and probabilities build $15 < $20: not favourable. |

The films were chosen by how surely each could be made right and worth watching. From most to least sure: Q20, Q23, Q16, Q22, Q7, then Q19 (its ✓ ✗ table needs a symbol font), Q17, Q18, Q3, Q21, Q14, Q15, Q12, Q13, Q8, Q6, Q9, Q5, Q4, Q11, Q10, Q24, Q1 and Q2. Q24's tournament cases are the hardest to show faithfully; Q1 and Q2 are a single multiplication.

## Review links

Every question has links except the q7 table, which only fills printed cells.

The q7 region is one printed table row (18 pt), so its buttons sit in one row to the right of the table. Printed ink under an answer (the table it fills in) does not count as a figure beside it when the engine places the buttons.

## Known warnings

Nothing continues on an extra sheet. q8 shrinks to 70 %. Accepted.
