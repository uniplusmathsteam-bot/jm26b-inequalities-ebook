"""Create a new book folder from books/_template and add it to the library.

Usage:
    python tools/new_book.py <book-id> --form S3 --code "JM27 (A)" --title "Inequalities II" \
        --topic Inequalities --que "path/to/QUE.pdf" --ans "path/to/ANS.pdf"

<book-id> is short, lower case and URL-safe, e.g. jm27a. It also names the
saved-ink store on every iPad, so never rename it once the book is in use.
"""

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOOKS = ROOT / "books"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("id")
    p.add_argument("--form", required=True, help="e.g. S3")
    p.add_argument("--code", required=True, help='e.g. "JM26 (B)"')
    p.add_argument("--title", required=True, help='e.g. "Inequalities I"')
    p.add_argument("--topic", default="")
    p.add_argument("--year", type=int, default=2026)
    p.add_argument("--que", required=True, help="question PDF (blank answer spaces)")
    p.add_argument("--ans", required=True, help="answer PDF (teacher's red-boxed working)")
    a = p.parse_args()

    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", a.id):
        sys.exit("Book id must be lower case letters, digits and hyphens, e.g. jm27a")
    folder = BOOKS / a.id
    if folder.exists():
        sys.exit(f"{folder} already exists")
    que, ans = Path(a.que), Path(a.ans)
    for f in (que, ans):
        if not f.exists():
            sys.exit(f"Missing {f}")

    shutil.copytree(BOOKS / "_template", folder)
    (folder / "source").mkdir()
    shutil.copy2(que, folder / "source" / que.name)
    shutil.copy2(ans, folder / "source" / ans.name)

    book = json.loads((folder / "book.json").read_text(encoding="utf-8"))
    book.update({
        "id": a.id, "form": a.form, "code": a.code, "title": a.title,
        "topic": a.topic, "year": a.year, "status": "draft", "storage": a.id,
    })
    book["source"]["que"] = f"source/{que.name}"
    book["source"]["ans"] = f"source/{ans.name}"
    (folder / "book.json").write_text(json.dumps(book, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    catalog_path = BOOKS / "catalog.json"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if a.id not in catalog["books"]:
        catalog["books"].append(a.id)
    catalog_path.write_text(json.dumps(catalog, indent=2) + "\n", encoding="utf-8")

    print(f"Created {folder}")
    print("Next (docs/01-workflow.md, stage 2):")
    print(f"  python tools/extract_pages.py {a.id} --scan")
    print(f"  python tools/extract_ans_refs.py {a.id}")


if __name__ == "__main__":
    main()
