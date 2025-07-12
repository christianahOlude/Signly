import express from 'express';
import { getUserScores } from "../controller/getUserScoresController.js";

const userRouter = express.Router();

userRouter.post('/score/:id', getUserScores);

export default userRouter;