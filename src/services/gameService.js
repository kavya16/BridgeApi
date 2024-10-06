const Game = require('../models/Game');
const logger = require('../utils/logger');

class GameService {
  async getGameState(gameId) {
    const game = await Game.findOne({ gameId });
    return game;
  }
  
  async createGame({ gameId, playerId, maxPlayers }) {
    const game = new Game({
      gameId,
      players: [playerId],
      status: 'waiting',
      maxPlayers,
      metadata: {}
    });
    await game.save();
    logger.info(`Game created: ${gameId} by player ${playerId}`);
    return game;
  }

  async joinGame({ gameId, playerId }) {
    const game = await Game.findOne({ gameId });
    if (!game) {
      const error = new Error('Game not found');
      error.status = 404;
      throw error;
    }
    if (game.players.length >= game.maxPlayers) {
      const error = new Error('Game is full');
      error.status = 400;
      throw error;
    }
    game.players.push(playerId);
    if (game.players.length === game.maxPlayers) {
      game.status = 'started';
    }
    await game.save();
    logger.info(`Player ${playerId} joined game ${gameId}`);
    return game;
  }

  async updateGame({ gameId, playerId, cardPlayed }) {
    const game = await Game.findOne({ gameId });
    if (!game) {
      const error = new Error('Game not found');
      error.status = 404;
      throw error;
    }

    if (game.status !== 'started') {
      const error = new Error('Game has not started yet');
      error.status = 400;
      throw error;
    }

    // Update the game state with the played card
    if (!game.gameState.moves) {
      game.gameState.moves = [];
    }

    game.gameState.moves.push({ playerId, card: cardPlayed, timestamp: new Date() });

    // Additional game logic can be implemented here (e.g., checking for game completion)

    await game.save();
    logger.info(`Player ${playerId} played a card in game ${gameId}`);

    return game;
  }

  async deleteGame(gameId) {
    const result = await Game.deleteOne({ gameId });
    if (result.deletedCount === 0) {
      const error = new Error('Game not found or already deleted');
      error.status = 404;
      throw error;
    }
    logger.info(`Game ${gameId} deleted`);
    return { message: 'Game deleted successfully' };
  }

}

module.exports = new GameService();
