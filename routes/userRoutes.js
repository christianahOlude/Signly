import express from 'express';
import {addScore} from "../controller/addScoreController.js";

const router = express.Router();

router.post('/score/:id',addScore);

export default router;