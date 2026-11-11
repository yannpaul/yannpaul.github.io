addProblems([
  {
    id: "file-01", topic: "files", level: 2, type: "fill",
    title: "From class: read the file if it exists",
    prompt: "Select the code to read and print the text file being opened, if the file already exists. If it does not exist, print a message saying so.",
    template: "import os.path\n\nif os.path.[[a]]('work.txt') == True:\n    workFile = open('work.txt', 'r')\n    workFileFirstLine = workFile.[[b]]()\nelse:\n    print(\"The work file is not in this folder.\")",
    blanks: {
      a: { options: ["exists", "open", "check", "isopen"], answer: "exists" },
      b: { options: ["read", "seek", "write", "exists"], answer: "read" }
    },
    expectOut: "The work file is not in this folder.",
    tips: [
      "Once `os.path` is imported, one of its functions checks whether a file exists.",
      "`read()` reads the contents of a file. `seek()` jumps to a position. `readline()` reads one line.",
      "The second blank has to READ the file, since the question says \"read and print\"."
    ],
    explain: "`os.path.exists('work.txt')` is True if the file is there. `workFile.read()` reads the whole file. The name `workFileFirstLine` suggests `readline()`, which reads just the first line, but your class answer is `read()`. Notice that `read()` reads EVERYTHING, so the name is misleading. Treat that as a quirk of the test. When you run this code here, the file does not exist, so it prints the \"not in this folder\" message."
  },
  {
    id: "file-02", topic: "files", level: 2, type: "choice",
    prompt: "What does opening a file with mode `'w'` do if the file already exists?",
    options: [
      "Erases it and starts writing fresh",
      "Adds the new text at the end",
      "Opens it for reading only",
      "Stops with an error message"
    ],
    answer: 0,
    why: ["Yes. `'w'` means write, and it wipes what was there.", "That is `'a'`, append.", "That is `'r'`, read.", "`'w'` does not complain: it silently overwrites."],
    tips: ["`'w'` stands for write.", "Think about opening a notebook and tearing out every page first."],
    explain: "`'w'` overwrites. If the file already has content, it is gone the moment you open it. Use `'a'` to add to the end."
  },
  {
    id: "file-03", topic: "files", level: 2, type: "choice",
    prompt: "Which mode adds text to the END of an existing file, without erasing it?",
    options: ["`'a'`", "`'w'`", "`'r'`", "`'e'`"],
    answer: 0,
    why: ["Yes: append.", "`'w'` erases first.", "`'r'` only reads.", "There is no `'e'` mode."],
    tips: ["Think of the first letter of \"append\".", "`'r'` is read, `'w'` is write."],
    explain: "`'a'` is append mode: new text goes after the existing text."
  },
  {
    id: "file-04", topic: "files", level: 1, type: "choice",
    prompt: "What mode does `open('notes.txt')` use if you give no mode at all?",
    options: ["`'r'`, read", "`'w'`, write", "`'a'`, append", "No mode: it fails"],
    answer: 0,
    why: ["Yes: the default is read.", "Write would erase the file, so it is never a default.", "Append is not the default.", "It works fine."],
    tips: ["The safest mode is the default.", "Which mode cannot damage the file?"],
    explain: "The default is `'r'`: read only. It is the safest choice."
  },
  {
    id: "file-05", topic: "files", level: 2, type: "multi",
    title: "From class: choose two",
    prompt: "Which statements about this code, which writes a message to an existing log file at the start of each day, are true? (Choose two.)",
    code: "with open('log.txt', 'w') as file:\n    file.write('Daily Log')\n    file.close()",
    options: [
      "A `file.open()` statement needs to be added at the beginning",
      "The log file is overwritten each time it is opened",
      "The text in the write function adds itself to the end of the log file",
      "The close function is not needed"
    ],
    answers: [1, 3],
    why: [
      "`open(...)` in the `with` line already opens the file.",
      "True: mode `'w'` erases what was there.",
      "False: that would be mode `'a'`.",
      "True: a `with` block closes the file for you at the end."
    ],
    tips: ["Look at the mode letter in the `open` call.", "What does a `with` block do when it ends?"],
    explain: "The mode `'w'` overwrites the file every time, so the file only ever holds the latest message. A `with` block closes the file automatically, so `file.close()` is not needed. To add to the log instead, use `'a'`."
  },
  {
    id: "file-06", topic: "files", level: 2, type: "predict",
    title: "Write, then read",
    prompt: "What does this print? (This code really writes a small file in the Python sandbox.)",
    code: "with open(\"note.txt\", \"w\") as f:\n    f.write(\"hello\")\nwith open(\"note.txt\") as f:\n    print(f.read())",
    answer: "hello",
    tips: ["The first block creates `note.txt` and puts `hello` in it.", "The second block opens it for reading and prints what is inside."],
    explain: "The first `with` writes `hello`. The second opens the file in read mode (the default) and `read()` gives the text back."
  },
  {
    id: "file-07", topic: "files", level: 3, type: "predict",
    title: "Exam trap: w twice",
    prompt: "What does this print?",
    code: "with open(\"log.txt\", \"w\") as f:\n    f.write(\"one\\n\")\nwith open(\"log.txt\", \"w\") as f:\n    f.write(\"two\\n\")\nwith open(\"log.txt\") as f:\n    print(f.read())",
    answer: "two",
    tips: ["Mode `'w'` erases the file each time it is opened.", "So when the second block opens it, \"one\" is already gone."],
    explain: "The second `'w'` wiped out `one` before writing `two`. This is exactly the problem with the daily log in your class question."
  },
  {
    id: "file-08", topic: "files", level: 2, type: "predict",
    title: "Append keeps what was there",
    prompt: "Same idea, but with `'a'`. What does this print? (Two lines of output.)",
    code: "with open(\"log2.txt\", \"w\") as f:\n    f.write(\"one\\n\")\nwith open(\"log2.txt\", \"a\") as f:\n    f.write(\"two\\n\")\nwith open(\"log2.txt\") as f:\n    print(f.read())",
    answer: "one\ntwo",
    tips: ["The first block starts a fresh file.", "The second block appends, so `two` goes after `one`."],
    explain: "`'a'` adds at the end. The file holds `one` and `two`, each on its own line."
  },
  {
    id: "file-09", topic: "files", level: 3, type: "predict",
    title: "read vs. readline",
    prompt: "`readline()` reads one line, including its newline character. `read()` reads whatever is left. What does this print?",
    code: "with open(\"abc.txt\", \"w\") as f:\n    f.write(\"a\\nb\\n\")\nwith open(\"abc.txt\") as f:\n    print(len(f.readline()), len(f.read()))",
    answer: "2 2",
    tips: ["The file holds four characters: `a`, newline, `b`, newline.", "`readline()` takes `a\\n` (2 characters). `read()` takes what is left: `b\\n` (2 characters)."],
    explain: "The newline counts as a character. The first line is `a\\n` (length 2) and what remains is `b\\n` (length 2). The reading position moves forward as you read."
  },
  {
    id: "file-10", topic: "files", level: 2, type: "predict",
    title: "From class: sys.argv[0]",
    prompt: "A program is started with the command `python app.py 5 hello`. So `sys.argv` holds the words on that line. What does this print?",
    code: "import sys\nprint(sys.argv[0])",
    argv: ["app.py", "5", "hello"],
    answer: "app.py",
    tips: ["`sys.argv` is a list of the words typed on the command line.", "Index 0 is the first word after `python`."],
    explain: "`sys.argv[0]` is the name of the script that is running. Your class question asks what the 0 represents: it is the file name. The arguments start at index 1.",
    walk: [
      [1, "`import sys` loads the module that talks to the interpreter. Because the command was `python app.py 5 hello`, `sys.argv` is the list `['app.py', '5', 'hello']`.", {}],
      [2, "`sys.argv[0]` is the first item of that list: the script's own file name, `app.py`.", {}],
      [null, "Output: app.py.", {}, "app.py"]
    ]
  },
  {
    id: "file-11", topic: "files", level: 2, type: "predict",
    prompt: "The command is `python app.py 5 hello`. What does this print?",
    code: "import sys\nprint(sys.argv[2], len(sys.argv))",
    argv: ["app.py", "5", "hello"],
    answer: "hello 3",
    tips: ["Index 0 is `app.py`, index 1 is `5`, index 2 is `hello`.", "`len` counts all the items, including the script name."],
    explain: "`sys.argv[2]` is `hello`. There are three items (script name plus two arguments), so `len(sys.argv)` is 3."
  },
  {
    id: "file-12", topic: "files", level: 3, type: "predict",
    title: "Exam trap: arguments are text",
    prompt: "The command is `python app.py 5`. What does this print?",
    code: "import sys\nprint(sys.argv[1] + sys.argv[1])",
    argv: ["app.py", "5"],
    answer: "55",
    tips: ["Everything on the command line arrives as TEXT, even digits.", "Adding two strings glues them together."],
    explain: "`sys.argv[1]` is the string `'5'`, not the number 5. Adding strings joins them: `'5' + '5'` is `'55'`. To do maths, convert first: `int(sys.argv[1])`."
  },
  {
    id: "file-13", topic: "files", level: 2, type: "choice",
    title: "From class: what does the 0 mean?",
    prompt: "When using `sys.argv[0]` in a command prompt as part of running a Python app, what does the 0 represent?",
    options: [
      "The name of the script being run",
      "The first argument you typed",
      "The number of arguments typed",
      "The exit code of the script"
    ],
    answer: 0,
    why: ["Yes. Index 0 is the file name.", "The first argument you typed is `sys.argv[1]`.", "That is `len(sys.argv) - 1`.", "The exit code is a different thing altogether."],
    tips: ["`sys.argv` is a list, and list indexes start at 0.", "What is the first word of the command after `python`?"],
    explain: "In `python app.py 5 hello`, `sys.argv` is `['app.py', '5', 'hello']`. The 0 is the position of the file name."
  },
  {
    id: "file-14", topic: "files", level: 1, type: "predict",
    prompt: "What does this print? (Assume there is no file called `nope.txt`.)",
    code: "import os.path\nprint(os.path.exists(\"nope.txt\"))",
    answer: "False",
    tips: ["`os.path.exists` answers with True or False.", "The file is not there."],
    explain: "`exists` gives `False` when there is no such file. You usually check this before opening a file you only want to read."
  },
  {
    id: "file-15", topic: "files", level: 2, type: "predict",
    title: "What does with do?",
    prompt: "What does this print? A `with` block closes the file automatically when it ends.",
    code: "with open(\"t.txt\", \"w\") as f:\n    f.write(\"x\")\nprint(f.closed)",
    answer: "True",
    tips: ["`f.closed` is True when the file has been closed.", "The `print` is after the `with` block has finished."],
    explain: "When the `with` block ends, Python closes the file for you. That is why the `file.close()` in your class question was not needed."
  }
]);
