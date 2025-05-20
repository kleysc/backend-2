// Passport configuration with local and JWT strategies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// Local strategy for username/password login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    // If user doesn't exist
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    
    // Validate password
    const isValid = user.isValidPassword(password);
    if (!isValid) {
      return done(null, false, { message: 'Invalid password' });
    }
    
    // If credentials are valid
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// JWT strategy for token validation
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    // Find user by ID from JWT payload
    const user = await User.findById(jwt_payload.id);
    
    if (!user) {
      return done(null, false);
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport; 