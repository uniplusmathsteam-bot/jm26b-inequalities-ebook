/**
 * Worked solutions laid out like the JM26 (B) answer key: each question is a
 * set of answer boxes, and every non-heading line is one revealable step.
 *
 * Line kinds: { m } display maths, { t } text with $inline$ maths (\$ is a
 * dollar sign), { h } part label, { note } teacher margin note, { nl } number
 * line. Any line may carry r, a short side reason. `printed` marks worked
 * examples already shown on the page: they get no overlay, only a graphic.
 *
 * `links` pair question wording (q phrases, matched against the page text)
 * with answer components: a whole line via lk(key, step), or part of the
 * maths via L(key, tex). Start a part with {} when it begins with a relation
 * or operator so KaTeX keeps the binary spacing.
 */

const m = (m, r) => ({ m, r });
const t = (t, r) => ({ t, r });
const h = (h) => ({ h });
const note = (note) => ({ note });
const nl = (spec) => ({ nl: spec, optional: true });
const L = (key, tex) => `\\htmlClass{lk-${key}}{${tex}}`;
const lk = (key, step) => ({ ...step, lk: key });

export const SOLUTIONS = [
  {
    id: "ex1",
    printed: true,
    ctlAt: [492, 200],
    boxes: [{
      steps: [
        m("x + 2x > 300", "set up from the question"),
        m("3x > 300"),
        m("x > 100", "÷ 3"),
        t("$\\therefore$ The least possible value of $x$ that satisfies the inequality is 101."),
        note("Number of pages must be an integer, so the least value is the first integer greater than 100, i.e. 101."),
        nl({ min: 96, max: 106, op: "gt", at: 100, mark: 101 }),
      ],
    }],
  },
  {
    id: "p1a",
    links: [
      { key: "tw", color: "blue", note: "twice of $x$ → $2x$", q: ["Twice of x"] },
      { key: "mn", color: "green", note: "minus 10 → $-\\,10$", q: ["minus 10"] },
      { key: "lt", color: "pink", note: "less than → $<$", q: ["is less than 4"] },
      { key: "pos", color: "amber", note: "positive integers only", q: ["x is a positive integer"] },
    ],
    boxes: [{
      steps: [
        m(`${L("tw", "2x")} ${L("mn", "{} - 10")} ${L("lt", "{} < 4")}`),
        m("2x < 14", "+ 10"),
        m("x < 7", "÷ 2"),
        lk("pos", t("$\\therefore$ The possible values of $x$ are 1, 2, 3, 4, 5 and 6.")),
        nl({ min: 0, max: 8, op: "lt", at: 7, dots: [1, 2, 3, 4, 5, 6] }),
      ],
    }],
  },
  {
    id: "p1b",
    links: [
      { key: "bc", color: "pink", note: "$BC = x$", q: ["BC = x cm"], at: 1 },
      { key: "ab", color: "blue", note: "$AB = x + 4$", q: ["AB is longer than BC by 4 cm"], at: 1 },
      { key: "ac", color: "green", note: "$AC = 2x + 1$", q: ["AC is longer than twice the length of BC by 1 cm"], at: 1 },
      { key: "per", color: "amber", note: "perimeter > 61 cm", q: ["perimeter of △ABC is greater than 61 cm"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        { ...t("$\\because$ $AB$ is longer than $BC$ by 4 cm."), lk: "ab" },
        t("$\\therefore$ The length of $AB$ is $\\htmlClass{lk-ab}{(x + 4)}$ cm."),
        { ...t("$\\because$ $AC$ is longer than twice the length of $BC$ by 1 cm."), lk: "ac" },
        t("$\\therefore$ The length of $AC$ is $\\htmlClass{lk-ac}{(2x + 1)}$ cm."),
        h("(b)"),
        { ...t("$\\because$ The perimeter of $\\triangle ABC$ is greater than 61 cm."), lk: "per" },
        m("\\therefore\\quad \\htmlClass{lk-ab}{AB} + \\htmlClass{lk-bc}{BC} + \\htmlClass{lk-ac}{AC} > 61\\text{ cm}"),
        m("\\text{i.e.}\\quad \\htmlClass{lk-ab}{(x + 4)} + \\htmlClass{lk-bc}{x} + \\htmlClass{lk-ac}{(2x + 1)} > 61"),
        m("4x + 5 > 61", "collect like terms"),
        m("4x > 56", "− 5"),
        m("x > 14", "÷ 4"),
      ],
    }],
  },
  {
    id: "q1",
    links: [
      { key: "sub", color: "pink", note: "subtract from 11 → $11 - (\\dots)$", q: ["Subtracting", "from 11"] },
      { key: "tw", color: "green", note: "twice → $2(\\dots)$", q: ["twice"] },
      { key: "sum", color: "blue", note: "sum of $x$ and 2 → $x + 2$", q: ["the sum of x and 2"] },
      { key: "al", color: "amber", note: "at least → $\\ge$", q: ["is at least 23"] },
      { key: "gr", color: "purple", note: "greatest $x$ in $x \\le -8$", q: ["greatest value of x"] },
    ],
    boxes: [{
      steps: [
        m(`${L("sub", "11 -{}")} ${L("tw", `2${L("sum", "(x + 2)")}`)} ${L("al", "{} \\ge 23")}`),
        m("-2(x + 2) \\ge 12", "− 11"),
        m("x + 2 \\le -6", "÷ (−2): reverse the sign"),
        m("x \\le -8", "− 2"),
        lk("gr", t("$\\therefore$ The greatest value of $x$ is $-8$.")),
        nl({ min: -12, max: -4, op: "le", at: -8 }),
      ],
    }],
  },
  {
    id: "q2",
    links: [
      { key: "side", color: "blue", note: "$n$ sides of 3 cm → $3n$", q: ["each side of a n-sided regular polygon is 3 cm"] },
      { key: "al", color: "amber", note: "at least → $\\ge$", q: ["is at least 24 cm"] },
      { key: "lp", color: "pink", note: "least integer with $n \\ge 8$", q: ["least possible value of n"] },
    ],
    boxes: [{
      steps: [
        m(`${L("side", "3n")} ${L("al", "{} \\ge 24")}`, "perimeter = 3 × n"),
        m("n \\ge 8", "÷ 3"),
        lk("lp", t("$\\therefore$ The least possible value of $n$ is 8.")),
      ],
    }],
  },
  {
    id: "q3",
    links: [
      { key: "len", color: "blue", note: "length $= 2x + 3$", q: ["(2x+ 3) cm"] },
      { key: "wid", color: "green", note: "width $= 4x - 1$", q: ["(4x−1) cm"] },
      { key: "sh", color: "pink", note: "shorter than twice → $< 2(\\dots)$", q: ["is shorter than twice its width"] },
      { key: "per", color: "amber", note: "perimeter $= 2(L + W) > 64$", q: ["perimeter of the rectangle is greater than 64 cm"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          m(`${L("len", "2x + 3")} ${L("sh", `{} < 2(${L("wid", "4x - 1")})`)}`, "length < 2 × width"),
          m("2x + 3 < 8x - 2"),
          m("-6x < -5"),
          m("\\therefore\\quad x > \\dfrac{5}{6}", "÷ (−6): reverse"),
        ],
      },
      {
        steps: [
          h("(b)"),
          m(L("per", `2[(${L("len", "2x + 3")}) + (${L("wid", "4x - 1")})] > 64`), "2(length + width)"),
          m("6x + 2 > 32", "÷ 2"),
          m("6x > 30"),
          m("\\therefore\\quad x > 5"),
        ],
      },
    ],
  },
  {
    id: "q4",
    links: [
      { key: "g", color: "green", note: "green $= k$", q: ["k green marbles"] },
      { key: "b", color: "blue", note: "blue $= 3k + 5$", q: ["(3k+ 5) blue marbles"] },
      { key: "y", color: "amber", note: "yellow $= 20$", q: ["20 yellow marbles"] },
      { key: "nm", color: "pink", note: "not more than → $\\le$", q: ["is not more than"] },
    ],
    boxes: [{
      steps: [
        m(`${L("b", "3k + 5")} ${L("nm", "{} \\le {}")} ${L("g", "k")} + ${L("y", "20")}`, "blue ≤ green + yellow"),
        m("2k \\le 15"),
        m("k \\le 7.5"),
        t("$\\because$ $k$ is an integer."),
        t("$\\therefore$ The maximum possible value of $k$ is 7."),
        t("$\\therefore$ Maximum number of green marbles $= \\underline{7}$"),
        m("\\phantom{\\therefore}\\ \\text{Maximum number of blue marbles} = 3(7) + 5 = \\underline{\\underline{26}}"),
      ],
    }],
  },
  {
    id: "q5",
    links: [
      { key: "x", color: "pink", note: "larger number $= x$", q: ["Let x be the larger number"] },
      { key: "s", color: "blue", note: "smaller number $= x - 2$", q: [] },
      { key: "lt", color: "amber", note: "less than → $<$", q: ["is less than 190"] },
      { key: "gr", color: "green", note: "even and $< 96$ → 94", q: ["greatest possible value of the larger number"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("x", "x")}$ be the larger number. Then, [[s|the smaller number is $x - 2$]].`),
        m(`(${L("s", "x - 2")}) + ${L("x", "x")} ${L("lt", "{} < 190")}`),
        m("2x - 2 < 190"),
        m("2x < 192"),
        m("x < 96"),
        t("$\\because$ $x$ is an even number."),
        t("$\\therefore$ The greatest possible value of $x$ is 94."),
        lk("gr", t("$\\therefore$ The greatest possible value of the larger number is 94.")),
      ],
    }],
  },
  {
    id: "q6",
    links: [
      { key: "pr", color: "blue", note: "consecutive odd → $x$ and $x + 2$", q: ["two consecutive odd numbers"] },
      { key: "ge", color: "amber", note: "greater than or equal to → $\\ge$", q: ["is greater than or equal to 202"] },
      { key: "sm", color: "pink", note: "odd and $\\ge 100$ → 101", q: ["smallest possible value of the smaller number"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("pr", "x")}$ be the smaller number. Then, the larger number is $${L("pr", "x + 2")}$.`),
        m(`${L("pr", "x")} + ${L("pr", "(x + 2)")} ${L("ge", "{} \\ge 202")}`),
        m("2x + 2 \\ge 202"),
        m("2x \\ge 200"),
        m("x \\ge 100"),
        t("$\\because$ $x$ is an odd number."),
        t("$\\therefore$ The smallest possible value of $x$ is 101."),
        lk("sm", t("$\\therefore$ The smallest possible value of the smaller number is 101.")),
      ],
    }],
  },
  {
    id: "q7",
    links: [
      { key: "pr", color: "blue", note: "consecutive → $x$ and $x + 1$", q: ["two consecutive numbers"] },
      { key: "tw", color: "green", note: "twice the larger → $2(x + 1)$", q: ["twice the larger number"] },
      { key: "df", color: "pink", note: "difference … and the smaller → $-\\,x$", q: ["the difference between", "and the smaller number"] },
      { key: "ng", color: "amber", note: "not greater than → $\\le$", q: ["not greater than 8"] },
      { key: "lg", color: "purple", note: "largest $x$ in $x \\le 6$", q: ["largest possible value of the smaller number"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("pr", "x")}$ be the smaller number. Then, the larger number is $${L("pr", "x + 1")}$.`),
        m(`${L("tw", "2(x + 1)")} ${L("df", "{} - x")} ${L("ng", "{} \\le 8")}`),
        m("2x + 2 - x \\le 8"),
        m("x + 2 \\le 8"),
        m("x \\le 6"),
        lk("lg", t("$\\therefore$ The largest possible value of the smaller number is 6.")),
      ],
    }],
  },
  {
    id: "q8",
    links: [
      { key: "pr", color: "blue", note: "consecutive multiples of 6 → $x$, $x + 6$", q: ["two consecutive multiples of 6"] },
      { key: "f4", color: "green", note: "4 times the larger → $4(x + 6)$", q: ["4 times the larger number"] },
      { key: "t3", color: "pink", note: "3 times the smaller → $-\\,3x$", q: ["3 times the smaller number"] },
      { key: "ex", color: "amber", note: "exceeds → $>$", q: ["exceeds 60"] },
      { key: "sm", color: "purple", note: "multiple of 6 above 36 → 42", q: ["smallest possible value of the smaller number"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("pr", "x")}$ be the smaller number. Then, the larger number is $${L("pr", "x + 6")}$.`),
        m(`${L("f4", "4(x + 6)")} ${L("t3", "{} - 3x")} ${L("ex", "{} > 60")}`),
        m("4x + 24 - 3x > 60"),
        m("x + 24 > 60"),
        m("x > 36"),
        t("$\\because$ $x$ is a multiple of 6."),
        lk("sm", t("$\\therefore$ The smallest possible value of the smaller number is 42.")),
      ],
    }],
  },
  {
    id: "q9",
    links: [
      { key: "a", color: "green", note: "set lunch A: $(10 - x)$ sets at 32", q: ["set lunch A"], at: 1 },
      { key: "b", color: "blue", note: "set lunch B: $x$ sets at 48", q: ["set lunch B"], at: 1 },
      { key: "lt", color: "amber", note: "less than → $<$", q: ["less than $400"] },
      { key: "mx", color: "pink", note: "$x < 5$ → at most 4", q: ["maximum number of set lunch B"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("b", "x")}$ be the number of set lunch $B$ that Lisa can buy. Then, Lisa can buy $${L("a", "(10 - x)")}$ set lunch $A$.`),
        m(`${L("a", "32(10 - x)")} + ${L("b", "48x")} ${L("lt", "{} < 400")}`, "total cost < $400"),
        m("320 - 32x + 48x < 400"),
        m("16x < 80"),
        m("x < 5"),
        lk("mx", t("$\\therefore$ The maximum number of set lunch $B$ that Lisa can buy is 4.")),
      ],
    }],
  },
  {
    id: "q10",
    links: [
      { key: "dk", color: "green", note: "ducks $= 55 - x$, 2 legs each", q: ["55 ducks and pigs on a farm"], at: 1 },
      { key: "pg", color: "blue", note: "pigs $= x$, 4 legs each", q: ["maximum number of pigs on the farm"], at: 1 },
      { key: "lg", color: "amber", note: "legs not more than → $\\le$", q: ["total number of legs", "is not more than 150"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("pg", "x")}$ be the number of pigs on the farm. Then, the number of ducks on the farm is $${L("dk", "55 - x")}$.`),
        m(`${L("dk", "2(55 - x)")} + ${L("pg", "4x")} ${L("lg", "{} \\le 150")}`, "duck 2 legs, pig 4 legs"),
        m("110 - 2x + 4x \\le 150"),
        m("110 + 2x \\le 150"),
        m("2x \\le 40"),
        m("x \\le 20"),
        lk("pg", t("$\\therefore$ The maximum number of pigs on the farm is 20.")),
      ],
    }],
  },
  {
    id: "q11",
    links: [
      { key: "cost", color: "blue", note: "cost $= 4x$", q: ["bought some oranges at $4 each"] },
      { key: "rot", color: "pink", note: "oranges sold $= x - 8$", q: ["8 oranges were rotten"] },
      { key: "sell", color: "green", note: "income $= 4.5(x - 8)$", q: ["were all sold at $4.5 each"] },
      { key: "nl", color: "amber", note: "no loss → income $-$ cost $\\ge 0$", q: ["did not suffer a loss"] },
    ],
    boxes: [{
      steps: [
        t("Let $x$ be the number of oranges that the shopkeeper bought."),
        m(`${L("sell", `4.5${L("rot", "(x - 8)")}`)} ${L("cost", "{} - 4x")} ${L("nl", "{} \\ge 0")}`, "income − cost ≥ 0 (no loss)"),
        m("4.5x - 36 - 4x \\ge 0"),
        m("0.5x \\ge 36"),
        m("x \\ge 72"),
        t("$\\therefore$ The shopkeeper bought at least 72 oranges."),
      ],
    }],
  },
  {
    id: "q12",
    links: [
      { key: "bc", color: "blue", note: "body cream: $x$ bottles", q: ["body cream"], at: 1 },
      { key: "nr", color: "green", note: "nail remover: $20 - x$ bottles", q: ["nail remover"], at: 1 },
      { key: "wt", color: "pink", note: "weight per bottle", q: ["500 g", "180 g"] },
      { key: "w", color: "amber", note: "cannot be greater than → $\\le 5000$ g", q: ["cannot be greater than 5 kg"] },
      { key: "mn", color: "purple", note: "20 minus the most body cream", q: ["minimum number of bottles of nail remover"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t(`Suppose Sally can send $${L("bc", "x")}$ bottles of body cream to her friend. Then, she can send $${L("nr", "(20 - x)")}$ bottles of nail remover to her friend.`),
        m(`${L("wt", "500")}${L("bc", "x")} + ${L("wt", "180")}${L("nr", "(20 - x)")} ${L("w", "{} \\le 5 \\times 1000")}`, "5 kg = 5000 g"),
        m("500x + 3600 - 180x \\le 5000"),
        m("320x \\le 1400"),
        m("x \\le \\dfrac{1400}{320}"),
        m("x \\le 4\\dfrac{3}{8}"),
        t("$\\therefore$ The maximum number of bottles of body cream that Sally can send to her friend is 4."),
        h("(b)"),
        lk("mn", t("From (a), minimum number of bottles of nail remover that Sally can send to her friend")),
        m("= 20 - 4"),
        m("= \\underline{\\underline{16}}"),
      ],
    }],
  },
  {
    id: "q13",
    links: [
      { key: "run", color: "blue", note: "run: $x$ m/s for $25 \\times 60$ s", q: ["runs at a constant speed for 25 minutes"], at: 1 },
      { key: "cyc", color: "green", note: "cycle: $(x + 1.5)$ m/s for $30 \\times 60$ s", q: ["higher than his running speed by 1.5 m/s for 30 minutes"], at: 1 },
      { key: "nl", color: "amber", note: "not less than → $\\ge 22\\,500$ m", q: ["is not less than 22.5 km"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("run", "x")}$ m/s be Hugo’s running speed. Then, his cycling speed is $${L("cyc", "(x + 1.5)")}$ m/s.`),
        m(`${L("run", "x \\times 25 \\times 60")} + ${L("cyc", "(x + 1.5) \\times 30 \\times 60")} ${L("nl", "{} \\ge 22.5 \\times 1000")}`, "minutes → seconds, km → m"),
        m("1500x + 1800x + 2700 \\ge 22\\,500"),
        m("3300x \\ge 19\\,800"),
        m("x \\ge 6"),
        t("$\\therefore$ Hugo’s minimum running speed is 6 m/s."),
      ],
    }],
  },
  {
    id: "q14",
    links: [
      { key: "ab", color: "blue", note: "A → B: $x$ km/h for 2 h", q: ["from town A to town B at a constant speed for 2 hours"], at: 1 },
      { key: "bc", color: "green", note: "B → C: $(x + 20)$ km/h for 1.25 h", q: ["increases his driving speed by 20 km/h", "for 1 hour 15 minutes"], at: 2 },
      { key: "al", color: "amber", note: "at least → $\\ge$", q: ["is at least 233 km"] },
      { key: "q60", color: "pink", note: "$x \\ge 64$, so not 60", q: ["can his driving speed from town A to town B be 60 km/h"] },
    ],
    boxes: [{
      steps: [
        t(`Let $${L("ab", "x")}$ km/h be Harry’s driving speed from town $A$ to town $B$. Then, his driving speed from town $B$ to town $C$ is $${L("bc", "(x + 20)")}$ km/h.`),
        lk("bc", m("1\\text{ hour }15\\text{ minutes} = \\left(1 + \\dfrac{15}{60}\\right)\\text{ hours} = 1.25\\text{ hours}")),
        m(`${L("ab", "x \\times 2")} + ${L("bc", "(x + 20) \\times 1.25")} ${L("al", "{} \\ge 233")}`, "distance = speed × time"),
        m("2x + 1.25x + 25 \\ge 233"),
        m("3.25x \\ge 208"),
        m("x \\ge 64"),
        t("$\\therefore$ Harry’s minimum driving speed from town $A$ to town $B$ is 64 km/h."),
        lk("q60", t("$\\therefore$ Harry’s driving speed from town $A$ to town $B$ cannot be 60 km/h.")),
      ],
    }],
  },
  {
    id: "q15",
    links: [
      { key: "in", color: "blue", note: "interior angle $= x^\\circ$", q: ["each interior angle"], at: 1 },
      { key: "ex", color: "green", note: "exterior angle $= (180 - x)^\\circ$", q: ["its exterior angle"], at: 1 },
      { key: "gt", color: "amber", note: "at least … by 100° → $\\ge \\dots + 100^\\circ$", q: ["is at least greater than", "by 100"] },
      { key: "kc", color: "pink", note: "least $n$ is 9, not 10", q: ["Keith claims that the value of n is at least 10"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        t(`Let $${L("in", "x^\\circ")}$ be the size of each interior angle of the polygon.`),
        t(`Then, the size of each exterior angle of the polygon is $${L("ex", "(180 - x)^\\circ")}$.`),
        m(`${L("in", "x^\\circ")} ${L("gt", "{} \\ge {}")} ${L("ex", "(180 - x)^\\circ")} ${L("gt", "{} + 100^\\circ")}`, "interior ≥ exterior + 100°"),
        m("2x \\ge 280"),
        m("x \\ge 140"),
        t("$\\therefore$ The smallest size of each interior angle of the polygon is $140^\\circ$."),
        h("(b)"),
        t("$\\because$ The greater the value of $n$, the greater is the size of each interior angle of the polygon."),
        m("\\therefore\\quad (n - 2) \\times 180^\\circ \\ge 140^\\circ n", "angle sum ≥ n × 140°"),
        m("180n - 360 \\ge 140n"),
        m("40n \\ge 360"),
        m("n \\ge 9"),
        t("$\\therefore$ The least value of $n$ is 9."),
        lk("kc", t("$\\therefore$ Keith’s claim is disagreed.")),
      ],
    }],
  },
  {
    id: "q16",
    links: [
      { key: "sold", color: "blue", note: "sold $= 200 \\times 95\\% = 190$", q: ["200 phone cases", "5% of the phone cases are broken"] },
      { key: "cost", color: "green", note: "total cost $= 7030$", q: ["total cost of $7030"] },
      { key: "pf", color: "amber", note: "profit at least 70% → $\\ge 70\\%$", q: ["profit of at least 70%"] },
      { key: "cl", color: "pink", note: "$x \\ge 62.9 > 60$", q: ["price of each phone case should be $60"] },
    ],
    boxes: [{
      steps: [
        t("Let \\$$x$ be the selling price of each phone case."),
        lk("sold", m("\\text{Number of phone cases sold} = 200 \\times (1 - 5\\%) = 190")),
        m(`\\dfrac{${L("sold", "190")}x - ${L("cost", "7030")}}{${L("cost", "7030")}} \\times 100\\% ${L("pf", "{} \\ge 70\\%")}`, "profit % = profit ÷ cost"),
        m("\\dfrac{190x - 7030}{7030} \\ge 0.7"),
        m("190x - 7030 \\ge 4921"),
        m("190x \\ge 11\\,951"),
        m("x \\ge 62.9"),
        lk("cl", t("$\\therefore$ The selling price of each phone case should not be \\$60.")),
        t("$\\therefore$ The manager’s claim is disagreed."),
      ],
    }],
  },
  {
    id: "q17",
    links: [
      { key: "a", color: "blue", note: "doll A: $120 \\times 90\\% = 108$", q: ["10% off", "120"] },
      { key: "b", color: "green", note: "doll B: $300 \\times 80\\% = 240$", q: ["20% off", "300"] },
      { key: "cost", color: "pink", note: "profit $=$ selling $-$ cost", q: ["at costs of $40 and $80"] },
      { key: "n30", color: "purple", note: "30 dolls → $x$ and $30 - x$", q: ["order 30 dolls"] },
      { key: "min", color: "amber", note: "minimum profit → $\\ge 3880$", q: ["minimum profit of $3880"] },
    ],
    boxes: [{
      steps: [
        h("(a)"),
        lk("a", m("\\text{Selling price of doll } A = \\$120 \\times (1 - 10\\%) = \\underline{\\underline{\\$108}}")),
        lk("b", m("\\text{Selling price of doll } B = \\$300 \\times (1 - 20\\%) = \\underline{\\underline{\\$240}}")),
        h("(b)"),
        t(`Suppose the shop owner should order $x$ dolls $A$. Then, the shop owner should order $${L("n30", "(30 - x)")}$ dolls $B$.`),
        m(`\\text{Profit from selling a doll } A = \\$(${L("a", "108")} - ${L("cost", "40")}) = \\$68`),
        m(`\\text{Profit from selling a doll } B = \\$(${L("b", "240")} - ${L("cost", "80")}) = \\$160`),
        m(`68x + 160${L("n30", "(30 - x)")} ${L("min", "{} \\ge 3880")}`),
        m("68x + 4800 - 160x \\ge 3880"),
        m("-92x \\ge -920"),
        m("x \\le 10", "÷ (−92): reverse"),
        t("$\\therefore$ The shop owner should order at most 10 dolls $A$."),
      ],
    }],
  },
  {
    id: "q18",
    links: [
      { key: "org", color: "blue", note: "sugar already in $= 12\\pi$", q: ["contains 12π cm3 of sugar solution"] },
      { key: "vol", color: "green", note: "mixed volume $= \\pi(4^2)(5) = 80\\pi$", q: ["base radius 4 cm and height 25 cm", "one-fifth of the height of the beaker"] },
      { key: "add", color: "pink", note: "adds $x$ sugar and $100\\pi$ water", q: ["extra sugar solution and 100π cm3 of water"] },
      { key: "p25", color: "amber", note: "sugar $\\le 25\\%$ of the total", q: ["not greater than 25%"] },
    ],
    boxes: [{
      steps: [
        t("Original volume of the mixed solution"),
        lk("vol", m("= \\pi \\times 4^2 \\times 25 \\times \\dfrac{1}{5}\\ \\text{cm}^3", "height = 25 × 1/5 = 5 cm")),
        m("= 80\\pi\\ \\text{cm}^3"),
        lk("add", t("Let $x$ cm³ be the extra volume of sugar solution added by Victor.")),
        m(`${L("add", "x")} + ${L("org", "12\\pi")} ${L("p25", "{} \\le {}")} (${L("vol", "80\\pi")} + ${L("add", "x")} + ${L("add", "100\\pi")}) ${L("p25", "{} \\times 25\\%")}`, "sugar ≤ 25% of the total"),
        m("x + 12\\pi \\le 0.25(180\\pi + x)"),
        m("x + 12\\pi \\le 45\\pi + 0.25x"),
        m("0.75x \\le 33\\pi"),
        m("x \\le 44\\pi"),
        t("$\\therefore$ Victor should add at most $44\\pi$ cm³ of sugar solution."),
      ],
    }],
  },
  {
    id: "q19",
    links: [
      { key: "y5", color: "pink", note: "given $y > 5$", q: ["if y> 5"] },
      { key: "a", color: "blue", note: "make $y$ the subject", q: ["x= 2y"] },
      { key: "b", color: "green", note: "make $y$ the subject", q: ["x= 3y+ 4"] },
      { key: "c", color: "amber", note: "÷ negative → reverse", q: ["x= −5y"], at: 1 },
    ],
    boxes: [
      { left: 70, steps: [lk("a", m("x = 2y")), m("y = \\dfrac{x}{2}"), m(`\\therefore\\ \\dfrac{x}{2} ${L("y5", "{} > 5")}`), m("x > 10")] },
      { left: 240, steps: [lk("b", m("x = 3y + 4")), m("y = \\dfrac{x - 4}{3}"), m(`\\therefore\\ \\dfrac{x - 4}{3} ${L("y5", "{} > 5")}`), m("x > 19")] },
      { left: 386, steps: [lk("c", m("x = -5y")), m("y = \\dfrac{-x}{5}"), m(`\\therefore\\ \\dfrac{-x}{5} ${L("y5", "{} > 5")}`), lk("c", m("x < -25", "reverse"))] },
    ],
  },
  {
    id: "q20",
    nowrap: true,
    minScale: 0.7,
    links: [
      { key: "y", color: "pink", note: "given $y < -\\frac{7}{2}$", q: ["if y< −7 2"] },
      { key: "a", color: "blue", note: "(a) make $y$ the subject", q: ["x= −3 7 y − 1 2"] },
      { key: "b", color: "green", note: "(b) make $y$ the subject", q: ["x= 7 2 (y−1)"] },
    ],
    boxes: [
      {
        left: 70,
        steps: [
          lk("a", m("14x = 14\\left(-\\dfrac{3}{7}y - \\dfrac{1}{2}\\right)")),
          m("14x = -6y - 7"),
          m("6y = -7 - 14x"),
          m("y = \\dfrac{1}{6}(-7 - 14x)"),
        ],
      },
      {
        steps: [
          lk("y", m("\\because\\ y < -\\dfrac{7}{2}")),
          m("\\therefore\\ \\dfrac{1}{6}(-7 - 14x) < -\\dfrac{7}{2}"),
          m("-7 - 14x < -21"),
          m("-14x < -14"),
          m("x > 1", "reverse"),
        ],
      },
      {
        left: 340,
        steps: [lk("b", m("\\dfrac{2}{7}x = y - 1")), m("y = \\dfrac{2}{7}x + 1")],
      },
      {
        steps: [
          lk("y", m("\\because\\ y < -\\dfrac{7}{2}")),
          m("\\therefore\\ \\dfrac{2}{7}x + 1 < -\\dfrac{7}{2}"),
          m("\\dfrac{2}{7}x < -\\dfrac{9}{2}"),
          m("x < -\\dfrac{63}{4}"),
        ],
      },
    ],
  },
  {
    id: "q21",
    links: [
      { key: "rel", color: "blue", note: "equation (1)", q: ["y= 7 −x 2"] },
      { key: "cn", color: "green", note: "inequality (2)", q: ["x≥36"] },
      { key: "mx", color: "pink", note: "$y \\le -11$ → max $-11$", q: ["maximum value of y"] },
    ],
    boxes: [
      {
        steps: [
          m(`\\begin{cases} ${L("rel", "y = 7 - \\dfrac{x}{2}")} & \\cdots\\cdots (1) \\\\[4pt] ${L("cn", "x \\ge 36")} & \\cdots\\cdots (2) \\end{cases}`),
          m("\\text{From (1)},\\quad 2y = 14 - x"),
          m("x = 14 - 2y \\quad \\cdots\\cdots (3)"),
        ],
      },
      {
        steps: [
          t("Sub. (3) into (2):"),
          m("14 - 2y \\ge 36"),
          m("-2y \\ge 22"),
          m("y \\le -11", "÷ (−2): reverse"),
          lk("mx", t("Therefore, the maximum value of $y$ is $-11$.")),
        ],
      },
    ],
  },
  {
    id: "q22",
    links: [
      { key: "rel", color: "blue", note: "rearrange the given equation", q: ["24 −3x+ y= 0"] },
      { key: "a", color: "pink", note: "(a) given $x > 0$", q: ["If x> 0"] },
      { key: "b", color: "green", note: "(b) given $y \\le -15$", q: ["If y≤−15"] },
      { key: "c", color: "amber", note: "(c) given $x > 7$", q: ["If x> 7"] },
      { key: "cy", color: "purple", note: "$y > -3$ includes 0", q: ["can y be 0"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          lk("rel", m("24 + y = 3x,\\quad x = \\dfrac{24 + y}{3}")),
          lk("a", m("\\because\\ x > 0")),
          m("\\therefore\\ \\dfrac{24 + y}{3} > 0"),
          m("24 + y > 0"),
          m("y > -24"),
        ],
      },
      {
        steps: [
          h("(b)"),
          lk("rel", m("y = 3x - 24")),
          lk("b", m("\\because\\ y \\le -15")),
          m("\\therefore\\ 3x - 24 \\le -15"),
          m("3x \\le 9"),
          m("x \\le 3"),
        ],
      },
      {
        steps: [
          h("(c)"),
          lk("c", m("\\because\\ x > 7")),
          m("\\therefore\\ \\dfrac{24 + y}{3} > 7"),
          m("24 + y > 21"),
          m("y > -3"),
          lk("cy", t("$\\therefore$ $y$ can be 0.")),
        ],
      },
    ],
  },
  {
    id: "ex2",
    printed: true,
    ctlAt: [494, 196],
    letter: "C",
    boxes: [{
      w: 300,
      steps: [
        h("MC method: consider two cases"),
        t("1. $h$ and $k$ are both positive."),
        t("2. $h$ and $k$ are both negative."),
        t("I: (+) × (+) or (−) × (−) are both $> 0$ ✓"),
        t("II: Consider $h = 3$, $k = 4$ → $h - k = -1 < 0$ ✗"),
        t("III: (+) ÷ (+) or (−) ÷ (−) are both $> 0$"),
        m("\\therefore\\ \\dfrac{h}{k} > 0 \\text{ and } \\dfrac{k}{h} > 0 \\;\\Rightarrow\\; \\dfrac{h}{k} + \\dfrac{k}{h} > 0 \\ ✓"),
      ],
    }],
  },
  {
    id: "ex2lq",
    printed: true,
    flow: "col",
    letter: "C",
    boxes: [
      {
        steps: [
          h("For I:"),
          m("\\because\\ \\dfrac{h}{k} > 0"),
          m("\\dfrac{h}{k} \\times k^2 > 0 \\times k^2", "k² > 0"),
          m("\\therefore\\ hk > 0"),
          t("$\\therefore$ I must be true."),
        ],
      },
      {
        w: 230,
        steps: [
          h("For II:"),
          t("Consider $h = 3$ and $k = 4$. So, we have $\\dfrac{h}{k} > 0$."),
          t("However, $h - k = 3 - 4 = -1 < 0$."),
          t("$\\therefore$ II may not be true."),
        ],
      },
      {
        steps: [
          h("For III:"),
          m("\\because\\ hk > 0"),
          m("\\dfrac{hk}{h^2} > \\dfrac{0}{h^2}", "h² > 0"),
          m("\\therefore\\ \\dfrac{k}{h} > 0", "and h/k > 0"),
          m("\\therefore\\ \\dfrac{h}{k} + \\dfrac{k}{h} > 0"),
          m("\\text{i.e. } h\\left(\\dfrac{1}{k}\\right) + k\\left(\\dfrac{1}{h}\\right) > 0"),
          t("$\\therefore$ III must be true."),
          t("$\\therefore$ The answer is C."),
        ],
      },
    ],
  },
  {
    id: "p2",
    letter: "A",
    links: [
      { key: "mn", color: "pink", note: "given $m \\ge n$", q: ["If m≥n"] },
      { key: "k", color: "blue", note: "$k > 0$: sign unchanged", q: ["k> 0"] },
    ],
    boxes: [
      {
        steps: [
          h("For I:"),
          lk("mn", m("\\because\\ m \\ge n")),
          m("m + k \\ge n + k"),
          m("\\therefore\\ k + m \\ge k + n"),
          t("$\\therefore$ I must be true."),
          h("For II:"),
          lk("mn", m("\\because\\ m \\ge n")),
          lk("k", m("km \\ge kn", "k > 0")),
          m("\\therefore\\ kn \\le km"),
          t("$\\therefore$ II must be true."),
        ],
      },
      {
        w: 220,
        steps: [
          h("For III:"),
          t("Consider $m = -3$ and $n = -4$. So, we have $m > n$."),
          t("However, $m^2 = (-3)^2 = 9$ and $n^2 = (-4)^2 = 16$."),
          m("\\therefore\\ m^2 < n^2"),
          t("$\\therefore$ III may not be true."),
          t("$\\therefore$ The answer is A."),
        ],
      },
    ],
  },
  {
    id: "q23",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "uv", color: "pink", note: "given $u > v$", q: ["If u> v"] },
    ],
    boxes: [
      {
        steps: [
          h("For option A:"),
          lk("uv", m("\\because\\ u > v")),
          m("u - v > v - v"),
          m("\\therefore\\ u - v > 0"),
          t("$\\therefore$ Option A is true."),
          h("For option B:"),
          lk("uv", m("\\because\\ u > v")),
          m("u + v > v + v"),
          m("\\therefore\\ u + v > 2v"),
          t("$\\therefore$ Option B is true."),
        ],
      },
      {
        steps: [
          h("For option C:"),
          lk("uv", m("\\because\\ u > v")),
          m("u + u > v + u"),
          m("2u > u + v"),
          m("\\therefore\\ u + v < 2u"),
          t("$\\therefore$ Option C is true."),
        ],
      },
      {
        steps: [
          h("For option D:"),
          lk("uv", m("\\because\\ u > v")),
          m("-u < -v", "× (−1): reverse"),
          m("-u + 2 < -v + 2"),
          m("2 - u < 2 - v"),
          m("\\therefore\\ 2 - v > 2 - u"),
          t("$\\therefore$ Option D is not true."),
          t("$\\therefore$ The answer is D."),
        ],
      },
    ],
  },
  {
    id: "q24",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "mn", color: "pink", note: "given $m < n$", q: ["If m< n"] },
      { key: "k", color: "blue", note: "$k < 0$, so $-k > 0$", q: ["k< 0"] },
    ],
    boxes: [
      {
        steps: [
          h("For I:"),
          lk("mn", m("\\because\\ m < n")),
          m("\\therefore\\ m - k < n - k"),
          t("$\\therefore$ I must be true."),
          h("For II:"),
          lk("k", m("\\because\\ k < 0")),
          m("\\therefore\\ -k > 0"),
          lk("mn", m("\\because\\ m < n")),
          m("m \\times (-k) < n \\times (-k)", "−k is positive"),
          m("\\therefore\\ -km < -kn"),
          t("$\\therefore$ II must be true."),
        ],
      },
      {
        steps: [
          h("For III:"),
          lk("mn", m("\\because\\ m < n \\text{ and } k^2 > 0")),
          m("\\therefore\\ m \\times \\dfrac{1}{k^2} < n \\times \\dfrac{1}{k^2}"),
          m("\\text{i.e. } \\dfrac{m}{k^2} < \\dfrac{n}{k^2}"),
          t("$\\therefore$ III must be true."),
          t("$\\therefore$ The answer is D."),
        ],
      },
    ],
  },
  {
    id: "q25",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "pq", color: "pink", note: "given $p \\ge q$", q: ["If p≥q"] },
    ],
    boxes: [
      {
        steps: [
          h("For I:"),
          lk("pq", m("p \\ge q")),
          m("p - 2 \\ge q - 2"),
          t("$\\therefore$ I must be correct."),
          h("For II:"),
          lk("pq", m("p \\ge q")),
          m("\\dfrac{p}{-5} \\le \\dfrac{q}{-5}", "÷ (−5): reverse"),
          m("-\\dfrac{p}{5} \\le -\\dfrac{q}{5}"),
          t("$\\therefore$ II must be correct."),
        ],
      },
      {
        w: 180,
        steps: [
          h("For III:"),
          t("Consider $p = 2$ and $q = -2$, then $p \\ge q$."),
          m("\\dfrac{2}{p} = \\dfrac{2}{2} = 1"),
          m("\\dfrac{2}{q} = \\dfrac{2}{-2} = -1"),
          t("$\\therefore$ When $p = 2$ and $q = -2$, $\\dfrac{2}{p} \\ge \\dfrac{2}{q}$."),
          t("$\\therefore$ III may not be correct."),
          t("$\\therefore$ Only I and II are correct."),
          t("$\\therefore$ The answer is A."),
        ],
      },
    ],
  },
  {
    id: "q26",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "xy", color: "pink", note: "given $x > y$", q: ["If x> y"] },
      { key: "a", color: "blue", note: "$a < 0$: reverse", q: ["a< 0"] },
    ],
    boxes: [
      {
        steps: [
          h("For I:"),
          m(`\\because\\ ${L("xy", "x > y")} \\text{ and } ${L("a", "a < 0")}`),
          m("\\therefore\\ \\dfrac{x}{a} < \\dfrac{y}{a}", "÷ a < 0: reverse"),
          t("$\\therefore$ I must not be true."),
          h("For II:"),
          lk("xy", m("x > y")),
          m("x \\times (-2) < y \\times (-2)"),
          m("-2x < -2y"),
          m("-2x + a < -2y + a"),
          m("\\therefore\\ a - 2x < a - 2y"),
          t("$\\therefore$ II must be true."),
        ],
      },
      {
        steps: [
          h("For III:"),
          lk("a", m("\\because\\ a < 0")),
          m("\\therefore\\ a^3 < 0"),
          m("a^3 \\times (-5) > 0 \\times (-5)"),
          m("\\therefore\\ -5a^3 > 0"),
          m("\\because\\ x > y \\text{ and } -5a^3 > 0"),
          m("\\therefore\\ x(-5a^3) > y(-5a^3)"),
          m("-5a^3x > -5a^3y"),
          t("$\\therefore$ III must be true."),
          t("$\\therefore$ The answer is D."),
        ],
      },
    ],
  },
  {
    id: "q27",
    flow: "col",
    minScale: 0.62,
    links: [
      { key: "xyz", color: "pink", note: "given $x \\le y$ and $z > y$", q: ["If x≤y and z> y"] },
      { key: "neg", color: "blue", note: "$z$ negative → $z < 0$", q: ["z is a negative number"] },
    ],
    boxes: [
      {
        steps: [
          h("A:"),
          lk("xyz", m("\\because\\ x \\le y \\text{ and } y < z")),
          m("\\therefore\\ x \\le y < z"),
          h("B:"),
          m("\\because\\ y < z"),
          m("\\therefore\\ y - x < z - x"),
          h("C:"),
          m(`\\because\\ x \\le y < z \\text{ and } ${L("neg", "z < 0")}`),
          m("\\therefore\\ x < 0"),
          m("\\because\\ y < z \\text{ and } x < 0"),
          m("\\therefore\\ xz < xy", "× x < 0: reverse"),
        ],
      },
      {
        steps: [
          h("D:"),
          m("\\because\\ x \\le y < z"),
          m("\\therefore\\ -x > -z"),
          m("-\\dfrac{x}{4} > -\\dfrac{z}{4}"),
          t("$\\therefore$ The given inequality is not true."),
          t("$\\therefore$ D is not true."),
        ],
      },
    ],
  },
  {
    id: "q28",
    minScale: 0.62,
    boxes: [{
      steps: [
        m("\\text{A. If } a - x < a - y, \\text{ then } -x < -y,\\ y < x"),
        m("\\text{B. If } a < 0, \\text{ then } x > y"),
        m("\\text{C. If } a^2x < a^2y, \\text{ then } a^2 > 0,\\ \\therefore\\ x < y"),
        m("\\text{D. } (1)^2 < (-2)^2, \\text{ but } 1 < -2 \\text{ is unreasonable.}"),
      ],
    }],
  },
  {
    id: "q29",
    minScale: 0.62,
    boxes: [{
      steps: [
        t("(I) **Incorrect** If $x < y$, then $-x > -y$, $a - x > a - y$."),
        t("(II) **Incorrect** Since $a$ can be a zero number, $a^2 = 0$, $a^2x = 0 = a^2y$."),
        t("(III) **Incorrect** Take $x = -2$, $y = 1$, but $x^2 = (-2)^2 > (1)^2 = y^2$."),
      ],
    }],
  },
  {
    id: "q30",
    minScale: 0.62,
    boxes: [{
      steps: [
        t("**A, B are obviously correct.** The reason of D is correct is shown in the following."),
        m("\\text{When } 0 \\le x < y,\\ x^3 < y^3 \\text{ is correct;}"),
        m("\\text{When } x \\le 0 < y,\\ x^3 \\le 0,\\ y^3 > 0,\\ \\therefore\\ x^3 < y^3 \\text{ is correct;}"),
        m("\\text{When } x < y \\le 0,\\ -x > -y \\ge 0,\\ (-x)^3 > (-y)^3,\\ -x^3 > -y^3,\\ x^3 < y^3"),
        t("**C is incorrect.**"),
        m("\\text{When } a = 0,\\ a^2x = 0 = a^2y,\\ \\therefore\\ a^2x < a^2y \\text{ is incorrect.}"),
      ],
    }],
  },
  {
    id: "q31",
    links: [
      { key: "nth", color: "blue", note: "$n$th term $= 100 + 3(n - 1)$", q: ["100 + 3(n−1)"] },
      { key: "ex", color: "pink", note: "exceeds → $> 250$", q: ["first term that exceeds 250"] },
      { key: "lt", color: "green", note: "between, exclusively → $< 500$", q: ["between 250 and 500 exclusively"] },
    ],
    boxes: [
      {
        steps: [
          h("(a)"),
          t("According to the given information, we have"),
          m(`${L("nth", "100 + 3(n - 1)")} ${L("ex", "{} > 250")}`),
          m("3(n - 1) > 150"),
          m("n - 1 > 50"),
          m("n > 51"),
          t("$\\therefore$ The 52nd term is the first term that exceeds 250."),
          m("\\text{The 52nd term} = 100 + 3[(52) - 1] = 253"),
          t("$\\therefore$ The first term that exceeds 250 is 253."),
        ],
      },
      {
        steps: [
          h("(b)"),
          t("When the term is less than 500, we have"),
          m(`${L("nth", "100 + 3(n - 1)")} ${L("lt", "{} < 500")}`),
          m("3n - 3 < 400"),
          m("3n < 403"),
          m("n < \\dfrac{403}{3}"),
          m("n < 134\\dfrac{1}{3}"),
          t("$\\therefore$ The 134th term is the last term less than 500."),
          lk("lt", t("Number of terms between 250 and 500 exclusively")),
          m("= 134 - 52 + 1", "count from the 52nd to the 134th term"),
          m("= 83"),
          t("$\\therefore$ There are 83 terms between 250 and 500 exclusively."),
        ],
      },
    ],
  },
  {
    id: "q32",
    links: [
      { key: "pos", color: "pink", note: "positive → $x > 0$ and $y > 0$", q: ["Two positive numbers x and y"] },
      { key: "int", color: "green", note: "$k$ is an integer", q: ["k is an integral constant"] },
    ],
    boxes: [{
      steps: [
        m("\\begin{cases} 3x + 4y = 15 & \\cdots\\cdots (1) \\\\ 2x + 3y = k & \\cdots\\cdots (2) \\end{cases}"),
        m("(2) \\times 3 - (1) \\times 2:\\quad y = 3k - 30 \\quad \\cdots\\cdots (3)"),
        t("Substitute (3) into (2)."),
        m("2x + 3(3k - 30) = k"),
        m("2x + 9k - 90 = k"),
        m("2x = 90 - 8k"),
        m("x = 45 - 4k"),
        lk("pos", t("$\\because$ Both $x$ and $y$ are positive numbers.")),
        t(`$\\therefore$ $k$ satisfies both the inequalities $${L("pos", "45 - 4k > 0")}$ and $${L("pos", "3k - 30 > 0")}$.`),
        m("45 - 4k > 0 \\;\\Rightarrow\\; -4k > -45 \\;\\Rightarrow\\; k < \\dfrac{-45}{-4} = 11.25 \\quad \\cdots (4)"),
        m("3k - 30 > 0 \\;\\Rightarrow\\; 3k > 30 \\;\\Rightarrow\\; k > 10 \\quad \\cdots (5)"),
        lk("int", t("$\\because$ The only integer that satisfies both inequalities (4) and (5) is 11.")),
        m("\\therefore\\ k = \\underline{11}"),
      ],
    }],
  },
  {
    id: "q33",
    links: [
      { key: "ben", color: "blue", note: "Ben $= 2x + 34$", q: ["Ben has $(2x+ 34)"] },
      { key: "cat", color: "green", note: "Cathy $= 5x + 10$", q: ["Cathy has $(5x+ 10)"] },
      { key: "dk", color: "pink", note: "Dick $= y$", q: ["Dick has $y"] },
      { key: "c1", color: "amber", note: "equal pair: Ben & Cathy or Ben & Dick", q: ["Two of them have the same amount of money, but they are not Dick and Cathy"] },
      { key: "c2", color: "purple", note: "any two together > the third", q: ["The sum of the amounts of any two of them is greater than the amount of the remaining one"] },
    ],
    boxes: [
      {
        w: 218,
        steps: [
          lk("c1", t("From (I), there are 2 possible cases.")),
          h("Case 1: Ben and Cathy have the same amount of money."),
          m(`\\therefore\\ ${L("ben", "2x + 34")} = ${L("cat", "5x + 10")}`),
          m("24 = 3x"),
          m("x = 8"),
          t("$\\therefore$ Ben has \\$$(2 \\times 8 + 34)$ = \\$50. Hence, Cathy also has \\$50."),
          lk("c2", t("From (II), $y < 50 + 50 = 100$.")),
          m("\\because\\ \\$(y + 50 + 50) < \\$(100 + 50 + 50) = \\$200"),
          t("$\\therefore$ Total amount the three people have is less than \\$200."),
        ],
      },
      {
        w: 218,
        steps: [
          h("Case 2: Ben and Dick have the same amount of money."),
          m(`\\therefore\\ ${L("dk", "y")} = ${L("ben", "2x + 34")}`),
          t("Total amount the three people have"),
          m(`= \\$[${L("dk", "y")} + (${L("ben", "2x + 34")}) + (${L("cat", "5x + 10")})]`),
          m("= \\$[(2x + 34) + (2x + 34) + (5x + 10)]"),
          m("= \\$(9x + 78)"),
          lk("c2", t("From (II), the amount of Cathy is less than \\$$(2x + 34 + 2x + 34)$ = \\$$(4x + 68)$.")),
          m("\\therefore\\ 5x + 10 < 4x + 68"),
          m("x < 58"),
          m("\\because\\ 9x + 78 < 9 \\times 58 + 78 = 600"),
          t("$\\therefore$ Total amount the three people have is less than \\$600."),
          t("$\\therefore$ Ben, Cathy and Dick do not have enough money to order a dinner package of \\$600 together."),
        ],
      },
    ],
  },
];

export const SOLUTION_BY_ID = Object.fromEntries(SOLUTIONS.map((s) => [s.id, s]));
