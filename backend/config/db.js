require('dotenv').config();

const config = {
  mongodbUri: process.env.MONGODB_URI || '',
};

module.exports = config;
