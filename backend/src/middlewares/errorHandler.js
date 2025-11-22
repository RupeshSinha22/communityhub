// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Custom API errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({ 
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Default server error
  res.status(500).json({ 
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message })
  });
};

export default errorHandler;
