// Main server file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/api/users');
const sessionRoutes = require('./routes/api/sessions');
const productRoutes = require('./routes/api/products');
const cartRoutes = require('./routes/api/carts');
const orderRoutes = require('./routes/api/orders');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());
require('./config/passport.config');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

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