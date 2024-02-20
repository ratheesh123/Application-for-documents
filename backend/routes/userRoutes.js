const express = require('express');
const User = require('../models/user'); // Ensure this path is correct
const router = express.Router();

router.get('/api/users', async (req, res) => {
  try {
    // Fetch all users except those with 'admin' role and populate their 'documents'
    const users = await User.find({ role: { $ne: 'admin' } }).populate({
      path: 'documents', // Ensure this matches the field name in your User schema
      model: 'Document' // Ensure this matches the name given to mongoose.model() for your Document schema
    });

    if (!users.length) {
      return res.status(404).send({ message: 'No users found.' });
    }

    console.log("Populated Users:", users);
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
