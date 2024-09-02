const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  players: [String],
  status: { type: String, enum: ['waiting', 'started', 'completed'], default: 'waiting' },
  gameState: mongoose.Schema.Types.Mixed,
  metadata: mongoose.Schema.Types.Mixed,
  maxPlayers: { type: Number, required: true, enum: [4, 8] }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
