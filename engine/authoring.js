/**
 * Helpers for writing books/<id>/solutions.js. Each question is a set of
 * answer boxes, and every non-heading line is one revealable step.
 *
 * Line kinds: m() display maths, t() text with $inline$ maths (\$ is a dollar
 * sign, **bold**, [[key|words]] links plain words), h() part label, note()
 * teacher margin note, nl() number line, tree() tree diagram, table() table of
 * outcomes. m and t take an optional short side reason. align() hangs "= …"
 * lines under the line above. See docs/02-book-format.md for every field.
 */

export const m = (m, r) => ({ m, r });
export const t = (t, r) => ({ t, r });
export const h = (h) => ({ h });
export const note = (note) => ({ note });
export const nl = (spec) => ({ nl: spec, optional: true });
export const tree = (spec) => ({ tree: spec });
export const table = (spec) => ({ table: spec });

/** Tree branches where every stage has the same choices: grow(["H", "T"], ["1", "2"]). */
export const grow = (...stages) => (stages.length ? stages[0].map((s) => (stages.length > 1 ? [s, grow(...stages.slice(1))] : s)) : []);

const unwrap = (s) => {
  const tag = "\\htmlClass{";
  for (let at = s.indexOf(tag); at >= 0; at = s.indexOf(tag)) {
    const open = s.indexOf("}", at + tag.length) + 1;
    let depth = 0;
    let end = open;
    for (; end < s.length; end++) {
      if (s[end] === "{") depth++;
      else if (s[end] === "}" && --depth === 0) break;
    }
    s = s.slice(0, at) + s.slice(open + 1, end) + s.slice(end + 1);
  }
  return s;
};

/** What a continuation line hangs under: the maths before the first top-level = or ≈, else the part label. */
const hangOf = (tex) => {
  let depth = 0;
  for (let i = 0; i < tex.length; i++) {
    const c = tex[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (depth === 0 && (c === "=" || tex.startsWith("\\approx", i))) return i ? unwrap(tex.slice(0, i).trimEnd()) : null;
  }
  return tex.match(/^\\textbf\{\([a-z]+\)\}\\enspace/)?.[0] ?? null;
};

/**
 * Lines each "= …", "≈ …", "> …" (etc.) display line up under the first relation of the line
 * that starts its chain, as printed keys do. Text lines and part labels end a chain.
 */
export const align = (steps) => {
  let hang = null;
  return steps.map((step) => {
    if (step.m == null) {
      if (step.t != null || step.h != null) hang = null;
      return step;
    }
    const tex = step.m.trimStart();
    if (/^(=|<|>|\\approx|\\[lg]eq?\b|\\neq)/.test(tex)) return hang ? { ...step, m: `\\phantom{${hang}} ${tex}` } : step;
    hang = hangOf(step.m);
    return step;
  });
};

/** Marks part of the maths as the answer side of review link `key`. */
export const L = (key, tex) => `\\htmlClass{lk-${key}}{${tex}}`;

/** Marks a whole step as the answer side of review link `key`. */
export const lk = (key, step) => ({ ...step, lk: key });
