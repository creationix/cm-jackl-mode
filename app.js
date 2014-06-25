/*global CodeMirror*/
"use strict";

var jkl = '-- Inverted question mark!\n(macro (¿ no yes cond)\n  [[:? cond yes no]]\n)\n\n-- Sample output for 3x3 maze\n-- ██████████████\n-- ██      ██  ██\n-- ██  ██████  ██\n-- ██          ██\n-- ██  ██  ██████\n-- ██  ██      ██\n-- ██████████████\n\n(def width 30)\n(def height 30)\n(def size (* width height))\n\n-- Cells point to parent\n(def cells (map (i size) [i null]))\n\n-- Walls flag right and bottom\n(def walls (map (i size) [true true]))\n\n-- Define the sequence of index and right/left\n(def ww (- width 1))\n(def hh (- height 1))\n(def sequence (shuffle (concat\n  (map (i size)\n    (if (< (% i width) ww) [true i])\n  )\n  (map (i size)\n    (if (< (/ i width) hh) [false i])\n  )\n)))\n\n-- Find the root of a set cell -> cell\n(def (find-root cell)\n  (? (. cell 1) (find-root (. cell 1)) cell)\n)\n\n(for (item sequence)\n  (def i (. item 1))\n  (def root (find-root (. cells i)))\n  (def other (find-root (. cells (+ i (? (. item 0) 1 width)))))\n  (if (!= (. root 0) (. other 0))\n    (. root 1 other)\n    (. (. walls i) (? (. item 0) 0 1) false)\n  )\n)\n\n\n(def w (* width 2))\n(def h (* height 2))\n(join "\\n" (map (y (+ h 1))\n  (join "" (map (x (+ w 1))\n    (¿ "  " "██" (or\n      -- Four outer edges are always true\n      (= x 0) (= y 0) (= x w) (= y h)\n      -- Inner cells are more complicated\n      (? (% y 2)\n        (? (% x 2)\n           -- cell middle\n          false\n          -- cell right\n          (. (. walls (+ (/ (- x 1) 2) (* (/ y 2) width))) 0)\n        )\n        (? (% x 2)\n          -- cell bottom\n          (. (. walls (+ (/ x 2) (* (/ (- y 1) 2) width))) 1)\n          -- cell corner\n          true\n        )\n      )\n    ))\n  ))\n))\n';

var js =
  'function findSequence(goal) {\n' +
  '  function find(start, history) {\n' +
  '    if (start == goal)\n' +
  '      return history;\n' +
  '    else if (start > goal)\n' +
  '      return null;\n' +
  '    else\n' +
  '      return find(start + 5, "(" + history + " + 5)") ||\n' +
  '             find(start * 3, "(" + history + " * 3)");\n' +
  '  }\n' +
  '  return find(1, "1");\n' +
  '}\n' +
  "// A comment\n" +
  "[true, false, null, 0, 1, undefined]\n" +
  '\n' +
  "function add(a, b) {\n" +
  "  return a + b;\n" +
  "}\n" +
  "/ab[cd]*/\n" +
  '\n' +
  "\"A string\";\n" +
  "console.log(add(1,2))\n";

var css =
  '/* theme based on set of InkJoy colored pens and a little notbook */\n' +
  '/* Created by Tim Caswell <tim@creationix.com> */\n' +
  '\n' +
  '/* #403238 black */\n' +
  '.cm-s-notebook-dark.CodeMirror {\n' +
  '  background-color:#1f1d1b; /* line */\n' +
  '  color:#fefcee;            /* paper */\n' +
  '  font-family: Ubuntu Mono, Consolas, Monaco, monospace;\n' +
  '}\n' +
  '.cm-s-notebook-dark .CodeMirror-gutters {background: #312f2b;border-right:none;}\n' +
  '.cm-s-notebook-dark .CodeMirror-linenumber {color: #8a8479;}\n' +
  '\n' +
  '\n' +
  'div.cm-s-notebook-dark span.CodeMirror-matchingbracket {\n' +
  '  color: #c80b12;\n' +
  '  font-weight: bold;\n' +
  '}\n' +
  '.cm-s-notebook-dark .CodeMirror-ruler {\n' +
  '  border-color: #7B0004;\n' +
  '}\n' +
  '.cm-s-notebook-dark div.CodeMirror-cursor {\n' +
  '  border-color: #c80b12;\n' +
  '  border-width: 2px;\n' +
  '}\n';

function show(value, mode, theme, id) {
  var cm = new CodeMirror(document.body, {
    value: value,
    mode: mode,
    keyMap: "sublime",
    theme: theme,
    lineNumbers: true,
    rulers: [{ column: 80 }],
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    styleActiveLine: true,
  });
  cm.display.wrapper.setAttribute("id", id);
}

show(jkl, "jackl", "notebook", "light");
show(jkl, "jackl", "notebook-dark", "dark");
