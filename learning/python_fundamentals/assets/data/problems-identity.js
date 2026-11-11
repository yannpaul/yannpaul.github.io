addProblems([
  {
    id: "ident-01", topic: "identity", level: 2, type: "yesno",
    show: ["a", "b", "c"],
    title: "From class: the Yes / No table",
    prompt: "Using the following code values, select Yes if the Boolean statement is true, and No if it is false.",
    code: "a = 5\nb = 3\n\nc = b\nb = a",
    statements: [
      { s: "a == b", answer: true, why: "`b = a` on the last line made `b` point at 5. Both names now hold the value 5." },
      { s: "a is b", answer: true, why: "`b = a` makes `b` point at the very same object as `a`, so they are the same object and not just equal." },
      { s: "b == 3", answer: false, why: "`b` WAS 3, but the last line moved `b` over to 5. Only `c` still points at the 3." },
      { s: "c is b", answer: false, why: "`c = b` ran while `b` was still 3, so `c` took the 3. Then `b` moved to 5 and `c` stayed put. They point at different objects now." }
    ],
    tips: [
      "Go line by line and write down what each name points at after every line.",
      "`c = b` copies what `b` points at AT THAT MOMENT. It does not tie `c` to the name `b`.",
      "After the last line the end state is a = 5, b = 5, c = 3."
    ],
    explain: "This is the question from your notes. The key idea: assignment makes a name point at an object. `c = b` points `c` at whatever `b` points at right now. Later reassigning `b` does not drag `c` along.",
    walk: [
      [1, "Nothing exists yet. Line 1 will make the name `a` and point it at an object holding 5.", {}],
      [2, "Line 1 ran: `a` points at an object holding 5. Call it box #1. Next, `b = 3` will make a different object.", { a: "5@1" }],
      [4, "Line 2 ran: `b` points at a new object holding 3 (box #2). Next is `c = b`. It will NOT make a new 3. It will point `c` at whatever `b` points at right now.", { a: "5@1", b: "3@2" }],
      [5, "Line 4 ran: `c` now points at the same object as `b`, box #2. Two names, one object. Next is `b = a`: `b` will let go of the 3 and point at `a`'s object.", { a: "5@1", b: "3@2", c: "3@2" }],
      [null, "Line 5 ran: `b` now shares box #1 with `a`. `c` still points at the 3. It was not dragged along. Final state: a = 5, b = 5, c = 3. So `a is b` is True (one shared object), `a == b` is True (same value), `b == 3` is False and `c is b` is False (different objects).", { a: "5@1", b: "5@1", c: "3@2" }]
    ]
  },
  {
    id: "ident-02", topic: "identity", level: 2, type: "predict",
    show: ["a", "b", "c"],
    title: "The end state from your notes",
    prompt: "What does this print?",
    code: "a = 5\nb = 3\nc = b\nb = a\nprint(a, b, c)",
    answer: "5 5 3",
    tips: ["Follow each name line by line. What does `c` point at after `c = b`?", "`c` keeps the 3 even after `b` moves."],
    explain: "Same four lines as the class problem. `a` is 5, `b` is now 5, and `c` is still the old 3.",
    memory: true
  },
  {
    id: "ident-03", topic: "identity", level: 1, type: "choice",
    prompt: "What does the `is` operator check?",
    options: [
      "Whether two names share one object",
      "Whether two values look the same",
      "Whether two names have equal types",
      "Whether two numbers are both whole"
    ],
    answer: 0,
    why: [
      "Yes. `is` compares identity: the same object in memory.",
      "That is `==`, which compares values.",
      "Neither operator is about types.",
      "Neither operator is about whole numbers."
    ],
    tips: ["There are two questions you can ask about two names: do they hold equal values, or are they literally the same thing?", "`==` asks the first question."],
    explain: "`==` asks \"do these have equal values?\". `is` asks \"are these the very same object?\"."
  },
  {
    id: "ident-04", topic: "identity", level: 2, type: "predict",
    show: ["a", "b"],
    title: "Equal, but not the same",
    prompt: "What does this print?",
    code: "a = [1, 2]\nb = [1, 2]\nprint(a == b, a is b)",
    answer: "True False",
    tips: ["Each `[1, 2]` on a line creates a NEW list.", "Two separate lists with equal contents: equal values, different objects."],
    explain: "Writing `[1, 2]` twice builds two separate lists. They are equal (`==` is True) but they are two different objects (`is` is False).",
    walk: [
      [1, "Nothing exists yet.", {}],
      [2, "Line 1 ran: `a = [1, 2]` built a list object (#1) and pointed `a` at it. Next, line 2 will write `[1, 2]` again.", { a: "[1, 2]@1" }],
      [3, "Line 2 ran: writing `[1, 2]` again built a SECOND list (#2), and `b` points at that one. Next is the print.", { a: "[1, 2]@1", b: "[1, 2]@2" }],
      [null, "`a == b` is True: same contents. `a is b` is False: two objects. Notice the two different box numbers.", { a: "[1, 2]@1", b: "[1, 2]@2" }, "True False"]
    ]
  },
  {
    id: "ident-05", topic: "identity", level: 2, type: "predict",
    show: ["a", "b"],
    title: "One list, two names",
    prompt: "What does this print?",
    code: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)",
    answer: "[1, 2, 3]",
    tips: ["`b = a` does not copy the list. It points `b` at the same list.", "`b.append(3)` changes the one list that both names point at."],
    explain: "There is only one list. `b = a` gave the list a second name. When `b.append(3)` changes it, `a` sees the change, because `a` is the same list.",
    walk: [
      [1, "Nothing exists yet.", {}],
      [2, "Line 1 ran: `a` points at a new list, object #1. Next is `b = a`.", { a: "[1, 2]@1" }],
      [3, "Line 2 ran: `b = a` made no new list. `b` points at the same object #1. Two names, one list. Next, `b.append(3)` will change that list.", { a: "[1, 2]@1", b: "[1, 2]@1" }],
      [4, "Line 3 ran: `b.append(3)` changed the list object itself. `a` and `b` are both looking at that one object, so both now show `[1, 2, 3]`.", { a: "[1, 2, 3]@1", b: "[1, 2, 3]@1" }],
      [null, "`a` shows the change too, because it is the same list.", { a: "[1, 2, 3]@1", b: "[1, 2, 3]@1" }, "[1, 2, 3]"]
    ]
  },
  {
    id: "ident-06", topic: "identity", level: 2, type: "predict",
    show: ["a", "b"],
    title: "A real copy",
    prompt: "This time `b` gets a copy. What does this print?",
    code: "a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)",
    answer: "[1, 2]",
    tips: ["`.copy()` builds a NEW list with the same contents.", "Changing the new list does not touch the old one."],
    explain: "`a.copy()` makes a second list. `b.append(3)` changes only `b`'s list, so `a` is still `[1, 2]`."
  },
  {
    id: "ident-07", topic: "identity", level: 2, type: "predict",
    show: ["a", "b"],
    title: "Numbers behave differently",
    prompt: "What does this print? Numbers cannot be changed in place, only replaced.",
    code: "a = 5\nb = a\na = 7\nprint(b)",
    answer: "5",
    tips: ["`b = a` points `b` at the 5.", "`a = 7` points `a` at a different object, a 7. It does not change the 5, so `b` is untouched."],
    explain: "`a = 7` moves the NAME `a` to a new object. It does not edit the 5. `b` still points at the 5.",
    walk: [
      [1, "Nothing exists yet. Line 1 will point `a` at a 5.", {}],
      [2, "Line 1 ran: `a` points at the 5 (#1). Next is `b = a`.", { a: "5@1" }],
      [3, "Line 2 ran: `b = a` pointed `b` at the same 5. Two names, one object. Next is `a = 7`.", { a: "5@1", b: "5@1" }],
      [4, "Line 3 ran: `a = 7` pointed `a` at a NEW object, a 7 (#2). It did not change the 5, so `b` still points at the 5. Next is `print(b)`.", { a: "7@2", b: "5@1" }],
      [null, "`print(b)` shows 5.", { a: "7@2", b: "5@1" }, "5"]
    ]
  },
  {
    id: "ident-08", topic: "identity", level: 2, type: "predict",
    show: ["x", "y"],
    prompt: "What does this print? (`+=` on a number builds a new number.)",
    code: "x = 3\ny = x\ny += 1\nprint(x, y)",
    answer: "3 4",
    tips: ["`y += 1` means `y = y + 1`.", "That points `y` at a new object, a 4. `x` is not affected."],
    explain: "`y += 1` is `y = y + 1`. The sum is a new number, and `y` now points at it. `x` still points at the 3."
  },
  {
    id: "ident-09", topic: "identity", level: 2, type: "choice",
    prompt: "Which pair of lines makes `p is q` True?",
    options: ["`p = [1]` then `q = p`", "`p = [1]` then `q = [1]`", "`p = [1]` then `q = list(p)`", "`p = [1]` then `q = p[:]`"],
    answer: 0,
    why: [
      "`q = p` points `q` at the same list. Same object.",
      "That builds a second list.",
      "`list(p)` builds a new list with the same items.",
      "`p[:]` is a slice, which builds a new list."
    ],
    proof: { code: "p = [1]\nq = p\nr = list(p)\ns = p[:]\nt = [1]\nprint(p is q, p is r, p is s, p is t)", out: "True False False False" },
    tips: ["Only plain assignment of one name to another shares an object.", "Everything else on the list builds a new list."],
    explain: "`is` is True only when both names point at the very same object. Plain assignment (`q = p`) shares. Constructing, copying and slicing all build new objects."
  },
  {
    id: "ident-10", topic: "identity", level: 2, type: "multi",
    prompt: "After `a = 5` and `b = a`, which statements are True? Choose all that apply.",
    options: ["`a == b`", "`a is b`", "`a is not b`", "`a != b`"],
    answers: [0, 1],
    why: ["Equal values.", "Same object.", "They ARE the same, so `is not` is False.", "They are equal, so `!=` is False."],
    tips: ["`b = a` points `b` at the same object as `a`.", "Same object means both `is` and `==` are True."],
    explain: "`b = a` shares the object, so both `a == b` and `a is b` are True. `is not` and `!=` are their opposites."
  },
  {
    id: "ident-11", topic: "identity", level: 2, type: "yesno",
    show: ["x", "y", "z"],
    prompt: "Choose Yes if each statement is True.",
    code: "x = [1]\ny = x\nz = [1]",
    statements: [
      { s: "x is y", answer: true, why: "`y = x` shares the list." },
      { s: "x == z", answer: true, why: "Same contents." },
      { s: "x is z", answer: false, why: "`z` is a second, separately built list." },
      { s: "y is z", answer: false, why: "`y` is `x`'s list, `z` is another." }
    ],
    tips: ["Count the number of lists that get built. Every `[...]` on a line builds one.", "Only `y = x` shares."],
    explain: "Two lists were built (the `[1]` on line 1 and the `[1]` on line 3), and `y` is a second name for the first."
  },
  {
    id: "ident-12", topic: "identity", level: 3, type: "predict",
    show: ["a"],
    title: "None",
    prompt: "What does this print? (`None` is a single special object.)",
    code: "a = None\nprint(a is None, a == None)",
    answer: "True True",
    tips: ["There is only one `None` in the whole program.", "Both checks work, but `is None` is the usual way to write it."],
    explain: "`None` is a single object, so `is None` is the standard check. `== None` also works but is considered less tidy."
  },
  {
    id: "ident-13", topic: "identity", level: 3, type: "choice",
    prompt: "You want to know whether two strings contain the same text. What should you use?",
    options: ["`a == b`", "`a is b`", "`a in b`", "`a != b`"],
    answer: 0,
    why: [
      "Yes: `==` compares values.",
      "`is` asks about identity. Python sometimes reuses strings and sometimes does not, so it can give surprising answers.",
      "`in` asks whether one is inside the other.",
      "`!=` is the opposite of what you asked."
    ],
    tips: ["Is this a question about values or about identity?", "Use `is` only for `None` and when you really mean \"the very same object\"."],
    explain: "Use `==` to compare values. `is` can be True or False depending on how Python happened to store the strings, so never rely on it for text or numbers."
  }
]);
