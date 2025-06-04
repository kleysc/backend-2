const express = require('express');

class CustomRouter {
  constructor() {
    this.router = express.Router();
  }

  get(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
  }

  post(path, policies, ...callbacks) {
    this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
  }

  put(path, policies, ...callbacks) {
    this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
  }

  // Middleware para estandarizar respuestas
  generateCustomResponses(req, res, next) {
    res.sendSuccess = payload => res.json({ status: 'success', payload });
    res.sendError = error => res.status(400).json({ status: 'error', error });
    res.sendForbidden = error => res.status(403).json({ status: 'error', error });
    next();
  }

  // Middleware de políticas
  handlePolicies(policies) {
    return (req, res, next) => {
      if (policies.includes('PUBLIC')) return next();
      if (!req.user) return res.status(401).json({ status: 'error', error: 'Unauthorized' });
      if (!policies.includes(req.user.role)) return res.status(403).json({ status: 'error', error: 'Forbidden' });
      next();
    };
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CustomRouter; 