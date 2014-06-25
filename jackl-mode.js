/*global define CodeMirror*/
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("jackl", function () {

  var rules = [
    "comment",  /^--(.*)/,
    "string",   /^(?:"(?:[^"\\]|\\.)*")/,
    "number",   /^(?:0|-?[1-9][0-9]*)/,
    "property", /^:[^\s()[\]{}",'`:;#|\\]+/,
    "id",       /^[^\s()[\]{}",'`:;#|\\]+/,
    null,       /^\s+/,
  ];

  var groups = {};
  [
    "atom: true false null",
    "builtin:def set . index lambda λ if unless ? and or not print list read write exec escape sleep macro concat flat join shuffle",
    "variable:for for* map map* i-map i-map* iter reduce while do",
    "operator:+ - * / % < <= > >= = !=",
  ].forEach(function (line) {
    var pair = line.split(":");
    pair[1].split(" ").forEach(function (id) {
      groups[id] = pair[0];
    });
  });

  return {
    startState: function () {
      return {};
    },

    token: function (stream, state) {
      for (var i = 0; i < rules.length; i += 2) {
        var match;
        if ((match = stream.match(rules[i + 1]))) {
          var type = rules[i];
          if (type === "id") {
            return groups[match[0]] || "variable-2";
          }
          return type;
        }
      }
      stream.next();
    },

    // indent: function (state) {
    //   return state.stack.length * 2;
    // },

    // lineComment: "--"
  };
});

CodeMirror.defineMIME("text/x-jackl", "jackl");

});
