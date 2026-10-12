"""Render QUE pages and write blank-region layout for the ebook overlays."""

import json
import re
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
QUE = ROOT / "S3 JM26 (B)  Inequalities I - 2026 (QUE).pdf"
PAGES = ROOT / "assets" / "pages"
LAYOUT = ROOT / "src" / "data" / "layout.json"
ZOOM = 3

# (id, page index 0-based, label shown in the jump list, section)
QUESTIONS = [
    ("ex1", 1, "Example 1", "practical"),
    ("p1a", 1, "Practice 1a", "practical"),
    ("p1b", 1, "Practice 1b", "practical"),
    ("q1", 2, "1", "practical"),
    ("q2", 2, "2", "practical"),
    ("q3", 2, "3", "practical"),
    ("q4", 2, "4", "practical"),
    ("q5", 3, "5", "practical"),
    ("q6", 3, "6", "practical"),
    ("q7", 3, "7", "practical"),
    ("q8", 3, "8", "practical"),
    ("q9", 4, "9", "practical"),
    ("q10", 4, "10", "practical"),
    ("q11", 4, "11", "practical"),
    ("q12", 5, "12", "practical"),
    ("q13", 5, "13", "practical"),
    ("q14", 6, "14", "practical"),
    ("q15", 6, "15", "practical"),
    ("q16", 7, "16", "practical"),
    ("q17", 7, "17", "practical"),
    ("q18", 8, "18", "practical"),
    ("q19", 8, "19", "practical"),
    ("q20", 9, "20", "practical"),
    ("q21", 9, "21", "practical"),
    ("q22", 9, "22", "practical"),
    ("ex2", 10, "Example 2", "mc"),
    ("ex2lq", 10, "Example 2 (LQ method)", "mc"),
    ("p2", 10, "Practice 2", "mc"),
    ("q23", 11, "23", "mc"),
    ("q24", 11, "24", "mc"),
    ("q25", 11, "25", "mc"),
    ("q26", 11, "26", "mc"),
    ("q27", 12, "27", "mc"),
    ("q28", 12, "28", "mc"),
    ("q29", 12, "29", "mc"),
    ("q30", 12, "30", "mc"),
    ("q31", 13, "31", "challenge"),
    ("q32", 14, "32", "challenge"),
    ("q33", 15, "33", "challenge"),
]

# Answer areas that cannot be inferred from the gap below a question: framed
# examples, the MC working space beside the options, and the MC answer squares.
OVERRIDES = {
    "ex1": {"region": [48, 194, 512, 336]},
    "p1a": {"region": [48, 390, 512, 478]},
    "p1b": {"region": [48, 588, 512, 812]},
    "ex2": {"region": [200, 140, 516, 316]},
    "ex2lq": {"region": [44, 356, 478, 592]},
    "p2": {"region": [160, 648, 536, 806], "ring": [38, 707, 131, 727]},
    "q23": {"region": [174, 80, 500, 228], "square": [504, 128, 532, 156]},
    "q24": {"region": [180, 247, 500, 420], "square": [504, 365, 532, 393]},
    "q25": {"region": [198, 441, 500, 614], "square": [504, 565, 533, 594]},
    "q26": {"region": [190, 636, 500, 822], "square": [504, 753, 532, 781]},
    "q27": {"region": [174, 80, 500, 240], "square": [504, 145, 532, 173]},
    "q28": {"region": [248, 261, 500, 395], "square": [504, 299, 533, 328]},
    "q29": {"region": [178, 470, 500, 614], "square": [504, 526, 533, 554]},
    "q30": {"region": [174, 634, 500, 822], "square": [504, 680, 533, 708]},
}

ANCHOR = {
    "ex1": re.compile(r"Example\s*1"),
    "p1a": re.compile(r"Practice\s*1a"),
    "p1b": re.compile(r"Practice\s*1b"),
    "ex2": re.compile(r"Example\s*2"),
    "p2": re.compile(r"Practice\s*2"),
}


def words_of(page):
    words = []
    for w in page.get_text("words"):
        x0, y0, x1, y1, text, *_ = w
        words.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1, "t": text})
    return words


def norm_word(text):
    """NFKC so mathematical italics (𝐴𝐵) match plain letters (AB)."""
    return unicodedata.normalize("NFKC", text)


def text_lines(page):
    """Printed text lines as [y0, y1, [[x0, x1, word], ...]] for snapping and review links."""
    lines = {}
    for x0, y0, x1, y1, text, block, line, _word in page.get_text("words"):
        lines.setdefault((block, line), []).append((x0, y0, x1, y1, norm_word(text)))
    rows = []
    for ws in sorted(lines.values(), key=lambda ws: min(w[1] for w in ws)):
        y0 = min(w[1] for w in ws)
        y1 = max(w[3] for w in ws)
        if y1 - y0 > 40:
            continue
        row = next((r for r in rows if min(r[1], y1) - max(r[0], y0) > 0.6 * min(r[1] - r[0], y1 - y0)), None)
        if row:
            row[0], row[1] = min(row[0], y0), max(row[1], y1)
            row[2].extend(ws)
        else:
            rows.append([y0, y1, list(ws)])
    out = []
    for y0, y1, ws in rows:
        ws.sort()
        out.append([round(y0, 1), round(y1, 1), [[round(w[0], 1), round(w[2], 1), w[4]] for w in ws]])
    return out


