const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json(errorResponse('No token provided'));

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json(errorResponse('Invalid or expired token'));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json(errorResponse('Forbidden'));
  next();
};

module.exports = { authenticate, authorize };
