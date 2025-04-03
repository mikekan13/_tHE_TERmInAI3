// server/config/db.js
const mongoose = require('mongoose');
const config = require('config');
let db;

try {
  db = config.get('mongoURI');
} catch (error) {
  console.warn('MongoDB URI not configured:', error.message);
  db = 'mongodb://localhost:27017/growth-terminal'; // Default fallback
}

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Return false instead of exiting the process
    return false;
  }
};

module.exports = connectDB;