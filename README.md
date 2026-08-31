# Practical 7: Authentication and Middleware Pipeline

Full Stack Integration — React + Node.js + Express + MongoDB + JWT + bcryptjs

## Project Overview

This application is a full-stack Task Management System updated for **Practical 7: Authentication and Middleware Pipeline**. It extends Practical 6 by integrating secure **JWT (JSON Web Token)** authentication, **bcryptjs** password hashing, Express **validation middleware**, and **user task ownership isolation**.

The application ensures that all task CRUD routes are protected and only accessible to authenticated users, isolating tasks so users can only view, update, or delete their own data.

---

## Architecture & Data Flow

```text
               +-----------------------------+
               |  React Frontend (Port 5173) |
               +--------------+--------------+
                              |
                     Headers: Authorization: Bearer <JWT>
                              |
                              v
               +-----------------------------+
               | Express Backend (Port 5000) |
               +--------------+--------------+
                              |
       +----------------------+----------------------+
       |                      |                      |
       v                      v                      v
+--------------+      +---------------+      +---------------+
| Auth Routes  |      | Auth & Valid  |      | Task Routes   |
| /register    |      | Middleware    |      | (Protected)   |
| /login, /me  |      | JWT + bcrypt  |      | /tasks        |
+------+-------+      +-------+-------+      +-------+-------+
       |                      |                      |
       +----------------------+----------------------+
                              |
                              v
               +-----------------------------+
               | MongoDB Database            |
               | Users & User-Owned Tasks    |
               +-----------------------------+
```

### Authentication Flow
1. **User Registration (`POST /register`)**: Input validated (email format, password min length) -> Password hashed using `bcryptjs` (salt 10) -> Saved to MongoDB.
2. **User Login (`POST /login`)**: Input validated -> Email lookup -> Password hash compared with `bcrypt.compare()` -> Signed JWT token issued (expires in 1 hour).
3. **Protected Requests**: React frontend includes `Authorization: Bearer <token>` header in requests to `/tasks` and `/me`.
4. **Auth Middleware (`authMiddleware`)**: Verifies JWT signature using secret key (`JWT_SECRET`) -> Decodes payload -> Attaches user ID to `req.user`.
5. **Ownership Check**: All task queries (`GET`, `POST`, `PUT`, `DELETE`) filter data strictly by `user: req.user.id`.
6. **401 Response Handling**: If token is missing, invalid, or expired, Express returns `401 Unauthorized`. Frontend automatically clears token, logs user out, and redirects to the Sign In / Register UI.

---

## Technologies Used

* **Frontend**: React 19, React Router 7, Vite, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Authentication & Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), Environment Variables (`dotenv`)
* **Database & ORM**: MongoDB, Mongoose
* **Middleware**: `authMiddleware`, `validationMiddleware`, CORS (`cors`), Body Parser (`express.json()`)
* **API Testing**: Automated Node API test runner (`test-auth-api.js`)

---

## Environment Variables (`.env`)

