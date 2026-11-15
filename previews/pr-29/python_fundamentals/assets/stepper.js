// stepper.js — a Python Tutor–style step-through viewer.
//
// Two sources feed it:
//   * Authored walkthroughs (written by hand in the problem data, with a plain-English
//     note on every step, so they work offline and can explain *why*):
//       steps: [{ line: 2, note: "...", vars: { a: "10", b: "5@1" } }, ...]
//     vars values are the text Python's repr() would show. A trailing "@tag" marks which
//     OBJECT the name points at; two names with the same tag point at the same object.
//     That is how the "is" lessons draw shared objects without needing real memory ids.
//     Optional per step: out (text printed so far), frames (extra function frames, see
//     Stepper.fromTrace for the shape), ret ("return value" text), line: null for "done".
//   * Live traces from pyrun.js (PyRun.trace), converted by Stepper.fromTrace.
//
// Stepper.mount(host, { code, steps, live, memory, show, error, truncated, title })
//   show: optional list of variable names to display. Everything else (and imported modules)
//   stays hidden until the learner ticks "show all variables".

(function () {
  "use strict";

  var TAG_COLORS = ["#c2410c", "#0f766e", "#7c3aed", "#b45309", "#be185d", "#1d4ed8", "#4d7c0f", "#9f1239"];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // Authored text: `code`, **bold**, _italic_; everything else is escaped. Code spans are cut
  // out FIRST, so Python inside backticks (like `2 ** 3` or `__name__`) is never read as markup.
  function md(s) {
    return String(s).split(/(`[^`\n]+`)/).map(function (part, i) {
      if (i % 2 === 1) return "<code>" + esc(part.slice(1, -1)) + "</code>";
      return esc(part)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
        .replace(/\n/g, "<br>");
    }).join("");
  }

  function parseVal(raw) {
    raw = String(raw);
    var m = raw.match(/^([\s\S]*)@(\w+)$/);
    return m ? { text: m[1], tag: m[2] } : { text: raw, tag: null };
  }

  // Convert PyRun.trace output into the same step shape the authored walkthroughs use.
  function fromTrace(res) {
    var ids = {};
    var next = 1;
    function tagFor(id) {
      if (!(id in ids)) ids[id] = String(next++);
      return ids[id];
    }
    return res.steps.map(function (s) {
      var frames = s.stack.map(function (f) {
        return {
          name: f.name,
          vars: f.vars.map(function (v) {
            return { name: v[0], text: v[1], type: v[2], tag: tagFor(v[3]) };
          })
        };
      });
      return {
        line: s.event === "done" ? null : s.line,
        frames: frames,
        out: s.out,
        ret: s.ret != null ? s.ret : null,
        event: s.event
      };
    });
  }

  // Normalise an authored step into frames.
  function normalise(step) {
    if (step.frames) return step;
    var vars = [];
    Object.keys(step.vars || {}).forEach(function (name) {
      var p = parseVal(step.vars[name]);
      vars.push({ name: name, text: p.text, tag: p.tag, type: null });
    });
    var frames = [{ name: "Global", vars: vars }];
    (step.locals || []).forEach(function (loc) {
      var lv = [];
      Object.keys(loc.vars || {}).forEach(function (name) {
        var p = parseVal(loc.vars[name]);
        lv.push({ name: name, text: p.text, tag: p.tag, type: null });
      });
      frames.push({ name: loc.name, vars: lv });
    });
    return { line: step.line == null ? null : step.line, note: step.note, frames: frames, out: step.out || "", ret: step.ret || null, event: step.done ? "done" : "line" };
  }

  function mount(host, opts) {
    host.textContent = "";
    var steps = opts.steps.map(function (s) {
      var n = s.frames ? s : normalise(s);
      if (s.note && !n.note) n.note = s.note;
      return n;
    });
    var codeLines = opts.code.replace(/\n$/, "").split("\n");
    var i = 0;
    var measuring = false;
    // Authored walkthroughs that tag objects open with the memory panel showing; live traces
    // tag every value, so there it stays closed unless asked for.
    var hasTags = steps.some(function (s) {
      return s.frames.some(function (f) { return f.vars.some(function (v) { return v.tag; }); });
    });
    var showMemory = opts.memory != null ? !!opts.memory : (!opts.live && hasTags);

    var root = el("div", "st");
    if (opts.title) root.appendChild(el("div", "st-title", opts.title));

    var body = el("div", "st-body");
    var codeBox = el("div", "st-code");
    var lineEls = codeLines.map(function (text, n) {
      var row = el("div", "st-line");
      row.appendChild(el("span", "st-gutter", ""));
      row.appendChild(el("span", "st-num", String(n + 1)));
      var t = el("span", "st-text");
      t.textContent = text === "" ? " " : text;
      row.appendChild(t);
      codeBox.appendChild(row);
      return row;
    });
    body.appendChild(codeBox);

    var side = el("div", "st-side");
    var frameHost = el("div", "st-frames");
    var objHost = el("div", "st-objs");
    side.appendChild(frameHost);
    side.appendChild(objHost);
    body.appendChild(side);
    root.appendChild(body);

    var note = el("div", "st-note");
    note.setAttribute("aria-live", "polite");

    var outBox = el("div", "st-out");
    var outLabel = el("div", "st-label", "What print() has shown so far");
    var outPre = el("pre", "st-outpre");
    outBox.appendChild(outLabel);
    outBox.appendChild(outPre);

    var ctrl = el("div", "st-ctrl");
    var first = el("button", "pc-btn", "⏮"); first.type = "button"; first.title = "First step";
    var back = el("button", "pc-btn", "◀ Back"); back.type = "button";
    var fwd = el("button", "pc-btn primary", "Next ▶"); fwd.type = "button";
    var last = el("button", "pc-btn", "⏭"); last.type = "button"; last.title = "Last step";
    var counter = el("span", "st-count", "");
    var memLabel = el("label", "st-mem");
    var memBox = el("input"); memBox.type = "checkbox"; memBox.checked = showMemory;
    memLabel.appendChild(memBox);
    memLabel.appendChild(document.createTextNode(" show objects in memory"));
    var show = opts.show && opts.show.length ? opts.show : null;
    function hiddenVar(v) { return v.type === "module" || (show && show.indexOf(v.name) < 0); }
    var anyHidden = steps.some(function (s) { return s.frames.some(function (f) { return f.vars.some(hiddenVar); }); });
    var allLabel = el("label", "st-mem");
    var allBox = el("input"); allBox.type = "checkbox"; allBox.checked = false;
    allLabel.appendChild(allBox);
    allLabel.appendChild(document.createTextNode(" show all variables"));
    allLabel.hidden = !anyHidden;
    var expand = el("button", "pc-btn st-expand", "⤢ Expand"); expand.type = "button";
    expand.title = "Show the walkthrough over the whole page (Esc to close)";
    [first, back, fwd, last, counter, expand, memLabel, allLabel].forEach(function (n) { ctrl.appendChild(n); });
    // Controls sit directly under the code, ABOVE the note and the output, which change
    // height from step to step; that way Next never moves under the learner's finger.
    root.appendChild(ctrl);
    root.appendChild(note);
    root.appendChild(outBox);

    var legend = el("p", "st-legend",
      "Green arrow: the line that just ran. Red arrow: the line about to run. Orange values just changed.");
    root.appendChild(legend);
    if (opts.live) {
      root.appendChild(el("p", "st-legend", "This is a live trace of your code, made by the interpreter."));
    }
    if (opts.truncated) {
      root.appendChild(el("p", "st-legend", "The trace stopped after " + steps.length + " steps to keep the page fast."));
    }

    function varsOf(step) {
      var map = {};
      step.frames.forEach(function (f, fi) {
        f.vars.forEach(function (v) { map[fi + ":" + f.name + ":" + v.name] = v.text + "|" + (v.tag || ""); });
      });
      return map;
    }

    function render() {
      var step = steps[i];
      var prev = i > 0 ? steps[i - 1] : null;
      var prevMap = prev ? varsOf(prev) : {};
      var nowMap = varsOf(step);

      lineEls.forEach(function (row) { row.classList.remove("next", "ran"); row.querySelector(".st-gutter").textContent = ""; });
      var prevLine = prev && prev.line != null ? prev.line : null;
      if (i > 0 && step.event === "done") prevLine = prev ? prev.line : null;
      if (prevLine != null && lineEls[prevLine - 1]) {
        lineEls[prevLine - 1].classList.add("ran");
        lineEls[prevLine - 1].querySelector(".st-gutter").textContent = "➜";
      }
      if (step.line != null && lineEls[step.line - 1]) {
        var row = lineEls[step.line - 1];
        row.classList.add("next");
        row.querySelector(".st-gutter").textContent = "➜";
        if (prevLine === step.line) row.classList.remove("ran");
        if (row.scrollIntoView && !opts.noScroll && !measuring) row.scrollIntoView({ block: "nearest" });
      }

      // frames
      frameHost.textContent = "";
      var tagOrder = [];
      var objects = {};
      step.frames.forEach(function (f, fi) {
        var box = el("div", "st-frame");
        box.appendChild(el("div", "st-frame-name", f.name === "Global" ? "Global frame" : "Frame: " + f.name));
        var visible = f.vars.filter(function (v) { return allBox.checked || !hiddenVar(v); });
        if (!visible.length) {
          box.appendChild(el("div", "st-empty", "(nothing yet)"));
        } else {
          var tbl = el("table", "st-vars");
          visible.forEach(function (v) {
            var tr = el("tr");
            tr.appendChild(el("td", "st-name", v.name));
            var td = el("td", "st-val");
            td.appendChild(el("span", "st-valtext", v.text));
            if (v.tag) {
              if (tagOrder.indexOf(v.tag) < 0) tagOrder.push(v.tag);
              if (!objects[v.tag]) objects[v.tag] = { text: v.text, type: v.type, names: [] };
              objects[v.tag].names.push(v.name);
              if (memBox.checked) {
                var chip = el("span", "st-chip", "#" + (tagOrder.indexOf(v.tag) + 1));
                chip.style.background = TAG_COLORS[tagOrder.indexOf(v.tag) % TAG_COLORS.length];
                td.appendChild(chip);
              }
            }
            var key = fi + ":" + f.name + ":" + v.name;
            if (prev && prevMap[key] !== nowMap[key]) tr.classList.add("changed");
            tr.appendChild(td);
            tbl.appendChild(tr);
          });
          box.appendChild(tbl);
        }
        frameHost.appendChild(box);
      });
      if (step.ret) {
        var ret = el("div", "st-ret");
        ret.appendChild(el("strong", null, "Return value: "));
        ret.appendChild(document.createTextNode(step.ret));
        frameHost.appendChild(ret);
      }

      // objects in memory
      objHost.textContent = "";
      if (memBox.checked && tagOrder.length) {
        objHost.appendChild(el("div", "st-label", "Objects in memory"));
        var wrap = el("div", "st-objwrap");
        tagOrder.forEach(function (tag, n) {
          var o = objects[tag];
          var ob = el("div", "st-obj");
          ob.style.borderColor = TAG_COLORS[n % TAG_COLORS.length];
          var h = el("div", "st-objhead", "#" + (n + 1) + (o.type ? "  " + o.type : ""));
          h.style.background = TAG_COLORS[n % TAG_COLORS.length];
          ob.appendChild(h);
          ob.appendChild(el("div", "st-objval", o.text));
          var who = o.names.length > 1 ? "shared by " + o.names.join(", ") : "held by " + o.names[0];
          var w = el("div", "st-objwho", who);
          if (o.names.length > 1) w.classList.add("shared");
          ob.appendChild(w);
          wrap.appendChild(ob);
        });
        objHost.appendChild(wrap);
      }

      // note
      note.textContent = "";
      if (step.note) {
        note.hidden = false;
        var body = el("div");
        body.innerHTML = md(step.note);
        note.appendChild(body);
      } else {
        note.hidden = true;
      }
      if (i === steps.length - 1 && opts.error) {
        note.hidden = false;
        var er = el("div", "st-error", opts.error);
        note.appendChild(er);
      }

      // output
      if (step.out) {
        outBox.hidden = false;
        outPre.textContent = step.out;
      } else {
        outBox.hidden = !steps.some(function (s) { return s.out; });
        outPre.textContent = "";
      }

      counter.textContent = "Step " + (i + 1) + " of " + steps.length;
      first.disabled = back.disabled = i === 0;
      fwd.disabled = last.disabled = i === steps.length - 1;
    }

    function go(n) {
      i = Math.max(0, Math.min(steps.length - 1, n));
      render();
    }
    first.addEventListener("click", function () { go(0); });
    back.addEventListener("click", function () { go(i - 1); });
    fwd.addEventListener("click", function () { go(i + 1); });
    last.addEventListener("click", function () { go(steps.length - 1); });
    // Give the variables panel the height of its tallest step, so the code/variables area
    // (and the controls under it) do not jump as variables appear.
    function lockHeight() {
      if (!root.isConnected) return;
      var keep = i, tallest = 0;
      measuring = true;
      side.style.minHeight = "";
      for (var k = 0; k < steps.length; k++) {
        i = k;
        render();
        tallest = Math.max(tallest, side.offsetHeight);
      }
      i = keep;
      measuring = false;
      side.style.minHeight = tallest ? tallest + "px" : "";
      render();
    }
    function relock() { lockHeight(); }
    memBox.addEventListener("change", relock);
    allBox.addEventListener("change", relock);

    // Expand: lay the walkthrough over the page, for long values or long code.
    var backdrop = null;
    function setExpanded(on) {
      root.classList.toggle("st-expanded", on);
      expand.textContent = on ? "✕ Close" : "⤢ Expand";
      if (on) {
        backdrop = el("div", "st-backdrop");
        backdrop.addEventListener("click", function () { setExpanded(false); });
        document.body.appendChild(backdrop);
        document.body.classList.add("st-noscroll");
        root.focus();
      } else {
        if (backdrop) backdrop.remove();
        backdrop = null;
        document.body.classList.remove("st-noscroll");
      }
      lockHeight();
    }
    expand.addEventListener("click", function () { setExpanded(!root.classList.contains("st-expanded")); });
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(lockHeight, 150);
    });
    root.tabIndex = 0;
    root.addEventListener("keydown", function (ev) {
      if (ev.target && ev.target.tagName === "INPUT") return;
      if (ev.key === "ArrowRight") { go(i + 1); ev.preventDefault(); }
      if (ev.key === "ArrowLeft") { go(i - 1); ev.preventDefault(); }
      if (ev.key === "Escape" && root.classList.contains("st-expanded")) { setExpanded(false); ev.preventDefault(); }
    });

    host.appendChild(root);
    render();
    lockHeight();
    return { go: go };
  }

  window.Stepper = { md: md, mount: mount, fromTrace: fromTrace };
})();
