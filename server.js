import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import router from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";
import gameRouter from "./routes/gameRoute.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', router);
app.use('/api/user', userRouter);
app.use('/api/games', gameRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));