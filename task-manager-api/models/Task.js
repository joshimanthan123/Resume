const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Path "title" is required.'],
  },
  description: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'in-progress', 'completed'],
      message: '`{VALUE}` is not a valid enum value for path `status`.'
    },
    default: 'pending',
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '`{VALUE}` is not a valid enum value for path `priority`.'
    },
    default: 'medium',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for task ownership.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre-save hook to automatically trim title and synchronize completed & status fields
taskSchema.pre('save', function() {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
  if (this.status === 'completed') {
    this.completed = true;
  } else if (this.completed && !this.isModified('status')) {
    this.status = 'completed';
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
