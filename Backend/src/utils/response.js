const successResponse = (message, data = null) => ({
  success: true,
  message,
  data,
});

const errorResponse = (message) => ({
  success: false,
  message,
});

module.exports = { successResponse, errorResponse };
