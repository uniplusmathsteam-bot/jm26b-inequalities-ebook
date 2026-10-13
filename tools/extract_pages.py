"""Render a book's QUE pages and write the blank-region layout for its overlays.

Usage:
    python tools/extract_pages.py <book-id>          # pages/*.jpg + layout.json
    python tools/extract_pages.py <book-id> --scan   # draft the question list

Everything chapter-specific (question list, anchors, region overrides) is in
books/<book-id>/book.json under "extract". See docs/02-book-format.md.
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]


def load_book(book_id):
    folder = ROOT / "books" / book_id
    path = folder / "book.json"
    if not path.exists():
        sys.exit(f"No {path}; create the book first with tools/new_book.py")
    return folder, json.loads(path.read_text(encoding="utf-8"))


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


def find_anchor(words, label, pattern):
    if pattern:
        line = {}
        for w in words:
            key = round(w["y0"], 0)
            line.setdefault(key, []).append(w)
        for key in sorted(line):
            ws = sorted(line[key], key=lambda w: w["x0"])
            text = " ".join(w["t"] for w in ws)
            if pattern.search(text):
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


def scan(folder, book):
    """Print a draft "questions" list: numbered items and Example/Practice headings per page."""
    doc = fitz.open(folder / book["source"]["que"])
    heading = re.compile(r"^(Example|Practice|Exercise|Class\s*work|Challenge|Revision)\b", re.I)
    draft = []
    for i, page in enumerate(doc):
        big = set()
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                text = "".join(s["text"] for s in line["spans"]).strip()
                size = max((s["size"] for s in line["spans"]), default=0)
                if size >= 14 and re.fullmatch(r"[A-Za-z][A-Za-z ()&'!?,-]{3,}", text):
                    big.add(text)
        for text in sorted(big):
            print(f"  page {i + 1}: possible section title: {text!r}")
        rows = {}
        for w in words_of(page):
            rows.setdefault(round(w["y0"]), []).append(w)
        for y in sorted(rows):
            ws = sorted(rows[y], key=lambda w: w["x0"])
            text = " ".join(w["t"] for w in ws)
            first = ws[0]
            m = re.match(r"^(\d+)\.?$", first["t"])
            if m and first["x0"] < 80:
                draft.append({"id": f"q{m.group(1)}", "page": i + 1, "label": m.group(1), "section": ""})
            elif heading.match(text):
                label = " ".join(text.split()[:2])
                qid = re.sub(r"[^a-z0-9]", "", label.lower().replace("example", "ex").replace("practice", "p"))
                draft.append({"id": qid, "page": i + 1, "label": label, "section": "", "anchor": re.escape(label).replace("\\ ", "\\s*")})
    print(json.dumps(draft, indent=2, ensure_ascii=False))
    print("Check the list, fill in each section, move any 'anchor' into extract.anchors, then paste into book.json.")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder, book = load_book(sys.argv[1])
    if "--scan" in sys.argv:
        scan(folder, book)
        return
    cfg = book["extract"]
    zoom = cfg.get("zoom", 3)
    region_x = cfg.get("regionX", [66, 546])
    footer = cfg.get("footer", 822)
    anchors_cfg = {k: re.compile(v) for k, v in cfg.get("anchors", {}).items()}
    fixed = {k: tuple(v) for k, v in cfg.get("fixedAnchors", {}).items()}
    overrides = cfg.get("overrides", {})

    pages_dir = folder / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(folder / book["source"]["que"])
    mat = fitz.Matrix(zoom, zoom)
    page_meta = []
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        # MuPDF here cannot write WebP; JPEG keeps the page sharp at a smaller size.
        out = pages_dir / f"p{i+1:02d}.jpg"
        pix.save(str(out), jpg_quality=86)
        page_meta.append({
            "page": i + 1,
            "width": round(page.rect.width, 2),
            "height": round(page.rect.height, 2),
        })
        print("rendered", out.name, pix.width, pix.height)

    by_page = {}
    for q in cfg["questions"]:
        by_page.setdefault(q["page"], []).append(q)

    layout_pages = []
    for i, page in enumerate(doc):
        words = words_of(page)
        anchors = []
        for q in by_page.get(i + 1, []):
            found = fixed.get(q["id"]) or find_anchor(words, q["label"], anchors_cfg.get(q["id"]))
            anchors.append((q, found))
            if not found:
                print("MISSING ANCHOR", q["id"], "page", i + 1)
        items = []
        for n, (q, found) in enumerate(anchors):
            if not found:
                continue
            y0, y1 = found
            next_y = footer
            for _, nxt in anchors[n + 1:]:
                if nxt:
                    next_y = nxt[0] - 6
                    break
            text_bottom = question_bottom(words, y0, next_y)
            blank_top = text_bottom + 6
            blank_bottom = next_y - 4
            if blank_bottom - blank_top < 36:
                blank_top = min(blank_top, next_y - 40)
            item = {
                "id": q["id"],
                "label": q["label"],
                "section": q["section"],
                "anchor": [round(y0, 1), round(y1, 1)],
                "region": [region_x[0], round(blank_top, 1), region_x[1], round(blank_bottom, 1)],
            }
            item.update(overrides.get(q["id"], {}))
            items.append(item)
        layout_pages.append({**page_meta[i], "questions": items, "text": text_lines(page)})

    text = json.dumps({"zoom": zoom, "pages": layout_pages}, indent=2, ensure_ascii=False)
    text = re.sub(r"\[\s+([-\d.]+),\s+([-\d.]+)\s+\]", r"[\1, \2]", text)
    text = re.sub(
        r'\[\s+([-\d.]+),\s+([-\d.]+),\s+("(?:\\.|[^"\\])*")\s+\]',
        r"[\1, \2, \3]",
        text,
    )
    layout = folder / "layout.json"
    layout.write_text(text, encoding="utf-8")
    print("wrote", layout)


if __name__ == "__main__":
    main()
