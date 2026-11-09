# Engine notes

The engine (`engine/`) is shared by every book. A change here changes all books, so after any engine edit, run `node tools/qa/check_book.mjs <id>` for **every** book in `books/catalog.json`.

## How a book loads

```mermaid
flowchart TD
  lib[index.html library] -->|"reader.html?book=id"| reader[reader.html]
  reader --> app[engine/viewer/app.js]
  app --> book[engine/book.js]
  book -->|fetch| bj[books/id/book.json]
  book -->|import| sol[books/id/solutions.js]
  book -->|import| wid[books/id/widgets.js]
  app -->|fetch| lay[books/id/layout.json]
  app --> pages[sheets: page image + overlay + ink canvases]
  pages --> answers[answers.js: fit boxes, reveal steps]
  pages --> links[links.js: review links]
  pages --> ink[ink/ink.js: Pencil ink]
```

- `book.js` reads `?book=`, loads the book, and exports `BOOK`, `BOOK_DIR`, `STORAGE`, `SOLUTION_BY_ID`, `hasGraphic`, `mountGraphic` and `pageImage`. With no book, or an unknown id, it sends the reader back to the library.
- `app.js` builds one `.sheet` per page: a background `<img>`, an `.overlay` for answers and links, and canvases for highlighter and pen ink. It handles pan and zoom, which use a CSS transform rather than native scrolling, plus toolbars, thumbnails, the jump list, presentation mode and keyboard shortcuts.
- In presentation mode, `showPage()` records the fitted scale in `present.base`. When a pinch has zoomed past it (`presentZoomed()`), one-finger drags pan with momentum instead of turning or springing back the page, and a resize that leaves the width unchanged (Safari bars sliding) keeps the zoom. A one-finger double tap, or pinching back below the fit, returns to `showPage()`.
- `answers.js` sets every answer at the book's type size (`BOOK.answerScale`, default 1). At reader size 100% it tries, in order: the authored layout, long equations broken before "=", tall boxes cut into side-by-side columns (`split()`), then a flowing wrap that may scroll inside the region (visible `.qa-bar`). In a wrapped box (`fitInWidth`) a step that is too long breaks before "=", and its reason moves to the end of the last row (`.ln.tuck`); a reason drops under its step (`.ln.drop`) only when even that row has no room. When the region's width forces such a break, the answer (or its last part column) may also use the button strip if that avoids the break, and the buttons move into the page margin (`answerRight`). Parts printed side by side as `(a)` `(b)` on one row get each answer box under its own label (`partColumns`). Authored `space` on a question opens the page under that region; a reader size other than 100% grows the region and opens the page the same way (`growSheet`). Reveal, wheel and drag scroll a long answer before moving the page.
- `media.js` lays each `book.json` `media` entry over its page region: a `<video>` showing its poster (the last frame) plus a round button on the panel's corner. The button carries `data-media`, so the world click handler toggles play, pause and replay in every tool, as it does for `data-act` answer buttons.
- `guide.js` makes the film button (`guideButton`, `data-act="guide"`) that `answers.js` puts in the control strip of a question listed in `book.json` `guides`, and `openGuide` shows its video in a modal sized to the video's aspect ratio. The modal has its own bar (play/pause, a seek slider and the time), not the native controls, so nothing covers the figure. Escape closes it; Space or K toggles play, and the arrow keys seek by 5 s.
- `endpages.js` reads `book.json` `endPages`. `app.js` adds one sheet per entry after the printed pages, with `data-label` (shown in the page label and thumbnail) and `data-thumb` (the thumbnail image; a sheet without one gets a coloured tile). A deck sheet has class `deck` and `data-no-ink`, which `ink.js` honours for every tool except the laser. `engine/deck/deck.js` draws the cards and keeps progress in localStorage (`<storage>-deck-<key>`); its `checkDeck()` is what `check_book.mjs` uses to validate a deck, before tapping through every card with a finger.
- `links.js` finds `q` phrases in `layout.json` text, measures the marked answer parts, and draws the markers, tags and leaders. Question-side markers are dashed (then solid) boxes; answer-side markers are coloured dotted underlines (solid when open), with a transparent hit area so a tap still toggles the link. Nested `.lk-*` pieces drop each underline by 2.6 pt so they stay readable. On a scrolling answer only the lines in the window are marked.

## Coordinates

Everything on a sheet uses PDF points (595.32 × 841.92 for A4), the same units as `layout.json`, so overlays line up with the page image at any zoom. Strokes are also saved in points, so ink stays aligned after rotation or a zoom change.

## Storage on the device

| Key | Where | Contents |
| --- | --- | --- |
| `<storage>-ebook` | IndexedDB, store `kv`, key `strokes` | all ink for the book |
| `<storage>-ui` | localStorage | revealed steps per question, tool, toolbar dock, link hints on or off |
| `<storage>-deck-<key>` | localStorage | flashcard order, answers and current card for an end-page deck |
| `library-last` | localStorage | the last opened book, for the library's Continue button |

