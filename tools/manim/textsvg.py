"""Manim's Text without ManimPango's compiled library.

Windows Smart App Control can refuse to load ManimPango's unsigned cmanimpango.pyd,
and then `import manim` fails. Import this module before manim and call install():
it keeps the real ManimPango when that loads, and otherwise registers itself as
`manimpango` and draws Text glyphs straight from the font files with fontTools.

Each non-space character becomes one <path>, in text order, on Pango's pixel scale
(96 dpi) with the baseline at the font's ascent below START_Y, so SVGs that Pango
cached earlier in the text directory and SVGs drawn here come out the same size.
Spans of one line share a baseline. Kerning comes from the legacy 'kern' table only,
a family without an italic face is slanted, and MarkupText is not supported.
"""

import logging
import os
import re
import sys
from functools import lru_cache
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

__version__ = "0.0+fonttools"

FONT_DIRS = [
    Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts",
    Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "Windows" / "Fonts",
]
FALLBACK = ("Cambria Math", "Segoe UI Symbol", "Arial", "Times New Roman", "Segoe UI Emoji")
HEAVY = {"SEMIBOLD", "BOLD", "ULTRABOLD", "HEAVY", "ULTRAHEAVY"}
SLANT = 0.2
_registered = []
logging.getLogger("fontTools").setLevel(logging.ERROR)


def install():
    try:
        import manimpango  # noqa: F401
    except ImportError:
        sys.modules["manimpango"] = sys.modules[__name__]


class TextSetting:
    """Formatting for a slice of a Text, as ManimPango defines it."""

    def __init__(self, start, end, font, slant, weight, line_num=-1, color=None):
        self.start = start
        self.end = end
        self.font = font
        self.slant = slant
        self.weight = weight
        self.line_num = line_num
        self.color = color


class PangoUtils:
    @staticmethod
    def remove_last_M(file_name):
        with open(file_name, encoding="utf-8") as f:
            content = f.read()
        content = re.sub(r'Z M [^A-Za-z]*? "\/>', 'Z "/>', content)
        with open(file_name, "w", encoding="utf-8") as f:
            f.write(content)


class MarkupUtils:
    @staticmethod
    def _unsupported(*_args, **_kwargs):
        raise RuntimeError("MarkupText needs ManimPango's compiled library, which could not be loaded")

    validate = text2svg = _unsupported


def register_font(font_path):
    _registered.append(Path(font_path))
    _index.cache_clear()
    _choose.cache_clear()
    return True


def unregister_font(font_path):
    if Path(font_path) in _registered:
        _registered.remove(Path(font_path))
        _index.cache_clear()
        _choose.cache_clear()
    return True


def list_fonts():
    return sorted({faces[0][3] for faces in _index().values()})


def _faces_in(path):
    with open(path, "rb") as f:
        head = f.read(12)
    count = int.from_bytes(head[8:12], "big") if head[:4] == b"ttcf" else 1
    for number in range(count):
        font = TTFont(path, fontNumber=number, lazy=True)
        names = font["name"]
        os2 = font["OS/2"] if "OS/2" in font else None
        weight = os2.usWeightClass if os2 else 400
        italic = bool(os2 and os2.fsSelection & 1) or bool(font["head"].macStyle & 2)
        families = {names.getDebugName(1), names.getDebugName(16)} - {None}
        yield number, families, weight, italic
        font.close()


@lru_cache(maxsize=None)
def _index():
    """Lower-case family name -> [(path, face number, weight, family, italic)]."""
    files = [p for d in FONT_DIRS if d.is_dir() for p in d.iterdir() if p.suffix.lower() in (".ttf", ".otf", ".ttc")]
    index = {}
    for path in files + _registered:
        try:
            for number, families, weight, italic in _faces_in(path):
                for family in families:
                    index.setdefault(family.lower(), []).append((str(path), number, weight, family, italic))
        except Exception:
            continue
    return index


@lru_cache(maxsize=None)
def _choose(family, bold, italic):
    """The face of `family` nearest the asked weight and slant, and whether it must be slanted."""
    faces = _index().get((family or "").lower())
    if not faces:
        return None
    target = 700 if bold else 400
    path, number, _, _, has_italic = min(faces, key=lambda f: (f[4] != italic, abs(f[2] - target)))
    return _face(path, number), italic and not has_italic


class _Face:
    def __init__(self, path, number):
        self.font = TTFont(path, fontNumber=number, lazy=True)
        self.cmap = self.font.getBestCmap() or {}
        self.glyphs = self.font.getGlyphSet()
        self.hmtx = self.font["hmtx"]
        self.upm = self.font["head"].unitsPerEm
        os2 = self.font["OS/2"] if "OS/2" in self.font else None
        if os2 and os2.fsSelection & (1 << 7):
            self.ascent = os2.sTypoAscender
        else:
            self.ascent = self.font["hhea"].ascent
        self.kern = {}
        if "kern" in self.font:
            for table in self.font["kern"].kernTables:
                if getattr(table, "format", None) == 0:
                    self.kern.update(table.kernTable)


@lru_cache(maxsize=None)
def _face(path, number):
    return _Face(path, number)


def _chain(family, bold, italic):
    chain = [c for c in [_choose(family, bold, italic)] + [_choose(f, bold, italic) for f in FALLBACK] if c]
    if not chain:
        raise RuntimeError(f"No font found for {family!r} or any fallback")
    return chain


def _glyph(chain, ch):
    for face, slanted in chain:
        name = face.cmap.get(ord(ch))
        if name:
            return face, slanted, name
    face, slanted = chain[0]
    return face, slanted, ".notdef"


def text2svg(settings, size, line_spacing, disable_liga, file_name, START_X, START_Y, width, height, orig_text, pango_width=None):
    """Write the text as an SVG with one filled path per visible glyph, like ManimPango's text2svg."""
    px = size * 96 / 72
    placed = []
    ascent = {}
    offset_x = 0.0
    last_line = 0
    for setting in settings:
        if setting.line_num != last_line:
            offset_x = 0.0
            last_line = setting.line_num
        chain = _chain(setting.font, setting.weight in HEAVY, setting.slant in ("ITALIC", "OBLIQUE"))
        first = chain[0][0]
        ascent[setting.line_num] = max(ascent.get(setting.line_num, 0.0), first.ascent * px / first.upm)
        color = setting.color or "#000000"
        prev = None
        for ch in orig_text[setting.start:setting.end].replace("\n", " "):
            face, slanted, name = _glyph(chain, ch)
            k = px / face.upm
            if prev and prev[0] is face:
                offset_x += face.kern.get((prev[1], name), 0) * k
            placed.append((setting.line_num, START_X + offset_x, face, slanted, name, color, k))
            offset_x += face.hmtx[name][0] * k
            prev = (face, name)
    paths = []
    for line, x, face, slanted, name, color, k in placed:
        base = START_Y + line_spacing * line + ascent[line]
        pen = SVGPathPen(face.glyphs)
        face.glyphs[name].draw(TransformPen(pen, (k, 0, k * SLANT if slanted else 0, -k, x, base)))
        d = pen.getCommands()
        if d:
            paths.append(f'<path d="{d}" fill="{color}"/>')
    svg = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">\n'
        + "\n".join(paths)
        + "\n</svg>\n"
    )
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(svg)
    return file_name
