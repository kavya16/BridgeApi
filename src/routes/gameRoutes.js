const express = require('express');
const { body } = require('express-validator');
const gameController = require('../controllers/gameController');
const validateRequest = require('../middlewares/validation');

const router = express.Router();

/**
 * @route POST /api/game/create
 * @desc Create a new game session
 * @access Public
 */
router.post(
  '/create',
  [
    body('gameId').isString().notEmpty(),
    body('playerId').isString().notEmpty(),
    body('maxPlayers').isIn([4, 8])
  ],
  validateRequest,
  gameController.createGame
);

/**
 * @route POST /api/game/join
 * @desc Join an existing game session
 * @access Public
 */
router.post(
  '/join',
  [
    body('gameId').isString().notEmpty(),
    body('playerId').isString().notEmpty()
  ],
  validateRequest,
  gameController.joinGame
);

/**
 * @route POST /api/game/update
 * @desc Update the game state when a player plays a card
 * @access Public
 */
router.post(
  '/update',
  updateGameValidation,
  validateRequest,
  gameController.updateGame
);

/**
 * @route DELETE /api/game/:gameId
 * @desc Delete a game session
 * @access Public
 */
router.delete(
  '/:gameId',
  deleteGameValidation,
  validateRequest,
  gameController.deleteGame
);

module.exports = router;
