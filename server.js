import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import router from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";
import gameRouter from "./routes/gameRoute.js";
import questionRoute from "./routes/questionRoute.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', router);
app.use('/api/user', userRouter);
app.use('/api/games', gameRouter);
app.use('/api/questions', questionRoute)

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));