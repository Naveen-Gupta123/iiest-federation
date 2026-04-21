# IIEST Federation – To-Do List Application

A full-stack To-Do List application built with **Angular**, **Node.js (Express)**, and **MongoDB**.

## Live Demo (Single Browser)
Open `index.html` directly in any browser — no server required. Data persists in `localStorage`.

---

## Project Structure

```
iiest-federation/
├── index.html                          ← Standalone browser demo (no build needed)
├── README.md
│
├── backend/                            ← Node.js + Express + MongoDB
│   ├── server.js
│   ├── package.json
│   └── __tests__/
│       └── tasks.test.js
│
└── frontend/                           ← Angular application
    └── src/app/
        ├── services/
        │   ├── task.service.ts
        │   └── task.service.spec.ts
        └── components/
            ├── task-list/
            │   ├── task-list.component.ts
            │   ├── task-list.component.html
            │   └── task-list.component.spec.ts
            └── task-form/
                └── task-form.component.ts
```

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | Angular 17+             |
| Backend  | Node.js + Express 4     |
| Database | MongoDB + Mongoose 8    |
| Testing  | Jasmine (Angular), Jest (Node) |

---

## Features

- **Add Task** — Create tasks with Assigned To, Status, Due Date, Priority, Description
- **View Tasks** — Paginated table with search/filter
- **Edit Task** — Inline edit via modal form
- **Delete Task** — Confirmation dialog before deletion
- **Search** — Real-time search across all task fields
- **Pagination** — Configurable page size (5/10/20/50)
- **Responsive** — Works on desktop and mobile

---

## Getting Started

### 1. Quick Start (Single Browser File)
```bash
# Just open index.html in your browser — no installation required!
open index.html
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/iiest_federation" > .env
echo "PORT=5000" >> .env

# Start MongoDB (if running locally)
mongod

# Start server
npm start
# Development with auto-reload:
npm run dev
```

### 3. Angular Frontend Setup
```bash
# Install Angular CLI globally if not already installed
npm install -g @angular/cli

cd frontend
npm install
ng serve
# App runs at http://localhost:4200
```

---

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/tasks         | Get all tasks (paginated)|
| GET    | /api/tasks/:id     | Get single task          |
| POST   | /api/tasks         | Create new task          |
| PUT    | /api/tasks/:id     | Update task              |
| DELETE | /api/tasks/:id     | Delete task              |

### Query Parameters (GET /api/tasks)
| Param  | Default | Description             |
|--------|---------|-------------------------|
| search | ""      | Filter tasks by keyword |
| page   | 1       | Page number             |
| limit  | 20      | Tasks per page          |

---

## Running Tests

### Angular Unit Tests
```bash
cd frontend
ng test
# With coverage:
ng test --code-coverage
```

### Node.js Backend Tests
```bash
cd backend
npm test
```

---

## Task Fields

| Field       | Type   | Required | Options                              |
|-------------|--------|----------|--------------------------------------|
| assignedTo  | String | Yes      | User 1 – User 5                      |
| status      | String | Yes      | Not Started / In Progress / Completed|
| dueDate     | String | No       | Date string (YYYY-MM-DD)             |
| priority    | String | Yes      | Low / Normal / High                  |
| comments    | String | No       | Free text                            |

---

## Screenshots

**Screen 1 – Task List**
Paginated table showing all tasks with search, add, and row-level edit/delete actions.

**Screen 2 – New Task**
Form modal to create a new task with required field validation.

**Screen 3 – Edit Task**
Same form pre-populated with the selected task's data.

**Screen 4 – Delete Confirmation**
Red-header modal asking to confirm deletion by task name.

---

## License
MIT
