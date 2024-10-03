const { body, param } = require('express-validator');

const createGameValidation = [
  body('gameId').isString().notEmpty(),
  body('playerId').isString().notEmpty(),
  body('maxPlayers').isIn([4, 8]),
];

const joinGameValidation = [
  body('gameId').isString().notEmpty(),
  body('playerId').isString().notEmpty(),
];

const updateGameValidation = [
  body('gameId').isString().notEmpty(),
  body('playerId').isString().notEmpty(),
  body('cardPlayed').isObject().notEmpty(),
  body('cardPlayed.suit').isIn(['hearts', 'diamonds', 'clubs', 'spades']),
  body('cardPlayed.value').isString().notEmpty(),
];

const deleteGameValidation = [
  param('gameId').isString().notEmpty(),
];

module.exports = {
  createGameValidation,
  joinGameValidation,
  updateGameValidation,
  deleteGameValidation,
};
