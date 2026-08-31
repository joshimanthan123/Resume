require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import all three Mongoose models to verify they load correctly
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const ClassBooking = require('./models/ClassBooking');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FitZone Gym & Class Booking System API (Phase 1)',
    version: '1.0.0',
    status: 'Healthy',
    modelsLoaded: {
      Member: !!Member,
      Trainer: !!Trainer,
      ClassBooking: !!ClassBooking
    }
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database, then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('FitZone models verified and loaded successfully.');
    });
  } catch (error) {
    console.error('Server failed to start:', error.message);
  }
};

startServer();
