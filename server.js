// Main server file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/api/users');
const sessionRoutes = require('./routes/api/sessions');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 