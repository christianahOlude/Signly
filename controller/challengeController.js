import Question from '../models/Question.js';
import User from '../models/User.js';
import { isSameDay, differenceInCalendarDays } from 'date-fns';

export const getDailyChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ error: 'User not found' });
        const now = new Date();

        let rawQuestion;
        if (user.lastChallengeAt && isSameDay(now, user.lastChallengeAt)) {
            rawQuestion = await Question.findById(user.lastQuestionId);
        } else {
            // Pick a new random question
            [rawQuestion] = await Question.aggregate([{ $sample: { size: 1 } }]);

            if ( user.lastChallengeAt && differenceInCalendarDays(now, user.lastChallengeAt) === 1 ) {
                user.streakCount += 1;
            } else {
                user.streakCount = 1;
            }

            user.lastChallengeAt = now;
            user.lastQuestionId = rawQuestion._id;
            await user.save();
        }

        const challengeQuestion = await Question
            .findById(rawQuestion._id)
            .populate('options', 'text isCorrect')
            .populate('answer', 'text');

        res.json({ question: challengeQuestion, streak: user.streakCount });
    } catch (err) {
        console.error('Error in getDailyChallenge:', err);
        res.status(500).json({ error: 'Failed to load daily challenge' });
    }
};

export const postDailyAnswer = async (req, res) => {
    try {
        const { questionId, selectedOptionId } = req.body;
        const question = await Question
            .findById(questionId)
            .populate('answer', 'text');

        if (!question) return res.status(404).json({ error: 'Question not found' });

        const isCorrect = question.answer._id.toString() === selectedOptionId;
        res.json({ correct: isCorrect });
    } catch (err) {
        console.error('Error in postDailyAnswer:', err);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
};
