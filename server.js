import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
dotenv.config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));