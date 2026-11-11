// Shared retrieval-practice quiz component, copied from go_cli_basics'
// Lesson 13 capstone recap.
// Markup contract:
// <div class="quiz" data-answer="b">
//   <p class="quiz-question">...</p>
//   <ul class="quiz-options">
//     <li data-option="a" data-explain="...">...</li>
//     <li data-option="b" data-explain="...">...</li>
//   </ul>
//   <p class="quiz-feedback"></p>
// </div>
// One attempt per question, immediate feedback, then locked — this is
// retrieval practice, not a form to be resubmitted until correct.
// Option text (the <li>'s own content) must be a neutral, standalone claim,
// never prefixed with "Correct"/"Incorrect" — this script only adds CSS
// classes on click, it never hides or rewrites that visible text.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".quiz").forEach((quiz) => {
    const answer = quiz.dataset.answer;
    const options = quiz.querySelectorAll(".quiz-options li");
    const feedback = quiz.querySelector(".quiz-feedback");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        if (quiz.dataset.answered === "true") return;
        quiz.dataset.answered = "true";

        options.forEach((other) => {
          other.classList.add("disabled");
          if (other.dataset.option === answer) {
            other.classList.add("correct");
          } else if (other === option) {
            other.classList.add("incorrect");
          }
        });

        const wasRight = option.dataset.option === answer;
        const correctOption = quiz.querySelector(`[data-option="${answer}"]`);
        const explain = wasRight
          ? option.dataset.explain
          : correctOption
          ? correctOption.dataset.explain
          : "";

        feedback.textContent = (wasRight ? "Right. " : "Not quite. ") + (explain || "");
        feedback.classList.add("visible");
      });
    });
  });
});
