import express from "express";
import question from "../models/Question.js";

const router = express.Router();

router.get('/question', question)

export default router;