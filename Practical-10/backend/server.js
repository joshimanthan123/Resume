const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');
const taskEvents = require('./events');
require('./listeners'); // CRITICAL: registers task-created, task-deleted, error listeners at startup
const { eventAuditLogs, addAuditLog } = require('./listeners');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// In-memory fallback task storage
let inMemoryTasks = [
  { _id: '1001', title: 'Implement Node.js EventEmitter in events.js', category: 'Backend', priority: 'High', completed: true, user: 'Manthan' },
  { _id: '1002', title: 'Register task-created Listener in listeners.js', category: 'Events', priority: 'High', completed: true, user: 'Manthan' },
  { _id: '1003', title: 'Demonstrate Non-Blocking API Response Timestamp', category: 'Testing', priority: 'High', completed: true, user: 'Admin' }
];

let isMongoConnected = false;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/awf_practical10';

mongoose.connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB database successfully for Practical 10.');
  })
  .catch(() => {
    console.log('⚠️ MongoDB offline. Using in-memory fallback for Practical 10 EventEmitter test.');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    practical: 'Practical 10: Event-Driven Background Processing',
    isMongoConnected,
    timestamp: new Date().toISOString()
  });
});

// EVENT LOG AUDIT STREAM (For Live Terminal UI)
app.get('/api/events/logs', (req, res) => {
  res.json({
    totalLogs: eventAuditLogs.length,
    logs: eventAuditLogs
  });
});

// SUPPLEMENTARY: Trigger Error Event Endpoint
app.post('/api/events/trigger-error', (req, res) => {
  const customError = new Error('Demonstration error caught by taskEvents error listener!');
  taskEvents.emit('error', customError);
  res.json({
    message: 'Error event emitted successfully',
    errorHandled: true
  });
});

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
  try {
    let tasks;
    if (isMongoConnected) {
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      tasks = [...inMemoryTasks];
    }
    res.json({ data: tasks });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

/**
 * Step 3: Inside the POST /tasks route, emit the event right after saving the task,
 * then respond immediately.
 */
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, category, priority, user } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    let newTask;
    if (isMongoConnected) {
      newTask = await Task.create({
        title,
        category: category || 'General',
        priority: priority || 'Medium',
        user: user || 'System Admin'
      });
    } else {
      newTask = {
        _id: Date.now().toString(),
        title,
        category: category || 'General',
        priority: priority || 'Medium',
        completed: false,
        user: user || 'System Admin',
        createdAt: new Date()
      };
      inMemoryTasks.unshift(newTask);
    }

    const apiResponseTimestamp = new Date().toISOString();
    console.log(`\n================================================================`);
    console.log(`[API] Response sent at ${apiResponseTimestamp}`);
    console.log(`================================================================`);

    addAuditLog('API_RESPONSE_SENT', `[API] HTTP 201 Response sent to client for "${newTask.title}"`, {
      taskId: newTask._id,
      title: newTask.title,
      apiResponseTimestamp
    });

    // Main API response returns immediately (201 Created)
    res.status(201).json({
      message: 'Task created successfully',
      apiResponseTimestamp,
      data: newTask
    });

    // EventEmitter emit call (Handled asynchronously by background listener)
    taskEvents.emit('task-created', newTask);

  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

/**
 * Supplementary Requirement 1: task-deleted event emission
 */
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deletedTask;

    if (isMongoConnected) {
      deletedTask = await Task.findByIdAndDelete(id);
    } else {
      deletedTask = inMemoryTasks.find(t => t._id === id);
      inMemoryTasks = inMemoryTasks.filter(t => t._id !== id);
    }

    const apiResponseTimestamp = new Date().toISOString();
    console.log(`\n[API] Delete response sent at ${apiResponseTimestamp}`);

    addAuditLog('API_RESPONSE_SENT', `[API] HTTP 200 Delete response sent for task ${id}`, {
      taskId: id,
      apiResponseTimestamp
    });

    res.json({
      message: 'Task deleted successfully',
      apiResponseTimestamp,
      deletedTaskId: id
    });

    // Emit task-deleted event AFTER sending response
    taskEvents.emit('task-deleted', deletedTask || { _id: id });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EventEmitter Task API running on http://localhost:${PORT}`);
});
