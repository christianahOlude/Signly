import express from 'express';
import { createQuestion } from '../controller/questionController.js';

const questionRouter = express.Router();

questionRouter.post('/', createQuestion);

export default questionRouter;