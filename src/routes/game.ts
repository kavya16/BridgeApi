const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { io } = require('../server');

// POST /api/game/create
router.post('/create', async (req, res) => {
  try {
    const { gameId, playerId } = req.body;
    const game = new Game({
      gameId,
      players: [playerId],
      status: 'waiting',
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
    if (game.players.length >= 4) {
      return res.status(400).json({ status: 'error', message: 'Game is full' });
    }
    game.players.push(playerId);
    if (game.players.length === 4) {
      game.status = 'started';
    }
    await game.save();
    io.emit('playerJoined', { gameId, players: game.players });
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
    io.emit('gameStateUpdated', { gameId, gameState });
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
    io.emit('gameDeleted', { gameId });
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
