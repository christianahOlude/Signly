import express from 'express';
import { createQuestion } from '../controller/questionController.js';

const questionRouter = express.Router();

// Create a new question with 4 options
questionRouter.post('/', createQuestion);

export default questionRouter;