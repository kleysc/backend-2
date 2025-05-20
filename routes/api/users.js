// Users CRUD routes
const express = require('express');
const passport = require('passport');
const User = require('../../models/User');
const Cart = require('../../models/Cart');
const router = express.Router();

// Create a new user (public route)
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create cart for user
    const cart = await Cart.create({});
    
    // Create new user
    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
      cart: cart._id,
      role: role || 'user'
    });
    
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Authentication middleware for protected routes
const authenticate = passport.authenticate('jwt', { session: false });

// Get all users (protected)
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user by ID (protected)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user (protected)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { first_name, last_name, age, role } = req.body;
    const updateData = { first_name, last_name, age };
    
    // Only allow role update if current user is admin
    if (role && req.user.role === 'admin') {
      updateData.role = role;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user (protected)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router; 