// problems.js — the practice-problem engine.
//
// All problems are DATA, stored in assets/data/problems-*.js. Each file pushes objects onto
// window.PROBLEMS. This file knows how to draw every problem type, check answers, hand out
// graduated tips, run a full walkthrough, and remember (in this browser only) what was solved.
// To add a problem you only ever edit a data file. See assets/data/README.md for the schema.
//
// Embed in a page:   <div class="problems" data-topic="precedence"></div>
//   optional: data-levels="1,2"   data-ids="prec-01,prec-02"   data-title="..."
// The all-problems page uses Problems.mountBank(host).

(function () {
  "use strict";

  var ALL = (window.PROBLEMS = window.PROBLEMS || []);
  var STORE = "python_fundamentals:progress:v1";

  // ---------- small helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // Tiny markup for authored text: `code`, **bold**, _italic_ ; everything else is escaped.
  function md(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
      .replace(/\n/g, "<br>");
  }
  function html(tag, cls, markup) {
    var e = el(tag, cls);
    e.innerHTML = md(markup);
    return e;
  }

  // ---------- progress (best effort; works without storage) ----------
  var memoryOnly = {};
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return memoryOnly; }
  }
  function saveProgress(p) {
    memoryOnly = p;
    try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) { /* storage unavailable */ }
  }
  function markSolved(id, usedTips) {
    var p = loadProgress();
    var cur = p[id] || { tries: 0 };
    cur.solved = true;
    cur.tips = Math.min(cur.tips == null ? 99 : cur.tips, usedTips);
    p[id] = cur;
    saveProgress(p);
  }
  function markTry(id) {
    var p = loadProgress();
    var cur = p[id] || { tries: 0 };
    cur.tries = (cur.tries || 0) + 1;
    p[id] = cur;
    saveProgress(p);
  }
  function isSolved(id) {
    var p = loadProgress();
    return !!(p[id] && p[id].solved);
  }

  // ---------- code display ----------
  function codeBlock(code) {
    var pre = el("pre", "pb-code");
    var lines = code.replace(/\n$/, "").split("\n");
    lines.forEach(function (text, n) {
      var row = el("div", "pb-line");
      row.appendChild(el("span", "pb-num", String(n + 1)));
      row.appendChild(el("span", "pb-text", text === "" ? " " : text));
      pre.appendChild(row);
    });
    return pre;
  }

  function normOut(s) {
    return String(s).replace(/\r/g, "").split("\n").map(function (l) { return l.trim().replace(/\s+/g, " "); })
      .join("\n").replace(/^\n+|\n+$/g, "");
  }
  function sameText(a, b) {
    a = normOut(a); b = normOut(b);
    if (a === b) return true;
    if (/^(true|false|none)$/i.test(b)) return a.toLowerCase() === b.toLowerCase();
    return false;
  }

  // ---------- answer widgets, one per problem type ----------
  // Each returns { node, check() -> {ok, parts?}, reveal(), codeForWalk() }
  var TYPES = {};

  TYPES.predict = function (p) {
    var multi = String(p.answer).indexOf("\n") >= 0;
    var input = multi ? el("textarea", "pb-input") : el("input", "pb-input");
    if (multi) input.rows = Math.min(8, String(p.answer).split("\n").length + 1);
    else input.type = "text";
    input.placeholder = multi ? "Type each printed line on its own line" : "Type exactly what is printed";
    input.spellcheck = false;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Your answer");
    var wrap = el("div", "pb-answer");
    wrap.appendChild(input);
    return {
      node: wrap,
      focus: function () { input.focus(); },
      check: function () {
        var got = input.value;
        var accepted = [String(p.answer)].concat(p.accept || []);
        var ok = accepted.some(function (a) { return sameText(got, a); });
        return { ok: ok, empty: got.trim() === "" };
      },
      reveal: function () { input.value = p.answer; input.readOnly = true; },
      lock: function () { input.readOnly = true; }
    };
  };

  TYPES.choice = function (p) {
    var wrap = el("div", "pb-answer pb-options");
    var name = "ch-" + p.id;
    var inputs = [];
    p.options.forEach(function (opt, n) {
      var label = el("label", "pb-opt");
      var r = el("input");
      r.type = "radio"; r.name = name; r.value = String(n);
      inputs.push(r);
      label.appendChild(r);
      var span = el("span");
      span.innerHTML = md(opt);
      label.appendChild(span);
      wrap.appendChild(label);
    });
    return {
      node: wrap,
      check: function () {
        var sel = inputs.filter(function (r) { return r.checked; })[0];
        return { ok: !!sel && Number(sel.value) === p.answer, empty: !sel };
      },
      reveal: function () { inputs.forEach(function (r) { r.checked = Number(r.value) === p.answer; r.disabled = true; }); },
      lock: function () { inputs.forEach(function (r) { r.disabled = true; }); },
      mark: function (ok) {
        inputs.forEach(function (r) {
          var l = r.parentNode;
          l.classList.remove("good", "bad");
          if (Number(r.value) === p.answer && (ok || r.disabled)) l.classList.add("good");
          else if (r.checked && !ok) l.classList.add("bad");
        });
      }
    };
  };

  TYPES.multi = function (p) {
    var wrap = el("div", "pb-answer pb-options");
    var boxes = [];
    p.options.forEach(function (opt, n) {
      var label = el("label", "pb-opt");
      var c = el("input");
      c.type = "checkbox"; c.value = String(n);
      boxes.push(c);
      label.appendChild(c);
      var span = el("span");
      span.innerHTML = md(opt);
      label.appendChild(span);
      wrap.appendChild(label);
    });
    function chosen() { return boxes.filter(function (b) { return b.checked; }).map(function (b) { return Number(b.value); }); }
    return {
      node: wrap,
      check: function () {
        var got = chosen().sort().join(",");
        var want = p.answers.slice().sort().join(",");
        return { ok: got === want, empty: got === "" };
      },
      reveal: function () { boxes.forEach(function (b) { b.checked = p.answers.indexOf(Number(b.value)) >= 0; b.disabled = true; }); },
      lock: function () { boxes.forEach(function (b) { b.disabled = true; }); },
      mark: function (ok) {
        boxes.forEach(function (b) {
          var l = b.parentNode;
          l.classList.remove("good", "bad");
          var should = p.answers.indexOf(Number(b.value)) >= 0;
          if (b.checked && should) l.classList.add("good");
          else if (b.checked && !should) l.classList.add("bad");
        });
      }
    };
  };

  TYPES.yesno = function (p) {
    var table = el("table", "pb-yesno");
    var head = el("tr");
    ["Statement", "Yes", "No"].forEach(function (h) { head.appendChild(el("th", null, h)); });
    table.appendChild(head);
    var rows = [];
    p.statements.forEach(function (st, n) {
      var tr = el("tr");
      var td = el("td");
      td.appendChild(el("code", null, st.s));
      tr.appendChild(td);
      var yes = el("input"), no = el("input");
      yes.type = no.type = "radio";
      yes.name = no.name = "yn-" + p.id + "-" + n;
      yes.setAttribute("aria-label", "Yes: " + st.s);
      no.setAttribute("aria-label", "No: " + st.s);
      var ty = el("td"), tn = el("td");
      ty.appendChild(yes); tn.appendChild(no);
      tr.appendChild(ty); tr.appendChild(tn);
      table.appendChild(tr);
      rows.push({ tr: tr, yes: yes, no: no, st: st });
    });
    var wrap = el("div", "pb-answer");
    wrap.appendChild(table);
    return {
      node: wrap,
      check: function () {
        var allOk = true, empty = true;
        rows.forEach(function (r) {
          var picked = r.yes.checked ? true : r.no.checked ? false : null;
          if (picked !== null) empty = false;
          var ok = picked === r.st.answer;
          if (!ok) allOk = false;
          r.tr.classList.remove("good", "bad");
          if (picked !== null) r.tr.classList.add(ok ? "good" : "bad");
        });
        return { ok: allOk, empty: empty };
      },
      reveal: function () {
        rows.forEach(function (r) {
          (r.st.answer ? r.yes : r.no).checked = true;
          r.yes.disabled = r.no.disabled = true;
          r.tr.classList.remove("bad"); r.tr.classList.add("good");
        });
      },
      lock: function () { rows.forEach(function (r) { r.yes.disabled = r.no.disabled = true; }); }
    };
  };

  TYPES.fill = function (p) {
    var pre = el("pre", "pb-code pb-fill");
    var selects = {};
    var parts = p.template.split(/\[\[(\w+)\]\]/);
    var block = el("div", "pb-fill-body");
    parts.forEach(function (part, n) {
      if (n % 2 === 0) {
        block.appendChild(document.createTextNode(part));
      } else {
        var spec = p.blanks[part];
        var sel = el("select", "pb-select");
        sel.setAttribute("aria-label", "Blank " + part);
        var first = el("option", null, "Choose One...");
        first.value = "";
        sel.appendChild(first);
        spec.options.forEach(function (o) {
          var op = el("option", null, o);
          op.value = o;
          sel.appendChild(op);
        });
        selects[part] = sel;
        block.appendChild(sel);
      }
    });
    pre.appendChild(block);
    var wrap = el("div", "pb-answer");
    wrap.appendChild(pre);
    return {
      node: wrap,
      check: function () {
        var allOk = true, empty = true;
        Object.keys(selects).forEach(function (k) {
          var sel = selects[k];
          if (sel.value !== "") empty = false;
          var ok = sel.value === p.blanks[k].answer;
          if (!ok) allOk = false;
          sel.classList.remove("good", "bad");
          if (sel.value !== "") sel.classList.add(ok ? "good" : "bad");
        });
        return { ok: allOk, empty: empty };
      },
      reveal: function () {
        Object.keys(selects).forEach(function (k) {
          selects[k].value = p.blanks[k].answer;
          selects[k].disabled = true;
          selects[k].classList.remove("bad"); selects[k].classList.add("good");
        });
      },
      lock: function () { Object.keys(selects).forEach(function (k) { selects[k].disabled = true; }); }
    };
  };

  TYPES.code = function (p) {
    var wrap = el("div", "pb-answer pb-codeinput");
    var ta = el("textarea", "pc-editor");
    ta.value = p.starter || "";
    ta.spellcheck = false;
    ta.setAttribute("aria-label", "Your code");
    function size() { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight + 2, 460) + "px"; }
    ta.addEventListener("input", size);
    ta.addEventListener("keydown", function (ev) {
      if (ev.key === "Tab" && !ev.shiftKey) {
        ev.preventDefault();
        var s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
    });
    wrap.appendChild(ta);
    var results = el("div", "pb-tests");
    wrap.appendChild(results);
    setTimeout(size, 0);
    return {
      node: wrap,
      async: true,
      check: async function () {
        results.textContent = "";
        results.appendChild(el("p", "pb-note", window.PyRun._loaded ? "Running your tests…" : "Loading Python (about 10 MB, first time only)…"));
        var res;
        try {
          res = await window.PyRun.test(ta.value, p.tests);
          window.PyRun._loaded = true;
        } catch (e) {
          results.textContent = "";
          results.appendChild(el("p", "pb-error", e.message));
          return { ok: false, error: true };
        }
        results.textContent = "";
        if (res.setup_error) {
          results.appendChild(el("p", "pb-error", (res.line ? "Error on line " + res.line + ": " : "Error: ") + res.setup_error));
          return { ok: false };
        }
        var ul = el("ul", "pb-testlist");
        var allOk = true;
        res.results.forEach(function (r) {
          var li = el("li", r.ok ? "good" : "bad");
          var code = el("code", null, r.call);
          li.appendChild(code);
          li.appendChild(document.createTextNode(r.ok ? "  ✓ " + r.got : "  ✗ got " + r.got + ", wanted " + r.want));
          ul.appendChild(li);
          if (!r.ok) allOk = false;
        });
        results.appendChild(ul);
        return { ok: allOk };
      },
      reveal: function () { ta.value = p.solution; size(); },
      lock: function () { ta.readOnly = true; },
      codeForWalk: function () { return p.solution + "\n" + (p.walkCall || ""); }
    };
  };

  // ---------- one problem card ----------
  var LEVEL_NAMES = { 1: "Warm-up", 2: "Core", 3: "Exam trap" };
  var TYPE_NAMES = {
    predict: "Predict the output", choice: "Choose one", multi: "Choose all that apply",
    yesno: "Yes / No", fill: "Fill in the blanks", code: "Write the code"
  };

  function walkableCode(p) {
    if (p.nowalk) return null;
    if (p.walkCode) return p.walkCode;
    if (p.type === "code") return p.solution + "\n" + (p.walkCall || "");
    if (p.type === "fill") return null;
    return p.code || null;
  }

  function renderProblem(p, num) {
    var card = el("article", "pb");
    card.dataset.id = p.id;
    var tipsUsed = 0;

    var top = el("div", "pb-top");
    top.appendChild(el("span", "pb-num-label", num != null ? "Problem " + num : p.id));
    top.appendChild(el("span", "pb-pill level" + p.level, LEVEL_NAMES[p.level] || "Core"));
    top.appendChild(el("span", "pb-pill", TYPE_NAMES[p.type]));
    var solvedMark = el("span", "pb-solved", "✓ solved");
    solvedMark.hidden = !isSolved(p.id);
    top.appendChild(solvedMark);
    card.appendChild(top);

    if (p.title) card.appendChild(html("h4", "pb-title", p.title));
    card.appendChild(html("p", "pb-prompt", p.prompt));
    if (p.code && p.type !== "fill") card.appendChild(codeBlock(p.code));
    if (p.after) card.appendChild(html("p", "pb-prompt", p.after));

    var widget = TYPES[p.type](p);
    card.appendChild(widget.node);

    var bar = el("div", "pb-bar");
    var check = el("button", "pc-btn primary", "Check");
    check.type = "button";
    var tipBtn = el("button", "pc-btn", "💡 Tip");
    tipBtn.type = "button";
    var giveUp = el("button", "pc-btn", "Show the answer");
    giveUp.type = "button";
    giveUp.hidden = true;
    bar.appendChild(check);
    if (p.tips && p.tips.length) bar.appendChild(tipBtn);
    bar.appendChild(giveUp);
    card.appendChild(bar);

    var verdict = el("div", "pb-verdict");
    verdict.setAttribute("aria-live", "polite");
    card.appendChild(verdict);
    var tipList = el("ol", "pb-tips");
    tipList.hidden = true;
    card.appendChild(tipList);
    var after = el("div", "pb-after");
    card.appendChild(after);

    function updateTipBtn() {
      var n = p.tips.length;
      tipBtn.textContent = tipsUsed >= n ? "No more tips" : "💡 Tip " + (tipsUsed + 1) + " of " + n;
      tipBtn.disabled = tipsUsed >= n;
    }
    if (p.tips && p.tips.length) {
      updateTipBtn();
      tipBtn.addEventListener("click", function () {
        var li = el("li");
        li.innerHTML = md(p.tips[tipsUsed]);
        tipList.appendChild(li);
        tipList.hidden = false;
        tipsUsed++;
        updateTipBtn();
      });
    }

    var finished = false;
    function finish(solvedByYou) {
      if (finished) return;
      finished = true;
      if (widget.lock) widget.lock();
      check.disabled = true;
      giveUp.hidden = true;
      if (solvedByYou) {
        markSolved(p.id, tipsUsed);
        solvedMark.hidden = false;
      }
      after.textContent = "";
      var ex = el("div", "pb-explain");
      var label = el("span", "callout-label", solvedByYou ? "Why" : "The answer, and why");
      ex.appendChild(label);
      if (p.type === "predict" && !solvedByYou) {
        ex.appendChild(html("p", null, "The program prints: `" + String(p.answer).split("\n").join("` then `") + "`"));
      }
      ex.appendChild(html("p", null, p.explain || ""));
      if (p.statements) {
        var ul = el("ul");
        p.statements.forEach(function (st) {
          var li = el("li");
          li.innerHTML = "<code>" + esc(st.s) + "</code> is <strong>" + (st.answer ? "Yes" : "No") + "</strong>. " + md(st.why || "");
          ul.appendChild(li);
        });
        ex.appendChild(ul);
      }
      if (p.type === "choice" || p.type === "multi") {
        var oul = el("ul", "pb-why");
        p.options.forEach(function (o, n) {
          var right = p.type === "choice" ? n === p.answer : p.answers.indexOf(n) >= 0;
          var li = el("li", right ? "good" : "bad");
          li.innerHTML = (right ? "✓ " : "✗ ") + md(o) + (p.why && p.why[n] ? " — " + md(p.why[n]) : "");
          oul.appendChild(li);
        });
        ex.appendChild(oul);
      }
      after.appendChild(ex);

      var wcode = walkableCode(p);
      if (wcode) {
        var wbtn = el("button", "pc-btn", "▶ Full walkthrough, step by step");
        wbtn.type = "button";
        var host = el("div", "pb-walk");
        wbtn.addEventListener("click", async function () {
          wbtn.disabled = true;
          host.textContent = "";
          if (p.walk && window.Stepper) {
            window.Stepper.mount(host, { code: p.walkCode || p.code, steps: p.walk, show: p.show });
          } else {
            host.appendChild(el("p", "pb-note", "Tracing the code with the real interpreter…"));
            try {
              var res = await window.PyRun.trace(wcode, { argv: p.argv || null, stdin: p.stdin == null ? null : p.stdin });
              host.textContent = "";
              window.Stepper.mount(host, {
                code: wcode, steps: window.Stepper.fromTrace(res), live: true,
                memory: p.memory ? true : undefined, show: p.show,
                error: res.err ? (res.line ? "Error on line " + res.line + ": " : "Error: ") + res.err : null
              });
            } catch (e) {
              host.textContent = "";
              host.appendChild(el("p", "pb-error", e.message));
            }
          }
          wbtn.hidden = true;
        });
        after.appendChild(wbtn);
        after.appendChild(host);
      }

      // a runnable copy of the code, so the learner can change it and see what happens
      var runnable = p.runCode || (p.type === "fill" ? p.template.replace(/\[\[(\w+)\]\]/g, function (_, k) { return p.blanks[k].answer; }) : p.type === "code" ? null : p.code);
      if (window.PyRun && runnable) {
        var pre = el("pre", "try");
        pre.dataset.title = "Run it yourself, then change it and run it again";
        if (p.argv) pre.dataset.argv = p.argv.join(" ");
        if (p.stdin != null) pre.dataset.stdin = p.stdin;
        pre.appendChild(el("code", null, runnable));
        after.appendChild(pre);
        window.PyRun.upgrade(pre);
      }
    }

    check.addEventListener("click", async function () {
      check.disabled = true;
      var r = await widget.check();
      check.disabled = false;
      if (r.empty) {
        verdict.className = "pb-verdict warn";
        verdict.textContent = "Pick or type an answer first.";
        return;
      }
      markTry(p.id);
      if (r.error) { verdict.textContent = ""; return; }
      if (widget.mark) widget.mark(r.ok);
      if (r.ok) {
        verdict.className = "pb-verdict good";
        verdict.textContent = "Correct" + (tipsUsed ? " (with " + tipsUsed + " tip" + (tipsUsed > 1 ? "s" : "") + ")" : "") + ".";
        finish(true);
      } else {
        verdict.className = "pb-verdict bad";
        verdict.textContent = p.type === "code" ? "Not yet. Read the failing line above, fix it, and run the tests again."
          : "Not quite. Try again. Use a tip if you want one.";
        giveUp.hidden = false;
      }
    });
    if (p.type === "predict") {
      card.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && ev.target.tagName === "INPUT" && !check.disabled) check.click();
      });
    }
    giveUp.addEventListener("click", function () {
      widget.reveal();
      if (widget.mark) widget.mark(true);
      verdict.className = "pb-verdict";
      verdict.textContent = "";
      finish(false);
    });

    return card;
  }

  function renderList(host, list, limit) {
    host.textContent = "";
    var tally = el("p", "pb-tally");
    tally.setAttribute("aria-live", "polite");
    host.appendChild(tally);
    var cards = el("div", "pb-cards");
    host.appendChild(cards);
    var shown = 0;
    var step = limit || list.length;
    var more = el("button", "pc-btn", "");
    more.type = "button";
    function updateTally() {
      var d = list.filter(function (p) { return isSolved(p.id); }).length;
      tally.textContent = d + " of " + list.length + " solved in this browser";
    }
    function showMore() {
      list.slice(shown, shown + step).forEach(function (p, n) { cards.appendChild(renderProblem(p, shown + n + 1)); });
      shown = Math.min(list.length, shown + step);
      more.hidden = shown >= list.length;
      more.textContent = "Show " + Math.min(step, list.length - shown) + " more problems (" + (list.length - shown) + " left)";
    }
    more.addEventListener("click", showMore);
    host.appendChild(more);
    host.addEventListener("click", updateTally);
    showMore();
    updateTally();
  }

  function forTopic(topic, levels, ids) {
    var list = ALL.filter(function (p) { return !topic || p.topic === topic; });
    if (ids) list = ids.map(function (id) { return ALL.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (levels) list = list.filter(function (p) { return levels.indexOf(p.level) >= 0; });
    return list.slice().sort(function (a, b) { return a.level - b.level; });
  }

  // ---------- the all-problems page ----------
  function mountBank(host) {
    var topics = window.TOPICS || [];
    // Each filter is a set of ticked values; everything starts ticked. A #topic in the URL
    // (from a lesson's "more problems" link) starts with just that topic ticked.
    var hashTopic = (location.hash || "").replace("#", "");
    var OPTIONS = {
      topic: topics.map(function (t) { return [t.id, t.title]; }),
      level: [["1", "Warm-up"], ["2", "Core"], ["3", "Exam trap"]],
      type: Object.keys(TYPE_NAMES).map(function (k) { return [k, TYPE_NAMES[k]]; }),
      status: [["todo", "Not solved yet"], ["done", "Solved"]]
    };
    var NOUN = { topic: "topics", level: "levels", type: "types", status: "problems" };
    var state = { shown: 10 };
    Object.keys(OPTIONS).forEach(function (k) {
      state[k] = {};
      OPTIONS[k].forEach(function (o) { state[k][o[0]] = true; });
    });
    if (hashTopic && state.topic[hashTopic]) {
      Object.keys(state.topic).forEach(function (k) { state.topic[k] = k === hashTopic; });
    }
    var controls = el("div", "pb-controls");
    var listHost = el("div", "pb-list");
    var summary = el("p", "pb-tally");
    host.appendChild(summary);
    host.appendChild(controls);
    host.appendChild(listHost);

    // A dropdown of checkboxes, with an "All" box on top.
    function multi(labelText, key) {
      var wrap = el("div", "pb-filter");
      wrap.appendChild(el("span", null, labelText));
      var dd = el("details", "pb-multi");
      var sum = el("summary");
      dd.appendChild(sum);
      var panel = el("div", "pb-multi-panel");
      var allLabel = el("label", "pb-multi-all");
      var allBox = el("input"); allBox.type = "checkbox";
      allLabel.appendChild(allBox);
      allLabel.appendChild(document.createTextNode(" All"));
      panel.appendChild(allLabel);
      var boxes = OPTIONS[key].map(function (o) {
        var l = el("label");
        var c = el("input"); c.type = "checkbox"; c.value = o[0];
        l.appendChild(c);
        l.appendChild(document.createTextNode(" " + o[1]));
        panel.appendChild(l);
        c.addEventListener("change", function () { state[key][o[0]] = c.checked; sync(); state.shown = 10; draw(); });
        return c;
      });
      allBox.addEventListener("change", function () {
        OPTIONS[key].forEach(function (o) { state[key][o[0]] = allBox.checked; });
        sync(); state.shown = 10; draw();
      });
      function sync() {
        var on = OPTIONS[key].filter(function (o) { return state[key][o[0]]; });
        boxes.forEach(function (c) { c.checked = !!state[key][c.value]; });
        allBox.checked = on.length === OPTIONS[key].length;
        allBox.indeterminate = on.length > 0 && on.length < OPTIONS[key].length;
        sum.textContent = on.length === OPTIONS[key].length ? "All " + NOUN[key]
          : on.length === 0 ? "None"
          : on.length === 1 ? on[0][1]
          : on.length + " " + NOUN[key];
      }
      dd.appendChild(panel);
      wrap.appendChild(dd);
      sync();
      return wrap;
    }
    controls.appendChild(multi("Topic", "topic"));
    controls.appendChild(multi("Level", "level"));
    controls.appendChild(multi("Type", "type"));
    controls.appendChild(multi("Show", "status"));
    // close an open dropdown when clicking elsewhere
    document.addEventListener("click", function (ev) {
      controls.querySelectorAll("details.pb-multi[open]").forEach(function (d) { if (!d.contains(ev.target)) d.open = false; });
    });
    var random = el("button", "pc-btn primary", "🎲 Give me a random one");
    random.type = "button";
    controls.appendChild(random);
    var reset = el("button", "pc-btn", "Forget my progress");
    reset.type = "button";
    controls.appendChild(reset);

    function filtered() {
      return ALL.filter(function (p) {
        return state.topic[p.topic] && state.level[String(p.level)] && state.type[p.type] &&
          state.status[isSolved(p.id) ? "done" : "todo"];
      });
    }

    function draw(only) {
      listHost.textContent = "";
      var list = only ? [only] : filtered();
      var total = ALL.length;
      var solved = ALL.filter(function (p) { return isSolved(p.id); }).length;
      summary.textContent = solved + " of " + total + " problems solved · " + list.length + " match the filters";
      list.slice(0, only ? 1 : state.shown).forEach(function (p, n) { listHost.appendChild(renderProblem(p, n + 1)); });
      if (!only && list.length > state.shown) {
        var more = el("button", "pc-btn", "Show 10 more (" + (list.length - state.shown) + " left)");
        more.type = "button";
        more.addEventListener("click", function () { state.shown += 10; draw(); });
        listHost.appendChild(more);
      }
      if (!list.length) listHost.appendChild(el("p", "pb-note", "Nothing matches those filters."));
    }
    random.addEventListener("click", function () {
      var pool = filtered().filter(function (p) { return !isSolved(p.id); });
      if (!pool.length) pool = filtered();
      if (!pool.length) return;
      draw(pool[Math.floor(Math.random() * pool.length)]);
    });
    reset.addEventListener("click", function () {
      if (window.confirm("Forget which problems you have solved in this browser?")) { saveProgress({}); draw(); }
    });
    draw();
  }

  window.Problems = { render: renderList, mountBank: mountBank, forTopic: forTopic, isSolved: isSolved };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".problems[data-topic], .problems[data-ids]").forEach(function (host) {
      var levels = host.dataset.levels ? host.dataset.levels.split(",").map(Number) : null;
      var ids = host.dataset.ids ? host.dataset.ids.split(",") : null;
      renderList(host, forTopic(host.dataset.topic, levels, ids), host.dataset.limit ? Number(host.dataset.limit) : 0);
    });
    // <div class="walk-demo" data-problem="prec-01"></div> shows that problem's authored walkthrough
    document.querySelectorAll(".walk-demo[data-problem]").forEach(function (host) {
      var p = ALL.filter(function (q) { return q.id === host.dataset.problem; })[0];
      if (p && p.walk && window.Stepper) window.Stepper.mount(host, { code: p.walkCode || p.code, steps: p.walk, show: p.show, noScroll: true });
    });
    document.querySelectorAll(".bank").forEach(mountBank);
  });
})();
