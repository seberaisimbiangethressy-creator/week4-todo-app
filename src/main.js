import "./style.css";
import { loadTasks, saveTasks, loadSettings, saveSettings } from "./storage.js";
import { renderApp } from "./render.js";

const MAX_LENGTH = 100;
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

// Shortcut for document.querySelector.
const $ = (selector) => document.querySelector(selector);

// Every DOM element the app needs, selected once.
const els = {
  form: $("#task-form"),
  input: $("#task-input"),
  priority: $("#priority-select"),
  error: $("#form-error"),
  search: $("#search-input"),
  sort: $("#sort-toggle"),
  filters: $("#filters"),
  list: $("#task-list"),
  empty: $("#empty-state"),
  counter: $("#counter"),
  clear: $("#clear-completed"),
  theme: $("#theme-toggle"),
  dialog: $("#confirm-dialog"),
  confirmText: $("#confirm-text"),
};

// The single source of truth: tasks array + settings + temporary UI state.
const state = {
  tasks: loadTasks(), // [{ id, text, done, priority, createdAt }]
  settings: loadSettings(), // { filter, theme, sortByPriority }
  searchText: "",
  editingId: null,
  pendingDeleteId: null,
  focusEdit: false,
};

/* ---------- Validation & messages ---------- */

// Return an error message for invalid task text, or "" if it is fine.
function validateText(text) {
  if (text === "") return "Please type a task first.";
  if (text.length > MAX_LENGTH) {
    return `Tasks can have at most ${MAX_LENGTH} characters (you typed ${text.length}).`;
  }
  return "";
}

// Show (or clear) the inline error message under the form.
function showError(message) {
  els.error.textContent = message;
  els.input.setAttribute("aria-invalid", String(message !== ""));
}

/* ---------- State changes ---------- */

// Find one task object by its id.
function findTask(id) {
  return state.tasks.find((task) => task.id === id);
}

// Run a state change, then save to localStorage and redraw the UI.
function updateState(changeFn) {
  changeFn();
  saveTasks(state.tasks);
  saveSettings(state.settings);
  showError("");
  render();
}

