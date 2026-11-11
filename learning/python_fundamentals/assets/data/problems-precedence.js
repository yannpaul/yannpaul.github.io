addProblems([
  {
    id: "prec-01", topic: "precedence", level: 1, type: "predict",
    title: "From class: the first one",
    prompt: "What does this program print?",
    code: "a = 10\na += 4 + 5\nprint(a)",
    answer: "19",
    tips: [
      "Arithmetic operators come before assignment.",
      "`a` is defined as 10 on line 1.",
      "`+` has higher precedence than `+=`.",
      "`4 + 5` is 9, so line 2 is really `a += 9`.",
      "`a += b` is the same thing as `a = a + b`."
    ],
    explain: "`4 + 5` is worked out first (arithmetic beats assignment), giving 9. Then `a += 9` means `a = a + 9`, which is `10 + 9`.",
    walk: [
      [1, "Nothing exists yet. Line 1 is about to run.", {}],
      [2, "Line 1 ran: the name `a` now points at the number 10. Line 2 is next. Before you do anything with it, find the operators on the line. There are two: `+=` and `+`.", { a: "10" }],
      [2, "`+` is arithmetic. `+=` is assignment. Arithmetic is higher on the ladder, so the `+` happens first: `4 + 5` is 9.", { a: "10" }],
      [2, "Now the line is really `a += 9`. And `a += 9` is shorthand for `a = a + 9`, which is `10 + 9`.", { a: "10" }],
      [3, "Line 2 ran: `a` now points at 19. The old 10 is gone. `print(a)` is next.", { a: "19" }],
      [null, "print shows the value of `a`: 19.", { a: "19" }, "19"]
    ]
  },
  {
    id: "prec-02", topic: "precedence", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(2 + 3 * 4)",
    answer: "14",
    tips: [
      "Both `+` and `*` are arithmetic, but they are not equal. Multiplication goes first.",
      "Work out `3 * 4` first, then add 2."
    ],
    explain: "Inside arithmetic there is a smaller ladder: `**` first, then `*` `/` `//` `%`, then `+` `-`. So `3 * 4` is 12, and then `2 + 12` is 14. Your class ladder lumps the arithmetic operators together, but this order inside them matters.",
    walk: [
      [1, "One line, with two operators: `+` and `*`. Both are arithmetic, so the big ladder does not decide. The smaller arithmetic ladder does: `*` before `+`.", {}],
      [1, "`3 * 4` is worked out first: 12. The expression is now `2 + 12`.", {}],
      [1, "`2 + 12` is 14. print shows it.", {}],
      [null, "Output: 14.", {}, "14"]
    ]
  },
  {
    id: "prec-03", topic: "precedence", level: 1, type: "predict",
    prompt: "What does this print? Watch the parentheses.",
    code: "print((2 + 3) * 4)",
    answer: "20",
    tips: ["Parentheses beat everything. Do the inside first.", "`(2 + 3)` is 5, then `5 * 4`."],
    explain: "Parentheses are the one thing that overrules the ladder. `(2 + 3)` becomes 5 first, then `5 * 4` is 20."
  },
  {
    id: "prec-04", topic: "precedence", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "x = 5\nx -= 2 * 3\nprint(x)",
    answer: "-1",
    tips: [
      "Arithmetic first: what is `2 * 3`?",
      "Then line 2 is really `x -= 6`.",
      "`x -= 6` means `x = x - 6`."
    ],
    explain: "`2 * 3` is 6, so line 2 is `x -= 6`, which is `x = 5 - 6`. The answer is negative: -1.",
    walk: [
      [1, "Line 1 is about to run.", {}],
      [2, "`x` points at 5. Line 2 has `-=` (assignment) and `*` (arithmetic). Arithmetic goes first.", { x: "5" }],
      [2, "`2 * 3` is 6. The line is now `x -= 6`, which means `x = x - 6`.", { x: "5" }],
      [3, "`5 - 6` is -1, so `x` now points at -1. `print(x)` is next.", { x: "-1" }],
      [null, "Output: -1.", { x: "-1" }, "-1"]
    ]
  },
  {
    id: "prec-05", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print? When two operators have the same precedence, Python works left to right.",
    code: "print(10 - 4 - 3)",
    answer: "3",
    tips: ["Same precedence, so left to right: `(10 - 4)` first.", "`6 - 3` is 3. (Doing the right one first would give 9, which is wrong.)"],
    explain: "`-` and `+` are tied, so Python goes left to right: `10 - 4` is 6, then `6 - 3` is 3."
  },
  {
    id: "prec-06", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print? The `/` operator always gives a float, even when the answer is whole.",
    code: "print(8 / 4 * 2)",
    answer: "4.0",
    tips: ["`/` and `*` are tied, so left to right.", "`8 / 4` is `2.0` (a float), then `2.0 * 2` is `4.0`."],
    explain: "Tied operators go left to right: `8 / 4` is 2.0, then `2.0 * 2` is 4.0. A float times an int stays a float, so print shows the `.0`."
  },
  {
    id: "prec-07", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print?",
    code: "a = 4\nb = 2\na *= b + 3\nprint(a)",
    answer: "20",
    tips: [
      "Line 3 has `*=` (assignment) and `+` (arithmetic).",
      "The right-hand side `b + 3` is worked out first: `2 + 3`.",
      "A common mistake is reading `a *= b` first and then adding 3. Assignment is last, not first."
    ],
    explain: "Everything to the right of `*=` is worked out before the assignment happens. `b + 3` is 5, so the line is `a *= 5`, which is `a = 4 * 5`. A wrong reading, `(a *= b) + 3`, would give 11.",
    walk: [
      [1, "Line 1 about to run.", {}],
      [2, "`a` is 4. Line 2 next.", { a: "4" }],
      [3, "`b` is 2. Line 3 has `*=` and `+`. The whole right side is worked out first.", { a: "4", b: "2" }],
      [3, "`b + 3` is `2 + 3`, which is 5. The line is now `a *= 5`, meaning `a = a * 5`, meaning `4 * 5`.", { a: "4", b: "2" }],
      [4, "`a` now points at 20. `print(a)` is next.", { a: "20", b: "2" }],
      [null, "Output: 20.", { a: "20", b: "2" }, "20"]
    ]
  },
  {
    id: "prec-08", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print? Follow `x` one line at a time.",
    code: "x = 7\nx += 2\nx *= 3\nprint(x)",
    answer: "27",
    tips: ["Each line changes `x` and the next line starts from the new value.", "After line 2: 9. After line 3: `9 * 3`."],
    explain: "These lines run in order, top to bottom. `x` becomes 9 and then 27. Note that `x *= 3` does not do `3` first; each line is its own step.",
    walk: [
      [1, "Line 1 about to run.", {}],
      [2, "`x` is 7.", { x: "7" }],
      [3, "`x += 2` means `x = 7 + 2`. Now `x` is 9.", { x: "9" }],
      [4, "`x *= 3` means `x = 9 * 3`. Now `x` is 27.", { x: "27" }],
      [null, "Output: 27.", { x: "27" }, "27"]
    ]
  },
  {
    id: "prec-09", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print? Arithmetic comes before comparison on the ladder.",
    code: "print(2 + 3 > 4)",
    answer: "True",
    tips: ["Two operators: `+` (arithmetic) and `>` (comparison).", "`2 + 3` is 5 first. Then `5 > 4`."],
    explain: "Arithmetic is higher than comparison, so `2 + 3` becomes 5 first, and then `5 > 4` is `True`. If comparison went first you would be trying `3 > 4` and get something else."
  },
  {
    id: "prec-10", topic: "precedence", level: 2, type: "predict",
    title: "Three levels in one line",
    prompt: "This line uses arithmetic, comparison and assignment. What does it print?",
    code: "n = 5\nn = n + 1 == 6\nprint(n)",
    answer: "True",
    tips: [
      "Operators on line 2: `=` (assignment), `+` (arithmetic), `==` (comparison).",
      "Order: arithmetic, then comparison, then assignment.",
      "`n + 1` is 6. Then `6 == 6` is `True`. Then `n` is set to that `True`."
    ],
    explain: "The ladder in action: arithmetic (`n + 1` is 6), then comparison (`6 == 6` is `True`), then assignment (`n` now points at `True`). The old number is gone.",
    walk: [
      [1, "Line 1 about to run.", {}],
      [2, "`n` is 5. Line 2 has three operators. Use the ladder: arithmetic, then comparison, then assignment.", { n: "5" }],
      [2, "Arithmetic first: `n + 1` is `5 + 1`, which is 6. The line is now `n = 6 == 6`.", { n: "5" }],
      [2, "Comparison next: `6 == 6` is `True`. The line is now `n = True`.", { n: "5" }],
      [3, "Assignment last: `n` now points at `True`. It is not a number any more.", { n: "True" }],
      [null, "Output: True.", { n: "True" }, "True"]
    ]
  },
  {
    id: "prec-11", topic: "precedence", level: 2, type: "predict",
    prompt: "What does this print?",
    code: "a = 6\nb = 4\na -= b\nb += a\nprint(a, b)",
    answer: "2 6",
    tips: ["Line 3 changes `a`. Line 4 then uses the new `a`.", "After line 3: `a` is `6 - 4`. After line 4: `b` is `4 + a`."],
    explain: "Line 3: `a = 6 - 4`, so `a` is 2. Line 4 uses the new `a`: `b = 4 + 2`, so `b` is 6. `print(a, b)` puts a space between the two values.",
    walk: [
      [1, "Line 1 about to run.", {}],
      [3, "`a` is 6 and `b` is 4. Line 3 next.", { a: "6", b: "4" }],
      [4, "`a -= b` means `a = 6 - 4`. Now `a` is 2.", { a: "2", b: "4" }],
      [5, "`b += a` means `b = 4 + 2` (using the NEW `a`). Now `b` is 6.", { a: "2", b: "6" }],
      [null, "print shows both values with a space between them.", { a: "2", b: "6" }, "2 6"]
    ]
  },
  {
    id: "prec-12", topic: "precedence", level: 3, type: "predict",
    title: "Exam trap: right to left",
    prompt: "Exponent `**` is the odd one: when two of them are tied, Python goes RIGHT to left. What does this print?",
    code: "print(2 ** 3 ** 2)",
    answer: "512",
    tips: ["Right to left: `3 ** 2` first.", "`3 ** 2` is 9, then `2 ** 9`."],
    explain: "`**` groups from the right, so this is `2 ** (3 ** 2)`, which is `2 ** 9`, which is 512. (Left to right would be `(2 ** 3) ** 2`, which is 64.)"
  },
  {
    id: "prec-13", topic: "precedence", level: 3, type: "predict",
    title: "Exam trap: the minus sign",
    prompt: "What does this print? A minus sign in front of a number is an operator too.",
    code: "print(-2 ** 2)",
    answer: "-4",
    tips: ["`**` is higher than the minus sign in front.", "So `2 ** 2` is 4 first, and then the minus is applied."],
    explain: "`**` binds tighter than the unary minus, so this is `-(2 ** 2)`, which is -4. If you wanted 4, write `(-2) ** 2`."
  },
  {
    id: "prec-14", topic: "precedence", level: 2, type: "yesno",
    title: "Yes / No table",
    prompt: "After this code runs, is each statement true? Choose Yes or No.",
    code: "a = 10\na += 4 + 5",
    statements: [
      { s: "a == 19", answer: true, why: "`4 + 5` is 9 first, then `10 + 9`." },
      { s: "a == 9", answer: false, why: "That would throw away the 10. `+=` adds to `a`, it does not replace it." },
      { s: "a == 14", answer: false, why: "That would be `10 + 4` and forget the `+ 5`." },
      { s: "a == 10 + 9", answer: true, why: "Same value, written out. `a += 9` means `a = 10 + 9`." }
    ],
    tips: ["What is `a` after line 2? Work it out before you look at the statements.", "`+=` adds to the old value."],
    explain: "The whole line is `a = a + (4 + 5)`, so `a` ends at 19."
  },
  {
    id: "prec-15", topic: "precedence", level: 2, type: "choice",
    prompt: "In what order does Python do the operators in `ok = 1 + 2 < 5 and True`?",
    options: [
      "`+` then `<` then `and` then `=`",
      "`and` then `<` then `+` then `=`",
      "`=` then `+` then `<` then `and`",
      "`<` then `+` then `=` then `and`"
    ],
    answer: 0,
    why: [
      "Arithmetic, comparison, logical, assignment. This is the ladder in order.",
      "Backwards. Logical operators come after arithmetic and comparison.",
      "Assignment is the very last, not the first.",
      "Comparison cannot go before arithmetic: you would have nothing to compare."
    ],
    tips: ["Use the ladder: arithmetic, containment, comparison, identity, logical, assignment.", "Assignment is always last."],
    explain: "`1 + 2` is 3, then `3 < 5` is True, then `True and True` is True, then `ok` is set to True."
  },
  {
    id: "prec-16", topic: "precedence", level: 1, type: "fill",
    prompt: "Choose the operator that makes this print 9.",
    template: "x = 2\nx [[op]] 3 + 4\nprint(x)",
    blanks: { op: { options: ["+=", "-=", "*=", "/="], answer: "+=" } },
    expectOut: "9",
    tips: ["`3 + 4` is 7 first.", "Which one gives 9 from `x = 2` and 7?"],
    explain: "`x += 7` is `2 + 7`, which is 9. `*=` would give 14, `-=` would give -5 and `/=` would give 0.2857...",
    walkCode: "x = 2\nx += 3 + 4\nprint(x)"
  },
  {
    id: "prec-17", topic: "precedence", level: 2, type: "code",
    prompt: "Write a function `average(a, b)` that returns the average of two numbers. The starter code has a precedence bug. Fix it.",
    starter: "def average(a, b):\n    return a + b / 2\n",
    solution: "def average(a, b):\n    return (a + b) / 2\n",
    tests: [
      { call: "average(4, 6)", expect: 5.0 },
      { call: "average(10, 20)", expect: 15.0 },
      { call: "average(1, 2)", expect: 1.5 },
      { call: "average(0, 0)", expect: 0.0 }
    ],
    walkCall: "print(average(4, 6))",
    tips: ["Run the tests and see which numbers come out wrong.", "`/` is higher than `+`, so `a + b / 2` divides only `b`.", "Parentheses force the add to happen first."],
    explain: "Without parentheses, `b / 2` happens first. `(a + b) / 2` forces the addition first."
  }
]);
