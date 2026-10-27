/**
 * Worked solutions for this book, following the teacher's ANS method.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk, tree, table, grow, align } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;
const f = (a, b) => `\\dfrac{${a}}{${b}}`;
/** ∴ P(event) = …, with the event words linked back to the question. */
const P = (key, words) => `P(${L(key, `\\text{${words}}`)})`;
const so = (tex) => m(`\\therefore\\ ${tex}`);

/** The diagonal of a square table: the same item twice. */
const diag = (n) => Array.from({ length: n }, (_, i) => [i + 1, i + 1]);
/** Rows of a square outcome table whose cells join the row and column labels. */
const pairs = (labels, strike = true) => [
  ["", ...labels],
  ...labels.map((r) => [r, ...labels.map((c) => (strike && r === c ? "" : `${r}${c}`))]),
];

const LIST = [
  {
    id: "q1",
    links: [{ key: "f", color: "pink", note: "favourable: T then B", q: ["a tail and a black card"] }],
    boxes: [
      { steps: [tree({ label: "(a)", cols: ["Coin", "Card", "Possible Outcomes"], kids: grow(["H", "T"], ["B", "W"]) })] },
      {
        steps: [
          t("**(b)** From the tree diagram, there are 4 equally likely outcomes."),
          t("There is only 1 favourable outcome, i.e. TB."),
          so(`${P("f", "a tail and a black card")} = ${U(f(1, 4))}`),
        ],
      },
    ],
  },
  {
    id: "q2",
    links: [{ key: "s", color: "green", note: "same value: \\$10 with \\$10, \\$20 with \\$20", q: ["banknotes of the same value"] }],
    boxes: [
      {
        steps: [tree({
          label: "(a)",
          cols: ["John’s banknote", "Sam’s banknote", "Possible Outcomes"],
          kids: grow(["$10", "$20", "$50"], ["$10", "$20"]),
          sep: ", ",
        })],
      },
      {
        w: 225,
        steps: [
          t("**(b)** From the tree diagram, there are 6 equally likely outcomes."),
          t("There are 2 favourable outcomes, i.e. \\$10, \\$10 and \\$20, \\$20."),
          so(`${P("s", "banknotes of the same value")} = ${f(2, 6)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q3",
    links: [{ key: "d", color: "pink", note: "different colours: every pair except WW and BB", q: ["different colours of shirt"] }],
    boxes: [
      { steps: [tree({ label: "(a)", cols: ["Alan’s shirt", "Ben’s shirt", "Possible Outcomes"], kids: grow(["W", "B", "Y"], ["P", "W", "B"]) })] },
      {
        w: 225,
        steps: [
          t("**(b)** From the tree diagram, there are 9 equally likely outcomes."),
          t("There are 7 favourable outcomes, i.e. WP, WB, BP, BW, YP, YW and YB."),
          so(`${P("d", "different colours of shirt")} = ${U(f(7, 9))}`),
        ],
      },
    ],
  },
  {
    id: "q4",
    links: [
      { key: "a", color: "pink", note: "only X3", q: ["the postcode ‘X3’ is formed"] },
      { key: "b", color: "green", note: "a Y or a 2: Y1, Y2, Y3, X2, Z2", q: ["a postcode with a ‘Y’ or a ‘2’"] },
    ],
    boxes: [
      { steps: [tree({ cols: ["Letter", "Number", "Possible Outcomes"], kids: grow(["X", "Y", "Z"], ["1", "2", "3"]) })] },
      {
        steps: [
          t("From the tree diagram, there are 9 equally likely outcomes."),
          t("**(a)** There is only 1 favourable outcome."),
          so(`${P("a", "‘X3’")} = ${U(f(1, 9))}`),
          t("**(b)** There are 5 favourable outcomes, i.e. X2, Y1, Y2, Y3 and Z2."),
          so(`${P("b", "with a ‘Y’ or a ‘2’")} = ${U(f(5, 9))}`),
        ],
      },
    ],
  },
  {
    id: "q5",
    links: [
      { key: "p", color: "pink", note: "prime: 2, 3, 5 with H", q: ["a prime number and a head"] },
      { key: "e", color: "green", note: "even and less than 6: 2, 4 with T", q: ["an even number less than 6 and a tail"] },
    ],
    boxes: [
      { steps: [tree({ label: "(a)", cols: ["Dice", "Coin", "Possible Outcomes"], kids: grow(["1", "2", "3", "4", "5", "6"], ["H", "T"]) })] },
      {
        steps: [
          t("**(b)** From the tree diagram, there are 12 equally likely outcomes."),
          t("**(i)** There are 3 favourable outcomes, i.e. 2H, 3H and 5H."),
          so(`${P("p", "a prime number and a head")} = ${f(3, 12)}`),
          m(`= ${U(f(1, 4))}`),
          t("**(ii)** There are 2 favourable outcomes, i.e. 2T and 4T."),
          so(`${P("e", "an even number less than 6 and a tail")} = ${f(2, 12)}`),
          m(`= ${U(f(1, 6))}`),
        ],
      },
    ],
  },
  {
    id: "q6",
    links: [
      { key: "o", color: "blue", note: "selected once → no repeated digit", q: ["Each number can only"] },
      { key: "m", color: "pink", note: "digit sum divisible by 3: 78, 87", q: ["a multiple of 3"] },
    ],
    boxes: [
      {
        steps: [lk("o", tree({
          label: "(a)",
          cols: ["Tens digit", "Units digit", "Possible Outcomes"],
          kids: [["6", ["7", "8"]], ["7", ["6", "8"]], ["8", ["6", "7"]]],
        }))],
      },
      {
        w: 225,
        steps: [
          t("**(b)** From the tree diagram, there are 6 equally likely outcomes."),
          t("There are 2 favourable outcomes, i.e. 78 and 87."),
          so(`${P("m", "multiple of 3")} = ${f(2, 6)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q7",
    boxes: [{
      bare: true,
      steps: [table({
        at: { xs: [161.4, 202.0, 242.7, 283.2, 324.1, 364.5, 404.9], ys: [599.3, 617.8, 636.3] },
        rows: [["H1", "H2", "H3", "H4", "H5", "H6"], ["T1", "T2", "T3", "T4", "T5", "T6"]],
        u: true,
      })],
    }],
  },
  {
    id: "q7b",
    links: [
      { key: "t", color: "pink", note: "T with 2, 4, 6", q: ["a tail and an even number"] },
      { key: "h", color: "green", note: "H with 1, 2", q: ["a head and a number smaller than 3"] },
    ],
    boxes: [
      {
        w: 205,
        steps: [
          t("**(b)** From the table, there are 12 possible outcomes."),
          t("**(i)** There are 3 outcomes in which a tail and an even number are shown, i.e. T2, T4 and T6."),
          so(`${P("t", "a tail and an even number")} = ${f(3, 12)}`),
          m(`= ${U(f(1, 4))}`),
        ],
      },
      {
        w: 240,
        steps: [
          t("**(ii)** There are 2 outcomes in which a head and a number smaller than 3 are shown, i.e. H1 and H2."),
          so(`${P("h", "a head and a number smaller than 3")} = ${f(2, 12)}`),
          m(`= ${U(f(1, 6))}`),
        ],
      },
    ],
  },
  {
    id: "q8",
    links: [{ key: "r", color: "blue", note: "put back → the same book can be picked twice", q: ["first book selected is put back into the"] }],
    boxes: [{
      bare: true,
      steps: [lk("r", table({
        at: { xs: [137.2, 179.4, 221.8, 264.2], ys: [169.6, 188.1, 206.5, 225.0] },
        rows: [["PP", "PB", "PO"], ["BP", "BB", "BO"], ["OP", "OB", "OO"]],
        u: true,
      }))],
    }],
  },
  {
    id: "q8b",
    links: [{ key: "p", color: "pink", note: "PB and BP", q: ["1 purple book and 1 black book are selected"] }],
    boxes: [
      {
        w: 250,
        steps: [
          t("**(b)** From the table, there are 9 possible outcomes."),
          t("There are 2 outcomes in which 1 purple book and 1 black book are selected, i.e. PB and BP."),
        ],
      },
      { steps: [so(`${P("p", "1 purple book and 1 black book")} = ${U(f(2, 9))}`)] },
    ],
  },
  {
    id: "q9",
    links: [{ key: "n", color: "blue", note: "not put back → cross out GG, YY, BB", q: ["NOT put back into the box"] }],
    boxes: [{
      bare: true,
      steps: [lk("n", table({
        at: { xs: [161.2, 203.4, 245.8, 287.7], ys: [427.4, 445.8, 464.4, 482.9] },
        rows: [["", "GY", "GB"], ["YG", "", "YB"], ["BG", "BY", ""]],
        strike: [[0, 0], [1, 1], [2, 2]],
        u: true,
      }))],
    }],
  },
  {
    id: "q9b",
    links: [{ key: "g", color: "pink", note: "GB and BG", q: ["1 green ball and 1 blue ball are drawn"] }],
    boxes: [
      {
        w: 285,
        steps: [
          t("**(b)** From the table, there are 6 possible outcomes."),
          t("There are 2 outcomes in which 1 green ball and 1 blue ball are drawn, i.e. GB and BG."),
        ],
      },
      {
        steps: [
          so(`${P("g", "1 green ball and 1 blue ball")} = ${f(2, 6)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q10",
    links: [
      { key: "e", color: "blue", note: "one book from each shelf → rows × columns", q: ["one book at random from each bookshelf"] },
      { key: "w", color: "pink", note: "W₁W₃ and W₂W₃", q: ["2 white books are drawn"] },
    ],
    boxes: [
      {
        w: 262,
        steps: [
          t("**(a)** Let W₁ and W₂ stand for the 2 white books in the first bookshelf, W₃ stand for the white book in the second bookshelf, B₁ stand for the black book in the first bookshelf, B₂ stand for the black book in the second bookshelf, and O stand for the orange book in the second bookshelf."),
          lk("e", table({
            top: "2nd bookshelf",
            left: "1st bookshelf",
            rows: [["", "W₃", "O", "B₂"], ["W₁", "W₁W₃", "W₁O", "W₁B₂"], ["W₂", "W₂W₃", "W₂O", "W₂B₂"], ["B₁", "B₁W₃", "B₁O", "B₁B₂"]],
          })),
        ],
      },
      {
        w: 210,
        steps: [
          t("**(b)** From the table, there are 9 possible outcomes."),
          t("There are 2 outcomes in which 2 white books are drawn, i.e. W₁W₃ and W₂W₃."),
          so(`${P("w", "2 white books")} = ${U(f(2, 9))}`),
        ],
      },
    ],
  },
  {
    id: "q11",
    links: [
      { key: "a", color: "pink", note: "first ball B₁ or B₂", q: ["the first ball drawn is of black colour"] },
      { key: "b", color: "green", note: "one white and one black", q: ["the two balls drawn are of different colours"] },
    ],
    boxes: [
      { steps: [t("Let W stand for the white ball, and B₁ and B₂ stand for the 2 black balls.")] },
      { steps: [tree({ cols: ["1st ball", "2nd ball", "Possible Outcomes"], kids: [["W", ["B₁", "B₂"]], ["B₁", ["W", "B₂"]], ["B₂", ["W", "B₁"]]] })] },
      {
        w: 250,
        steps: [
          t("From the tree diagram, there are 6 equally likely outcomes."),
          t("**(a)** There are 4 favourable outcomes, i.e. B₁W, B₁B₂, B₂W and B₂B₁."),
          so(`${P("a", "first ball drawn is of black colour")} = ${f(4, 6)}`),
          m(`= ${U(f(2, 3))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 4 favourable outcomes, i.e. WB₁, WB₂, B₁W and B₂W."),
          so(`${P("b", "different colours")} = ${f(4, 6)}`),
          m(`= ${U(f(2, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q12",
    links: [
      { key: "o", color: "blue", note: "without replacement → no repeated digit", q: ["one without replacement"] },
      { key: "a", color: "pink", note: "units digit 5", q: ["formed is a multiple of 5"] },
      { key: "b", color: "green", note: "13, 17, 31, 37, 53, 71, 73", q: ["formed is a prime number"] },
    ],
    boxes: [
      {
        steps: [lk("o", tree({
          cols: ["Tens digit", "Units digit", "Possible Outcomes"],
          kids: [["1", ["3", "5", "7"]], ["3", ["1", "5", "7"]], ["5", ["1", "3", "7"]], ["7", ["1", "3", "5"]]],
        }))],
      },
      {
        w: 250,
        steps: [
          t("From the tree diagram, there are 12 equally likely outcomes."),
          t("**(a)** There are 3 favourable outcomes, i.e. 15, 35 and 75."),
          so(`${P("a", "multiple of 5")} = ${f(3, 12)}`),
          m(`= ${U(f(1, 4))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 7 favourable outcomes, i.e. 13, 17, 31, 37, 53, 71 and 73."),
          so(`${P("b", "prime number")} = ${U(f(7, 12))}`),
        ],
      },
    ],
  },
  {
    id: "q13",
    links: [
      { key: "s", color: "blue", note: "at the same time → a card cannot pair with itself", q: ["drawn at the same time"] },
      { key: "l", color: "pink", note: "56, 77, 84 and their mirror images", q: ["is less than 88"] },
    ],
    boxes: [{
      steps: [
        lk("s", table({
          top: "2nd card",
          left: "1st card",
          rows: [["", "7", "8", "11", "12"], ["7", "", "56", "77", "84"], ["8", "56", "", "88", "96"], ["11", "77", "88", "", "132"], ["12", "84", "96", "132", ""]],
          strike: diag(4),
        })),
        t("From the table, there are 12 possible outcomes."),
        t("There are 6 outcomes in which the product of the numbers on the cards drawn is [[l|less than 88]]."),
        so(`\\text{The required probability} = ${f(6, 12)}`),
        m(`= ${U(f(1, 2))}`),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "w", color: "blue", note: "without replacement → cross out the diagonal", q: ["at random without replacement"] },
      { key: "a", color: "pink", note: "W₁W₂, W₂W₁, B₁B₂, B₂B₁, R₁R₂, R₂R₁", q: ["the 2 socks are of the same colour"] },
      { key: "b", color: "green", note: "rows B₁, B₂ plus the B columns", q: ["at least one of the socks is black in colour"] },
    ],
    boxes: [
      {
        steps: [
          t("Let (W₁, W₂), (B₁, B₂) and (R₁, R₂) represent the pair of white socks, the pair of black socks and the pair of red socks respectively."),
          lk("w", table({ top: "2nd sock", left: "1st sock", rows: pairs(["W₁", "W₂", "B₁", "B₂", "R₁", "R₂"]), strike: diag(6) })),
          t("From the table, there are 30 possible outcomes."),
          t("**(a)** There are 6 outcomes in which the 2 socks are of the same colour."),
          so(`${P("a", "2 socks of the same colour")} = ${f(6, 30)}`),
          m(`= ${U(f(1, 5))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 18 outcomes in which at least one of the socks is black in colour."),
          so(`${P("b", "at least one of the socks is black in colour")} = ${f(18, 30)}`),
          m(`= ${U(f(3, 5))}`),
        ],
      },
    ],
  },
  {
    id: "q15",
    links: [
      { key: "a", color: "pink", note: "YYY only", q: ["all of them go to the gym"] },
      { key: "b", color: "green", note: "exactly one N", q: ["only two of them go to the gym"] },
    ],
    boxes: [
      {
        steps: [
          t("Let Y stand for going to the gym and N stand for not going to the gym."),
          tree({ cols: ["Daniel", "Ellen", "Frank", "Possible Outcomes"], kids: grow(["Y", "N"], ["Y", "N"], ["Y", "N"]) }),
          t("From the tree diagram, there are 8 equally likely outcomes."),
        ],
      },
      {
        steps: [
          t("**(a)** There is only 1 favourable outcome, i.e. YYY."),
          so(`${P("a", "all of them go to the gym")} = ${U(f(1, 8))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 3 favourable outcomes, i.e. YYN, YNY and NYY."),
          so(`${P("b", "only two of them go to the gym")} = ${U(f(3, 8))}`),
        ],
      },
    ],
  },
  {
    id: "q16",
    links: [
      { key: "a", color: "pink", note: "exactly one matches true, false, C", q: ["only one of the answers correct"] },
      { key: "b", color: "green", note: "exactly two match", q: ["only two of the answers correct"] },
    ],
    boxes: [
      {
        steps: [
          tree({ cols: ["1st question", "2nd question", "3rd question", "Possible Outcomes"], kids: grow(["true", "false"], ["true", "false"], ["A", "B", "C"]), sep: ", " }),
          t("From the tree diagram, there are 12 equally likely outcomes."),
          t("**(a)** There are 5 favourable outcomes, i.e. true, true, A; true, true, B; false, true, C; false, false, A; false, false, B."),
          so(`${P("a", "only one of the answers correct")} = ${U(f(5, 12))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 4 favourable outcomes, i.e. true, true, C; true, false, A; true, false, B; false, false, C."),
          so(`${P("b", "only two of the answers correct")} = ${f(4, 12)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q17",
    links: [
      { key: "a", color: "pink", note: "cost above \\$15", q: ["more than $15 for the"] },
      { key: "d", color: "blue", note: "different colours → cross out RR and YY", q: ["uses different colours for wrapping paper and ribbon"] },
      { key: "b", color: "green", note: "cost below \\$20", q: ["total wrapping costs less than $20"] },
    ],
    boxes: [
      {
        steps: [
          t("Let R, Y, B and G stand for red, yellow, blue and green colours respectively."),
          h("(a)"),
          table({
            top: "Ribbon",
            left: "Wrapping\npaper",
            rows: [["", "G", "R", "Y"], ["R", "RG (\\$18)", "RR (\\$22)", "RY (\\$14)"], ["Y", "YG (\\$16)", "YR (\\$20)", "YY (\\$12)"], ["B", "BG (\\$17)", "BR (\\$21)", "BY (\\$13)"]],
          }),
          t("From the table, there are 9 possible outcomes."),
          t("There are 6 outcomes in which Sara pays [[a|more than \\$15]] for the wrappings."),
          so(`\\text{The required probability} = ${f(6, 9)}`),
          m(`= ${U(f(2, 3))}`),
        ],
      },
      {
        steps: [
          h("(b)"),
          lk("d", table({
            top: "Ribbon",
            left: "Wrapping\npaper",
            rows: [["", "G", "R", "Y"], ["R", "RG (\\$18)", "", "RY (\\$14)"], ["Y", "YG (\\$16)", "YR (\\$20)", ""], ["B", "BG (\\$17)", "BR (\\$21)", "BY (\\$13)"]],
            strike: [[1, 2], [2, 3]],
          })),
          t("From the table, there are 7 possible outcomes."),
          t("There are 5 outcomes in which the [[b|total wrapping cost is less than \\$20]]."),
          so(`\\text{The required probability} = ${U(f(5, 7))}`),
        ],
      },
    ],
  },
  {
    id: "q18",
    links: [
      { key: "a", color: "pink", note: "ad and bd", q: ["uses highway d"] },
      { key: "t", color: "blue", note: "add the two tolls", q: ["The toll rates of the highways"] },
      { key: "b", color: "green", note: "ac, ad, ae", q: ["toll for more than $30"] },
    ],
    boxes: [
      {
        steps: [
          lk("t", tree({
            cols: ["A → B", "B → C", "Possible Outcomes"],
            kids: grow(["a", "b"], ["c", "d", "e"]),
            out: ["ac  ($25 + $15 = $40)", "ad  ($25 + $30 = $55)", "ae  ($25 + $20 = $45)", "bc  ($15)", "bd  ($30)", "be  ($20)"],
          })),
          t("From the tree diagram, there are 6 equally likely outcomes."),
          t("**(a)** There are 2 favourable outcomes, i.e. $ad$ and $bd$."),
          so(`P(${L("a", "\\text{highway }d")}) = ${f(2, 6)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
      {
        steps: [
          t("**(b)** There are 3 favourable outcomes, i.e. $ac$, $ad$ and $ae$."),
          so(`${P("b", "more than \\$30")} = ${f(3, 6)}`),
          m(`= ${U(f(1, 2))}`),
        ],
      },
    ],
  },
  {
    id: "q19",
    links: [
      { key: "a", color: "pink", note: "132 and 231", q: ["probability that Paul wins"] },
      { key: "b", color: "green", note: "grid 3 never wins", q: ["would you NOT place your next move"] },
    ],
    boxes: [
      {
        steps: [
          tree({
            label: "(a)",
            cols: ["Paul", "Tina", "Paul", "Possible Outcomes"],
            kids: [["1", [["2", ["3"]], ["3", ["2"]]]], ["2", [["1", ["3"]], ["3", ["1"]]]], ["3", [["1", ["2"]], ["2", ["1"]]]]],
            out: ["123 (Draw)", "132 (Paul wins)", "213 (Draw)", "231 (Paul wins)", "312 (Draw)", "321 (Draw)"],
          }),
          t("From the tree diagram, there are 6 equally likely outcomes."),
          t("There are 2 favourable outcomes, i.e. 132 and 231."),
          so(`${P("a", "Paul wins")} = ${f(2, 6)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
      {
        steps: [
          t("**(b)** From the tree diagram, if Paul places his next move in grid 3, he has no chance to win. Therefore, we [[b|would not place the next move in grid 3]]."),
        ],
      },
    ],
  },
  {
    id: "q20",
    links: [
      { key: "d", color: "blue", note: "only S and E moves", q: ["only in the east and south directions"] },
      { key: "t", color: "pink", note: "routes through T", q: ["pass through"] },
      { key: "g", color: "green", note: "compare with 0.5", q: ["is greater than 0.5"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** Let [[d|S stand for the south direction and E stand for the east direction]]."),
          tree({
            cols: ["1st", "2nd", "3rd", "4th", "Possible Routes"],
            kids: [
              ["S", [["S", [["E", ["E"]]]], ["E", [["S", ["E"]], ["E", ["S"]]]]]],
              ["E", [["S", [["S", ["E"]], ["E", ["S"]]]], ["E", [["S", ["S"]]]]]],
            ],
          }),
          t("From the tree diagram, Andy can choose 6 routes to drive from $A$ to $B$."),
        ],
      },
      {
        steps: [
          t("**(b)** There are 4 routes which will pass through the junction $T$, i.e. SESE, SEES, ESSE and ESES."),
          m(`\\because\\ P(${L("t", "\\text{pass through the junction }T")}) = ${f(4, 6)}`),
          m(`= ${f(2, 3)}`),
          m(`> ${L("g", "0.5")}`),
          t("$\\therefore$ Sam’s claim is agreed."),
        ],
      },
    ],
  },
];

/** The key's boxes are dense, so every answer may shrink to 70 %. */
export const SOLUTIONS = LIST.map((s) => ({
  minScale: 0.7,
  ...s,
  boxes: s.boxes.map((b) => ({ ...b, steps: align(b.steps) })),
}));
