import express from 'express';
import { createGame, submitAnswer, finishGame, getGameStats } from '../controller/gameController.js';

const gameRouter = express.Router();

// Create a new game for a user
gameRouter.post('/start/:userId', createGame);

// Submit an answer for a question in a game
gameRouter.post('/:gameId/questions/:questionId/answer', submitAnswer);

// Finish a game
gameRouter.post('/:gameId/finish', finishGame);

// Get game statistics
gameRouter.get('/:gameId/stats', getGameStats);

export default gameRouter;