/**
 * Error handling middleware
 */

/**
 * Central error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    status = 409;
    message = "Duplicate Key Error";
    const field = Object.keys(err.keyPattern)[0];
    errors = [`${field} already exists`];
  }

  // Handle Mongoose cast errors
  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  // Handle JWT expiry
  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  }

  return res.status(status).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * Not found middleware
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Async handler wrapper for express route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
