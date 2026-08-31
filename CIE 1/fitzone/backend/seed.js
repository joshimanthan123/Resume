require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const ClassBooking = require('./models/ClassBooking');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Member.deleteMany({});
    await Trainer.deleteMany({});
    await ClassBooking.deleteMany({});
    console.log('Cleared existing database records.');

    // Create a sample member
    const sampleMember = await Member.create({
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '9876543210',
      membershipType: 'premium'
    });
    console.log('Created sample member:', sampleMember.name);

    // Create sample trainers
    const trainersData = [
      {
        name: 'John Doe',
        specialization: 'Yoga & Mindfulness',
        available: true
      },
      {
        name: 'Jane Smith',
        specialization: 'Pilates & Core Training',
        available: true
      },
      {
        name: 'Bob Johnson',
        specialization: 'Strength & Conditioning',
        available: false
      }
    ];

    const sampleTrainers = await Trainer.insertMany(trainersData);
    console.log(`Created ${sampleTrainers.length} sample trainers.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
