const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../backend/models/user'); // Adjust the path according to your project structure
const config = require('../backend/config/db'); // Adjust the path according to your project structure

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin10', 10);

  const adminUser = new User({
    username: 'Binoj',
    name: 'Binoj',
    email: 'bjs@bjs.com',
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