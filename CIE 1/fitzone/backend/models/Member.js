const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Member email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Member phone number is required'],
    minlength: [10, 'Phone number must be at least 10 characters long']
  },
  membershipType: {
    type: String,
    enum: {
      values: ['basic', 'premium', 'platinum'],
      message: '{VALUE} is not a valid membership type'
    },
    default: 'basic'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
