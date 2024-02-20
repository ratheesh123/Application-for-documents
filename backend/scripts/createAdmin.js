// createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Adjust the path according to your project structure
const config = require('../config/db'); // Adjust the path according to your project structure

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('deepa100', 10);

  const adminUser = new User({
    username: 'gautam',
    name: 'gau',
    email: 'gau@rat.com',
    password: hashedPassword,
    role: 'admin',
  });

  try {
    await adminUser.save();
    console.log('Admin user created successfully.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
  mongoose.disconnect(); // Disconnect from the database
}

// Connect to MongoDB
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    createAdmin(); // Call createAdmin here
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
  });
