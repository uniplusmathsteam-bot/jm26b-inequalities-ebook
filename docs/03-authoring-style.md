# Authoring style

These rules make every book look and read like the teacher's own notes. Each one was approved, or asked for, during the JM26 (B) build. When a new chapter needs something these rules don't cover, decide it with the teacher, then add it here.

## 1. Page and answer boxes

- **Keep the original design.** The QUE page is the background, and nothing covers the printed question.
- **Answers sit inside the blank answer space**, in red-bordered boxes with a margin, laid out like the ANS key: side-by-side boxes where the key has them (parts (a), (b), (c), or MC working beside the options).
- **Controls** (▸ next, » all, ◂ back, ↺ reset, graphic, link) sit in a slim column right of the boxes, with a progress count such as "3/8".
- **Hidden steps** show as grey bars, and the next one is striped. Tapping a box reveals one step; tapping a bar reveals up to it.
- **When space is short:** shrink the text, then drop number lines, and only then continue on an extra sheet. Accept 70 % text on dense MC pages; avoid going below about 62 %.
- **Before trying a new look**, back up the project folder so it can be reverted in one step.

## 2. Worked solutions

- **Follow the teacher's method exactly:** the same unknown, the same order of steps, and the same final sentence as the red-boxed working in the ANS.
- **Hong Kong conventions:**
  - "Let $x$ be …" when the key defines the unknown;
  - $\because$ … and $\therefore$ …;
  - integer reasoning written out: "$\because$ $k$ is an integer.", then "$\therefore$ The maximum possible value of $k$ is 7.";
  - final answers underlined where the key underlines them: `\\underline{26}`.
- **One step per line.** Each algebra step is its own `m()` line, so a tap reveals exactly one move.
- **Side reasons** are short and start with the operation: "+ 10", "÷ 2", "÷ (−6): reverse", "collect like terms", "set up from the question". Always flag a sign reversal.
- **Parts** get `h("(a)")` headings, normally one box per part.
- **Teacher margin notes** (`note()`) are for the key's pink side remarks, such as "Number of pages must be an integer, so …".
- **MC questions:**
  - test each statement I, II, III in turn, by working or with a counterexample (the "LQ method" substitutes values);
  - end with "$\therefore$ The answer is D." only if the teacher wants the letter shown;
  - leave answer squares empty unless asked (JM26 (B) removed the letters for Q23–Q30).
- **Check every final answer** against the ANS before release.

## 3. Number lines (HKDSE style)

The same style is used in the answer boxes (`nl()`) and in the graphics (`ray()`):

1. The axis has arrowheads at both ends, ticks, and real minus signs (−12, not -12).
2. A **short vertical line** rises from the boundary value.
3. A **circle** sits on top: **hollow** for $<$ and $>$ (the value is not included), **filled** for $\le$ and $\ge$.
4. The **arrow** runs from the circle in the direction of the solutions.
5. Integer solutions are red dots on the axis. In graphics, the answer value gets an orange ring, and sample values are labelled pins stacked so they never overlap.

For **ranges of two related variables** (e.g. "given $x > 0$, find the range of $y = 3x - 24$"), use the x–y picture:
- the x number line along the bottom and the y line up the left side, both in the style above;
- the given range in green, the resulting range in blue, and their overlap shaded orange;
- the relation drawn as a line, thick red where it satisfies the condition;
- dashed guides from the boundary point to both axes;
- a legend such as "given: x > 0, so: y > −24", adding "negative coefficient: sign reversed" when the sign flips.

## 4. Review links

Review links connect the wording of a question to the part of the answer it becomes. On the question they show as faint dashed boxes; in the answer they show as coloured dotted underlines (so neighbouring pieces in a formula do not clash). Tapping one opens a solid box on the question and a solid underline (with a light tint) on the answer, with a remark tag and a short leader line. Nested answer links stack their underlines downwards.

- **Link every word problem.** Skip printed worked examples, and questions where no phrase maps to a step (e.g. pure-algebra MC).
- **What to link:**
  - the definition of each unknown ("BC = x cm" → $x$);
  - each quantity built from it ("longer than BC by 4 cm" → $(x + 4)$);
  - the relation words ("at least" → $\ge$, "is shorter than twice" → $< 2(\dots)$, "not more than" → $\le$);
  - conditions ("x is a positive integer");
  - what is asked ("greatest value of x").
- **Link only what matters.** Box the exact phrase that maps to an answer part, not the whole sentence. In JM26 (B) Q5, "two consecutive even numbers" was unlinked, and only "the smaller number is x − 2" was linked.
- **Colours:**
  - amber for the inequality condition ("at least 23", "greater than 61 cm");
  - pink, blue and green for the quantities;
  - purple for a fifth link, usually what is asked.

  Within a question, each colour means one thing on both sides.
- **Tags** are short notes: "$AB = x + 4$", "at least → $\ge$", "least integer with $n \ge 8$".
- On the answer side, mark the smallest piece that matches: `L()` inside maths, or `[[key|words]]` in a sentence. Use `lk()` only when the whole line is the match.

## 5. Interactive graphics

A graphic should make the reasoning visible, not just repeat the algebra.

- **It must match the question.** It opens with a question card (the question in brief, then the same "Let …" lines and inequality as the worked solution) and uses the solution's letters.
- **It must suit the form.** Use pictures, bar models, counters, number lines and shapes. Don't use graphs of functions unless the class has learned them. JM26 (B) Q11 replaced a cost/income graph with a picture of oranges and two money bars.
- **Standard parts:**
  - the picture, which redraws live;
  - a slider for the unknown, with − / + and ▶ play;
  - a readout with the substituted calculation and ✓ satisfies or ✗ fails;
  - a caption explaining the current value ("Exactly 300 pages is not MORE than 300");
  - quick buttons for the key values ("Least value: 101", "Too few: 60", "Just enough: 72").
- **Colours:**
  - green means satisfies, red means fails;
  - amber marks the answer or boundary;
  - blue is the unknown;
  - soft tints are for areas.
- **Good fits by question type:**

  | Question type | Graphic |
  | --- | --- |
  | Polygon perimeter and side counts | Polygon slider, with the sides unrolled onto a ruler |
  | Consecutive numbers | The pair on a number line, with the +2 jump |
  | Money and counts | Counters or items plus money bars |
  | Journeys | Bar models of distance |
  | Mixtures | A beaker filling in layers |
  | Angles | An n-gon with angle arcs |
  | Two related variables | The x–y range picture |
  | MC | Sliders for the variables, a live true/false for each statement, and a "find a counterexample" search |
  | Percentage change | Original bar vs new bar, with the change marked |
  | Successive changes, growth and decay | A bar per period with the factor between bars (JM27 (A) `timeline()`) |
  | Reverse percentage ("… ago", "original") | The same timeline, with a slider for the start until the given bar matches |
  | Threshold ("less than half", "double") | The timeline with an amber threshold line |
- **No overlaps.** Labels, pins and legends must never collide. Check every graphic's QA screenshot at the default value and at the extremes.

## 6. Ink and tools

Ink behaviour belongs to the engine and is the same in every book, so there is nothing to author per chapter. If the teacher asks for an ink feature, add it to `engine/ink/` for all books.
