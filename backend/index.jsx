// index.js
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use('/api/user', authRoutes);
app.use('/api/documents', documentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection established'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
