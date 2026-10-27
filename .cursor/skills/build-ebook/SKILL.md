---
name: build-ebook
description: >-
  Turn a teacher's question PDF and answer PDF into a book on this static ebook
  reader (books/<id>, solutions.js, layout, QA, release). Use when the user
  adds a chapter, booklet, or notes — mathematics, physics, chemistry, or
  biology — or mentions QUE/ANS PDFs, book.json, solutions.js, answer regions,
  or the ebook platform.
---

# Build an ebook chapter

The reader is a static site: `reader.html?book=<id>`, shared `engine/`, and one folder `books/<id>/`. Follow `docs/01-workflow.md`. This skill is the order of work and the rules that are easy to get wrong. Field lists live in `docs/02-book-format.md`, house style in `docs/03-authoring-style.md`, release in `docs/04-qa-and-release.md`.

A chapter is the same shape in any subject. Only the notation changes (see Subjects).

## Rules that apply to every book

- The book id is the ink store on every iPad. Choose it once (`jm29c`) and never rename `id` or `storage`.
- The QUE page is the background. Nothing covers the printed question. Answers sit in the blank space, in the same order and with the same final sentence as the teacher's red working.
- Do not invent steps, values, reagents, or mechanisms the notes do not contain. If the answer PDF and the question disagree, stop and ask.
- `books/<id>/source/` (the PDFs) and `books/<id>/reference/` (crops, QA shots) are gitignored. Never commit a PDF. Never commit `reference/`.
- On PowerShell, run Python as `python -X utf8` with `$env:PYTHONIOENCODING="utf-8"`. Write a script file instead of a long `python -c`.
- Before a change that alters how answers look, copy the project folder aside so it can be reverted in one step.
- Bump `CACHE` in `sw.js` on every release (`ebooks-v17` → `ebooks-v18`). Commit and push only when the user asks.

## 0. Intake

