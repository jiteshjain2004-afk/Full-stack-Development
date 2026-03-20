# Todo App — MERN Stack CRUD

## Tech Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React 18 + MUI + Axios

## Features
- ✅ Create todos with title, description, priority
- ✅ Read all todos with filter (all/active/completed)
- ✅ Update — edit title, toggle complete
- ✅ Delete — single todo or clear all completed
- ✅ Search todos by title
- ✅ Progress bar showing completion %

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/todos | Get all todos (with filters) |
| POST | /api/todos | Create new todo |
| PUT | /api/todos/:id | Update todo |
| PATCH | /api/todos/:id/toggle | Toggle complete |
| DELETE | /api/todos/:id | Delete todo |
| DELETE | /api/todos/completed/all | Clear completed |

## Run Locally
```bash
# Terminal 1 — Backend
cd server && npm install && npm start

# Terminal 2 — Frontend
cd client && npm install && npm start
```

## Course Outcomes Covered
- CO1: React, Node.js, MongoDB fundamentals
- CO2: Interactive responsive React UI
- CO3: RESTful API + MongoDB integration
- CO4: Error handling, loading states
- CO5: Full-stack deployment
