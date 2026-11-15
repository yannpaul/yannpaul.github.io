addProblems([
  {
    id: "num-01", topic: "numbers", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(7 // 2)",
    answer: "3",
    tips: ["`//` is floor division: divide, then round DOWN to a whole number.", "7 divided by 2 is 3.5. Round down."],
    explain: "`7 / 2` is 3.5. `//` rounds down to 3."
  },
  {
    id: "num-02", topic: "numbers", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "print(7 % 2)",
    answer: "1",
    tips: ["`%` is the remainder after division.", "2 goes into 7 three times (that is 6). What is left?"],
    explain: "7 is 3 lots of 2 (which is 6), with 1 left over. `%` gives that leftover: 1."
  },
  {
    id: "num-03", topic: "numbers", level: 1, type: "predict",
    prompt: "What does this print? Compare with the last two.",
    code: "print(7 / 2)",
    answer: "3.5",
    tips: ["Plain `/` never rounds.", "It always gives a decimal number (a float)."],
    explain: "`/` is true division: it keeps the fraction. 7 / 2 is 3.5."
  },
  {
    id: "num-04", topic: "numbers", level: 2, type: "predict",
    prompt: "What does this print?",
    code: "print(10 // 3, 10 % 3)",
    answer: "3 1",
    tips: ["`10 // 3`: how many whole 3s fit in 10?", "`10 % 3`: what is left over?"],
    explain: "Three whole 3s make 9, and 1 is left. So `//` gives 3 and `%` gives 1. These two always go together: `10 == 3 * 3 + 1`."
  },
  {
    id: "num-05", topic: "numbers", level: 2, type: "predict",
    show: ["minutes"],
    prompt: "What does this print? Think about hours and minutes.",
    code: "minutes = 135\nprint(minutes // 60, minutes % 60)",
    answer: "2 15",
    tips: ["`minutes // 60` is the number of whole hours.", "`minutes % 60` is the minutes left over."],
    explain: "135 minutes is 2 whole hours (120 minutes) and 15 minutes left over. This is the classic use for `//` and `%` together.",
    walk: [
      [1, "Nothing exists yet.", {}],
      [2, "`minutes` points at 135. Line 2 does two things: `135 // 60` and `135 % 60`.", { minutes: "135" }],
      [2, "`135 // 60`: how many whole 60s fit in 135? Two (120). So 2.", { minutes: "135" }],
      [2, "`135 % 60`: after taking away 120, what is left? 15.", { minutes: "135" }],
      [null, "print shows both numbers with a space between.", { minutes: "135" }, "2 15"]
    ]
  },
  {
    id: "num-06", topic: "numbers", level: 3, type: "predict",
    title: "Exam trap: negative numbers",
    prompt: "What does this print? Floor division rounds toward the SMALLER number, not toward zero.",
    code: "print(-7 // 2)",
    answer: "-4",
    tips: ["`-7 / 2` is `-3.5`.", "Round DOWN. On the number line, down from -3.5 is -4, not -3."],
    explain: "`//` always rounds down (toward negative infinity). -3.5 rounds down to -4. If you want to chop off the decimals instead, use `int(-7 / 2)`, which gives -3."
  },
  {
    id: "num-07", topic: "numbers", level: 3, type: "predict",
    title: "Exam trap: negative remainders",
    prompt: "What does this print? The remainder takes the sign of the right-hand number.",
    code: "print(-7 % 3)",
    answer: "2",
    tips: ["`%` and `//` fit together: `a == (a // b) * b + (a % b)`.", "`-7 // 3` is -3. So `-7 == -3 * 3 + remainder`, and `-9 + 2 = -7`."],
    explain: "`-7 // 3` is -3 (rounding down), and `-3 * 3` is -9. To get back to -7 you need +2, so `-7 % 3` is 2."
  },
  {
    id: "num-08", topic: "numbers", level: 2, type: "predict",
    title: "Floor division keeps the type",
    prompt: "What does this print? Notice the `.0`.",
    code: "print(7.0 // 2)",
    answer: "3.0",
    tips: ["If either number is a float, the answer is a float.", "It is still rounded down, so 3, but written as a float."],
    explain: "`//` returns a float if either side is a float. The value is rounded down (3) but is shown as `3.0`."
  },
  {
    id: "num-09", topic: "numbers", level: 1, type: "predict",
    prompt: "What does this print? `**` means \"to the power of\".",
    code: "print(2 ** 5)",
    answer: "32",
    tips: ["`**` is power, not multiply.", "2 multiplied by itself 5 times: 2, 4, 8, 16, 32."],
    explain: "`2 ** 5` is `2 * 2 * 2 * 2 * 2`, which is 32."
  },
  {
    id: "num-10", topic: "numbers", level: 2, type: "choice",
    prompt: "What does the `%` operator return?",
    options: [
      "The remainder after dividing",
      "The percentage of a number",
      "The result rounded downward",
      "The result as a fraction"
    ],
    answer: 0,
    why: ["Yes: modulus, the leftover.", "Python has no percentage operator.", "That is `//`.", "Python has no fraction operator."],
    tips: ["Its name is modulus.", "In `7 % 2`, what is left after taking out the 2s?"],
    explain: "`%` returns the remainder. It is not about percentages. `//` is the one that rounds down."
  },
  {
    id: "num-11", topic: "numbers", level: 2, type: "yesno",
    show: ["x"],
    prompt: "With this value, is each statement True?",
    code: "x = 17",
    statements: [
      { s: "x % 5 == 2", answer: true, why: "5 goes into 17 three times (15), leaving 2." },
      { s: "x // 5 == 3", answer: true, why: "Three whole 5s fit in 17." },
      { s: "x / 5 == 3", answer: false, why: "`/` does not round: 17 / 5 is 3.4." },
      { s: "x % 2 == 0", answer: false, why: "17 is odd, so dividing by 2 leaves 1." },
      { s: "x // 5 * 5 + x % 5 == x", answer: true, why: "The two operators fit back together: 3 * 5 + 2 is 17." }
    ],
    tips: ["Compute `17 // 5` and `17 % 5` first: 3 and 2.", "`/` is the only one that keeps the fraction."],
    explain: "`//` and `%` always fit back together: `x == (x // d) * d + x % d`."
  },
  {
    id: "num-12", topic: "numbers", level: 1, type: "fill",
    prompt: "Choose the operators so the program prints `3 2`.",
    template: "print(17 [[a]] 5, 17 [[b]] 5)",
    blanks: {
      a: { options: ["/", "//", "%", "**"], answer: "//" },
      b: { options: ["/", "//", "%", "**"], answer: "%" }
    },
    expectOut: "3 2",
    tips: ["The first number is how many whole 5s fit in 17.", "The second is what is left over."],
    explain: "`17 // 5` is 3 and `17 % 5` is 2.",
    walkCode: "print(17 // 5, 17 % 5)"
  },
  {
    id: "num-13", topic: "numbers", level: 2, type: "code",
    show: ["is_even", "n"],
    prompt: "Write `is_even(n)`. It returns `True` when `n` is even and `False` when it is odd.",
    starter: "def is_even(n):\n    pass\n",
    solution: "def is_even(n):\n    return n % 2 == 0\n",
    tests: [
      { call: "is_even(4)", expect: true }, { call: "is_even(7)", expect: false },
      { call: "is_even(0)", expect: true }, { call: "is_even(-3)", expect: false }
    ],
    walkCall: "print(is_even(7))",
    tips: ["An even number leaves remainder 0 when divided by 2.", "`n % 2 == 0` is already a True/False answer. You can return it directly."],
    explain: "`n % 2` is 0 for even numbers and 1 for odd ones. The comparison `== 0` gives the Boolean to return."
  },
  {
    id: "num-14", topic: "numbers", level: 2, type: "code",
    show: ["last_digit", "n"],
    prompt: "Write `last_digit(n)`: it returns the last digit of a positive whole number. For example, `last_digit(1234)` is 4.",
    starter: "def last_digit(n):\n    pass\n",
    solution: "def last_digit(n):\n    return n % 10\n",
    tests: [{ call: "last_digit(1234)", expect: 4 }, { call: "last_digit(7)", expect: 7 }, { call: "last_digit(90)", expect: 0 }],
    walkCall: "print(last_digit(1234))",
    tips: ["Which operator gives you what is left over after dividing?", "Divide by 10: the remainder is the last digit."],
    explain: "`n % 10` is the remainder after taking out all the tens, which is the last digit."
  },
  {
    id: "num-15", topic: "numbers", level: 3, type: "code",
    show: ["tens_digit", "n"],
    prompt: "Write `tens_digit(n)`: the second-to-last digit of a whole number. `tens_digit(1234)` is 3. (Hint: you need both `//` and `%`.)",
    starter: "def tens_digit(n):\n    pass\n",
    solution: "def tens_digit(n):\n    return n // 10 % 10\n",
    tests: [{ call: "tens_digit(1234)", expect: 3 }, { call: "tens_digit(59)", expect: 5 }, { call: "tens_digit(7)", expect: 0 }, { call: "tens_digit(100)", expect: 0 }],
    walkCall: "print(tens_digit(1234))",
    tips: ["First chop off the last digit. Which operator does that?", "`1234 // 10` is 123. Now take its last digit.", "`n // 10 % 10`: `//` and `%` are tied, so Python goes left to right."],
    explain: "`n // 10` drops the last digit, and `% 10` keeps what is now the last digit. Because `//` and `%` are tied, Python works left to right, so no parentheses are needed."
  }
]);