`storage` comes from `book.json`. JM26 (B) uses `jm26b`, which keeps the names from before the databank (`jm26b-ebook`, `jm26b-ui`), so existing ink survived the change.

Safari may delete a website's data if it isn't opened for about a week. Adding the site to the Home Screen protects it. "Save ink file" exports a backup.

## Offline (service worker)

`sw.js` serves code network-first, so a reload picks up changes while online. Images, vendor files and page JPEGs (`/assets/`, `/vendor/`, `/pages/`) are served cache-first. Videos (`/media/*.mp4`) are cached whole and answered from the cache with a 206 slice for each `Range` request, because Safari only plays video that way. **Bump `CACHE` on every release.**

## Ink and Apple Pencil: lessons learned

These cost real debugging time on JM26 (B). Keep them in mind when touching `engine/ink/` or the pointer code in `app.js`:

- **Input model.**
  - Pencil (`pointerType: "pen"`) draws, a finger scrolls and zooms, and a mouse draws.
  - Touches are ignored while the Pencil is down and for 500 ms after (palm rejection).
  - Only the pointer that started a stroke (`activeId`) can move or end it; otherwise a lifting palm ends the Pencil stroke.
- **Safari holds back quick strokes** while it checks for a double tap or a scroll. `claimStylus` calls `preventDefault()` on stylus touch events in drawing tools. `gesturestart` is also prevented, to stop whole-app zoom.
- **`getCoalescedEvents()` is empty on `pointerdown`.** Fall back to the event itself, or the first point is lost and a quick tap leaves no dot.
- **Canvas memory.**
  - iPad Safari limits each canvas to about 16.7 MP, and limits all canvases together by memory.
  - Only pages near the screen that have ink get full-size canvases (`MAX_PIXELS` = 5e6). Pages far away are released to 1 × 1 and repainted on return.
  - Zoomed past that, a canvas covers only the screen plus a margin (`VIEW_MARGIN`, `VIEW_PIXELS`), positioned in page units, so ink stays at screen sharpness. Panning keeps the current view while it still covers the screen, then repaints. The live layer clears only the box it last painted.
  - The stroke in progress is drawn on its own `live` layer; lifting the Pencil adds just that stroke to the page.
- **Saving.** Saves are debounced by 1.5 s and never run mid-stroke. Ink is flushed immediately on `visibilitychange` (hidden) and `pagehide`.
- **Smoothing and pressure.**
  - perfect-freehand with `smoothing` 0.5, `streamline` 0.3 and `last: true`;
  - a pressure curve that lifts light touches;
  - taper scaled to stroke length (at most 8 pt, 30 % of the length), so short strokes keep their body;
  - a pen mark whose bounding box has a diagonal under size + 3.5 pt is drawn as round dabs (`dab()` in `render.js`), not by perfect-freehand. perfect-freehand drops the points of such a short stroke and tapers both ends to nothing, so a Pencil tap, which always wobbles a little, drew a mark 0.02 pt wide: dots were nearly impossible and short dashes vanished. `check_book.mjs` taps a jittery pen and fails if no dot shows;
  - predicted events where Safari provides them.
- **Snapping.**
  - Holding still for 520 ms recognises a line, rectangle, ellipse or triangle (`shapes.js`).
  - The highlighter snaps to the text rows of `layout.json`, and to per-character boxes in the revealed answers, so part of a line can be highlighted.
- **Stroke model.**
  - Each stroke is `{ id, page, tool, color, size, points: [{x, y, p, t}], shape?, cut? }`. `page` is the sheet key (`p3`).
  - Undo history entries are `add`, `swap` (removed/added) and `clear`, capped at 120.
- **Finger gestures.** A two-finger tap undoes and a three-finger tap redoes. Either is cancelled by more than 14 px of movement, or by holding longer than 450 ms.

## Maths rendering

- KaTeX renders with `trust` for `\htmlClass` only; that's how `L()` marks link parts.
- `plain()` in `answers.js` turns each step into readable text for the PDF export.
- Layout runs twice: once at load and again after `document.fonts.ready`, because KaTeX fonts change line widths.

## Testing tips (headless Chrome)

- Emulate the iPad with viewport 1180 × 820, `deviceScaleFactor: 2`, `isMobile` and `hasTouch`.
- Send Pencil input with CDP `Input.dispatchMouseEvent` plus `pointerType: "pen"`, and touches with `Input.dispatchTouchEvent`.
- Keep test points inside the visible viewport; points below it hit `<html>`, not the sheet.
- The reader pans with a transform, so `scrollIntoView` does nothing. Navigate with `location.hash = "<sheet key or question id>"`; a question id wins when it equals a sheet key (`p2`). Fine-tune the position with `page.mouse.wheel`.
- To read saved ink immediately, fake `document.visibilityState = "hidden"` and dispatch `visibilitychange`, then read IndexedDB.
- A static server for tests must send `.mjs` as `text/javascript`, or the freehand module fails to load.
