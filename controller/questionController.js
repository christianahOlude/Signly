import Question from "../models/Question.js";
import "../models/Option.js";

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question
            .find({isActive: true})
            .populate('options', ' text isCorrect')
            .populate('answer', 'text')
            .lean();
        res.json(questions);
    }catch(err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
}