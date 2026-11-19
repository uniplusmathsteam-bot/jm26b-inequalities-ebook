"""Solution guides for JM30 JM31 Intensive.

Only the questions whose picture is a tree or an outcome table, drawn by the
same guide as JM30 (B). A part colours the favourable outcomes and writes the
stacked fraction from the answer key. Nothing else is animated.
"""

from jm30b_guides import grow, scene, table_spec, tree_spec

# ---------------------------------------------------------------- trees

Q13 = scene("Q13", "tree", tree_spec(
    ["First child", "Second child", "Third child", "Possible Outcomes"],
    grow(["B", "G"], ["B", "G"], ["B", "G"]),
    [{"hit": ["BBG", "BGB", "GBB"], "frac": [("3", "8")]}], page=6))

Q14 = scene("Q14", "tree", tree_spec(
    ["1st question", "2nd question", "3rd question", "Possible Outcomes"],
    grow(["C", "W"], ["C", "W"], ["C", "W"]),
    [{"hit": ["CWW (-1)", "WCW (-1)", "WWC (-1)"], "frac": [("3", "8")]}],
    page=7,
    outs=["CCC (3)", "CCW (1)", "CWC (1)", "CWW (-1)", "WCC (1)", "WCW (-1)", "WWC (-1)", "WWW (-3)"]))

Q15 = scene("Q15", "tree", tree_spec(
    ["1st note", "2nd note", "Possible Outcomes"],
    [
        ["$10", ["$20", "$50", "$100"]],
        ["$20", ["$10", "$50", "$100"]],
        ["$50", ["$10", "$20", "$100"]],
        ["$100", ["$10", "$20", "$50"]],
    ],
    [{"hit": ["$70", "$110", "$120", "$150"], "frac": [("8", "12"), ("2", "3")]}],
    page=7,
    outs=["$30", "$60", "$110", "$30", "$70", "$120", "$60", "$70", "$150", "$110", "$120", "$150"]))

S6 = scene("S6", "tree", tree_spec(
    ["1st kitten", "2nd kitten", "3rd kitten", "Possible Outcomes"],
    grow(["M", "F"], ["M", "F"], ["M", "F"]),
    [
        {"tag": "(a)", "hit": ["FFF"], "frac": [("1", "8")]},
        {"tag": "(b)", "hit": ["MMF", "MFM", "FMM"], "frac": [("3", "8")]},
        {"tag": "(c)", "hit": ["MMF", "MFM", "MFF", "FMM", "FMF", "FFM", "FFF"], "frac": [("7", "8")]},
    ], page=20))

S7 = scene("S7", "tree", tree_spec(
    ["1st question", "2nd question", "3rd question", "Possible Outcomes"],
    grow(["true", "false"], ["true", "false"], ["A", "B", "C"]),
    [
        {"tag": "(a)", "hit": ["true, true, A", "true, true, B", "false, true, C", "false, false, A", "false, false, B"],
         "frac": [("5", "12")]},
        {"tag": "(b)", "hit": ["true, true, C", "true, false, A", "true, false, B", "false, false, C"],
         "frac": [("4", "12"), ("1", "3")]},
    ], page=21, sep=", "))

# ---------------------------------------------------------------- tables

Q11 = scene("Q11", "table", table_spec(
    [["", "H", "E", "N"],
     ["M", "MH", "ME", "MN"],
     ["E", "EH", "EE", "EN"],
     ["N", "NH", "NE", "NN"]],
    [{"hit": ["MH", "ME", "MN", "EH", "EN", "NH", "NE"], "frac": [("7", "9")]}], page=6))

Q12 = scene("Q12", "table", table_spec(
    [["", "A", "B", "C", "D"],
     ["A", "A, A", "A, B", "A, C", "A, D"],
     ["B", "B, A", "B, B", "B, C", "B, D"],
     ["C", "C, A", "C, B", "C, C", "C, D"],
     ["D", "D, A", "D, B", "D, C", "D, D"]],
    [{"hit": ["A, A", "A, B", "A, C", "A, D", "B, C", "C, C", "D, C"], "frac": [("7", "16")]}], page=6))

def _sums():
    head = ["", "1", "2", "3", "4", "5", "6"]
    return [head, *[[str(i), *[str(i + j) for j in range(1, 7)]] for i in range(1, 7)]]

Q16 = scene("Q16", "table", table_spec(
    _sums(),
    [{"hit": ["2", "3", "4", "5", "6", "7", "8"], "frac": [("26", "36"), ("13", "18")]}], page=7))

def _diffs():
    head = ["", "1", "2", "3", "4", "5", "6"]
    return [head, *[[str(i), *[str(abs(i - j)) for j in range(1, 7)]] for i in range(1, 7)]]

Q17 = scene("Q17", "table", table_spec(
    _diffs(),
    [{"hit": ["3", "4", "5"], "frac": [("12", "36"), ("1", "3")]}], page=8))

def _grid(labels, op):
    rows = [["", *[str(x) for x in labels]]]
    for i, a in enumerate(labels):
        rows.append([str(a), *["" if i == j else str(op(a, b)) for j, b in enumerate(labels)]])
    return rows

Q18 = scene("Q18", "table", table_spec(
    _grid([2, 6, 8, 11], lambda a, b: a * b),
    [{"hit": ["12", "16", "22"], "frac": [("6", "12"), ("1", "2")]}],
    page=8, strike=[(i, i) for i in range(4)]))

Q19 = scene("Q19", "table", table_spec(
    _grid([4, 4, 5, 5, 5, 8, 9], lambda a, b: a + b),
    [{"hit": ["13"], "frac": [("10", "42"), ("5", "21")]}],
    page=8, strike=[(i, i) for i in range(7)]))

S8 = scene("S8", "table", table_spec(
    [["", "$5", "$5", "$10"],
     ["$1", "$6", "$6", "$11"],
     ["$1", "$6", "$6", "$11"],
     ["$5", "$10", "$10", "$15"],
     ["$10", "$15", "$15", "$20"]],
    [
        {"tag": "(a)", "hit": ["$15"], "frac": [("3", "12"), ("1", "4")]},
        {"tag": "(b)", "hit": ["$6", "$10"], "frac": [("6", "12"), ("1", "2")]},
    ], page=21))

S9 = scene("S9", "table", table_spec(
    _grid([2, 4, 6, 9], lambda a, b: a * b),
    [{"hit": ["36", "54"], "frac": [("4", "12"), ("1", "3")]}],
    page=22, strike=[(i, i) for i in range(4)]))

S10 = scene("S10", "table", table_spec(
    [["", "G", "R", "Y"],
     ["R", "RG $18", "RR $22", "RY $14"],
     ["Y", "YG $16", "YR $20", "YY $12"],
     ["B", "BG $17", "BR $21", "BY $13"]],
    [
        {"tag": "(a)", "hit": ["RG $18", "RR $22", "YG $16", "YR $20", "BG $17", "BR $21"],
         "frac": [("6", "9"), ("2", "3")]},
        {"tag": "(b)", "hit": ["RG $18", "RY $14", "YG $16", "BG $17", "BY $13"],
         "strike": ["RR $22", "YY $12"], "frac": [("5", "7")]},
    ], page=22))
