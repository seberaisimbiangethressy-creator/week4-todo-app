#  Study Planner ✨

**Student Name:** Thressy Ange Isimbi Sebera
**Project:** Week 4 — Themed To-Do List App
**Technologies:** HTML, Tailwind CSS v4, Vite, Vanilla JavaScript

## 1. Project Description

The project is a simple, responsive To-Do List application designed to help students organise their studies, manage daily tasks, and track their progress.

The application uses a clean purple theme to create a calm and focused working environment. It allows users to add, edit, complete, delete, search, and filter tasks. Tasks and preferences are saved in the browser using `localStorage`, so they remain available after refreshing the page.

## 2. Project Links

**GitHub Repository:**
[PASTE YOUR PUBLIC GITHUB REPOSITORY LINK HERE]

**Live Application:**
[PASTE YOUR DEPLOYED NETLIFY, VERCEL, OR GITHUB PAGES LINK HERE]

**Demo Video (3–5 minutes):**
https://docs.google.com/videos/d/1MT4aAN7pIcpdLb6lVyTEyfNVUXEmjLG8w01RQAbUK_c/play?usp=sharing


## 3. Features

### Required Features

1. **Add Tasks:** Add tasks using the form button or the Enter key.
2. **Input Validation:** Display an error message for empty tasks or tasks exceeding 100 characters.
3. **Complete Tasks:** Mark tasks as completed or active using a checkbox.
4. **Delete Tasks:** Remove tasks after confirming the deletion.
5. **Edit Tasks:** Edit task descriptions in place. Press Enter to save or Escape to cancel.
6. **Task Filters:** Filter tasks by All, Active, or Completed.
7. **Task Counter:** Display the number of remaining tasks with correct singular and plural wording.
8. **Clear Completed:** Remove all completed tasks with one action.
9. **Data Persistence:** Save tasks and the selected filter in `localStorage`.
10. **Empty State:** Display helpful messages when no tasks match the selected filter.

### Extra Features

11. **Priority Levels:** Assign High, Medium, or Low priority to tasks using coloured badges.
12. **Dark Mode:** Switch between light and dark themes. The selected theme is remembered after refreshing the page.
13. **Search:** Search tasks instantly by typing in the search field.
14. **Progress Bar:** Display the percentage of completed tasks.
15. **Keyboard Shortcut:** Press `/` outside an input field to focus the search box.

## 4. User Stories

- As a student, I want to add tasks quickly so that I can organise my schoolwork.
- As a student, I want to mark tasks as completed so that I can track my progress.
- As a student, I want to edit or delete tasks when my plans change.
- As a student, I want to filter and search my tasks so that I can find specific activities easily.
- As a student, I want my tasks to remain saved after refreshing the page.
- As a student, I want to assign priority levels so that I can focus on important tasks first.
- As a student, I want to change the theme so that I can choose a comfortable viewing experience.

## 5. Application State

All tasks are stored in a JavaScript array of objects. Each task contains an ID, description, completion status, priority level, and creation timestamp.

Example task object:

```javascript
{
  id: "unique-task-id",
  text: "Revise database notes",
  done: false,
  priority: "high",
  createdAt: Date.now()
}
```

The application uses a `render()` function to update the interface whenever the state changes.

Data is stored in the browser using these localStorage keys:

- `focusflow.tasks` — task information
- `focusflow.filter` — selected task filter
- `focusflow.theme` — selected colour theme

## 6. Screenshots

### Desktop View

![Desktop 1280px](screenshot desktop.png)

### Mobile View

![Mobile 360px](screenshot mobile.png)




## 7. Challenges and What I Learned

During this project, I learned how to organise application data using an array of objects and update the interface through a single `render()` function. I improved my understanding of JavaScript DOM manipulation and event listeners. I learned how event delegation makes it possible to handle interactions with dynamically created task elements. I also learned how to use JSON and `localStorage` to preserve application data between page refreshes. To improve security, I used `textContent` to display task descriptions instead of inserting user input with `innerHTML`. I practised input validation, task editing, filtering, and keyboard accessibility. Finally, I used browser DevTools to investigate and fix a bug involving ## Challenges and What I Learned

One challenge I faced while developing FocusFlow was making sure that tasks remained saved after refreshing the page. At first, task data could be lost because the application was not correctly saving and loading tasks from `localStorage`. I used the browser's Developer Tools to inspect the Console and Application tabs, then fixed the issue by saving the tasks array to `localStorage` whenever a task changed and loading the saved data when the application started. This helped me understand how browser storage works and how to debug JavaScript problems. I also learned how to use event listeners and event delegation to handle interactions with dynamically created tasks. Building this application improved my understanding of JavaScript arrays, DOM manipulation, validation, and responsive design with Tailwind CSS. I also learned the importance of testing each feature and ensuring that user-entered task text is displayed safely as plain text.
## 8. Technologies Used

- **HTML5:** Application structure and accessible form elements.
- **Tailwind CSS v4:** Responsive styling and layout.
- **Vite:** Development server and production build tool.
- **Vanilla JavaScript:** Application state, event handling, validation, and rendering.
- **localStorage:** Persistent storage of tasks and preferences.
- **Git and GitHub:** Version control and project hosting.

## 9. How to Run the Project Locally

### Prerequisites

Install Node.js and npm on your computer.

### Installation

1. Clone the repository:

```bash
git clone PASTE_YOUR_REPOSITORY_URL_HERE
```

2. Enter the project folder:

```bash
cd week4-todo-app
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

### Production Build

To build the application for deployment, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## 10. Deployment

This application can be deployed using Netlify, Vercel, or GitHub Pages.

For Netlify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

After deployment, add the live application URL to the Project Links section of this README.

## 11. Demo Video

The demonstration video will show the required features, extra features, data persistence, localStorage contents, the XSS test string displayed as plain text, and an explanation of the application's state, `render()` function, and event delegation.

**Video link:** [ADD YOUR DEMO VIDEO LINK HERE]

## 12. Repository Progress

This repository should contain at least 10 meaningful commits showing the development process, including project setup, styling, task creation, validation, completion, editing, filtering, persistence, extra features, and documentation.

---

**Developed by:** Thressy Ange Isimbi Sebera
**Course Assignment:** Week 4 — Themed To-Do List App
