const logger = require('../config/logger');
const { AppError } = require('../utils/errors');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof AppError)) {
    if (err.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
    } else if (err.name === 'TokenExpiredError') {
      error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
    } else if (err.name === 'ValidationError' && err.details) {
      error = new AppError('Validation failed', 400, 'VALIDATION_ERROR');
      error.details = err.details;
    } else {
      error = new AppError('Internal server error', 500, 'INTERNAL_ERROR');
    }
  }

  if (config.env === 'development' && !error.isOperational) {
    logger.error(err);
  }

  const response = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };

  if (error.details) {
    response.error.details = error.details;
  }

  if (config.env === 'development' && !error.isOperational) {
    response.error.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
