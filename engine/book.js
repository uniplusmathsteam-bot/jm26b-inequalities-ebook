/**
 * The book being read, chosen by reader.html?book=<id>. Everything that is
 * specific to one chapter lives in books/<id>/: book.json, layout.json,
 * solutions.js, widgets.js and pages/.
 */

export const BOOK_ID = new URLSearchParams(location.search).get("book") || "";

if (!/^[a-z0-9][a-z0-9-]*$/.test(BOOK_ID)) {
  location.replace("./");
  throw new Error("No book chosen");
}

/** Book folder relative to reader.html (for fetch, img and CSS urls). */
export const BOOK_DIR = `books/${BOOK_ID}/`;
const moduleDir = new URL(`../books/${BOOK_ID}/`, import.meta.url);

const res = await fetch(`${BOOK_DIR}book.json`);
if (!res.ok) {
  location.replace("./");
  throw new Error(`Unknown book ${BOOK_ID}`);
}
export const BOOK = await res.json();

/** Prefix for saved ink and UI state; never change it once a book is in use. */
export const STORAGE = BOOK.storage || BOOK_ID;

/** Full display name, e.g. "S3 JM26 (B) Inequalities I". */
export const BOOK_NAME = [BOOK.form, BOOK.code, BOOK.title].filter(Boolean).join(" ");

const { SOLUTIONS } = await import(new URL("solutions.js", moduleDir).href);
export const SOLUTION_BY_ID = Object.fromEntries(SOLUTIONS.map((s) => [s.id, s]));

const widgets = BOOK.widgets === false ? {} : await import(new URL("widgets.js", moduleDir).href);

export function hasGraphic(id) {
  return Boolean(widgets.hasGraphic?.(id));
}

export function mountGraphic(id, root) {
  root.replaceChildren();
  widgets.mountGraphic?.(id, root);
}

export function pageImage(n) {
  return `${BOOK_DIR}pages/p${String(n).padStart(2, "0")}.jpg`;
}
