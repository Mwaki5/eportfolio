const AppError = require("../utils/AppError");
const { logError } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error using centralized logger
  logError(message, req, err);

  // Send sanitized response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
