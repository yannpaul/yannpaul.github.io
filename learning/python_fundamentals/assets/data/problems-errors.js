addProblems([
  {
    id: "err-01", topic: "errors", level: 2, type: "fill",
    title: "From class: raise and finally",
    prompt: "Select the missing code to throw an exception that the calling code can catch, and the keyword for a block that runs no matter how the `try` part ends. (The program is given the inputs 10 and 2.)",
    template: "x = float(input(\"Enter a number. \"))\ny = float(input(\"Enter a number to divide by. \"))\ntry:\n    print(f\"The answer is {x/y}.\")\nexcept:\n    if y == 0:\n        [[a]] Exception(\"You cannot divide by zero\")\n[[b]]:\n    print(\"Thank you for playing.\")",
    stdin: "10\n2",
    expectOut: "Enter a number. 10\nEnter a number to divide by. 2\nThe answer is 5.0.\nThank you for playing.",
    blanks: {
      a: { options: ["raise", "throw", "error", "return"], answer: "raise" },
      b: { options: ["finally", "else", "always", "final"], answer: "finally" }
    },
    tips: [
      "The keyword that starts an exception is also an English word: you \"raise\" a problem. Java uses a different word.",
      "The block that runs no matter what comes at the very end of the whole try statement."
    ],
    explain: "`raise` throws an exception, and `throw` is the Java word for the same idea. `finally` runs whatever happened in the `try`. `else` runs only when the `try` was successful. With y = 0, the `except` block raises the new exception, the `finally` still prints, and then the error goes up to the caller.",
    walkCode: "x = 10\ny = 2\ntry:\n    print(f\"The answer is {x/y}.\")\nexcept:\n    if y == 0:\n        raise Exception(\"You cannot divide by zero\")\nfinally:\n    print(\"Thank you for playing.\")"
  },
  {
    id: "err-02", topic: "errors", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print(\"no dividing by zero\")",
    answer: "no dividing by zero",
    tips: ["`10 / 0` is an error, so Python jumps to the `except` block.", "The `print(10 / 0)` never prints anything."],
    explain: "The error happens inside `try`. Python skips the rest of that block and runs the matching `except`."
  },
  {
    id: "err-03", topic: "errors", level: 2, type: "predict",
    title: "finally always runs",
    prompt: "What does this print? (Three lines.)",
    code: "try:\n    print(\"A\")\nfinally:\n    print(\"B\")\nprint(\"C\")",
    answer: "A\nB\nC",
    tips: ["Nothing goes wrong here. Is there an error?", "`finally` runs whether or not there was an error."],
    explain: "No error, but `finally` runs anyway, then the program carries on with the next line."
  },
  {
    id: "err-04", topic: "errors", level: 2, type: "predict",
    title: "else runs when there is no error",
    prompt: "What does this print? (Two lines.)",
    code: "try:\n    x = 4 / 2\nexcept ZeroDivisionError:\n    print(\"except\")\nelse:\n    print(\"else\")\nfinally:\n    print(\"finally\")",
    answer: "else\nfinally",
    tips: ["Does `4 / 2` cause an error?", "No error means `except` is skipped and `else` runs."],
    explain: "`else` runs when the `try` succeeds. `finally` runs always, and it always goes last.",
    walk: [
      [1, "Python starts the `try` block.", {}],
      [2, "`4 / 2` works. There is no error, so the rest of the `try` block just finishes.", {}],
      [6, "No error, so the `except` block is SKIPPED. The `else` block runs, because the try succeeded. `x` is 2.0.", { x: "2.0" }],
      [8, "Last, the `finally` block runs. It always does. \"else\" is already on the screen.", { x: "2.0" }, "else"],
      [null, "Output: else, then finally.", { x: "2.0" }, "else\nfinally"]
    ]
  },
  {
    id: "err-05", topic: "errors", level: 2, type: "predict",
    prompt: "Now the same program, but `4 / 0`. What does this print? (Two lines.)",
    code: "try:\n    x = 4 / 0\nexcept ZeroDivisionError:\n    print(\"except\")\nelse:\n    print(\"else\")\nfinally:\n    print(\"finally\")",
    answer: "except\nfinally",
    tips: ["`4 / 0` raises a ZeroDivisionError.", "`except` handles it. `else` is skipped. `finally` still runs."],
    explain: "With an error: `except` runs, `else` is skipped, `finally` runs.",
    walk: [
      [1, "Python starts the `try` block.", {}],
      [2, "`4 / 0` raises a `ZeroDivisionError`. Python abandons the rest of the `try` block and looks for a matching `except`.", {}],
      [4, "There is an `except ZeroDivisionError`, so it runs. Its `print` is next.", {}],
      [8, "`else` is skipped, because there WAS an error. `finally` runs. \"except\" is already on the screen.", {}, "except"],
      [null, "Output: except, then finally.", {}, "except\nfinally"]
    ]
  },
  {
    id: "err-06", topic: "errors", level: 2, type: "predict",
    title: "Raising your own error",
    prompt: "What does this print?",
    code: "try:\n    raise ValueError(\"bad\")\nexcept ValueError as e:\n    print(\"caught\", e)",
    answer: "caught bad",
    tips: ["`raise` throws the exception on purpose.", "`as e` gives the exception a name, and `print` shows its message."],
    explain: "`raise ValueError(\"bad\")` throws. The `except ValueError as e` catches it, and `e` prints as its message: `bad`."
  },
  {
    id: "err-07", topic: "errors", level: 3, type: "predict",
    title: "Which except runs?",
    prompt: "What does this print? Python tries each `except` from the top, and the first one that matches wins.",
    code: "try:\n    n = int(\"abc\")\nexcept ZeroDivisionError:\n    print(\"zero\")\nexcept ValueError:\n    print(\"value\")",
    answer: "value",
    tips: ["`int(\"abc\")` raises a ValueError, not a ZeroDivisionError.", "Skip the first except, then the second matches."],
    explain: "The text `abc` cannot become a number, so `int` raises ValueError. The first `except` does not match, and the second does."
  },
  {
    id: "err-08", topic: "errors", level: 2, type: "choice",
    prompt: "Which keyword throws an exception that other code can catch?",
    options: ["`raise`", "`throw`", "`catch`", "`error`"],
    answer: 0,
    why: ["Yes.", "That is the Java word for the same idea.", "Python catches with `except`, not `catch`.", "Not a keyword."],
    tips: ["It is a keyword, not a function.", "You \"raise\" a problem."],
    explain: "`raise` is the Python keyword. `throw` and `catch` are Java words."
  },
  {
    id: "err-09", topic: "errors", level: 2, type: "choice",
    prompt: "Which keyword marks a block that runs no matter what happened in the `try`?",
    options: ["`finally`", "`else`", "`except`", "`always`"],
    answer: 0,
    why: ["Yes.", "`else` runs only when there was NO error.", "`except` runs only when there WAS an error.", "Not a keyword."],
    tips: ["It runs at the very end.", "It runs whether the try worked or failed."],
    explain: "`finally` runs always. It is the place for tidy-up code, like closing a file."
  },
  {
    id: "err-10", topic: "errors", level: 2, type: "choice",
    prompt: "Which block runs ONLY when the `try` block finished with no error?",
    options: ["`else`", "`finally`", "`except`", "`raise`"],
    answer: 0,
    why: ["Yes.", "`finally` runs either way.", "`except` runs only on an error.", "`raise` is a keyword that throws, not a block."],
    tips: ["It is the opposite of `except`.", "It sits between `except` and `finally`."],
    explain: "`else` runs when the try is successful."
  },
  {
    id: "err-11", topic: "errors", level: 3, type: "predict",
    title: "Exam trap: finally runs before the error escapes",
    prompt: "In your class program, `y` was 0. Here is the same shape, wrapped so the error can be printed. What does this print? (Two lines.)",
    code: "y = 0\ntry:\n    try:\n        print(10 / y)\n    except:\n        if y == 0:\n            raise Exception(\"You cannot divide by zero\")\n    finally:\n        print(\"Thank you for playing.\")\nexcept Exception as e:\n    print(\"Error:\", e)",
    answer: "Thank you for playing.\nError: You cannot divide by zero",
    tips: ["The inner `try` has an `except` that raises a NEW exception.", "Before that exception leaves the inner `try`, its `finally` block runs.", "Only then does the outer `except` catch it."],
    explain: "The order is: the `except` raises, the `finally` runs, and then the outer `except` catches the new exception. `finally` always has the last word before an error leaves the block."
  },
  {
    id: "err-12", topic: "errors", level: 2, type: "yesno",
    prompt: "Use this function. Choose Yes if each statement is True.",
    code: "def risky(n):\n    try:\n        return 10 / n\n    except ZeroDivisionError:\n        return -1",
    statements: [
      { s: "risky(2) == 5.0", answer: true, why: "No error: `10 / 2` is 5.0." },
      { s: "risky(0) == -1", answer: true, why: "Dividing by zero is caught, and the except returns -1." },
      { s: "risky(5) == -1", answer: false, why: "No error, so the answer is 2.0." },
      { s: "risky(-2) == -5.0", answer: true, why: "A negative number is fine: no error." }
    ],
    tips: ["Which input causes an error? Only 0.", "Every other input takes the normal path."],
    explain: "Only `n == 0` triggers the `except`. Everything else takes the normal path."
  },
  {
    id: "err-13", topic: "errors", level: 2, type: "code",
    prompt: "Write `safe_divide(a, b)`. It returns `a / b`, but if `b` is 0 it returns `None` instead of crashing. Use `try` and `except`.",
    starter: "def safe_divide(a, b):\n    return a / b\n",
    solution: "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n",
    tests: [{ call: "safe_divide(10, 2)", expect: 5.0 }, { call: "safe_divide(1, 0)", expect: null }, { call: "safe_divide(0, 5)", expect: 0 }, { call: "safe_divide(7, 2)", expect: 3.5 }],
    walkCall: "print(safe_divide(1, 0))",
    tips: ["Put the division in a `try` block.", "Catch `ZeroDivisionError` specifically.", "Remember to `return None` in the `except`. A function that finishes without a return gives back `None` anyway, but being explicit is clearer."],
    explain: "`try: return a / b`, and `except ZeroDivisionError: return None` catches only that one error."
  },
  {
    id: "err-14", topic: "errors", level: 3, type: "predict",
    title: "Where does the error stop?",
    prompt: "What does this print? (Two lines.)",
    code: "def f():\n    try:\n        return 1\n    finally:\n        print(\"cleanup\")\nprint(f())",
    answer: "cleanup\n1",
    tips: ["`return 1` is about to leave the function. But `finally` has to run first.", "So \"cleanup\" is printed before the number 1 reaches the outer `print`."],
    explain: "Even a `return` inside `try` does not skip `finally`. \"cleanup\" prints first, then `f()` hands back 1 and the outer `print` shows it."
  }
]);
