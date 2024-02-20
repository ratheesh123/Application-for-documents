const mongoose = require('mongoose');
const User = require('./models/user');
const Document = require('./models/document');

mongoose.connect('mongodb+srv://Rat100:aKKbdoq71ZFIVYcM@cluster0.dzcdn59.mongodb.net/Rat100?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find().populate('documents');
    console.log(users);
    process.exit();
  })
  .catch(err => {
    console.error('Database connection or operation failed:', err);
    process.exit(1);
  });
