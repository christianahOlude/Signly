import express from 'express';
import {addScore} from "../controller/addScoreController.js";
import {deleteUser} from "../controller/deleteUserController.js";

const router = express.Router();

router.post('/score/:id',addScore);

router.delete('/:userId/', deleteUser)
export default router;