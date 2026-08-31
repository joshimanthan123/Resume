const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email address.'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure password is never included in JSON output
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
