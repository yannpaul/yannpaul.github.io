addProblems([
  {
    id: "logic-01", topic: "logic", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(not True)",
    answer: "False",
    tips: ["`not` flips a Boolean: True becomes False, False becomes True.", "So what is the opposite of True?"],
    explain: "`not` turns `True` into `False`."
  },
  {
    id: "logic-02", topic: "logic", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(True and False)",
    answer: "False",
    tips: ["`and` is True only when BOTH sides are True.", "One side is False, so the whole thing is False."],
    explain: "`and` needs both sides True. Here one side is `False`, so the answer is `False`."
  },
  {
    id: "logic-03", topic: "logic", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(True or False)",
    answer: "True",
    tips: ["`or` is True when AT LEAST ONE side is True.", "Is at least one side True here?"],
    explain: "`or` needs only one side to be True. The left side is `True`, so the answer is `True`."
  },
  {
    id: "logic-04", topic: "logic", level: 2, type: "predict",
    title: "not goes first",
    prompt: "What does this print? Remember the order: `not`, then `and`, then `or`.",
    code: "print(not True or True)",
    answer: "True",
    tips: ["`not` has the highest precedence of the three.", "`not True` is False. Now the line is `False or True`."],
    explain: "`not True` is `False` first. Then `False or True` is `True`.",
    walk: [
      [1, "Two logic operators: `not` and `or`. The logic ladder says `not` first, then `and`, then `or`.", {}],
      [1, "`not True` is `False`. The line is now `False or True`.", {}],
      [1, "`or` needs only one True. The right side is True, so the answer is `True`.", {}],
      [null, "Output: True.", {}, "True"]
    ]
  },
  {
    id: "logic-05", topic: "logic", level: 2, type: "predict",
    title: "Parentheses change it",
    prompt: "Same pieces as the last problem, but with parentheses. What does this print?",
    code: "print(not (True or True))",
    answer: "False",
    tips: ["Parentheses first: `(True or True)` is True.", "Then `not True`."],
    explain: "The parentheses make `True or True` happen first, giving `True`. Then `not True` is `False`."
  },
  {
    id: "logic-06", topic: "logic", level: 2, type: "predict",
    title: "and before or",
    prompt: "What does this print? `and` binds tighter than `or`, so it is worked out first.",
    code: "print(True or False and False)",
    answer: "True",
    tips: [
      "Find the `and` first: `False and False`.",
      "That is `False`, so the line becomes `True or False`.",
      "If you went left to right you would get `(True or False) and False`, which is False. That is the wrong order."
    ],
    explain: "`and` goes before `or`. `False and False` is `False`, then `True or False` is `True`.",
    walk: [
      [1, "Two operators: `or` and `and`. The ladder: `and` before `or`.", {}],
      [1, "`False and False` is `False`. The line is now `True or False`.", {}],
      [1, "`True or False` is `True`.", {}],
      [null, "Output: True. Going left to right would have given False, which is the common mistake.", {}, "True"]
    ]
  },
  {
    id: "logic-07", topic: "logic", level: 2, type: "predict",
    prompt: "What does this print? Arithmetic and comparison go before `and`.",
    code: "x = 5\nprint(x > 3 and x < 10)",
    answer: "True",
    tips: ["Work out each comparison first: `x > 3`, then `x < 10`.", "Both are True, so `True and True`."],
    explain: "`5 > 3` is True and `5 < 10` is True. Comparison goes before `and`, so the line is `True and True`, which is `True`."
  },
  {
    id: "logic-08", topic: "logic", level: 2, type: "predict",
    prompt: "What does this print? Use the ladder: comparison, then `not`, then `and`.",
    code: "x = 5\nprint(x > 3 and not x == 5)",
    answer: "False",
    tips: [
      "Comparisons first: `x > 3` is True. `x == 5` is True.",
      "Now the line is `True and not True`.",
      "`not True` is False, then `True and False`."
    ],
    explain: "`x > 3` is True and `x == 5` is True. `not` turns the second into False. Then `True and False` is `False`.",
    walk: [
      [1, "Line 1 about to run.", {}],
      [2, "`x` is 5. Line 2 has comparisons (`>`, `==`) and logic (`and`, `not`). Comparisons go first.", { x: "5" }],
      [2, "`x > 3` is `5 > 3`: True. `x == 5` is `5 == 5`: True. The line is now `True and not True`.", { x: "5" }],
      [2, "`not` goes before `and`: `not True` is False. The line is now `True and False`.", { x: "5" }],
      [2, "`True and False` is `False`.", { x: "5" }],
      [null, "Output: False.", { x: "5" }, "False"]
    ]
  },
  {
    id: "logic-09", topic: "logic", level: 2, type: "predict",
    prompt: "What does this print?",
    code: "print(1 + 1 == 2 and 3 * 3 == 9)",
    answer: "True",
    tips: ["Three levels: arithmetic, comparison, then `and`.", "`1 + 1 == 2` is `2 == 2`. `3 * 3 == 9` is `9 == 9`."],
    explain: "Arithmetic first (`2` and `9`), then each comparison is True, then `True and True` is `True`."
  },
  {
    id: "logic-10", topic: "logic", level: 2, type: "predict",
    title: "Containment: in",
    prompt: "`in` asks whether something is inside something else. What does this print? (Two values: `print` puts a space between them.)",
    code: "print(\"an\" in \"banana\", \"z\" in \"banana\")",
    answer: "True False",
    tips: ["Is the text `an` somewhere in `banana`? Look for it.", "`z` is not in `banana`."],
    explain: "`an` appears twice in banana, so the first is `True`. There is no `z`, so the second is `False`."
  },
  {
    id: "logic-11", topic: "logic", level: 2, type: "predict",
    prompt: "What does this print?",
    code: "fruits = [\"apple\", \"pear\"]\nprint(\"pear\" in fruits and \"kiwi\" not in fruits)",
    answer: "True",
    tips: ["Containment goes before `and`.", "`\"pear\" in fruits` is True. `\"kiwi\" not in fruits` is also True."],
    explain: "Both containment checks are True, so `True and True` is `True`. `not in` is a single operator, the opposite of `in`."
  },
  {
    id: "logic-12", topic: "logic", level: 3, type: "predict",
    title: "Exam trap: chained comparisons",
    prompt: "This one surprises almost everyone. What does it print?",
    code: "print(5 in [1, 5] == True)",
    answer: "False",
    tips: [
      "`in` and `==` are on the SAME level in real Python, so they chain, like `1 < x < 10` does.",
      "A chain `a in b == c` means `(a in b) and (b == c)`.",
      "Is the list `[1, 5]` equal to `True`? No."
    ],
    explain: "Python reads `5 in [1, 5] == True` as `(5 in [1, 5]) and ([1, 5] == True)`. The first part is True. The second is False, because a list is never equal to `True`. So the whole line is False. Your class ladder puts `in` above `==`, which would suggest `(5 in [1, 5]) == True`, and that would be True. This is why the real rule is one level, chained. Write the parentheses yourself when you mean it."
  },
  {
    id: "logic-13", topic: "logic", level: 3, type: "predict",
    title: "Chained comparisons",
    prompt: "Python lets you chain comparisons. What does this print?",
    code: "print(1 < 3 > 2, 1 < 3 < 2)",
    answer: "True False",
    tips: ["`1 < 3 > 2` means `1 < 3 and 3 > 2`.", "`1 < 3 < 2` means `1 < 3 and 3 < 2`."],
    explain: "A chain means every neighbouring pair must be true. `1 < 3` and `3 > 2` are both True. In the second, `3 < 2` is False."
  },
  {
    id: "logic-14", topic: "logic", level: 2, type: "yesno",
    prompt: "Using these values, choose Yes if each statement is True and No if it is False.",
    code: "x = 7\ny = 3",
    statements: [
      { s: "x > y and y > 0", answer: true, why: "Both parts are True." },
      { s: "x < y or y == 3", answer: true, why: "The first part is False, but `or` needs only one True part, and `y == 3` is True." },
      { s: "not x > y", answer: false, why: "Comparison goes before `not`. `x > y` is True, and `not True` is False." },
      { s: "x != 7 or y != 3", answer: false, why: "`x != 7` is False. `y != 3` is False. `False or False` is False." },
      { s: "x > y > 0", answer: true, why: "A chain: `x > y` and `y > 0`, both True." }
    ],
    tips: ["Work out one statement at a time. Write the value next to each name.", "Comparisons always go before `not`, `and` and `or`."],
    explain: "Same ladder as always: comparisons first, then `not`, then `and`, then `or`."
  },
  {
    id: "logic-15", topic: "logic", level: 2, type: "choice",
    prompt: "Which expression is True only when `n` is between 1 and 9 (inclusive)?",
    options: ["`n >= 1 and n <= 9`", "`n >= 1 or n <= 9`", "`n >= 1 and n >= 9`", "`not n >= 1 or n <= 9`"],
    answer: 0,
    why: [
      "Both conditions must hold at once, so `and`.",
      "`or` is True for almost every number: 50 is `>= 1`, so it passes.",
      "`n >= 9` only passes numbers from 9 up.",
      "`not` goes first, then `or`: almost everything slips through."
    ],
    tips: ["You need both conditions at the same time.", "Which word means both: `and` or `or`?"],
    explain: "Use `and` when both conditions must be true. A very common mistake is writing `or` here, which is True for every number."
  },
  {
    id: "logic-16", topic: "logic", level: 3, type: "predict",
    title: "Short-circuit",
    prompt: "`and` stops as soon as the left side is False, and never looks at the right. What does this print?",
    code: "print(False and 1 / 0)",
    answer: "False",
    tips: ["`1 / 0` would crash if it ran.", "The left side is False, so `and` already knows the answer."],
    explain: "`False and anything` is `False`, so Python never evaluates `1 / 0`. This is called short-circuiting. `True or anything` does the same."
  },
  {
    id: "logic-17", topic: "logic", level: 1, type: "fill",
    prompt: "Choose the word that makes the program print `in range`.",
    template: "x = 15\nif x > 10 [[op]] x < 20:\n    print(\"in range\")",
    blanks: { op: { options: ["and", "or", "not", "in"], answer: "and" } },
    expectOut: "in range",
    tips: ["You want both conditions to hold: more than 10 AND less than 20.", "`or` would also print here, but it would be wrong for x = 5. Think about the meaning."],
    explain: "`and` means both conditions. With `or`, a number like 5 would also print `in range`, which is not what the name says.",
    walkCode: "x = 15\nif x > 10 and x < 20:\n    print(\"in range\")"
  }
]);
