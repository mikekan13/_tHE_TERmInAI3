const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const app = express();

// Connect to Database (Optional)
try {
  connectDB().catch(err => {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Running without database functionality');
  });
} catch (error) {
  console.warn('Could not attempt MongoDB connection:', error.message);
  console.warn('Running without database functionality');
}

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('terminal3/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../terminal3', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));