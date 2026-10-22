const BADGE_CLASSES = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
};

const ICON_BTN =
  "rounded-lg px-2 py-1 text-lg hover:bg-slate-100 dark:hover:bg-slate-700";

// Build the checkbox that toggles a task's done state.
function createCheckbox(task) {
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = task.done;
  box.dataset.action = "toggle";
  box.dataset.focusKey = `${task.id}:toggle`;
  box.setAttribute("aria-label", `Mark "${task.text}" as done`);
  box.className = "h-5 w-5 shrink-0 accent-indigo-600";
  return box;
}

// Build the task text (as plain text only) with strike-through when done.
function createLabel(task) {
  const span = document.createElement("span");
  span.textContent = task.text;
  span.dataset.role = "text";
  span.title = "Double-click to edit";
  const done = "text-slate-400 line-through dark:text-slate-500";
  span.className = `min-w-0 flex-1 break-words ${task.done ? done : ""}`;
  return span;
}

// Build the text input shown while a task is being edited.
function createEditInput(task) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className =
    "edit-input min-w-0 flex-1 rounded-lg border border-indigo-400 bg-white px-2 py-1 dark:bg-slate-900";
  input.setAttribute("aria-label", "Edit task text");
  return input;
}

// Build the coloured priority badge for a task.
function createBadge(task) {
  const badge = document.createElement("span");
  badge.textContent = task.priority;
  badge.className = `rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${BADGE_CLASSES[task.priority]}`;
  return badge;
}

// Build an icon button with an aria-label, tied to an action for delegation.
function createIconButton(task, action, icon, label) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = icon;
  btn.dataset.action = action;
  btn.dataset.focusKey = `${task.id}:${action}`;
  btn.setAttribute("aria-label", `${label}: ${task.text}`);
  btn.className = ICON_BTN;
  return btn;
}

// Build one <li> for a task (normal view or edit view).
function createTaskItem(task, isEditing) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.className = "flex items-center gap-3 py-3";
  li.append(createCheckbox(task));
  li.append(isEditing ? createEditInput(task) : createLabel(task));
  if (!isEditing) {
    li.append(createBadge(task));
    li.append(createIconButton(task, "edit", "✎", "Edit"));
  }
  li.append(createIconButton(task, "delete", "✕", "Delete"));
  return li;
}

// Redraw the whole task list from the visible tasks.
function renderList(listEl, tasks, editingId) {
  listEl.replaceChildren(...tasks.map((t) => createTaskItem(t, t.id === editingId)));
}

// Highlight the active filter button and mark it with aria-pressed.
function renderFilters(filtersEl, filter) {
  const on = "bg-indigo-600 text-white";
  const off = "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  for (const btn of filtersEl.querySelectorAll("button")) {
    const active = btn.dataset.filter === filter;
    btn.setAttribute("aria-pressed", String(active));
    btn.className = `filter-btn rounded-full px-3 py-1 text-sm ${active ? on : off}`;
  }
}

// Pick a friendly empty-state message for the current filter / search.
function emptyMessage(filter, searchText) {
  if (searchText) return "No tasks match your search.";
  if (filter === "active") return "Nothing left to do. Enjoy the break! 🎉";
  if (filter === "completed") return "No completed tasks yet. You've got this!";
  return "No tasks yet. Add your first one above! 📚";
}

// Draw the full UI from the current state (the only place the DOM is rebuilt).
export function renderApp(els, state, visibleTasks) {
  renderList(els.list, visibleTasks, state.editingId);
  renderFilters(els.filters, state.settings.filter);
  const left = state.tasks.filter((t) => !t.done).length;
  els.counter.textContent = `${left} ${left === 1 ? "task" : "tasks"} left`;
  els.empty.textContent = emptyMessage(state.settings.filter, state.searchText);
  els.empty.classList.toggle("hidden", visibleTasks.length > 0);
  els.clear.disabled = !state.tasks.some((t) => t.done);
  els.clear.classList.toggle("opacity-40", els.clear.disabled);
  els.sort.setAttribute("aria-pressed", String(state.settings.sortByPriority));
  els.sort.classList.toggle("bg-indigo-600", state.settings.sortByPriority);
  els.sort.classList.toggle("text-white", state.settings.sortByPriority);
}
