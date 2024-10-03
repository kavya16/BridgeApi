const gameService = require('../services/gameService');
const SocketEvents = require('../sockets/socketEvents');
const socket = require('../sockets');

exports.createGame = async (req, res, next) => {
  try {
    const { gameId, playerId, maxPlayers } = req.body;
    const game = await gameService.createGame({ gameId, playerId, maxPlayers });
    res.status(201).json({ status: 'success', gameId: game.gameId });
  } catch (error) {
    next(error);
  }
};

exports.joinGame = async (req, res, next) => {
  try {
    const { gameId, playerId } = req.body;
    const game = await gameService.joinGame({ gameId, playerId });
    // Emit real-time update
    socket.getIo().emit(SocketEvents.PLAYER_JOINED, {
      gameId: game.gameId,
      players: game.players
    });
    res.json({ status: 'success', gameState: game });
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { gameId, playerId, cardPlayed } = req.body;
    const game = await gameService.updateGame({ gameId, playerId, cardPlayed });

    // Emit real-time update to all players in the game
    socket.getIo().to(gameId).emit(SocketEvents.GAME_STATE_UPDATED, {
      gameId: game.gameId,
      gameState: game.gameState,
    });

    res.json({ status: 'success', gameState: game.gameState });
  } catch (error) {
    next(error);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    await gameService.deleteGame(gameId);

    // Emit real-time notification that the game has been deleted
    socket.getIo().to(gameId).emit(SocketEvents.GAME_DELETED, { gameId });

    res.json({ status: 'success', message: 'Game deleted successfully' });
  } catch (error) {
    next(error);
  }
};

