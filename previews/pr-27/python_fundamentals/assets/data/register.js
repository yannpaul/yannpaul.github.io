// Shared by every problems-*.js file. Defines window.PROBLEMS and window.addProblems().
//
// A walkthrough step may be written as a short array instead of an object:
//   [line, note, vars, out, locals]
//     line    the line being explained (1-based), or null for the final "done" step
//     note    plain-English explanation shown under the code
//     vars    the global variables at that moment, as the text repr() would show.
//             "5@1" means "the value 5, and it is object #1"; two names with the same
//             @tag point at the SAME object (that is how `is` is drawn).
//     out     everything print() has shown so far (optional)
//     locals  optional: [{ name: "calcSubtotal()", vars: { amount: "100" } }] for function frames
(function () {
  var w = window;
  w.PROBLEMS = w.PROBLEMS || [];
  w.addProblems = function (list) {
    list.forEach(function (p) {
      if (p.walk) {
        p.walk = p.walk.map(function (s) {
          if (!Array.isArray(s)) return s;
          var step = { line: s[0], note: s[1], vars: s[2] || {} };
          if (s[3] !== undefined) step.out = s[3];
          if (s[4]) step.locals = s[4];
          return step;
        });
      }
      w.PROBLEMS.push(p);
    });
  };
})();
