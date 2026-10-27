---
name: animate-summary
description: >-
  Replace a printed concept-summary panel in an ebook with a Manim animation
  that covers that panel and plays in the reader. Use when the user asks to
  animate a theorem, law, definition, or summary box in mathematics, physics,
  chemistry, or biology notes, or mentions Manim, media entries, or summary panels.
---

# Animate a printed summary panel

A summary panel is a boxed block of teaching content already printed on the page: the parallelogram properties in JM29 (A), a law, a definition, a cycle. The animation is a video laid exactly over that rectangle. Before it plays, the poster is the finished panel, so the page still reads as printed. Worked solutions stay in `solutions.js`. A one-question slider stays a widget (`books/jm26b/widgets.js`), not a video.

The reference implementation is `tools/manim/jm29.py` (nine panels) rendered by `tools/render_media.py` and played by `engine/viewer/media.js`.

## What to animate

Animate a panel when the picture changes as the sentence is read: a copy rotates onto its opposite, a second shape completes a formula, one figure deforms into the next. Leave alone a panel that is only words, a table, or a figure the animation cannot redraw faithfully.

One entry per panel, in `book.json`:

```json
"media": [
  { "page": 1, "region": [44, 341, 566, 679], "scene": "jm29:ParallelogramProperties",
    "src": "media/properties.mp4", "poster": "media/properties.jpg",
    "title": "Animate the properties of a parallelogram" }
]
```

`region` is the panel in PDF points, origin top-left, and it must cover every mark the video replaces, including a border that sits a point outside the frame. `scene` is `module:Class` in `tools/manim/<module>.py`.

## Draw in page points

Subclass `PageScene` (copy it from `tools/manim/jm29.py` into the chapter's module, or import it). `render_media.py` sets `REGION` from the entry. `P(x, y)` maps a page point into the frame, so a vertex read off the page image lands on the printed one.

- `line`, `dashed`, `poly`, `frame`, `dot`, `ticks`, `chevrons`, `corner`, `right`, `span` for the drawing.
- `text(s, x, baseline, size, font=...)` puts the baseline at a page y. `after` continues on the same baseline. `label` centres a vertex name. `tag` is a filled label chip.
- Fonts that exist here: `Times New Roman`, `Calibri`, `Cambria`, `Arial`, `Arial Rounded MT`, `Segoe UI Symbol`. There is no bold "Arial Rounded MT Bold"; use `Arial Rounded MT`. Cambria Bold has no `∠` or `△`; `text()` already draws those signs from Cambria regular.
- `text()` routes `∠△≅` to Cambria regular for any font. Baseline is the most common glyph bottom, so a raised `=` does not shift the line.

Read positions from the page image (1 pt = 3 px at the extract zoom of 3) or from `layout.json` text quads. Do not guess a whole panel and nudge afterwards; the comparison image below shows the error.

## Teach the panel, then land on it

The last frame is the poster, and it has to match the print closely: same words, same layout, the panel's own colours.

- Build one idea at a time, in the order the panel reads. A half turn (`Rotate` by `PI`) is the right move for "these two are equal". A mirror is `Rotate` by `PI` about `UP`.
- State only what the panel states. Where the print is wrong, say so in the chapter log and animate the correct statement (JM29 (B) cards 3 and 4 repeat card 1's condition; the scene states the conditions the figures show). Do not quietly correct anything else.
- The video must finish on the complete panel, then hold about a second. Fade any helper that is not in the print (the morphing shape in the quadrilateral family tree fades before the end).
- Keep each video under about 300 KB. JM29's nine videos together are about 1.3 MB.

## Subject matter

**Mathematics.** Recreate the printed figure and let the given condition move: equal sides, a bisected diagonal, a mid-segment tiling the base.

**Physics.** Animate the situation the law describes: a ray reflecting, two forces balancing, a field line. Use the notes' symbols and units. Do not add a graph the form has not learned.

**Chemistry.** Animate a particle picture or a state change the panel already draws (ions moving, a bond forming). Use the notes' formulas. Do not add reagents, conditions, or steps the panel does not list. `\ce{}` needs mhchem; see the chemistry note in the build-ebook skill.

**Biology.** Animate the panel's own cycle or labelled drawing: arrows appearing in the printed order, names as printed. Do not add stages.

## Render and compare

```powershell
$env:PYTHONIOENCODING = "utf-8"
python -X utf8 tools/render_media.py <id> --still
```

`--still` writes `books/<id>/reference/media/<Class>.png` and `<Class>_cmp.png`: the printed panel on top, the last frame below, with a red gap. Read the comparison. Fix baseline, size, and vertex positions before rendering video. `reference/` is gitignored.

Then render the videos and posters:

```powershell
python -X utf8 tools/render_media.py <id>
```

This runs Manim at about 2.5 pixels per point, even dimensions, 30 fps, white background, and re-encodes with ffmpeg (`libx264`, crf 26, `+faststart`, no audio). The poster is the last fraction of a second, so it matches the resting frame. Confirm the poster has real glyphs. A console that is not UTF-8 will bake corrupted characters such as `âž¤` into the video; the `PYTHONIOENCODING` line is what prevents it.

## Play it in the reader

`engine/viewer/media.js` lays a `<video>` over the region, poster showing, with a round button on the panel's top-right corner (`data-media`). The world click handler plays, pauses, and replays it in every tool. The service worker caches the whole mp4 and answers Safari's `Range` requests with a 206 slice. Both already exist; a new panel needs only the `media` entry and the files.

Check in the reader (`python -m http.server`, then `reader.html?book=<id>`):

- the poster covers the panel edge to edge and the button does not hide a label;
- the button plays in Read and in Pen;
- the console stays clean, and the video reaches past the first second.

`node tools/qa/check_book.mjs <id>` still has to pass. It does not judge the video; look at the comparison image for that.

Bump `CACHE` in `sw.js` when the videos ship, and record the panel in `docs/chapters/<id>.md`. Commit the `media/` mp4 and jpg files. Do not commit `reference/` or the Manim work dir `tools/_manim/`.
