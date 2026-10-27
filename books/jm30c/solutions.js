/**
 * Worked solutions for this book, following the teacher's ANS method.
 * Field reference: docs/02-book-format.md. House style: docs/03-authoring-style.md.
 */

import { m, t, h, L, lk, tree, table, grow, align } from "../../engine/authoring.js";

const U = (s) => `\\underline{\\underline{${s}}}`;
const f = (a, b) => `\\dfrac{${a}}{${b}}`;
const so = (tex) => m(`\\therefore\\ ${tex}`);

/** Outcome table of throwing two dice, cells "(r, c)". */
const DICE = {
  top: "2nd dice",
  left: "1st dice",
  rows: [
    ["", "1", "2", "3", "4", "5", "6"],
    ...["1", "2", "3", "4", "5", "6"].map((r) => [r, ...["1", "2", "3", "4", "5", "6"].map((c) => `(${r}, ${c})`)]),
  ],
};

const LIST = [
  {
    id: "q1",
    links: [
      { key: "p", color: "blue", note: "probability of the event", q: ["probability of Leon sleeping on a plane to Korea at midnight"] },
      { key: "n", color: "pink", note: "number of trials", q: ["for 56 times"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Expected number of times that Leon sleeps on a plane to Korea at midnight} = ${L("n", "56")} \\times ${L("p", f(3, 8))}`),
        m(`= ${U(21)}`),
      ],
    }],
  },
  {
    id: "q2",
    links: [
      { key: "p", color: "blue", note: "probability of the event", q: ["jammed from feeding in a paper is 0.0072"] },
      { key: "n", color: "pink", note: "number of trials", q: ["5000 pieces of paper"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Expected number of times that the printer is jammed} = ${L("n", "5000")} \\times ${L("p", "0.0072")}`),
        m(`= ${U(36)}`),
      ],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "o", color: "blue", note: "selected once → no repeated digit", q: ["Each number can only"] },
      { key: "e", color: "pink", note: "28, 52, 58 and 82", q: ["an even number is formed."] },
      { key: "n", color: "green", note: "number of trials", q: ["repeated for 90 times"] },
    ],
    boxes: [
      {
        steps: [lk("o", tree({
          label: "(a)",
          cols: ["Tens digit", "Units digit", "Possible Outcomes"],
          kids: [["2", ["5", "8"]], ["5", ["2", "8"]], ["8", ["2", "5"]]],
        }))],
      },
      {
        steps: [
          t("From the tree diagram, there are 6 equally likely outcomes."),
          t("There are 4 favourable outcomes, i.e. 28, 52, 58 and 82."),
          so(`P(${L("e", "\\text{an even number}")}) = ${f(4, 6)}`),
          m(`= ${U(f(2, 3))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace \\text{Expected number of times that an even number is formed}`),
          m(`= ${L("n", "90")} \\times ${f(2, 3)}`),
          m(`= ${U(60)}`),
        ],
      },
    ],
  },
  {
    id: "q4",
    links: [
      { key: "e", color: "blue", note: "4 equally likely outcomes", q: ["drawn at random from 4 balls"] },
      { key: "n", color: "pink", note: "each value × its probability", q: ["numbers 4, 11, 15 and 19"] },
    ],
    boxes: [{
      steps: [
        t("$\\because$ [[e|The 4 possible outcomes are equally likely]], their probabilities are all $\\frac{1}{4}$."),
        t("$\\therefore$ Expected value of the number shown"),
        m(`= ${L("n", `4 \\times ${f(1, 4)} + 11 \\times ${f(1, 4)} + 15 \\times ${f(1, 4)} + 19 \\times ${f(1, 4)}`)}`),
        m(`= ${U(f(49, 4))}`),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "e", color: "blue", note: "8 equally likely faces", q: ["fair dice in the shape of a regular octahedron"] },
      { key: "k", color: "pink", note: "each mark × its probability", q: ["The marks she can get for different numbers"] },
    ],
    boxes: [{
      steps: [
        t("$\\because$ [[e|The 8 possible outcomes are equally likely]], their probabilities are all $\\frac{1}{8}$."),
        t("$\\therefore$ Expected value of the marks for Alice in playing this game"),
        m(`= ${L("k", `(-15) \\times ${f(1, 8)} + (-13) \\times ${f(1, 8)} + (-10) \\times ${f(1, 8)} + (-5) \\times ${f(1, 8)}`)}`),
        m(`\\phantom{=}\\ ${L("k", `{} + 0 \\times ${f(1, 8)} + 5 \\times ${f(1, 8)} + 10 \\times ${f(1, 8)} + 15 \\times ${f(1, 8)}`)}`),
        m(`= ${U(`-${f(13, 8)}`)}`),
      ],
    }],
  },
  {
    id: "q6",
    links: [{ key: "p", color: "blue", note: "each expenditure × its probability", q: ["with their corresponding probabilities"] }],
    boxes: [{
      steps: [
        t("Expected expenditure for Janice next month"),
        m(`= \\$(${L("p", "2000 \\times 0.2 + 5000 \\times 0.45 + 10\\,000 \\times 0.3 + 20\\,000 \\times 0.05")})`),
        m(`= ${U("\\$6650")}`),
      ],
    }],
  },
  {
    id: "q7",
    boxes: [{
      bare: true,
      steps: [table({
        at: { xs: [173.3, 223.1, 272.6, 322.0], ys: [247.7, 266.2] },
        rows: [[`$${f(4, 9)}$`, `$${f(2, 9)}$`, `$${f(1, 3)}$`]],
      })],
    }],
  },
  {
    id: "q7b",
    links: [{ key: "v", color: "pink", note: "each coin value × its probability", q: ["Find the expected value of the coin drawn"] }],
    boxes: [
      {
        steps: [
          t("**(a)** Total number of coins $= 4 + 2 + 3 = 9$"),
          m(`P(\\$2) = ${f(4, 9)}`),
          m(`P(\\$5) = ${f(2, 9)}`),
          m(`P(\\$10) = ${f(3, 9)} = ${f(1, 3)}`),
        ],
      },
      {
        steps: [
          t("**(b)** Expected value of the coin drawn"),
          m(`= \\$\\left(${L("v", `2 \\times ${f(4, 9)} + 5 \\times ${f(2, 9)} + 10 \\times ${f(1, 3)}`)}\\right)`),
          m(`= \\$${U(f(16, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q8",
    links: [
      { key: "n", color: "blue", note: "500 tickets in total", q: ["500 lucky draw tickets"] },
      { key: "w", color: "pink", note: "1 + 2 + 5 + 10 winning tickets", q: ["one first prize of $8000", "second prizes of $5000", "five third prizes of $1000", "ten consolation prizes"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace P(\\text{win the first prize}) = ${U(f(1, L("n", "500")))}`),
          m(`\\textbf{(b)}\\enspace \\text{Number of winning tickets} = ${L("w", "1 + 2 + 5 + 10")} = 18`),
          m(`P(\\text{win a prize}) = ${f(18, 500)}`),
          m(`= ${U(f(9, 250))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(c)}\\enspace P(\\text{win the second prize}) = ${f(2, 500)} = ${f(1, 250)}`),
          m(`P(\\text{win the third prize}) = ${f(5, 500)} = ${f(1, 100)}`),
          m(`P(\\text{win the consolation prize}) = ${f(10, 500)} = ${f(1, 50)}`),
        ],
      },
      {
        steps: [
          t("Expected value of the prize that Irene will win"),
          m(`= \\$\\left(8000 \\times ${f(1, 500)} + 5000 \\times ${f(1, 250)} + 1000 \\times ${f(1, 100)} + 500 \\times ${f(1, 50)}\\right)`),
          m(`= ${U("\\$56")}`),
        ],
      },
    ],
  },
  {
    id: "q9",
    links: [
      { key: "p", color: "blue", note: "each prize × its probability", q: ["0.05, 0.12 and 0.15 respectively"] },
      { key: "c", color: "pink", note: "compare with \\$60", q: ["greater than $60"] },
    ],
    boxes: [{
      steps: [
        t("Expected amount that Sofia gets"),
        m(`= \\$(${L("p", "500 \\times 0.05 + 200 \\times 0.12 + 100 \\times 0.15")})`),
        m(`= \\$64`),
        m(`> ${L("c", "\\$60")}`),
        t("$\\therefore$ Sofia’s claim is agreed."),
      ],
    }],
  },
  {
    id: "q10",
    links: [
      { key: "i", color: "blue", note: "increased by 20% → × (1 + 20%)", q: ["increased by 20%"] },
      { key: "p", color: "pink", note: "probability of being selected", q: ["Population Census is 0.11"] },
    ],
    boxes: [{
      steps: [
        m(`\\text{Total number of households this year} = 30\\,500 \\times ${L("i", "(1 + 20\\%)")}`),
        m(`= 36\\,600`),
        m(`\\text{Expected number of households selected this year} = 36\\,600 \\times ${L("p", "0.11")}`),
        m(`= ${U(4026)}`),
      ],
    }],
  },
  {
    id: "q11",
    links: [{ key: "e", color: "pink", note: "expected value = 123", q: ["playing this game is $123"] }],
    boxes: [{
      steps: [
        m(`10 \\times 0.15 + 50 \\times 0.35 + 100 \\times 0.23 + x \\times 0.27 = ${L("e", "123")}`),
        m(`0.27x + 42 = 123`),
        m(`0.27x = 81`),
        m(`x = ${U(300)}`),
      ],
    }],
  },
  {
    id: "q12",
    links: [
      { key: "o", color: "blue", note: "1 correct out of 5 options", q: ["5 options, of which only one is correct"] },
      { key: "k", color: "pink", note: "+4 if correct, −2 if wrong", q: ["4 marks will be awarded", "2 marks will be deducted"] },
      { key: "b", color: "green", note: "blank → −1", q: ["1 mark will be deducted for leaving the question blank"] },
    ],
    boxes: [
      {
        steps: [
          t("If Jenny chooses the answer randomly,"),
          m(`P(\\text{answer correctly}) = ${L("o", f(1, 5))}`),
          m(`P(\\text{answer wrongly}) = ${f(4, 5)}`),
        ],
      },
      {
        w: 290,
        steps: [
          t("Expected value of the marks Jenny obtains if she chooses the answer randomly"),
          m(`= ${L("k", "4")} \\times ${f(1, 5)} + (${L("k", "-2")}) \\times ${f(4, 5)}`),
          m(`= -0.8`),
          m(`> ${L("b", "-1")}`),
          t("$\\therefore$ Jenny should choose the answer randomly."),
        ],
      },
    ],
  },
  {
    id: "q13",
    links: [
      { key: "c", color: "blue", note: "1 correct out of 4 choices", q: ["4 choices, of which"] },
      { key: "q", color: "green", note: "10 questions", q: ["there are 10 multiple choice questions"] },
      { key: "k", color: "pink", note: "+4 if correct, −1 if wrong", q: ["4 marks will be obtained for each correct answer", "1 mark will be deducted for"] },
    ],
    boxes: [{
      steps: [
        m(`\\textbf{(a)}\\enspace \\text{Probability that Ida answers a question correctly} = ${L("c", f(1, 4))}`),
        t("$\\because$ There are [[q|10 questions]]."),
        m(`\\therefore\\ \\text{It is expected that Ida will answer } 10 \\times ${f(1, 4)} = 2.5 \\text{ questions correctly.}`),
        m(`\\textbf{(b)}\\enspace \\text{Ida's expected value of the marks} = 2.5 \\times ${L("k", "4")} + (10 - 2.5) \\times (${L("k", "-1")})`),
        m(`= ${U("2.5")}`),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "r", color: "blue", note: "each reward × its probability", q: ["are $50, $30, $10, $30 and $50"] },
      { key: "c", color: "pink", note: "compare with the cost \\$30", q: ["pay $30 for playing the game once"] },
    ],
    boxes: [{
      steps: [
        m(`\\textbf{(a)}\\enspace \\text{Expected value of rewards}`),
        m(`= \\$(${L("r", "50 \\times 0.1 + 30 \\times 0.2 + 10 \\times 0.4 + 30 \\times 0.2 + 50 \\times 0.1")})`),
        m(`= ${U("\\$26")}`),
        t("**(b)** $\\because$ The expected value of rewards John gets in one game (\\$26) is less than the cost of the game ([[c|\\$30]])."),
        t("$\\therefore$ The game is not favourable to him."),
      ],
    }],
  },
  {
    id: "q15",
    links: [
      { key: "n", color: "blue", note: "10 red and 20 blue out of 200", q: ["200 tickets, of which 10 are red and 20 are blue"] },
      { key: "c", color: "pink", note: "compare with the cost \\$200", q: ["pay $200 to draw a ticket"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace P(\\text{red ticket}) = ${L("n", f(10, 200))}`),
          m(`= ${f(1, 20)}`),
          m(`P(\\text{blue ticket}) = ${L("n", f(20, 200))}`),
          m(`= ${f(1, 10)}`),
          m(`P(\\text{other tickets}) = ${f("200 - 10 - 20", 200)}`),
          m(`= ${f(17, 20)}`),
          so(`\\text{Expected value of the reward} = \\$\\left(3000 \\times ${f(1, 20)} + 1000 \\times ${f(1, 10)} + 0 \\times ${f(17, 20)}\\right)`),
          m(`= ${U("\\$250")}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ The expected value of the reward (\\$250) is greater than the cost of the game ([[c|\\$200]])."),
          t("$\\therefore$ The game is favourable to the participants."),
        ],
      },
    ],
  },
  {
    id: "q16",
    links: [
      { key: "r", color: "blue", note: "2 + 5 + 8 = 15 parts", q: ["in the ratio 2 : 5 : 8"] },
      { key: "n", color: "pink", note: "10 spins", q: ["spins the lucky wheel 10 times"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\because\\ P(\\text{\`20 points' region}) = ${f(2, "2 + 5 + 8")} = ${f(2, 15)}`),
          t("$\\therefore$ It is expected that the lucky wheel will stop in the ‘20 points’ region"),
          m(`\\text{for } ${L("n", "10")} \\times ${f(2, 15)} = ${f(4, 3)} \\text{ times.}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace P(\\text{\`10 points' region}) = ${f(5, L("r", "2 + 5 + 8"))}`),
          m(`= ${f(5, 15)}`),
          m(`= ${U(f(1, 3))}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(c)}\\enspace P(\\text{\`5 points' region}) = ${f(8, L("r", "2 + 5 + 8"))} = ${f(8, 15)}`),
          so(`\\text{Expected value of points obtained} = 20 \\times ${f(2, 15)} + 10 \\times ${f(1, 3)} + 5 \\times ${f(8, 15)}`),
          m(`= ${U(f(26, 3))}`),
        ],
      },
    ],
  },
  {
    id: "q17",
    links: [
      { key: "b", color: "blue", note: "bus trips: 2, 1, 1, 0", q: ["Find the expected number of times Tom travels by bus"] },
      { key: "f", color: "pink", note: "\\$6 to school, \\$4 home", q: ["bus fare for going to school is $6", "bus fare for returning home is"] },
    ],
    boxes: [{
      steps: [
        m(`\\textbf{(a)}\\enspace \\text{Expected number of times Tom travels by bus on a school day}`),
        m(`= ${L("b", "2 \\times 0.2 + 1 \\times 0.25 + 1 \\times 0.1 + 0 \\times 0.45")}`),
        m(`= ${U("0.75")}`),
        m(`\\textbf{(b)}\\enspace \\text{Expected amount spent by Tom on the transport on a school day}`),
        m(`= \\$[(${L("f", "6")} + ${L("f", "4")}) \\times 0.2 + 6 \\times 0.25 + 4 \\times 0.1 + 0 \\times 0.45]`),
        m(`= ${U("\\$3.9")}`),
      ],
    }],
  },
  {
    id: "q18",
    links: [
      { key: "p", color: "blue", note: "P(3 instruments) = 3/20", q: ["the probability that the student learns 3 instruments is"] },
      { key: "c", color: "pink", note: "compare with 2", q: ["more than 2"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\textbf{(a)}\\enspace \\text{Total number of students in the group} = k + 28 + 20 + k + 8`),
          m(`= 2k + 56`),
          t("$\\because$ The probability of selecting a student who learns 3 instruments is $\\frac{3}{20}$."),
          so(`${f("k", "2k + 56")} = ${L("p", f(3, 20))}`),
          m(`20k = 6k + 168`),
          m(`14k = 168`),
          m(`k = ${U(12)}`),
        ],
      },
      {
        steps: [
          m(`\\textbf{(b)}\\enspace \\text{Total number of students in the group} = 2 \\times 12 + 56`),
          m(`= 80`),
          so(`P(0\\text{ instruments}) = ${f(12, 80)} = ${f(3, 20)}`),
          m(`P(1\\text{ instrument}) = ${f(28, 80)} = ${f(7, 20)}`),
          m(`P(2\\text{ instruments}) = ${f(20, 80)} = ${f(1, 4)}`),
          m(`P(4\\text{ instruments}) = ${f(8, 80)} = ${f(1, 10)}`),
          t("$\\therefore$ Expected number of instruments learnt by a student"),
          m(`= 0 \\times ${f(3, 20)} + 1 \\times ${f(7, 20)} + 2 \\times ${f(1, 4)} + 3 \\times ${f(3, 20)} + 4 \\times ${f(1, 10)}`),
          m(`= 1.7`),
          m(`< ${L("c", "2")}`),
          t("$\\therefore$ Mr Wong’s claim is disagreed."),
        ],
      },
    ],
  },
  {
    id: "q19",
    links: [
      { key: "c", color: "blue", note: "4 choices: 1 correct, 3 incorrect", q: ["4 choices for each question"] },
      { key: "k", color: "pink", note: "20, 5 or 0 marks", q: ["20 marks will be awarded for both answers correct"] },
    ],
    boxes: [{
      steps: [
        t("Let ✓ stand for a correct answer and ✗ stand for an incorrect answer."),
        lk("c", table({
          top: "Second question",
          left: "First\nquestion",
          rows: [
            ["", "✓", "✗", "✗", "✗"],
            ...["✓", "✗", "✗", "✗"].map((r) => [r, ...["✓", "✗", "✗", "✗"].map((c) => `${r}, ${c}`)]),
          ],
        })),
        t("Total number of possible outcomes $= 16$"),
        t("Number of outcomes with both answers correct $= 1$"),
        t("Number of outcomes with exactly one correct answer $= 6$"),
        t("Number of outcomes with both answers incorrect $= 9$"),
        lk("k", table({
          head: 0,
          rows: [
            ["Marks", "20", "5", "0"],
            ["Probability", `$${f(1, 16)}$`, `$${f(6, 16)} = ${f(3, 8)}$`, `$${f(9, 16)}$`],
          ],
        })),
        so(`\\text{Expected value of the marks that Julian gets} = 20 \\times ${f(1, 16)} + 5 \\times ${f(3, 8)} + 0 \\times ${f(9, 16)}`),
        m(`= ${U(f(25, 8))}`),
      ],
    }],
  },
  {
    id: "q20",
    links: [
      { key: "p", color: "blue", note: "both numbers in 2, 3, 5", q: ["2 numbers obtained are both prime numbers"] },
      { key: "c", color: "pink", note: "compare with the cost \\$10", q: ["pay $10 for playing the game once"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          table(DICE),
          t("From the table, there are 36 possible outcomes."),
          t("There are 9 favourable outcomes, i.e. (2, 2), (2, 3), (2, 5), (3, 2), (3, 3), (3, 5), (5, 2), (5, 3) and (5, 5)."),
          so(`P(${L("p", "\\text{both prime}")}) = ${f(9, 36)} = ${f(1, 4)}`),
          so(`\\text{Expected value of rewards} = \\$80 \\times ${f(1, 4)} = ${U("\\$20")}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ The expected value of rewards Nelson gets in one game (\\$20) is more than the cost of the game ([[c|\\$10]])."),
          t("$\\therefore$ The game is favourable to him."),
        ],
      },
    ],
  },
  {
    id: "q21",
    links: [{ key: "c", color: "pink", note: "compare with the costs \\$25 and \\$35", q: ["pay $25 and $35 for playing games A and B"] }],
    boxes: [
      {
        steps: [
          h("(a) (i)"),
          table(DICE),
          t("From the table, there are 36 possible outcomes."),
          t("There are 9 outcomes in which both numbers are prime numbers."),
          so(`P(\\text{both prime}) = ${f(9, 36)} = ${f(1, 4)}`),
          so(`\\text{Expected value of the award} = \\$90 \\times ${f(1, 4)}`),
          m(`= ${U("\\$22.5")}`),
        ],
      },
      {
        steps: [
          t("**(ii)** Let H stand for a head and T stand for a tail."),
          table({ top: "2nd coin", left: "1st coin", rows: [["", "H", "T"], ["H", "HH", "HT"], ["T", "TH", "TT"]] }),
          t("From the table, there are 4 possible outcomes."),
          t("There are 2 outcomes for 1 head and 1 outcome for 2 heads."),
          so(`P(\\text{1 head}) = ${f(1, 2)} \\text{ and } P(\\text{2 heads}) = ${f(1, 4)}`),
          so(`\\text{Expected value of the award} = \\$\\left(30 \\times ${f(1, 2)} + 60 \\times ${f(1, 4)}\\right)`),
          m(`= ${U("\\$30")}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ The expected value of the award a player gets in game $A$ (\\$22.5) is less than the cost of the game ([[c|\\$25]])."),
          t("$\\therefore$ Game $A$ is not favourable to the player."),
          t("$\\because$ The expected value of the award a player gets in game $B$ (\\$30) is less than the cost of the game ([[c|\\$35]])."),
          t("$\\therefore$ Game $B$ is not favourable to the player."),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "a", color: "blue", note: "same tube → 10, otherwise 5", q: ["the same tube, the player gets 10 tokens"] },
      { key: "b", color: "pink", note: "same tube → 13, otherwise 5", q: ["into the same tube, the player gets 13 tokens"] },
    ],
    boxes: [
      {
        w: 240,
        steps: [
          t("**(a) (i)** Let A and B stand for the two tubes respectively."),
          tree({ cols: ["1st ball", "2nd ball", "Possible Outcomes"], kids: grow(["A", "B"], ["A", "B"]) }),
          t("From the tree diagram, there are 4 equally likely outcomes."),
          so(`P(\\text{same tube}) = ${f(2, 4)} = ${f(1, 2)}`),
          m(`P(\\text{different tubes}) = ${f(2, 4)} = ${f(1, 2)}`),
        ],
      },
      {
        steps: [
          so(`\\text{Expected number of tokens that a player gets}`),
          m(`= ${L("a", "10")} \\times ${f(1, 2)} + ${L("a", "5")} \\times ${f(1, 2)}`),
          m(`= ${U("7.5")}`),
        ],
      },
      {
        w: 240,
        steps: [
          t("**(ii)** Let A and B stand for the two tubes respectively."),
          tree({ cols: ["1st ball", "2nd ball", "3rd ball", "Possible Outcomes"], kids: grow(["A", "B"], ["A", "B"], ["A", "B"]) }),
          t("From the tree diagram, there are 8 equally likely outcomes."),
          so(`P(\\text{same tube}) = ${f(2, 8)} = ${f(1, 4)}`),
          m(`P(\\text{different tubes}) = ${f(6, 8)} = ${f(3, 4)}`),
        ],
      },
      {
        steps: [
          so(`\\text{Expected number of tokens that a player gets}`),
          m(`= ${L("b", "13")} \\times ${f(1, 4)} + ${L("b", "5")} \\times ${f(3, 4)}`),
          m(`= ${U(7)}`),
        ],
      },
      {
        steps: [
          t("**(b)** $\\because$ Expected number of tokens that a player gets from option I (7.5) is more than that of option II (7)."),
          t("$\\therefore$ The player should adopt option I."),
        ],
      },
    ],
  },
  {
    id: "q23",
    links: [
      { key: "a", color: "blue", note: "adjacent: AB, BA, BC, CB, CD, DC", q: ["two balls into two adjacent slots"] },
      { key: "s", color: "green", note: "same slot: AA, BB, CC, DD", q: ["two balls into the same slot"] },
      { key: "c", color: "pink", note: "compare with the fee \\$20", q: ["entry fee of $20"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          table({
            top: "2nd ball",
            left: "1st ball",
            rows: [
              ["", "A", "B", "C", "D"],
              ...["A", "B", "C", "D"].map((r) => [r, ...["A", "B", "C", "D"].map((c) => `${r}${c}`)]),
            ],
          }),
        ],
      },
      {
        steps: [
          t("**(b)** From the table in (a), there are 16 possible outcomes."),
          t("There are 6 outcomes in which the two balls are in [[a|adjacent slots]]."),
          so(`P(\\$20\\text{ cash coupon}) = ${f(6, 16)}`),
          m(`= ${U(f(3, 8))}`),
        ],
      },
      {
        steps: [
          t("**(c)** There are 4 outcomes in which the two balls are in [[s|the same slot]]."),
          so(`P(\\$30\\text{ cash coupon}) = ${f(4, 16)}`),
          m(`= ${f(1, 4)}`),
          t("There are 6 outcomes in which no cash coupons will be awarded."),
          so(`P(\\text{no cash coupon}) = ${f(6, 16)}`),
          m(`= ${f(3, 8)}`),
          so(`\\text{Expected value of the award Kristy gets} = \\$\\left(30 \\times ${f(1, 4)} + 20 \\times ${f(3, 8)} + 0 \\times ${f(3, 8)}\\right)`),
          m(`= ${U("\\$15")}`),
        ],
      },
      {
        steps: [
          t("**(d)** $\\because$ The expected value of the award Kristy gets in one game (\\$15) is less than the cost of the game ([[c|\\$20]])."),
          t("$\\therefore$ The game is not favourable to her."),
        ],
      },
    ],
  },
  {
    id: "q24",
    links: [
      { key: "w", color: "blue", note: "A is the champion every time", q: ["A always wins"] },
      { key: "b", color: "green", note: "B wins whenever B does not meet A", q: ["B always beats C and D"] },
      { key: "d", color: "pink", note: "D is third runner-up every time", q: ["D always loses"] },
    ],
    boxes: [{
      steps: [
        t("There are 3 possible outcomes (equally likely outcomes) in the arrangement of the players in Rounds 1 and 2."),
        m(`\\text{For case 1,}\\quad \\text{Round 1: } A \\text{ beats } B,\\ C \\text{ beats } D`),
        m(`\\phantom{\\text{For case 1,}\\quad} \\text{Round 2: } A \\text{ beats } C,\\ B \\text{ beats } D`),
        m(`\\text{For case 2,}\\quad \\text{Round 1: } A \\text{ beats } C,\\ B \\text{ beats } D`),
        m(`\\phantom{\\text{For case 2,}\\quad} \\text{Round 2: } A \\text{ beats } B,\\ C \\text{ beats } D`),
        m(`\\text{For case 3,}\\quad \\text{Round 1: } A \\text{ beats } D,\\ B \\text{ beats } C`),
        m(`\\phantom{\\text{For case 3,}\\quad} \\text{Round 2: } A \\text{ beats } B,\\ C \\text{ beats } D`),
        t("The following table summarizes the above results."),
        lk("b", table({
          rows: [
            ["", "Case 1", "Case 2", "Case 3"],
            ["Champion (\\$500)", "$A$", "$A$", "$A$"],
            ["First runner-up (\\$300)", "$C$", "$B$", "$B$"],
            ["Second runner-up (\\$150)", "$B$", "$C$", "$C$"],
            ["Third runner-up (\\$0)", "$D$", "$D$", "$D$"],
            ["Probability", `$${f(1, 3)}$`, `$${f(1, 3)}$`, `$${f(1, 3)}$`],
          ],
        })),
        t(`Since [[w|$A$ will be the champion in all cases]], expected value of the prize for $A = ${U("\\$500")}$`),
        m(`\\text{Expected value of the prize for } B = \\$\\left(150 \\times ${f(1, 3)} + 300 \\times ${f(1, 3)} + 300 \\times ${f(1, 3)}\\right)`),
        m(`= ${U("\\$250")}`),
        m(`\\text{Expected value of the prize for } C = \\$\\left(300 \\times ${f(1, 3)} + 150 \\times ${f(1, 3)} + 150 \\times ${f(1, 3)}\\right)`),
        m(`= ${U("\\$200")}`),
        t("Since [[d|$D$ will lose all the games in all cases]], expected value of the prize for $D = \\$0$"),
      ],
    }],
  },
];

/** The key's boxes are dense, so every answer may shrink to 70 %. */
export const SOLUTIONS = LIST.map((s) => ({ minScale: 0.7, ...s, boxes: s.boxes.map((b) => ({ ...b, steps: align(b.steps) })) }));
