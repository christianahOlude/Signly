import Question  from "../models/Question.js";

export const getQuestions= async (req, response) => {
    const { questionId } = req.params;
    try {
        const questions = await Question.find(questionId);
        response.json(questions);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};
