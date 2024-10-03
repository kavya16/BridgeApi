const SocketEvents = Object.freeze({
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    PLAYER_JOINED: 'playerJoined',
    GAME_STATE_UPDATED: 'gameStateUpdated',
    GAME_DELETED: 'gameDeleted',
    PLAYER_MOVE: 'playerMove',
    CHAT_MESSAGE: 'chatMessage',
    GAME_STARTED: 'gameStarted',
    GAME_ENDED: 'gameEnded',
    ERROR: 'error',
  });
  
  module.exports = SocketEvents;
  