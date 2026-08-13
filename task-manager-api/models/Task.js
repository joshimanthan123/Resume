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
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '`{VALUE}` is not a valid enum value for path `priority`.'
    },
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Pre-save hook to automatically trim whitespace from the title
taskSchema.pre('save', function() {
  if (this.title && typeof this.title === 'string') {
    this.title = this.title.trim();
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
