/*global CodeMirror domChanger*/
"use strict";

var windowWidth = window.innerWidth;
window.addEventListener("resize", function () {
  windowWidth = window.innerWidth;
}, true);
var windowHeight = window.innerHeight;
window.addEventListener("resize", function () {
  windowHeight = window.innerHeight;
}, true);


var jkl = '-- Inverted question mark!\n(macro (¿ no yes cond)\n  [[:? cond yes no]]\n)\n\n-- Sample output for 3x3 maze\n-- ██████████████\n-- ██      ██  ██\n-- ██  ██████  ██\n-- ██          ██\n-- ██  ██  ██████\n-- ██  ██      ██\n-- ██████████████\n\n(def width 30)\n(def height 30)\n(def size (× width height))\n\n-- Cells point to parent\n(def cells (map (i size) [i null]))\n\n-- Walls flag right and bottom\n(def walls (map (i size) [true true]))\n\n-- Define the sequence of index and right/left\n(def ww (- width 1))\n(def hh (- height 1))\n(def sequence (shuffle (concat\n  (map (i size)\n    (if (< (% i width) ww) [true i])\n  )\n  (map (i size)\n    (if (< (÷ i width) hh) [false i])\n  )\n)))\n\n-- Find the root of a set cell -> cell\n(def (find-root cell)\n  (? (. cell 1) (find-root (. cell 1)) cell)\n)\n\n(for (item sequence)\n  (def i (. item 1))\n  (def root (find-root (. cells i)))\n  (def other (find-root (. cells (+ i (? (. item 0) 1 width)))))\n  (if (≠ (. root 0) (. other 0))\n    (. root 1 other)\n    (. (. walls i) (? (. item 0) 0 1) false)\n  )\n)\n\n(def w (× width 2))\n(def h (× height 2))\n(join "\\n" (map (y (+ h 1))\n  (join "" (map (x (+ w 1))\n    (¿ "  " "██" (or\n      -- Four outer edges are always true\n      (= x 0) (= y 0) (= x w) (= y h)\n      -- Inner cells are more complicated\n      (? (% y 2)\n        (? (% x 2)\n           -- cell middle\n          false\n          -- cell right\n          (. (. walls (+ (÷ (- x 1) 2) (× (÷ y 2) width))) 0)\n        )\n        (? (% x 2)\n          -- cell bottom\n          (. (. walls (+ (÷ x 2) (× (÷ (- y 1) 2) width))) 1)\n          -- cell corner\n          true\n        )\n      )\n    ))\n  ))\n))\n';

var windows = [
  { title: "bananas/samples/maze.jkl", code: jkl, mode: "jackl" }
];

var d = domChanger(Desktop, document.body);
d.update(windows);

function Desktop(emit, refresh) {
  var isDark = false;
  window.addEventListener("keydown", onKeyDown);

  return { render: render };

  function onKeyDown(evt) {
    if (evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.metaKey && evt.keyCode === 66) {
      evt.preventDefault();
      isDark = !isDark;
      refresh();
    }
  }

  function render(windows) {
    return windows.map(function (props) {
      return [AppWindow, isDark, props.title,
        [CodeMirrorEditor, isDark, props]
      ];
    });
  }
}

function AppWindow(emit, refresh) {
  var width = (windowWidth / 2) | 0;
  var height = (windowHeight / 2) | 0;
  var left = ((windowWidth - width) / 2) | 0;
  var top = ((windowHeight - height) / 2) | 0;
  var dragging = false;
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);

  return { render: render };

  function render(isDark, title, child) {
    var style = {
      width: width + "px",
      height: height + "px",
      left: left + "px",
      top: top + "px",
    };
    return ["dialog.window", { style: style, class: isDark ? "dark" : "light"},
      [".content", child],
      [".resize.n", drag(north)],
      [".resize.ne", drag(northEast)],
      [".resize.e", drag(east)],
      [".resize.se", drag(southEast)],
      [".resize.s", drag(south)],
      [".resize.sw", drag(southWest)],
      [".resize.w", drag(west)],
      [".resize.nw", drag(northWest)],
      [".title-bar", drag(titleBar), title],
      [".close-box", "✖"]
    ];
  }

  function onMouseMove(evt) {
    if (!dragging) return;
    evt.preventDefault();
    evt.stopPropagation();
    var x = evt.x;
    var y = evt.y;
    dragging.fn(x - dragging.x, y - dragging.y);
    dragging.x = x;
    dragging.y = y;
  }

  function onMouseUp(evt) {
    if (!dragging) return;
    evt.preventDefault();
    evt.stopPropagation();
    dragging = false;
  }

  function drag(fn) {
    return { onmousedown: onMouseDown };
    function onMouseDown(evt) {
      if (dragging) return;
      evt.preventDefault();
      evt.stopPropagation();
      dragging = {
        x: evt.x,
        y: evt.y,
        fn: fn
      };
    }
  }

  function north(dx, dy) {
    height -= dy;
    top += dy;
    refresh();
  }
  function northEast(dx, dy) {
    height -= dy;
    top += dy;
    width += dx;
    refresh();
  }
  function east(dx, dy) {
    width += dx;
    refresh();
  }
  function southEast(dx, dy) {
    height += dy;
    width += dx;
    refresh();
  }
  function south(dx, dy) {
    height += dy;
    refresh();
  }
  function southWest(dx, dy) {
    height += dy;
    width -= dx;
    left += dx;
    refresh();
  }
  function west(dx, dy) {
    width -= dx;
    left += dx;
    refresh();
  }
  function northWest(dx, dy) {
    height -= dy;
    top += dy;
    width -= dx;
    left += dx;
    refresh();
  }
  function titleBar(dx, dy) {
    top += dy;
    left += dx;
    refresh();
  }
}

function CodeMirrorEditor() {
  var code, mode, theme;
  var el;
  var cm = new CodeMirror(function (root) {
    el = root;
  }, {
    keyMap: "sublime",
    // lineNumbers: true,
    rulers: [{ column: 80 }],
    autoCloseBrackets: true,
    matchBrackets: true,
    showCursorWhenSelecting: true,
    styleActiveLine: true,
  });

  return { render: render };

  function render(isDark, props) {
    var newTheme = isDark ? "notebook-dark" : "notebook";
    if (newTheme !== theme) {
      theme = newTheme;
      cm.setOption("theme", theme);
    }
    if (props.mode !== mode) {
      mode = props.mode;
      cm.setOption("mode", mode);
    }
    if (props.code !== code) {
      code = props.code;
      cm.setValue(code);
    }
    setTimeout(function () {
      cm.refresh();
    }, 0);
    return el;
  }
}
