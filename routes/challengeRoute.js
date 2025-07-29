import express from 'express';
import { getDailyChallenge, postDailyAnswer } from '../controller/challengeController.js';

const challengeRouter = express.Router();

challengeRouter.route('/daily-challenge/:userId')
    .get(getDailyChallenge)
    .post(postDailyAnswer);

export default challengeRouter;
