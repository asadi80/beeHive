const errorHandler = (err, req, res, next) => {
  // Set the error status code
  const statusCode = err.status >= 100 && err.status < 600 ? err.status : 500;
  res.status(statusCode);

  // Optionally log the error for server-side debugging
  console.error(err); // Consider using a logging library for production

  // Send a consistent error response
  res.json({
      status: 'error',
      statusCode: statusCode,
      message: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
