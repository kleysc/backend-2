const passport = require('passport');

// Local authentication middleware
const localAuth = passport.authenticate('login', { session: false });

// JWT authentication middleware
const jwtAuth = passport.authenticate('jwt', { session: false });

// Middleware para inyectar req.user si hay JWT (no falla si no hay token)
const injectUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', error: 'Not authenticated' });
  }
  const userRole = req.user.role;
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ status: 'error', error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { localAuth, jwtAuth, authorizeRoles, injectUser }; 