const express = require('express');
const app = express();

// 1. Request logging middleware applied globally
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// 2. Content-Type validation middleware on POST & PUT
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType) {
      return res.status(400).json({ error: 'Missing Content-Type header' });
    }
    if (!contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
});

// 3. JSON body parser middleware (required for parsing req.body)
app.use(express.json());

// In-memory data store for tasks (temporary)
let tasks = [
  { id: 1, title: 'Learn Express', description: 'Understand middleware pipelines in Node.js', completed: false },
  { id: 2, title: 'Build REST API', description: 'Implement complete CRUD routes and validations', completed: true }
];

// Helper to find highest ID for new tasks
const getNextId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
};

// Route-specific Validation Middleware for Task ID format
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);
  
  // Checks if input matches the parsed base-10 number and is a positive integer
  if (isNaN(parsedId) || String(parsedId) !== id || parsedId <= 0) {
    return res.status(400).json({
      error: 'Invalid Task ID format. Task ID must be a positive integer.'
    });
  }
  
  // Attach the parsed ID to the request object for path handlers
  req.parsedId = parsedId;
  next();
};

// CRUD Routes

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed. "title" is required and must be a non-empty string.'
    });
  }

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    completed: completed === true
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update an existing task (with route-specific ID validation)
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const id = req.parsedId;
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found.` });
  }

  const { title, description, completed } = req.body;

  // Partial updates validation
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: '"title" must be a non-empty string.' });
    }
    tasks[taskIndex].title = title.trim();
  }

  if (description !== undefined) {
    tasks[taskIndex].description = typeof description === 'string' ? description.trim() : '';
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: '"completed" must be a boolean value.' });
    }
    tasks[taskIndex].completed = completed;
  }

  res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete an existing task (with route-specific ID validation)
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const id = req.parsedId;
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found.` });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({
    message: 'Task deleted successfully.',
    task: deletedTask
  });
});

// Helper testing endpoint to trigger unhandled exception for error handler verification
app.get('/trigger-error', (req, res, next) => {
  next(new Error('Deliberately triggered server error for testing.'));
});

// 4. custom 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// 5. Global Error Handling Middleware (must be defined last)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler] Caught error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong',
    message: err.message
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
