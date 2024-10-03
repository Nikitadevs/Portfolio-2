// middlewares/errorHandler.js

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'An unexpected error occurred. Please try again later.',
  });
};

module.exports = errorHandler;
