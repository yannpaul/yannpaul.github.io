// Persists todo-item checkbox state per page in localStorage, purely a
// personal-progress convenience. It proves nothing to the teacher and is
// never read back by anyone but the browser that set it.
// Markup contract:
// <li class="todo-item" data-todo-id="unique-within-page">
//   <div class="todo-item-head">
//     <input type="checkbox" id="...">
//     <label for="...">...</label>
//   </div>
//   <div class="todo-item-body">...optional details.reveal hint...</div>
// </li>
document.addEventListener("DOMContentLoaded", () => {
  const storeKey = "go_cli_basics:todo:" + location.pathname;
  let done = {};
  try {
    done = JSON.parse(localStorage.getItem(storeKey) || "{}");
  } catch (e) {
    done = {};
  }

  document.querySelectorAll("li.todo-item").forEach((item) => {
    const id = item.dataset.todoId;
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!id || !checkbox) return;

    if (done[id]) {
      checkbox.checked = true;
      item.classList.add("done");
    }

    checkbox.addEventListener("change", () => {
      item.classList.toggle("done", checkbox.checked);
      done[id] = checkbox.checked;
      try {
        localStorage.setItem(storeKey, JSON.stringify(done));
      } catch (e) {
        /* private browsing or storage disabled — checkbox still works, just doesn't persist */
      }
    });
  });
});