Need the QUE PDF (blank working space) and the ANS PDF (the same pages with the teacher's working). Record form, code and title as printed, the book id, and the top-bar sections. Copy `docs/chapters/_template.md` to `docs/chapters/<id>.md` and keep decisions there.

**Only an answer PDF was supplied.** Build the question paper with `tools/make_que.py`, then treat its output as the QUE. It removes the pure-red answer frames (stroke redder than the notes' own frames, at least 28×16 pt), the text and drawings inside them, the "Answer" stamp, and the `*` on an MC option. A figure that merely touches a box is kept.

```powershell
python -X utf8 tools/make_que.py "<ANS>.pdf" "books/<id>/source/<QUE made>.pdf" --red-text list
```

`--red-text cover` removes red writing outside a box. `--red-text black` turns red text black, which is what a correct MC option printed in red needs. `--stamp WORD` when the stamp is not "Answer".

Check every page against the ANS before going on: every figure still there, no red working left. The first version of this blanking deleted whole images that touched a box and the live books lost their figures.

## 1. Create

```powershell
python tools/new_book.py <id> --form S3 --code "JM29 (C)" --title "Quadrilaterals" --topic Quadrilaterals --que "<QUE>.pdf" --ans "<ANS>.pdf"
```

This copies `books/_template/`, stores both PDFs, fills `book.json`, and adds a `draft` row to `books/catalog.json`. Set `sections` from the notes' own headings. Set `source.ansPageOffset` (0 when both PDFs have the same page count; −1 when the ANS has no cover).

## 2. Pages and answer regions

```powershell
python tools/extract_pages.py <id> --scan
```

Copy the printed draft into `extract.questions`. Numbered questions use `q1`… and need no anchor. Examples and practices need `extract.anchors` (`{"ex1": "Example\\s*1"}`). `label` is what the jump list shows. Give each question a `section` id.

```powershell
python tools/extract_pages.py <id>
```

Writes `pages/pNN.jpg` (zoom 3, JPEG quality 86) and `layout.json`. A region runs from the bottom of the question to the next question, clipped at `extract.footer`.

When the working must sit on the teacher's own box (MC beside the options, a framed example), set `extract.overrides[id].region` to that box in PDF points, origin top-left, page 595×842. Add `square` for a printed MC answer box and `ring` for an option to circle. One point is 3 pixels on the page image.

Then grow those boxes into the blank space around them and rebuild:

```powershell
python tools/grow_regions.py <id> --write
python tools/extract_pages.py <id>
```

Read `books/<id>/reference/regions/`. The growth must not swallow the next question, a figure, or the footer.

```powershell
python tools/extract_ans_refs.py <id>
```

One crop per red box in `reference/ans/`. Solutions are transcribed from these crops, not from memory.

## 3. Solutions

`books/<id>/solutions.js`, one entry per question, in page order. Helpers from `engine/authoring.js`:

| Helper | Use |
| --- | --- |
| `m(tex, reason?)` | one algebra or equation step, display maths |
| `t(text, reason?)` | a sentence; `$inline$`, `**bold**`, `[[key\|words]]` |
| `h("(a)")` | part heading; always visible, not counted |
| `note(text)` | the teacher's pink margin remark |
| `nl({min, max, op, at})` | HKDSE number line; dropped first when space is short |
| `L(key, tex)`, `lk(key, step)` | the answer side of a review link |

One box per part where the key has side-by-side boxes. `flow: "col"` stacks long working beside options. `minScale` may go to 0.62 on dense pages; do not go lower. `printed: true` plus `ctlAt` when the working is already printed and only a graphic button belongs there. Leave `letter` off an MC question unless the teacher wants the letter filled in.

The engine fits an answer in this order: full text at scale ≥ 0.76, then the same without `nl()` lines, then side-by-side columns, then the same three tries below 0.76, and only then a continuation sheet. Columns must not wrap a line and must not end on an `h()` label. Prefer `flow`, a box `w`, or a lower `minScale` over a continuation sheet. `continuation.band` is how much of the page top the extra sheet copies; it must end above the first question line (JM29 uses 60).

## 4. Review links

On every word problem, `links` tie a short phrase of the question to the matching step. `q` phrases must match the printed words; matching ignores case and punctuation. Skip pure-algebra questions and printed examples. Link the phrase that maps to a step, not the whole sentence.

## 5. Pictures

A slider graphic goes in `books/<id>/widgets.js`, registered in `REGISTRY`, built with `engine/widgets/kit.js`. Copy the shape of `books/jm26b/widgets.js`: a question card in the solution's own letters, a picture of the situation, a slider, a live readout. Use pictures, bars, number lines and shapes. No function graph unless the class has learned graphs. No label may collide at the slider's ends.

A printed concept panel (a theorem box, a law, a family tree) is an animation instead. Follow [animate-summary](../animate-summary/SKILL.md).

## 6. QA

```powershell
cd tools/qa
npm install
node check_book.mjs <id> --shots
```

Fix every `FAIL`. Read every `WARN`. A `FAIL` includes a reason that still contains raw TeX (`\angle`, `$...$`); write the symbol. Open the screenshots in `books/<id>/reference/qa/` and the iPad list in `docs/04-qa-and-release.md`. After an engine change, run `check_book.mjs` for every book in `books/catalog.json`.

## 7. Release

Set `"status": "live"`. Bump `CACHE` in `sw.js`. Update the book table in `README.md` and `docs/chapters/<id>.md`. Commit and push only when asked. The live site is GitHub Pages on `main`: `https://uniplusmathsteam-bot.github.io/jm26b-inequalities-ebook/reader.html?book=<id>`.

## Subjects

The pipeline does not change. Notation and what a "good picture" is do change.

**Mathematics.** KaTeX through `m()` and `$...$`. Angles and triangles as `∠` `△` in text, never raw TeX in a reason. Number lines follow `docs/03-authoring-style.md`: stem, hollow or filled circle, arrow.

**Physics.** Quantities with units in the teacher's notation (`$F = ma$`, `$9.8\,\mathrm{m\,s^{-2}}$`). A graphic is the situation: a free-body sketch, a ray, a circuit, a motion bar. Do not add a graph of a function the form has not learned. Keep the teacher's symbol for a vector; do not switch notation mid-solution.

**Chemistry.** Equations as KaTeX. The vendored KaTeX has no mhchem. To get `\ce{H2O}`, copy `mhchem.min.js` from the **same** KaTeX release as `vendor/katex/` into `vendor/katex/contrib/` and load it in `reader.html` immediately after `katex.min.js`. State symbols and charges must match the notes `(s)`, `(aq)`, `^2+`. Do not balance an equation the teacher left unbalanced, and do not add conditions (heat, catalyst) they did not write. A graphic is a particle picture or apparatus sketch, not a lab procedure.

**Biology.** Prose plus short labels. Keep the notes' terms (do not rename a process). A graphic is a labelled drawing or a cycle with the notes' own arrows and names. Do not add stages, organs, or causes the page does not list.
