import express from 'express';
import { createGame, submitAnswer, finishGame, getGameStats } from '../controller/gameController.js';

const gameRouter = express.Router();

gameRouter.post('/start/:userId', createGame);

gameRouter.post('/:gameId/questions/:questionId/answer', submitAnswer);

gameRouter.post('/:gameId/finish', finishGame);

gameRouter.get('/:gameId/stats', getGameStats);

export default gameRouter;