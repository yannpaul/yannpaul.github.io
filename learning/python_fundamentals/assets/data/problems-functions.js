addProblems([
  {
    id: "fn-01", topic: "functions", level: 1, type: "choice",
    prompt: "Which keyword tells Python you are about to build a function?",
    options: ["`def`", "`func`", "`function`", "`define`"],
    answer: 0,
    why: ["Yes: short for define.", "Other languages use this. Python does not.", "JavaScript uses this. Python does not.", "Python's keyword is the shorter `def`."],
    tips: ["It is three letters long.", "It is short for \"define\"."],
    explain: "`def` starts every function definition, followed by the function's name."
  },
  {
    id: "fn-02", topic: "functions", level: 2, type: "fill",
    title: "From class: calcSubtotal",
    prompt: "Complete the code to build a function with these rules. Its name is `calcSubtotal`. It takes an amount and a sales tax rate and calculates a subtotal. The new subtotal is returned.",
    template: "[[a]] calcSubtotal[[b]]\n    subtotal = amount * (1 + salesTaxRate)\n    [[c]] subtotal",
    blanks: {
      a: { options: ["def", "func", "function", "define"], answer: "def" },
      b: { options: ["(amount, salesTaxRate):", "(amount, salesTaxRate)", "[amount, salesTaxRate]:", "(amount salesTaxRate):"], answer: "(amount, salesTaxRate):" },
      c: { options: ["return", "print", "def", "result"], answer: "return" }
    },
    tips: [
      "The keyword to build a function comes first.",
      "The two things the function takes are called parameters. They go in parentheses, separated by a comma, and the line ends with a colon.",
      "The subtotal is the amount calculated, so that value is what gets returned."
    ],
    explain: "`def` builds the function. The parameters `(amount, salesTaxRate)` go in parentheses and the header line ends with a colon. `return subtotal` sends the calculated value back to whoever called the function. Without the colon you get a SyntaxError."
  },
  {
    id: "fn-03", topic: "functions", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "def double(x):\n    return x * 2\nprint(double(4))",
    answer: "8",
    tips: ["Lines 1 and 2 only BUILD the function. Nothing runs until line 3.", "`double(4)` runs the function with `x` equal to 4."],
    explain: "`double(4)` runs the body with `x = 4` and returns `4 * 2`, which is 8. `print` shows what came back.",
    walk: [
      [1, "`def` does not run the function. It builds it and gives it a name.", {}],
      [3, "Lines 1 and 2 only defined `double`. Line 3 is the first line that really RUNS. To print, Python must first call `double(4)`.", { double: "function double()" }],
      [2, "Python jumps into the function. A new frame appears, and the parameter `x` points at the argument 4.", { double: "function double()" }, "", [{ name: "double()", vars: { x: "4" } }]],
      [2, "`x * 2` is 8. `return` sends 8 back to the caller, and the frame disappears.", { double: "function double()" }, "", [{ name: "double()", vars: { x: "4" } }]],
      [null, "Back on line 3, `print` receives 8 and shows it.", { double: "function double()" }, "8"]
    ]
  },
  {
    id: "fn-04", topic: "functions", level: 2, type: "predict",
    title: "Default values",
    prompt: "A parameter can have a default value. What does this print? (Two lines of output.)",
    code: "def greet(name, greeting=\"Hello\"):\n    return greeting + \", \" + name\nprint(greet(\"Ann\"))\nprint(greet(\"Bo\", \"Hi\"))",
    answer: "Hello, Ann\nHi, Bo",
    tips: ["If you do not pass `greeting`, it uses \"Hello\".", "The second call passes both, so `greeting` is \"Hi\"."],
    explain: "The first call leaves out `greeting`, so the default \"Hello\" is used. The second passes \"Hi\", which replaces the default."
  },
  {
    id: "fn-05", topic: "functions", level: 3, type: "predict",
    title: "Exam trap: no return",
    prompt: "What does this print?",
    code: "def f(x):\n    x + 1\nprint(f(2))",
    answer: "None",
    tips: ["Is there a `return` keyword anywhere?", "A function with no `return` hands back `None`."],
    explain: "`x + 1` is worked out and thrown away. Without `return`, the function gives back `None`, and that is what `print` shows."
  },
  {
    id: "fn-06", topic: "functions", level: 2, type: "predict",
    prompt: "What does this print? `return` ends the function straight away.",
    code: "def f():\n    return 1\n    print(\"never\")\nprint(f())",
    answer: "1",
    tips: ["Once `return` runs, the function is over.", "The `print(\"never\")` line is never reached."],
    explain: "The `return 1` line leaves the function immediately, so \"never\" is not printed. Only the outer `print(f())` shows 1."
  },
  {
    id: "fn-07", topic: "functions", level: 2, type: "predict",
    title: "Scope: two different x",
    prompt: "What does this print?",
    code: "x = 10\ndef f():\n    x = 5\n    return x\nf()\nprint(x)",
    answer: "10",
    tips: ["`x = 5` inside the function creates a NEW `x` that exists only inside the function.", "The global `x` is not touched."],
    explain: "Assigning to a name inside a function makes a local variable. The global `x` stays 10.",
    walk: [
      [1, "Nothing exists yet.", {}],
      [2, "The global `x` points at 10. Line 2 builds `f`; it does not run it.", { x: "10" }],
      [5, "Line 5 calls `f()`.", { x: "10", f: "function f()" }],
      [3, "A new frame for `f()`. Its `x = 5` is about to run.", { x: "10", f: "function f()" }, "", [{ name: "f()", vars: {} }]],
      [4, "Inside `f()`, a brand new `x` is set to 5. It lives only in this frame. The global `x` is still 10.", { x: "10", f: "function f()" }, "", [{ name: "f()", vars: { x: "5" } }]],
      [6, "`f()` returned and its frame is gone, along with its `x`. The global `x` is still 10.", { x: "10", f: "function f()" }],
      [null, "Output: 10.", { x: "10", f: "function f()" }, "10"]
    ]
  },
  {
    id: "fn-08", topic: "functions", level: 2, type: "predict",
    title: "Using calcSubtotal",
    prompt: "What does this print?",
    code: "def calcSubtotal(amount, salesTaxRate):\n    subtotal = amount * (1 + salesTaxRate)\n    return subtotal\nprint(calcSubtotal(100, 0.25))",
    answer: "125.0",
    tips: ["`amount` is 100 and `salesTaxRate` is 0.25.", "`1 + 0.25` is 1.25 (the parentheses go first). Then `100 * 1.25`."],
    explain: "`(1 + 0.25)` is 1.25. Then `100 * 1.25` is `125.0`. A float times an int is a float."
  },
  {
    id: "fn-09", topic: "functions", level: 2, type: "code",
    title: "Write calcSubtotal yourself",
    prompt: "Write the function `calcSubtotal(amount, salesTaxRate)`. It returns the amount plus tax, so `calcSubtotal(100, 0.25)` is 125.",
    starter: "# write your function here\n",
    solution: "def calcSubtotal(amount, salesTaxRate):\n    subtotal = amount * (1 + salesTaxRate)\n    return subtotal\n",
    tests: [{ call: "calcSubtotal(100, 0.25)", expect: 125.0 }, { call: "calcSubtotal(50, 0)", expect: 50 }, { call: "calcSubtotal(80, 0.1)", expect: 88.0 }],
    walkCall: "print(calcSubtotal(100, 0.25))",
    tips: ["Start with `def`, the name, the two parameters in parentheses and a colon.", "Indent the body by four spaces.", "Use `return`, not `print`: the caller needs the value back."],
    explain: "`def`, the name, the parameters and a colon. Indent the body. `return` hands the value back."
  },
  {
    id: "fn-10", topic: "functions", level: 2, type: "code",
    prompt: "Write `full_name(first, last)`. It returns the first and last name joined with a space, so `full_name(\"Ann\", \"Lee\")` is `\"Ann Lee\"`.",
    starter: "def full_name(first, last):\n    pass\n",
    solution: "def full_name(first, last):\n    return first + \" \" + last\n",
    tests: [{ call: "full_name(\"Ann\", \"Lee\")", expect: "Ann Lee" }, { call: "full_name(\"Bo\", \"Ng\")", expect: "Bo Ng" }],
    walkCall: "print(full_name(\"Ann\", \"Lee\"))",
    tips: ["Strings can be joined with `+`.", "Do not forget the space: it is its own little string, `\" \"`."],
    explain: "`first + \" \" + last` glues the pieces together. Return the result, do not print it."
  },
  {
    id: "fn-11", topic: "functions", level: 1, type: "code",
    prompt: "Write `is_adult(age)`. It returns `True` if the age is 18 or more, otherwise `False`.",
    starter: "def is_adult(age):\n    pass\n",
    solution: "def is_adult(age):\n    return age >= 18\n",
    tests: [{ call: "is_adult(18)", expect: true }, { call: "is_adult(17)", expect: false }, { call: "is_adult(40)", expect: true }],
    walkCall: "print(is_adult(17))",
    tips: ["A comparison already gives you `True` or `False`.", "\"18 or more\" is `>=`, which includes 18 itself."],
    explain: "`age >= 18` is a Boolean, so return it directly."
  },
  {
    id: "fn-12", topic: "functions", level: 2, type: "choice",
    prompt: "What does a function give back if it has no `return` statement?",
    options: ["`None`", "`0`", "An empty string", "An error"],
    answer: 0,
    why: ["Yes, always `None`.", "Not zero.", "Not an empty string.", "It is perfectly legal to have no `return`."],
    tips: ["Python has a special object that means \"nothing here\".", "You saw it in an earlier problem."],
    explain: "A function without a `return` gives back `None`."
  },
  {
    id: "fn-13", topic: "functions", level: 2, type: "choice",
    prompt: "In `def calcSubtotal(amount, salesTaxRate):`, what is `amount`?",
    options: ["A parameter", "An argument", "A return value", "A keyword"],
    answer: 0,
    why: ["Yes. A parameter is a name in the `def` line.", "An argument is the real value you pass in when you call: the 100 in `calcSubtotal(100, 0.25)`.", "The return value is what comes back out.", "Keywords like `def` are built into Python."],
    tips: ["There is a name in the `def` line and a value in the call. They have different names.", "`amount` is in the `def` line, as a placeholder."],
    explain: "A parameter is the placeholder in the `def` line. An argument is the real value you hand over when you call the function."
  },
  {
    id: "fn-14", topic: "functions", level: 2, type: "predict",
    title: "Keyword arguments",
    prompt: "What does this print? You can pass arguments by name, in any order.",
    code: "def power(base, exp):\n    return base ** exp\nprint(power(exp=3, base=2))",
    answer: "8",
    tips: ["Names tell Python which parameter each value is for.", "So `base` is 2 and `exp` is 3."],
    explain: "`base=2` and `exp=3`, whatever the order, so the result is `2 ** 3`, which is 8."
  },
  {
    id: "fn-15", topic: "functions", level: 2, type: "predict",
    title: "One function calling another",
    prompt: "What does this print?",
    code: "def add(a, b):\n    return a + b\ndef double_sum(a, b):\n    return add(a, b) * 2\nprint(double_sum(2, 3))",
    answer: "10",
    tips: ["Start from the call at the bottom: `double_sum(2, 3)`.", "Inside it, `add(2, 3)` is worked out first: 5. Then times 2."],
    explain: "`double_sum` calls `add` and doubles the answer: `(2 + 3) * 2` is 10. Use the \"Full walkthrough\" to watch the frames pile up."
  },
  {
    id: "fn-16", topic: "functions", level: 2, type: "code",
    prompt: "Write `total_with_tip(bill, tip_percent)`. It returns the bill plus the tip, so `total_with_tip(50, 20)` is 60.",
    starter: "def total_with_tip(bill, tip_percent):\n    return bill + tip_percent\n",
    solution: "def total_with_tip(bill, tip_percent):\n    return bill + bill * tip_percent / 100\n",
    tests: [{ call: "total_with_tip(50, 20)", expect: 60.0 }, { call: "total_with_tip(80, 10)", expect: 88.0 }, { call: "total_with_tip(100, 0)", expect: 100 }],
    walkCall: "print(total_with_tip(50, 20))",
    tips: ["20 percent of 50 is `50 * 20 / 100`.", "Add that to the bill. Multiplication and division go before addition, so no parentheses are needed."],
    explain: "The tip is `bill * tip_percent / 100`. Precedence does the rest."
  }
]);
