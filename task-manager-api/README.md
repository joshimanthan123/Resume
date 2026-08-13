# Task Manager RESTful API (Practical 4)

A lightweight Task Management backend server built using Node.js and Express. It features in-memory CRUD operations, custom global & route-specific middlewares, robust validation, and exception handling.

## Directory Structure

```
task-manager-api/
├── node_modules/         # Node dependencies
├── .gitignore            # Excluded directories (node_modules)
├── package.json          # Project details and dependencies
├── server.js             # Express application & routing logic
└── README.md             # Project documentation & Analysis answers
```

## Features & Route Lifecycle

The application processes requests through the following pipeline:
1. **Request Logger Middleware**: Logs every incoming requests with a timestamp.
2. **Content-Type Validation**: Rejects POST & PUT requests lacking a `Content-Type: application/json` header structure with status `400` or `415`.
3. **JSON Parser**: Standard `express.json()` reads Request-Body JSON.
4. **Task Routes**:
   - `GET /tasks` - Lists tasks.
   - `POST /tasks` - Adds a task (requires valid title).
   - `PUT /tasks/:id` - Updates task (requires valid task ID and valid fields).
   - `DELETE /tasks/:id` - Deletes task (requires valid task ID).
5. **404 Undefined Route Handler**: Handles unregistered routes cleanly in JSON.
6. **Global Error Handler**: Captures all errors forwarded via `next(err)` and returns a structured `500` error safely.

---

## Detailed Answers to Lab Questions / Code Analysis

### 1. Why must the error handling middleware be defined last in the middleware chain?
Express resolves middlewares and routes sequentially in registration order. When an error is thrown or forwarded via `next(err)`, Express aborts regular route processing and searches downstream in the middleware stack for the next middleware with 4 parameters: `(err, req, res, next)`. 
- If the error handler is defined *before* the routes, it cannot catch errors thrown inside those route handlers.
- Placing it at the list's tail ensures it intercepts all errors that happen upper-in-the-pipeline.

### 2. What is the difference between `app.use()` and route-specific middleware?
- **`app.use()` (Global/Path-level Middleware)**: Applied to all incoming requests matching the prefix path (or all paths if no prefix is given) and works for every HTTP method (GET, POST, PUT, DELETE). Example: Logging and request parsing.
- **Route-specific Middleware**: Registered as an argument inside individual route methods (e.g. `app.put('/tasks/:id', validateTaskId, ...)`). It executes *only* if the request matches both the exact HTTP method and route pattern. Example: Validation of task ID structure on update/delete endpoints.

### 3. Why is it considered bad practice to send raw error stack traces to the client?
- **Security Penetration Risks**: Raw stack traces reveal backend details, such as physical file paths on the server, database structures, internal function names, third-party module versions, and library paths. Malicious actors could leverage this information to locate vulnerability entry points.
- **Information Disclosure**: Internal variables, system states, or database logs may be included inside trace prints.
- **User Interface Integrity**: Stack traces are unintelligible to regular visitors. Interfaces should instead receive deterministic, client-safe error payloads (e.g. `{ "error": "Something went wrong" }`).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

1. Navigate to the project folder:
   ```bash
   cd task-manager-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   node server.js
   ```
   The server launches at `http://localhost:5000`.

---

## API Documentation

### 1. GET `/tasks`
- **Description**: Returns all tasks in the in-memory array.
- **Response Code**: `200 OK`
- **Response Body**:
  ```json
  [
    {
      "id": 1,
      "title": "Learn Express",
      "description": "Understand middleware pipelines in Node.js",
      "completed": false
    }
  ]
  ```

### 2. POST `/tasks`
- **Description**: Creates a new task in memory.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Clean room",
    "description": "Dust the library and wipe tables",
    "completed": false
  }
  ```
- **Response Code**: `201 Created`
- **Response Body**:
  ```json
  {
    "id": 3,
    "title": "Clean room",
    "description": "Dust the library and wipe tables",
    "completed": false
  }
  ```

### 3. PUT `/tasks/:id`
- **Description**: Updates task params (supports partial updating).
- **Headers**: `Content-Type: application/json`
- **Route Parameters**: `id` must be a positive integer.
- **Request Body**:
  ```json
  {
    "title": "Clean room updated",
    "completed": true
  }
  ```
- **Response Code**: `200 OK` (or `404 Not Found` if task not found)
- **Response Body**:
  ```json
  {
    "id": 3,
    "title": "Clean room updated",
    "description": "Dust the library and wipe tables",
    "completed": true
  }
  ```

### 4. DELETE `/tasks/:id`
- **Description**: Removes task from memory.
- **Route Parameters**: `id` must be a positive integer.
- **Response Code**: `200 OK` (or `404 Not Found` if task not found)
- **Response Body**:
  ```json
  {
    "message": "Task deleted successfully.",
    "task": {
      "id": 3,
      "title": "Clean room updated",
      "description": "Dust the library and wipe tables",
      "completed": true
    }
  }
  ```

### 5. Validation and Error Trigger routes
- **Invalid ID on PUT/DELETE**: `PUT /tasks/abc` -> returns `400 Bad Request` with `{"error": "Invalid Task ID format. Task ID must be a positive integer."}`.
- **Missing JSON Headers**: `POST /tasks` with no headers -> returns `400 Bad Request` with `{"error": "Missing Content-Type header"}`.
- **Exception Verification endpoint**: `GET /trigger-error` -> throws error, returns `500 Internal Server Error` with `{"error": "Something went wrong", "message": "Deliberately triggered server error for testing."}`.
