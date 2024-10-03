const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

const securityMiddleware = [
  helmet(),
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
];

module.exports = securityMiddleware;
