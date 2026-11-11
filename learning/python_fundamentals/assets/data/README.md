# Problem data: how to add problems

Every problem is a JavaScript object in one of the `problems-<topic>.js` files, wrapped in `addProblems([ ... ])`. Pages never name these files directly: they load `load.js`, which lists them. After adding or changing problems, run:

    node python_fundamentals/tools/check.mjs

It runs every problem against real Python and fails if any stated answer, walkthrough state or test is wrong.

## Common fields

| Field | Meaning |
| --- | --- |
| `id` | Unique, like `prec-07`. Never reuse or renumber ids: they key the learner's saved progress. |
| `topic` | One of the ids in `topics.js` |
| `level` | 1 warm-up, 2 core, 3 exam trap |
| `type` | `predict`, `choice`, `multi`, `yesno`, `fill`, `code` |
| `title` | Optional heading. Use `"From class: ..."` for questions copied from her notes. |
| `prompt` | The question. Text in backticks becomes `code`; `**bold**` works. |
| `tips` | At least 2. Revealed one at a time, smallest nudge first. |
| `explain` | Why the answer is right. Shown after she answers or gives up. |
| `walk` | Optional hand-written step-by-step (see below). Without it, "Full walkthrough" traces the code live. |

## By type

**predict** (type the output): `code`, `answer` (exact printed text; several lines joined with `\n`), optional `accept: [...]`, optional `argv: [...]` and `stdin: "..."`.

**choice**: `options: [...]`, `answer: <index>`, optional `why: [...]` (one line per option, shown after).

**multi**: `options`, `answers: [<index>, ...]`, optional `why`.

**yesno**: `code` (run first), then `statements: [{ s: "a == b", answer: true, why: "..." }]`. Each `s` is evaluated against the code's results.

**fill**: `template` with `[[name]]` markers, and `blanks: { name: { options: [...], answer: "..." } }`. The checker fills in the answers and runs the code. Add `stdin` if it calls `input()`, `expectOut` to assert the output, or `run: false` if it cannot run.

**code** (write a function): `starter`, `solution`, `tests: [{ call: "f(2)", expect: 4 }]` (or `out:` for printed text), and `walkCall: "print(f(2))"` for the walkthrough. The checker proves the solution passes and the starter does not.

## Walkthroughs

`walk` is a list of steps `[line, note, vars, out, locals]`:

- `line`: the line being explained (1-based); `null` for the final step
- `note`: plain English. Describe what the *previous* line just did and what the highlighted line will do next. The picture shows the state *before* the highlighted line runs, like Python Tutor.
- `vars`: global names as `repr()` would show them. `"5@1"` means value 5 in object #1. Two names with the same `@tag` point at the same object.
- `out`: everything printed so far (optional)
- `locals`: `[{ name: "double()", vars: { x: "4" } }]` for a function frame (optional)

The checker requires every step to match a real moment of the program (same line, same variables), so a typo cannot slip through. If a step needs a state that never really happens, the walkthrough is telling a story Python does not, so rewrite the step.

## Adding a topic

    python3 python_fundamentals/tools/new_lesson.py 11 loops "Loops" --section "Day 3"

creates a lesson skeleton and a problems file, and registers the topic.
