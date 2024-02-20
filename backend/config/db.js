require('dotenv').config();

const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://Rat100:aKKbdoq71ZFIVYcM@cluster0.dzcdn59.mongodb.net/Rat100?retryWrites=true&w=majority',
};

module.exports = config;
