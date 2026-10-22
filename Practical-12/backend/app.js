const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory task storage (used in CI — no real MongoDB needed)
let inMemoryTasks = [
  { _id: '1001', title: 'Setup GitHub Actions CI Pipeline', category: 'DevOps', priority: 'High', completed: true, user: 'Manthan' },
  { _id: '1002', title: 'Write Jest tests for Task API', category: 'Testing', priority: 'High', completed: true, user: 'Manthan' },
  { _id: '1003', title: 'Configure npm test script', category: 'Backend', priority: 'Medium', completed: true, user: 'Admin' }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    practical: 'Practical 12: CI/CD Pipeline with GitHub Actions',
    timestamp: new Date().toISOString()
  });
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json({ data: inMemoryTasks });
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title, category, priority, user } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }
  const newTask = {
    _id: Date.now().toString(),
    title,
    category: category || 'General',
    priority: priority || 'Medium',
    completed: false,
    user: user || 'System Admin',
    createdAt: new Date().toISOString()
  };
  inMemoryTasks.unshift(newTask);
  res.status(201).json({ message: 'Task created successfully', data: newTask });
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const exists = inMemoryTasks.find(t => t._id === id);
  if (!exists) {
    return res.status(404).json({ message: 'Task not found' });
  }
  inMemoryTasks = inMemoryTasks.filter(t => t._id !== id);
  res.json({ message: 'Task deleted successfully', deletedTaskId: id });
});

module.exports = app;