The backend uses a `.env` file for configuration (kept out of Git via `.gitignore`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=super_secret_jwt_key_practical_7_2026
```

An example configuration file is provided in `task-manager-api/.env.example`.

---

## Features & Implementation Summary

* **User Authentication (`/register`, `/login`, `/me`)**:
  * Passwords securely hashed with `bcryptjs`.
  * Safe user output (password hashes automatically omitted via Mongoose `toJSON` transformation).
  * `/me` endpoint returns verified active user info.
* **Input Validation Middleware (`validationMiddleware.js`)**:
  * Express middleware validates registration inputs, login credentials, and task creation/update payloads.
  * Rejects invalid inputs early with `400 Bad Request` and descriptive error details.
* **Authentication Middleware (`authMiddleware.js`)**:
  * Protects task endpoints by enforcing valid `Bearer <token>` headers.
* **Task Ownership Isolation**:
  * `Task` Mongoose schema includes `user` reference field.
  * `GET /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` filter strictly by `req.user.id`.
* **Frontend State & Token Management (`src/api.js`, `Auth.jsx`)**:
  * Stores JWT securely in `localStorage`.
  * Automatically injects `Authorization: Bearer <token>` in header of API calls.
  * Intercepts `401 Unauthorized` responses to clear local session and display login screen.
  * Header displays active user badge and a Logout button.

---

## Project Structure

```text
AWF/
├── package.json               # Frontend dependencies & scripts (Vite, React)
├── index.html
├── src/
│   ├── api.js                 # Centralized API service with JWT injection & 401 handling
│   ├── App.jsx                # Router & global user authentication state
│   ├── components/
│   │   ├── Auth.jsx           # Sign In & Registration form UI component
│   │   ├── NavBar.jsx         # Header with user email badge & logout button
│   │   └── Footer.jsx
│   └── pages/
│       ├── Projects.jsx       # Task workspace (renders Auth UI when unauthenticated)
│       ├── Home.jsx
│       ├── Contact.jsx
│       └── NotFound.jsx
└── task-manager-api/          # Express + MongoDB + Auth Backend
    ├── .env                   # Environment variables (JWT_SECRET, MONGO_URI, PORT)
    ├── .env.example           # Template for environment configuration
    ├── package.json           # Backend dependencies (express, mongoose, jwt, bcryptjs)
    ├── server.js              # Express server with Auth & Protected Task endpoints
    ├── models/
    │   ├── User.js            # User Mongoose schema (email, password hash, toJSON transform)
    │   └── Task.js            # Task schema with user ownership reference field
    ├── middleware/
    │   ├── authMiddleware.js  # JWT verification middleware
    │   └── validationMiddleware.js # Express input validation middleware
    ├── test-auth-api.js       # Automated 12-scenario Auth & API integration test runner
    └── test-api.js            # Practical 6 legacy test runner
```

---

## Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB daemon running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas string in `.env`).

---

### 1. Backend Setup & Server Run

```bash
# Navigate to backend directory
cd task-manager-api

# Install dependencies
npm install

# Ensure .env file exists with JWT_SECRET
# Start Express backend server
node server.js
```

Backend will run on: `http://localhost:5000`

---

### 2. Frontend Setup & Run

```bash
# Open a new terminal in project root
cd d:\CE\sem5\AWF

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run on: `http://localhost:5173/tasks`

---

## API Endpoints Reference

### Authentication Endpoints (Public)

| Method | Endpoint | Description | Request Body Example | Response |
|---|---|---|---|---|
| `POST` | `/register` | Register new user account | `{ "email": "user@example.com", "password": "password123" }` | `201 Created` + User object |
| `POST` | `/login` | Authenticate & obtain JWT | `{ "email": "user@example.com", "password": "password123" }` | `200 OK` + JWT Token & User |

### Auth & Task Endpoints (Protected - Header required: `Authorization: Bearer <token>`)

| Method | Endpoint | Description | Request Body Example | Response |
|---|---|---|---|---|
| `GET` | `/me` | Get active user details | None | `200 OK` + Safe User object |
| `GET` | `/tasks` | Get user's tasks | None | `200 OK` + Task Array |
| `GET` | `/tasks/:id` | Get single user task | None | `200 OK` or `404 Not Found` |
| `POST` | `/tasks` | Create task owned by user | `{ "title": "Lab 7", "priority": "high", "status": "pending" }` | `201 Created` + Task object |
| `PUT` | `/tasks/:id` | Update task owned by user | `{ "title": "Lab 7 (Done)", "status": "completed" }` | `200 OK` + Updated Task object |
| `DELETE` | `/tasks/:id` | Delete task owned by user | None | `200 OK` (`{ "message": "Task deleted successfully" }`) |

---

## Testing & Verification Results

### 1. Automated Backend Integration Tests (`test-auth-api.js`)

Run test suite:
```bash
cd task-manager-api
node test-auth-api.js
```

**Results: 12 / 12 Test Cases Passed (100%)**

1. `POST /register` — Valid User Registration -> `201 Created` (**PASS**)
2. `POST /register` — Duplicate Email Rejection -> `400 Bad Request` (**PASS**)
3. `POST /register` — Invalid Input Validation -> `400 Bad Request` (**PASS**)
4. `POST /login` — Valid User Login & JWT Generation -> `200 OK` (**PASS**)
5. `POST /login` — Incorrect Password Rejection -> `401 Unauthorized` (**PASS**)
6. Protected `GET /tasks` — Access Without Token -> `401 Unauthorized` (**PASS**)
7. Protected `GET /tasks` — Access With Valid Bearer Token -> `200 OK` (**PASS**)
8. `GET /me` — Retrieve Current User Details (Omit Password Hash) -> `200 OK` (**PASS**)
9. Protected `GET /tasks` — Access With Invalid Token -> `401 Unauthorized` (**PASS**)
10. Protected `GET /tasks` — Access With Malformed Auth Header -> `401 Unauthorized` (**PASS**)
11. `POST /tasks` — Task Validation Missing Title -> `400 Bad Request` (**PASS**)
12. Multi-User Task Ownership Isolation — User 2 Accessing User 1 Task -> `404 Not Found` (**PASS**)

---

### 2. End-to-End Browser Flow Verification

| Test Scenario | Action | Expected Result | Status |
|---|---|---|---|
| **Registration** | Register `student_ui_test@example.com` | Password hashed, user saved in MongoDB, auto-logged in | **PASS** |
| **Protected Workspace** | View task workspace after login | Header shows user email, token stored in `localStorage` | **PASS** |
| **Task Creation** | Create task "Practical 7 End to End Verification Task" | Task saved with `user` ID reference in MongoDB | **PASS** |
| **Logout** | Click Logout in header | Token & user removed from local storage, UI displays Auth card | **PASS** |
| **Re-login & Isolation** | Log back in with registered credentials | Dashboard reloads only tasks owned by that account | **PASS** |
| **401 Interception** | Clear token manually & make request | Intercepted 401 error, user redirected back to Login UI | **PASS** |
