const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server error';

  // wrong mongodb id errors
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Log every error that passes through the global handler
  console.error(`[ERROR ${err.statusCode}] ${req.method} ${req.originalUrl} — ${err.message}`);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
