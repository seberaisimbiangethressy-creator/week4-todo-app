const TASKS_KEY = "studyPlanner.tasks";
const SETTINGS_KEY = "studyPlanner.settings";
const PRIORITIES = ["high", "medium", "low"];

// Read and parse JSON from localStorage, returning a fallback if missing or broken.
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Check that a value loaded from storage looks like a real task object.
function isValidTask(task) {
  return (
    typeof task === "object" &&
    task !== null &&
    typeof task.id === "string" &&
    typeof task.text === "string" &&
    typeof task.done === "boolean" &&
    PRIORITIES.includes(task.priority)
  );
}

// Load the saved tasks array (empty array if nothing valid is saved).
export function loadTasks() {
  const data = readJSON(TASKS_KEY, []);
  return Array.isArray(data) ? data.filter(isValidTask) : [];
}

// Save the tasks array to localStorage as JSON.
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Pick the starting theme: saved choice first, otherwise the OS preference.
function defaultTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Load settings (filter, theme, sortByPriority) with safe defaults.
export function loadSettings() {
  const saved = readJSON(SETTINGS_KEY, {});
  const filters = ["all", "active", "completed"];
  return {
    filter: filters.includes(saved.filter) ? saved.filter : "all",
    theme: saved.theme === "dark" || saved.theme === "light" ? saved.theme : defaultTheme(),
    sortByPriority: saved.sortByPriority === true,
  };
}

// Save the settings object to localStorage as JSON.
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
