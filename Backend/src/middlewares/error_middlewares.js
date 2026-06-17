const { errorResponse } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json(errorResponse(err.message || 'Internal server error'));
};

module.exports = errorMiddleware;
