import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Question from '../models/Question.js';
import Option from '../models/Option.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const seedSignQuestions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        const questions = [
            {
                questionVideoUrl: 'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752344682/book_yayxdj.mp4',
                options: ['Apple', 'Banana', 'Book', 'Mango'],
                answer: 'Book'
            },
            {
                questionVideoUrl: 'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752414341/6864_zi4zu8.mp4',
                options: ['West', 'Dog', 'Cow', 'Horse'],
                answer: 'West'
            },
            {
                questionVideoUrl: 'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752413242/zip_jtd1kv.mp4',
                options: ['Pen', 'Paper', 'zip', 'Notebook'],
                answer: 'zip'
            },
            {
                questionVideoUrl: 'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752345680/drink_mbjkfy.mp4',
                options: ['Eat', 'Drink', 'Sleep', 'Cook'],
                answer: 'Drink'
            },
            {
                questionVideoUrl: 'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752414524/wet_i2qann.mp4',
                options: ['Goodbye', 'Hi', 'Yes', 'Wet'],
                answer: 'Wet'
            },
            {
                questionVideoUrl:'https://res.cloudinary.com/dgg6igpfy/video/upload/v1752413861/APPLE-406_sub7gn.mp4',
                options: ['Banana', 'Apple', 'Mango', 'Orange'],
                answer: 'Apple'
            }
        ];

        for (const q of questions) {
            const question = await Question.create({
                questionVideoUrl: q.questionVideoUrl,
                isActive: true
            });

            const optionDocs = await Option.create(
                q.options.map(text => ({
                    questionId: question._id,
                    text: text,
                    isCorrect: text === q.answer
                }))
            );

            const optionIds = optionDocs.map(opt => opt._id);
            const correctOption = optionDocs.find(opt => opt.text === q.answer);

            await Question.findByIdAndUpdate(question._id, {
                options: optionIds,
                answer: correctOption._id
            });
        }

        const questionCount = await Question.countDocuments();
        const optionCount = await Option.countDocuments();
        console.log(`Seeded ${questionCount} questions and ${optionCount} options successfully!`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB...');
    }
};

seedSignQuestions();