# Book format

A book is one folder, `books/<id>/`, containing the files below. The engine never contains chapter content: anything specific to one book goes in its folder.

| File | Who writes it | Purpose |
| --- | --- | --- |
| `book.json` | you, starting from `new_book.py` | chapter details, sections, question list, region overrides |
| `layout.json` | `tools/extract_pages.py` | page sizes, answer regions, printed text positions |
| `pages/pNN.jpg` | `tools/extract_pages.py` | page backgrounds (3× zoom) |
| `solutions.js` | you | the worked solutions and review links |
| `widgets.js` | you | the interactive graphics |
| `source/` | `new_book.py` | the QUE and ANS PDFs (not published) |
| `reference/` | tools | teacher crops and QA screenshots (not published) |

Coordinates are always in **PDF points**, measured from the top left of the page. An A4 page is 595.32 × 841.92. Page numbers start at 1, the same as the QUE PDF.

---

## book.json

```json
{
  "id": "jm26b",
  "form": "S3",
  "code": "JM26 (B)",
  "title": "Inequalities I",
  "topic": "Inequalities",
  "year": 2026,
  "status": "live",
  "storage": "jm26b",
  "source": { "que": "source/…(QUE).pdf", "ans": "source/…(ANS).pdf", "ansPageOffset": -1 },
  "sections": [{ "id": "practical", "label": "Practical" }],
  "continuation": { "top": 96, "x": 48, "width": 499, "bottom": 812 },
  "extract": { "zoom": 3, "regionX": [66, 546], "footer": 822, "questions": [], "anchors": {}, "fixedAnchors": {}, "overrides": {} }
}
```

| Field | Meaning |
| --- | --- |
| `id` | Folder name and URL key (`reader.html?book=jm26b`): lower case letters, digits and hyphens. |
| `form`, `code`, `title`, `topic`, `year` | Shown in the library and the reader's top bar; searched by the library filter. The library groups books by `form`. |
| `status` | `draft` or `live`. Any value other than `live` is shown on the library card. |
| `storage` | Prefix of the saved-ink database (`<storage>-ebook`) and UI settings (`<storage>-ui`) on the device. **Never change it for a book in use**, or the teacher's ink disappears. It defaults to `id`. |
| `source.que`, `source.ans` | PDF paths relative to the book folder. |
| `source.ansPageOffset` | ANS page minus QUE page. It is −1 when the ANS has no cover page. |
| `sections` | Top-bar buttons, in order. Each jumps to the first question with that `section`. |
| `continuation` | The writable area of an extra "answers continued" sheet, below the page's header band. Change it only if a chapter's header band has a different height. |
| `widgets` | Set to `false` if the book has no `widgets.js`. |
| `extract.zoom` | Render scale for the page images. Keep 3: sharp on a Retina iPad at about 200 KB per page. |
| `extract.regionX` | Left and right edges of a default answer region. |
| `extract.footer` | y where the page footer starts; the last region on a page stops 4 pt above it. |
| `extract.questions` | `[{ "id", "page", "label", "section" }]` in reading order. `--scan` drafts this. |
| `extract.anchors` | `{ id: regex }` for headings such as "Example 1". Numbered questions are found automatically from "12." at the left margin. |
| `extract.fixedAnchors` | `{ id: [y0, y1] }` when there is no searchable text (e.g. a second method under one example). |
| `extract.overrides` | `{ id: { "region": [x0, y0, x1, y1], "square": [...], "ring": [...] } }`, merged into the generated item. `square` is an MC answer box, filled with `letter` once all steps show. `ring` circles a printed option when the answer is complete. |

---

## layout.json (generated)

Re-run `python tools/extract_pages.py <id>` after any `book.json → extract` change. Never edit layout.json by hand. It contains:

- `pages[n].width`, `height`;
- `questions[]`: `{ id, label, section, anchor: [y0, y1], region: [x0, y0, x1, y1], square?, ring? }`;
- `text[]`: printed rows `[y0, y1, [[x0, x1, "word"], …]]`. The highlighter snaps to these, and review links search them for `q` phrases.

---

## solutions.js

```js
import { m, t, h, note, nl, L, lk } from "../../engine/authoring.js";

export const SOLUTIONS = [
  {
    id: "q1",
    links: [
      { key: "al", color: "amber", note: "at least → $\\ge$", q: ["is at least 23"] },
    ],
    boxes: [{
      steps: [
        m(`11 - 2(x + 2) ${L("al", "{} \\ge 23")}`),
        m("-2(x + 2) \\ge 12", "− 11"),
        m("x \\le -8", "÷ (−2): reverse the sign"),
        t("$\\therefore$ The greatest value of $x$ is $-8$."),
        nl({ min: -12, max: -4, op: "le", at: -8 }),
      ],
    }],
  },
];
```

### Question fields

| Field | Meaning |
| --- | --- |
| `id` | Must match an `id` in `book.json → extract.questions`. |
| `boxes` | One red answer box per item, laid out left to right and wrapping, like the ANS key. |
| `boxes[].steps` | The lines of that box, in reveal order. |
| `boxes[].w` | Fixed box width in points (otherwise the box fits its content). |
| `boxes[].left` | Page x where this box should start, to line it up under a part of the question. |
| `flow: "col"` | Stack the boxes in columns instead of rows. Good for long MC working beside the options. |
| `minScale` | The smallest text scale allowed before the answer continues on an extra sheet (default 0.82; MC questions often need 0.62). |
| `nowrap: true` | Keep the boxes in one row; shrink instead of wrapping. |
| `letter` | MC answer letter shown in the `square` override once all steps show. Leave it out to keep the square empty. |
| `printed: true` | The worked solution is already printed on the page: no answer boxes, only a graphic button at `ctlAt: [x, y]`. |
| `links` | Review links (below). |

