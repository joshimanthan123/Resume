# Practical 6

Full Stack Integration — React + Node.js + Express + MongoDB

## Project Overview

This application is a full-stack Task Management System built for **Practical 6: Full Stack Integration**. It seamlessly connects a modern **React (Vite)** single-page frontend with a **Node.js + Express** REST API and a **MongoDB** database managed via **Mongoose**.

The application supports complete **CRUD** operations with real-time UI synchronization, granular loading indicators, error boundary notifications, and persistent MongoDB storage.

---

## Architecture

```
React Frontend (Port 5173)
       │
       ▼  fetch API (JSON)
Express Backend (Port 5000)
       │
       ▼  Mongoose ORM
MongoDB Database (task_manager)
```

**Data Flow:**
1. User interacts with UI (Create / Edit / Delete / Toggle Task).
2. React frontend sends HTTP request (`GET`, `POST`, `PUT`, `DELETE`) via centralized `src/api.js`.
3. Express backend parses payload, applies middleware (CORS, JSON validation, ID validation), and interacts with MongoDB via Mongoose.
4. Express returns JSON status response.
5. React receives backend confirmation, updates local state, and displays success/error notification toasts.

---

## Technologies Used

* **Frontend**: React 19, React Router 7, Vite, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database & ORM**: MongoDB, Mongoose
* **Middleware**: CORS (`cors`), Body Parser (`express.json()`)
* **HTTP Client**: Native Fetch API with centralized service wrapper (`src/api.js`)

---

## Features

* **Create Task (`POST /tasks`)**: Form validation, status/priority selection, loading state, success toast notification, immediate state update.
* **View Tasks (`GET /tasks`)**: Initial fetch spinner, filtering by status (`Pending`, `In Progress`, `Completed`), filtering by priority (`High`, `Medium`, `Low`), live search bar.
* **Update Task (`PUT /tasks/:id`)**: Edit modal pre-filled with current task details, status toggle buttons, operation loading spinner, persistence across browser reloads.
* **Delete Task (`DELETE /tasks/:id`)**: Custom interactive confirmation modal (`"Are you sure you want to permanently delete this task?"`), loading spinner, state removal only after server confirmation.
* **MongoDB Data Persistence**: Full retention of created, updated, and deleted tasks across page refreshes.
* **Granular Loading States**: Operation-specific spinners (`loadingTasks`, `creatingTask`, `updatingTaskId`, `deletingTaskId`).
* **Error Handling & Notifications**: Informative toast alert banners and retry options on network failure.

---

## Project Structure

```
AWF/
├── package.json               # Frontend dependencies & scripts (Vite, React)
├── index.html
├── src/
│   ├── api.js                 # Centralized API service (BASE_URL = http://localhost:5000)
│   ├── App.jsx                # Main router (/tasks, /, /contact)
│   ├── components/
│   │   ├── NavBar.jsx         # Navigation bar with dark mode toggle
│   │   └── Footer.jsx
│   └── pages/
│       ├── Projects.jsx       # Task Management full-stack React UI
│       ├── Home.jsx
│       ├── Contact.jsx
│       └── NotFound.jsx
└── task-manager-api/          # Express + MongoDB Backend
    ├── package.json           # Backend dependencies (express, mongoose, cors, dotenv)
    ├── server.js              # Express server with CORS & CRUD endpoints
    ├── models/
    │   └── Task.js            # Mongoose Task schema (title, description, status, priority, createdAt)
    └── test-api.js            # Mongoose integration test suite
```

---

## Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB daemon running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string configured in `.env`).

---

### 1. Backend Setup & Run

```bash
# Navigate to backend directory
cd task-manager-api

# Install backend dependencies
npm install

# Start Express backend server
node server.js
```

Backend will run on:
`http://localhost:5000`

---

### 2. Frontend Setup & Run

```bash
# Open a new terminal and navigate to project root
cd d:\CE\sem5\AWF

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run on:
`http://localhost:5173/tasks`

---

## URLs

* **Frontend**: `http://localhost:5173` (or `http://localhost:5173/tasks`)
* **Backend**: `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Description | Request Payload Example | Response |
|---|---|---|---|---|
| `GET` | `/tasks` | Retrieve all tasks sorted by creation date | None | Array of Task objects (`200 OK`) |
| `GET` | `/tasks/:id` | Retrieve single task by ID | None | Task object (`200 OK`) or Error (`404 Not Found`) |
| `POST` | `/tasks` | Create a new task in MongoDB | `{ "title": "Finish Lab", "description": "Practical 6", "priority": "high", "status": "pending" }` | Created Task object (`201 Created`) |
| `PUT` | `/tasks/:id` | Update an existing task by ID | `{ "title": "Finish Lab (Done)", "status": "completed", "completed": true }` | Updated Task object (`200 OK`) |
| `DELETE` | `/tasks/:id` | Delete task by ID from MongoDB | None | `{ "message": "Task deleted successfully" }` (`200 OK`) |

---

## Testing Procedure & Results

### Automated Backend Tests
Run the backend test suite:
```bash
cd task-manager-api
node test-api.js
```
* **Results**: `13/13 PASSED` (covers array return, trim pre-save hook, missing headers, validation errors, invalid ID format, valid but missing ID 404, PUT validation, DELETE, and 500 error handler).

---

### End-to-End Browser CRUD Testing

| Test Step | Action | Expected Result | Status |
|---|---|---|---|
| 1. Initial Fetch | Load `http://localhost:5173/tasks` | Display loading spinner then load MongoDB tasks | **PASS** |
| 2. Create Task | Submit title, description, priority, status | `POST /tasks` sent, success toast shown, task added to list | **PASS** |
| 3. Update Task | Edit title & status via Edit modal | `PUT /tasks/:id` sent, success toast shown, UI updated | **PASS** |
| 4. Refresh Persistence | Reload browser tab | Created & updated tasks persist from MongoDB | **PASS** |
| 5. Delete Task | Click Delete & confirm in custom modal | `DELETE /tasks/:id` sent, success toast shown, task removed | **PASS** |
| 6. Delete Persistence | Reload browser tab | Deleted task does not reappear | **PASS** |
| 7. Error Handling | Stop backend server & attempt action | UI shows descriptive error banner/toast without crashing | **PASS** |

---

## Common Issues and Solutions

### 1. CORS Error (`Access-Control-Allow-Origin`)
* **Cause**: React frontend running on port 5173 was blocked when fetching Express backend on port 5000.
* **Solution**: Installed `cors` package in `task-manager-api` and added CORS middleware before routes:
  ```js
  const cors = require('cors');
  app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
  ```

### 2. Missing Content-Type Header (400 Bad Request)
* **Cause**: Backend content-type middleware rejected POST/PUT requests lacking `Content-Type: application/json`.
* **Solution**: Added explicit header in `src/api.js`:
  ```js
  headers: { 'Content-Type': 'application/json' }
  ```

### 3. Stale UI after Operations
* **Cause**: React UI state not reflecting server updates after database operations.
* **Solution**: Updated local React state strictly using the confirmed JSON response returned by the backend server.

### 4. Native Browser `window.confirm` Dialog Blocking Automation
* **Cause**: Standard browser confirm dialogs block headless subagents and can be accidentally bypassed.
* **Solution**: Created a custom React Delete Confirmation Modal overlay (`taskToDelete` state) with "Yes, Delete Task" and "Cancel" buttons for accessible interaction.
