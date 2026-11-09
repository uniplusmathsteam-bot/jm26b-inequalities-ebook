/**
 * "Which theorem?" flashcards, the last page of JM29 (D) (book.json "endPages").
 * Format: engine/deck/deck.js. Figures are in a 360 × 220 box; blue = equal parts
 * given, red arrows = parallel lines, red ? = what the question asks for.
 */

const TRI = { A: [180, 22, "n"], B: [40, 196, "sw"], C: [320, 196, "se"] };
const WARM = "#fff7ef";

export const DECK = {
  kicker: "S3 JM29 (D) · Flashcards",
  title: "Which theorem?",
  intro: "Read each scenario, then tap the theorem you would use. Blue marks equal parts you are given; red arrows mark parallel lines.",
  choices: [
    { id: "mid", label: "Mid-point theorem", tag: "[mid-pt. theorem]", color: "#e46c0a" },
    { id: "icp", label: "Intercept theorem", tag: "[intercept theorem]", color: "#7b4fd0" },
  ],
  cards: [
    {
      title: "Find *MN* from *BC*",
      text: "In △*ABC*, *M* and *N* are the mid-points of *AB* and *AC*. *BC* = 14 cm.",
      ask: "Which theorem finds *MN*?",
      answer: "mid",
      why: "Two mid-points on two sides of the triangle: **mid-point theorem**. *MN* = ½*BC* = 7 cm.",
      fig: {
        pts: { ...TRI, M: { mid: "AB", at: [-15, 0] }, N: { mid: "AC", at: [15, 0] } },
        tint: [["ABC", WARM]],
        lines: ["BC", "MN"],
        given: [["AM", 1], ["MB", 1], ["AN", 2], ["NC", 2]],
        dots: "MN",
        notes: [["BC", "14 cm", "note", 0, 13], ["MN", "?", "ask", 0, -11]],
      },
    },
    {
      title: "One mid-point and a parallel line",
      text: "In △*ABC*, *D* is the mid-point of *AB*. The line through *D* parallel to *BC* meets *AC* at *E*. *AE* = 5 cm.",
      ask: "Which theorem finds *EC*?",
      answer: "icp",
      why: "Only *D* is known to be a mid-point, and *DE* // *BC*: **intercept theorem**. *E* is the mid-point of *AC*, so *EC* = *AE* = 5 cm.",
      fig: {
        pts: { ...TRI, D: { mid: "AB", at: [-15, 0] }, E: { mid: "AC", at: [15, 0] } },
        tint: [["ABC", WARM]],
        lines: ["AC", "BC", "DE"],
        given: [["AD", 1], ["DB", 1]],
        par: [["DE"], ["BC"]],
        dots: "DE",
        notes: [["AE", "5 cm", "note", 24, -4], ["EC", "?", "ask", 16, 0]],
      },
    },
    {
      title: "Three parallel roads",
      text: "Three straight parallel roads *L*₁, *L*₂, *L*₃ cross a straight path at *A*, *B*, *C* with *AB* = *BC* = 80 m. Another straight path crosses them at *D*, *E*, *F*, and *DE* = 95 m.",
      ask: "Which theorem finds *EF*?",
      answer: "icp",
      why: "Equal parts *AB* = *BC* on one path, and *L*₁ // *L*₂ // *L*₃: **intercept theorem**. *EF* = *DE* = 95 m.",
      fig: {
        pts: {
          L1a: [20, 40], L1b: [330, 40], L2a: [20, 110], L2b: [330, 110], L3a: [20, 180], L3b: [330, 180],
          P1: [95, 20], P2: [50, 200], Q1: [222, 20], Q2: [294, 200],
          A: [90, 40, "nw"], B: [72.5, 110, "nw"], C: [55, 180, "nw"],
          D: [230, 40, "ne"], E: [258, 110, "ne"], F: [286, 180, "ne"],
        },
        lines: [["L1a", "L1b"], ["L2a", "L2b"], ["L3a", "L3b"], ["P1", "A"], ["C", "P2"], ["Q1", "D"], ["F", "Q2"], "DE", "EF"],
        given: [["AB", 1], ["BC", 1]],
        par: [[["L1a", "L1b"], 1, 0.55], [["L2a", "L2b"], 1, 0.55], [["L3a", "L3b"], 1, 0.55]],
        dots: "ABCDEF",
        notes: [
          ["L1b", "L₁", "par", 15, 0], ["L2b", "L₂", "par", 15, 0], ["L3b", "L₃", "par", 15, 0],
          ["AB", "80 m", "note", -27, 0], ["BC", "80 m", "note", -27, 0], ["DE", "95 m", "note", 30, 0], ["EF", "?", "ask", 18, 0],
        ],
      },
    },
    {
      title: "Perimeter of the inner triangle",
      text: "*D*, *E* and *F* are the mid-points of the three sides of △*ABC*. The perimeter of △*ABC* is 30 cm.",
      ask: "Which theorem finds the perimeter of △*DEF*?",
      answer: "mid",
      why: "Each side of △*DEF* joins two mid-points: **mid-point theorem**, three times. Each side is half a side of △*ABC*, so the perimeter is 15 cm.",
      fig: {
        pts: { ...TRI, D: { mid: "AB", at: [-15, 0] }, E: { mid: "BC", at: "s" }, F: { mid: "AC", at: [15, 0] } },
        tint: [["ABC", WARM], ["DEF", "#fff0b8"]],
        lines: ["DE", "EF", "FD"],
        given: [["AD", 1], ["DB", 1], ["BE", 2], ["EC", 2], ["AF", 3], ["FC", 3]],
        dots: "DEF",
        notes: [[[180, 136], "?", "ask"]],
      },
    },
    {
      title: "Diagonals of a parallelogram",
      text: "*ABCD* is a parallelogram and its diagonals meet at *O*. *M* is the mid-point of *BC*, and *AB* = 10 cm.",
      ask: "Which theorem finds *OM*?",
      answer: "mid",
      why: "The diagonals of a parallelogram bisect each other, so *O* is the mid-point of *AC*. △*ABC* now has two mid-points, *O* and *M*: **mid-point theorem**. *OM* = ½*AB* = 5 cm.",
      fig: {
        pts: { A: [60, 190, "sw"], B: [280, 190, "se"], C: [320, 40, "ne"], D: [100, 40, "nw"], O: { mid: "AC", at: [0, 15] }, M: { mid: "BC", at: "e" } },
        tint: [["ABCD", WARM]],
        lines: ["AB", "CD", "DA", "BD", "OM"],
        given: [["AO", 1], ["OC", 1], ["BM", 2], ["MC", 2]],
        dots: "OM",
        notes: [["AB", "10 cm", "note", 0, 13], ["OM", "?", "ask", 0, -11]],
      },
    },
    {
      title: "Trapezium",
      text: "In trapezium *ABCD*, *AD* // *BC*. *M* is the mid-point of *AB*. The line through *M* parallel to *BC* meets *CD* at *N*.",
      ask: "Which theorem shows that *N* is the mid-point of *CD*?",
      answer: "icp",
      why: "*AD* // *MN* // *BC* are three parallel lines, and *AM* = *MB* on one line across them: **intercept theorem**. So *DN* = *NC*.",
      fig: {
        pts: { A: [120, 30, "nw"], D: [250, 30, "ne"], B: [50, 190, "sw"], C: [320, 190, "se"], M: { mid: "AB", at: [-15, 0] }, N: { mid: "DC", at: [15, 0] } },
        tint: [["ADCB", WARM]],
        lines: ["AD", "BC", "DC", "MN"],
        given: [["AM", 1], ["MB", 1]],
        par: [["AD"], ["MN"], ["BC"]],
        dots: "MN",
        notes: [["DN", "?", "ask", 15, -2], ["NC", "?", "ask", 15, 0]],
      },
    },
    {
      title: "Which comes first?",
      text: "In △*ABC*, *M* is the mid-point of *AB*. *N* lies on *AC* with *MN* // *BC*, and *BC* = 12 cm.",
      ask: "To find *MN*, which theorem do you need **first**?",
      answer: "icp",
      why: "Only one mid-point is given, with *MN* // *BC*: the **intercept theorem** first, to show *N* is the mid-point of *AC*. Then the mid-point theorem gives *MN* = ½*BC* = 6 cm.",
      fig: {
        pts: { ...TRI, M: { mid: "AB", at: [-15, 0] }, N: { mid: "AC", at: [15, 0] } },
        tint: [["ABC", WARM]],
        lines: ["AC", "BC", "MN"],
        given: [["AM", 1], ["MB", 1]],
        par: [["MN"], ["BC"]],
        dots: "MN",
        notes: [["BC", "12 cm", "note", 0, 13], ["MN", "?", "ask", -34, -11]],
      },
    },
    {
      title: "Prove two lines parallel",
      text: "In △*PQR*, *X* and *Y* are the mid-points of *PQ* and *PR*.",
      ask: "Which theorem proves that *XY* // *QR*?",
      answer: "mid",
      why: "Two mid-points: the **mid-point theorem** gives *XY* // *QR* (and *XY* = ½*QR*). The intercept theorem needs a parallel line to start with.",
      fig: {
        pts: { P: [170, 22, "n"], Q: [36, 196, "sw"], R: [330, 196, "se"], X: { mid: "PQ", at: [-15, 0] }, Y: { mid: "PR", at: [15, 0] } },
        tint: [["PQR", WARM]],
        lines: ["QR", "XY"],
        given: [["PX", 1], ["XQ", 1], ["PY", 2], ["YR", 2]],
        dots: "XY",
        notes: [["XY", "?", "ask", 0, -11], ["QR", "?", "ask", 0, 12]],
      },
    },
    {
      title: "Ladder and rope",
      text: "The rungs of a ladder are parallel and equally spaced along each side rail. A straight rope runs from *D* on the top rung to *F* on the bottom rung and crosses the middle rung at *E*.",
      ask: "Which theorem shows that *DE* = *EF*?",
      answer: "icp",
      why: "The rungs are three parallel lines with equal parts *AB* = *BC* on the rail: **intercept theorem**. So the rope is cut equally too, *DE* = *EF*.",
      fig: {
        pts: {
          R1: [110, 14], R2: [110, 206], S1: [250, 14], S2: [250, 206],
          A: [110, 30, "w"], B: [110, 110, "w"], C: [110, 190, "w"], A2: [250, 30], B2: [250, 110], C2: [250, 190],
          D: [200, 30, "n"], F: [130, 190, "s"], E: { mid: "DF", at: [-13, -10] },
        },
        lines: [["R1", "A"], ["C", "R2"], ["S1", "S2"], ["A", "A2"], ["B", "B2"], ["C", "C2"], "DE", "EF"],
        given: [["AB", 1], ["BC", 1]],
        par: [[["A", "A2"], 1, 0.8], [["B", "B2"], 1, 0.8], [["C", "C2"], 1, 0.8]],
        dots: "ABCDEF",
        notes: [["DE", "?", "ask", 12, 0], ["EF", "?", "ask", -12, 0]],
      },
    },
    {
      title: "Mid-points of a quadrilateral",
      text: "*P*, *Q*, *R*, *S* are the mid-points of the sides *AB*, *BC*, *CD*, *DA* of quadrilateral *ABCD*. The diagonal *AC* is drawn.",
      ask: "Which theorem shows that *PQ* // *AC* // *SR*?",
      answer: "mid",
      why: "In △*ABC*, *P* and *Q* are mid-points, so *PQ* // *AC*. In △*ACD*, *S* and *R* are mid-points, so *SR* // *AC*. That is the **mid-point theorem**, twice.",
      fig: {
        pts: {
          A: [30, 100, "w"], B: [140, 20, "n"], C: [330, 80, "e"], D: [190, 205, "s"],
          P: { mid: "AB", at: "nw" }, Q: { mid: "BC", at: "ne" }, R: { mid: "CD", at: "se" }, S: { mid: "DA", at: "sw" },
        },
        tint: [["ABCD", WARM]],
        dashed: ["AC"],
        lines: ["PQ", "QR", "RS", "SP"],
        given: [["AP", 1], ["PB", 1], ["BQ", 2], ["QC", 2], ["CR", 3], ["RD", 3], ["DS", 4], ["SA", 4]],
        dots: "PQRS",
      },
    },
  ],
};
