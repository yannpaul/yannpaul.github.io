addProblems([
  {
    id: "imp-01", topic: "imports", level: 1, type: "choice",
    prompt: "Which line imports the whole `math` module, so you write `math.sqrt(...)`?",
    options: ["`import math`", "`from math`", "`math import`", "`include math`"],
    answer: 0,
    why: ["Yes. You then use dot notation: `math.sqrt(9)`.", "Incomplete. `from math` needs `import something` after it.", "Words in the wrong order.", "That is C, not Python."],
    tips: ["The simplest form is two words: the keyword, then the module name.", "Which keyword brings in a module?"],
    explain: "`import math` loads the whole module. You reach its tools with a dot: `math.sqrt`, `math.pi`."
  },
  {
    id: "imp-02", topic: "imports", level: 1, type: "predict",
    prompt: "What does this print? (Square root always gives a float.)",
    code: "import math\nprint(math.sqrt(25))",
    answer: "5.0",
    tips: ["`math.sqrt(25)` asks: which number times itself is 25?", "In Python the answer is a float, so it is shown with `.0`."],
    explain: "The square root of 25 is 5. `math.sqrt` always returns a float, so you see `5.0`. Your notes say \"5 (or 5.0 in many languages)\". In Python it is always `5.0`."
  },
  {
    id: "imp-03", topic: "imports", level: 1, type: "predict",
    title: "from ... import ...",
    prompt: "What does this print? Notice that `sqrt` is used WITHOUT `math.` in front.",
    code: "from math import sqrt\nprint(sqrt(16))",
    answer: "4.0",
    tips: ["`from math import sqrt` brings just `sqrt` into your program, by name.", "So you call it as `sqrt(16)`."],
    explain: "`from module import name` copies that one name in, so you drop the `math.` prefix. 4 squared is 16, so the answer is `4.0`."
  },
  {
    id: "imp-04", topic: "imports", level: 2, type: "predict",
    title: "An alias",
    prompt: "What does this print? (An alias is a nickname you choose.)",
    code: "import math as m\nprint(m.floor(3.7))",
    answer: "3",
    tips: ["`import math as m` loads math but calls it `m` in your program.", "`floor` rounds down."],
    explain: "After `import math as m`, the name `math` does not exist. You write `m.floor(...)`. `floor(3.7)` is 3."
  },
  {
    id: "imp-05", topic: "imports", level: 2, type: "choice",
    prompt: "After `import random as rd`, which line picks a whole number from 1 to 6?",
    options: ["`rd.randint(1, 6)`", "`random.randint(1, 6)`", "`rd(randint(1, 6))`", "`as.randint(1, 6)`"],
    answer: 0,
    why: ["Yes. The alias `rd` replaces the module name.", "With an alias, the name `random` is not available.", "`rd` is a module, not a function you can call.", "`as` is a keyword that is only used in the import line."],
    tips: ["After an alias, the alias is the only name you can use.", "Dot notation: `alias.function(...)`."],
    explain: "`import random as rd` means you call things as `rd.something`. `random.randint` would raise a NameError."
  },
  {
    id: "imp-06", topic: "imports", level: 2, type: "fill",
    prompt: "Complete the code so it prints `3.0`.",
    template: "[[a]] math\nprint(math.[[b]](9))",
    blanks: {
      a: { options: ["import", "from", "include", "using"], answer: "import" },
      b: { options: ["sqrt", "pow", "pi", "ceil"], answer: "sqrt" }
    },
    expectOut: "3.0",
    tips: ["The first blank loads the module. The second is a function that takes 9 and gives back 3.0.", "`math.pi` is a constant: you cannot call it with `(9)`."],
    explain: "`import math` loads the module and `math.sqrt(9)` is `3.0`. `math.pow(9)` would be an error because `pow` needs two numbers.",
    walkCode: "import math\nprint(math.sqrt(9))"
  },
  {
    id: "imp-07", topic: "imports", level: 2, type: "predict",
    title: "floor, ceil, trunc",
    prompt: "What does this print? `floor` rounds down, `ceil` rounds up, `trunc` chops off the decimals.",
    code: "import math\nprint(math.floor(3.7), math.ceil(3.2), math.trunc(3.9))",
    answer: "3 4 3",
    tips: ["`floor(3.7)`: the biggest whole number that is not above 3.7.", "`ceil(3.2)`: the smallest whole number that is not below 3.2.", "`trunc(3.9)`: just drop the `.9`."],
    explain: "floor(3.7) is 3, ceil(3.2) is 4 and trunc(3.9) is 3. All three return whole numbers (ints), not floats."
  },
  {
    id: "imp-08", topic: "imports", level: 3, type: "predict",
    title: "Exam trap: negative numbers",
    prompt: "What does this print? The three functions disagree once the number is negative.",
    code: "import math\nprint(math.floor(-3.5), math.ceil(-3.5), math.trunc(-3.5))",
    answer: "-4 -3 -3",
    tips: ["`floor` always goes DOWN, and down from -3.5 is -4.", "`ceil` always goes UP: -3.", "`trunc` goes toward zero: it just drops the `.5`."],
    explain: "floor goes to the smaller whole number (-4), ceil to the bigger one (-3), and trunc drops the decimals and lands on -3. They agree for positive numbers, but not for negative ones."
  },
  {
    id: "imp-09", topic: "imports", level: 2, type: "predict",
    prompt: "What does this print? `fabs` is the absolute value, as a float.",
    code: "import math\nprint(math.fabs(-5))",
    answer: "5.0",
    tips: ["Absolute value means \"how far from zero\", so no minus sign.", "The `f` in `fabs` is for float."],
    explain: "`math.fabs` always returns a float, so you get `5.0`, not `5`. The built-in `abs(-5)` returns `5`."
  },
  {
    id: "imp-10", topic: "imports", level: 2, type: "predict",
    title: "`pow` vs `**`",
    prompt: "Two ways to write \"2 to the power 3\". What does this print?",
    code: "import math\nprint(math.pow(2, 3), 2 ** 3)",
    answer: "8.0 8",
    tips: ["`math.pow` always returns a float.", "`**` on two ints returns an int."],
    explain: "Same maths, different type: `math.pow(2, 3)` is `8.0` and `2 ** 3` is `8`."
  },
  {
    id: "imp-11", topic: "imports", level: 2, type: "predict",
    title: "The value of pi",
    prompt: "What does this print? `pi` is a constant, so it has no parentheses.",
    code: "import math\nprint(math.pi)",
    answer: "3.141592653589793",
    tips: ["It is a value, not a function: `math.pi`, not `math.pi()`.", "Python shows 15 decimal places."],
    explain: "`math.pi` is 3.141592653589793 (an approximation). Python spells it `pi`, in lowercase. `math.PI` raises an AttributeError."
  },
  {
    id: "imp-12", topic: "imports", level: 3, type: "predict",
    title: "Exam trap: negative square root",
    prompt: "Your notes say a negative number gives NaN. What does Python really do here?",
    code: "import math\ntry:\n    print(math.sqrt(-4))\nexcept ValueError:\n    print(\"ValueError\")",
    answer: "ValueError",
    tips: ["Look at the `except` line: it names an error type.", "`math.sqrt` refuses negative numbers instead of returning NaN."],
    explain: "In Python, `math.sqrt(-4)` raises `ValueError: math domain error`. It does not return `nan`. (Some other languages do return NaN.) NaN in Python usually comes from `math.nan` or `float(\"nan\")`."
  },
  {
    id: "imp-13", topic: "imports", level: 3, type: "predict",
    title: "NaN is odd",
    prompt: "What does this print? NaN means \"Not a Number\".",
    code: "import math\nprint(math.isnan(math.nan), math.nan == math.nan)",
    answer: "True False",
    tips: ["`math.isnan(x)` is the right way to check for NaN.", "NaN is not equal to anything, not even itself."],
    explain: "`math.isnan(math.nan)` is True. But `math.nan == math.nan` is False, because NaN is never equal to anything. That is why `isnan` exists."
  },
  {
    id: "imp-14", topic: "imports", level: 3, type: "predict",
    title: "frexp",
    prompt: "`math.frexp(x)` splits x into a mantissa `m` and an exponent `e` so that `x = m * 2 ** e`. What does this print?",
    code: "import math\nprint(math.frexp(8))",
    answer: "(0.5, 4)",
    tips: ["`m` is always between 0.5 and 1.", "`0.5 * 2 ** 4` is `0.5 * 16`."],
    explain: "8 is 0.5 times 2 to the power 4, so you get the pair `(0.5, 4)`. Your notes show this as x = m·2^e."
  },
  {
    id: "imp-15", topic: "imports", level: 3, type: "predict",
    title: "round() is built in",
    prompt: "`round` needs no import. It rounds to the nearest whole number, and a tie goes to the EVEN number. What does this print?",
    code: "print(round(2.5), round(3.5), round(2.567, 1))",
    answer: "2 4 2.6",
    tips: ["`round(2.5)` is exactly halfway between 2 and 3. A tie goes to the even one.", "The second argument is how many decimal places to keep."],
    explain: "2.5 is a tie, so it rounds to the even number 2. 3.5 is a tie and rounds to the even 4. `round(2.567, 1)` keeps one decimal: 2.6."
  },
  {
    id: "imp-16", topic: "imports", level: 2, type: "choice",
    prompt: "Your notes mention `math.round()`. Which statement is correct?",
    options: [
      "`round()` is built in, and `math.round` does not exist",
      "`math.round()` rounds, and `round()` does not exist",
      "Both `round()` and `math.round()` exist",
      "Neither exists, so use `math.floor` instead"
    ],
    answer: 0,
    why: ["Right. Your note about this was already correct.", "It is the other way around.", "Only the built-in exists.", "`round` exists: it is built in."],
    proof: { code: "import math\nprint(hasattr(math, 'round'), callable(round))", out: "False True" },
    tips: ["Built-in functions such as `print`, `len` and `round` need no import.", "Try `import math` then `dir(math)` and look for `round`."],
    explain: "`round` is a built-in function. The `math` module has `floor` and `ceil`, but no `round`."
  },
  {
    id: "imp-17", topic: "imports", level: 2, type: "choice",
    prompt: "Which module would you import to pick a random card from a deck?",
    options: ["`random`", "`math`", "`datetime`", "`io`"],
    answer: 0,
    why: ["Yes: \"allows you to introduce randomness\".", "`math` is for maths functions.", "`datetime` is for dates and times.", "`io` is for streams of data."],
    tips: ["Check the list of basic imports in your notes.", "Which one has a name about chance?"],
    explain: "`random` has `choice`, `randint`, `shuffle` and more."
  },
  {
    id: "imp-18", topic: "imports", level: 2, type: "choice",
    prompt: "Which module lets your program talk to the operating system, for example to list the files in a folder?",
    options: ["`os`", "`sys`", "`io`", "`math`"],
    answer: 0,
    why: ["Yes. `os` = operating system.", "`sys` talks to the Python interpreter, which is different.", "`io` is about reading and writing data streams.", "`math` is for maths."],
    tips: ["Check the list of basic imports in your notes.", "Two of them sound alike: `os` for the operating system, `sys` for the interpreter (the Python program itself)."],
    explain: "`os` interacts with the operating system. `sys` interacts with the Python interpreter, for example `sys.argv`."
  },
  {
    id: "imp-19", topic: "imports", level: 2, type: "code",
    show: ["circle_area", "r"],
    prompt: "Write `circle_area(r)`, which returns the area of a circle with radius `r` (area = pi times r squared). Use `math.pi`.",
    starter: "import math\n\ndef circle_area(r):\n    return 0\n",
    solution: "import math\n\ndef circle_area(r):\n    return math.pi * r ** 2\n",
    tests: [{ call: "circle_area(1)", expect: 3.141592653589793 }, { call: "circle_area(2)", expect: 12.566370614359172 }, { call: "circle_area(0)", expect: 0 }],
    walkCall: "print(circle_area(2))",
    tips: ["Area is `pi * r * r`, or `pi * r ** 2`.", "`**` goes before `*`, so `math.pi * r ** 2` is already right."],
    explain: "`math.pi * r ** 2`: the power goes first, then the multiplication."
  },
  {
    id: "imp-20", topic: "imports", level: 3, type: "code",
    show: ["hypotenuse", "a", "b"],
    prompt: "Write `hypotenuse(a, b)`: the length of the longest side of a right-angled triangle, `sqrt(a squared + b squared)`.",
    starter: "import math\n\ndef hypotenuse(a, b):\n    return 0\n",
    solution: "import math\n\ndef hypotenuse(a, b):\n    return math.sqrt(a ** 2 + b ** 2)\n",
    tests: [{ call: "hypotenuse(3, 4)", expect: 5.0 }, { call: "hypotenuse(5, 12)", expect: 13.0 }, { call: "hypotenuse(0, 2)", expect: 2.0 }],
    walkCall: "print(hypotenuse(3, 4))",
    tips: ["`a ** 2 + b ** 2` first, then the square root of that.", "Use parentheses to put the sum INSIDE `math.sqrt(...)`."],
    explain: "The sum of the squares goes inside the call: `math.sqrt(a ** 2 + b ** 2)`."
  }
]);
