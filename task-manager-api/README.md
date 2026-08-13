# Task Manager API (Practical 5: MongoDB & Mongoose Integration)

An Express RESTful API for task management integrated with a MongoDB database using Mongoose.

## Directory Structure

```
task-manager-api/
├── models/
│   └── Task.js           # Mongoose Task Schema and hook
├── node_modules/         # Node dependencies
├── .env                  # Environment connection variables (git-ignored)
├── .env.example          # Environment variables template
├── .gitignore            # Excluded files
├── package.json          # Dependencies configuration
├── server.js             # Express connection and controllers
└── README.md             # Project documentation & Key answers
```

## Features & Route Lifecycle

The application processes requests through the following pipeline:
1. **JSON Body Parser**: Standard `express.json()` parses payload JSON.
2. **Request Logger Middleware**: Logs every incoming request method, path, and timestamp.
3. **Content-Type Validation**: Rejects POST & PUT requests lacking a `Content-Type: application/json` header structure with status `400` or `415`.
4. **Task Routes**:
   - `GET /tasks` - Lists tasks fetched from MongoDB.
   - `GET /tasks/:id` - Fetches single task (Mongoose ID validate).
   - `POST /tasks` - Stores a task (validates schema inputs, trims `title` via pre-save hook, supports priority enum).
   - `PUT /tasks/:id` - Updates task fields (applies Mongoose verification).
   - `DELETE /tasks/:id` - Deletes task.
5. **404 Undefined Route Handler**: Handles unregistered routes cleanly in JSON.
6. **Global Error Handler**: Captures all errors forwarded via `next(err)`:
   - Formats Mongoose `ValidationError` and enum errors into neat client-safe fields.
   - Hides detailed trace logs from general runtime failures, outputting a generic `500` error.

---

## Mongoose Schema Design (`models/Task.js`)

* **title**: String, required.
* **description**: String.
* **completed**: Boolean, default `false`.
* **priority**: String, enum: `["low", "medium", "high"]`, default `medium`.
* **createdAt**: Date, default `Date.now`.

### Custom Hook: Title Trimmer
We implement a Mongoose pre-save hook on the schema:
```javascript
taskSchema.pre('save', function(next) {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  next();
});
```

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
- Local MongoDB Server (running on `mongodb://127.0.0.1:27017`)
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
3. Set up the environment variables:
   Copy `.env.example` into `.env`:
   ```bash
   cp .env.example .env
   ```
   Modify connection strings in `.env` if necessary.
4. Run the server:
   ```bash
   node server.js
   ```
   The server launches at `http://localhost:5000`.

---

## API Documentation

### 1. GET `/tasks`
- **Description**: Returns all tasks in the MongoDB collection.
- **Response Code**: `200 OK`

### 2. GET `/tasks/:id`
- **Description**: Returns a specific task using its MongoDB ObjectId.
- **Response Code**: `200 OK` (or `404 Not Found` if task not found)

### 3. POST `/tasks`
- **Description**: Creates a new task in MongoDB.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "   Complete Practical 5   ",
    "description": "Integrate MongoDB with Mongoose",
    "priority": "high"
  }
  ```
- **Response Code**: `201 Created`
- **Response Body** (spaces in title trimmed automatically):
  ```json
  {
    "_id": "64d8a5fbd23547285c53ff3c",
    "title": "Complete Practical 5",
    "description": "Integrate MongoDB with Mongoose",
    "completed": false,
    "priority": "high",
    "createdAt": "2026-08-13T10:00:00.000Z",
    "__v": 0
  }
  ```

### 4. PUT `/tasks/:id`
- **Description**: Updates task params (supports partial updating and runs validators).
- **Headers**: `Content-Type: application/json`
- **Route Parameters**: `id` must be a valid 24-character hexadecimal MongoDB ObjectId.
- **Request Body**:
  ```json
  {
    "title": "Practical 5 integration complete",
    "completed": true
  }
  ```
- **Response Code**: `200 OK` (or `404 Not Found` if task not found)

### 5. DELETE `/tasks/:id`
- **Description**: Removes task from MongoDB.
- **Route Parameters**: `id` must be a valid 24-character hexadecimal MongoDB ObjectId.
- **Response Code**: `200 OK` (or `404 Not Found` if task not found)

### 6. Validation and Error Cases
- **Invalid ID on PUT/DELETE**: `PUT /tasks/abc` -> returns `400 Bad Request` with `{"error": "Invalid Task ID format. Must be a valid 24-character hexadecimal MongoDB ObjectId."}`.
- **Validation Failure (Missing Title)**: `POST /tasks` with no title field -> returns `400 Bad Request` with:
  ```json
  {
    "error": "Validation failed",
    "details": {
      "title": "Path \"title\" is required."
    }
  }
  ```
- **Validation Failure (Invalid Priority Enum)**: `POST /tasks` with `"priority": "urgent"` -> returns `400` with:
  ```json
  {
    "error": "Validation failed",
    "details": {
      "priority": "`urgent` is not a valid enum value for path `priority`."
    }
  }
  ```
- **Exception Verification**: `GET /trigger-error` -> throws error, returns `500 Internal Server Error` with `{"error": "Something went wrong"}`.
