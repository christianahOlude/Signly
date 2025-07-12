import express from 'express';
import { getUserScores } from "../controller/getUserScoresController.js";

const userRouter = express.Router();

userRouter.get('/score/:Id', getUserScores);

export default userRouter;