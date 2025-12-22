const errorHandler = (err, req, res, next) => {
  // Default error structure
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Internal Server Error";
  let errors = undefined;

  // JWT errors - expired or invalid tokens
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    status = "fail";
    message = "Access token expired";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    status = "fail";
    message = "Invalid access token";
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    status = "fail";
    errors = err.errors.map((e) => e.message);
    message = "Validation error";
  }

  // Sequelize foreign key / constraint errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 409;
    status = "fail";
    message = "Database constraint violation";
  }

  // Unknown programming errors (optional: hide details in production)
  if (!err.isOperational && process.env.NODE_ENV === "production") {
    message = "Something went wrong!";
    statusCode = 500;
  }

  res.status(statusCode).json({
    status,
    message,
    errors,
    success: false,
  });
};

module.exports = errorHandler;
