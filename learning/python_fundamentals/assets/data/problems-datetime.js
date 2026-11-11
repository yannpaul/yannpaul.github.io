addProblems([
  {
    id: "dt-01", topic: "datetime", level: 1, type: "choice",
    prompt: "Which import makes `datetime.now()` work (without `datetime.datetime.now()`)?",
    options: ["`from datetime import datetime`", "`import datetime`", "`import datetime.now`", "`from datetime import now`"],
    answer: 0,
    why: ["Yes. It brings the class `datetime` into your program, and `now()` is a method of that class.", "That brings in the module. You would need `datetime.datetime.now()`.", "Not valid Python.", "`now` is not a name in the module. It lives inside the class."],
    proof: { code: "import datetime\nprint(hasattr(datetime, 'now'), hasattr(datetime.datetime, 'now'))", out: "False True" },
    tips: ["The module is called `datetime` and so is the class inside it.", "`now()` belongs to the class, not to the module."],
    explain: "The module `datetime` contains a class also named `datetime`, and `now()` belongs to the class. `from datetime import datetime` imports the class directly."
  },
  {
    id: "dt-02", topic: "datetime", level: 3, type: "predict",
    title: "Exam trap: same name, two things",
    prompt: "Your notes show both `import datetime` and `datetime.now()`. What happens if you combine them?",
    code: "import datetime\ntry:\n    print(datetime.now())\nexcept AttributeError:\n    print(\"AttributeError\")",
    answer: "AttributeError",
    tips: ["After `import datetime`, the name `datetime` is the MODULE.", "The module has no `now`. The class inside it does."],
    explain: "With `import datetime`, the name `datetime` is the module, and a module has no `now`. You would write `datetime.datetime.now()`. With `from datetime import datetime`, the name is the class and `datetime.now()` works."
  },
  {
    id: "dt-03", topic: "datetime", level: 1, type: "predict",
    prompt: "What does this print?",
    code: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.year, d.month, d.day)",
    answer: "2024 3 5",
    tips: ["`datetime(year, month, day)` builds a date.", "`.year`, `.month` and `.day` have no parentheses."],
    explain: "The three numbers are year, month and day, in that order."
  },
  {
    id: "dt-04", topic: "datetime", level: 2, type: "predict",
    title: "strftime",
    prompt: "`strftime` (\"string format time\") turns a date into text. `%Y` is the 4-digit year, `%m` the month number and `%d` the day. What does this print?",
    code: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.strftime(\"%Y-%m-%d\"))",
    answer: "2024-03-05",
    tips: ["Each `%` code is replaced; other characters (the dashes) stay as they are.", "`%m` and `%d` always have two digits."],
    explain: "`%Y` is 2024, `%m` is 03 and `%d` is 05, with your dashes in between."
  },
  {
    id: "dt-05", topic: "datetime", level: 2, type: "predict",
    prompt: "`%B` is the full month name. What does this print?",
    code: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.strftime(\"%B %d, %Y\"))",
    answer: "March 05, 2024",
    tips: ["`%B` gives `March`. `%d` gives the day with a leading zero.", "The comma and spaces are copied as they are."],
    explain: "`%B` is the full month name: March. `%d` pads the day to `05`."
  },
  {
    id: "dt-06", topic: "datetime", level: 2, type: "predict",
    prompt: "`%A` is the full weekday name. 5 March 2024 fell on a Tuesday. What does this print?",
    code: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.strftime(\"%A\"))",
    answer: "Tuesday",
    tips: ["Capital `A` is the full weekday name. Lowercase `%a` is the short one, like `Tue`.", "You do not need to work out the weekday yourself. The prompt tells you it is a Tuesday."],
    explain: "`%A` is the full name of the weekday: Tuesday."
  },
  {
    id: "dt-07", topic: "datetime", level: 2, type: "predict",
    title: "weekday()",
    prompt: "`weekday()` returns a number: Monday is 0 and Sunday is 6. 1 January 2024 was a Monday. What does this print?",
    code: "from datetime import datetime\nprint(datetime(2024, 1, 1).weekday())",
    answer: "0",
    tips: ["Monday is 0, not 1.", "Note the parentheses: `weekday` is a method you call."],
    explain: "Monday is 0. The week runs Monday = 0, Tuesday = 1, ... Sunday = 6."
  },
  {
    id: "dt-08", topic: "datetime", level: 3, type: "predict",
    prompt: "7 January 2024 was a Sunday. What does this print?",
    code: "from datetime import datetime\nprint(datetime(2024, 1, 7).weekday())",
    answer: "6",
    tips: ["Count from Monday = 0: Mon 0, Tue 1, Wed 2, Thu 3, Fri 4, Sat 5, Sun 6.", "The prompt says it was a Sunday. Which number is Sunday?"],
    explain: "Sunday is the last day of the week in this numbering, so it is 6."
  },
  {
    id: "dt-09", topic: "datetime", level: 2, type: "choice",
    prompt: "What number does `weekday()` return for a Wednesday?",
    options: ["2", "3", "1", "4"],
    answer: 0,
    why: ["Monday 0, Tuesday 1, Wednesday 2.", "That is Thursday.", "That is Tuesday.", "That is Friday."],
    tips: ["Start counting at Monday = 0.", "Monday 0, Tuesday 1, then Wednesday."],
    explain: "Monday 0, Tuesday 1, Wednesday 2. (If you count from 1 you will be off by one, so remember: Monday is 0.)"
  },
  {
    id: "dt-10", topic: "datetime", level: 2, type: "fill",
    prompt: "Choose the format code that makes the program print `March`.",
    template: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.strftime(\"[[c]]\"))",
    blanks: { c: { options: ["%Y", "%y", "%B", "%d"], answer: "%B" } },
    expectOut: "March",
    tips: ["Which code gives a month NAME, not a number?", "`%B` is the long month name. `%b` is short (Mar)."],
    explain: "`%B` is the full month name. `%Y` is the four-digit year, `%y` the two-digit year and `%d` the day of the month.",
    walkCode: "from datetime import datetime\nd = datetime(2024, 3, 5)\nprint(d.strftime(\"%B\"))"
  },
  {
    id: "dt-11", topic: "datetime", level: 2, type: "predict",
    prompt: "What does this print? (25 December 2024 was a Wednesday.)",
    code: "from datetime import datetime\nprint(datetime(2024, 12, 25).strftime(\"%a %b %d\"))",
    answer: "Wed Dec 25",
    tips: ["Lowercase `%a` is the short weekday and lowercase `%b` is the short month.", "`%d` is the day of the month, with a leading zero if needed."],
    explain: "`%a` gives `Wed`, `%b` gives `Dec` and `%d` gives `25`."
  },
  {
    id: "dt-12", topic: "datetime", level: 3, type: "predict",
    title: "Stretch: adding days",
    prompt: "A `timedelta` is a length of time you can add to a date. This goes a little beyond your notes. What does this print?",
    code: "from datetime import datetime, timedelta\nd = datetime(2024, 3, 5)\nprint((d + timedelta(days=30)).strftime(\"%d %b\"))",
    answer: "04 Apr",
    tips: ["March has 31 days. 5 March plus 26 days is 31 March.", "Four more days gives 4 April."],
    explain: "Adding 30 days to 5 March lands on 4 April. Python does the calendar arithmetic for you."
  },
  {
    id: "dt-13", topic: "datetime", level: 1, type: "choice",
    prompt: "What does `datetime.now()` give you?",
    options: [
      "The current local date and time",
      "Today's date at midnight exactly",
      "The time the file was created",
      "A random date from this year"
    ],
    answer: 0,
    why: ["Yes: it \"grabs the exact current local date and time from your computer system\".", "That would be `datetime.today()` with the time cleared.", "Nothing to do with files.", "Nothing random about it."],
    tips: ["The word \"now\" is a clue.", "Think about what a clock on your computer shows."],
    explain: "`datetime.now()` returns the current date and time, to the microsecond."
  }
]);
