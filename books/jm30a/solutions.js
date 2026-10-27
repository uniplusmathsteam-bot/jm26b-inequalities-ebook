/**
 * Worked solutions laid out like the JM30 (A) answer key. Field reference:
 * docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk, align } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;
const P = (s) => `P(\\text{${s}})`;
const f = (a, b) => `\\dfrac{${a}}{${b}}`;

const LIST = [
  {
    id: "q1",
    links: [
      { key: "n", color: "blue", note: "total: 5 balls", q: ["5 balls"] },
      { key: "b", color: "pink", note: "favourable: 2 black", q: ["only 2 are black"] },
    ],
    boxes: [{
      steps: [
        m(`${P("black ball")} = ${U(f(L("b", "2"), L("n", "5")))}`, "favourable ÷ total"),
      ],
    }],
  },
  {
    id: "q2",
    links: [
      { key: "n", color: "blue", note: "total: 45 letters", q: ["45-letter word"] },
      { key: "o", color: "pink", note: "favourable: 9 ‘O’s", q: ["9 ‘O’s"] },
    ],
    boxes: [{
      steps: [
        m(`P(\\text{getting an ‘O’}) = ${f(L("o", "9"), L("n", "45"))}`, "favourable ÷ total"),
        m(`= ${U(f(1, 5))}`),
      ],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "n", color: "blue", note: "total: 30 students", q: ["30 students"] },
      { key: "b", color: "green", note: "18 boys", q: ["18 are boys"] },
      { key: "g", color: "purple", note: "asked: a girl", q: ["a girl is chosen"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Number of }${L("g", "\\text{girls}")} = ${L("n", "30")} - ${L("b", "18")} = 12`),
          m(`${P("girl")} = ${f(12, 30)}`, "favourable ÷ total"),
        m(`= ${U(f(2, 5))}`),
      ],
    }],
  },
  {
    id: "q4",
    links: [
      { key: "n", color: "blue", note: "add all four groups", q: ["20 patients with blood type A", "30 patients with blood type B", "25 patients with blood type AB"] },
      { key: "o", color: "pink", note: "favourable: 45 type O", q: ["45 patients with blood type O"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Total number of patients} = ${L("n", "20 + 30 + 25")} + ${L("o", "45")} = 120`),
        m(`${P("blood type O")} = ${f(45, 120)}`, "favourable ÷ total"),
        m(`= ${U(f(3, 8))}`),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "z", color: "pink", note: "no face shows 0", q: ["equal to 0"] },
      { key: "s", color: "green", note: "every face is less than 7", q: ["less than 7"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** $\\because$ There are 0 favourable outcomes."),
          m(`\\therefore\\ P(${L("z", "\\text{equal to 0}")}) = ${f(0, 6)}`),
          m(`= ${U("0")}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ There are 6 favourable outcomes, i.e. 1, 2, 3, 4, 5 and 6."),
          m(`\\therefore\\ P(${L("s", "\\text{less than 7}")}) = ${f(6, 6)}`),
          m(`= ${U("1")}`),
        ],
      },
    ],
  },
  {
    id: "q6",
    links: [
      { key: "w", color: "pink", note: "10 white", q: ["10 pieces of white chocolates"] },
      { key: "d", color: "blue", note: "16 dark", q: ["16 pieces of dark chocolates"] },
      { key: "k", color: "green", note: "22 milk", q: ["22 pieces of milk chocolates"] },
      { key: "n", color: "purple", note: "not milk → total − milk", q: ["not a piece of milk chocolate"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of pieces of chocolates}"),
          m(`= ${L("w", "10")} + ${L("d", "16")} + ${L("k", "22")}`),
          m("= 48"),
          m(`\\textbf{(a)}\\enspace ${P("white chocolate")} = ${f(10, 48)}`),
          m(`= ${U(f(5, 24))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace ${P("not a piece of milk chocolate")} = ${f(L("n", "48 - 22"), 48)}`),
          m(`= ${f(26, 48)}`),
          m(`= ${U(f(13, 24))}`),
        ],
      },
    ],
  },
  {
    id: "q7",
    links: [
      { key: "e", color: "pink", note: "either … or → add the two groups", q: ["either a doctor or a ward assistant"] },
      { key: "n", color: "blue", note: "neither doctor nor nurse → the other two groups", q: ["neither a doctor nor a nurse"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of people in the ward}"),
          m("= 3 + 10 + 5 + 42"),
          m("= 60"),
          m(`\\textbf{(a)}\\enspace ${P("either a doctor or a ward assistant")} = ${f(L("e", "3 + 5"), 60)}`),
          m(`= ${f(8, 60)}`),
          m(`= ${U(f(2, 15))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace ${P("neither a doctor nor a nurse")}`),
          m(`= ${L("n", P("either a ward assistant or a patient"))}`),
          m(`= ${f("5 + 42", 60)}`),
          m(`= ${U(f(47, 60))}`),
        ],
      },
    ],
  },
  {
    id: "q8",
    links: [
      { key: "a", color: "pink", note: "count the leaves 7.3 to 8.4", q: ["greater than 7.2 cm but less than 8.5 cm"] },
      { key: "b", color: "blue", note: "count the leaves up to 7.1", q: ["not greater than 7.1 cm"] },
    ],
    boxes: [
      {
        steps: [
          t("Total number of pencils in the classroom $= 30$"),
          t("**(a)** Number of pencils whose lengths are [[a|greater than 7.2 cm but less than 8.5 cm]] $= 8$"),
          m(`\\therefore\\ ${P("greater than 7.2 cm but less than 8.5 cm")} = ${f(8, 30)}`),
          m(`= ${U(f(4, 15))}`),
        ],
      },
      {
        steps: [
          t("**(b)** Number of pencils whose lengths are [[b|not greater than 7.1 cm]] $= 10$"),
          m(`\\therefore\\ ${P("not greater than 7.1 cm")} = ${f(10, 30)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q9",
    links: [
      { key: "n", color: "blue", note: "total: 30 boxes", q: ["30 boxes"] },
      { key: "a", color: "pink", note: "frequency of 25 – 29", q: ["(a) 25 – 29"] },
      { key: "b", color: "green", note: "20 – 34: three classes", q: ["(b) 20 – 34"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\text{The required probability} = ${f(L("a", "14"), L("n", "30"))}`),
          m(`= ${U(f(7, 15))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace \\text{The required probability} = ${f(L("b", "2 + 14 + 10"), 30)}`),
          m(`= ${f(26, 30)}`),
          m(`= ${U(f(13, 15))}`),
        ],
      },
    ],
  },
  {
    id: "q10",
    links: [
      { key: "a", color: "pink", note: "frequency of 31 − 40", q: ["(a) 31 kg − 40 kg"] },
      { key: "b", color: "green", note: "1 − 30: three classes", q: ["(b) 1 kg − 30 kg"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of animals} = 7 + 14 + 11 + 8 + 10 = 50"),
          m(`\\textbf{(a)}\\enspace \\text{The required probability} = ${f(L("a", "8"), 50)}`),
          m(`= ${U(f(4, 25))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace \\text{The required probability} = ${f(L("b", "7 + 14 + 11"), 50)}`),
          m(`= ${f(32, 50)}`),
          m(`= ${U(f(16, 25))}`),
        ],
      },
    ],
  },
  {
    id: "q11",
    links: [
      { key: "n", color: "blue", note: "total: 125 interviewed", q: ["randomly interviewed 125"] },
      { key: "z", color: "pink", note: "no pet → 0 pets: 72", q: ["does not have a pet"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{The required probability} \\approx ${U(f(L("z", "72"), L("n", "125")))}`, "frequency ÷ trials"),
      ],
    }],
  },
  {
    id: "q12",
    links: [
      { key: "c", color: "pink", note: "favourable: 45 for Brand C", q: ["favours Brand C mobile phone"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of students interviewed} = 35 + 12 + 45 + 68"),
          m("= 160"),
        ],
      },
      {
        steps: [
          m(`\\therefore\\ \\text{The required probability} \\approx ${f(L("c", "45"), 160)}`),
          m(`= ${U(f(9, 32))}`),
        ],
      },
    ],
  },
  {
    id: "q13",
    links: [
      { key: "n", color: "blue", note: "total: 200 throws", q: ["thrown 200 times"] },
      { key: "a", color: "pink", note: "‘1’ or ‘3’ → add their frequencies", q: ["the numbers ‘1’ or ‘3’"] },
      { key: "b", color: "green", note: "greater than 3 → ‘4’, ‘5’, ‘6’", q: ["a number greater than 3"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\text{The required probability} \\approx ${f(L("a", "66 + 48"), L("n", "200"))}`),
          m(`= ${f(114, 200)}`),
          m(`= ${U(f(57, 100))}`),
        ],
      },
      {
        left: 255,
        steps: [
          t("**(b)** Frequency of getting a number greater than 3"),
          t("$=$ total frequency of getting [[b|the numbers ‘4’, ‘5’ or ‘6’]]"),
          m("= 16 + 24 + 4"),
          m("= 44"),
          m(`\\therefore\\ \\text{The required probability} \\approx ${f(44, 200)}`),
          m(`= ${U(f(11, 50))}`),
        ],
      },
    ],
  },
  {
    id: "q14",
    links: [
      { key: "b", color: "pink", note: "set meal B: 350", q: ["(a) set meal B"] },
      { key: "c", color: "green", note: "C or D → add 314 and 306", q: ["(b) set meals C or D"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of teenage customers interviewed}"),
          m("= 343 + 350 + 314 + 306 + 367"),
          m("= 1680"),
          m(`\\textbf{(a)}\\enspace \\text{The required probability} \\approx ${f(L("b", "350"), 1680)}`),
          m(`= ${U(f(5, 24))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace \\text{The required probability} \\approx ${f(L("c", "314 + 306"), 1680)}`),
          m(`= ${f(620, 1680)}`),
          m(`= ${U(f(31, 84))}`),
        ],
      },
    ],
  },
  {
    id: "q15",
    links: [
      { key: "n", color: "blue", note: "total: 1500 pupils", q: ["1500 pupils"] },
      { key: "o", color: "pink", note: "350 overweight", q: ["350 are overweight"] },
      { key: "x", color: "purple", note: "not overweight → total − 350", q: ["not overweight"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{The required probability} \\approx ${f(L("x", `${L("n", "1500")} - ${L("o", "350")}`), 1500)}`),
        m(`= ${f(1150, 1500)}`),
        m(`= ${U(f(23, 30))}`),
      ],
    }],
  },
  {
    id: "q16",
    links: [
      { key: "n", color: "blue", note: "total: 20 days", q: ["in the past 20 days"] },
      { key: "a", color: "pink", note: "16 – 17 and 18 – 19", q: ["at least 16 books but at most 19 books"] },
      { key: "b", color: "green", note: "15 or less and 16 – 17", q: ["at most 17 books"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace P(\\text{at least 16 books but at most 19 books}) \\approx ${f(L("a", "3 + 4"), L("n", "20"))}`),
          m(`= ${U(f(7, 20))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace P(\\text{at most 17 books}) \\approx ${f(L("b", "5 + 3"), 20)}`),
          m(`= ${f(8, 20)}`),
          m(`= ${U(f(2, 5))}`),
        ],
      },
    ],
  },
  {
    id: "q17",
    letter: "D",
    minScale: 0.7,
    links: [
      { key: "d", color: "pink", note: "divisible by 3 → digit sum divisible by 3", q: ["divisible by 3"] },
      { key: "s", color: "blue", note: "10 choices: 0 to 9", q: ["is an integer from 0 to 9 inclusive"] },
    ],
    boxes: [{
      steps: [
        t("$\\because$ $43\\bigstar$ is divisible by 3."),
        t(`$\\therefore$ $4 + 3 + \\bigstar$ is [[d|divisible by 3]].`, "digit sum test"),
        m("\\therefore\\ 4 + 3 + \\bigstar = 9,\\ 12 \\text{ or } 15"),
        m("\\bigstar = 2,\\ 5 \\text{ or } 8"),
        m(`\\therefore\\ \\text{The required probability} = ${U(f(3, L("s", "10")))}`),
      ],
    }],
  },
  {
    id: "q18",
    letter: "D",
    minScale: 0.7,
    links: [
      { key: "s", color: "blue", note: "700 to 799: 100 numbers", q: ["are integers from 0 to 9 inclusive"] },
      { key: "d", color: "pink", note: "multiples of 7 from 700 to 799", q: ["divisible by 7"] },
    ],
    boxes: [{
      steps: [
        t(`Number of possible 3-digit numbers $= ${L("s", "100")}$`),
        m(`\\because\\ ${L("d", "\\overbrace{700,\\ 707,\\ \\ldots,\\ 770}^{11\\text{ numbers}},\\ 777,\\ 784,\\ 791,\\ 798")} \\text{ are divisible by 7.}`),
        t("$\\therefore$ There are 15 favourable 3-digit numbers."),
        m(`\\therefore\\ P(\\text{divisible by 7}) = ${f(15, 100)}`),
        m(`= ${U(f(3, 20))}`),
      ],
    }],
  },
  {
    id: "q19",
    links: [
      { key: "a", color: "pink", note: "4 Aces + 12 face cards", q: ["an Ace or a face card"] },
      { key: "b", color: "green", note: "remove spades and ‘K’s; the spade ‘K’ only once", q: ["neither a spade nor a ‘K’"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** $\\because$ There are 4 Aces and 12 face cards in a deck of 52 playing cards."),
          m(`\\therefore\\ P(\\text{an Ace or a face card}) = ${f(L("a", "4 + 12"), 52)}`),
          m(`= ${f(16, 52)}`),
          m(`= ${U(f(4, 13))}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ There are 13 spades and 4 ‘K’s in a deck of 52 playing cards, but the spade ‘K’ is both a spade and a ‘K’."),
          m(`\\therefore\\ \\text{Number of favourable outcomes} = ${L("b", "52 - (13 + 4 - 1)")}`),
          m("= 36"),
          m(`\\therefore\\ P(\\text{neither a spade nor a ‘K’}) = ${f(36, 52)}`),
          m(`= ${U(f(9, 13))}`),
        ],
      },
    ],
  },
  {
    id: "q20",
    links: [
      { key: "n", color: "blue", note: "21 to 70: 50 integers", q: ["from 21 to 70"] },
      { key: "e", color: "pink", note: "multiples of 8", q: ["(i) a multiple of 8"] },
      { key: "t", color: "green", note: "multiples of 12", q: ["(ii) a multiple of 12"] },
      { key: "o", color: "purple", note: "or → add, then remove the overlap", q: ["a multiple of 8 or a multiple of 12"] },
    ],
    boxes: [
      {
        steps: [
          h("(a) (i)"),
          t(`Among the ${"[[n|50 integers]]"}, there are 6 integers which are [[e|multiples of 8]], i.e. 24, 32, 40, 48, 56 and 64.`),
          m(`\\therefore\\ P(\\text{multiple of 8}) = ${f(6, 50)}`),
          m(`= ${U(f(3, 25))}`),
          t("**(ii)** Among the 50 integers, there are 4 integers which are [[t|multiples of 12]], i.e. 24, 36, 48 and 60."),
          m(`\\therefore\\ P(\\text{multiple of 12}) = ${f(4, 50)}`),
          m(`= ${U(f(2, 25))}`),
        ],
      },
      {
        steps: [
          t("**(b)** Among the 50 integers, there are 6 multiples of 8 and 4 multiples of 12, but 24 and 48 are both multiples of 8 and 12."),
          m(`\\therefore\\ \\text{Number of favourable outcomes} = ${L("o", "6 + 4 - 2")}`),
          m("= 8"),
          m(`\\therefore\\ P(\\text{multiple of 8 or multiple of 12}) = ${f(8, 50)}`),
          m(`= ${U(f(4, 25))}`),
        ],
      },
    ],
  },
  {
    id: "q21",
    links: [
      { key: "l", color: "pink", note: "late: 24 boys + 11 girls", q: ["(a) being late"] },
      { key: "g", color: "green", note: "girls: 11 + 328", q: ["(b) a girl"] },
    ],
    boxes: [
      {
        steps: [
          t("From the table, total number of students in the school $= 24 + 11 + 387 + 328 = 750$"),
          t(`**(a)** Number of students being late $= ${L("l", "24 + 11")} = 35$`),
          m(`\\therefore\\ P(\\text{being late}) = ${f(35, 750)}`),
          m(`= ${U(f(7, 150))}`),
        ],
      },
      {
        steps: [
          t(`**(b)** Number of girls $= ${L("g", "11 + 328")} = 339$`),
          m(`\\therefore\\ P(\\text{a girl}) = ${f(339, 750)}`),
          m(`= ${U(f(113, 250))}`),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "e", color: "pink", note: "baptized and elderly: 77", q: ["a baptized elderly person"] },
      { key: "b", color: "blue", note: "the Baptized column", q: ["(b) a baptized person"] },
      { key: "a", color: "green", note: "the Adults row", q: ["(c) an adult"] },
    ],
    boxes: [
      {
        steps: [
          t("Total number of people in the church"),
          m("= 37 + 53 + 120 + 155 + 77 + 58"),
          m("= 500"),
          m(`\\textbf{(a)}\\enspace P(\\text{baptized elderly person}) = ${U(f(L("e", "77"), 500))}`),
          t("**(b)** Number of baptized people in the church"),
          m(`= ${L("b", "37 + 120 + 77")}`),
          m("= 234"),
          m(`\\therefore\\ P(\\text{baptized person}) = ${f(234, 500)}`),
          m(`= ${U(f(117, 250))}`),
        ],
      },
      {
        steps: [
          t("**(c)** Number of adults in the church"),
          m(`= ${L("a", "120 + 155")}`),
          m("= 275"),
          m(`\\therefore\\ P(\\text{adult}) = ${f(275, 500)}`),
          m(`= ${U(f(11, 20))}`),
        ],
      },
    ],
  },
  {
    id: "q23",
    links: [
      { key: "a", color: "pink", note: "the Vase A row", q: ["(a) in vase A"] },
      { key: "r", color: "blue", note: "the Rose column", q: ["(b) a rose"] },
      { key: "c", color: "green", note: "not tulip, not vase C → roses and carnations in A, B", q: ["neither a tulip nor in vase C"] },
    ],
    boxes: [
      {
        steps: [
          m("\\text{Total number of flowers}"),
          m("= 7 + 5 + 1 + 2 + 4 + 8 + 3 + 4 + 2"),
          m("= 36"),
          m(`\\textbf{(a)}\\enspace \\text{Number of flowers in vase }A = ${L("a", "7 + 2 + 3")} = 12`),
          m(`\\therefore\\ P(\\text{vase }A) = ${f(12, 36)}`),
          m(`= ${U(f(1, 3))}`),
          m(`\\textbf{(b)}\\enspace \\text{Number of roses} = ${L("r", "7 + 5 + 1")} = 13`),
          m(`\\therefore\\ P(\\text{a rose}) = ${U(f(13, 36))}`),
        ],
      },
      {
        steps: [
          t("**(c)** Number of flowers which are neither tulips nor in vase $C$"),
          t("$=$ total number of roses and carnations in vases $A$ or $B$"),
          m(`= ${L("c", "7 + 5 + 3 + 4")}`),
          m("= 19"),
          m(`\\therefore\\ P(\\text{neither a tulip nor in vase }C) = ${U(f(19, 36))}`),
        ],
      },
    ],
  },
  {
    id: "q24",
    links: [
      { key: "b", color: "pink", note: "the Breakfast column", q: ["his/her favourite meal is breakfast"] },
      { key: "s", color: "blue", note: "only senior staff: new total", q: ["chosen at random from senior staff members"] },
      { key: "l", color: "green", note: "senior and lunch: 16", q: ["his/her favourite meal is lunch"] },
    ],
    boxes: [{
      steps: [
        m("\\textbf{(a)}\\enspace \\text{Total number of staff members} = 32 + 20 + 24 + 10 + 16 + 18 = 120"),
        m(`\\text{Number of staff members whose favourite meals are breakfast} = ${L("b", "32 + 10")} = 42`),
        m(`\\therefore\\ P(\\text{favourite meal is breakfast}) = ${f(42, 120)}`),
        m(`= ${U(f(7, 20))}`),
        m(`\\textbf{(b)}\\enspace \\text{Total number of }${L("s", "\\text{senior staff members}")} = 10 + 16 + 18 = 44`),
        m(`\\text{Number of senior staff members whose favourite meals are lunch} = ${L("l", "16")}`),
        m(`\\therefore\\ P(\\text{favourite meal is lunch}) = ${f(16, 44)}`),
        m(`= ${U(f(4, 11))}`),
      ],
    }],
  },
  {
    id: "q25",
    links: [
      { key: "a", color: "pink", note: "S3A: 20 boys + 18 girls", q: ["the student is from S3A"] },
      { key: "g", color: "blue", note: "only girls: new total", q: ["chosen at random from the girls of all S3 classes"] },
      { key: "e", color: "green", note: "girls in S3E: 14", q: ["the girl is from S3E"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** Total number of S3 students"),
          m("= 20 + 18 + 18 + 16 + 18 + 18 + 18 + 16 + 16 + 14"),
          m("= 172"),
          t(`Number of students in S3A $= ${L("a", "20 + 18")} = 38$`),
          m(`\\therefore\\ P(\\text{from S3A}) = ${f(38, 172)}`),
          m(`= ${U(f(19, 86))}`),
        ],
      },
      {
        steps: [
          t(`**(b)** Total number of ${"[[g|S3 girls]]"} $= 18 + 18 + 16 + 16 + 14 = 82$`),
          t(`Number of girls in S3E $= ${L("e", "14")}$`),
          m(`\\therefore\\ P(\\text{from S3E}) = ${f(14, 82)}`),
          m(`= ${U(f(7, 41))}`),
        ],
      },
    ],
  },
  {
    id: "q26",
    links: [
      { key: "b", color: "pink", note: "less than 2.95 m: the first class, 4", q: ["less than 2.95 m"] },
      { key: "c", color: "blue", note: "c = cumulative frequency below 3.45 m", q: ["3.45 c"] },
      { key: "t", color: "green", note: "total: 40 trees", q: ["4.45 40"] },
      { key: "a", color: "purple", note: "at least 3.45 m → 40 − c", q: ["at least 3.45 m"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\text{The required probability} = ${f(L("b", "4"), L("t", "40"))}`),
          m(`= ${U(f(1, 10))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace ${L("c", "c")} = 4 + 8`),
          m("= 12"),
          t("Number of trees with height at least 3.45 m"),
          m(`= ${L("a", "40 - c")}`),
          m("= 40 - 12"),
          m("= 28"),
          m(`\\therefore\\ \\text{The required probability} = ${f(28, 40)}`),
          m(`= ${U(f(7, 10))}`),
        ],
      },
    ],
  },
  {
    id: "q27",
    links: [
      { key: "n", color: "blue", note: "total: 18 cards", q: ["18 cards marked with the numbers 1 to 18"] },
      { key: "r", color: "pink", note: "15 is not prime → 17 cards, still 7 primes", q: ["The card ‘15’ is removed from the box"] },
    ],
    boxes: [{
      steps: [
        t("**(a)** $\\because$ Among the [[n|18 numbers]], there are 7 prime numbers, i.e. 2, 3, 5, 7, 11, 13 and 17."),
        m(`\\therefore\\ P(\\text{prime number}) = ${U(f(7, 18))}`),
        t("**(b)** $\\because$ After [[r|the card ‘15’ is removed]] from the box, 17 numbers are left in the box."),
        m(`\\therefore\\ \\text{The new required probability} = ${f(7, 17)}`),
        m(`> ${f(7, 18)}`),
        t("$\\therefore$ Betty’s claim is agreed."),
      ],
    }],
  },
  {
    id: "q28",
    links: [
      { key: "c", color: "blue", note: "20 + 10 + 6 coupons", q: ["20 $20 coupons, 10 $50 coupons and 6 $100 coupons"] },
      { key: "f", color: "pink", note: "one $100 coupon gone → 35 left", q: ["the first guest draws a $100 coupon"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** Total number of coupons in the box"),
          m(`= ${L("c", "20 + 10 + 6")}`),
          m("= 36"),
          m(`P(\\text{a \\$100 coupon}) = ${f(6, 36)}`),
          m(`= ${U(f(1, 6))}`),
        ],
      },
      {
        steps: [
          t("**(b)** After [[f|drawing a \\$100 coupon by the first guest]],"),
          t("the total number of coupons in the box $= 36 - 1 = 35$"),
          t("and the number of \\$100 coupons in the box $= 6 - 1 = 5$"),
          m(`\\textbf{(i)}\\enspace P(\\text{a \\$50 coupon}) = ${f(10, 35)}`),
          m(`= ${U(f(2, 7))}`),
          m(`\\textbf{(ii)}\\enspace P(\\text{a \\$100 coupon}) = ${f(5, 35)}`),
          m(`= ${U(f(1, 7))}`),
        ],
      },
    ],
  },
  {
    id: "q29",
    links: [
      { key: "k", color: "purple", note: "unknown: $k$ green beans", q: ["𝑘 green beans"] },
      { key: "r", color: "pink", note: "8 red beans", q: ["8 red beans"] },
      { key: "p", color: "amber", note: "$P(\\text{red}) = \\frac{2}{7}$", q: ["probability of drawing a red bean is"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\because\\ P(\\text{red bean}) = ${L("p", f(2, 7))}`),
          m(`\\therefore\\ ${f(L("r", "8"), `${L("k", "k")} + 8`)} = ${f(2, 7)}`, "red ÷ total"),
          m("56 = 2(k + 8)", "cross-multiply"),
        ],
      },
      {
        steps: [
          m("28 = k + 8", "÷ 2"),
          m(`k = ${U("20")}`, "− 8"),
        ],
      },
    ],
  },
  {
    id: "q30",
    links: [
      { key: "m", color: "blue", note: "33 male", q: ["33 male staff members"] },
      { key: "n", color: "purple", note: "unknown: $n$ female", q: ["𝑛 female staff members"] },
      { key: "p", color: "amber", note: "$P(\\text{female}) = \\frac{6}{17}$", q: ["the probability of selecting a female staff member is"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\because\\ P(\\text{female staff member}) = ${L("p", f(6, 17))}`),
          m(`\\therefore\\ ${f(L("n", "n"), `n + ${L("m", "33")}`)} = ${f(6, 17)}`, "female ÷ total"),
          m("17n = 6(n + 33)", "cross-multiply"),
        ],
      },
      {
        steps: [
          m("17n = 6n + 198"),
          m("11n = 198", "− 6n"),
          m(`n = ${U("18")}`, "÷ 11"),
        ],
      },
    ],
  },
  {
    id: "q31",
    links: [
      { key: "x", color: "purple", note: "unknown: $x$ red", q: ["𝑥 red cards"] },
      { key: "o", color: "pink", note: "12 orange", q: ["12 orange cards"] },
      { key: "g", color: "blue", note: "6 green", q: ["6 green cards"] },
      { key: "p", color: "amber", note: "$P(\\text{orange}) = \\frac{3}{7}$", q: ["the probability of drawing an orange card is"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\because\\ P(\\text{orange card}) = ${L("p", f(3, 7))}`),
          m(`\\therefore\\ ${f(L("o", "12"), `${L("x", "x")} + 12 + ${L("g", "6")}`)} = ${f(3, 7)}`, "orange ÷ total"),
          m("84 = 3(x + 18)", "cross-multiply"),
        ],
      },
      {
        steps: [
          m("28 = x + 18", "÷ 3"),
          m(`x = ${U("10")}`, "− 18"),
        ],
      },
    ],
  },
  {
    id: "q32",
    links: [
      { key: "n", color: "purple", note: "unknown: $n$ cartons of lemon tea", q: ["How many cartons of lemon tea"] },
      { key: "a", color: "blue", note: "apple $= n - 20$", q: ["The number of cartons of lemon tea is 20 more than that of apple juice"] },
      { key: "o", color: "green", note: "orange $= \\frac{n}{2}$", q: ["cartons of orange juice is half of that of lemon tea"] },
      { key: "p", color: "amber", note: "$P(\\text{orange}) = \\frac{2}{9}$", q: ["probability of getting a carton of orange juice is"] },
    ],
    boxes: [
      {
        steps: [
          t("Let [[n|$n$ be the number of cartons of lemon tea]]."),
          t(`Then, the number of cartons of apple juice is $${L("a", "n - 20")}$ and the number of cartons of orange juice is $${L("o", f("n", 2))}$.`),
          m(`\\text{Total number of cartons of drinks} = n + (n - 20) + ${f("n", 2)} = ${f("5n", 2)} - 20`),
        ],
      },
      {
        steps: [
          m(`\\because\\ P(\\text{orange juice}) = ${L("p", f(2, 9))}`),
          m(`\\therefore\\ ${f(f("n", 2), `${f("5n", 2)} - 20`)} = ${f(2, 9)}`, "orange ÷ total"),
        ],
      },
      {
        steps: [
          m(`${f("n", "5n - 40")} = ${f(2, 9)}`, "× 2 top and bottom"),
          m("9n = 10n - 80", "cross-multiply"),
          m("n = 80"),
          t("$\\therefore$ There are 80 cartons of lemon tea."),
        ],
      },
    ],
  },
  {
    id: "q33",
    minScale: 0.7,
    links: [
      { key: "t", color: "blue", note: "total: 60 cards", q: ["60 cards"] },
      { key: "w", color: "pink", note: "$P(\\text{white}) = \\frac{1}{6}$, $P(\\text{black}) = \\frac{2}{5}$", q: ["the probabilities of drawing a white card and a black card are"] },
      { key: "n", color: "purple", note: "add $n$ purple cards", q: ["a certain number of purple cards are put into the box"] },
      { key: "p", color: "amber", note: "$P(\\text{purple}) = \\frac{4}{7}$?", q: ["the probability of drawing a purple card can be"] },
    ],
    boxes: [{
      steps: [
        t("Let $x$ be the number of white cards in the box."),
        m(`${f("x", L("t", "60"))} = ${L("w", f(1, 6))}`),
        m("x = 10"),
        t("$\\therefore$ There are 10 white cards in the box."),
        t("Let $y$ be the number of black cards in the box."),
        m(`${f("y", 60)} = ${f(2, 5)}`),
        m("y = 24"),
        t("$\\therefore$ There are 24 black cards in the box."),
        t("Original number of purple cards in the box $= 60 - 10 - 24 = 26$"),
        t(`Suppose [[n|$n$ purple cards are put into the box]] and the probability of drawing a purple card from the box is $${L("p", f(4, 7))}$.`),
        m(`\\therefore\\ ${f("26 + n", "60 + n")} = ${f(4, 7)}`),
        m("7(26 + n) = 4(60 + n)", "cross-multiply"),
        m("182 + 7n = 240 + 4n"),
        m("3n = 58"),
        m(`n = ${f(58, 3)}\\text{, which is not an integer.}`),
        t("$\\therefore$ Ellen’s claim is disagreed."),
      ],
    }],
  },
  {
    id: "q34",
    links: [
      { key: "a", color: "pink", note: "64 heads in 100 tosses", q: ["tossing the coin 100 times"] },
      { key: "b", color: "blue", note: "487 heads in 1000 tosses", q: ["tossing the coin 1000 times"] },
      { key: "c", color: "green", note: "5014 heads in 10 000 tosses", q: ["tossing the coin 10 000 times"] },
    ],
    boxes: [
      {
        steps: [
          t("**(a)** Probability of getting a head"),
          m(`\\approx ${f(L("a", "64"), 100)}`, "heads ÷ tosses"),
          m(`= ${U(f(16, 25))}`),
          t("**(b)** Probability of getting a head"),
          m(`\\approx ${U(f(L("b", "487"), 1000))}`),
        ],
      },
      {
        steps: [
          t("**(c)** Probability of getting a head"),
          m(`\\approx ${f(L("c", "5014"), "10\\,000")}`),
          m(`= ${U(f(2507, 5000))}`),
        ],
      },
    ],
  },
  {
    id: "q35",
    links: [
      { key: "g", color: "blue", note: "boys $= 1 - 55\\%$", q: ["55% are girls"] },
      { key: "b", color: "pink", note: "30% of boys by bus", q: ["30% of the boys"] },
      { key: "q", color: "green", note: "40% of girls by bus", q: ["40% of the girls"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\text{Number of boys who go to school by bus} = 600 \\times ${L("g", "(1 - 55\\%)")} \\times ${L("b", "30\\%")}`),
          m("= 81"),
          m(`\\therefore\\ P(\\text{a boy who goes to school by bus}) = ${f(81, 600)}`),
          m(`= ${U(f(27, 200))}`),
        ],
      },
      {
        steps: [
          t("**(b)** Number of students who do not go to school by bus"),
          m(`= 600 \\times (1 - 55\\%) \\times (1 - 30\\%) + 600 \\times 55\\% \\times ${L("q", "(1 - 40\\%)")}`),
          m("= 387"),
          m(`\\therefore\\ P(\\text{does not go to school by bus}) = ${f(387, 600)}`),
          m(`= ${U(f(129, 200))}`),
        ],
      },
    ],
  },
  {
    id: "q36",
    links: [
      { key: "m", color: "pink", note: "35 in Mathematics", q: ["35 of them are members of the Mathematics club"] },
      { key: "x", color: "purple", note: "unknown: $x$ in Science", q: ["𝑥 of them are members"] },
      { key: "b", color: "blue", note: "8 counted twice", q: ["8 students are members of both clubs"] },
      { key: "n", color: "green", note: "everyone is in a club: 50", q: ["In a group of 50 students"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace ${L("m", "35")} + ${L("x", "x")} - ${L("b", "8")} = ${L("n", "50")}`, "both clubs counted once"),
          m(`x = ${U("23")}`),
        ],
      },
      {
        steps: [
          h("(b) (i)"),
          m("\\text{Number of students who is not a member of the Science club} = 50 - 23"),
          m("= 27"),
          m(`\\therefore\\ P(\\text{not a member of the Science club}) = ${U(f(27, 50))}`),
          m("\\textbf{(ii)}\\enspace \\text{Number of students who only joins Science club} = 23 - 8"),
          m("= 15"),
          m(`\\therefore\\ P(\\text{only joins Science club}) = ${f(15, 50)}`),
          m(`= ${U(f(3, 10))}`),
        ],
      },
    ],
  },
  {
    id: "q37",
    minScale: 0.7,
    links: [
      { key: "p", color: "amber", note: "$P(\\text{blue}) = \\frac{5}{6}$", q: ["probability of drawing a blue card is"] },
      { key: "e", color: "pink", note: "blue becomes $x + 8$", q: ["8 more blue cards are then added to the box"] },
      { key: "q", color: "green", note: "new $P(\\text{blue}) = \\frac{17}{20}$", q: ["the probability of drawing a blue card becomes"] },
      { key: "x", color: "purple", note: "asked: original blue $= x$", q: ["Find the original number of blue cards in the box"] },
    ],
    boxes: [
      {
        steps: [
          t("Let [[x|$x$]] and $y$ be the original numbers of blue cards and green cards in the box respectively."),
          m(`${f("x", "x + y")} = ${L("p", f(5, 6))}`),
          m("6x = 5(x + y)"),
          m("6x = 5x + 5y"),
          m("x = 5y \\quad \\ldots\\ldots (1)"),
          m(`${f(L("e", "x + 8"), "(x + 8) + y")} = ${L("q", f(17, 20))}`),
          m("20(x + 8) = 17(x + 8 + y)"),
          m("20x + 160 = 17x + 136 + 17y"),
          m("3x - 17y = -24 \\quad \\ldots\\ldots (2)"),
        ],
      },
      {
        steps: [
          t("By substituting (1) into (2), we have"),
          m("3(5y) - 17y = -24"),
          m("-2y = -24"),
          m("y = 12"),
          t("By substituting $y = 12$ into (1), we have"),
          m("x = 5(12)"),
          m("= 60"),
          t("$\\therefore$ The original number of blue cards in the box is 60."),
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