### Step kinds

| Helper | Shows | Notes |
| --- | --- | --- |
| `m(tex, reason?)` | display maths (KaTeX) | e.g. `m("x > 14", "÷ 4")` |
| `t(text, reason?)` | a sentence | `$inline maths$`, `\\$` for a dollar sign, `**bold**`, `[[key|words]]` to link plain words |
| `h(label)` | part heading such as "(a)" | not a step: never hidden, not counted |
| `note(text)` | a teacher's margin note | same syntax as `t` |
| `nl({ min, max, op, at, dots?, mark? })` | HKDSE number line | `op`: `lt`, `le`, `gt`, `ge`. `dots`: integers marked in red. `mark`: one highlighted value. It is optional: dropped first when space is short. |
| `lk(key, step)` | marks a whole step as the answer side of link `key` | |
| `L(key, tex)` | marks part of the maths as link `key` | Start with `{}` when the part begins with an operator, e.g. `L("lt", "{} < 4")`, so KaTeX keeps the spacing. Links can be nested. |

The reason (`r`) appears in small blue handwriting beside the line. Keep it to a few words.

### Review links

```js
links: [
  { key: "bc", color: "pink", note: "$BC = x$", q: ["BC = x cm"], at: 1 },
]
```

| Field | Meaning |
| --- | --- |
| `key` | Short id, unique within the question. The answer side uses it via `L()`, `lk()` or `[[key|…]]`. |
| `color` | `pink`, `blue`, `green`, `amber` or `purple`. |
| `note` | The remark tag text (inline `$maths$` allowed). Keep it short: "at least → $\\ge$". |
| `q` | Phrases in the printed question. They are matched word by word, ignoring case and punctuation; a phrase may wrap across lines. One link may have several phrases. |
| `at` | Which marked answer part the tag points to (0-based, default 0). |

---

## widgets.js

```js
import { C, S, T, scene, clear, slider, readout, question, buttonRow } from "../../engine/widgets/kit.js";

function q2(root) { /* append a question card, an SVG scene, a slider and a readout to root */ }

const REGISTRY = { q2 };
export function hasGraphic(id) { return Boolean(REGISTRY[id]); }
export function mountGraphic(id, root) { REGISTRY[id]?.(root); }
```

The engine calls `mountGraphic(id, root)` with an empty drawer body each time the graphic button is pressed. A question gets a graphic button only if `hasGraphic(id)` is true.

### Kit (`engine/widgets/kit.js`)

| Export | Use |
| --- | --- |
| `C` | Palette: `ink`, `red`, `green`, `amber`, `blue`, `pink`, `grey`, `line`, `paper`, `soft`, plus `*Soft` tints. |
| `S(tag, attrs, parent)`, `T(svg, x, y, text, attrs)`, `H(tag, attrs, kids)` | Create SVG elements, SVG text and HTML elements. |
| `scene(w, h)` | An SVG canvas with arrow markers; `clear(svg)` empties it but keeps the markers. |
| `marker(svg, "arr" / "arrInk" / "arrGreen" / "arrRed" / "arrAmber")` | Arrowhead reference for `marker-end`. |
| `axis(svg, { x, y, w, min, max, step, label, every })` | A number line; returns `X(value)` → pixel. |
| `ray(svg, X, y, at, "left"/"right", closed, color, { min, max })` | An HKDSE solution set on that axis. |
| `pin(svg, x, y, color, text, { up, level })` | A labelled marker on an axis; `level` stacks labels. |
| `bar`, `dashed`, `sector`, `regular(n, cx, cy, R)` | Bars, dashed guides, angle sectors, regular polygon points. |
| `slider({ label, min, max, step, value })` | Slider with − / + / ▶. Methods: `.el`, `.get()`, `.set(v)`, `.on(fn)`. |
| `readout()` | Live check. `.set(latex, ok, caption, labels)` shows ✓ satisfies or ✗ fails; `ok` null hides the chip, and `labels: { yes, no }` changes its words. |
| `question(text, lets)`, `intro(text)` | Question card with "Let …" lines; an intro paragraph. |
| `tabs(names, onChange)`, `buttonRow([[label, fn], …])` | Part tabs and quick-value buttons. |
| `tex(latex, display)`, `fmt(n, dp)`, `P(n)`, `niceStep(span)` | KaTeX span, number formatting, brackets for negatives, tick spacing. |

For a full example of each kind of graphic, see `books/jm26b/widgets.js`:
- slider pictures: Q2, Q4;
- number lines with pins: Example 1, Q5–Q8;
- x–y range pictures: Q19–Q22;
- MC statement checkers: the `MC` table.

For percentages, growth and decay, see `books/jm27a/widgets.js`: `timeline()` (bars per period, unknown slider, target or threshold line), `change()` (original vs new bar), and the area pictures in Q9 and Q10.
