/**
 * Helpers for writing books/<id>/solutions.js. Each question is a set of
 * answer boxes, and every non-heading line is one revealable step.
 *
 * Line kinds: m() display maths, t() text with $inline$ maths (\$ is a dollar
 * sign, **bold**, [[key|words]] links plain words), h() part label, note()
 * teacher margin note, nl() number line. m and t take an optional short side
 * reason. See docs/02-book-format.md for every field.
 */

export const m = (m, r) => ({ m, r });
export const t = (t, r) => ({ t, r });
export const h = (h) => ({ h });
export const note = (note) => ({ note });
export const nl = (spec) => ({ nl: spec, optional: true });

/** Marks part of the maths as the answer side of review link `key`. */
export const L = (key, tex) => `\\htmlClass{lk-${key}}{${tex}}`;

/** Marks a whole step as the answer side of review link `key`. */
export const lk = (key, step) => ({ ...step, lk: key });
