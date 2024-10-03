const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
