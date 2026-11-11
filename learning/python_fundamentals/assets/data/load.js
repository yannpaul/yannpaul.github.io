// The one list of data files. Every page loads this instead of naming data files itself,
// so adding a problems file means adding ONE line here (tools/check.mjs fails if the list and
// the folder disagree). Files load in order, before the scripts that come after this tag.
(function () {
  var files = [
    "_register.js",
    "topics.js",
    "problems-precedence.js",
    "problems-logic.js",
    "problems-identity.js",
    "problems-numbers.js",
    "problems-imports.js",
    "problems-datetime.js",
    "problems-functions.js",
    "problems-unittest.js",
    "problems-files.js",
    "problems-errors.js"
  ];
  var base = document.currentScript.src.replace(/load\.js(\?.*)?$/, "");
  files.forEach(function (f) { document.write('<script src="' + base + f + '"><\/script>'); });
})();
