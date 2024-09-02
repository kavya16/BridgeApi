const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const socket = require('../socket');
const SocketEvents = require('../socketEvents');

// POST /api/game/create
router.post('/create', async (req, res) => {
  try {
    const { gameId, playerId, maxPlayers } = req.body;
    if (maxPlayers !== 4 && maxPlayers !== 8) {
      return res.status(400).json({ status: 'error', message: 'maxPlayers must be 4 or 8' });
    }
    const game = new Game({
      gameId,
      players: [playerId],
      status: 'waiting',
      maxPlayers,
      metadata: {}
    });
    await game.save();
    res.status(201).json({ status: 'success', gameId });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/game/join
router.post('/join', async (req, res) => {
  try {
    const { gameId, playerId } = req.body;
    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
    }
    if (game.players.length >= game.maxPlayers) {
      return res.status(400).json({ status: 'error', message: 'Game is full' });
    }
    game.players.push(playerId);
    if (game.players.length === game.maxPlayers) {
      game.status = 'started';
    }
    console.log("game.players", game.players);
    await game.save();
    socket.getIo().emit(SocketEvents.PLAYER_JOINED, { gameId, players: game.players });
    res.json({ status: 'success', gameState: game });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/game/check
router.get('/check/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
    }
    res.json({ status: 'success', gameState: game });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/game/update
router.post('/update', async (req, res) => {
  try {
    const { gameId, gameState } = req.body;
    const game = await Game.findOneAndUpdate({ gameId }, { gameState }, { new: true });
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
    }
    socket.getIo().emit(SocketEvents.GAME_STATE_UPDATED, { gameId, gameState });
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/game/delete
router.delete('/delete', async (req, res) => {
  try {
    const { gameId } = req.body;
    const game = await Game.findOneAndDelete({ gameId });
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Game not found' });
    }
    socket.getIo().emit(SocketEvents.GAME_DELETED, { gameId });
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
