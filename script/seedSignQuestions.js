import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import Option from '../models/Option.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seedSignQuestions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear previous data
        await Question.deleteMany({});
        await Option.deleteMany({});
        console.log('Existing questions and options cleared');

        // List of seed questions with video URL and answers
        const questions = [
            {
                word: 'Apple',
                videoUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1/signs/apple.mp4',
                options: ['Apple', 'Banana', 'Orange', 'Mango'],
                correctIndex: 0
            },
            {
                word: 'Dog',
                videoUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1/signs/dog.mp4',
                options: ['Cat', 'Dog', 'Cow', 'Horse'],
                correctIndex: 1
            },
            {
                word: 'Book',
                videoUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1/signs/book.mp4',
                options: ['Pen', 'Paper', 'Book', 'Notebook'],
                correctIndex: 2
            },
            {
                word: 'Drink',
                videoUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1/signs/drink.mp4',
                options: ['Eat', 'Drink', 'Sleep', 'Cook'],
                correctIndex: 1
            },
            {
                word: 'Hello',
                videoUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1/signs/hello.mp4',
                options: ['Goodbye', 'Hi', 'Yes', 'Hello'],
                correctIndex: 3
            },
        ];

        // Loop through and insert each question + options
        for (const q of questions) {
            const question = await Question.create({
                imageUrl: q.videoUrl,
                difficulty: 'easy',
                options: [],
                correctOption: null
            });

            const createdOptions = await Option.insertMany(
                q.options.map((text, index) => ({
                    questionId: question._id,
                    text,
                    isCorrect: index === q.correctIndex
                }))
            );

            question.options = createdOptions.map(o => o._id);
            question.correctOption = createdOptions[q.correctIndex]._id;
            await question.save();
        }

        console.log('✅ Sign questions seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};
