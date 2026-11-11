// pyrun.js — the in-browser Python interpreter for this course.
//
// What it does:
//   1. Lazily loads Pyodide (CPython compiled to WebAssembly) from the jsDelivr CDN the
//      first time anything needs to run. Pages that never press "Run" never download it.
//   2. Defines a small Python helper (HELPER, below) inside Pyodide. The helper can run a
//      program, run it with a line-by-line tracer (the data behind the step-through
//      viewer), and run test cases against a function the learner wrote.
//   3. Upgrades every <pre class="try"> block on the page into an editable code cell with
//      Run, Step through, Reset, and "Open in Python Tutor" buttons.
//
// Markup contract for a runnable cell:
//   <pre class="try" data-argv="a.py 5" data-stdin="5&#10;0" data-memory="on"><code>print(1 + 2)</code></pre>
//   data-argv   optional: what sys.argv should be (space separated; first item is the script name)
//   data-stdin  optional: shows an input box, prefilled; each line answers one input() call
//   data-memory optional: "on" starts the step viewer with the "Objects in memory" panel open
//
// To change the interpreter version, change PYODIDE_VERSION. Everything else in the course
// goes through window.PyRun, so nothing else needs to know how Python is loaded.

(function () {
  "use strict";

  var PYODIDE_VERSION = "0.26.4";
  var INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/";

  // ---------------------------------------------------------------------------------
  // The Python side. Plain CPython — no Pyodide-specific calls — so tools/check.mjs can
  // run the very same text under the system python3 to test it.
  // ---------------------------------------------------------------------------------
  var HELPER = [
    "import sys, io, json, types, contextlib, builtins",
    "",
    "_FN = '<exec>'",
    "_MAX_LINES = 300000     # runaway-loop guard for plain runs",
    "_MAX_STEPS = 400        # step-through viewer cap",
    "",
    "class _Stop(BaseException):",
    "    pass",
    "",
    "def _short(v, limit=70):",
    "    try:",
    "        r = repr(v)",
    "    except Exception:",
    "        r = '<unprintable>'",
    "    return r if len(r) <= limit else r[:limit - 1] + '\\u2026'",
    "",
    "def _describe(e):",
    "    line = getattr(e, 'lineno', None) if isinstance(e, SyntaxError) else None",
    "    tb = e.__traceback__",
    "    while tb is not None:",
    "        if tb.tb_frame.f_code.co_filename == _FN:",
    "            line = tb.tb_lineno",
    "        tb = tb.tb_next",
    "    msg = str(e)",
    "    if isinstance(e, SyntaxError):",
    "        msg = e.msg",
    "    name = type(e).__name__",
    "    text = name + (': ' + msg if msg else '')",
    "    return text, line",
    "",
    "def _make_input(stdin_text, out):",
    "    lines = stdin_text.split('\\n') if stdin_text else []",
    "    def fake_input(prompt=''):",
    "        out.write(str(prompt))",
    "        if not lines:",
    "            raise EOFError('input() was called but there is nothing left in the input box')",
    "        value = lines.pop(0)",
    "        out.write(value + '\\n')",
    "        return value",
    "    return fake_input",
    "",
    "def _setup(argv, stdin_text, out):",
    "    # The program runs as a real module named __main__, so unittest.main() can find its tests.",
    "    saved = (sys.argv, builtins.input, sys.modules.get('__main__'))",
    "    mod = types.ModuleType('__main__')",
    "    sys.modules['__main__'] = mod",
    "    sys.argv = argv if argv else ['main.py']",
    "    if stdin_text is not None:",
    "        builtins.input = _make_input(stdin_text, out)",
    "    return saved, mod.__dict__",
    "",
    "def _restore(saved):",
    "    sys.argv, builtins.input, main = saved",
    "    if main is not None:",
    "        sys.modules['__main__'] = main",
    "    sys.settrace(None)",
    "",
    "def _pc_run(code, argv=None, stdin_text=None):",
    "    out = io.StringIO()",
    "    err = line = None",
    "    count = [0]",
    "    def guard(frame, event, arg):",
    "        if frame.f_code.co_filename != _FN:",
    "            return None",
    "        def local(frame, event, arg):",
    "            if event == 'line':",
    "                count[0] += 1",
    "                if count[0] > _MAX_LINES:",
    "                    raise TimeoutError('This program ran for too long. Is there a loop that never ends?')",
    "            return local",
    "        return local",
    "    saved, ns = _setup(argv, stdin_text, out)",
    "    try:",
    "        compiled = compile(code, _FN, 'exec')",
    "        sys.settrace(guard)",
    "        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):",
    "            exec(compiled, ns)",
    "    except SystemExit:",
    "        pass",
    "    except BaseException as e:",
    "        err, line = _describe(e)",
    "    finally:",
    "        _restore(saved)",
    "    return json.dumps({'out': out.getvalue(), 'err': err, 'line': line})",
    "",
    "def _snap(frame):",
    "    src = frame.f_globals if frame.f_code.co_name == '<module>' else frame.f_locals",
    "    d = []",
    "    for k, v in list(src.items()):",
    "        if k.startswith('__') or isinstance(v, types.ModuleType):",
    "            continue",
    "        if isinstance(v, types.FunctionType):",
    "            d.append([k, 'function ' + v.__name__ + '()', 'function', id(v)])",
    "        else:",
    "            d.append([k, _short(v), type(v).__name__, id(v)])",
    "    return d",
    "",
    "def _pc_trace(code, argv=None, stdin_text=None):",
    "    out = io.StringIO()",
    "    steps = []",
    "    err = line = None",
    "    truncated = [False]",
    "    def record(frame, event, ret=None):",
    "        if len(steps) >= _MAX_STEPS:",
    "            truncated[0] = True",
    "            raise _Stop()",
    "        stack = []",
    "        f = frame",
    "        while f is not None:",
    "            if f.f_code.co_filename == _FN:",
    "                name = 'Global' if f.f_code.co_name == '<module>' else f.f_code.co_name + '()'",
    "                stack.append({'name': name, 'vars': _snap(f)})",
    "            f = f.f_back",
    "        stack.reverse()",
    "        step = {'line': frame.f_lineno, 'stack': stack, 'out': out.getvalue(), 'event': event}",
    "        if event == 'return' and frame.f_code.co_name != '<module>':",
    "            step['ret'] = _short(ret)",
    "        steps.append(step)",
    "    def tracer(frame, event, arg):",
    "        if frame.f_code.co_filename != _FN:",
    "            return None",
    "        if event == 'line':",
    "            record(frame, 'line')",
    "        elif event == 'return':",
    "            if frame.f_code.co_name == '<module>':",
    "                record(frame, 'done')",
    "            else:",
    "                record(frame, 'return', arg)",
    "        return tracer",
    "    saved, ns = _setup(argv, stdin_text, out)",
    "    try:",
    "        compiled = compile(code, _FN, 'exec')",
    "        sys.settrace(tracer)",
    "        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):",
    "            exec(compiled, ns)",
    "    except _Stop:",
    "        pass",
    "    except SystemExit:",
    "        pass",
    "    except BaseException as e:",
    "        err, line = _describe(e)",
    "    finally:",
    "        _restore(saved)",
    "    return json.dumps({'steps': steps, 'out': out.getvalue(), 'err': err, 'line': line, 'truncated': truncated[0]})",
    "",
    "def _same(got, expect):",
    "    if isinstance(expect, bool) or isinstance(got, bool):",
    "        return got is expect",
    "    if isinstance(expect, (int, float)) and isinstance(got, (int, float)):",
    "        return abs(got - expect) < 1e-9",
    "    return got == expect and type(got) == type(expect)",
    "",
    "def _pc_test(code, tests):",
    "    out = io.StringIO()",
    "    ns = {'__name__': 'learner'}",
    "    results = []",
    "    try:",
    "        compiled = compile(code, _FN, 'exec')",
    "        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):",
    "            exec(compiled, ns)",
    "    except BaseException as e:",
    "        text, line = _describe(e)",
    "        return json.dumps({'setup_error': text, 'line': line, 'results': []})",
    "    for t in tests:",
    "        call = t['call']",
    "        buf = io.StringIO()",
    "        try:",
    "            with contextlib.redirect_stdout(buf):",
    "                got = eval(call, ns)",
    "            if 'out' in t:",
    "                ok = buf.getvalue().strip() == t['out'].strip()",
    "                shown = buf.getvalue().strip()",
    "            else:",
    "                ok = _same(got, t['expect'])",
    "                shown = repr(got)",
    "            results.append({'call': call, 'ok': ok, 'got': shown, 'want': t['out'] if 'out' in t else repr(t['expect'])})",
    "        except BaseException as e:",
    "            text, _ = _describe(e)",
    "            results.append({'call': call, 'ok': False, 'got': text, 'want': t['out'] if 'out' in t else repr(t.get('expect'))})",
    "    return json.dumps({'setup_error': None, 'results': results})",
    ""
  ].join("\n");

  // ---------------------------------------------------------------------------------
  // Loading Pyodide
  // ---------------------------------------------------------------------------------
  var ready = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("script failed: " + src)); };
      document.head.appendChild(s);
    });
  }

  function load() {
    if (!ready) {
      ready = (async function () {
        if (typeof window.loadPyodide !== "function") await loadScript(INDEX_URL + "pyodide.js");
        var py = await window.loadPyodide({ indexURL: INDEX_URL });
        await py.runPythonAsync(HELPER);
        return py;
      })();
      ready.catch(function () { ready = null; }); // allow a retry after a failed load
    }
    return ready;
  }

  async function call(fn, args) {
    var py;
    try {
      py = await load();
    } catch (e) {
      var err = new Error("The Python interpreter could not be loaded. It needs an internet connection the first time. " +
        "You can paste the code into pythontutor.com instead.");
      err.loadFailure = true;
      throw err;
    }
    py.globals.set("__pc_args", JSON.stringify(args));
    var text = await py.runPythonAsync(fn + "(*json.loads(__pc_args))");
    return JSON.parse(text);
  }

  var PyRun = {
    HELPER: HELPER,
    version: PYODIDE_VERSION,
    load: load,
    run: function (code, opts) {
      opts = opts || {};
      return call("_pc_run", [code, opts.argv || null, opts.stdin == null ? null : opts.stdin]);
    },
    trace: function (code, opts) {
      opts = opts || {};
      return call("_pc_trace", [code, opts.argv || null, opts.stdin == null ? null : opts.stdin]);
    },
    test: function (code, tests) {
      return call("_pc_test", [code, tests]);
    },
    tutorUrl: function (code) {
      return "https://pythontutor.com/visualize.html#code=" + encodeURIComponent(code) +
        "&cumulative=false&heapPrimitives=nevernest&mode=display&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false";
    }
  };
  PyRun.upgrade = null; // set below, once buildCell exists
  window.PyRun = PyRun;

  // ---------------------------------------------------------------------------------
  // <pre class="try"> -> editable, runnable cell
  // ---------------------------------------------------------------------------------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function button(label, cls) {
    var b = el("button", "pc-btn" + (cls ? " " + cls : ""), label);
    b.type = "button";
    return b;
  }

  function autosize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight + 2, 520) + "px";
  }

  function formatOutput(res) {
    var text = res.out || "";
    if (res.err) {
      if (text && !/\n$/.test(text)) text += "\n";
      text += (res.line ? "Error on line " + res.line + ": " : "Error: ") + res.err;
    }
    return text;
  }

  function buildCell(pre) {
    var codeEl = pre.querySelector("code");
    var original = (codeEl ? codeEl.textContent : pre.textContent).replace(/^\n+|\s+$/g, "") + "\n";
    var argv = pre.dataset.argv ? pre.dataset.argv.split(/\s+/).filter(Boolean) : null;
    var hasStdin = pre.dataset.stdin != null;
    var memory = pre.dataset.memory === "on" ? true : undefined;

    var cell = el("div", "pc-cell");
    var head = el("div", "pc-head");
    head.appendChild(el("span", "pc-title", pre.dataset.title || "Try it. You can edit this code."));
    cell.appendChild(head);

    var ta = el("textarea", "pc-editor");
    ta.value = original;
    ta.spellcheck = false;
    ta.setAttribute("aria-label", "Python code you can edit");
    ta.addEventListener("input", function () { autosize(ta); });
    ta.addEventListener("keydown", function (ev) {
      if (ev.key === "Tab" && !ev.shiftKey) {
        ev.preventDefault();
        var s = ta.selectionStart;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 4;
      } else if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        runBtn.click();
      }
    });
    cell.appendChild(ta);

    var stdinBox = null;
    if (hasStdin) {
      var wrap = el("label", "pc-stdin");
      wrap.appendChild(el("span", null, "Answers for input(), one line each:"));
      stdinBox = el("textarea", "pc-stdin-box");
      stdinBox.rows = 2;
      stdinBox.value = pre.dataset.stdin;
      wrap.appendChild(stdinBox);
      cell.appendChild(wrap);
    }

    var bar = el("div", "pc-bar");
    var runBtn = button("▶ Run", "primary");
    var stepBtn = button("Step through");
    var resetBtn = button("Reset");
    var tutor = el("a", "pc-link", "Open in Python Tutor ↗");
    tutor.target = "_blank";
    tutor.rel = "noopener";
    bar.appendChild(runBtn);
    bar.appendChild(stepBtn);
    bar.appendChild(resetBtn);
    bar.appendChild(tutor);
    cell.appendChild(bar);

    var out = el("pre", "pc-out");
    out.hidden = true;
    out.setAttribute("aria-live", "polite");
    cell.appendChild(out);
    var stepHost = el("div", "pc-step-host");
    cell.appendChild(stepHost);

    tutor.addEventListener("mouseenter", function () { tutor.href = PyRun.tutorUrl(ta.value); });
    tutor.addEventListener("focus", function () { tutor.href = PyRun.tutorUrl(ta.value); });
    tutor.href = PyRun.tutorUrl(original);

    function opts() {
      return { argv: argv, stdin: stdinBox ? stdinBox.value : null };
    }
    function busy(on, label) {
      runBtn.disabled = stepBtn.disabled = on;
      if (on) { out.hidden = false; out.className = "pc-out"; out.textContent = label; }
    }

    runBtn.addEventListener("click", async function () {
      busy(true, window.PyRun._loaded ? "Running…" : "Loading Python (about 10 MB, first time only)…");
      try {
        var res = await PyRun.run(ta.value, opts());
        window.PyRun._loaded = true;
        out.className = "pc-out" + (res.err ? " error" : "");
        out.textContent = formatOutput(res) || "(The program ran and printed nothing.)";
      } catch (e) {
        out.className = "pc-out error";
        out.textContent = e.message;
      }
      busy(false);
    });

    stepBtn.addEventListener("click", async function () {
      busy(true, window.PyRun._loaded ? "Tracing…" : "Loading Python (about 10 MB, first time only)…");
      try {
        var res = await PyRun.trace(ta.value, opts());
        window.PyRun._loaded = true;
        out.hidden = true;
        stepHost.textContent = "";
        if (!res.steps.length) {
          out.hidden = false;
          out.className = "pc-out error";
          out.textContent = formatOutput(res) || "Nothing to step through.";
        } else if (window.Stepper) {
          window.Stepper.mount(stepHost, {
            code: ta.value, steps: window.Stepper.fromTrace(res), live: true, memory: memory,
            error: res.err ? (res.line ? "Error on line " + res.line + ": " : "Error: ") + res.err : null,
            truncated: res.truncated
          });
        }
      } catch (e) {
        out.hidden = false;
        out.className = "pc-out error";
        out.textContent = e.message;
      }
      busy(false);
      if (!out.hidden && out.className.indexOf("error") < 0) out.hidden = true;
    });

    resetBtn.addEventListener("click", function () {
      ta.value = original;
      autosize(ta);
      out.hidden = true;
      stepHost.textContent = "";
    });

    pre.replaceWith(cell);
    autosize(ta);
  }

  PyRun.upgrade = buildCell;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre.try").forEach(buildCell);
  });
})();