// Add a new task to the array.
function addTask(text, priority) {
  updateState(() => {
    state.tasks.push({
      id: crypto.randomUUID(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    });
  });
}

// Flip a task between done and not done.
function toggleTask(id) {
  updateState(() => {
    const task = findTask(id);
    if (task) task.done = !task.done;
  });
}

// Remove one task from the array.
function deleteTask(id) {
  updateState(() => {
    state.tasks = state.tasks.filter((task) => task.id !== id);
  });
}

// Save new text for a task; returns false (and shows an error) if invalid.
function editTask(id, newText) {
  const text = newText.trim();
  const error = validateText(text);
  if (error) {
    showError(error);
    return false;
  }
  updateState(() => {
    findTask(id).text = text;
    state.editingId = null;
  });
  return true;
}

// Remove every completed task.
function clearCompleted() {
  updateState(() => {
    state.tasks = state.tasks.filter((task) => !task.done);
  });
}

/* ---------- Derived data ---------- */

// Does a task pass the selected All / Active / Completed filter?
function matchesFilter(task) {
  const filter = state.settings.filter;
  if (filter === "active") return !task.done;
  if (filter === "completed") return task.done;
  return true;
}

// Return the tasks to show: filtered, searched, and optionally sorted by priority.
function getVisibleTasks() {
  const query = state.searchText.toLowerCase();
  const list = state.tasks.filter(
    (task) => matchesFilter(task) && task.text.toLowerCase().includes(query),
  );
  if (state.settings.sortByPriority) {
    list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }
  return list;
}

/* ---------- Rendering ---------- */

// Switch dark mode on or off by toggling the "dark" class on <html>.
function applyTheme() {
  document.documentElement.classList.toggle("dark", state.settings.theme === "dark");
}

// Put keyboard focus back where it was after the list has been rebuilt.
function restoreFocus(focusKey) {
  if (state.focusEdit) {
    const input = els.list.querySelector(".edit-input");
    if (input) {
      input.focus();
      input.select();
    }
    state.focusEdit = false;
  } else if (focusKey) {
    const target = els.list.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`);
    if (target) target.focus();
  }
}

// Redraw the UI from state, keeping the keyboard focus position.
function render() {
  const focusKey = document.activeElement ? document.activeElement.dataset.focusKey : undefined;
  renderApp(els, state, getVisibleTasks());
  applyTheme();
  restoreFocus(focusKey);
}

/* ---------- Event handlers ---------- */

// Handle the add-task form (Enter key or Add button).
function handleSubmit(event) {
  event.preventDefault();
  const text = els.input.value.trim();
  const error = validateText(text);
  if (error) {
    showError(error);
    return;
  }
  addTask(text, els.priority.value);
  els.input.value = "";
  els.input.focus();
}

// Enter edit mode for a task.
function startEdit(id) {
  state.editingId = id;
  state.focusEdit = true;
  showError("");
  render();
}

// Leave edit mode without saving.
function cancelEdit() {
  state.editingId = null;
  showError("");
  render();
}

// Open the confirmation dialog before deleting a task.
function askDelete(id) {
  state.pendingDeleteId = id;
  els.confirmText.textContent = `"${findTask(id).text}"`;
  els.dialog.returnValue = "";
  els.dialog.showModal();
}

// Delegated click on the list: Edit and Delete buttons.
function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.closest("li").dataset.id;
  if (button.dataset.action === "edit") startEdit(id);
  if (button.dataset.action === "delete") askDelete(id);
}

// Delegated change on the list: the done checkbox.
function handleListChange(event) {
  if (event.target.dataset.action !== "toggle") return;
  toggleTask(event.target.closest("li").dataset.id);
}

// Delegated double-click on the list: edit the task text in place.
function handleListDblClick(event) {
  const text = event.target.closest('[data-role="text"]');
  if (!text) return;
  startEdit(text.closest("li").dataset.id);
}

// Delegated keydown on the list: Enter saves, Escape cancels an edit.
function handleListKeydown(event) {
  if (!event.target.classList.contains("edit-input")) return;
  const id = event.target.closest("li").dataset.id;
  if (event.key === "Enter") {
    event.preventDefault();
    editTask(id, event.target.value);
  } else if (event.key === "Escape") {
    cancelEdit();
  }
}

// Delete the pending task if the dialog was closed with "Delete".
function handleDialogClose() {
  if (els.dialog.returnValue === "confirm" && state.pendingDeleteId !== null) {
    deleteTask(state.pendingDeleteId);
  }
  state.pendingDeleteId = null;
}

// Change the selected filter when a filter button is clicked.
function handleFilterClick(event) {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  updateState(() => {
    state.settings.filter = button.dataset.filter;
  });
}

// Filter the list as the user types in the search box.
function handleSearch(event) {
  state.searchText = event.target.value.trim();
  render();
}

// Turn "sort by priority" on or off.
function handleSortToggle() {
  updateState(() => {
    state.settings.sortByPriority = !state.settings.sortByPriority;
  });
}

// Switch between light and dark theme.
function handleThemeToggle() {
  updateState(() => {
    state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
  });
}

// Keyboard shortcut: "/" jumps to the new-task input.
function handleShortcut(event) {
  const tag = event.target.tagName;
  if (event.key !== "/" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
  event.preventDefault();
  els.input.focus();
}

/* ---------- Start up ---------- */

// Attach all event listeners (the list uses event delegation) and draw the first screen.
function init() {
  els.form.addEventListener("submit", handleSubmit);
  els.list.addEventListener("click", handleListClick);
  els.list.addEventListener("change", handleListChange);
  els.list.addEventListener("dblclick", handleListDblClick);
  els.list.addEventListener("keydown", handleListKeydown);
  els.filters.addEventListener("click", handleFilterClick);
  els.search.addEventListener("input", handleSearch);
  els.sort.addEventListener("click", handleSortToggle);
  els.theme.addEventListener("click", handleThemeToggle);
  els.clear.addEventListener("click", clearCompleted);
  els.dialog.addEventListener("close", handleDialogClose);
  document.addEventListener("keydown", handleShortcut);
  render();
}

init();