def find_anchor(words, qid, label):
    if qid in ANCHOR:
        line = {}
        for w in words:
            key = round(w["y0"], 0)
            line.setdefault(key, []).append(w)
        for key in sorted(line):
            ws = sorted(line[key], key=lambda w: w["x0"])
            text = " ".join(w["t"] for w in ws)
            if ANCHOR[qid].search(text):
                return min(w["y0"] for w in ws), max(w["y1"] for w in ws)
        return None
    # Numbered question: a lone "12." or "12" near the left margin.
    target = label
    for w in words:
        if w["x0"] > 80:
            continue
        token = w["t"].rstrip(".")
        if token == target and w["t"].endswith("."):
            return w["y0"], w["y1"]
    for w in words:
        if w["x0"] > 70:
            continue
        if w["t"].rstrip(".") == target and len(w["t"]) <= len(target) + 1:
            return w["y0"], w["y1"]
    return None


def question_bottom(words, y_start, y_limit):
    """Bottom of printed question text before the blank working space."""
    ys = [w["y1"] for w in words if y_start - 1 <= w["y0"] < y_limit - 8 and w["x0"] < 560]
    if not ys:
        return y_start + 40
    # Cluster lines; the question body is the first run of lines.
    lines = sorted(set(round(w["y0"]) for w in words if y_start - 1 <= w["y0"] < y_limit - 8))
    if not lines:
        return y_start + 40
    end = lines[0]
    for y in lines[1:]:
        if y - end > 28:
            break
        end = y
    bottoms = [w["y1"] for w in words if abs(round(w["y0"]) - end) <= 2 or (y_start - 1 <= w["y0"] <= end + 2)]
    return max(bottoms) if bottoms else y_start + 40


def main():
    PAGES.mkdir(parents=True, exist_ok=True)
    LAYOUT.parent.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(QUE)
    mat = fitz.Matrix(ZOOM, ZOOM)
    page_meta = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        # MuPDF here cannot write WebP; JPEG keeps the page sharp at a smaller size.
        out = PAGES / f"p{i+1:02d}.jpg"
        pix.save(str(out), jpg_quality=86)
        page_meta.append({
            "page": i + 1,
            "width": round(page.rect.width, 2),
            "height": round(page.rect.height, 2),
        })
        print("rendered", out.name, pix.width, pix.height)

    by_page = {}
    for qid, pidx, label, section in QUESTIONS:
        by_page.setdefault(pidx, []).append((qid, label, section))

    layout_pages = []
    for i, page in enumerate(doc):
        words = words_of(page)
        meta = page_meta[i]
        items = []
        qs = by_page.get(i, [])
        anchors = []
        for qid, label, section in qs:
            if qid == "ex2lq":
                anchors.append((qid, label, section, (327.0, 340.0)))
                continue
            found = find_anchor(words, qid, label)
            anchors.append((qid, label, section, found))
            if not found:
                print("MISSING ANCHOR", qid, "page", i + 1)
        footer = 822
        for n, (qid, label, section, found) in enumerate(anchors):
            if not found:
                continue
            y0, y1 = found
            next_y = footer
            for _, _, _, nxt in anchors[n + 1:]:
                if nxt:
                    next_y = nxt[0] - 6
                    break
            text_bottom = question_bottom(words, y0, next_y)
            blank_top = text_bottom + 6
            blank_bottom = next_y - 4
            if blank_bottom - blank_top < 36:
                blank_top = min(blank_top, next_y - 40)
            item = {
                "id": qid,
                "label": label,
                "section": section,
                "anchor": [round(y0, 1), round(y1, 1)],
                "region": [66, round(blank_top, 1), 546, round(blank_bottom, 1)],
            }
            item.update(OVERRIDES.get(qid, {}))
            items.append(item)
        layout_pages.append({**meta, "questions": items, "text": text_lines(page)})

    text = json.dumps({"zoom": ZOOM, "pages": layout_pages}, indent=2, ensure_ascii=False)
    text = re.sub(r"\[\s+([-\d.]+),\s+([-\d.]+)\s+\]", r"[\1, \2]", text)
    text = re.sub(
        r'\[\s+([-\d.]+),\s+([-\d.]+),\s+("(?:\\.|[^"\\])*")\s+\]',
        r"[\1, \2, \3]",
        text,
    )
    LAYOUT.write_text(text, encoding="utf-8")
    print("wrote", LAYOUT)


if __name__ == "__main__":
    main()
