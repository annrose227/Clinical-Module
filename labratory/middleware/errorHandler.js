const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Database connection errors
  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      error: "Database connection failed",
      message: "Service temporarily unavailable",
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.details,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      message: "Authentication failed",
    });
  }

  // PostgreSQL unique constraint violations
  if (err.code === "23505") {
    return res.status(409).json({
      error: "Duplicate entry",
      message: "Resource already exists",
    });
  }

  // PostgreSQL foreign key constraint violations
  if (err.code === "23503") {
    return res.status(400).json({
      error: "Invalid reference",
      message: "Referenced resource does not exist",
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
