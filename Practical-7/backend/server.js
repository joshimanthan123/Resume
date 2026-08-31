require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./models/Task');
const User = require('./models/User');
const authMiddleware = require('./middleware/auth');
const { validateRegister, validateLogin, validateTaskInput } = require('./middleware/validation');

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
    process.exit(1);
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

// ================= AUTHENTICATION ROUTES =================

// POST /register - Register a new user
app.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash password with bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save User to MongoDB
    await User.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /login - Authenticate user & generate JWT
app.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /me - Retrieve safe details of current authenticated user
app.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      id: user._id,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
});

// ================= PROTECTED TASK ROUTES =================

// GET /tasks - Fetch all tasks owned by authenticated user
app.get('/tasks', authMiddleware, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Fetch a single task by ID owned by authenticated user
app.get('/tasks/:id', authMiddleware, validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create a new task for authenticated user
app.post('/tasks', authMiddleware, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, status, priority } = req.body;
    const taskData = {
      title,
      description,
      completed,
      priority,
      user: req.user.id
    };
    if (status) taskData.status = status;
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id - Update an existing task owned by authenticated user
app.put('/tasks/:id', authMiddleware, validateTaskId, validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, status, priority } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access unauthorized' });
    }

    Object.assign(task, updateData);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete a task by ID owned by authenticated user
app.delete('/tasks/:id', authMiddleware, validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or access unauthorized' });
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
  console.error('[Global Error Handler] Caught error:', err);

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

  res.status(500).json({
    error: 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
