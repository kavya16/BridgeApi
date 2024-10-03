const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config');
const securityMiddleware = require('./middlewares/security');
const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middlewares/errorHandler');
const socket = require('./sockets');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose
  .connect(config.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Initialize Socket.IO
socket.init(server);

// Middleware
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json());
app.use(securityMiddleware);

// API Routes
app.use('/api/game', gameRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handling Middleware
app.use(errorHandler);

// Start Server
server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

module.exports = { app, server };
