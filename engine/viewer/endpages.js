import { BOOK, BOOK_DIR, BOOK_ID, STORAGE } from "../book.js";

/** Landscape slide at the notes' width (595 × 380 pt), so presentation mode shows the whole card. */
export const DECK_H = 380;

/**
 * Pages after the printed ones, from book.json "endPages":
 *   { "key": "summary", "label": "Summary", "image": "pages/summary.png" }   an A4 picture (595 × 842 pt)
 *   { "key": "cards", "label": "Flashcards", "deck": "flashcards.js" }       a flashcard deck (engine/deck)
 * The sheet key is "end-<key>" and ink is saved under it, so never rename a key once a book is in use.
 * Optional `height` (page points); a deck defaults to DECK_H so it fits on one presentation page.
 */
export const END_PAGES = (BOOK.endPages || []).map((item) => ({
  ...item,
  sheetKey: `end-${item.key}`,
  src: item.image ? `${BOOK_DIR}${item.image}` : "",
  height: item.height || (item.deck ? DECK_H : undefined),
}));

/** Fills an end page's overlay; a deck loads its book module the first time. */
export async function mountEndPage(item, overlay) {
  if (!item.deck) return;
  try {
    const [{ mountDeck }, mod] = await Promise.all([
      import("../deck/deck.js"),
      import(new URL(`../../books/${BOOK_ID}/${item.deck}`, import.meta.url).href),
    ]);
    mountDeck(overlay, mod.DECK, `${STORAGE}-deck-${item.key}`);
  } catch (err) {
    console.error(`End page "${item.key}" failed to load`, err);
  }
}
