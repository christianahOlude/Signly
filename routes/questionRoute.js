import express from "express";
import { getQuestions } from "../controller/questionController.js";

const router = express.Router();

router.get('/question', getQuestions)

export default router;