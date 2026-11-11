addProblems([
  {
    id: "ut-01", topic: "unittest", level: 2, type: "fill",
    title: "From class: build the unit test",
    prompt: "A developer is building a unit test and needs help determining the built-in module required, how to check whether the unit test is run as the main module, and how to evaluate if two values are equal to each other. Select the code needed to finish building the unit test.",
    template: "import unittest\na = 3\nb = 6\nclass Test_Example_UnitTest(unittest.[[a]]):\n    def test_equal(self):\n        self.[[b]](2 + 8, a + b)\nif [[c]] == '__main__':\n    unittest.main()",
    blanks: {
      a: { options: ["TestCase", "Test", "UnitTest", "main"], answer: "TestCase" },
      b: { options: ["assertEqual", "assertIs", "assertTrue", "equals"], answer: "assertEqual" },
      c: { options: ["__name__", "__file__", "__main__", "name"], answer: "__name__" }
    },
    tips: [
      "A test class has to inherit from a class that unittest provides. Its name has \"test\" and \"case\" in it.",
      "Which assertion checks two values are equal?",
      "`__name__` holds `'__main__'` only when the file is run directly."
    ],
    explain: "A test class inherits from `unittest.TestCase`. `self.assertEqual(x, y)` checks equality. `if __name__ == '__main__':` runs the tests only when this file is run directly. Look closely at the numbers, though: `2 + 8` is 10 and `a + b` is 9, so this test would FAIL with `AssertionError: 10 != 9`. The class example is about the structure, not about the test passing. Try it with the Run button below."
  },
  {
    id: "ut-02", topic: "unittest", level: 2, type: "predict",
    title: "What is an assert?",
    prompt: "An `assert` is a statement that says \"this must be True\". If it is True, nothing happens. What does this print?",
    code: "assert 2 + 2 == 4\nprint(\"ok\")",
    answer: "ok",
    tips: ["The assert checks `2 + 2 == 4`. Is that True?", "When an assert passes, the program just carries on."],
    explain: "The assert passes, silently, and the next line prints `ok`."
  },
  {
    id: "ut-03", topic: "unittest", level: 2, type: "predict",
    prompt: "What does this print? When an assert fails, it raises an `AssertionError`.",
    code: "try:\n    assert 2 + 2 == 5\nexcept AssertionError:\n    print(\"failed\")",
    answer: "failed",
    tips: ["`2 + 2 == 5` is False.", "A failed assert raises an `AssertionError`, and the `except` catches it."],
    explain: "A false assert raises `AssertionError`. A unit test is exactly this: if an assertion fails, the test fails."
  },
  {
    id: "ut-04", topic: "unittest", level: 2, type: "choice",
    show: ["test_memory"],
    title: "From class: which test checks memory?",
    prompt: "The code is part of a unit test. Which statement will test whether `a` and `b` share the same memory space?",
    code: "def test_memory(self):\n    a = 3\n    b = a\n    # insert assert test here",
    options: ["`self.assertIs(a, b)`", "`self.assertEqual(a, b)`", "`self.assertTrue(a)`", "`self.assertIn(a, b)`"],
    answer: 0,
    why: ["Yes: `assertIs` is the unittest version of `a is b`.", "That is `a == b`: equal values, not the same object.", "That checks that `a` is truthy. It says nothing about `b`.", "That is `a in b`: whether `a` is inside `b`."],
    tips: [
      "\"Same memory space\" is the identity question. Which Python operator asks it?",
      "`is` asks the identity question. Each unittest method is named after what it checks, with `assert` in front: `assertEqual` is `==`.",
      "So what is the one for `is`?"
    ],
    explain: "An assert test is a check that must be True, or the test fails. `assertIs(a, b)` means `a is b`. `assertEqual(a, b)` means `a == b`."
  },
  {
    id: "ut-05", topic: "unittest", level: 2, type: "choice",
    prompt: "With `a = 3` and `b = 6`, what happens when `self.assertEqual(2 + 8, a + b)` runs?",
    options: [
      "The test fails because 10 is not 9",
      "The test passes because both are numbers",
      "The test fails because it is a SyntaxError",
      "The test prints both sums and moves on"
    ],
    answer: 0,
    why: ["Yes. `2 + 8` is 10 and `3 + 6` is 9.", "`assertEqual` compares values, not types.", "The code is fine. It is the numbers that do not match.", "A failing assert does not just print."],
    tips: ["Work out `2 + 8` and `a + b` separately.", "Are they equal?"],
    explain: "`assertEqual(10, 9)` fails and shows `AssertionError: 10 != 9`."
  },
  {
    id: "ut-06", topic: "unittest", level: 2, type: "choice",
    prompt: "What is `if __name__ == '__main__':` for?",
    options: [
      "Running the code only when the file is run directly",
      "Checking that the file has a name",
      "Importing the main module of the program",
      "Hiding the code from other programmers"
    ],
    answer: 0,
    why: ["Yes. When another file imports this one, `__name__` is the module name, not `'__main__'`.", "It does not look for a file name.", "It does not import anything.", "It does not hide anything."],
    tips: ["Python sets `__name__` to `'__main__'` only for the file you actually launched.", "An imported file gets its own module name instead."],
    explain: "The block runs when you launch the file directly, not when something else imports it. That is why the line `unittest.main()` sits under it."
  },
  {
    id: "ut-07", topic: "unittest", level: 1, type: "choice",
    prompt: "Which class does a test class inherit from?",
    options: ["`unittest.TestCase`", "`unittest.Test`", "`unittest.main`", "`unittest.Case`"],
    answer: 0,
    why: ["Yes.", "No such class.", "`main` is the function that RUNS the tests.", "No such class."],
    tips: ["Put the two words \"test\" and \"case\" together, each starting with a capital letter.", "The module is `unittest`, and the class inside it has the word Case in it."],
    explain: "`class MyTests(unittest.TestCase):` is the standard start of a unittest test class."
  },
  {
    id: "ut-08", topic: "unittest", level: 2, type: "multi",
    prompt: "Which of these are real assertion methods in `unittest.TestCase`? Choose all that apply.",
    options: ["`assertEqual`", "`assertIs`", "`assertTrue`", "`assertSame`"],
    answers: [0, 1, 2],
    why: ["Checks `a == b`.", "Checks `a is b`.", "Checks that a value is true.", "There is no such method. The identity one is `assertIs`."],
    proof: { code: "import unittest\nprint(hasattr(unittest.TestCase, 'assertSame'))", out: "False" },
    tips: ["Each name says what it checks: equal, is, true.", "One of them sounds right but does not exist."],
    explain: "`assertEqual`, `assertIs` and `assertTrue` all exist. `assertSame` is made up."
  },
  {
    id: "ut-09", topic: "unittest", level: 2, type: "yesno",
    prompt: "After `import unittest`, is each name a real part of `unittest.TestCase`?",
    code: "import unittest",
    statements: [
      { s: "hasattr(unittest.TestCase, \"assertEqual\")", answer: true, why: "The most used assertion." },
      { s: "hasattr(unittest.TestCase, \"assertIs\")", answer: true, why: "Checks identity, `a is b`." },
      { s: "hasattr(unittest.TestCase, \"assertIn\")", answer: true, why: "Checks `a in b`." },
      { s: "hasattr(unittest.TestCase, \"assertSame\")", answer: false, why: "Does not exist." }
    ],
    tips: ["`assertEqual` is `==`, `assertIs` is `is`, `assertIn` is `in`.", "The names follow the operators you already know."],
    explain: "The assertion names mirror Python's operators: `==`, `is`, `in`."
  },
  {
    id: "ut-10", topic: "unittest", level: 3, type: "predict",
    show: ["T", "test_a", "test_b", "result"],
    title: "Running tests from code",
    prompt: "This runs a test class and collects the results. `testsRun` is how many tests ran and `failures` is the list that failed. What does this print?",
    code: "import unittest\nclass T(unittest.TestCase):\n    def test_a(self):\n        self.assertEqual(1 + 1, 2)\n    def test_b(self):\n        self.assertTrue(3 > 5)\nresult = unittest.TestResult()\nunittest.defaultTestLoader.loadTestsFromTestCase(T).run(result)\nprint(result.testsRun, len(result.failures))",
    answer: "2 1",
    tips: ["There are two methods whose names start with `test`.", "`1 + 1 == 2` passes. `3 > 5` is False, so `assertTrue` fails."],
    explain: "Both tests run. `test_a` passes and `test_b` fails (3 is not greater than 5), so you get 2 tests run and 1 failure."
  },
  {
    id: "ut-11", topic: "unittest", level: 3, type: "predict",
    show: ["T", "test_a", "check_b", "test_c", "result"],
    title: "Exam trap: method names",
    prompt: "unittest only runs methods whose names START with `test`. How many tests run?",
    code: "import unittest\nclass T(unittest.TestCase):\n    def test_a(self):\n        pass\n    def check_b(self):\n        pass\n    def test_c(self):\n        pass\nresult = unittest.TestResult()\nunittest.defaultTestLoader.loadTestsFromTestCase(T).run(result)\nprint(result.testsRun)",
    answer: "2",
    tips: ["Look at each method name.", "`check_b` does not start with `test`, so it is skipped."],
    explain: "`test_a` and `test_c` run. `check_b` is ignored. A misnamed test method silently never runs."
  }
]);
