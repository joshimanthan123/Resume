require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const cors = require('cors');

const app = express();

// Configure CORS for frontend origin (http://localhost:5173)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));

// Establish connection to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Fail fast and let the administrator know
  });

// 1. JSON body parser middleware (Must be configured first to parse JSON body payloads)
app.use(express.json());

// 2. Global logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next();
});

// 3. Content-Type Validation Middleware (rejection on POST & PUT lacking JSON header)
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

// Route-specific Task ID validation middleware
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid Task ID format. Must be a valid 24-character hexadecimal MongoDB ObjectId.'
    });
  }
  next();
};

// CRUD Routes

// GET /tasks - Fetch all tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Fetch a single task by ID
app.get('/tasks/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, completed, status, priority } = req.body;
    const taskData = { title, description, completed, priority };
    if (status) taskData.status = status;
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', validateTaskId, async (req, res, next) => {
  try {
    const { title, description, completed, status, priority } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    Object.assign(task, updateData);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({
      message: 'Task deleted successfully',
      task
    });
  } catch (error) {
    next(error);
  }
});

// Helper testing endpoint to trigger 500 error for unhandled exception testing
app.get('/trigger-error', (req, res, next) => {
  next(new Error('Deliberate unhandled db server connection crash.'));
});

// Custom 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Global error handler middleware (must be defined last in the pipeline)
app.use((err, req, res, next) => {
  // Log the localized raw stack trace internally for administrative debugging
  console.error('[Global Error Handler] Caught error:', err);

  // Check if it is a Mongoose validation exception
  if (err.name === 'ValidationError') {
    const details = {};
    for (const key in err.errors) {
      details[key] = err.errors[key].message;
    }
    return res.status(400).json({
      error: 'Validation failed',
      details
    });
  }

  // Hide general internal exception parameters from the client
  res.status(500).json({
    error: 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
