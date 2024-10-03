const socketIo = require('socket.io');
const SocketEvents = require('./socketEvents');
const logger = require('../utils/logger');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on(SocketEvents.CONNECT, (socket) => {
      logger.info(`New client connected: ${socket.id}`);

      /**
       * Join a specific game room
       * The client should emit 'joinGame' with the gameId they want to join
       */
      socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        logger.info(`Socket ${socket.id} joined game room: ${gameId}`);
      });

      /**
       * Handle client disconnection
       */
      socket.on(SocketEvents.DISCONNECT, () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });

      // Additional event listeners can be added here
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
