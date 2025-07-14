import express from 'express';
import { createOptions, updateOption } from '../controller/optionsController.js';

const optionRouter = express.Router();

optionRouter.post('/batch', createOptions);

optionRouter.put('/:optionId', updateOption);

export default optionRouter;